import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  ThemeProvider,
  Form,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Input,
  Container,
  Radio,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  UploadFile,
  InputAdornment,
  InputBase,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
  ListItemText,
  ListItem,
  List,
  Avatar,
  Badge,
} from "@mui/material";

import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import propertyImage from "./propertyImage.png";
import maintenanceIcon from "./maintenanceIcon.png";
import samplePropertyData from "./samplePropertyData";
import { useUser } from "../../contexts/UserContext";
import { get } from "../utils/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import PropertyDetail from "./PropertyDetail";
import PropertyDetail2 from "./PropertyDetail2";
import PMRent from "../Rent/PMRent/PMRent";

const SearchBar = ({ propertyList, setFilteredItems }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.trim() === "") {
      setFilteredItems(propertyList);
    } else {
      const terms = query.split(" ").map((term) => term.toLowerCase());
      const filtered = propertyList.filter((item) =>
        terms.every((term) =>
          (item.property_address + item.property_unit + item.property_city + item.property_state + item.property_zip)
            .toLowerCase()
            .includes(term)
        )
      );
      setFilteredItems(filtered);
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
    p.applicationsCount = [...p.applications].filter((a) =>
      ["NEW", "PROCESSING"].includes(a.lease_status)
    ).length;
    p.maintenance = maintMap.get(p.property_uid) || [];
    p.maintenanceCount = [...p.maintenance].filter(
      (m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING"
    ).length;
    return p;
  });
}

export default function ForPropertyList({}) {
  let navigate = useNavigate();
  const { getProfileId, isManagement, isOwner } = useUser();
  const [propertyList, setPropertyList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [rawPropertyData, setRawPropertyData] = useState([]);
  const profileId = getProfileId();
  const [citySortOrder, setCitySortOrder] = useState("asc");
  const [stateSortOrder, setStateSortOrder] = useState("asc");
  const [addressSortOrder, setAddressSortOrder] = useState("asc");
  const [statusSortOrder, setStatusSortOrder] = useState("asc");
  const [zipSortOrder, setZipSortOrder] = useState("asc");
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [allRentStatus, setAllRentStatus] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 950);
  const [dataReady, setDataReady] = useState(false);
  const { selectedRole } = useUser();

  function numberOfMaintenanceItems(maintenanceItems) {
    if (maintenanceItems && maintenanceItems.length > 0) {
      return maintenanceItems.filter((mi) => !!mi.maintenance_request_uid).length;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      const response = await fetch(`${APIConfig.baseURL.dev}/properties/${profileId}`);
      const propertyData = await response.json();
      const propertyList = getPropertyList(propertyData);
      setRawPropertyData(propertyData);
      setPropertyList([...propertyList]);
      setDisplayedItems([...propertyList]);
      const propertyRent = await propertyRentDetails();
      setAllRentStatus(propertyRent.RentStatus.result);
      if (propertyData.Property.code == 200 && propertyRent.RentStatus.code == 200) {
        setDataReady(true);
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

  const propertyRentDetails = async () => {
    try {
      const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/${getProfileId()}`);
      const rentResponse = await response.json();
      return rentResponse;
    } catch (error) {
      console.error("Failed to fetch rent details:", error);
    }
  };

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
        return -1;
      } else if (property2.rent_status === "NO MANAGER") {
        return 1;
      } else {
        return property1.rent_status.localeCompare(property2.rent_status);
      }
    });
    setDisplayedItems(statusSortOrder === "asc" ? items : items.reverse());
    setStatusSortOrder(statusSortOrder === "asc" ? "desc" : "asc");
  }

  function handlePropertyDetailNavigation(index, propertyList) {
    setPropertyIndex(index);
    if (!isDesktop) {
      navigate(`/propertyDetail`, {
        state: { index, propertyList: displayedItems, allRentStatus, rawPropertyData, isDesktop },
      });
    }
  }

  function getNumOfMaintenanceReqs(property) {
    return property?.maintenanceCount ?? 0;
  }

  function getNumOfApplications(property) {
    return property.applicationsCount ?? 0;
  }

  function getCoverPhoto(property) {
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
            margin: "0px",
            padding: "0px",
            textAlign: "center",
            verticalAlign: "middle",
            alignItems: "center",
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
            margin: "0px",
            padding: "0px",
            textAlign: "center",
            verticalAlign: "middle",
            alignItems: "center",
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
    console.log("Clicked property index:", i);
    setPropertyIndex(i); 
    handlePropertyDetailNavigation(i, displayedItems);
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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        {showSpinner || !dataReady ? (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12} md={propertyList.length > 0 && isDesktop ? 4 : 12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Paper
                  sx={{
                    marginTop: "10px",
                    backgroundColor: theme.palette.primary.main,
                    width: "100%",
                    maxWidth: "800px",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ padding: theme.spacing(2), position: "relative" }}
                  >
                    <Box sx={{ flex: 1 }} />
                    <Box position="absolute" left="50%" sx={{ transform: "translateX(-50%)" }}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.primary.fontWeight,
                          fontSize: theme.typography.largeFont,
                        }}
                      >
                        All Properties
                      </Typography>
                    </Box>
                    <Button
                      position="absolute"
                      right={0}
                      sx={{ "&:hover, &:focus, &:active": { background: theme.palette.primary.main } }}
                      onClick={() =>
                        navigate("/addProperty", {
                          state: {
                            property_endpoint_resp: rawPropertyData,
                          },
                        })
                      }
                    >
                      <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
                    </Button>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0px 10px",
                      }}
                    >
                      <Button
                        onClick={sortByZip}
                        sx={{
                          background: "#3D5CAC",
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                          cursor: "pointer",
                          textTransform: "none",
                          minWidth: "100px",
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
                          minWidth: "100px",
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
                          minWidth: "100px",
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
                            bgcolor: theme.palette.form.main,
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
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}

