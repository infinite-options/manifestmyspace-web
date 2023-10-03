import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [onboardingState, setOnboardingState] = useState();
  const setAuthData = (data) => {
    setUser(data.user);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };
  const isBusiness = () => {
    return selectedRole === "MANAGER" || selectedRole === "MAINTENANCE";
  };
  const isManager = () => {
    return selectedRole === "MANAGER";
  };
  const isManagementEmployee = () => {
    return selectedRole === "PM_EMPLOYEE";
  };
  const isEmployee = () => {
    return selectedRole === "PM_EMPLOYEE" || selectedRole === "MAINT_EMPLOYEE";
  };
  const roleName = () => {
    switch (selectedRole) {
      case "MANAGER":
        return "Property Manager";
      case "MAINTENANCE":
        return "Maintenance";
      case "PM_EMPLOYEE":
        return "PM Employee";
      case "MAINT_EMPLOYEE":
        return "Maintenance Employee";
      case "OWNER":
        return "Property Owner";
      default:
        return "Tenant";
    }
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
        isBusiness,
        isManager,
        isEmployee,
        isManagementEmployee,
        roleName,
        isLoggedIn,
        setLoggedIn,
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
