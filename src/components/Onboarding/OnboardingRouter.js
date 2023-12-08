import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import { roleMap } from "./helper";


const OnboardingRouter = () => {
  const { onboardingState, setOnboardingState, selectRole, setLoggedIn, isLoggedIn } =
    useUser();
  const { roles, openingRole } = onboardingState;
  const navigate = useNavigate();
  
  const pageToNavigate = isLoggedIn ? "/privateProfileName" : "/profileName";
  useEffect(() => {
    if (roles.length === 0) {
      if (openingRole) {
        selectRole(openingRole);
        setLoggedIn(true);
        const { dashboardUrl } = roleMap[openingRole];
        navigate(dashboardUrl);
      } else {
        // Handle the case where openingRole is undefined
        // You may want to redirect the user to a default page or show an error message
        console.error("Opening role is undefined. Handle this case appropriately.");
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
      navigate(pageToNavigate);
    }
  }, [openingRole, roles, selectRole, setLoggedIn, setOnboardingState, onboardingState, navigate, pageToNavigate]);

  return null;
};

export default OnboardingRouter;