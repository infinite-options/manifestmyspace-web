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

function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [radioValue, setRadioValue] = useState('option1');

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
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
      {/* <RadioGroup
        aria-label="options"
        value={radioValue}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
      </RadioGroup>
      <TextField
        fullWidth
        label="Summary"
        value={`Date: ${selectedDate.toLocaleDateString()}, Time: ${selectedTime.toLocaleTimeString()}, Option: ${radioValue}`}
        InputProps={{
          readOnly: true,
        }}
      /> */}
    </Stack>
  );
}

export default function RescheduleMaintenance(){

    console.log("RescheduleMaintenance")
    const location = useLocation();
    const navigate = useNavigate();
    const maintenanceItem = location.state.maintenanceItem;

    function handleSubmit(){
        navigate("/maintenance", {state: {maintenanceItem: maintenanceItem}});
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
                        <Box
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Maintenance
                        </Typography>
                    </Box>
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
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
                                {Object.entries(maintenanceItem).map(([key, value], index) => (
                                        <Grid item xs={12}>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                <b>{key} : {value}</b>
                                            </Typography>
                                        </Grid>
                                    )
                                )}
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
                    <Grid container spacing={5}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                    >
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker/>
                            </LocalizationProvider>
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
                                    Schedule
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}