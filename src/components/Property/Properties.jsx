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
import ViewManagementContract from "../Contracts/OwnerManagerContracts/ViewManagementContract";
import TenantApplicationNav from "../Applications/TenantApplicationNav";
import PropertyForm from "./PropertyForm";
import ManagementContractDetails from "../Contracts/OwnerManagerContracts/ManagementContractDetails";
import PMQuoteList from "./PMQuotesList";

function Properties() {
  const location = useLocation();
  console.log("In Properties");
  console.log("In Properties LHS: ", location.state?.showLHS);
  console.log("In Properties RHS: ", location.state?.showRHS);

  const [dataReady, setDataReady] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

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
  const [pmRequests, setPMRequests] = useState([]);

  const [newContractUID, setNewContractUID] = useState(null);
  const [newContractPropertyUID, setNewContractPropertyUID] = useState(null);

  useEffect(() => {
    // console.log("ROHIT - newContractUID - ", newContractUID);
  }, [newContractUID]);

  useEffect(() => {
    // console.log("ROHIT - newContractPropertyUID - ", newContractPropertyUID);
  }, [newContractPropertyUID]);
  // LHS , RHS
  const [LHS, setLHS] = useState(location.state?.showLHS || "List");
  const [RHS, setRHS] = useState(location.state?.showRHS || "PropertyNavigator");
  const [page, setPage] = useState("");
  // console.log("View RETURN INDEX : ", returnIndex);

  // console.log("propertyIndex at the beginning 1: ", propertyIndex);

  // console.log("LEASE", propertyList[propertyIndex].lease_id)
  // useEffect(() => {
  //   setLHS(props.showLHS);
  //   setRHS(props.showRHS);
  // }, []);

  // useEffect(() => {
  //   console.log("In Properties - LHS: ", LHS);
  //   console.log("In Properties - RHS: ", RHS);
  //   console.log("Current Profile ID: ", getProfileId);
  //   console.log("Current Selected Role: ", selectedRole);
  //   console.log("propertyIndex at the beginning 2: ", propertyIndex);
  //   console.log("Return Index: ", returnIndex);
  // }, [LHS, RHS]);

  // if (selectedRole === "MANAGER") {
  //   console.log("Manager Selected");
  // } else {
  //   console.log("Owner Selected");
  // }

  // ENDPOINT CALLS IN PROPERTIES
  useEffect(() => {
    // console.log("In Properties Endpoint Call");
    const fetchData = async () => {
      setShowSpinner(true);

      // PROPERTIES ENDPOINT
      const property_response = await fetch(`${APIConfig.baseURL.dev}/properties/${profileId}`);
      //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000003`)
      if (!property_response.ok) {
        // console.log("Error fetching Property Details data");
      }
      const propertyData = await property_response.json();
      const propertyList = getPropertyList(propertyData); // This combines Properties with Applications and Maitenance Items to enable the LHS screen
      // console.log("In Properties > Property Endpoint: ", propertyList);
      setRawPropertyData(propertyData); // Sets rawPropertyData to be based into Edit Properties Function
      setPropertyList([...propertyList]);
      setDisplayedItems([...propertyList]);
      setPropertyIndex(0);

      // RENT ENDPOINT
      const rent_response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/${profileId}`);
      //const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/110-000003`);
      if (!rent_response.ok) {
        // console.log("Error fetching Rent Details data");
      }
      const rentResponse = await rent_response.json();
      // console.log("In Properties > Rent Endpoint: ", rentResponse.RentStatus.result);
      setAllRentStatus(rentResponse.RentStatus.result);

      // CONTRACTS ENDPOINT
      const contract_response = await fetch(`${APIConfig.baseURL.dev}/contracts/${profileId}`);
      // const response = await fetch(`${APIConfig.baseURL.dev}/contracts/600-000003`);
      if (!contract_response.ok) {
        // console.log("Error fetching Contract Details data");
      }
      const contractsResponse = await contract_response.json();
      // console.log("In Properties > Contract Endpoint: ", contractsResponse.result);
      setAllContracts(contractsResponse.result);
      // setPMRequests(contractsResponse.result);
      console.log("UnFiltered List: ", contractsResponse.result);
      console.log("Filtered List");
      console.log(
        "Filtered List: ",
        contractsResponse.result.filter((contract) => contract.contract_status !== "ACTIVE")
      );
      setPMRequests(contractsResponse.result.filter((contract) => contract.contract_status !== "ACTIVE"));

      if (propertyData.Property.code === 200 && rentResponse.RentStatus.code === 200 && contractsResponse.code === 200) {
        // console.log("Endpoint Data is Ready");
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
    setShowSpinner(false);
  }, []);

  console.log("PM Requests: ", pmRequests);

  function getPropertyList(data) {
    const propertyList = data["Property"]?.result;
    const applications = data["Applications"]?.result;
    const maintenance = data["MaintenanceRequests"]?.result;

    const appsMap = new Map();
    applications.forEach((a) => {
      const appsByProperty = appsMap.get(a.property_uid) || [];
      appsByProperty.push(a);
      appsMap.set(a.property_uid, appsByProperty);
    });

    const maintMap = new Map();
    if (maintenance) {
      maintenance.forEach((m) => {
        const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
        maintByProperty.push(m);
        maintMap.set(m.maintenance_property_id, maintByProperty);
      });
    }

    //   console.log(maintMap);
    return propertyList.map((p) => {
      p.applications = appsMap.get(p.property_uid) || [];
      p.applicationsCount = [...p.applications].filter((a) => ["NEW", "PROCESSING"].includes(a.lease_status)).length;
      p.maintenance = maintMap.get(p.property_uid) || [];
      p.maintenanceCount = [...p.maintenance].filter((m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING").length;
      // p.newContracts = contractsMap.get(p.property_uid) || [];
      // p.newContractsCount = [...p.newContracts].filter((m) => m.contract_status === "NEW").length;
      return p;
    });
  }

  const handleEditClick = (editPage) => {
    setPage(editPage);
    setRHS("EditProperty");
  };

  const handleListClick = (newData) => {
    // console.log("View leases New Data : ", newData);
    setReturnIndex(newData);
    // console.log("View leases RETURN INDEX : ", returnIndex);
  };

  const handleViewLeaseClick = () => {
    // setPage("ViewLease");
    // console.log("View leases before before: ", propertyList);  // Shows entire Property List with Appliances and Maintenance
    // console.log("View leases before before Index: ", propertyIndex);  // Shows the selected Property
    // console.log("View leases before: ", propertyList[propertyIndex]); // Shows the Property List details of the selected Property
    // console.log("View leases", propertyList[propertyIndex].lease_uid);  // Shows the specific Lease UID
    setRHS("ViewLease");
  };

  const handleAddPropertyClick = () => {
    // setPage("ViewLease");
    // console.log("View leases before before: ", propertyList);  // Shows entire Property List with Appliances and Maintenance
    // console.log("View leases before before Index: ", propertyIndex);  // Shows the selected Property
    // console.log("View leases before: ", propertyList[propertyIndex]); // Shows the Property List details of the selected Property
    // console.log("View leases", propertyList[propertyIndex].lease_uid);  // Shows the specific Lease UID
    setRHS("AddProperty");
  };

  const handleViewContractClick = () => {
    // setPage("ViewLease");
    // console.log("View Contract before before: ", propertyList);
    // console.log("View Contract before before Index: ", propertyIndex);
    // console.log("View Contract before: ", propertyList[propertyIndex]);
    // console.log("View Contract", propertyList[propertyIndex].contract_uid);
    setRHS("ViewContract");
  };

  const showNewContract = () => {
    setRHS("CreateContract");
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
              onAddPropertyClick={handleAddPropertyClick}
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
                onViewContractClick={handleViewContractClick}
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
            {RHS === "ViewLease" && (
              <ViewLease lease_id={propertyList[0].lease_uid} propertyList={propertyList} index={returnIndex} isDesktop={isDesktop} onBackClick={handleBackClick} />
            )}
            {RHS === "ViewContract" && <ViewManagementContract index={returnIndex} propertyList={propertyList} isDesktop={isDesktop} onBackClick={handleBackClick} />}
            {RHS === "Applications" && (
              <TenantApplicationNav index={applicationIndex} propertyIndex={returnIndex} property={propertyList[returnIndex]} isDesktop={isDesktop} onBackClick={handleBackClick} />
            )}
            {RHS === "AddProperty" && (
              <PropertyForm
                onBack={handleBackClick}
                // onSubmit={handleBackClick}
                onSubmit={showNewContract}
                property_endpoint_resp={rawPropertyData}
                setNewContractUID={setNewContractUID}
                setNewContractPropertyUID={setNewContractPropertyUID}
                // showNewContract={showNewContract}
              />
            )}
            {RHS === "CreateContract" && <ManagementContractDetails contractUID={newContractUID} contractPropertyUID={newContractPropertyUID} properties={rawPropertyData} />}
            {RHS === "PMRequests" && (
              <PMQuoteList
                onBack={handleBackClick}
                // onSubmit={handleBackClick}
                onSubmit={showNewContract}
                property_endpoint_resp={pmRequests}
                setNewContractUID={setNewContractUID}
                setNewContractPropertyUID={setNewContractPropertyUID}
                // showNewContract={showNewContract}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Properties;
