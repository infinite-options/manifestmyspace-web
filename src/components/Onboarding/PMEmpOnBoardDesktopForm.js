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
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import { objToQueryString } from "../utils/helper";
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
import { makeStyles } from "@mui/styles";
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
    select: {
        backgroundColor: "#D6D5DA",
        height: 30,
        width: "90%",
        borderRadius: "10px !important",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D6D5DA",
        },
    },
}));

const PMEmpOnBoardDesktopForm = ({ profileData, setIsSave }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["default_form_vals"]);
    const cookiesData = cookies["default_form_vals"];
    const [showSpinner, setShowSpinner] = useState(false);
    const [addPhotoImg, setAddPhotoImg] = useState();
    const [nextStepDisabled, setNextStepDisabled] = useState(false);
    const [dashboardButtonEnabled, setDashboardButtonEnabled] = useState(false);
    const { user, isBusiness, isManager, roleName, selectRole, setLoggedIn, selectedRole, updateProfileUid, isLoggedIn } = useUser();
    const { firstName, setFirstName, lastName, setLastName, email, setEmail, phoneNumber, setPhoneNumber, photo, setPhoto } = useOnboardingContext();
    const { ssn, setSsn, mask, setMask, address, setAddress, unit, setUnit, city, setCity, state, setState, zip, setZip } = useOnboardingContext();
    const [paymentMethods, setPaymentMethods] = useState({
        paypal: { value: "", checked: false },
        apple_pay: { value: "", checked: false },
        stripe: { value: "", checked: false },
        zelle: { value: "", checked: false },
        venmo: { value: "", checked: false },
        credit_card: { value: "", checked: false },
        bank_account: { account_number: "", routing_number: "", checked: false },
    });
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(profileData.employee_business_id || "");
    const [selectedBizRole, setSelectedBizRole] = useState("");
    const [businessPhoto, setBusinessPhoto] = useState(DefaultProfileImg);

    const fetchBusinesses = async () => {
        const url = "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile";
        const args = {
            business_type: "MANAGEMENT",
        };
        const response = await axios.get(url + objToQueryString(args));
        setBusinesses(response.data.result);
    };

    useEffect(() => {
        console.log("calling useeffect")
        //setIsSave(false)
        const fetchProfileData = async () => {
            setShowSpinner(true);
            try {
                setFirstName(profileData.employee_first_name || "");
                setLastName(profileData.employee_last_name || "");
                setPhoneNumber(formatPhoneNumber(profileData.employee_phone_number || ""));
                setEmail(profileData.employee_email || "");
                setSsn(profileData.employee_ssn ? AES.decrypt(profileData.employee_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8) : "");
                setMask(profileData.employee_ssn ? maskNumber(AES.decrypt(profileData.employee_ssn, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8)) : "");
                setAddress(profileData.employee_address || "");
                setUnit(profileData.employee_unit || "");
                setCity(profileData.employee_city || "");
                setState(profileData.employee_state || "");
                setZip(profileData.employee_zip || "");
                setSelectedBusiness(profileData.employee_business_id || "");

                const paymentMethods = JSON.parse(profileData.paymentMethods);
                const updatedPaymentMethods = {
                    paypal: { value: "", checked: false },
                    apple_pay: { value: "", checked: false },
                    stripe: { value: "", checked: false },
                    zelle: { value: "", checked: false },
                    venmo: { value: "", checked: false },
                    credit_card: { value: "", checked: false },
                    bank_account: { account_number: "", routing_number: "", checked: false },
                };
                paymentMethods.forEach((method) => {
                    if (method.paymentMethod_type === "bank_account") {
                        updatedPaymentMethods.bank_account = {
                            account_number: method.paymentMethod_account_number || "",
                            routing_number: method.paymentMethod_routing_number || "",
                            checked: true,
                        };
                    } else {
                        updatedPaymentMethods[method.paymentMethod_type] = {
                            value: method.paymentMethod_name,
                            checked: true,
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

        fetchProfileData();
    }, [profileData]);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        const business = businesses.find((b) => b.business_uid === selectedBusiness);
        if (business) {
            setBusinessPhoto(business.business_photo_url || DefaultProfileImg);
        }
    }, [selectedBusiness, businesses]);

    const createProfile = async (form) => {
        // const profileApi = "/employeeProfile";
        const { data } = await axios.post(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee`, form, headers);
        return data;
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

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
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
        const business = businesses.find((b) => b.business_uid === selectedBusiness);
        return {
            employee_user_id: user.user_uid,
            employee_business_id: business?.business_uid,
            employee_first_name: firstName,
            employee_last_name: lastName,
            employee_phone_number: phoneNumber,
            employee_email: email,
            employee_role: "EMPLOYEE",
            employee_ssn: AES.encrypt(ssn, process.env.REACT_APP_ENKEY).toString(),
            employee_address: address,
            employee_unit: unit,
            employee_city: city,
            employee_state: state,
            employee_zip: zip,
            employee_photo_url: photo,
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
                if (payload[key]) form.append(key, payload[key].file);
            } else {
                form.append(key, payload[key]);
            }
        }
        return form;
    };

    const handleNextStep = async () => {
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

        if (!DataValidator.ssn_validate(ssn)) {
            alert("Please enter a valid SSN");
            return false;
        }

        const payload = getPayload();
        const form = encodeForm(payload);
        const data = await createProfile(form);
        setShowSpinner(false);
        if (data.employee_uid) {
            updateProfileUid({ employee_id: data.employee_uid });
            let role_id = {};
            role_id = { employee_id: data.employee_uid };
            setCookie("user", { ...user, ...role_id });
            const paymentSetup = await handlePaymentStep(data.employee_uid);
            console.log(paymentSetup);
            setDashboardButtonEnabled(true);
        }
        setCookie("default_form_vals", { ...cookiesData, phoneNumber, email, address, unit, city, state, zip, ssn });
        // navigate("/onboardingRouter");
        return;
    };

    const handleNavigation = (e) => {
        selectRole('MANAGER');
        setLoggedIn(true);
        navigate("/managerDashboard")
    }


    const handleChangeChecked = (e) => {
        const { name, checked } = e.target;
        const map = { ...paymentMethods };
        map[name].checked = checked;
        if (name === "bank_account") {
            if (!checked) {
                map.bank_account.account_number = "";
                map.bank_account.routing_number = "";
            }
        } else {
            if (!checked) {
                map[name].value = "";
            }
        }
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

    const handlePaymentStep = async (employee_id) => {
        setShowSpinner(true);
        const keys = Object.keys(paymentMethods);
        const payload = [];
        keys.forEach((key) => {
            if (paymentMethods[key].value !== "") {
                let paymentMethodPayload = {
                    paymentMethod_profile_id: employee_id,
                    paymentMethod_type: key,
                };
                if (key === "bank_account") {
                    const bankAccount = paymentMethods[key];
                    if (bankAccount.routing_number && bankAccount.account_number) {
                        paymentMethodPayload.paymentMethod_routing_number = bankAccount.routing_number;
                        paymentMethodPayload.paymentMethod_account_number = bankAccount.account_number;
                        payload.push(paymentMethodPayload);
                    }
                } else {
                    paymentMethodPayload.paymentMethod_value = paymentMethods[key].value;
                    payload.push(paymentMethodPayload);
                }
            }
        });
        console.log("Payment payload: ", payload);
        const response = await axios.post(
            "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentMethod",
            payload,
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("POST response: ", response);
        setShowSpinner(false);
        setCookie("default_form_vals", { ...cookiesData, paymentMethods });
        // Handle navigation based on user type, if needed
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
                                disabled={!method.state?.checked}
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
                                disabled={!method.state?.checked}
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
                            disabled={!method.state?.checked}
                            className={classes.root}
                        />
                    </Grid>
                )}
            </Grid>
        ));
    };

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
                Employee Profile Info
            </Typography>
            <Box display="flex">
                <Box width="20%" p={2}>
                    <Stack direction="row" justifyContent="center">
                        {businessPhoto ? (
                            <img
                                key={Date.now()}
                                src={businessPhoto}
                                style={{
                                    width: "121px",
                                    height: "121px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                                alt="business profile"
                            />
                        ) : (
                            <img src={DefaultProfileImg} alt="default" style={{ width: "121px", height: "121px", borderRadius: "50%" }} />
                        )}
                    </Stack>
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
                            {"Select Business"}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                                width: '100%'
                            }}
                        >
                            {"Role"}
                        </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Select
                            value={selectedBusiness}
                            onChange={(e) => setSelectedBusiness(e.target.value)}
                            variant="filled"
                            fullWidth
                            className={classes.root}
                        >
                            {businesses.map((business) => (
                                <MenuItem key={business.business_uid} value={business.business_uid}>
                                    {business.business_name}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={selectedBizRole}
                            onChange={(e) => setSelectedBizRole(e.target.value)}
                            variant="filled"
                            fullWidth
                            className={classes.root}
                        >
                            <MenuItem value="EMPLOYEE">Employee</MenuItem>
                        </Select>
                    </Stack>

                </Box>
            </Box>
            <hr />
            <Box display="flex">
                <Box width="20%" p={2}>
                    {/* <h1>Profile pic</h1> */}
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
                                backgroundColor:  "#3D5CAC",
                                width: "193px",
                                height: "35px",
                                
                            }}
                        >   Add profile pic
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
                        <TextField name="firstName" value={firstName} onChange={handleFirstNameChange} variant="filled" fullWidth placeholder="First name" className={classes.root} />
                        <TextField name="lastName" value={lastName} variant="filled" onChange={handleLastNameChange} fullWidth placeholder="Last name" className={classes.root} />
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
                            {"Zip"}
                        </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Box sx={{ width: '50%' }}>
                            <AddressAutocompleteInput onAddressSelect={handleAddressSelect} gray={true} />
                        </Box>
                        <TextField value={unit} onChange={handleUnitChange} variant="filled" sx={{ width: '10%' }} placeholder="3" className={classes.root}></TextField>
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
                            {"Personal Email"}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                                width: '100%'
                            }}
                        >
                            {"Personal Phone"}
                        </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <TextField name="PersonalEmail" value={email} variant="filled" fullWidth onChange={handleEmailChange} placeholder="email@site.com" className={classes.root} />
                        <TextField
                            value={phoneNumber}
                            type="tel"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            onChange={handlePhoneNumberChange}
                            placeholder="(000)000-0000"
                            variant="filled"
                            fullWidth
                            className={classes.root}
                        />
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
                        <TextField value={mask} onChange={handleSsnChange} variant="filled" sx={{ width: '50%' }} placeholder="Enter SSN" className={classes.root}></TextField>
                    </Stack>
                </Box>
            </Box>
            <hr />
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f1f1f' }}>
                Payment Methods
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
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={5}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextStep}
                    disabled={nextStepDisabled}
                    sx={{ mb: 2 , backgroundColor:  "#3D5CAC" }}
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

export default PMEmpOnBoardDesktopForm;
