import React, { useState } from "react";
import axios from "axios";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Backdrop, CircularProgress } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import PasswordModal from "./PasswordModal";
import UserDoesNotExistModal from "./UserDoesNotExistModal";
import { roleMap } from "./helper";
import { useCookies } from "react-cookie";

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

function UserLogin() {
  console.log("In User Login");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { user_emai } = location.state || ''; // Access passed state here
  const [passModal, setpassModal] = useState(false);
  const [email, setEmail] = useState(user_emai);
  const [password, setPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const { setAuthData, setLoggedIn, selectRole } = useUser();
  const [userDoesntExist, setUserDoesntExist] = useState(false);
  const submitForm = async () => {
    if (email === "" || password === "") {
      alert("Please fill out all fields");
      return;
    }
    setShowSpinner(true);
    axios
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/AccountSalt/MYSPACE", {
        email: email,
      })
      .then((res) => {
        let saltObject = res;
        if (saltObject.data.code === 200) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;

          if (hashAlg != null && salt != null) {
            // Make sure the data exists
            if (hashAlg !== "" && salt !== "") {
              // Rename hash algorithm so client can understand
              switch (hashAlg) {
                case "SHA256":
                  hashAlg = "SHA-256";
                  break;
                default:
                  break;
              }
              // Salt plain text password
              let saltedPassword = password + salt;
              // Encode salted password to prepare for hashing
              const encoder = new TextEncoder();
              const data = encoder.encode(saltedPassword);
              //Hash salted password
              crypto.subtle.digest(hashAlg, data).then((res) => {
                let hash = res;
                // Decode hash with hex digest
                let hashArray = Array.from(new Uint8Array(hash));
                let hashedPassword = hashArray
                  .map((byte) => {
                    return byte.toString(16).padStart(2, "0");
                  })
                  .join("");
                console.log(hashedPassword);
                let loginObject = {
                  email: email,
                  password: hashedPassword,
                };
                console.log(JSON.stringify(loginObject));
                axios
                  .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/Login/MYSPACE", loginObject)
                  .then((response) => {
                    console.log(response.data.message);
                    const { message, result } = response.data;
                    if (message === "Incorrect password") {
                      alert(response.data.message);
                      setShowSpinner(false);
                    } else if (message === "Email doesn't exist") {
                      setUserDoesntExist(true);
                      setShowSpinner(false);
                    } else if (message === "Login successful") {
                      setAuthData(result);
                      const { role } = result.user;
                      const openingRole = role.split(",")[0];
                      selectRole(openingRole);
                      setLoggedIn(true);
                      const { dashboardUrl } = roleMap[openingRole];
                      navigate(dashboardUrl);
                    }
                  })
                  .catch((err) => {
                    if (err.response) {
                      console.log(err.response);
                    }
                    console.log(err);
                  });
              });
            }
          }
        } else {
          setUserDoesntExist(true);
          setShowSpinner(false);
        }
      });
  };

  const onReset = async () => {
    if (email === "") {
      alert("Please enter an email");
      return;
    }
    setShowSpinner(true);
    axios
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/SetTempPassword/MYSPACE", {
        email: email,
      })
      .then((response) => {
        if (response.data.message === "A temporary password has been sent") {
          setShowSpinner(false);
          setpassModal(true);
        }
        if (response.data.code === 280) {
          console.log(response);
          alert("No account found with that email.");
          return;
        }
      });
  };
  const onCancel = () => {
    setpassModal(false);
  };

  const onCancelModal = () => {
    setUserDoesntExist(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
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
        <PasswordModal isOpen={passModal} onCancel={onCancel} />
        <UserDoesNotExistModal isOpen={userDoesntExist} onCancel={onCancelModal} email={email} />
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
            Returning User
          </Typography>
          <hr />
        </Box>

        <Paper
          style={{
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
          <Box component="span" display="flex" justifyContent="center" position="relative" flexDirection="column">
            <>
              <Stack spacing={-2} m={5} direction="row">
                <Typography
                  sx={{
                    color: theme.typography.propertyPage.color,
                    fontFamily: "Source Sans Pro",
                    fontWeight: theme.typography.common.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  User Login
                </Typography>
              </Stack>
            </>
          </Box>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField type="email" id="email-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" fullWidth className={classes.root}></TextField>
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
                type="password"
                id="password-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>

          <Button
            id="login-button"
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
            onClick={submitForm}
          >
            Log In
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
              <u>
                <a href="/newUser">Sign Up?</a>
              </u>
              <u onClick={onReset}>Forgot Password?</u>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default UserLogin;
