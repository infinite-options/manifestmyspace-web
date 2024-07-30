import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import AddressAutocompleteInput from "../Property/AddressAutocompleteInput";
import DataValidator from "../DataValidator";
import { formatPhoneNumber, headers, maskNumber, maskEin, roleMap, photoFields } from "./helper";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Backdrop,
  Paper,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert, 
  AlertTitle,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from "@material-ui/core/styles";
import PayPal from "../../images/PayPal.png";
import ZelleIcon from "../../images/Zelle.png";
import VenmoIcon from "../../images/Venmo.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import ChaseIcon from "../../images/Chase.png";
import CloseIcon from "@mui/icons-material/Close";
import { useCookies } from "react-cookie";
import APIConfig from "../../utils/APIConfig";

import AdultOccupant from "../Leases/AdultOccupant";
import ChildrenOccupant from "../Leases/ChildrenOccupant";
import PetsOccupant from "../Leases/PetsOccupant";
import VehiclesOccupant from "../Leases/VehiclesOccupant";
import Documents from "../Leases/Documents";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
}));

export default function OwnerOnboardingForm({ profileData, setIsSave }) {
  console.log("In TenenatOnBoardingForm  - profileData", profileData);

  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookies["default_form_vals"];
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const [addPhotoImg, setAddPhotoImg] = useState();
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [dashboardButtonEnabled, setDashboardButtonEnabled] = useState(false);
  const { user, isBusiness, isManager, roleName, selectRole, setLoggedIn, selectedRole, updateProfileUid, isLoggedIn, getProfileId } = useUser();
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, phoneNumber, setPhoneNumber, businessName, setBusinessName, photo, setPhoto } = useOnboardingContext();
  const { ein, setEin, ssn, setSsn, mask, setMask, address, setAddress, unit, setUnit, city, setCity, state, setState, zip, setZip } = useOnboardingContext();
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false, uid: "" },
    apple_pay: { value: "", checked: false, uid: "" },
    stripe: { value: "", checked: false, uid: "" },
    zelle: { value: "", checked: false, uid: "" },
    venmo: { value: "", checked: false, uid: "" },
    credit_card: { value: "", checked: false, uid: "" },
    bank_account: { account_number: "", routing_number: "", checked: false, uid: "" },
  });
  
  const [adults, setAdults] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
  const [children, setChildren] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
  const [pets, setPets] = useState([{ id: 1, name: "", breed: "", type: "", weight: "" }]);
  const [vehicles, setVehicles] = useState([{ id: 1, make: "", model: "", year: "", license: "", state: "" }]);
  const [documents, setDocuments] = useState([]);
  const [uploadedFiles, setuploadedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);

  const adultsRef = useRef(adults);
  const childrenRef = useRef(children);
  const petsRef = useRef(pets);
  const vehiclesRef = useRef(vehicles);
  const documentsRef = useRef([]);

  const [relationships, setRelationships] = useState([]);
  const [states, setStates] = useState([]);

  // New state for job details
  const [currentSalary, setCurrentSalary] = useState("");
  const [salaryFrequency, setSalaryFrequency] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [ license, setLicense ] = useState("")
  const [ licenseState, setLicenseState ] = useState("");
  const [ licenseExp, setLicenseExp ] = useState("");

  const [modifiedData, setModifiedData] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const getListDetails = async () => {
    try {
        const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
        if (!response.ok) {
            console.log("Error fetching lists data");
        }
        const responseJson = await response.json();
        const relationships = responseJson.result.filter(res => res.list_category === "relationships");
        const states = responseJson.result.filter(res => res.list_category === "states");
        setRelationships(relationships);
        setStates(states);
    } catch (error) {
        console.log(error);
    }
}

  useEffect(() => {
    console.log("ROHIT - adults - ", adults);
  }, [adults]);

  useEffect(() => {
    console.log("ROHIT - paymentMethods - ", paymentMethods);
  }, [paymentMethods]);

  useEffect(() => {
    console.log("ROHIT - modifiedData - ", modifiedData);    
  }, [modifiedData]);


  const updateModifiedData = (updatedItem) => {
    setModifiedData((prev) => {      
      const existingKeyIndex = prev.findIndex(item => item.key === updatedItem.key);
        
      if (existingKeyIndex !== -1) {
        return prev.map((item, index) => 
          index === existingKeyIndex ? { ...item, value: updatedItem.value } : item
        );
      }  
      return [...prev, { key: updatedItem.key, value: updatedItem.value }];
    });
  }
  


  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    updateModifiedData({ key: "owner_first_name", value: event.target.value });
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    updateModifiedData({ key: "owner_last_name", value: event.target.value });
  };

  const handleAddressSelect = (address) => {
    setAddress(address.street ? address.street : "");
    updateModifiedData({ key: "owner_address", value: address.street ? address.street : "" });    
    setCity(address.city ? address.city : "");
    updateModifiedData({ key: "owner_city", value: address.city ? address.city : "" });  
    setState(address.state ? address.state : "");
    updateModifiedData({ key: "owner_state", value: address.state ? address.state : "" });
    setZip(address.zip ? address.zip : "");
    updateModifiedData({ key: "owner_zip", value: address.zip ? address.zip : "" });
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
    updateModifiedData({ key: "owner_unit", value: event.target.value });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    updateModifiedData({ key: "owner_email", value: event.target.value });
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(formatPhoneNumber(event.target.value));
    updateModifiedData({ key: "owner_phone_number", value: formatPhoneNumber(event.target.value) });
  };
  
  const handleSSNChange = (event) => { 
    let value = event.target.value;
    if (value.length > 11) return;
    setSsn(value);    
    updateModifiedData({ key: "owner_ssn", value: AES.encrypt(event.target.value, process.env.REACT_APP_ENKEY).toString() });  
  };

  const setProfileData = async () => {
    setShowSpinner(true);
    try {
      // const profileResponse = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`);
      // const profileData = profileResponse.data.profile.result[0];
      setFirstName(profileData.owner_first_name || "");
      setLastName(profileData.owner_last_name || "");
      setEmail(profileData.owner_email || "");
      setPhoneNumber(formatPhoneNumber(profileData.owner_phone_number || ""));
      setPhoto(profileData.owner_photo_url ? { image: profileData.owner_photo_url } : null);
      setSsn(profileData.owner_ssn ? AES.decrypt(profileData.owner_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8) : "");
      setMask(profileData.owner_ssn ? maskNumber(AES.decrypt(profileData.owner_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8)) : "");
      setAddress(profileData.owner_address || "");
      setUnit(profileData.owner_unit || "");
      setCity(profileData.owner_city || "");
      setState(profileData.owner_state || "");
      setZip(profileData.owner_zip || "");
    
      const paymentMethods = JSON.parse(profileData.paymentMethods);
      const updatedPaymentMethods = {
        paypal: { value: "", checked: false, uid: "" },
        apple_pay: { value: "", checked: false, uid: "" },
        stripe: { value: "", checked: false, uid: "" },
        zelle: { value: "", checked: false, uid: "" },
        venmo: { value: "", checked: false, uid: "" },
        credit_card: { value: "", checked: false, uid: "" },
        bank_account: { account_number: "", routing_number: "", checked: false, uid: "" },
      };
      paymentMethods.forEach((method) => {
        if (method.paymentMethod_type === "bank_account") {
          updatedPaymentMethods.bank_account = {
            account_number: method.paymentMethod_account_number || "",
            routing_number: method.paymentMethod_routing_number || "",
            checked: method.paymentMethod_status === "Active",
            uid: method.paymentMethod_uid,
          };
        } else {
          updatedPaymentMethods[method.paymentMethod_type] = {
            value: method.paymentMethod_name,
            checked: method.paymentMethod_status === "Active",
            uid: method.paymentMethod_uid,
          };
        }
      });
      setPaymentMethods(updatedPaymentMethods);

      setShowSpinner(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    console.log("calling useeffect");
    setIsSave(false);


    setProfileData();

    // getListDetails();
  }, []);

  useEffect(() => {
    console.log("calling profileData useEffect");

    setIsSave(false);
    setProfileData();
  }, [profileData]);

  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
      setPhoto(file);
    };
    reader.readAsDataURL(file.file);
  };

  const handlePhotoChange = (e) => {
    const file = {
      index: 0,
      file: e.target.files[0],
      image: null,
    };
    let isLarge = file.file.size > 5000000;
    let file_size = (file.file.size / 1000000).toFixed(1);
    if (isLarge) {
      alert(`Your file size is too large (${file_size} MB)`);
      return;
    }
    readImage(file);
  };  

  const paymentMethodsArray = [
    { name: "PayPal", icon: PayPal, state: paymentMethods.paypal },
    { name: "Apple Pay", icon: ApplePay, state: paymentMethods.apple_pay },
    { name: "Stripe", icon: Stripe, state: paymentMethods.stripe },
    { name: "Zelle", icon: ZelleIcon, state: paymentMethods.zelle },
    { name: "Venmo", icon: VenmoIcon, state: paymentMethods.venmo },
    { name: "Credit Card", icon: ChaseIcon, state: paymentMethods.credit_card },
    { name: "Bank Account", icon: ChaseIcon, state: paymentMethods.bank_account },
  ];

  const renderPaymentMethods = () => {
    return paymentMethodsArray.map((method, index) => (
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={index}>
        <Grid item xs={1}>
          <Checkbox name={method.name.toLowerCase().replace(/\s/g, "_")} checked={method.state?.checked} onChange={handleChangeChecked} />
        </Grid>
        {/* {
          (method.name !== "Credit Card" && method.name !== "Bank Account") && (
            <Grid container alignContent='center' item xs={1}>
              <img src={method.icon} alt={method.name} />
            </Grid>
          )
        } */}
        
        <Grid container alignContent='center' item xs={1}>
            <img src={method.icon} alt={method.name} />
        </Grid>        
        
        {method.name === "Bank Account" ? (
          <>
            <Grid item xs={5}>
              <TextField
                name={`${method.name.toLowerCase().replace(/\s/g, "_")}_account`}
                value={method.state?.account_number}
                onChange={handleChangeValue}
                variant="filled"
                fullWidth
                placeholder={`Enter Your Bank Account Number`}
                disabled={!method.state?.checked}
                className={classes.root}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`${method.name.toLowerCase().replace(/\s/g, "_")}_routing`}
                value={method.state?.routing_number}
                onChange={handleChangeValue}
                variant="filled"
                fullWidth
                placeholder={`Enter Your Bank Routing Number`}
                disabled={!method.state?.checked}
                className={classes.root}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={10}>
            <TextField
              name={method.name.toLowerCase().replace(/\s/g, "_")}
              value={method.state?.value}
              onChange={handleChangeValue}
              variant="filled"
              fullWidth
              placeholder={`Enter ${method.name}`}
              disabled={!method.state?.checked}
              className={classes.root}
            />
          </Grid>
        )}
      </Grid>
    ));
  };

  const handleChangeChecked = (e) => {
    const { name, checked } = e.target;
    const map = { ...paymentMethods };
    map[name].checked = checked;
    console.log("ROHIT - handleChangeChecked - map[name]", map[name])
    // if (name === "bank_account") {
    //   if (!checked) {
    //     map.bank_account.account_number = "";
    //     map.bank_account.routing_number = "";
    //   }
    // } else {
    //   if (!checked) {
    //     map[name].value = "";
    //   }
    // }
    setPaymentMethods(map);
  };


  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "bank_account_account" || name === "bank_account_routing") {
      setPaymentMethods((prevState) => ({
        ...prevState,
        bank_account: {
          ...prevState.bank_account,
          [name === "bank_account_account" ? "account_number" : "routing_number"]: value,
        },
      }));
    } else {
      setPaymentMethods((prevState) => ({
        ...prevState,
        [name]: { ...prevState[name], value },
      }));
    }
  };

  

  const handlePaymentStep = async () => {
    setShowSpinner(true);
    const keys = Object.keys(paymentMethods);
    const putPayload = [];
    const postPayload = [];
    keys.forEach((key) => {
      if (paymentMethods[key].value !== "" || (key === "bank_account" && paymentMethods[key].checked)) {
        let paymentMethodPayload = {
          paymentMethod_type: key,
          paymentMethod_profile_id: getProfileId(),
        };
        if (key === "bank_account") {
          const bankAccount = paymentMethods[key];
          if (bankAccount.routing_number && bankAccount.account_number) {
            paymentMethodPayload.paymentMethod_routing_number = bankAccount.routing_number;
            paymentMethodPayload.paymentMethod_account_number = bankAccount.account_number;
            paymentMethodPayload.paymentMethod_status = bankAccount.checked? "Active" : "Inactive";
            if (bankAccount.uid) {
              putPayload.push({ ...paymentMethodPayload, paymentMethod_uid: bankAccount.uid });
            } else {
              postPayload.push(paymentMethodPayload);
            }
          }
        } else {
          paymentMethodPayload.paymentMethod_name = paymentMethods[key].value;
          paymentMethodPayload.paymentMethod_status = paymentMethods[key].checked? "Active" : "Inactive";
          if (paymentMethods[key].uid) {
            putPayload.push({ ...paymentMethodPayload, paymentMethod_uid: paymentMethods[key].uid });
          } else {
            postPayload.push(paymentMethodPayload);
          }
        }
      }
    });

    if (putPayload.length > 0) {
      await axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod", putPayload, { headers: { "Content-Type": "application/json" } });
    }

    if (postPayload.length > 0) {
      await axios.post("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod", postPayload, { headers: { "Content-Type": "application/json" } });
    }

    setShowSpinner(false);
    setCookie("default_form_vals", { ...cookiesData, paymentMethods });
  };

  const handleNextStep = async () => {    
    if (firstName === "") {
      alert("Please enter first name");
      return;
    }
    if (lastName === "") {
      alert("Please enter last name");
      return;
    }

    if (!DataValidator.email_validate(email)) {
      alert("Please enter a valid email");
      return false;
    }

    if (!DataValidator.phone_validate(phoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }

    if (!DataValidator.zipCode_validate(zip)) {
      alert("Please enter a valid zip code");
      return false;
    }

    if (!DataValidator.ssn_validate(ssn)) {
      alert("Please enter a valid SSN");
      return false;
    }

    setCookie("default_form_vals", { ...cookiesData, firstName, lastName });

    // const payload = getPayload();
    // const form = encodeForm(payload);
    // const data = await saveProfile(form);

    saveProfile();

    const paymentSetup = await handlePaymentStep();
    setShowSpinner(false);
    return;
  };

  const showSnackbar = (message, severity) => {
    console.log('Inside show snackbar');
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdate = () => {
    // setIsUpdate( prevState => !prevState);
    console.log('handleUpdate called');
    setIsSave(true);
}

  const editOrUpdateOwner = async () => {
    console.log('inside editOrUpdateOwner', modifiedData);
    try {
        if (modifiedData.length > 0) {
            setShowSpinner(true);
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "*",
            };

            const profileFormData = new FormData();

            // const feesJSON = JSON.stringify(leaseFees)
            // leaseApplicationFormData.append("lease_fees", feesJSON);
            // leaseApplicationFormData.append('lease_adults', leaseAdults ? JSON.stringify(adultsRef.current) : null);
            modifiedData.forEach(item => {
                console.log(`Key: ${item.key}`);                
                  profileFormData.append(item.key, JSON.stringify(item.value));                
            });
            profileFormData.append('owner_uid', profileData.owner_uid);
            
        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', profileFormData, headers)
            .then((response) => {
                console.log('Data updated successfully', response);
                showSnackbar("Your profile has been successfully updated.", "success");                
                handleUpdate();
                setShowSpinner(false);
            })
            .catch((error) => {
                setShowSpinner(false);
                showSnackbar("Cannot update your profile. Please try again", "error");
                if (error.response) {
                    console.log(error.response.data);
                }
            });
        setShowSpinner(false);
        setModifiedData([]);
    } else {
        showSnackbar("You haven't made any changes to the form. Please save after changing the data.", "error");
    }
    } catch (error) {
        showSnackbar("Cannot update the lease. Please try again", "error");
        console.log("Cannot Update the lease", error);
        setShowSpinner(false);
    }
  }

  const saveProfile = async () => {
    console.log('inside saveProfile', modifiedData);
    try {
        if (modifiedData.length > 0) {
            setShowSpinner(true);
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "*",
            };

            const profileFormData = new FormData();

            // const feesJSON = JSON.stringify(leaseFees)
            // leaseApplicationFormData.append("lease_fees", feesJSON);
            // leaseApplicationFormData.append('lease_adults', leaseAdults ? JSON.stringify(adultsRef.current) : null);
            modifiedData.forEach(item => {
              console.log(`Key: ${item.key}`);                
              profileFormData.append(item.key, item.value);                
            });
            profileFormData.append('owner_uid', profileData.owner_uid);
            
        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', profileFormData, headers)
            .then((response) => {
                console.log('Data updated successfully', response);
                showSnackbar("Your profile has been successfully updated.", "success");                
                handleUpdate();
                setShowSpinner(false);
            })
            .catch((error) => {
                setShowSpinner(false);
                showSnackbar("Cannot update your profile. Please try again", "error");
                if (error.response) {
                    console.log(error.response.data);
                }
            });
        setShowSpinner(false);
        setModifiedData([]);
    } else {
        showSnackbar("You haven't made any changes to the form. Please save after changing the data.", "error");
    }
    } catch (error) {
        showSnackbar("Cannot update the lease. Please try again", "error");
        console.log("Cannot Update the lease", error);
        setShowSpinner(false);
    }
  }


  return (
    <>
      <Grid        
        container
        sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", cursor: "pointer", marginBottom: '10px', padding: '10px', }}
      >
        <Grid item xs={12}>
          <Typography align="center" gutterBottom sx={{ fontSize: '24px', fontWeight: "bold", color: "#1f1f1f" }}>
            Owner Profile Information
          </Typography>
          <Grid container item xs={12}>
            <Grid container alignContent='center' item xs={3}>
              <Grid container justifyContent='center' item xs={12}>
                {photo && photo.image ? (
                <img
                  key={Date.now()}
                  src={photo.image}
                  style={{
                    width: "121px",
                    height: "121px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  alt="profile"
                />
                ) : (
                  <img src={DefaultProfileImg} alt="default" style={{ width: "121px", height: "121px", borderRadius: "50%" }} />
                )}
              </Grid>
              <Grid  container justifyContent='center' item xs={12} sx={{ marginTop: '20px',}}>
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    backgroundColor: "#3D5CAC",
                    width: "193px",
                    height: "35px",
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                  }}
                >
                  {" "}
                  Add Profile Pic
                  <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                </Button>

              </Grid>
            </Grid>
            <Grid container item xs={9}  columnSpacing={2}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    width: "100%",
                  }}
                >
                  {"First Name"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    width: "100%",
                  }}
                >
                  {"Last Name"}
                </Typography>
              </Grid>
              <Grid container item xs={12} columnSpacing={2}>
                <Grid item xs={6}>
                  <TextField name="firstName" value={firstName} onChange={(e) => handleFirstNameChange(e)} variant="filled" fullWidth placeholder="First name" className={classes.root} />
                </Grid>
                <Grid item xs={6}>
                  <TextField name="lastName" value={lastName} variant="filled" onChange={handleLastNameChange} fullWidth placeholder="Last name" className={classes.root} />
                </Grid>
                

              </Grid>
              <Grid container item xs={12} columnSpacing={4}>
                <Grid container item xs={3}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"Personal Address"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AddressAutocompleteInput onAddressSelect={handleAddressSelect} gray={true} defaultValue={address} />
                  </Grid>
                  
                </Grid>
                <Grid container item xs={2}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"Unit"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={unit} onChange={ handleUnitChange } variant="filled" placeholder="3" className={classes.root}></TextField>
                  </Grid>
                  
                </Grid>
                <Grid container item xs={2}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"City"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField disabled name="City" value={city} onChange={(e) => setCity(e.target.value)} variant="filled" placeholder="City" className={classes.root} />
                  </Grid>
                  
                </Grid>

                <Grid container item xs={2}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"State"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField disabled name="State" value={state} onChange={(e) => setState(e.target.value)} variant="filled" placeholder="State" className={classes.root} />
                  </Grid>
                  
                </Grid>

                <Grid container item xs={3}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"Zip Code"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField disabled name="Zip" value={zip} onChange={(e) => setZip(e.target.value)} variant="filled" placeholder="Zip" className={classes.root} />
                  </Grid>
                  
                </Grid>
              </Grid>

              <Grid container item xs={12} columnSpacing={4}>
                <Grid container item xs={6}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"Personal Email"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth value={email} onChange={handleEmailChange} variant="filled" placeholder="Email" className={classes.root}></TextField>
                  </Grid>
                  
                </Grid>
                <Grid container item xs={6}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"Personal Phone Number"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth value={phoneNumber} onChange={handlePhoneNumberChange} variant="filled" placeholder="Phone Number" className={classes.root}></TextField>
                  </Grid>
                  
                </Grid>                
              </Grid>              

              <Grid container item xs={12} columnSpacing={4}>
                <Grid container item xs={6}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                        width: "100%",
                      }}
                    >
                      {"SSN"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth
                      // value={mask}
                      value={ssn}
                      // onChange={(e) => setSsn(e.target.value)}
                      onChange={handleSSNChange}
                      variant="filled"
                      placeholder="SSN"
                      className={classes.root}
                    >
                    </TextField>
                  </Grid>
                  
                </Grid>                                                         
              </Grid>
            </Grid>

          </Grid>
        </Grid>

        
      </Grid>

      <Grid        
        container
        sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", marginBottom: '10px', padding: '10px',}}
      >
        <Grid item xs={12}>
          <Typography align="center" gutterBottom sx={{ fontSize: '24px', fontWeight: "bold", color: "#1f1f1f", }}>
            Payment Information
          </Typography>

        </Grid>
        <Grid container item xs={12}>          
          {renderPaymentMethods()}
        </Grid>
        
      </Grid>

      <Grid container justifyContent='center' item xs={12}>
        <Button variant="contained" color="primary" onClick={handleNextStep} disabled={nextStepDisabled} sx={{ mb: 2, backgroundColor: "#3D5CAC", }}>
          <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF', textTransform: 'none', }}>
            Save
          </Typography>
        </Button>
      </Grid>

      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
            <AlertTitle>{snackbarSeverity === "error" ? "Error" : "Success"}</AlertTitle>
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
