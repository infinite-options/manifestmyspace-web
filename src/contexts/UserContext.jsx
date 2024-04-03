import React, { createContext, useContext, useState } from "react";
import { useCookies, Cookies } from "react-cookie";

const UserContext = createContext();

export const UserProvider = ({ children, cookiesObj = new Cookies() }) => {
  const [cookies, setCookie] = useCookies(["user", "token", "selectedRole"]);
  const [user, setUser] = useState(cookies.user);
  const [selectedRole, setSelectedRole] = useState(cookies.selectedRole);
  const [isLoggedIn, setLoggedIn] = useState(!!cookies.user);
  const [onboardingState, setOnboardingState] = useState();
  const [supervisor, setSupervisor]= useState(null)
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

  const isMaintenance = () => {
    return selectedRole === "MAINTENANCE" || selectedRole === "MAINT_EMPLOYEE";
  };

  const isOwner = () => {
    return selectedRole === "OWNER";
  };

  const roleName = (role = selectedRole) => {
    switch (role) {
      case "MANAGER":
        return "Manager";
      case "MAINTENANCE":
        return "Maintenance";
      case "PM_EMPLOYEE":
        return "PM Employee";
      case "MAINT_EMPLOYEE":
        return "Maintenance Employee";
      case "OWNER":
        return "Owner";
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
        MANAGEMENT: updateBusinessSection(prevUser.businesses?.MANAGEMENT, profileUidObj),
      };
    } else {
      newBusinesses = {
        ...prevUser.businesses,
        MAINTENANCE: updateBusinessSection(prevUser.businesses?.MAINTENANCE, profileUidObj),
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
  const getProfileId = () => {
    console.log('Raminsss', user)
    if (selectedRole==='PM_EMPLOYEE') return user.businesses.MANAGEMENT.business_employee_id;
    if (isManagement()) return getBusiness(user, "MANAGEMENT");
    if (isMaintenance()) return getBusiness(user, "MAINTENANCE");
    if (selectedRole=== 'TENANT') return user.tenant_id; 
    if (selectedRole=== 'OWNER') return  user.owner_id;

  };
  const logout = () => {
    console.log("In logout as ", user);
    cookiesObj.remove("user");
    cookiesObj.remove("token");
    window.location.href = "/";
  };

  const maintenanceRoutingBasedOnSelectedRole = () => {
    const role = roleName();
    if (role === "Manager") {
      return "/managerMaintenance";
    } else if (role === "Owner") {
      return "/ownerMaintenance";
    } else if (role === "Maintenance") {
      return "/workerMaintenance";
    } else if (role === "PM Employee") {
      return "/managerMaintenance";
    } else if (role === "Maintenance Employee") {
      return "/workerMaintenance";
    } else if (role === "Tenant") {
      return "/tenantMaintenance";
    }
  };

  const paymentRoutingBasedOnSelectedRole = () => {
    const role = roleName();
    if (role === "Manager") {
      return "/payments";
    }
    // } else if (role === "Property Owner"){
    //   return "/ownerMaintenance"
    // } else if (role === "Maintenance"){
    //   return "/workerMaintenance"
    // } else if (role === "PM Employee"){
    //   return "/managerMaintenance"
    // } else if (role === "Maintenance Employee"){
    //   return "/workerMaintenance"
    else if (role === "Tenant") {
      return "/payments";
    }
  };

  const leaseRoutingBasedOnSelectedRole = () => {
    // console.log("routingWithSelectedRole selectedRole", selectedRole)
    const role = roleName();
    if (role === "Manager") {
      return "/Leases";
    } else if (role === "Owner") {
      return "/Leases";
    }
  };

  const propertyRoutingBasedOnSelectedRole = () => {
    // console.log("routingWithSelectedRole selectedRole", selectedRole)
    const role = roleName();
    if (role === "Manager") {
      return "/properties";
    } else if (role === "Owner") {
      return "/properties";
    }
  };

  const dashboardRoutingBasedOnSelectedRole = () => {
    // console.log("dashboardRoutingBasedOnSelectedRole selectedRole", selectedRole)
    const role = roleName();
    if (role === "Manager") {
      return "/managerDashboard";
    } else if (role === "Owner") {
      return "/ownerDashboard";
    } else if (role === "Maintenance") {
      return "/maintenanceDashboard";
    } else if (role === "PM Employee") {
      return "/managerDashboard";
    } else if (role === "Maintenance Employee") {
      return "/maintenanceDashboard";
    } else if (role === "Tenant") {
      return "/tenantDashboard";
    }
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
        supervisor,
        setSupervisor,
        isOwner,
        roleName,
        isLoggedIn,
        setLoggedIn,
        updateProfileUid,
        getProfileId,
        logout,
        maintenanceRoutingBasedOnSelectedRole,
        paymentRoutingBasedOnSelectedRole,
        leaseRoutingBasedOnSelectedRole,
        propertyRoutingBasedOnSelectedRole,
        dashboardRoutingBasedOnSelectedRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  // console.log("In useUser");
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
