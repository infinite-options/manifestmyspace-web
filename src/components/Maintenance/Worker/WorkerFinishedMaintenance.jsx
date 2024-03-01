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
import { AttachMoney } from "@mui/icons-material";
import { set } from "date-fns";
import QuoteDetailInfo from "./QuoteDetailInfo";
import RoutingBasedOnSelectedRole from "../MaintenanceRoutingUtiltity";
import { useUser } from "../../../contexts/UserContext";
import ManagerProfileLink from "../MaintenanceComponents/ManagerProfileLink";
import WorkerQuoteView from "../MaintenanceComponents/WorkerQuoteView";
import CreateOrEditInvoiceButton from "../MaintenanceComponents/CreateOrEditInvoiceButton";
import MarkPaidButton from "../MaintenanceComponents/MarkPaidButton";
import WorkerInvoiceView from "../MaintenanceComponents/WorkerInvoiceView";

export default function WorkerFinishedMaintenance({maintenanceItem}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();

    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimateLaborTime, setEstimateLaborTime] = useState(0);

    console.log("maintenanceItem in Finished Maintenance", maintenanceItem)

    function computeTotalCost(estimate){
        let costObject = JSON.parse(estimate)
        // console.log(costObject)
        let laborTotal = 0;
        let partsTotal = 0;
        let laborTime = 0;
        try {
            for (const item in costObject?.labor){
                laborTotal += parseInt(costObject?.labor[item].charge)
                laborTime += parseInt(costObject?.labor[item].hours)
            }
            
            for (const item in costObject?.parts){
                partsTotal += parseInt(costObject.parts[item].cost) * parseInt(costObject.parts[item].quantity)
            }
            
            setEstimatedLaborCost(laborTotal)
            setEstimatedPartsCost(partsTotal)
            setEstimateLaborTime(laborTime)
        } catch (error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        computeTotalCost(maintenanceItem?.quote_services_expenses)
    },[maintenanceItem])

    function displayDueDate(dateStr){
        const dateObj = new Date(dateStr);
        dateObj.setDate(dateObj.getDate() + 5);
        const newDateStr = dateObj.toISOString().slice(0, 19).replace("T", " ");

        return newDateStr;
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
            {/* We need to display the invoice here */}
            <WorkerQuoteView maintenanceItem={maintenanceItem}/>
            <WorkerInvoiceView maintenanceItem={maintenanceItem}/>
            <Grid container direction="row" columnSpacing={6} rowSpacing={6} sx={{paddingTop: "15px"}}>
                <MarkPaidButton maintenanceItem={maintenanceItem}/>
                <CreateOrEditInvoiceButton maintenanceItem={maintenanceItem}/>
            </Grid>
        </Box>
    )
}