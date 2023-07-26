import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {TextField, Button, Divider, IconButton, InputAdornment, Alert, Collapse} from "@mui/material";
import {Visibility, VisibilityOff, Close} from "@mui/icons-material";
import AppContext from "../../AppContext";
import { post } from "../utils/api";
import '../../css/tenant-signup.css';
function SignIn() {
    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const haveAccount = () => {
        navigate("/login");
      };
    const handleCloseAlert = () => {
        setErrorMessage("");
      };
      const handleCloseAlertSuccess = () => {
        setSuccessMessage("");
      };
      const submitForm = async () => {
        console.log('here');
        if (
          email === "" ||
          password === "" ||
          confirmPassword === "" ||
          firstName === "" ||
          lastName === "" ||
          phoneNumber === ""
        ) {
            console.log(email,password,confirmPassword, firstName, lastName, phoneNumber);
            setErrorMessage("Please fill out all fields");
            return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("Passwords must match");
          return;
        } else if (password === confirmPassword) {
          setErrorMessage("");
        }
        const user = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: email,
            password: password,
        };
        const response = await post("/users", user);
        if (response.message === "User already exists") {
            setErrorMessage(response.message);
            return;
        } else {
          if (response.code !== 200) {
            setErrorMessage(response.message);
            return;
            // add validation
          }
          else {
            setErrorMessage("");
            setSuccessMessage("Sign Up successful!")

          }
        //   context.updateUserData(response.result);
          // save to app state / context
        //   setShowSpinner(false);
        //   props.onConfirm();
        }
      };
    return (
        <div className="ten-sign-up">
            <Collapse in={!!errorMessage}>
                    <Alert
                    severity="error"
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleCloseAlert}
                        >
                            <Close fontSize="inherit" />
                        </IconButton>
                        }
                    >
                        {errorMessage}
                    </Alert>
                </Collapse>
                <Collapse in={!!successMessage}>
                    <Alert
                    severity="success"
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleCloseAlertSuccess}
                        >
                            <Close fontSize="inherit" />
                        </IconButton>
                        }
                    >
                        {successMessage}
                    </Alert>
                </Collapse>
            <div className="ten-portal-title-info">
                <h2 className="ten-portal-title"> Resident Portal</h2>
            </div>
            <Divider variant="middle"></Divider>
            <br/>
            <div className="ten-portal-details">
                <div className="login-title-info">
                    <h3 className="login-title"> Register </h3>
                </div>
                <div className="email-info">
                    <TextField 
                        required
                        id="fname" 
                        label="First Name" 
                        variant="outlined"
                        size="small"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="email-info">
                    <TextField 
                        required
                        id="lname" 
                        label="Last Name" 
                        variant="outlined"
                        size="small"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="email-info">
                    <TextField 
                        required
                        id="email" 
                        label="Phone Number" 
                        variant="outlined"
                        size="small"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="email-info">
                    <TextField 
                        required
                        id="email" 
                        label="Email" 
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="password-info">
                    <TextField
                        required
                        type={showPassword ? "text" : "password"}
                        id="password" 
                        label="Password" 
                        variant="outlined"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword} edge="end">
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="re-password-info">
                    <TextField
                        required
                        type={showPassword ? "text" : "password"}
                        id="re-password" 
                        label="Re Enter Password" 
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword} edge="end">
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        InputLabelProps={{
                            style: {fontSize: 12, fontFamily: 'Source Sans Pro'}
                        }}
                    />
                </div>
                <br/>
                <br/>
                <div className="login-button-info">
                    <Button id="login" variant="contained" size="medium" fullWidth onClick={submitForm}>Sign Up</Button>
                </div>
                <br/>
                <br/>
                <div className="other-info">
                    <Button variant='text' id="account-text" onClick={haveAccount}> Already have an account?</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant='text' id="login-text" onClick={haveAccount}> Log In?</Button>
                </div>
                

            </div>
            <br/>
            <br/>
        </div>
    );

};
export default SignIn;