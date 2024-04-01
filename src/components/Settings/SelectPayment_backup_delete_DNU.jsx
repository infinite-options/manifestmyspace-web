import React, { useState, useEffect } from "react";
import {
  Paper,
  Radio,
  RadioGroup,
  Button,
  Box,
  Stack,
  ThemeProvider,
  Checkbox,
  Typography,
  TextField,
  FormControlLabel,
  AccordionDetails,
  Grid,
  FormControl,
  Divider,
} from "@mui/material";
import StripeFeesDialog from "./StripeFeesDialog";
import StripePayment from "./StripePayment";
import handleAddRevenue from "../Cashflow/AddRevenue";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import theme from "../../theme/theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import { alpha, makeStyles } from "@material-ui/core/styles";
import PayPal from "../../images/PayPal.png";
import Zelle from "../../images/Zelle.png";
import Venmo from "../../images/Venmo.png";
import Chase from "../../images/Chase.png";
import CreditCardIcon from "../../images/ion_card.png";
import BankIcon from "../../images/mdi_bank.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import APIConfig from "../../utils/APIConfig";

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
  const classes = useStyles();
  const navigate = useNavigate();
  const { getProfileId, paymentRoutingBasedOnSelectedRole } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [balance, setBalance] = useState(parseFloat(location.state.paymentData.balance));
  const [paymentData, setPaymentData] = useState(location.state.paymentData);
  const [purchaseUID, setPurchaseUID] = useState(location.state.paymentData.purchase_uids[0]?.purchase_uid);
  const [purchaseUIDs, setPurchaseUIDs] = useState(location.state.paymentData.purchase_uids);
  // const [maintenanceItem, setMaintenanceItem] = useState(location.state.paymentData.maintenanceItem);
  const [selectedItems, setSelectedItems] = useState(location.state.selectedItems);
  //   console.log("DEBUG PAYMENT DATA IN SELECT PAYMENT", paymentData);
  //   console.log("DEBUG PAYMENT DATA IN SELECT PAYMENT purchase_uid", paymentData.purchase_uids);
  //   console.log("--debug-- location.state", location.state);
  //   console.log("--debug-- maintenanceItem", maintenanceItem)
  //   console.log("---debug--- purchaseUIDs", purchaseUIDs);
  //   console.log("---debug--- selectedItems", selectedItems);
  const [convenience_fee, setFee] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(""); // Initial selection
  const [totalBalance, setTotalBalance] = useState(balance + convenience_fee); // Initial selection
  //   console.log("---debug--- convenience_fee", convenience_fee);

  useEffect(() => {
    console.log("Current Total Balance is: ", balance);
    console.log("Current Convenience Fee is: ", convenience_fee);
    setTotalBalance(balance + convenience_fee);
    console.log("Total Balance made up of: ", purchaseUIDs);
    console.log("1st Purchase Item is: ", purchaseUIDs[0]);
    console.log("1st Purchase UID is: ", purchaseUIDs[0].purchase_uid);
  }, []);

  useEffect(() => {
    console.log("In new UseEffect Current Convenience Fee is: ", convenience_fee);
  }, [convenience_fee]);

  const [stripePayment, setStripePayment] = useState(false);
  const [applePay, setApplePay] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);

  const [stripeResponse, setStripeResponse] = useState(null);

  useEffect(() => {
    console.log("stripe payment", stripePayment);
  }, [stripePayment]);

  const [stripeDialogShow, setStripeDialogShow] = useState(false);
  const payment_url = {
    "Credit Card": "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent",
    "Bank Transfer": "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent",
  };

  // const payment_url={"Credit Card":'http://127.0.0.1:5000/home',
  // 'Bank Transfer': 'https://127.0.0.1:5000/home'
  // }

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
          // setSelectedMethod(result.data.PUBLISHABLE_KEY);
          //let tempStripePromise = loadStripe(result.data.publicKey);

          // console.log("(1 PaymentDetails) setting state with stripePromise");

          // setStripePromise(tempStripePromise);

          // console.log(tempStripePromise);
          // console.log("(1 PaymentDetails) stripePromise set!");
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
          // let tempStripePromise = loadStripe(result.data.publicKey);

          // console.log("(2 PaymentDetails) setting state with stripePromise");

          // console.log(tempStripePromise);
          // setStripePromise(tempStripePromise);

          // console.log("(2 PaymentDetails) stripePromise set!");
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
    console.log("in submit in SelectPayment.jsx", convenience_fee);
    setPaymentConfirm(true);
    // TODO: navigate to correct dashboard based on role
    // navigate("/tenantDashboard");

    // console.log("--DEBUG-- in submit in SelectPayment.jsx stripeResponse output", stripeResponse)

    console.log("--DEBUG-- in submit in SelectPayment.jsx paymentIntent output", paymentIntent);
    console.log("--DEBUG-- in submit in SelectPayment.jsx paymentMethod output", paymentMethod);

    // Check if paymentMethod is true
    if (paymentMethod) {
      // If paymentMethod is true, proceed with payment confirmation and make payments
      console.log("Check if payment went through and then add Covnenience Fee Purchase to Purchase Table here", convenience_fee);
      let data = {
        pur_property_id: "200-000001",
        purchase_type: "Extra Charge",
        pur_cf_type: "revenue",
        purchase_date: "03-03-2024",
        pur_due_date: "03-03-2024",
        pur_amount_due: 100,
        purchase_status: "PAID",
        pur_notes: "This is a Credit Card Fee",
        pur_description: "This is a Credit Card Fee2",
        pur_receiver: "110-000003",
        pur_initiator: "600-000003",
        pur_payer: "350-000002",
      };
      console.log("Data for Add Revenue is: ", data);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/addRevenue",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };
      setShowSpinner(true);
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setShowSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setShowSpinner(false);
        });

      console.log("Add Revenue complete");
    } else {
      // If paymentMethod is not true, handle the case accordingly
      console.log("Payment method is not selected. Please select a payment method.");
      // You may want to display an error message or take some other action here
    }

    const makePayments = async () => {
      setShowSpinner(true);
      const makePayment = (purchase_uid, pur_amount_due) =>
        fetch(`${APIConfig.baseURL.dev}/makePayment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pay_purchase_id: purchase_uid,
            pay_amount: pur_amount_due,
            // "payment_notes" : "PMTEST", // by default to indicate to backend that this is a test
            payment_notes: paymentData.business_code,
            pay_charge_id: "stripe transaction key",
            payment_type: selectedMethod,
            payment_verify: "Unverified",
            paid_by: getProfileId(),
            payment_intent: paymentIntent,
            payment_method: paymentMethod,
          }),
        });

      const promises = [];
      for (const item of purchaseUIDs) {
        console.log("Before makePayment 2", item.purchase_uid, item.pur_amount_due);
        promises.push(makePayment(item.purchase_uid, item.pur_amount_due));
        // console.log("--debug-- maintenanceItem.purchase_uid", maintenanceItem.purchase_uid, "item.purchase_uid", item.purchase_uid)
      }
      try {
        await Promise.all(promises);
        console.log("All payments made successfully", promises);
        for (const item of selectedItems) {
          // PUT to update maintenance request status to "COMPLETED"
          // console.log("--DEBUG-- maintenanceItem.purchase_uid === item.purchase_uid", item.purchase_uid)
          if (item.quote_id !== null) {
            const updateMaintenanceRequestStatus = (quote_id) => {
              const formData = new FormData();
              formData.append("maintenance_quote_uid", quote_id);
              formData.append("quote_status", "COMPLETED");
              fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
                method: "PUT",
                body: formData,
              });
            };
            updateMaintenanceRequestStatus(item.quote_id);
          }
        }
        let routingString = paymentRoutingBasedOnSelectedRole();
        navigate(routingString);
      } catch (error) {
        console.error("Error making payments:", error);
      }
      setShowSpinner(false);
    };

    await makePayments();
  };
  //CreditCardHandler

  async function bank_transfer_handler() {
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
    // navigate
    navigate("/PaymentConfirmation", { state: { paymentData } });
  }

  function update_fee(e) {
    console.log("--debug update_fee -->", selectedMethod);
    if (e.target.value === "Bank Transfer") setFee(Math.min(balance * 0.008, 5));
    else if (e.target.value === "Credit Card") setFee(balance * 0.03);
    else setFee(0);
    console.log("Convenience Fee set to: ", convenience_fee);
    setTotalBalance(balance + convenience_fee);
    console.log("Total Balance is: ", totalBalance, balance, convenience_fee);
  }

  const handleChange = (event) => {
    console.log("--debug selectedMethod 1-->", event.target.value);
    setSelectedMethod(event.target.value);
    console.log("--debug selectedMethod 2 -->", selectedMethod); // For some reason this is showing the PREVIOUS selectedMethod.  Likely due to Set method not updating instantly
    update_fee(event);
  };

  const handleSubmit = async (e) => {
    console.log("selectedMethod", selectedMethod);
    console.log("Payment total", totalBalance);
    console.log("Convenience Fee", convenience_fee);
    // e.preventDefault();
    setPaymentData({ ...paymentData, total: parseFloat(totalBalance.toFixed(2)) });
    // paymentData.payment_summary.total = parseFloat(totalBalance.toFixed(2));

    if (selectedMethod === "Bank Transfer") bank_transfer_handler();
    else if (selectedMethod === "Credit Card") {
      console.log("in else if");
      // toggleKeys();

      setStripeDialogShow(true);
    }
    // credit_card_handler(paymentData.business_code);
  };

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
    <div style={{ padding: "30px" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <StripeFeesDialog stripeDialogShow={stripeDialogShow} setStripeDialogShow={setStripeDialogShow} toggleKeys={toggleKeys} setStripePayment={setStripePayment} />

      <Stack direction="row" justifyContent="center">
        <Box position="absolute" left={30}>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
          </Button>
        </Box>
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
      </Stack>
      <Paper
        style={{
          margin: "25px",
          padding: "10px",
          backgroundColor: theme.palette.primary.main,
          height: "25%",
          [theme.breakpoints.down("sm")]: {
            width: "80%",
          },
          [theme.breakpoints.up("sm")]: {
            width: "50%",
          },
        }}
      >
        <Stack direction="row" justifyContent="center" sx={{ paddingBottom: "5px" }}>
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

        <Stack direction="row" justifyContent="center" sx={{ paddingBottom: "5px" }}>
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
            <Grid item xs={6} justifyContent="center" alignItems="center">
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

            <Grid item xs={6} alignItems="center">
              <Typography
                sx={{
                  justifySelf: "center",
                  color: "#160449",
                  fontWeight: theme.typography.light.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"$" + balance.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={6} alignItems="center">
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

            <Grid item xs={6} alignItems="center">
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

            <Grid item xs={6} alignItems="center">
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
            <Grid item xs={6} alignItems="center">
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
        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>Payment Methods</Typography>
        <Divider light />
        <FormControl component="fieldset">
          <RadioGroup aria-label="Number" name="number" value={selectedMethod} onChange={handleChange}>
            <FormControlLabel
              value="Bank Transfer"
              control={<Radio />}
              label={
                <>
                  <div style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}>
                    <img src={BankIcon} alt="Chase" style={{ marginRight: "8px", height: "24px" }} />
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: 800, fontSize: theme.typography.mediumFont }}>Bank Transfer</Typography>
                  </div>
                  <div sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
                    <Typography sx={{ color: theme.typography.common.gray, fontWeight: 400, fontSize: theme.typography.smallFont }}>.08% Convenience Fee - max $5</Typography>
                  </div>
                </>
              }
            />
            <FormControlLabel
              value="Credit Card"
              control={<Radio />}
              label={
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={CreditCardIcon} alt="Chase" style={{ marginRight: "8px", height: "24px" }} />
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

        <Typography sx={{ color: theme.typography.common.blue, fontWeight: 800, fontSize: theme.typography.secondaryFont }}>
          <Typography>Other Payment Methods</Typography>
        </Typography>
        <Divider light />

        <FormControl component="fieldset">
          <RadioGroup aria-label="Number" name="number" value={selectedMethod} onChange={handleChange}>
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={PayPal} alt="PayPal" style={{ marginRight: "8px", height: "24px" }} />
                  Paypal
                </div>
              }
            />
            <FormControlLabel
              value="Apple Pay"
              control={<Radio />}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={ApplePay} alt="Apple Pay" style={{ marginRight: "8px", height: "24px" }} />
                  Apple Pay
                </div>
              }
            />
            <FormControlLabel
              value="Stripe"
              control={<Radio />}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={Stripe} alt="Stripe" style={{ marginRight: "8px", height: "24px" }} />
                  Stripe
                </div>
              }
            />

            <FormControlLabel
              value="Zelle"
              control={<Radio />}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={Zelle} alt="Zelle" style={{ marginRight: "8px", height: "24px" }} />
                  Zelle
                </div>
              }
            />
            <FormControlLabel
              value="Venmo"
              control={<Radio />}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={Venmo} alt="Venmo" style={{ marginRight: "8px", height: "24px" }} />
                  Venmo
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#3D5CAC",
            color: theme.palette.background.default,
            width: "100%", // Center the button horizontally
            borderRadius: "10px", // Rounded corners
            marginTop: "20px", // Add some spacing to the top
          }}
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
    </div>
  );
}
