import React, { useState, useEffect, Fragment } from 'react';
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
    InputAdornment,
    Radio,
    Menu,
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
import { Assessment } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function EditProperty({}){
    const { state } = useLocation();
    let navigate = useNavigate();
    const { getProfileId } = useUser();
    // const propertyData = location.state.item
    // const propertyId = location.state.propertyId;
    let { index, propertyList, page } = state;    
    const [propertyData, setPropertyData] = useState(propertyList[index]);
    // console.log("Property Id", propertyId)
    console.log("Property Data in Edit Property", propertyData)
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
    const [imageState, setImageState] = useState([]);
    const [deletedImageList, setDeletedImageList] = useState([]);
    const [favImage, setFavImage] = useState(propertyData.property_favorite_image);
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = selectedImageList.length;
    const [notes, setNotes] = useState(propertyData.property_notes);
    const [unit, setUnit] = useState(propertyData.property_unit);
    const [propertyValue, setPropertyValue] = useState(propertyData.property_value);
    const [assessmentYear, setAssessmentYear] = useState(propertyData.property_value_year);
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
    // const [page, setPage] = useState("Edit");

    useEffect(() => {
        console.log("deletedImageList - ", deletedImageList);
    }, [deletedImageList]);
    const [mappedUtilitiesPaidBy, setMappedUtilitiesPaidBy] = useState({});
    const [newUtilitiesPaidBy, setNewUtilitiesPaidBy] = useState({});

    const [isDefaultUtilities, setIsDefaultUtilities] = useState(false);

    const utilitiesMap = new Map([
        ['050-000001', 'electricity'],
        ['050-000002', 'water'],
        ['050-000003', 'gas'],
        ['050-000004', 'trash'],
        ['050-000005', 'sewer'],
        ['050-000006', 'internet'],
        ['050-000007', 'cable'],
        ['050-000008', 'hoa_dues'],
        ['050-000009', 'security_system'],
        ['050-000010', 'pest_control'],
        ['050-000011', 'gardener'],
        ['050-000012', 'maintenance'],
    ]);

    const entitiesMap = new Map([
        ['050-000041', 'owner'],
        ['050-000042', 'property manager'],
        ['050-000043', 'tenant'],
        ['050-000049', 'user'],
    ]);

    const reverseUtilitiesMap = new Map(Array.from(utilitiesMap, ([key, value]) => [value, key]));
    const reverseEntitiesMap = new Map(Array.from(entitiesMap, ([key, value]) => [value, key]));


    const mapUIDsToUtilities = (propertyUtilities) => {
        // let propertyUtilities = JSON.parse(utilities)
        if(!propertyUtilities){
            return {}
        }
        console.log("----- in mapUIDsToUtilities, input - ", propertyUtilities);
        const mappedUtilities = {};
        for (const key of Object.keys(propertyUtilities)) {
            const utilityName = utilitiesMap.get(key);
            const entityName = entitiesMap.get(propertyUtilities[key]);
        
            if (utilityName && entityName) {
              mappedUtilities[utilityName] = entityName;
            }
        }
        
        console.log("----- in mapUIDsToUtilities, mappedUtilities - ", mappedUtilities);
        return mappedUtilities;
    };

    const mapUtilitiesAndEntitiesToUIDs = (utilitiesObject) => {
        const mappedResults = {};
      
        for (const [key, value] of Object.entries(utilitiesObject)) {
          const utilityUID = reverseUtilitiesMap.get(key);
          const entityUID = reverseEntitiesMap.get(value);
      
          if (utilityUID && entityUID) {
            mappedResults[utilityUID] = entityUID;
          }
        }
      
        return mappedResults;
      };
    

    const utilitiesObject = JSON.parse(propertyData.property_utilities);
    console.log("UTILITIES OBJECT", utilitiesObject);
    let utilitiesInUIDForm = {};
    let mappedUtilities2 = {};
    useEffect(() => {
        if (utilitiesObject){
            console.log("***********************************EditProperty useEffect*************************************************")
            for (const utility of utilitiesObject) {
                console.log( utility.utility_type_id, utility.utility_payer_id );
                utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
                
            }
            console.log("UTILTIES IN UID FORM", utilitiesInUIDForm);
            
            // setUtilitiesPaidBy(utilitiesInUIDForm)
            mappedUtilities2 = mapUIDsToUtilities(utilitiesInUIDForm)
            console.log("----- Mapped UIDs to Utilities, mappedUtilities2");
            console.log("   ", mappedUtilities2);
            setMappedUtilitiesPaidBy(mappedUtilities2);
        }else{
            setMappedUtilitiesPaidBy(defaultUtilities);
            setIsDefaultUtilities(true);
        }
        loadImages();
        console.log("****************************************EditProperty useEffect********************************************");
    
        
    }, []);

    useEffect(() => {
        console.log("mappedUtilitiesPaidBy - ", mappedUtilitiesPaidBy);
    }, [mappedUtilitiesPaidBy]);

    useEffect(() => {
        console.log("newUtilitiesPaidBy - ", newUtilitiesPaidBy);
    }, [newUtilitiesPaidBy]);

    const handleUtilityChange = (utility, entity) => {
        
        const utilityObject = {[utility]: `${entity}`}
        console.log("----- handleUtilityChange called - ", utilityObject);
        // setMappedUtilitiesPaidBy((prevState)=> ({...prevState, ...utility}))

        setMappedUtilitiesPaidBy(prevState => ({
            ...prevState,
            [utility]: prevState.hasOwnProperty(utility) ? entity : prevState[utility],
        }));
        // setUtilitiesPaidBy(utilities);
        // setMappedUtilitiesPaidBy(utilities);

        setNewUtilitiesPaidBy(prevState => ({
            ...(prevState.hasOwnProperty(utility) ? { ...prevState, [utility]: entity } : prevState)
        }));
    };

    //Add utility
    // const getKeysNotInUtilitiesMap = () => {
    //     const mappedKeys = Object.keys(mappedUtilitiesPaidBy);
    //     const allKeys = Array.from(utilitiesMap.values());
    //     return allKeys.filter(key => !mappedKeys.includes(key));
    // };


    const [addUtilityAnchorElement, setAddUtilityAnchorElement] = useState(null);
    // const [keysNotInUtilitiesMap] = useState(getKeysNotInUtilitiesMap());
    const keysNotInUtilitiesMap = Array.from(utilitiesMap.values()).filter(
        utility => !(utility in mappedUtilitiesPaidBy)
    );


    const handleAddUtilityButtonClick = (event) => {
        setAddUtilityAnchorElement(event.currentTarget);
    };

    const handleAddUtilityClose = () => {
        setAddUtilityAnchorElement(null);
    };

    const handleAddUtility = (utility) => {
        const updatedMappedUtilities = { ...mappedUtilitiesPaidBy }; // Create a copy of mappedUtilitiesPaidBy
        updatedMappedUtilities[utility] = 'owner';
        setMappedUtilitiesPaidBy(updatedMappedUtilities);

        const updatedNewUtilitiesMappedBy = { ...newUtilitiesPaidBy };
        updatedNewUtilitiesMappedBy[utility] = 'owner';
        setNewUtilitiesPaidBy(updatedNewUtilitiesMappedBy);


        console.log(`Adding utility: ${utility}`);
        handleAddUtilityClose();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        //property_utilities
    }, [utilities])

    useEffect(() => {
        console.log("Size of selectedImageList:", selectedImageList.length)
        console.log("Contents of selectedImageList:", selectedImageList)
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit")
        const formData = new FormData();
        const utilitiesFormData = new FormData();        
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const promises = []
        const promises_added = [] // debug

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
        if(page=== "add_listing" || page === "edit_listing"){
            formData.append('property_available_to_rent', isListed ? 1 : 0);
        }
        formData.append('property_value', propertyValue);
        formData.append('property_value_year', assessmentYear);
        formData.append('property_active_date', activeDate);
       // formData.append('property_utilities', utilities);
        formData.append('property_amenities_community', communityAmenities);
        formData.append('property_amenities_unit', unitAmenities);
        formData.append('property_amenities_nearby', nearbyAmenities);

        //utilities form data
        const utilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(mappedUtilitiesPaidBy));
        console.log("----- Submitted uitilitiesPaidBy JSON string");
        console.log(utilitiesJSONString);

        utilitiesFormData.append('property_uid', propertyData.property_uid);
        utilitiesFormData.append('property_utility', utilitiesJSONString);

        
        const addedUtilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(newUtilitiesPaidBy));
        console.log("----- addedUtilitiesJSONString");
        console.log(addedUtilitiesJSONString);

        const addedUtilitiesFormData = new FormData();
        addedUtilitiesFormData.append('property_uid', propertyData.property_uid);
        addedUtilitiesFormData.append('property_utility', addedUtilitiesJSONString);
        

        console.log("--debug selectedImageList--", selectedImageList, selectedImageList.length)


        const files = imageState;
        let i = 0;
        for (const file of imageState) {
            // let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
            let key = `img_${i++}`;
            if (file.file !== null) {
                // newProperty[key] = file.file;
                formData.append(key, file.file)
            } else {
                // newProperty[key] = file.image;
                formData.append(key, file.image)
            }
            if(file.coverPhoto) {
                formData.append('img_favorite', key)
            }
        }

        if(deletedImageList.length > 0){
            formData.append('deleted_images', JSON.stringify(deletedImageList))
        }


        for (let [key, value] of formData.entries()) {
            console.log(key, value);            
        }

        const putData = async () => {
            setShowSpinner(true);
            promises.push(fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties",{
                method: "PUT",
                body: formData
            }));
            promises_added.push("putData");
            
            setShowSpinner(false);
    
            
            // navigate("/propertyDetail", { state: { index, propertyList }});
        }
        const updateUtilitiesData = async () => {
            setShowSpinner(true);

            promises.push(fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/utilities",{
                method: "PUT",
                body: utilitiesFormData
            }));
            promises_added.push("putUtilitiesData - PUT");
            
            setShowSpinner(false);


            const addedUtilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(newUtilitiesPaidBy));
            console.log("----- addedUtilitiesJSONString");
            console.log(addedUtilitiesJSONString);

            const addedUtilitiesFormData = new FormData();
            addedUtilitiesFormData.append('property_uid', propertyData.property_uid);
            addedUtilitiesFormData.append('property_utility', addedUtilitiesJSONString);

            const numberOfAddedUtilities = Object.keys(newUtilitiesPaidBy).length;
            if(numberOfAddedUtilities > 0){
                promises.push(fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/utilities",{
                    method: "POST",
                    body: addedUtilitiesFormData
                }));
                promises_added.push("putUtilitiesData - POST");

                
                setShowSpinner(false);
            }
        }
        const postUtilitiesData = async () => {
            setShowSpinner(true);

            promises.push(fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/utilities",{
                method: "POST",
                body: utilitiesFormData
            }));
            promises_added.push("postUtilitiesData");
            
            setShowSpinner(false);
        }

        const autoUpdate = async () => {
            const updateResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${propertyData.property_uid}`);
            // const updateResponse = await fetch(`http://localhost:4000/properties/${propertyData.property_uid}`);
                const updatedJson = await updateResponse.json();
                const updatedProperty = updatedJson.result[0];  
                propertyList = propertyList.map(property => {
                    if(property.property_uid === updatedProperty.property_uid)
                        return { ...property, ...updatedProperty};
                    return property;
                });
            // console.log("updatedPropertyList - ", propertyList);
            setPropertyData(propertyList[index])
            
        }

        putData();
        if(isDefaultUtilities){
            postUtilitiesData();
        } else{
            updateUtilitiesData();
        }

        try {
            // console.log("promises added - ", promises_added);
            await Promise.all(promises)
            console.log("All Changes saved to the Database", promises)
            await autoUpdate();

            console.log("propertyList after autoUpdate - ", propertyList);
            navigate("/propertyDetail", { state: { index, propertyList }});
            
        } catch (error) {
            console.error("Error:", error);
        }
        
    }  

    const formatUtilityName = (utility) => {
        const formattedUtility = utility.replace(/_/g, ' '); 
        return formattedUtility.charAt(0).toUpperCase() + formattedUtility.slice(1);
    };

    const defaultUtilities = {
        electricity: 'owner',
        trash: 'owner',
        water: 'owner',
        internet: 'owner',
        gas: 'owner',
    };

    const isCoverPhoto = (link) => {
        if(link === favImage){
            return true;
        }
        return false;
        
    };

    const loadImages = async () => {
        const files = [];
        const images = JSON.parse(propertyData.property_images);
        for (let i = 0; i < images.length; i++) {
          files.push({
            index: i,
            image: images[i],
            file: null,
            coverPhoto: isCoverPhoto(images[i]),
          });
        }
        setImageState(files);        
        setActiveStep(files.findIndex(file => file.coverPhoto));
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
                                { page === "edit_property" && (
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Edit Property
                                    </Typography>
                                )}

                                { page === "add_listing" && (
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Create Listing
                                    </Typography>
                                )}

                                { page === "edit_listing" && (
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Edit Listing
                                    </Typography>
                                )}
                                
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
                                            // image={selectedImageList[activeStep]}
                                            image={selectedImageList[activeStep]? `${selectedImageList[activeStep]}?${Date.now()}` : defaultHouseImage}
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
                                        <ImageUploader selectedImageList={imageState} setSelectedImageList={setImageState} setDeletedImageList={setDeletedImageList} page={page}/>
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
                                    <Grid item xs={6}>
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
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Assessment Year
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            // InputProps={{
                                            //     startAdornment: (
                                            //         <InputAdornment position="start">$</InputAdornment>
                                            //     ),
                                            // }}
                                            onChange={(e) => setAssessmentYear(e.target.value)}
                                            value={assessmentYear}
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
                                    <Grid item xs={12}>
                                        {page === "add_listing" || page === "edit_listing" ?
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
                                        :<div></div>}
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
                                    {
                                        isDefaultUtilities && (
                                            <Grid item xs={12}>
                                                <Typography sx={{fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                                                    {`<--Displaying Default Utilities-->`}
                                                </Typography>
                                            </Grid>
                                        )
                                    }
                                    {Object.entries(mappedUtilitiesPaidBy).map(([utility, selectedValue]) => (
                                        <Fragment key={utility}>
                                            <Grid item xs={6}>
                                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                {formatUtilityName(utility)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                value="owner"
                                                control={
                                                    <Radio
                                                    checked={selectedValue === 'owner'}
                                                    onChange={() => handleUtilityChange(utility, 'owner')}
                                                    />
                                                }
                                                label="Owner"
                                                />
                                                <FormControlLabel
                                                value="tenant"
                                                control={
                                                    <Radio
                                                    checked={selectedValue === 'tenant'}
                                                    onChange={() => handleUtilityChange(utility, 'tenant')}
                                                    />
                                                }
                                                label="Tenant"
                                                />
                                            </Grid>
                                        </Fragment>
                                    ))}
                                    <Grid item xs={12}>
                                        <Button 
                                            variant="outlined"
                                            onClick={handleAddUtilityButtonClick}
                                            sx={{
                                                backgroundColor: "#3D5CAC",
                                                fontWeight: theme.typography.primary.fontWeight, 
                                                fontSize:theme.typography.smallFont,
                                                textTransform: 'none',
                                            }}
                                        >
                                            Add Utility <ArrowDropDownIcon />
                                        </Button>
                                        <Menu
                                            anchorEl={addUtilityAnchorElement}
                                            open={Boolean(addUtilityAnchorElement)}
                                            onClose={handleAddUtilityClose}
                                        >
                                            {keysNotInUtilitiesMap.map((utility, index) => (
                                                <MenuItem key={index} onClick={() => handleAddUtility(utility)}>
                                                    {formatUtilityName(utility)}
                                                </MenuItem>
                                            ))}
                                        </Menu>
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
                                    { page === "edit_property" && (
                                        <Typography sx={{color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                Update Property
                                        </Typography>
                                    )}
                                    { page === "add_listing" && (
                                        <Typography sx={{color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                Create Listing
                                        </Typography>
                                    )}
                                    { page === "edit_listing" && (
                                        <Typography sx={{color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                Update Listing
                                        </Typography>
                                    )}
                                </Button>
                                
                                
                            </Grid>
                        </Grid>
                        </Box>
                </Stack>
            </Stack>
        </ThemeProvider>
    )
}