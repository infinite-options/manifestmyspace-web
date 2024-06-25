import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme/theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const VehiclesOccupant = ({ leaseVehicles, setLeaseVehicles }) => {
    console.log('Inside vehicles occupants', leaseVehicles);
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const color = theme.palette.form.main;

    useEffect(() => {
        if (leaseVehicles && leaseVehicles.length > 0) {
            const vehWithIds = leaseVehicles.map((veh, index) => ({ ...veh, id: index }));
            setVehicles(vehWithIds);
        }
    }, [leaseVehicles]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (isEditing) {
            setVehicles(vehicles.map(veh => (veh.id === currentRow.id ? currentRow : veh)));
            setLeaseVehicles(vehicles.map(veh => (veh.id === currentRow.id ? currentRow : veh)));
        } else {
            setVehicles([...vehicles, { ...currentRow, id: vehicles.length + 1 }]);
            setLeaseVehicles([...vehicles, { ...currentRow, id: vehicles.length + 1 }]);
        }
        handleClose();
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDeleteClick = (id) => {
        setVehicles(vehicles.filter(veh => veh.id !== id));
        setLeaseVehicles(vehicles.filter(veh => veh.id !== id));
    };

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
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(params.id)} />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginLeft: '5px' }}>
                    Vehicles ({vehicles.length})</Typography>
                <Button
                    sx={{
                        background: "#3D5CAC",
                        color: theme.palette.background.default,
                        cursor: "pointer",
                        textTransform: "none",
                        minWidth: "40px",
                        minHeight: "40px",
                        width: "40px",
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.smallFont,
                        marginBottom: "5px",
                    }}
                    onClick={() => { setCurrentRow({ id: null, year: '', make: '', model: '', license: '', state: '', owner: '' }); handleOpen(); }}>
                    <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                </Button>
            </Box>
            {leaseVehicles && leaseVehicles.length > 0 &&
                <DataGrid
                    rows={vehicles}
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
                <DialogTitle>{isEditing ? 'Edit vehicle' : 'Add New Vehicle'}</DialogTitle>
                <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Year"
                            value={currentRow?.year ? dayjs(currentRow.year) : null}
                            onChange={(e) => {
                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                setCurrentRow({ ...currentRow, year: formattedDate })
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
                        label="Company"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.make || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, make: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Model"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.model || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, model: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="License Plate"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.license || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, license: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="State"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.state || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, state: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Owner"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.owner || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, owner: e.target.value })}
                    />
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

export default VehiclesOccupant;
