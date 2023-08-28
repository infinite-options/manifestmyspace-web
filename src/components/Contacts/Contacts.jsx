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

const Contacts = (props) => {
    const [contactsTab, setContactsTab] = useState('Owner');
    const [ownerData, setOwnerData] = useState([]);
    const [tenantData, setTenantData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const url =
            'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contactsBusinessContacts/600-000003';
        await axios
            .get(url)
            .then((resp) => {
                const data = resp.data['Business Contacts'].result;
                console.log(data);

                const ownerCon = data.filter((val) => {
                    return val.contact_uid && val.contact_uid.includes('110-');
                });
                setOwnerData(ownerCon);

                const tenantCon = data.filter((val) => {
                    return val.contact_uid && val.contact_uid.includes('350-');
                });
                setTenantData(tenantCon);

                const mainCon = data.filter((val) => {
                    return val.contact_uid && val.contact_uid.includes('600-');
                });
                setMaintenanceData(mainCon);
            })
            .catch((e) => {
                console.error(e);
            });
    };
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
                                    onClick={() =>
                                        setContactsTab('Maintenance')
                                    }
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
                                        {ownerData.map((owner, index) => {
                                            return (
                                                <OwnerContactsCard
                                                    data={owner}
                                                    key={index}
                                                />
                                            );
                                        })}
                                    </>
                                ) : contactsTab === 'Tenants' ? (
                                    <>
                                        {tenantData.map((tenant, index) => {
                                            return (
                                                <TenantContactsCard
                                                    data={tenant}
                                                    key={index}
                                                />
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        {maintenanceData.map((maint, index) => {
                                            return (
                                                <MaintenanceContactsCard
                                                    data={maint}
                                                    key={index}
                                                />
                                            );
                                        })}
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
    return (
        <Stack>
            <Card
                sx={{
                    backgroundColor: '#D6D5DA',
                    borderRadius: '10px',
                    margin: '10px',
                    color: '#160449',
                }}
            >
                <CardContent>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: theme.typography.common.fontWeight,
                            }}
                        >
                            {owner.contact_first_name} {owner.contact_last_name}
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
                        12 Properties
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {owner.contact_email}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {owner.contact_phone_numnber}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

const TenantContactsCard = (props) => {
    const tenant = props.data;
    return (
        <Stack>
            <Card
                sx={{
                    backgroundColor: '#D6D5DA',
                    borderRadius: '10px',
                    margin: '10px',
                    color: '#160449',
                }}
            >
                <CardContent>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: theme.typography.common.fontWeight,
                            }}
                        >
                            {tenant.contact_first_name}{' '}
                            {tenant.contact_last_name}
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
                        {tenant.contact_address
                            ? tenant.contact_address
                            : '103 N. Abel St, Milpitas CA 95035'}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {tenant.contact_email}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {tenant.contact_phone_numnber}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

const MaintenanceContactsCard = (props) => {
    const business = props.data;
    return (
        <Stack>
            <Card
                sx={{
                    backgroundColor: '#D6D5DA',
                    borderRadius: '10px',
                    margin: '10px',
                    color: '#160449',
                }}
            >
                <CardContent>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: theme.typography.common.fontWeight,
                            }}
                        >
                            {business.contact_first_name}{' '}
                            {business.contact_last_name}
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
                        {business.contact_email}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                        }}
                    >
                        {business.contact_phone_numnber}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontSize: '14px',
                            right: '25px',
                            position: 'absolute',
                        }}
                    >
                        {business.contact_description
                            ? business.contact_description
                            : 'Plumbing and Landscaping'}
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default Contacts;
