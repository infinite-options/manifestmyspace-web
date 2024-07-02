import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
    Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme/theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AdultOccupant = ({ leaseAdults, setLeaseAdults, relationships }) => {
    console.log('Inside Adult occupants', leaseAdults, relationships);
    const [adults, setAdults] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const color = theme.palette.form.main;

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

    const handleDeleteClick = (id) => {
        setAdults(adults.filter(adult => adult.id !== id));
        setLeaseAdults(adults.filter(adult => adult.id !== id));
    };

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
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(params.id)} />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%' }}>
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
                    onClick={() => { setCurrentRow({ id: null, name: '', last_name: '', dob: '', email: '', phone_number: '', relationship: '' }); handleOpen(); }}>
                    <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                </Button>
            </Box>
            {leaseAdults && leaseAdults.length > 0 &&
                <DataGrid
                    rows={adults}
                    columns={columns}
                    pageSize={5}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: "#3D5CAC",
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            font: "bold",
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: "bold",
                        },
                        '& .MuiDataGrid-cell': {
                            color: "#3D5CAC",
                            fontWeight: "bold",
                        },

                    }}
                />}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Edit Adult' : 'Add New Adult'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="First Name"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.name || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.last_name || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, last_name: e.target.value })}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date Of Birth"
                            value={currentRow?.dob ? dayjs(currentRow.dob) : null}
                            onChange={(e) => {
                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                setCurrentRow({ ...currentRow, dob: formattedDate })
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
                            sx={{ marginTop: "10px" }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.email || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.phone_number || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, phone_number: e.target.value })}
                    />
                    <FormControl margin="dense" fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                        <InputLabel required>Relationship</InputLabel>
                        <Select
                          margin="dense"
                          label="Relationship"
                          fullWidth
                          required
                          variant="outlined"
                          value={currentRow?.relationship || ''}
                          onChange={(e) => setCurrentRow({ ...currentRow, relationship: e.target.value })}
                        >
                          {relationships && relationships.map((reln) => (
                            <MenuItem key={reln.list_uid} value={reln.list_item}>
                              {reln.list_item}
                            </MenuItem>
                          ))}

                        </Select>
                      </FormControl>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                background: "#3D5CAC",
                                color: theme.palette.background.default,
                                cursor: "pointer",
                                textTransform: "none",
                                width: "30%",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}
                            size="small"
                            onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                background: "#3D5CAC",
                                color: theme.palette.background.default,
                                cursor: "pointer",
                                textTransform: "none",
                                width: "30%",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}
                            size="small"
                            onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdultOccupant;
