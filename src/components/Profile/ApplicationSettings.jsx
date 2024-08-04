import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Switch, Link, Button, Paper, Stack, Grid } from "@mui/material";
import { useUser } from "../../contexts/UserContext.jsx";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import theme from "../../theme/theme.js";
import axios from "axios";
import { styled } from '@mui/system';

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px", // Adjust the spacing between buttons as needed
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
    marginBottom: "20px", // Adjust the spacing between rows
  },
  leftPanel: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    height: '100%',
  },
  settingsItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  signOutButton: {
    backgroundColor: "#3D5CAC",
  },
});

export default function ApplicationSettings({ handleChangePasswordClick, setRHS }) {
  console.log("In Application Settings Widget ");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getProfileId, user, logout } = useUser(); // Ensure user is destructured from useUser
  const [cookies, setCookie] = useCookies(["user"]);
  const classes = useStyles();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(user.notifications === "true");
  const [darkMode, setDarkMode] = useState(user.dark_mode === "true");
  const [allowCookies, setAllowCookies] = useState(user.allowCookies === "true");
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [newRole, setNewRole] = useState("");

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      '&:hover': {
        backgroundColor: 'rgba(61, 92, 172, 0.08)', // Hover effect color when checked
      },
      '& + .MuiSwitch-track': {
        backgroundColor: 'gray', // Track color when checked
        opacity: 1,
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track:before': {
      backgroundColor: 'gray',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track:after': {
      backgroundColor: 'gray',
    },
    '& .MuiSwitch-track': {
      backgroundColor: 'gray', // Track color when not checked
      opacity: 1,
    },
  }));

  useEffect(() => {
    if (settingsChanged) {
      // Handle the settings changes here, e.g., save them to the server or local storage
      console.log("Settings changed:", { notifications, darkMode, allowCookies });
      setSettingsChanged(false);
    }
  }, [settingsChanged]);

  const handleAddRoleLinkClick = () => {
    // setShowRoleDropdown(!showRoleDropdown);
    setShowRoleDropdown(true);
  };

  const handleRoleSelect = (event) => {
    setNewRole(event.target.value);
    // Handle role selection logic here
    console.log("Selected role:", event.target.value);
  };

  useEffect(() => {
    if (newRole) {
      handleAddRole();
      setShowRoleDropdown(false); // Hide the dropdown after adding the role
    }
  }, [newRole]);

  // const handleChangePasswordClick = () => {
  //   // Handle password change logic here
  //   console.log("Change password clicked");
  // };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out");
    logout();
    // navigate("/login");
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

  return (
    <Grid container alignContent='flex-start' item xs={12} sx={{padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "10px", height: '100%', }}>
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', }}>Application Settings</Typography>
      <Grid container item xs={12}>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '20px', }}>
          <Grid container item xs={9} alignContent= 'center'>
            <Typography>Allow notifications</Typography>
          </Grid>
          
          <CustomSwitch
            checked={notifications}
            onChange={(e) => {
              setNotifications(e.target.checked);
              setSettingsChanged(true);
            }}
          />
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12}>
          <Grid container item xs={9} alignContent= 'center'>
            <Typography>Dark mode</Typography>
          </Grid>
          <CustomSwitch
            checked={darkMode}
            onChange={(e) => {
              setDarkMode(e.target.checked);
              setSettingsChanged(true);
            }}
          />
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12}>
          <Grid container item xs={9} alignContent= 'center'>
            <Typography>Allow Cookies</Typography>
          </Grid>
          <CustomSwitch
            checked={allowCookies}
            onChange={(e) => {
              setAllowCookies(e.target.checked);
              setSettingsChanged(true);
            }}
          />
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '5px', }}>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }} onClick={() => {
                console.log('clicked privacypolicy');
                setRHS("privacyPolicy");
              }}>
            Privacy policy
          </Link>
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '15px', }}>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }} onClick={() => {
                setRHS("termsAndConditions");
              }}>
            Terms and conditions
          </Link>
        </Grid>

        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '15px', }}>
          <Link href="#" underline="hover" onClick={handleAddRoleLinkClick} sx={{ color: "#3D5CAC" }}>
            Add Role
          </Link>
        </Grid>
        {showRoleDropdown && (
          <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '15px', }}>
            
              <Box className={classes.settingsItem}>
                <select value={newRole} onChange={handleRoleSelect}>
                  <option value="">Select Role</option>
                  <option value="MANAGER">Manager</option>
                  <option value="PM_EMPLOYEE">Property Manager - Employee</option>
                  <option value="OWNER">Owner</option>
                  <option value="TENANT">Tenant</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="MAINT_EMPLOYEE">Maintenance - Employee</option>
                </select>
              </Box>
            
          </Grid>
        )}
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '15px', }}>
          <Link href="#" underline="hover" onClick={handleChangePasswordClick} sx={{ color: "#3D5CAC" }}>
            Change password
          </Link>
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{ marginTop: '5px', }}>
          <Button variant="contained" onClick={handleLogout} sx={{ width: '100%', marginTop: '20px', backgroundColor: '#3D5CAC', color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', }}>
            Sign Out
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
