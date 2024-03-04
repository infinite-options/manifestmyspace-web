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
import { AttachMoney } from "@mui/icons-material";
import theme from '../../../theme/theme';
import { useLocation, useNavigate } from "react-router-dom";


export default function CreateOrEditInvoiceButton({maintenanceItem}){

    let location = useLocation();
    let navigate = useNavigate();

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
                maintenanceItem: maintenanceItem,
                edit: true
            }
        });
    }

    return (
        <>
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
                        onClick={() => handleNavigateToEditInvoice()}
                    >   
                    <AttachMoney sx={{color: "#3D5CAC"}}/>
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                            Edit Invoice
                        </Typography>
                    </Button>
                </Grid> 
            )}
        </>
    )
}