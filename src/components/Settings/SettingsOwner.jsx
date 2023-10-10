import React, { Component } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "../../contexts/UserContext";

export default function Settings() {
    const navigate = useNavigate();
    const { logout } = useUser();
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
                        }}/>
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
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'
                flexDirection="column">
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        width: 45,
                        height:45,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
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
                    John Lennon
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
                    Owner Profile
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
                    onClick={()=>{navigate('/editProfileSettings')}}/>
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
                    onClick={()=>{navigate('/changePasswordSettings')}}/>
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
                    onClick={()=>{navigate('/cardDetailsSettings')}}/>
                    </Box>                    
                    <Box
                    component="span"
                    m={5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black}}>
                    Push notifications
                    </Typography>
                    <Typography sx={{color: theme.typography.common.blue}}>
                    l
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
                    Dark mode
                    </Typography>
                    <Typography sx={{color: theme.typography.common.blue}}>
                    l
                    </Typography>
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
            </Paper>
            <Button
            variant="contained"
            onClick={() => {
              logout();
              navigate("/tenantDashboard")}
            }
            sx={{
              background: "white",
              color: "#3D5CAC",
              width: `50%`,
              height: `20%`,
              left: `14px`,
              top: `4px`,
              borderRadius: "10px 10px 10px 10px",
              margin: "5% 50% 30% 5%",
              fontWeight: "bold",
              fontFamily: "Source Sans Pro",
              textTransform: "none",
              fontSize: theme.typography.smallFont,
            }}
          >
            Sign Out
          </Button>
            </Box>
            </Box>
        </ThemeProvider>
    )
}