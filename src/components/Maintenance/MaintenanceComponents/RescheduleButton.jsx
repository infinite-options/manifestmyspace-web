import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import theme from '../../../theme/theme';

export default function RescheduleButton({maintenanceItem}){

    async function handleReSchedule(id){
        console.log("reschedule not implemented yet")
        alert("RESCHEDULE NOT IMPLEMENTED YET")
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
                onClick={() => handleReSchedule(maintenanceItem.maintenance_request_uid)}
            >   
                    <CalendarToday sx={{
                    color: "#3D5CAC",
                    paddingRight: "10%"
                }}/>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                    Reschedule
                </Typography>
            </Button>
        </Grid>
    )
}