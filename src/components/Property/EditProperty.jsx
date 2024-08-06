import React, { useState, useEffect, Fragment, useRef } from "react";
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
import theme from "../../theme/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ImageUploader from "../ImageUploader";
import dataURItoBlob from "../utils/dataURItoBlob";
import defaultHouseImage from "./defaultHouseImage.png";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useUser } from "../../contexts/UserContext";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Assessment } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getLatLongFromAddress } from "../../utils/geocode";
import AddressAutocompleteInput from "./AddressAutocompleteInput";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import APIConfig from "../../utils/APIConfig";

function EditProperty(props) {
  console.log("In Edit Property2 - rename to Edit Property");
  const { state } = useLocation();
  let navigate = useNavigate();
  const { getProfileId } = useUser();
  // const propertyData = location.state.item
  // const propertyId = location.state.propertyId;

  // Check with Laysa
  // replaced with line below
  // let { index, propertyList, page, isDesktop, allRentStatus,rawPropertyData } = state || editPropertyState;
  let { index, propertyList, page, isDesktop, allRentStatus, rawPropertyData, onBackClick } = props;

  const [propertyData, setPropertyData] = useState(propertyList[index]);
  // console.log("Property propertyData---", propertyData)
  console.log("Property Data in Edit Property", propertyData);
  const { user, selectedRole, selectRole, Name } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [ownerId, setOwnerId] = useState(getProfileId());
  const us_states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [propertyState, setPropertyState] = useState("");
  const [zip, setZip] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [isListed, setListed] = useState(false);
  const [utilities, setUtilities] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedImageList, setSelectedImageList] = useState("");
  const [imageState, setImageState] = useState([]);
  const [deletedImageList, setDeletedImageList] = useState([]);
  const [favImage, setFavImage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [notes, setNotes] = useState("");
  const [unit, setUnit] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [assessmentYear, setAssessmentYear] = useState("");
  const [deposit, setDeposit] = useState("");
  const [listedRent, setListedRent] = useState("");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [depositForRent, setDepositForRent] = useState(false);
  const [taxes, setTaxes] = useState("");
  const [mortgages, setMortgages] = useState("");
  const [insurance, setInsurance] = useState("");
  const [communityAmenities, setCommunityAmenities] = useState("");
  const [unitAmenities, setUnitAmenities] = useState("");
  const [nearbyAmenities, setNearbyAmenities] = useState("");
  // const [page, setPage] = useState("Edit");


  const [initaddress, setInitAddress] = useState("");
  const [initcity, setInitCity] = useState("");
  const [initpropertyState, setInitPropertyState] = useState("");
  const [initzip, setInitZip] = useState("");
  const [initpropertyType, setInitPropertyType] = useState("");
  const [initsquareFootage, setInitSquareFootage] = useState("");
  const [initbedrooms, setInitBedrooms] = useState("");
  const [initbathrooms, setInitBathrooms] = useState("");
  const [initisListed, setInitListed] = useState(false);
  const [initnotes, setInitNotes] = useState("");
  const [initunit, setInitUnit] = useState("");
  const [initpropertyValue, setInitPropertyValue] = useState("");
  const [initassessmentYear, setInitAssessmentYear] = useState("");
  const [initselectedImageList, setInitSelectedImageList] = useState("");
  const [initfavImage, setInitFavImage] = useState("");

  useEffect(() => {
    const property = propertyList[index];
    setPropertyData(property);
    setAddress(property.property_address);
    setInitAddress(property.property_address);
    setCity(property.property_city);
    setInitCity(property.property_city);
    setPropertyState(property.property_state);
    setInitPropertyState(property.property_state);
    setZip(property.property_zip);
    setInitZip(property.property_zip);
    setPropertyType(property.property_type);
    setInitPropertyType(property.property_type);
    setSquareFootage(property.property_area);
    setInitSquareFootage(property.property_area);
    setBedrooms(property.property_num_beds);
    setInitBedrooms(property.property_num_beds);
    setBathrooms(property.property_num_baths);
    setInitBathrooms(property.property_num_baths);
    setListed(property.property_available_to_rent === 1 ? true : false);
    setInitListed(property.property_available_to_rent === 1 ? true : false);
    setUtilities(property.property_utilities);
    setActiveDate(property.property_active_date);
    setDescription(property.property_description);
    setSelectedImageList(JSON.parse(property.property_images));
    setInitSelectedImageList(JSON.parse(property.property_images));
    setFavImage(property.property_favorite_image);
    setInitFavImage(property.property_favorite_image);
    setMaxSteps(selectedImageList.length);
    setNotes(property.property_notes);
    setInitNotes(property.property_notes);
    setUnit(property.property_unit);
    setInitUnit(property.property_unit);
    setPropertyValue(property.property_value);
    setInitPropertyValue(property.property_value);
    setAssessmentYear(property.property_value_year);
    setInitAssessmentYear(property.property_value_year);
    setDeposit(property.property_deposit);
    setListedRent(property.property_listed_rent);
    setPetsAllowed(property.property_pets_allowed === 1 ? true : false);
    setDepositForRent(property.property_deposit_for_rent === 1 ? true : false);
    setTaxes(property.property_taxes);
    setMortgages(property.property_mortgages);
    setInsurance(property.property_insurance);
    setCommunityAmenities(property.property_amenities_community);
    setUnitAmenities(property.property_amenities_unit);
    setNearbyAmenities(property.property_amenities_nearby);
  }, [index]);

  useEffect(() => {
    console.log("deletedImageList - ", deletedImageList);
  }, [deletedImageList]);
  const [mappedUtilitiesPaidBy, setMappedUtilitiesPaidBy] = useState({});
  const [newUtilitiesPaidBy, setNewUtilitiesPaidBy] = useState({});

  const [isDefaultUtilities, setIsDefaultUtilities] = useState(false);

  const utilitiesMap = new Map([
    ["050-000001", "electricity"],
    ["050-000002", "water"],
    ["050-000003", "gas"],
    ["050-000004", "trash"],
    ["050-000005", "sewer"],
    ["050-000006", "internet"],
    ["050-000007", "cable"],
    ["050-000008", "hoa_dues"],
    ["050-000009", "security_system"],
    ["050-000010", "pest_control"],
    ["050-000011", "gardener"],
    ["050-000012", "maintenance"],
  ]);

  const entitiesMap = new Map([
    ["050-000041", "owner"],
    ["050-000042", "property manager"],
    ["050-000043", "tenant"],
    ["050-000049", "user"],
  ]);

  const reverseUtilitiesMap = new Map(Array.from(utilitiesMap, ([key, value]) => [value, key]));
  const reverseEntitiesMap = new Map(Array.from(entitiesMap, ([key, value]) => [value, key]));

  const mapUIDsToUtilities = (propertyUtilities) => {
    // let propertyUtilities = JSON.parse(utilities)
    if (!propertyUtilities) {
      return {};
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
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // const utilitiesObject = JSON.parse(utilities);
  // console.log("UTILITIES OBJECT", utilitiesObject);
  // let utilitiesInUIDForm = {};
  // let mappedUtilities2 = {};
  // useEffect(() => {
  //   if (utilitiesObject) {
  //     console.log("***********************************EditProperty useEffect*************************************************");
  //     for (const utility of utilitiesObject) {
  //       console.log(utility.utility_type_id, utility.utility_payer_id);
  //       utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
  //     }
  //     console.log("UTILTIES IN UID FORM", utilitiesInUIDForm);

  //     // setUtilitiesPaidBy(utilitiesInUIDForm)
  //     mappedUtilities2 = mapUIDsToUtilities(utilitiesInUIDForm);
  //     console.log("----- Mapped UIDs to Utilities, mappedUtilities2");
  //     console.log("   ", mappedUtilities2);
  //     setMappedUtilitiesPaidBy(mappedUtilities2);
  //   } else {
  //     setMappedUtilitiesPaidBy(defaultUtilities);
  //     setIsDefaultUtilities(true);
  //   }
  //   loadImages();
  //   console.log("****************************************EditProperty useEffect********************************************");
  // }, []);
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  
  // useEffect(() => {
  //   let utilitiesObject;    
  //   let utilitiesInUIDForm = {};
  //   let mappedUtilities2 = {};

  //   if(utilities != undefined){
  //     utilitiesObject = JSON.parse(utilities)
  //     console.log("UTILITIES OBJECT", utilitiesObject);
  //   }
  //   if (utilitiesObject) {
  //     console.log("***********************************EditProperty useEffect*************************************************");
  //     for (const utility of utilitiesObject) {
  //       console.log(utility.utility_type_id, utility.utility_payer_id);
  //       utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
  //     }
  //     console.log("UTILTIES IN UID FORM", utilitiesInUIDForm);

  //     // setUtilitiesPaidBy(utilitiesInUIDForm)
  //     mappedUtilities2 = mapUIDsToUtilities(utilitiesInUIDForm);
  //     console.log("----- Mapped UIDs to Utilities, mappedUtilities2");
  //     console.log("   ", mappedUtilities2);
  //     setMappedUtilitiesPaidBy(mappedUtilities2);
  //   } else {
  //     setMappedUtilitiesPaidBy(defaultUtilities);
  //     setIsDefaultUtilities(true);
  //   }
  //   // loadImages();
  //   console.log("****************************************EditProperty useEffect********************************************");
  // }, [utilities]);

  useEffect(() => {
    let utilitiesObject;
    let utilitiesInUIDForm = {};
    let mappedUtilities2 = {};

    console.log("ROHIT - utilities - ", utilities);
    try {
      if (utilities && utilities.length > 0) {
        utilitiesObject = JSON.parse(utilities);
        console.log("UTILITIES OBJECT", utilitiesObject);
      }
    } catch (error) {
      console.error("Error parsing utilities JSON:", error);
    }

    if (utilitiesObject) {
      console.log("***********************************utilities useEffect*************************************************");
      for (const utility of utilitiesObject) {
        console.log(utility.utility_type_id, utility.utility_payer_id);
        utilitiesInUIDForm[utility.utility_type_id] = utility.utility_payer_id;
      }
      console.log("UTILITIES IN UID FORM", utilitiesInUIDForm);

      mappedUtilities2 = mapUIDsToUtilities(utilitiesInUIDForm);
      console.log("----- Mapped UIDs to Utilities, mappedUtilities2");
      console.log("   ", mappedUtilities2);
      setMappedUtilitiesPaidBy(mappedUtilities2);
      setIsDefaultUtilities(false);
    } else {
      setMappedUtilitiesPaidBy(defaultUtilities);
      setIsDefaultUtilities(true);
    }
    console.log("****************************************utilities useEffect********************************************");
  }, [utilities]);

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    console.log("mappedUtilitiesPaidBy - ", mappedUtilitiesPaidBy);
  }, [mappedUtilitiesPaidBy]);

  useEffect(() => {
    console.log("newUtilitiesPaidBy - ", newUtilitiesPaidBy);
  }, [newUtilitiesPaidBy]);

  const handleUtilityChange = (utility, entity) => {
    const utilityObject = { [utility]: `${entity}` };
    console.log("----- handleUtilityChange called - ", utilityObject);
    // setMappedUtilitiesPaidBy((prevState)=> ({...prevState, ...utility}))

    setMappedUtilitiesPaidBy((prevState) => ({
      ...prevState,
      [utility]: prevState.hasOwnProperty(utility) ? entity : prevState[utility],
    }));
    // setUtilitiesPaidBy(utilities);
    // setMappedUtilitiesPaidBy(utilities);

    setNewUtilitiesPaidBy((prevState) => ({
      ...(prevState.hasOwnProperty(utility) ? { ...prevState, [utility]: entity } : prevState),
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
  const keysNotInUtilitiesMap = Array.from(utilitiesMap.values()).filter((utility) => !(utility in mappedUtilitiesPaidBy));

  const handleAddUtilityButtonClick = (event) => {
    setAddUtilityAnchorElement(event.currentTarget);
  };

  const handleAddUtilityClose = () => {
    setAddUtilityAnchorElement(null);
  };

  const handleAddUtility = (utility) => {
    const updatedMappedUtilities = { ...mappedUtilitiesPaidBy }; // Create a copy of mappedUtilitiesPaidBy
    updatedMappedUtilities[utility] = "owner";
    setMappedUtilitiesPaidBy(updatedMappedUtilities);

    const updatedNewUtilitiesMappedBy = { ...newUtilitiesPaidBy };
    updatedNewUtilitiesMappedBy[utility] = "owner";
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
  }, [utilities]);

  useEffect(() => {
    console.log("Size of selectedImageList:", selectedImageList.length);
    console.log("Contents of selectedImageList:", selectedImageList);
  }, [selectedImageList]);

  const handleUnitChange = (event) => {
    console.log("handleUnitChange", event.target.value);
    setUnit(event.target.value);
  };

  const handleBackButton = (e) => {
    console.log("close clicked");
    e.preventDefault();
    onBackClick();
  };

  const handleListedChange = (event) => {
    setListed(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit");
    const formData = new FormData();
    const utilitiesFormData = new FormData();
    const currentDate = new Date();
    // const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
    const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${currentDate.getFullYear()}`;

    const promises = [];
    const promises_added = []; // debug

    const fullAddress = `${address}, ${city}, ${propertyState}, ${zip}`;

    const coordinates = await getLatLongFromAddress(fullAddress);

    console.log("EditProperty - handleSubmit - coordinates - ", coordinates);

    // if (coordinates) {
    //   formData.append("property_latitude", coordinates.latitude);
    //   formData.append("property_longitude", coordinates.longitude);
    // }


    formData.append("property_uid", propertyData.property_uid);
    if (address !== initaddress) formData.append("property_address", address);
if (unit !== initunit) formData.append("property_unit", unit);
if (city !== initcity) formData.append("property_city", city);
if (propertyState !== initpropertyState) formData.append("property_state", propertyState);
if (zip !== initzip) formData.append("property_zip", zip);
if (propertyType !== initpropertyType) formData.append("property_type", propertyType);
if (bedrooms !== initbedrooms) formData.append("property_num_beds", bedrooms); // Double
if (bathrooms !== initbathrooms) formData.append("property_num_baths", bathrooms); // Double
if (squareFootage !== initsquareFootage) formData.append("property_area", squareFootage);
//formData.append("property_listed_rent", listedRent);
//formData.append("property_deposit", deposit); // Int
    //formData.append("property_pets_allowed", petsAllowed ? 1 : 0);
    //formData.append("property_deposit_for_rent", depositForRent ? 1 : 0); // Int
    //formData.append("property_taxes", taxes);
    //formData.append("property_mortgages", mortgages);
    //formData.append("property_insurance", insurance);
    //formData.append("property_featured", 0);
    //formData.append("property_description", description);
    if (notes !== initnotes) formData.append("property_notes", notes);
    if ((page === "add_listing" || page === "edit_listing") && isListed !== initisListed) formData.append("property_available_to_rent", isListed ? 1 : 0);
    if (propertyValue !== initpropertyValue) formData.append("property_value", propertyValue);
    if (assessmentYear !== initassessmentYear) formData.append("property_value_year", assessmentYear);
    //formData.append("property_active_date", activeDate);
    // formData.append('property_utilities', utilities);
    //formData.append("property_amenities_community", communityAmenities);
    //formData.append("property_amenities_unit", unitAmenities);
    //formData.append("property_amenities_nearby", nearbyAmenities);

    //utilities form data
    const utilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(mappedUtilitiesPaidBy));
    //console.log("----- Submitted uitilitiesPaidBy JSON string");
    console.log(utilitiesJSONString);

    utilitiesFormData.append("property_uid", propertyData.property_uid);
    utilitiesFormData.append("property_utility", utilitiesJSONString);

    const addedUtilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(newUtilitiesPaidBy));
    //console.log("----- addedUtilitiesJSONString");
    console.log(addedUtilitiesJSONString);

    const addedUtilitiesFormData = new FormData();
    addedUtilitiesFormData.append("property_uid", propertyData.property_uid);
    addedUtilitiesFormData.append("property_utility", addedUtilitiesJSONString);

    //console.log("--debug selectedImageList--", selectedImageList, selectedImageList.length);
    formData.append("property_images", propertyData.property_images);

    const files = imageState;
    let i = 0;
    for (const file of imageState) {
      console.log('file in imageState', file);
      // let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
      let key = `img_${i++}`;
      if (file.file !== null) {
        // newProperty[key] = file.file;
        formData.append(key, file.file);
      } else {
        // newProperty[key] = file.image;
        formData.append(key, file.image);
      }
      if (file.coverPhoto) {
        formData.append("property_favorite_image", key);
      }
    }

    if (deletedImageList.length > 0) {
      formData.append("deleted_images", JSON.stringify(deletedImageList));
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const putData = async () => {
      setShowSpinner(true);
      promises.push(
        // fetch(`http://localhost:4000/properties`, {
        fetch(`${APIConfig.baseURL.dev}/properties`, {
          method: "PUT",
          body: formData,
        })
      );
      promises_added.push("putData");

      setShowSpinner(false);

      // navigate("/propertyDetail", { state: { index, propertyList }});
    };
    const updateUtilitiesData = async () => {
      setShowSpinner(true);

      promises.push(
        fetch(`${APIConfig.baseURL.dev}/utilities`, {
          method: "PUT",
          body: utilitiesFormData,
        })
      );
      promises_added.push("putUtilitiesData - PUT");

      setShowSpinner(false);

      const addedUtilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(newUtilitiesPaidBy));
      console.log("----- addedUtilitiesJSONString");
      console.log(addedUtilitiesJSONString);

      const addedUtilitiesFormData = new FormData();
      addedUtilitiesFormData.append("property_uid", propertyData.property_uid);
      addedUtilitiesFormData.append("property_utility", addedUtilitiesJSONString);

      const numberOfAddedUtilities = Object.keys(newUtilitiesPaidBy).length;
      if (numberOfAddedUtilities > 0) {
        promises.push(
          fetch(`${APIConfig.baseURL.dev}/utilities`, {
            method: "POST",
            body: addedUtilitiesFormData,
          })
        );
        promises_added.push("putUtilitiesData - POST");

        setShowSpinner(false);
      }
    };
    const postUtilitiesData = async () => {
      setShowSpinner(true);

      promises.push(
        fetch(`${APIConfig.baseURL.dev}/utilities`, {
          method: "POST",
          body: utilitiesFormData,
        })
      );
      promises_added.push("postUtilitiesData");
      onBackClick();
      setShowSpinner(false);
    };

    const autoUpdate = async () => {
      const updateResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${propertyData.property_uid}`);
      console.log("---updateResponse---", updateResponse);
      // const updateResponse = await fetch(`http://localhost:4000/properties/${propertyData.property_uid}`);
      const updatedJson = await updateResponse.json();
      console.log("---updatedJson---", updatedJson);
      const updatedProperty = updatedJson.Property.result[0];
      console.log("---updatedProperty---", updatedProperty);
      propertyList = propertyList.map((property) => {
        if (property.property_uid === updatedProperty.property_uid) return { ...property, ...updatedProperty };
        return property;
      });
      console.log("---index---", index);
      console.log("updatedPropertyList - ", propertyList);
      setPropertyData(propertyList[index]);
    };

    putData();
    if (isDefaultUtilities) {
      postUtilitiesData();
    } else {
      updateUtilitiesData();
    }

    try {
      // console.log("promises added - ", promises_added);
      await Promise.all(promises);
      console.log("All Changes saved to the Database", promises);
      await autoUpdate();

      console.log("propertyList after autoUpdate - ", propertyList);
      if (isDesktop == true) {
        // navigate("/properties", { state: { index: index } }); - PM Changed
        props.setRHS("PropertyNavigator");
        navigate("/propertiesPM", { state: { index: index } });
      } else {
        navigate("/propertyDetail", { state: { index: index, propertyList: propertyList, allRentStatus: allRentStatus, isDesktop: isDesktop, rawPropertyData: rawPropertyData } });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatUtilityName = (utility) => {
    const formattedUtility = utility.replace(/_/g, " ");
    return formattedUtility.charAt(0).toUpperCase() + formattedUtility.slice(1);
  };

  const defaultUtilities = {
    electricity: "owner",
    trash: "owner",
    water: "owner",
    internet: "owner",
    gas: "owner",
  };

  const isCoverPhoto = (link) => {
    if (link === favImage) {
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
    setActiveStep(files.findIndex((file) => file.coverPhoto));
  };

  const handleAddressSelect = (address) => {
    console.log("handleAddressSelect", address);
    setAddress(address.street ? address.street : "");
    setCity(address.city ? address.city : "");
    setPropertyState(address.state ? address.state : "");
    setZip(address.zip ? address.zip : "");
  };

  const [scrollPosition, setScrollPosition] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollPosition;
		}
	}, [scrollPosition]);

	const handleScroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 200;
			const currentScrollPosition = scrollRef.current.scrollLeft;

			if (direction === 'left') {
				const newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
				scrollRef.current.scrollLeft = newScrollPosition;
			} else {
				const newScrollPosition = currentScrollPosition + scrollAmount;
				scrollRef.current.scrollLeft = newScrollPosition;
			}
		}
	};

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          paddingBottom: "25px",
        }}
      >
        <Paper
          style={{
            marginTop: "15px",
            backgroundColor: theme.palette.form.main,
            width: "80%", // Adjust width as needed
            padding: "25px",
            boxShadow: theme.shadows[3],
          }}
        >
          <Stack direction='row' justifyContent='center' alignItems='center' position='relative'>
            <Box direction='row' justifyContent='center' alignItems='center'>
              {page === "edit_property" && (
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont, marginTop: "10px" }}>
                  Edit Property
                </Typography>
              )}
              {page === "add_listing" && (
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                  Create Listing
                </Typography>
              )}
              {page === "edit_listing" && (
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                  Edit Listing
                </Typography>
              )}
            </Box>
            <Box position='absolute' right={0}>
              <Button onClick={(e) => handleBackButton(e)}>
                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          </Stack>

          <Box component='form' onSubmit={handleSubmit} noValidate autoComplete='off' id='editPropertyForm'>
            <Grid container columnSpacing={12} rowSpacing={6}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                  }}
                >
                  <IconButton onClick={() => handleScroll('left')} disabled={scrollRef.current?.scrollLeft === 0}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <Box
                    ref={scrollRef}
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <ImageList sx={{ display: 'flex', flexWrap: 'nowrap' }} cols={5}>
                      {JSON.parse(propertyData.property_images)?.map((image, index) => (
                        <ImageListItem
                          key={index}
                          sx={{
                            width: 'auto',
                            flex: '0 0 auto',
                            border: '1px solid #ccc',
                            margin: '0 2px',
                          }}
                        >
                          <img
                            src={image}
                            alt={`maintenance-${index}`}
                            style={{ height: '150px', width: '150px', objectFit: 'cover' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                  <IconButton onClick={() => handleScroll('right')}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <ImageUploader selectedImageList={imageState} setSelectedImageList={setImageState} setDeletedImageList={setDeletedImageList} page={page} />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Address
                </Typography>
                <AddressAutocompleteInput onAddressSelect={handleAddressSelect} defaultValue={`${address}, ${city}, ${propertyState}`} gray={0} />
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Unit</Typography>
                <TextField
                  onChange={(e) => setUnit(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  placeholder={unit}
                  value={unit}
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Zip Code
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  onChange={(e) => setZip(e.target.value)}
                  value={zip}
                  disabled
                />
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Type</Typography>
                <Select
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
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
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Square Footage
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  value={squareFootage}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Bedrooms
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  value={bedrooms}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Bathrooms
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  value={bathrooms}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Property Value
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  value={propertyValue}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Assessment Year
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  onChange={(e) => setAssessmentYear(e.target.value)}
                  value={assessmentYear}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Owner Notes
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  multiline={true}
                  placeholder={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
                />
              </Grid>
              <Grid item xs={12}>
                {page === "add_listing" || page === "edit_listing" ? (
                  <Stack direction='column' justifyContent='left' padding='15px' width='85%'>
                    <FormControlLabel control={<Checkbox checked={isListed} onChange={handleListedChange} />} label='Available to rent' />
                  </Stack>
                ) : (
                  <div></div>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Box
          sx={{
            marginBottom: "30px",
            width: "80%",
            paddingBottom: "30px",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Button variant='contained' type='submit' form='editPropertyForm' sx={{ width: "100%", backgroundColor: theme.typography.formButton.background }}>
                {page === "edit_property" && (
                  <Typography sx={{ color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Update Property</Typography>
                )}
                {page === "add_listing" && (
                  <Typography sx={{ color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Create Listing</Typography>
                )}
                {page === "edit_listing" && (
                  <Typography sx={{ color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Update Listing</Typography>
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default EditProperty;
