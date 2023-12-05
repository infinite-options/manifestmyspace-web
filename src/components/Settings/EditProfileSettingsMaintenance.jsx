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

export default function EditProfileSettingsMaintenance() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    let maintenance_data = location.state.maintenance_data;
    const [modifiedData, setModifiedData] = useState({ 'business_uid': maintenance_data?.business_uid, });
    const [isEdited, setIsEdited] = useState(false);

    const [emailAddress, setEmailAddress] = useState(maintenance_data.business_email? maintenance_data.business_email : '');
    const [phoneNumber, setPhoneNumber] = useState(maintenance_data.business_phone_number? maintenance_data.business_phone_number : '');
    const [address, setAddress] = useState(maintenance_data.business_address? maintenance_data.business_address : '');
    const [unit, setUnit] = useState(maintenance_data.business_unit? maintenance_data.business_unit : '');
    const [city, setCity] = useState(maintenance_data.business_city? maintenance_data.business_city : '');
    const [state, setState] = useState(maintenance_data.business_state? maintenance_data.business_state : '');
    const [zipCode, setZipCode] = useState(maintenance_data.business_zip? maintenance_data.business_zip : '');
    const [maintenanceFees, setMaintenanceFees] = useState(maintenance_data.business_services_fees? JSON.parse(maintenance_data.business_services_fees) : []);
    const [businessLocations, setBusinessLocations] = useState(maintenance_data.business_locations? JSON.parse(maintenance_data.business_locations) : []);
    const [EIN, setEIN] = useState(maintenance_data.business_ein_number? maintenance_data.business_ein_number : '');
    const [uploadedImage, setUploadedImage] = useState(null);

    const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
    const [showEditServiceDialog, setShowEditServiceDialog] = useState(false);
    const [indexForEditServiceDialog, setIndexForEditServiceDialog] = useState(false);

    const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
    const [showEditLocationDialog, setShowEditLocationDialog] = useState(false);
    const [indexForEditLocationDialog, setIndexForEditLocationDialog] = useState(false);


    useEffect(() => {
        console.log("maintenanceFees updated - ", maintenanceFees)
        setModifiedData((prevData) => ({
            ...prevData,
            'business_services_fees': JSON.stringify(maintenanceFees)
        }));
        setIsEdited(true);
    }, [maintenanceFees]);

    useEffect(() => {
        console.log("businessLocations updated - ", businessLocations)
        setModifiedData((prevData) => ({
            ...prevData,
            'business_locations': JSON.stringify(businessLocations)
        }));
        setIsEdited(true);
    }, [businessLocations]);

    const handleOpenAddService = () => {
        setShowAddServiceDialog(true);
    };

    const handleCloseAddService = () => {
        setShowAddServiceDialog(false);
    };

    const handleOpenEditService = (serviceIndex) => {
        setShowEditServiceDialog(true);
        console.log("EDITING Service, Index", serviceIndex);
        setIndexForEditServiceDialog(serviceIndex);
    };

    const handleCloseEditService = () => {
        setShowEditServiceDialog(false);
    };

    const handleAddService = (newService) => {
        setMaintenanceFees((prevServices) => [...prevServices, newService]);
        setIsEdited(true);
    }

    const handleEditService = (newService, index) => {
        console.log("IN handleEditService of PropertyCard");
        console.log(newService, index);
        setMaintenanceFees((prevServices) => {
            const updatedServices = prevServices.map((service, i) => {
                if (i === index) {
                    return newService;
                }
                return service;
            });
            return updatedServices;
        });
        setIsEdited(true);
    }

    const handleDeleteService = (index, event) => {
        console.log("Maintenance Services", maintenanceFees);
        setMaintenanceFees(prevServices => {
            const servicesArray = Array.from(prevServices);
            servicesArray.splice(index, 1);
            return servicesArray;
        });
        setIsEdited(true);
        event.stopPropagation();
    }












    const handleOpenAddLocation = () => {
        setShowAddLocationDialog(true);
    };

    const handleCloseAddLocation = () => {
        setShowAddLocationDialog(false);
    };

    const handleOpenEditLocation = (locationIndex) => {
        setShowEditLocationDialog(true);
        console.log("EDITING Location, Index", locationIndex);
        setIndexForEditLocationDialog(locationIndex);
    };

    const handleCloseEditLocation = () => {
        setShowEditLocationDialog(false);
    };

    const handleAddLocation = (newLocation) => {
        setBusinessLocations((prevLocations) => [...prevLocations, newLocation]);
        setIsEdited(true);
    }

    const handleEditLocation = (newLocation, index) => {
        console.log("IN handleEditLocation");
        console.log(newLocation, index);
        setBusinessLocations((prevLocations) => {
            const updatedLocations = prevLocations.map((location, i) => {
                if (i === index) {
                    return newLocation;
                }
                return location;
            });
            return updatedLocations;
        });
        setIsEdited(true);
    }

    const handleDeleteLocation = (index, event) => {
        setBusinessLocations(prevLocations => {
            const locationsArray = Array.from(prevLocations);
            locationsArray.splice(index, 1);
            return locationsArray;
        });
        setIsEdited(true);
        event.stopPropagation();
    }












    // Main use Effect
    useEffect(()=>{
        console.log('EditProfileSettingsMaintenance useEffect');
    }, []);

    // Handle changes to form fields
    const handleInputChange = (event) => {
        console.log("Input changed")
        const { name, value } = event.target;
        // console.log(name)
        // console.log(value)

        if (name === 'business_email') {
            setEmailAddress(value);
        } else if (name === 'business_phone_number') {
            setPhoneNumber(value);
        } else if (name === 'business_address') {
            setAddress(value);
        } else if (name === 'business_unit') {
            setUnit(value);
        } else if (name === 'business_city') {
            setCity(value);
        } else if (name === 'business_state') {
            setState(value);
        } else if (name === 'business_zip') {
            setZipCode(value);
        } else if (name === 'business_ein_number') {
            setEIN(value);
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
            formData.append("business_photo", uploadedImage);
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
                    {maintenance_data.business_photo_url !== null ? (
                        <img
                            src={maintenance_data.business_photo_url}
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
                    {maintenance_data.business_name? maintenance_data.business_name : '<BUSINESS_NAME>'}
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
                        Maintenance Business Profile
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
                    <TextField name="business_email" value={emailAddress} onChange={handleInputChange} variant="filled" fullWidth placeholder="email address" className={classes.root}></TextField>
                    </Stack>

                    <Stack spacing={-2} m={5}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Phone Number</Typography>
                    <TextField name="business_phone_number" value={phoneNumber} onChange={handleInputChange} variant="filled" fullWidth placeholder="(408)555-4823" className={classes.root}></TextField>
                    </Stack>
                    <hr/>
                    
                    <Stack spacing={-2} m={5}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Address</Typography>
                    <TextField name="business_address" value={address} onChange={handleInputChange} variant="filled" fullWidth placeholder="1065 Melancholy Lane" className={classes.root}></TextField>
                    </Stack>
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Unit #</Typography>
                        <TextField name="business_unit" value={unit} onChange={handleInputChange} variant="filled" fullWidth placeholder="3" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>City</Typography>
                        <TextField name="business_city" value={city} onChange={handleInputChange} variant="filled" fullWidth placeholder="San Jose" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>State</Typography>
                        <TextField name="business_state" value={state} onChange={handleInputChange} variant="filled" fullWidth placeholder="CA" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Zip code</Typography>
                        <TextField name="business_zip" value={zipCode} onChange={handleInputChange} variant="filled" fullWidth placeholder="92034" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    </Grid>
                    <hr/>
                    <Grid container justifyContent="center" alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, textAlign:'center', }}>
                                Maintenance Services
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="center" alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                        <Grid item xs={12} 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box>

                            </Box>
                            <Box
                                onClick={handleOpenAddService}
                            >
                                {/* <EditIcon  sx={{ fontSize: 16, color: '#3D5CAC'}} /> */}
                                Add a Service
                            </Box>
                        </Grid>
                        <Grid item xs={12} 
                            sx={{
                                background: "#FFFFFF",
                                fontSize: '13px',
                                padding: '5px',
                                color: '#3D5CAC',
                                borderRadius: '5px',

                            }}
                        >   
                            {maintenanceFees.length === 0 ? (
                                // <p>No fees to display</p>
                                <Box
                                    sx={{
                                        height: "13px",
                                    }}
                                >
                                    No fees to display
                                </Box>
                            ) : (
                                maintenanceFees.map((service, index) => (
                                    <Box 
                                        key={index}
                                        sx = {{
                                            display: 'flex',
                                            flexDirection: 'column',

                                        }}
                                        onClick={() => handleOpenEditService(index)}
                                    >
                                        <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}

                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                            }}

                                            >
                                                <Box sx={{fontWeight: 'bold',}}>{service.service_name}</Box>
                                                {
                                                    service.hours? (
                                                        <Box>Hours: {service.hours}, Charge:{service.charge}, Total Cost: {service.total_cost}</Box>
                                                    ): (
                                                        <Box>Charge: {service.charge}</Box>
                                                    )
                                                }
                                                
                                                
                                            </Box>

                                            <Button 
                                                variant="text"
                                                onClick={(event) => {
                                                    handleDeleteService(index, event);
                                                }}
                                                sx={{
                                                    width: '10%', 
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold', 
                                                    color: '#3D5CAC',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent', // Set to the same color as the default state
                                                    },
                                                }}

                                            >
                                                <DeleteIcon  sx={{ fontSize: 14, color: '#3D5CAC'}} />
                                            </Button>
                                        </Box>
                                    </Box>

                                ))
                            )}

                        </Grid>
                        {showAddServiceDialog && (
                            <Box>
                                <AddServiceDialog open={showAddServiceDialog} handleClose={handleCloseAddService} onAddService={handleAddService} />
                            </Box>
                        )}
                        {showEditServiceDialog && (
                            <Box>
                                <EditServiceDialog open={showEditServiceDialog} handleClose={handleCloseEditService} onEditService={handleEditService} serviceIndex={indexForEditServiceDialog} services={maintenanceFees} />
                            </Box>
                        )}
                    </Grid>

                    <hr/>

                    <Grid container justifyContent="center" alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, textAlign:'center', }}>
                                Business Locations
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="center" alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                        <Grid item xs={12} 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box>

                            </Box>
                            <Box
                                onClick={handleOpenAddLocation}
                            >
                                {/* <EditIcon  sx={{ fontSize: 16, color: '#3D5CAC'}} /> */}
                                Add a Location
                            </Box>
                        </Grid>
                        <Grid item xs={12} 
                            sx={{
                                background: "#FFFFFF",
                                fontSize: '13px',
                                padding: '5px',
                                color: '#3D5CAC',
                                borderRadius: '5px',

                            }}
                        >   
                            {businessLocations.length === 0 ? (
                                // <p>No fees to display</p>
                                <Box
                                    sx={{
                                        height: "13px",
                                    }}
                                >
                                    No locations to display
                                </Box>
                            ) : (
                                businessLocations.map((location, index) => (
                                    <Box 
                                        key={index}
                                        sx = {{
                                            display: 'flex',
                                            flexDirection: 'column',

                                        }}
                                        onClick={() => handleOpenEditLocation(index)}
                                    >
                                        <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}

                                        >
                                            <Box>Address: {location.address}, City: {location.city}, State:{location.state}, Miles: {location.miles}</Box>

                                            <Button 
                                                variant="text"
                                                onClick={(event) => {
                                                    handleDeleteLocation(index, event);
                                                }}
                                                sx={{
                                                    width: '10%', 
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold', 
                                                    color: '#3D5CAC',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent', // Set to the same color as the default state
                                                    },
                                                }}

                                            >
                                                <DeleteIcon  sx={{ fontSize: 14, color: '#3D5CAC'}} />
                                            </Button>
                                        </Box>
                                    </Box>

                                ))
                            )}

                        </Grid>
                        
                        {showAddLocationDialog && (
                            <Box>
                                <AddLocationDialog open={showAddLocationDialog} handleClose={handleCloseAddLocation} onAddLocation={handleAddLocation} />
                            </Box>
                        )}
                        {showEditLocationDialog && (
                            <Box>
                                <EditLocationDialog open={showEditLocationDialog} handleClose={handleCloseEditLocation} onEditLocation={handleEditLocation} locationIndex={indexForEditLocationDialog} locations={businessLocations} />
                            </Box>
                        )}
                    </Grid>

                    <hr/>

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={5}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>SSN</Typography>
                        <TextField variant="filled" fullWidth placeholder="Enter SSN" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={-2} m={5}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>EIN</Typography>
                        <TextField name="business_ein_number" value={EIN} onChange={handleInputChange} variant="filled" fullWidth placeholder="Enter EIN" className={classes.root}></TextField>
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

