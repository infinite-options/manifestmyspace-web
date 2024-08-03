import { Box, Container, Grid, Paper, ThemeProvider, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import RevenueWidget from "../Dashboard-Components/Revenue/RevenueWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import { useCookies } from "react-cookie";
import { useUser } from "../../contexts/UserContext";
import ApplicationSettings from "./ApplicationSettings";
import ManagerOnBoardDesktopForm from "../Onboarding/ManagerOnBoardDesktopForm";
import ManagerOnboardingForm from "../Onboarding/ManagerOnboardingForm";
import TenantOnBoardDesktopForm from "../Onboarding/TenantOnBoardDesktopForm";
import TenantOnBoardingForm from "../Onboarding/TenantOnBoardingForm";
import OwnerOnBoardDeskTopForm from "../Onboarding/OwnerOnBoardDesktopForm";
import OwnerOnboardingForm from "../Onboarding/OwnerOnboardingForm";
import MaintenanceOnBoardDesktopForm from "../Onboarding/MaintenanceOnBoardDesktopForm";
import MaintenanceOnboardingForm from "../Onboarding/MaintenanceOnboardingForm";
import PMEmpOnBoardDesktopForm from "../Onboarding/PMEmpOnBoardDesktopForm";
import MaintEmpOnBoardDesktopForm from "../Onboarding/MaintEmpOnBoardDesktopForm";
import ChangePasswordSettingsManager from "../Settings/ChangePasswordSettingsManager";
import ChangePasswordSettings from "../Settings/ChangePasswordSettings";
import ChangePasswordSettingsTenant from "../Settings/ChangePasswordSettingsTenant";
import ChangePasswordSettingsMaintenance from "../Settings/ChangePasswordSettingsMaintenance";

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px",
  },
  container: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: "20px",
  },
});

function ProfileEditor() {
  console.log("In Profile Editor function");

  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);
  const { user, logout, selectedRole, isLoggedIn, getProfileId, getRoleId } = useUser();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [isSave, setIsSave] = useState(false);
  const [activeForm, setActiveForm] = useState("");
  const [newRole, setNewRole] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false); // State for showing the role dropdown
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [allowCookies, setAllowCookies] = useState(true);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [RHS, setRHS] = useState("form");

  console.log("In Profile Editor as (selected Role): ", selectedRole);
  console.log("user data is", user);
  // setActiveForm(selectedRole);

  useEffect(() => {
    console.log("ROHIT - ProfileEditor useEffect called. isSave - ", isSave);
    if (user.dark_mode) {
      setDarkMode(user.dark_mode == "true");
    }
    if (user.notifications) {
      setNotifications(user.notifications == "true");
    }
    if (user.allowCookies) {
      setAllowCookies(user.allowCookies == "true");
    }

    setActiveForm(selectedRole);
    const fetchProfileData = async () => {
      try {
        const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getRoleId()}`;
        const profileResponse = await axios.get(url);
        const profileData = profileResponse.data.profile.result[0];
        setProfileData(profileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [getRoleId, isSave, selectedRole, user.allowCookies, user.dark_mode, user.notifications]);

  useEffect(() => {
    if (settingsChanged) {
      const updateUserInfo = async () => {
        try {
          const response = await axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/userInfo", {
            notifications: notifications.toString(),
            dark_mode: darkMode.toString(),
            cookies: allowCookies.toString(),
            user_uid: user.user_uid,
          });
          console.log("User info updated:", response.data);
        } catch (error) {
          console.error("Error updating user info:", error);
        }
      };
      updateUserInfo();
    }
  }, [notifications, darkMode, allowCookies, settingsChanged, user.user_uid]);

  useEffect(() => {
    if (newRole) {
      handleAddRole();
      setShowRoleDropdown(false); // Hide the dropdown after adding the role
    }
  }, [newRole]);

  const handleAddRoleLinkClick = () => {
    setShowRoleDropdown(true);
  };

  const handleRoleSelect = (event) => {
    const selectedRole = event.target.value;
    setNewRole(selectedRole);
  };

  const handleAddRole = async () => {
    try {
      console.log("cookies.user", cookies.user);

      // Check if newRole is available
      if (newRole) {
        // Initialize existingRoles from cookies
        const existingRoles = cookies.user.role ? cookies.user.role.split(",") : [];

        // Check if the new role already exists
        if (existingRoles.includes(newRole)) {
          alert(`You already have the role: ${newRole}`);
          return;
        }

        // Add the new role
        existingRoles.push(newRole);
        const updatedRole = existingRoles.join(",");

        // Send the update request to the server
        const response = await axios.put("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateUserByUID/MYSPACE", {
          user_uid: cookies.user.user_uid,
          role: updatedRole,
        });

        // Check if the response is successful
        if (response.status === 200) {
          setCookie("user", { ...cookies.user, role: updatedRole }, { path: "/" });
          alert("Role updated successfully");
          navigate("/addNewRole", { state: { user_uid: cookies.user.user_uid, newRole } });
        } else {
          alert("An error occurred while updating the role.");
        }
      } else {
        alert("Please select a role to add.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred while updating the role.");
    }
  };

  const renderForm = () => {
    console.log("In render form: ", profileData, activeForm);
    if (profileData) {
      switch (activeForm) {
        case "MANAGER":
          return <ManagerOnboardingForm profileData={profileData} setIsSave={setIsSave} />;
        case "PM_EMPLOYEE":
          return <PMEmpOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave} />;
        case "OWNER":
          return <OwnerOnboardingForm profileData={profileData} setIsSave={setIsSave} />;
        case "TENANT":
          return <TenantOnBoardingForm profileData={profileData} setIsSave={setIsSave} />;
        case "MAINTENANCE":
          return <MaintenanceOnboardingForm profileData={profileData} setIsSave={setIsSave} />;
        case "MAINT_EMPLOYEE":
          return <MaintEmpOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave} />;
        default:
          return (
            <div>
              <h1>Select the role you wish to create!</h1>
            </div>
          );
      }
    }
  };

  const handleChangePasswordClick = (event) => {
    setRHS("passwordChange");
    event.preventDefault();
  };

  const getPasswordChangeForm = () => {
    if (profileData) {
      if (selectedRole === "OWNER") {
        return <ChangePasswordSettings owner_data={profileData} setRHS={setRHS} />
      } else if (selectedRole === "MANAGER") {
        return <ChangePasswordSettingsManager manager_data={profileData} setRHS={setRHS} />
      } else if (selectedRole === "TENANT") {
        return <ChangePasswordSettingsTenant tenant_data={profileData} setRHS={setRHS} />
      } else {
        return <ChangePasswordSettingsMaintenance maintenance_data={profileData} setRHS={setRHS} />
      }
    } else {
      console.log("Profile data is not loaded yet");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "left",
              paddingLeft: "10px",
              paddingRight: "10px",
              alignText: "center",
              alignContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "22px", sm: "28px", md: "32px" },
                fontWeight: "600",
              }}
            >
              Welcome, {user.first_name}!
            </Typography>
          </Box>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} md={3}>
            <ApplicationSettings handleChangePasswordClick={handleChangePasswordClick} />
          </Grid>
          {RHS === "form" &&
            <Grid item xs={12} md={9}>
              {renderForm()}
            </Grid>
          }
          {RHS === "passwordChange" &&
            <Grid item xs={12} md={9}>
              {getPasswordChangeForm()}
            </Grid>
          }
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default ProfileEditor;
