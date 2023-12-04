import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Grid,
    Divider,
    Button,
    ButtonGroup,
    Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import { ArrowBack, Chat, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState, Fragment } from 'react';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import backButton from '../../Payments/backIcon.png';
import theme from '../../../theme/theme';
import DescriptionIcon from "@mui/icons-material/Description";

function TenantLeases(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    const [tenantLeases, setTenantLeases] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [property, setProperty] = useState(location.state.property);
    const [status, setStatus] = useState(location.state.status);
    const [lease, setLease] = useState(location.state.lease);
    //const [lease, setLease] = useState([]);
    const [pets, setPets] = useState(lease.lease_pets ?JSON.parse(lease.lease_pets):[]);
    const [vehicles, setVehicles] = useState(lease.lease_vehicles ? JSON.parse(lease.lease_vehicles):[]);
    const [adultOccupants, setAdultOccupants] = useState(lease.lease_adults ? JSON.parse(lease.lease_adults):[]);
    const [childrenOccupants, setChildrenOccupants] = useState(lease.lease_children ? JSON.parse(lease.lease_children):[]);
    const [fees, setFees] = useState(lease.fees ? JSON.parse(lease.fees):[]);
    const [utilities, setUtilities] =  useState(location.state.property["property_utilities-DNU"] ? JSON.parse(location.state.property["property_utilities-DNU"]):[]);
  
    const CenteringBox = ({ children, flexDirection = 'column', justifyContent = 'flex-start'  }) => (
        <Box
            sx={{
            display: 'flex',
            justifyContent: justifyContent,
            alignItems: 'center',
            flexDirection: flexDirection,
            height: '100%',
            }}
        >
            {children}
        </Box>
    );
      

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

    function displayPropertyAddress(){
        if (lease.property_unit){
            return (
                <>
                    {lease.property_address} #{lease.property_unit} {lease.property_city}, {lease.property_state} {lease.property_zipcode}
                </>
            )
        } else {
            return (
                <>
                    {lease.property_address} {lease.property_city} {lease.property_state} {lease.property_zipcode}
                </>
            )
        }
    }
    const handleTenantRefuse = (lease) => {

        const leaseApplicationFormData = new FormData();

        leaseApplicationFormData.append("lease_uid", lease.lease_uid);
        leaseApplicationFormData.append("lease_status", "REFUSED");

        try {
            const response =  axios.put(
                `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, leaseApplicationFormData
            ).then(response => {
                console.log("PUT result", response);
                const data =  response.data;
                if (data.lease_update.code === 200) {
                    navigate('/listings')
                } else {
                    console.log(data);
                }
            }).catch(function (error) {
                console.log(error);
            });
        } catch ( error ) {
            console.log(error);
        }
    }

    const handleTenantAccept = (lease) => {
        const leaseApplicationFormData = new FormData();
        leaseApplicationFormData.append("lease_uid", lease.lease_uid);

        try {
            var status = "TENANT APPROVED";
            const date = new Date();
    
            if (lease.lease_effective_date < date) {
                status = "ACTIVE";
            }
            leaseApplicationFormData.append("lease_status", status);
            const response =  axios.put(
                `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, leaseApplicationFormData
            ).then(response => {
                console.log("PUT result", response);
                const data =  response.data;
                console.log(data);
            }).catch(function (error) {
                console.log(error);
               
            });
        } catch ( error ) {
            console.log(error);
        }
    }

    let linkStr = location.state.property ? location.state.property.lease_documents: null;
    let link = linkStr ? JSON.parse(linkStr) : [];
     
    const [document, setDocument] = useState(link);

    const handleViewButton = (leaseData) => {
        let linkArray = [];
        link.map(l => {
            linkArray.push(l.link)
        })

        navigate('/leaseDocument',{
            state:{
                document: linkArray
            }
        }
        );
        //window.open(,'_blank', 'rel=noopener noreferrer')
    };

    const leaseID = location.state.property.lease_uid; //'300-000005';

    const [fetchData, setFetchData] = useState([]);
    const [leaseData, setLeaseData] = useState([]);


    
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
                                        {`${property.property_address}, ${property.property_city}, ${property.property_state} ${property.property_zip}`}
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
                                        Tenant:  {getTenantName(property)}
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
                                    {/* <Typography
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
                                    </Typography> */}
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
                                        {property.lease_start}
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
                                        {property.lease_end}
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
                                        ${property.property_listed_rent}
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
                                        {property.frequency}
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
                                    {property.lease_rent_late_by} days
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
                                        ${property.lease_rent_late_fee}
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
                                        {getDayText(property.lease_rent_due_by)} of month
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
                                        {property.lease_rent_available_topay} days before
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
                                        {getDayText(property.lease_move_in_date)} of month
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
                                         {countNoOfOccupents(property)}
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
                                        # of Pets
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {countNoOfPets(property)}
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
                                        # of Vehicles
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {countNoOfVehicles(property)}
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
                                        Tenant Utilities
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {utilities.Gas && <div>GAS</div>}
                                        {utilities.Wifi && <div>Wifi</div>}
                                        {utilities.Trash && <div>Trash</div>}
                                        {utilities.Electricity && <div>Electricity</div>}
                                                                           
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    
                                {document.length>0 && <Button sx={{padding: "0px"}}
                                onClick={()=>{handleViewButton(property)}}                >
                                <DescriptionIcon sx={{ fontSize: 19, color: "#3D5CAC" }} />{" "}
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                                    textTransform:"none",
                                            fontSize: '16px',
                                        }}
                                    >
                                   View Document</Typography></Button>}
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
                            onClick={()=>{handleTenantRefuse(property)}}
                        >
                            Reject Lease
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
                            onClick={()=>{handleTenantAccept(property)}}
                        >
                            Accept Lease
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>

    )
}

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



function countNoOfPets(leaseData){

    let petNo = leaseData.lease_pets?JSON.parse(leaseData.lease_pets):[];
    return petNo.length;
}


function countNoOfVehicles(leaseData){

    let lease_vehicles = leaseData.lease_vehicles?JSON.parse(leaseData.lease_vehicles):[];
    return lease_vehicles.length;
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

export default TenantLeases;