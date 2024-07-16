import React, { useState } from 'react';
import {
    Button, Typography, Box, Grid, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
    FormGroup, Checkbox, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const EndLeaseButton = ({ theme, handleEndLease, moveoutDate, leaseData, setEndLeaseStatus, setIsEndClicked }) => {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("")
    const [showSpinner, setShowSpinner] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [moveOutDate, setMoveOutDate] = useState(null);
    const [moveOutReason, setMoveOutReason] = useState(null);
    const [otherText, setOtherText] = useState('');
    const [selectedOption2Checkbox, setSelectedOption2Checkbox] = useState('');
    const [selectedOption3Checkbox, setSelectedOption3Checkbox] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const color = theme.palette.form.main;

    const getEndLeaseConfirmation = () => {
        const currentDate = new Date();
        // const currentDateFormatted = dayjs(currentDate).format("MM-DD-YYYY");
        const noticePeriod = leaseData.lease_end_notice_period ? leaseData.lease_end_notice_period : 30; //30 by default
        const leaseEndDate = new Date(leaseData.lease_end);
        const leaseEndDateFormatted = dayjs(leaseEndDate).format("MM-DD-YYYY");

        console.log("Current Date: ", currentDate);
        console.log("Notice Period: ", noticePeriod);
        console.log("Lease End Date: ", leaseEndDate);

        const noticeDate = new Date(leaseEndDate);
        noticeDate.setDate(leaseEndDate.getDate() - noticePeriod);
        // const noticeDateFormatted = dayjs(noticeDate).format("MM-DD-YYYY");
        const lowerBoundNoticeDate = new Date(noticeDate);
        lowerBoundNoticeDate.setDate(noticeDate.getDate() - noticePeriod);
        const lowerBoundNoticeDateFormatted = dayjs(lowerBoundNoticeDate).format("MM-DD-YYYY");
        console.log("Notice Date: ", noticeDate);
        console.log("lowerBoundNoticeDateFormatted: ", lowerBoundNoticeDateFormatted);

        if (leaseData.lease_status === "ACTIVE" || leaseData.lease_status === "ACTIVE-M2M") {
            if (currentDate <= noticeDate && currentDate >= lowerBoundNoticeDate) {
                console.log("Inside normal end processing - Ending status");
                // setEndLeaseStatus("ENDING")
                return `Your lease will end on ${leaseEndDateFormatted} and 
                you are responsible for rent payments until the end of the lease. Are you sure you want to end the lease?`;
            } else {
                console.log("Inside early end processing - EarlyTermination status");
                // setEndLeaseStatus("EARLY TERMINATION")
                return `Notice for ending the lease must be provided ${noticePeriod} days in advance. 
                Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
            }
        } else {
            return 'ERROR: lease status is not "ACTIVE" or "ACTIVE-M2M"';
        }
    };


    const handleClickOpen = async () => {
        const confirmationText = getEndLeaseConfirmation();
        await setConfirmationText(confirmationText);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        // handleEndLease();
        setOpen(false);
    };

    const handleRadioChange = (event, id) => {
        console.log('event1', event);
        setMoveOutReason(event.target.value);
        setSelectedValue(event.target.value);
        setSelectedId(id);
    };

    const handleOption2CheckboxChange = (event, label) => {
        console.log('event', event);
        setSelectedOption2Checkbox(event.target.value);
        setMoveOutReason(label);
    };

    const handleOption3CheckboxChange = (event, label) => {
        console.log('event', event);
        setSelectedOption3Checkbox(event.target.value);
        setMoveOutReason(label);
    };

    const handleCancel = () => {
        setIsEndClicked(false);
    }

    return (
        // <Button
        //         variant="outlined"
        //         sx={{
        //             background: "#D4736D",
        //             color: theme.palette.background.default,
        //             cursor: "pointer",
        //             textTransform: "none",
        //             minWidth: "150px",
        //             minHeight: "35px",
        //             display: "flex",
        //             alignItems: "center",
        //             justifyContent: "center",
        //             '&:hover': {
        //                 background: '#DEA19C',
        //             },
        //         }}
        //         size="small"
        //         onClick={handleClickOpen}
        //     >
        //         <Typography sx={{
        //             textTransform: "none",
        //             color: theme.typography.primary.black,
        //             fontWeight: theme.typography.secondary.fontWeight,
        //             fontSize: theme.typography.smallFont,
        //             whiteSpace: "nowrap",
        //             marginLeft: "1%",
        //         }}>
        //             End
        //         </Typography>
        //     </Button> 
        //     <Dialog
        //         open={open}
        //         onClose={handleClose}
        //         aria-labelledby="alert-dialog-title"
        //         aria-describedby="alert-dialog-description"
        //         maxWidth="md"
        //     >
        //         <DialogTitle id="alert-dialog-title">{"End Lease Confirmation"}</DialogTitle>
        //         <DialogContent>
        //             <DialogContentText id="alert-dialog-description">
        //                 {confirmationText}
        //             </DialogContentText>
        //         </DialogContent>
        //         <DialogActions>
        //             <Button onClick={handleClose} sx={{
        //                 background: "#D4736D",
        //                 color: theme.palette.background.default,
        //                 cursor: "pointer",
        //                 textTransform: "none",
        //                 '&:hover': {
        //                     background: '#DEA19C',
        //                 },
        //             }}
        //                 size="small">
        //                 Cancel
        //             </Button>
        //             <Button onClick={handleConfirm} autoFocus variant="outlined"
        //                 sx={{
        //                     background: "#6788B3",
        //                     color: theme.palette.background.default,
        //                     cursor: "pointer",
        //                     textTransform: "none",
        //                     '&:hover': {
        //                         background: '#92A9CB',
        //                     },
        //                 }}
        //                 size="small">
        //                 Confirm
        //             </Button>
        //         </DialogActions>
        //     </Dialog> 




        <Box
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Paper
                style={{
                    marginTop: "10px",
                    backgroundColor: theme.palette.primary.main,
                    width: "100%", // Occupy full width with 25px margins on each side
                }}
            >
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Grid container sx={{ marginTop: '1px', marginBottom: '15px', alignItems: 'center', justifyContent: 'center' }} rowSpacing={4}>
                    <Grid item xs={12} md={12}>
                        <Typography
                            sx={{
                                color: "#160449",
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.largeFont,
                                textAlign: 'center'
                            }}
                        >
                            End Lease
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Typography
                            sx={{
                                color: "#160449",
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.smallFont,
                                textAlign: 'center'
                            }}
                        >
                            Please provide a reason for why you are ending the tenant’s lease.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ padding: "10px", backgroundColor: color, width: '95%', margin: '10px 10px 0px 10px' }} >
                            <FormControl sx={{ width: '100%' }}>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={selectedValue}
                                    onChange={(event)=> handleRadioChange(event, 0)}
                                    id='0'
                                    sx={{ marginLeft: '5px', width: '100%' }}
                                >
                                    <FormControlLabel
                                        id='0'
                                        value="The tenant does not plan on living here next year."
                                        control={<Radio sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />}
                                        label={
                                            <Box sx={{ display: 'block', marginLeft: '10px' }}>
                                                <Typography
                                                    sx={{
                                                        color: "#160449",
                                                        fontWeight: theme.typography.primary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                    }}
                                                >
                                                    The tenant does not plan on living here next year.
                                                </Typography>
                                                {selectedValue === 'The tenant does not plan on living here next year.' && (
                                                    <Grid container sx={{ marginBottom: "5px", alignItems: "center", marginTop: '10px' }}>
                                                        <Grid item xs={4}>
                                                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC"  }}>Move-Out Date</Typography>
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    value={moveoutDate}
                                                                    onChange={e => {
                                                                        const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                        setMoveOutDate(dayjs(formattedDate));
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Box>

                                        }
                                    />

                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Paper sx={{ padding: "10px", backgroundColor: color, width: '95%', margin: '10px 10px 0px 10px' }} >
                            <FormControl sx={{ width: '100%' }}>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={selectedValue}
                                    onChange={(event)=> handleRadioChange(event, 1)}
                                    id='1'
                                    sx={{ marginLeft: '5px', width: '100%' }}
                                >
                                    <FormControlLabel
                                        id='1'
                                        value="The tenant has a personal reason(s) for terminating the lease early."
                                        control={<Radio sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />}
                                        label={
                                            <Box sx={{ display: 'block' }}>
                                                <Typography
                                                    sx={{
                                                        color: "#160449",
                                                        fontWeight: theme.typography.primary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                    }}
                                                >
                                                    The tenant has a personal reason(s) for terminating the lease early.
                                                </Typography>
                                                
                                                {selectedValue === 'The tenant has a personal reason(s) for terminating the lease early.' && (
                                                    <>
                                                    <Typography
                                                    sx={{
                                                        color: "#3D5CAC",
                                                        fontWeight: theme.typography.primary.fontWeight,
                                                        fontSize: '14px',
                                                        marginTop:'10px'
                                                    }}
                                                >
                                                    Please specify the reason.
                                                </Typography>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={selectedOption2Checkbox === 'property'}
                                                            onChange={(event) => handleOption2CheckboxChange(event, "The tenant is moving into another property.")}
                                                            value="property" />} label="The tenant is moving into another property." />
                                                        <FormControlLabel control={<Checkbox checked={selectedOption2Checkbox === 'area'}
                                                            onChange={(event) => handleOption2CheckboxChange(event, "The tenant is moving out of the area.")}
                                                            value="area" />} label="The tenant is moving out of the area." />
                                                        <FormControlLabel control={<Checkbox checked={selectedOption2Checkbox === 'rent'}
                                                            onChange={(event) => handleOption2CheckboxChange(event, "The tenant is unable to pay rent.")}
                                                            value="rent" />} label="The tenant is unable to pay rent." />
                                                        <FormControlLabel control={<Checkbox checked={selectedOption2Checkbox === 'military'}
                                                            onChange={(event) => handleOption2CheckboxChange(event, "The tenant is starting active military duty.")}
                                                            value="military" />} label="The tenant is starting active military duty." />
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FormControlLabel control={<Checkbox checked={selectedOption2Checkbox === 'other'}
                                                                onChange={(event) => handleOption2CheckboxChange(event, "Other")}
                                                                value="other" />} label="Other:" />
                                                            <TextField
                                                                value={otherText}
                                                                onChange={(e) => setOtherText(e.target.value)}
                                                                label="Please provide a reason."
                                                                variant="outlined"
                                                                fullWidth
                                                            />
                                                        </Box>
                                                    </FormGroup>
                                                    </>
                                                )}
                                            </Box>
                                        }
                                    />

                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <Paper sx={{ padding: "10px", backgroundColor: color, width: '95%', margin: '10px 10px 0px 10px' }} >
                            <FormControl sx={{ width: '100%' }}>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={selectedValue}
                                    onChange={(event)=> handleRadioChange(event, 2)}
                                    id='2'
                                    sx={{ marginLeft: '5px', width: '100%' }}
                                >
                                    <FormControlLabel
                                        id='2'
                                        value="The tenant is currently undergoing a legal issue(s)."
                                        control={<Radio sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />}
                                        sx={{ marginBottom: '10px' }}
                                        label={
                                            <Box sx={{ display: 'block' }}>
                                                <Typography
                                                    sx={{
                                                        color: "#160449",
                                                        fontWeight: theme.typography.primary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                    }}
                                                >
                                                    The tenant is currently undergoing a legal issue(s).
                                                </Typography>
                                               
                                                {selectedValue === 'The tenant is currently undergoing a legal issue(s).' && (
                                                    <>
                                                     <Typography
                                                     sx={{
                                                         color: "#3D5CAC",
                                                         fontWeight: theme.typography.primary.fontWeight,
                                                         fontSize: '14px',
                                                         marginTop:'10px'
                                                     }}
                                                 >
                                                     Please specify the reason.
                                                 </Typography>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={selectedOption3Checkbox === 'crime'}
                                                            onChange={(event) => handleOption3CheckboxChange(event, "The tenant has committed a crime.")}
                                                            value="crime" />} label="The tenant has committed a crime." />
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FormControlLabel control={<Checkbox checked={selectedOption3Checkbox === 'other'}
                                                                onChange={(event) => handleOption3CheckboxChange(event, "Other")}
                                                                value="other" />} label="Other:" />
                                                            <TextField
                                                                value={otherText}
                                                                onChange={(e) => setOtherText(e.target.value)}
                                                                label="Please provide a reason."
                                                                variant="outlined"
                                                                fullWidth
                                                            />
                                                        </Box>
                                                    </FormGroup>
                                                    </>
                                                )}
                                            </Box>
                                        }
                                    />

                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Paper sx={{ padding: "10px", backgroundColor: color, width: '95%', margin: '10px 10px 0px 10px' }} >
                            <FormControl sx={{ width: '100%' }}>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={selectedValue}
                                    onChange={(event)=> handleRadioChange(event, 3)}
                                    id='3'
                                    sx={{ marginLeft: '5px', width: '100%' }}
                                >
                                    <FormControlLabel
                                        id='3'
                                        value="The property has been deemed unsafe or uninhabitable."
                                        control={<Radio sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />}
                                        label={
                                            <Box sx={{ display: 'block' }}>
                                                <Typography
                                                    sx={{
                                                        color: "#160449",
                                                        fontWeight: theme.typography.primary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                    }}
                                                >
                                                    The property has been deemed unsafe or uninhabitable.
                                                </Typography>
                                                {selectedValue === 'The property has been deemed unsafe or uninhabitable.' && (
                                                    <Grid container sx={{ marginBottom: "5px", alignItems: "center", marginTop: '10px' }}>
                                                        <Grid item xs={4}>
                                                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" , color: "#3D5CAC" }}>Move-Out Date</Typography>
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    value={moveoutDate}
                                                                    onChange={e => {
                                                                        const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                        setMoveOutDate(dayjs(formattedDate));
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Box>
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                    <Button
                        sx={{
                            marginRight: '5px', background: "#D4736D",
                            color: "#160449",
                            cursor: "pointer",
                            width: "100px",
                            height: "31px",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#DEA19C',
                            },
                        }}
                        onClick={handleCancel}
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            background: "#6788B3",
                            color: "#160449",
                            cursor: "pointer",
                            width: "100px",
                            height: "31px",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#92A9CB',
                            },
                        }}
                        color="secondary">
                        Confirm
                    </Button>
                </Box>
            </Paper>
        </Box>

    );
};

export default EndLeaseButton;
