import React, { Component,useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useContext } from 'react';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_2.png'

import { FormControlLabel, TextField,Checkbox, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { 
    MenuItem,
    Select,
} from "@mui/material";
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


export default function SettingsACH2() {
    const [show, setShow] = useState(true);
    const classes = useStyles();
    const navigate = useNavigate();

    const { 
        account_principal_first_name, update_account_principal_first_name,
        account_principal_last_name, update_account_principal_last_name,
        account_principal_title, update_account_principal_title,
        account_principal_birth_date, update_account_principal_birth_date,
        account_principal_ownership_percentage, update_account_principal_ownership_percentage,
        account_principal_phone, update_account_principal_phone,
        account_principal_ssn, update_account_principal_ssn,
        account_principal_address, update_account_principal_address,
        account_principal_city, update_account_principal_city,
        account_principal_state, update_account_principal_state,
        account_principal_zip, update_account_principal_zip,
        account_principal_country, update_account_principal_country,
        account_principal_email, update_account_principal_email,

} = useMyContext();

const handleNextStep = () => {

    console.log("account_principal_first_name",account_principal_first_name);
    console.log("account_principal_last_name",account_principal_last_name);
    console.log("account_principal_title",account_principal_title);
    console.log("account_principal_birth_date",account_principal_birth_date);
    console.log("account_principal_ownership_percentage",account_principal_ownership_percentage);
    console.log("account_principal_phone",account_principal_phone);
    console.log("account_principal_ssn",account_principal_ssn);
    console.log("account_principal_address",account_principal_address);
    console.log("account_principal_city",account_principal_city);
    console.log("account_principal_state",account_principal_state);
    console.log("account_principal_zip",account_principal_zip);
    console.log("account_principal_country",account_principal_country);
    console.log("account_principal_email",account_principal_email);

    console.log("Click Button to page 3 ")
    navigate('/settingsManagerACH3')
  };

    const handleChange1 = (event) => {
        update_account_principal_first_name(event.target.value);
      };
    
      const handleChange2 = (event) => {
        update_account_principal_last_name(event.target.value);
      };
	  
	  const handleChange3 = (event) => {
        update_account_principal_title(event.target.value);
      };
    
      const handleChange4 = (event) => {
        update_account_principal_birth_date(event.target.value);
      };
	  
	  const handleChange5 = (event) => {
        update_account_principal_ownership_percentage(event.target.value);
      };
    
      const handleChange6 = (event) => {
        update_account_principal_phone(event.target.value);
      };
	  
	  const handleChange7 = (event) => {
        update_account_principal_ssn(event.target.value);
      };
    
      const handleChange8 = (event) => {
        update_account_principal_address(event.target.value);
      };
	  
	  const handleChange9 = (event) => {
        update_account_principal_city(event.target.value);
      };
    
      const handleChange10 = (event) => {
        update_account_principal_state(event.target.value);
      };
	  
	  const handleChange11 = (event) => {
        update_account_principal_zip(event.target.value);
      };
    
      const handleChange12 = (event) => {
        update_account_principal_country(event.target.value);
      };
	  
	  const handleChange13 = (event) => {
        update_account_principal_email(event.target.value);
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
            style={{
                width: '100%',
                backgroundColor: theme.palette.custom.bgBlue,
                height: '25%', // 25% of the container's height
                borderRadius: '0px 0px 10px 10px'
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
                    Manager Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Connect Bank Account</Typography>
                <hr/>
                <Box>
                  <img src={StatusBar}/>
                </Box>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Principal 1</Typography>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>First Name</Typography>
                    <TextField onChange={handleChange1} name="account_principal_first_name" value={account_principal_first_name} variant="filled" fullWidth placeholder="Enter first name" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Last Name</Typography>
                    <TextField onChange={handleChange2} name="account_principal_last_name" value={account_principal_last_name} variant="filled" fullWidth placeholder="Enter last name" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Title</Typography>
                    <TextField onChange={handleChange3} name="account_principal_title" value={account_principal_title} variant="filled" placeholder="00000000000" fullWidth className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Date of Birth</Typography>
                    <TextField onChange={handleChange4} name="account_principal_birth_date" value={account_principal_birth_date} variant="filled" placeholder="mm/dd/yyyy" fullWidth className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Principle Percentage Ownership</Typography>
                <TextField onChange={handleChange5} name="account_principal_ownership_percentage" value={account_principal_ownership_percentage} variant="filled" fullWidth placeholder="Enter percentage of ownership" className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Personal Phone</Typography>
                    <TextField onChange={handleChange6} name="account_principal_phone" value={account_principal_phone} variant="filled" fullWidth  placeholder="(123)456-7890" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Social Security</Typography>
                    <TextField onChange={handleChange7} name="account_principal_ssn" value={account_principal_ssn} variant="filled" fullWidth placeholder="000-00-0000"  className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Address</Typography>
                <TextField onChange={handleChange8} name="account_principal_address" value={account_principal_address} variant="filled" fullWidth placeholder="Street Address" className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                    <TextField onChange={handleChange9} name="account_principal_city" value={account_principal_city}  variant="filled" fullWidth placeholder="City" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                    <Select onChange={handleChange10} name="account_principal_state" value={account_principal_state} size="small" fullWidth >                               
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
                    <TextField onChange={handleChange11} name="account_principal_zip" value={account_principal_zip} variant="filled" fullWidth placeholder="Enter zip code" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Country</Typography>
                    <Select onChange={handleChange12} name="account_principal_country" value={account_principal_country} size="small" fullWidth >                               
                                                <MenuItem value={1}>Country1</MenuItem>
                                                <MenuItem value={2} >Country2</MenuItem>
                                                <MenuItem value={3} >Country3</MenuItem>
                    </Select>
                    </Stack>
                </Grid>
                </Grid>
            <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Email Address</Typography>
                <TextField onChange={handleChange13} name="account_principal_email" value={account_principal_email} variant="filled" placeholder="abc@xyz.com" fullWidth className={classes.root}></TextField>
            </Stack>
            <Button 
                variant="contained"
                sx={{
                    background: '#3D5CAC',
                    color: theme.palette.background.default,
                    width: `90%`,
                    height: `10%`,
                    left: `14px`,
                    top: `4px`,
                    borderRadius: '10px 10px 10px 10px'
                }} onClick={handleNextStep}>Next Step</Button>
                <button 
                    onClick={handleNextStep}>Next Step</button>
                <Stack spacing={-8} m={12}></Stack>
            </Paper>
            </Box>
            </Box>

        </ThemeProvider>
    )
}