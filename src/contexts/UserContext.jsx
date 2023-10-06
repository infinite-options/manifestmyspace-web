import React, { createContext, useContext, useState } from "react";
import { useCookies, removeCookie } from "react-cookie";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user", "token", "selectedRole"]);
  const [user, setUser] = useState(cookies.user);
  const [selectedRole, setSelectedRole] = useState(cookies.selectedRole);
  const [isLoggedIn, setLoggedIn] = useState(!!cookies.user);
  const [onboardingState, setOnboardingState] = useState();
  const setAuthData = (data) => {
    setUser(data.user);
    setCookie("user", data.user);
    setCookie("token", data.access_token);
  };
  const selectRole = (role) => {
    setSelectedRole(role);
    setCookie("selectedRole", role);
  };
  const isBusiness = () => {
    return selectedRole === "MANAGER" || selectedRole === "MAINTENANCE";
  };
  const isManager = () => {
    return selectedRole === "MANAGER";
  };
  const isManagement = () => {
    return selectedRole === "MANAGER" || selectedRole === "PM_EMPLOYEE";
  };
  const isManagementEmployee = () => {
    return selectedRole === "PM_EMPLOYEE";
  };
  const isEmployee = () => {
    return selectedRole === "PM_EMPLOYEE" || selectedRole === "MAINT_EMPLOYEE";
  };
  const roleName = (role = selectedRole) => {
    switch (role) {
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
  const updateProfileUid = (profileUidObj) => {
    if (isBusiness() || isEmployee()) {
      setUser((prev) => updateUser(prev, profileUidObj));
    } else {
      setUser((prev) => ({ ...prev, ...profileUidObj }));
    }
  };
  const updateUser = (prevUser, profileUidObj) => {
    let newBusinesses;
    if (selectedRole === "MANAGER" || selectedRole === "PM_EMPLOYEE") {
      newBusinesses = {
        ...prevUser.businesses,
        MANAGEMENT: updateBusinessSection(
          prevUser.businesses?.MANAGEMENT,
          profileUidObj
        ),
      };
    } else {
      newBusinesses = {
        ...prevUser.businesses,
        MAINTENANCE: updateBusinessSection(
          prevUser.businesses?.MAINTENANCE,
          profileUidObj
        ),
      };
    }
    return {
      ...prevUser,
      businesses: newBusinesses,
    };
  };
  const updateBusinessSection = (prevSection, profileObj) => {
    if (prevSection) {
      return Object.assign({}, prevSection, profileObj);
    }
    return profileObj;
  };
  const getBusiness = (user, type) => user.businesses[type].business_uid;
  const getProfileId = () =>
    isManagement()
      ? getBusiness(user, "MANAGEMENT")
      : isBusiness()
      ? getBusiness(user, "MAINTENANCE")
      : selectedRole === "TENANT"
      ? user.tenant_id
      : user.owner_id;
  const logout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    navigate("/");
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        selectedRole,
        selectRole,
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
        updateProfileUid,
        getProfileId,
        logout,
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
