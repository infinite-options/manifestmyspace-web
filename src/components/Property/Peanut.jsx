import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, Backdrop, CircularProgress } from "@mui/material";
import ForPropertyList from "./ForPropertyList";
import PropertyNavigator from "./PropertyNavigator";
import { useUser } from "../../contexts/UserContext";
import APIConfig from "../../utils/APIConfig";

const Peanut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getProfileId, selectedRole } = useUser();

  const [propertyList, setPropertyList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [rawPropertyData, setRawPropertyData] = useState([]);
  const [propertyIndex, setPropertyIndex] = useState(0); // Managed in Peanut
  const [allRentStatus, setAllRentStatus] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 950);
  const [dataReady, setDataReady] = useState(false);
  const [isFromRentWidget, setFromRentWidget] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      const profileId = getProfileId();
      const response = await fetch(`${APIConfig.baseURL.dev}/properties/${profileId}`);
      const propertyData = await response.json();
      const propertyList = getPropertyList(propertyData);
      setRawPropertyData(propertyData);
      setPropertyList([...propertyList]);
      setDisplayedItems([...propertyList]);
      const propertyRent = await propertyRentDetails();
      setAllRentStatus(propertyRent.RentStatus.result);

      if (location.state) {
        if (location.state.isBack === true) {
          setPropertyIndex(propertyList.length - 1);
          navigate(location.pathname, { replace: true, state: {} });
        } else {
          setPropertyIndex(location.state.index);
          navigate(location.pathname, { replace: true, state: {} });
        }
      }
      if (propertyData.Property.code === 200 && propertyRent.RentStatus.code === 200) {
        setDataReady(true);
      }
      if (selectedRole === "MANAGER" && sessionStorage.getItem("isrent") === "true") {
        setFromRentWidget(true);
      } else {
        setFromRentWidget(false);
        sessionStorage.removeItem("isrent");
      }
      setShowSpinner(false);
    };

    fetchData();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Current propertyIndex in Peanut:", propertyIndex);
  }, [propertyIndex]);

  const propertyRentDetails = async () => {
    const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/${getProfileId()}`);
    const rentResponse = await response.json();
    return rentResponse;
  };

  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 950);
  };

  // Define getPropertyList function here
  function getPropertyList(data) {
    const propertyList = data["Property"].result;
    const applications = data["Applications"].result;
    const maintenance = data["MaintenanceRequests"].result;

    const appsMap = new Map();
    applications.forEach((a) => {
      const appsByProperty = appsMap.get(a.property_uid) || [];
      appsByProperty.push(a);
      appsMap.set(a.property_uid, appsByProperty);
    });

    const maintMap = new Map();
    maintenance.forEach((m) => {
      const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
      maintByProperty.push(m);
      maintMap.set(m.maintenance_property_id, maintByProperty);
    });

    return propertyList.map((p) => {
      p.applications = appsMap.get(p.property_uid) || [];
      p.applicationsCount = [...p.applications].filter((a) => ["NEW", "PROCESSING"].includes(a.lease_status)).length;
      p.maintenance = maintMap.get(p.maintenance_property_id) || [];
      p.maintenanceCount = [...p.maintenance].filter(
        (m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING"
      ).length;
      return p;
    });
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      {showSpinner && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ForPropertyList 
            propertyList={propertyList}
            displayedItems={displayedItems}
            setDisplayedItems={setDisplayedItems}
            setPropertyIndex={setPropertyIndex}
            propertyIndex={propertyIndex}
          />
        </Grid>
        <Grid item xs={6}>
          {propertyList.length > 0 && allRentStatus.length > 0 && (
            <PropertyNavigator
              index={propertyIndex}
              setPropertyIndex={setPropertyIndex}
              propertyList={propertyList}
              allRentStatus={allRentStatus}
              isDesktop={isDesktop}
              rawPropertyData={rawPropertyData}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Peanut;
