import React, {useEffect, useState} from 'react';
import theme from '../../theme/theme';
import axios from "axios";
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
    TextField,
    InputAdornment,
} from '@mui/material';
import { CalendarToday, Chat, Close, Description } from '@mui/icons-material';
import { useNavigate, useLocation} from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";

const EditLease = (props) => {
    const { user, getProfileId } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const leaseData = location.state.leaseData;
    console.log("leaseData : "+JSON.stringify(leaseData))

    const [contractName, setContractName] = useState(leaseData.contractName)
    const [startDate, setStartDate] = useState(leaseData.startDate)
    const [endDate, setEndDate] = useState(leaseData.endDate)
    const [moveIn, setMoveIn] = useState("")
    const [noOfOcc, setNoOfOcc] = useState("")
    const [rent, setRent] = useState("")
    const [rentFreq, setRentFreq] = useState("")
    const [lateFeeAfter, setLateFeeAfter] = useState("")
    const [lateFeePerDay, setLateFeePerDay] = useState("")
    const [rentDue, setRentDue] = useState("")
    const [availablePay, setAvailablePay] = useState("")

    const handleContractNameChange = (event) => {
        setContractName(event.target.value);
    }

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }

    const handleMoveInChange = (event) => {
        setMoveIn(event.target.value);
    }

    const handleNoOfOccChange = (event) => {
        setNoOfOcc(event.target.value);
    }

    const handleRentChange = (event) => {
        setRent(event.target.value);
    }
    const handleRentFreqChange = (event) => {
        setRentFreq(event.target.value);
    }

    const handleLateFeeAfterChange = (event) => {
        setLateFeeAfter(event.target.value);
    }

    const handleLateFeePerDayChange = (event) => {
        setLateFeePerDay(event.target.value);
    }

    const handleRentDueChange = (event) => {
        setRentDue(event.target.value);
    }

    const handleAvailablePayChange = (event) => {
        setAvailablePay(event.target.value);
    }

    const handleCloseButton = () => {
        navigate('/viewLease',{
            state:{
                lease_id : leaseData.lease_uid
            } 
        });
    };

    const handleNewLease = () => {

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const leaseApplicationFormData = new FormData();
        leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
        leaseApplicationFormData.append("lease_status", "PROCESSING");
        leaseApplicationFormData.append("lease_start", startDate.format('MM-DD-YYYY'));
        leaseApplicationFormData.append("lease_end", endDate.format('MM-DD-YYYY'));
        // leaseApplicationFormData.append("lease_fees", JSON.stringify(fees));
        // leaseApplicationFormData.append("lease_move_in_date", moveInDate.format('MM-DD-YYYY'));
        // leaseApplicationFormData.append("documents", documents);
            
        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data);
            }
        });

    }

    const handleRenewLease = () => {
        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const leaseApplicationFormData = new FormData();
        leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
        leaseApplicationFormData.append("lease_status", "PROCESSING");
        // leaseApplicationFormData.append("lease_start", startDate.format('MM-DD-YYYY'));
        // leaseApplicationFormData.append("lease_end", endDate.format('MM-DD-YYYY'));
        // leaseApplicationFormData.append("lease_move_in_date", moveIn.format('MM-DD-YYYY'));
        
        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data);
            }
        });
    }

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
                        backgroundColor: theme.palette.primary.secondary,
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
                                Edit/Renew Lease
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button onClick={handleCloseButton}>
                                <Close
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
                                        Tenant:  {getTenantName(leaseData)}                                    </Typography>
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
                                    <TextField
                                        variant="filled"
                                        type="text"
                                        label="Enter contract name"
                                        fullWidth
                                        value={contractName} onChange={handleContractNameChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1}>
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
                                    <TextField
                                        variant="filled"
                                        label="mm/dd/yyyy"
                                        value={startDate} onChange={handleStartDateChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell colSpan={1}>
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
                                    <TextField
                                        variant="filled"
                                        label="mm/dd/yyyy"
                                        value={endDate} onChange={handleEndDateChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                    <TextField
                                        variant="filled"
                                        label="mm/dd/yyyy"
                                        value={moveIn} onChange={handleMoveInChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                    <TextField
                                        variant="filled"
                                        label="Number"
                                        type="number"
                                        value={noOfOcc} onChange={handleNoOfOccChange}

                                    />
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
                                    <TextField
                                        variant="filled"
                                        value={rent} onChange={handleRentChange}

                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize: '16px',
                                                        paddingRight: '5px',
                                                    }}
                                                >
                                                    &#36;
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                    <TextField
                                        variant="filled"
                                        label="Monthly"
                                        type="text"
                                        value={rentFreq} onChange={handleRentFreqChange}

                                    />
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
                                    <TextField
                                        variant="filled"
                                        label="days"
                                        type="text"
                                        value={lateFeeAfter} onChange={handleLateFeeAfterChange}

                                    />
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
                                    <TextField
                                        variant="filled"
                                        value={lateFeePerDay} onChange={handleLateFeePerDayChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize: '16px',
                                                        paddingRight: '5px',
                                                        margin: 0,
                                                    }}
                                                >
                                                    &#36;
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                    <TextField
                                        variant="filled"
                                        label="of month"
                                        type="text"
                                    />
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
                                        value={rentDue} onChange={handleRentDueChange}

                                    >
                                        Available to Pay
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="days before"
                                        type="text"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                        }}
                                    >
                                        <Description
                                            sx={{ paddingRight: '5px' }}
                                        />
                                        Add Document
                                    </Button>
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
                            fullWidth
                            variant="contained"
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '10px',
                            }}  onClick={handleRenewLease}
                        >
                            Renew Lease
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '10px',
                            }} onClick={handleNewLease}
                        >
                            New Lease
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

function getTenantName(leaseData){

    let name = "";

    let tenants = leaseData.tenants ? JSON.parse(leaseData.tenants): [];

    console.log(tenants)
    name += tenants && tenants[0] ? tenants[0].tenant_first_name : "";
    if(name.length>0){
        name+=" "
    }
    name += tenants && tenants[0] ? tenants[0].tenant_last_name : "";
    
    return name;

}


export default EditLease;
