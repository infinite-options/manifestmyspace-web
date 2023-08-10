import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import Status from "../../Templates/Status";
import { get } from "../../utils/api";

export default function MaintenanceWidget(){
    const navigate = useNavigate();

    const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const colorStatus = [
        {'color': '#B62C2A', 'status': 'New Requests', 'mapping': 'NEW'},
        {'color': '#D4736D', 'status': 'Quotes Requested', 'mapping': 'PROCESSING'},
        {'color': '#DEA19C', 'status': 'Quotes Accepted', 'mapping': 'CANCELLED'},
        {'color': '#92A9CB', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
        {'color': '#6788B3', 'status': 'Completed', 'mapping': 'COMPLETED'},
        {'color': '#173C8D', 'status': 'Paid', 'mapping': 'PAID'}
    ]

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
    useEffect(() => {
        const fetchData = async () => {
            // console.log("in useEffect")
            const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/ownerDashboardMaintenanceByStatus/110-000003")
            const jsonData = await response.json()
            // console.log(jsonData)
            // for (const item of jsonData.MaintenanceStatus) {
            //     if (!dataObject[item.maintenance_request_status]){
            //         dataObject[item.maintenance_request_status] = item.num;
            //     }
            // }
            // console.log("dataObject from server", dataObject)
            setMaintenanceRequests(prevData => ({ ...prevData, ...jsonData }))
        }
        fetchData();
    }, []);


    return(
        <div className="mt-widget-requests-container">  
            <h2 className="mt-widget-title" onClick={() => navigate('/maintenance', {state: { colorStatus, maintenanceRequests }})}>Maintenance</h2>
            <Status colorStatus={colorStatus} maintenanceRequests={maintenanceRequests}/>
        </div>
    )
}

