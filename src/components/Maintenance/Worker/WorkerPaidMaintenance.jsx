
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
import QuoteDetailInfo from "./QuoteDetailInfo";
import { useUser } from "../../../contexts/UserContext";
import ManagerProfileLink from "../MaintenanceComponents/ManagerProfileLink";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import WorkerQuoteView from "./../MaintenanceComponents/WorkerQuoteView";


export default function WorkerPaidMaintenance({maintenanceItem}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);


    function handleNavigateToQuotesRequested(){

        console.log("NewRequestAction", maintenanceItem)
        navigate("/quoterequest", {
            state:{
                maintenanceItem
            }
        });
    }

    function handleCancel(id){
        console.log("handleCancel", id)
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
        CompleteTicket(id).then(response => {
            console.log("handleComplete", response);
            if (response.ok){
                console.log("Ticket Completed")
                alert("Ticket Completed")
                navigate(maintenanceRoutingBasedOnSelectedRole())
            } else{
                console.log("Ticket Not Completed")
                alert("Error: Ticket Not Completed")
            }
        }).catch(error => {
            console.log("handleComplete", error);
        });
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
            <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
            
            <ManagerProfileLink maintenanceItem={maintenanceItem}/>
            <Grid item xs={12} sx={{
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box
                    variant="contained"
                    disableElevation
                    sx={{
                        flexDirection: "column",
                        backgroundColor: "#D6D5DA",
                        textTransform: "none",
                        paddingRight: "10px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "10px",
                        paddingLeft: "10px",
                        display: 'flex',
                        width: "95%",
                    }}
                >
                    {maintenanceItem?.quote_services_expenses !== undefined ? (
                        <QuoteDetailInfo maintenanceItem={maintenanceItem}/>                  
                    ) : null }

                </Box>
            </Grid>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        Notes
                    </Typography>
                    <Box
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "10px",
                            borderRadius: "10px",
                            paddingLeft: "10px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            display: 'flex',
                            width: "95%",
                        }}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            {maintenanceItem?.quote_notes ? maintenanceItem.quote_notes  : ""} 
                        </Typography>
                        </Box>
                </Grid>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        Payment Details
                    </Typography>
                    <Box
                        variant="contained"
                        disableElevation
                        sx={{
                            flexDirection: "column",
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "10px",
                            borderRadius: "10px",
                            paddingLeft: "10px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            display: 'flex',
                            width: "95%",
                        }}
                    >
                        {maintenanceItem?.purchase_status === "UNPAID"  || maintenanceItem?.purchase_status === null ? (
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Payment Requested
                            </Typography>                            
                        ): (
                            <>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Paid On: {maintenanceItem?.payment_date ? maintenanceItem?.payment_date : "Not Provided"}
                                </Typography>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Method: {maintenanceItem?.payment_type ? maintenanceItem?.payment_type : "Not Provided"}
                                </Typography>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Amount: {maintenanceItem?.pay_amount ? maintenanceItem?.pay_amount : "Not Provided"}
                                </Typography>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Payment Notes: {maintenanceItem?.payment_notes ? maintenanceItem?.payment_notes : "Not Provided"}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        Notes from Manager
                    </Typography>
                    <Box
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "10px",
                            borderRadius: "10px",
                            paddingLeft: "10px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            display: 'flex',
                            width: "95%",
                        }}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            {maintenanceItem?.quote_notes ? maintenanceItem?.quote_notes : "No Quote Notes"}
                        </Typography>
                        </Box>
                </Grid>
            </Grid>
        </Box>
    )
}