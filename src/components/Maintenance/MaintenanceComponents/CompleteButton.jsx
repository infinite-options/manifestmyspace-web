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
import APIConfig from "../../../utils/APIConfig";
import DateTimePickerModal from "../../DateTimePicker";
import { useState } from "react";
import CancelTicket from "../../utils/CancelTicket";
import CancelQuote from "../../utils/CancelQuote";

export default function CompleteButton(props){
    const { maintenanceRoutingBasedOnSelectedRole, getProfileId, roleName, selectedRole} = useUser();
    let navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [cancelTicket, setcancelTicket] = useState(false);
    let maintenanceItem = props.maintenanceItem;
    let setShowMessage = props.setShowMessage;
    let setMessage = props.setMessage;
    let quotes = props.quotes;

    // console.log(JSON.parse(maintenanceItem.quote_info))
    // console.log("CancelButton maintenanceItem", maintenanceItem)

    async function handleComplete(id, quotes, date, time){
        // console.log("handleComplete id", id)
        // var filteredQuoteArray = [];

        console.log("handleComplete quotes", quotes)
        let role = roleName()
        console.log("role name", role)

        if (role === "PM Employee" || role === "Manager"){
            // handle PM side
            console.log("PM side", maintenanceItem)
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
                CompleteTicket(id, date)
            } else if (maintenanceItem.maintenance_assigned_business !== getProfileId()){
                if (maintenanceItem.maintenance_assigned_business === null){
                    // PUT to assign maintenance request to PM
                    console.log("assign maintenance request to PM")
                    console.log("handled by the property manager")
                    // Update Maintenance Request Status
                    try {
                        const formData = new FormData();
                        formData.append("maintenance_assigned_business", getProfileId());
                        formData.append("maintenance_request_uid",  maintenanceItem.maintenance_request_uid);
                        formData.append("maintenance_request_closed_date", date)
                        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
                            method: 'PUT',
                            body: formData,
                        });
                        if (response.status === 200) {
                            CompleteTicket(id)
                        }
                    } catch(error){
                        console.log("error", error)
                    }
                } else {
                    // PM is completing the ticket and the quote
                    console.log("PM is completing the ticket and the quote")
                    CompleteTicket(id, date)
                    if (maintenanceItem.quote_status_ranked !== "FINISHED" && rankedQuote){
                        FinishQuote(rankedQuote.maintenance_quote_uid)                        
                    }
                }
            } else if (maintenanceItem.maintenance_assigned_business === null){
                // it's handled by the property manager
                console.log('[BUG] THIS SHOULD NOT HAPPEN')
            }
        } else if (role === "Maintenance" || role === "Maintenance Employee"){
            // handle maintenance side
            console.log("Maintenance", maintenanceItem.maintenance_quote_uid)
            FinishQuote(maintenanceItem.maintenance_quote_uid)
            if (maintenanceItem.maintenance_assigned_business === getProfileId()){
                CompleteTicket(id)
            }
        } else {
            console.log("not supported role is trying to complete a ticket")
        }
    }

    function handleCancel(id, quotes){
        if (quotes && quotes.length > 0){
            for (let i = 0; i < quotes.length; i++){
                CancelQuote(quotes[i].maintenance_quote_uid);
            }
        }
        let response = CancelTicket(id);
        console.log("handleCancel", response)
        if (response){
            console.log("Ticket Cancelled")
            setShowMessage(true);
            setMessage("Ticket Cancelled!! Maintenance Status changed to CANCELLED");
            navigate(maintenanceRoutingBasedOnSelectedRole())
        } else{
            console.log("Ticket Not Cancelled")
            setShowMessage(true);
            setMessage("Error: Ticket Not Cancelled")
        }
    }

    return (
        <>
        <Grid item xs={6} sx={{
            alignItems: "flex-end",
            justifyContent: "flex-end",
        }}>
           
            <Button
						variant="contained"
						sx={{
							backgroundColor: '#FF8A00',
							color: '#160449',
							textTransform: 'none',
							fontWeight: 'bold',
							borderRadius: '8px',
							width: '160px', // Set a fixed width
							height: '120px', // Set a fixed height
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '10px', // Add padding to ensure text wrapping
							boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
							whiteSpace: 'normal', // Allow text to wrap
							'&:hover': {
								backgroundColor: '#FF8A00',
							},
						}}
                        onClick={() => setShowModal(true)}
					>
						Close Ticket
					</Button>
        </Grid>
        <DateTimePickerModal
            setOpenModal={setShowModal}
            open={showModal}
            maintenanceItem={maintenanceItem}
            date={""}
            time={""}
            completeTicket={handleComplete}
        />
        </>
    )

    // We need a modal to pop up and confirm the date the ticket was completed.
    // It can default to today and today's time, if the scheduled date doesn't exist or isn't in the past.
    // The user can change the date and time if they want.
    // There are also buttons to select that it was "done now", "done on scheduled date" (if in the past)
}