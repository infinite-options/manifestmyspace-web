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
import { useMyContext } from '../../contexts/POProfileContext';
import StatusBarPM2 from '../../images/onboarding/status_bar_pm2.png';
import axios from "axios";

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

function POProfileDisplay() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { 
        owner_user_id, update_owner_user_id,
        owner_first_name, update_owner_first_name,
        owner_last_name, update_owner_last_name,
        owner_phone_number, update_owner_phone_number,
        owner_email, update_owner_email,
        owner_ein_number, update_owner_ein_number,
        owner_ssn, update_owner_ssn,
        owner_address, update_owner_address,
        owner_unit, update_owner_unit,
        owner_city, update_owner_city,
        owner_state, update_owner_state,
        owner_zip, update_owner_zip,
    } = useMyContext(); 

    const handleNextStep = () => {
      
        console.log("owner_user_id",owner_user_id);
        console.log("owner_first_name",owner_first_name);
        console.log("owner_last_name",owner_last_name);
        console.log("owner_phone_number",owner_phone_number);
        console.log("owner_email",owner_email);
        console.log("owner_ein_number",owner_ein_number);
        console.log("owner_ssn",owner_ssn);
        console.log("owner_address",owner_address);
        console.log("owner_unit",owner_unit);
        console.log("owner_city",owner_city);
        console.log("owner_state",owner_state);
        console.log("owner_zip",owner_zip);

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const input = {
					owner_user_id:"1",
                    owner_first_name:owner_first_name,
                    owner_last_name:owner_last_name,
                    owner_phone_number:owner_phone_number,
                    owner_email:owner_email,
                    owner_ein_number:owner_ein_number,
                    owner_ssn:owner_ssn,
                    owner_address:owner_address,
                    owner_unit:owner_unit,
                    owner_city:owner_city,
                    owner_state:owner_state,
                    owner_zip:owner_zip,
		}

        console.log("API call ")

        axios.post("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/ownerProfile",
        input,
        headers)
        .then(response => {
            console.log("POST result", response);
        }).catch(function (error) {
            console.log(error);
        });

        navigate('/poProfilePayment')
    };

    const handleChange1 = (event) => {
        update_owner_email(event.target.value);
      };
    
      const handleChange2 = (event) => {
        update_owner_phone_number(event.target.value);
      };
      
      const handleChange3 = (event) => {
        update_owner_address(event.target.value);
      };
    
      const handleChange4 = (event) => {
        update_owner_unit(event.target.value);
      };
      
      const handleChange5 = (event) => {
        update_owner_city(event.target.value);
      };
    
      const handleChange6 = (event) => {
        update_owner_state(event.target.value);
      };
      
      const handleChange7 = (event) => {
        update_owner_zip(event.target.value);
      };
    
      const handleChange8 = (event) => {
        update_owner_ein_number(event.target.value);
      };    

      const handleChange9 = (event) => {
        update_owner_ssn(event.target.value);
      };    

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
                           Property Owner Profile Info
                        </Typography>
                  </Stack>
                  
                  </>
              </Box>
		

               <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Email Address</Typography>
                 <TextField name="owner_email"  value={owner_email} onChange={handleChange1}  placeholder="email@site.com"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Phone Number</Typography>
                <TextField name="owner_phone_number" value={owner_phone_number} onChange={handleChange2} placeholder="(000)000-0000"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>           
                <hr/>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}> Address</Typography>
                <TextField name="owner_address" value={owner_address} onChange={handleChange3} variant="filled" fullWidth placeholder="Enter street address" className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Unit #</Typography>
                    <TextField name="owner_unit" value={owner_unit} onChange={handleChange4}  variant="filled" fullWidth placeholder="3" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                    <TextField name="owner_city" value={owner_city} onChange={handleChange5} variant="filled" fullWidth placeholder="San Jose" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                    <Select name="owner_state" value={owner_state} onChange={handleChange6} size="small" fullWidth >                               
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
                    <TextField name="owner_zip"  value={owner_zip} onChange={handleChange7} variant="filled" fullWidth placeholder="90234" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <hr/>
        
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>SSN</Typography>
                    <TextField name="owner_ssn" value={owner_ssn} onChange={handleChange9} variant="filled" fullWidth placeholder="***-**-****" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>EIN</Typography>
                    <TextField name="owner_ein_number" value={owner_ein_number} onChange={handleChange8} variant="filled" fullWidth placeholder="Enter EIN" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <Button 
              variant="contained"
              sx={{
                  background: '#3D5CAC',
                  color: theme.palette.background.default,
                  width: `100%`,
                  height: `5%`,
                  left: `5px`,
                  top: `4px`,
                  borderRadius: '10px 10px 10px 10px'
              }} onClick={handleNextStep} >Next Step</Button>
              
              <Stack spacing={-8} m={12}></Stack>
              <Stack spacing={-8} m={12}></Stack>
              <Stack spacing={-8} m={12}></Stack>
          </Paper>
          </Box>
          

      </ThemeProvider>
    )
}

export default POProfileDisplay;