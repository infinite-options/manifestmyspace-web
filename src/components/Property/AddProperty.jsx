import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
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
    InputAdornment
} from "@mui/material";
import theme from '../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';
import dataURItoBlob from '../utils/dataURItoBlob'
import defaultHouseImage from './defaultHouseImage.png'
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function AddProperty({}){
    const location = useLocation();
    let navigate = useNavigate();
    const { getProfileId } = useUser();
    const { user, selectedRole, selectRole, Name } = useUser();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [type, setType] = useState('');
    const [squareFootage, setSquareFootage] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [deposit, setDeposit] = useState(0);
    const [petsAllowed, setPetsAllowed] = useState(0);
    const [depositForRent, setDepositForRent] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [mortgages, setMortgages] = useState(0);
    const [insurance, setInsurance] = useState(0);
    const [notes, setNotes] = useState('');
    const [coverImage, setCoverImage] = useState(defaultHouseImage);
    const [activeStep, setActiveStep] = useState(0);


    const [ownerId, setOwnerId] = useState(getProfileId());

    const [unit, setUnit] = useState('');

    const [description, setDescription] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('');
    const [ownerList, setOwnerList] = useState([]);
    const [selectedImageList, setSelectedImageList] = useState([]);
    const maxSteps = selectedImageList.length;

    useEffect(() => {
        console.log("useEffect")
        setCoverImage(selectedImageList[0]?.data_url || coverImage);

        const getOwnerContacts = async () => {
                try {
                    //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contacts/`+);
                    const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contacts/600-000035`);
    
                    if(!response.ok){
                        console.log("Error fetching owner data")
                    }
                    const ownerdata = await response.json();
                    console.log("Owner Data", ownerdata.management_contacts.owners)

                    let contactArray = ownerdata.management_contacts.owners;
                    let ownerObjList = [];
                    contactArray.forEach((contact)=>{
                        let obj ={
                            owner_id : contact.contact_uid,
                            owner_name : contact.contact_first_name+" "+contact.contact_last_name,
                        }
                        ownerObjList.push(obj)
                    });
                    setOwnerList(ownerObjList);
        
                } catch (error) {
                    console.log(error);
                }
            }
            getOwnerContacts();
    
    }, [selectedImageList])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };  

    const handleZipCodeChange = (event) => {
        setZip(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const handleSquareFootageChange = (event) => {
        setSquareFootage(event.target.value);
    };

    const handleBedroomsChange = (event) => {
        setBedrooms(event.target.value);
    };

    const handleBathroomsChange = (event) => {
        setBathrooms(event.target.value);
    };

    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }

    const handleStateChange = (event) => {
        setState(event.target.value);
    };

    const handleDepositChange = (event) => {
        setDeposit(event.target.value);
    };

    const handlePetsAllowedChange = (event) => {
        setPetsAllowed(event.target.value);
    };

    const handleDepositForRentChange = (event) => {
        setDepositForRent(event.target.value);
    };

    const handleTaxesChange = (event) => {
        setTaxes(event.target.value);
    };

    const handleMortgagesChange = (event) => {
        setMortgages(event.target.value);
    };

    const handleInsuranceChange = (event) => {
        setInsurance(event.target.value);
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const handleOwnerChange = (event) => {
        setSelectedOwner(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target)
        setShowSpinner(true);
        const formData = new FormData();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        formData.append('property_owner_id', ownerId);
        formData.append('available_to_rent', 1);
        formData.append('active_date', formattedDate);
        formData.append('property_address', address);
        formData.append('property_unit', unit);
        formData.append('property_city', city);
        formData.append('property_state', state);
        formData.append('property_zip', zip);
        formData.append('property_type', type);
        formData.append('property_num_beds', bedrooms);
        formData.append('property_num_baths', bathrooms);
        formData.append('property_area', squareFootage);
        formData.append('property_listed', 0);
        formData.append('property_deposit', deposit);
        formData.append('property_pets_allowed', petsAllowed);
        formData.append('property_deposit_for_rent', depositForRent);
        formData.append('property_taxes', taxes);
        formData.append('property_mortgages', mortgages);
        formData.append('property_insurance', insurance);
        formData.append('property_featured', 0);
        formData.append('property_description', description);
        formData.append('property_notes', notes);
        formData.append('property_owner_id', selectedOwner);

        for (let i = 0; i < selectedImageList.length; i++) {
            console.log("selectedImageList[i].file", selectedImageList[i].data_url)
            const imageBlob = dataURItoBlob(selectedImageList[i].data_url);
            console.log(imageBlob)
            if(i === 0){
                formData.append("img_cover", imageBlob);
            } else{
                formData.append("img_" + (i-1), imageBlob);
            }
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }

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

        setAddress('');
        setCity('');
        setState('');
        setZip('');
        setType('');
        setSquareFootage('');
        setBedrooms('');
        setBathrooms('');
        setDeposit(0);
        setPetsAllowed(0);
        setDepositForRent(0);
        setTaxes(0);
        setMortgages(0);
        setInsurance(0);
        setNotes('');
        setCoverImage(defaultHouseImage);
        setSelectedImageList([]);
        setActiveStep(0);
        setShowSpinner(false);
        navigate('/properties');
    };


    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack the content vertically
                    justifyContent: 'flex-start',  // Start content at the top
                    alignItems: 'center',  // Center content horizontally
                    width: '100%',
                    minHeight: '100vh',
                    marginTop: theme.spacing(2),  // Adjust this for desired distance from the top
                    paddingBottom: "50px"
                }}
                >
                    <Paper
                        style={{
                            margin: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: theme.palette.form.main,
                            width: '85%', // Occupy full width with 25px margins on each side
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
                                <Button onClick={() => handleBackButton()}>
                                    <CloseIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
                                </Button>
                            </Box>
                        </Stack>

                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            padding="25px"
                            onSubmit={handleSubmit}
                        >
                            <Box
                                component="form"
                                sx={{
                                    // '& .MuiTextField-root': { m: 1, width: '25ch' },
                                }}
                                noValidate
                                autoComplete="off"
                                id="addPropertyForm"
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
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Property Value
                                        </Typography>
                                        <TextField
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
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Owner Notes
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            onChange={handleNotesChange}
                                        />
                                    </Grid>
                                   <Grid item xs={12}>
                                   {selectedRole==='MANAGER'?<div>

                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Owner 
                                        </Typography>
                                        <Select  sx={{
                                                    backgroundColor: 'white',
                                                    borderColor: 'black',
                                                    borderRadius: '7px',
                                                }}
                                                size="small"
                                                fullWidth value={selectedOwner} onChange={handleOwnerChange} displayEmpty>
                                        <MenuItem value="" disabled>
                                            Select Owner
                                        </MenuItem>
                                        {ownerList.map((option, index) => (
                                            <MenuItem key={index} value={option.owner_id}>
                                            {option.owner_name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    
                                   </div>:<div></div>} 
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
                            display: 'flex',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                            }}
                            noValidate
                            autoComplete="off"
                        >
                        <Grid container columnSpacing={12} rowSpacing={6} sx={{display: 'flex'}}>
                            <Grid item xs={12}>
                                <Button variant="contained" type="submit" form="addPropertyForm" sx={{backgroundColor: "#9EAED6", "&:hover, &:focus, &:active": {background: "#9EAED6" }}}>
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Save Property
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </Stack>
        </ThemeProvider>
    )
}