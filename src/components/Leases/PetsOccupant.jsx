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

const PetsOccupant = ({ leasePets, setLeasePets }) => {
    console.log('Inside Pets occupants', leasePets);
    const [pets, setPets] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const color = theme.palette.form.main;

    useEffect(() => {
        if (leasePets && leasePets.length > 0) {
            console.log('leasePets', leasePets, typeof (leasePets));
            const petsWithIds = leasePets.map((pet, index) => ({ ...pet, id: index }));
            setPets(petsWithIds);
        }
    }, [leasePets]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (isEditing) {
            setPets(pets.map(pet => (pet.id === currentRow.id ? currentRow : pet)));
            setLeasePets(pets.map(pet => (pet.id === currentRow.id ? currentRow : pet)));
        } else {
            setPets([...pets, { ...currentRow, id: pets.length + 1 }]);
            setLeasePets([...pets, { ...currentRow, id: pets.length + 1 }]);
        }
        handleClose();
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDeleteClick = (id) => {
        setPets(pets.filter(pet => pet.id !== id));
        setLeasePets(pets.filter(pet => pet.id !== id));
    };

    const columns = [
        { field: 'type', headerName: 'Type', flex: 1, editable: true },
        { field: 'name', headerName: 'First Name', flex: 1, editable: true },
        { field: 'last_name', headerName: 'Last Name', flex: 1, editable: true },
        { field: 'breed', headerName: 'Breed', flex: 1, editable: true },
        { field: 'weight', headerName: 'Weight', flex: 1, editable: true },
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
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginLeft: '5px' }}>Pets ({pets.length})</Typography>
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
                    onClick={() => { setCurrentRow({ id: null, name: '', last_name: '', type: '', breed: '', weight: '', owner: '' }); handleOpen(); }}>
                    <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                </Button>
            </Box>
            {leasePets && leasePets.length > 0 &&
                <DataGrid
                    rows={pets}
                    columns={columns}
                    hideFooter={true}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            justifyContent: 'center',
                            alignItems: 'center',
                            // color: "#3D5CAC",
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            font: "bold",
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: "bold",
                        },
                        '& .MuiDataGrid-cell': {
                            // color: "#3D5CAC",
                            fontWeight: "bold",
                        },

                    }}
                />}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
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
                    <TextField
                        margin="dense"
                        label="Type"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.type || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, type: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Breed"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.breed || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, breed: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Weight"
                        fullWidth
                        variant="outlined"
                        value={currentRow?.weight || ''}
                        onChange={(e) => setCurrentRow({ ...currentRow, weight: e.target.value })}
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

export default PetsOccupant;
