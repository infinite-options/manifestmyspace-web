import { Box, ThemeProvider, createTheme } from '@mui/system';

// import PaypalIcon from '../../images/PayPal.png'
// import ZelleIcon from '../../images/Zelle.png'
// import VenmoIcon from '../../images/Venmo.png' 
// import ChaseIcon from '../../images/Chase.png'
// import StripeIcon from '../../images/Stripe.png'
// import ApplePayIcon from '../../images/ApplePay.png'
// import DeleteIcon from '@mui/icons-material/Delete';

// import ChaseIcon from '../Images/ChaseIcon.png';
// import VenmoIcon from '../Images/VenmoIcon.png';
// import ZelleIcon from '../Images/ZelleIcon.png';
// import StripeIcon from '../Images/StripeIcon.png';
// import ApplePayIcon from '../Images/ApplePayIcon.png';
// import PaypalIcon from '../Images/PaypalIcon.png';

import Setting_fill from '../../../images/Setting_fill.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Stack, Typography, Paper } from '@mui/material';
import theme from '../../../theme/theme';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

function PropertyManagementRequest() {
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    
    const [showSpinner, setShowSpinner] = useState(false);
    const [ownerData, setOwnerData] = useState([]);
    const [business_service_fees, set_business_service_fees] = useState([]); // State for business_services_fees
    const [payment_accounts, set_payment_accounts] = useState([]);
  
    useEffect(() => {
        setShowSpinner(true);
        axios
            // .get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`)
            .get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertyDashboardByOwner/${getProfileId()}`)
            .then((res) => {
                setOwnerData(res.data.Property_Dashboard.result[0]);
                console.log("type.......",typeof(ownerData));
                setShowSpinner(false);
                  try {
                    // const parsedFees = JSON.parse(res.data.result[0]?.business_services_fees);
                    // set_business_service_fees(parsedFees);
                } catch (e) {
                    // set_business_service_fees([]);
                }
            });
    
        const fetchPaymentData = async () => {
            try {
                const response = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod/${getProfileId()}`);
                set_payment_accounts(response.data.result);
            } catch (error) {
                set_payment_accounts([]);
                console.error('Error fetching payment accounts:', error);
            }
        };
    
        fetchPaymentData();
    }, [getProfileId]);


    
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
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Take up full screen width
                height: '100vh', // Set the Box height to full view height
                justifyContent: 'flex-start', // Align items at the top
                // backgroundColor:"red",
            }}
          >
            <Box
            style={{
                width: '100%',
                // height: '100%',
                // backgroundColor:"lightblue",
                // backgroundColor: theme.palette.custom.bgBlue,
                // height: '25%', // 25% of the container's height
            }}>
                {/* <Box
                component="span"
                display= 'flex'
                marginTop='20px'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <img 
                    src={Setting_fill} 
                    alt='Settings icon'
                    style={{padding: 5,
                        marginTop: 5,
                        position: 'absolute',
                        left: 0
                    }}
                    onClick={(e) => {navigate('/settingsManager' ,{state: {manager_data: profileData, payments_data: payment_accounts}})}}
                    ></img> */}
                {/* </Box>

                {profileData.business_photo_url !== null ? (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '121px',
            width: '121px',
            // backgroundColor: '#bbb',
            backgroundColor:"yellow",
            borderRadius: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0px 4px 4px #00000032',
        }}
    >
        <img
            src={`${profileData.business_photo_url}?${Date.now()}`} // Append timestamp to the image URL
            alt="Profile"
            style={{
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}
        />
    </Box>
) : (
    <Box sx={{
            justifySelf: 'center',
            height: '121px',
            width: '121px',
            backgroundColor: '#bbb',
            // backgroundColor: "yellow",
            borderRadius: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0px 4px 4px #00000032',
        }}>
        </Box>
)} */}
                
                
                
                <Stack
                direction="row"
                justifyContent="center"
                marginTop= '10px'>
                <Typography
                sx={{
                    // color: theme.typography.common.blue, 
                    color: "#160449",
                    fontWeight: theme.typography.common.fontWeight, 
                    fontSize:theme.typography.largeFont}}>
                    {/* {profileData?.business_name} */}
                    All Property Management Request
                </Typography>
                </Stack>
                
                {/* <Stack
                direction="row"
                justifyContent="center">
                {/* <Typography
                sx={{
                    color: theme.typography.common.blue, 
                    fontWeight: theme.typography.light.fontWeight, 
                    fontSize:theme.typography.smallFont}}>
                    Manager Profile
                </Typography> 
                </Stack> */}
                
                {Object.entries(ownerData).map(([key, value]) => (
                // {Array.isArray(ownerData) && ownerData.map((owner, index) => (
                <Paper
                style={{
                    margin: '30px', // Margin around the paper
                    marginLeft:'auto', 
                    marginRight:'auto', 
                    borderRadius: '20px',
                    padding: theme.spacing(2),
                    backgroundColor:"#D6D5DA",
                    // backgroundColor: theme.palette.primary.main,
                    width: '85%', // Occupy full width with 25px margins on each side
                    [theme.breakpoints.down('sm')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                        width: '50%',
                    },
                }}
                >
                    {ownerData.owner_photo_url !== null ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '29px',
                            width: '29px',
                            backgroundColor: '#bbb',
                            // backgroundColor:"yellow",
                            borderRadius: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            boxShadow: '0px 4px 4px #00000032',
                        }}
                    >
                        <img
                            src={`${ownerData.owner_photo_url}?${Date.now()}`} // Append timestamp to the image URL
                            alt="Profile"
                            style={{
                                borderRadius: '50%',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                ) : (
                    <Box sx={{
                            justifySelf: 'center',
                            height: '29px',
                            width: '29px',
                            backgroundColor: '#bbb',
                            // backgroundColor: "yellow",
                            borderRadius: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            boxShadow: '0px 4px 4px #00000032',
                        }}>
                        </Box>
                        )}
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Owner:  
                    </Typography>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {ownerData?.owner_first_name} {ownerData?.owner_last_name}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Email: 
                    </Typography>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {ownerData?.owner_email}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Address : 
                    </Typography>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {ownerData?.owner_address}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Phone Number: 
                    </Typography>
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {ownerData?.owner_phone_number}
                    </Typography>
                    </Stack>
                    
                    {/* <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {manager_address}
                    </Typography>
                    </Stack> */}
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        // color: theme.typography.common.blue, 
                        color: '#160449',
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Beds: {ownerData?.property_num_beds} Baths: {ownerData?.property_num_baths} 
                    </Typography>
                    </Stack>
                </Paper>

                ))}
                
                
                    {/* <Box sx={{
                        borderRadius: "10px",
                        boxShadow: '0px 4px 4px #00000032'
                    }}>
                        <GrayBox>
                            <TextBox fontSize={'15px'} fontWeight={'bold'}>
                                Edit Profile and Password
                            </TextBox>
                        </GrayBox>
                    </Box> */}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

function GrayBox(props) {
    return (
        <Box sx={{
            backgroundColor: 'background.gray',
            borderRadius: "10px",
            // margin: "18px",
            padding: '6px',
        }}>
            {props.children}
        </Box>
    );
}

function FlexBox(props) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: props.direction,
            justifyContent: 'space-evenly',
        }}>
            {props.children}
        </Box>
    );
}

function TextBox(props) {
    return (
        <Box sx={{
            display: "flex",
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            textDecoration: props.decoration,
        }}>
            {props.children}
        </Box>
    );
}
export default PropertyManagementRequest;