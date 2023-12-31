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
    TextField,
    InputAdornment,
} from '@mui/material';
import { CalendarToday, Close, Description } from '@mui/icons-material';
import { ArrowBack, Chat, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

const ViewLease = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [moveOut, setMoveOut] = useState("")

    const [showSpinner, setShowSpinner] = useState(false);
    const { getProfileId } = useUser();
    const handleBackButton = () => {};

    const handleMoveOutChange = (event) => {
        setMoveOut(event.target.value);
    }


    const handleViewButton = (leaseData) => {
        console.log("LEASE DATA - documents: ", JSON.parse(leaseData.lease_documents));
        let link = JSON.parse(leaseData.lease_documents)[0]?.link
        
        // navigate('/leaseDocument',{
        //     state:{
        //         document: leaseData.ld_link
        //     }
        // }
        // );
        window.open(link,'_blank', 'rel=noopener noreferrer')
    };


    const handleEndLease = () => {
        
        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const leaseApplicationFormData = new FormData();
        leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
        leaseApplicationFormData.append("move_out_date", moveOut);
       // leaseApplicationFormData.append("lease_status", "ENDED");
    
        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data);
            }
        });
        
    };
    const leaseID = location.state.lease_id; //'300-000005';

    const [fetchData, setFetchData] = useState([]);
    const [leaseData, setLeaseData] = useState([]);
    const [document, setDocument] = useState([]);
    
    useEffect(()=>{
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
        .then((res)=>{
            const data = res.data['Lease_Details'].result;
            // console.log(data);
            setFetchData(data);
            data.forEach((lease) => {
                if(lease.lease_uid === leaseID) {
                    setLeaseData(lease);
                    console.log("Lease data "+JSON.stringify(lease))
                    setDocument(lease.lease_documents)
                }
            });
            setShowSpinner(false);
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

    const handleRenewLease = (leaseData) => {
        navigate('/editLease',{
            state: {
                leaseData: leaseData
            }
        });
    };

    console.log("document ",document)

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
                        {/* <Box position="absolute" left={0}>
                            <Button onClick={() => handleBackButton()}>
                                <ArrowBack
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '30px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box> */}
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
                        {document>0 ?<Box position="absolute" right={0}
                        onClick={()=>{handleViewButton(leaseData)}}
                        >
                            <Visibility
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontSize: '20px',
                                    margin: '5px',
                                }}
                            />
                        </Box>:<div></div>}
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
                                        Tenant:  {getTenantName(leaseData)}
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
                                        {leaseData.lease_move_in_date}
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
                                        {countNoOfOccupents(leaseData)}
                                    </Typography>
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
                                        Move Out Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="mm-dd-yyyy"
                                        value={moveOut} onChange={handleMoveOutChange}
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
                                        Rent
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        ${leaseData.property_listed_rent}
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
                                    {leaseData.lease_rent_late_by} days
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
                                        ${leaseData.lease_rent_late_fee}
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
                                        {getDayText(leaseData.lease_rent_due_by)} of month
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
                                        {leaseData.lease_rent_available_topay} days before
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
                            onClick={handleEndLease}
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
                            onClick={()=>{handleRenewLease(leaseData)}}
                        >
                            Renew Lease
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

function countNoOfOccupents(leaseData){

    let adultNo = leaseData.lease_adults?JSON.parse(leaseData.lease_adults):[];
    let ChildNo = leaseData.lease_children?JSON.parse(leaseData.lease_children):[];

    let no_of_occupants=0;
    if(adultNo){
        no_of_occupants += adultNo.length;
    }
    if(ChildNo){
        no_of_occupants += ChildNo.length;
    }
    return no_of_occupants;
}


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
export default ViewLease;
