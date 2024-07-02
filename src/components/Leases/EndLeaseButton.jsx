import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, } from '@mui/material';
import dayjs from 'dayjs';

const EndLeaseButton = ({ theme, handleEndLease, moveoutDate, leaseData, setEndLeaseStatus, isTerminate }) => {
    console.log("isTerminate", isTerminate);
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("")


    const getEndLeaseConfirmation = () => {
        if (isTerminate === false) {
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
                    setEndLeaseStatus("ENDING")
                    return `Your lease will end on ${leaseEndDateFormatted} and 
                you are responsible for rent payments until the end of the lease. Are you sure you want to end the lease?`;
                } else {
                    console.log("Inside early end processing - EarlyTermination status");
                    setEndLeaseStatus("EARLY TERMINATION")
                    return `Notice for ending the lease must be provided ${noticePeriod} days in advance. 
                Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
                }
            } else {
                return 'ERROR: lease status is not "ACTIVE" or "ACTIVE-M2M"';
            }
        } else {
            setEndLeaseStatus("TERMINATED");
            return `Your lease will be Terminated immediately. Are you sure you want to Terminate the lease?`;
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
        handleEndLease();
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined"
                sx={{
                    background:isTerminate === false ? "#D4736D" : "#d80000",
                    color: theme.palette.background.default,
                    cursor: "pointer",
                    textTransform: "none",
                    minWidth: "150px",
                    minHeight: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    '&:hover': {
                        background: isTerminate === false ?'#DEA19C':'#ff0c0c',
                    },
                }}
                size="small"
                onClick={handleClickOpen}
            >
                <Typography sx={{
                    textTransform: "none",
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
                    whiteSpace: "nowrap",
                    marginLeft: "1%",
                }}>
                    {isTerminate === false ? "End" : "Terminate"}
                </Typography>
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"End Lease Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmationText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{
                        background: "#D4736D",
                        color: theme.palette.background.default,
                        cursor: "pointer",
                        textTransform: "none",
                        '&:hover': {
                            background: '#DEA19C',
                        },
                    }}
                        size="small">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} autoFocus variant="outlined"
                        sx={{
                            background: "#6788B3",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            textTransform: "none",
                            '&:hover': {
                                background: '#92A9CB',
                            },
                        }}
                        size="small">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EndLeaseButton;
