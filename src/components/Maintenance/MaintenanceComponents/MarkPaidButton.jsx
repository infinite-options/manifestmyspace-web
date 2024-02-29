
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
import CheckIcon from '@mui/icons-material/Check';
import theme from '../../../theme/theme';

export default function MarkPaidButton({maintenanceItem}){
    function handleMarkPaid(id){
        console.log("Mark Paid Not Implemented", id)
        alert("Mark Paid Not Implemented")
    }

    return (
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
    )
}