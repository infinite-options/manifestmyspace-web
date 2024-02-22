
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
import CompleteButton from "../MaintenanceComponents/CompletedButton";
import CancelTicket from "../../utils/CancelTicket";
import CompleteTicket from "../../utils/CompleteTicket";
import RoutingBasedOnSelectedRole from "../MaintenanceRoutingUtiltity";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";


export default function CompletedM({maintenanceItem}){
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    
    let business_name = maintenanceItem?.business_name || "Business Name Not Available";


    function handleNavigateToQuotesRequested(){

        console.log("NewRequestAction", maintenanceItem)
        navigate("/quoterequest", {
            state:{
                maintenanceItem
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
                        disableElevation
                        sx={{
                            backgroundColor: "#3D5CAC",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Contact Maintenance - {business_name}
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}