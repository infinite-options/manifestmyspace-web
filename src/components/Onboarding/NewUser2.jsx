import React, {useEffect, useState, } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Container, Grid, ToggleButtonGroup, ToggleButton, List, ListItem, OutlinedInput,  } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import GoogleSignup from './GoogleSignup';
import axios from "axios";
import { useCookies } from "react-cookie";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useUser } from "../../contexts/UserContext";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { roleMap } from "./helper";
import DataValidator from "../DataValidator";



const NewUser = () => {
    const navigate = useNavigate();
    const [ role, setRole ] = useState(null);
    const [ showEmailSignup, setShowEmailSignup ] = useState(false);
    const {  setAuthData, selectRole, setLoggedIn } = useUser();    
    const [cookies, setCookie] = useCookies(["user"]);
    const [ showPassword, setShowPassword ] = useState(false);

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    useEffect(() => {
        console.log("ROLE SELECTED -  ", role);
    }, [role]);

    useEffect(() => {
        console.log("email -  ", email);
    }, [email]);

    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
        }
    };

    const validate_form= () =>{
        if (email === "" || password === "" || confirmPassword === "") {
          alert("Please fill out all fields");
          return false;
        }
    
        if (!DataValidator.email_validate(email ) ){
          alert("Please enter a valid email");
          return false;
        }
    
        if (password !== confirmPassword) {
          alert("Passwords must match");
          return false;
        }
    }


    const checkIfUserExists = async (email) => {
        try {
            const response = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${email}`);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 404 && error.response.data.message === "User not found") {
                return null;
            } else {
                throw error;
            }
        }
    };

    const handleLogin = async () => {
        let newRole=role;
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
                      .then(async (response) => {
                        console.log(response.data.message);
                        const { message, result } = response.data;
                        if (message === "Incorrect password") {
                          alert(response.data.message);
                          navigate('/userLogin', { state: { user_emai: email } })
                          // setShowSpinner(false);
                        } else if (message === "Email doesn't exist") {
                          //setUserDoesntExist(true);
                          // setShowSpinner(false);
                        } else if (message === "Login successful") {
                          console.log("Login successfull moving to dashboard")
                          setAuthData(result);
                          setLoggedIn(true);
                          const { role } = result.user;


                          const existingRoles = role.split(",");
                          // Check if the new role already exists
                          if (!existingRoles.includes(newRole))
                          {
                          // Add the new role
                          existingRoles.push(newRole);
                          const updatedRole = existingRoles.join(",");
                          // Send the update request to the server
                          const response = await axios.put("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateUserByUID/MYSPACE", {
                            user_uid: result.user.user_uid,
                            role: updatedRole,
                          });
                          // Check if the response is successful
                          if (response.status === 200) {
                            let updatedUser=result
                            updatedUser.user.role=updatedRole
                            setAuthData(updatedUser)
                            //setCookie("user", { ...cookies.user, role: updatedRole }, { path: "/" });
                            alert("Role updated successfully");
                            navigate("/addNewRole", { state: { user_uid: result.user.user_uid, newRole } });
                            return ;
                          } else {
                            alert("An error occurred while updating the role.");
                          }
                        }
                          const openingRole = role.split(",")[0];
                          selectRole(openingRole);
                          setLoggedIn(true);
                          const { dashboardUrl } = roleMap[openingRole];
                          console.log("Login successfull moving to dashboard " ,dashboardUrl)
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
             // setUserDoesntExist(true);
              // setShowSpinner(false);
            }
          });
      };


    const handleSignup = async () => {
        console.log("signup clicked");
        const userExists = await checkIfUserExists(email);
        const user = {
            email: email,
            password: password,
            role: role,
            isEmailSignup: true,
        };
        console.log("user Exists", userExists)
        if(userExists){
            handleLogin();
        }
        else{

            if (validate_form() === false)
                return;
            navigate(`/createProfile`, { state: { user : user } });
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg"  sx={{ height: '100vh', backgroundColor: '#FFFFFF',  }}>
                <Grid container>
                    <Grid container item xs={12} justifyContent='center' >
                        <Typography sx={{ fontSize: '35px', color: '#160449',}}>
                            Select a Role
                        </Typography>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            value={role}
                            exclusive
                            onChange={handleRoleChange}
                            aria-label="select role"
                            sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}                             
                        >
                            <ToggleButton value="OWNER" aria-label="owner" sx={{ backgroundColor: '#FFFFFF', color: '#000000', height: '150px', width: '200px', }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <HomeOutlinedIcon sx={{ height: '50%', width: '50%' }} />
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold',}}>
                                        Owner
                                    </Typography>
                                </Box>
                            </ToggleButton>

                            <ToggleButton value="MANAGER" aria-label="manager"  sx={{ backgroundColor: '#FFFFFF', color: '#000000', height: '150px', width: '200px',}}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <ManageAccountsOutlinedIcon sx={{height: '50%', width: '50%', }}/>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold',}}>
                                        Manager
                                    </Typography>
                                </Box>
                                
                            </ToggleButton>

                            <ToggleButton value="TENANT" aria-label="tenant" sx={{ backgroundColor: '#FFFFFF', color: '#000000', height: '150px', width: '200px',}}>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <PersonOutlineOutlinedIcon sx={{height: '50%', width: '50%', }}/>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', }}>
                                        Tenant
                                    </Typography>
                                </Box>
                            </ToggleButton>

                            <ToggleButton value="MAINTENANCE" aria-label="maintenance" sx={{ backgroundColor: '#FFFFFF', color: '#000000', height: '150px', width: '200px',}}>                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <ConstructionOutlinedIcon sx={{height: '50%', width: '50%', }}/>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', }}>
                                        Maintenance
                                    </Typography>
                                </Box>
                            </ToggleButton>

                        </ToggleButtonGroup>
                    </Grid>
                    {
                        role != null && (
                            <>
                                <Grid container item xs={12} justifyContent="center" sx={{marginTop: '50px', }}>
                                    <Grid container direction="column" item xs={4} alignItems="center">
                                        <GoogleSignup />
                                        <Typography sx={{fontSize: '20px', color: '#3D5CAC', fontWeight: 'bold', marginTop: '20px',  }}>
                                            Recommended
                                        </Typography>
                                        <List sx={{ listStyleType: 'disc' }}>
                                            <ListItem sx={{ display: 'list-item' }}>No Separate Password</ListItem>
                                            <ListItem sx={{ display: 'list-item' }}>Makes Scheduling Easier</ListItem>
                                            <ListItem sx={{ display: 'list-item' }}>Faster Setup Process</ListItem>
                                            <ListItem sx={{ display: 'list-item' }}>Secured by Google</ListItem>
                                        </List>

                                    </Grid>
                                    <Grid container direction="row" item xs={4} sx={{ padding: '7px',}}>
                                        <Grid item xs={12}>
                                            <Button
                                                onClick={() => setShowEmailSignup( prevState => (!prevState))}
                                                sx={{
                                                    width: '350px',
                                                    height: '57px',
                                                    borderRadius: '15px',
                                                    fontSize: '20px',
                                                    backgroundColor: "#F2F2F2",
                                                    textTransform: "none",
                                                    color: "grey",
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        backgroundColor: "#F2F2F2",
                                                        color: "#160449",
                                                    },
                                                    boxShadow: 1,
                                                    justifyContent: 'space-evenly'                                                
                                                }}
                                            >
                                                Signup with Email   <KeyboardArrowDownIcon />
                                            </Button>
                                        </Grid>
                                        {
                                            showEmailSignup && (
                                                <Grid container direction="column" item xs={12} sx={{marginTop: '30px', }}>
                                                    <OutlinedInput 
                                                        value={email} 
                                                        onChange={ (e) => setEmail(e.target.value)}
                                                        id="filled-basic" 
                                                        variant="filled" 
                                                        placeholder="Enter Email Address"
                                                        sx={{ marginTop: '5px', width: '350px', backgroundColor: '#F2F2F2'}}
                                                    />
                                                    <OutlinedInput
                                                        type={ showPassword ? 'text' : 'password'} 
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        id="filled-basic"
                                                        variant="filled"
                                                        placeholder="Enter Password"
                                                        sx={{ marginTop: '5px', width: '350px', backgroundColor: '#F2F2F2'}}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                              <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword((show) => !show)}                                                                
                                                                edge="end"
                                                              >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                              </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        
                                                    />
                                                    <OutlinedInput
                                                        type={ showPassword ? 'text' : 'password'} 
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        id="filled-basic"
                                                        variant="filled"
                                                        placeholder="Verify Password"
                                                        sx={{ marginTop: '5px', width: '350px', backgroundColor: '#F2F2F2'}}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                              <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword((show) => !show)}                                                                
                                                                edge="end"
                                                              >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                              </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        
                                                    />
                                                    <Button
                                                        onClick={handleSignup}
                                                        sx={{
                                                            width: '350px',
                                                            height: '57px',
                                                            borderRadius: '5px',
                                                            fontSize: '16px',
                                                            backgroundColor: "#3D5CAC",
                                                            textTransform: "none",
                                                            color: "#FFFFFF",
                                                            fontWeight: 'bold',
                                                            '&:hover': {
                                                                backgroundColor: "#160449",
                                                                color: "#FFFFFF",
                                                            },
                                                            marginTop: '10px',                                                                                                                        
                                                        }}
                                                    >
                                                        Sign Up
                                                    </Button>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            </>
                        )
                    }

                    <Grid container item xs={12} justifyContent="center" sx={{ marginTop: '20px', }}>
                        <Typography 
                            sx={{                            
                                color: theme.typography.common.default, 
                                fontWeight: theme.typography.light.fontWeight, 
                                fontSize:theme.typography.primary.smallFont
                            }}
                        >
                            Already have an account ?  <u><a href="/returningUser">Log In</a></u>
                        </Typography>

                    </Grid>

                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default NewUser;