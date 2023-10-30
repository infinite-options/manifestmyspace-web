import React, { useState } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  TextField,
  Select,
  Grid,
  MenuItem,
} from "@mui/material";
import theme from "../../theme/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../../contexts/UserContext";
//import Status44 from "../../images/status_4_4.svg";
import Status44 from "../../images/status_bar_8.png";
import axios from "axios";
import { formatPhoneNumber, headers, maskNumber } from "./helper";
import AES from "crypto-js/aes";
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
  select: {
    backgroundColor: "#D6D5DA",
    height: 30,
    borderRadius: "10px !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D6D5DA",
    },
  },
}));

const PersonalInfo = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, isLoggedIn, isEmployee, roleName, updateProfileUid } = useUser();
  const location = useLocation();
  const { businessId } = location.state;

  
  
  const [showSpinner, setShowSpinner] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [ssn, setSsn] = useState("");
  const [mask, setMask] = useState("");
  const profilePage= isLoggedIn? "/privateProfilePayment" :"/profilePayment";
  const onBoaringPage= isLoggedIn? "/privateOnboardingRouter" : "/onboardingRouter";
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  const handleSsnChange = (event) => {
    let value = event.target.value;
    if (!value) {
      setMask("");
      setSsn("");
      return;
    }
    if (value.length > 11) return;
    const lastChar = value.charAt(value.length - 1);
    if (mask.length > value.length) {
      if (lastChar !== "-") setSsn(ssn.slice(0, ssn.length - 1));
      setMask(value);
    } else {
      setSsn(ssn + lastChar);
      setMask(maskNumber(ssn + lastChar));
    }
  };

  const handleNextStep = async () => {
    setShowSpinner(true);
    const payload = {
      employee_user_id: user.user_uid,
      employee_business_id: businessId,
      employee_first_name: firstName,
      employee_last_name: lastName,
      employee_phone_number: phoneNumber,
      employee_email: email,
      employee_role: isEmployee() ? "EMPLOYEE" : "OWNER",
      employee_address: address,
      employee_unit: unit,
      employee_city: city,
      employee_state: state,
      employee_zip: zip,
      employee_ssn: AES.encrypt(ssn, process.env.REACT_APP_ENKEY).toString(),
    };
    const formPayload = new FormData();
    for (const key of Object.keys(payload)) {
      if (key === "employee_photo" && payload[key])
        formPayload.append(key, payload[key].file);
      else formPayload.append(key, payload[key]);
    }
    const { data } = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee",
      formPayload,
      headers
    );
    handleUpdateProfileUid(data);
    setShowSpinner(false);
    if (isEmployee())
      navigate(profilePage, { state: { profileId: businessId } });
    else navigate(onBoaringPage );
  };
  const handleUpdateProfileUid = (data) => {
    if (isEmployee()) {
      updateProfileUid({ business_employee_id: data.employee_uid });
    } else {
      updateProfileUid({ business_owner_id: data.employee_uid });
    }
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
        <Paper
          style={{
            margin: "30px 5px 30px 5px",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%",
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
                  <img src={Status44} alt="status" />
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="center">
                <Typography
                  sx={{
                    color: theme.typography.propertyPage.color,
                    fontFamily: "Source Sans Pro",
                    fontWeight: theme.typography.common.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  {`${roleName()} Personal Info`}
                </Typography>
              </Stack>
            </>
          </Box>
          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              Display Name
            </Typography>
            <Stack spacing={5} direction="row">
              <TextField
                name="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                placeholder="First Name"
                variant="filled"
                fullWidth
                className={classes.root}
              ></TextField>
              <TextField
                name="lastname"
                value={lastName}
                onChange={handleLastNameChange}
                placeholder="Last Name"
                variant="filled"
                fullWidth
                className={classes.root}
              ></TextField>
            </Stack>
          </Stack>
          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              Email Address
            </Typography>
            <TextField
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="email@site.com"
              variant="filled"
              fullWidth
              className={classes.root}
            ></TextField>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              Phone Number
            </Typography>
            <TextField
              name="phoneNumber"
              value={phoneNumber}
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e) =>
                handlePhoneNumberChange(formatPhoneNumber(e.target.value))
              }
              placeholder="(000)000-0000"
              variant="filled"
              fullWidth
              className={classes.root}
            ></TextField>
          </Stack>
          <hr />
          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              {" "}
              Address
            </Typography>
            <TextField
              name="address"
              value={address}
              onChange={handleAddressChange}
              variant="filled"
              fullWidth
              placeholder="Enter street address"
              className={classes.root}
            ></TextField>
          </Stack>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Unit #
                </Typography>
                <TextField
                  name="nit"
                  value={unit}
                  onChange={handleUnitChange}
                  variant="filled"
                  fullWidth
                  placeholder="3"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  City
                </Typography>
                <TextField
                  name="city"
                  value={city}
                  onChange={handleCityChange}
                  variant="filled"
                  fullWidth
                  placeholder="San Jose"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    paddingBottom: "10px",
                  }}
                >
                  State
                </Typography>
                <Select
                  name="state"
                  value={state}
                  onChange={handleStateChange}
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  <MenuItem value={1}>CA</MenuItem>
                  <MenuItem value={2}>TX</MenuItem>
                  <MenuItem value={3}>FL</MenuItem>
                  <MenuItem value={4}>NY</MenuItem>
                  <MenuItem value={5}>IL</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Zip Code
                </Typography>
                <TextField
                  name="zip"
                  value={zip}
                  onChange={handleZipChange}
                  variant="filled"
                  fullWidth
                  placeholder="90234"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
          </Grid>
          <hr />
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  SSN
                </Typography>
                <TextField
                  name="ssn"
                  value={mask}
                  onChange={handleSsnChange}
                  variant="filled"
                  fullWidth
                  placeholder="***-**-****"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            sx={{
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: "96%",
              height: "33px",
              borderRadius: "10px",
              marginLeft: "2%",
              marginBottom: "10px",
            }}
            onClick={handleNextStep}
          >
            {"Next Step"}
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default PersonalInfo;
