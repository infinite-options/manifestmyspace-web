import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField,
    Typography, FormControl, InputLabel, Select, MenuItem, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme/theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@mui/icons-material';

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

const AdultOccupant = ({ leaseAdults, setLeaseAdults, relationships }) => {
    console.log('Inside Adult occupants', leaseAdults, relationships);
    const [adults, setAdults] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const color = theme.palette.form.main;
    const classes = useStyles();
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (leaseAdults && leaseAdults.length > 0) {
            console.log('leaseAdults', leaseAdults, typeof (leaseAdults));
            const adultsWithIds = leaseAdults.map((adult, index) => ({ ...adult, id: index }));
            setAdults(adultsWithIds);
        }
    }, [leaseAdults]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (isEditing) {
            setAdults(adults.map(adult => (adult.id === currentRow.id ? currentRow : adult)));
            setLeaseAdults(adults.map(adult => (adult.id === currentRow.id ? currentRow : adult)));
        } else {
            setAdults([...adults, { ...currentRow, id: adults.length + 1 }]);
            setLeaseAdults([...adults, { ...currentRow, id: adults.length + 1 }]);
        }
        handleClose();
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDelete = () => {
        setAdults(adults.filter(adult => adult.id !== currentRow.id));
        setLeaseAdults(adults.filter(adult => adult.id !== currentRow.id));
        handleClose();
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
        { field: 'dob', headerName: 'Date of Birth', flex: 1, editable: true },
        { field: 'name', headerName: 'First Name', flex: 1, editable: true },
        { field: 'last_name', headerName: 'Last Name', flex: 1, editable: true },
        { field: 'email', headerName: 'Email', flex: 1, editable: true },
        { field: 'phone_number', headerName: 'Phone Number', flex: 1, editable: true },
        { field: 'relationship', headerName: 'Relationship', flex: 1, editable: true },
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
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginLeft: '5px' }}>Adults ({adults.length})</Typography>
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
                    onClick={() => {
                        setCurrentRow({
                            id: null, name: '', last_name: '', dob: '', email: '', phone_number: '',
                            relationship: '', tenant_drivers_license_number: "", tenant_ssn: ""
                        }); handleOpen();
                    }}>
                    <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                </Button>
            </Box>
            {leaseAdults && leaseAdults.length > 0 &&
                <DataGrid
                    rows={adults}
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
            <Dialog open={open} onClose={handleClose} maxWidth="md">
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
                    <span style={{ flexGrow: 1, textAlign: 'center' }}>Occupancy Details</span>
                    <Button onClick={handleClose} sx={{ ml: 'auto' }}>
                        <Close sx={{
                            color: theme.typography.primary.black,
                            fontSize: '20px',
                        }} />
                    </Button>
                </DialogTitle>

                <DialogContent>
                    <Grid container columnSpacing={6}>
                        <Grid item md={12} sx={{ marginTop: '20px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                Resident Name
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="First Name"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.name || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, name: e.target.value })}
                                sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Last Name"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.last_name || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, last_name: e.target.value })}
                                sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>

                        <Grid item md={12} sx={{ marginTop: '20px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                Contact Info
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.email || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, email: e.target.value })}
                                sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Phone Number"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.phone_number || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, phone_number: e.target.value })}
                                 sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>

                        <Grid item md={12} sx={{ marginTop: '20px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                Details
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Drivers License"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.tenant_drivers_license_number || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, tenant_drivers_license_number: e.target.value })}
                                sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                margin="dense"
                                label="Social Security Number"
                                fullWidth
                                variant="outlined"
                                value={currentRow?.tenant_ssn || ''}
                                onChange={(e) => setCurrentRow({ ...currentRow, tenant_ssn: e.target.value })}
                                sx={{backgroundColor: '#D6D5DA',}}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date Of Birth"
                                    value={currentRow?.dob ? dayjs(currentRow.dob) : null}
                                    onChange={(e) => {
                                        const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                        setCurrentRow({ ...currentRow, dob: formattedDate })
                                    }
                                    }
                                    sx={{ marginTop: "8px", backgroundColor: '#D6D5DA', width:'450px'}}
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
                            <FormControl margin="dense" fullWidth variant="outlined" sx={{ height: "30px" }}>
                                <InputLabel>
                                    Relationship
                                </InputLabel>
                                <Select
                                    className={classes.select}
                                    margin="dense"
                                    label="Relationship"
                                    fullWidth
                                    required
                                    variant="outlined"
                                    value={currentRow?.relationship || ''}
                                    onChange={(e) => setCurrentRow({ ...currentRow, relationship: e.target.value })}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    {relationships && relationships.map((reln) => (
                                        <MenuItem key={reln.list_uid} value={reln.list_item}>
                                            {reln.list_item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                Are you sure you want to delete this Occupant?
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

export default AdultOccupant;
