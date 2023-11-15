import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider,
    TextField,
    MenuItem,
    Select,
    Grid,
    Checkbox,
    FormControlLabel,
    CardMedia,
    InputAdornment
} from "@mui/material";
import theme from '../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageUploader from '../ImageUploader';
import dataURItoBlob from '../utils/dataURItoBlob'
import defaultHouseImage from './defaultHouseImage.png'
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useUser } from "../../contexts/UserContext";
import IconButton from '@mui/material/IconButton';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function EditProperty({}){
    const { state } = useLocation();
    let navigate = useNavigate();
    const { getProfileId } = useUser();
    // const propertyData = location.state.item
    // const propertyId = location.state.propertyId;
    let { index, propertyList } = state;
    const propertyData = propertyList[index];
    // console.log("Property Id", propertyId)
    // console.log("Property Data in Edit Property", propertyData)
    const { user, selectedRole, selectRole, Name } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    const [ownerId, setOwnerId] = useState(getProfileId());

    const [address, setAddress] = useState(propertyData.property_address);
    const [city, setCity] = useState(propertyData.property_city);
    const [propertyState, setPropertyState] = useState(propertyData.property_state);
    const [zip, setZip] = useState(propertyData.property_zip);
    const [propertyType, setPropertyType] = useState(propertyData.property_type);
    const [squareFootage, setSquareFootage] = useState(propertyData.property_area);
    const [bedrooms, setBedrooms] = useState(propertyData.property_num_beds);
    const [bathrooms, setBathrooms] = useState(propertyData.property_num_baths);
    const [isListed, setListed] = useState(propertyData.property_available_to_rent===1?true:false);
    const [utilities, setUtiltiies] = useState(propertyData.property_utilities)
    const [activeDate, setActiveDate] = useState(propertyData.property_active_date);
    const [description, setDescription] = useState(propertyData.property_description);
    const [selectedImageList, setSelectedImageList] = useState(JSON.parse(propertyData.property_images));
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = selectedImageList.length;
    const [coverImage, setCoverImage] = useState(defaultHouseImage);
    const [notes, setNotes] = useState(propertyData.property_notes);
    const [unit, setUnit] = useState(propertyData.property_unit);
    const [propertyValue, setPropertyValue] = useState(propertyData.property_value);
    const [deposit, setDeposit] = useState(propertyData.property_deposit);
    const [listedRent, setListedRent] = useState(propertyData.property_listed_rent);
    const [petsAllowed, setPetsAllowed] = useState(propertyData.property_pets_allowed === 1 ? true : false);
    const [depositForRent, setDepositForRent] = useState(propertyData.property_deposit_for_rent === 1 ? true : false);
    const [taxes, setTaxes] = useState(propertyData.property_taxes);
    const [mortgages, setMortgages] = useState(propertyData.property_mortgages);
    const [insurance, setInsurance] = useState(propertyData.property_insurance);
    const [communityAmenities, setCommunityAmenities] = useState(propertyData.property_amenities_community);
    const [unitAmenities, setUnitAmenities] = useState(propertyData.property_amenities_unit);
    const [nearbyAmenities, setNearbyAmenities] = useState(propertyData.property_amenities_nearby);
    const [page, setPage] = useState("Edit");

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        setCoverImage(selectedImageList[0]?.data_url || coverImage);
    }, [selectedImageList])


    useEffect(() => {
        //property_utilities
    }, [utilities])

    useEffect(() => {
        console.log("Size of selectedImageList:", selectedImageList.length)
    }, [selectedImageList])

    const handleUnitChange = (event) => {
        console.log("handleUnitChange", event.target.value)
        setUnit(event.target.value);
    };


    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }

    const handleListedChange = (event) => {
        setListed(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("handleSubmit")
        const formData = new FormData();
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        formData.append("property_uid", propertyData.property_uid)
        formData.append('property_address', address);
        formData.append('property_unit', unit);
        formData.append('property_city', city);
        formData.append('property_state', propertyState);
        formData.append('property_zip', zip);
        formData.append('property_type', propertyType);
        formData.append('property_num_beds', bedrooms); // Double
        formData.append('property_num_baths', bathrooms); // Double
        formData.append('property_area', squareFootage);
        formData.append('property_listed_rent', listedRent); // Int
        formData.append('property_deposit', deposit); // Int
        formData.append('property_pets_allowed', petsAllowed ? 1 : 0);
        formData.append('property_deposit_for_rent', depositForRent ? 1 : 0); // Int
        formData.append('property_taxes', taxes);
        formData.append('property_mortgages', mortgages);
        formData.append('property_insurance', insurance);
        formData.append('property_featured', 0);
        formData.append('property_description', description);
        formData.append('property_notes', notes);
        formData.append('property_available_to_rent', isListed ? 1 : 0);
        formData.append('property_value', propertyValue);
        formData.append('property_active_date', activeDate);
        formData.append('property_utilities', utilities);
        formData.append('property_amenities_community', communityAmenities);
        formData.append('property_amenities_unit', unitAmenities);
        formData.append('property_amenities_nearby', nearbyAmenities);


        for (let i = 0; i < selectedImageList.length; i++) {
            try{
                console.log("selectedImageList[", i ,"]", selectedImageList[i])
                if (typeof(selectedImageList[i]) === "String" && selectedImageList[i].startsWith("http")){
                    if(i === 0){
                        formData.append("img_cover", selectedImageList[i]);
                    } else{
                        formData.append("img_" + (i-1), selectedImageList[i]);
                    }
                } else{
                    const imageBlob = dataURItoBlob(selectedImageList[i].data_url);
                    console.log(imageBlob)
                    if(i === 0){
                        formData.append("img_cover", imageBlob);
                    } else{
                        formData.append("img_" + (i-1), imageBlob);
                    }
                }
            } catch (error) { 
                console.log("error uploading images", error)
            }
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }

        const putData = async () => {
            setShowSpinner(true);
            try{
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties", {
                    method: "PUT",
                    body: formData
                })
                const data = await response.json();
                console.log("data", data)
                
                const updateResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${propertyData.property_uid}`);
                const updatedJson = await updateResponse.json();
                const updatedProperty = updatedJson.result[0];
                propertyList = propertyList.map(property => {
                    if(property.property_uid === updatedProperty.property_uid)
                        return { ...property, ...updatedProperty};
                    return property;
                });

            } catch(error){
                console.log("Error posting data:", error)
            }
            setShowSpinner(false);
            navigate("/propertyDetail", { state: { index, propertyList }});
        }
        putData();
    }



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
                    paddingBottom: "25px"
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
                                    Edit Property
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
                        >
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                autoComplete="off"
                                id="editPropertyForm"
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
                                            image={selectedImageList[activeStep]}
                                            // image={coverImage}
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
                                        <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList} page={page}/>
                                    </Grid>

                                    {/* Text Field for Title */}
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Address
                                        </Typography>
                                        <TextField 
                                            onChange={(e) => setAddress(e.target.value)}
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            placeholder={address}
                                            value={address}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>

                                    {/* Select Field for Issue and Cost Estimate */}
                                    <Grid item xs={6}>a
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Unit
                                        </Typography>
                                        <TextField 
                                            onChange={(e) => setUnit(e.target.value)} 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            placeholder={unit}
                                            value={unit}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            City
                                        </Typography>
                                        <TextField 
                                            onChange={(e) => setCity(e.target.value)} 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                            placeholder={propertyData.property_city}
                                            value={city}
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
                                                onChange={(e) => setPropertyState(e.target.value)}
                                                value={propertyState}
                                            >
                                                <MenuItem value={"AL"}>AL</MenuItem>
                                                <MenuItem value={"AK"}>AK</MenuItem>
                                                <MenuItem value={"AZ"}>AZ</MenuItem>
                                                <MenuItem value={"AR"}>AR</MenuItem>
                                                <MenuItem value={"CA"}>CA</MenuItem>
                                                <MenuItem value={"CO"}>CO</MenuItem>
                                                <MenuItem value={"CT"}>CT</MenuItem>
                                                <MenuItem value={"DE"}>DE</MenuItem>
                                                <MenuItem value={"DC"}>DC</MenuItem>
                                                <MenuItem value={"FL"}>FL</MenuItem>
                                                <MenuItem value={"GA"}>GA</MenuItem>
                                                <MenuItem value={"HI"}>HI</MenuItem>
                                                <MenuItem value={"ID"}>ID</MenuItem>
                                                <MenuItem value={"IL"}>IL</MenuItem>
                                                <MenuItem value={"IN"}>IN</MenuItem>
                                                <MenuItem value={"IA"}>IA</MenuItem>
                                                <MenuItem value={"KS"}>KS</MenuItem>
                                                <MenuItem value={"KY"}>KY</MenuItem>
                                                <MenuItem value={"LA"}>LA</MenuItem>
                                                <MenuItem value={"ME"}>ME</MenuItem>
                                                <MenuItem value={"MD"}>MD</MenuItem>
                                                <MenuItem value={"MA"}>MA</MenuItem>
                                                <MenuItem value={"MI"}>MI</MenuItem>
                                                <MenuItem value={"MN"}>MN</MenuItem>
                                                <MenuItem value={"MS"}>MS</MenuItem>
                                                <MenuItem value={"MO"}>MO</MenuItem>
                                                <MenuItem value={"MT"}>MT</MenuItem>
                                                <MenuItem value={"NE"}>NE</MenuItem>
                                                <MenuItem value={"NV"}>NV</MenuItem>
                                                <MenuItem value={"NH"}>NH</MenuItem>
                                                <MenuItem value={"NJ"}>NJ</MenuItem>
                                                <MenuItem value={"NM"}>NM</MenuItem>
                                                <MenuItem value={"NY"}>NY</MenuItem>
                                                <MenuItem value={"NC"}>NC</MenuItem>
                                                <MenuItem value={"ND"}>ND</MenuItem>
                                                <MenuItem value={"OH"}>OH</MenuItem>
                                                <MenuItem value={"OK"}>OK</MenuItem>
                                                <MenuItem value={"OR"}>OR</MenuItem>
                                                <MenuItem value={"PA"}>PA</MenuItem>
                                                <MenuItem value={"PR"}>PR</MenuItem>
                                                <MenuItem value={"RI"}>RI</MenuItem>
                                                <MenuItem value={"SC"}>SC</MenuItem>
                                                <MenuItem value={"SD"}>SD</MenuItem>
                                                <MenuItem value={"TN"}>TN</MenuItem>
                                                <MenuItem value={"TX"}>TX</MenuItem>
                                                <MenuItem value={"UT"}>UT</MenuItem>
                                                <MenuItem value={"VT"}>VT</MenuItem>
                                                <MenuItem value={"VA"}>VA</MenuItem>
                                                <MenuItem value={"VI"}>VI</MenuItem>
                                                <MenuItem value={"WA"}>WA</MenuItem>
                                                <MenuItem value={"WV"}>WV</MenuItem>
                                                <MenuItem value={"WI"}>WI</MenuItem>
                                                <MenuItem value={"WY"}>WY</MenuItem>
                                            </Select>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Zip Code
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            onChange={(e) => setZip(e.target.value)}
                                            value={zip}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Type
                                        </Typography>
                                        <Select 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                            onChange={(e) => setPropertyType(e.target.value)} 
                                            value={propertyType}
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
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            placeholder={squareFootage}
                                            onChange={(e) => setSquareFootage(e.target.value)}
                                            value={squareFootage}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Bedrooms
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            placeholder={bedrooms}
                                            onChange={(e) => setBedrooms(e.target.value)}
                                            value={bedrooms}
                                        />
                                    </Grid>
                                            
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Bathrooms
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            placeholder={bathrooms}
                                            onChange={(e) => setBathrooms(e.target.value)}
                                            value={bathrooms}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
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
                                            onChange={(e) => setPropertyValue(e.target.value)}
                                            value={propertyValue}
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
                                            placeholder={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            value={notes}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>

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
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            padding="25px"
                        >
                            <Grid container columnSpacing={12} rowSpacing={6}>
                                <Grid item xs={12}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Active Date
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        placeholder={activeDate}
                                        onChange={(e) => setActiveDate(e.target.value)}
                                        value={activeDate}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Deposit
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        placeholder={deposit}
                                        onChange={(e) => setDeposit(e.target.value)}
                                        value={deposit}
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
                                        fullWidth
                                        sx={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        placeholder={listedRent}
                                        onChange={(e) => setListedRent(e.target.value)}
                                        value={listedRent}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Deposit for Last Month's Rent
                                    </Typography>
                                    <Checkbox
                                            checked={depositForRent}
                                            onChange={(e) => setDepositForRent(e.target.checked)}
                                        />
                                </Grid>
                                <Grid item xs={6}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Pets Allowed
                                    </Typography>
                                    <Checkbox
                                        checked={petsAllowed}
                                        onChange={(e) => setPetsAllowed(e.target.checked)}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                                    
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
                            direction="column"
                            justifyContent="left"
                            alignItems="left"
                            padding="25px"
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
                                <Grid container columnSpacing={12} rowSpacing={6}>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Utilities Paid by
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Electricity
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            value={"owner"}
                                            label="Electricity"
                                            onChange={(e) => console.log(e.target.value)}
                                            sx={{backgroundColor: "#FFFFFF"}}
                                            size="small"
                                        >
                                            <MenuItem value={"owner"}>Owner</MenuItem>
                                            <MenuItem value={"tenant"}>Tenant</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Trash
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            value={"tenant"}
                                            label="Trash"
                                            onChange={(e) => console.log(e.target.value)}
                                            sx={{backgroundColor: "#FFFFFF"}}
                                            size="small"
                                        >
                                            <MenuItem value={"owner"}>Owner</MenuItem>
                                            <MenuItem value={"tenant"}>Tenant</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Water
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            value={"tenant"}
                                            label="Water"
                                            onChange={(e) => console.log(e.target.value)}
                                            sx={{backgroundColor: "#FFFFFF"}}
                                            size="small"
                                        >
                                            <MenuItem value={"owner"}>Owner</MenuItem>
                                            <MenuItem value={"tenant"}>Tenant</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Wifi
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            value={"tenant"}
                                            label="Wifi"
                                            onChange={(e) => console.log(e.target.value)}
                                            sx={{backgroundColor: "#FFFFFF"}}
                                            size="small"
                                        >
                                            <MenuItem value={"owner"}>Owner</MenuItem>
                                            <MenuItem value={"tenant"}>Tenant</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Gas
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            value={"tenant"}
                                            label="Gas"
                                            onChange={(e) => console.log(e.target.value)}
                                            sx={{backgroundColor: "#FFFFFF"}}
                                            size="small"
                                        >
                                            <MenuItem value={"owner"}>Owner</MenuItem>
                                            <MenuItem value={"tenant"}>Tenant</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>

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
                            direction="column"
                            justifyContent="left"
                            alignItems="left"
                            padding="25px"
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container columnSpacing={12} rowSpacing={6}>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Property Description
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            placeholder={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            value={description}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Property Amenities
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            placeholder={unitAmenities}
                                            onChange={(e) => setUnitAmenities(e.target.value)}
                                            value={unitAmenities}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Community Amenities
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            placeholder={communityAmenities}
                                            onChange={(e) => setCommunityAmenities(e.target.value)}
                                            value={communityAmenities}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Nearby Amenities
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            placeholder={nearbyAmenities}
                                            onChange={(e) => setNearbyAmenities(e.target.value)}
                                            value={nearbyAmenities}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>
                    {/* {selectedRole==='MANAGER'?
                    <Stack
                        direction="column"
                        justifyContent="left"
                        padding="15px"
                        width="85%"
                    >
                        <FormControlLabel control={
                            <Checkbox
                                checked={isListed}
                                onChange={handleListedChange}
                            />}
                            label="Available to rent"
                        />
                    </Stack>
                    :<div></div>}  */}
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
                                marginBottom: '30px',
                                width: '100%',
                                paddingBottom: '30px'
                            }}
                        >
                        <Grid container>
                            <Grid item xs={12}>
                                {/* <Button variant="contained" onClick={() => testButton()} sx={{ width: '100%', backgroundColor: theme.typography.formButton.background }}> */}
                                <Button variant="contained" type="submit" form="editPropertyForm"  sx={{ width: '100%', backgroundColor: theme.typography.formButton.background }}>
                                    <Typography sx={{color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Update Property
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