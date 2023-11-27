import { Box, ThemeProvider, createTheme } from '@mui/system';

import ChaseIcon from '../Images/ChaseIcon.png';
import VenmoIcon from '../Images/VenmoIcon.png';
import Setting_fill from '../../../images/Setting_fill.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Stack, Typography, Paper } from '@mui/material';
import theme from '../../../theme/theme';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
// const theme = createTheme({
//     palette: {
//         background: {
//             basic: '#000000',
//             gray: '#F2F2F2',
//             blue: '#3D5CAC'
//         },
//         text: {
//             primary: '#3D5CAC',
//             secondary: '#F2F2F2',
//         },
//         typography: {
//             body1: {}
//         }
//     },
// });
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
    useEffect(()=>{
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`)
        .then((res)=>{
            // console.log(res.data);
            setProfileData(res.data.result[0]);
            setShowSpinner(false);
        });
    }, []);
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
                    onClick={(e) => {navigate('/settingsOwner' ,{state: {owner_data: profileData}})}}
                    ></img>
                </Box>
                <Box sx={{
                    justifySelf: 'center',
                    height: '121px',
                    width: '121px',
                    backgroundColor: '#bbb',
                    borderRadius: '50%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    boxShadow: '0px 4px 4px #00000032'
                }}></Box>
                
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
                    
                    <Box sx={{
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
                            <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.44755 0.00189367C3.20488 0.00218967 2.96221 0.00378882 2.71956 0.00669021C2.47903 0.0146838 2.23369 0.0274734 1.99477 0.0706385C1.63369 0.127529 1.29132 0.269081 0.995821 0.483647C0.700323 0.698214 0.460145 0.979664 0.295046 1.30484C0.182801 1.52546 0.112246 1.74928 0.0705546 1.99229C0.0256562 2.2289 0.0112246 2.4719 0.00641405 2.71171C0.00313136 2.82306 0.000993227 2.93444 0 3.04584L0 21.5221C0 21.634 0.00320703 21.7427 0.00481054 21.8531C0.0112246 22.0929 0.0256562 22.3375 0.0689511 22.5757C0.112246 22.8155 0.184404 23.0409 0.29665 23.2615C0.517766 23.6955 0.871537 24.0482 1.30686 24.2687C1.52815 24.3806 1.75264 24.4526 1.99637 24.4957C2.23369 24.5389 2.47743 24.5533 2.71796 24.5597L3.05149 24.5645H35.4328L35.7648 24.5597C36.0053 24.5533 36.2506 24.5389 36.4896 24.4957C36.7301 24.4526 36.9562 24.3822 37.1759 24.2703C37.6123 24.0501 37.9668 23.6966 38.1877 23.2615C38.2999 23.0409 38.3721 22.8171 38.4138 22.5741C38.4571 22.3375 38.4715 22.0945 38.4779 21.8546C38.4811 21.7427 38.4827 21.634 38.4827 21.5221L38.4843 21.1288V3.04424C38.4843 2.93233 38.4811 2.82362 38.4779 2.7133C38.4749 2.47116 38.4534 2.2296 38.4138 1.99069C38.337 1.50925 38.1096 1.06431 37.764 0.71947C37.4185 0.374628 36.9724 0.147532 36.4896 0.0706385C36.2499 0.031243 36.0076 0.00986665 35.7648 0.00669021C35.5227 -0.000142411 35.2805 -0.00174191 35.0384 0.00189367H3.44755ZM3.44755 0.820433H35.4248C35.5306 0.820433 35.6349 0.823631 35.7407 0.82523C35.9251 0.831624 36.1416 0.841216 36.342 0.876388C36.5168 0.908362 36.6627 0.956324 36.8022 1.02667C37.0835 1.16902 37.3121 1.3969 37.4549 1.67734C37.5283 1.82227 37.5792 1.97753 37.6056 2.13777C37.6409 2.33441 37.6505 2.55024 37.6553 2.73569C37.6585 2.8396 37.6601 2.94352 37.6601 3.05063V21.5189C37.6601 21.6228 37.6601 21.7268 37.6553 21.8323C37.6505 22.0161 37.6409 22.2319 37.604 22.4318C37.5693 22.667 37.4783 22.8905 37.3388 23.0833C37.1993 23.2762 37.0152 23.4327 36.8022 23.5397C36.6578 23.6125 36.5032 23.6632 36.3436 23.69C36.1458 23.7213 35.9459 23.7384 35.7455 23.7411L35.4248 23.7459H3.0563C2.95046 23.7459 2.84303 23.7427 2.74201 23.7411C2.5406 23.7385 2.33963 23.7214 2.14069 23.69C1.96591 23.658 1.81999 23.61 1.67888 23.5397C1.39759 23.3979 1.16939 23.1698 1.02785 22.889C0.954585 22.744 0.903765 22.5888 0.877122 22.4286C0.845276 22.2313 0.828125 22.032 0.825809 21.8323C0.823659 21.7273 0.82259 21.6223 0.822602 21.5173V3.04903C0.822602 2.94512 0.822602 2.8396 0.825809 2.73409C0.832223 2.55184 0.841844 2.33761 0.877122 2.13457C0.909192 1.96191 0.957297 1.81643 1.02785 1.67574C1.17073 1.39577 1.39931 1.16843 1.68048 1.02667C1.82565 0.954302 1.98072 0.903665 2.14069 0.876388C2.34113 0.841216 2.5576 0.830026 2.74201 0.82523C2.84624 0.822032 2.95207 0.822032 3.0563 0.820433H3.44755ZM11.0001 6.73566C10.519 6.76124 9.92896 7.0538 9.58901 7.46467C9.28274 7.81638 9.01175 8.39192 9.0823 8.93228C9.62429 8.98025 10.1647 8.6621 10.5062 8.26402C10.8349 7.85156 11.0594 7.3 11.0001 6.73726V6.73566ZM14.5391 7.40711V16.1888H15.9052V13.188H17.7974C19.526 13.188 20.7398 12.0066 20.7398 10.2912C20.7398 8.58057 19.55 7.40552 17.8407 7.40552L14.5391 7.40711ZM15.9052 8.55659H17.4799C18.6649 8.55659 19.3416 9.18968 19.3416 10.2976C19.3416 11.4039 18.6649 12.0434 17.4751 12.0434H15.9052V8.55659ZM10.8478 9.0362C10.1262 9.05219 9.51685 9.48384 9.16408 9.48384C8.78725 9.48384 8.2132 9.06178 7.59103 9.07297C7.18632 9.08304 6.79131 9.19858 6.44528 9.4081C6.09926 9.61761 5.81428 9.9138 5.61871 10.2672C4.77366 11.7188 5.39582 13.8723 6.21842 15.0553C6.6177 15.6405 7.09875 16.2847 7.73214 16.2608C8.33025 16.2384 8.56597 15.8739 9.29236 15.8739C10.0204 15.8739 10.232 16.2608 10.8638 16.2496C11.5212 16.2384 11.9333 15.6644 12.331 15.0777C12.7896 14.4111 12.9772 13.7668 12.9885 13.7332C12.9772 13.7204 11.7217 13.2408 11.7105 11.8004C11.6976 10.5949 12.6966 10.021 12.7431 9.98583C12.1787 9.1545 11.3 9.06178 10.9953 9.0378C10.9462 9.03472 10.897 9.03526 10.8478 9.0362ZM24.003 9.67089C22.4155 9.67089 21.4277 10.523 21.354 11.6789H22.5999C22.7154 11.1065 23.1916 10.742 23.9549 10.742C24.7598 10.742 25.2425 11.1673 25.2425 11.8787V12.3727L23.4835 12.475C21.9585 12.5614 21.0974 13.2488 21.0974 14.3679C21.0974 15.519 21.9762 16.2975 23.2333 16.2975C24.0768 16.2975 24.8881 15.8483 25.2601 15.1353H25.2906V16.1888H26.5542V11.7764C26.5542 10.4926 25.56 9.67089 24.003 9.67089ZM27.1138 9.78599L29.4325 16.1952C29.4325 16.2 29.3154 16.5789 29.3154 16.5901C29.115 17.2456 28.7863 17.503 28.1753 17.503C28.0647 17.503 27.845 17.503 27.7472 17.479V18.5437C27.8434 18.5613 28.1753 18.5741 28.2844 18.5741C29.6153 18.5741 30.2503 18.0753 30.7987 16.523L33.204 9.78599H31.8121L30.1893 14.9962H30.1653L28.5409 9.7844L27.1138 9.78599ZM25.2425 13.2856V13.7908C25.2425 14.6237 24.5209 15.2568 23.6005 15.2568C22.8918 15.2568 22.4283 14.8923 22.4283 14.3311C22.4283 13.7844 22.8741 13.4358 23.6614 13.3831L25.2425 13.2856Z" fill="#160449" />
                            </svg>
                        </Box>
                        <Typography
                        sx={{
                            width: '200px',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.smallFont}}>
                            {profileData.owner_apple_pay}
                        </Typography>
                        <Box sx={{
                            width: '50px',
                            height: '25px',
                        }}></Box>
                    </Box>
                    <Box sx={{
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
                            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.2498 2.41668C17.1317 1.12026 15.1104 0.564453 12.5246 0.564453H5.02C4.76417 0.564463 4.51672 0.657308 4.32216 0.826297C4.1276 0.995286 3.99868 1.22933 3.95859 1.48636L0.833792 21.6458C0.771682 22.0433 1.07429 22.4033 1.47039 22.4033H6.10349L7.26706 14.8959L7.23095 15.131C7.31385 14.6003 7.76002 14.2089 8.28836 14.2089H10.49C14.8151 14.2089 18.2018 12.4219 19.191 7.25249C19.2204 7.0996 19.2458 6.95079 19.2678 6.80541C19.143 6.73815 19.143 6.73815 19.2678 6.80541C19.5624 4.89474 19.2658 3.59416 18.2498 2.41668Z" fill="#27346A" />
                                <path d="M9.03987 6.11712C9.16653 6.05577 9.30506 6.02398 9.44535 6.02407H15.3289C16.0256 6.02407 16.6754 6.07019 17.2692 6.1674C17.4354 6.19436 17.6007 6.22653 17.7649 6.26389C17.9976 6.31613 18.2277 6.38007 18.4542 6.45547C18.7461 6.55465 19.018 6.67015 19.2679 6.80541C19.5624 4.89401 19.2658 3.59416 18.2498 2.41668C17.131 1.12026 15.1104 0.564453 12.5246 0.564453H5.01936C4.49094 0.564453 4.0414 0.955778 3.95859 1.48636L0.833793 21.6451C0.771682 22.0432 1.07429 22.4027 1.46975 22.4027H6.10349L8.51754 6.83055C8.54128 6.67749 8.60122 6.53259 8.69221 6.40831C8.78319 6.28403 8.9025 6.1841 9.03987 6.11712Z" fill="#27346A" />
                                <path d="M19.1913 7.25274C18.202 12.4214 14.8154 14.2092 10.4902 14.2092H8.28796C7.75962 14.2092 7.31337 14.6006 7.23128 15.1312L5.78371 24.4658C5.72963 24.8137 5.99412 25.129 6.34014 25.129H10.2457C10.4695 25.1289 10.6858 25.0476 10.8559 24.8998C11.026 24.752 11.1387 24.5473 11.1736 24.3225L11.2117 24.12L11.9478 19.3745L11.9952 19.1122C12.0301 18.8875 12.1428 18.6828 12.3129 18.5349C12.4829 18.3871 12.6993 18.3058 12.923 18.3058H13.5075C17.2909 18.3058 20.2533 16.7422 21.119 12.2204C21.4804 10.3307 21.2934 8.75298 20.3375 7.6448C20.0476 7.30915 19.6875 7.03194 19.2681 6.80566C19.2454 6.95178 19.2207 7.09985 19.1913 7.25274Z" fill="#2790C3" />
                                <path d="M18.2329 6.38595C18.0786 6.34013 17.9229 6.29956 17.766 6.26432C17.6017 6.22758 17.4364 6.19562 17.2703 6.16849C16.6758 6.07062 16.0265 6.02442 15.3291 6.02442H9.44636C9.30597 6.02409 9.16733 6.05616 9.04088 6.11821C8.90336 6.18498 8.78391 6.28485 8.69289 6.40916C8.60186 6.53348 8.54199 6.67849 8.51847 6.83164L7.26808 14.8963L7.23196 15.1314C7.31422 14.6008 7.76039 14.2093 8.28881 14.2093H10.4911C14.8162 14.2093 18.2028 12.4223 19.192 7.25292C19.2215 7.10003 19.2462 6.95188 19.2689 6.80584C19.0184 6.67132 18.7472 6.55508 18.4552 6.45656C18.3815 6.43171 18.3073 6.40817 18.2329 6.38595Z" fill="#1F264F" />
                            </svg>
                        </Box>
                        <Typography
                        sx={{
                            width: '200px',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.smallFont}}>
                            {profileData.owner_paypal}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50px',
                            height: '25px',
                        }}></Box>
                    </Box>
                    <Box sx={{
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
                            <img src={VenmoIcon} alt="Venmo Icon" width="25" height="25" />
                        </Box>
                        <Typography
                        sx={{
                            width: '200px',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.smallFont}}>
                            {profileData.owner_venmo}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50px',
                            height: '25px',
                        }}></Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2px',
                    }}>
                        <Box sx={{
                            width: '50px',
                            height: '25px',
                        }}>
                            <img src={ChaseIcon} alt="Chase Icon" width="46" height="25" />
                        </Box>
                        <Typography
                        sx={{
                            width: '200px',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.smallFont}}>
                            {profileData.owner_zelle}
                        </Typography>
                        <Box sx={{
                            width: '50px',
                            height: '25px',
                        }}></Box>
                    </Box>
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