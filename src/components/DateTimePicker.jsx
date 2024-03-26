import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Grid } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ReactComponent as CalendarIcon } from "../images/datetime.svg"
import theme from '../theme/theme';

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

  const handleOpen = () => props.setOpenModal(true);
  const handleClose = () => props.setOpenModal(false);

  const activeButton = availabilityDate !== "" && availabilityTime !== "";

  function submit(){
    props.handleSubmit(availabilityDate, availabilityTime).then(
        handleClose()
    )
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
                Select Date and Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        {console.log("timepicker 1")}
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
                        {console.log("timepicker 2")}
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{padding: "8px"}}>
                    <Button variant="contained" color="primary" onClick={() => submit()} sx={{backgroundColor: !activeButton ? "#B0B0B0" : "#3D5CAC", pointerEvents: !activeButton ? "none" : "auto"}}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Schedule
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
