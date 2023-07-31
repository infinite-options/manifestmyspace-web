import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import Status from "../../Templates/Status";
import { get } from "../../utils/api";

export default function MaintenanceWidget(){
    const navigate = useNavigate();

    const [maintenanceData, setMaintenanceData] = useState({});
    const colorStatus = [
        {'color': '#B62C2A', 'status': 'New Requests', 'mapping': 'NEW'},
        {'color': '#D4736D', 'status': 'Quotes Requested', 'mapping': 'PROCESSING'},
        {'color': '#DEA19C', 'status': 'Quotes Accepted', 'mapping': 'CANCELLED'},
        {'color': '#92A9CB', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
        {'color': '#6788B3', 'status': 'Completed', 'mapping': 'COMPLETED'},
        {'color': '#173C8D', 'status': 'Paid', 'mapping': 'INFO'}
    ]

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
    useEffect(() => {
        const fetchData = async () => {
            let dataObject = {};
            console.log("in useEffect")
            const data = await get(`/maintenanceRequests`)  
            for (const item of data.result) {
                if (!dataObject[item.request_status]){
                    dataObject[item.request_status] = [];
                }
                dataObject[item.request_status].push(item);
            }
            console.log("dataObject from server", dataObject)
            setMaintenanceData(prevData => ({ ...prevData, ...dataObject }))
        }
        fetchData();
    }, []);


    return(
        <div className="mt-widget-requests-container">  
            <h2 className="mt-widget-title" onClick={() => navigate('/maintenance', {state: { maintenanceData, colorStatus }})}>Maintenance</h2>
            <Status colorStatus={colorStatus} maintenanceData={maintenanceData}/>
        </div>
    )
}

