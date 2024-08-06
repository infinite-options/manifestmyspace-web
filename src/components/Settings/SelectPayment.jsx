// React & Utility Imports
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, TextField, Radio, RadioGroup, Button, Box, Stack, Typography, FormControlLabel, Grid, FormControl, Divider, Container, ThemeProvider } from "@mui/material";

// Stripe Imports
import StripeFeesDialog from "./StripeFeesDialog";
import StripePayment from "./StripePayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Program Imports
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";

// Payment Icons
import PayPal from "../../images/PayPal.png";
import Zelle from "../../images/Zelle.png";
import Venmo from "../../images/Venmo.png";
import Chase from "../../images/Chase.png";
import CreditCardIcon from "../../images/ion_card.png";
import BankIcon from "../../images/mdi_bank.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";

import APIConfig from "../../utils/APIConfig";

import ManagerCashflowWidget from "../Dashboard-Components/Cashflow/ManagerCashflowWidget";
import AccountBalanceWidget from "../Payments/AccountBalanceWidget";

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
    display: "flex",
    alignItems: "center",
  },
}));

export default function SelectPayment(props) {
  const location = useLocation();
  const { getProfileId, paymentRoutingBasedOnSelectedRole, selectedRole } = useUser();
  // console.log("--DEBUG-- props", props);
  // console.log("--DEBUG-- location.state", location.state);

  const managerCashflowWidgetData = location.state?.managerCashflowWidgetData;
  const accountBalanceWidgetData = location.state?.accountBalanceWidgetData;
  // console.log("ROHIT - SelectPayment -  managerCashflowWidgetData - ", managerCashflowWidgetData);
  // console.log("ROHIT - selectedRole - ", selectedRole);

  const classes = useStyles();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  // const [balance, setBalance] = useState(parseFloat(location.state.paymentData?.balance));
  const [paymentData, setPaymentData] = useState(location.state.paymentData);
  const [paymentMethodInfo, setPaymentMethodInfo] = useState(location.state.paymentMethodInfo || {});
  // console.log("--DEBUG-- paymentData", paymentData);
  const [balance, setBalance] = useState(parseFloat(location.state.paymentData?.balance));
  const [purchaseUID, setPurchaseUID] = useState(location.state.paymentData.purchase_uids[0]?.purchase_uid);
  const [purchaseUIDs, setPurchaseUIDs] = useState(location.state.paymentData.purchase_uids);
  const [selectedItems, setSelectedItems] = useState(location.state.selectedItems);
  const [convenience_fee, setFee] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(""); // Initial selection
  const [totalBalance, setTotalBalance] = useState(balance + convenience_fee); // Initial selection

  // Confirmation Box State
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [isMakePaymentDisabled, setIsMakePaymentDisabled] = useState(true); // State to control the disabled status of the Make Payment button

  //   console.log("DEBUG BALANCE IN SELECT PAYMENT", balance);
  // console.log("--debug-- PAYMENT DATA IN SELECT PAYMENT", paymentData);
  // console.log("--debug-- PURCHASE UIDS IN PAYMENT DATA IN SELECT PAYMENT purchase_uid", paymentData.purchase_uids);
  // console.log("--debug-- location.state", location.state);
  // console.log("---debug--- convenience_fee", convenience_fee);

  useEffect(() => {
    console.log("In new UseEffect Current Convenience Fee is: ", convenience_fee);
  }, [convenience_fee]);

  useEffect(() => {
    console.log("In new UseEffect Current Balance is: ", totalBalance);
  }, [totalBalance]);

  const [stripePayment, setStripePayment] = useState(false);
  const [stripeResponse, setStripeResponse] = useState(null);
  const [applePay, setApplePay] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);

  useEffect(() => {
    // Check if selectedMethod is not empty and confirmationNumber is not empty for Zelle and method for payment is selected
    if ((selectedMethod === "Zelle" && confirmationNumber === "") || !selectedMethod) {
      setIsMakePaymentDisabled(true); // Disable button if conditions not met
    } else {
      setIsMakePaymentDisabled(false); // Enable button if conditions met
    }
  }, [selectedMethod, confirmationNumber]);

  useEffect(() => {
    console.log("stripe payment", stripePayment);
  }, [stripePayment]);

  const [stripeDialogShow, setStripeDialogShow] = useState(false);
  const payment_url = {
    "Credit Card": "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent",
    "Bank Transfer": "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent",
    Zelle: "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/makePayment",
  };

  const [stripePromise, setStripePromise] = useState(null);

  //Credit Card Handler
  function credit_card_handler(notes) {
    if (notes === "PMTEST") {
      // Fetch public key
      console.log("fetching public key");
      setShowSpinner(true);
      axios
        .post("https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/getCorrectKeys/PMTEST")
        .then((result) => {
          console.log("(1 PaymentDetails) Stripe-key then result (1): " + JSON.stringify(result));
          setShowSpinner(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log("(1 PaymentDetails) error: " + JSON.stringify(err.response));
          }
          setShowSpinner(false);
        });
    } else {
      // Fetch public key live
      setShowSpinner(true);
      console.log("fetching public key live");
      axios
        .post("https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/getCorrectKeys/PM")
        .then((result) => {
          console.log("(2 PaymentDetails) Stripe-key then result (1): " + JSON.stringify(result));
          setSelectedMethod(result.data.publicKey);
          setShowSpinner(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log("(2 PaymentDetails) error: " + JSON.stringify(err.response));
          }
          setShowSpinner(false);
        });
    }
  }

  const submit = async ({ paymentIntent, paymentMethod }) => {
    console.log("In Submit Function");
    console.log("paymentData", paymentData);
    console.log("in submit in SelectPayment.jsx", convenience_fee);
    setPaymentConfirm(true);

    console.log("--DEBUG-- in submit in SelectPayment.jsx paymentIntent output", paymentIntent);
    console.log("--DEBUG-- in submit in SelectPayment.jsx paymentMethod output", paymentMethod);

    paymentIntent = paymentIntent === undefined ? "Zelle" : paymentIntent;
    paymentMethod = paymentMethod === undefined ? "Zelle" : paymentMethod;
    console.log("Re-Setting PI and PM: ", paymentIntent, paymentMethod);
    // AT THIS POINT THE STRIPE TRANSACTION IS COMPLETE AND paymentIntent AND paymentMethod ARE KNOWN
    setShowSpinner(true);

    let payment_request_payload = {
      pay_purchase_id: paymentData.purchase_uids,
      pay_fee: convenience_fee,
      pay_total: totalBalance,
      payment_notes: paymentData.business_code,
      pay_charge_id: "stripe transaction key",
      payment_type: selectedMethod,
      payment_verify: "Unverified",
      paid_by: getProfileId(),
      payment_intent: paymentIntent,
      payment_method: paymentMethod,
    };
    if (paymentMethod == "Zelle") payment_request_payload.confirmation_number = confirmationNumber;

    await fetch(`${APIConfig.baseURL.dev}/makePayment`, {
      // await fetch("http://localhost:4000/makePayment2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment_request_payload),
    });

    // let routingString = paymentRoutingBasedOnSelectedRole();
    // navigate(routingString);

    // navigate("/payments")
    navigate(-1);

    setShowSpinner(false);
  };
  //CreditCardHandler

  async function bank_transfer_handler() {
    console.log("In Bank Transfer Handler Function");
    // Set the Content-Type header
    const headers = {
      "Content-Type": "application/json",
    };

    // Make the POST request
    setShowSpinner(true);
    try {
      const response = await fetch(payment_url[selectedMethod], {
        // Use http instead of https
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        console.log("Post request was successful");
        // Handle the successful response here
      } else {
        console.error("Post request failed");
        // Handle the error here
      }
    } catch (error) {
      console.error("An error occurred while making the POST request", error);
    }
    setShowSpinner(false);
    console.log("Completed Bank Transfer Handler Function");
    // navigate
    navigate("/PaymentConfirmation", { state: { paymentData } });
  }

  function update_fee(e) {
    console.log("--debug update_fee -->", selectedMethod);
    let fee = 0;
    if (e.target.value === "Bank Transfer") {
      fee = Math.max(parseFloat((balance * 0.008).toFixed(2)), 5);
    } else if (e.target.value === "Credit Card") {
      fee = parseFloat((balance * 0.03).toFixed(2));
    }
    setFee(fee);
    setTotalBalance(balance + fee);
  }

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMethod(selectedValue);
    // Clear confirmation number when a different payment method is selected
    if (selectedValue !== "Zelle") {
      setConfirmationNumber("");
    }

    update_fee(event);
  };

  const handleSubmit = async (e) => {
    console.log("selectedMethod", selectedMethod);
    console.log("Payment total", totalBalance);
    console.log("Convenience Fee", convenience_fee);
    console.log("PaymentData: ", { ...paymentData, total: parseFloat(totalBalance.toFixed(2)) });

    // e.preventDefault();
    setPaymentData({ ...paymentData, total: parseFloat(totalBalance.toFixed(2)) });
    // paymentData.payment_summary.total = parseFloat(totalBalance.toFixed(2));

    if (selectedMethod === "Bank Transfer") bank_transfer_handler();
    else if (selectedMethod === "Credit Card") {
      console.log("Credit Card Selected");
      // toggleKeys();

      setStripeDialogShow(true);
    }
    // credit_card_handler(paymentData.business_code);
    else if (selectedMethod === "Zelle") {
      console.log("Zelle Selected");
      let payment_intent = "Zelle";
      let payment_method = "Zelle";
      console.log("Setting PI and PM: ", payment_intent, payment_method);
      submit(payment_intent, payment_method);
      // toggleKeys();
    }
    // credit_card_handler(paymentData.business_code);
  };

  // NEED TO UNDERSTAND WHY WE ARE USING t00 keys instead of PM Keys
  const toggleKeys = async () => {
    setShowSpinner(true);
    console.log("inside toggle keys");
    const url =
      paymentData.business_code === "PMTEST"
        ? // ? "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
          // : "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
          "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST";
    // : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";

    let response = await fetch(url);
    const responseData = await response.json();
    console.log("--DEBUG-- response data from Stripe", responseData);
    // setStripeResponse(responseData);
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
    // console.log("--DEBUG-- stripePromise", stripePromise);
    setShowSpinner(false);
  };

  return (
    // <div style={{ padding: "30px" }}>
    <>
      <ThemeProvider theme={theme}>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color='inherit' />
        </Backdrop>

        <Container disableGutters maxWidth='lg' sx={{ paddingTop: "10px", height: "90vh" }}>
          <Grid container spacing={6} sx={{ height: "90%" }}>
            <Grid item xs={12} md={4}>
              {selectedRole === "MANAGER" && (
                <ManagerCashflowWidget
                  propsMonth={managerCashflowWidgetData?.propsMonth}
                  propsYear={managerCashflowWidgetData?.propsYear}
                  profitsTotal={managerCashflowWidgetData?.profitsTotal}
                  rentsTotal={managerCashflowWidgetData?.rentsTotal}
                  payoutsTotal={managerCashflowWidgetData?.payoutsTotal}
                  graphData={managerCashflowWidgetData?.graphData}
                />
              )}

              {selectedRole === "TENANT" && (
                <AccountBalanceWidget
                  selectedProperty={accountBalanceWidgetData?.selectedProperty}
                  selectedLease={accountBalanceWidgetData?.selectedLease}
                  propertyAddr={accountBalanceWidgetData?.propertyAddr}
                  propertyData={accountBalanceWidgetData?.propertyData}
                  total={accountBalanceWidgetData?.total}
                  rentFees={accountBalanceWidgetData?.rentFees}
                  lateFees={accountBalanceWidgetData?.lateFees}
                  utilityFees={accountBalanceWidgetData?.utilityFees}
                />
              )}
            </Grid>

            <Grid container item xs={12} md={8} columnSpacing={6}>
              <StripeFeesDialog stripeDialogShow={stripeDialogShow} setStripeDialogShow={setStripeDialogShow} toggleKeys={toggleKeys} setStripePayment={setStripePayment} />

              {/* <Stack direction="row" > */}
              <Grid container item xs={12} justifyContent='center'>
                {/* <Grid item xs={1} >
                  <Button onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
                  </Button>
                </Grid> */}
                <Typography
                  sx={{
                    justifySelf: "center",
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  Select Payment Method
                </Typography>
                {/* </Stack> */}
              </Grid>
              <Paper
                style={{
                  width: "100%",
                  margin: "25px",
                  marginBottom: "0px",
                  padding: "10px",
                  backgroundColor: theme.palette.primary.main,
                  // height: "25%",
                  // [theme.breakpoints.down("sm")]: {
                  //   width: "80%",
                  // },
                  // [theme.breakpoints.up("sm")]: {
                  //   width: "50%",
                  // },
                }}
              >
                <Stack direction='row' justifyContent='center' sx={{ paddingBottom: "5px" }}>
                  <Typography
                    sx={{
                      justifySelf: "center",
                      color: "#160449",
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.largeFont,
                    }}
                  >
                    Total Balance
                  </Typography>
                </Stack>

                <Stack direction='row' justifyContent='center' sx={{ paddingBottom: "5px" }}>
                  <Typography
                    sx={{
                      justifySelf: "center",
                      color: "#7A9AEA",
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.largeFont,
                    }}
                  >
                    {"$" + (balance + convenience_fee).toFixed(2)}
                  </Typography>
                </Stack>
                <Divider light />
                <Stack>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6} justifyContent='center' alignItems='center'>
                      <Typography
                        sx={{
                          justifySelf: "center",
                          color: "#160449",
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Balance
                      </Typography>
                    </Grid>

                    <Grid container item xs={6} justifyContent='flex-end'>
                      <Typography
                        sx={{
                          justifySelf: "flex-end",
                          // width: '100px',
                          color: "#160449",
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {"$" + balance.toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} alignItems='center'>
                      <Typography
                        sx={{
                          justifySelf: "center",
                          color: "#160449",
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Convenience Fees
                      </Typography>
                    </Grid>

                    <Grid container item xs={6} justifyContent='flex-end'>
                      <Typography
                        sx={{
                          justifySelf: "center",
                          color: "#160449",
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {"$" + convenience_fee.toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} alignItems='center'>
                      <Typography
                        sx={{
                          justifySelf: "center",
                          color: "#160449",
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Total
                      </Typography>
                    </Grid>
                    <Grid container item xs={6} justifyContent='flex-end'>
                      <Typography
                        sx={{
                          justifySelf: "center",
                          color: "#160449",
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {"$" + (balance + convenience_fee).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>

              <Paper
                style={{
                  margin: "25px",
                  padding: "20px",
                  backgroundColor: theme.palette.primary.main,
                  // height: '25%',
                  [theme.breakpoints.down("sm")]: {
                    width: "80%",
                  },
                  [theme.breakpoints.up("sm")]: {
                    width: "50%",
                  },
                }}
              >
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                  Payment Methods
                </Typography>
                <Divider light />
                <FormControl component='fieldset'>
                  <RadioGroup aria-label='Number' name='number' value={selectedMethod} onChange={handleChange}>
                    <FormControlLabel
                      value='Bank Transfer'
                      control={<Radio />}
                      label={
                        <>
                          <div style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}>
                            <img src={BankIcon} alt='Chase' style={{ marginRight: "8px", height: "24px" }} />
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: 800, fontSize: theme.typography.mediumFont }}>Bank Transfer</Typography>
                          </div>
                          <div sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
                            <Typography sx={{ color: theme.typography.common.gray, fontWeight: 400, fontSize: theme.typography.smallFont }}>
                              .08% Convenience Fee - max $5
                            </Typography>
                          </div>
                        </>
                      }
                    />
                    <FormControlLabel
                      value='Credit Card'
                      control={<Radio />}
                      label={
                        <>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={CreditCardIcon} alt='Chase' style={{ marginRight: "8px", height: "24px" }} />
                            Credit Card
                          </div>
                          <div sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
                            <Typography sx={{ color: theme.typography.common.gray, fontWeight: 400, fontSize: theme.typography.smallFont }}>3% Convenience Fee</Typography>
                          </div>
                        </>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                <Typography sx={{ color: theme.typography.common.blue, fontWeight: 800, fontSize: theme.typography.secondaryFont }}>Other Payment Methods</Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: 400, fontSize: "16px" }}>
                  Payment Instructions for Paypal, Apple Pay Zelle, and Venmo: Please make payment via 3rd party app and record payment information here. If you are using Zelle,
                  please include the transaction confirmation number.
                </Typography>

                <Divider light />

                <FormControl component='fieldset'>
                  <RadioGroup aria-label='Number' name='number' value={selectedMethod} onChange={handleChange}>
                    <FormControlLabel
                      value='PayPal'
                      control={<Radio />}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={PayPal} alt='PayPal' style={{ marginRight: "8px", height: "24px" }} />
                          Paypal {paymentMethodInfo.paypal ? paymentMethodInfo.paypal : "No Payment Info"}
                        </div>
                      }
                    />
                    <FormControlLabel
                      value='Apple Pay'
                      control={<Radio />}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={ApplePay} alt='Apple Pay' style={{ marginRight: "8px", height: "24px" }} />
                          Apple Pay {paymentMethodInfo.apple_pay ? `Make payment to: ${paymentMethodInfo.apple_pay}` : "No Payment Info"}
                        </div>
                      }
                    />
                    <FormControlLabel
                      value='Zelle'
                      control={<Radio />}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={Zelle} alt='Zelle' style={{ marginRight: "8px", height: "24px" }} />
                          Zelle {paymentMethodInfo.zelle ? paymentMethodInfo.zelle : "No Payment Info"}
                          <TextField
                            id='confirmation-number'
                            label='Confirmation Number'
                            variant='outlined'
                            size='small'
                            value={confirmationNumber}
                            sx={{ marginLeft: "10px" }} // Add some spacing between the image and the textfield
                            disabled={selectedMethod !== "Zelle"}
                            onChange={(e) => setConfirmationNumber(e.target.value)}
                          />
                        </div>
                      }
                    />

                    <FormControlLabel
                      value='Venmo'
                      control={<Radio />}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={Venmo} alt='Venmo' style={{ marginRight: "8px", height: "24px" }} />
                          Venmo {paymentMethodInfo.venmo ? paymentMethodInfo.venmo : "No Payment Info"}
                        </div>
                      }
                    />

                    <FormControlLabel
                      value='Stripe'
                      control={<Radio />}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={Stripe} alt='Stripe' style={{ marginRight: "8px", height: "24px" }} />
                          Stripe
                        </div>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "#3D5CAC",
                    color: theme.palette.background.default,
                    width: "100%", // Center the button horizontally
                    borderRadius: "10px", // Rounded corners
                    marginTop: "20px", // Add some spacing to the top
                  }}
                  disabled={isMakePaymentDisabled}
                >
                  Make Payment
                </Button>
              </Paper>
              <Elements stripe={stripePromise}>
                <StripePayment
                  submit={submit}
                  message={paymentData.business_code}
                  amount={totalBalance}
                  paidBy={paymentData.customer_uid}
                  show={stripePayment}
                  setShow={setStripePayment}
                />
              </Elements>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>

      {/* </div> */}
    </>
  );
}
