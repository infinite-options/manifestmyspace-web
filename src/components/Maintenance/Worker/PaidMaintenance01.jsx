
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
import routingBasedOnSelectedRole from "../MaintenanceRoutingUtiltity";
import { useUser } from "../../../contexts/UserContext";


export default function PaidMaintenance01({maintenanceItem}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();


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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
              <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
                <Grid item xs={1} sx={{
                        alignItems: "center",
                        justifyContent: "left",
                        paddingLeft: "0px",
                    }}>
                    <Button sx={{
                        maxWidth: "10px",
                        paddingRight: "20px",
                        paddingLeft: "0px",
                        }}
                        onClick={() => console.log("Chat Button")}
                    >
                        <ChatIcon sx={{
                            color: "#3D5CAC"
                        }}/>
                    </Button>
                </Grid>
                
                <Grid item xs={11} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: "40px",
                    }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "10px",
                            borderRadius: "10px",
                            paddingLeft: "30px",
                            display: 'flex',
                            width: "100%",
                        }}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Manager - {maintenanceItem?.business_name}
                        </Typography>
                    </Button>
                </Grid>
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