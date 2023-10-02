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
import CancelTicket from "../../utils/CancelTicket";
import CompleteTicket from "../../utils/CompleteTicket";


export default function QuotesSubmittedAction01({maintenanceItem}){
    
    const navigate = useNavigate();

    const [estimatedCost, setEstimatedCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("");
    const [earliestAvailability, setEarliestAvailability] = useState("");

    useEffect(() => {
        const parseServicesExpenses = (expenses) => {
            let servicesObject = JSON.parse(expenses)
            var partsCost = 0
            for (const item in servicesObject?.parts){
                partsCost += parseInt(servicesObject.parts[item].cost)
            }
            setEstimatedLaborCost(servicesObject.total_estimate)
            setEstimatedPartsCost(partsCost)
            setEstimatedCost(servicesObject.total_estimate + partsCost)
        }
        
        parseServicesExpenses(maintenanceItem.quote_services_expenses)
        setEstimatedTime(maintenanceItem.quote_event_type)
        setEarliestAvailability(maintenanceItem.quote_earliest_availability)

    }, [maintenanceItem])

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
                            Manager -  Steve Albini
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
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                        Estimated Total: ${estimatedCost}
                        </Typography>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        Estimated Labor Cost: ${estimatedLaborCost}
                        </Typography>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        Estimated Parts Cost: ${estimatedPartsCost}
                        </Typography>

                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        Estimated Time: {estimatedTime}
                        </Typography>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        Earliest Availability: {earliestAvailability}
                        </Typography>   
                                           
                    </Box>
                    
                </Grid>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>Notes</Typography>
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
                        {maintenanceItem.quote_notes}
                        </Typography>
                       </Box>
                </Grid>
            </Grid>
        </Box>
    )
}