import {
    Box,
    Button,
    CardMedia,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
    Radio,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import theme from '../../theme/theme';
import theme from '../../theme/theme';
// import ImageUploader from '../../ImageUploader';
import ImageUploader from "../ImageUploader";
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';

function Deposit(){

    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (value) => {
        console.log(value)
        setSelectedValue(value)
    };
  

    return (
        <Box>
            <Box justifyContent="left" paddingTop="12px">
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Deposit can be used for last month’s rent
                </Typography>
            </Box>
            <Stack
                direction="row"
                justifyContent="left"
                alignItems="center"
                padding="0"
            >
                <Grid container columnSpacing={12} rowSpacing={6}>
                    <Grid container item xs={3} alignItems="center">
                        <FormControlLabel
                            value="owner"
                            control={
                                <Radio 
                                    color="primary" 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#3D5CAC',
                                        }
                                    }}
                                />
                            }
                            label="Yes"
                            checked={selectedValue === "yes"}
                            onChange={() => handleChange("yes")}
                        />
                    </Grid>
                    <Grid container item xs={3} alignItems="center">
                        <FormControlLabel
                            value="yes"
                            control={
                                <Radio 
                                    color="primary" 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#3D5CAC',
                                        }
                                    }}
                                />
                            }
                            label="No"
                            checked={selectedValue === "no"}
                            onChange={() => handleChange("no")}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    )
}

function PetsAllowed(){
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (value) => {
        console.log(value)
        setSelectedValue(value)
    };
  

    return (
        <Box>
            <Box justifyContent="left" paddingTop="12px">
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Pets Allowed
                </Typography>
            </Box>
            <Stack
                direction="row"
                justifyContent="left"
                alignItems="center"
                padding="0"
            >
                <Grid container columnSpacing={12} rowSpacing={6}>
                    <Grid container item xs={3} alignItems="center">
                        <FormControlLabel
                            value="owner"
                            control={
                                <Radio 
                                    color="primary" 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#3D5CAC',
                                        }
                                    }}
                                />
                            }
                            label="Yes"
                            checked={selectedValue === "yes"}
                            onChange={() => handleChange("yes")}
                        />
                    </Grid>
                    <Grid container item xs={3} alignItems="center">
                        <FormControlLabel
                            value="yes"
                            control={
                                <Radio 
                                    color="primary" 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#3D5CAC',
                                        }
                                    }}
                                />
                            }
                            label="No"
                            checked={selectedValue === "no"}
                            onChange={() => handleChange("no")}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    )

}

function UtilityPaymentResponsibility() {
    const utilities = ["Electrical", "Trash", "Water", "Wifi", "Gas"];
    const [selectedValues, setSelectedValues] = useState({});

    useEffect(() => {
        setSelectedValues(
            utilities.reduce((acc, utility) => ({ ...acc, [utility]: 'tenant' }), {})
        );
    }, []);
  
    const handleChange = (utility, value) => {
        console.log(utility, value)
        setSelectedValues(prev => ({ ...prev, [utility]: value }));
    };
  
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            padding="0"
        >
            <Box>
                <Grid container columnSpacing={12} rowSpacing={6}>
                    <Grid container item xs={4}>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Utilities Paid By
                        </Typography>
                    </Grid>
                    <Grid container item xs={4} alignItems="center" justifyContent="center" sx={{ paddingLeft: "0px !important" }}>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light, fontSize:theme.typography.largeFont}}>
                            Tenant
                        </Typography>
                    </Grid>
                    <Grid container item xs={4} alignItems="center" justifyContent="center" sx={{ paddingLeft: "0px !important" }}>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light, fontSize:theme.typography.largeFont}}>
                            Owner
                        </Typography>
                    </Grid>
            
                    {utilities.map((utility) => (
                        <React.Fragment key={utility}>
                            <Grid item xs={4}>
                                <Typography  sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                    {utility}
                                </Typography>
                            </Grid>
                            <Grid container item xs={4} alignItems="center" justifyContent="center">
                                <FormControlLabel
                                    value="tenant"
                                    control={
                                        <Radio 
                                            color="primary" 
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3D5CAC',
                                                }
                                            }}
                                        />
                                    }
                                    label=""
                                    checked={selectedValues[utility] === 'tenant'}
                                    onChange={() => handleChange(utility, 'tenant')}
                                />
                            </Grid>
                            <Grid container item xs={4} alignItems="center" justifyContent="center">
                                <FormControlLabel
                                    value="owner"
                                    control={
                                        <Radio 
                                            color="primary" 
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3D5CAC',
                                                }
                                            }}
                                        />
                                    }
                                    label=""
                                    checked={selectedValues[utility] === 'owner'}
                                    onChange={() => handleChange(utility, 'owner')}
                                />
                            </Grid>
                        </React.Fragment>
                    
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
  }  


