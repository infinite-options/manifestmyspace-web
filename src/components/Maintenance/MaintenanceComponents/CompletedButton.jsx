import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';
import CompleteTicket from "../../utils/CompleteTicket";
import { useUser } from "../../../contexts/UserContext"
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";

export default function CompleteButton(props){
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    let navigate = useNavigate();

    let maintenanceItem = props.maintenanceItem;
    let setShowMessage = props.setShowMessage;
    let setMessage = props.setMessage;

    async function handleComplete(id){
        console.log("[DEBUG] handleComplete", id)
        CompleteTicket(id).then(response => {
            console.log("handleComplete", response);
            if (response){
                console.log("Ticket Completed")
                setShowMessage(true);
                setMessage("Ticket Completed!! Maintenance Status changed to COMPLETED");
                navigate(maintenanceRoutingBasedOnSelectedRole())
            } else{
                console.log("Ticket Not Completed")
                alert("Error: Ticket Not Completed")
            }
        }).catch(error => {
            console.log("handleComplete", error);
        });
    }

    return (
        <Grid item xs={6} sx={{
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "lightgreen"

        }}>
            <Button
                variant="contained"
                disableElevation
                sx={{
                    backgroundColor: "#FFFFFF",
                    // backgroundColor: "transparent",
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
    )

}