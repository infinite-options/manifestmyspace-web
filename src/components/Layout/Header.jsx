import { useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useUser } from "../../contexts/UserContext";
import { roleMap } from "../Onboarding/helper";
import { Box, Stack, Grid, ThemeProvider, Button, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as Logo } from "../../images/logo.svg";
import { useCookies } from "react-cookie";
import theme from "../../theme/theme";
import { darken } from "@mui/system";
import { lighten } from "@material-ui/core";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserNavBar from "./UserNavBar"

function Header(props) {
  console.log("In Header.jsx");
  const { user, selectedRole, selectRole, roleName, isLoggedIn } = useUser();
  const [cookie, setCookie] = useCookies(["user"]);
  const cookiesData = cookie["user"];
  const userRoles = user ? cookiesData?.role.split(",") : [];
  console.log("Current User Roles: ", userRoles);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleButtonClick = (role) => {
    // console.log("In handleButtonClick: ", role);
    selectRole(role);
    const { dashboardUrl } = roleMap[role];
    // console.log("Dashboard URL: ", dashboardUrl);
    navigate(dashboardUrl);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isMobile === false){
      setIsMenuOpen(false)
    }
  }, [isMobile])

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {isLoggedIn ? (
          <>
         <AppBar position="static" style={{ backgroundColor: "#160449", paddingTop: "10px", paddingBottom: "10px" }}>
          <Toolbar style={{ justifyContent: "space-between", padding: "0 20px" }}>
            <div
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: isMobile ? "100%" : "auto", // Full width on mobile to center, auto width otherwise
                ...(isMobile ? { order: -1 } : {}), // Ensure it's at the start/top when in mobile view
              }}
            >
                <Logo />
              </div>
              {!isMobile && <UserNavBar isMobile={isMobile}/>}
              {/* {!isMobile && (
                <>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                  {userRoles ? userRoles.map((role) => (
                      <MenuItem
                        key={role}
                        onClick={handleClose}  // Assuming handleClose correctly handles the closing logic
                        sx={{ color: "#FFFFFF" }}
                        disableRipple
                      >
                        {selectedRole === role ? <u>{roleName(role)}</u> : roleName(role)}
                      </MenuItem>
                    )) : null} 
                  </Menu>
                </>
              )} */}
            </Toolbar>
            </AppBar>
              {!isMobile && (userRoles.length > 0) && (
                <Toolbar style={{ 
                    justifyContent: "space-between", 
                    padding: "0 20px", 
                    backgroundColor: "#3D5CAC",
                    color: "#FFFFFF"
                }}>
                  {userRoles?.map((role) => (
                    <Button
                      key={role}
                      color="inherit"
                      style={{
                        fontWeight: selectedRole === role ? 800 : 300,
                        fontSize: "18px",
                        fontFamily: "Source Sans 3, sans-serif",
                        margin: "0 2px",
                        textTransform: "none",
                      }}
                      id={role}
                      onClick={() => {
                        handleButtonClick(role);
                      }}
                    >
                      {selectedRole === role ? <u>{roleName(role)}</u> : roleName(role)}
                    </Button>
                  ))}
                </Toolbar>
              )}
            </>
        ) : (
          <Box>
            <AppBar position="static" style={{ backgroundColor: "#160449", paddingTop: "10px", paddingBottom: "10px" }}>
              <Toolbar style={{ justifyContent: "space-between", padding: "0 20px" }}>
                <div
                  onClick={() => navigate("/")}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "100%" : "auto", // Full width on mobile to center, auto width otherwise
                    ...(isMobile ? { order: -1 } : {}), // Ensure it's at the start/top when in mobile view
                  }}
                >
                  <Logo />
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, gap: "25px" }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/returningUser")}
                      sx={{ background: "#FFFFFF", color: theme.palette.primary.main, "&:hover": { backgroundColor: darken("#FFFFFF", 0.3) } }}
                    >
                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: theme.typography.primary.fontWeight,
                        }}
                      >
                        Login
                      </Typography>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/newUser")}
                      sx={{ background: "#3D5CAC", color: theme.palette.background.default, "&:hover": { backgroundColor: lighten("#3D5CAC", 0.3) } }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.background.default,
                          fontWeight: theme.typography.primary.fontWeight,
                        }}
                      >
                        Create Account
                      </Typography>
                    </Button>
                  </Box>
                  <IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ ml: 2, display: { xs: "flex", md: "none" } }} onClick={handleClick}>
                    <MenuIcon onClick={handleMenuToggle}/>
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {isMenuOpen && (
              <Box sx={{ position: "absolute", top: "64px", right: "10px", backgroundColor: "white", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: "1000" }}>
                <Button variant="outlined" sx={{ display: "block", width: "100%",  color: "#000000" }} onClick={() => navigate("/returningUser")}>
                  Login
                </Button>
                <Button variant="outlined" sx={{ width: "100%",  color: "#000000", '&.Mui-selected': {color: "#FFFFFF"} }} onClick={() => navigate("/newUser")}>
                  Create Account
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default Header;


// The hamburger menu needs to be a form control
// Basically the two buttons need to indicate they are selected if so
// If one is selected, the other needs to deselect.