import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Status from "../../Templates/Status";
import theme from "../../../theme/theme";
import { Box, Button, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function MaintenanceWidget({selectedRole, maintenanceData}){
    const navigate = useNavigate();
    const [maintenanceRequestCounts, setMaintenanceRequestCounts] = useState({});
    const colorStatus = selectColorStatus()

    // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
    useEffect(() => {
        const dataObject = {};
        // console.log("maintenanceData", maintenanceData)
        for (const item of maintenanceData){
            // console.log(item)
            if (!dataObject[item.maintenance_status]){
                dataObject[item.maintenance_status] = item.num;
            }
        }

        setMaintenanceRequestCounts(prevData => ({ ...prevData, ...dataObject }))
    }, [maintenanceData]);

    function routingWithSelectedRole(){
        // console.log("routingWithSelectedRole selectedRole", selectedRole)
        if (selectedRole == "MANAGER"){
            return "/managerMaintenance"
        } else if (selectedRole == "OWNER"){
            return "/ownerMaintenance"
        }
    }

    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        const month = ""
        const year = ""
        const propertyId = ""
        navigate('/addMaintenanceItem', {state: {month, year, propertyId}})
    }

    function selectColorStatus(){
        // console.log("selectColorStatus selectedRole", selectedRole)
        if (selectedRole == "MANAGER"){
            return theme.colorStatusPMO
        } else if (selectedRole == "OWNER"){ 
            return theme.colorStatusO
        }
    }

    return(
        <div className="mt-widget-requests-container">  
            <Grid container alignItems="center">
                <Grid item xs={2} onClick={() => navigate(routingWithSelectedRole(), { state: { colorStatus, maintenanceRequestCounts } })}>
                </Grid>
                <Grid item xs={8} onClick={() => navigate(routingWithSelectedRole(), { state: { colorStatus, maintenanceRequestCounts } })}>
                    <h2 className="mt-widget-title">Maintenance</h2>
                </Grid>
                <Grid item xs={2} alignItems="center">
                    <AddIcon onClick={() => navigateToAddMaintenanceItem()} sx={{color: theme.typography.common.blue, fontSize: "25px", margin: "0px", padding: "0px"}}/>
                </Grid>
                <Grid item xs={12} onClick={() => navigate(routingWithSelectedRole(), { state: { colorStatus, maintenanceRequestCounts } })}>
                    <Status colorStatus={colorStatus} maintenanceRequestCounts={maintenanceRequestCounts} selectedRole={selectedRole}/>
                </Grid>
            </Grid>
        </div>
    )
}

