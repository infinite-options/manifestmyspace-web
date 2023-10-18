import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import Status from "../../Templates/Status";
import { get } from "../../utils/api";

import theme from "../../../theme/theme";
import { useUser } from "../../../contexts/UserContext";

export default function MaintenanceWidget({selectedRole, maintenanceData}){
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const colorStatus = selectColorStatus()

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
    useEffect(() => {
        const dataObject = {};
        console.log("maintenanceData", maintenanceData)
        for (const item of maintenanceData){
            console.log(item)
            if (!dataObject[item.maintenance_status]){
                dataObject[item.maintenance_status] = item.num;
            }
        }

        setMaintenanceRequests(prevData => ({ ...prevData, ...dataObject }))
    }, [maintenanceData]);

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
            <Status colorStatus={colorStatus} maintenanceRequests={maintenanceRequests} selectedRole={selectedRole}/>
        </div>
    )
}

