import React, { useState, useEffect } from "react";
import { Box, Stack, ThemeProvider, Button, Typography, Grid, Paper, Container, Toolbar, OutlinedInput } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { roleMap } from "./helper";
import ManifestWhite from "../../images/onboarding/manifest_white.png";
import Owners from "../../images/onboarding/Owner_AllProperties.png";
import Tenants from "../../images/onboarding/Tenant_FindProperty.png";
import Maintenance from "../../images/onboarding/Maintenance_StatusWheel.png";
import Manager from "../../images/onboarding/Manager_AllProperties.png";
import { darken } from "@mui/system";
import { lighten } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import GoogleLogin from "./GoogleLogin";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import PasswordModal from "./PasswordModal";
import UserDoesNotExistModal from "./UserDoesNotExistModal";

export default function LandingPage() {
  // console.log("In Landing Page");
  const navigate = useNavigate();
  const { setAuthData, setLoggedIn, selectRole } = useUser();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const roleTextStyling = { color: "#160449", fontSize: isMobile ? 22 : 30, fontWeight: 700, textAlign: "center" };
  const useCaseTextStyling = { color: "#160449", fontSize: isMobile ? 16 : 18, fontWeight: 600 };

  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [userDoesntExist, setUserDoesntExist] = useState(false);
  const [passModal, setpassModal] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (location.state && typeof location.state.showLogin !== "undefined") {
      setShowLogin(location.state.showLogin);
    } else {
      setShowLogin(false);
    }
    setShowEmailLogin(false);
  }, [location.state]);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Please fill out all fields");
      return;
    }
    // setShowSpinner(true);
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
                      // setShowSpinner(false);
                    } else if (message === "Email doesn't exist") {
                      setUserDoesntExist(true);
                      // setShowSpinner(false);
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
          // setShowSpinner(false);
        }
      });
  };

  const onReset = async () => {
    if (email === "") {
      alert("Please enter an email");
      return;
    }
    // setShowSpinner(true);
    axios
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/SetTempPassword/MYSPACE", {
        email: email,
      })
      .then((response) => {
        if (response.data.message === "A temporary password has been sent") {
          // setShowSpinner(false);
          setPasswordModalOpen(true);
        }
        if (response.data.code === 280) {
          console.log(response);
          alert("No account found with that email.");
          return;
        }
      });
  };

  const onCancel = () => {
    setPasswordModalOpen(false);
  };

  const onCancelModal = () => {
    setUserDoesntExist(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Box
              sx={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                width: "100%",
                height: "100%",
              }}
            >
              <Stack sx={{ padding: "25px 25px 25px 25px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: isMobile ? 28 : 48,
                    fontWeight: 800,
                  }}
                >
                  Your <u>Complete</u> Property Management Solution
                </Typography>
                {!showLogin && (
                  <Stack spacing={8} direction='column'>
                    <Button
                      sx={{
                        // width: isMobile ? "100%" : "80%",
                        width: "100%",
                        alignContent: "center",
                        alignItems: "center",
                        background: "#3D5CAC",
                        color: theme.palette.background.default,
                        "&:hover": {
                          backgroundColor: lighten("#3D5CAC", 0.3),
                        },
                      }}
                      onClick={() => navigate("/newUser")}
                      variant='contained'
                    >
                      <Typography sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700 }}>Get Started</Typography>
                    </Button>
                    <Button
                      sx={{
                        // width: isMobile ? "100%" : "80%",
                        width: "100%",
                        alignContent: "center",
                        alignItems: "center",
                        background: "#FFFFFF",
                        color: theme.palette.background.default,
                        "&:hover": {
                          backgroundColor: darken("#FFFFFF", 0.3),
                        },
                        borderColor: "#000000",
                        borderWidth: "3px",
                      }}
                      // onClick={() => navigate("/returningUser")}
                      onClick={() => setShowLogin(true)}
                      variant='contained'
                    >
                      <Typography sx={{ color: "#160449", fontSize: 18, fontWeight: 700 }}>Login</Typography>
                    </Button>
                  </Stack>
                )}

                {showLogin && (
                  <Stack spacing={8} direction='column' sx={{ marginTop: "20px" }}>
                    {!showEmailLogin && (
                      <>
                        <Box>
                          <GoogleLogin />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                          <Button
                            onClick={() => setShowEmailLogin(true)}
                            sx={{
                              width: "350px",
                              height: "57px",
                              borderRadius: "5px",
                              fontSize: "16px",
                              backgroundColor: "#F2F2F2",
                              textTransform: "none",
                              color: "#000000",
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: "#3D5CAC",
                                color: "#FFFFFF",
                              },
                              marginTop: "10px",
                            }}
                          >
                            {"Login with Email"}
                          </Button>
                        </Box>
                      </>
                    )}
                    {showEmailLogin && (
                      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <OutlinedInput
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id='filled-basic'
                          variant='filled'
                          placeholder='Enter Email Address'
                          sx={{ marginTop: "5px", width: "350px", backgroundColor: "#F2F2F2" }}
                        />
                        <OutlinedInput
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id='filled-basic'
                          variant='filled'
                          placeholder='Enter Password'
                          sx={{ marginTop: "5px", width: "350px", backgroundColor: "#F2F2F2" }}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton aria-label='toggle password visibility' onClick={() => setShowPassword((show) => !show)} edge='end'>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <Button
                          onClick={handleLogin}
                          sx={{
                            width: "350px",
                            height: "57px",
                            borderRadius: "5px",
                            fontSize: "16px",
                            backgroundColor: "#3D5CAC",
                            textTransform: "none",
                            color: "#FFFFFF",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#160449",
                              color: "#FFFFFF",
                            },
                            marginTop: "10px",
                          }}
                        >
                          Login
                        </Button>
                        <Box
                          onClick={onReset}
                          sx={{
                            marginTop: "10px",
                          }}
                        >
                          <Typography
                            sx={{
                              justifySelf: "center",
                              color: theme.typography.common.default,
                              fontWeight: theme.typography.light.fontWeight,
                              fontSize: theme.typography.primary.smallFont,
                            }}
                          >
                            <u>Forgot Password?</u>
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ order: { xs: -1, sm: 0 }, display: "flex" }}>
            <Box sx={{}} width='100%' height='100%'>
              <img src={ManifestWhite} width='100%' />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ height: isMobile ? "10vh" : "10vh" }}></Box>
            <Stack
              sx={{
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={roleTextStyling}>View Common Use Cases</Typography>
              <ArrowDownwardIcon />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Property Owners</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Owners} width='100%' alt='owners view' />
                </Box>
                <Typography sx={useCaseTextStyling} component='div'>
                  <ul>
                    <li>Monitor rent payments</li>
                    <li>Track maintenance requests</li>
                    <li>View/edit property details</li>
                    <li>Track property cashflow</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Tenants</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Tenants} width='100%' alt='tenants view' />
                </Box>
                <Typography sx={useCaseTextStyling} component='div'>
                  <ul>
                    <li>View new properties</li>
                    <li>Pay rent on time</li>
                    <li>Manage maintenance requests</li>
                    <li>Review and sign documents</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Property Managers</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Manager} width='100%' alt='property manager view' />
                </Box>
                <Typography sx={useCaseTextStyling} component='div'>
                  <ul>
                    <li>Manager your clients, tenants, and personnel</li>
                    <li>See property cashflow</li>
                    <li>Track maintenance requests</li>
                    <li>View/Edit property details</li>
                    <li>View owner "happiness"</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Maintenance Professionals</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Maintenance} width='100%' alt='maintenance view' />
                </Box>
                <Typography sx={useCaseTextStyling} component='div'>
                  <ul>
                    <li>View quote requests</li>
                    <li>See past jobs and schedule more</li>
                    <li>Complete tickets</li>
                    <li>Create invoices and get paid</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <PasswordModal isOpen={passwordModalOpen} onCancel={onCancel} />
      <UserDoesNotExistModal isOpen={userDoesntExist} onCancel={onCancelModal} email={email} />
    </ThemeProvider>
  );
}
