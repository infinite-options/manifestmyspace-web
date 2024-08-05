import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useUser } from "../../contexts/UserContext";
import { roleMap } from "../Onboarding/helper";
import { Box, Button, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as Logo } from "../../images/logo.svg";
import { useCookies } from "react-cookie";
import theme from "../../theme/theme";
import { darken, lighten } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserNavBar from "./UserNavBar";
import { ThemeProvider } from "@mui/material/styles"; // Correct import for ThemeProvider

function Header(props) {
  // console.log("In Header.jsx");
  const { user, selectedRole, selectRole, roleName, isLoggedIn } = useUser();
  const [cookie] = useCookies(["user"]); // Removed setCookie since it is unused
  const cookiesData = cookie["user"];
  // console.log("cookiesData ", cookiesData);
  const userRoles = user && cookiesData?.role ? cookiesData.role.split(",") : [];
  // console.log("Current User Roles: ", userRoles);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const desiredOrder = ["MANAGER", "OWNER", "TENANT", "MAINTENANCE", "PM_EMPLOYEE", "MAINT_EMPLOYEE"];

  const sortUserRoles = (roles, order) => {
    return roles.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  const sortedRoles = sortUserRoles([...userRoles], desiredOrder);
  // console.log("Sorted Roles: ", sortedRoles);

  const handleMenuToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleButtonClick = (role) => {
    selectRole(role);
    const { dashboardUrl } = roleMap[role];
    if (role === "MAINTENANCE") {
      sessionStorage.removeItem("workerselectedRequestIndex");
      sessionStorage.removeItem("workerselectedStatus");
      sessionStorage.removeItem("workermaintenanceItemsForStatus");
      sessionStorage.removeItem("workerallMaintenanceData");
      sessionStorage.removeItem("workermaintenance_request_uid");
      sessionStorage.removeItem("workerMaintenanceView");

      window.dispatchEvent(new Event("storage"));
      // Dispatch the custom event
      setTimeout(() => {
        window.dispatchEvent(new Event("removeworkermaintenanceRequestSelected"));
      }, 0);
    }
    navigate(dashboardUrl);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {isLoggedIn ? (
          <>
            <AppBar position='static' style={{ backgroundColor: "#160449", paddingTop: "10px", paddingBottom: "10px" }}>
              <Toolbar style={{ justifyContent: "space-between", padding: "0 20px" }}>
                <div
                  onClick={() => navigate("/")}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "100%" : "auto",
                    ...(isMobile ? { order: -1 } : {}),
                  }}
                >
                  <Logo />
                </div>
                {!isMobile && <UserNavBar isMobile={isMobile} />}
                {isMobile && (
                  <IconButton size='large' edge='end' color='inherit' aria-label='menu' sx={{ ml: 2 }} onClick={handleMenuToggle}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Toolbar>
            </AppBar>
            {!isMobile && sortedRoles.length > 0 && (
              <Toolbar style={{ justifyContent: "space-between", padding: "0 20px", backgroundColor: "#3D5CAC", color: "#FFFFFF" }}>
                {sortedRoles.map((role) => (
                  <Button
                    key={role}
                    color='inherit'
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
            {isMobile && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: "45px" }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {sortedRoles.map((role) => (
                  <MenuItem key={role} onClick={() => handleButtonClick(role)}>
                    {roleName(role)}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </>
        ) : (
          <Box>
            <AppBar position='static' style={{ backgroundColor: "#160449", paddingTop: "10px", paddingBottom: "10px" }}>
              <Toolbar style={{ justifyContent: "space-between", padding: "0 20px" }}>
                <div
                  onClick={() => navigate("/")}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "100%" : "auto",
                    ...(isMobile ? { order: -1 } : {}),
                  }}
                >
                  <Logo />
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, gap: "25px" }}>
                    <Button
                      variant='contained'
                      // onClick={() => navigate("/returningUser")}

                      onClick={() => navigate("/", { state: { showLogin: true } })}
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
                      variant='contained'
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
                  <IconButton size='large' edge='end' color='inherit' aria-label='menu' sx={{ ml: 2, display: { xs: "flex", md: "none" } }} onClick={handleClick}>
                    <MenuIcon onClick={handleMenuToggle} />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {isMenuOpen && (
              <Box sx={{ position: "absolute", top: "64px", right: "10px", backgroundColor: "white", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: "1000" }}>
                <Button variant='outlined' sx={{ display: "block", width: "100%", color: "#000000" }} onClick={() => navigate("/returningUser")}>
                  Login
                </Button>
                <Button variant='outlined' sx={{ width: "100%", color: "#000000" }} onClick={() => navigate("/newUser")}>
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
