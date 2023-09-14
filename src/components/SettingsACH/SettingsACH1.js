import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import { Select} from "@mui/material";
import { Grid } from '@mui/material';
import { MenuItem} from "@mui/material";
import { useContext } from 'react';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_1.png'

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

function SettingsACH1() {

    const { 
                account_business_id, update_account_business_id,
                account_business_legal_name, update_account_business_legal_name,
                account_business_name, update_account_business_name,
                account_business_website, update_account_business_website,
                account_business_phone, update_account_business_phone,
                account_business_type, update_account_business_type,
                account_business_ownership_type, update_account_business_ownership_type,
                account_business_incorporation_date, update_account_business_incorporation_date,
                account_business_tax_id, update_account_business_tax_id,
                account_business_address, update_account_business_address,
                account_business_city, update_account_business_city,
                account_business_state, update_account_business_state,
                account_business_zip, update_account_business_zip,
                account_business_country, update_account_business_country,
				
      } = useMyContext();

    const classes = useStyles();
    const navigate = useNavigate();

      const handleNextStep = () => {

        console.log("account_business_id",account_business_id);
        console.log("account_business_legal_name",account_business_legal_name);
        console.log("account_business_name",account_business_name);
        console.log("account_business_website",account_business_website);
        console.log("account_business_phone",account_business_phone);
        console.log("account_business_type",account_business_type);
        console.log("account_business_ownership_type",account_business_ownership_type);
        console.log("account_business_incorporation_date",account_business_incorporation_date);
        console.log("account_business_tax_id",account_business_tax_id);
        console.log("account_business_address",account_business_address);
        console.log("account_business_city",account_business_city);
        console.log("account_business_state",account_business_state);
        console.log("account_business_zip",account_business_zip);
        console.log("account_business_country",account_business_country);

        console.log("Click Button to page 2 ")
        navigate('/settingsManagerACH2')
      };

      const handleChange1 = (event) => {
        update_account_business_legal_name(event.target.value);
      };
    
      const handleChange2 = (event) => {
        update_account_business_name(event.target.value);
      };
	  
	  const handleChange3 = (event) => {
        update_account_business_website(event.target.value);
      };
    
      const handleChange4 = (event) => {
        update_account_business_phone(event.target.value);
      };
	  
	  const handleChange5 = (event) => {
        update_account_business_type(event.target.value);
      };
    
      const handleChange6 = (event) => {
        update_account_business_ownership_type(event.target.value);
      };
	  
	  const handleChange7 = (event) => {
        update_account_business_incorporation_date(event.target.value);
      };
    
      const handleChange8 = (event) => {
        update_account_business_tax_id(event.target.value);
      };
	  
	  const handleChange9 = (event) => {
        update_account_business_address(event.target.value);
      };
    
      const handleChange10 = (event) => {
        update_account_business_city(event.target.value);
      };
	  
	  const handleChange11 = (event) => {
        update_account_business_state(event.target.value);
      };
    
      const handleChange12 = (event) => {
        update_account_business_zip(event.target.value);
      };
	  
	  const handleChange13 = (event) => {
        update_account_business_country(event.target.value);
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
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Legal Business Name</Typography>
                 <TextField name="account_business_legal_name" value={account_business_legal_name} onChange={handleChange1} placeholder="Enter Name"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Doing Business As</Typography>
                <TextField name="account_business_name" value={account_business_name} onChange={handleChange2} placeholder="Enter Alternative Name"  variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Website</Typography>
                <TextField name="account_business_website" value={account_business_website} onChange={handleChange3} variant="filled" placeholder="https://example.com" fullWidth className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business Phone</Typography>
                <TextField name="account_business_phone" value={account_business_phone} onChange={handleChange4} variant="filled" placeholder="(123)456-7890"  fullWidth className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business Type</Typography>
                    <Select name="account_business_type" value={account_business_type} onChange={handleChange5} size="small" fullWidth >                               
                                                <MenuItem value={1}>Association Estate Trust</MenuItem>
                                                <MenuItem value={2}>Corporation (Private)</MenuItem>
                                                <MenuItem value={3}>Corporation (Public)</MenuItem>
                                                <MenuItem value={4}>Government Agency</MenuItem>
                                                <MenuItem value={5}>Individual Sole Proprietorship</MenuItem>
                                                <MenuItem value={6}>International Organization</MenuItem>
                                                <MenuItem value={7}>United Liability Company</MenuItem>
                                                <MenuItem value={8}>Partnership</MenuItem>
                                                <MenuItem value={9}>Tax Exempt Organization</MenuItem>

                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Ownership Type</Typography>
                    <Select name="account_business_ownership_type" value={account_business_ownership_type} onChange={handleChange6}  size="small" fullWidth >                               
                                    <MenuItem value={1}>Private</MenuItem>
                                    <MenuItem value={2}>Public</MenuItem>
                    </Select>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Date of Incorporation</Typography>
                    <TextField name="account_business_incorporation_date" value={account_business_incorporation_date} onChange={handleChange7}  variant="filled" placeholder="mm/dd/yyyy" fullWidth className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Tax ID (EIN) or SSN</Typography>
                    <TextField name="account_business_tax_id" value={account_business_tax_id} onChange={handleChange8} variant="filled" fullWidth placeholder="00000000000" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                </Grid>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business Address</Typography>
                <TextField name="account_business_address" value={account_business_address} onChange={handleChange9} variant="filled" fullWidth placeholder="Street Address" className={classes.root}></TextField>
                </Stack>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                    <TextField name="account_business_city" value={account_business_city} onChange={handleChange10} variant="filled" fullWidth placeholder="City" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                    <Select name="account_business_state" value={account_business_state} onChange={handleChange11} size="small" fullWidth >                               
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
                    <TextField name="account_business_zip" value={account_business_zip} onChange={handleChange12}  variant="filled" fullWidth placeholder="Enter zip code" className={classes.root}></TextField>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Country</Typography>
                    <Select name="account_business_country" value={account_business_country} onChange={handleChange13} size="small" fullWidth >                               
                                                <MenuItem value={1}>Country1</MenuItem>
                                                <MenuItem value={2} >Country2</MenuItem>
                                                <MenuItem value={3} >Country3</MenuItem>
                    </Select>
                    </Stack>
                </Grid>
                </Grid>
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

export default SettingsACH1;