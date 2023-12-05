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
    let   payments_data = location.state.payments_data;

    useEffect(() => {
        console.log("CardDetailsSettingsManager useEffect");
        console.log("Payments Data", payments_data);
    }, []);

    
    

    // const [modifiedData, setModifiedData] = useState({ 'business_uid': manager_data?.business_uid, });
    const [modifiedPaymentsData, setModifiedPaymentsData] = useState(payments_data);
    useEffect(()=>{
        console.log("modifiedPaymentsData - ");
        console.log("   ", modifiedPaymentsData);
    }, [modifiedPaymentsData]);
    const [newPaymentsData, setNewPaymentsData] = useState([]);
    useEffect(()=>{
        console.log("newPaymentsData - ");
        console.log("   ", newPaymentsData);
    }, [newPaymentsData]);


    const [modifiedData, setModifiedData] = useState({ 'owner_uid': owner_data?.owner_uid, });
    const [isEdited, setIsEdited] = useState(false);
    const [isNewMethodAdded, setIsNewMethodAdded] = useState(false);

    const [paypal, setPaypal] = useState(payments_data.find(method => method.paymentMethod_type === "paypal"));
    const [applePay, setApplePay] = useState(payments_data.find(method => method.paymentMethod_type === "apple_pay"));
    const [stripe, setStripe] = useState(payments_data.find(method => method.paymentMethod_type === "stripe"));
    const [zelle, setZelle] = useState(payments_data.find(method => method.paymentMethod_type === "zelle"));
    const [venmo, setVenmo] = useState(payments_data.find(method => method.paymentMethod_type === "venmo"));


    const getActiveStatus = (name) => {
        const foundMethod = payments_data.find(method => method.paymentMethod_type === name);
        if(foundMethod){
            if(foundMethod.paymentMethod_status === "Active"){
                return true;
            } else {
                return false;
            }
        }
    }   

    const [paypalActiveStatus, setPaypalActiveStatus] = useState(getActiveStatus("paypal"));
    useEffect(()=>{
        changePaymentMethodStatus("paypal", paypalActiveStatus);
    }, [paypalActiveStatus]);

    const [applePayActiveStatus, setApplePayActiveStatus] = useState(getActiveStatus("apple_pay"));
    useEffect(()=>{
        changePaymentMethodStatus("apple_pay", applePayActiveStatus);
    }, [applePayActiveStatus]);

    const [stripeActiveStatus, setStripeActiveStatus] = useState(getActiveStatus("stripe"));
    useEffect(()=>{
        changePaymentMethodStatus("stripe", stripeActiveStatus);
    }, [stripeActiveStatus]);

    const [zelleActiveStatus, setZelleActiveStatus] = useState(getActiveStatus("zelle"));
    useEffect(()=>{
        changePaymentMethodStatus("zelle", zelleActiveStatus);
    }, [zelleActiveStatus]);

    const [venmoActiveStatus, setVenmoActiveStatus] = useState(getActiveStatus("venmo"));
    useEffect(()=>{
        changePaymentMethodStatus("venmo", venmoActiveStatus);
    }, [venmoActiveStatus]);


    const getPaymentMethodStatus = (name) => {  
        let status = null;
        if (name === 'paypal') {
            paypalActiveStatus? status = "Active" : status =  "Inactive";
        } else if (name === 'apple_pay') {
            applePayActiveStatus? status = "Active" : status =  "Inactive";
        } else if (name === 'stripe') {
            stripeActiveStatus? status = "Active" : status =  "Inactive";
        } else if (name === 'zelle') {
            zelleActiveStatus? status = "Active" : status =  "Inactive";
        } else if (name === 'venmo') {
            venmoActiveStatus? status = "Active" : status =  "Inactive";
        }

        return status;
    }

    // const hasPaypalPayment      = (payments_data.find(method => method.paymentMethod_type === "paypal")) ? true: false;
    // const hasApplePayPayment    = (payments_data.find(method => method.paymentMethod_type === "apple_pay")) ? true: false;
    // const hasStripePayment      = (payments_data.find(method => method.paymentMethod_type === "stripe")) ? true: false;
    // const hasZellePayment       = (payments_data.find(method => method.paymentMethod_type === "zelle")) ? true: false;
    // const hasVenmoPayment       = (payments_data.find(method => method.paymentMethod_type === "venmo")) ? true: false;

    // console.log("Has Payment Method")
    // console.log("   paypal - ",hasPaypalPayment);
    // console.log("   apple_pay - ",hasApplePayPayment);
    // console.log("   stripe - ",hasStripePayment)   
    // console.log("   zelle - ",hasZellePayment);
    // console.log("   venmo - ",hasVenmoPayment);    





    // console.log("apple pay - ", payments_data.find(method => method.paymentMethod_type === "apple_pay"));


    const handleInputChange = (event) => {
        console.log("Input changed")
        const { name, value } = event.target;
        // console.log(name)
        // console.log(value)

        if (name === 'paypal') {
            setPaypal(value);
        } else if (name === 'apple_pay') {
            setApplePay(value);
        } else if (name === 'stripe') {
            setStripe(value);
        } else if (name === 'zelle') {
            setZelle(value);
        } else if (name === 'venmo') {
            setVenmo(value);
        }

        if(payments_data.find(method => method.paymentMethod_type === name)){
            // setModifiedData((prevData) => ({
            //     ...prevData,
            //     [name]: value
            // }));
            setIsEdited(true);
            setModifiedPaymentsData((prevData) => {
                const index = prevData.findIndex(item => item.paymentMethod_type === name);
                if (index !== -1) {
                    const updatedData = [...prevData];
                    updatedData[index] = { ...updatedData[index], paymentMethod_name: value };
                    return updatedData;
                } else {
                    return [...prevData, { paymentMethod_name: value, paymentMethod_type: name }];
                }
            });

        }else{
            // setNewData((prevData) => [
            //     ...prevData,
            //     { paymentMethod_name: value, paymentMethod_type: name }
            // ]);
            if (value === "") {
                const filteredData = newPaymentsData.filter(item => item.paymentMethod_type !== name);
                setNewPaymentsData(filteredData);
                setIsNewMethodAdded(false); // Assuming you want to set this to false when removing the item
            }else {                
                setNewPaymentsData((prevData) => {
                    const index = prevData.findIndex(item => item.paymentMethod_type === name);
                    if (index !== -1) {
                        const updatedData = [...prevData];
                        updatedData[index] = { paymentMethod_profile_id : owner_data?.owner_uid, paymentMethod_name: value, paymentMethod_type: name };
                        return updatedData;
                    }else {
                        return [...prevData, { paymentMethod_profile_id : owner_data?.owner_uid, paymentMethod_name: value, paymentMethod_type: name }];
                    }
                });
                setIsNewMethodAdded(true);
            }
            
            

        }

    }

    const changePaymentMethodStatus = (type, value) => {
        let status = getPaymentMethodStatus(type);
        console.log("changePaymentMethodStatus - ")
        console.log("   type - ", type)
        console.log("   value - ", value)
        if(modifiedPaymentsData.find(method => method.paymentMethod_type === type)){
            // setModifiedData((prevData) => ({
            //     ...prevData,
            //     [name]: value
            // }));
            setIsEdited(true);
            // let status = getPaymentMethodStatus(type);
            setModifiedPaymentsData((prevData) => {
                const index = prevData.findIndex(item => item.paymentMethod_type === type);
                if (index !== -1) {
                    const updatedData = [...prevData];
                    updatedData[index] = { ...updatedData[index], paymentMethod_status: status };
                    return updatedData;
                }
                return prevData;
            });

        } else if(newPaymentsData.find(method => method.paymentMethod_type === type)) {
            setIsNewMethodAdded(true);
            setNewPaymentsData((prevData) => {
                const index = prevData.findIndex(item => item.paymentMethod_type === type);
                if (index !== -1) {
                    const updatedData = [...prevData];
                    updatedData[index] = { ...updatedData[index], paymentMethod_status: status };
                    return updatedData;
                }
                return prevData;
            });
        }
    }

    const handleStatusChange = (event, method_type) => {
        console.log("Status changed")
        const { name, checked } = event.target;
        let paymentMethodtype = null;
        console.log(name)
        console.log(checked)
        console.log(method_type)

        let foundMethod = modifiedPaymentsData.find(method => method.paymentMethod_type === method_type) || newPaymentsData.find(method => method.paymentMethod_type === method_type);
        
        console.log("handleStatusChange - foundMethod - ", foundMethod)

        if (name === 'paypal_status' && foundMethod) {
            setPaypalActiveStatus(checked);
            paymentMethodtype = "paypal";
        } else if (name === 'apple_pay_status' && foundMethod) {
            setApplePayActiveStatus(checked);
            paymentMethodtype = "apple_pay";
        } else if (name === 'stripe_status' && foundMethod) {
            setStripeActiveStatus(checked);
            paymentMethodtype = "stripe";
        } else if (name === 'zelle_status' && foundMethod) {
            setZelleActiveStatus(checked);
            paymentMethodtype = "zelle";
        } else if (name === 'venmo_status' && foundMethod) {
            setVenmoActiveStatus(checked);
            paymentMethodtype = "venmo";
        }

        console.log("NAME - ", name);
        console.log("CHECKED - ", checked);
        console.log("TYPE - ", paymentMethodtype );

    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        console.log("FORM SUBMITTED");
        console.log("PUT DATA - ");
        console.log("   ", modifiedPaymentsData);
        console.log("POST DATA - ");
        console.log("   ", newPaymentsData);

        if(isEdited){
            modifiedPaymentsData.forEach((item, index) => {
                // console.log(`Element at index ${index}: `, item);

                axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod', item, headers)
                .then((response) => {
                    console.log('Payment method updated successfully');
                    setIsEdited(false); // Reset the edit status
                    // setModifiedData(payments_data);
                    navigate(-1)
                })
                .catch((error) => {
                    if(error.response){
                        console.log(error.response.data);
                    }
                });
                
            });
        }

        if(isNewMethodAdded){
            newPaymentsData.forEach((item, index) => {
                // console.log(`Element at index ${index}: `, item);

                axios.post('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod', item, headers)
                .then((response) => {
                    console.log('Payment method added successfully');
                    setIsNewMethodAdded(false); // Reset the edit status
                    // setNewData([])
                    navigate(-1)
                })
                .catch((error) => {
                    if(error.response){
                        console.log(error.response.data);
                    }
                });
                
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
                            <Checkbox name="paypal_status" checked={paypalActiveStatus} disabled={!paypal} onChange={(e) => handleStatusChange(e, "paypal")} sx={{ color: theme.typography.common.blue }} />
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
                        <TextField name="paypal" value={paypal?.paymentMethod_name} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox name="apple_pay_status" checked={applePayActiveStatus} disabled={!applePay} onChange={(e) => handleStatusChange(e, "apple_pay")} sx={{ color: theme.typography.common.blue }} />
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
                        <TextField name="apple_pay" value={applePay?.paymentMethod_name} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox name="stripe_status" checked={stripeActiveStatus} disabled={!stripe} onChange={(e) => handleStatusChange(e, "stripe")} sx={{ color: theme.typography.common.blue }} />
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
                        <TextField name="stripe" value={stripe?.paymentMethod_name} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox name="zelle_status" checked={zelleActiveStatus} disabled={!zelle} onChange={(e) => handleStatusChange(e, "zelle")} sx={{ color: theme.typography.common.blue }} />
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
                        <TextField name="zelle" value={zelle?.paymentMethod_name} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox name="venmo_status" checked={venmoActiveStatus} disabled={!venmo} onChange={(e) => handleStatusChange(e, "venmo")} sx={{ color: theme.typography.common.blue }} />
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
                        <TextField name="venmo" value={venmo?.paymentMethod_name} onChange={handleInputChange} variant="filled" fullWidth placeholder="" className={classes.root} />
                    </Grid>
                    </Grid>
                    
                    {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <Checkbox disabled={!chase} sx={{ color: theme.typography.common.blue }} />
                        </Grid>
                        <Grid item xs={4}>
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
                    </Grid> */}
                    
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