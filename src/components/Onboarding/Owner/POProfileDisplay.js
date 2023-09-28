import React, { useState } from "react";
import axios from "axios";
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
import { useMyContext } from "../../../contexts/POProfileContext";
import StatusBarPM2 from "../../../images/onboarding/status_bar_pm2.png";
import { useUser } from "../../../contexts/UserContext";
import { formatPhoneNumber, headers } from "../helper";

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

function POProfileDisplay() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    owner_first_name,
    owner_last_name,
    owner_photo,
    owner_phone_number,
    update_owner_phone_number,
    owner_email,
    update_owner_email,
    owner_ein_number,
    update_owner_ein_number,
    owner_ssn,
    update_owner_ssn,
    owner_address,
    update_owner_address,
    owner_unit,
    update_owner_unit,
    owner_city,
    update_owner_city,
    owner_state,
    update_owner_state,
    owner_zip,
    update_owner_zip,
  } = useMyContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const handleNextStep = async () => {
    setShowSpinner(true);
    const payload = {
      owner_user_id: user.user_uid,
      owner_first_name: owner_first_name,
      owner_last_name: owner_last_name,
      owner_phone_number: owner_phone_number,
      owner_email: owner_email,
      owner_ein_number: owner_ein_number,
      owner_ssn: owner_ssn,
      owner_address: owner_address,
      owner_unit: owner_unit,
      owner_city: owner_city,
      owner_state: owner_state,
      owner_zip: owner_zip,
      owner_photo: owner_photo,
    };
    const formPayload = new FormData();
    for (const key of Object.keys(payload)) {
      if (key === "owner_photo" && payload[key])
        formPayload.append(key, payload[key].file);
      else formPayload.append(key, payload[key]);
    }
    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/ownerProfile",
      formPayload,
      headers
    );
    setShowSpinner(false);
    navigate("/poProfilePayment", {
      state: { ownerId: response.data.owner_uid },
    });
  };

  const handleChange1 = (event) => {
    update_owner_email(event.target.value);
  };

  const handleChange2 = (value) => {
    update_owner_phone_number(value);
  };

  const handleChange3 = (event) => {
    update_owner_address(event.target.value);
  };

  const handleChange4 = (event) => {
    update_owner_unit(event.target.value);
  };

  const handleChange5 = (event) => {
    update_owner_city(event.target.value);
  };

  const handleChange6 = (event) => {
    update_owner_state(event.target.value);
  };

  const handleChange7 = (event) => {
    update_owner_zip(event.target.value);
  };

  const handleChange8 = (event) => {
    update_owner_ssn(event.target.value);
  };

  const handleChange9 = (event) => {
    update_owner_ein_number(event.target.value);
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
                  <img src={StatusBarPM2} alt="status" />
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
                  {"Property Owner Profile Info"}
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
              {"Email Address"}
            </Typography>
            <TextField
              name="owner_email"
              value={owner_email}
              type="email"
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
              {"Phone Number"}
            </Typography>
            <TextField
              name="owner_phone_number"
              value={owner_phone_number}
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e) => handleChange2(formatPhoneNumber(e.target.value))}
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
              {"Address"}
            </Typography>
            <TextField
              name="owner_address"
              value={owner_address}
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
                  {"Unit #"}
                </Typography>
                <TextField
                  name="owner_unit"
                  value={owner_unit}
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
                  {"City"}
                </Typography>
                <TextField
                  name="owner_city"
                  value={owner_city}
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
                  {"State"}
                </Typography>
                <Select
                  name="owner_state"
                  value={owner_state}
                  onChange={handleChange6}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="CA">CA</MenuItem>
                  <MenuItem value="TX">TX</MenuItem>
                  <MenuItem value="FL">FL</MenuItem>
                  <MenuItem value="NY">NY</MenuItem>
                  <MenuItem value="IL">IL</MenuItem>
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
                  {"Zip Code"}
                </Typography>
                <TextField
                  name="owner_zip"
                  value={owner_zip}
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
                  {"SSN"}
                </Typography>
                <TextField
                  type="password"
                  name="owner_ssn"
                  value={owner_ssn}
                  onChange={handleChange8}
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
                  {"EIN"}
                </Typography>
                <TextField
                  name="owner_ein_number"
                  value={owner_ein_number}
                  onChange={handleChange9}
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
              borderRadius: "10px",
            }}
            onClick={handleNextStep}
          >
            {"Next Step"}
          </Button>
          <Stack spacing={-8} m={12}></Stack>
          <Stack spacing={-8} m={12}></Stack>
          <Stack spacing={-8} m={12}></Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default POProfileDisplay;
