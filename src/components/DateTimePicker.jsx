import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, Grid, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ReactComponent as CalendarIcon } from "../images/datetime.svg"
import theme from '../theme/theme';
import { set } from 'date-fns';

dayjs.extend(customParseFormat);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(2),
    // backgroundColor: theme.palette.form.main,
    backgroundColor: "#FFFFFF",
    width: {
      xs: '80%', // For extra-small screens
      sm: '50%', // For small screens and up
    },
    paddingTop: '25px',
    borderRadius: '15px',
    border: '2px solid #000',
    boxShadow: 24,
    padding: "25px"
};

function DateTimePickerModal(props) {
  const [availabilityDate, setAvailabilityDate] = useState(props.date || "");
  const [availabilityTime, setAvailabilityTime] = useState(props.time || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // if (availabilityDate && availabilityTime){
    //     if (props.maintenanceItem.maintenance_scheduled_date && props.maintenanceItem.maintenance_scheduled_time){
    //         setAvailabilityDate(props.maintenanceItem.maintenance_scheduled_date)
    //         setAvailabilityTime(props.maintenanceItem.maintenance_scheduled_time)
    //     }        
    // }
    // console.log("props.maintenanceItem - ", props.maintenanceItem);
    const scheduledDate = props.maintenanceItem.maintenance_scheduled_date;
    const scheduledTime = props.maintenanceItem.maintenance_scheduled_time;
    setAvailabilityDate((scheduledDate !== "" && scheduledDate !== null && scheduledDate !== undefined && scheduledDate !== "null")  ? props.maintenanceItem.maintenance_scheduled_date : props.maintenanceItem.quote_earliest_available_date);
    setAvailabilityTime((scheduledTime !== "" && scheduledTime !== null && scheduledTime !== undefined && scheduledTime !== "null") ? props.maintenanceItem.maintenance_scheduled_time : props.maintenanceItem.quote_earliest_available_time);
    // setAvailabilityDate(props.maintenanceItem.maintenance_scheduled_date ? props.maintenanceItem.maintenance_scheduled_date : props.date)
    // setAvailabilityTime(props.maintenanceItem.maintenance_scheduled_time ? props.maintenanceItem.maintenance_scheduled_time : props.time)
  }, [])

  const handleOpen = () => props.setOpenModal(true);
  const handleClose = () => props.setOpenModal(false);

  const activeButton = availabilityDate !== "" || availabilityTime !== "";

  const handleAuxillaryButton = (selection) => {
    if (selection == "now"){
        setAvailabilityDate(dayjs().format("MM-DD-YYYY"));
        setAvailabilityTime(dayjs().format("HH:mm"));
    } else if (selection == "schedule"){
        setAvailabilityDate(props.maintenanceItem.maintenance_scheduled_date);
        setAvailabilityTime(props.maintenanceItem.maintenance_scheduled_time);
    }
  }

  const changeActiveDateSelector = (event) => {
    console.log("changeActiveDateSelector", event.target.value, event.target.checked)
    setShowDatePicker(event.target.checked && event.target.value === 'select');
    handleAuxillaryButton(event.target.value)
  }

  const showFormLabel = (selection) => {
    if (selection == "now"){
        return `Complete as of Today (${dayjs().format("MM-DD-YYYY")})`;
    } else if (selection == "schedule"){
        return `Complete on Scheduled Date (${props.maintenanceItem.maintenance_scheduled_date !== null ? props.maintenanceItem.maintenance_scheduled_date : "N/A"})`;
    }
  }
  

  function submit(){
    console.log("in submit for datetimepicker")
    if (props.completeTicket) {
        console.log("complete ticket", props.maintenanceItem.maintenance_request_uid, props.maintenanceItem.quote_info, availabilityDate, availabilityTime)
        props.completeTicket(props.maintenanceItem.maintenance_request_uid, props.maintenanceItem.quote_info, availabilityDate, availabilityTime).then(
            handleClose
        )
    } else{
        props.handleSubmit(props.maintenanceItem.maintenance_request_uid, availabilityDate, availabilityTime).then(
            handleClose()
        )
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {props.completeTicket ? "Select Completed Date and Time" : "Select Date and Time"}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            {props.completeTicket ? (
                    <Grid container columnSpacing={5} padding={4} sx={{justifyContent: "left"}}>
                        <Grid item xs={12}>
                        <FormControl>
                            <RadioGroup
                                defaultValue="now"
                                name="completed-date-radio-buttons"
                            >
                                <FormControlLabel value="now" control={<Radio onChange={changeActiveDateSelector}/>} label={showFormLabel("now")}/>
                                <FormControlLabel value="schedule" control={<Radio onChange={changeActiveDateSelector} disabled={props.maintenanceItem.maintenance_scheduled_date == null ? true : false}/>} label={showFormLabel("schedule")} />
                                <FormControlLabel value="select" control={<Radio onChange={changeActiveDateSelector}/>} label={"Select Completed Date"} />
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                        <Box sx={{paddingTop: "10px", paddingBottom: "10px"}}>
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
                                            backgroundColor: "#F2F2F2",
                                            borderRadius: "10px",
                                        },
                                        label: "Date"
                                    },
                                }}
                                disabled={!showDatePicker}
                            />
                        </Box> 
                        </Grid>
                  </Grid>
            ) : (
                <Grid container rowSpacing={6} padding={4}>
                <Grid item xs={12}>
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
                </Grid> 
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
            )}
                <Grid item xs={12} sx={{padding: "8px"}}>
                    <Button variant="contained" color="primary" onClick={() => submit()} sx={{backgroundColor: !activeButton ? "#B0B0B0" : "#3D5CAC", pointerEvents: !activeButton ? "none" : "auto"}}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                {props.completeTicket ? "Complete" : "Schedule"}
                        </Typography>
                    </Button>
                </Grid>
            </LocalizationProvider>
        </Box>
      </Modal>
    </div>
  );
}

export default DateTimePickerModal;
