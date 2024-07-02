import React, {useEffect, useState, } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Container, Grid, ToggleButtonGroup, ToggleButton, List, ListItem, OutlinedInput,  } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import GoogleSignup from './GoogleSignup';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import DataValidator from "../DataValidator";



const NewUser = () => {
    const navigate = useNavigate();
    const [ role, setRole ] = useState(null);
    const [ showEmailSignup, setShowEmailSignup ] = useState(false);

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

    const handleSignup = () => {
        console.log("signup clicked");

        if (validate_form() === false)
            return;
            
        const user = {
            email: email,
            password: password,
            role: role,
            isEmailSignup: true,
        };
        navigate(`/createProfile`, { state: { user : user } });
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