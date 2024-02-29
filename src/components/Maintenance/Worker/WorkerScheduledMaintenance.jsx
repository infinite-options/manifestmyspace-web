import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import CancelTicket from "../../utils/CancelTicket";
import CompleteTicket from "../../utils/CompleteTicket";
import CalendarToday from "@mui/icons-material/CalendarToday";
import QuoteDetailInfo from "./QuoteDetailInfo";
import RoutingBasedOnSelectedRole from "../MaintenanceRoutingUtiltity";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import ManagerProfileLink from "../MaintenanceComponents/ManagerProfileLink";
import WorkerQuoteView from "../MaintenanceComponents/WorkerQuoteView";
import RescheduleButton from "../MaintenanceComponents/RescheduleButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";

export default function WorkerScheduledMaintenance({maintenanceItem}){
    
    const location = useLocation();
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);

    function handleNavigate(){
        console.log("navigate to Rescheduling Maintenance")
        navigate("/scheduleMaintenance", {
            state:{
                maintenanceItem
            }
        })
    }

    async function handleReSchedule(id){
        console.log("reschedule not implemented yet")
        alert("RESCHEDULE NOT IMPLEMENTED YET")

    }

    async function handleComplete(id){


        const changeMaintenanceQuoteStatus = async () => {
            setShowSpinner(true);
            var formData = new FormData();

            formData.append("maintenance_quote_uid", maintenanceItem.maintenance_quote_uid);
            formData.append("quote_status", "FINISHED");

            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
                    method: 'PUT',
                    body: formData,
                });            
                let responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    let response = CompleteTicket(id, setShowSpinner);
                    console.log("handleComplete", response);
                    if (response){
                        console.log("Ticket Completed")
                        alert("Ticket Completed")
                        navigate(maintenanceRoutingBasedOnSelectedRole())
                    } else{
                        console.log("Ticket Not Completed")
                        alert("Error: Ticket Not Completed")
                    }
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }

        changeMaintenanceQuoteStatus();
    }


    return(
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <WorkerQuoteView maintenanceItem={maintenanceItem}/>
            <Grid container direction="row" columnSpacing={6} rowSpacing={6} sx={{paddingTop: "15px"}}>
                <RescheduleButton maintenanceItem={maintenanceItem}/>
                <CompleteButton maintenanceItem={maintenanceItem}/>
            </Grid>
        </Box>
    )
}