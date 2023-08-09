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
import { useNavigate } from 'react-router-dom';

const LeasePDF = (props) => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate('/viewLease');
    };

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
                        <Box position="absolute" right={0}>
                            <Button>
                                <Download
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                    <Paper
                        style={{
                            backgroundColor: theme.palette.background.default,
                            height: '50vh',
                            width: '95%',
                            margin: '10px',
                        }}
                    >
                        <Stack justifyContent="center" alignItems="center">
                            <Typography sx={{ marginTop: '45%' }}>
                                PDF Page 1
                            </Typography>
                        </Stack>
                    </Paper>
                    <Paper
                        style={{
                            backgroundColor: theme.palette.background.default,
                            height: '50vh',
                            width: '95%',
                            margin: '10px',
                        }}
                    >
                        <Stack justifyContent="center" alignItems="center">
                            <Typography sx={{ marginTop: '45%' }}>
                                PDF Page 2
                            </Typography>
                        </Stack>
                    </Paper>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default LeasePDF;
