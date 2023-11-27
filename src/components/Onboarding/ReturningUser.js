import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { TextField } from '@mui/material';
import GoogleLogin from './GoogleLogin';

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

function ReturningUser() {

    const classes = useStyles();
    const navigate = useNavigate();

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
          <Box style={{
              paddingTop: '10%',
              width: '80%',
              paddingBottom: '10%'

          }}>
                  <Typography 
                  sx={{
                      color: theme.typography.propertyPage.color, 
                      fontWeight: theme.typography.common.fontWeight, 
                      fontSize:theme.typography.largeFont}}>
                      Returning User
                  </Typography>
                  <hr/>
          </Box>
          <Stack spacing={-6} m={12}>
          <Box>
            <GoogleLogin />
          </Box>   
          </Stack>
          <Button 
                          sx={{
                              background: '#3D5CAC',
                              color: theme.palette.background.default,
                              width: `326px`,
                              height: `60.5px`,
                              borderRadius: '15px',
                              fontSize:theme.typography.smallFont,
                              fontWeight: theme.typography.primary.fontWeight, 
                          }} onClick={()=>{navigate('/userLogin')}} >Log In With Email</Button>  
          <Stack spacing={-20} m={12}>
              <Typography 
                  sx={{
                      justifySelf: 'center',
                      color: theme.typography.common.default, 
                      fontWeight: theme.typography.light.fontWeight, 
                      fontSize:theme.typography.primary.smallFont}}>
                  Don't have an account ?  <u><a href="/newUser">Sign Up</a></u>
                  </Typography>
              </Stack>          
          </Box>
      </ThemeProvider>
    )
}

export default ReturningUser;