import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, Link, Button, Paper, Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme/theme';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useUser } from '../../contexts/UserContext';
import ManagerOnBoardDesktopForm from '../Onboarding/ManagerOnBoardDesktopForm';
import TenantOnBoardDesktopForm from '../Onboarding/TenantOnBoardDesktopForm';
import OwnerOnBoardDeskTopForm from '../Onboarding/OwnerOnBoardDesktopForm';
import OwnerProfile from './OwnerProfile/OwnerProfile';
import MaintenanceOnBoardDesktopForm from '../Onboarding/MaintenanceOnBoardDesktopForm';
import PMEmpOnBoardDesktopForm from '../Onboarding/PMEmpOnBoardDesktopForm';
import MaintEmpOnBoardDesktopForm from '../Onboarding/MaintEmpOnBoardDesktopForm';

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100vh",
  },
  leftPanel: {
    width: "20%",
    padding: "20px",
    backgroundColor: "#f4f4f9",
    height: "calc(100vh - 60px)", // Adjust height considering nav bar height
  },
  mainPanel: {
    width: "80%",
    padding: "20px",
    height: "calc(100vh - 60px)", // Adjust height considering nav bar height
    overflowY: "auto",
  },
  settingsItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  signOutButton: {
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
   
  },
}));

const ProfileManager = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);
  const { logout, selectedRole, isLoggedIn, getProfileId } = useUser();  
  const [activeForm, setActiveForm] = useState('');
  console.log("selectedRole profile", selectedRole)

  useEffect(() => {
    setActiveForm(selectedRole);
  }, [selectedRole]);

  const renderForm = () => {
    switch (activeForm) {
      case 'MANAGER':
        return <ManagerOnBoardDesktopForm />;
      case 'PM_EMPLOYEE':
        return <PMEmpOnBoardDesktopForm />;
      case 'OWNER':
        return <OwnerOnBoardDeskTopForm />;
      case 'TENANT':
        return <TenantOnBoardDesktopForm />;
      case 'MAINTENANCE':
        return <MaintenanceOnBoardDesktopForm />;
      case 'MAINT_EMPLOYEE':
        return <MaintEmpOnBoardDesktopForm />;
      default:
        return (
          <div>
            <h1>Select the role you wish to create!</h1>
          </div>
        );
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.leftPanel}>
        <Typography variant="h5" >Application Settings</Typography>
        <Stack spacing={2} mt={5}>
          <Box className={classes.settingsItem}>
            <Typography>Allow notifications</Typography>
            <Switch />
          </Box>
          <Box className={classes.settingsItem}>
            <Typography>Dark mode</Typography>
            <Switch />
          </Box>
          <Link href="#" underline="hover">Privacy policy</Link>
          <Link href="#" underline="hover">Terms and conditions</Link>
          <Link href="#" underline="hover">Add Role</Link>
          <Link href="#" underline="hover">Edit Profile</Link>
          <Link href="#" underline="hover">Change password</Link>
          {/* <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Notification <span className={classes.highlightedText}>Settings</span></Typography> */}
          <Button variant="contained" onClick={() => {
              logout();
            }}
            className={classes.signOutButton}>Sign Out</Button>
        </Stack>
      </Box>
      <Box className={classes.mainPanel}>
        <Paper elevation={3} sx={{ p: 2 }}>
          {renderForm()}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfileManager;
