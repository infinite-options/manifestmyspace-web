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
import StatusBarPM2 from '../../images/onboarding/status_bar_pm2.png';

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

function PMProfileDisplay() {
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
                  
                  </>
              </Box>

               <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Email Address</Typography>
                 <TextField name="pm_email_address"   placeholder="email@site.com"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Phone Number</Typography>
                <TextField name="pm_phone_number"   placeholder="(000)000-0000"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>           
                <hr/>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}> Address</Typography>
                <TextField name="pm_address" variant="filled" fullWidth placeholder="Enter street address" className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Unit #</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="3" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                    <TextField name="pm_city"  variant="filled" fullWidth placeholder="San Jose" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                    <Select name="pm_state"  size="small" fullWidth >                               
                        <MenuItem value={1}>CA</MenuItem>
                        <MenuItem value={2}>TX</MenuItem>
                        <MenuItem value={3}>FL</MenuItem>
                        <MenuItem value={4}>NY</MenuItem>
                        <MenuItem value={5}>IL</MenuItem>
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Zip Code</Typography>
                    <TextField name="pm_zip"   variant="filled" fullWidth placeholder="90234" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>
                <Box sx={{paddingLeft: '30%'}}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Management Fees</Typography>
                </Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Fee Name</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Service Charge" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Frequency</Typography>
                    <Select name="pm_state"  size="small" fullWidth > 
                        <MenuItem value={0}>Select frequency</MenuItem>                              
                        <MenuItem value={1}>Hourly</MenuItem>
                        <MenuItem value={2}>Daily</MenuItem>
                        <MenuItem value={3}>Weekly</MenuItem>
                        <MenuItem value={4}>Biweekly</MenuItem>
                        <MenuItem value={5}>Monthly</MenuItem>
                        <MenuItem value={6}>Annually</MenuItem>
                        
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Set Charge</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="15%" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Percentage Of</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Rent" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Fee Name</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Service Charge" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Frequency</Typography>
                    <Select name="pm_state"  size="small" fullWidth >                               
                        <MenuItem value={1}>Annual</MenuItem>
                        <MenuItem value={2}>Monthly</MenuItem>
                        
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Set Charge</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="15%" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Percentage Of</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Rent" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Fee Name</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Service Charge" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Frequency</Typography>
                    <Select name="pm_state"  size="small" fullWidth >                               
                        <MenuItem value={1}>Annual</MenuItem>
                        <MenuItem value={2}>Monthly</MenuItem>
                        
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Set Charge</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="15%" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Percentage Of</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Rent" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Fee Name</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Service Charge" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Frequency</Typography>
                    <Select name="pm_state"  size="small" fullWidth >                               
                        <MenuItem value={1}>Annual</MenuItem>
                        <MenuItem value={2}>Monthly</MenuItem>
                        
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Set Charge</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="15%" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Percentage Of</Typography>
                    <TextField name="pm_unit"  variant="filled" fullWidth placeholder="Rent" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>SSN</Typography>
                    <TextField name="unit"  variant="filled" fullWidth placeholder="***-**-****" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>EIN</Typography>
                    <TextField name="account_business_city"  variant="filled" fullWidth placeholder="Enter EIN" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <Button 
              variant="contained"
              sx={{
                  background: '#3D5CAC',
                  color: theme.palette.background.default,
                  width: `100%`,
                  height: `3%`,
                  left: `5px`,
                  top: `4px`,
                  borderRadius: '10px 10px 10px 10px'
              }} onClick={()=>{navigate('/pmProfilePayment')}}>Next Step</Button>
              
              <Stack spacing={-8} m={12}></Stack>
              <Stack spacing={-8} m={12}></Stack>
              <Stack spacing={-8} m={12}></Stack>
          </Paper>
          </Box>
          

      </ThemeProvider>
    )
}

export default PMProfileDisplay;