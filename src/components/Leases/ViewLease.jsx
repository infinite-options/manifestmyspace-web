import React from 'react';
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

const ViewLease = (props) => {
    const handleBackButton = () => {};

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
                            <Button>
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
                                        789 Maple Lane, San Diego, CA 92101, USA
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ marginTop: '-10px' }}>
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
                                        Owner: Steve Albini
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
                                        Tenant: Lou Reed
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
                                        Signed Lease between Steve Albini and
                                        Lou Reed
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
                                        02/21/2022
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
                                        02/21/2023
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
                                        02/22/2022
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
                                        4
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
                                        $3000
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
                                        Monthly
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
                                        2 days
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
                                        $20
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
                                        21st of month
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
                                        10 days before
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
