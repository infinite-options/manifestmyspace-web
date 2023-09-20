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


export default function CompleteMaintenance({maintenanceItem, navigateParams}){
    const navigate = useNavigate();


    function handleNavigate(){
        console.log("navigate to pay Maintenance")

        navigate("/payMaintenance", {
            state:{
                maintenanceItem,
                navigateParams
            }
        })
    }

    async function handleCancel(id){
        let response = CancelTicket(id);
        console.log("handleCancel", response)
        if (response){
            console.log("Ticket Cancelled")
            alert("Ticket Cancelled")
            navigate('/maintenance')
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
            navigate('/maintenance')
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
            <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
                <Grid item xs={1} sx={{
                        alignItems: "center",
                        justifyContent: "left",
                        paddingLeft: "0px",
                    }}>
                    <Button sx={{
                        maxWidth: "10px",
                        paddingRight: "0px",
                        paddingLeft: "0px",
                        }}
                        onClick={() => console.log("Chat Button")}
                    >
                        <ChatIcon sx={{
                            color: "#3D5CAC"
                        }}/>
                    </Button>
                </Grid>
                <Grid item xs={5} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Tenant - Kim Gordon
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Owner - Steve Albini
                        </Typography>
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
                            backgroundColor: "#3D5CAC",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleNavigate()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Pay Maintenance - Kim Deal
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#FFFFFF",
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

                }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#FFFFFF",
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
        </Box>
    )
}