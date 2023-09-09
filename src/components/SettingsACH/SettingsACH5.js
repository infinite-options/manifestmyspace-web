import React, { Component,useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { FormControlLabel, TextField,Checkbox, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { 
    MenuItem,
    Select,
} from "@mui/material";
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_5.png'

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

export default function SettingsACH3() {
    const [show, setShow] = useState(true);
    const classes = useStyles();
    const navigate = useNavigate();

    
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
        
        account_annual_card_volume, update_account_annual_card_volume,
        account_merchant_category_code, update_account_merchant_category_code,
        account_default_statement_descriptor, update_account_default_statement_descriptor,
        account_max_card_transaction_amount, update_account_max_card_transaction_amount,
        account_max_ach_transaction_amount, update_account_max_ach_transaction_amount,
        
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

        account_name, update_account_name,
        account_routing_number, update_account_routing_number,
        account_number, update_account_number,
        account_type, update_account_type,
    } = useMyContext();

    const [account_number_repeat, set_account_number_repeat]= useState();
    
    const handleNextStep = () => {

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const input = {
            account_business_id:"600-000007",
            account_business_legal_name:account_business_legal_name,
            account_business_name:account_business_name,
            account_business_website:account_business_website,
            account_business_phone:account_business_phone,
            account_business_type:account_business_type,
            account_business_ownership_type:account_business_ownership_type,
            account_business_incorporation_date:account_business_incorporation_date,
            account_business_tax_id:account_business_tax_id,
            account_business_address:account_business_address,
            account_business_city:account_business_city,
            account_business_state:account_business_state,
            account_business_zip:account_business_zip,
            account_business_country:account_business_country,
            account_principal_first_name:account_principal_first_name,
            account_principal_last_name:account_principal_last_name,
            account_principal_title:account_principal_title,
            account_principal_birth_date:account_principal_birth_date,
            account_principal_ownership_percentage:account_principal_ownership_percentage,
            account_principal_phone:account_principal_phone,
            account_principal_ssn:account_principal_ssn,
            account_principal_address:account_principal_address,
            account_principal_city:account_principal_city,
            account_principal_state:account_principal_state,
            account_principal_zip:account_principal_zip,
            account_principal_country:account_principal_country,
            account_principal_email:account_principal_email,
            account_annual_card_volume:account_annual_card_volume,
            account_merchant_category_code:account_merchant_category_code,
            account_default_statement_descriptor:account_default_statement_descriptor,
            account_max_card_transaction_amount:account_max_card_transaction_amount,
            account_max_ach_transaction_amount:account_max_ach_transaction_amount,
            account_business_description:account_business_description,
            account_average_card_transaction_amount:account_average_card_transaction_amount,
            account_average_echeck_transaction_amount:account_average_echeck_transaction_amount,
            account_annual_ach_volume:account_annual_ach_volume,
            account_refund_policy:account_refund_policy,
            account_btb_volume_percentage:account_btb_volume_percentage,
            account_btc_volume_percentage:account_btc_volume_percentage,
            account_other_volume:account_other_volume,
            account_card_present_percentage:account_card_present_percentage,
            account_ecommerce_percentage:account_ecommerce_percentage,
            account_mail_tele_order_percentage:account_mail_tele_order_percentage,
            account_name:account_name,
            account_routing_number:account_routing_number,
            account_number:account_number,
            account_type:account_type    
        };

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
        console.log("account_annual_card_volume",account_annual_card_volume);
        console.log("account_merchant_category_code",account_merchant_category_code);
        console.log("account_default_statement_descriptor",account_default_statement_descriptor);
        console.log("account_max_card_transaction_amount",account_max_card_transaction_amount);
        console.log("account_max_ach_transaction_amount",account_max_ach_transaction_amount);
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
        console.log("account_name",account_name);
        console.log("account_routing_number",account_routing_number);
        console.log("account_number",account_number);
        console.log("account_number_repeat",account_number_repeat);
        console.log("account_type",account_type);

        axios.post("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/account",
        input,
        headers)
        .then(response => {
            console.log("PUT result", response);
        }).catch(function (error) {
            console.log(error);
        });

        axios.get("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/account?account_business_id=600-000007",
        headers)
        .then(response => {
            console.log("GET result", response);
        }).catch(function (error) {
            console.log(error);
        });

        console.log("Click Button Submit ")
    };

    const handleChange1 = (event) => {
        update_account_name(event.target.value);
      };
    
      const handleChange2 = (event) => {
        update_account_routing_number(event.target.value);
      };
	  
	  const handleChange3 = (event) => {
        update_account_number(event.target.value);
      };

      const handleChange4 = (event) => {
        set_account_number_repeat(event.target.value);
      };
    
      const handleChange5 = (event) => {
        update_account_type(event.target.value);
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
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Name Of Account</Typography>
                <TextField name="account_name" value={account_name} placeholder="Ex Chase" onChange={handleChange1} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Routing Number</Typography>
                <TextField name="account_routing_number" value={account_routing_number} placeholder="00000000" onChange={handleChange2} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Account Number</Typography>
                <TextField name="account_number" value={account_number} placeholder="0000000000000000000" onChange={handleChange3} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Re-enter Account Number</Typography>
                <TextField name="account_number_repeat" value={account_number_repeat} placeholder="0000000000000000000" onChange={handleChange4} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Account Type</Typography>
                <Select  name="account_type" value={account_type} placeholder="" onChange={handleChange5} size="small" fullWidth >                               
                        <MenuItem value={1}>Type 1</MenuItem>
                        <MenuItem value={2}>Type 2</MenuItem>
                </Select>
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