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
import { useMyContext } from "../../../contexts/TenantProfileContext";
import StatusBarPM2 from "../../../images/onboarding/status_bar_pm2.png";
import { useUser } from "../../../contexts/UserContext";
import { formatPhoneNumber, headers, maskNumber } from "../helper";
import AES from "crypto-js/aes";

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

function POProfileDisplay() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    tenant_first_name,
    tenant_last_name,
    tenant_photo,
    tenant_phone_number,
    update_tenant_phone_number,
    tenant_email,
    update_tenant_email,
    tenant_ssn,
    update_tenant_ssn,
    masked_ssn,
    update_masked_ssn,
    tenant_address,
    update_tenant_address,
    tenant_unit,
    update_tenant_unit,
    tenant_city,
    update_tenant_city,
    tenant_state,
    update_tenant_state,
    tenant_zip,
    update_tenant_zip,
  } = useMyContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const handleNextStep = async () => {
    setShowSpinner(true);
    const payload = {
      tenant_user_id: user.user_uid,
      tenant_first_name: tenant_first_name,
      tenant_last_name: tenant_last_name,
      tenant_phone_number: tenant_phone_number,
      tenant_email: tenant_email,
      tenant_ssn: AES.encrypt(
        tenant_ssn,
        process.env.REACT_APP_ENKEY
      ).toString(),
      tenant_address: tenant_address,
      tenant_unit: tenant_unit,
      tenant_city: tenant_city,
      tenant_state: tenant_state,
      tenant_zip: tenant_zip,
      tenant_photo: tenant_photo,
    };
    const formPayload = new FormData();
    for (const key of Object.keys(payload)) {
      if (key === "tenant_photo" && payload[key])
        formPayload.append(key, payload[key].file);
      else formPayload.append(key, payload[key]);
    }
    const response = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantProfile",
      formPayload,
      headers
    );
    setShowSpinner(false);
    navigate("/tenantProfilePayment", {
      state: { tenantId: response.data.tenant_uid },
    });
  };

  const handleChange1 = (event) => {
    update_tenant_email(event.target.value);
  };

  const handleChange2 = (value) => {
    update_tenant_phone_number(value);
  };

  const handleChange3 = (event) => {
    update_tenant_address(event.target.value);
  };

  const handleChange4 = (event) => {
    update_tenant_unit(event.target.value);
  };

  const handleChange5 = (event) => {
    update_tenant_city(event.target.value);
  };

  const handleChange6 = (event) => {
    update_tenant_state(event.target.value);
  };

  const handleChange7 = (event) => {
    update_tenant_zip(event.target.value);
  };

  const handleSSNChange = (event) => {
    let value = event.target.value;
    if (!value) {
      update_tenant_ssn("");
      update_masked_ssn("");
      return;
    }
    if (value.length > 11) return;
    const lastChar = value.charAt(value.length - 1);
    let numeric = tenant_ssn;
    if (!numeric) numeric = "";
    let masked = masked_ssn;
    if (!masked) masked = "";
    if (masked.length > value.length) {
      if (lastChar !== "-")
        update_tenant_ssn(numeric.slice(0, numeric.length - 1));
      update_masked_ssn(value);
    } else {
      update_tenant_ssn(numeric + lastChar);
      update_masked_ssn(maskNumber(numeric + lastChar));
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
                  {"Tenant Profile Info"}
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
              name="tenant_email"
              value={tenant_email}
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
              name="tenant_phone_number"
              value={tenant_phone_number}
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
              name="tenant_address"
              value={tenant_address}
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
                  name="tenant_unit"
                  value={tenant_unit}
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
                  name="tenant_city"
                  value={tenant_city}
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
                  name="tenant_state"
                  value={tenant_state}
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
                  name="tenant_zip"
                  value={tenant_zip}
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
                  name="masked_ssn"
                  value={masked_ssn}
                  onChange={handleSSNChange}
                  variant="filled"
                  fullWidth
                  placeholder="***-**-****"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
            <Grid item xs={6}></Grid>
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
}

export default POProfileDisplay;
