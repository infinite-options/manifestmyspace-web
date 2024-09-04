import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import APIConfig from "../../utils/APIConfig";
import ContactsList from "./ContactsList";
import TenantContactDetail from "./ContactDetail/TenantContactDetail";
import OwnerContactDetail from "./ContactDetail/OwnerContactDetail";
import MaintenanceContactDetail from "./ContactDetail/MaintenanceContactDetail";
import EmployeeContactDetail from "./ContactDetail/EmployeeContactDetail";
import ManagerContactDetail from "./ContactDetail/ManagerContactDetail";

const ContactsPM = () => {
  const { getProfileId, selectedRole } = useUser();
  const location = useLocation();
  const [contactsTab, setContactsTab] = useState(location.state?.contactsTab);
  const [contactsData, setContactsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [managerId, setManagerId] = useState(null);

  const fetchData = async () => {
    const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
    const response = await axios.get(url);
    
    let data;
    switch (selectedRole) {
      case "MANAGER":
        data = response.data["management_contacts"];
        setContactsTab("Owner");
        break;
      case "OWNER":
        data = response.data["owner_contacts"];
        setContactsTab("Manager");
        break;
      case "TENANT":
        data = response.data["tenant_contacts"];
        setContactsTab("Manager");
        break;
      case "MAINTENANCE":
        data = response.data["maintenance_contacts"];
        setContactsTab("Manager");
        break;
      default:
        data = [];
        console.error("Unexpected role or no contacts found for this role");
    }
    
    setContactsData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && contactsData.length > 0) {
      const { contactsTab, managerId, tenantId } = location.state;
  
      let newTab = contactsTab;
      let newIndex = 0;
  
      if (newTab === "Manager" && managerId) {
        const managerIndex = contactsData?.managers?.findIndex(
          (manager) => manager.business_uid === managerId
        );
        newIndex = managerIndex >= 0 ? managerIndex : 0;
      } else if (newTab === "Tenant" && tenantId && selectedRole !== "TENANT") {
        const tenantIndex = contactsData?.tenants?.findIndex(
          (tenant) => tenant.tenant_uid === tenantId
        );
        newIndex = tenantIndex >= 0 ? tenantIndex : 0; 
      }
  
      setContactsTab(newTab);
      setCurrentIndex(newIndex);
    }
  }, [location.state, contactsData, selectedRole]);
  
  useEffect(() => {
    if (contactsTab) {
      setCurrentIndex(0); // Reset to the first item whenever the tab changes
    }
  }, [contactsTab]);
  



  const renderContactDetail = () => {
    switch (contactsTab) {
      case "Owner":
        return (
          <OwnerContactDetail
            data={contactsData?.owners}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
      case "Tenant":
        return (
          <TenantContactDetail
            data={contactsData?.tenants}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
      case "Maintenance":
        return (
          <MaintenanceContactDetail
            data={contactsData?.maintenance}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
      case "Employee":
        return (
          <EmployeeContactDetail
            data={contactsData?.employees}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
      case "Manager":
        return (
          <ManagerContactDetail
            data={contactsData?.managers}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container disableGutters maxWidth="lg">
      <Grid container>
        <Grid container item xs={12} md={4}>
          <Grid item xs={12} sx={{ padding: "5px", height: "100%" }}>
            <ContactsList
              data={contactsData}
              tab={contactsTab}
              setTab={setContactsTab}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} md={8}>
          <Grid item xs={12} sx={{ padding: "5px" }}>
            {renderContactDetail()}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactsPM;
