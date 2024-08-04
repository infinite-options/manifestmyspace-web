import { useState } from "react";
import { ThemeProvider, Button, Typography, Box, Stack, Paper } from "@mui/material";
import theme from "../../theme/theme";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function AddRole() {
  const [cookie, setCookie] = useCookies(["user"]);
  const cookiesData = cookie["user"];
  const user = cookiesData;
  const { onboardingState, setOnboardingState } = useUser();
  const navigate = useNavigate();
  const initialRoles = cookiesData.role.split(",").map((role) => role.toUpperCase());
  const [selectedRoles, setSelectedRoles] = useState(initialRoles);
  let real_time_selected_roles = selectedRoles; // To avoid state update delay
  const [showSpinner, setShowSpinner] = useState(false);

  const handleNextStep = async () => {
    console.log("Add Role Clicked");

    // Updating the Role and Starting the OnBoard Flow
    user.role = [selectedRoles].join("");
    let newRoles = selectedRoles.filter((val) => !initialRoles.includes(val));
    if (newRoles.length === 0) {
      alert("Please select a role");
      return;
    }
    console.log("New Role Selected: ", newRoles);

    const updatePayload = { user_uid: user.user_uid, role: user.role };
    console.log("Endpoint Payload: ", updatePayload);
    setOnboardingState({
      ...(onboardingState ?? {}),
      roles: newRoles,
    });
    const updateURL = `https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateUserByUID/MYSPACE`; //Updating user in the DB
    const response = await axios.put(updateURL, updatePayload);
    setCookie("user", user);

    navigate(`/privateonboardingRouter`);
  };

  // Function to get selected roles
  const getSelectedRoles = () => {
    return selectedRoles;
  };

  const handleRoleToggle = (event) => {
    const value = event.target.value;

    if (real_time_selected_roles.includes(value)) {
      real_time_selected_roles = real_time_selected_roles.filter((role) => role !== value);
      setSelectedRoles(real_time_selected_roles);
    } else {
      real_time_selected_roles = [...real_time_selected_roles, value];
      setSelectedRoles(real_time_selected_roles);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
        <Box style={{ paddingBottom: "10%" }}></Box>
        <Paper
          style={{
            paddingTop: "10%",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
          }}
        >
          <Box component='span' display='flex' justifyContent='center' alignItems='start' position='relative' flexDirection='column'>
            <Stack spacing={-2} m={5} direction='row'>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                {"Select your role(s) to add."}
              </Typography>
            </Stack>
          </Box>
          <ToggleButtonGroup orientation='vertical' value={selectedRoles} onChange={() => {}}>
            <ToggleButton value='MANAGER' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("MANAGER")}>
              {"Property Manager"}
            </ToggleButton>
            <ToggleButton value='PM_EMPLOYEE' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("PM_EMPLOYEE")}>
              {"Property Manager - Employee"}
            </ToggleButton>
            <ToggleButton value='OWNER' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("OWNER")}>
              {"Property Owner"}
            </ToggleButton>
            <ToggleButton value='TENANT' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("TENANT")}>
              {"Tenant"}
            </ToggleButton>
            <ToggleButton value='MAINTENANCE' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("MAINTENANCE")}>
              {"Maintenance"}
            </ToggleButton>
            <ToggleButton value='MAINT_EMPLOYEE' onClick={handleRoleToggle} sx={{ width: "100%" }} disabled={initialRoles.includes("MAINT_EMPLOYEE")}>
              {"Maintenance - Employee"}
            </ToggleButton>
          </ToggleButtonGroup>
          <Box component='span' display='flex' justifyContent='center' position='relative' flexDirection='column' height='27vh'>
            <Button
              variant='contained'
              sx={{
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: "96%",
                height: "33px",
                borderRadius: "10px",
                marginLeft: "2%",
                position: "absolute",
                bottom: 15,
                marginTop: "0",
              }}
              onClick={handleNextStep}
            >
              {"Add Roles"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
