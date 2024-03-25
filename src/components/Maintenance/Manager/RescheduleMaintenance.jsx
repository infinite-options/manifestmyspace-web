import React, { useEffect, useState } from 'react';
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

import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import Scheduler from '../../utils/Scheduler';
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as CalendarIcon } from "../../../images/datetime.svg"
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DateTimePickerModal from '../../../components/DateTimePicker';

export default function RescheduleMaintenance(){

    // console.log("RescheduleMaintenance")
    const location = useLocation();
    const navigate = useNavigate();
    const maintenanceItem = location.state.maintenanceItem;
    // console.log("maintenanceItem", maintenanceItem)
    const navigationParams = location.state.navigateParams;
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    // const [showScheduler, setShowScheduler] = useState(false);
    // const [schedulerDate, setSchedulerDate] = useState();
    const [availabilityDate, setAvailabilityDate] = useState(maintenanceItem.maintenance_scheduled_date || '');
    const [availabilityTime, setAvailabilityTime] = useState(maintenanceItem.maintenance_scheduled_time || '');
    let maintenance_request_index = navigationParams.maintenanceRequestIndex
    let status = navigationParams.status
    let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
    let allMaintenanceData = navigationParams.allData




    // console.log("RescheduleMaintenance", maintenanceItem)

    const [selectedValue, setSelectedValue] = useState("no");

    useEffect(() => {
        console.log("availabilityDate", availabilityDate)
        console.log("availabilityTime", availabilityTime)
    }, [availabilityDate, availabilityTime])

    const handleChange = (value) => {
        console.log("Changing selectedValue to", value)
        setSelectedValue(value)
    };

    useEffect(() => {
        let imageArray = JSON.parse(maintenanceItem.maintenance_images)

        setDisplayImages(imageArray)
    }, [])


    function handleSubmit(availabilityDate, availabilityTime) {
        console.log("handleSubmit")
        console.log("availabilityDate", availabilityDate)
        console.log("availabilityTime", availabilityTime)
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            
            var formData = new FormData();
            formData.append("maintenance_request_uid",  maintenanceItem.maintenance_request_uid);
            formData.append("maintenance_request_status", "SCHEDULED");
            formData.append("maintenance_scheduled_date", availabilityDate); // this needs to change for the date and time picker
            formData.append("maintenance_scheduled_time", availabilityTime); // this needs to change for the date and time picker

            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    body: formData
                });
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        
        changeMaintenanceRequestStatus()
        navigate("/maintenance/detail", {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        });
    }

    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    function displaySchedulingButton(date, time){
        if (date && time && date !== "null" && time != "null"){
            return "Reschedule"
        } else{
            return "Schedule"
        }
    }

    function currentScheduledDate(date, time){
        if (date && time && date !== "null" && time !== "null"){
            return (
                <Typography  sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                    {"Scheduled for " + date + " at " + dayjs(time,"HH:mm").format("h:mm A")}
                </Typography>
            )
        } else{
            return (
                <Typography  sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                    {"Not Scheduled"}
                </Typography>
            )
        }
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate("/maintenance/detail", {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        }); 
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
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                    paddingTop: "25px"
                                }}>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center">
                                            {numImages() > 0 ? 
                                                (
                                                    Array.isArray(displayImages) && displayImages.length > 0 ? 
                                                    displayImages.map((image, index) => (
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
                                {currentScheduledDate(availabilityDate, availabilityTime)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} sx={{paddingTop: "10px"}}>                
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={dayjs(availabilityDate)}
                                    minDate={dayjs()}
                                    onChange={(v) => setAvailabilityDate(v.format("MM-DD-YYYY"))}
                                    slots={{
                                        openPickerIcon: CalendarIcon,
                                    }}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            style: {
                                                width: "100%",
                                                fontSize: 12,
                                                backgroundColor: "#F2F2F2 !important",
                                                borderRadius: "10px !important",
                                            },
                                            label: "Date"
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} md={6} sx={{paddingTop: "10px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker                                                        
                                    slotProps={{ 
                                        textField: { 
                                            size: 'small',
                                            style: {
                                                width: "100%",
                                                fontSize: 12,
                                                backgroundColor: "#F2F2F2 !important",
                                                borderRadius: "10px !important",
                                            },
                                            label: 'Time (select AM or PM)'                                                                
                                        } 
                                    }}                                                        
                                    views={['hours', 'minutes']}
                                    value={dayjs(availabilityTime,"HH:mm")}
                                    onChange={(newValue) => setAvailabilityTime(newValue.format("HH:mm"))}
                                />
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
                                onClick={() => handleSubmit(availabilityDate, availabilityTime)}
                                >
                                <Typography sx={{
                                    color: "#160449",
                                    fontWeight: theme.typography.primary.fontWeight, 
                                    fontSize: "14px"
                                }}>
                                    {displaySchedulingButton(availabilityDate, availabilityTime)}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}