import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import theme from '../theme/theme';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import documentIcon from "./documentIcon.png"
import PostAddIcon from '@mui/icons-material/PostAdd';

export default function DocumentUploader({selectedDocumentList, setSelectedDocumentList}){

    const [documentOverLimit, setDocumentOverLimit] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if(selectedDocumentList.length > 0){
            console.log("selectedDocumentList", selectedDocumentList)
            checkDocumentSizes(selectedDocumentList);
        }
    }, [selectedDocumentList]);

    function checkDocumentSizes(selectedDocumentList) {
        const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

        
        const sumFileSizes = selectedDocumentList.reduce((acc, file) => {
            return acc + file.size;
        }, 0)

        if (sumFileSizes > MAX_SIZE) {
            setDocumentOverLimit(true)
            setShowErrorMessage(true);
        } else{
            setDocumentOverLimit(false)
            setShowErrorMessage(false);
        }
    }

    const deleteDocument = (index) => {
        const newSelectedDocumentList = selectedDocumentList.filter((document, i) => i !== index);
        setSelectedDocumentList(newSelectedDocumentList);
    }

    return (
        <>
            {showErrorMessage ? (
                <Stack direction="row">
                    <Typography sx={{ color: 'red', fontSize: "16px" }}>
                        Total size of documents must be less than 5MB. Please remove a document.
                    </Typography>
                </Stack>
            ): <Typography></Typography>}
            <Container fixed sx={{
                backgroundColor: 'white',
                borderColor: 'black',
                borderRadius: '7px',
                borderStyle: 'dashed',
                borderColor: theme.typography.common.blue,
            }}>
                 {selectedDocumentList.length? (
                    <Grid item xs={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent:'space-between',
                            alignItems: 'center',
                            marginBottom: '7px',
                            width: '100%',
                        }}>
                            
                            <Box
                                sx={{
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    padding: '15px',
                                    color: '#3D5CAC',
                                    width: '100%',
                                    // paddingTop: '5px',
                                }}
                            >
                                {[...selectedDocumentList].map((f, i) => (
                                    <Box
                                        key={i} 
                                        sx={{
                                            display:'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '90%', // Adjust the width as needed
                                                padding: '8px', // Adjust the padding as needed
                                            }}
                                        >
                                            {f.name}
                                        </Box>
                                        <Button 
                                            variant="text"
                                            onClick={() => {
                                                deleteDocument(i)
                                            }}
                                            sx={{
                                                width: '10%', 
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold', 
                                                color: '#3D5CAC', 
                                            }}
                                            
                                        >
                                            <DeleteIcon  sx={{ fontSize: 19, color: '#3D5CAC'}} />
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
            
                        </Box>
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    <Box
                        justifyContent="center"
                        alignItems="center"
                        display="flex"
                        padding={5}
                    >
                        <Box
                            sx={{
                            display: "flex",
                            flexDirection: "row",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "5px",
                            color: "#3D5CAC",
                            }}
                        >
                            <Button
                                component="label"
                                htmlFor="file-upload"
                                sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {/* <img src={documentIcon} style={{ width: '20px', height: '25px', margin: '5px' }} /> */}
                                <PostAddIcon fontSize="large"/>
                                <Typography sx={{ color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px" }}>
                                    Attach Documents
                                </Typography>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".doc,.docx,.txt,.pdf"
                                    hidden
                                    onChange={(e) => setSelectedDocumentList((prevFiles) => [...prevFiles, ...e.target.files])}
                                    multiple
                                />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Container>
        </>
    )
}