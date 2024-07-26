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
import PropertyDetail from "./PropertyDetail";
import PropertyDetail2 from "./PropertyDetail2";
// import PMRent from "../Rent/PMRent/PMRent";
import PropertyForm from "../Property/PropertyForm";
//import SearchManager from "./Property/SearchManager";

const SearchBar = ({ propertyList, setFilteredItems }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.trim() === "") {
      setFilteredItems(propertyList); // Reset to the original list if the search bar is cleared
    } else {
      const terms = query.split(" ").map((term) => term.toLowerCase()); // Split the search term into individual terms
      const filtered = propertyList.filter((item) =>
        terms.every((term) => (item.property_address + item.property_unit + item.property_city + item.property_state + item.property_zip).toLowerCase().includes(term))
      );
      setFilteredItems(filtered); // Updating the state with filtered items
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredItems(propertyList);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        alignItems: "center",
        backgroundColor: theme.palette.form.main,
        display: "flex",
      }}
    >
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, zIndex: 1000, flexGrow: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
        value={searchTerm}
        onChange={handleSearchChange}
        color={theme.typography.common.blue}
      />
      {searchTerm && (
        <IconButton aria-label="clear" onClick={clearSearch}>
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
};

const paymentStatusColorMap = {
  "Paid On Time": theme.palette.priority.clear,
  "Partially Paid": theme.palette.priority.medium,
  "Paid Late": theme.palette.priority.low,
  "Not Paid": theme.palette.priority.high,
  Vacant: "#160449",
  "No Manager": theme.palette.priority.low,
};

const paymentStatusMap = {
  UNPAID: "Not Paid",
  "PAID LATE": "Paid Late",
  PAID: "Paid On Time",
  Partial: "Partially Paid",
  VACANT: "Vacant",
  "NO MANAGER": "No Manager",
};

function getPaymentStatusColor(paymentStatus) {
  if (paymentStatus === null || paymentStatus === undefined) {
    return paymentStatusColorMap["Vacant"];
  } else {
    const status = paymentStatusMap[paymentStatus];
    return paymentStatusColorMap[status];
  }
}

function getPaymentStatus(paymentStatus) {
  if (paymentStatus === null || paymentStatus === undefined) {
    return paymentStatusMap["VACANT"];
  } else {
    const status = paymentStatusMap[paymentStatus];
    return status;
  }
}

// This function maps the applications and maintenance items into the Property List
function getPropertyList(data) {
  const propertyList = data["Property"].result;
  const applications = data["Applications"].result;
  const maintenance = data["MaintenanceRequests"].result;
  //   const newContracts = data["NewPMRequests"].result;
  //   console.log(maintenance);

  const appsMap = new Map();
  applications.forEach((a) => {
    const appsByProperty = appsMap.get(a.property_uid) || [];
    appsByProperty.push(a);
    appsMap.set(a.property_uid, appsByProperty);
  });

  const maintMap = new Map();
  maintenance.forEach((m) => {
    // console.log("before", m);
    const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
    maintByProperty.push(m);
    // console.log("after", maintByProperty);
    maintMap.set(m.maintenance_property_id, maintByProperty);
  });

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
    // console.log("P:", p);
    // console.log("P:", p.applications);
    // console.log("P:", p.applicationsCount);
    return p;
  });
}

