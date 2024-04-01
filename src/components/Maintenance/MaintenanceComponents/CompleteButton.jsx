import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';
import CompleteTicket from "../../utils/CompleteTicket";
import FinishQuote from "../../utils/FinishQuote";
import { useUser } from "../../../contexts/UserContext"
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";

export default function CompleteButton(props){
    const { maintenanceRoutingBasedOnSelectedRole, selectedRole} = useUser();
    let navigate = useNavigate();

    let maintenanceItem = props.maintenanceItem;
    let setShowMessage = props.setShowMessage;
    let setMessage = props.setMessage;

    // console.log("CancelButton maintenanceItem", maintenanceItem)

    async function handleComplete(id, quotes){
        // console.log("handleComplete id", id)

        if (maintenanceItem.maintenance_quote_uid === null){
            // it's handled by the property manager
            console.log("handled by the property manager")
        } else{
            FinishQuote(maintenanceItem.maintenance_quote_uid)
        }

        let response = CompleteTicket(id)
        // console.log("handleComplete", response);
        if (response){
            console.log("Ticket Completed")
            setShowMessage(true);
            setMessage("Ticket Completed!! Maintenance Status changed to COMPLETED");
            navigate(maintenanceRoutingBasedOnSelectedRole())
        } else{
            console.log("Ticket Not Completed")
            setShowMessage(true);
            alert("Error: Ticket Not Completed")
        }
    }

    return (
        <Grid item xs={6} sx={{
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Button
                variant="contained"
                
                sx={{
                    backgroundColor: "#FFFFFF",
                    textTransform: "none",
                    borderRadius: "10px",
                    display: 'flex',
                    width: "100%"
                }}
                onClick={() => handleComplete(maintenanceItem.maintenance_request_uid, maintenanceItem.maintenance_quote_uid)}
            >
                <CheckIcon sx={{color: "#3D5CAC"}}/>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                    {selectedRole === "MAINTENANCE" || selectedRole === "MAINT_EMPLOYEE" ? "Mark Finished" : "Complete Ticket"}
                </Typography>
            </Button>
        </Grid>
    )

}