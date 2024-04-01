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
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";


export default function QuotesRequestAction({maintenanceItem, navigateParams, quotes}){
    
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    function handleNavigateToQuotesAccept(){

        console.log("NewRequestAction", maintenanceItem)
        console.log(navigateParams)
        navigate("/quoteAccept", {
            state:{
                maintenanceItem,
                navigateParams,
                quotes
            }
        });
    }

    function handleNavigateToQuotesRequested(){
        navigate("/quoteRequest", {
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
                <Grid item xs={12} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        
                        sx={{
                            backgroundColor: "#C06A6A",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleNavigateToQuotesRequested()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Request Additional Quotes
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
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
                            View Quotes and Accept
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <CancelButton maintenanceItem={maintenanceItem} quotes={quotes} setShowMessage={setShowMessage} setMessage={setMessage}/>
                <CompleteButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
            </Grid>
        </Box>
    )
}