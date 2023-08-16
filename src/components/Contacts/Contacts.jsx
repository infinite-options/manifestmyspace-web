import React from 'react';
import theme from '../../theme/theme';
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    InputAdornment,
    TextField,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { getStatusColor } from './../PropertyRentFlow/propertyRentFunctions';

const Contacts = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '90vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
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
                                Contacts
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button>
                                <Add
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{ padding: '0 15px' }}
                    >
                        <TextField
                            variant="filled"
                            label="Search by"
                            fullWidth
                            sx={{
                                border: '1px solid',
                                borderRadius: 10,
                                // backgroundColor: '#A9AAAB',
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize:
                                                theme.typography.smallFont,
                                            paddingLeft: '5px',
                                        }}
                                    >
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <div className="property-rent-detail-navbar-box">
                        <div className="property-rent-detail-navbar">
                            <div
                                className="property-rent-detail-navbar-np"
                                style={{
                                    backgroundColor: getStatusColor('Not Paid'),
                                }}
                            />
                            <div
                                className="property-rent-detail-navbar-pp"
                                style={{
                                    backgroundColor:
                                        getStatusColor('Paid Partially'),
                                }}
                            />
                            <div
                                className="property-rent-detail-navbar-pl"
                                style={{
                                    backgroundColor:
                                        getStatusColor('Paid Late'),
                                }}
                            />
                            <div
                                className="property-rent-detail-navbar-pot"
                                style={{
                                    backgroundColor:
                                        getStatusColor('Paid On Time'),
                                }}
                            />
                            <div
                                className="property-rent-detail-navbar-v"
                                style={{
                                    backgroundColor: getStatusColor('Vacant'),
                                }}
                            />
                        </div>
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default Contacts;
