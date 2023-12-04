import React, { Component , useState} from 'react';
import { Paper, Box, Stack, ThemeProvider,Switch, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "../../contexts/UserContext";

export default function SettingsTenant() {
    const navigate = useNavigate();
    const { logout } = useUser();
    let [isOn1, switchState1]=useState(true)
    let [isOn2, switchState2]=useState(true)
    const location = useLocation();
    let tenant_data = location.state.tenant_data;
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
                    {tenant_data.tenant_photo_url !== null ? (
                        <img
                            src={tenant_data.tenant_photo_url}
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
                    {tenant_data.tenant_first_name? tenant_data.tenant_first_name : '<FIRST_NAME>'} {tenant_data.tenant_last_name? tenant_data.tenant_last_name : '<LAST_NAME>'}
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
                    Tenant Profile
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
                    onClick={()=>{navigate('/editProfileSettingsTenant' ,{state: {tenant_data: tenant_data}})}}/>
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
                    // onClick={()=>{navigate('/changePasswordSettings')}}/>
                    onClick={()=>{navigate('/changePasswordSettingsTenant' ,{state: {tenant_data: tenant_data}})}}/>
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
                    onClick={()=>{navigate('/cardDetailsSettingsTenant' ,{state: {tenant_data: tenant_data}})}}/>
                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                
                <Typography>Allow Notification</Typography> 
                <Switch sx={{backgroundColor:"#3D5CAC"}} checked={isOn1} onChange={()=>{switchState1(!isOn1)}}/>
                

                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                
              
                
                <Typography>Dark Mode</Typography> 
                <Switch sx={{backgroundColor:"#3D5CAC"}}  checked={isOn2} onChange={()=>{switchState2(!isOn2)}} />
                


                    
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