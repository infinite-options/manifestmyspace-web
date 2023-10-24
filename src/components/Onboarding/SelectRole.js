import { useState } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate, useLocation } from "react-router-dom";
import UserAlreadyExistsModal from "./UserAlreadyExistsModal";
import { useUser } from "../../contexts/UserContext";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function SelectRole() {
  const { setAuthData, onboardingState, setOnboardingState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state;
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleNextStep = async () => {
    if (roles.length === 0) {
      alert("Please select a role");
      return;
    }
    setShowSpinner(true);
    const role = roles.join(",");
    const payload = {
      ...user,
      role,
    };
    setOnboardingState({
      ...onboardingState,
      roles,
    });
    if (user.isEmailSignup) {
      const response = await axios.post(
        "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/CreateAccount/MYSPACE",
        payload
      );
      if (response.data.message === "User already exists") {
        alert(response.data.message);
        return;
      } else {
        setAuthData(response.data.result);
        setShowSpinner(false);
        navigate(`/onboardingRouter`, { state: { isPrivate:false } });
      }
    } else {
      const response = await axios.post(
        "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE",
        payload
      );
      const userData = response.data;
      if (userData.message === "User already exists") {
        setUserAlreadyExists(!userAlreadyExists);
        return;
      } else {
        setAuthData(response.data.result);
        setShowSpinner(false);
        navigate(`/onboardingRouter`, { state: { isPrivate:false } });
      }
    }
  };

  const onCancel = () => {
    setUserAlreadyExists(false);
  };

  const handleRolesChange = (event, selectedRoles) => {
    setRoles(selectedRoles);
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", // Take up full screen width
          height: "100vh", // Set the Box height to full view height
          justifyContent: "flex-start", // Align items at the top
        }}
      >
        <UserAlreadyExistsModal
          isOpen={userAlreadyExists}
          onCancel={onCancel}
          email={user.email}
        />
        <Box style={{ paddingBottom: "10%" }}></Box>
        <Paper
          style={{
            paddingTop: "10%",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
          }}
        >
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            alignItems="start"
            position="relative"
            flexDirection="column"
          >
            <Stack spacing={-2} m={5} direction="row">
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                {"Select your role(s)."}
              </Typography>
            </Stack>
          </Box>
          <ToggleButtonGroup
            orientation="vertical"
            value={roles}
            onChange={handleRolesChange}
          >
            <ToggleButton value="MANAGER">{"Property Manager"}</ToggleButton>
            <ToggleButton value="PM_EMPLOYEE">
              {"Property Manager - Employee"}
            </ToggleButton>
            <ToggleButton value="OWNER">{"Property Owner"}</ToggleButton>
            <ToggleButton value="TENANT">{"Tenant"}</ToggleButton>
            <ToggleButton value="MAINTENANCE">{"Maintenance"}</ToggleButton>
            <ToggleButton value="MAINT_EMPLOYEE">
              {"Maintenance - Employee"}
            </ToggleButton>
          </ToggleButtonGroup>
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            position="relative"
            flexDirection="column"
            height="27vh"
          >
            <Button
              variant="contained"
              sx={{
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: "96%",
                height: "33px",
                borderRadius: "10px",
                marginLeft: "2%",
                position: "absolute",
                bottom: 15,
              }}
              onClick={handleNextStep}
            >
              {"Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default SelectRole;
