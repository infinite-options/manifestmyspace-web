import React, { Component, useState, useEffect } from 'react';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import PhotoIcon from '@mui/icons-material/Photo';
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { 
    Paper, 
    ThemeProvider,
    Box,
    Grid,
    Button,
    Stack,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
    FormControlLabel,
    Select,
    MenuItem,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
      },
    },
  }));

export default function EditProfileSettingsTenant() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    let tenant_data = location.state.tenant_data;
    const [modifiedData, setModifiedData] = useState({ 'tenant_uid': tenant_data?.tenant_uid, });
    const [isEdited, setIsEdited] = useState(false);

    const [emailAddress, setEmailAddress] = useState(tenant_data.tenant_email? tenant_data.tenant_email : '');
    const [phoneNumber, setPhoneNumber] = useState(tenant_data.tenant_phone_number? tenant_data.tenant_phone_number : '');
    const [address, setAddress] = useState(tenant_data.tenant_address? tenant_data.tenant_address : '');
    const [unit, setUnit] = useState(tenant_data.tenant_unit? tenant_data.tenant_unit : '');
    const [city, setCity] = useState(tenant_data.tenant_city? tenant_data.tenant_city : '');
    const [state, setState] = useState(tenant_data.tenant_state? tenant_data.tenant_state : '');
    const [zipCode, setZipCode] = useState(tenant_data.tenant_zip? tenant_data.tenant_zip : '');
    const [SSN, setSSN] = useState(tenant_data.tenant_ssn? tenant_data.tenant_ssn : '');
    const [uploadedImage, setUploadedImage] = useState(null);    

    // Main use Effect
    useEffect(()=>{
        console.log('EditProfileSettingsTenant useEffect');
    }, []);

    // Handle changes to form fields
    const handleInputChange = (event) => {
        console.log("Input changed")
        const { name, value } = event.target;
        // console.log(name)
        // console.log(value)

        if (name === 'tenant_email') {
            setEmailAddress(value);
        } else if (name === 'tenant_phone_number') {
            setPhoneNumber(value);
        } else if (name === 'tenant_address') {
            setAddress(value);
        } else if (name === 'tenant_unit') {
            setUnit(value);
        } else if (name === 'tenant_city') {
            setCity(value);
        } else if (name === 'tenant_state') {
            setState(value);
        } else if (name === 'tenant_zip') {
            setZipCode(value);
        } else if (name === 'tenant_ssn') {
            setSSN(value);
        }
        

        setModifiedData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        setIsEdited(true);
    }

    const handleProfileImageUpload = (file) => {
        setUploadedImage(file);
        setIsEdited(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("FORM SUBMITTED");
        console.log(modifiedData);

        const formData = new FormData();
        for (const key in modifiedData) {
            if (Object.hasOwnProperty.call(modifiedData, key)) {
                const value = modifiedData[key];
                
                // Check if the value is a non-null object (excluding arrays)
                const serializedValue = (value !== null && typeof value === 'object')
                    ? JSON.stringify(value)
                    : String(value);
    
                formData.append(key, serializedValue);
            }
        }
        if(uploadedImage){
            formData.append("tenant_photo", uploadedImage);
        }



        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        if(isEdited){
            console.log("EDITED")
            // axios.put('http://localhost:4000/ownerProfile', modifiedData, headers)
            axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', formData, headers)
            .then((response) => {
                console.log('Data updated successfully');
                setIsEdited(false); // Reset the edit status
                navigate(-1)
            })
            .catch((error) => {
                if(error.response){
                    console.log(error.response.data);
                }
            });
        }
    }

    return (
        <ThemeProvider theme={theme}>
          <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh',
                justifyContent: 'flex-start', // Align items at the top
                overflowY: 'auto',
            }}
          >
            <Box
            style={{
                width: '100%',
                // backgroundColor: theme.palette.custom.bgBlue,
                height: '25%', // 25% of the container's height
            }}>
                <Box
                component="span"
                display= 'flex'
                margin='10px'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <UTurnLeftIcon 
                        sx={{
                            transform: "rotate(90deg)", 
                            color: '#3D5CAC', 
                            fontWeight: 'bold', 
                            fontSize:theme.typography.largeFont, 
                            padding: 5,
                            position: 'absolute',
                            left: 0
                        }}
                    onClick={()=>{navigate(-1)}}/>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: '#3D5CAC', 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Settings
                    </Typography>
                </Box>
            <Paper
              style={{
                margin: '30px', // Margin around the paper
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: '85%', // Occupy full width with 25px margins on each side
                [theme.breakpoints.down('sm')]: {
                    width: '80%',
                },
                [theme.breakpoints.up('sm')]: {
                    width: '50%',
                },
              }}
            >
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'
                flexDirection="column">
                    {tenant_data.tenant_photo_url !== null ? (
                        <img
                            src={tenant_data.tenant_photo_url}
                            alt="Profile"
                            style={{
                                borderRadius: '50%',
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    ) : (
                        <AccountCircleIcon
                            sx={{
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />
                    )}
                    <>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: '#3D5CAC', 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    {tenant_data.tenant_first_name? tenant_data.tenant_first_name : '<FIRST_NAME>'} {tenant_data.tenant_last_name? tenant_data.tenant_last_name : '<LAST_NAME>'}
                    </Typography>
                    </Stack>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                        sx={{
                            justifySelf: 'center',
                            color: theme.typography.common.blue, 
                            fontWeight: theme.typography.light.fontWeight, 
                            fontSize:theme.typography.primary.smallFont
                        }}
                    >
                        Tenant Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                <label htmlFor="file-upload">
                    <Paper
                    elevation={0}
                    variant="outlined"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        borderColor: theme.typography.common.blue, // Border color changed to blue
                        padding: '10px',
                        width: '200px',
                        margin: '20px auto',
                        backgroundColor: theme.palette.primary.main, // Background color changed to light blue
                    }}
                    >
                    <Box>
                        <PhotoIcon sx={{ fontSize: theme.typography.largeFont, color: theme.typography.common.blue }} />
                    </Box>
                    <Typography
                        component="div"
                        style={{
                        textAlign: 'center',
                        flex: 1,
                        color: theme.typography.common.blue, // Text color changed to blue
                        }}
                    >
                        New Profile Picture
                    </Typography>
                    </Paper>
                </label>
                <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleProfileImageUpload(e.target.files[0])}
                />
                <hr/>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    id="editProfileForm"
                >
                    <Stack spacing={-2} m={5}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Email Address</Typography>
                    <TextField name="tenant_email" value={emailAddress} onChange={handleInputChange} variant="filled" fullWidth placeholder="email address" className={classes.root}></TextField>
                    </Stack>

                    <Stack spacing={-2} m={5}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Phone Number</Typography>
                    <TextField name="tenant_phone_number" value={phoneNumber} onChange={handleInputChange} variant="filled" fullWidth placeholder="(408)555-4823" className={classes.root}></TextField>
                    </Stack>
                    <hr/>
                    
                    <Stack spacing={-2} m={5}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Address</Typography>
                    <TextField name="tenant_address" value={address} onChange={handleInputChange} variant="filled" fullWidth placeholder="1065 Melancholy Lane" className={classes.root}></TextField>
                    </Stack>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Unit #</Typography>
                        <TextField name="tenant_unit" value={unit} onChange={handleInputChange} variant="filled" fullWidth placeholder="3" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                        <TextField name="tenant_city" value={city} onChange={handleInputChange} variant="filled" fullWidth placeholder="San Jose" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                        <TextField name="tenant_state" value={state} onChange={handleInputChange} variant="filled" fullWidth placeholder="CA" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Zip code</Typography>
                        <TextField name="tenant_zip" value={zipCode} onChange={handleInputChange} variant="filled" fullWidth placeholder="92034" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    </Grid>
                    <hr/>

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={5}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>SSN</Typography>
                        <TextField name="tenant_ssn" value={SSN} onChange={handleInputChange} variant="filled" fullWidth placeholder="Enter SSN" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    </Grid>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{padding: '10px',}}>
                            <Button 
                                variant="contained"
                                type="submit"
                                form="editProfileForm"  
                                sx=
                                    {{ 
                                        width: '100%',
                                        backgroundColor: '#3D5CAC',
                                        '&:hover': {
                                            backgroundColor: '#3D5CAC',
                                        },
                                        borderRadius: '10px',
                                    }}
                            >
                                <Typography sx={{ textTransform: 'none', color: "white", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                    Save And Submit
                                </Typography>
                            </Button>
                    </Grid>
                </Box>
            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}

