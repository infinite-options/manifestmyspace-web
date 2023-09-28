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
} from "@mui/material";
import theme from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { Select } from "@mui/material";
import { Grid } from "@mui/material";
import { MenuItem } from "@mui/material";
import { useMyContext } from "../../../contexts/PMProfileContext";
import { useUser } from "../../../contexts/UserContext";
import StatusBarPM2 from "../../../images/onboarding/status_bar_pm2.png";
import axios from "axios";
import AddFeeText from "../../../images/AddFeeText.svg";
import Add from "../../../images/Add.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA", // Update the background color here
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
}));

function PMProfileDisplay() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    business_name,
    business_photo,
    business_phone_number,
    update_business_phone_number,
    business_email,
    update_business_email,
    business_ein_number,
    update_business_ein_number,
    business_address,
    update_business_address,
    business_unit,
    update_business_unit,
    business_city,
    update_business_city,
    business_state,
    update_business_state,
    business_zip,
    update_business_zip,
  } = useMyContext();
  const [showSpinner, setShowSpinner] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, fee_name: "", frequency: "", charge: "", of: "" },
  ]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: prev.length + 1, fee_name: "", frequency: "", charge: "", of: "" },
    ]);
  };

  const handleFeeChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...rows];
    list[index - 1][name] = value;
    setRows(list);
  };

  const handleFrequencyChange = (e, index) => {
    const value = e.target.value;
    let list = [...rows];
    list[index - 1].frequency = value;
    setRows(list);
  };

  const handleNextStep = async () => {
    setShowSpinner(true);
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "*",
    };
    const payload = {
      business_user_id: user.user_uid,
      business_type: "MANAGEMENT",
      business_name: business_name,
      business_photo: business_photo,
      business_phone_number: business_phone_number,
      business_email: business_email,
      business_ein_number: business_ein_number,
      business_services_fees: JSON.stringify(rows),
      business_address: business_address,
      business_unit: business_unit,
      business_city: business_city,
      business_state: business_state,
      business_zip: business_zip,
    };
    const formPayload = new FormData();
    for (const key of Object.keys(payload)) {
      if (key === "business_photo" && payload[key])
        formPayload.append(key, payload[key].file);
      else formPayload.append(key, payload[key]);
    }
    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile",
      formPayload,
      headers
    );
    console.log("POST result", response);
    setShowSpinner(false);
    navigate("/pmProfilePayment");
  };

  const handleChange1 = (event) => {
    update_business_email(event.target.value);
  };

  const handleChange2 = (event) => {
    update_business_phone_number(event.target.value);
  };

  const handleChange3 = (event) => {
    update_business_address(event.target.value);
  };

  const handleChange4 = (event) => {
    update_business_unit(event.target.value);
  };

  const handleChange5 = (event) => {
    update_business_city(event.target.value);
  };

  const handleChange6 = (event) => {
    update_business_state(event.target.value);
  };

  const handleChange7 = (event) => {
    update_business_zip(event.target.value);
  };

  const handleChange8 = (event) => {
    update_business_ein_number(event.target.value);
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
                  <img src={StatusBarPM2} />
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
                  Property Manager Profile Info
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
              Email Address
            </Typography>
            <TextField
              name="business_email"
              value={business_email}
              onChange={handleChange1}
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
              name="business_phone_number"
              value={business_phone_number}
              onChange={handleChange2}
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
              name="business_address"
              value={business_address}
              onChange={handleChange3}
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
                  name="business_unit"
                  value={business_unit}
                  onChange={handleChange4}
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
                  name="business_city"
                  value={business_city}
                  onChange={handleChange5}
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
                  }}
                >
                  State
                </Typography>
                <Select
                  name="business_state"
                  value={business_state}
                  onChange={handleChange6}
                  size="small"
                  fullWidth
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
                  name="business_zip"
                  value={business_zip}
                  onChange={handleChange7}
                  variant="filled"
                  fullWidth
                  placeholder="90234"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
          </Grid>
          <hr />
          <Box sx={{ paddingLeft: "30%" }}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              Management Fees
            </Typography>
          </Box>
          {rows.map((row) => (
            <div key={row.id}>
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
                      Fee Name
                    </Typography>
                    <TextField
                      name="fee_name"
                      value={row.fee_name}
                      variant="filled"
                      fullWidth
                      placeholder="Service Charge"
                      className={classes.root}
                      onChange={(e) => handleFeeChange(e, row.id)}
                    />
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
                      Frequency
                    </Typography>
                    <Select
                      value={row.frequency}
                      size="small"
                      fullWidth
                      onChange={(e) => handleFrequencyChange(e, row.id)}
                      placeholder="Select frequency"
                    >
                      <MenuItem value="Hourly">Hourly</MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Biweekly">Biweekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Annually">Annually</MenuItem>
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
                      Set Charge
                    </Typography>
                    <TextField
                      name="charge"
                      value={row.charge}
                      variant="filled"
                      fullWidth
                      placeholder="15%"
                      className={classes.root}
                      onChange={(e) => handleFeeChange(e, row.id)}
                    />
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
                      Percentage Of
                    </Typography>
                    <TextField
                      name="of"
                      value={row.of}
                      variant="filled"
                      fullWidth
                      placeholder="Rent"
                      className={classes.root}
                      onChange={(e) => handleFeeChange(e, row.id)}
                    />
                  </Stack>
                </Grid>
              </Grid>
              {row.id === rows.length ? (
                <Stack
                  direction="row"
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <div onClick={addRow} style={{ cursor: "pointer" }}>
                    <img src={AddFeeText} alt="add fee text" />
                    <img src={Add} alt="add" />
                  </div>
                </Stack>
              ) : (
                <hr />
              )}
            </div>
          ))}
          <hr />
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
                  SSN
                </Typography>
                <TextField
                  name="unit"
                  variant="filled"
                  fullWidth
                  placeholder="***-**-****"
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
                  EIN
                </Typography>
                <TextField
                  name="business_ein_number"
                  value={business_ein_number}
                  onChange={handleChange8}
                  variant="filled"
                  fullWidth
                  placeholder="Enter EIN"
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
              width: `100%`,
              height: `3%`,
              left: `5px`,
              top: `4px`,
              borderRadius: "10px 10px 10px 10px",
            }}
            onClick={handleNextStep}
          >
            Next Step
          </Button>

          <Stack spacing={-8} m={12}></Stack>
          <Stack spacing={-8} m={12}></Stack>
          <Stack spacing={-8} m={12}></Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default PMProfileDisplay;
