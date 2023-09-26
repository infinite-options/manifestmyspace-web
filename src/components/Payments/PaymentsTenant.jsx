import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    ThemeProvider,
    Paper,
    Button,
    Typography,
    Stack,
    Grid,
    TextField,
    IconButton,
    Checkbox
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import theme from "../../theme/theme";
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    input: {
        background: "#000000"
    }
}));

export default function PaymentsTenant(props) {
    const classes = useStyles();
    const navigate = useNavigate();

    const [paymentDueResult, setPaymentDueResult] = useState([]);

    const [paymentNotes, setPaymentNotes] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Calculate the header checkbox state based on selectedItems
    const isHeaderChecked = selectedItems.every((item) => item);

    const [paymentData, setPaymentData] = useState({
        currency: "usd",
        customer_uid: "100-000125",
       // business_code: "IOTEST",
        business_code: paymentNotes,
        item_uid: "320-000054",
        payment_summary: {
            total: "0.0"
        },
    })

    const fetchPaymentsData = async () => {
        try{
        // if (access_token === null) {
        //   navigate("/");
        //   return;
        // }
        const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentStatus/350-000002`);
        console.log("payments result", res.data.PaymentStatus.result);
        const data = res.data.PaymentStatus.result;

        // Initialize selectedItems with true values for all items
        setSelectedItems(new Array(data.length).fill(true));

        // Calculate the initial total by summing all pur_amount_due values
        const initialTotal = data.reduce((acc, item) => {
            return acc + parseFloat(item.pur_amount_due);
        }, 0);
            
        setTotal(initialTotal);
        
        // Update paymentData with the initial total
        setPaymentData((prevPaymentData) => ({
            ...prevPaymentData,
            payment_summary: {
            total: initialTotal.toFixed(2), // Format the total as a string with 2 decimal places
            },
        }));
        
        setPaymentDueResult(data);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    // Update total and selectedItems when a checkbox is clicked
    const handleCheckboxChange = (index) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = [...prevSelectedItems];
            newSelectedItems[index] = !newSelectedItems[index];
    
            // Calculate the new total based on the checkbox changes
            const newTotal = paymentDueResult.reduce((acc, item, i) => {
                if (newSelectedItems[i]) {
                    return acc + parseFloat(item.pur_amount_due);
                }
                return acc;
            }, 0);
    
            // Update the total
            setTotal(newTotal);
    
            // Check if the header checkbox should be updated
            const allSelected = newSelectedItems.every((item) => item);
            if (isHeaderChecked !== allSelected) {
                // Update header checkbox state
                setSelectedItems(new Array(paymentDueResult.length).fill(allSelected));
            }
    
            // Update paymentData with the new total
            setPaymentData((prevPaymentData) => ({
                ...prevPaymentData,
                payment_summary: {
                    total: newTotal.toFixed(2), // Format the total as a string with 2 decimal places
                },
            }));
            console.log("payment amount is ", paymentData);
    
            return newSelectedItems;
        });
    };

    useEffect(() => {
        fetchPaymentsData();
    }, [])

    // function createPaymentdata(total) {
    //     return {
    //         currency: "usd",
    //         customer_uid: "100-000125",
    //         business_code: "IOTEST",
    //         item_uid: "320-000054",
    //         payment_summary: {
    //             total: total
    //         },
    //     }
    // }

    const handlePaymentNotesChange = (event) => {
        setPaymentNotes(event.target.value);
    };
    
    const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

    const handleStripePayment = async (e) => {
        console.log("Stripe Payment")
        try {
            // Update paymentData with the latest total value
            const updatedPaymentData = {
                ...paymentData,
                business_code:paymentNotes,
                payment_summary: {
                total: total.toFixed(2), // Format the total as a string with 2 decimal places
                },
            };

            console.log(updatedPaymentData)

            //const stripe = await stripePromise;
            const response = await fetch(API_CALL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPaymentData),
            });
            const checkoutURL = await response.text();
            //console.log(response.text());
            window.location.href = checkoutURL;
        } catch (error) {
            console.log(error);
        }
    }

    // Define the CSS style for the selected checkbox
    const selectedCheckboxStyle = {
        color: theme.palette.custom.bgBlue, // Change the color of the tick (checked icon)
        borderColor: 'black', // Change the border color
        '&.Mui-checked': {
        color: 'gray',
        borderColor: 'black',
        },
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <Paper
                    component={Stack}
                    direction="column"
                    justifyContent="center"
                    style={{
                        justifyContent: 'center',
                        width: '100%', // Take up full screen width
                        // marginTop: '60px', // Set the margin to 20px
                    }}>
                    <Box
                        component="span"
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        position='relative'>

                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.largeFont
                            }}>
                            Payments
                        </Typography>
                    </Box>

                    <hr></hr>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#160449",
                        }}
                    >
                        <Box
                            sx={{
                                height: "30px",
                                width: "30px",
                                backgroundColor: "#bbb",
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        ></Box>
                        <Box
                            sx={{
                                fontSize: "11px",
                                fontWeight: "600",
                            }}
                            onClick={() => { navigate('/myProperty') }}
                        >
                            103 N. Abel St unit #104
                        </Box>
                    </Box>

                    <Paper
                        style={{
                            margin: '25px',
                            padding: '10px',
                            backgroundColor: theme.palette.primary.main,
                            height: '25%',
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="left"
                            m={2}
                        >
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                                Balance
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            m={2}
                        >
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <Typography sx={{ marginLeft: '20px', color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: '26px' }}>
                                        ${total.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#3D5CAC",
                                            borderRadius: "10px",
                                            color: "#FFFFFF",
                                            fontWeight: "bold",
                                            fontSize: "12px",
                                            padding: "10px",
                                        }}
                                        onClick={() => {
                                            paymentData.business_code=paymentNotes;
                                             navigate('/SelectPayment', {state: {paymentData, total}})
                                        }}
                                    >
                                        Make a Payment
                                    </Box>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="left"
                            m={4}
                        >
                            <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}>
                                Due date: Aug 1st 2023
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            m={2}
                        >
                            <TextField
                                variant="filled"
                                InputProps={{ className: classes.input }}
                                fullWidth={true}
                                multiline={true}
                                value={paymentNotes}
                                onChange={handlePaymentNotesChange}
                                label="Payment Notes"
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="left"
                            m={2}
                        >
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.medium.fontWeight, fontSize: '17px' }}>
                                + Add Account
                            </Typography>
                        </Stack>
                        {/* <Stack
                        direction="row"
                        justifyContent="center"
                        >
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                            <Grid item xs={3}>
                                Apple
                            </Grid>
                            <Grid item xs={3}>
                                Visa
                            </Grid>
                            <Grid item xs={3}>
                                Paytm
                            </Grid>
                            <Grid item xs={3}>
                                MasterCard
                            </Grid>
                        </Grid>
                    </Stack> */}
                    </Paper>

                    <Paper
                        style={{
                            margin: '25px',
                            padding: 20,
                            backgroundColor: theme.palette.primary.main,
                            height: '25%',
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="left"
                        >
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                                Balance Details
                            </Typography>
                        </Stack>

                        <Stack >
                        <Grid container>
                            <Grid item xs={6} container alignItems="center">
                            <Checkbox
                                checked={isHeaderChecked}
                                onChange={() => {
                                const allSelected = selectedItems.every((item) => item);
                                setSelectedItems(paymentDueResult.map(() => !allSelected));
                                }}
                                style={selectedCheckboxStyle}
                            />
                            <Typography
                                sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.medium.fontWeight,
                                fontSize: theme.typography.smallFont,
                                fontFamily: 'Source Sans Pro',
                                }}
                            >
                                Description
                            </Typography>
                            </Grid>
                            <Grid item xs={6} container alignItems="center">
                            <Typography
                                sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.medium.fontWeight,
                                fontSize: theme.typography.smallFont,
                                fontFamily: 'Source Sans Pro',
                                }}
                            >
                            Amount
                            </Typography>
                            </Grid>
                        </Grid>

                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {paymentDueResult.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Grid container alignItems="center">
                                <Grid item xs={6} container alignItems="center">
                                    <Checkbox
                                    checked={selectedItems[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                    style={selectedCheckboxStyle}
                                    />
                                    <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                    >
                                    {item.pur_description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} container alignItems="right">
                                    <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                    >
                                    $ {item.pur_amount_due}
                                    </Typography>
                                </Grid>
                                </Grid>
                            </Grid>
                            ))}
                        </Grid>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="center">
                            <Typography
                            sx={{
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.medium.fontWeight,
                            fontSize: theme.typography.smallFont,
                            fontFamily: 'Source Sans Pro',
                            }}>
                                Total : ${total.toFixed(2)}
                            </Typography>
                        </Stack>
                    </Paper>
                    <Paper
                        style={{
                            margin: '25px',
                            padding: 20,
                            backgroundColor: theme.palette.primary.main,
                            height: '25%',
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="left"
                        >
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                                30 Day Payment History
                            </Typography>
                        </Stack>
                    </Paper>
                </Paper>
            </ThemeProvider>
        </>
    )
}