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
    responsiveFontSizes,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CancelTicket from "../../utils/CancelTicket";
import CompleteTicket from "../../utils/CompleteTicket";
import QuoteDetailInfo from "./QuoteDetailInfo";
import { useUser } from "../../../contexts/UserContext";
import ManagerProfileLink from "../MaintenanceComponents/ManagerProfileLink";
import WorkerQuoteView from "../MaintenanceComponents/WorkerQuoteView";

export default function WorkerQuotesSubmittedAction({maintenanceItem}){
    
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();

    function handleNavigateToQuotesRequested(){

        console.log("NewRequestAction", maintenanceItem)
        navigate("/quoteAccept", {
            state:{
                maintenanceItem
            }
        });
    }

    async function handleCancel(id){
        let response = CancelTicket(id);
        console.log("handleCancel", response)
        if (response){
            console.log("Ticket Cancelled")
            alert("Ticket Cancelled")
            navigate(maintenanceRoutingBasedOnSelectedRole())
        } else{
            console.log("Ticket Not Cancelled")
            alert("Error: Ticket Not Cancelled")
        }
    }

    async function handleComplete(id){
        let response = CompleteTicket(id);
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

    return(
        <Box 
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <WorkerQuoteView maintenanceItem={maintenanceItem}/>
        </Box>
    )
}