import { Box, ThemeProvider, createTheme } from '@mui/system';

import ChaseIcon from '../Images/ChaseIcon.png';
import VenmoIcon from '../Images/VenmoIcon.png';
import ZelleIcon from '../Images/ZelleIcon.png';
import StripeIcon from '../Images/StripeIcon.png';
import ApplePayIcon from '../Images/ApplePayIcon.png';
import PaypalIcon from '../Images/PaypalIcon.png';
import Setting_fill from '../../../images/Setting_fill.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Stack, Typography, Paper } from '@mui/material';
import theme from '../../../theme/theme';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";


function OwnerProfile() {
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    function getPhoneNumberText(data) {
        if(data === undefined) {
            return '';
        }
        const num1 = data.slice(0, 3);
        const num2 = data.slice(3, 6);
        const num3 = data.slice(6);
        return `(${num1}) ${num2} - ${num3}`;
    }
    function getSSNText(data) {
        if(data === undefined) {
            return '***-**-****';
        }
        const num1 = data.slice(0, 3);
        const num2 = data.slice(3, 5);
        const num3 = data.slice(5);
        return `${num1}_${num2}_${num3}`;
    }
    const [showSpinner, setShowSpinner] = useState(false);
    const [profileData, setProfileData] = useState([]);
    const [payment_accounts, set_payment_accounts] = useState([]);

    useEffect(()=>{
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`)
        .then((res)=>{
            // console.log(res.data);
            setProfileData(res.data.result[0]);
            setShowSpinner(false);
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
    }, []);

    let paymentElements = {
        'zelle': { icon: <img src={ZelleIcon} alt="Zelle Icon" width="25" height="25" />} ,
        'apple_pay': {icon: <img src={ApplePayIcon} alt="ApplePay Icon" width="25" height="25" />},
        'stripe':{icon: <img src={StripeIcon} alt="Stripe Icon" width="25" height="25" />},
        'paypal':{icon: <img src={PaypalIcon} alt="Paypal Icon" width="25" height="25" />},
        'venmo':{ icon: <img src={VenmoIcon} alt="Venmo Icon" width="25" height="25" /> },
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
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Take up full screen width
                height: '100vh', // Set the Box height to full view height
                justifyContent: 'flex-start', // Align items at the top
            }}
          >
            <Box
            style={{
                width: '100%',
                // backgroundColor: theme.palette.custom.bgBlue,
                // height: '25%', // 25% of the container's height
            }}>
                <Box
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
                    // onClick={(e) => {navigate('/settingsOwner') }}
                    onClick={(e) => {navigate('/settingsOwner' ,{state: {owner_data: profileData, payments_data: payment_accounts}})}}
                    ></img>
                </Box>
                {profileData.owner_photo_url !== null ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '121px',
                            width: '121px',
                            backgroundColor: '#bbb',
                            borderRadius: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            boxShadow: '0px 4px 4px #00000032'
                        }}
                    >
                        <img
                            src={profileData.owner_photo_url}
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
                        borderRadius: '50%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        boxShadow: '0px 4px 4px #00000032'
                    }}>
                        
                    </Box>
                )}
                
                <Stack
                direction="row"
                justifyContent="center"
                marginTop= '10px'>
                <Typography
                sx={{
                    color: theme.typography.common.blue, 
                    fontWeight: theme.typography.common.fontWeight, 
                    fontSize:theme.typography.largeFont}}>
                    {profileData.owner_first_name} {profileData.owner_last_name}
                </Typography>
                </Stack>
                
                <Stack
                direction="row"
                justifyContent="center">
                <Typography
                sx={{
                    color: theme.typography.common.blue, 
                    fontWeight: theme.typography.light.fontWeight, 
                    fontSize:theme.typography.smallFont}}>
                    Owner Profile
                </Typography>
                </Stack>
                <Paper
                style={{
                    margin: '30px', // Margin around the paper
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.primary.main,
                    width: '85%', // Occupy full width with 25px margins on each side
                    [theme.breakpoints.down('sm')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                        width: '50%',
                    },
                }}
                >
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {profileData.owner_email}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Email
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {getPhoneNumberText(profileData.owner_phone_number)}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Phone Number
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        {profileData.owner_address ? profileData.owner_address : '-'}
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="center">
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Address
                    </Typography>
                    </Stack>
                </Paper>
                
                <Paper
                style={{
                    margin: '30px', // Margin around the paper
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.primary.main,
                    width: '85%', // Occupy full width with 25px margins on each side
                    [theme.breakpoints.down('sm')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                        width: '50%',
                    },
                }}
                >
                    <Stack
                    direction="row"
                    justifyContent="center"
                    marginTop={5}>
                    <Typography
                    sx={{
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.common.fontWeight, 
                        fontSize:theme.typography.smallFont}}>
                        Account Details
                    </Typography>
                    </Stack>

                    {payment_accounts.map(payment_account => <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2px',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50px',
                            height: '25px',
                        }}>
                            
                        { paymentElements[payment_account.paymentMethod_type].icon}


                        </Box>
                        <Typography
                        sx={{
                            width: '200px',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.smallFont}}>
                            {payment_account.paymentMethod_name}
                        </Typography>
                        <Box sx={{
                            width: '50px',
                            height: '25px',
                        }}></Box> 
                    </Box> )} 
                </Paper>
                
                <Paper
                style={{
                    margin: '30px', // Margin around the paper
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.primary.main,
                    width: '85%', // Occupy full width with 25px margins on each side
                    [theme.breakpoints.down('sm')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                        width: '50%',
                    },
                }}
                >
                    <FlexBox direction="row">
                    <Box sx={{marginTop: 10, marginBottom: 10}}>
                        <Typography
                        sx={{
                            // width: '200px',
                            color: theme.typography.common.blue, 
                            fontSize: '16px',
                            fontWeight: 'bold'}}>
                            {getSSNText(profileData.owner_ssn)}
                        </Typography>
                        
                        <Stack
                        direction="row"
                        justifyContent="center">
                            <Typography
                            sx={{
                                // width: '200px',
                                color: theme.typography.common.blue, 
                                fontSize: '12px'}}>
                                SSN
                            </Typography>
                        </Stack>
                    </Box>
                    <Box sx={{marginTop: 10, marginBottom: 10}}>
                        <Typography
                        sx={{
                            // width: '200px',
                            color: theme.typography.common.blue, 
                            fontSize: '16px',
                            fontWeight: 'bold'}}>
                            {profileData.owner_ein_number === "" ? "No EIN Provided" : profileData.owner_ein_number}
                        </Typography>
                        
                        <Stack
                        direction="row"
                        justifyContent="center">
                            <Typography
                            sx={{
                                // width: '200px',
                                color: theme.typography.common.blue, 
                                fontSize: '12px'}}>
                                EIN
                            </Typography>
                        </Stack>
                    </Box>
                    </FlexBox>
                </Paper>
                    
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
export default OwnerProfile;