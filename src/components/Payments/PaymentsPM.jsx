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
    Divider,
    Checkbox
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import theme from "../../theme/theme";
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios, { all } from 'axios';
import { useUser } from "../../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
    input: {
        background: "#000000"
    }
}));

export default function PaymentsPM(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const { user, getProfileId } = useUser();
    const [paymentDueResult, setPaymentDueResult] = useState([]);

    const [paymentNotes, setPaymentNotes] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isHeaderChecked, setIsHeaderChecked] = useState(true);

    const [paymentData, setPaymentData] = useState({
        currency: "usd",
        //customer_uid: '100-000125', // customer_uid: user.user_uid currently gives error of undefined
        customer_uid: getProfileId(),
        // customer_uid: user.user_uid,
       // business_code: "IOTEST",
        business_code: paymentNotes,
        item_uid: "320-000054",
        // payment_summary: {
        //     total: "0.0"
        // },
        balance: "0.0",
        purchase_uids: [

        ]
    })

    // useEffect(() => {
    //     console.log("useEffect selectedItems", selectedItems)
    // }, [selectedItems])

    function totalBillUpdateLogic(selectedItems, paymentData){

        // console.log("--DEBUG-- payment Data", paymentData)
        var total = 0

        let purchase_uid_mapping = []

        for (const item of selectedItems) {
            // console.log("item in loop", item)
            if (item.selected){
                let paymentItemData = paymentData.find((element) => element.purchase_uid === item.id); // Use item.purchase_uid for comparison
                purchase_uid_mapping.push({purchase_uid: item.id, pur_amount_due: paymentItemData.pur_amount_due})
                // console.log("payment item data", paymentItemData);
                total += parseFloat(paymentItemData.pur_amount_due);
            }
        }

        setTotal(total);
        setPaymentData((prevPaymentData) => ({
            ...prevPaymentData,
            balance: total.toFixed(2), 
            purchase_uids: purchase_uid_mapping
        }));

    }


    const handleSelectAllButton = () => {
        const newSelectedItems = selectedItems.map((item) => ({
            ...item,
            selected: !isHeaderChecked,
        }));
      
        setSelectedItems(newSelectedItems);
        setIsHeaderChecked(!isHeaderChecked);
    
        // console.log("newSelectedItems", newSelectedItems)

        totalBillUpdateLogic(newSelectedItems, paymentDueResult)
    };
      

    const fetchPaymentsData = async () => {
        try{
            const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentStatus/${getProfileId()}`);
            const paymentStatusData = res.data.PaymentStatus.result;
            // console.log("paymentStatusData", paymentStatusData)
            setPaymentDueResult(paymentStatusData);
            // initialize selectedItems as a list of objects with keys id (string) and selected (bool)

            const initialSelectedItems = paymentStatusData.map((item) => ({
                id: item.purchase_uid,
                selected: true,
            }))

            setSelectedItems(initialSelectedItems);

            totalBillUpdateLogic(initialSelectedItems, paymentStatusData);

            // // Calculate the initial total by summing all pur_amount_due values

            // let purchase_uid_mapping = []
            // var initialTotal = 0
            
            // const initialTotal = paymentStatusData.reduce((acc, item) => {
            //     return acc + parseFloat(item.pur_amount_due);
            // }, 0);

            // for (const item of paymentStatusData) {
            //     purchase_uid_mapping.push({purchase_uid: item.purchase_uid, pur_amount_due: item.pur_amount_due})
            //     initialTotal += parseFloat(item.pur_amount_due);
            // }
                
            // setTotal(initialTotal);
            // // Update paymentData with the initial total
            // setPaymentData((prevPaymentData) => ({
            //     ...prevPaymentData,
            //     balance: initialTotal.toFixed(2),
            //     purchase_uids: purchase_uid_mapping
            // }));
            
            // setPaymentDueResult(paymentStatusData);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    // Update total and selectedItems when a checkbox is clicked
    const handleCheckboxChange = (index) => {
        setSelectedItems((prevSelectedItems) => {

            // console.log("-DEBUG- prevSelectedItems", prevSelectedItems)
            
            const newSelectedItems = [...prevSelectedItems];
            // console.log("-DEBUG- newSelectedItems", newSelectedItems)

            const currentItem = newSelectedItems[index];

            currentItem.selected = !currentItem.selected
            
            newSelectedItems[index] = currentItem;
            // console.log("-DEBUG- after assigning se lection", newSelectedItems)

            // const selected_purchase_uids = paymentData.purchase_uids.filter((item, i) => {
            //     if (newSelectedItems[i]) {
            //         return item;
            //     }
            //     return null;
            // });

            // console.log("selected_purchase_uids", selected_purchase_uids)
    
            // Calculate the new total based on the checkbox changes
            // const newTotal = paymentDueResult.reduce((acc, item, i) => {
            //     if (newSelectedItems[i]) {
            //         return acc + parseFloat(item.pur_amount_due);
            //     }
            //     return acc;
            // }, 0);
    
            // // Update the total
            // setTotal(newTotal);
    
            // Check if the header checkbox should be updated
            const allSelected = newSelectedItems.every((item) => item.selected);

            // console.log("-DEBUG- all selected", allSelected)

            if (allSelected) {
                setIsHeaderChecked(true)
            } else {
                setIsHeaderChecked(false)
            }

            totalBillUpdateLogic(newSelectedItems, paymentDueResult)

    
            // Update paymentData with the new total
            // setPaymentData((prevPaymentData) => ({
            //     ...prevPaymentData,
            //     payment_summary: {
            //         total: newTotal.toFixed(2), // Format the total as a string with 2 decimal places
            //     },
            // }));

            return newSelectedItems;
        });
    };

    useEffect(() => {
        fetchPaymentsData();
    }, [])

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
                            Property Manager Payments
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
                                            paymentData.business_code = paymentNotes;
                                            navigate("/selectPayment", {
                                                state: { paymentData, total },
                                            });
                                        }}
                                    >
                                        Select Payment
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

                        <Stack>
                            <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={1}>
                                <Checkbox // Select All Button
                                    checked={isHeaderChecked}
                                    onChange={() => handleSelectAllButton()}
                                    style={selectedCheckboxStyle}
                                    label="Select All"
                                />
                                </Grid>
                                <Grid item xs={6} alignItems="center">
                                <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.mediumFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                >
                                    Description
                                </Typography>
                                </Grid>
                                <Grid item xs={5} alignItems="center">
                                <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.mediumFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                >
                                    Amount
                                </Typography>
                                </Grid>
                            </Grid>
                            <Divider light />

                            {paymentDueResult.map((item, index) => (
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center" key={index}>
                                <Grid item xs={1} alignItems="center">
                                    <Checkbox
                                    checked={selectedItems[index].selected}
                                    onChange={() => handleCheckboxChange(index)}
                                    style={selectedCheckboxStyle}
                                    />
                                </Grid>
                                <Grid item xs={6} alignItems="center">
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
                                <Grid item xs={5} alignItems="right">
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
                            ))}
                            <Divider light />

                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center" sx={{ paddingTop: "15px" }}>
                                <Grid item xs={1} alignItems="center"></Grid>
                                <Grid item xs={6} alignItems="center">
                                <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                >
                                    Total
                                </Typography>
                                </Grid>
                                <Grid item xs={5} alignItems="right">
                                <Typography
                                    sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.medium.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                    fontFamily: 'Source Sans Pro',
                                    }}
                                >
                                    $ {total.toFixed(2)}
                                </Typography>
                                </Grid>
                            </Grid>
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