export default function PropertyList({}) {
  console.log("In Property List");
  let navigate = useNavigate();
  const { getProfileId, isManagement, isOwner } = useUser();
  const [propertyList, setPropertyList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  // const [maintenanceData, setMaintenanceData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  //   const [contracts, setContracts] = useState([]);
  //   const [activeContracts, setActiveContracts] = useState([]);
  const [rawPropertyData, setRawPropertyData] = useState([]);
  const profileId = getProfileId();
  const [citySortOrder, setCitySortOrder] = useState("asc");
  const [stateSortOrder, setStateSortOrder] = useState("asc");
  const [addressSortOrder, setAddressSortOrder] = useState("asc");
  const [statusSortOrder, setStatusSortOrder] = useState("asc");
  const [zipSortOrder, setZipSortOrder] = useState("asc");
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [allRentStatus, setAllRentStatus] = useState([]);
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 950);
  const [dataReady, setDataReady] = useState(false);
  const [isFromRentWidget, setFromRentWidget] = useState(false);
  const { selectedRole } = useUser();
  // console.log("getProfileId information", getProfileId());
  const [showPropertyForm, setShowPropertyForm] = useState(location.state?.showPropertyForm || false);
  const [showRentForm, setShowRentForm] = useState(location.state?.showRentForm || false);
  const [allContracts, setAllContracts] = useState([]); 

  function numberOfMaintenanceItems(maintenanceItems) {
    console.log(maintenanceItems);
    if (maintenanceItems && maintenanceItems.length > 0) {
      return maintenanceItems.filter((mi) => !!mi.maintenance_request_uid).length;
    } else {
      return 0;
    }
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
      console.log("In Property List >> Property Data: ", propertyData); // This has Applications, MaintenanceRequests, NewPMRequests and Property info from endpoint
      const propertyList = getPropertyList(propertyData);
      // console.log("In Property List >> Property List: ", propertyList);
      // console.log("Testing Property Data", propertyData.Property.result);
      setRawPropertyData(propertyData);
      console.log("New Set PM Requests: ", rawPropertyData);

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
      if (propertyData.Property.code == 200 && propertyRent.RentStatus.code == 200) {
        setDataReady(true);
      }
      if (selectedRole == "MANAGER" && sessionStorage.getItem("isrent") == "true") {
        setFromRentWidget(true);
      } else {
        setFromRentWidget(false);
        sessionStorage.removeItem("isrent");
      }
    };
    fetchData();
    // Check screen size on initial load
    handleResize();
    setShowSpinner(false);
    // Optionally, add a resize event listener
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(()=>{
    const getContractsForOwner = async () => {
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
        // const response = await fetch(`${APIConfig.baseURL.dev}/contracts/600-000003`);
        if (!response.ok) {
          console.log('Error fetching contracts data');
        }
        const contractsResponse = await response.json();
        console.log('contractsResponse--', contractsResponse.result);
        await setAllContracts(contractsResponse.result);
      } catch (error) {
        console.log(error);
      }
    };
    getContractsForOwner();
  }, [])

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

  //   useEffect(() => {
  //     const getContractsForOwner = async () => {
  //       try {
  //         const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`);
  //         if (!response.ok) {
  //           console.log("Error fetching contracts data");
  //         }
  //         const contractsResponse = await response.json();
  //         // console.log("contractsResponse", contractsResponse.result)
  //         setContracts(contractsResponse.result);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getContractsForOwner();
  //   }, []);

  function sortByCity() {
    let items = [...displayedItems];
    items.sort((property1, property2) => property1.property_city.localeCompare(property2.property_city));
    setDisplayedItems(citySortOrder === "asc" ? items : items.reverse());
    setCitySortOrder(citySortOrder === "asc" ? "desc" : "asc");
  }

  function sortByAddress() {
    let items = [...displayedItems];
    items.sort((property1, property2) => property1.property_address.localeCompare(property2.property_address));
    setDisplayedItems(addressSortOrder === "asc" ? items : items.reverse());
    setAddressSortOrder(addressSortOrder === "asc" ? "desc" : "asc");
  }

  function sortByState() {
    let items = [...displayedItems];
    items.sort((property1, property2) => property1.property_state.localeCompare(property2.property_state));
    setDisplayedItems(stateSortOrder === "asc" ? items : items.reverse());
    setStateSortOrder(stateSortOrder === "asc" ? "desc" : "asc");
  }

  function sortByZip() {
    let items = [...displayedItems];
    items.sort((property1, property2) => property1.property_zip - property2.property_zip);
    setDisplayedItems(zipSortOrder === "asc" ? items : items.reverse());
    setZipSortOrder(zipSortOrder === "asc" ? "desc" : "asc");
  }

  function sortByStatus() {
    let items = [...displayedItems];
    items.sort((property1, property2) => {
      if (property1.rent_status === "NO MANAGER") {
        return -1; // Property1 comes first
      } else if (property2.rent_status === "NO MANAGER") {
        return 1; // Property2 comes first
      } else {
        return property1.rent_status.localeCompare(property2.rent_status);
      }
    });
    setDisplayedItems(statusSortOrder === "asc" ? items : items.reverse());
    setStatusSortOrder(statusSortOrder === "asc" ? "desc" : "asc");
  }

  function handlePropertyDetailNavigation(index, propertyList) {
    console.log("In Property List >> Index: ", index);
    console.log("In Property List >> propertyList: ", propertyList);
    // console.log("theoretically property", property)
    // console.log("handlePropertyDetailNavigation");
    // navigate(`/propertyDetail`, { state: { index, propertyList, contracts } });
    // setPropertyIndex(index);
    if (!isDesktop) {
      navigate(`/propertyDetail`, { state: { index, propertyList: displayedItems, allRentStatus, rawPropertyData: rawPropertyData, isDesktop } });
    }
  }

  function getBadgeContent(property) {
    return property?.num_open_maintenace_req ?? 0;
  }

  function getNumOfMaintenanceReqs(property) {
    return property?.maintenanceCount ?? 0;
  }

  function getNumOfApplications(property) {
    return property.applicationsCount ?? 0;
  }

  function getCoverPhoto(property) {
    // console.log("In Property List >> In getCoverPhoto");
    // console.log(property.property_images);
    const imageArray = JSON.parse(property.property_images);
    if (property.property_favorite_image) {
      const index = imageArray.findIndex((image) => image === property.property_favorite_image);
      if (index !== -1) {
        return property.property_favorite_image;
      } else {
        return propertyImage;
      }
    } else if (imageArray.length !== 0) {
      return imageArray[0];
    } else {
      return propertyImage;
    }
  }

  function displayAddress(property) {
    if (property.property_unit !== "") {
      return (
        <Typography
          sx={{
            color: theme.typography.common.blue,
            fontWeight: theme.typography.primary.fontWeight,
            fontSize: "11px",
            margin: "0px", // Ensure no margin
            padding: "0px", // Ensure no padding
            textAlign: "center", // Ensure text is centered within itself
            verticalAlign: "middle", // Vertically align text in the middle
            alignItems: "center", // vertically align items to the center
          }}
        >
          {property.property_address} #{property.property_unit}
          <br />
          {property.property_city + " " + property.property_state + " " + property.property_zip}
        </Typography>
      );
    } else {
      return (
        <Typography
          sx={{
            color: theme.typography.common.blue,
            fontWeight: theme.typography.primary.fontWeight,
            fontSize: "11px",
            margin: "0px", // Ensure no margin
            padding: "0px", // Ensure no padding
            textAlign: "center", // Ensure text is centered within itself
            verticalAlign: "middle", // Vertically align text in the middle
            alignItems: "center", // vertically align items to the center
          }}
        >
          {property.property_address} <br />
          {property.property_city + " " + property.property_state + " " + property.property_zip}
        </Typography>
      );
    }
  }

  const columns = [
    {
      field: "avatar",
      headerName: "",
      flex: 0.4,
      renderCell: (params) => (
        <Avatar
          src={`${getCoverPhoto(params.row)}?${Date.now()}`}
          alt="property image"
          sx={{
            borderRadius: "0",
            width: "60px",
            height: "60px",
            margin: "0px",
            padding: "0px",
          }}
        />
      ),
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => displayAddress(params.row),
    },
    {
      field: "paymentStatus",
      headerName: "Status",
      headerAlign: "center",
      flex: 0.6,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: getPaymentStatusColor(params.row.rent_status),
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            border: "none",
            margin: "0px",
          }}
        >
          <Badge
            overlap="circular"
            color="success"
            badgeContent={getNumOfApplications(params.row)}
            invisible={!getNumOfApplications(params.row)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            style={{
              color: "#000000",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: "11px",
                margin: "0px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
              }}
            >
              {getPaymentStatus(params.row.rent_status)}
            </Typography>
          </Badge>
        </Box>
      ),
    },
    {
      field: "maintenanceIcon",
      headerName: "Issues",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        const numOfMaintenanceReqs = getNumOfMaintenanceReqs(params.row);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Badge
              overlap="circular"
              color="error"
              badgeContent={numOfMaintenanceReqs}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                color: "#000000",
              }}
              onClick={(e) => {
                //console.log('selected in', params)
                if (numOfMaintenanceReqs > 0) {
                  if (selectedRole === "OWNER") {
                    navigate("/ownerMaintenance", {
                      state: {
                        fromProperty: true,
                        index: params.id,
                        propertyId: displayedItems[params.id].property_uid,
                      },
                    });
                  } else {
                    navigate("/managerMaintenance", {
                      state: {
                        fromProperty: true,
                        index: params.id,
                        propertyId: displayedItems[params.id].property_uid,
                      },
                    });
                  }
                }
              }}
            >
              <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "35px", height: "35px" }} />
            </Badge>
          </Box>
        );
      },
    },
  ];

  function convertDataToRows(displayedItems) {
    return displayedItems.map((property, index) => ({
      id: index,
      ...property,
    }));
  }

  const rows = convertDataToRows(displayedItems);

  const onPropertyClick = (params) => {
    const property = params.row;
    const i = displayedItems.findIndex((p) => p.property_uid === property.property_uid);
    console.log("List Item Clicked", property, i, displayedItems);
    handlePropertyDetailNavigation(i, displayedItems);
  };

  const onPropertyInRentWidgetClicked = (property_uid) => {
    const i = displayedItems.findIndex((p) => p.property_uid === property_uid);
    console.log("onPropertyInRentWidgetClicked Clicked", i, displayedItems);
    setPropertyIndex(i);
  };

  const handleResize = () => {
    if (window.innerWidth >= 950) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  };

  const getRowSpacing = React.useCallback((params) => {
    return {
      top: params.isFirstVisible ? 0 : 3,
      bottom: params.isLastVisible ? 0 : 3,
    };
  });

  const handleFormSubmit = () => {
    // Logic to fetch the property list again, if needed
    setShowPropertyForm(false);
    window.location.reload();
    // reload or refresh the property list here if necessary
  };

  const handleFormBack = () => {
    if (propertyList.length > 0) {
      setShowPropertyForm(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        {showSpinner || !dataReady ? (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Grid container spacing={4}>
            {showRentForm === true ? (
              <Grid item xs={12} md={4}>
                {/* <PMRent onPropertyInRentWidgetClicked={onPropertyInRentWidgetClicked} /> */}
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  All Properties Legend
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12} md={propertyList.length >= 0 && isDesktop ? 4 : 12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%", // Take up full screen width
                    // minHeight: "100vh", // Set the Box height to full height
                    height: "100%",
                  }}
                >
                  <Paper
                    sx={{
                      marginTop: "10px",
                      backgroundColor: theme.palette.primary.main,
                      width: "100%", // Occupy full width with 25px margins on each side
                      maxWidth: "800px", // You can set a maxWidth if needed
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: theme.spacing(2), position: "relative" }}>
                      <Box sx={{ flex: 1 }} />
                      <Box position="absolute" left="50%" sx={{ transform: "translateX(-50%)" }}>
                        <Typography
                          sx={{
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.largeFont,
                          }}
                        >
                          All Properties List
                        </Typography>
                      </Box>
                      <Button
                        position="absolute"
                        right={0}
                        sx={{ "&:hover, &:focus, &:active": { background: theme.palette.primary.main } }}
                        onClick={() => setShowPropertyForm(true)}
                      >
                        <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
                      </Button>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "relative" }}>
                      {/* New Buttons */}
                      <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "0px 10px" }}>
                        <Button
                          onClick={sortByZip}
                          sx={{
                            background: "#3D5CAC",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            cursor: "pointer",
                            textTransform: "none",
                            minWidth: "100px", // Fixed width for the button
                            minHeight: "35px",
                          }}
                          size="small"
                        >
                          Zip
                        </Button>
                        <Button
                          onClick={sortByAddress}
                          variant="outlined"
                          sx={{
                            background: "#3D5CAC",
                            color: theme.palette.background.default,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            cursor: "pointer",
                            textTransform: "none",
                            minWidth: "100px", // Fixed width for the button
                            minHeight: "35px",
                          }}
                          size="small"
                        >
                          Address
                        </Button>
                        <Button
                          onClick={sortByStatus}
                          sx={{
                            background: "#3D5CAC",
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            cursor: "pointer",
                            textTransform: "none",
                            minWidth: "100px", // Fixed width for the button
                            minHeight: "35px",
                          }}
                          size="small"
                        >
                          Rent Status
                        </Button>
                      </Box>
                    </Stack>
                    <Box sx={{ padding: "10px" }}>
                      <SearchBar propertyList={propertyList} setFilteredItems={setDisplayedItems} sx={{ width: "100%" }} />
                      <Box sx={{ marginTop: "20px" }}>
                        <DataGrid
                          getRowHeight={() => "auto"}
                          rows={rows}
                          columns={columns}
                          autoHeight
                          pageSizeOptions={[15]}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 15,
                              },
                            },
                          }}
                          onRowClick={onPropertyClick}
                          rowSelectionModel={[propertyIndex]}
                          onRowSelectionModelChange={(newSelection) => {
                            if (newSelection.length > 0) {
                              setPropertyIndex(newSelection[0]);
                            }
                          }}
                          getRowSpacing={getRowSpacing}
                          sx={{
                            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": { display: "none" },
                            "& .MuiDataGrid-row:hover": {
                              cursor: "pointer",
                            },
                            "& .MuiDataGrid-cell": {
                              padding: "0px",
                              margin: "0px",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                            "& .MuiDataGrid-row.Mui-selected": {
                              backgroundColor: "#949494",
                            },
                            [`& .${gridClasses.row}`]: {
                              bgcolor: theme.palette.form.main, // Row background color
                              "&:before": {
                                content: '""',
                                display: "block",
                                height: "100%",
                                backgroundColor: "#ffffff",
                                position: "absolute",
                                left: "0",
                                right: "0",
                                zIndex: "-1",
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            )}
            {propertyList.length >= 0 && allRentStatus.length >= 0 && isDesktop === true && (
              <Grid item xs={12} md={8}>
              {showPropertyForm ? (
                <PropertyForm onBack={handleFormBack} onSubmit={handleFormSubmit} property_endpoint_resp={rawPropertyData} />
              ) : (
                <PropertyDetail2 index={propertyIndex} propertyList={displayedItems} allRentStatus={allRentStatus} isDesktop={isDesktop} allContracts={allContracts}/>
              )}
            </Grid>
              
            )}
          </Grid>)}
      </Container>
    </ThemeProvider>
  );
}

export { SearchBar, getPaymentStatusColor, getPaymentStatus };
