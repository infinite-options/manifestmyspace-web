
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
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RoutingBasedOnSelectedRole from "../MaintenanceRoutingUtiltity";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";

export default function QuotesAccepted({maintenanceItem, navigateParams, quotes}){
    // console.log("--debug-- maintenanceItem", maintenanceItem)
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    const [maintenanceItemQuotes, setMaintenanceItemQuotes] = useState([])
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMaintenanceItemQuotes(quotes);
        // console.log("--debug-- maintenanceItemQuotes", maintenanceItemQuotes, quotes)
    }, [quotes]);

    async function handleScheduleStatusChange(){
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            const formData = new FormData();
            formData.append("maintenance_request_uid", maintenanceItem.maintenance_request_uid);
            formData.append("maintenance_request_status", "SCHEDULED");
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    body: formData
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        const changeMaintenanceQuoteStatus = async () => {
            setShowSpinner(true);
            const formData = new FormData();
            let quote = quotes.find(quote => quote.quote_status === "ACCEPTED") // see number 16 in "Testing Maintenance Flow" ticket
            console.log("changeMaintenanceQuoteStatus maintenanceItemQuotes", maintenanceItemQuotes)
            console.log(quote)
            formData.append("maintenance_quote_uid", quote.maintenance_quote_uid); // 900-xxx
            formData.append("quote_maintenance_request_id", maintenanceItem?.maintenance_request_uid) //quote_maintenance_request_id maintenance_request_uid
            formData.append("quote_status", "SCHEDULED")
            
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
                    method: 'PUT',
                    body: formData
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    changeMaintenanceRequestStatus()
                    navigate(maintenanceRoutingBasedOnSelectedRole(), {state: {refresh: true}})
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        changeMaintenanceQuoteStatus()
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
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
                <TenantProfileLink maintenanceItem={maintenanceItem}/>
                <OwnerProfileLink maintenanceItem={maintenanceItem}/>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#DEA19C",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Contact Maintenance - Kim Deal
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
               
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",

                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#97A7CF",
                            textTransform: "none",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%"
                        }}
                        onClick={() => handleScheduleStatusChange()}
                    >
                        <CalendarMonthIcon sx={{color: "#FFFFFF"}}/>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                            Ready for Scheduling
                        </Typography>
                    </Button>
                </Grid>
                <CancelButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
                <CompleteButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
            </Grid>
        </Box>
    )
}