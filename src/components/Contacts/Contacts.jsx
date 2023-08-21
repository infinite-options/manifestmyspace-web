import React, { useState } from 'react';
import theme from '../../theme/theme';
import './../../css/contacts.css';
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
import { getStatusColor } from './ContactsFunction';

const Contacts = (props) => {
    const [contactsTab, setContactsTab] = useState('Owner');
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
                        sx={{ paddingBottom: '15px', paddingTop: '10px' }}
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
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 2L9 16"
                                        stroke="#160449"
                                        stroke-width="3"
                                        stroke-linecap="round"
                                    />
                                    <path
                                        d="M16 9L2 9"
                                        stroke="#160449"
                                        stroke-width="3"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{ padding: '0 15px 15px' }}
                    >
                        <TextField
                            variant="filled"
                            label="Search by"
                            fullWidth
                            sx={{
                                border: '1px solid',
                                borderRadius: 10,
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
                    <div className="contacts-detail-container">
                        <div className="contacts-detail-navbar-box">
                            <div className="contacts-detail-navbar">
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Owner'),
                                    }}
                                    onClick={() => setContactsTab('Owner')}
                                />
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Tenants'),
                                    }}
                                    onClick={() => setContactsTab('Tenants')}
                                />
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Maintenance'),
                                    }}
                                    onClick={() =>
                                        setContactsTab('Maintenance')
                                    }
                                />
                            </div>
                            <div className="contacts-detail-background">
                                <div
                                    className="contacts-detail-status-indicator"
                                    style={{
                                        backgroundColor:
                                            getStatusColor(contactsTab),
                                    }}
                                />
                                <div className="property-rent-detail-selector-container">
                                    <div className="property-rent-detail-selector-icon-left">
                                        <svg
                                            width="33"
                                            height="33"
                                            viewBox="0 0 33 33"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                                                fill="#160449"
                                            />
                                        </svg>
                                    </div>
                                    <div className="property-rent-detail-selector-icon-text">
                                        1 Of 3 Not Paid
                                    </div>
                                    <div className="property-rent-detail-selector-icon-right">
                                        <svg
                                            width="33"
                                            height="33"
                                            viewBox="0 0 33 33"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                                                fill="#160449"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default Contacts;
