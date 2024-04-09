import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import { roleMap } from "./helper";

const OnboardingRouter = () => {
  const { onboardingState, setOnboardingState, selectRole, setLoggedIn, isLoggedIn, selectedRole } =
    useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!onboardingState || !onboardingState.roles) {
      console.error("onboardingState or roles is undefined. Initializing...");
      // Initialize onboardingState if it's undefined or roles is undefined
      setOnboardingState({
        roles: [],
        openingRole: null,
        // ... other properties
      });
      return;
    }

    const { roles, openingRole } = onboardingState;
    const pageToNavigate = isLoggedIn ? "/privateProfileName" : "/profileName";

    if (roles.length === 0) {
      if (openingRole) {
        console.log("Selected openingRole:", openingRole);
        selectRole(openingRole);
        setLoggedIn(true);
        const { dashboardUrl } = roleMap[openingRole];
        console.log("Navigating to:", dashboardUrl);
        navigate(dashboardUrl);
      } else {
        console.error("Opening role is undefined. Handle this case appropriately.");
        navigate(roleMap[selectedRole].dashboardUrl)
      }
    } else {
      const nextRole = roles.shift();
      if (!openingRole) {
        setOnboardingState({
          ...onboardingState,
          openingRole: nextRole,
        });
      }
      selectRole(nextRole);
      console.log("Navigating to:", pageToNavigate);
      navigate(pageToNavigate);
    }
  }, [onboardingState, selectRole, setLoggedIn, setOnboardingState, isLoggedIn, navigate]);

  return null;
};

export default OnboardingRouter;
