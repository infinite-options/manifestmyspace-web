import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Typography,
    FormControl, InputLabel, Select, MenuItem, Grid, Snackbar, Alert, AlertTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme/theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Close } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    // textField: {
    //     '& .MuiInputBase-root': {
    //         backgroundColor: '#D6D5DA',
    //     },
    //     '& .MuiInputLabel-root': {
    //         textAlign: 'center',
    //         top: '50%',
    //         left: '50%',
    //         transform: 'translate(-50%, -50%)',
    //         width: '100%',
    //         pointerEvents: 'none',
    //     },
    //     '& .MuiInputLabel-shrink': {
    //         top: 0,
    //         left: 50,
    //         transformOrigin: 'top center',
    //         textAlign: 'left',
    //         color: '#9F9F9F',
    //     },
    //     '& .MuiInputLabel-shrink.Mui-focused': {
    //         color: '#9F9F9F',
    //     },
    //     '& .MuiInput-underline:before': {
    //         borderBottom: 'none',
    //     },
    // },
    alert: {
        marginTop: theme.spacing(2),
    },
    select: {
        '& .MuiInputBase-root': {
            backgroundColor: '#D6D5DA',
            height: '30px',
            padding: '0 14px',
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '10px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(14px, 10px) scale(1)',
        },
        '& .MuiSvgIcon-root': {
            fontSize: '20px',
        },
    },
}));

