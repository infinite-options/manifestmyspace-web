import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Box, Typography, Button, Modal, TextField,
    MenuItem, FormControl, InputLabel, Select, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import theme from "../../theme/theme";
import DescriptionIcon from "@mui/icons-material/Description";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LeaseIcon from "../Property/leaseIcon.png";

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

const Documents = ({ documents, setDocuments, uploadedFiles, setuploadedFiles }) => {
    const [open, setOpen] = useState(false);
    const [currentRow, setcurrentRow] = useState(null);
    // const [docs, setDocs] = useState([]);
    const color = theme.palette.form.main;
    const [isEditing, setIsEditing] = useState(false);
    const [newFiles, setNewFiles] = useState(null);
    const classes = useStyles();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileUpload = (e) => {
        console.log('uploaded file', e.target.files);
        console.log('documents', documents);
        const curr = { ...currentRow, filename: e.target.files[0].name, id: documents.length };
        console.log(curr);
        setcurrentRow(curr);
        // setDocs((prevFiles) => [...prevFiles, ...e.target.files]);
        const filesArray = Array.from(e.target.files).map(file => ({
            name: file.name,
            type: currentRow.type,
            file: file
          }));
        setNewFiles(filesArray);
    };

    const handleSubmit = () => {
        if(isEditing === true){
          setDocuments(documents.map(doc => (doc.id === currentRow.id ? currentRow : doc)))

        } else{
            console.log('arr', newFiles);
            setDocuments((prevFiles) => [...prevFiles, currentRow]);
            setuploadedFiles((prevFiles => [...prevFiles, ...newFiles]));
            setNewFiles(null);
        }
        handleClose();
    };

    const handleEditClick = (row) => {
        setcurrentRow(row);
        setIsEditing(true);
        handleOpen();
    };


    const handleDeleteClick = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
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
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditClick(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon />
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
                                paddingLeft:"50px"
                            }}
                        >
                            Documents
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
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <DataGrid
                        rows={documents}
                        columns={docsColumns}
                        hideFooter={true}
                        getRowId={(row) => row.id}
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
                aria-labelledby="add-document-modal"
                aria-describedby="add-document-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="add-document-modal" variant="h6" component="h2">
                    {isEditing ? 'Edit Document' : 'Add Document'}
                    </Typography>
                    <FormControl fullWidth sx={{ marginTop: "10px" }}>
                        <InputLabel sx={{ color: theme.palette.grey }}>Type</InputLabel>
                        <Select
                            value={currentRow && currentRow?.type || ''}
                            onChange={(e) => setcurrentRow({ ...currentRow, type: e.target.value })}
                            size="small"
                            fullWidth
                            label="Type"
                            className={classes.select}
                            sx={{
                                marginTop: "10px",
                            }}
                            required
                        >
                            <MenuItem value="Lease Agreement">Lease Agreement</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
                        <label htmlFor="file-upload" style={{ cursor: "pointer", display: "flex", }}>
                            <DescriptionIcon sx={{ fontSize: 19, color: "#3D5CAC" }} /> Add Document
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".doc,.docx,.txt,.pdf"
                            hidden
                            onChange={(e) => handleFileUpload(e)}
                        />
                    </Box>
                    {currentRow && currentRow.filename &&
                        <Box sx={{ marginTop: "25px" }}>
                            <Typography>Added File: {currentRow.filename}</Typography>
                        </Box>
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop:"20px" }}>
                        <Button onClick={handleClose} sx={{
                            marginRight: '5px', background: "#3D5CAC",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            width: "20%",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                        }}>Cancel</Button>
                        <Button onClick={handleSubmit} sx={{
                            background: "#3D5CAC",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            width: "20%",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                        }}>{isEditing ? "Edit" : "Add"}</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Documents;
