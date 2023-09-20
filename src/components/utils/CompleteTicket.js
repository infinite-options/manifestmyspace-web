export default async function CompleteTicket(maintenance_request_uid){
    try {
        const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "maintenance_request_uid": maintenance_request_uid,
                "maintenance_request_status": "COMPLETED"
            })
        });
        if (response.code === 200) {
            return true;
        }
    } catch (error){
        console.log("error", error)
        return false;
    }
}