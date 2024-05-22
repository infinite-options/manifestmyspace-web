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
import ChatIcon from '@mui/icons-material/Chat';
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";
import DateTimePickerModal from "../../DateTimePicker";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import handleScheduleStatusChange from "./QuotesAccepted";
import APIConfig from "../../../utils/APIConfig";


export default function QuotesRequestAction({maintenanceItem, navigateParams, quotes}){
    
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showMessage, setShowMessage] = useState(false);
    const [maintenanceItemQuotes, setMaintenanceItemQuotes] = useState([])
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(maintenanceItem?.earliest_available_date || "")
    const [time, setTime] = useState(maintenanceItem?.earliest_available_time || "")
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        setMaintenanceItemQuotes(quotes);
        // console.log("--debug-- maintenanceItemQuotes", maintenanceItemQuotes, quotes)
    }, [quotes]);

    async function handleScheduleStatusChange(id, date, time){
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            const formData = new FormData();
            formData.append("maintenance_request_uid", id);
            formData.append("maintenance_request_status", "SCHEDULED");
            formData.append("maintenance_scheduled_date", date); 
            formData.append("maintenance_scheduled_time", time);
            formData.append("maintenance_assigned_business", maintenanceItem.maint_business_uid)
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
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

            console.log(maintenanceItemQuotes.length !== 0, quotes.length !== 0)
            setShowSpinner(true);
            const formData = new FormData();
            let quote = quotes.find(quote => quote.quote_status === "ACCEPTED") // see number 16 in "Testing Maintenance Flow" ticket
            if (quote) {
                console.log("changeMaintenanceQuoteStatus maintenanceItemQuotes", maintenanceItemQuotes)
                console.log(quote)
                formData.append("maintenance_quote_uid", quote.maintenance_quote_uid); // 900-xxx
                formData.append("quote_maintenance_request_id", id) //quote_maintenance_request_id maintenance_request_uid
                formData.append("quote_status", "SCHEDULED")
                
                try {
                    const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
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
            }
            else {
                changeMaintenanceRequestStatus()
                navigate(maintenanceRoutingBasedOnSelectedRole(), {state: {refresh: true}})   
            }
            setShowSpinner(false);
        }
        await changeMaintenanceQuoteStatus()
        // navigate(maintenanceRoutingBasedOnSelectedRole())
    }

    function handleNavigateToQuotesAccept(){

        console.log("NewRequestAction", maintenanceItem)
        console.log(navigateParams)
        navigate("/quoteAccept", {
            state:{
                maintenanceItem,
                navigateParams,
                quotes
            }
        });
    }

    function handleNavigateToQuotesRequested(){
        navigate("/quoteRequest", {
            state:{
                maintenanceItem,
                navigateParams,
                quotes
            }
        });
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
            <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
                <TenantProfileLink maintenanceItem={maintenanceItem}/>
                <OwnerProfileLink maintenanceItem={maintenanceItem}/>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        
                        sx={{
                            backgroundColor: "#C06A6A",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleNavigateToQuotesRequested()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Request Additional Quotes
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
                        
                        sx={{
                            backgroundColor: "#CB8E8E",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleNavigateToQuotesAccept()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            View Quotes and Accept
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
                        
                        sx={{
                            backgroundColor: "#97A7CF",
                            textTransform: "none",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%"
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <CalendarMonthIcon sx={{color: "#FFFFFF", paddingRight: "5px"}}/>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                            Schedule Maintenance
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <CancelButton maintenanceItem={maintenanceItem} quotes={quotes} setShowMessage={setShowMessage} setMessage={setMessage}/>
                <CompleteButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
            </Grid>
            <DateTimePickerModal
                setOpenModal={setShowModal}
                open={showModal}
                maintenanceItem={maintenanceItem}
                date={date}
                time={time}
                handleSubmit={handleScheduleStatusChange}
            />
        </Box>
    )
}