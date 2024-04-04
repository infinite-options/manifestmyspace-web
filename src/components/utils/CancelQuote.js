import APIConfig from "../../utils/APIConfig";

export default async function CancelQuote(maintenance_quote_uid, setShowSpinner = () => {}){
    setShowSpinner(true);
    try {
        var formData = new FormData();
        formData.append("maintenance_quote_uid", maintenance_quote_uid);
        formData.append("quote_status", "CANCELLED");
        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
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