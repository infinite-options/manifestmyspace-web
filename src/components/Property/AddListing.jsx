import React, { useState, useEffect, Fragment } from 'react';
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
    Badge,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Input,
    Container,
    Checkbox,
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
import StateMenuItems from '../StateMenuItems';
import UtilitySelection from '../UtilitySelector'
import { DragHandleOutlined } from '@mui/icons-material';

export default function AddListing({}){
    const location = useLocation();
    let navigate = useNavigate();
    const { getProfileId } = useUser();
    const { state } = useLocation();
    let { index, propertyList } = state;
    // const propertyData = location.state.item;
    const propertyData = propertyList[index];
    const page = location.state.page;
    const propertyId = location.state.propertyId;
    const { user, selectedRole, selectRole, Name } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    const [ownerId, setOwnerId] = useState(getProfileId());
    const statesList = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
      ];

    const [address, setAddress] = useState(propertyData.property_address);
    const [city, setCity] = useState(propertyData.property_city);
    const [propertyState, setPropertyState] = useState(propertyData.property_state);
    const [zip, setZip] = useState(propertyData.property_zip);
    const [propertyType, setPropertyType] = useState(propertyData.property_type);
    const [squareFootage, setSquareFootage] = useState(propertyData.property_area);
    const [bedrooms, setBedrooms] = useState(propertyData.property_num_beds);
    const [bathrooms, setBathrooms] = useState(propertyData.property_num_baths);

    const [description, setDescription] = useState(propertyData.property_description);
    const [selectedImageList, setSelectedImageList] = useState(JSON.parse(propertyData.property_images));
    // const [selectedImageList, setSelectedImageList] = useState([]);
    const [deletedImageList, setDeletedImageList] = useState([]);
    const [favImage, setFavImage] = useState(propertyData.property_favorite_image);
    // const [favImage, setFavImage] = useState(propertyData.property_images[0]);
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = selectedImageList.length;
    const [coverImage, setCoverImage] = useState(defaultHouseImage);
    const [notes, setNotes] = useState(propertyData.property_notes);
    const [unit, setUnit] = useState(propertyData.property_unit);
    const [propertyValue, setPropertyValue] = useState(propertyData.property_value);
    const [assessmentYear, setAssessmentYear] = useState(propertyData.property_value);
    const [deposit, setDeposit] = useState(propertyData.property_deposit);
    const [petsAllowed, setPetsAllowed] = useState(propertyData.property_pets_allowed === 1 ? true : false);
    const [depositForRent, setDepositForRent] = useState(propertyData.property_deposit_for_rent === 1 ? true : false);
    const [taxes, setTaxes] = useState(propertyData.property_taxes);
    const [mortgages, setMortgages] = useState(propertyData.property_mortgages);
    const [insurance, setInsurance] = useState(propertyData.property_insurance);
    const [rent, setRent] = useState(propertyData.property_listed_rent);
    const [communityAmenities, setCommunityAmenities] = useState(propertyData.property_amenities_community);
    const [apartmentAmenities, setApartmentAmenities] = useState(propertyData.property_amenities_unit);
    const [nearbyAmenities, setNearbyAmenities] = useState(propertyData.property_amenities_nearby);
    // const [isDepositLastMonth, setIsDepositLastMonth] = useState(propertyData.property_deposit_for_rent);

    const [activeDate, setActiveDate] = useState(propertyData.property_active_date);
    // const [isListed, setListed] = useState(propertyData.property_available_to_rent === 1 ? true : false);
    const [isListed, setListed] = useState(true);

    useEffect(() => {
        console.log("deletedImageList - ", deletedImageList);
    }, [deletedImageList]);

    //const [utilitiesPaidBy, setUtilitiesPaidBy] = useState(null);
    const [mappedUtilitiesPaidBy, setMappedUtilitiesPaidBy] = useState({});
    const [isDefaultUtilities, setIsDefaultUtilities] = useState(false);

    useEffect(() => {
        console.log("mappedUtilitiesPaidBy - ", mappedUtilitiesPaidBy);
    }, [mappedUtilitiesPaidBy]);

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
    

    const utilitiesObject = JSON.parse(propertyData.property_utilities);
    let utilitiesInUIDForm = {};
    let mappedUtilities2 = {};
    useEffect(() => {
        if (utilitiesObject){
            console.log("*****************************************AddListing useEffect*******************************************");
            for (const utility of utilitiesObject) {
                console.log( utility.utility_type_id, utility.utility_payer_id );
                utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
                
            }
            console.log("UTILTIES IN UID FORM", utilitiesInUIDForm);
            
            // setUtilitiesPaidBy(utilitiesInUIDForm)
            mappedUtilities2 = mapUIDsToUtilities(utilitiesInUIDForm)
            console.log("----- Mapped UIDs to Utilities, mappedUtilities2");
            console.log("   ", mappedUtilities2);
            // setMappedUtilitiesPaidBy(mappedUtilities2);
            setMappedUtilitiesPaidBy(mappedUtilities2);
        } else{
            setMappedUtilitiesPaidBy(defaultUtilities);
            setIsDefaultUtilities(true);
        }
        loadImages();
        console.log("************************************************AddListing useEffect***********************************");
    
        
    }, []);
    
    // useEffect(() => {
    //     let utilitiesInUIDForm = {};
        
    //     if (utilitiesObject){
    //         console.log("*******HERE*******")
    //         for (const utility of utilitiesObject) {
    //             console.log( utility.utility_type_id, utility.utility_payer_id );
    //             utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
                
    //         }
    //         console.log("UTILTIES IN UID FORM", utilitiesInUIDForm);
    //         setUtilitiesPaidBy(utilitiesInUIDForm) 
    //     }
        
    // }, []);

    
    
    
    // useEffect(()=> {
    //     console.log("AddListing - utilitiesPaidBy");
    //     console.log("   ", utilitiesPaidBy);
    //     console.log("AddListing - utilitiesPaidBy JSON string");
    //     console.log("   ", JSON.stringify(utilitiesPaidBy));

    //     //mapped utilities
    //     // console.log("AddListing - Mapped Utilities and entities - ");
    //     // console.log("   ", JSON.stringify(mapUtilitiesAndEntitiesToUIDs(utilitiesPaidBy)));

    //     //mapped utilities
    //     // const mappedUtilities2 = mapUIDsToUtilities(utilitiesPaidBy)
    //     // console.log(" - utilitiesPaidBy useEffect - Mapped UIDs to Utilities");
    //     // console.log("   ", mappedUtilities2);
    //     // setMappedUtilitiesPaidBy(mappedUtilities2);

    //     // setMappedUtilitiesPaidBy(mapUIDsToUtilities(utilitiesPaidBy));
        
    // },[utilitiesPaidBy]);

    // useEffect(()=> {
    //     console.log("AddListing - mappedUtilitiesPaidBy useEffect");
    //     console.log("   ", mappedUtilitiesPaidBy);
        
    // },[mappedUtilitiesPaidBy]);


    const [utilityToBeAdded, setUtilityToBeAdded] = useState(null);

    const onClickAddUtility = () => {
        // if(utilityToBeAdded){
        //     setUtilitiesPaidBy()
        // }
        
    }
    

    const listOfUtilities =[
        "Electricity",
        "Water", 
        "Gas", 
        "Trash",
        "Sewer", 
        "Internet", 
        "Cable", 
        "HOA Dues", 
        "Security system",
        "Pest control",
        "Gardener", 
        "Maintenance",
    ]

    // const utilitiesValueToNameMap = {
    //     "electricity" : "Electricity",
    //     "water" : "Water", 
    //     "gas" : "Gas", 
    //     "trash" : "Trash",
    //     "sewer" : "Sewer", 
    //     "internet" : "Internet", 
    //     "cable" : "Cable", 
    //     "hoa_dues" : "HOA Dues", 
    //     "security_system" : "Security system",
    //     "pest_control" : "Pest control",
    //     "gardener" : "Gardener", 
    //     "maintenance" : "Maintenance",
    // }

    // const utilitiesNameToValueMap = {
    //     "Electricity": "electricity",
    //     "Water": "water",
    //     "Gas": "gas",
    //     "Trash": "trash",
    //     "Sewer": "sewer",
    //     "Internet": "internet",
    //     "Cable": "cable",
    //     "HOA Dues": "hoa_dues",
    //     "Security system": "security_system",
    //     "Pest control": "pest_control",
    //     "Gardener": "gardener",
    //     "Maintenance": "maintenance",
    //   };

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

    

    

    // const [mappedUtilitiesPaidBy, setMappedUtilitiesPaidBy] = useState(mapUIDsToUtilities(utilitiesPaidBy));
    // const [mappedUtilitiesPaidBy, setMappedUtilitiesPaidBy] = useState(mapUIDsToUtilities(utilitiesInUIDForm));
    
    
    // const test = {
    //     "050-000001":"050-000041",
    //     "050-000004":"050-000043",
    //     "050-000002":"050-000043",
    //     "050-000006":"050-000043",
    //     "050-000003":"050-000043",
    // }

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
    };
   
    const handleListedChange = (event) => {
        setListed(event.target.checked);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        console.log("useEffect")
        setCoverImage(selectedImageList[0] || coverImage);
    }, [selectedImageList])

    const handleUnitChange = (event) => {
        console.log("handleUnitChange", event.target.value)
        setUnit(event.target.value);
    };

    useEffect(() => {
        console.log("propertyState", propertyState)
    }, [propertyState])


    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }

    const handleSubmit = (event) => {
        
        event.preventDefault();
        console.log("handleSubmit")
        const formData = new FormData();
        const utilitiesFormData = new FormData();
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
 

        formData.append('property_uid', propertyData.property_uid)
        // formData.append('property_owner_id', ownerId);
        formData.append('property_available_to_rent', 1);
        formData.append('property_active_date', formattedDate);
        formData.append('property_address', address);
        formData.append('property_unit', unit);
        formData.append('property_city', city);
        formData.append('property_state', propertyState);
        formData.append('property_zip', zip);
        formData.append('property_type', propertyType);
        formData.append('property_num_beds', bedrooms);
        formData.append('property_num_baths', bathrooms);
        formData.append('property_area', squareFootage);
        formData.append('property_listed_rent', rent);
        formData.append('property_deposit', deposit);
        formData.append('property_pets_allowed', petsAllowed ? 1 : 0);
        formData.append('property_deposit_for_rent', depositForRent ? 1 : 0);
        formData.append('property_taxes', taxes? taxes : "null");
        formData.append('property_mortgages', mortgages? mortgages : "null");
        formData.append('property_insurance', insurance? insurance : "null");
        formData.append('property_featured', 0);
        formData.append('property_description', description);
        formData.append('property_notes', notes);
        formData.append('property_available_to_rent', isListed ? 1 : 0);
        formData.append('property_amenities_community', communityAmenities);
        formData.append('property_amenities_unit', apartmentAmenities);
        formData.append('property_amenities_nearby', nearbyAmenities);
        
        //utilities data
        // const utilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(utilitiesPaidBy));
        const utilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(mappedUtilitiesPaidBy));
        console.log("----- Submitted uitilitiesPaidBy JSON string");
        console.log(utilitiesJSONString);
       // formData.append('property_utilities', utilitiesJSONString)


        const files = selectedImageList;
        let i = 0;
        for (const file of selectedImageList) {
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

        utilitiesFormData.append('property_uid', propertyData.property_uid);
        utilitiesFormData.append('property_utility', utilitiesJSONString);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }

        const putData = async () => {
            setShowSpinner(true);
            try{
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties",{
                    method: "PUT",
                    body: formData
                })
                // const response = await fetch("http://localhost:4000/properties",{
                //     method: "PUT",
                //     body: formData
                // })
                const data = await response.json();
                console.log("properties put data", data)
                
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
        const postUtilitiesData = async () => {
            // setShowSpinner(true);
            try{
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/utilities",{
                    method: "POST",
                    body: utilitiesFormData
                })
                // const response = await fetch("http://localhost:4000/utilities",{
                //     method: "POST",
                //     body: utilitiesFormData
                // })
                const data = await response.json();
                console.log("data", data)
                if (data.code === 200){
                    navigate(-1);
                    // should navigate to the listing page
                }
            } catch(error){
                console.log("Error posting data:", error)
            }
            setShowSpinner(false);
        }


        const putUtilitiesData = async () => {
            // setShowSpinner(true);
            try{
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/utilities",{
                    method: "PUT",
                    body: utilitiesFormData
                })
                // const response = await fetch("http://localhost:4000/utilities",{
                //     method: "PUT",
                //     body: utilitiesFormData
                // })
                const data = await response.json();
                console.log("data", data)
                if (data.code === 200){
                    navigate(-1);
                    // should navigate to the listing page
                }
            } catch(error){
                console.log("Error posting data:", error)
            }
            setShowSpinner(false);
        }

        putData();
        if (page === "create_listing"){
            postUtilitiesData();
        } else if (page === "edit_listing"){
            putUtilitiesData();
        }            
    }


    const capitalizeFirstChar = (utility) => {
        return utility.charAt(0).toUpperCase() + utility.slice(1);
    }

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
        setSelectedImageList(files);
        // setActiveStep(files.findIndex(file => file.coverPhoto));
        setActiveStep(() => {
            const index = files.findIndex(file => file.coverPhoto);

            return index !== -1 ? index : 0;
          });
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
                                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                    {propertyData.property_available_to_rent!==1 ? "Create Listing" : "Update Listing"}
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
                                            image={selectedImageList[activeStep]? selectedImageList[activeStep].image : defaultHouseImage}
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
                                        <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList} setDeletedImageList={setDeletedImageList}  page={"Edit"}/>
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
                                                renderValue={(value) => (value ? `${value}` : '')}
                                            >
                                                {/* <StateMenuItems /> */}
                                                {statesList.map(item => {
                                                    return (
                                                        <MenuItem value={item}>
                                                            <li>{item}</li>
                                                        </MenuItem>
                                                    );
                                                })}
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
                                    {selectedRole==='MANAGER'|| selectedRole==='OWNER'?
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
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                }}
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
                                            value={activeDate}
                                            onChange={(e) => setActiveDate(e.target.value)}
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">$</InputAdornment>
                                                ),
                                            }}
                                            value={deposit}
                                            onChange={(e) => setDeposit(e.target.value)}
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">$</InputAdornment>
                                                ),
                                            }}
                                            onChange={(e) => setRent(e.target.value)}
                                            value={rent}
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
                                sx={{
                                    display: 'flex',
                                    paddingBottom: "20px"
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                {/* {console.log("MAPPED UTILITIES PAID BY", mappedUtilitiesPaidBy)} */}
                                {/* <UtilitySelection existingSelection={mappedUtilitiesPaidBy} onChangeUtilities={handleUtilityChange}/> */}

                                <Grid container columnSpacing={2} rowSpacing={3}>
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
                                    {
                                        Object.entries(mappedUtilitiesPaidBy).length > 0 ? (
                                            Object.entries(mappedUtilitiesPaidBy).map(([utility, selectedValue]) => (
                                                <Fragment key={utility}>
                                                    <Grid item xs={6}>
                                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                        {capitalizeFirstChar(utility)}
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
                                            ))
                                        ) : (
                                            
                                            Object.entries(defaultUtilities).map(([utility, selectedValue]) => (
                                                <Fragment key={utility}>
                                                    <Grid item xs={6}>
                                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                        {capitalizeFirstChar(utility)}
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
                                            ))
                                        )
                                    }
                                </Grid>








                                
                            </Box>

                            {/* Default utilities
                            <Box
                                sx={{
                                    display: 'flex',
                                    paddingBottom: "20px"
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                
                                <UtilitySelection existingSelection={null} onChangeUtilities={() => console.log("utility changed")}/>
                                
                            </Box> */}
                            <Grid item xs={12} xl={3}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                    Add Utility
                                </Typography>
                                    <Select 
                                        sx={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        // fullWidth
                                        onChange={(e) => setUtilityToBeAdded(e.target.value)}
                                        value={""}
                                        renderValue={(value) => (value ? `${value}` : '')}
                                    >
                                        {/* <StateMenuItems /> */}
                                        {listOfUtilities.map(item => {
                                            return (
                                                <MenuItem value={item}>
                                                    <li>{item}</li>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
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
                                            Community Amenities
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
                                            placeholder={communityAmenities}
                                            onChange={(e) => setCommunityAmenities(e.target.value)}
                                            value={communityAmenities}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Apartment Amenities
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
                                            placeholder={apartmentAmenities}
                                            onChange={(e) => setApartmentAmenities(e.target.value)}
                                            value={apartmentAmenities}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Near By Amenities
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
                                            placeholder={nearbyAmenities}
                                            onChange={(e) => setNearbyAmenities(e.target.value)}
                                            value={nearbyAmenities}
                                        />
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
                                        {propertyData.property_available_to_rent!==1 ? "Create Listing" : "Update Listing"}
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