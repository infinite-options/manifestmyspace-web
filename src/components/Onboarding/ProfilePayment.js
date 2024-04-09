import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Checkbox, Backdrop, CircularProgress } from "@mui/material";
import theme from "../../theme/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import Status33 from "../../images/status_bar_7.png";
import BankIcon from "../../images/Chase.png";
import Status34 from "../../images/status_bar_9.png";
import PayPal from "../../images/PayPal.png";
import ZelleIcon from "../../images/Zelle.png";
import VenmoIcon from "../../images/Venmo.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import { headers } from "./helper";
import { useCookies } from "react-cookie";
import ChaseIcon from "../../images/Chase.png";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
}));

function ProfilePayment() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId } = location.state;
  const [statusImg, setStatusImg] = useState();
  const { user, isBusiness, roleName, isLoggedIn } = useUser();
  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false },
    apple_pay: { value: "", checked: false },
    stripe: { value: "", checked: false },
    zelle: { value: "", checked: false },
    venmo: { value: "", checked: false },
    credit_card: { value: "", checked: false },
    bank_account: { account_number: "", routing_number: "", checked: false },
  });
  const [showSpinner, setShowSpinner] = useState(false);
  const personalInfoPage = isLoggedIn ? "/privatePersonalInfo" : "/personalInfo";
  const onBoardingPage = isLoggedIn ? "/privateOnboardingRouter" : "/onboardingRouter";

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === 'bank_account_account' || name === 'bank_account_routing') {
      setPaymentMethods(prevState => ({
        ...prevState,
        bank_account: {
          ...prevState.bank_account,
          [name === 'bank_account_account' ? 'account_number' : 'routing_number']: value
        }
      }));
    } else {
      setPaymentMethods(prevState => ({
        ...prevState,
        [name]: { ...prevState[name], value }
      }));
    }
  };

  const handleChangeChecked = (e) => {
    const { name, checked } = e.target;
    const map = { ...paymentMethods };
    map[name].checked = checked;
    if (name === 'bank_account') {
      if (!checked) {
        map.bank_account.account_number = "";
        map.bank_account.routing_number = "";
      }
    } else {
      if (!checked) {
        map[name].value = "";
      }
    }
    setPaymentMethods(map);
  };
  
  useEffect(() => {
    let disable_state = Object.keys(paymentMethods).some((key) => {
      if (
        paymentMethods[key].checked &&
        paymentMethods[key].value === ""
      ) {
        return true;
      }
      if (
        key === "bank_account" && paymentMethods[key].checked && (paymentMethods[key].account_number === "" || paymentMethods[key].routing_number === "")
      ) {
        return true;
      }
      return false;
    });
    setNextStepDisabled(disable_state);
  }, [paymentMethods]);
  
  async function handleNextStep() {
    setShowSpinner(true);
    const keys = Object.keys(paymentMethods);
    const payload = [];
    let bankAccountIncomplete = false;
    keys.forEach((key) => {
      if (paymentMethods[key].value !== "") {
        let paymentMethodPayload = {
          paymentMethod_profile_id: profileId,
          paymentMethod_type: key,
        };
        if (key === "bank_account") {
          const bankAccount = paymentMethods[key];
          if (bankAccount.routing_number && bankAccount.account_number) {
            paymentMethodPayload.paymentMethod_routing_number = bankAccount.routing_number;
            paymentMethodPayload.paymentMethod_account_number = bankAccount.account_number;
            payload.push(paymentMethodPayload);
          } 
        } else {
          paymentMethodPayload.paymentMethod_value = paymentMethods[key].value;
          payload.push(paymentMethodPayload);
        }
      }
    });

    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
      payload,
      headers
    );
    console.log("POST response: ", response);
    setShowSpinner(false);
    setCookie("default_form_vals", { ...cookiesData, paymentMethods });
    if (isBusiness()) {
      navigate(personalInfoPage, { state: { businessId: profileId } });
    } else {
      navigate(onBoardingPage);
    }
  }

  const paymentMethodsArray = [
    { name: "PayPal", icon: PayPal, state: paymentMethods.paypal },
    { name: "Apple Pay", icon: ApplePay, state: paymentMethods.apple_pay },
    { name: "Stripe", icon: Stripe, state: paymentMethods.stripe },
    { name: "Zelle", icon: ZelleIcon, state: paymentMethods.zelle },
    { name: "Venmo", icon: VenmoIcon, state: paymentMethods.venmo },
    { name: "Credit Card", icon: ChaseIcon, state: paymentMethods.credit_card },
    { name: "Bank Account", icon: ChaseIcon, state: paymentMethods.bank_account },
  ];

  const renderPaymentMethods = () => {
    return paymentMethodsArray.map((method, index) => (
      <Grid
        container
        alignItems="center"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        key={index}
      >
        <Grid item xs={2}>
          <Checkbox
            name={method.name.toLowerCase().replace(/\s/g, "_")}
            checked={method.state?.checked}
            onChange={handleChangeChecked}
          />
        </Grid>
        <Grid item xs={2}>
          <img src={method.icon} alt={method.name} />
        </Grid>
        {method.name === "Bank Account" ? (
          <>
            <Grid item xs={4}>
              <TextField
                name={`${method.name.toLowerCase().replace(/\s/g, "_")}_account`}
                value={method.state?.account_number}
                onChange={handleChangeValue}
                variant="filled"
                fullWidth
                placeholder={`Enter Your Bank Account Number`}
                disabled={!method.state?.checked}
                className={classes.root}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name={`${method.name.toLowerCase().replace(/\s/g, "_")}_routing`}
                value={method.state?.routing_number}
                onChange={handleChangeValue}
                variant="filled"
                fullWidth
                placeholder={`Enter Your Bank Routing Number`}
                disabled={!method.state?.checked}
                className={classes.root}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={8}>
            <TextField
              name={method.name.toLowerCase().replace(/\s/g, "_")}
              value={method.state?.value}
              onChange={handleChangeValue}
              variant="filled"
              fullWidth
              placeholder={`Enter ${method.name}`}
              disabled={!method.state?.checked}
              className={classes.root}
            />
          </Grid>
        )}
      </Grid>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          justifyContent: "flex-start",
        }}
      >
        <Box
          component="span"
          display="flex"
          margin="10px"
          justifyContent="center"
          alignItems="center"
          position="relative"
        ></Box>
        <Paper
          style={{
            margin: "30px",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%",
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
          }}
        >
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            flexDirection="column"
          >
            <>
              <Stack direction="row" justifyContent="center">
                <Box
                  sx={{
                    paddingTop: "10%",
                  }}
                >
                  <img src={statusImg} alt="status" />
                </Box>
              </Stack>

              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                {`${roleName()} Payment Info`}
              </Typography>
            </>
          </Box>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {renderPaymentMethods()}
          </Grid>
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            position="relative"
            flexDirection="column"
            height="15.2vh"
          >
            <Button
              variant="contained"
              sx={{
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: "96%",
                height: "33px",
                borderRadius: "10px",
                marginLeft: "2%",
                position: "absolute",
                bottom: 15,
              }}
              onClick={handleNextStep}
              disabled={nextStepDisabled}
            >
              {"Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default ProfilePayment;
