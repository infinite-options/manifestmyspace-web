import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [onboardingState, setOnboardingState] = useState();
  const setAuthData = (data) => {
    setUser(data.user);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        selectedRole,
        setSelectedRole,
        setAuthData,
        onboardingState,
        setOnboardingState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const profileRoutesMap = {
  MANAGER: { onboardUrl: "/pmProfileName", dashboardUrl: "/managerDashboard" },
  OWNER: { onboardUrl: "/poProfileName", dashboardUrl: "/ownerDashboard" },
  TENANT: {
    onboardUrl: "/tenantProfileName",
    dashboardUrl: "/tenantDashboard",
  },
  MAINTENANCE: {
    onboardUrl: "/maintenanceProfileName",
    dashboardUrl: "/maintenanceDashboard",
  },
};
