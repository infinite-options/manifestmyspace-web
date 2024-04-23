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

import {
  formatPhoneNumber,
  headers,
  maskNumber,
  roleMap,
  photoFields,
} from "./helper";

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

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
let SCOPES =
  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile ";


// Variable Declaration
export default function ReferralGoogleSignup({}) {
  console.log("In ReferralSignup.jsx");  
  let navigate = useNavigate();
  let location = useLocation();
  const { googleUserInfo } = location.state || {};  
  const { user, selectedRole, selectRole, Name, getProfileId, updateProfileUid, setAuthData, setLoggedIn, } = useUser();
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
  let profileID = null;

  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];

  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  const [accessToken, setAccessToken] = useState("");
  const [userDoesntExist, setUserDoesntExist] = useState(false);
  const [socialId, setSocialId] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessExpiresIn, setAccessExpiresIn] = useState("");

  let codeClient = {};
  function getAuthorizationCode() {
    // Request authorization code and obtain user consent,  method of the code client to trigger the user flow
    codeClient.requestCode();
  }

  const socialGoogle = async (e, u) => {
    setShowSpinner(true);
    setAuthData(u);
    const { role } = u.user;
    const openingRole = role.split(",")[0];
    selectRole(openingRole);
    setLoggedIn(true);
    const { dashboardUrl } = roleMap[openingRole];
    navigate(dashboardUrl);
    setShowSpinner(false);
  };

  useEffect(() => {
    /* global google */
    if(google) {
    codeClient = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        // gets back authorization code
        if (tokenResponse && tokenResponse.code) {
          let auth_code = tokenResponse.code;
          let authorization_url = "https://accounts.google.com/o/oauth2/token";

          var details = {
            code: auth_code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirectUri: "postmessage",
            grant_type: "authorization_code",
          };
          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
          // use authorization code, send it to google endpoint to get back ACCESS TOKEN n REFRESH TOKEN
          fetch(authorization_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formBody,
          })
            .then((response) => {
              return response.json();
            })

            .then((data) => {
              let at = data["access_token"];
              let rt = data["refresh_token"];
              let ax = data["expires_in"];
              //  expires every 1 hr
              setAccessToken(at);
              // stays the same and used to refresh ACCESS token
              setRefreshToken(rt);
              setAccessExpiresIn(ax);
              //  use ACCESS token, to get email and other account info
              axios
                .get(
                  "https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" +
                    at
                )
                .then((response) => {
                  let data = response.data;

                  let e = data["email"];
                  let si = data["id"];

                  setEmail(e);

                  setSocialId(si);

                  axios
                    .get(
                      `https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialLogin/MYSPACE/${e}`
                    )
                    .then(({ data }) => {
                      if (
                        data["message"] === "Email ID doesnt exist"
                      ) {
                        const socialGoogle = async () => {
                          const user = {
                            email: e,
                            password: GOOGLE_LOGIN,
                            first_name: data["given_name"],
                            last_name: data["family_name"],
                            google_auth_token: at,
                            google_refresh_token: rt,
                            social_id: si,
                            access_expires_in: ax,
                          };
                          navigate("/register", {
                            state: {
                              user: user,
                            },
                          });
                        };
                        socialGoogle();
                        return;
                      } else if (
                        data["message"] === "Login with email"
                      ) {
                        alert(data["message"]);
                      } else {
                        let user = data.result;
                        let user_id = data.result.user.user_uid;
                        setAccessToken(at);
                        let url = `https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateAccessToken/MYSPACE/${user_id}`;
                        axios
                          .post(url, {
                            google_auth_token: at,
                          })
                          .then((response) => {
                            socialGoogle(email, user);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                        return accessToken;
                      }
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
              return (
                accessToken, refreshToken, accessExpiresIn, email, socialId
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
    });
    }
  }, [getAuthorizationCode]);

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

  const getDetailsAfterGoogleSignup = () => {
    setShowSpinner(true);
    axios.get(`http://localhost:4000/userInfo/${userID}`).then((res) => { //rohit
    // axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${userID}`).then((res) => {
      const data = res.data?.result[0];
      console.log("ROHIT - userInfo - data - ", data);
      console.log("ROHIT - googleUserInfo - data - ", googleUserInfo);
      
      setFirstName(googleUserInfo?.first_name);
      setLastName(googleUserInfo?.last_name);
      setEmail(googleUserInfo?.email);
      setPhoneNumber(data.phone_number? data.phone_number : "");
      setRole(data.role? data.role : "");
  
      let userObject = {};
      
      userObject.firstName = googleUserInfo.first_name;
      userObject.lastName = googleUserInfo.last_name;
      userObject.email = googleUserInfo.email;
      if(data.role === "MANAGER" || data.role === "MAINTENANCE"){
        userObject.businessName = googleUserInfo.first_name + " " + googleUserInfo.last_name
      }        
      
      userObject.phoneNumber = data.phone_number;
      userObject.role = data.role;
      userObject.userID = userID;

      userObject.access_expires_in = googleUserInfo.access_expires_in;
      userObject.google_auth_token = googleUserInfo.google_auth_token;
      userObject.google_refresh_token = googleUserInfo.google_refresh_token;
      userObject.password = googleUserInfo.password;
      userObject.social_id = googleUserInfo.social_id;

            
      setUserInfo(userObject);
  
      if(data.role === "PM_EMPLOYEE" || data.role === "MAINT_EMPLOYEE"){
        handleFetchBusinesses(data.role);
      }
      
      setShowSpinner(false);
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
  };
  

  useEffect(() => {
    setShowSpinner(true);
    getDetailsAfterGoogleSignup();
  }, []);
  
  const handleBackButton = () => {
    console.log("handleBackButton");
    navigate(-1);
  };

  const handleContinue = async () => {
    setCookie("default_form_vals", {...cookiesData, firstName, lastName, phoneNumber, email });
    setShowSpinner(true);    
        
    selectRole(userInfo.role);        

    const payload = {
      "user_uid": userInfo.userID,
      "first_name" : userInfo.firstName,
      "last_name" : userInfo.lastName,
      "phone_number" : userInfo.phoneNumber,
      "email": userInfo.email,      
      "role": userInfo.role,
      "google_auth_token": userInfo.google_auth_token,
      "google_refresh_token": userInfo.google_refresh_token,
      "social_id": userInfo.social_id,
      "access_expires_in": userInfo.access_expires_in,
      "password": userInfo.password,           
    };
    
    
    // const response = await axios.put(
    //   "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
    //   payload
    // );
    //rohit
    const response = await axios.put(
      "http://localhost:2000/api/v2/UserSocialSignUp/MYSPACE", //rohit
      payload
    );        

    if (response.data.message === "User details updated") {                


      // setAuthData(response.data.result);
      // setLoggedIn(true);
      // selectRole(userInfo.role);
      // const { role } = response.data.result.user;
      // const openingRole = role.split(",")[0];      
      // const { dashboardUrl } = roleMap[openingRole];
      // localStorage.setItem('signedUpWithReferral', 'true');                      
      // navigate(dashboardUrl); //rohit - uncomment        
      // // navigate(`/onboardingRouter`, { state: { isPrivate:false } }); // rohit - navigate to dashboard


      if(userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" || userInfo.role === "OWNER" || userInfo.role === "TENANT"){ 
        await createProfile();
      }
      if(userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" || userInfo.role === "PM_EMPLOYEE" || userInfo.role === "MAINT_EMPLOYEE"){ 
        await createEmployee();
      }
      getAuthorizationCode();
      // navigate(`/onboardingRouter`, { state: { isPrivate:false } });        //rohit 
    } else {
      
      alert(response.data.message);        
      // return;
            
    }
    setShowSpinner(false);
  
    
  }

  const getProfilePayload = (type) => {
    switch (type) {
      case "MANAGER":
        return {
          business_user_id: userInfo.userID,
          business_type: "MANAGEMENT",
          business_name: userInfo.businessName,          
          business_phone_number: userInfo.phoneNumber,
          business_email: userInfo.email,          
        };
      case "MAINTENANCE":
        return {
          business_user_id: userInfo.userID,
          business_type: "MAINTENANCE",
          business_name: userInfo.businessName,          
          business_phone_number: userInfo.phoneNumber,
          business_email: userInfo.email,          
        };
      case "OWNER":
        return {
          owner_user_id: userInfo.userID,
          owner_first_name: userInfo.firstName,
          owner_last_name: userInfo.lastName,
          owner_phone_number: userInfo.phoneNumber,
          owner_email: userInfo.email,          
        };
      case "TENANT":
        return {
          tenant_user_id: userInfo.userID,
          tenant_first_name: userInfo.firstName,
          tenant_last_name: userInfo.lastName,
          tenant_phone_number: userInfo.phoneNumber,
          tenant_email: userInfo.email,          
        };
      default:
        throw new Error("Invalid profile type");
    }
  };


  const encodeForm = (payload) => {
    const form = new FormData();
    for (let key in payload) {      
      form.append(key, payload[key]);      
    }
    return form;
  };  

  const createProfile = async () => {
    console.log("ROHIT - in createProfile ");
    setShowSpinner(true);
    const payload = getProfilePayload(userInfo?.role);
    const form = encodeForm(payload);
    console.log("ROHIT - profile form data - ");
    for (var pair of form.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    const { profileApi } = roleMap[userInfo.role];
    const { data } = await axios.post(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev${profileApi}`,
      form,
      headers
    );
    // const data = await createProfile(form, selectedRole);

    if (data.owner_uid) {
      updateProfileUid({ owner_id: data.owner_uid });
    }
    if (data.tenant_uid) {
      updateProfileUid({ tenant_id: data.tenant_uid });
    }
    if (data.business_uid) {
      updateProfileUid({ business_uid: data.business_uid });
      setUserInfo(prevState => {
        return {...prevState, businessID: data.business_uid};
      })
      profileID = data.business_uid;

    }
    
    // const { dashboardUrl } = roleMap[userInfo.role]
    // console.log("ROHIT - ReferralSignupPassword - navigating to - ", dashboardUrl);
    // // navigate(dashboardUrl);
    setShowSpinner(false);
  };

  const createEmployee = async () => {
    //rohit - from PersonalInfo.js
    setShowSpinner(true);
    const payload = {
      employee_user_id: userInfo.userID,
      employee_business_id: (userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" ) ? profileID : userInfo?.selectedBusiness?.business_uid,
      employee_first_name: userInfo.firstName,
      employee_last_name: userInfo.lastName,
      employee_phone_number: userInfo.phoneNumber,
      employee_email: userInfo.email,
      employee_role: (userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" ) ? "OWNER" : "EMPLOYEE",      
    };
    




    const formPayload = new FormData();
    for (const key of Object.keys(payload)) {
      formPayload.append(key, payload[key]);
    }
    const { data } = await axios.post(
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee",
      formPayload,
      headers
    );
    // setCookie("default_form_vals", {...cookiesData, firstName, lastName, phoneNumber, email, address, unit, city, state, zip });
    // handleUpdateProfileUid(data);
    // if (selectedRole==='PM_EMPLOYEE')
    //   await add_supervisor()
    // setShowSpinner(false);
    // if (isEmployee())
    //   navigate(profilePage, { state: { profileId: businessId } });
    // else navigate(onBoaringPage );
  };

  const login = async () => {
    axios
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/AccountSalt/MYSPACE", {
        email: userInfo.email,
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
              let saltedPassword = password1 + salt;
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
                  email: userInfo.email,
                  password: hashedPassword,
                };
                console.log(JSON.stringify(loginObject));
                axios
                  // .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/Login/MYSPACE", loginObject) //rohit
                  .post("http://localhost:2000/api/v2/Login/MYSPACE", loginObject)
                  .then((response) => {
                    console.log(response.data.message);
                    const { message, result } = response.data;
                    if (message === "Incorrect password") {
                      alert(response.data.message);
                      setShowSpinner(false);
                    } else if (message === "Email doesn't exist") {
                      // setUserDoesntExist(true);
                      setShowSpinner(false);
                    } else if (message === "Login successful") {
                      setAuthData(result);
                      const { role } = result.user;
                      const openingRole = role.split(",")[0];
                      selectRole(openingRole);
                      setLoggedIn(true);
                      const { dashboardUrl } = roleMap[openingRole];
                      localStorage.setItem('signedUpWithReferral', 'true');                      
                      // navigate(dashboardUrl); //rohit - uncomment
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
          // setUserDoesntExist(true);
          setShowSpinner(false);
        }
      });
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
                                }} onClick={()=> handleContinue()}
                            >
                                    Continue
                            </Button>
                        </Box>
                    </Stack>                    
                </Grid>                 
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