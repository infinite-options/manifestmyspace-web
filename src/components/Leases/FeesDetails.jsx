import React from "react";
import { useEffect, useState, useRef } from "react";
import {
    Typography, Box, Paper, Grid, TextField, MenuItem, Button, FormControl, InputAdornment, Select, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, Snackbar, Alert, InputLabel, Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import theme from "../../theme/theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Close } from '@mui/icons-material';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-input": {
            border: 0,
            borderRadius: 3,
            color: "#3D5CAC",
            fontSize: 50,
        },
    },
}));


const FeesDetails = ({getDateAdornmentString, setLeaseFees, leaseFees}) => {
    const [currentFeeRow, setcurrentFeeRow] = useState(null);
    const [isEditing, setIsFeeEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [open, setOpen] = useState(false);
    const color = theme.palette.form.main;
    const classes = useStyles();

    const feesColumns = [
        {
            field: "leaseFees_uid",
            headerName: "UID",
            flex: 1,
        },
        {
            field: "fee_name",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 1,
        },
        {
            field: "-",
            headerName: "Description",
            flex: 1,
        },
        {
            field: "available_topay",
            headerName: "In Advance",
            flex: 1,
        },
        {
            field: "charge",
            headerName: "Amount",
            flex: 1,
        },
        {
            field: "late_by",
            headerName: "Late",
            flex: 1,
        },
        {
            field: "late_fee",
            headerName: "Late Fee",
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.7,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditFeeClick(params.row)}
                    >
                        <EditIcon sx={{ color: "#3D5CAC" }} />
                    </IconButton>
                </Box>
            )
        }
    ]

    const handleEditFeeClick = (row) => {
        setcurrentFeeRow(row);
        setIsFeeEditing(true);
        handleFeeModalOpen();
    };

    const handleAddNewFee = () => {
        console.log('add', currentFeeRow);
        const newError = {};
        if (!currentFeeRow.fee_name) newError.fee_name = "Fee Name is required";
        if (!currentFeeRow.charge) newError.charge = "Charge is required";
        if (!currentFeeRow.frequency) newError.frequency = "Frequency is required";
        console.log('newError', newError);
        if (Object.keys(newError).length === 0) {
            if (isEditing === true) {
                setLeaseFees(leaseFees.map(fee => (fee.leaseFees_uid === currentFeeRow.leaseFees_uid ? currentFeeRow : fee)));
            } else {
                setLeaseFees([...leaseFees, { ...currentFeeRow, leaseFees_uid: leaseFees ? leaseFees.length : 0 }]);
            }
            handleFeeModalClose();

        } else {
            showSnackbar("Kindly enter all the required fields", "error");
            setSnackbarOpen(true);
        };

    }

    const handleFeeModalOpen = () => setOpen(true);
    const handleFeeModalClose = () => setOpen(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const dayOptionsForWeekly = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
    ];

    const dayOptionsForBiWeekly = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
        { value: "monday-week-2", label: "Monday - week 2" },
        { value: "tuesday-week-2", label: "Tuesday - week 2" },
        { value: "wednesday-week-2", label: "Wednesday - week 2" },
        { value: "thursday-week-2", label: "Thursday - week 2" },
        { value: "friday-week-2", label: "Friday - week 2" },
        { value: "saturday-week-2", label: "Saturday - week 2" },
        { value: "sunday-week-2", label: "Sunday - week 2" },
    ];

    const lateByOptionsForWeekly = [
        { value: 1, label: "1st day after due date" },
        { value: 2, label: "2nd day after due date" },
        { value: 3, label: "3rd day after due date" },
        { value: 4, label: "4th day after due date" },
        { value: 5, label: "5th day after due date" },
        { value: 6, label: "6th day after due date" },
        { value: 7, label: "7th day after due date" },
    ];

    const lateByOptionsForBiWeekly = [
        { value: 1, label: "1st day after due date" },
        { value: 2, label: "2nd day after due date" },
        { value: 3, label: "3rd day after due date" },
        { value: 4, label: "4th day after due date" },
        { value: 5, label: "5th day after due date" },
        { value: 6, label: "6th day after due date" },
        { value: 7, label: "7th day after due date" },
        { value: 8, label: "8th day after due date" },
        { value: 9, label: "9th day after due date" },
        { value: 10, label: "10th day after due date" },
        { value: 11, label: "11th day after due date" },
        { value: 12, label: "12th day after due date" },
        { value: 13, label: "13th day after due date" },
        { value: 14, label: "14th day after due date" },
    ];

    const availableToPayOptionsForWeekly = [
        { value: 1, label: "1 day before due date" },
        { value: 2, label: "2 days before due date" },
        { value: 3, label: "3 days before due date" },
        { value: 4, label: "4 days before due date" },
        { value: 5, label: "5 days before due date" },
        { value: 6, label: "6 days before due date" },
        { value: 7, label: "7 days before due date" },
    ];

    const availableToPayOptionsForBiWeekly = [
        { value: 1, label: "1 day before due date" },
        { value: 2, label: "2 days before due date" },
        { value: 3, label: "3 days before due date" },
        { value: 4, label: "4 days before due date" },
        { value: 5, label: "5 days before due date" },
        { value: 6, label: "6 days before due date" },
        { value: 7, label: "7 days before due date" },
        { value: 8, label: "8 days before due date" },
        { value: 9, label: "9 days before due date" },
        { value: 10, label: "10 days before due date" },
        { value: 11, label: "11 days before due date" },
        { value: 12, label: "12 days before due date" },
        { value: 13, label: "13 days before due date" },
        { value: 14, label: "14 days before due date" },
    ];

    const daytoValueMap = new Map([
        ["monday", 0],
        ["tuesday", 1],
        ["wednesday", 2],
        ["thursday", 3],
        ["friday", 4],
        ["saturday", 5],
        ["sunday", 6],
        ["monday-week-2", 7],
        ["tuesday-week-2", 8],
        ["wednesday-week-2", 9],
        ["thursday-week-2", 10],
        ["friday-week-2", 11],
        ["saturday-week-2", 12],
        ["sunday-week-2", 13],
    ]);

    const valueToDayMap = new Map(Array.from(daytoValueMap, ([key, value]) => [value, key]));

    const handleDueByChange = (e) => {
        const value = e.target.value;
        let currFee = { ...currentFeeRow, due_by: daytoValueMap.get(value), due_by_date: null };
        console.log('currFee', currFee, valueToDayMap);
        setcurrentFeeRow(currFee);
    }

    const handleAvailableToPayChange = (e) => {
        const value = e.target.value;
        console.log('avlToPay', value);
        let currFee = { ...currentFeeRow, available_topay: value };
        setcurrentFeeRow(currFee);
    };

    const handleLateByChange = (e) => {
        const value = e.target.value;
        console.log('lateby', value);
        let currFee = { ...currentFeeRow, late_by: value };
        setcurrentFeeRow(currFee);
    };

    const showSnackbar = (message, severity) => {
        console.log('Inside show snackbar');
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
        <>
            <Accordion sx={{ backgroundColor: color }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="occupants-content"
                    id="occupants-header"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography
                            sx={{
                                color: "#160449",
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.small,
                                textAlign: 'center',
                                paddingBottom: "10px",
                                paddingTop: "5px",
                                flexGrow: 1,
                                paddingLeft: "50px"
                            }}
                        >
                            Fee Details
                        </Typography>
                        <Button
                            sx={{
                                // background: "#3D5CAC",
                                // color: theme.palette.background.default,
                                "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                                cursor: "pointer",
                                textTransform: "none",
                                minWidth: "40px",
                                minHeight: "40px",
                                width: "40px",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}
                            size="small"
                            onClick={() => {
                                setcurrentFeeRow({
                                    fee_type: '',
                                    available_topay: '',
                                    charge: '',
                                    due_by: '',
                                    due_by_date: dayjs(),
                                    fee_name: '',
                                    frequency: 'Monthly',
                                    late_by: '',
                                    late_fee: '',
                                    perDay_late_fee: '',
                                });
                                setIsFeeEditing(false);
                                handleFeeModalOpen();
                            }}>
                            <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                        </Button>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>

                    {leaseFees && <>
                        <DataGrid
                            rows={leaseFees}
                            columns={feesColumns}
                            pageSize={10}
                            hideFooter={true}
                            rowsPerPageOptions={[10]}
                            getRowId={(row) => row.leaseFees_uid}
                            sx={{
                                '& .MuiDataGrid-columnHeader': {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "#160449",
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    font: "bold",
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: "bold",
                                },
                                '& .MuiDataGrid-cell': {
                                    color: "#160449",
                                    fontWeight: "bold",
                                },

                            }}
                        />
                        <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                        <Dialog open={open} onClose={handleFeeModalClose} maxWidth="md">
                            <DialogTitle
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: "#160449",
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                }}
                            >
                                <span style={{ flexGrow: 1, textAlign: 'center' }}>Fee Details</span>
                                <Button onClick={handleFeeModalClose} sx={{ ml: 'auto' }}>
                                    <Close sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                    }} />
                                </Button>
                            </DialogTitle>
                            <DialogContent>
                                <Grid container columnSpacing={8}>
                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Fee Name
                                        </Typography>
                                    </Grid>
                                    <Grid item md={10}>
                                        <TextField
                                            sx={{ backgroundColor: '#D6D5DA', }}
                                            margin="dense"
                                            label="Fee Name"
                                            fullWidth
                                            required
                                            variant="outlined"
                                            value={currentFeeRow?.fee_name || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, fee_name: e.target.value })}
                                        />
                                    </Grid>

                                    {/* fee type */}
                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Fee Type
                                        </Typography>
                                    </Grid>
                                    <Grid item md={10}>
                                        <TextField
                                            sx={{ backgroundColor: '#D6D5DA', }}
                                            margin="dense"
                                            label="Fee Type"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.fee_type || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, fee_type: e.target.value !== "" ? e.target.value : '$' })}
                                        />
                                    </Grid>

                                    {/* Charge */}
                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Fee Amount
                                        </Typography>
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            sx={{ backgroundColor: '#D6D5DA', }}
                                            margin="dense"
                                            label="Amount"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.charge || ''}
                                            onChange={(e) => {
                                                if (typeof parseInt(e.target.value) === "number" && !isNaN(parseInt(e.target.value))) {
                                                    setcurrentFeeRow({ ...currentFeeRow, charge: e.target.value })
                                                } else {
                                                    setcurrentFeeRow({ ...currentFeeRow, charge: 0 })
                                                }
                                            }

                                            }
                                        />
                                    </Grid>

                                    {/* Frequency */}
                                    <Grid item md={6} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Grid container>
                                            <Grid item md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                    Frequency
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8}>
                                                <FormControl sx={{ width: '335px', height: '70px' }}>
                                                    <InputLabel sx={{ color: theme.palette.grey, textAlign: 'center', paddingTop: '5px' }}>Frequency</InputLabel>
                                                    <Select
                                                        value={currentFeeRow?.frequency || ''}
                                                        onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, frequency: e.target.value })}
                                                        size="small"
                                                        fullWidth
                                                        label="Frequency"
                                                        className={classes.select}
                                                        sx={{
                                                            marginTop: "10px",
                                                            height: '50px',
                                                            backgroundColor: '#D6D5DA',
                                                        }}
                                                        required
                                                    >
                                                        <MenuItem value="One-time">One-time</MenuItem>
                                                        <MenuItem value="Weekly">Weekly</MenuItem>
                                                        <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
                                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                                        <MenuItem value="Annually">Annually</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Due Date */}
                                    <Grid item md={6}>
                                        <Grid container>
                                            <Grid item md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                    Due Date
                                                </Typography>
                                            </Grid>
                                            <Grid item md={6}>
                                                {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "") && (
                                                    <TextField
                                                        margin="dense"
                                                        name="due_by"
                                                        value={currentFeeRow.due_by !== null && currentFeeRow.due_by !== "" ? currentFeeRow.due_by : ""}
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, due_by: e.target.value, due_by_date: null })}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">{getDateAdornmentString(currentFeeRow.due_by)}</InputAdornment>,
                                                        }}
                                                        sx={{ marginLeft: '5px', width: '295px', backgroundColor: '#D6D5DA', }}
                                                    />
                                                )}

                                                {currentFeeRow && (currentFeeRow.frequency === "One-time" || currentFeeRow.frequency === "Annually") && (
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Due By"
                                                            value={currentFeeRow?.due_by_date ? dayjs(currentFeeRow.due_by_date) : null}
                                                            onChange={(e) => {
                                                                // console.log('dueby row', e)
                                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                setcurrentFeeRow({ ...currentFeeRow, due_by_date: formattedDate, due_by: null })
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
                                                    </LocalizationProvider>)}

                                                {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                                    <Box
                                                        sx={{
                                                            paddingTop: "10px",
                                                        }}
                                                    >
                                                        <Select
                                                            name="Due By"
                                                            value={currentFeeRow.due_by !== null ? valueToDayMap.get(currentFeeRow.due_by) : ""}
                                                            size="small"
                                                            fullWidth
                                                            onChange={(e) => handleDueByChange(e)}
                                                            placeholder="Select Due By Day"
                                                            className={classes.select}
                                                            sx={{ width: '295px', marginLeft: '5px', height: '40px', backgroundColor: '#D6D5DA', }}
                                                        >
                                                            {currentFeeRow.frequency &&
                                                                currentFeeRow.frequency === "Weekly" &&
                                                                dayOptionsForWeekly.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            {currentFeeRow.frequency &&
                                                                currentFeeRow.frequency === "Bi-Weekly" &&
                                                                dayOptionsForBiWeekly.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Bills post X days in advance */}
                                    <Grid item md={3} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Bills Post X Days in Advance
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "One-time" ||
                                            currentFeeRow.frequency === "Annually" || currentFeeRow.frequency === "") && (
                                                <TextField
                                                    sx={{ backgroundColor: '#D6D5DA', }}
                                                    margin="dense"
                                                    label="# Days Before"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={currentFeeRow?.available_topay || ''}
                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, available_topay: e.target.value })}
                                                />)}

                                        {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                            <Box
                                                sx={{
                                                    paddingTop: "10px",
                                                }}
                                            >
                                                <Select
                                                    sx={{ backgroundColor: '#D6D5DA', }}
                                                    name="available_topay"
                                                    value={currentFeeRow.available_topay !== null ? currentFeeRow.available_topay : ""}
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => handleAvailableToPayChange(e)}
                                                    placeholder="Select Available to Pay By Day"
                                                >
                                                    {currentFeeRow.frequency &&
                                                        currentFeeRow.frequency === "Weekly" &&
                                                        availableToPayOptionsForWeekly.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    {currentFeeRow.frequency &&
                                                        currentFeeRow.frequency === "Bi-Weekly" &&
                                                        availableToPayOptionsForBiWeekly.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </Box>
                                        )}
                                    </Grid>


                                    {/* Late after x days */}
                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Late After X Days
                                        </Typography>
                                    </Grid>
                                    <Grid item md={4}>
                                        {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "One-time" || currentFeeRow.frequency === "Annually" || currentFeeRow.frequency === "") && (
                                            <TextField
                                                sx={{ backgroundColor: '#D6D5DA', }}
                                                margin="dense"
                                                label="# Days By"
                                                fullWidth
                                                variant="outlined"
                                                value={currentFeeRow?.late_by || ''}
                                                onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_by: e.target.value })}
                                            />
                                        )}

                                        {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                            <Box
                                                sx={{
                                                    paddingTop: "10px",
                                                }}
                                            >
                                                <Select
                                                    sx={{ backgroundColor: '#D6D5DA', }}
                                                    name="late_by"
                                                    value={currentFeeRow.late_by !== null ? currentFeeRow.late_by : ""}
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => handleLateByChange(e)}
                                                    placeholder="Select Late By Day"
                                                >
                                                    {currentFeeRow.frequency &&
                                                        currentFeeRow.frequency === "Weekly" &&
                                                        lateByOptionsForWeekly.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    {currentFeeRow.frequency &&
                                                        currentFeeRow.frequency === "Bi-Weekly" &&
                                                        lateByOptionsForBiWeekly.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </Box>
                                        )}
                                    </Grid>

                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            One Time Late Fee
                                        </Typography>
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            sx={{ backgroundColor: '#D6D5DA', }}
                                            margin="dense"
                                            label="Amount"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.late_fee || ''}
                                            onChange={(e) => {
                                                if (typeof parseInt(e.target.value) === "number" && !isNaN(parseInt(e.target.value))) {
                                                    setcurrentFeeRow({ ...currentFeeRow, late_fee: e.target.value })
                                                } else {
                                                    setcurrentFeeRow({ ...currentFeeRow, late_fee: null })
                                                }
                                            }
                                            }
                                        />
                                    </Grid>

                                    <Grid md={6} />

                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                            Per Day Late Fee
                                        </Typography>
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            sx={{ backgroundColor: '#D6D5DA', }}
                                            margin="dense"
                                            label="Amount"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.perDay_late_fee || ''}
                                            onChange={(e) => {
                                                if (typeof parseInt(e.target.value) === "number" && !isNaN(parseInt(e.target.value))) {
                                                    setcurrentFeeRow({ ...currentFeeRow, perDay_late_fee: e.target.value })
                                                } else {
                                                    setcurrentFeeRow({ ...currentFeeRow, perDay_late_fee: null })
                                                }
                                            }
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ alignContent: "center", justifyContent: "center" }}>
                                <Button variant="outlined"
                                    sx={{
                                        background: "#F87C7A",
                                        color: "#160449",
                                        cursor: "pointer",
                                        width: "100px",
                                        height: "31px",
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#f76462',
                                        },
                                    }}
                                    onClick={handleFeeModalClose}>
                                    Cancel
                                </Button>
                                <Button variant="outlined"
                                    sx={{
                                        marginRight: '5px', background: "#FFC614",
                                        color: "#160449",
                                        cursor: "pointer",
                                        width: "100px",
                                        height: "31px",
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#fabd00',
                                        },
                                    }}
                                    onClick={handleAddNewFee}>
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    }
                </AccordionDetails>
            </Accordion>
        </>
    )

}

export default FeesDetails;
