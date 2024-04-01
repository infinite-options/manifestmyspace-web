import { useState, useEffect } from "react";
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
import Zelle from "../../images/Zelle.png";
import Venmo from "../../images/Venmo.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import { headers } from "./helper";
import { useCookies } from "react-cookie";
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
  const { user, isBusiness, roleName, isLoggedIn } =
    useUser();
  
  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];
  const [nextStepDisabled, setNextStepDisabled]=useState(false)
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false },
    apple_pay: { value: "", checked: false },
    stripe: { value: "", checked: false },
    zelle: { value: "", checked: false },
    venmo: { value: "", checked: false },
  });

 
  const [checkedCreditCard, setCheckedCreditCard] = useState(false);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [checkedBankAccount, setCheckedBankAccount] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const personalInfoPage= isLoggedIn? "/privatePersonalInfo" : "/personalInfo" 
  const onBoaringPage= isLoggedIn? "/privateOnboardingRouter" : "/onboardingRouter";
  const handleChangeValue = (e) => {
    const map = { ...paymentMethods };
    map[e.target.name].value = e.target.value;
    setPaymentMethods(map);
  };

  const handleChangeChecked = (e) => {
    const { name, checked } = e.target;
    const map = { ...paymentMethods };
    map[name].checked = checked;
  
    // If the checkbox is unchecked, disable the corresponding text field and clear its value
    if (!checked) {
      map[name].value = ""; // Clear the value
  
      // Reset credit card number when unchecking the credit card checkbox
      if (name === "checkedCreditCard") {
        setCreditCardNumber(""); // Reset credit card number
      }
  
      // Reset routing number and account number when unchecking the bank account checkbox
      if (name === "checkedBankAccount") {
        setRoutingNumber(""); // Reset routing number
        setAccountNumber(""); // Reset account number
      }
    }
  
    setPaymentMethods(map);
  };
  
  
  useEffect(() => {
    let disable_state = Object.keys(paymentMethods).some(
      (key) =>
        paymentMethods[key]?.checked &&
        paymentMethods[key]?.value === ""
    );
  
    if (checkedCreditCard && creditCardNumber === "") {
      disable_state = true;
    }
  
    if (
      checkedBankAccount &&
      (routingNumber === "" || accountNumber === "")
    ) {
      disable_state = true;
    }
  
    setNextStepDisabled(disable_state);
  }, [paymentMethods, checkedCreditCard, creditCardNumber, checkedBankAccount, routingNumber, accountNumber]);
  
  const handleNextStep = async () => {
    setShowSpinner(true);
    const keys = Object.keys(paymentMethods);
    const payload = [];
  
    // Iterate over paymentMethods to construct payload
    keys.forEach((key) => {
      if (paymentMethods[key].value !== "") {
        payload.push({
          paymentMethod_profile_id: profileId,
          paymentMethod_type: key,
          paymentMethod_name: paymentMethods[key].value,
          paymentMethod_status: paymentMethods[key].checked ? "ACTIVE" : "INACTIVE",
        });
      }
    });
  
    // Include credit card information if checked
    if (checkedCreditCard && creditCardNumber !== "") {
      payload.push({
        paymentMethod_profile_id: profileId,
        paymentMethod_type: "credit_card",
        paymentMethod_name: creditCardNumber,
        paymentMethod_status: "ACTIVE", // You can set the status based on your requirements
      });
    } else {
      // Clear credit card number if unchecked
      setCreditCardNumber("");
    }
  
    // Include bank account information if checked
    if (checkedBankAccount && routingNumber !== "" && accountNumber !== "") {
      payload.push({
        paymentMethod_profile_id: profileId,
        paymentMethod_type: "bank_account",
        paymentMethod_name: `Routing Number: ${routingNumber}, Account Number: ${accountNumber}`,
        paymentMethod_status: "ACTIVE", // You can set the status based on your requirements
      });
    } else {
      // Clear routing number and account number if unchecked
      setRoutingNumber("");
      setAccountNumber("");
    }
  
    // POST request to submit payload
    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
      payload,
      headers
    );
  
    console.log("POST response: " + response);
    setShowSpinner(false);
  
    // Update cookie with default form values
    setCookie("default_form_vals", { ...cookiesData, paymentMethods });
  
    // Navigate based on conditions
    if (checkedCreditCard) {
      navigate("");
    } else if (isBusiness()) {
      navigate(personalInfoPage, { state: { businessId: profileId } });
    } else {
      navigate(onBoaringPage);
    }
  };
  
  

  const handleRoleSpecifics = () => {
    if (isBusiness()) setStatusImg(Status34);
    else setStatusImg(Status33);
  };

  useEffect(() => {
    if (cookiesData?.paymentMethods)
    setPaymentMethods(cookiesData.paymentMethods)
  
    handleRoleSpecifics();
  }, []);

  useEffect(() => {
    let disable_state = Object.keys(paymentMethods).some(key => paymentMethods[key]?.checked && paymentMethods[key]?.value === "");
    setNextStepDisabled(disable_state);
  }, [paymentMethods]);
  
  // Add useEffect to reset credit card number when checkbox is unchecked
useEffect(() => {
  if (!checkedCreditCard) {
    setCreditCardNumber("");
  }
}, [checkedCreditCard]);

// Add useEffect to reset routing number and account number when checkbox is unchecked
useEffect(() => {
  if (!checkedBankAccount) {
    setRoutingNumber("");
    setAccountNumber("");
  }
}, [checkedBankAccount]);



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
          {/* PayPal Grid */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {/* PayPal Grid Item */}
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
                  disabled={!paymentMethods.paypal.checked}
                  className={classes.root}
                />
              </Grid>
            </Grid>
            {/* Apple Pay Grid */}
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
                  disabled={!paymentMethods.apple_pay.checked}
                  className={classes.root}
                />
              </Grid>
            </Grid>
            {/* Stripe Grid */}
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
                  disabled={!paymentMethods.stripe.checked}
                  className={classes.root}
                />
              </Grid>
            </Grid>
            {/* Zelle Grid */}
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
                  disabled={!paymentMethods.zelle.checked}
                  className={classes.root}
                />
              </Grid>
            </Grid>
            {/* Venmo Grid */}
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
                  disabled={!paymentMethods.venmo.checked}
                  className={classes.root}
                />
              </Grid>
            </Grid>
          </Grid>

          
          {/* Credit Card Grid */}
          
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
    <Grid item xs={2}>
      <img src={BankIcon} alt="Bank" />
    </Grid>
    <Grid item xs={8}>
      <TextField
        variant="filled"
        fullWidth
        placeholder="Connect credit card"
        className={classes.root}
        disabled={!checkedCreditCard}
        value={creditCardNumber}
        onChange={(e) => setCreditCardNumber(e.target.value)}
      />
    </Grid>
  </Grid>
</Grid>

          {/* Bank Account Grid */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            
            {/* Routing Number and Account Number Grid */}
          </Grid>
          {/*Bank Account */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {/* Remaining Grids */}
          </Grid>
          {/* Routing Number and Account Number */}
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
              <Grid item xs={2}>
                <img src={BankIcon} alt="Bank" />
              </Grid>
              
              <Grid item xs={2}>
                <TextField
          variant="filled"
          fullWidth
          placeholder="Routing Number"
          className={classes.root}
          disabled={!checkedBankAccount}
          value={routingNumber}
          onChange={(e) => setRoutingNumber(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          variant="filled"
          fullWidth
          placeholder="Account Number"
          className={classes.root}
          disabled={!checkedBankAccount}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
              </Grid>
            </Grid>
          </Grid>
          {/* Next Step Button */}
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
