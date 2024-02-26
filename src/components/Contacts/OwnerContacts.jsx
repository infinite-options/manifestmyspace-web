import React, { useEffect, useState } from 'react';
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
    Card,
    CardContent,
} from '@mui/material';
import { Message, Search } from '@mui/icons-material';
import { getStatusColor } from './ContactsFunction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formattedPhoneNumber } from '../utils/privacyMasking';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

const OwnerContacts = (props) => {
    const { getProfileId, selectedRole } = useUser();
    const [contactsTab, setContactsTab] = useState('Managers');
    const [showSpinner, setShowSpinner] = useState(false);

    const [allManagersData, setAllManagersData] = useState([]);
    const [allTenantsData, setAllTenantsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedData, setDisplayedData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filteredData = filterDisplayedData(contactsTab === 'Managers' ? allManagersData : allTenantsData);
        setDisplayedData(filteredData);
    }, [searchTerm, contactsTab, allManagersData, allTenantsData]);

    const fetchData = async () => {
        const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contacts/${getProfileId()}`;
        setShowSpinner(true);
        await axios
            .get(url)
            .then((resp) => {
                const data = resp.data['owner_contacts'];
                setAllManagersData(data['managers']);
                setAllTenantsData(data['tenants']);
                setShowSpinner(false);
            })
            .catch((e) => {
                console.error(e);
                setShowSpinner(false);
            });
    };

    const handleAddContact = () => {
        navigate('/addContacts');
    };

    const handleSetSelectedCard = (selectedData, index) => {
        navigate(contactsTab === 'Managers' ? '/managerContactDetails' : '/tenantContactDetails', {
            state: {
                dataDetails: contactsTab === 'Managers' ? allManagersData : allTenantsData,
                tab: contactsTab,
                selectedData: selectedData,
                index: index,
                viewData: contactsTab === 'Managers' ? allManagersData : allTenantsData,
            },
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filterDisplayedData = (data) => {
        if (searchTerm.trim() === '') return data;
        
        const terms = searchTerm.trim().toLowerCase().split(" "); // Split the search term into individual terms
        
        return data.filter((contact) => {
            // Customize the filtering logic based on your requirements
            return terms.every((term) => {
                // Check if any part of the contact's name includes each term in the search query
                return (
                    contact.contact_first_name?.toLowerCase()?.includes(term) ||
                    contact.contact_last_name?.toLowerCase()?.includes(term)
                );
            });
        });
    };
    

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                            <Button onClick={handleAddContact}>
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
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M16 9L2 9"
                                        stroke="#160449"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            padding: '15px', 
                            borderRadius: '10px',
                        }}
                    >
                        <TextField
                            variant="filled"
                            label="Search by"
                            fullWidth
                            sx={{
                                '& .MuiFilledInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: theme.typography.smallFont,
                                            paddingLeft: '5px',
                                        }}
                                    >
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleSearchChange}
                        />
                    </Stack>                    
                    <div className="contacts-detail-container">
                        <div className="contacts-detail-navbar-box">
                            <div className="contacts-detail-navbar">
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Managers'),
                                    }}
                                    onClick={() => setContactsTab('Managers')}
                                >
                                    <div className="contacts-detail-text">
                                        Managers
                                    </div>
                                </div>
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Tenants'),
                                    }}
                                    onClick={() => setContactsTab('Tenants')}
                                >
                                    <div className="contacts-detail-text">
                                        Tenants
                                    </div>
                                </div>
                            </div>
                            <div className="contacts-detail-background">
                                <div
                                    className="contacts-detail-status-indicator"
                                    style={{
                                        backgroundColor:
                                            getStatusColor(contactsTab),
                                    }}
                                />
                                {displayedData.map((contact, index) => (
                                    <ContactCard
                                        data={contact}
                                        key={index}
                                        index={index}
                                        selected={handleSetSelectedCard}
                                        dataDetails={contactsTab === 'Managers' ? allManagersData.length : allTenantsData.length}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

const ContactCard = (props) => {
    const contact = props.data;
    const handleSetSelectedCard = props.selected;
    const dataDetails = props.dataDetails;
    const index = props.index;

    const handleSelection = () => {
        console.log(index);
        handleSetSelectedCard(contact, index);
    };

    return (
        <Stack>
            <Card
                sx={{
                    backgroundColor: '#D6D5DA',
                    borderRadius: '10px',
                    margin: '10px',
                    color: '#160449',
                }}
                onClick={handleSelection}
            >
                <CardContent>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: theme.typography.common.fontWeight,
                            }}
                        >
                            {`
                                ${contact.contact_first_name ? contact.contact_first_name : '<FIRST_NAME>'}
                                ${contact.contact_last_name ? contact.contact_last_name : '<LAST_NAME>'}
                            `}
                        </Typography>
                        <Button>
                            <Message
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontSize: '15px',
                                }}
                            />
                        </Button>
                    </Stack>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                            fontWeight: theme.typography.primary.fontWeight,
                        }}
                    >
                        {`${contact.property_count ? contact.property_count : '<PROPERTY_COUNT>'} Properties`}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {contact.contact_email ? contact.contact_email : '<EMAIL>'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >   
                        {contact.contact_phone_number ? formattedPhoneNumber(contact.contact_phone_number) : '<PHONE_NUMBER>'}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default OwnerContacts;
