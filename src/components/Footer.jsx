import React from 'react';
import { Grid, Box, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Import the UserContext

import theme from '../theme/theme';
import Home_fill from '../images/Home_fill.png';
import Bell_fill from '../images/Bell_fill.png';
import User_fill from '../images/User_fill.png';
import comment_fill from '../images/comment_fill.png';

export function Footer() {
    const navigate = useNavigate();
    const { selectedRole, isLoggedIn } = useUser(); // Access the user object from UserContext

    // Define a function to get the home button navigation based on the selected role
    const getHomeButtonNav = () => {
        // console.log("selectedRole ",selectedRole);
        switch (selectedRole) {
        case 'OWNER':
            return '/ownerDashboard';
        case 'MANAGER':
            return '/managerDashboard';
        case 'TENANT':
            return '/tenantDashboard';
        case 'MAINTENANCE':
            return '/maintenanceDashboard';
        case 'PM_EMPLOYEE':
            return '/managerDashboard';
        case 'MAINT_EMPLOYEE':
            return '/maintenanceDashboard';
        default:
            return '/';
        }
    };
    const getProfileButtonNav = () => {
        switch (selectedRole) {
          case 'OWNER':
            return '/ownerProfile';
          case 'MANAGER':
            return '/pmProfile';
          case 'TENANT':
            return '/tenantProfile';
          case 'MAINTENANCE':
            return '/maintenanceProfile';
          case 'PM_EMPLOYEE':
            return '/pmProfile';
          case 'MAINT_EMPLOYEE':
              return '/maintenanceProfile';
          default:
            return '/';
        }
    };
    const getBellButtonNav = () => {
        switch (selectedRole) {
          case 'OWNER':
            return '/poNotifications';
          case 'MANAGER':
            return '/managerDashboard';
          case 'TENANT':
            return '/announcements';
          case 'MAINTENANCE':
            return '/maintenanceDashboard';
          case 'PM_EMPLOYEE':
            return '/managerDashboard';
          case 'MAINT_EMPLOYEE':
            return '/maintenanceDashboard';
          default:
            return '/';
        }
    };
    const getCommentButtonNav = () => {
        switch (selectedRole) {
          case 'OWNER':
            return '/ownerDashboard';
          case 'MANAGER':
            return '/managerDashboard';
          case 'TENANT':
            return '/tenantDashboard';
          case 'MAINTENANCE':
            return '/maintenanceDashboard';
          case 'PM_EMPLOYEE':
            return '/managerDashboard';
          case 'MAINT_EMPLOYEE':
            return '/maintenanceDashboard';
          default:
            return '/';
        }
    };

  return (
    <footer className="footer">
      {isLoggedIn && 
        <ThemeProvider theme={theme}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: theme.palette.priority.clear,
              marginTop: '20px',
              height: '40px',
            }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{
                width: '85%',
              }}
            >
              <Grid item xs={3}>
                <Box>
                    <img
                      src={Home_fill}
                      alt="Home Icon"
                      style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                      onClick={()=>{navigate(getHomeButtonNav())}}
                    />
                </Box>
              </Grid>
              <Grid item xs={3}>
                  <img
                    src={User_fill}
                    alt="User Icon"
                    style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                    onClick={()=>{navigate(getProfileButtonNav())}}
                  />
              </Grid>
              <Grid item xs={3}>
                <img
                  src={Bell_fill}
                  alt="Bell Icon"
                  style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                  onClick={()=>{navigate(getBellButtonNav())}}
                />
              </Grid>
              <Grid item xs={3}>
                <img
                  src={comment_fill}
                  alt="Comment Icon"
                  style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                  onClick={()=>{navigate(getCommentButtonNav())}}
                />
              </Grid>
            </Grid>
          </Box>
        </ThemeProvider>
      }
    </footer>
  );
}