function AddServiceDialog({ open, handleClose, onAddService }) {

    const [serviceName, setServiceName] = useState('');
    useEffect(() => {
        console.log('serviceName: ', serviceName);
    }, [serviceName]);

    const [numHours, setNumHours] = useState(0);
    useEffect(() => {
        console.log('numHours: ', numHours);
    }, [numHours]);

    const [charge, setCharge] = useState(0);
    useEffect(() => {
        console.log('Charge: ', charge);
    }, [charge]);

    const [feeType, setFeeType] = useState("Fixed Bid");
    useEffect(() => {
        console.log('feeType: ', feeType);
    }, [feeType]);

    const [totalCost, setTotalCost] = useState(0);
    useEffect(() => {
        console.log('totalCost: ', totalCost);
    }, [totalCost]);

    useEffect(() => {
        if(feeType === "Hourly"){
            setTotalCost(numHours * charge);
        }
    }, [numHours, charge, feeType]);

    


    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
    };

    // const handleFrequencyChange = (event) => {
    //     setFeeFrequency(event.target.value)
    // }

    // const handleAppliedToChange = (event) => {
    //     setFeeAppliedTo(event.target.value)
    // }


    const handleAddService = (event) => {
        event.preventDefault();

        console.log("ADD SERVICE FORM SUBMITTED ");
        console.log('serviceName:', serviceName);
        console.log('numHours:', numHours);
        console.log('charge:', charge);
        console.log('feeType:', feeType);
        console.log('totalCost:', totalCost);

        const newService = {
            service_name: serviceName,            
            charge: charge,
            ...(feeType === "Fixed Bid" && { charge: charge }),
            ...(feeType === "Hourly" && { hours: numHours }),
            ...(feeType === "Hourly" && { charge: charge }),
            ...(feeType === "Hourly" && { total_cost: totalCost }),
        }


        onAddService(newService);
        handleClose();
    }

    return (
        <form onSubmit={handleAddService}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        Maintenance Services
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Service Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="service_name"
                                    placeholder=""
                                    value={serviceName}
                                    onChange={(event) => {
                                        setServiceName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box>Fee Type</Box>
                                <Select
                                    value={feeType}
                                    label="Type"
                                    onChange={handleFeeTypeChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"Fixed Bid"}>Fixed Bid</MenuItem>
                                    <MenuItem value={"Hourly"}>Hourly</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                        

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            {
                                feeType === "Hourly" && (
                                    <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '50px',                                    
                                        }}
                                    >
                                        <Box>Number of hours</Box>
                                            <TextField
                                                name="num_hours"
                                                placeholder=""
                                                value={numHours}
                                                onChange={(event) => {
                                                    setNumHours(event.target.value);
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: '#D6D5DA',
                                                        height: '16px',
                                                    },
                                                }}
                                            />
                                        </Box>
                                )

                            }
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Charge</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="charge"
                                    placeholder=""
                                    value={charge}
                                    onChange={(event) => {
                                        setCharge(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            
                        </Box>

                        

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            {
                                feeType === "Hourly" && (
                                    <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '50px',                                    
                                        }}
                                    >
                                        <Box>Total Cost</Box>
                                            <TextField
                                                name="total_cost"
                                                placeholder=""
                                                value={totalCost}                                                
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: '#D6D5DA',
                                                        height: '16px',
                                                    },
                                                }}
                                            />
                                        </Box>
                                )

                            }
                            
                        </Box>

                        

                </Box>
                
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit"
                        onClick={handleAddService}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Add Service
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

