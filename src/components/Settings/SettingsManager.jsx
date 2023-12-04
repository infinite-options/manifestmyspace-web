import React, { Component , useState} from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "../../contexts/UserContext";
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';


export default function SettingsManager() {
    const navigate = useNavigate();
    const { logout, user } = useUser();
    let [isOn1, switchState1]=useState(true)
    let [isOn2, switchState2]=useState(true)
    const location = useLocation();
    let manager_data = location.state.manager_data;
    let payments_data = location.state.payments_data;
    return (
        <ThemeProvider theme={theme}>
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
                backgroundColor: theme.palette.custom.bgBlue,
                height: '25%', // 25% of the container's height
            }}>
                <Box
                component="span"
                display= 'flex'
                margin='10px'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <UTurnLeftIcon 
                    sx={{
                        transform: "rotate(90deg)", 
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont, 
                        padding: 5,
                        position: 'absolute',
                        left: 0
                        }}
                        onClick={()=>{navigate(-1)}}
                        />
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Settings
                    </Typography>
                </Box>
            <Paper
              style={{
                margin: "5% 50% 5% 5%", // Margin around the paper
                backgroundColor: theme.palette.primary.main,
                width: "90%",
              }}
            >
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'
                flexDirection="column">
                    {manager_data.business_photo_url !== null ? (
                        <img
                            src={manager_data.business_photo_url}
                            alt="Profile"
                            style={{
                                borderRadius: '50%',
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    ) : (
                        <AccountCircleIcon
                            sx={{
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    )}
                    <>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    {/* {user.first_name} {user.last_name} */}
                    {manager_data.business_name? manager_data.business_name : '<BUSINESS_NAME>'}
                    </Typography>
                    </Stack>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.primary.smallFont}}>
                    Manager Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography sx={{color: theme.typography.common.blue}}>
                    Account Settings
                    </Typography>    
                    </Box>            
                    <Box
                    component="span"
                    // marginTop={5}
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Edit profile
                    </Typography>
                    <ArrowForwardIosIcon 
                    sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                    // onClick={()=>{navigate('/editProfileSettings')}}/>
                    // onClick={()=>{navigate('/pmProfileEdit' ,{state: {manager_data: manager_data}})}}/>
                    onClick={()=>{navigate('/editProfileSettingsManager' ,{state: {manager_data: manager_data}})}}/>
                    
                    </Box>
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Change password
                    </Typography>
                    <ArrowForwardIosIcon 
                    sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                    onClick={()=>{navigate('/changePasswordSettingsManager' ,{state: {manager_data: manager_data}})}}/>
                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Add a payment method
                    </Typography>
                    <AddIcon 
                    sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                    // onClick={()=>{navigate('/cardDetailsSettings')}}/>
                    onClick={()=>{navigate('/cardDetailsSettingsManager' ,{state: {manager_data: manager_data, payments_data: payments_data}})}}/>
                    </Box>                    
                    
                    <Box
                        component="span"
                        m={5}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography>Allow Notification</Typography> 
                        <IOSSwitch checked={isOn1} onChange={()=>{switchState1(!isOn1)}} />
                    </Box>                     
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                
              
                
                <Typography>Dark Mode</Typography> 
                <IOSSwitch  checked={isOn2} onChange={()=>{switchState2(!isOn2)}} />
                


                    
                    </Box>
                    <hr/>
                    <Box
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography sx={{color: theme.typography.common.blue}}>
                    More
                    </Typography>        
                    </Box>            
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    About us
                    </Typography>
                    <ArrowForwardIosIcon sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}/>
                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Privacy policy
                    </Typography>
                    <ArrowForwardIosIcon sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}/>
                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Terms and conditions
                    </Typography>
                    <ArrowForwardIosIcon sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}/>
                    </Box>
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Add Role
                    </Typography>
                    <ArrowForwardIosIcon sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                        onClick={()=>{navigate('/AddRole')}}
                    />
                    </Box>
            </Paper>
            <Button
            variant="contained"
            onClick={() => {
              logout();
            }}
            sx={{
              background: theme.palette.primary.main,
              color: "#3D5CAC",
              width: "90%",
              height: "32px",
              borderRadius: '10px',
              margin: "5% 50% 30% 5%",
              fontWeight: "bold",
              fontFamily: "Source Sans Pro",
              textTransform: "none",
              fontSize: theme.typography.smallFont,
              "&:hover, &:focus, &:active": {
                background: theme.palette.primary.main,
              },
            }}
          >
            Sign Out
          </Button>
            </Box>
            </Box>
        </ThemeProvider>
    )
}

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#3D5CAC',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));