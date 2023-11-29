import React, { Component, useState, useEffect  } from 'react';
import { Paper, Box, Stack, ThemeProvider, Checkbox, Typography, TextField, Button, FormControlLabel, AccordionDetails, Grid } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";
import PayPal from '../../images/PayPal.png'
import Zelle from '../../images/Zelle.png'
import Venmo from '../../images/Venmo.png' 
import Chase from '../../images/Chase.png'
import Stripe from '../../images/Stripe.png'
import ApplePay from '../../images/ApplePay.png'

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
      },
    },
    typography: {
        backgroundColor: "#D6D5DA",
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
        display: 'flex',
        alignItems: 'center',
    }
  }));
export default function CardDetailsSettings() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    let   owner_data = location.state.owner_data;

    const [modifiedData, setModifiedData] = useState({ 'owner_uid': owner_data?.owner_uid, });
    const [isEdited, setIsEdited] = useState(false);

    const [paypal, setPaypal] = useState(owner_data.owner_paypal? owner_data.owner_paypal : '');
    const [applePay, setApplePay] = useState(owner_data.owner_apple_pay? owner_data.owner_apple_pay : '');
    const [stripe, setStripe] = useState(owner_data.owner_stripe? owner_data.owner_stripe : '');
    const [zelle, setZelle] = useState(owner_data.owner_zelle? owner_data.owner_zelle : '');
    const [venmo, setVenmo] = useState(owner_data.owner_venmo? owner_data.owner_venmo : '');

    const handleInputChange = (event) => {
        console.log("Input changed")
        const { name, value } = event.target;
        // console.log(name)
        // console.log(value)

        if (name === 'owner_paypal') {
            setPaypal(value);
        } else if (name === 'owner_apple_pay') {
            setApplePay(value);
        } else if (name === 'owner_stripe') {
            setStripe(value);
        } else if (name === 'owner_zelle') {
            setZelle(value);
        } else if (name === 'owner_venmo') {
            setVenmo(value);
        }

        setModifiedData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        setIsEdited(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("FORM SUBMITTED");
        console.log(modifiedData);

        const formData = new FormData();
        for (const key in modifiedData) {
            if (Object.hasOwnProperty.call(modifiedData, key)) {
                const value = modifiedData[key];
                
                // Check if the value is a non-null object (excluding arrays)
                const serializedValue = (value !== null && typeof value === 'object')
                    ? JSON.stringify(value)
                    : String(value);
    
                formData.append(key, serializedValue);
            }
        }

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        if(isEdited){
            console.log("EDITED")
            // axios.put('http://localhost:4000/ownerProfile', modifiedData, headers)
            axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', formData, headers)
            .then((response) => {
                console.log('Data updated successfully');
                setIsEdited(false); // Reset the edit status
                navigate(-1)
            })
            .catch((error) => {
                if(error.response){
                    console.log(error.response.data);
                }
            });
        }
    }





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
                    onClick={()=>{navigate(-1)}}/>
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
                    {owner_data.owner_photo_url !== null ? (
                        <img
                            src={owner_data.owner_photo_url}
                            alt="Profile"
                            style={{
                                borderRadius: '50%',
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    ) : (
                        <AccountCircleIcon
                            sx={{
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    )}
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
                    {owner_data.owner_first_name? owner_data.owner_first_name : '<FIRST_NAME>'} {owner_data.owner_last_name? owner_data.owner_last_name : '<LAST_NAME>'}
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
                    Owner Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    id="editProfileForm"
                >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={PayPal}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Paypal</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="owner_paypal" value={paypal} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={ApplePay}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Apple Pay</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="owner_apple_pay" value={applePay} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={Stripe}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Stripe</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={Zelle}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Zelle</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="owner_zelle" value={zelle} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={Venmo}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Venmo</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="owner_venmo" value={venmo} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                            <img src={Chase}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ color: theme.typography.common.blue }}>Chase</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Box
                        component="span"
                        m={2}
                        p={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.typography}>
                            <Typography sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}>Connect credit card</Typography>
                            <ArrowForwardIosIcon 
                            sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                            // onClick={()=>{navigate('/addCardSettings')}}/>
                            onClick={()=>{navigate('/addCardSettings' ,{state: {owner_data: owner_data}})}}/>
                    </Box>
                    <Box
                        component="span"
                        m={2}
                        p={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.typography}>
                            <Typography sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}>Setup ACH Transfer</Typography>
                            <ArrowForwardIosIcon 
                            sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                            onClick={()=>{navigate('/settingsManagerACH1')}}/>
                    </Box>
                    <Button
                        variant="contained"
                        type="submit"
                        form="editProfileForm"
                        sx={{
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        background: "#3D5CAC",
                        color: theme.palette.background.default,
                        width: `100%`,
                        height: `15%`,
                        borderRadius: "15px",
                        fontSize: theme.typography.smallFont,
                        fontWeight: theme.typography.primary.fontWeight,
                        textTransform: "none",
                        }}
                    >
                        {"Save and Submit"}
                    </Button>
                </Box>
            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}