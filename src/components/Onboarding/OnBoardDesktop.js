import React, { useState } from 'react';
import axios from "axios";
import { Box, Button, Paper, ThemeProvider, Typography, Stack } from '@mui/material';
import theme from '../../theme/theme';
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useUser } from "../../contexts/UserContext";
import ManagerOnBoardDesktopForm from './ManagerOnBoardDesktopForm';
import TenantOnBoardDesktopForm from './TenantOnBoardDesktopForm';
import OwnerOnBoardDeskTopForm from './OwnerOnBoardDesktopForm';
import MaintenanceOnBoardDesktopForm from './MaintenanceOnBoardDesktopForm';

const OnBoardDesktop = () => {
  const { setAuthData, onboardingState, setOnboardingState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state;
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [activeForm, setActiveForm] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const userInfo = cookies.user || {};

  const handleRoleSelect = async (role) => {
    setShowSpinner(true);
    const payload = {
      ...user,
      role,
    };
    setOnboardingState({
      ...onboardingState,
      role,
    });

    try {
      let response;
      if (userInfo.user_uid) {
        // If user account exists, append the new role and make a PUT request
        const existingRoles = userInfo.role ? userInfo.role.split(",") : [];
        if (!existingRoles.includes(role)) {
          existingRoles.push(role);
        }
        const updatedRole = existingRoles.join(",");
        payload.role = updatedRole;
        response = await axios.put(
          "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateUserByUID/MYSPACE",
          { user_uid: userInfo.user_uid, role: updatedRole }
        );
        
        if (response.status === 200) {
          userInfo.role = updatedRole;  // Update the local role state
          setAuthData({ ...userInfo, role: updatedRole });
          setActiveForm(role);
          setCookie('user', { ...userInfo, role: updatedRole }, { path: '/' });  // Update the cookie
        } else {
          alert('An error occurred while updating the role.');
        }
        console.log("activeForm",activeForm)
      } else {
        // If user account does not exist, make a POST request
        if (user.isEmailSignup) {
          response = await axios.post(
            "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
            payload
          );
        } else {
          response = await axios.post(
            "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE",
            payload
          );
        }
      

      if (response.data.message === "User already exists") {
        alert(response.data.message);
        setActiveForm('');
        setShowSpinner(false);
        return;
      } else {
        const { result } = response.data;
        setAuthData(result);
        setShowSpinner(false);
        setActiveForm(role);
        setCookie('user', result.user, { path: '/' });
      }
    }
    } catch (error) {
      alert("An error occurred while processing your request.");
      console.log(error)
      setActiveForm('');
      setShowSpinner(false);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'MANAGER':
        return <ManagerOnBoardDesktopForm />;
      case 'EMPLOYEE':
        return <TenantOnBoardDesktopForm />;
      case 'OWNER':
        return <OwnerOnBoardDeskTopForm />;
      case 'TENANT':
        return <TenantOnBoardDesktopForm />;
      case 'MAINTENANCE':
        return <MaintenanceOnBoardDesktopForm />;
      case 'MAINTENANCE_EMP':
        return <ManagerOnBoardDesktopForm />;
      default:
        return (
          <div>
            <h1>Select the role you wish to create!</h1>
          </div>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height="100vh">
        <Box 
          width="20%" 
          bgcolor={theme.palette.primary.main} 
          p={2} 
          sx={{ color: theme.palette.background.default }}
        >
          <Stack spacing={2} mt={5}>
            <Typography variant="h6" align="center" backgroundColor='rgb(41, 72, 152)' gutterBottom sx={{ color: '#fff' }}>
              Roles
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('MANAGER')}
              sx={{ 
                backgroundColor: activeForm === 'MANAGER' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'MANAGER' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Property Manager
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('EMPLOYEE')}
              sx={{ 
                backgroundColor: activeForm === 'EMPLOYEE' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'EMPLOYEE' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Property Manager - Employee
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('OWNER')}
              sx={{ 
                backgroundColor: activeForm === 'OWNER' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'OWNER' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Property Owner
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('TENANT')}
              sx={{ 
                backgroundColor: activeForm === 'TENANT' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'TENANT' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Tenant
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('MAINTENANCE')}
              sx={{ 
                backgroundColor: activeForm === 'MAINTENANCE' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'MAINTENANCE' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Maintenance
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleRoleSelect('MAINTENANCE_EMP')}
              sx={{ 
                backgroundColor: activeForm === 'MAINTENANCE_EMP' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'MAINTENANCE_EMP' ? 'darkblue' : 'rgb(41, 72, 152)',
                }
              }}
            >
              Maintenance - Employee
            </Button>
          </Stack>
        </Box>
        <Box width="80%" p={3} sx={{ overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {renderForm()}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OnBoardDesktop;
