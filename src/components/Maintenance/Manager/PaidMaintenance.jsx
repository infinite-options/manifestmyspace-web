
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
import CancelTicket from "../../utils/CancelTicket";
import CompleteTicket from "../../utils/CompleteTicket";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";


export default function PaidMaintenance({maintenanceItem}){
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    
    let business_name = maintenanceItem?.maint_business_name || "Business Name Not Available";


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
            <Grid container justifyContent="space-between" sx={{ marginTop: theme.spacing(2), padding: theme.spacing(2) }}>
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        
                        sx={{
                            backgroundColor: '#a7b8e6',
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
                                backgroundColor: '#a7b8e6',
                            },
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