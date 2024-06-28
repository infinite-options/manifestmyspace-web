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
import PMEmpOnBoardDesktopForm from './PMEmpOnBoardDesktopForm';
import MaintEmpOnBoardDesktopForm from './MaintEmpOnBoardDesktopForm';
import ConfirmationDialog from './ConfirmationDialog'; // Import the dialog component

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
  const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [nextRole, setNextRole] = useState(''); // Track the next role to navigate to
  const [formSaved, setFormSaved] = useState(false); // Track if form is saved

  const handleRoleSelect = (role) => {
    if (unsavedChanges && !formSaved) {
      // If there are unsaved changes, show the confirmation dialog
      setNextRole(role);
      setDialogOpen(true);
    } else {
      // Otherwise, proceed with role selection
      proceedWithRoleSelection(role);
    }
  };

  const proceedWithRoleSelection = async (role) => {
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
        const existingRoles = userInfo.role ? userInfo.role.split(",") : [];
        if (existingRoles.includes(role)) {
          //alert(`You already have the role: ${role}`);
          setShowSpinner(false);
          setActiveForm(role);
          return;
        } else {
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
          setUnsavedChanges(false); // Reset unsaved changes flag
        } else {
          alert('An error occurred while updating the role.');
        }
      } else {
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
          setUnsavedChanges(false); // Reset unsaved changes flag
        }
      }
    } catch (error) {
      alert("An error occurred while processing your request.");
      console.log(error)
      setActiveForm('');
      setShowSpinner(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setDialogOpen(false);
    proceedWithRoleSelection(nextRole);
  };

  const handleFormSaved = () => {
    setFormSaved(true);
    setUnsavedChanges(false);
  };

  const handleFormChange = () => {
    setUnsavedChanges(true);
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'MANAGER':
        return <ManagerOnBoardDesktopForm onChange={handleFormChange} onSave={handleFormSaved} />;
      case 'PM_EMPLOYEE':
        return <PMEmpOnBoardDesktopForm onChange={handleFormChange} onSave={handleFormSaved} />;
      case 'OWNER':
        return <OwnerOnBoardDeskTopForm onChange={handleFormChange} onSave={handleFormSaved} />;
      case 'TENANT':
        return <TenantOnBoardDesktopForm onChange={handleFormChange} onSave={handleFormSaved} />;
      case 'MAINTENANCE':
        return <MaintenanceOnBoardDesktopForm onChange={handleFormChange} onSave={handleFormSaved} />;
      case 'MAINT_EMPLOYEE':
        return <MaintEmpOnBoardDesktopForm onChange={handleFormChange} onSave={handleFormSaved} />;
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
              onClick={() => handleRoleSelect('PM_EMPLOYEE')}
              sx={{ 
                backgroundColor: activeForm === 'PM_EMPLOYEE' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'PM_EMPLOYEE' ? 'darkblue' : 'rgb(41, 72, 152)',
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
              onClick={() => handleRoleSelect('MAINT_EMPLOYEE')}
              sx={{ 
                backgroundColor: activeForm === 'MAINT_EMPLOYEE' ? 'darkblue' : 'rgb(61, 92, 172)', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: activeForm === 'MAINT_EMPLOYEE' ? 'darkblue' : 'rgb(41, 72, 152)',
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
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </ThemeProvider>
  );
};

export default OnBoardDesktop;
