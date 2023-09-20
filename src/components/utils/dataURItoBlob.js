export default function dataURItoBlob(dataURI) {
    // Split the input to get the mime type and the data itself
    const [typeInfo, base64] = dataURI.split(",");
    
    // Decode the base64 string
    const byteString = atob(base64);
    
    // Create a Uint8Array to hold the binary data
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([intArray], { type: typeInfo });
    
    return blob;
}