import { useState } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Checkbox,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import theme from "../../../theme/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import StatusBarPM3 from "../../../images/onboarding/status_bar_pm3.png";
import PayPal from "../../../images/PayPal.png";
import Zelle from "../../../images/Zelle.png";
import Venmo from "../../../images/Venmo.png";
import Stripe from "../../../images/Stripe.png";
import ApplePay from "../../../images/ApplePay.png";
import { headers } from "../helper";

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

function POProfilePayment() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = location.state;
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false },
    apple_pay: { value: "", checked: false },
    stripe: { value: "", checked: false },
    zelle: { value: "", checked: false },
    venmo: { value: "", checked: false },
  });
  const [checkedCreditCard, setCheckedCreditCard] = useState(false);
  const [checkedBankAccount, setCheckedBankAccount] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleChangeValue = (e) => {
    const map = { ...paymentMethods };
    map[e.target.name].value = e.target.value;
    setPaymentMethods(map);
  };

  const handleChangeChecked = (e) => {
    const map = { ...paymentMethods };
    map[e.target.name].checked = !map[e.target.name].checked;
    setPaymentMethods(map);
  };

  const handleNextStep = async () => {
    setShowSpinner(true);
    const keys = Object.keys(paymentMethods);
    const payload = [];
    keys.forEach((key) => {
      if (paymentMethods[key].value !== "") {
        payload.push({
          paymentMethod_profile_id: tenantId,
          paymentMethod_type: key,
          paymentMethod_name: paymentMethods[key].value,
          paymentMethod_status: paymentMethods[key].checked
            ? "ACTIVE"
            : "INACTIVE",
        });
      }
    });
    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
      payload,
      headers
    );
    console.log("POST response: " + response);
    setShowSpinner(false);
    if (checkedCreditCard) navigate("");
    navigate("/onboardingRouter");
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
          width: "100%", // Take up full screen width
          height: "100vh", // Set the Box height to full view height
          justifyContent: "flex-start", // Align items at the top
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
            margin: "30px", // Margin around the paper
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
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
                    paddingLeft: "20%",
                    paddingTop: "10%",
                  }}
                >
                  <img src={StatusBarPM3} alt="status" />
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
                {"Tenant Payment Info"}
              </Typography>
            </>
          </Box>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  name="paypal"
                  checked={paymentMethods.paypal.checked}
                  onChange={handleChangeChecked}
                />
              </Grid>
              <Grid item xs={2}>
                <img src={PayPal} alt="PayPal" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="paypal"
                  value={paymentMethods.paypal.value}
                  onChange={handleChangeValue}
                  variant="filled"
                  fullWidth
                  placeholder="Enter Paypal"
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  name="apple_pay"
                  checked={paymentMethods.apple_pay.checked}
                  onChange={handleChangeChecked}
                />
              </Grid>
              <Grid item xs={2}>
                <img src={ApplePay} alt="ApplePay" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="apple_pay"
                  value={paymentMethods.apple_pay.value}
                  onChange={handleChangeValue}
                  variant="filled"
                  fullWidth
                  placeholder="Enter Apple Pay"
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  name="stripe"
                  checked={paymentMethods.stripe.checked}
                  onChange={handleChangeChecked}
                />
              </Grid>
              <Grid item xs={2}>
                <img src={Stripe} alt="Stripe" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="stripe"
                  value={paymentMethods.stripe.value}
                  onChange={handleChangeValue}
                  variant="filled"
                  fullWidth
                  placeholder="Use Stripe"
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  name="zelle"
                  checked={paymentMethods.zelle.checked}
                  onChange={handleChangeChecked}
                />
              </Grid>
              <Grid item xs={2}>
                <img src={Zelle} alt="Zelle" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="zelle"
                  value={paymentMethods.zelle.value}
                  onChange={handleChangeValue}
                  variant="filled"
                  fullWidth
                  placeholder="Enter Zelle Number"
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  name="venmo"
                  checked={paymentMethods.venmo.checked}
                  onChange={handleChangeChecked}
                />
              </Grid>
              <Grid item xs={2}>
                <img src={Venmo} alt="Venmo" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="venmo"
                  value={paymentMethods.venmo.value}
                  onChange={handleChangeValue}
                  variant="filled"
                  fullWidth
                  placeholder="Enter Venmo"
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  checked={checkedCreditCard}
                  onChange={() => setCheckedCreditCard((prev) => !prev)}
                />
              </Grid>

              <Grid item xs={10}>
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Connect credit card"
                  className={classes.root}
                  onClick={() => setCheckedCreditCard((prev) => !prev)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Checkbox
                  checked={checkedBankAccount}
                  onChange={() => setCheckedBankAccount((prev) => !prev)}
                />
              </Grid>

              <Grid item xs={10}>
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Connect bank account"
                  className={classes.root}
                  onClick={() => setCheckedBankAccount((prev) => !prev)}
                />
              </Grid>
            </Grid>
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
            >
              {"Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default POProfilePayment;
