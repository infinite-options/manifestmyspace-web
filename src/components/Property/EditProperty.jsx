import React, { useState, useEffect, Fragment } from "react";
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

import APIConfig from "../../utils/APIConfig";
import PropertyNavigator from "./PropertyNavigator";

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
  // console.log("Property Id", propertyId)
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
  const [initialData, setInitialData] = useState({});


  useEffect(() => {
    const property = propertyList[index];
    setInitialData(property);
    console.log("Intial data", initialData);
    setPropertyData(property);
    setAddress(property.property_address);
    setCity(property.property_city);
    setPropertyState(property.property_state);
    setZip(property.property_zip);
    setPropertyType(property.property_type);
    setSquareFootage(property.property_area);
    setBedrooms(property.property_num_beds);
    setBathrooms(property.property_num_baths);
    setListed(property.property_available_to_rent === 1 ? true : false);
    setUtilities(property.property_utilities);
    setActiveDate(property.property_active_date);
    setDescription(property.property_description);
    setSelectedImageList(JSON.parse(property.property_images));
    setFavImage(property.property_favorite_image);
    setMaxSteps(selectedImageList.length);
    setNotes(property.property_notes);
    setUnit(property.property_unit);
    setPropertyValue(property.property_value);
    setAssessmentYear(property.property_value_year);
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

  const getChangedFields = () => {
    const changes = {};
    // if (bedrooms === initialData.property_num_beds) {
    //   console.log("Nothing has changed");
    // }
    if (bedrooms !== initialData.property_num_beds) changes.property_num_beds = bedrooms;
    if (address !== initialData.property_address) changes.property_address = address;
    if (city !== initialData.property_city) changes.property_city = city;
    if (propertyState !== initialData.property_state) changes.property_state = propertyState;
    if (zip !== initialData.property_zip) changes.property_zip = zip;
    if (propertyType !== initialData.property_type) changes.property_type = propertyType;
    if (squareFootage !== initialData.property_area) changes.property_area = squareFootage;
    if (bathrooms !== initialData.property_num_baths) changes.property_num_baths = bathrooms;
    if (isListed !== (initialData.property_available_to_rent === 1)) changes.property_available_to_rent = isListed ? 1 : 0;
    if (description !== initialData.property_description) changes.property_description = description;
    if (notes !== initialData.property_notes) changes.property_notes = notes;
    if (unit !== initialData.property_unit) changes.property_unit = unit;
    if (propertyValue !== initialData.property_value) changes.property_value = propertyValue;
    if (assessmentYear !== initialData.property_value_year) changes.property_value_year = assessmentYear;
    if (deposit !== initialData.property_deposit) changes.property_deposit = deposit;
    if (listedRent !== initialData.property_listed_rent) changes.property_listed_rent = listedRent;
    if (petsAllowed !== (initialData.property_pets_allowed === 1)) changes.property_pets_allowed = petsAllowed ? 1 : 0;
    if (depositForRent !== (initialData.property_deposit_for_rent === 1)) changes.property_deposit_for_rent = depositForRent ? 1 : 0;
    if (taxes !== initialData.property_taxes) changes.property_taxes = taxes;
    if (mortgages !== initialData.property_mortgages) changes.property_mortgages = mortgages;
    if (insurance !== initialData.property_insurance) changes.property_insurance = insurance;
    if (communityAmenities !== initialData.property_amenities_community) changes.property_amenities_community = communityAmenities;
    if (unitAmenities !== initialData.property_amenities_unit) changes.property_amenities_unit = unitAmenities;
    if (nearbyAmenities !== initialData.property_amenities_nearby) changes.property_amenities_nearby = nearbyAmenities;
    // console.log("CHANGES", changes.bedrooms);

  return changes;
  };

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

    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length == 0) {
      console.log("No changes detected.");
      return;
    }

    const formData = new FormData();
    const utilitiesFormData = new FormData();

    for (const [key, value] of Object.entries(changedFields)) {
      formData.append(key, value);
    }

    const currentDate = new Date();
    // const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
    const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${currentDate.getFullYear()}`;

    const promises = [];
    const promises_added = []; // debug

    const fullAddress = `${address}, ${city}, ${propertyState}, ${zip}`;

    const coordinates = await getLatLongFromAddress(fullAddress);

    console.log("EditProperty - handleSubmit - coordinates - ", coordinates);

    if (propertyData.property_uid) {
      formData.append("property_uid", propertyData.property_uid);
    }

    if (changedFields.property_address && coordinates) {
      formData.append("property_latitude", coordinates.latitude);
      formData.append("property_longitude", coordinates.longitude);
    }

    // if (coordinates) {
    //   formData.append("property_latitude", coordinates.latitude);
    //   formData.append("property_longitude", coordinates.longitude);
    // }

    // formData.append("property_uid", propertyData.property_uid);
    // formData.append("property_address", address);
    // formData.append("property_unit", unit);
    // formData.append("property_city", city);
    // formData.append("property_state", propertyState);
    // formData.append("property_zip", zip);
    // formData.append("property_type", propertyType);
    // formData.append("property_num_beds", bedrooms); // Double
    // formData.append("property_num_baths", bathrooms); // Double
    // formData.append("property_area", squareFootage);
    // formData.append("property_listed_rent", listedRent); // Int
    // formData.append("property_deposit", deposit); // Int
    // formData.append("property_pets_allowed", petsAllowed ? 1 : 0);
    // formData.append("property_deposit_for_rent", depositForRent ? 1 : 0); // Int
    // formData.append("property_taxes", taxes);
    // formData.append("property_mortgages", mortgages);
    // formData.append("property_insurance", insurance);
    // formData.append("property_featured", 0);
    // formData.append("property_description", description);
    // formData.append("property_notes", notes);
    // if (page === "add_listing" || page === "edit_listing") {
    //   formData.append("property_available_to_rent", isListed ? 1 : 0);
    // }
    // formData.append("property_value", propertyValue);
    // formData.append("property_value_year", assessmentYear);
    // formData.append("property_active_date", activeDate);
    // // formData.append('property_utilities', utilities);
    // formData.append("property_amenities_community", communityAmenities);
    // formData.append("property_amenities_unit", unitAmenities);
    // formData.append("property_amenities_nearby", nearbyAmenities);

    //utilities form data
    const utilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(mappedUtilitiesPaidBy));
    console.log("----- Submitted uitilitiesPaidBy JSON string");
    console.log(utilitiesJSONString);

    utilitiesFormData.append("property_uid", propertyData.property_uid);
    utilitiesFormData.append("property_utility", utilitiesJSONString);

    const addedUtilitiesJSONString = JSON.stringify(mapUtilitiesAndEntitiesToUIDs(newUtilitiesPaidBy));
    console.log("----- addedUtilitiesJSONString");
    console.log(addedUtilitiesJSONString);

    const addedUtilitiesFormData = new FormData();
    addedUtilitiesFormData.append("property_uid", propertyData.property_uid);
    addedUtilitiesFormData.append("property_utility", addedUtilitiesJSONString);

    console.log("--debug selectedImageList--", selectedImageList, selectedImageList.length);

    const files = imageState;
    let i = 0;
    for (const file of imageState) {
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
      // promises_added.push("putData");

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
      // if (isDesktop == true) {
      //   console.log("isDesktop in here")
      //   // navigate("/properties", { state: { index: index } }); - PM Changed
      //   console.log("In here 1")
      //   navigate("/propertiesPM", { state: { index: index, showLHS: "List", showRHS: "PropertyNavigator" } });
      // } else {
        console.log("In here 2")
        navigate("/propertiesPM", { state: { index: index, propertyList: propertyList, showRHS: "PropertyNavigator" } });
      // }
      // window.location.reload();
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

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column", // Stack the content vertically
          justifyContent: "flex-start", // Start content at the top
          alignItems: "center", // Center content horizontally
          width: "100%",
          minHeight: "100vh",
          paddingBottom: "25px",
        }}
      >
        <Paper
          style={{
            marginTop: "15px",
            backgroundColor: theme.palette.form.main,
            width: "100%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            // paddingTop: "10px",
          }}
        >
          <Stack direction='row' justifyContent='center' alignItems='center' position='relative'>
            <Box direction='row' justifyContent='center' alignItems='center'>
              {page === "edit_property" && (
                <Typography
                  sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont, marginTop: "10px" }}
                >
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

          <Stack direction='column' justifyContent='center' alignItems='center' padding='25px'>
            <Box component='form' onSubmit={handleSubmit} noValidate autoComplete='off' id='editPropertyForm'>
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
                    <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
                      {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </Button>
                    <CardMedia
                      component='img'
                      // image={selectedImageList[activeStep]}
                      image={selectedImageList[activeStep] ? `${selectedImageList[activeStep]}?${Date.now()}` : selectedImageList[0] || defaultHouseImage}
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
                    <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                      {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <ImageUploader selectedImageList={imageState} setSelectedImageList={setImageState} setDeletedImageList={setDeletedImageList} page={page} />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Address
                  </Typography>
                  <AddressAutocompleteInput onAddressSelect={handleAddressSelect} defaultValue={`${address}, ${city}, ${propertyState}`} gray={0} />
                  {/* <TextField
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    placeholder="Address"
                    value={`${address}, ${city}, ${propertyState}`}
                    size="small"
                    fullWidth
                  /> */}
                </Grid>

                {/* Text Field for Address */}
                {/* <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Street Address
                  </Typography>
                  <TextField
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    placeholder={address}
                    value={address}
                    size="small"
                    fullWidth
                  />                  
                </Grid> */}

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

                {/* <Grid item xs={6}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>City</Typography>
                  <TextField
                    onChange={(e) => setCity(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size="small"
                    fullWidth
                    placeholder={propertyData.property_city}
                    value={city}
                  />
                </Grid> */}

                {/* <Grid item xs={6}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    State
                  </Typography>

                  <Select
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size="small"
                    fullWidth
                    onChange={(e) => setPropertyState(e.target.value)}
                    value={propertyState}
                  >
                    {us_states.map((st) => (
                      <MenuItem value={st}>{st}</MenuItem>
                    ))}
                  </Select>
                </Grid> */}

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
          </Stack>
        </Paper>

        <Paper
          style={{
            margin: "15px",
            backgroundColor: theme.palette.form.main,
            width: "100%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
          }}
        >
          <Stack direction='column' justifyContent='center' alignItems='center' padding='25px'>
            <Grid container columnSpacing={12} rowSpacing={6}>
              <Grid item xs={12}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Active Date
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={activeDate}
                  onChange={(e) => setActiveDate(e.target.value)}
                  value={activeDate}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Deposit
                </Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  value={deposit}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>Rent</Typography>
                <TextField
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderColor: "black",
                    borderRadius: "7px",
                  }}
                  size='small'
                  placeholder={listedRent}
                  onChange={(e) => setListedRent(e.target.value)}
                  value={listedRent}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Deposit for Last Month's Rent
                </Typography>
                <Checkbox checked={depositForRent} onChange={(e) => setDepositForRent(e.target.checked)} />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                  Pets Allowed
                </Typography>
                <Checkbox checked={petsAllowed} onChange={(e) => setPetsAllowed(e.target.checked)} />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        <Paper
          style={{
            margin: "15px",
            backgroundColor: theme.palette.form.main,
            width: "100%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
          }}
        >
          <Stack
            direction='column'
            justifyContent='left'
            alignItems='left'
            padding='25px'
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
              }}
              noValidate
              autoComplete='off'
            >
              <Grid container columnSpacing={12} rowSpacing={6}>
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    Utilities Paid by
                  </Typography>
                </Grid>
                {isDefaultUtilities && (
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.smallFont }}>{`<--Displaying Default Utilities-->`}</Typography>
                  </Grid>
                )}
                {
                  Object.entries(mappedUtilitiesPaidBy).length > 0 ?
                
                  Object.entries(mappedUtilitiesPaidBy).map(([utility, selectedValue]) => (
                    <Fragment key={utility}>
                      <Grid item xs={6}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                          {formatUtilityName(utility)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          value='owner'
                          control={<Radio checked={selectedValue === "owner"} onChange={() => handleUtilityChange(utility, "owner")} />}
                          label='Owner'
                        />
                        <FormControlLabel
                          value='tenant'
                          control={<Radio checked={selectedValue === "tenant"} onChange={() => handleUtilityChange(utility, "tenant")} />}
                          label='Tenant'
                        />
                      </Grid>
                    </Fragment>
                  ))                  
                  : 
                  Object.entries(defaultUtilities).map(([utility, selectedValue]) => (
                    <Fragment key={utility}>
                      <Grid item xs={6}>
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                          {formatUtilityName(utility)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          value="owner"
                          control={<Radio checked={selectedValue === "owner"} onChange={() => handleUtilityChange(utility, "owner")} />}
                          label="Owner"
                        />
                        <FormControlLabel
                          value="tenant"
                          control={<Radio checked={selectedValue === "tenant"} onChange={() => handleUtilityChange(utility, "tenant")} />}
                          label="Tenant"
                        />
                      </Grid>
                    </Fragment>
                  ))
              
                }
                <Grid item xs={12}>
                  <Button
                    variant='outlined'
                    onClick={handleAddUtilityButtonClick}
                    sx={{
                      backgroundColor: "#3D5CAC",
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.smallFont,
                      textTransform: "none",
                    }}
                  >
                    Add Utility <ArrowDropDownIcon />
                  </Button>
                  <Menu anchorEl={addUtilityAnchorElement} open={Boolean(addUtilityAnchorElement)} onClose={handleAddUtilityClose}>
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
            margin: "15px",
            backgroundColor: theme.palette.form.main,
            width: "100%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
          }}
        >
          <Stack
            direction='column'
            justifyContent='left'
            alignItems='left'
            padding='25px'
            sx={{
              display: "flex",
            }}
          >
            <Box
              component='form'
              sx={{
                display: "flex",
              }}
              noValidate
              autoComplete='off'
            >
              <Grid container columnSpacing={12} rowSpacing={6}>
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    Property Description
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size='small'
                    multiline={true}
                    placeholder={description}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    Property Amenities
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size='small'
                    multiline={true}
                    placeholder={unitAmenities}
                    onChange={(e) => setUnitAmenities(e.target.value)}
                    value={unitAmenities}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    Community Amenities
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size='small'
                    multiline={true}
                    placeholder={communityAmenities}
                    onChange={(e) => setCommunityAmenities(e.target.value)}
                    value={communityAmenities}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    Nearby Amenities
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    size='small'
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
          direction='column'
          justifyContent='center'
          alignItems='center'
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              marginBottom: "30px",
              width: "100%",
              paddingBottom: "30px",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                {/* <Button variant="contained" onClick={() => testButton()} sx={{ width: '100%', backgroundColor: theme.typography.formButton.background }}> */}

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
      </Stack>
    </ThemeProvider>
  );
}

export default EditProperty;
