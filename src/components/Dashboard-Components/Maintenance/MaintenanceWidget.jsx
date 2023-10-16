import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import Status from "../../Templates/Status";
import { get } from "../../utils/api";

import theme from "../../../theme/theme";
import { useUser } from "../../../contexts/UserContext";

export default function MaintenanceWidget({selectedRole}){
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const colorStatus = selectColorStatus()

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
    useEffect(() => {
        const dataObject = {};
        const fetchData = async () => {
            console.log("in useEffect")
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/ownerDashboard/${getProfileId()}`)
            const jsonData = await response.json()
            console.log(jsonData.MaintenanceStatus.result)
            for (const item of jsonData.MaintenanceStatus.result) {
                if (item.maintenance_request_status === null) {
                    continue
                }
                if (!dataObject[item.maintenance_request_status]){
                    console.log("item.maintenance_request_status", item.maintenance_request_status)
                    dataObject[item.maintenance_request_status] = item.num;
                }
            }
            console.log("dataObject from server", dataObject)

            // console.log(dataObject)
            setMaintenanceRequests(prevData => ({ ...prevData, ...dataObject }))
        }
        fetchData();
    }, []);

    function routingWithSelectedRole(){
        console.log("routingWithSelectedRole selectedRole", selectedRole)
        if (selectedRole == "MANAGER"){
            return "/managerMaintenance"
        } else if (selectedRole == "OWNER"){
            return "/ownerMaintenance"
        }
    }

    function selectColorStatus(){
        console.log("selectColorStatus selectedRole", selectedRole)
        if (selectedRole == "MANAGER"){
            return theme.colorStatusPMO
        } else if (selectedRole == "OWNER"){ 
            return theme.colorStatusO
        }
    }

    return(
        <div className="mt-widget-requests-container" onClick={() => navigate(routingWithSelectedRole(), { state: { colorStatus, maintenanceRequests } })}>  
            <h2 className="mt-widget-title">Maintenance</h2>
            <Status colorStatus={colorStatus} maintenanceRequests={maintenanceRequests}/>
        </div>
    )
}

