import React, { Component,useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, TextField,Checkbox, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useContext } from 'react';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_3.png'

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

    const handleNextStep = () => {

        console.log("account_annual_card_volume",account_annual_card_volume);
        console.log("account_merchant_category_code",account_merchant_category_code);
        console.log("account_default_statement_descriptor",account_default_statement_descriptor);
        console.log("account_max_card_transaction_amount",account_max_card_transaction_amount);
        console.log("account_max_ach_transaction_amount",account_max_ach_transaction_amount);

        console.log("Click Button to page 4 ")
        navigate('/settingsManagerACH4')
    };
    const { 
        account_annual_card_volume, update_account_annual_card_volume,
        account_merchant_category_code, update_account_merchant_category_code,
        account_default_statement_descriptor, update_account_default_statement_descriptor,
        account_max_card_transaction_amount, update_account_max_card_transaction_amount,
        account_max_ach_transaction_amount, update_account_max_ach_transaction_amount,
        
} = useMyContext();

  const handleChange1 = (event) => {
    update_account_annual_card_volume(event.target.value);
  };

  const handleChange2 = (event) => {
    update_account_merchant_category_code(event.target.value);
  };
  
  const handleChange3 = (event) => {
    update_account_default_statement_descriptor(event.target.value);
  };

  const handleChange4 = (event) => {
    update_account_max_card_transaction_amount(event.target.value);
  };
  
  const handleChange5 = (event) => {
    update_account_max_ach_transaction_amount(event.target.value);
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
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Processing Information</Typography>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Annual Card Volume</Typography>
                <TextField  name="account_annual_card_volume" value={account_annual_card_volume} placeholder="$" onChange={handleChange1} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Merchant Category Code (MCC)</Typography>
                <TextField  name="account_merchant_category_code" value={account_merchant_category_code} placeholder="Enter a 4-digit number" onChange={handleChange2} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Default Statement Descriptor</Typography>
                <TextField  name="account_default_statement_descriptor" value={account_default_statement_descriptor} placeholder="000000000000000000" onChange={handleChange3} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Max Card Transaction Amount</Typography>
                <TextField  name="account_max_card_transaction_amount" value={account_max_card_transaction_amount} placeholder="000000000000000000" onChange={handleChange4} variant="filled" fullWidth className={classes.root}></TextField>
                </Stack>
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Max ACH Transaction Amount</Typography>
                <TextField  name="account_max_ach_transaction_amount" value={account_max_ach_transaction_amount} placeholder="10,0000" onChange={handleChange5} variant="filled" fullWidth className={classes.root}></TextField>
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