import React, { useState } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { formatPhoneNumber } from "./helper";
import { useCookies } from "react-cookie";
import DataValidator from "../DataValidator";

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

function Register() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const validate_form = () => {
    if (firstName === "" || lastName === "" || phoneNumber === "") {
      alert("Please fill out all fields");
      return false;
    }
    if (!DataValidator.phone_validate(phoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    if (validate_form() === false) return;

    const user = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      password: password,
      role: "",
      isEmailSignup: true,
    };

    setCookie("default_form_vals", { ...cookiesData, firstName, lastName, phoneNumber, email });

    if (isDesktop) {
      navigate("/onboardingDesktop", { state: { user } });
    } else {
      navigate("/selectRole", { state: { user } });
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
          style={{
            paddingTop: "10%",
            width: "80%",
            paddingBottom: "10%",
          }}
        >
          <Typography
            sx={{
              color: theme.typography.propertyPage.color,
              fontWeight: theme.typography.common.fontWeight,
              fontSize: theme.typography.largeFont,
            }}
          >
            {"New User"}
          </Typography>
          <hr />
        </Box>

        <Paper
          style={{
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
            position="relative"
            flexDirection="column"
          >
            <Stack spacing={-2} m={5} direction="row">
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                {"Contact Info"}
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder="Phone Number"
                fullWidth
                className={classes.root}
              />
            </Box>
          </Stack>
          <Button
            sx={{
              paddingLeft: "2%",
              paddingRight: "2%",
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: `100%`,
              height: `15%`,
              borderRadius: "15px",
              fontSize: theme.typography.smallFont,
              fontWeight: theme.typography.primary.fontWeight,
              textTransform: "none",
            }}
            onClick={handleCreateUser}
          >
            {"Save"}
          </Button>
          <Stack spacing={-20} m={12}>
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.common.default,
                fontWeight: theme.typography.light.fontWeight,
                fontSize: theme.typography.primary.smallFont,
              }}
            >
              {"Already have an account ?"}
              <u>
                <a href="/returningUser">{"Log In"}</a>
              </u>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Register;
