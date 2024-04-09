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
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";


export default function CompleteMaintenance({maintenanceItem, navigateParams, quotes}){
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    console.log("COMPLETE MAINTENANCE QUOTES", quotes)

    let finishedQuote = quotes.find(quote => quote.quote_status === "FINISHED" || quote.quote_status === "COMPLETED")

    function handleNavigate(){
        console.log("navigate to pay Maintenance")

        navigate("/payMaintenance", {
            state:{
                maintenanceItem,
                navigateParams
            }
        })
    }

    function handleNavigateToQuotesAccept(){
        navigate("/quoteAccept", {
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
                {quotes.length > 0 ? (
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
                                View Quotes
                            </Typography>
                            <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                        </Button>
                    </Grid>
                ) : null}
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        
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
                            {finishedQuote && maintenanceItem.maintenance_status !== "CANCELLED" ? "Pay Maintenance - " + finishedQuote?.maint_business_name  : "Charge Owner - " + maintenanceItem?.owner_first_name + " " + maintenanceItem?.owner_last_name}
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}