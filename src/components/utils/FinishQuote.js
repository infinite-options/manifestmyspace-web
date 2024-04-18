import APIConfig from "../../utils/APIConfig";

export default async function FinishQuote(maintenance_quote_uid, setShowSpinner = () => {}){
    setShowSpinner(true);
    try {
        var formData = new FormData();
        console.log("FinishQuote maintenance_quote_uid", maintenance_quote_uid)
        formData.append("maintenance_quote_uid", maintenance_quote_uid);
        formData.append("quote_status", "FINISHED");
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