import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import theme from "../../../theme/theme";
import { useUser } from "../../../contexts/UserContext";
import Status from "../../Templates/Status";


export default function MaintenanceWorkerDashboardWidget(){
    const navigate = useNavigate();

    const { user, getProfileId } = useUser();
    const colorStatus = theme.colorStatusMM

    const [currentActivities, setCurrentActivities] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState({});

    const maintenanceBusinessID = user?.businesses.MAINTENANCE.business_uid

    useEffect(() => {
        const dataObject = {};
        const fetchMaintenanceDashboardData = async () => {
            console.log("in useEffect")
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceDashboard/${getProfileId()}`)
            const jsonData = await response.json()
            console.log("CurrentActivities", jsonData.CurrentActivities.result)
            console.log("WorkOrders", jsonData.WorkOrders.result)
            setWorkOrders(jsonData.WorkOrders.result)
            setCurrentActivities(jsonData.CurrentActivities.result)
        }

        const getMaintenanceData = async () => {
            const maintenanceRequests1 = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceStatus/${getProfileId()}`)
            const maintenanceRequestsData1 = await maintenanceRequests1.json()
            console.log("maintenanceRequestsData1", maintenanceRequestsData1)
            
            let array1 = maintenanceRequestsData1.result.REQUESTED.maintenance_items;
            let array2 = maintenanceRequestsData1.result.SUBMITTED.maintenance_items;
            let array3 = maintenanceRequestsData1.result.ACCEPTED.maintenance_items;
            let array4 = maintenanceRequestsData1.result.SCHEDULED.maintenance_items;
            let array5 = maintenanceRequestsData1.result.FINISHED.maintenance_items;
            let array6 = maintenanceRequestsData1.result.PAID.maintenance_items;
           

            dataObject["REQUESTED"] = [];
            dataObject["SUBMITTED"] = [];
            dataObject["ACCEPTED"] = [];
            dataObject["SCHEDULED"] = [];
            dataObject["FINISHED"] = [];
            dataObject["PAID"] = [];

            for (const item of array1) {
                dataObject["REQUESTED"].push(item);
            }
            for (const item of array2) {
                dataObject["SUBMITTED"].push(item);
            }
            for (const item of array3) {
                dataObject["ACCEPTED"].push(item);
            }
            for (const item of array4) {
                dataObject["SCHEDULED"].push(item);
            }
            for (const item of array5) {
                dataObject["FINISHED"].push(item);
            }
            for (const item of array6) {
                dataObject["PAID"].push(item);
            }
            
            console.log("dataObject from new api call", dataObject)
            setMaintenanceRequests(prevData => ({
                ...prevData, 
                ...dataObject
            }));
            // setDisplayMaintenanceData(prevData => ({
            //     ...prevData,
            //     ...dataObject
            // }));
        }
        getMaintenanceData();

        fetchMaintenanceDashboardData();
    }, []);


    return(
        <div className="mt-widget-requests-container" onClick={() => navigate("/workerMaintenance", { state: { colorStatus, maintenanceRequests } })}>  
            <h2 className="mt-widget-title">Maintenance</h2>
            {/* <Status colorStatus={colorStatus} maintenanceRequests={maintenanceRequests}/> */}
            <div id="mt-all-requests">
            <ul className="mt-widget-requests">
                {colorStatus.map((item, index) => 
                    <li key={index} style={{ backgroundColor: item.color, color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '12px', fontWeight:600 }}>
                        {item.status} <span style={{float: "right"}}>{maintenanceRequests[item.mapping]?.length ?? null}</span>
                    </li>
                )}
            </ul>
        </div>
        </div>
    )

}