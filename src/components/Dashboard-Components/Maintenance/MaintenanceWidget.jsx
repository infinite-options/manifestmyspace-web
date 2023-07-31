import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import Status from "../../Templates/Status";
import { get } from "../../utils/api";

export default function MaintenanceWidget(){
    const navigate = useNavigate();

    const [maintenanceData, setMaintenanceData] = useState({});
    const colors = ['#B62C2A', '#D4736D', '#DEA19C', '#92A9CB', '#6788B3','#173C8D'];
    const status = ['New Requests', 'Quotes Requested', 'Quotes Accepted', 'Scheduled', 'Completed', 'Paid'];

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component

    useEffect(() => {
        const fetchData = async () => {
            let dataObject = {};
            const data = await get(`/maintenanceRequests`)  
            for (const item of data.result) {
                if (!dataObject[item.request_status]){
                    dataObject[item.request_status] = [];
                }
                dataObject[item.request_status].push(item);
            }
            console.log(dataObject)            
            setMaintenanceData(prevData => ({ ...prevData, ...dataObject }))
        }
        // console.log("Maintenance data", maintenanceData)
        fetchData();
    }, []);


    return(
        <div className="mt-widget-requests-container">  
            <h2 className="mt-widget-title" onClick={() => navigate('/maintenance',{state: { maintenanceData }})}>Maintenance</h2>
            <Status colors={colors} status={status} data={maintenanceData}/>
        </div>
    )
}

