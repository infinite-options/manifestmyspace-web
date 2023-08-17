import React, { useEffect, useState } from 'react';
import theme from '../../theme/theme';
import {
    Paper,
    ThemeProvider,
    Box,
    Stack,
    Typography,
    Button,
    Table,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { ArrowBack, Chat, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewLease = (props) => {
    const navigate = useNavigate();
    const handleBackButton = () => {};

    const handleViewButton = () => {
        navigate('/leaseDocument');
    };

    const handleRenewLease = () => {
        navigate('/editLease');
    };
    const leaseID = '300-000001';

    const [fetchData, setFetchData] = useState([]);
    const [leaseData, setLeaseData] = useState([]);
    useEffect(()=>{
        axios.get('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/110-000003')
        .then((res)=>{
            const data = res.data['Lease Details'];
            // console.log(data);
            setFetchData(data);
            data.forEach((lease) => {
                if(lease.lease_uid === leaseID) {
                    setLeaseData(lease);
                }
            });
        });
    },[]);

    function getDayText(day) {
        switch (day % 10) {
            case 1:
                return day + 'st';
            case 2:
                return day + 'nd';
            case 3:
                return day + 'rd';
            default:
                return day + 'th';
        }
    }
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
                                Viewing Lease
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button onClick={handleViewButton}>
                                <Visibility
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {`${leaseData.property_address}, ${leaseData.property_city}, ${leaseData.property_state} ${leaseData.property_zip}`}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Owner: {`${leaseData.owner_first_name} ${leaseData.owner_last_name}`}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Button>
                                        <Chat
                                            sx={{
                                                color: theme.typography.common
                                                    .blue,
                                                fontSize: '16px',
                                                margin: '5px',
                                            }}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Tenant: {`${leaseData.tenant_first_name} ${leaseData.tenant_last_name}`}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Button>
                                        <Chat
                                            sx={{
                                                color: theme.typography.common
                                                    .blue,
                                                fontSize: '16px',
                                                margin: '5px',
                                            }}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Contract Name
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {leaseData.ld_name}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Start Date
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {leaseData.lease_start}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        End Date
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {leaseData.lease_end}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Move In Date
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {'?'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        # of Occupants
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {'?'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        ${leaseData.charge}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent Frequency
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {leaseData.frequency}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Late Fee After
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {'?'} days
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Late Fee Per Day
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        ${leaseData.perDay_late_fee}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent Due Date
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {getDayText(leaseData.due_by)} of month
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Available to Pay
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {leaseData.available_topay} days before
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        position="relative"
                        sx={{ padding: '15px' }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.pink,
                                margin: '10px',
                            }}
                        >
                            End Lease
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '10px',
                            }}
                            onClick={handleRenewLease}
                        >
                            Renew Lease
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default ViewLease;
