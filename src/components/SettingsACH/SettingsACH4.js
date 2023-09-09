import React, { Component,useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_4.png'

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

export default function SettingsACH4() {
    const [show, setShow] = useState(true);
    const classes = useStyles();
    const navigate = useNavigate();

    const handleNextStep = () => {

        console.log("account_business_description",account_business_description);
        console.log("account_average_card_transaction_amount",account_average_card_transaction_amount);
        console.log("account_average_echeck_transaction_amount",account_average_echeck_transaction_amount);
        console.log("account_annual_ach_volume",account_annual_ach_volume);
        console.log("account_refund_policy",account_refund_policy);
        console.log("account_btb_volume_percentage",account_btb_volume_percentage);
        console.log("account_btc_volume_percentage",account_btc_volume_percentage);
        console.log("account_other_volume",account_other_volume);
        console.log("account_card_present_percentage",account_card_present_percentage);
        console.log("account_ecommerce_percentage",account_ecommerce_percentage);
        console.log("account_mail_tele_order_percentage",account_mail_tele_order_percentage);

        console.log("Click Button to page 5 ")
        navigate('/settingsManagerACH5')
    };

    const { 
        account_business_description, update_account_business_description,
        account_average_card_transaction_amount, update_account_average_card_transaction_amount,
        account_average_echeck_transaction_amount, update_account_average_echeck_transaction_amount,
        account_annual_ach_volume, update_account_annual_ach_volume,
        account_refund_policy, update_account_refund_policy,
        account_btb_volume_percentage, update_account_btb_volume_percentage,
        account_btc_volume_percentage, update_account_btc_volume_percentage,
        account_other_volume, update_account_other_volume,
        account_card_present_percentage, update_account_card_present_percentage,
        account_ecommerce_percentage, update_account_ecommerce_percentage,
        account_mail_tele_order_percentage, update_account_mail_tele_order_percentage,
    } = useMyContext();

      const handleChange1 = (event) => {
        update_account_business_description(event.target.value);
      };
    
      const handleChange2 = (event) => {
        update_account_average_card_transaction_amount(event.target.value);
      };
	  
	  const handleChange3 = (event) => {
        update_account_average_echeck_transaction_amount(event.target.value);
      };
    
      const handleChange4 = (event) => {
        update_account_annual_ach_volume(event.target.value);
      };
	  
	  const handleChange5 = (event) => {
        update_account_refund_policy(event.target.value);
      };
    
      const handleChange6 = (event) => {
        update_account_btb_volume_percentage(event.target.value);
      };
	  
	  const handleChange7 = (event) => {
        update_account_btc_volume_percentage(event.target.value);
      };
    
      const handleChange8 = (event) => {
        update_account_other_volume(event.target.value);
      };
	  
	  const handleChange9 = (event) => {
        update_account_card_present_percentage(event.target.value);
      };
    
      const handleChange10 = (event) => {
        update_account_ecommerce_percentage(event.target.value);
      };
	  
	  const handleChange11 = (event) => {
        update_account_mail_tele_order_percentage(event.target.value);
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
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Additional Data</Typography>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business Description</Typography>
                <TextField name="account_business_description" value={account_business_description} placeholder="$ 0000000000000000000" onChange={handleChange1} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Average Card Transaction Amount</Typography>
                <TextField name="account_average_card_transaction_amount" value={account_average_card_transaction_amount} placeholder="$ 0000000000000000000" onChange={handleChange2} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Average eCheck Transaction Amount</Typography>
                <TextField  name="account_average_echeck_transaction_amount" value={account_average_echeck_transaction_amount} placeholder="$ 0000000000000000000" onChange={handleChange3} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Annual ACH Volume</Typography>
                <TextField  name="account_annual_ach_volume" value={account_annual_ach_volume} placeholder="0000000000000000000" onChange={handleChange4} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Refund Policy</Typography>
                <Select  name="account_refund_policy" value={account_refund_policy} placeholder="0000000000000000000" onChange={handleChange5} size="small" fullWidth >                               
                        <MenuItem value={0}>No Refund</MenuItem>
                        <MenuItem value={1}>Refund</MenuItem>
                </Select>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Payment Volume By Business Type</Typography>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business to Business Volume Percentage</Typography>
                <TextField  name="account_btb_volume_percentage" value={account_btb_volume_percentage} placeholder="0000000000000000000" onChange={handleChange6} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business to Consumer Volume Percentage</Typography>
                <TextField  name="account_btc_volume_percentage" value={account_btc_volume_percentage} placeholder="0000000000000000000" onChange={handleChange7} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Other Volume</Typography>
                <TextField  name="account_other_volume" value={account_other_volume} placeholder="0000000000000000000" onChange={handleChange8} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Card Volume Details</Typography>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Card Present percentage</Typography>
                <TextField  name="account_card_present_percentage" value={account_card_present_percentage} placeholder="0000000000000000000" onChange={handleChange9} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>E-Commerence Percentage</Typography>
                <TextField  name="account_ecommerce_percentage" value={account_ecommerce_percentage} placeholder="0000000000000000000" onChange={handleChange10} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Mail Order /Telephone Order Percentage</Typography>
                <TextField  name="account_mail_tele_order_percentage" value={account_mail_tele_order_percentage} placeholder="0000000000000000000" onChange={handleChange11} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Fininx Terms of Service Accepted</Typography>
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