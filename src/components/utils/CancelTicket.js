import APIConfig from "../../utils/APIConfig";

export default async function CancelTicket(maintenance_request_uid, setShowSpinner = () => {}){
    setShowSpinner(true);
    try {
        var formData = new FormData();
        formData.append("maintenance_request_uid", maintenance_request_uid);
        formData.append("maintenance_request_status", "CANCELLED");
        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
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