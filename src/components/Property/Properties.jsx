import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Stack, Paper, Button, ThemeProvider, Grid, Container, InputBase, IconButton, Avatar, Badge } from "@mui/material";
import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import propertyImage from "./propertyImage.png";
import maintenanceIcon from "./maintenanceIcon.png";
import { useUser } from "../../contexts/UserContext";
import { get } from "../utils/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import PropertiesList from "./PropertiesList";
import PropertyNavigator from "./PropertyNavigator";

function Properties() {
  const [dataReady, setDataReady] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  const location = useLocation();
  let navigate = useNavigate();
  const { getProfileId, selectedRole } = useUser();
  const [propertyList, setPropertyList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [allRentStatus, setAllRentStatus] = useState([]);
  const [isFromRentWidget, setFromRentWidget] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 950);
  const [showPropertyForm, setShowPropertyForm] = useState(location.state?.showPropertyForm || false);
  const [showRentForm, setShowRentForm] = useState(location.state?.showRentForm || false);
  const [allContracts, setAllContracts] = useState([]);
  const profileId = getProfileId();
  const [rawPropertyData, setRawPropertyData] = useState([]);

  useEffect(() => {
    // console.log("PropertyList useEffect");
    // console.log(propertyList);
    const fetchData = async () => {
      //   console.log("Profile: ", profileId);
      //   console.log("GetProfile: ", getProfileId);
      setShowSpinner(true);
      // const response = await fetch(`http://localhost:4000/properties/${profileId}`)
      //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000003`)
      const response = await fetch(`${APIConfig.baseURL.dev}/properties/${profileId}`);

      const propertyData = await response.json();
      // console.log("In Property List >> Property Data: ", propertyData); // This has Applications, MaintenanceRequests, NewPMRequests and Property info from endpoint
      const propertyList = getPropertyList(propertyData);
      console.log("In Property List >> Property List: ", propertyList);
      // console.log("Testing Property Data", propertyData.Property.result);
      setRawPropertyData(propertyData);
      // console.log("New Set PM Requests: ", rawPropertyData);

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
    };
    fetchData();
    // Check screen size on initial load
    // handleResize();
    setShowSpinner(false);
    // Optionally, add a resize event listener
    // window.addEventListener("resize", handleResize);
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, []);

  useEffect(() => {
    const getContractsForOwner = async () => {
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
        // const response = await fetch(`${APIConfig.baseURL.dev}/contracts/600-000003`);
        if (!response.ok) {
          console.log("Error fetching contracts data");
        }
        const contractsResponse = await response.json();
        // console.log('contractsResponse--', contractsResponse.result);
        await setAllContracts(contractsResponse.result);
      } catch (error) {
        console.log(error);
      }
    };
    getContractsForOwner();
  }, []);

  const propertyRentDetails = async () => {
    try {
      const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/${getProfileId()}`);
      //const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/110-000003`);
      if (!response.ok) {
        console.log("Error fetching rent Details data");
      }
      const rentResponse = await response.json();
      return rentResponse;
    } catch (error) {
      console.error("Failed to fetch rent details:", error);
    }
  };

  useEffect(() => {
    console.log("dataReady", dataReady);
    console.log("showSpinner", showSpinner);
  }, []);

  function getPropertyList(data) {
    const propertyList = data["Property"]?.result;
    const applications = data["Applications"]?.result;
    const maintenance = data["MaintenanceRequests"]?.result;
    //   const newContracts = data["NewPMRequests"].result;
    //   console.log(maintenance);

    const appsMap = new Map();
    applications.forEach((a) => {
      const appsByProperty = appsMap.get(a.property_uid) || [];
      appsByProperty.push(a);
      appsMap.set(a.property_uid, appsByProperty);
    });

    const maintMap = new Map();
    if (maintenance) {
      maintenance.forEach((m) => {
        // console.log("before", m);
        const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
        maintByProperty.push(m);
        // console.log("after", maintByProperty);
        maintMap.set(m.maintenance_property_id, maintByProperty);
      });
    }

    //   const contractsMap = new Map();
    //   newContracts.forEach((c) => {
    //     // console.log("before", m);
    //     const contractsByProperty = maintMap.get(c.property_id) || [];
    //     contractsByProperty.push(c);
    //     // console.log("after", maintByProperty);
    //     contractsMap.set(c.property_id, contractsByProperty);
    //   });

    //   console.log(maintMap);
    return propertyList.map((p) => {
      p.applications = appsMap.get(p.property_uid) || [];
      p.applicationsCount = [...p.applications].filter((a) => ["NEW", "PROCESSING"].includes(a.lease_status)).length;
      p.maintenance = maintMap.get(p.property_uid) || [];
      p.maintenanceCount = [...p.maintenance].filter((m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING").length;
      // p.newContracts = contractsMap.get(p.property_uid) || [];
      // p.newContractsCount = [...p.newContracts].filter((m) => m.contract_status === "NEW").length;
      console.log("P:", p);
      console.log("P:", p.applications);
      console.log("P:", p.applicationsCount);
      return p;
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        {/* {showSpinner || !dataReady ? (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color='inherit' />
          </Backdrop>
        ) : ( */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <PropertiesList index={propertyIndex} propertyList={propertyList} allRentStatus={allRentStatus} isDesktop={isDesktop} contracts={allContracts} />
          </Grid>
          <Grid item xs={12} md={8}>
            {/* <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              Proprty Navigator
            </Typography> */}
            <PropertyNavigator index={propertyIndex} propertyList={propertyList} allRentStatus={allRentStatus} isDesktop={isDesktop} contracts={allContracts} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Properties;
