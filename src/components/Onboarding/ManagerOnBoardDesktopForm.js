import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import AddressAutocompleteInput from "../Property/AddressAutocompleteInput";
import DataValidator from "../DataValidator";
import { formatPhoneNumber, headers, maskNumber, photoFields } from "./helper";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Checkbox,
    Grid,
    CircularProgress,
    Backdrop,
    Paper,
    Select,
    MenuItem,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import PayPal from "../../images/PayPal.png";
import ZelleIcon from "../../images/Zelle.png";
import VenmoIcon from "../../images/Venmo.png";
import Stripe from "../../images/Stripe.png";
import ApplePay from "../../images/ApplePay.png";
import ChaseIcon from "../../images/Chase.png";
import { useCookies } from "react-cookie";

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

const ManagerOnBoardDesktopForm = ({profileData, setIsSave}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["default_form_vals"]);
  /// new States

  const [cookie] = useCookies(["user"]);  // Removed setCookie since it is unused
  const cookiesDataUser = cookie["user"];

  const userRoles =  cookiesDataUser?.role.split(",") ;
  console.log("cookiesData ", cookiesDataUser);
  console.log("Current User Roles in management: ", userRoles);
  
  // 
  const [fees, setFees] = useState([{ id: 1, fee_name: "", frequency: "", charge: "", of: "" }]);
  const [services, setServices] = useState([{ id: 1, service_name: "", hours: "", charge: "", total_cost: "" }]);
  const [locations, setLocations] = useState([{ id: 1, address: "", city: "", state: "", miles: "" }]);
  const [ein_mask, setEinMask] = useState("");
 
  const cookiesData = cookies["default_form_vals"];
  const [showSpinner, setShowSpinner] = useState(false);
  const [addPhotoImg, setAddPhotoImg] = useState();
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [dashboardButtonEnabled, setDashboardButtonEnabled] = useState(false);
  const { user, isBusiness, isManager, roleName,selectRole, selectedRole,setLoggedIn, updateProfileUid, isLoggedIn, getProfileId , getRoleId} = useUser();
  
  console.log("user from Useuser ", user);
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, phoneNumber, setPhoneNumber, businessName, setBusinessName, photo, setPhoto } = useOnboardingContext();
  const { ein, setEin, ssn, setSsn, mask, setMask, address, setAddress, unit, setUnit, city, setCity, state, setState, zip, setZip } = useOnboardingContext();
  const[ employee_photo_url, setEmployeePhoto]=useState('')
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: { value: "", checked: false, uid: "", status: "Inactive" },
    apple_pay: { value: "", checked: false, uid: "", status: "Inactive" },
    stripe: { value: "", checked: false, uid: "", status: "Inactive" },
    zelle: { value: "", checked: false, uid: "", status: "Inactive" },
    venmo: { value: "", checked: false, uid: "", status: "Inactive" },
    credit_card: { value: "", checked: false, uid: "", status: "Inactive" },
    bank_account: { account_number: "", routing_number: "", checked: false, uid: "", status: "Inactive" },
});


  // Personal info state variables
  const [empFirstName, setEmpFirstName] = useState("");
  const [empLastName, setEmpLastName] = useState("");
  const [empPhoneNumber, setEmpPhoneNumber] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empAddress, setEmpAddress] = useState("");
  const [empUnit, setEmpUnit] = useState("");
  const [empCity, setEmpCity] = useState("");
  const [empState, setEmpState] = useState("");
  const [empZip, setEmpZip] = useState("");
  const [empSsn, setEmpSsn] = useState("");
  const [empMask, setEmpMask] = useState("");


  useEffect(() => {
    console.log("calling useeffect")
    //setIsSave(false)
    const fetchProfileData = async () => {
        setShowSpinner(true);
        try {
        //     const profileResponse = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`);
        // const profileData = profileResponse.data.profile.result[0];

        setBusinessName(profileData.business_name || "");
        setEmail(profileData.business_email || "");
        setPhoneNumber(formatPhoneNumber(profileData.business_phone_number || ""));
        setPhoto(profileData.business_photo_url ? { image: profileData.business_photo_url } : null);
        setEin(profileData.business_ein_number ? AES.decrypt(profileData.business_ein_number, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8) : "");
        setMask(profileData.business_ein_number ? maskNumber(AES.decrypt(profileData.business_ein_number, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8)) : "");
        setAddress(profileData.business_address || "");
        setUnit(profileData.business_unit || "");
        setCity(profileData.business_city || "");
        setState(profileData.business_state || "");
        setZip(profileData.business_zip || "");
        if(profileData.business_services_fees){
        setFees(JSON.parse(profileData.business_services_fees));
        }
        if(profileData.business_locations){
            setLocations(JSON.parse(profileData.business_locations));
        }
       

        const paymentMethodsData = JSON.parse(profileData.paymentMethods);
                const updatedPaymentMethods = {
                    paypal: { value: "", checked: false, uid: "", status: "Inactive" },
                    apple_pay: { value: "", checked: false, uid: "", status: "Inactive" },
                    stripe: { value: "", checked: false, uid: "", status: "Inactive" },
                    zelle: { value: "", checked: false, uid: "", status: "Inactive" },
                    venmo: { value: "", checked: false, uid: "", status: "Inactive" },
                    credit_card: { value: "", checked: false, uid: "", status: "Inactive" },
                    bank_account: { account_number: "", routing_number: "", checked: false, uid: "", status: "Inactive" },
                };
                paymentMethodsData.forEach((method) => {
                    const status = method.paymentMethod_status || "Inactive";
                    if (method.paymentMethod_type === "bank_account") {
                        updatedPaymentMethods.bank_account = {
                            account_number: method.paymentMethod_account_number || "",
                            routing_number: method.paymentMethod_routing_number || "",
                            checked: status === "Active",
                            uid: method.paymentMethod_uid,
                            status,
                        };
                    } else {
                        updatedPaymentMethods[method.paymentMethod_type] = {
                            value: method.paymentMethod_name,
                            checked: status === "Active",
                            uid: method.paymentMethod_uid,
                            status,
                        };
                    }
                });
                setPaymentMethods(updatedPaymentMethods);

            setShowSpinner(false);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setShowSpinner(false);
        }
        try {
            // const employeeResponse = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee/${getProfileId()}`);
            // const employeeData = employeeResponse.data.employee.result[0];
      
            setEmpFirstName(profileData.employee_first_name || "");
            setEmpLastName(profileData.employee_last_name || "");
            setEmpPhoneNumber(formatPhoneNumber(profileData.employee_phone_number || ""));
            setEmpEmail(profileData.employee_email || "");
            setEmployeePhoto(profileData.employee_photo_url ? { image: profileData.employee_photo_url } : null);
            setEmpSsn(profileData.employee_ssn ? AES.decrypt(profileData.employee_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8) : "");
            setEmpMask(profileData.employee_ssn ? maskNumber(AES.decrypt(profileData.employee_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8)) : "");
            setEmpAddress(profileData.employee_address || "");
            setEmpUnit(profileData.employee_unit || "");
            setEmpCity(profileData.employee_city || "");
            setEmpState(profileData.employee_state || "");
            setEmpZip(profileData.employee_zip || "");
      
            setShowSpinner(false);
          } catch (error) {
            console.error("Error fetching employee data:", error);
            setShowSpinner(false);
          }

        
    };

    fetchProfileData();


}, []);
//isSave

  const saveProfile = async (form) => {
      const profileApi = "/profile"
      const { data } = await axios.put(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev${profileApi}`, form, headers);
      return data;
  };

  const addFeeRow = () => {
      setFees((prev) => [...prev, { id: prev.length + 1, fee_name: "", frequency: "", charge: "", of: "" }]);
  };

  const handleFeeChange = (event, id) => {
    const { name, value } = event.target;
    setFees((prevFees) =>
      prevFees.map((fee) =>
        fee.id === id ? { ...fee, [name]: value } : fee
      )
    );
  };

  const handleFrequencyChange = (event, id) => {
    const { value } = event.target;
    setFees((prevFees) =>
      prevFees.map((fee) =>
        fee.id === id ? { ...fee, frequency: value } : fee
      )
    );
  };
 
  const handleNavigation =(e) => {
    selectRole('MANAGER');
    setLoggedIn(true);
    navigate("/managerDashboard")
}

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

  const handleFirstNameChange = (event) => {
      setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
      setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
      setEmail(event.target.value);
  };

  const handleEmpPhotoChange = (e) => {
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
    const reader = new FileReader();
      reader.onload = (e) => {
          file.image = e.target.result;
          setEmployeePhoto(file);
      };
      reader.readAsDataURL(file.file);
};

  const handleSsnChange = (event) => {
      let value = event.target.value;
      if (!value) {
        setSsn("");
        setMask("");
        return;
      }
      if (value.length > 11) return;
      const lastChar = value.charAt(value.length - 1);
      if (mask.length > value.length) {
        if (lastChar !== "-") setSsn(ssn.slice(0, ssn.length - 1));
        setMask(value);
      } else {
        setSsn(ssn + lastChar);
        setMask(maskNumber(ssn + lastChar));
      }
  };

  const getPayload = () => {
      console.log("fees",fees);
      console.log("location",locations);
      return {
        business_user_id: user.user_uid,
        business_uid:getProfileId(),
        business_type: "MANAGEMENT",
        business_name: businessName,
        business_photo_url: photo,
        business_phone_number: phoneNumber,
        business_email: email,
        business_ein_number: AES.encrypt(ein, process.env.REACT_APP_ENKEY).toString(),
        business_services_fees: JSON.stringify(fees),
        business_locations: JSON.stringify(locations),
        business_address: address,
        business_unit: unit,
        business_city: city,
        business_state: state,
        business_zip: zip,
        employee_user_id: user.user_uid,
      employee_uid:getRoleId(),
      employee_business_id: getProfileId(),
      employee_first_name: empFirstName,
      employee_last_name: empLastName,
      employee_phone_number: empPhoneNumber,
      employee_email: empEmail,
      employee_role: "OWNER",
      employee_photo_url: employee_photo_url,
      employee_address: empAddress,
      employee_unit: empUnit,
      employee_city: empCity,
      employee_state: empState,
      employee_zip: empZip,
      employee_ssn: AES.encrypt(empSsn, process.env.REACT_APP_ENKEY).toString()
      };           
  };

  const handlePhoneNumberChange = (event) => {
      setPhoneNumber(formatPhoneNumber(event.target.value));
  };

  const handleUnitChange = (event) => {
      setUnit(event.target.value);
  };

  const handleCityChange = (event) => {
      setCity(event.target.value);
  };

  const handleStateChange = (event) => {
      setState(event.target.value);
  };

  const handleAddressSelect = (address) => {
      setAddress(address.street ? address.street : "");
      setCity(address.city ? address.city : "");
      setState(address.state ? address.state : "");
      setZip(address.zip ? address.zip : "");
  };

  const readImage = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          file.image = e.target.result;
          setPhoto(file);
      };
      reader.readAsDataURL(file.file);
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

  const encodeForm = (payload) => {
      const form = new FormData();
      for (let key in payload) {
        if (photoFields.has(key)) {
            if (payload[key] && payload[key].file instanceof File) {
                form.append(key, payload[key].file);
            }
        } else {
          form.append(key, payload[key]);
        }
      }
      return form;
  };

  const handleNextStep = async() => {
      setCookie("default_form_vals", { ...cookiesData, firstName, lastName });
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
      
      
      console.log("fees",fees);
      console.log("location",locations);
      const payload = getPayload();
      const form = encodeForm(payload);
      const data = await saveProfile(form);
      const paymentSetup = await handlePaymentStep();
      setIsSave(true);
       
      //const createEmp= await SaveEmpStep();
      

      setShowSpinner(false);
    //   let role_id = {};
    //   if (data.business_uid) {
        
    //      updateProfileUid({ business_uid: data.business_uid });
    //       let businesses = user.businesses;
    //      businesses["MANAGEMENT"].business_uid = data.business_uid;
    //       role_id = { businesses };
    //       setCookie("user", { ...user, ...role_id });
    //       const paymentSetup = await handlePaymentStep(data.business_uid);
    //       console.log(paymentSetup);
    //       const createEmp= await SaveEmpStep(data.business_uid);
    //       console.log(createEmp);
    //       setDashboardButtonEnabled(true);
         
    //   }
    //   setCookie("default_form_vals", { ...cookiesData, phoneNumber, email, address, unit, city, state, zip, ssn });
      // navigate("/onboardingRouter");
      return;
  };


  const SaveEmpStep = async () => {
   // setShowSpinner(true);
    const payload = {
      employee_user_id: user.user_uid,
      employee_uid:getRoleId(),
      employee_business_id: getProfileId(),
      employee_first_name: empFirstName,
      employee_last_name: empLastName,
      employee_phone_number: empPhoneNumber,
      employee_email: empEmail,
      employee_role: "OWNER",
      employee_photo_url: photo,
      employee_address: empAddress,
      employee_unit: empUnit,
      employee_city: empCity,
      employee_state: empState,
      employee_zip: empZip,
      employee_ssn: AES.encrypt(empSsn, process.env.REACT_APP_ENKEY).toString(),
    };

    const formPayload= encodeForm(payload);
    const data = await saveProfile(formPayload);
    
      
    // for (const key of Object.keys(payload)) {
    //   if (key === "employee_photo" && payload[key]) formPayload.append(key, payload[key].file);
    //   else formPayload.append(key, payload[key]);
    // }
    //const { data } = await axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee", formPayload, headers);
   // setCookie("default_form_vals", { ...cookiesData, firstName, lastName, phoneNumber, email, address, unit, city, state, zip });
//updateProfileUid({ business_owner_id: data.employee_uid });
    //setShowSpinner(false);
    
  };
 


  const handleChangeChecked = (e) => {
    const { name, checked } = e.target;
    const map = { ...paymentMethods };
    map[name].checked = checked;
    map[name].status = checked ? "Active" : "Inactive";
    setPaymentMethods(map);
};


  useEffect(() => {
      let disable_state = Object.keys(paymentMethods).some((key) => {
          if (paymentMethods[key].checked && paymentMethods[key].value === "") {
              return true;
          }
          if (
              key === "bank_account" &&
              paymentMethods[key].checked &&
              (paymentMethods[key].account_number === "" || paymentMethods[key].routing_number === "")
          ) {
              return true;
          }
          return false;
      });
      setNextStepDisabled(disable_state);
  }, [paymentMethods]);
  
  const handleNameChange = (event) => {
    setBusinessName(event.target.value);
  };

  const handlePaymentStep = async () => {
    setShowSpinner(true);
    const keys = Object.keys(paymentMethods);
    const putPayload = [];
    const postPayload = [];
    keys.forEach((key) => {
        if (paymentMethods[key].uid) {
            let paymentMethodPayload = {
                paymentMethod_type: key,
                paymentMethod_profile_id: getProfileId(),
                paymentMethod_status: paymentMethods[key].status,
            };
            if (key === "bank_account") {
                const bankAccount = paymentMethods[key];
                paymentMethodPayload.paymentMethod_routing_number = bankAccount.routing_number;
                paymentMethodPayload.paymentMethod_account_number = bankAccount.account_number;
                paymentMethodPayload.paymentMethod_uid = bankAccount.uid;
            } else {
                paymentMethodPayload.paymentMethod_name = paymentMethods[key].value;
                paymentMethodPayload.paymentMethod_uid = paymentMethods[key].uid;
            }
            putPayload.push(paymentMethodPayload);
        } else if (paymentMethods[key].checked) {
            let paymentMethodPayload = {
                paymentMethod_type: key,
                paymentMethod_profile_id: getProfileId(),
                paymentMethod_status: "Active",
            };
            if (key === "bank_account") {
                const bankAccount = paymentMethods[key];
                paymentMethodPayload.paymentMethod_routing_number = bankAccount.routing_number;
                paymentMethodPayload.paymentMethod_account_number = bankAccount.account_number;
            } else {
                paymentMethodPayload.paymentMethod_name = paymentMethods[key].value;
            }
            postPayload.push(paymentMethodPayload);
        }
    });

    if (putPayload.length > 0) {
        await axios.put(
            "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
            putPayload,
            { headers: { "Content-Type": "application/json" } }
        );
    }

    if (postPayload.length > 0) {
        await axios.post(
            "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
            postPayload,
            { headers: { "Content-Type": "application/json" } }
        );
    }

    setShowSpinner(false);
    setCookie("default_form_vals", { ...cookiesData, paymentMethods });
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
        <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            key={index}
        >
            <Grid item xs={2}>
                <Checkbox
                    name={method.name.toLowerCase().replace(/\s/g, "_")}
                    checked={method.state?.checked}
                    onChange={handleChangeChecked}
                />
            </Grid>
            <Grid item xs={2}>
                <img src={method.icon} alt={method.name} />
            </Grid>
            {method.name === "Bank Account" ? (
                <>
                    <Grid item xs={4}>
                        <TextField
                            name={`${method.name.toLowerCase().replace(/\s/g, "_")}_account`}
                            value={method.state?.account_number}
                            onChange={handleChangeValue}
                            variant="filled"
                            fullWidth
                            placeholder={`Enter Your Bank Account Number`}
                            className={classes.root}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            name={`${method.name.toLowerCase().replace(/\s/g, "_")}_routing`}
                            value={method.state?.routing_number}
                            onChange={handleChangeValue}
                            variant="filled"
                            fullWidth
                            placeholder={`Enter Your Bank Routing Number`}
                            className={classes.root}
                        />
                    </Grid>
                </>
            ) : (
                <Grid item xs={8}>
                    <TextField
                        name={method.name.toLowerCase().replace(/\s/g, "_")}
                        value={method.state?.value}
                        onChange={handleChangeValue}
                        variant="filled"
                        fullWidth
                        placeholder={`Enter ${method.name}`}
                        className={classes.root}
                    />
                </Grid>
            )}
        </Grid>
    ));
};
//   "business_services_fees": "[{\"id\": 1, \"of\": \"Rent\", \"charge\": \"15%\", \"fee_name\": \"Service Charge\", \"frequency\": \"Annually\"}]",
//                 "business_locations": "[{\"id\": 1, \"city\": \"Boston\", \"miles\": \"50\", \"state\": \"MA\", \"address\": \"\", \"location\": \"MA\"}]",
 

// "business_services_fees": "[{\"id\": 1, \"of\": \"Rent\", \"charge\": \"15%\", \"fee_name\": \"Service Charge\", \"frequency\": \"Annually\"}]",


const renderFees = () => {
    return fees.map((row, index) => (
      <div key={row.id} style={{ position: 'relative' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}>
            <Stack spacing={-2} m={2}>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {"Fee Name"}
              </Typography>
              <TextField
                name="fee_name"
                value={row.fee_name}
                variant="filled"
                fullWidth
                placeholder="Service Charge"
                className={classes.root}
                onChange={(e) => handleFeeChange(e, row.id)}
              />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={-2} m={2}>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {"Frequency"}
              </Typography>
              <Select
                value={row.frequency}
                size="small"
                fullWidth
                onChange={(e) => handleFrequencyChange(e, row.id)}
                placeholder="Select frequency"
                className={classes.select}
              >
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Biweekly">Biweekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Annually">Annually</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={-2} m={2}>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {"Percent"}
              </Typography>
              <TextField
                name="charge"
                value={row.charge}
                variant="filled"
                fullWidth
                placeholder="15%"
                className={classes.root}
                onChange={(e) => handleFeeChange(e, row.id)}
              />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={-2} m={2}>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {"Flat Rate"}
              </Typography>
              <TextField
                name="of"
                value={row.of}
                variant="filled"
                fullWidth
                placeholder="Rent"
                className={classes.root}
                onChange={(e) => handleFeeChange(e, row.id)}
              />
            </Stack>
          </Grid>
        </Grid>
        {index !== 0 && (
          <IconButton
            aria-label="delete"
            sx={{ position: 'absolute', top: 0, right: 0 }}
            onClick={() => removeFeeRow(row.id)}
          >
            <CloseIcon />
          </IconButton>
        )}
        {row.id === fees.length ? (
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "right",
            }}
          >
            <div onClick={addFeeRow} style={{ cursor: "pointer" }}>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                Add another fee
              </Typography>
            </div>
          </Stack>
        ) : (
          <hr />
        )}
      </div>
    ));
  };
  
  const removeFeeRow = (id) => {
    setFees(fees.filter((fee) => fee.id !== id));
  };
  
  const handleEmpFirstNameChange = (event) => {
    setEmpFirstName(event.target.value);
  };

  const handleEmpLastNameChange = (event) => {
    setEmpLastName(event.target.value);
  };

  const handleEmpPhoneNumberChange = (event) => {
    setEmpPhoneNumber(formatPhoneNumber(event.target.value));
  };

  const handleEmpEmailChange = (event) => {
    setEmpEmail(event.target.value);
  };

  const handleEmpSsnChange = (event) => {
    let value = event.target.value;
    if (!value) {
      setEmpSsn("");
      setEmpMask("");
      return;
    }
    if (value.length > 11) return;
    const lastChar = value.charAt(value.length - 1);
    if (empMask.length > value.length) {
      if (lastChar !== "-") setEmpSsn(empSsn.slice(0, empSsn.length - 1));
      setEmpMask(value);
    } else {
      setEmpSsn(empSsn + lastChar);
      setEmpMask(maskNumber(empSsn + lastChar));
    }
  };

  const handleEmpAddressSelect = (address) => {
    setEmpAddress(address.street ? address.street : "");
    setEmpCity(address.city ? address.city : "");
    setEmpState(address.state ? address.state : "");
    setEmpZip(address.zip ? address.zip : "");
  };

  const handleEmpUnitChange = (event) => {
    setEmpUnit(event.target.value);
  };

  const handleEmpCityChange = (event) => {
    setEmpCity(event.target.value);
  };

  const handleEmpStateChange = (event) => {
    setEmpState(event.target.value);
  };

  const handleEmpZipChange = (event) => {
    setEmpZip(event.target.value);
  };

  return (
      <div>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
              Property Manager Profile Info
          </Typography>
          <Box display="flex">
              <Box width="20%" p={2}>
                  {/* <h1> Profile pic</h1> */}
                  <Stack direction="row" justifyContent="center">
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
                  </Stack>
                  <Box sx={{ paddingTop: "8%" }} />
                  <Box
                      sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                      }}
                  >
                      <Button
                          component="label"
                          variant="contained"
                          sx={{
                            backgroundColor:  "#3D5CAC" ,
                              width: "193px",
                              height: "35px",
                             
                          }}
                      >
                          Add Business Pic
                          <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                      </Button>
                  </Box>
              </Box>
              <Box width="80%" p={3} sx={{ overflowY: 'auto' }}>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Business Name"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField name="business" value={businessName} onChange={handleNameChange} variant="filled" fullWidth placeholder="Business name" className={classes.root} />
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '50%'
                          }}
                      >
                          {"Business Address"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"Unit"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '20%'
                          }}
                      >
                          {"City"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"State"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"Zip code"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
        
                      <Box sx={{ width: '50%' }}>
                        <AddressAutocompleteInput  onAddressSelect={handleAddressSelect} gray={true} defaultValue={address}/>
                      </Box>
                      <TextField value={unit} onChange={handleUnitChange} variant="filled" sx={{ width: '10%' }} placeholder="Unit" className={classes.root}></TextField>
                      <TextField name="City" value={city} onChange={handleCityChange} variant="filled" sx={{ width: '20%' }} placeholder="City" className={classes.root} />
                      <TextField name="State" value={state} onChange={handleStateChange} variant="filled" sx={{ width: '10%' }} placeholder="State" className={classes.root} />
                      <TextField name="Zip" value={zip} onChange={(e) => setZip(e.target.value)} variant="filled" sx={{ width: '10%' }} placeholder="Zip" className={classes.root} />
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Business Email Address"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Business Phone Number"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField name="BusinessEmail" value={email} variant="filled" fullWidth onChange={handleEmailChange} placeholder="email@site.com" className={classes.root} />
                      <TextField
                          value={phoneNumber}
                          type="tel"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          onChange={handlePhoneNumberChange}
                          placeholder="(000)000-0000"
                          variant="filled"
                          fullWidth
                          className={classes.root}
                      ></TextField>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Tax ID (EIN or SSN)"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField value={mask} onChange={handleSsnChange} variant="filled" fullWidth placeholder="Enter EIN" className={classes.root}></TextField>
                  </Stack>
              </Box>
          </Box>
          <hr />
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
              Management Fees
          </Typography>
          <Box p={3}>
              <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                  {renderFees()}
              </Paper>
          </Box>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
              Business Payment Methods
          </Typography>
          <Box p={3} sx={{ maxWidth: '800px' }}>
              <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={showSpinner}
              >
                  <CircularProgress color="inherit" />
              </Backdrop>
              <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                  {renderPaymentMethods()}
              </Paper>
          </Box>
          <hr/>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
              Property Manager Personal Info
          </Typography>
          <Box display="flex" p={3}>
              <Box width="20%" p={2}>
                  {/* <Typography>Personal pic</Typography> */}
                  <Stack direction="row" justifyContent="center">
                      {employee_photo_url && employee_photo_url.image ? (
                          <img
                              key={Date.now()}
                              src={employee_photo_url.image}
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
                  </Stack>
                  <Box sx={{ paddingTop: "8%" }} />
                  <Box
                      sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                      }}
                  >
                      <Button
                          component="label"
                          variant="contained"
                          sx={{
                            backgroundColor:  "#3D5CAC" ,
                              width: "193px",
                              height: "35px",
                             
                          }}
                      >   Add Profile Pic
                          <input type="file" hidden accept="image/*" onChange={handleEmpPhotoChange}/>
                      </Button>
                  </Box>
              </Box>
              <Box width="80%" p={3} sx={{ overflowY: 'auto' }}>
              <Stack spacing={2} direction="row"  >
                        <Typography
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                                width: '100%'
                            }}
                        >
                            {"First Name"}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                                width: '100%'
                            }}
                        >
                            {"Last Name"}
                        </Typography>
                    </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField name="empFirstName" value={empFirstName} onChange={handleEmpFirstNameChange} variant="filled" fullWidth placeholder="First Name" className={classes.root} />
                      <TextField name="empLastName" value={empLastName} onChange={handleEmpLastNameChange} variant="filled" fullWidth placeholder="Last Name" className={classes.root} />
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '50%'
                          }}
                      >
                          {"Personal Address"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"Unit"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '20%'
                          }}
                      >
                          {"City"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"State"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '10%'
                          }}
                      >
                          {"Zip code"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Box sx={{ width: '50%' }}>
                        <AddressAutocompleteInput  onAddressSelect={handleEmpAddressSelect} gray={true} defaultValue={empAddress}/>
                      </Box>
                      <TextField value={empUnit} onChange={handleEmpUnitChange} variant="filled" sx={{ width: '10%' }} placeholder="Unit" className={classes.root}></TextField>
                      <TextField name="empCity" value={empCity} onChange={handleEmpCityChange} variant="filled" sx={{ width: '20%' }} placeholder="City" className={classes.root} />
                      <TextField name="empState" value={empState} onChange={handleEmpStateChange} variant="filled" sx={{ width: '10%' }} placeholder="State" className={classes.root} />
                      <TextField name="empZip" value={empZip} onChange={handleEmpZipChange} variant="filled" sx={{ width: '10%' }} placeholder="Zip" className={classes.root} />
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Personal Email Address"}
                      </Typography>
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"Personal Phone Number"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField name="empEmail" value={empEmail} variant="filled" fullWidth onChange={handleEmpEmailChange} placeholder="email@site.com" className={classes.root} />
                      <TextField
                          value={empPhoneNumber}
                          type="tel"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          onChange={handleEmpPhoneNumberChange}
                          placeholder="(000)000-0000"
                          variant="filled"
                          fullWidth
                          className={classes.root}
                      ></TextField>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <Typography
                          sx={{
                              color: theme.typography.common.blue,
                              fontWeight: theme.typography.primary.fontWeight,
                              width: '100%'
                          }}
                      >
                          {"SSN"}
                      </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                      <TextField value={empMask} onChange={handleEmpSsnChange} variant="filled" fullWidth placeholder="Enter SSN" className={classes.root}></TextField>
                  </Stack>
              </Box>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={5}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextStep}
                    disabled={nextStepDisabled}
                    sx={{ mb: 2, backgroundColor:  "#3D5CAC"  }}
                >
                    Save
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNavigation}
                    disabled={!dashboardButtonEnabled}
                >
                    Go to Dashboard
                </Button> */}
            </Box>
      </div>
  );
};

export default ManagerOnBoardDesktopForm;
