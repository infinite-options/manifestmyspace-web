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
    const { user } = useUser(); // Access the user object from UserContext
    const selectedRole = user.selectedRole; // Get the selected role from user object

    // Define a function to get the home button navigation based on the selected role
    const getHomeButtonNav = () => {
        console.log("selectedRole ",selectedRole);
        switch (selectedRole) {
        case 'Owner':
            return '/';
        case 'Manager':
            return '/managerDashboard';
        case 'Tenant':
            return '/tenantDashboard';
        case 'Maintenance':
            return '/';
        default:
            return '/';
        }
    };
    const getProfileButtonNav = () => {
        switch (selectedRole) {
          case 'Owner':
            return '/ownerProfile';
          case 'Manager':
            return '/pmProfile';
          case 'Tenant':
            return '/tenantProfile';
          case 'Maintenance':
            return '/';
          default:
            return '/';
        }
    };
    const getBellButtonNav = () => {
        switch (selectedRole) {
          case 'Owner':
            return '/';
          case 'Manager':
            return '/managerDashboard';
          case 'Tenant':
            return '/tenantDashboard';
          case 'Maintenance':
            return '/';
          default:
            return '/';
        }
    };
    const getCommentButtonNav = () => {
        switch (selectedRole) {
          case 'Owner':
            return '/';
          case 'Manager':
            return '/managerDashboard';
          case 'Tenant':
            return '/tenantDashboard';
          case 'Maintenance':
            return '/';
          default:
            return '/';
        }
    };

  return (
    <footer className="footer">
      <ThemeProvider theme={theme}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: theme.palette.priority.clear,
            marginTop: '55px',
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
                    style={{ display: 'block', margin: '0 auto' }}
                    onClick={()=>navigate(getHomeButtonNav())}
                  />
              </Box>
            </Grid>
            <Grid item xs={3}>
                <img
                  src={User_fill}
                  alt="User Icon"
                  style={{ display: 'block', margin: '0 auto' }}
                  onClick={()=>navigate(getProfileButtonNav())}
                />
            </Grid>
            <Grid item xs={3}>
              <img
                src={Bell_fill}
                alt="Bell Icon"
                style={{ display: 'block', margin: '0 auto' }}
                onClick={()=>navigate(getBellButtonNav())}
              />
            </Grid>
            <Grid item xs={3}>
              <img
                src={comment_fill}
                alt="Comment Icon"
                style={{ display: 'block', margin: '0 auto' }}
                onClick={()=>navigate(getCommentButtonNav())}
              />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </footer>
  );
}
