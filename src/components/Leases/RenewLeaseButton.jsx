import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, } from '@mui/material';
import dayjs from 'dayjs';

const RenewLeaseButton = ({ theme, handleRenewLease, leaseData }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        handleRenewLease();
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined"
                sx={{
                    background: "#6788B3",
                    color: theme.palette.background.default,
                    cursor: "pointer",
                    textTransform: "none",
                    minWidth: "200px",
                    minHeight: "35px",
                    // width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    '&:hover': {
                        background: '#9ab0cd',
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
                    {"Renew Lease"}
                </Typography>
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Renew Lease Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to Renew the lease?
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

export default RenewLeaseButton;
