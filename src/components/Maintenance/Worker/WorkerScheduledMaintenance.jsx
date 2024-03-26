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
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

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
                <CompleteButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
            </Grid>
        </Box>
    )
}