function EditServiceDialog({ open, handleClose, onEditService, serviceIndex, services }) {

    const [serviceName, setServiceName] = useState(services[serviceIndex].service_name);
    useEffect(() => {
        console.log('FEE Name: ', serviceName);
    }, [serviceName]);

    const [feeType, setFeeType] = useState(services[serviceIndex].fee_type);
    useEffect(() => {
        console.log('FEE TYPE: ', feeType);
    }, [feeType]);

    const [numHours, setNumHours] = useState(services[serviceIndex].num_hours);
    useEffect(() => {
        console.log('numHours: ', numHours);
    }, [numHours]);

    const [charge, setCharge] = useState(services[serviceIndex].charge);
    useEffect(() => {
        console.log('Charge: ', charge);
    }, [charge]);


    const [totalCost, setTotalCost] = useState(services[serviceIndex].total_cost);
    useEffect(() => {
        console.log('totalCost: ', totalCost);
    }, [totalCost]);

    useEffect(() => {
        if(feeType === "Hourly"){
            setTotalCost(numHours * charge);
        }
    }, [numHours, charge, feeType]);


    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
    };

    const handleEditService = (event) => {
        event.preventDefault();

        console.log("EDIT SERVICE FORM SUBMITTED ");
        console.log('serviceName:', serviceName);
        console.log('numHours:', numHours);
        console.log('charge:', charge);
        console.log('feeType:', feeType);
        console.log('totalCost:', totalCost);

        const newService = {
            service_name: serviceName,
            charge: charge,
            ...(feeType === "Fixed Bid" && { charge: charge }),
            ...(feeType === "Hourly" && { hours: numHours }),
            ...(feeType === "Hourly" && { charge: charge }),
            ...(feeType === "Hourly" && { total_cost: totalCost }),
        }

        onEditService(newService, serviceIndex);
        handleClose();
    }

    return (
        <form onSubmit={handleEditService}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        Maintenance Services
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Service Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="service_name"
                                    placeholder=""
                                    value={serviceName}
                                    onChange={(event) => {
                                        setServiceName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box>Fee Type</Box>
                                <Select
                                    value={feeType}
                                    label="Type"
                                    onChange={handleFeeTypeChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"Fixed Bid"}>Fixed Bid</MenuItem>
                                    <MenuItem value={"Hourly"}>Hourly</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            {
                                feeType === "Hourly" && (
                                    <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '50px',                                    
                                        }}
                                    >
                                        <Box>Number of hours</Box>
                                            <TextField
                                                name="num_hours"
                                                placeholder=""
                                                value={numHours}
                                                onChange={(event) => {
                                                    setNumHours(event.target.value);
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: '#D6D5DA',
                                                        height: '16px',
                                                    },
                                                }}
                                            />
                                        </Box>
                                )

                            }
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Charge</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="charge"
                                    placeholder=""
                                    value={charge}
                                    onChange={(event) => {
                                        setCharge(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            
                        </Box>

                        

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            {
                                feeType === "Hourly" && (
                                    <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '50px',                                    
                                        }}
                                    >
                                        <Box>Total Cost</Box>
                                            <TextField
                                                name="total_cost"
                                                placeholder=""
                                                value={totalCost}                                                
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: '#D6D5DA',
                                                        height: '16px',
                                                    },
                                                }}
                                            />
                                        </Box>
                                )

                            }
                            
                        </Box>

                        

                </Box>


                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button type="submit" onClick={handleEditService}>Save Fee</Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

















