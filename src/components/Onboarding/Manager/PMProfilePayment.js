import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography,
  FormControlLabel,  Checkbox } from '@mui/material';
import theme from '../../../theme/theme';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import { Select} from "@mui/material";
import { Grid } from '@mui/material';
import { MenuItem} from "@mui/material";
import { useContext } from 'react';
import { useMyContext } from '../../../contexts/SettingsACHContext';
import StatusBarPM3 from '../../../images/onboarding/status_bar_pm3.png';
import PayPal from '../../../images/PayPal.png'
import Zelle from '../../../images/Zelle.png'
import Venmo from '../../../images/Venmo.png'
import Chase from '../../../images/Chase.png'
import Stripe from '../../../images/Stripe.png'
import ApplePay from '../../../images/ApplePay.png'

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

function PMProfilePayment() {
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
                <img src={StatusBarPM3}/>
              </Box>
                  </Stack>
                 
                  <Typography 
                        sx={{ 
                            color: theme.typography.propertyPage.color,
                            fontFamily: 'Source Sans Pro',
                            fontWeight: theme.typography.common.fontWeight, 
                            fontSize:theme.typography.largeFont}}>
                           Payment Info
                        </Typography>
                 
                </>
              </Box>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                
                <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={PayPal}/>
                    </Grid>
                    <Grid item xs={8}>
                    <TextField variant="filled" fullWidth placeholder="Enter Paypal" className={classes.root} />
                    </Grid>
                    </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={ApplePay}/>
                    </Grid>
                    <Grid item xs={8}>
                    <TextField variant="filled" fullWidth placeholder="Enter Apple Pay" className={classes.root} />
                    </Grid>
                    </Grid>
                
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={Stripe}/>
                    </Grid>
                    <Grid item xs={8}>
                    <TextField variant="filled" fullWidth placeholder="Use Stripe" className={classes.root} />
                    </Grid>
                    </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={Zelle}/>
                    </Grid>
                    <Grid item xs={8}>
                    <TextField variant="filled" fullWidth placeholder="Enter Zelle Number" className={classes.root} />
                      </Grid>
                    </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={Venmo}/>
                    </Grid>
                    <Grid item xs={8}>
                    <TextField variant="filled" fullWidth placeholder="Enter Venmo" className={classes.root} />
                    </Grid>
                    </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                   
                    <Grid item xs={10}>
                    <TextField variant="filled" fullWidth placeholder="Connect credit card" className={classes.root} />
                    </Grid>
                    </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    
                    <Grid item xs={10}>
                    <TextField variant="filled" fullWidth placeholder="Connect bank account" className={classes.root} />
                    </Grid>
                    </Grid>
                </Grid>
                
              {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        <img src={Chase}/>
                    </Grid>
                   
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid> */}
              <Box sx={{paddingTop: '20%'}}></Box>
              <Button 
              variant="contained"
              sx={{
                  background: '#3D5CAC',
                  color: theme.palette.background.default,
                  width: `90%`,
                  height: `6%`,
                  left: `14px`,
                  top: `4px`,
                  borderRadius: '10px 10px 10px 10px'
              }} onClick={()=>{navigate('/onboardingRouter')}} >Next Step</Button>
              
              <Stack spacing={-8} m={12}></Stack>
              <Stack spacing={-8} m={12}></Stack>
          </Paper>
          </Box>
          

      </ThemeProvider>
    )
}

export default PMProfilePayment;