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


export default function CompleteMaintenance01({maintenanceItem}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();

    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimateLaborTime, setEstimateLaborTime] = useState(0);

    console.log("CompleteMaintenance01", maintenanceItem)

    function handleNavigate(){
        console.log("navigate to pay Maintenance")

        navigate("/payMaintenance", {
            state:{
                maintenanceItem

            }
        })
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

    function handleMarkPaid(id){
        console.log("Mark Paid Not Implemented", id)
        alert("Mark Paid Not Implemented")
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

    const handleNavigateToInvoice = () => {
        navigate("/businessInvoiceForm", {
            state:{
                maintenanceItem
            }
        });
    }

    const handleNavigateToEditInvoice = () => {
        navigate("/businessInvoiceForm", {
            state:{
                maintenanceItem
            }
        });
    }

    function computeTotalCost(estimate){
        let costObject = JSON.parse(estimate)
        console.log(costObject)
        let laborTotal = 0;
        let partsTotal = 0;
        let laborTime = 0;
        try {
            for (const item in costObject?.labor){
                console.log(item)
                laborTotal += parseInt(costObject?.labor[item].charge)
                laborTime += parseInt(costObject?.labor[item].hours)
            }
    
            for (const item in costObject.parts){
                console.log(item)
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
        computeTotalCost(maintenanceItem.quote_services_expenses)
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
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
                        }}>
                        <QuoteDetailInfo maintenanceItem={maintenanceItem}/>                    
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
                            {maintenanceItem?.quote_notes}
                        </Typography>
                       </Box>
                </Grid>
                {maintenanceItem.bill_uid !== null ? (
                    <Grid item xs={12} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                            Payment Requested On:
                        </Typography>
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                            No Invoice
                        </Typography>
                    </Grid>
                )}
                
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
                        onClick={() => handleMarkPaid(maintenanceItem.maintenance_request_uid)}
                    >   
                        <CheckIcon sx={{color: "#3D5CAC"}}/>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                           Mark Paid
                        </Typography>
                    </Button>
                </Grid>
                {maintenanceItem.bill_uid === null ? (
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
                            onClick={() => handleNavigateToInvoice()}
                        >   
                            <AttachMoney sx={{color: "#3D5CAC"}}/>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                                Create Invoice
                            </Typography>
                        </Button>
                    </Grid> 
                ) : (
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
                            onClick={() => console.log("Edit Invoice")}
                        >   
                           <AttachMoney sx={{color: "#3D5CAC"}}/>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                                Edit Invoice
                            </Typography>
                        </Button>
                    </Grid> 
                )}
            </Grid>
        </Box>
    )
}