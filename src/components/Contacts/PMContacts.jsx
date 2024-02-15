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

const PMContacts = (props) => {
    const { getProfileId, selectedRole } = useUser();
    const [contactsTab, setContactsTab] = useState('Owner');
    const [ownerData, setOwnerData] = useState([]);
    const [tenantData, setTenantData] = useState([]);
    // const [maintenanceData, setMaintenanceData] = useState([]);
    const [allOwnersData, setAllOwnersData] =useState([]);
    const [displayedOwnersData, setDisplayedOwnersData] = useState([]);
    const [allTenantsData, setAllTenantsData]=useState([]);
    const [displayedTenantsData, setDisplayedTenantsData] = useState([]);
    const [allMaintenanceData, setAllMaintenanceData]=useState([])
    const [displayedMaintenanceData, setDisplayedMaintenanceData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    const [ownerDataDetails, setOwnerDataDetails] = useState([]);
    const [tenantDataDetails, setTenantDataDetails] = useState([]);
    const [maintenanceDataDetails, setMaintenanceDataDetails] = useState([]);
    const [managersDataDetails, setManagersDataDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filterContacts = (data) => {
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
    

    const fetchData = async () => {
        const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contacts/${getProfileId()}`;
        setShowSpinner(true);

        await axios.get(url)
            .then((resp) => {
                const data = resp.data['management_contacts'];
                setAllOwnersData(data['owners']);
                setAllTenantsData(data['tenants']);
                setAllMaintenanceData(data['maintenance']);
                setShowSpinner(false);
            })
            .catch((e) => {
                console.error(e);
                setShowSpinner(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        switch (contactsTab) {
            case 'Owner':
                setDisplayedOwnersData(filterContacts(allOwnersData));
                break;
            case 'Tenants':
                setDisplayedTenantsData(filterContacts(allTenantsData));
                break;
            case 'Maintenance':
                setDisplayedMaintenanceData(filterContacts(allMaintenanceData));
                break;
            default:
                break;
        }
    }, [searchTerm, contactsTab, allOwnersData, allTenantsData, allMaintenanceData]);

    const handleAddContact = () => {
        navigate('/addContacts');
    };

    const handleSetSelectedCard = (selectedData, index) => {
        let dataDetails;
        switch (contactsTab) {
            case 'Owner':
                dataDetails = displayedOwnersData;
                break;
            case 'Tenants':
                dataDetails = displayedTenantsData;
                break;
            case 'Maintenance':
                dataDetails = displayedMaintenanceData;
                break;
            default:
                break;
        }

        navigate(`/${contactsTab.toLowerCase()}ContactDetails`, {
            state: {
                dataDetails,
                tab: contactsTab,
                selectedData,
                index,
                viewData: dataDetails,
            },
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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
    sx={{ padding: '15px' }} // Adjust padding here
>
    <TextField
        variant="filled"
        label="Search by"
        fullWidth
        sx={{
            borderRadius: '10px', // Set borderRadius directly on TextField
            '& .MuiFilledInput-root': {
                borderRadius: '10px', // Ensure filled input is also rounded
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
                                            getStatusColor('Owner'),
                                    }}
                                    onClick={() => setContactsTab('Owner')}
                                >
                                    <div className="contacts-detail-text">
                                        Owners
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
                                <div
                                    className="contacts-detail-navbar"
                                    style={{
                                        backgroundColor:
                                            getStatusColor('Maintenance'),
                                    }}
                                    onClick={() => setContactsTab('Maintenance')}
                                >
                                    <div className="contacts-detail-text">
                                        Maintenance
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
                                {contactsTab === 'Owner' ? (
                                    <>
                                        {displayedOwnersData.map((owner, index) => (
                                            <OwnerContactsCard
                                                data={owner}
                                                key={index}
                                                index={index}
                                                selected={handleSetSelectedCard}
                                                dataDetails={displayedOwnersData.length}
                                            />
                                        ))}
                                    </>
                                ) : contactsTab === 'Tenants' ? (
                                    <>
                                        {displayedTenantsData.map((tenant, index) => (
                                            <TenantContactsCard
                                                data={tenant}
                                                key={index}
                                                index={index}
                                                selected={handleSetSelectedCard}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {displayedMaintenanceData.map((maint, index) => (
                                            <MaintenanceContactsCard
                                                data={maint}
                                                key={index}
                                                index={index}
                                                selected={handleSetSelectedCard}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

const OwnerContactsCard = (props) => {
    const owner = props.data;
    const handleSetSelectedCard = props.selected;
    const ownerDataDetailsLength = props.dataDetails;
    const index = props.index;

    const handleSelection = () => {
        handleSetSelectedCard(owner, index);
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
                                ${owner.contact_first_name? owner.contact_first_name : '<FIRST_NAME>'}
                                ${owner.contact_last_name? owner.contact_last_name : '<LAST_NAME>'}
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
                            fontSize: '14px',
                            fontWeight: theme.typography.common.fontWeight,
                        }}
                    >
                        {owner.property_count? owner.property_count : '<PROPERTY_COUNT>'} Properties
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {owner.contact_email? owner.contact_email : '<EMAIL>'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {owner.contact_phone_number? formattedPhoneNumber(owner.contact_phone_number) : '<PHONE_NUMBER>'}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

const TenantContactsCard = (props) => {
    const tenant = props.data;
    const handleSetSelectedCard = props.selected;
    const index = props.index;

    const handleSelection = () => {
        handleSetSelectedCard(tenant, index);
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
                                ${tenant.contact_first_name? tenant.contact_first_name : '<FIRST_NAME>'}
                                ${tenant.contact_last_name? tenant.contact_last_name : '<LAST_NAME>'}
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
                        }}
                    >
                        {tenant.contact_address ? tenant.contact_address : '<ADDRESS>'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {tenant.contact_email? tenant.contact_email : '<EMAIL>'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {
                            tenant.contact_phone_number
                                ? (tenant.contact_phone_number.indexOf('(') > -1
                                    ? tenant.contact_phone_number
                                    : formattedPhoneNumber(tenant.contact_phone_number))
                                : '<PHONE_NUMBER>'
                        }
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

const MaintenanceContactsCard = (props) => {
    const business = props.data;
    const handleSetSelectedCard = props.selected;
    const index = props.index;

    const handleSelection = () => {
        handleSetSelectedCard(business, index);
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
                                ${business.contact_first_name? business.contact_first_name : '<FIRST_NAME>'}
                                ${business.contact_last_name? business.contact_last_name : '<LAST_NAME>'}
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
                        }}
                    >
                        {business.contact_email? business.contact_email : '<EMAIL>'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {
                            business.contact_phone_number
                                ? (business.contact_phone_number.indexOf('(') > -1
                                    ? business.contact_phone_number
                                    : formattedPhoneNumber(business.contact_phone_number))
                                : '<PHONE_NUMBER>'
                        }
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                            right: '25px',
                            position: 'absolute',
                        }}
                    >
                        {business.contact_description ? business.contact_description : '<Category-TBD>'}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default PMContacts;
