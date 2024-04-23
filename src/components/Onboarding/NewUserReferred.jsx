//rohit - delete this file

import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import axios from "axios";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import GoogleSignup from './GoogleSignup';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

function NewUserReferred() {
    console.log("In NewUserReferred");
    const { userID } = useParams();
    console.log("ROHIT - userID from params - ", userID);
    const [showSpinner, setShowSpinner] = useState(false);

    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        setShowSpinner(true);
        axios.get(`http://localhost:4000/userInfo/${userID}`).then((res) => { //rohit
        // axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${userIDParam}`).then((res) => {
          const data = res.data?.result[0];
          console.log("ROHIT - userInfo - data - ", data);
          
          const roles = [];
          roles.push(data.role);


    
          
          setShowSpinner(false);
        }).catch((error) => {
            if (error.response && error.response.status === 404) {
              // Display alert for user not found
              alert("Error - Referral not found");
              setShowSpinner(false);
            } else {
              // Handle other errors here
              console.error("Error fetching user data:", error);
            }
        });
    
      }, []);

    return (   
        <>   
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
                            New User
                        </Typography>
                        <hr/>
                </Box>
                <Stack spacing={-6} m={12}>
                <Box>
                    <GoogleSignup isReferral={true}/>
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
                                }} onClick={()=>{navigate(`/referralSignup`, {state: {userID: userID}})}}>Sign Up With Email</Button>  
            
                <Stack spacing={-20} m={12}>
                    <Typography 
                        sx={{
                            justifySelf: 'center',
                            color: theme.typography.common.default, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.primary.smallFont}}>
                        Already have an account ?  <u><a href="/returningUser">Log In</a></u>
                        </Typography>
                    </Stack>          
                </Box>
            </ThemeProvider>
        </>
    )
}

export default NewUserReferred;