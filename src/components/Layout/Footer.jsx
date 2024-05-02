import React from 'react';
import { Grid, Box, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; // Import the UserContext

import theme from '../../theme/theme';
// import Home_fill from '../../images/Home_fill.png';
// import Bell_fill from '../../images/Bell_fill.png';
// import User_fill from '../../images/User_fill.png';
// import dark_User_fill from '../../images/User_fill_dark.png';
// import comment_fill from '../../images/comment_fill.png';
import useMediaQuery from "@mui/material/useMediaQuery";
import UserNavBar from './UserNavBar';

export function Footer() {
    // const navigate = useNavigate();
    const { selectedRole, isLoggedIn, getProfileId } = useUser(); // Access the user object from UserContext
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <footer className="footer">
        {isLoggedIn && isMobile &&
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                backgroundColor: "#3D5CAC",
                marginTop: '0px',
                height: '40px',
              }}
            >
              <UserNavBar isMobile={isMobile}/>
            </Box>
        }
      </footer>
    </ThemeProvider>
  );
}
