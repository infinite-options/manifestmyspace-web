import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Switch, Link, Button, Paper, Stack, Grid } from "@mui/material";
import { useUser } from "../../contexts/UserContext.jsx";
import { makeStyles } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import theme from "../../theme/theme.js";

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

export default function ApplicationSettings() {
  console.log("In Application Settings Widget ");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getProfileId, user } = useUser(); // Ensure user is destructured from useUser
  const classes = useStyles();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(user.notifications === "true");
  const [darkMode, setDarkMode] = useState(user.dark_mode === "true");
  const [allowCookies, setAllowCookies] = useState(user.allowCookies === "true");
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    if (settingsChanged) {
      // Handle the settings changes here, e.g., save them to the server or local storage
      console.log("Settings changed:", { notifications, darkMode, allowCookies });
      setSettingsChanged(false);
    }
  }, [settingsChanged]);

  const handleAddRoleLinkClick = () => {
    setShowRoleDropdown(!showRoleDropdown);
  };

  const handleRoleSelect = (event) => {
    setNewRole(event.target.value);
    // Handle role selection logic here
    console.log("Selected role:", event.target.value);
  };

  const handleChangePasswordClick = () => {
    // Handle password change logic here
    console.log("Change password clicked");
  };

  const logout = () => {
    // Handle logout logic here
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <Grid container alignContent='flex-start' item xs={12} sx={{padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "10px", height: '100%', }}>
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', }}>Application Settings</Typography>
      <Grid container item xs={12}>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '20px', }}>
          <Grid container item xs={9} alignContent= 'center'>
            <Typography>Allow notifications</Typography>
          </Grid>
          
          <Switch
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
          <Switch
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
          <Switch
            checked={allowCookies}
            onChange={(e) => {
              setAllowCookies(e.target.checked);
              setSettingsChanged(true);
            }}
          />
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '5px', }}>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }}>
            Privacy policy
          </Link>
        </Grid>
        <Grid container justifyContent='space-between' alignContent='center' item xs={12} sx={{marginTop: '15px', }}>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }}>
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
          <Button variant="contained" onClick={logout} sx={{ width: '100%', marginTop: '20px', backgroundColor: '#3D5CAC', color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', }}>
            Sign Out
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
