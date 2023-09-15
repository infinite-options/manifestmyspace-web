import React, { useState } from 'react';
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
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
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };


  return (
    <Stack spacing={3}>
      <MobileDatePicker
        label="Date picker"
        inputFormat="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
      <MobileTimePicker
        label="Time picker"
        value={selectedTime}
        onChange={handleTimeChange}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
    </Stack>
  );
}

export default function RescheduleMaintenance(){

    console.log("RescheduleMaintenance")
    const location = useLocation();
    const navigate = useNavigate();
    const maintenanceItem = location.state.maintenanceItem;
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    console.log("RescheduleMaintenance", maintenanceItem)

    const [selectedValue, setSelectedValue] = useState("no");

    const handleChange = (value) => {
        console.log("Changing selectedValue to", value)
        setSelectedValue(value)
    };


    function handleSubmit(){
        
        const date = "12-15-2023"
        const time = "09:00:00"

        const changeMaintenanceRequestStatus = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "maintenance_request_uid": maintenanceItem.maintenance_request_uid,
                        "maintenance_request_status": "SCHEDULED",
                        "maintenance_scheduled_date": date,
                        "maintenance_scheduled_time": time
                    })
                });
            } catch (error){
                console.log("error", error)
            }
        }
        changeMaintenanceRequestStatus()
        navigate("/maintenance", {state: {maintenanceItem: maintenanceItem}});
    }

    function numImages(){
        if (maintenanceItem.maintenance_images == "[]"){
            return 0
        } else{
            return maintenanceItem.maintenance_images.length
        }
    }

    function displaySchedulingButton(){
        if (maintenanceItem && (maintenanceItem.maintenance_scheduled_date !== '' && maintenanceItem.maintenance_scheduled_date !== null) && (maintenanceItem.maintenance_scheduled_time !== '' && maintenanceItem.maintenance_scheduled_time !== null)){
            return "Reschedule"
        } else{
            return "Schedule"
        }
    }

    function currentScheduledDate(){
        if (maintenanceItem && (maintenanceItem.maintenance_scheduled_date !== '' && maintenanceItem.maintenance_schedule_date !== null) && (maintenanceItem.maintenance_scheduled_time !== '' && maintenanceItem.maintenance_scheduled_time !== null)){
            return "Scheduled for " + maintenanceItem.maintenance_scheduled_date + " at " + maintenanceItem.maintenance_scheduled_time
        } else{
            return "Not Scheduled"
        }
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate(-1); 
    }

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
        >
            <Paper
                style={{
                    margin: '10px',
                    backgroundColor: theme.palette.primary.main,
                    width: '100%', // Occupy full width with 25px margins on each side
                    paddingTop: '10px',
                    paddingBottom: '30px',
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        paddingBottom: "20px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingBottom: "20px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                        }}
                    >
                        <Box position="absolute" left={30}>
                            <Button onClick={() => handleBackButton()}>
                                <ArrowBackIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Maintenance
                            </Typography>
                        </Box>
                        <Box position="absolute" right={30}>
                            <Button onClick={() => navigateToAddMaintenanceItem()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                    <Grid container spacing={5}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        paddingBottom="20px"
                     >
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    backgroundColor: "#97A7CF",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                }}>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center">
                                            {numImages() > 0 ? 
                                                (
                                                    Array.isArray(maintenanceItem.maintenance_images) && maintenanceItem.maintenance_images.length > 0 ? 
                                                    maintenanceItem.maintenance_images.map((image, index) => (
                                                        <Grid item key={index}>
                                                            <img 
                                                                src={image} 
                                                                alt={`Image ${index}`} 
                                                                style={{ width: '50px', height: '50px' }} 
                                                            />
                                                        </Grid>
                                                    ))
                                                    : 
                                                    null
                                                )
                                            : null }
                                        </Grid>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            { numImages() > 0 ? numImages() + " Images" : "No Images" }
                                        </Typography>
                                    </Grid>
                                     <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <b>{maintenanceItem.maintenance_priority} Priority</b>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <u>{maintenanceItem.property_address}, {maintenanceItem.property_city} {maintenanceItem.property_state} {maintenanceItem.property_zip}</u>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <b>{maintenanceItem.maintenance_title}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <b>{maintenanceItem.maintenance_desc}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            Estimated Cost: <b>{maintenanceItem.maintenance_desc}</b>
                                        </Typography>
                                    </Grid>
                                {/* {Object.entries(maintenanceItem).map(([key, value], index) => (
                                        <Grid item xs={12}>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                <b>{key} : {value}</b>
                                            </Typography>
                                        </Grid>
                                    )
                                )} */}
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            backgroundColor: "#97A7CF",
                        }}
                    > 
                        <Grid item xs={12}>
                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                <b>Scheduling Maintenance</b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{paddingTop: "10px"}}
                    >
                        <Grid item xs={12}>
                            <Typography  sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                {currentScheduledDate()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker/>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                        <Typography  sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Can Tenant Reschedule?
                            </Typography>
                            <RadioGroup
                                aria-label="options"
                                value={selectedValue}
                            >
                                <FormControlLabel 
                                    value="yes" 
                                    control={
                                        <Radio 
                                            color="primary" 
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3D5CAC',
                                                }
                                            }}
                                        />
                                    } 
                                    label="Yes"
                                    checked={selectedValue === "yes"}
                                    onChange={() => handleChange("yes")}
                                />
                                <FormControlLabel 
                                    value="no" 
                                    control={
                                        <Radio 
                                            color="primary" 
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3D5CAC',
                                                }
                                            }}
                                        />
                                    } 
                                    label="No" 
                                    checked={selectedValue === "no"}
                                    onChange={() => handleChange("no")}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    backgroundColor: "#9EAED6",
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    display: 'flex',
                                    width: "100%",
                                }}
                                onClick={() => handleSubmit()}
                                >
                                <Typography sx={{
                                    color: "#160449",
                                    fontWeight: theme.typography.primary.fontWeight, 
                                    fontSize: "14px"
                                }}>
                                    {displaySchedulingButton()}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}