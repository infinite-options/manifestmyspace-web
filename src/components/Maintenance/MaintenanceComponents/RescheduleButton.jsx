import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import theme from '../../../theme/theme';
import DateTimePickerModal from "../../DateTimePicker";
import { useState } from "react";


export default function RescheduleButton({maintenanceItem}){

    const [showModal, setShowModal] = useState(false);
    // const [date, time] = maintenanceItem.quote_earliest_availability.split(' ')
    const date = maintenanceItem.maintenance_scheduled_date;
    const time = maintenanceItem.maintenance_scheduled_time;


    async function handleSubmit(date, time){
        const reschedule = async () => {
            // setShowSpinner(true);
            console.log("reschedule", date, time)
            var formData = new FormData();
            formData.append("maintenance_request_uid",  maintenanceItem.maintenance_request_uid);
            formData.append("maintenance_request_status", "SCHEDULED");
            formData.append("maintenance_scheduled_date", date); // this needs to change for the date and time picker
            formData.append("maintenance_scheduled_time", time); // this needs to change for the date and time picker
    
            try {
                console.log("in try block")
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    body: formData
                });
            } catch (error){
                console.log("error", error)
            }
            // setShowSpinner(false);
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
                    width: "100%",
                }}
                onClick={() => setShowModal(true)}
            >   
                    <CalendarToday sx={{
                        color: "#3D5CAC",
                        paddingRight: "10%",
                    }}
                    />
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                    Reschedule
                </Typography>
            </Button>

            <DateTimePickerModal
                setOpenModal={setShowModal}
                open={showModal}
                maintenanceItem={maintenanceItem}
                date={date}
                time={time}
                handleSubmit={handleSubmit}
            />
        </Grid>
    )
}