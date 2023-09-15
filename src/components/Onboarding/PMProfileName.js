import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import { Select} from "@mui/material";
import { Grid } from '@mui/material';
import { MenuItem} from "@mui/material";
import { useContext } from 'react';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBarPM2 from '../../images/onboarding/status_bar_pm1.png';
import NewProfilePicture from '../../images/onboarding/new_profile_picture.png';

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

function PMProfileName() {
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
          
              <Box
              component="span"
              display= 'flex'
              margin='10px'
              justifyContent= 'center'
              alignItems= 'center'
              position= 'relative'>
                 
                  
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
                  
                  <>
                  <Stack
                  direction="row"
                  justifyContent="center"
                  >
                  <Box
                  sx={{
                    paddingLeft: '20%',
                    paddingTop: '10%'
                  }}>
                <img src={StatusBarPM2}/>
              </Box>
                  </Stack>
                  <Stack
                  direction="row"
                  justifyContent="center"
                  >
                  <Typography 
                        sx={{ 
                            color: theme.typography.propertyPage.color,
                            fontFamily: 'Source Sans Pro',
                            fontWeight: theme.typography.common.fontWeight, 
                            fontSize:theme.typography.largeFont}}>
                           Property Manager Profile Info
                        </Typography>
                  </Stack>
                  <Box sx={{paddingTop: '10%'}}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Display Name</Typography>
                  </Box>
                  </>
              </Box>
              <TextField name="first_last_name"   variant="filled" fullWidth placeholder="Enter your first and last name" className={classes.root}></TextField>
              <Box sx={{paddingTop: '10%'}}></Box>
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
                
                <Box sx={{paddingTop: '10%'}}></Box>
                <Box sx={{
                    paddingLeft: '20%',
                    justifySelf: 'center'}}>
                <img src={NewProfilePicture}/>
                </Box>
                <Box sx={{paddingTop: '30%'}}></Box>
              <Button 
              variant="contained"
              sx={{
                  background: '#3D5CAC',
                  color: theme.palette.background.default,
                  width: `90%`,
                  height: `8%`,
                  left: `14px`,
                  top: `4px`,
                  borderRadius: '10px 10px 10px 10px'
              }} onClick={()=>{navigate('/pmProfileDisplay')}}>Next Step</Button>
              
              <Stack spacing={-8} m={12}></Stack>
          </Paper>
          </Box>
          

      </ThemeProvider>
    )
}

export default PMProfileName;