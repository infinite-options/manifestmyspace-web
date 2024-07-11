
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
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";
import DateTimePickerModal from "../../DateTimePicker";
import { useMediaQuery } from '@mui/material';
import AlertMessage from '../AlertMessage';
import APIConfig from "../../../utils/APIConfig";


export default function QuotesAccepted({maintenanceItem, navigateParams, quotes}){
    // console.log("--debug-- maintenanceItem", maintenanceItem)
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    const [maintenanceItemQuotes, setMaintenanceItemQuotes] = useState([])
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    if (!isMobile && sessionStorage.getItem('quoteAcceptView') === 'true') {
		maintenanceItem = JSON.parse(sessionStorage.getItem('maintenanceItem'));
		quotes = JSON.parse(sessionStorage.getItem('quoteAcceptView'));
	} 
    let maintenanceQuoteInfo = JSON.parse(maintenanceItem.quote_info).find((quote) => quote.quote_status === maintenanceItem.quote_status_ranked)
    console.log(maintenanceQuoteInfo)
    const [date, setDate] = useState(maintenanceQuoteInfo.quote_earliest_available_date || "")
    const [time, setTime] = useState(maintenanceQuoteInfo.quote_earliest_available_time || "")

    const [showModal, setShowModal] = useState(false);

    let business_name = maintenanceItem?.maint_business_name || "Business Name Not Available";
    
	
    

    async function handleScheduleStatusChange(id, date, time){
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            const formData = new FormData();
            formData.append("maintenance_request_uid", id);
            formData.append("maintenance_request_status", "SCHEDULED");
            formData.append("maintenance_scheduled_date", date); 
            formData.append("maintenance_scheduled_time", time);
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
            setShowSpinner(true);
            const formData = new FormData();
            let quote = quotes.find(quote => quote.quote_status === "ACCEPTED") // see number 16 in "Testing Maintenance Flow" ticket
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
            setShowSpinner(false);
        }
        await changeMaintenanceQuoteStatus()
        // navigate(maintenanceRoutingBasedOnSelectedRole())
    }

    useEffect(() => {
        setMaintenanceItemQuotes(quotes);
        // console.log("--debug-- maintenanceItemQuotes", maintenanceItemQuotes, quotes)
    }, [quotes]);

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
            <Card
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: 'none',
                    elevation: '0',
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px',
                }}
            >
                <Grid container justifyContent="space-between" sx={{ marginTop: theme.spacing(2), padding: theme.spacing(0) }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#FFC614',
                                color: '#160449',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                width: '160px',
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '10px',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
                                whiteSpace: 'normal',
                                '&:hover': {
                                    backgroundColor: '#FFC614',
                                },
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            Schedule
                        </Button>
                    </Grid> <Grid item>
                        <CompleteButton maintenanceItem={maintenanceItem} quotes={quotes} setShowMessage={setShowMessage} setMessage={setMessage} />
                    </Grid>
                </Grid>
            </Card>
            <AlertMessage showMessage={showMessage} setShowMessage={setShowMessage} message={message} />
            
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