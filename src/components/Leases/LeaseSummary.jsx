import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Paper, Grid, Button, Card, CardContent, CardMedia, Dialog, DialogContent, DialogContentText, DialogActions,
    DialogTitle, TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import theme from "../../theme/theme";
import propertyImage from "../../images/house.png";
import { Close } from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const LeaseSummary = ({ currentLease, rent, setNewStartDate, setNewEndDate, newStartDate, newEndDate }) => {
    const color = theme.palette.form.main;
    //image slider
    const [image, setImage] = useState([]);
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(newStartDate);
    const [endDate, setEndDate] = useState(newEndDate);

    useEffect(() => {
        //set images
        const parsedPropertyImages = currentLease.property_favorite_image ? currentLease.property_favorite_image : null;
        setImage(parsedPropertyImages === null ? propertyImage : parsedPropertyImages);
    }, [currentLease])

    const handleCloseDialog = () => {
        setOpen(false);
    }

    const handleOpenDialog = () => {
        setOpen(true);
    }

    const handleAddButton = () => {
        setNewStartDate(startDate);
        setNewEndDate(endDate);
        setEndDate(null);
        setStartDate(null);
        handleCloseDialog();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        console.log('check date', dateString, date)
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    const getDateAdornmentString = (d) => {
        if (d === null || d === 0) return "";
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return (
        <Paper sx={{ margin: "10px", backgroundColor: color, paddingBottom: "10px" }}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', height: '20px' }}>
                <Button
                    sx={{
                        "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                        cursor: "pointer",
                        textTransform: "none",
                        minWidth: "30px",
                        minHeight: "30px",
                        width: "30px",
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.smallFont,
                        margin: "5px",
                    }}
                    onClick={() => {
                        handleOpenDialog();
                    }}
                >
                    <EditIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                </Button>
                <Dialog open={open}
                    close={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography id="add-document-modal" variant="h6" component="h2" textAlign='center' sx={{
                            color: "#160449",
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.small,
                            flexGrow: 1,
                            textAlign: 'center',
                            margin: '10px'
                        }}>
                            Lease Renewal Details
                        </Typography>
                        <Button onClick={handleCloseDialog} sx={{ ml: 'auto' }}>
                            <Close sx={{
                                color: theme.typography.primary.black,
                                fontSize: '20px',
                            }} />
                        </Button>
                    </Box>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container spacing={6}>
                                <Grid item md={6}>
                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginTop: '10px', textAlign: 'center' }}>
                                        Start Date
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate ? dayjs(startDate) : null}
                                            onChange={(e) => {
                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                setStartDate(formattedDate);
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    required
                                                    {...params}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            fontSize: '14px',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '20px',
                                                        },
                                                    }}
                                                />
                                            )}
                                            sx={{ marginTop: "10px", marginLeft: '5px', width: '295px', backgroundColor: '#D6D5DA', }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginTop: '10px', textAlign: 'center' }}>
                                        End Date
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate ? dayjs(endDate) : null}
                                            onChange={(e) => {
                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                setEndDate(formattedDate);
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    required
                                                    {...params}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            fontSize: '14px',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '20px',
                                                        },
                                                    }}
                                                />
                                            )}
                                            sx={{ marginTop: "10px", marginLeft: '5px', width: '295px', backgroundColor: '#D6D5DA', }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                        <Button color="primary" autoFocus sx={{
                            textTransform: "none", background: "#FFC614",
                            color: "#160449",
                            cursor: "pointer", fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            '&:hover': {
                                backgroundColor: '#fabd00',
                            },
                        }}
                        onClick={handleAddButton}
                        >
                            Add
                        </Button>
                    </Box>

                </Dialog>
            </Box>
            <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
                <Grid item md={0.4} />
                <Grid item xs={12} md={2.5}>
                    <Card
                        sx={{
                            backgroundColor: color,
                            boxShadow: 'none',
                            elevation: '0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%', // Ensure card takes full height of its container
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                padding: '0 !important',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: '150px',
                                    width: '100%',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={image}
                                    sx={{
                                        elevation: '0',
                                        boxShadow: 'none',
                                        flexGrow: 1,
                                        objectFit: 'fill',
                                        width: '100%',
                                        height: '100px',
                                        marginTop: "5px"
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={0} md={0.5} />
                <Grid item md={3}>
                    <Grid container marginTop="10px">
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Lease Start</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{currentLease.lease_start}</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Lease End</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{formatDate(currentLease.lease_end)}</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Move In</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{currentLease.lease_move_in_date}</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Move Out</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>TBD</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={0} md={0.5} />
                <Grid item md={4}>
                    <Grid container marginTop="10px">
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Rent</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>${rent.charge}</Typography>
                        </Grid>

                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Frequency</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{rent.frequency}</Typography>
                        </Grid>

                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Available to Pay</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{rent.available_topay} Days Before</Typography>
                        </Grid>

                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>Due Date</Typography>
                        </Grid>
                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                            <Typography sx={{
                                textTransform: 'none',
                                color: "#160449",
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}>{rent.due_by} {getDateAdornmentString(rent.due_by)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default LeaseSummary;