function AddLocationDialog({ open, handleClose, onAddLocation }) {

    const [address, setAddress] = useState('');
    useEffect(() => {
        console.log('address: ', address);
    }, [address]);

    const [city, setCity] = useState('');
    useEffect(() => {
        console.log('city: ', city);
    }, [city]);

    const [state, setState] = useState('');
    useEffect(() => {
        console.log('state: ', state);
    }, [state]);

    const [miles, setMiles] = useState(0);
    useEffect(() => {
        console.log('miles: ', miles);
    }, [miles]);

    // const handleFeeTypeChange = (event) => {
    //     setFeeType(event.target.value);
    // };

    // const handleFrequencyChange = (event) => {
    //     setFeeFrequency(event.target.value)
    // }

    // const handleAppliedToChange = (event) => {
    //     setFeeAppliedTo(event.target.value)
    // }


    const handleAddLocation = (event) => {
        event.preventDefault();

        console.log("ADD LOCATION FORM SUBMITTED ");
        console.log('address:', address);
        console.log('city:', city);
        console.log('state:', state);
        console.log('miles:', miles);

        const newLocation = {
            address: address,
            city: city,
            state: state,
            miles: miles,
        }


        onAddLocation(newLocation);
        handleClose();
    }

    return (
        <form onSubmit={handleAddLocation}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        Business locations
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Address</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="address"
                                    placeholder=""
                                    value={address}
                                    onChange={(event) => {
                                        setAddress(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>City</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="city"
                                    placeholder=""
                                    value={city}
                                    onChange={(event) => {
                                        setCity(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>State</Box>
                                    <TextField
                                        name="state"
                                        placeholder=""
                                        value={state}
                                        onChange={(event) => {
                                            setState(event.target.value);
                                        }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                height: '16px',
                                            },
                                        }}
                                    />
                            </Box>
                        
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Miles</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="miles"
                                    placeholder=""
                                    value={miles}
                                    onChange={(event) => {
                                        setMiles(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            
                        </Box>

                        

                </Box>
                {/* <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            {
                                feeType === "Hourly" && (
                                    <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '50px',                                    
                                        }}
                                    >
                                        <Box>Total Cost</Box>
                                            <TextField
                                                name="total_cost"
                                                placeholder=""
                                                value={totalCost}                                                
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: '#D6D5DA',
                                                        height: '16px',
                                                    },
                                                }}
                                            />
                                        </Box>
                                )

                            }
                            
                        </Box>

                        

                </Box> */}
                
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit"
                        onClick={handleAddLocation}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Add Location
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}







function EditLocationDialog({ open, handleClose, onEditLocation, locationIndex, locations }) {

    const [address, setAddress] = useState(locations[locationIndex].address);
    useEffect(() => {
        console.log('Address: ', address);
    }, [address]);

    const [city, setCity] = useState(locations[locationIndex].city);
    useEffect(() => {
        console.log('city: ', city);
    }, [city]);

    const [state, setState] = useState(locations[locationIndex].state);
    useEffect(() => {
        console.log('state: ', state);
    }, [state]);

    const [miles, setMiles] = useState(locations[locationIndex].miles);
    useEffect(() => {
        console.log('miles: ', miles);
    }, [miles]);
    
    


    // const handleFeeTypeChange = (event) => {
    //     setFeeType(event.target.value);
    // };

    const handleEditLocation = (event) => {
        event.preventDefault();

        console.log("EDIT LOCATION FORM SUBMITTED ");
        console.log('address:', address);
        console.log('city:', city);
        console.log('state:', state);
        console.log('miles:', miles);

        const newLocation = {
            address: address,
            city: city,
            state: state,
            miles: miles,
        }

        onEditLocation(newLocation, locationIndex);
        handleClose();
    }

    return (
        <form onSubmit={handleEditLocation}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        Business Locations
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Address</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="address"
                                    placeholder=""
                                    value={address}
                                    onChange={(event) => {
                                        setAddress(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>City</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="city"
                                    placeholder=""
                                    value={city}
                                    onChange={(event) => {
                                        setCity(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',

                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >

                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>State</Box>
                                    <TextField
                                        name="state"
                                        placeholder=""
                                        value={state}
                                        onChange={(event) => {
                                            setState(event.target.value);
                                        }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                height: '16px',
                                            },
                                        }}
                                    />
                            </Box>
                                
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Miles</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="miles"
                                    placeholder=""
                                    value={miles}
                                    onChange={(event) => {
                                        setMiles(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            
                        </Box>

                        

                </Box>
                


                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button type="submit" onClick={handleEditLocation}>Save Location</Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}