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
import {
  formatPhoneNumber,
  headers,
  maskNumber,
  roleMap,
  photoFields,
} from "./helper";


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
export default function ReferralSignupPassword({}) {  
  
  console.log("In ReferralSignupPassword.jsx");  
  let navigate = useNavigate();
  let location = useLocation();  
  const { selectedRole, selectRole, Name, getProfileId, updateProfileUid, setLoggedIn, } = useUser();  
  const { setAuthData, onboardingState, setOnboardingState } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);

    
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  let profileID = null;
  const isGoogleSignup = location.state.isGoogleSignup;
  console.log("ROHIT - isGoogleSignup - ", isGoogleSignup);
  selectRole(location.state.userInfo.role);
  
  useEffect(() => {
    setUserInfo(location.state.userInfo);
  }, []);

  // console.log("ROHIT - selectedRole - ", selectedRole);

  // console.log("ROHIT - ReferralSignupPassword -  location.state.userInfo - ", location.state.userInfo);

  useEffect(() => {
    console.log("ROHIT - ReferralSignupPassword - userInfo - ", userInfo);
  }, [userInfo]);


  // // Update userInfo object whenever password  changes
  // useEffect(() => {
  //   setUserInfo({
  //     ...userInfo,
  //     password: password1
  //   });
  // }, [password1]);

  // useEffect(() => {
  //   setShowSpinner(true);
  //   axios.get(`http://localhost:4000/userInfo/${userID}`).then((res) => { //rohit
  //   // axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${userIDParam}`).then((res) => {
  //     const data = res.data?.result[0];
  //     console.log("ROHIT - userInfo - data - ", data);
      
  //     setFirstName(data.first_name? data.first_name : "");
  //     setLastName(data.last_name? data.last_name : "");
  //     setEmail(data.email? data.email : "");
  //     setPhoneNumber(data.phone_number? data.phone_number : "");
  //     setRole(data.role? data.role : "");

  //     let userObject = {};
  //     userObject.firstName = data.first_name;
  //     userObject.lastName = data.last_name;
  //     userObject.email = data.email;
  //     userObject.phoneNumber = data.phone_number;
  //     userObject.role = data.role;
  //     setUserInfo(userObject);
      
  //     setShowSpinner(false);
  //   }).catch((error) => {
  //       if (error.response && error.response.status === 404) {
  //         // Display alert for user not found
  //         alert("Error - Referral not found");
  //       } else {
  //         // Handle other errors here
  //         console.error("Error fetching user data:", error);
  //       }
  //       setShowSpinner(false);
  //   });

  // }, []);
  
  const handleBackButton = () => {
    console.log("handleBackButton");
    navigate(-1);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(password1 === ""){
      alert("Please enter a password");
      return;
    }
    if(password1 !== password2){
      alert("Passwords do not match!")
      return;
    }
    
    setShowSpinner(true);
    // const role = roles.join(",");
    
    
    const roles = [userInfo.role]
    selectRole(userInfo.role);        
    // setOnboardingState({
    //   ...onboardingState,
    //   roles,
    // });
    const payload = {
      "user_uid": userInfo.userID,
      "first_name" : userInfo.firstName,
      "last_name" : userInfo.lastName,
      "phone_number" : userInfo.phoneNumber,
      "email": userInfo.email,
      "password": password1,
      "role": userInfo.role,
      "isEmailSignup": true,      
    };
    // const isEmailSignup = true
    if (!isGoogleSignup) {
      // const response = await axios.put(
      //   "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
      //   payload
      // );
      //rohit
      const response = await axios.put(
        "http://localhost:2000/api/v2/CreateAccount/MYSPACE",
        payload
      );
      if (response.data.message === "User details updated") {
        // setAuthData(response.data.result);
        // setLoggedIn(true);
        // selectRole(userInfo.role);        
        if(userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" || userInfo.role === "OWNER" || userInfo.role === "TENANT"){ 
          await createProfile();
        }
        if(userInfo.role === "MANAGER" || userInfo.role === "MAINTENANCE" || userInfo.role === "PM_EMPLOYEE" || userInfo.role === "MAINT_EMPLOYEE"){ 
          await createEmployee();
        }
        await login();
        // navigate(`/onboardingRouter`, { state: { isPrivate:false } });        //rohit 
      } else {
        
        alert(response.data.message);        
        // return;
              
      }
      setShowSpinner(false);
    } else {
        console.log("ROHIT - google signup");
        //google signup
    //   const response = await axios.post(
    //     "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE",
    //     payload
    //   );
    //   const userData = response.data;
    //   if (userData.message === "User already exists") {
    //     setUserAlreadyExists(!userAlreadyExists);
    //     return;
    //   } else {
    //     setAuthData(response.data.result);
    //     setShowSpinner(false);
    //     navigate(`/onboardingRouter`, { state: { isPrivate:false } });
    //   }
    }
  };

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
                Please Enter a Password
              </Typography>
            </Box>
            <Box position="absolute" right={0}>
              <Button onClick={() => handleBackButton()}>
                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          </Stack>

          <Stack direction="column" justifyContent="center" alignItems="center" padding="25px" onSubmit={handleSubmit}>
            <Box
              component="form"
              sx={
                {
                  // '& .MuiTextField-root': { m: 1, width: '25ch' },
                }
              }
              noValidate
              autoComplete="off"
              id="signupForm"
            >
              <Grid container columnSpacing={12} rowSpacing={6}>                                                                              

                    

                <Grid item xs={12}>
                    <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        Password
                    </Typography>
                    {/* <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        {role}
                    </Typography> */}
                    <CustomTextField
                        onChange={(e) => setPassword1(e.target.value)}
                        value={password1}
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
                        Confirm Password
                    </Typography>
                    {/* <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        {role}
                    </Typography> */}
                    <CustomTextField
                        onChange={(e) => setPassword2(e.target.value)}
                        value={password2}
                        sx={{
                        backgroundColor: "#D9D9D9",
                        borderColor: "black",
                        borderRadius: "7px",
                        }}
                        size="small"
                        fullWidth
                    />                   
                </Grid> 

                
                
              </Grid>
            </Box>
          </Stack>
        </Paper>
        {/* Submit Button */}
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
            noValidate
            autoComplete="off"
          >
            <Grid container columnSpacing={12} rowSpacing={6} sx={{ display: "flex" }}>
              <Grid item xs={12}>
                <Button variant="contained" type="submit" form="signupForm" sx={{ backgroundColor: "#9EAED6", "&:hover, &:focus, &:active": { background: "#9EAED6" } }}>
                  <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Signup
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Stack>
      </>
    // </ThemeProvider>
  );
}