import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    TextField,
    Box
} from '@mui/material';
import { useEffect, useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../../theme/theme';

import CloseIcon from '@mui/icons-material/Close';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

import { useUser } from '../../../contexts/UserContext';

export default function RequestMoreInfo({showRequestMoreInfo, setShowRequestMoreInfo, maintenanceItem}){
    
    const { user, getProfileId, roleName } = useUser();
    const [pmNotes, setPmNotes] = useState();
    const [showSpinner, setShowSpinner] = useState(false);

    console.log("ROHIT - RequestMoreInfo - props.maintenanceItem - ", maintenanceItem)

    const handleChange1 = (event) => {
        setPmNotes(event.target.value);
    };

    const handleSendNotes = () => {

    const headers = { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials":"*"
    };

        const formData = new FormData();
        formData.append("maintenance_quote_uid", maintenanceItem.maintenance_quote_uid);
        formData.append("quote_notes", pmNotes);
        formData.append("quote_status", "MORE INFO");

        // console.log('formData>>>>>> in request more info');
		// for (let [key, value] of formData.entries()) {
		// 	console.log(key, value);
		// }
        

        // const input = {
        //     maintenance_request_uid:maintenanceItem.maintenance_request_uid,
        //     maintenance_pm_notes:pmNotes,
        //     maintenance_request_status:"INFO"
        // };

        // console.log(input.maintenance_request_uid);
        // console.log(input.maintenance_pm_notes);
        // console.log(input.maintenance_request_status);
        setShowSpinner(true);
        axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests",
        formData,
        headers)
        .then(response => {
            console.log("PUT result", response);
            setShowSpinner(false);
            setShowRequestMoreInfo(false);
        setPmNotes("");

        }).catch(function (error) {
            console.log(error);
            setShowSpinner(false);
        });
        
    sendAnnouncement();
    };
    
    const sendAnnouncement = async () => {
    try {
        const receiverPropertyMapping = {
        // [maintenanceItem.tenant_uid]: [maintenanceItem.property_uid], //tenant
        [maintenanceItem.business_uid]: [maintenanceItem.property_uid], //manager
        };



        await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            announcement_title: `Additional Info Required for Maintenance`,
            // announcement_msg: `Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease.`,
            announcement_msg: `Please provide the following information for the maintenance request - ${maintenanceItem?.maintenance_title} - ${pmNotes} \n Maintenance Item - localhost:3000/managerMaintenance/${maintenanceItem.maintenance_request_uid}`,
            announcement_sender: getProfileId(),
            announcement_date: new Date().toDateString(),
            // announcement_properties: property.property_uid,
            announcement_properties: JSON.stringify(receiverPropertyMapping),
            announcement_mode: "MAINTENANCE",
            // announcement_receiver: [maintenanceItem?.tenant_uid],
            announcement_receiver: [maintenanceItem?.business_uid],
            announcement_type: ["Text", "Email"],
        }),
        });
    } catch (error) {
        console.log("Error in sending announcement for more info:", error);
        alert("We were unable to Text the Tenant but we were able to send them a notification through the App");
    }
    };
    
    

    return (
        <Dialog open={showRequestMoreInfo} onClose={() => setShowRequestMoreInfo(false)} maxWidth="lg">
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={showSpinner}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <DialogTitle>
                    <Stack direction="column" spacing={3}>
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Request More Info
                        </Typography>
                        <Button sx={{ 
                            textTransform: 'capitalize',
                            position: 'absolute',
                            right: 1,
                            top: 1,
                            color: (theme) => theme.palette.grey[500]
                        }} 
                            onClick={() => setShowRequestMoreInfo(false)}
                        >
                            <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                        </Button>
                    </Stack>
                </DialogTitle>
            <DialogContent> 
                <Stack direction="column" spacing={3}>
                    <TextField name="pmNotes" value={pmNotes} onChange={handleChange1} placeholder="" fullWidth sx={{paddingTop: "10px"}}/>
                    <Button
                        variant="contained"
                        sx={{
                            background: '#3D5CAC',
                            color: theme.palette.background.default,
                            width: `60%`,
                            height: `10%`,
                            left: `20%`,
                            top: `20%`,
                            borderRadius: '10px 10px 10px 10px'
                        }} onClick={handleSendNotes}>Send
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}