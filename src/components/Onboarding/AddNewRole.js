import React, { useState } from "react";
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Container, Grid, OutlinedInput } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useCookies } from "react-cookie";

import DataValidator from "../DataValidator";
import { formatPhoneNumber, headers, roleMap } from "./helper";

import axios from "axios";

import managerDashboardImage from "./images/dashboard-images/manager-dashboard.png";
import maintenanceDashboardImage from "./images/dashboard-images/maintenance-dashboard.png";
import ownerDashboardImage from "./images/dashboard-images/owner-dashboard.png";
import tenantDashboardImage from "./images/dashboard-images/tenant-dashboard.png";

const AddNewRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user_uid, newRole } = location.state; // Access passed state here
  const { user, setUser, setAuthData, updateProfileUid, selectRole, setLoggedIn } = useUser();
  const [cookie, setCookie] = useCookies(["default_form_vals"]);
  const cookiesData = cookie["default_form_vals"];

  const [email, setEmail] = useState(user.email);
  const [businessEmail, setBusinessEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState(user.phone_number);

  console.log("cookiesData is set to ****", cookiesData);

  console.log("user data has ***$$", user);

  const validate_form = () => {
    if ((newRole === "TENANT" || newRole === "OWNER") && (firstName === "" || lastName === "" || phoneNumber === "" || email === "")) {
      alert("Please fill out all fields");
      return false;
    }
    if (
      (newRole === "MANAGER" || newRole === "MAINTENANCE") &&
      (firstName === "" || lastName === "" || businessName === "" || businessPhoneNumber === "" || businessEmail === "")
    ) {
      alert("Please fill out all fields");
      return false;
    }
    if ((newRole === "TENANT" || newRole === "OWNER") && !DataValidator.phone_validate(phoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }
    if ((newRole === "MANAGER" || newRole === "MAINTENANCE") && !DataValidator.phone_validate(businessPhoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }
    if ((newRole === "TENANT" || newRole === "OWNER") && !DataValidator.email_validate(email)) {
      alert("Please enter a valid email");
      return false;
    }
    if ((newRole === "MANAGER" || newRole === "MAINTENANCE") && !DataValidator.email_validate(businessEmail)) {
      alert("Please enter a valid email");
      return false;
    }
    return true;
  };

  const getPayload = (type, userUID) => {
    switch (type) {
      case "MANAGER":
        return {
          business_user_id: userUID,
          business_type: "MANAGEMENT",
          business_name: businessName,
          business_phone_number: businessPhoneNumber,
          business_email: businessEmail,
        };
      case "MAINTENANCE":
        return {
          business_user_id: userUID,
          business_type: "MAINTENANCE",
          business_name: businessName,
          business_phone_number: businessPhoneNumber,
          business_email: businessEmail,
        };
      case "OWNER":
        return {
          owner_user_id: userUID,
          owner_first_name: firstName,
          owner_last_name: lastName,
          owner_phone_number: phoneNumber,
          owner_email: email,
        };
      case "TENANT":
        return {
          tenant_user_id: userUID,
          tenant_first_name: firstName,
          tenant_last_name: lastName,
          tenant_phone_number: phoneNumber,
          tenant_email: email,
        };
      default:
        throw new Error("Invalid profile type");
    }
  };

  const encodeForm = (payload) => {
    const form = new FormData();
    for (let key in payload) {
      form.append(key, payload[key]);
    }
    return form;
  };

  const createProfile = async (form, type) => {
    const { profileApi } = roleMap[type];
    const { data } = await axios.post(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev${profileApi}`, form, headers);
    return data;
  };

  const handleUpdateProfileUid = (data) => {
    if (data.owner_uid) {
      updateProfileUid({ owner_id: data.owner_uid });
    }
    if (data.tenant_uid) {
      updateProfileUid({ tenant_id: data.tenant_uid });
    }
    if (data.business_uid) {
      updateProfileUid({ business_uid: data.business_uid });
      updateProfileUid({ business_owner_id: data.employee_uid });
    }
  };

  const checkIfUserExists = async (email) => {
    try {
      const response = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo/${email}`);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.message === "User not found") {
        return null;
      } else {
        throw error;
      }
    }
  };

  const createUserProfile = async () => {
    const emailToCheck = newRole === "TENANT" || newRole === "OWNER" ? email : businessEmail;
    const userExists = await checkIfUserExists(emailToCheck);
    console.log(" userExists  ", userExists);
    if (userExists && userExists.data.result[0].user_uid != user.user_uid) {
      alert("User with this email already exists");
      return;
    }
    // console.log("ROHIT - newRole - ", newRole);
    const payload = getPayload(newRole, user_uid);
    const form = encodeForm(payload);
    const data = await createProfile(form, newRole);
    handleUpdateProfileUid(data);
    console.log("Cookies before setting default_form_vals:", document.cookie);
    setCookie("default_form_vals", { ...cookiesData, phoneNumber, email });
    console.log("Cookies after setting default_form_vals:", document.cookie);

    selectRole(newRole);
    const existingRoles = user.role ? user.role.split(",") : [];
    if (!existingRoles.includes(newRole)) {
      existingRoles.push(newRole);
    }
    const updatedRole = existingRoles.join(",");

    let role_id = {};
    if (newRole === "OWNER") role_id = { owner_id: data.owner_uid };
    if (newRole === "TENANT") role_id = { tenant_id: data.tenant_uid };
    if (newRole === "MANAGER") {
      let businesses = user.businesses;
      businesses["MANAGEMENT"].business_uid = data.business_uid;
      businesses["MANAGEMENT"].business_owner_id = data.employee_uid;
      role_id = { businesses };
    }
    if (newRole === "MAINTENANCE") {
      let businesses = user.businesses;
      businesses["MAINTENANCE"].business_uid = data.business_uid;
      businesses["MAINTENANCE"].business_owner_id = data.employee_uid;
      role_id = { businesses };
    }

    console.log("user will have %%%", user);
    console.log("user will have role_id%%%", role_id);
    console.log("user will have role%%%", updatedRole);
    setCookie("user", { ...user, ...role_id, role: updatedRole });
    setUser({ ...user, ...role_id, role: updatedRole });

    const { dashboardUrl } = roleMap[newRole];
    navigate(dashboardUrl);
  };

  const handleSignup = () => {
    if (validate_form() === false) return;

    setCookie("default_form_vals", { ...cookiesData, firstName, lastName, phoneNumber, email });
    createUserProfile();
  };

  const getDashboardImage = () => {
    switch (newRole) {
      case "MANAGER":
        return managerDashboardImage;
      case "MAINTENANCE":
        return maintenanceDashboardImage;
      case "OWNER":
        return ownerDashboardImage;
      case "TENANT":
        return tenantDashboardImage;
      default:
        return "";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg'>
        <Typography
          sx={{
            fontSize: { xs: "22px", sm: "28px", md: "32px" },
            fontWeight: "600",
          }}
        >
          Welcome, {firstName}!
        </Typography>
      </Container>
      <Container
        maxWidth='lg'
        sx={{
          height: "90vh",
          backgroundImage: `url(${getDashboardImage()})`,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth='md' sx={{ height: "auto", backgroundColor: "#FFFFFF", padding: "50px", borderRadius: "60px" }}>
          <Grid container justifyContent='center' rowGap={20}>
            <Grid container item xs={10} justifyContent='center' spacing={20}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "28px", color: "#160449", fontWeight: "bold" }}>{newRole.charAt(0) + newRole.slice(1).toLowerCase()} Profile</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>First Name</Typography>
                <OutlinedInput
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Last Name</Typography>
                <OutlinedInput
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            </Grid>

            {(newRole === "MANAGER" || newRole === "MAINTENANCE") && (
              <Grid item xs={10}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Business Name</Typography>
                <OutlinedInput
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            )}

            {(newRole === "TENANT" || newRole === "OWNER") && (
              <Grid item xs={10}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Email</Typography>
                <OutlinedInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            )}

            {(newRole === "MANAGER" || newRole === "MAINTENANCE") && (
              <Grid item xs={10}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Business Email</Typography>
                <OutlinedInput
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            )}

            {(newRole === "TENANT" || newRole === "OWNER") && (
              <Grid item xs={10}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Phone Number</Typography>
                <OutlinedInput
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            )}

            {(newRole === "MANAGER" || newRole === "MAINTENANCE") && (
              <Grid item xs={10}>
                <Typography sx={{ fontSize: "25px", color: "#160449" }}>Business Phone Number</Typography>
                <OutlinedInput
                  value={businessPhoneNumber}
                  onChange={(e) => setBusinessPhoneNumber(formatPhoneNumber(e.target.value))}
                  id='filled-basic'
                  variant='filled'
                  sx={{ marginTop: "5px", width: "100%", backgroundColor: "#F2F2F2" }}
                />
              </Grid>
            )}

            <Grid container item xs={5} justifyContent='center'>
              <Button
                onClick={handleSignup}
                sx={{
                  marginTop: "20px",
                  marginBottom: "15px",
                  width: "100%",
                  height: "57px",
                  borderRadius: "15px",
                  fontSize: "20px",
                  backgroundColor: "#3D5CAC",
                  textTransform: "none",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#F2F2F2",
                    color: "#160449",
                  },
                  boxShadow: 1,
                  justifyContent: "space-evenly",
                }}
              >
                Go to Dashboard
              </Button>
              You can fill out additional info when needed.
            </Grid>
          </Grid>
        </Container>
      </Container>
    </ThemeProvider>
  );
};

export default AddNewRole;
