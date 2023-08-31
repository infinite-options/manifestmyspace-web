import React, { useState } from 'react';
import theme from '../../theme/theme';
import './../../css/contacts.css';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddContacts = (props) => {
    const [user, setUser] = useState({
        firstName: 'Test',
        lastName: 'User',
        category: 'Owner',
        email: 'test@example.com',
        phone: '408-476-1234',
        maintenanceCategory: 'Plumbing',
        tenantProperty: '',
        notes: '',
    });

    const navigate = useNavigate();

    const handleFormInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // console.log(name, value);
        setUser({ ...user, [name]: value });
    };

    const handleFormClose = () => {
        navigate('/contacts');
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
                                Create Contact
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button onClick={handleFormClose}>
                                <Close
                                    sx={{
                                        color: theme.typography.common.blue,
                                        fontWeight:
                                            theme.typography.primary.fontWeight,
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                    <Stack sx={{ padding: '15px' }}>
                        <form autoComplete="off">
                            <Stack spacing={4}>
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Category
                                    </Typography>
                                    <Select
                                        displayEmpty
                                        value={user.category}
                                        onChange={handleFormInputs}
                                        variant="filled"
                                        name="category"
                                    >
                                        <MenuItem value={'Tenant'}>
                                            Tenant
                                        </MenuItem>
                                        <MenuItem value={'Owner'}>
                                            Owner
                                        </MenuItem>
                                        <MenuItem value={'Maintenance'}>
                                            Maintenance
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Phone Number
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        name={'phone'}
                                        value={user.phone}
                                        onChange={handleFormInputs}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Email Address
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        name={'phone'}
                                        value={user.email}
                                        type="email"
                                        onChange={handleFormInputs}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Maintenance Category (Optional)
                                    </Typography>
                                    <Select
                                        displayEmpty
                                        value={user.maintenanceCategory}
                                        onChange={handleFormInputs}
                                        variant="filled"
                                        name="maintenanceCategory"
                                    >
                                        <MenuItem value={'Plumbing'}>
                                            Plumbing
                                        </MenuItem>
                                    </Select>
                                </FormControl>{' '}
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Tenant Property (Optional)
                                    </Typography>
                                    <Select
                                        displayEmpty
                                        value={user.tenantProperty}
                                        onChange={handleFormInputs}
                                        variant="filled"
                                        name="tenantProperty"
                                    >
                                        <MenuItem
                                            value={
                                                '101 Birch Road, Sacramento, CA 95814, USA'
                                            }
                                        >
                                            101 Birch Road, Sacramento, CA
                                            95814, USA
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Notes
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        name={'notes'}
                                        value={user.notes}
                                        onChange={handleFormInputs}
                                    />
                                </FormControl>
                                <FormControl>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            color: theme.typography.common.blue,
                                        }}
                                    >
                                        Add Photo
                                    </Typography>
                                    <Box
                                        sx={{
                                            backgroundColor:
                                                theme.palette.background
                                                    .default,
                                        }}
                                    >
                                        <Button size="large">
                                            <AddPhotoAlternate
                                                sx={{
                                                    color: theme.typography
                                                        .common.blue,
                                                }}
                                            />
                                        </Button>
                                    </Box>
                                </FormControl>
                                <Box sx={{ height: '25px' }} />
                                <Button
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#9EAED6',
                                        color: theme.typography.common.blue,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                        }}
                                    >
                                        + Contact
                                    </Typography>
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default AddContacts;