const VehiclesOccupant = ({ leaseVehicles, setLeaseVehicles, states, editOrUpdateLease, setModifiedData, modifiedData, dataKey }) => {
    console.log('Inside vehicles occupants', leaseVehicles);
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const color = theme.palette.form.main;
    const classes = useStyles();
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isUpdated, setIsUpdated] = useState(false);


    useEffect(() => {
        console.log('inside mod vehicles', modifiedData);
        if (modifiedData && modifiedData.length > 0) {
            editOrUpdateLease();
            handleClose();
        }
    }, [isUpdated]);

    useEffect(() => {
        if (leaseVehicles && leaseVehicles.length > 0) {
            //Need Id for datagrid
            const vehWithIds = leaseVehicles.map((veh, index) => ({ ...veh, id: index }));
            setVehicles(vehWithIds);
        }
    }, [leaseVehicles]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
        setIsEditing(false);
        setIsUpdated(false);
    };

    const isRowModified = (originalRow, currentRow) => {
        return JSON.stringify(originalRow) !== JSON.stringify(currentRow);
    };

    const showSnackbar = (message, severity) => {
        console.log('Inside show snackbar');
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSave = () => {
        if (isEditing) {
            if (isRowModified(vehicles[currentRow['id']], currentRow) === true) {
                const updatedRow = vehicles.map(veh => (veh.id === currentRow.id ? currentRow : veh));
                //Save pets back in DB without ID field
                const rowWithoutId = updatedRow.map(({ id, ...rest }) => rest);
                setModifiedData((prev) => [...prev, { key: dataKey, value: rowWithoutId }]);
                setIsUpdated(true);
            } else {
                showSnackbar("You haven't made any changes to the form. Please save after changing the data.", "error");
            }

        } else {
            setModifiedData((prev) => [...prev, { key: dataKey, value: [...leaseVehicles, { ...currentRow }] }])
            setIsUpdated(true);
        }
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDelete = (id) => {
        const filtered = vehicles.filter(veh => veh.id !== currentRow.id);
        const rowWithoutId = filtered.map(({ id, ...rest }) => rest);
        setModifiedData((prev) => [...prev, { key: dataKey, value: rowWithoutId }]);
        setIsUpdated(true);
    };

    const handleDeleteClick = () => {
        setOpenDeleteConfirmation(true);
    };

    const handleDeleteClose = () => {
        setOpenDeleteConfirmation(false);
    };

    const handleDeleteConfirm = () => {
        handleDelete();
        setOpenDeleteConfirmation(false);
    }

    const columns = [
        { field: 'year', headerName: 'Year', flex: 1, editable: true },
        { field: 'make', headerName: 'Company', flex: 1, editable: true },
        { field: 'model', headerName: 'Model', flex: 1, editable: true },
        { field: 'license', headerName: 'License Plate', flex: 1, editable: true },
        { field: 'state', headerName: 'State', flex: 1, editable: true },
        { field: 'owner', headerName: 'Owner', flex: 1, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon sx={{ color: "#3D5CAC" }} />} label="Edit" onClick={() => handleEditClick(params.row)} />,
                // <GridActionsCellItem icon={<DeleteIcon sx={{color:"#3D5CAC"}}/>} label="Delete" onClick={() => handleDeleteClick(params.id)} />,
            ],
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginLeft: '5px' }}>
                    Vehicles ({leaseVehicles.length})</Typography>
                <Button
                    sx={{
                        "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                        cursor: "pointer",
                        textTransform: "none",
                        minWidth: "40px",
                        minHeight: "40px",
                        width: "40px",
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.smallFont,
                        margin: "5px",
                    }}
                    onClick={() => { setCurrentRow({ id: null, year: '', make: '', model: '', license: '', state: '', owner: '' }); handleOpen(); }}>
                    <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                </Button>
            </Box>
            {leaseVehicles && leaseVehicles.length > 0 &&
                <DataGrid
                    rows={vehicles}
                    columns={columns}
                    hideFooter={true}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableSelectionOnClick
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
                />}
            <Dialog open={open} onClose={handleClose}  maxWidth="md">
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
                    <span style={{ flexGrow: 1, textAlign: 'center' }}>Vehicle Details</span>
                    <Button onClick={handleClose} sx={{ ml: 'auto' }}>
                        <Close sx={{
                            color: theme.typography.primary.black,
                            fontSize: '20px',
                        }} />
                    </Button>
                </DialogTitle>
                <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                        <AlertTitle>{snackbarSeverity === "error" ? "Error" : "Success"}</AlertTitle>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <DialogContent>
                    <Grid container columnSpacing={6}>
                        <Grid item md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Year"
                                    value={currentRow?.year ? dayjs(currentRow.year) : null}
                                    onChange={(e) => {
                                        const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                        setCurrentRow({ ...currentRow, year: formattedDate })
                                    }
                                    }
                                    sx={{ marginTop: "10px", backgroundColor: '#D6D5DA', width: '450px' }}
                                    fullWidth
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: '10px',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Make"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.make || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, make: e.target.value })}
                                InputLabelProps={{
                                    style: {
                                        // fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                                sx={{ backgroundColor: '#D6D5DA', }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Model"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.model || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, model: e.target.value })}
                                InputLabelProps={{
                                    style: {
                                        // fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                                sx={{ backgroundColor: '#D6D5DA', }}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="License Plate"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.license || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, license: e.target.value })}
                                InputLabelProps={{
                                    style: {
                                        // fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                                sx={{ backgroundColor: '#D6D5DA', }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <FormControl margin="dense" fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                                <InputLabel>State</InputLabel>
                                <Select
                                    className={classes.select}
                                    margin="dense"
                                    label="State"
                                    fullWidth
                                    required
                                    variant="outlined"
                                    value={currentRow?.state.toUpperCase() || ''}
                                    onChange={(e) => setCurrentRow({ ...currentRow, state: e.target.value })}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    {states && states.map((state) => (
                                        <MenuItem key={state.list_uid} value={state.list_item}>
                                            {state.list_item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Owner"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.owner || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, owner: e.target.value })}
                                InputLabelProps={{
                                    style: {
                                        // fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                                sx={{ backgroundColor: '#D6D5DA', }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                {/* <DialogActions> */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                    <Button
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
                        onClick={handleSave} color="primary">
                        Save
                    </Button>
                    {isEditing && 
                    <>
                    <Button
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
                        onClick={handleDeleteClick} color="secondary">
                        Delete
                    </Button>
                    <Dialog
                        open={openDeleteConfirmation}
                        onClose={handleDeleteClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this Vehicle Details?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClose} color="primary" sx={{
                                textTransform: "none", background: "#F87C7A",
                                color: "#160449",
                                cursor: "pointer", fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont, '&:hover': {
                                    backgroundColor: '#f76462',
                                },
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteConfirm} color="primary" autoFocus sx={{
                                textTransform: "none", background: "#FFC614",
                                color: "#160449",
                                cursor: "pointer", fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                                '&:hover': {
                                    backgroundColor: '#fabd00',
                                },
                            }}>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                    </>}
                </Box>
                {/* </DialogActions> */}
            </Dialog>
        </Box>
    );
};

export default VehiclesOccupant;
