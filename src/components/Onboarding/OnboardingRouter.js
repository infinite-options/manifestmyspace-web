import { useNavigate } from "react-router-dom";
import { useUser, profileRoutesMap } from "../../contexts/UserContext";
import { useEffect } from "react";

const OnboardingRouter = () => {
  const { onboardingState, setOnboardingState, setSelectedRole } = useUser();
  const { roles, openingRole } = onboardingState;
  const navigate = useNavigate();

  useEffect(() => {
    if (roles.length === 0) {
      setSelectedRole(openingRole);
      navigate(profileRoutesMap[openingRole].dashboardUrl);
    } else {
      const nextProfile = roles.shift();
      if (!openingRole) {
        setOnboardingState({
          ...onboardingState,
          openingRole: nextProfile,
        });
      }
      navigate(profileRoutesMap[nextProfile].onboardUrl);
    }
  }, []);

  return null;
};

export default OnboardingRouter;
