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

export default function EditProfileSettingsManager() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    let manager_data = location.state.manager_data;
    const [modifiedData, setModifiedData] = useState({ 'business_uid': manager_data?.business_uid, });
    const [isEdited, setIsEdited] = useState(false);

    const [businessName, setBusinessName] = useState(manager_data.business_name? manager_data.business_name : '');
    const [emailAddress, setEmailAddress] = useState(manager_data.business_email? manager_data.business_email : '');
    const [phoneNumber, setPhoneNumber] = useState(manager_data.business_phone_number? manager_data.business_phone_number : '');
    const [address, setAddress] = useState(manager_data.business_address? manager_data.business_address : '');
    const [unit, setUnit] = useState(manager_data.business_unit? manager_data.business_unit : '');
    const [city, setCity] = useState(manager_data.business_city? manager_data.business_city : '');
    const [state, setState] = useState(manager_data.business_state? manager_data.business_state : '');
    const [zipCode, setZipCode] = useState(manager_data.business_zip? manager_data.business_zip : '');
    const [managementFees, setManagementFees] = useState(manager_data.business_services_fees? JSON.parse(manager_data.business_services_fees) : []);
    const [EIN, setEIN] = useState(manager_data.business_ein_number? manager_data.business_ein_number : '');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [displayed_Image, set_displayed_Image] = useState(null);

    const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
    const [showEditFeeDialog, setShowEditFeeDialog] = useState(false);
    const [indexForEditFeeDialog, setIndexForEditFeeDialog] = useState(false);


    useEffect(() => {
        console.log("managerFees updated - ", managementFees)
        setModifiedData((prevData) => ({
            ...prevData,
            'business_services_fees': JSON.stringify(managementFees)
        }));
        setIsEdited(true);
    }, [managementFees]);

    const getFormattedFeeFrequency = (frequency) => {
        // console.log("getFormattedFeeFrequency(), frequency", frequency);
        let freq = ""
        switch(frequency){
            case "one-time":
                freq =  "One Time";
                break;
            case "hourly":
                freq =  "Hourly";
                break;
            case "daily":
                freq =  "Daily";
                break;
            case "weekly":
                freq =  "Weekly";
                break;
            case "bi-weekly":
                freq =  "Biweekly";
                break;
            case "monthly":
                freq =  "Monthly";
                break;
            case "annually":
                freq =  "Annual";
                break;
            default:
                freq =  "<FREQUENCY>";
        }
        return freq;       
    }

    const handleOpenAddFee = () => {
        setShowAddFeeDialog(true);
    };

    const handleCloseAddFee = () => {
        setShowAddFeeDialog(false);
    };

    const handleOpenEditFee = (feeIndex) => {
        setShowEditFeeDialog(true);
        console.log("EDITING FEE, Index", feeIndex);
        setIndexForEditFeeDialog(feeIndex);
    };

    const handleCloseEditFee = () => {
        setShowEditFeeDialog(false);
    };

    const handleAddFee = (newFee) => {
        setManagementFees((prevManagerFees) => [...prevManagerFees, newFee]);
    }

    const handleEditFee = (newFee, index) => {
        console.log("IN handleEditFee of PropertyCard");
        console.log(newFee, index);
        setManagementFees((prevManagerFees) => {
            const updatedManagerFees = prevManagerFees.map((fee, i) => {
                if (i === index) {
                    return newFee;
                }
                return fee;
            });
            return updatedManagerFees;
        });
    }

    const handleDeleteFee = (index, event) => {
        console.log("Manager Fees", managementFees);
        setManagementFees(prevFees => {
            const feesArray = Array.from(prevFees);
            feesArray.splice(index, 1);
            return feesArray;
        });
        event.stopPropagation();
    }

    // Main use Effect
    useEffect(()=>{
        console.log('EditProfileSettingsManager useEffect');
    }, []);

    // Handle changes to form fields
    const handleInputChange = (event) => {
        console.log("Input changed")
        const { name, value } = event.target;
        // console.log(name)
        // console.log(value)

        if (name === 'business_name') {
            setBusinessName(value);
        } else if (name === 'business_email') {
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
        if (file) {
            const reader = new FileReader();
      
            reader.onload = (e) => {
                set_displayed_Image(e.target.result);
            };
      
            reader.readAsDataURL(file);
          }

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
        if (uploadedImage) {
            formData.append("business_photo", uploadedImage);
        }
    
        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "*"
        };
    
        if (isEdited) {
            console.log("EDITED");
    
            // Perform the update asynchronously
            axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', formData, headers)
                .then((response) => {
                    console.log('Data updated successfully');
                    setIsEdited(false); // Reset the edit status
                    navigate('/pmProfile');
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.data);
                    }
                });
        }
    };
    

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
                    {   displayed_Image !== null ? (
                        
                        <img
                            src={displayed_Image}
                            alt="Profile Photo"
                            style={{
                                borderRadius: '50%',
                                color: theme.typography.common.blue,
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                left: 0
                            }}
                        />):
                        (manager_data.business_photo_url !== null ? (
                        <img
                            src={manager_data.business_photo_url}
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
                    ))}
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
                    {manager_data.business_name? manager_data.business_name : '<BUSINESS_NAME>'}
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
                        Manager Profile
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
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                        <Stack spacing={-2} m={2}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Business Name</Typography>
                        <TextField name="business_name" value={businessName} onChange={handleInputChange} variant="filled" fullWidth placeholder="3" className={classes.root}></TextField>
                        </Stack>
                    </Grid>
                    
                    
                    </Grid>
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
                                Management Fees
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
                                onClick={handleOpenAddFee}
                            >
                                {/* <EditIcon  sx={{ fontSize: 16, color: '#3D5CAC'}} /> */}
                                Add a Fee
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
                            {managementFees.length === 0 ? (
                                // <p>No fees to display</p>
                                <Box
                                    sx={{
                                        height: "13px",
                                    }}
                                >
                                    No fees to display
                                </Box>
                            ) : (
                                managementFees.map((fee, index) => (
                                    <Box 
                                        key={index}
                                        // FeeIndex={index}
                                        sx = {{
                                            display: 'flex',
                                            flexDirection: 'column',

                                        }}
                                        onClick={() => handleOpenEditFee(index)}
                                    >
                                        <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}

                                        >
                                            <Box>{getFormattedFeeFrequency(fee.frequency)} {fee.fee_name}: {fee.fee_type === "PERCENT" ? `${fee.charge}% of ${fee.of}` : ` $${fee.charge}`}</Box>

                                            <Button 
                                                variant="text"
                                                onClick={(event) => {
                                                    handleDeleteFee(index, event);
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
                        {showAddFeeDialog && (
                            <Box>
                                <AddFeeDialog open={showAddFeeDialog} handleClose={handleCloseAddFee} onAddFee={handleAddFee} />
                            </Box>
                        )}
                        {showEditFeeDialog && (
                            <Box>
                                <EditFeeDialog open={showEditFeeDialog} handleClose={handleCloseEditFee} onEditFee={handleEditFee} feeIndex={indexForEditFeeDialog} fees={managementFees} />
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

function AddFeeDialog({ open, handleClose, onAddFee }) {

    const [feeName, setFeeName] = useState('');
    useEffect(() => {
        console.log('FEE Name: ', feeName);
    }, [feeName]);

    const [feeType, setFeeType] = useState('PERCENT');
    useEffect(() => {
        console.log('FEE TYPE: ', feeType);
    }, [feeType]);

    const [isPercentage, setIsPercentage] = useState(true);
    useEffect(() => {
        console.log('IS PERCENTAGE?: ', isPercentage);
    }, [isPercentage]);

    const [percentage, setPercentage] = useState('0');
    useEffect(() => {
        console.log('PERCENTAGE: ', percentage);
    }, [percentage]);

    const [isFlatRate, setIsFlatRate] = useState(false);
    useEffect(() => {
        console.log('IS FLAT RATE?: ', isFlatRate);
    }, [isFlatRate]);

    const [feeAmount, setFlatRate] = useState('0');
    useEffect(() => {
        console.log('FEE TYPE: ', feeAmount);
    }, [feeAmount]);

    const [feeFrequency, setFeeFrequency] = useState("One Time");
    useEffect(() => {
        console.log('FEE FREQUENCY: ', feeFrequency);
    }, [feeFrequency]);

    const [feeAppliedTo, setFeeAppliedTo] = useState("Gross Rent");
    useEffect(() => {
        console.log('FEE APPLIED TO: ', feeAppliedTo);
    }, [feeAppliedTo]);

    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
        // console.log("FEE TYPE SELECTED", event.target.value);
        // console.log('FEE TYPE: ', selectedFeeType);

        // if(event.target.value === "PERCENT"){
        //     setIsPercentage(true)
        //     setIsFlatRate(false);
        // }else{
        //     setIsFlatRate(true);
        //     setIsPercentage(false)
        // } 
    };

    const handleFrequencyChange = (event) => {
        setFeeFrequency(event.target.value)
    }

    const handleAppliedToChange = (event) => {
        setFeeAppliedTo(event.target.value)
    }


    const handleAddFee = (event) => {
        event.preventDefault();

        console.log("ADD FEE FORM SUBMITTED ");
        console.log('feeName:', feeName);
        console.log('feeFrequency:', feeFrequency);
        console.log('feeType:', feeType);
        console.log('Is percentage?:', isPercentage);
        console.log('percentage:', percentage);
        console.log('Is feeAmount?:', isFlatRate);
        console.log('feeAmount:', feeAmount);
        console.log('feeAppliedTo:', feeAppliedTo);

        // const newFee = {
        //     fee_name: feeName,
        //     fee_type: feeType,
        //     frequency: feeFrequency,
        //     isPercentage: isPercentage,
        //     ...(isPercentage && { charge: percentage }),
        //     ...(isPercentage && { of: feeAppliedTo }),
        //     isFlatRate: isFlatRate,
        //     ...(isFlatRate && { charge: feeAmount }),
        // }

        const newFee = {
            fee_name: feeName,
            fee_type: feeType,
            frequency: feeFrequency,
            ...(feeType === "PERCENT" && { charge: percentage }),
            ...(feeType === "PERCENT" && { of: feeAppliedTo }),
            ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
        }


        onAddFee(newFee);
        handleClose();
    }

    return (
        <form onSubmit={handleAddFee}>
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

                        Management Fees
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
                                <Box>Fee Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="fee_name"
                                    placeholder=""
                                    value={feeName}
                                    onChange={(event) => {
                                        setFeeName(event.target.value);
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
                                <Box>Frequency</Box>
                                {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
                                {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"one-time"}>One Time</MenuItem>
                                    <MenuItem value={"hourly"}>hourly</MenuItem>
                                    <MenuItem value={"daily"}>daily</MenuItem>
                                    <MenuItem value={"weekly"}>weekly</MenuItem>
                                    <MenuItem value={"bi-weekly"}>biweekly</MenuItem>
                                    <MenuItem value={"monthly"}>monthly</MenuItem>
                                    <MenuItem value={"annually"}>annually</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '15px',
                            color: '#3D5CAC',
                    }}
                >
                    <RadioGroup
                        row
                        aria-label="fee-type-group-label"
                        name="fee-type-radio-buttons-group"
                        value={feeType}
                        onChange={handleFeeTypeChange}
                    >
                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >



                            <FormControlLabel value="PERCENT" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Percent" />
                            {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
                            {feeType === 'PERCENT' && (
                                <Box>
                                    <TextField
                                        value={percentage}
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setPercentage(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Flat Rate" />
                            <Box sx={{width: '60px', height: '20px',}}>
                        </Box>

                        </Box>
                        {feeType === 'FLAT-RATE' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Amount
                                    <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                            {feeType === 'PERCENT' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Applied To
                                    {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}
                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                                    <Select
                                        value={feeAppliedTo}
                                        label="Applied To"
                                        onChange={handleAppliedToChange}
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                            width: '200px', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                        <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                                        <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                                        <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                                    </Select>
                                </Box>
                            )}
                    </RadioGroup> 
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
                        onClick={handleAddFee}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Add Fee
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

function EditFeeDialog({ open, handleClose, onEditFee, feeIndex, fees }) {

    const [feeName, setFeeName] = useState(fees[feeIndex].fee_name);
    useEffect(() => {
        console.log('FEE Name: ', feeName);
    }, [feeName]);

    const [feeType, setFeeType] = useState(fees[feeIndex].fee_type);
    useEffect(() => {
        console.log('FEE TYPE: ', feeType);
    }, [feeType]);

    const [isPercentage, setIsPercentage] = useState(fees[feeIndex].isPercentage);
    useEffect(() => {
        console.log('IS PERCENTAGE?: ', isPercentage);
    }, [isPercentage]);

    const [percentage, setPercentage] = useState(fees[feeIndex].charge);
    useEffect(() => {
        console.log('PERCENTAGE: ', percentage);
    }, [percentage]);

    const [isFlatRate, setIsFlatRate] = useState(fees[feeIndex].isFlatRate);
    useEffect(() => {
        console.log('IS FLAT RATE?: ', isFlatRate);
    }, [isFlatRate]);

    const [feeAmount, setFlatRate] = useState(fees[feeIndex].charge);
    useEffect(() => {
        console.log('FEE TYPE: ', feeAmount);
    }, [feeAmount]);

    const [feeFrequency, setFeeFrequency] = useState(fees[feeIndex].frequency);
    useEffect(() => {
        console.log('FEE FREQUENCY: ', feeFrequency);
    }, [feeFrequency]);

    const [feeAppliedTo, setFeeAppliedTo] = useState(fees[feeIndex].of);
    useEffect(() => {
        console.log('FEE APPLIED TO: ', feeAppliedTo);
    }, [feeAppliedTo]);

    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
        // console.log('FEE TYPE: ', selectedFeeType);
        if(event.target.value === "PERCENT"){
            setIsPercentage(true)
            setIsFlatRate(false);
        }else{
            setIsFlatRate(true);
            setIsPercentage(false)
        } 
    };

    const handleFrequencyChange = (event) => {
        setFeeFrequency(event.target.value)
    }

    const handleAppliedToChange = (event) => {
        setFeeAppliedTo(event.target.value)
    }


    const handleEditFee = (event) => {
        event.preventDefault();

        console.log("FORM SUBMITTED ");
        console.log('feeName:', feeName);
        console.log('feeFrequency:', feeFrequency);
        console.log('feeType:', feeType);
        console.log('Is percentage?:', isPercentage);
        console.log('percentage:', percentage);
        console.log('Is feeAmount?:', isFlatRate);
        console.log('feeAmount:', feeAmount);
        console.log('feeAppliedTo:', feeAppliedTo);

        // const newFee = {
        //     fee_name: feeName,
        //     fee_type: feeType,
        //     frequency: feeFrequency,
        //     isPercentage: isPercentage,
        //     ...(isPercentage && { charge: percentage }),
        //     ...(isPercentage && { of: feeAppliedTo }),
        //     isFlatRate: isFlatRate,
        //     ...(isFlatRate && { charge: feeAmount }),
        // }
        const newFee = {
            fee_name: feeName,
            fee_type: feeType,
            frequency: feeFrequency,
            ...(feeType === "PERCENT" && { charge: percentage }),
            ...(feeType === "PERCENT" && { of: feeAppliedTo }),
            ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
        }
        onEditFee(newFee, feeIndex); // pass index also
        handleClose();
    }

    return (
        <form onSubmit={handleEditFee}>
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

                        Management Fees
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
                                <Box>Fee Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="fee_name"
                                    placeholder=""
                                    value={feeName}
                                    onChange={(event) => {
                                        setFeeName(event.target.value);
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
                                <Box>Frequency</Box>
                                {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
                                {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"one-time"}>One Time</MenuItem>
                                    <MenuItem value={"hourly"}>Hourly</MenuItem>
                                    <MenuItem value={"daily"}>Daily</MenuItem>
                                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                                    <MenuItem value={"bi-weekly"}>Biweekly</MenuItem>
                                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                                    <MenuItem value={"annually"}>Annually</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '15px',
                            color: '#3D5CAC',
                    }}
                >
                    <RadioGroup
                        row
                        aria-label="fee-type-group-label"
                        name="fee-type-radio-buttons-group"
                        value={feeType}
                        onChange={handleFeeTypeChange}
                    >
                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >



                            <FormControlLabel value="PERCENT" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Percent" />
                            {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
                            {feeType === 'PERCENT' && (
                                <Box>
                                    <TextField
                                        value={percentage}
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setPercentage(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Flat Rate" />
                            <Box sx={{width: '60px', height: '20px',}}>
                        </Box>

                        </Box>
                        {feeType === 'FLAT-RATE' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Amount
                                    <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                            {feeType === 'PERCENT' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Applied To
                                    {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}
                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                                    <Select
                                        value={feeAppliedTo}
                                        label="Applied To"
                                        onChange={handleAppliedToChange}
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                            width: '200px', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                        <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                                        <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                                        <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                                    </Select>
                                </Box>
                            )}
                    </RadioGroup> 
                </Box>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button type="submit" onClick={handleEditFee}>Save Fee</Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}
