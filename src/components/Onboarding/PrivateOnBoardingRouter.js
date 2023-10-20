import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import { roleMap } from "./helper";

const OnboardingRouter = () => {
  const { onboardingState, setOnboardingState, selectRole, setLoggedIn } =
    useUser();
  const { roles, openingRole } = onboardingState;
  const navigate = useNavigate();
  console.log('roles')
  console.log(roles)
  console.log('roles')

  useEffect(() => {
    if ((roles.length ) === 0) {
        selectRole(openingRole);
        setLoggedIn(true);
        const { dashboardUrl } = roleMap[openingRole];
        navigate(dashboardUrl); 

    //    navigate('/tenantDashboard');
    } else {
      const nextRole = roles.shift();
      if (!openingRole) {
        setOnboardingState({
          ...onboardingState,
          openingRole: nextRole,
        });
      }
      selectRole(nextRole);
      navigate("/PrivateprofileName");
    }
  }, []);

  return null;
};

export default OnboardingRouter;
