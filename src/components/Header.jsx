import { useNavigate } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useUser } from "../contexts/UserContext";
import { roleMap } from "./Onboarding/helper";
import { Box, Stack, Grid, ThemeProvider, Button, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as Logo } from "../images/logo.svg";
import { useCookies } from "react-cookie";
import theme from "../theme/theme";
import { darken } from "@mui/system";
import { lighten } from "@material-ui/core";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

function Header() {
  const { user, selectedRole, selectRole, roleName, isLoggedIn } = useUser();
  const [cookie, setCookie] = useCookies(["user"]);
  const cookiesData = cookie["user"];
  const userRoles = user ? cookiesData?.role.split(",") : [];
  console.log(userRoles);

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
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <div className="main-header">
        {isLoggedIn ? (
          <>
            <div className="main-header-title-logo">
              <div className="main-header-title-logo-container">
                <Logo />
              </div>
            </div>
            <AppBar position="static" style={{ backgroundColor: "#3D5CAC" }}>
              <Toolbar
                disableGutters
                style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  justifyContent: "center",
                  flexGrow: 1,
                }}
              >
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
            </AppBar>
          </>
        ) : (
          <Box>
            {/* <div className="app-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#160449' }}> */}
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
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/returningUser");
                        handleClose();
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: theme.typography.primary.fontWeight,
                        }}
                      >
                        Login
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/newUser");
                        handleClose();
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: theme.typography.primary.fontWeight,
                        }}
                      >
                        Create Account
                      </Typography>
                    </MenuItem>
                  </Menu>
                </div>
                {/* <div className="toolbar-buttons" style={{ display: 'flex', gap: '25px', paddingRight: "50px" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#FFFFFF",
                                    // color: theme.palette.background.default,
                                    color: theme.palette.primary.main,
                                    height: `40%`,
                                    left: `5%`,
                                    borderRadius: "15px",
                                    '&:hover': {
                                        borderColor: "white",
                                        backgroundColor: darken("#FFFFFF", 0.3),
                                    },
                                }}
                                
                                onClick={() => {
                                    navigate("/returningUser");
                                }}
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
                                sx={{
                                    background: "#3D5CAC",
                                    color: theme.palette.background.default,
                                    height: `40%`,
                                    left: `5%`,
                                    borderRadius: "15px",
                                    '&:hover': {
                                        borderColor: "white",
                                        backgroundColor: lighten("#3D5CAC", 0.3),
                                    },
                                }}
                                onClick={() => {
                                    navigate("/newUser");
                                }}
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
                            <MenuIcon sx={{ display: { xs: 'block', sm: 'none' }, cursor: 'pointer' }} onClick={handleMenuToggle} />
                        </div> */}
              </Toolbar>
            </AppBar>
            {isMenuOpen && (
              <Box sx={{ position: "absolute", top: "64px", right: "10px", backgroundColor: "white", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: "1000" }}>
                {/* Menu Items */}
                <Button sx={{ display: "block", width: "100%" }} onClick={() => navigate("/returningUser")}>
                  Login
                </Button>
                <Button sx={{ display: "block", width: "100%" }} onClick={() => navigate("/newUser")}>
                  Create Account
                </Button>
              </Box>
            )}
          </Box>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Header;
