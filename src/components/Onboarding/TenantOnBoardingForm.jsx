import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import AddressAutocompleteInput from "../Property/AddressAutocompleteInput";
import DataValidator from "../DataValidator";
import { formatPhoneNumber, headers, maskNumber, maskEin, roleMap, photoFields } from "./helper";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Backdrop,
  Paper,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import PayPal from "../../images/PayPal.png";
import ZelleIcon from "../../images/Zelle.png";
import VenmoIcon from "../../images/Venmo.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import ChaseIcon from "../../images/Chase.png";
import CloseIcon from "@mui/icons-material/Close";
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

export default function TenenatOnBoardingForm({ profileData, setIsSave }) {
  console.log("In TenenatOnBoardingForm ", profileData);

  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookies["default_form_vals"];
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const [addPhotoImg, setAddPhotoImg] = useState();
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [dashboardButtonEnabled, setDashboardButtonEnabled] = useState(false);
  const { user, isBusiness, isManager, roleName, selectRole, setLoggedIn, selectedRole, updateProfileUid, isLoggedIn, getProfileId } = useUser();
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, phoneNumber, setPhoneNumber, businessName, setBusinessName, photo, setPhoto } = useOnboardingContext();
  const { ein, setEin, ssn, setSsn, mask, setMask, address, setAddress, unit, setUnit, city, setCity, state, setState, zip, setZip } = useOnboardingContext();
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false, uid: "" },
    apple_pay: { value: "", checked: false, uid: "" },
    stripe: { value: "", checked: false, uid: "" },
    zelle: { value: "", checked: false, uid: "" },
    venmo: { value: "", checked: false, uid: "" },
    credit_card: { value: "", checked: false, uid: "" },
    bank_account: { account_number: "", routing_number: "", checked: false, uid: "" },
  });

  const [adults, setAdults] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
  const [children, setChildren] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
  const [pets, setPets] = useState([{ id: 1, name: "", breed: "", type: "", weight: "" }]);
  const [vehicles, setVehicles] = useState([{ id: 1, make: "", model: "", year: "", license: "", state: "" }]);

  // New state for job details
  const [currentSalary, setCurrentSalary] = useState("");
  const [salaryFrequency, setSalaryFrequency] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  return (
    <>
      <Grid
        onClick={() => navigate("/managerCashflow", { state: { showProfitability: true } })}
        container
        sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", cursor: "pointer" }}
      >
        <Grid container item xs={12} md={9} spacing={2} sx={{ padding: "20px" }}>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              backgroundColor: "#160449",
              color: "#FFFFFF",
              fontWeight: "bold",
              marginBottom: "10px",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <Grid container>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Monthly Profit (Expected vs Actual)</Typography>
              </Grid>
              <Grid item xs={2}>
                {/* <Typography sx={{ fontWeight: "bold" }}>{profit.toFixed(2)}</Typography> */}
                <Typography sx={{ fontWeight: "bold" }}>Profit Data</Typography>
              </Grid>
              <Grid item xs={2}>
                {/* <Typography sx={{ fontWeight: "bold" }}>{profitReceived.toFixed(2)}</Typography> */}
                <Typography sx={{ fontWeight: "bold" }}>More Profit Data</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              backgroundColor: "#9EAED6",
              marginBottom: "10px",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <Grid container>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Monthly Revenue (Expected vs Actual)</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: "bold" }}>Other Data</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: "bold" }}>More Data</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              backgroundColor: "#979797",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <Grid container>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Monthly Expenses (Expected vs Actual)</Typography>
              </Grid>
              <Grid item xs={2}>
                {/* <Typography sx={{ fontWeight: "bold" }}>{expenses}</Typography> */}
                <Typography sx={{ fontWeight: "bold" }}>Expense Data</Typography>
              </Grid>
              <Grid item xs={2}>
                {/* <Typography sx={{ fontWeight: "bold" }}>{expensesReceived}</Typography> */}
                <Typography sx={{ fontWeight: "bold" }}>Expense Data</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item xs={12} md={3} direction="row" justifyContent="center" alignItems="center" sx={{ padding: "10px" }}>
          <Grid item xs={6} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{
                width: "60%",
                // marginTop: '10px',
                backgroundColor: "#A9AAAB",
                color: "#19084B",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#A9AAAB",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                // navigate("/payments")
                navigate("/managerCashflow", { state: { showPayments: true } });
              }}
            >
              Pay Bills
            </Button>
          </Grid>
          <Grid item xs={6} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/managerCashflow", { state: { showTransactions: true } });
              }}
              variant="contained"
              sx={{
                width: "60%",
                // marginTop: '10px',
                backgroundColor: "#A9AAAB",
                color: "#19084B",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#A9AAAB",
                },
              }}
            >
              Transactions!
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
