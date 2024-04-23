import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  ThemeProvider,
  Form,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Input,
  Container,
  Radio,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  UploadFile,
  CardMedia,
  InputAdornment,
  Checkbox,
} from "@mui/material";

import { withStyles } from "@mui/styles";

import theme from "../../theme/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageUploader from "../ImageUploader";
import dataURItoBlob from "../utils/dataURItoBlob";
import defaultHouseImage from "../Property/defaultHouseImage.png";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleSignup from './GoogleSignup';
import { useCookies } from "react-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { objToQueryString } from "../utils/helper";

import APIConfig from "../../utils/APIConfig";

const CustomTextField = withStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        border: "none",
        '&.Mui-focused fieldset': {
          borderColor: 'transparent', // Remove border when focused
        },
        '&:hover fieldset': {
            borderColor: 'transparent', // Remove border on hover
          },
      },
    },
})(TextField);

// Variable Declaration
export default function ReferralSignup({}) {
  console.log("In ReferralSignup.jsx");  
  let navigate = useNavigate();
  let location = useLocation();
  const { isGoogleSignup, googleUserInfo } = location.state || {};  
  const { user, selectedRole, selectRole, Name, getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const { userID } = useParams();
  console.log("ROHIT - userID from params - ", userID);

  
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState();

  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];

  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    console.log("ROHIT - userInfo - ", userInfo);
  }, [userInfo]);

  // Update userInfo object whenever input values change
  useEffect(() => {
    setUserInfo({
      userID,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
    });
  }, [firstName, lastName, email, phoneNumber, role]);

  const handleFetchBusinesses = async (role) => {
    const url = "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile";
    const args = {
      "business_type": role === "PM_EMPLOYEE" ? "MANAGEMENT" : "MAINTENANCE",
    }
    const response = await axios.get(url+objToQueryString(args));
    setBusinesses(response.data.result);
  };

  const handleBusinessChange = (event) => {
    setSelectedBusiness(event.target.value)
    setUserInfo(prevState => {
      return {
        ...prevState,
        selectedBusiness: event.target.value,
      }
    })
  }
  

  useEffect(() => {
    setShowSpinner(true);
    axios.get(`http://localhost:4000/userInfo/${userID}`).then((res) => { //rohit
    // axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${userIDParam}`).then((res) => {
      const data = res.data?.result[0];
      console.log("ROHIT - userInfo - data - ", data);
      
      setFirstName(data.first_name? data.first_name : "");
      setLastName(data.last_name? data.last_name : "");
      setEmail(data.email? data.email : "");
      setPhoneNumber(data.phone_number? data.phone_number : "");
      setRole(data.role? data.role : "");

      let userObject = {};
      userObject.firstName = data.first_name;
      userObject.lastName = data.last_name;
      userObject.email = data.email;
      userObject.phoneNumber = data.phone_number;
      userObject.role = data.role;
      userObject.userID = userID;      
      if(data.role === "MANAGER" || data.role === "MAINTENANCE"){
        userObject.businessName = data.first_name + " " + data.last_name
      }
      setUserInfo(userObject);

      if(data.role === "PM_EMPLOYEE" || data.role === "MAINT_EMPLOYEE"){
        handleFetchBusinesses(data.role);
      }
      
      setShowSpinner(false);
      setShowWelcomeDialog(true);
    }).catch((error) => {
        if (error.response && error.response.status === 404) {
          // Display alert for user not found
          alert("Error - Referral not found");
        } else {
          // Handle other errors here
          console.error("Error fetching user data:", error);
        }
        setShowSpinner(false);
    });

  }, []);
  
  const handleBackButton = () => {
    console.log("handleBackButton");
    navigate(-1);
  };

  
  //rohit - delete later
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (role.length === 0) {
//       alert("Please select a role");
//       return;
//     }
//     setShowSpinner(true);
//     // const role = roles.join(",");
//     const payload = {
//       "first_name" : firstName,
//       "last_name" : lastName,
//       "phone_number" : phoneNumber,
//       "email": email,
//       "password": `referred by ${getProfileId()}`,
//       "role": role,
//       "isEmailSignup": true,      
//     };
    
//     // setOnboardingState({
//     //   ...onboardingState,
//     //   roles,
//     // });
//     const isEmailSignup = true
//     if (isEmailSignup) {
//       const response = await axios.post(
//         "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
//         payload
//       );
//       if (response.data.message === "User already exists") {
//         alert(response.data.message);
//         return;
//       } else {
//         // setAuthData(response.data.result);
//         setShowSpinner(false);
//         const userUID = response.data.result?.user?.user_uid;
//         console.log("ROHIT - userUID - ", userUID);
//         const link = `localhost:3000/referralSignup/${userUID}`
//         const emailPayload = {
//             "receiver": email,
//             "email_subject": `You have been invited to join ManifestMySpace`,
//             "email_body": message + `Please sign up using the link - ${link? link : "LINK-TO-SIGNUP"}`,
//         }
//         const emailResponse = await axios.post(
//             "http://localhost:4000/sendEmail",
//             emailPayload
//         );


//         // navigate(`/onboardingRouter`, { state: { isPrivate:false } });
//       }
//     } else {
//         console.log("ROHIT - google signup");
//         //google signup
//     //   const response = await axios.post(
//     //     "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE",
//     //     payload
//     //   );
//     //   const userData = response.data;
//     //   if (userData.message === "User already exists") {
//     //     setUserAlreadyExists(!userAlreadyExists);
//     //     return;
//     //   } else {
//     //     setAuthData(response.data.result);
//     //     setShowSpinner(false);
//     //     navigate(`/onboardingRouter`, { state: { isPrivate:false } });
//     //   }
//     }
//   };

  const handleSignup = () => {
    setCookie("default_form_vals", {...cookiesData, firstName, lastName, phoneNumber, email });
    navigate(
        '/referralSignupPassword',
        {
            state: {
                userInfo: userInfo,
                isGoogleSignup: false,                
            }
        }
    );
  }




  return (
    // <ThemeProvider theme={theme}>
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column", // Stack the content vertically
          justifyContent: "flex-start", // Start content at the top
          alignItems: "center", // Center content horizontally
          width: "100%",
          minHeight: "100vh",
          marginTop: theme.spacing(2), // Adjust this for desired distance from the top
          paddingBottom: "50px",
        }}
      >
        <Paper
          style={{
            margin: "30px",
            padding: theme.spacing(2),
            backgroundColor: "#F2F2F2",
            width: "85%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" position="relative">
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                Please Verify Your Information
              </Typography>
            </Box>
            <Box position="absolute" right={0}>
              <Button onClick={() => handleBackButton()}>
                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          </Stack>

          <Stack direction="column" justifyContent="center" alignItems="center" padding="25px">
            <Box
              component="form"
              sx={
                {
                  // '& .MuiTextField-root': { m: 1, width: '25ch' },
                }
              }
              noValidate
              autoComplete="off"
              id="addPropertyForm"
            >
              <Grid container columnSpacing={12} rowSpacing={6}>                                                
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                    First Name
                  </Typography>
                  <CustomTextField
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "none",
                      outline: "none",
                    //   borderColor: "black",
                      borderRadius: "10px",
                      "&:focus-within": {
                        outline: "none",
                        borderColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                    Last Name
                  </Typography>
                  <CustomTextField
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "none",
                      outline: "none",
                    //   borderColor: "black",
                      borderRadius: "10px",
                      "&:focus-within": {
                        outline: "none",
                        borderColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                    Email
                  </Typography>
                  <CustomTextField
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}                    
                    size="small"
                    fullWidth                    
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                    {"Phone Number (Optional)"}
                  </Typography>
                  <CustomTextField
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size="small"
                    fullWidth
                  />
                </Grid>
                
                {
                  (userInfo?.role === "PM_EMPLOYEE" || userInfo?.role === "MAINT_EMPLOYEE") && (
                    <>
                      <Grid item xs={12}>                    
                          <Typography
                            sx={{
                              color: theme.typography.common.blue,
                              // fontWeight: theme.typography.primary.fontWeight,
                            }}
                          >
                            {"Select Business"}
                          </Typography>
                          <Select
                            defaultValue=""
                            value={selectedBusiness}
                            onChange={(e) => handleBusinessChange(e)}
                            size="small"
                            fullWidth
                            sx={{
                              backgroundColor: "#D9D9D9",
                            }}                    
                          >
                            {businesses.map((row, index) => (
                              <MenuItem key={index} value={row}>{row.business_name}</MenuItem>
                            ))}
                          </Select>                    
                        
                      </Grid>
                    </>   
                  )
                }                            
                <Grid item xs={12}>
                    <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        Role
                    </Typography>
                    {/* <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        {role}
                    </Typography> */}
                    <CustomTextField                    
                    disabled
                    value={role}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size="small"
                    fullWidth
                  />                    
                </Grid>                         

                <Grid item xs = {12}>
                    <Stack spacing={-6} m={1}>
                        <Box>
                            <GoogleSignup isReferral={true} userID={userID}/>
                        </Box>   
                    </Stack>                
                </Grid>
                <Grid item xs={12} sx={{
                    margin: '0px',
                }}>
                    <Stack spacing={-1} m={1}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Button 
                                sx={{
                                    background: '#3D5CAC',
                                    color: theme.palette.background.default,
                                    width: `326px`,
                                    height: `60.5px`,
                                    borderRadius: '15px',
                                    fontSize:theme.typography.smallFont,
                                    fontWeight: theme.typography.primary.fontWeight, 
                                }} onClick={()=> handleSignup()}
                            >
                                    Sign Up With Email
                            </Button>
                        </Box>
                    </Stack>                    
                </Grid>
                {
                  isGoogleSignup && (
                    <>
                      <Grid item xs={12} sx={{
                          margin: '0px',
                      }}>
                          <Stack spacing={-1} m={1}>
                              <Box sx={{
                                  display: "flex",
                                  justifyContent: "center",
                              }}>
                                  <Button 
                                      sx={{
                                          background: '#3D5CAC',
                                          color: theme.palette.background.default,
                                          width: `326px`,
                                          height: `60.5px`,
                                          borderRadius: '15px',
                                          fontSize:theme.typography.smallFont,
                                          fontWeight: theme.typography.primary.fontWeight, 
                                      }} onClick={()=> handleSignup()}
                                  >
                                          Continue
                                  </Button>
                              </Box>
                          </Stack>                    
                      </Grid>
                    </>
                  )
                }
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Stack>
      <Dialog open={showWelcomeDialog} onClose={() => setShowWelcomeDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">Referral Sent</DialogTitle> */}
        <DialogContent>                
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Hello, {firstName}!. Welcome to ManifestMySpace. Please verify your information and create a password to finish setting up your profile or sign up using your Google account. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => setShowWelcomeDialog(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            OK
          </Button>          
        </DialogActions>
      </Dialog>
      </>
    // </ThemeProvider>
  );
}
