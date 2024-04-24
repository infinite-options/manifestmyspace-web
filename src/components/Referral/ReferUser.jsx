import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { formatPhoneNumber } from "../Onboarding/helper";


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
export default function ReferUser({}) {
  console.log("In ReferUser.jsx");
  const location = useLocation();
//   const { property_endpoint_resp } = location.state;
  // console.log(property_endpoint_resp);
  let navigate = useNavigate();  
  const { user, selectedRole, selectRole, Name, getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);

  
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  
  const handleBackButton = () => {
    console.log("handleBackButton");
    navigate(-1);
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (role.length === 0) {
      alert("Please select a role");
      return;
    }
    setShowSpinner(true);
    // const role = roles.join(",");
    const payload = {
      "first_name" : firstName,
      "last_name" : lastName,
      "phone_number" : phoneNumber,
      "email": email,
      "password": `referred by ${getProfileId()}`,
      "role": role,
      "isEmailSignup": true,      
    };
    
    // setOnboardingState({
    //   ...onboardingState,
    //   roles,
    // });
    const isEmailSignup = true
    if (isEmailSignup) {
      const response = await axios.post(
        "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
        payload
      );
      if (response.data.message === "User already exists") {
        alert(response.data.message);
        setShowSpinner(false);
        return;
      } else {
        // setAuthData(response.data.result);        
        const userUID = response.data.result?.user?.user_uid;        
        // const link = `http://localhost:3000/referralSignup/${userUID}`
        const link = `https://iopropertymanagement.netlify.app/referralSignup/${userUID}`
        
        const emailPayload = {
            "receiver": email,
            "email_subject": `You have been invited to join ManifestMySpace`,
            "email_body": message + ` Please sign up using the link - ${link}. Don't forget to verify your profile information and create a password to finish setting up your profile. You can also sign up using your Google Account.`,
        }
        const emailResponse = await axios.post(
            "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/sendEmail",
            emailPayload
        );

        if(emailResponse.status === 200){
          setShowEmailSentDialog(true);
        }

        setShowSpinner(false);

        // navigate(-1);
      }
    }
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
                Please Enter Their Information
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
              id="addPropertyForm"
            >
              <Grid container columnSpacing={12} rowSpacing={6}>                                                
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                    First Name
                  </Typography>
                  <CustomTextField
                    onChange={(e) => setFirstName(e.target.value)}
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
                  {/* <CustomTextField
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={{
                      backgroundColor: "#D9D9D9",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size="small"
                    fullWidth
                  /> */}
                  <CustomTextField
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(formatPhoneNumber(e.target.value))
                    }
                    // placeholder="Phone Number"
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
                        Message
                    </Typography>
                    <CustomTextField
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{
                            backgroundColor: "#D9D9D9",
                            borderColor: "black",
                            borderRadius: "7px",
                        }}
                        size="small"
                        fullWidth
                        multiline   // Set multiline to true
                        rows={4}    // Set the number of rows you want
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont }}>
                        Role
                    </Typography>
                    <RadioGroup
                        aria-label="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{
                            flexDirection: 'column', 
                        }}
                    >
                        <FormControlLabel value="MANAGER" control={<Radio />} label="Property Manager" />                                            
                        <FormControlLabel value="PM_EMPLOYEE" control={<Radio />} label="Property Manager - Employee" />                                            
                        <FormControlLabel value="MAINTENANCE" control={<Radio />} label="Maintenance" />
                        <FormControlLabel value="MAINT_EMPLOYEE" control={<Radio />} label="Maintenance - Employee" />
                        <FormControlLabel value="OWNER" control={<Radio />} label="Owner" />                        
                        <FormControlLabel value="TENANT" control={<Radio sx={{ color: "#3D5CAC", '&:checked': { color: "#3D5CAC" }, '&:active': { color: "#3D5CAC" } }} />} label="Tenant" />                                                
                    </RadioGroup>
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
              flexDirection: "column",
            }}
            noValidate
            autoComplete="off"
          >
            <Grid container columnSpacing={12} rowSpacing={6} sx={{ display: "flex", paddingBottom: "20px", }}>
              <Grid item xs={12}>
                <Button variant="contained" type="submit" form="addPropertyForm" sx={{ width: "300px", backgroundColor: "#9EAED6", "&:hover, &:focus, &:active": { background: "#9EAED6" } }}>
                  <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Send Referral
                  </Typography>
                </Button>
              </Grid>
              
            </Grid>
            {
              (selectedRole === "MANAGER" || selectedRole === "MAINTENANCE") && (
                <Grid container columnSpacing={12} rowSpacing={6} sx={{ display: "flex" }}>
                  <Grid item xs={12}>
                    <Button variant="contained" sx={{ width: "300px", backgroundColor: "#9EAED6", "&:hover, &:focus, &:active": { background: "#9EAED6" } }} onClick={() => navigate("/employeeAccess")}>
                      <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                        Employee Access
                      </Typography>
                    </Button>
                  </Grid>
                  
                </Grid>
              )
            }
            
          </Box>
        </Stack>
      </Stack>
      <Dialog open={showEmailSentDialog} onClose={() => setShowEmailSentDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Referral Sent</DialogTitle>
        <DialogContent>                
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Thank you for referring a new user to ManifestMySpace. An email has been sent to the user with a link to Sign Up.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => setShowEmailSentDialog(false)}
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
