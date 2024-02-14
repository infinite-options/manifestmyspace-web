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
// import RequestMoreInfo from "../Maintainance01/Worker/RequestMoreInfo";
import RequestMoreInfo from "../Worker/RequestMoreInfo";
import AlertMessage from "../AlertMessage";
import Scheduler from "../../utils/Scheduler";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";

export default function NewRequestAction({maintenanceItem, navigateParams}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showScheduler, setShowScheduler] = useState(false);
    const [schedulerDate, setSchedulerDate] = useState();
    const [showRequestMoreInfo, setShowRequestMoreInfo] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    console.log("maintenanceItem NewRequestAction", maintenanceItem)

    function handleNavigateToQuotesRequested(){
        navigate("/quoteRequest", {
            state:{
                maintenanceItem,
                navigateParams
            }
        });
    }

    function handleCancel(id){
        let response = CancelTicket(id);
        console.log("handleCancel", response)
        if (response){
            console.log("Ticket Cancelled")
            setShowMessage(true);
            setMessage("Ticket Cancelled!! Maintenance Status changed to CANCELLED");
            navigate(maintenanceRoutingBasedOnSelectedRole())
        } else{
            console.log("Ticket Not Cancelled")
            setShowMessage(true);
            setMessage("Error: Ticket Not Cancelled")
        }
    }

    async function handleComplete(id){
        CompleteTicket(id).then(response => {
            console.log("handleComplete", response);
            if (response){
                console.log("Ticket Completed")
                setShowMessage(true);
                setMessage("Ticket Completed!! Maintenance Status changed to COMPLETED");
                navigate(maintenanceRoutingBasedOnSelectedRole())
            } else{
                console.log("Ticket Not Completed")
                alert("Error: Ticket Not Completed")
            }
        }).catch(error => {
            console.log("handleComplete", error);
        });
    }

    async function handleSubmit(){
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "maintenance_request_uid": maintenanceItem.maintenance_request_uid,
                        "maintenance_request_status": "SCHEDULED",
                        "maintenance_scheduled_date": schedulerDate.format("YYYY-MM-DD"),
                        "maintenance_scheduled_time": schedulerDate.format("HH:mm:ss")
                    })
                });
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        await changeMaintenanceRequestStatus();
        setShowScheduler(false);
        navigate(maintenanceRoutingBasedOnSelectedRole())
    }

    return(
        <Box 
            sx={{
                display: "flex" ,
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
            <Scheduler 
                show={showScheduler} 
                setShow={setShowScheduler} 
                date={schedulerDate} 
                setDate={setSchedulerDate}
                handleSubmit={handleSubmit}
            />
            <Grid container direction="row" columnSpacing={4} rowSpacing={6} >
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
                        backgroundColor: "#D6D5DA",
                        textTransform: "none",
                        borderRadius: "10px",
                        width: "100%",
                    }} 
                    onClick={() => setShowRequestMoreInfo(true)}
                >
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        Request More Info
                    </Typography>
                </Button>
                <RequestMoreInfo showRequestMoreInfo={showRequestMoreInfo} setShowRequestMoreInfo={setShowRequestMoreInfo} maintenanceItem={maintenanceItem}/>
                        
                </Grid>
           
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#9EAED6",
                            // backgroundColor:"transparent",
                            // borderColor : "red",
                            // border:"1px",
                            textTransform: "none",
                            // paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                            // '&:hover': {
                            //     backgroundColor: darken("#9EAED6", 0.2)
                            // }
                        }}
                        onClick={() => setShowScheduler(true)}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Schedule Repair
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "lightseagreen"
                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#C06A6A",
                            // backgroundColor: "transparent",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                            // '&:hover': {
                            //     backgroundColor: darken("#C06A6A", 0.2)
                            // }
                        }}
                        onClick={() => handleNavigateToQuotesRequested()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Request Quotes
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor : "lightred"
                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#FFFFFF",
                            // backgroundColor: 'transparent',
                            textTransform: "none",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleCancel(maintenanceItem.maintenance_request_uid)}
                    >   
                        <CloseIcon sx={{color: "#3D5CAC"}}/>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                            Cancel Ticket
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "lightgreen"

                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#FFFFFF",
                            // backgroundColor: "transparent",
                            textTransform: "none",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%"
                        }}
                        onClick={() => handleComplete(maintenanceItem.maintenance_request_uid)}
                    >
                        <CheckIcon sx={{color: "#3D5CAC"}}/>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                            Complete Ticket
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
            <AlertMessage showMessage={showMessage} setShowMessage={setShowMessage} message={message} />
        </Box>
    )
}