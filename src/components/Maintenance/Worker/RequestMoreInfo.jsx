import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
    TextField
} from '@mui/material';
import { useEffect, useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../../theme/theme';

import CloseIcon from '@mui/icons-material/Close';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function RequestMoreInfo({showRequestMoreInfo, setShowRequestMoreInfo, maintenanceItem}){
    
    const [pmNotes, setPmNotes] = useState();
    const [showSpinner, setShowSpinner] = useState(false);

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

        const input = {
            maintenance_request_uid:maintenanceItem.maintenance_request_uid,
            maintenance_pm_notes:pmNotes,
            maintenance_request_status:"INFO"
        };

        console.log(input.maintenance_request_uid);
        console.log(input.maintenance_pm_notes);
        console.log(input.maintenance_request_status);
        setShowSpinner(true);
        axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests",
        input,
        headers)
        .then(response => {
            console.log("PUT result", response);
            setShowSpinner(false);
        }).catch(function (error) {
            console.log(error);
            setShowSpinner(false);
        });
        
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
                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Request More Info About?
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
            </DialogTitle>
            <DialogContent>
               
            <TextField name="pmNotes" value={pmNotes} onChange={handleChange1} placeholder=""  fullWidth ></TextField>        
                   
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
                }} onClick={handleSendNotes}>Send</Button>
            </DialogContent>
        </Dialog>
    )
}