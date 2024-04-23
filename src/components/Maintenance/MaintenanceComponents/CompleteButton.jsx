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
    const { maintenanceRoutingBasedOnSelectedRole, getProfileId, roleName, selectedRole} = useUser();
    let navigate = useNavigate();

    let maintenanceItem = props.maintenanceItem;
    let setShowMessage = props.setShowMessage;
    let setMessage = props.setMessage;

    // console.log(JSON.parse(maintenanceItem.quote_info))
    // console.log("CancelButton maintenanceItem", maintenanceItem)

    async function handleComplete(id, quotes){
        // console.log("handleComplete id", id)
        // var filteredQuoteArray = [];

        console.log("handleComplete quotes", quotes)
        let role = roleName()
        console.log("role name", role)

        if (role === "PM Employee" || role === "Manager"){
            // handle PM side
            console.log(maintenanceItem)
            let rankedQuote;

            if (quotes){
                console.log(quotes)
                JSON.parse(quotes).find((quote) => {
                    if (quote.quote_status === maintenanceItem.quote_status_ranked){
                        rankedQuote = quote
                        console.log(rankedQuote)
                    }
                })
            }
    
            if (maintenanceItem.maintenance_assigned_business === getProfileId()){
                // it's handled by the property manager
                CompleteTicket(id)
            } else if (maintenanceItem.maintenance_assigned_business !== getProfileId()){
                if (maintenanceItem.maintenance_assigned_business === null){
                    // PUT to assign maintenance request to PM
                    console.log("assign maintenance request to PM")
                }
                // it's handled by maintenance
                // Update maintenance request
                // Update the quote status
                let res = CompleteTicket(id)
                if (res){
                    FinishQuote(rankedQuote.maintenance_quote_uid)
                }
            }
        } else if (role === "Maintenance" || role === "Maintenance Employee"){
            // handle maintenance side
            FinishQuote(maintenanceItem.maintenance_quote_uid)
        } else {
            console.log("not supported role is trying to complete a ticket")
        }

        // Maintenance person
        // PM
            // 1. there are quotes in an array
            // 2. the PM is handling it

        // assign maintenance_assigned_business to the maintenance item depending on who is completing it.

        // if (quotes && !isMaintenancePerson){
        //     let quoteArray = JSON.parse(quotes)
        //     // console.log("handleComplete quoteArray", quoteArray)
        //     filteredQuoteArray = quoteArray.filter((quote) => quote.quote_status == "ACCEPTED" || quote.quote_status == "SCHEDULED")
        //     console.log(filteredQuoteArray)
        // } else if (isMaintenancePerson){
        //     console.log("isMaintenancePerson")
        // }

        // if (filteredQuoteArray.length === 0){
        //     // it's handled by the property manager
        //     console.log("handled by the property manager")
        // } else{
        //     console.log("not handled by the property manager")
        //     console.log("handled by maintenance", maintenanceItem.maintenance_quote_uid)
        //     //FinishQuote(maintenanceItem.maintenance_quote_uid)
        // }

        // let response = CompleteTicket(id)
        
        // if (response){
        //     console.log("Ticket Completed")
        //     setShowMessage(true);
        //     setMessage("Ticket Completed!! Maintenance Status changed to COMPLETED");
        //     //navigate(maintenanceRoutingBasedOnSelectedRole())
        // } else{
        //     console.log("Ticket Not Completed")
        //     setShowMessage(true);
        //     alert("Error: Ticket Not Completed")
        // }
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
                onClick={() => handleComplete(maintenanceItem.maintenance_request_uid, maintenanceItem.quote_info)}
            >
                <CheckIcon sx={{color: "#3D5CAC"}}/>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                    {selectedRole === "MAINTENANCE" || selectedRole === "MAINT_EMPLOYEE" ? "Mark Finished" : "Complete Ticket"}
                </Typography>
            </Button>
        </Grid>
    )

}