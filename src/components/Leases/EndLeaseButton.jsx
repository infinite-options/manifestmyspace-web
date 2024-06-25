import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, } from '@mui/material';
import dayjs from 'dayjs';

const EndLeaseButton = ({ theme, handleEndLease, moveoutDate, leaseData }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        handleEndLease();
        setOpen(false);
    };

    const getConfirmEndLeaseDialogText = (leaseData) => {
        console.log("leasedata", leaseData);
        const currentDate = new Date();
        const currentDateFormatted = dayjs(currentDate).format("MM-DD-YYYY");
        const noticePeriod = leaseData.lease_end_notice_period ? leaseData.lease_end_notice_period : 30; //30 by default
        const leaseEndDate = new Date(leaseData.lease_end);
        const leaseEndDateFormatted = dayjs(leaseEndDate).format("MM-DD-YYYY");

        console.log("Current Date: ", currentDate);
        console.log("Notice Period: ", noticePeriod);
        console.log("Lease End Date: ", leaseEndDate);

        console.log("MoveOutDate In: ", moveoutDate);
        // moveOutDate = new Date(moveOutDate)
        // console.log("MoveOutDate Out: ", moveOutDate);

        const noticeDate = new Date(leaseEndDate);
        noticeDate.setDate(leaseEndDate.getDate() - noticePeriod);
        const noticeDateFormatted = dayjs(noticeDate).format("MM-DD-YYYY");
        console.log("Notice Date: ", noticeDate);
        const futureDate = new Date(currentDate);
        console.log("Future Date 1: ", noticeDate);
        futureDate.setDate(currentDate.getDate() + noticePeriod);
        console.log("Future Notice Date: ", noticeDate);
        const newLeaseEndDate = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0);
        console.log("New Lease End Date: ", newLeaseEndDate);
        console.log("Lease Status: ", leaseData.lease_status);
        if (leaseData.lease_status === "ACTIVE") {
            console.log("In IF Statement", currentDate, noticeDate, moveoutDate.$d, leaseEndDate, newLeaseEndDate);
            console.log("In IF Statement", currentDateFormatted, noticeDateFormatted, leaseEndDateFormatted);

            if (currentDate <= noticeDate) {
                console.log("Current Date is before Notice Date");
                if (moveoutDate >= leaseEndDate) {
                    // Lease Ending at End of Lease Term
                    console.log("Lease Ending at End of Lease Term");
                    return `Your lease will end on ${moveoutDate.format(
                        "dddd MMM DD YYYY"
                    )} and you are responsible for rent payments until the end of the lease. Are you sure you want to end the lease?`;
                }
                if (moveoutDate < leaseEndDate) {
                    // Lease Ending Before End of Lease Term
                    console.log("Lease Ending Before End of Lease Term");
                    return `Ending the lease early will require approval from the Property Manager. Your application to end the lease on ${moveoutDate.format(
                        "dddd MMM DD YYYY"
                    )} will be sent to the Property Manager for approval.  Please note that until you receive approval from the Property Manager, you are responsible for rent payments until the end of the lease ${dayjs(
                        leaseEndDate
                    ).format("dddd MMM DD YYYY")}. Are you sure you want to end the lease?`;
                }
            } else {
                // Lease Ending After End of Lease Term
                console.log("Lease Ending After End of Lease Term");
                return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${dayjs(newLeaseEndDate).format(
                    "dddd MMM DD YYYY"
                )} and you will be responsible for payments through that date. Are you sure you want to end the lease?`;
            }
        } else if (leaseData.lease_status === "ACTIVE-M2M") {
            if (currentDate < noticeDate) {
                // M2M Lease Ending Before Notice Date
                console.log("M2M Lease Ending");
                return `Your lease will end on ${moveoutDate.format(
                    "dddd MMM DD YYYY"
                )} and you are responsible for rent payments until the end of the lease. Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
            } else {
                // M2M Lease Ending After Notice Date
                console.log("Lease Ending After End of Lease Term");
                return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${dayjs(newLeaseEndDate).format(
                    "dddd MMM DD YYYY"
                )} and you will be responsible for payments through that date. Are you sure you want to end the lease?`;
            }
        } else {
            return 'ERROR: lease status is not "ACTIVE" or "ACTIVE-M2M"';
        }
    };

    return (
        <div>
            <Button
                variant="outlined"
                sx={{
                    background: "#D4736D",
                    color: theme.palette.background.default,
                    cursor: "pointer",
                    textTransform: "none",
                    minWidth: "200px",
                    minHeight: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    '&:hover': {
                        background: '#DEA19C',
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
                    {"End Lease"}
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
                        {/* The selected Move Out Date is {moveoutDate ? moveoutDate.format('YYYY-MM-DD') : ""}. Are you sure you want to end the lease? */}
                        {getConfirmEndLeaseDialogText(leaseData)}
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
