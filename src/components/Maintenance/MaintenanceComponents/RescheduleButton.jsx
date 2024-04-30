import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import theme from '../../../theme/theme';
import DateTimePickerModal from "../../DateTimePicker";
import { useState } from "react";
import APIConfig from "../../../utils/APIConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";


export default function RescheduleButton({maintenanceItem}){
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    // const date = maintenanceItem.maintenance_scheduled_date;
    // const time = maintenanceItem.maintenance_scheduled_time;
    const [schedulerDate, setSchedulerDate] = useState(maintenanceItem.maintenance_scheduled_date ? maintenanceItem.maintenance_scheduled_date : "");    
    const [schedulerTime, setSchedulerTime] = useState(maintenanceItem.maintenance_scheduled_time ? maintenanceItem.maintenance_scheduled_time : "");    


    async function handleReschedule(id, date, time){

        console.log("handleReschedule", id, date, time)
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);

            const formData = new FormData();
            formData.append("maintenance_request_uid",  maintenanceItem.maintenance_request_uid);
            formData.append("maintenance_request_status", "SCHEDULED");
            formData.append("maintenance_scheduled_date", schedulerDate); // this needs to change for the date and time picker
            formData.append("maintenance_scheduled_time", schedulerTime); // this needs to change for the date and time picker
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
                    method: 'PUT',
                    body: formData,
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    changeQuoteStatus()
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }

        const changeQuoteStatus = async () => {
            setShowSpinner(true);
            var formData = new FormData();
            formData.append("maintenance_quote_uid", maintenanceItem.maintenance_quote_uid);
            formData.append("quote_status", "SCHEDULED");
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
                    method: 'PUT',
                    body: formData
                });
                const responseData = await response.json();
                console.log(responseData)
                if (responseData.code === 200){
                    console.log("Ticket Status Changed")
                    alert("Ticket Status Changed to SCHEDULED")
                    navigate('/workerMaintenance')
                }
            } catch(error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        setShowModal(false);
        changeMaintenanceRequestStatus();
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
                date={schedulerDate}
                time={schedulerTime}
                handleSubmit={handleReschedule}
            />
        </Grid>
    )
}