import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import ManifestWhite from '../../images/onboarding/manifest_white.png';
import Owners from '../../images/onboarding/Owners.png';
import Manager from '../../images/onboarding/Manager.png';
import Tenants from '../../images/onboarding/Tenants.png';
import Maintenance from '../../images/onboarding/Maintenance.png';


const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
        paddingBottom: '15px',
      },
    },
  }));

function Onboarding() {

    const classes = useStyles();
    const navigate = useNavigate();

    return (        
        <ThemeProvider theme={theme}>
            <Box>
            <Box sx={{
                    width: `100%`,
                    height: `50%`,
                    objectFit: 'contain'
                }}>
                <img src={ManifestWhite}/>
            </Box>
            
             <Box
            style={{
                width: '100%',
                backgroundColor: theme.palette.custom.bgBlue,
                height: '75%', // 25% of the container's height
                borderRadius: '0px 0px 10px 10px'
            }}>
               <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.palette.background.default, fontWeight: theme.typography.primary.fontWeight }}>Welcome to ManifestMy.Space!</Typography>
                 </Stack>
                 <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.palette.background.default, fontWeight: theme.typography.primary.fontWeight }}>Your complete property management solution! From seasoned managers to owners, tenants, and maintenance pros – we've got you covered.

                Manifest makes managing properties a breeze, so you can focus on what truly matters. Join us today and let's manifest a brighter, more efficient future for property management!

                Already have an account?
                <u><a style={{color:'#ffffff'}} href="/returningUser">Log In?</a></u></Typography>
                 </Stack>

            </Box>
          <Button 
                variant="contained"
                sx={{
                    background: '#3D5CAC',
                    color: theme.palette.background.default,
                    width: `90%`,
                    height: `15%`,
                    left:`5%`,
                    borderRadius: '15px'
                }} onClick={()=>{navigate('/newUser')}} >Create Account</Button>
                
                        <Box sx={{
                            borderRadius: "5px",
                            paddingLeft: '6%',
                            paddingRight: '5%',
                            paddingTop: '5%',
                        }}>
                            <Box sx={{paddingTop: '3%'}}><img src={Owners}/></Box>
                            <Box sx={{paddingTop: '3%'}}><img src={Manager}/></Box>
                            <Box sx={{paddingTop: '3%'}}><img src={Tenants}/></Box>
                            <Box sx={{paddingTop: '3%'}}><img src={Maintenance}/></Box>
                        </Box>
                        <Button 
                  variant="contained"
                  sx={{
                      background: '#3D5CAC',
                      color: theme.palette.background.default,
                      width: `90%`,
                      height: `15%`,
                      left:`5%`,
                      borderRadius: '15px'
                  }} onClick={()=>{navigate('/newUser')}}
                             >Sign Up</Button>
                             <Stack spacing={-16} m={12}></Stack>
                        
            </Box>
        </ThemeProvider>
    )
}
export default Onboarding;