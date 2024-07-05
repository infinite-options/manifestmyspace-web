import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal, TextField, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme/theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const TenantDetails = ({ tenantWithId }) => {
    console.log('tenantwithid', tenantWithId);
    const classes = useStyles();
    const [rows, setRows] = useState(tenantWithId);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const color = theme.palette.form.main;

    const tenantColumns = [
        {
            field: "tenant_uid",
            headerName: "UID",
            flex: 1,
        },
        {
            field: "tenant_first_name",
            headerName: "First Name",
            flex: 1,
        },
        {
            field: "tenant_last_name",
            headerName: "Last Name",
            flex: 1,
        },
        {
            field: "tenant_email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "tenant_phone_number",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "lt_responsibility",
            headerName: "Responsibility",
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditClick(params.row)}
                    >
                        <EditIcon sx={{color:"#3D5CAC"}}/>
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteClick(params.row.tenant_uid)}
                    >
                        <DeleteIcon sx={{color:"#3D5CAC"}}/>
                    </IconButton>
                </Box>
            )
        }
    ]

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddClick = () => {
        setCurrentRow({ tenant_first_name: "", tenant_last_name: "", tenant_phone_number: "", tenant_email: "", lt_responsibility: "" });
        setIsEditing(false);
        handleOpen();
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDeleteClick = (tenant_uid) => {
        console.log('param', tenant_uid);
        setRows(rows.filter(row => row.tenant_uid !== tenant_uid));
    };

    const handleSave = () => {
        if (isEditing) {
            setRows(rows.map(row => (row.tenant_uid === currentRow.tenant_uid ? currentRow : row)));
        } else {
            setRows([...rows, { ...currentRow, tenant_uid: rows.length + 1 }]);
        }
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRow({ ...currentRow, [name]: value });
    };

    return (
        <div>
            <Accordion sx={{ backgroundColor: color }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="documents-content"
                    id="documents-header"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.small,
                                textAlign: 'center',
                                paddingBottom: "10px",
                                paddingTop: "5px",
                                flexGrow: 1,
                                paddingLeft: "50px"
                            }}
                        >
                            Tenant Details
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{
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
                            onClick={handleAddClick}
                        >
                            <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                        </Button>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <DataGrid
                        rows={rows}
                        columns={tenantColumns}
                        hideFooter={true}
                        rowsPerPageOptions={[]}
                        getRowId={(row) => row.tenant_uid}
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
                    />
                </AccordionDetails>
            </Accordion>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="simple-modal-title" textAlign="center">
                        {isEditing ? 'Edit Tenant' : 'Add Tenant'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Tenant Name
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                name="tenant_first_name"
                                label="First Name"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_first_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                name="tenant_last_name"
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_last_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Contact Info
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                name="tenant_phone_number"
                                label="Phone Number"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_phone_number}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                name="tenant_email"
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_email}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Additionale Details (Changes Require Signature Loop)
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                name="lt_responsibility"
                                label="Responsibility"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.lt_responsibility}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: "20px" }}>
                        <Button onClick={handleClose} sx={{
                            marginRight: '5px', background: "#3D5CAC",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                        }}>Cancel</Button>
                        <Button onClick={handleSave} sx={{
                            background: "#ffa500",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                        }}>{isEditing ? "Save" : "Add"}</Button>
                    </Box>
                </div>
            </Modal>
        </div>
    );
};

// Helper function to position the modal
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default TenantDetails;
