import { Loader } from "@react-google-maps/api";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
  
      const existingScript = document.getElementById('google-maps-api');
      if (existingScript) {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }
  
      const script = document.createElement('script');
      script.id = 'google-maps-api';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };
  

// export const getLatLongFromAddress = async (address) => {
//   try {
//     await loadGoogleMapsApi();
//     const geocoder = new window.google.maps.Geocoder();
//     const results = await geocoder.geocode({ address });

//     if (results.status === "OK") {
//       const location = results.results[0].geometry.location;
//       return { latitude: location.lat(), longitude: location.lng() };
//     } else {
//       throw new Error(`Geocode was not successful for the following reason: ${results.status}`);
//     }
//   } catch (error) {
//     console.error("Error fetching geocoding data: ", error);
//     return null;
//   }
// };


export const getLatLongFromAddress = async (address) => {
    try {
      await loadGoogleMapsApi();
      const geocoder = new window.google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (!results || !status) {
            reject('No results or status returned from geocoding request.');
            return;
          }
          if (status === 'OK') {
            const location = results[0].geometry.location;
            resolve({ latitude: location.lat(), longitude: location.lng() });
          } else {
            reject(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching geocoding data: ", error);
      return null;
    }
  };