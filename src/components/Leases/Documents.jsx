import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Box, Typography, Button, Modal, TextField, Grid, Alert, Snackbar,
    MenuItem, FormControl, InputLabel, Select, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import theme from "../../theme/theme";
import DescriptionIcon from "@mui/icons-material/Description";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@mui/icons-material/Edit';
import LeaseIcon from "../Property/leaseIcon.png";
import { Close } from '@mui/icons-material';

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

const Documents = ({ documents, setDocuments, setuploadedFiles, editOrUpdateLease, documentsRef, setDeletedFiles }) => {

    console.log("ROHIT - Documents - props.documents - ", documents);
    const [open, setOpen] = useState(false);
    const [currentRow, setcurrentRow] = useState(null);
    const color = theme.palette.form.main;
    const [isEditing, setIsEditing] = useState(false);
    const [newFiles, setNewFiles] = useState(null);
    const classes = useStyles();
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFilePreview(null);
        setOpen(false)
    };

    const checkRequiredFields = () => {
        let retVal = true;
        console.log('name', currentRow.filename);
        console.log('type', currentRow.type);

        if (!currentRow.filename) {
            console.error('Filename is either empty, null, or undefined.');
            return false;
        }

        if (!currentRow.type) {
            console.error('Type is either empty, null, or undefined.');
            return false;
        }

        //update setDocuments
        if (isEditing === true) {
            console.log('current row is', currentRow);
            const updatedDocuments = documents.map(doc => (doc.id === currentRow.id ? currentRow : doc));
            setDocuments(updatedDocuments);
            const updatedDocsWithoutId = updatedDocuments.map(({ id, ...rest })=>rest);
            documentsRef.current = updatedDocsWithoutId;
        } else {
            console.log('arr', newFiles);
            setDocuments((prevFiles) => [...prevFiles, currentRow]);
        }
        return retVal;
    }

    const handleFileUpload = (e) => {
        console.log('uploaded file', e.target.files);
        console.log('documents', documents);
        if (isEditing === true) {
            const curr = { ...currentRow, filename: e.target.files[0].name };
            setcurrentRow(curr);
        } else {
            const curr = { ...currentRow, filename: e.target.files[0].name, id: documents.length };
            console.log('curr', curr);
            setcurrentRow(curr);
        }

        const filesArray = Array.from(e.target.files).map(file => ({
            name: file.name,
            type: currentRow.type,
            file: file
        }));
        console.log('filesArray', filesArray);
        setNewFiles(filesArray);
        setuploadedFiles(filesArray);
        // Create a URL for the file preview
        const file = e.target.files[0];
        setFilePreview(URL.createObjectURL(file));
    };

    const showSnackbar = (message, severity) => {
        console.log('Inside show snackbar');
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSubmit = () => {
        const isValid = checkRequiredFields();
        if (isValid === true) {
            console.log('success occured');
            editOrUpdateLease();
            handleClose();
        } else {
            console.log('error occured');
            showSnackbar("Kindly enter all the required fields", "error");
            setSnackbarOpen(true);
        }
    };

    const handleEditClick = (row) => {
        console.log('on edit', row);
        setFilePreview(row.link);
        setcurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };

    const handleDelete = async () => {
        console.log("currentRow.id", currentRow.id);
        const updatedDocuments = documents.filter(doc => doc.id !== currentRow.id);
        setDocuments(updatedDocuments);
        const updatedDocsWithoutId = updatedDocuments.map(({ id, ...rest })=>rest);
        documentsRef.current = updatedDocsWithoutId;
        setDeletedFiles((prevDocs) => [...prevDocs, currentRow.link]);
        // console.log("currentRow.id", currentRow.id);
        await editOrUpdateLease();
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
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const docsColumns = [
        {
            field: "id",
            headerName: "UID",
            flex: 0.5,
        },
        {
            field: "filename",
            headerName: "Name",
            flex: 1,
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "link",
            headerName: "Link",
            flex: 0.5,
            renderCell: (params) => {
                // console.log('params', params);
                return (
                    <Button
                        sx={{
                            padding: "0px",
                            '&:hover': {
                                backgroundColor: theme.palette.form.main,
                            },
                        }}
                        className=".MuiButton-icon"
                        onClick={() =>
                            window.open(params.value, "_blank", "rel=noopener noreferrer")
                        }
                    >
                        <img src={LeaseIcon} />
                    </Button>
                )
            },
        },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
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

    return (
        <div>
            <Accordion sx={{ backgroundColor: color }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="documents-content"
                    id="documents-header"
                >
                    <Grid container>
                        <Grid item md={11.2}>
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
                                Documents
                            </Typography>
                        </Grid>
                        <Grid item md={0.5}>
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
                                }}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setcurrentRow({
                                        filename: '',
                                        type: '',
                                        link: ''
                                    });
                                    setIsEditing(false);
                                    handleOpen();
                                }}
                            >
                                <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <DataGrid
                        rows={documents}
                        columns={docsColumns}
                        hideFooter={true}
                        getRowId={(row) => row.id}
                        autoHeight
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
                aria-labelledby="add-document-modal"
                aria-describedby="add-document-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 841,
                    height: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography id="add-document-modal" variant="h6" component="h2" textAlign='center' sx={{
                            color: "#160449",
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.small,
                            flexGrow: 1,
                            textAlign: 'center',
                        }}>
                            Documents
                        </Typography>
                        <Button onClick={handleClose} sx={{ ml: 'auto' }}>
                            <Close sx={{
                                color: theme.typography.primary.black,
                                fontSize: '20px',
                            }} />
                        </Button>
                    </Box>
                    <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                    <Grid container columnSpacing={8}>
                        <Grid item md={1} />
                        <Grid item md={5}>
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginTop: '10px', }}>
                                {"Document Name  "}
                                <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                                className={classes.textField}
                                sx={{ marginTop: '5px' }}
                                name="file_name"
                                label="File Name"
                                fullWidth
                                margin="normal"
                                value={currentRow && currentRow.filename}
                                disabled={true}
                                InputProps={{
                                    style: {
                                        height: '40px',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '10px',
                                        textAlign: 'center',
                                    },
                                }}
                            />
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", marginTop: '10px' }}>
                                {"Document Type  "}
                                <span style={{ color: "red" }}>*</span>
                            </Typography>


                            <FormControl fullWidth sx={{ marginTop: "10px" }}>
                                {/* <InputLabel sx={{ color: theme.palette.grey }}>Type</InputLabel> */}
                                <Select
                                    value={currentRow && currentRow?.type || ''}
                                    onChange={(e) => {
                                        setcurrentRow({ ...currentRow, type: e.target.value })
                                        if (newFiles) {
                                            //update document type 
                                            let newArr = [...newFiles]
                                            newArr[0].type = currentRow.type;
                                            setNewFiles(newArr);
                                            setuploadedFiles((prevFiles => [...prevFiles, ...newArr]));
                                        }
                                    }
                                    }
                                    size="small"
                                    fullWidth
                                    className={classes.select}
                                    required
                                >
                                    <MenuItem value="Lease Agreement">Lease Agreement</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>

                            <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
                                <Button
                                    component="label"
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
                                >
                                    <DescriptionIcon sx={{ fontSize: 19, color: "#3D5CAC", paddingBottom: '2px' }} /> Upload
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".doc,.docx,.txt,.pdf"
                                        hidden
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                </Button>
                            </Box>
                        </Grid>
                        {/* <Grid item md={0.5} /> */}
                        <Grid item md={5}>
                            <Box sx={{ marginTop: "10px", backgroundColor: "#D9D9D9" }}>
                                <iframe
                                    src={filePreview}
                                    width="100%"
                                    height="322px"
                                    title="File Preview"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                        <Button onClick={handleSubmit} sx={{
                            background: "#FFC614",
                            color: "#160449",
                            marginRight: '30px',
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
                        {isEditing &&
                            <>
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
                                            Are you sure you want to delete this Document?
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
                </Box>
            </Modal>
        </div >
    );
};

export default Documents;
