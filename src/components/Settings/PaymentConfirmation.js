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
} from "@mui/material";
import theme from "../../theme/theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import { alpha, makeStyles } from "@mui/styles";
import PayPal from "../../images/PayPal.png";
import Zelle from "../../images/Zelle.png";
import Venmo from "../../images/Venmo.png";
import Chase from "../../images/Chase.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import { margin } from "@mui/system";

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
export default function PaymentConfirmation() {
  const location=useLocation()
  const paymentNote=location.state.paymentData.business_code;

  let [balance, set_balance] = useState(100);
  let [convenience_fee, set_convenience_fee] = useState(10);
  let [total_balance, set_total_balance] = useState(balance + convenience_fee);
  let [card_convenience_text, set_card_convenience_text] = useState(
    "Convenience Fee - $0.04/ $2.40"
  );
  let [ach_convenience_text, set_ach_convenience_text] = useState(
    "Convenience Fee - $0.00 "
  );
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div>
    <typography>
        {paymentNote}
    </typography>

    </div>
  );
}
