import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {TextField, Button, Divider, IconButton, InputAdornment, Collapse, Alert} from "@mui/material";
import {Visibility, VisibilityOff, Close} from "@mui/icons-material";
import AppContext from '../../AppContext';
import { post } from "../utils/api";
import '../../css/tenant-login.css';
function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] =  useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const [userData, setUserData] = useState("");
    // const { userData, updateUserData, timeLoggedIn, setTimeLoggedIn } =
    const x = useContext(AppContext);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleCloseAlert = () => {
        setErrorMessage("");
    };
    const handleCloseAlertSuccess = () => {
        setSuccessMessage("");
    };
    
    const submitSignInForm = async () => {
        console.log(x);
        if (email === "" || password === "") {
          setErrorMessage("Please fill out all fields");
          return;
        }
        const user = {
          email: email,
          password: password,
        };
        const response = await post("/login", user);
        if (response.code !== 200) {
          setErrorMessage(response.message);
          setShowSpinner(false);
          return;
        } else {
            setSuccessMessage("Login Successful!")
        }
        console.log(JSON.stringify( response.result.user));
        console.log(typeof response.result.user);
        // setTimeLoggedIn(new Date().toLocaleString());
        setUserData(JSON.stringify( response.result.user));
        setShowSpinner(false);
        // save to app state / context
        // setLoginStage("ROLE");
      };

      const onReset = async () => {
        const response = await post("/set_temp_password", { email: email });
    
        if (response.message === "A temporary password has been sent") {
          // console.log(response);
        //   setpassModal(true);
        } else if (response.code === 280) {
          // console.log(response);
          alert("No account found with that email.");
        }
      };

      const goToSignUp = () => {
        navigate("/signup");
      }
    return (
        <div className="ten-sign-in">
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
            <div className="ten-portal-detail">
                <div className="login-title-info">
                    <h3 className="login-title"> User Login </h3>
                </div>
                <div className="email-info">
                    <TextField 
                        required
                        id="email" 
                        label="Email"
                        value={email} 
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                        size="small"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
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
                    <Button id="login" variant="contained" size="medium" fullWidth onClick={submitSignInForm}>Log In</Button>
                </div>
                <br/>
                <br/>
                <div className="other-info">
                    <Button variant="text" id="sign-up-text" onClick={goToSignUp}> Need to Sign Up?</Button>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                    <Divider orientation="vertical" variant="middle"></Divider>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="text" id="password-text" onClick={onReset}> Forgot password?</Button>
                </div>

            </div>
            <br/>
            <br/>
        </div>
    );

};

export default SignIn;