export default function AddPropertyForManager(){ 

    const [selectedImageList, setSelectedImageList] = useState([]);
    const [coverImage, setCoverImage] = useState("");

    const [address, setAddress] = useState("");
    const [unit, setUnit] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [type, setType] = useState("");
    const [squareFootage, setSquareFootage] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [propertyValue, setPropertyValue] = useState("");
    const [notes, setNotes] = useState("");
    const [description, setDescription] = useState("");
    const [activeDate, setActiveDate] = useState("");
    const [deposit, setDeposit] = useState("");
    const [rent, setRent] = useState("");


    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = selectedImageList.length;
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setCoverImage(selectedImageList[activeStep + 1].data_url);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setCoverImage(selectedImageList[activeStep - 1].data_url);
    };

    const handleBackButton = () => {
        navigate("/properties");
    }

    const navigate = useNavigate();

    const handleAddressChange = (event) => { setAddress(event.target.value) };
    const handleUnitChange = (event) => { setUnit(event.target.value) };
    const handleCityChange = (event) => { setCity(event.target.value) };
    const handleStateChange = (event) => { setState(event.target.value) };
    const handleZipCodeChange = (event) => { setZipCode(event.target.value) };
    const handleTypeChange = (event) => { setType(event.target.value) };
    const handleSquareFootageChange = (event) => { setSquareFootage(event.target.value) };
    const handleBedroomsChange = (event) => { setBedrooms(event.target.value) };
    const handleBathroomsChange = (event) => { setBathrooms(event.target.value) };
    const handlePropertyValueChange = (event) => { setPropertyValue(event.target.value) };
    const handleNotesChange = (event) => { setNotes(event.target.value) };
    const handleDescriptionChange = (event) => { setDescription(event.target.value) };
    const handleActiveDate = (event) => { setActiveDate(event.target.value) };
    const handleDepositChange = (event) => { setDeposit(event.target.value) };
    const handleRentChange = (event) => { setRent(event.target.value) };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("in handleSubmit")


        const formData = new FormData();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        
        formData.append('address', address);
        formData.append('unit', unit);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('zipCode', zipCode);
        formData.append('type', type);
        formData.append('squareFootage', squareFootage);
        formData.append('bedrooms', bedrooms);
        formData.append('bathrooms', bathrooms);
        formData.append('propertyValue', propertyValue);
        formData.append('notes', notes);
        formData.append('description', description);
        formData.append('activeDate', activeDate);
        formData.append('deposit', deposit);
        formData.append('rent', rent);
        
        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }

        // POST for Add Property

        const postData = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties", {
                    method: "POST",
                    body: formData,
                })
                const data = await response.json();
                console.log("data response", data)
            } catch (error) {
                console.log("Error posting data:", error);
            }
        }

        // PUT for Edit Property

        const putData = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties", {
                    method: "PUT",
                    body: formData,
                })
                const data = await response.json();
                console.log("data response", data)
            } catch (error) {
                console.log("Error posting data:", error);
            }
        }

    }


    return (
        <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit} id="addPropertyForm">
                <Stack
                    style={{
                        display: 'flex',
                        flexDirection: 'column', // Stack the content vertically
                        justifyContent: 'center',  // Center content vertically
                        alignItems: 'center',  // Center content horizontally
                        width: '100%',
                        minHeight: '100vh',
                        marginTop: theme.spacing(2),  // Adjust this for desired distance from the top
                        paddingBottom: "50px",
                    }}
                    >
                            <Paper
                                style={{
                                    margin: 'auto',
                                    backgroundColor: theme.palette.form.main,
                                    width: '85%', 
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingBottom:'25px'
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    position="relative"
                                >
                                    <Box
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Add Property 
                                        </Typography>
                                    </Box>
                                    <Box position="absolute" right={0}>
                                        {/* <Button onClick={() => handleBackButton()}>
                                            <CloseIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
                                        </Button> */}
                                    </Box>
                                </Stack>

                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    padding="25px"
                                >
                                    <Box
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <Grid container columnSpacing={12} rowSpacing={6}>
                                            {/* Select Field for Property */}


                                            <Grid item xs={12}>
                                                <div
                                                    style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "100%",
                                                    }}
                                                >
                                                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                                    {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                                </Button>
                                                    <CardMedia
                                                    component="img"
                                                    // image={selectedImageList[activeStep]}
                                                    image={coverImage}
                                                    sx={{
                                                        elevation: "0",
                                                        boxShadow: "none",
                                                        maxWidth: "150px",
                                                        minWidth: "150px",
                                                        maxHeight: "150px",
                                                        minHeight: "150px",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        center: "true",
                                                        alignContent: "center",
                                                        justifyContent: "center",
                                                    }}
                                                    />
                                                                                            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                                    {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                                </Button>
                                                </div>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
                                            </Grid>

                                            {/* Text Field for Title */}
                                            <Grid item xs={12}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Address
                                                </Typography>
                                                <TextField 
                                                    onChange={handleAddressChange} 
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </Grid>

                                            {/* Select Field for Issue and Cost Estimate */}
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Unit
                                                </Typography>
                                                <TextField 
                                                    onChange={handleUnitChange} 
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    City
                                                </Typography>
                                                <TextField 
                                                    onChange={handleCityChange} 
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    State
                                                </Typography>

                                                    <Select 
                                                        
                                                        sx={{
                                                            backgroundColor: 'white',
                                                            borderColor: 'black',
                                                            borderRadius: '7px',
                                                        }}
                                                        size="small"
                                                        fullWidth
                                                        onChange={handleStateChange} 
                                                    >
                                                        <MenuItem value={"CA"}>CA</MenuItem>
                                                        <MenuItem value={"TX"}>TX</MenuItem>
                                                        <MenuItem value={"FL"}>FL</MenuItem>
                                                        <MenuItem value={"NY"}>NY</MenuItem>
                                                        <MenuItem value={"IL"}>IL</MenuItem>
                                                        <MenuItem value={"AZ"}>AZ</MenuItem>
                                                    </Select>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Zip Code
                                                </Typography>
                                                <TextField
                                                    onChange={handleZipCodeChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    // onChange={handleCostChange}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Type
                                                </Typography>
                                                <Select
                                                    onChange={handleTypeChange} 
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    // onChange={handleUnitChange} 
                                                >
                                                    <MenuItem value={"Single Family"}>Single Family</MenuItem>
                                                    <MenuItem value={"Multi Family"}>Multi Family</MenuItem>
                                                    <MenuItem value={"Condo"}>Condo</MenuItem>
                                                    <MenuItem value={"Apartment"}>Apartment</MenuItem>
                                                    <MenuItem value={"Tiny Home"}>Tiny Home</MenuItem>
                                                    <MenuItem value={"Townhome"}>Townhome</MenuItem>
                                                    <MenuItem value={"Mobile Home"}>Mobile Home</MenuItem>
                                                    <MenuItem value={""}>""</MenuItem>
                                                </Select>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Square Footage
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    onChange={handleSquareFootageChange}
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    // onChange={handleCostChange}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Bedrooms
                                                </Typography>
                                                <TextField
                                                    onClick={handleBedroomsChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    // onChange={handleCostChange}
                                                />
                                            </Grid>
                                                    
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Bathrooms
                                                </Typography>
                                                <TextField
                                                    onClick={handleBathroomsChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    placeholder="# of bedrooms"
                                                />
                                            </Grid>
                                        </Grid>                              
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper
                                style={{
                                    margin: 'auto',
                                    backgroundColor: theme.palette.form.main,
                                    width: '85%', 
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingTop: '10px',
                                }}
                            >
                                <Stack
                                    paddingLeft="25px"
                                    paddingRight="25px"
                                    paddingTop="10px"
                                    paddingBottom="10px"
                                >
                                    <Box
                                        noValidate
                                        autoComplete="off"   
                                    >
                                        <Grid container columnSpacing={12} rowSpacing={6}>
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Active Date
                                                </Typography>
                                                <TextField
                                                    onClick={handleActiveDate}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    placeholder="MM/DD/YYYY"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Property Value
                                                </Typography>
                                                <TextField
                                                    onClick={handlePropertyValueChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">$</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Deposit
                                                </Typography>
                                                <TextField
                                                    onClick={handleDepositChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">$</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Rent
                                                </Typography>
                                                <TextField
                                                    onClick={handleRentChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">$</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper
                                style={{
                                    margin: 'auto',
                                    backgroundColor: theme.palette.form.main,
                                    width: '85%', 
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingTop: '10px',
                                }}
                            >
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    padding="25px"
                                >
                                    <Box
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <UtilityPaymentResponsibility/>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper
                                style={{
                                    margin: 'auto',
                                    backgroundColor: theme.palette.form.main,
                                    width: '85%', 
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingTop: '10px',
                                }}
                            >
                                <Stack
                                    paddingLeft="25px"
                                    paddingRight="25px"
                                    paddingTop="10px"
                                    paddingBottom="10px"
                                >
                                    <Box>
                                        <Deposit/>
                                        <PetsAllowed/>
                                    </Box>
                                </Stack>
                            </Paper>

                        <Paper
                                style={{
                                    margin: 'auto',
                                    backgroundColor: theme.palette.form.main,
                                    width: '85%', 
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingTop: '10px',
                                }}
                            >
                                <Stack
                                    paddingLeft="25px"
                                    paddingRight="25px"
                                    paddingTop="10px"
                                    paddingBottom="10px"
                                >
                                    <Box>
                                        <Grid container columnSpacing={12} rowSpacing={6}>
                                            <Grid item xs={12}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Property Description
                                                </Typography>
                                                <TextField
                                                    onClick={handleDescriptionChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    placeholder="Add description"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                    Owner Notes
                                                </Typography>
                                                <TextField
                                                    onClick={handleNotesChange}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    size="small"
                                                    placeholder="Add notes"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Stack>
                        </Paper>
                            {/* Submit Button */}
                    <Stack
                        paddingLeft="25px"
                        paddingRight="25px"
                        paddingTop="10px"
                        paddingBottom="100px"
                    >
                        <Box
                            style={{
                                
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Grid container columnSpacing={12} rowSpacing={6} sx={{display: 'flex'}}>
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained"     
                                        type="submit"
                                        form="addPropertyForm" 
                                        sx={{ 
                                            backgroundColor: "#9EAED6", 
                                            display: 'flex', 
                                            width: '100%'  // Set the button's width to 100%

                                        }}
                                    >
                                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                Save Property
                                        </Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Stack>
            </form>
        </ThemeProvider>
    )
}