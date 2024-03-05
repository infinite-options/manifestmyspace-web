export default async function FinishQuote(maintenance_quote_uid, setShowSpinner = () => {}){
    setShowSpinner(true);
    try {
        var formData = new FormData();
        formData.append("maintenance_quote_uid", maintenance_quote_uid);
        formData.append("quote_status", "FINISHED");
        const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
            method: 'PUT',
            body: formData
        });

        if (response.code === 200) {
            return true;
        }
    } catch (error){
        console.log("error", error)
        return false;
    }
    setShowSpinner(false);
}