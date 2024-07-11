import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, Link, Button, Paper, Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme/theme';
import axios from "axios";
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
  const { logout, selectedRole, isLoggedIn, getProfileId, getRoleId } = useUser();  
  const [isSave, setIsSave] = useState(false);
  const [activeForm, setActiveForm] = useState('');
  console.log("selectedRole profile", selectedRole)
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    setActiveForm(selectedRole);
    fetchProfileData();
  }, [isSave,selectedRole]);
  
  const fetchProfileData = async () => {
    try {
        let url=`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getRoleId()}`;
        // if(selectedRole==='PM_EMPLOYEE' || selectedRole==='MAINT_EMPLOYEE')
        // {url= `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee/${getRoleId()}`}
        const profileResponse = await axios.get(url);
        
        const profileData = 
        profileResponse.data.profile.result[0];
        console.log('profile-*-', profileData);
        console.log('selectedRole-*-', selectedRole);
        setProfileData(profileData);
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
};
  const renderForm = () => {
    if(profileData){
    switch (activeForm) {
      case 'MANAGER':
        return <ManagerOnBoardDesktopForm  profileData={profileData} setIsSave={setIsSave} />;
      case 'PM_EMPLOYEE':
        return <PMEmpOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave} />;
      case 'OWNER':
        return <OwnerOnBoardDeskTopForm profileData={profileData} setIsSave={setIsSave}/>;
      case 'TENANT':
        return <TenantOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave}/>;
      case 'MAINTENANCE':
        return <MaintenanceOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave}/>;
      case 'MAINT_EMPLOYEE':
        return <MaintEmpOnBoardDesktopForm profileData={profileData} setIsSave={setIsSave}/>;
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
    event.preventDefault();
    
    if (profileData) {
      if(selectedRole === "OWNER"){
        navigate('/changePasswordSettings', { state: { owner_data: profileData } });
      } else if (selectedRole === "MANAGER"){
        navigate('/ChangePasswordSettingsManager', { state: { manager_data: profileData } });
      } else if(selectedRole === "TENANT"){
        navigate('/changePasswordSettingsTenant', { state: { tenant_data: profileData } });
      } else {
        navigate('/ChangePasswordSettingsMaintenance', { state: { maintenance_data: profileData } });
      }
     
    } else {
      console.log('Profile data is not loaded yet');
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
          <Link href="#" underline="hover"  sx={{ color: "#3D5CAC" }}>Privacy policy</Link>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }}>Terms and conditions</Link>
          <Link href="#" underline="hover" sx={{ color: "#3D5CAC" }}>Add Role</Link>
          <Link href="#" underline="hover" onClick={handleChangePasswordClick} sx={{ color: "#3D5CAC" }}>Change password</Link>
          {/* <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Notification <span className={classes.highlightedText}>Settings</span></Typography> */}
          <Button variant="contained" onClick={() => {
              logout();
            }}
            sx={{ mt: 2, backgroundColor:  "#3D5CAC" }}
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
