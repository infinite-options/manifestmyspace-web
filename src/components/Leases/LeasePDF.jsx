import React from 'react';
import theme from '../../theme/theme';
import {
    Paper,
    ThemeProvider,
    Box,
    Stack,
    Typography,
    Button,
} from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';

const LeasePDF = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
    const handleBackButton = () => {
        navigate(-1);
    };

    const handleChangeDocument = (index) => {
        setCurrentDocumentIndex(index);
      };

    const documentLink  = location.state.document ? location.state.document : []; 
    return (
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '85vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    marginBottom: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                        paddingTop: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        sx={{ paddingBottom: '25px', paddingTop: '15px' }}
                    >
                        <Box position="absolute" left={0}>
                            <Button onClick={() => handleBackButton()}>
                                <ArrowBack
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '30px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box>
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                }}
                            >
                                Viewing Lease PDF
                            </Typography>
                        </Box>
                    </Stack>
                    {/* {
                        documentLink.map(link => {
                            <iframe src={link} width="100%" height="500px"/>
                        })
                    } */}
                    {documentLink && documentLink.map((link, index) => (
          <button key={index} onClick={() => handleChangeDocument(index)}>
            Document {index + 1}
          </button>
        ))}
         <iframe
        title="PDF Viewer"
        src={documentLink[currentDocumentIndex]}
        width="100%"
        height="500px"
      />
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default LeasePDF;
