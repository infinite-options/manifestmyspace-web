import React, { Component, useState } from "react";
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
} from "@mui/material";
import StripeFeesDialog from "./StripeFeesDialog";
import StripePayment from "./StripePayment";
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
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import { margin } from "@mui/system";
import axios from "axios";

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
  let balance = location.state.total;
  let [paymentData, setPaymentData] = useState(location.state.paymentData);
  console.log("business_code", paymentData.business_code);
  let [convenience_fee, set_convenience_fee] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(""); // Initial selection
  let totalBalance = balance + convenience_fee;

  const [stripePayment, setStripePayment] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);

  const [stripeDialogShow, setStripeDialogShow] = useState(false);
  const payment_url = {
    "Credit Card":
      "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent",
    "Bank Transfer":
      "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent",
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
      axios
        .post(
          "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/getCorrectKeys/PMTEST"
        )
        .then((result) => {
          console.log(
            "(1 PaymentDetails) Stripe-key then result (1): " +
              JSON.stringify(result)
          );
          // setSelectedMethod(result.data.PUBLISHABLE_KEY);
          //let tempStripePromise = loadStripe(result.data.publicKey);

          // console.log("(1 PaymentDetails) setting state with stripePromise");

          // setStripePromise(tempStripePromise);

          // console.log(tempStripePromise);
          // console.log("(1 PaymentDetails) stripePromise set!");
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log(
              "(1 PaymentDetails) error: " + JSON.stringify(err.response)
            );
          }
        });
    } else {
      // Fetch public key live

      console.log("fetching public key live");
      axios
        .post(
          "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/getCorrectKeys/PM"
        )
        .then((result) => {
          console.log(
            "(2 PaymentDetails) Stripe-key then result (1): " +
              JSON.stringify(result)
          );
          setSelectedMethod(result.data.publicKey);
          // let tempStripePromise = loadStripe(result.data.publicKey);

          // console.log("(2 PaymentDetails) setting state with stripePromise");

          // console.log(tempStripePromise);
          // setStripePromise(tempStripePromise);

          // console.log("(2 PaymentDetails) stripePromise set!");
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log(
              "(2 PaymentDetails) error: " + JSON.stringify(err.response)
            );
          }
        });
    }
  }
  const submit = () => {
    // cancel();
    setPaymentConfirm(true);
  };
  //CreditCardHandler

  async function bank_transfer_handler() {
    // Set the Content-Type header
    const headers = {
      "Content-Type": "application/json",
    };

    // Make the POST request

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

    // navigate
    navigate("/PaymentConfirmation", { state: { paymentData } });
  }

  function update_fee(e) {
    if (e.target.value === "Bank Transfer")
      set_convenience_fee(Math.min(balance * 0.008, 5));
    else if (e.target.value === "Credit Card")
      set_convenience_fee(balance * 0.03);
    else set_convenience_fee(0);
    totalBalance = balance + convenience_fee;
  }

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
    update_fee(event);
  };

  const handleSubmit = async (e) => {
    console.log("selectedMethod", selectedMethod);
    e.preventDefault();
    paymentData.payment_summary.total = parseFloat(totalBalance.toFixed(2));

    if (selectedMethod === "Bank Transfer") bank_transfer_handler();
    else if (selectedMethod === "Credit Card") {
      console.log("in else if");
      toggleKeys();

      setStripeDialogShow(true);
    }
    // credit_card_handler(paymentData.business_code);
  };
  const toggleKeys = async () => {
    console.log("inside toggle keys");
    const url =
      paymentData.business_code === "PMTEST"
        ? "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PMTEST"
        : "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/stripe_key/PM";
    let response = await fetch(url);
    const responseData = await response.json();
    const stripePromise = loadStripe(responseData.publicKey);
    setStripePromise(stripePromise);
  };
  return (
    <div>
      <StripeFeesDialog
        stripeDialogShow={stripeDialogShow}
        setStripeDialogShow={setStripeDialogShow}
        toggleKeys={toggleKeys}
        setStripePayment={setStripePayment}
      />
      <Stack direction="row" justifyContent="center">
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
      <Stack direction="row" justifyContent="center">
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

      <Stack direction="row" justifyContent="center">
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

      <Stack>
        <hr width="50%" />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} justifyContent="center">
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

          <Grid item xs={6}>
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

          <Grid item xs={6}>
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

          <Grid item xs={6}>
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

          <Grid item xs={6}>
            <Typography
              sx={{
                justifySelf: "center",
                color: "#160449",
                fontWeight: theme.typography.light.fontWeight,
                fontSize: theme.typography.smallFont,
              }}
            >
              Total Balance
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{
                justifySelf: "center",
                color: "#160449",
                fontWeight: theme.typography.light.fontWeight,
                fontSize: theme.typography.smallFont,
              }}
            >
              {"$" + (balance + convenience_fee).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <hr />

      <Typography variant="h6">Choose a number:</Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="Number"
          name="number"
          value={selectedMethod}
          onChange={handleChange}
        >
          <FormControlLabel
            value="Bank Transfer"
            control={<Radio />}
            label="Bank Transfer"
          />
          <FormControlLabel
            value="Credit Card"
            control={<Radio />}
            label="Credit Card"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography>Other Payment Methods</Typography>
          </div>
          <FormControlLabel value="Paypal" control={<Radio />} label="Paypal" />
          <FormControlLabel
            value="Apple Pay"
            control={<Radio />}
            label="Apple Pay"
          />
          <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" />
          <FormControlLabel value="Zelle" control={<Radio />} label="Zelle" />
          <FormControlLabel value="Venmo" control={<Radio />} label="Venmo" />
        </RadioGroup>
      </FormControl>
      <Typography variant="body1">
        Selected value: {selectedMethod} {payment_url[selectedMethod]}
      </Typography>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          background: "#3D5CAC",
          color: theme.palette.background.default,
          width: `50%`,
          height: `20%`,
          left: `14px`,
          top: `4px`,
          borderRadius: "10px 10px 10px 10px",
          margin: "5% 50% 30% 5%",
        }}
      >
        Make Payment
      </Button>
      <div hidden={!stripePayment} STYLE={{ marginBottom: "10rem" }}>
        <Elements stripe={stripePromise}>
          <StripePayment
            submit={submit}
            message={paymentData.business_code}
            amount={paymentData.payment_summary.total}
            paidBy={paymentData.customer_id}
          />
        </Elements>
      </div>
    </div>
  );
}
