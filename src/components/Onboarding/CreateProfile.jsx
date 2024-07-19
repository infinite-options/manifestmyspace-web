import React, {useEffect, useState, } from 'react';
import { 
    Paper,
    Box,
    Stack,
    ThemeProvider,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
    List,
    ListItem,
    OutlinedInput,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    MenuItem,
    Select,  
} from '@mui/material';
import theme from '../../theme/theme';
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useCookies } from "react-cookie";

import DataValidator from "../DataValidator";
import { formatPhoneNumber, headers, maskNumber, maskEin, roleMap, photoFields } from "./helper";

import axios from "axios";

import managerDashboardImage from './images/dashboard-images/manager-dashboard.png'; 
import maintenanceDashboardImage from './images/dashboard-images/maintenance-dashboard.png'; 
import ownerDashboardImage from './images/dashboard-images/owner-dashboard.png'; 
import tenantDashboardImage from './images/dashboard-images/tenant-dashboard.png'; 

import { objToQueryString } from "../utils/helper";



const CreateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();        
    const { user: userFromHook, setAuthData, onboardingState, setOnboardingState, updateProfileUid, selectRole, setLoggedIn, } = useUser();    
    const { user } = location.state;
    console.log("user - ", user);
    const [cookie, setCookie] = useCookies(["default_form_vals"]);
    const cookiesData = cookie["default_form_vals"];

    const [ email, setEmail ] = useState(user?.email);
    const [ businessEmail, setBusinessEmail ] = useState(user?.email);
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ businessName, setBusinessName ] = useState('');
    const [ phoneNumber, setPhoneNumber ] = useState('');  
    const [ businessPhoneNumber, setBusinessPhoneNumber ] = useState(''); 
    
    //employees
    const [ businessList, setBusinessList ] = useState([]);
    const [ selectedBusiness, setSelectedBusiness ] = useState(null);

    const fetchBusinesses = async (businessType) => {
        const url = "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile";
        const args = {
            business_type: businessType,
        };
        const response = await axios.get(url + objToQueryString(args));
        setBusinessList(response.data.result);
    };

    useEffect(() => {
        if(user?.role === "PM_EMPLOYEE"){
            fetchBusinesses("MANAGEMENT");
        }
        else if(user?.role === "MAINT_EMPLOYEE"){
            fetchBusinesses("MAINTENANCE");
        } else {
            return;
        }
    }, []);

    useEffect(() => {
        console.log("ROHIT - businessList - ", businessList)
    }, [businessList]);

    useEffect(() => {
        console.log("ROHIT - selectedBusiness - ", selectedBusiness)
    }, [selectedBusiness]);

    const validate_form = () => {
        if ((user.role === "TENANT" || user.role === "OWNER" || user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE") && (firstName === "" || lastName === "" || phoneNumber === "" || email === "")) {
          alert("Please fill out all fields");
          return false;
        }        
        if ((user.role === "MANAGER" || user.role === "MAINTENANCE" ) && (firstName === "" || lastName === "" || businessName === "" || businessPhoneNumber === "" || businessEmail === "")) {
            alert("Please fill out all fields");
            return false;
        }        
        if ((user.role === "TENANT" || user.role === "OWNER" || user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE") && (!DataValidator.phone_validate(phoneNumber))) {
          alert("Please enter a valid phone number");
          return false;
        }
        if ((user.role === "MANAGER" || user.role === "MAINTENANCE" ) && (!DataValidator.phone_validate(businessPhoneNumber))) {
            alert("Please enter a valid phone number");
            return false;
        }
        if ((user.role === "TENANT" || user.role === "OWNER"  || user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE" ) && (!DataValidator.email_validate(email))) {
            alert("Please enter a valid email");
            return false;
        }
        if ((user.role === "MANAGER" || user.role === "MAINTENANCE" ) && (!DataValidator.email_validate(businessEmail))) {
            alert("Please enter a valid email");
            return false;
        }                
        return true;
    };

    const getPayload = (type, userUID) => {
        switch (type) {
          case "MANAGER":
            return {
              business_user_id: userUID,
              business_type: "MANAGEMENT",
              business_name: businessName,              
              business_phone_number: businessPhoneNumber,
              business_email: businessEmail,              
            };
          case "PM_EMPLOYEE":
            return {
                employee_user_id: userUID,
                employee_first_name: firstName,
                employee_last_name: lastName,
                employee_phone_number: phoneNumber,
                employee_email: email,
                employee_business_id: selectedBusiness?.business_uid,             
            };
          case "MAINTENANCE":
            return {
              business_user_id: userUID,
              business_type: "MAINTENANCE",
              business_name: businessName,              
              business_phone_number: businessPhoneNumber,
              business_email: businessEmail,              
            };
          case "MAINT_EMPLOYEE":
            return {
                employee_user_id: userUID,
                employee_first_name: firstName,
                employee_last_name: lastName,
                employee_phone_number: phoneNumber,
                employee_email: email,
                employee_business_id: selectedBusiness?.business_uid,             
            };
          case "OWNER":
            return {
              owner_user_id: userUID,
              owner_first_name: firstName,
              owner_last_name: lastName,
              owner_phone_number: phoneNumber,
              owner_email: email,              
            };
          case "TENANT":
            return {
              tenant_user_id: userUID,
              tenant_first_name: firstName,
              tenant_last_name: lastName,
              tenant_phone_number: phoneNumber,
              tenant_email: email,              
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

    const createProfile = async (form, type) => {
        const { profileApi } = roleMap[type];
        const { data } = await axios.post(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev${profileApi}`, form, headers);
        return data;
    };

    const handleUpdateProfileUid = (data) => {
        if (data.owner_uid) {
          updateProfileUid({ owner_id: data.owner_uid });
        }
        if (data.tenant_uid) {
          updateProfileUid({ tenant_id: data.tenant_uid });
        }
        if (data.business_uid) {
          updateProfileUid({ business_uid: data.business_uid });
          updateProfileUid({ business_owner_id: data.employee_uid });
        }
      };

    const createUserProfile = async ( userUID, userData ) => {
        console.log("createUserProfile - USER UID - ", userUID);
        const payload = getPayload(user.role, userUID);
        const form = encodeForm(payload);
        const data = await createProfile(form, user.role);
        handleUpdateProfileUid(data);
        setCookie("default_form_vals", { ...cookiesData, phoneNumber, email });
        selectRole(user.role)
        

        console.log("userFromHook - ", userFromHook);
        let role_id = {};
        if (user.role === "OWNER") role_id = { owner_id: data.owner_uid };

        if (user.role === "TENANT") role_id = { tenant_id: data.tenant_uid };

        if (user.role === "MANAGER") {
        let businesses = userData.businesses;        
        businesses["MANAGEMENT"].business_uid = data.business_uid;
        businesses["MANAGEMENT"].business_owner_id = data.employee_uid;
        role_id = { businesses };
        }

        if (user.role === "MAINTENANCE") {
        let businesses = userData.businesses;
        businesses["MAINTENANCE"].business_uid = data.business_uid;
        businesses["MAINTENANCE"].business_owner_id = data.employee_uid;
        role_id = { businesses };
        }

        setCookie("user", { ...userData, ...role_id });

        const { dashboardUrl } = roleMap[user.role];
        navigate(dashboardUrl);
    }

    const handleLogin = async () => {
        let email=user.email
        let password=user.password
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
                          //setUserDoesntExist(true);
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
             // setUserDoesntExist(true);
              // setShowSpinner(false);
            }
          });
      };

    const handleSignup = () => {
        if (validate_form() === false) return;

        setCookie("default_form_vals", { ...cookiesData, firstName, lastName, phoneNumber, email });

        if(user.isEmailSignup){        
            const url = "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE";        
            const data = {
                ...user, 
                first_name: firstName, 
                last_name: lastName,
                phone_number: phoneNumber,
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(new Error('Failed to fetch')); 
                }
                return response.json();
            })
            .then(responseJSON => {                    
                console.log("createProfile - responseJSON - ", responseJSON);
                if (responseJSON.message === "User already exists") {
                    alert("User already exists! Logging with existing credentials");
                    handleLogin();
                    //navigate('/userLogin', { state: { user_emai: user.email } })
                    return;
                } else {
                    setAuthData(responseJSON.result);
                    setLoggedIn(true);

                    createUserProfile(responseJSON.result.user.user_uid, responseJSON.result.user)
                    // setShowSpinner(false);
                    // navigate(`/onboardingRouter`, { state: { isPrivate:false } });
                    console.log('Success:', responseJSON);

                }                
            })            
            .catch(error => {
                console.error('Error:', error);
            });

        } else {
            const url = "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE";        
            const data = {
                ...user, 
                first_name: firstName, 
                last_name: lastName,
                phone_number: phoneNumber,
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(new Error('Failed to fetch')); 
                }
                return response.json();
            })
            .then(responseJSON => {                    
                console.log("createProfile - responseJSON - ", responseJSON);
                if (responseJSON.message === "User already exists") {
                    alert(responseJSON.message);
                    return;
                } else {
                    setAuthData(responseJSON.result);

                    createUserProfile(responseJSON.result.user.user_uid)
                    // setShowSpinner(false);
                    // navigate(`/onboardingRouter`, { state: { isPrivate:false } });
                    console.log('Success:', responseJSON);

                }                
            })            
            .catch(error => {
                console.error('Error:', error);
            });
        }
            
    };

    const getDashboardImage = () => {
        switch(user?.role){
            case "MANAGER":
                return managerDashboardImage;
                break;
            case "MAINTENANCE":
                return maintenanceDashboardImage;
                break;
            case "OWNER":
                return ownerDashboardImage;
                break;
            case "TENANT":
                return tenantDashboardImage;
                break;
            default:
                return "";
                break;
        }
    }
    
    const handleBusinessChange = (event) => {
        setSelectedBusiness(event.target.value)        
    }
    

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth="lg"
            >
                <Typography
                    sx={{
                    fontSize: { xs: "22px", sm: "28px", md: "32px" },
                    fontWeight: "600",
                    }}
                >
                    Welcome, {firstName}!
                </Typography>
            </Container>
            <Container
                maxWidth="lg"
                sx={{
                    height: '90vh',
                    backgroundImage: `url(${getDashboardImage()})`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // filter: 'blur(5px)',                    
                }}
            >
                <Container maxWidth="md"  sx={{ height: 'auto', backgroundColor: '#FFFFFF', padding: '50px', borderRadius: '60px',  }}>
                    <Grid container justifyContent="center" rowGap={20}>                    
                        <Grid container item xs={10} justifyContent='center' spacing={20} >
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '28px', color: '#160449', fontWeight: 'bold' }}>
                                {/* {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Profile */}
                                {user.role === "MANAGER"? "Property Manager Profile" : ""}
                                {user.role === "MAINTENANCE"? "Maintenance Manager Profile" : ""}
                                {user.role === "PM_EMPLOYEE"? "Management Employee Profile" : ""}
                                {user.role === "MAINT_EMPLOYEE"? "Maintenance Employee Profile" : ""}
                                {user.role === "OWNER"? "Owner Profile" : ""}
                                {user.role === "TENANT"? "Tenant Profile" : ""}
                            </Typography>
                        </Grid> 
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                    First Name
                                </Typography>
                                <OutlinedInput 
                                    value={firstName} 
                                    onChange={ (e) => setFirstName(e.target.value)}
                                    id="filled-basic" 
                                    variant="filled"                                 
                                    sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                    Last Name
                                </Typography>
                                <OutlinedInput 
                                    value={lastName} 
                                    onChange={ (e) => setLastName(e.target.value)}
                                    id="filled-basic" 
                                    variant="filled"                                 
                                    sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                />
                            </Grid>                         
                        </Grid>

                        {
                            (user.role === "MANAGER" || user.role === "MAINTENANCE") && (                    
                                <Grid item xs={10}>
                                        <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                            Business Name
                                        </Typography>
                                        <OutlinedInput 
                                            value={businessName} 
                                            onChange={ (e) => setBusinessName(e.target.value)}
                                            id="filled-basic" 
                                            variant="filled"                                 
                                            sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                        />
                                </Grid>   
                            )
                        }

                        {
                            (user.role === "TENANT" || user.role === "OWNER" || user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE") && (
                                <Grid item xs={10}>
                                    <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                        Email
                                    </Typography>
                                    <OutlinedInput 
                                        value={email} 
                                        onChange={ (e) => setEmail(e.target.value)}
                                        id="filled-basic" 
                                        variant="filled"                                 
                                        sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                        readOnly
                                    />
                                </Grid>
                            )
                        }

                        {
                            (user.role === "MANAGER" || user.role === "MAINTENANCE") && (
                                <Grid item xs={10}>
                                        <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                            Business Email
                                        </Typography>
                                        <OutlinedInput 
                                            value={businessEmail} 
                                            onChange={ (e) => setBusinessEmail(e.target.value)}
                                            id="filled-basic" 
                                            variant="filled"                                 
                                            sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                            readOnly
                                        />
                                </Grid>
                            )
                        }   

                        {
                            (user.role === "TENANT" || user.role === "OWNER" || user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE") && (

                                <Grid item xs={10}>
                                        <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                            Phone Number
                                        </Typography>
                                        <OutlinedInput 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                            id="filled-basic" 
                                            variant="filled"                                 
                                            sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                        />
                                </Grid>
                            )
                        }


                        {
                            (user.role === "MANAGER" || user.role === "MAINTENANCE") && (
                                <Grid item xs={10}>
                                    <Typography sx={{ fontSize: '25px', color: '#160449',}}>
                                        Business Phone Number
                                    </Typography>
                                    <OutlinedInput 
                                        value={businessPhoneNumber} 
                                        onChange={(e) => setBusinessPhoneNumber(formatPhoneNumber(e.target.value))}
                                        id="filled-basic" 
                                        variant="filled"                                 
                                        sx={{ marginTop: '5px', width: '100%', backgroundColor: '#F2F2F2'}}
                                    />
                                </Grid>

                            )
                        }

                        {
                            (user.role === "PM_EMPLOYEE" || user.role === "MAINT_EMPLOYEE") && (
                                <>
                                <Grid item xs={10}>                    
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
                                        size="large"
                                        fullWidth
                                        sx={{
                                        backgroundColor: "#F2F2F2",
                                        }}                    
                                    >
                                        {businessList?.map((row, index) => (
                                            <MenuItem key={index} value={row}>{row.business_name}</MenuItem>
                                        ))}
                                    </Select>                    
                                    
                                </Grid>
                                </>   
                            )
                        }

                        <Grid container item xs={5} justifyContent="center">
                            <Button
                                onClick={handleSignup}
                                sx={{
                                    marginTop: '20px',
                                    marginBottom: '15px',
                                    width: '100%',
                                    height: '57px',
                                    borderRadius: '15px',
                                    fontSize: '20px',
                                    backgroundColor: "#3D5CAC",
                                    textTransform: "none",
                                    color: "#FFFFFF",
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: "#F2F2F2",
                                        color: "#160449",
                                    },
                                    boxShadow: 1,
                                    justifyContent: 'space-evenly'                                                
                                }}
                            >
                                Go to Dashboard
                            </Button>                            
                            You can fill out additional info when needed.                                                        
                        </Grid>                    
                        
                        {/* {
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
                        } */}                   
                    </Grid>
                </Container>
            </Container>
        </ThemeProvider>
    );
}

export default CreateProfile;