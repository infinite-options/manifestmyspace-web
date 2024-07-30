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
import EditProperty from "./EditProperty";
import ViewLease from "../Leases/ViewLease";
import TenantApplicationNav from "../Applications/TenantApplicationNav";

function Properties(props) {
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
  const [returnIndex, setReturnIndex] = useState(0);
  const [applicationIndex, setApplicationIndex] = useState(0);

  // LHS , RHS
  const [LHS, setLHS] = useState(location.state?.showLHS || "List");
  const [RHS, setRHS] = useState(location.state?.showRHS || "PropertyNavigator");
  const [page, setPage] = useState("");
  console.log("View RETURN INDEX : ", returnIndex);

  console.log("propertyIndex at the beginning 1: ", propertyIndex);

  // console.log("LEASE", propertyList[propertyIndex].lease_id)
  // useEffect(() => {
  //   setLHS(props.showLHS);
  //   setRHS(props.showRHS);
  // }, []);

  useEffect(() => {
    console.log("In Properties - LHS: ", LHS);
    console.log("In Properties - RHS: ", RHS);
    console.log("Current Profile ID: ", getProfileId);
    console.log("Current Selected Role: ", selectedRole);
    console.log("propertyIndex at the beginning 2: ", propertyIndex);
    console.log("Return Index: ", returnIndex);
  }, [LHS, RHS]);

  if (selectedRole === "MANAGER") {
    console.log("Manager Selected");
  } else {
    console.log("Owner Selected");
  }

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
      setPropertyIndex(0);

      const propertyRent = await propertyRentDetails();
      setAllRentStatus(propertyRent.RentStatus.result);

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

  const handleEditClick = (editPage) => {
    setPage(editPage);
    setRHS("EditProperty");
  };

  const handleListClick = (newData) => {
    console.log("View leases New Data : ", newData);
    setReturnIndex(newData);
    console.log("View leases RETURN INDEX : ", returnIndex);
  };

  const handleViewLeaseClick = () => {
    // setPage("ViewLease");
    console.log("View leases before before: ", propertyList);
    console.log("View leases before before Index: ", propertyIndex);
    console.log("View leases before: ", propertyList[propertyIndex]);
    console.log("View leases", propertyList[propertyIndex].lease_uid);
    setRHS("ViewLease");
  };

  const handleBackClick = () => {
    setRHS("PropertyNavigator");
  };

  const handleViewApplication = (index) => {
    setApplicationIndex(index);
    setRHS("Applications");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {/* {LHS === "List" && (
              <PropertiesList
                index={propertyIndex}
                propertyList={propertyList}
                allRentStatus={allRentStatus}
                isDesktop={isDesktop}
                contracts={allContracts}
                setPropertyIndex={setPropertyIndex}
              />
            )} */}
            <PropertiesList
              index={propertyIndex}
              LHS={LHS}
              propertyList={propertyList}
              allRentStatus={allRentStatus}
              isDesktop={isDesktop}
              contracts={allContracts}
              onDataChange={handleListClick}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {RHS === "PropertyNavigator" && (
              <PropertyNavigator
                // index={propertyIndex}
                index={returnIndex}
                propertyList={propertyList}
                allRentStatus={allRentStatus}
                isDesktop={isDesktop}
                contracts={allContracts}
                onEditClick={handleEditClick}
                onViewLeaseClick={handleViewLeaseClick}
                handleViewApplication={handleViewApplication}
              />
            )}
            {RHS === "EditProperty" && (
              <EditProperty
                currentId={propertyList[returnIndex].property_uid}
                property={propertyList[returnIndex]}
                index={returnIndex}
                propertyList={propertyList}
                page={page}
                isDesktop={isDesktop}
                allRentStatus={allRentStatus}
                rawPropertyData={propertyList}
                onBackClick={handleBackClick}
              />
            )}
            {RHS === "ViewLease" && <ViewLease lease_id={propertyList[0].lease_uid} index={propertyIndex} isDesktop={isDesktop} onBackClick={handleBackClick} />}
            {RHS === "Applications" && (
              <TenantApplicationNav index={applicationIndex} propertyIndex={returnIndex} property={propertyList[returnIndex]} isDesktop={isDesktop} onBackClick={handleBackClick} />
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Properties;
