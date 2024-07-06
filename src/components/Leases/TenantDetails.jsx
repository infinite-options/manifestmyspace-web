import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box, Button, Modal, TextField, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails,
    Grid, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import theme from "../../theme/theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    textField: {
        '& .MuiInputBase-root': {
            backgroundColor: '#D6D5DA',
        },
        '& .MuiInputLabel-root': {
            textAlign: 'center',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            pointerEvents: 'none',
        },
        '& .MuiInputLabel-shrink': {
            top: 0,
            left: 50,
            transformOrigin: 'top center',
            textAlign: 'left',
            color: '#9F9F9F',
        },
        '& .MuiInputLabel-shrink.Mui-focused': {
            color: '#9F9F9F',
        },
        '& .MuiInput-underline:before': {
            borderBottom: 'none',
        },
    },
    alert: {
        marginTop: theme.spacing(2),
    },
}));

const TenantDetails = ({ tenantWithId }) => {
    console.log('tenantwithid', tenantWithId);
    const classes = useStyles();
    const [rows, setRows] = useState(tenantWithId);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [totalResponsility, setTotalResponsibility] = useState(0);
    const [resp, setResp] = useState(0);
    const [error, setError] = useState(null);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const color = theme.palette.form.main;

    useEffect(() => {
        const total = calculateTotalResponsibility();
        setTotalResponsibility(total);
    }, [])

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
            headerName: '',
            flex: 0.7,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditClick(params.row)}
                    >
                        <EditIcon sx={{ color: "#3D5CAC" }} />
                    </IconButton>
                </Box>
            )
        }
    ]

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddClick = (e) => {
        e.stopPropagation();
        const total = calculateTotalResponsibility();
        console.log('add', total)
        if (total <= 100) {
            setError(null);
        }
        setCurrentRow({
            tenant_first_name: "", tenant_last_name: "", tenant_phone_number: "", tenant_email: "", tenant_ssn: "",
            tenant_license: "", lt_responsibility: ""
        });
        setIsEditing(false);
        handleOpen();
    };

    const handleEditClick = (row) => {
        const total = calculateTotalResponsibility();
        console.log('edit', total)
        if (total <= 100) {
            setError(null);
        }
        setResp(Number(row.lt_responsibility));
        setCurrentRow(row);
        setIsEditing(true);
        handleOpen();
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

    const handleDelete = () => {
        let currTotalResp = 0;
        currTotalResp = totalResponsility - Number(currentRow.lt_responsibility);
        setTotalResponsibility(currTotalResp);
        if (currTotalResp <= 100) {
            setError(null);
        }
        setRows(rows.filter(row => row.tenant_uid !== currentRow.tenant_uid));
        handleClose();
    }

    const handleSave = () => {
        let currTotalResp = calculateTotalResponsibility();
        if (isEditing) {
            console.log('in edit', resp, totalResponsility);
            currTotalResp = currTotalResp - resp;
        }
        console.log('before', currTotalResp);
        currTotalResp = currTotalResp + Number(currentRow.lt_responsibility);
        console.log('after', currTotalResp);
        if (currTotalResp > 100) {
            setError("The total responsibility shared by all tenants should not exceed 100%.")
        } else {
            setError(null);
            if (isEditing) {
                currTotalResp = totalResponsility + Number(currentRow.lt_responsibility);
                setRows(rows.map(row => (row.tenant_uid === currentRow.tenant_uid ? currentRow : row)));
            } else {
                setRows([...rows, { ...currentRow, tenant_uid: rows.length }]);
            }
            setTotalResponsibility(currTotalResp);
            handleClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRow({ ...currentRow, [name]: value });
    };

    const calculateTotalResponsibility = () => {
        let total = 0;
        for (let i = 0; i < rows.length; i++) {
            total += rows[i].lt_responsibility !== null ? Number(rows[i].lt_responsibility) : 0;
        }
        console.log('total', total)
        return total
    }

    const handleCloseButton = () => {
        handleClose();
    }

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
                            <AddIcon sx={{ color: "#160449", fontSize: "18px" }} />
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
                </AccordionDetails>
            </Accordion>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{
                            color: "#160449",
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.small,
                            flexGrow: 1, // Make the Typography grow to take available space
                            textAlign: 'center', // Center the text
                        }}>
                            Tenant Details
                        </Typography>
                        <Button onClick={handleCloseButton} sx={{ ml: 'auto' }}>
                            <Close sx={{
                                color: theme.typography.primary.black,
                                fontSize: '20px',
                                margin: '5px',
                            }} />
                        </Button>
                    </Box>
                    {error !== null && (
                        <Alert severity="error" className={classes.alert}>
                            {error}
                        </Alert>
                    )}
                    <Grid container columnSpacing={6}>
                        <Grid item md={12}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                Tenant Name
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_first_name"
                                label="First Name"
                                margin="normal"
                                value={currentRow && currentRow.tenant_first_name}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_last_name"
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_last_name}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item md={12} sx={{ marginTop: '10px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Contact Info
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_phone_number"
                                label="Phone Number"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_phone_number}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_email"
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_email}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item md={12} sx={{ marginTop: '10px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Details
                            </Typography>
                        </Grid>

                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_drivers_license_number"
                                label="Drivers License"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_drivers_license_number}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="tenant_ssn"
                                label="Social Security Number"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.tenant_ssn}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item md={12} sx={{ marginTop: '15px' }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>
                                Additional Details (Changes Require Signature Loop)
                            </Typography>
                        </Grid>
                        <Grid item md={2.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontSize: "12px", color: "#273B4A", marginTop: "20px" }}>
                                Responsibility %
                            </Typography>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                className={classes.textField}
                                name="lt_responsibility"
                                label="Responsibility"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.lt_responsibility}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: {
                                        height: '30px',
                                        padding: '0 14px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: "20px" }}>
                        <Button onClick={handleSave} sx={{
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
                        }}>Save</Button>
                        <Button onClick={handleDeleteClick} sx={{
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
                        }}>Delete</Button>

                        <Dialog
                            open={openDeleteConfirmation}
                            onClose={handleDeleteClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this tenant?
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
