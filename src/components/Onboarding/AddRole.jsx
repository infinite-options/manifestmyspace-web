import { useState } from "react";
import { ThemeProvider, Button, Typography, Box, Stack } from "@mui/material";
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
  const {onboardingState, setOnboardingState } = useUser();
  const navigate = useNavigate();
  const initialRoles = cookiesData.role.split(",").map((role) => role.toUpperCase());
  const [selectedRoles, setSelectedRoles] = useState(initialRoles);
  let real_time_selected_roles = selectedRoles; // To avoid state update delay
  const [showSpinner, setShowSpinner] = useState(false);
  const baseURL= 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/'
  const postURLs = {
    TENANT: "/tenantProfile",
    OWNER: "/ownerProfile",
    MANAGER: "/businessProfile",
    MAINTENANCE: "/businessProfile",
    PM_EMPLOYEE: "/employee",
    MAINT_EMPLOYEE: "/employee"
  };


  const handleNextStep = async () => {
    if (selectedRoles.length === 0) {
      alert("Please select a role");
      return;
    }
    // Updating the Role and Starting the OnBoard Flow
    user.role=[selectedRoles].join('')
    let newRoles= selectedRoles.filter(val=> !initialRoles.includes(val))
    const updatePayload={user_uid: user.user_uid, role: user.role}
    setOnboardingState({
      ...onboardingState ?? {},
      roles:newRoles,
    });
    const updateURL=`https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdateUserByUID/MYSPACE` //Updating user in the DB
    const response = await axios.put(
      updateURL,
      updatePayload
    );
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
        <Stack style={{ marginTop: "20px" }}>
          <ToggleButtonGroup
            orientation="vertical"
            value={selectedRoles}
            onChange={() => {}}
          >
            <ToggleButton
              value="MANAGER"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }} 
              disabled={initialRoles.includes('MANAGER')}
            >
              {"Property Manager"}
            </ToggleButton>
            <ToggleButton
              value="PM_EMPLOYEE"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }} 
              disabled={initialRoles.includes('PM_EMPLOYEE')}
            >
              {"Property Manager - Employee"}
            </ToggleButton>
            <ToggleButton
              value="OWNER"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }} 
              disabled={initialRoles.includes('OWNER')}
            >
              {"Property Owner"}
            </ToggleButton>
            <ToggleButton
              value="TENANT"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }} 
              disabled={initialRoles.includes('TENANT')}
            >
              {"Tenant"}
            </ToggleButton>
            <ToggleButton
              value="MAINTENANCE"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }} 
              disabled={initialRoles.includes('MAINTENANCE')}
            >
              {"Maintenance"}
            </ToggleButton>
            <ToggleButton
              value="MAINT_EMPLOYEE"
              onClick={handleRoleToggle}
              sx={{ width: "100%" }}
              disabled={initialRoles.includes('MAINT_EMPLOYEE')} 
            >
              {"Maintenance - Employee"}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
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
            marginTop: "20px",
          }}
          onClick={handleNextStep}
        >
          {"Add Roles"}
        </Button>
      </Box>
    </ThemeProvider>
  );
}
