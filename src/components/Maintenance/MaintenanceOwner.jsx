import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  ThemeProvider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
  Container,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import theme from "../../theme/theme";
import MaintenanceStatusTable from "./MaintenanceStatusTable";
import MaintenanceRequestDetailNew from "./MaintenanceRequestDetailNew";
import SelectMonthComponent from "../SelectMonthComponent";
import SelectPropertyFilter from "../SelectPropertyFilter/SelectPropertyFilter";
import { useUser } from "../../contexts/UserContext";
import APIConfig from "../../utils/APIConfig";
import QuoteRequestForm from "./Manager/QuoteRequestForm";
import QuoteAcceptForm from "./Manager/QuoteAcceptForm";
import PayMaintenanceForm from "./Manager/PayMaintenanceForm";
import RescheduleMaintenance from "./Manager/RescheduleMaintenance";
import useSessionStorage from "./useSessionStorage";
import { useCookies, Cookies } from "react-cookie";
import AddMaintenanceItem from "./AddMaintenanceItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditMaintenanceItem from "./EditMaintenanceItem";

export async function maintenanceOwnerDataCollectAndProcess(setMaintenanceData, setShowSpinner, profileId) {
  const dataObject = {};

  const getMaintenanceData = async () => {
    setShowSpinner(true);
    const maintenanceRequests = await fetch(`${APIConfig.baseURL.dev}/maintenanceReq/${profileId}`);
    const maintenanceRequestsData = await maintenanceRequests.json();

    let array1 = maintenanceRequestsData.result["NEW REQUEST"].maintenance_items;
    let array2 = maintenanceRequestsData.result["INFO REQUESTED"].maintenance_items;
    let array3 = maintenanceRequestsData.result["PROCESSING"].maintenance_items;
    let array4 = maintenanceRequestsData.result["SCHEDULED"].maintenance_items;
    let array5 = maintenanceRequestsData.result["COMPLETED"].maintenance_items;
    let array6 = maintenanceRequestsData.result["CANCELLED"].maintenance_items;

    dataObject["NEW REQUEST"] = [];
    dataObject["INFO REQUESTED"] = [];
    dataObject["PROCESSING"] = [];
    dataObject["SCHEDULED"] = [];
    dataObject["COMPLETED"] = [];
    dataObject["CANCELLED"] = [];

    for (const item of array1) {
      dataObject["NEW REQUEST"].push(item);
    }
    for (const item of array2) {
      dataObject["INFO REQUESTED"].push(item);
    }
    for (const item of array3) {
      dataObject["PROCESSING"].push(item);
    }
    for (const item of array4) {
      dataObject["SCHEDULED"].push(item);
    }
    for (const item of array5) {
      dataObject["COMPLETED"].push(item);
    }
    for (const item of array6) {
      dataObject["CANCELLED"].push(item);
    }

    setMaintenanceData((prevData) => ({
      ...prevData,
      ...dataObject,
    }));

    setShowSpinner(false);
  };
  getMaintenanceData();
}

export function MaintenanceOwner() {
  const location = useLocation();
  let navigate = useNavigate();
  const { user, getProfileId } = useUser();
  const [maintenanceData, setMaintenanceData] = useState({});
  const [propertyId, setPropertyId] = useState("200-000029");
  const colorStatus = theme.colorStatusO;

  const [showSelectMonth, setShowSelectMonth] = useState(false);
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [filterPropertyList, setFilterPropertyList] = useState([]);

  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("NEW REQUEST");

  const businessId = user.businesses.MAINTENANCE.business_uid;
  const propertyIdFromPropertyDetail = location.state?.propertyId || null;
  let profileId = getProfileId();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [desktopView] = useSessionStorage("desktopView", false);
  const [cookies] = useCookies(["selectedRole"]);
  const selectedRole = cookies.selectedRole;
  const [quoteAcceptView] = useSessionStorage("quoteAcceptView", false);
  const [rescheduleView] = useSessionStorage("rescheduleView", false);
  const [payMaintenanceView] = useSessionStorage("payMaintenanceView", false);

  const [editMaintenanceView] = useSessionStorage("editMaintenanceView", false);
  const [showNewMaintenance, setshowNewMaintenance] = useState(false);

  const newDataObject = {};
  newDataObject["NEW REQUEST"] = [];
  newDataObject["INFO REQUESTED"] = [];
  newDataObject["PROCESSING"] = [];
  newDataObject["SCHEDULED"] = [];
  newDataObject["COMPLETED"] = [];
  newDataObject["CANCELLED"] = [];

  function navigateToAddMaintenanceItem() {
    if (isMobile) {
      navigate("/addMaintenanceItem", { state: { month, year, propertyId } });
    } else {
      setshowNewMaintenance(true);
    }
  }

  useEffect(() => {
    if (maintenanceData) {
      const propertyList = [];
      const addedAddresses = [];
      for (const key in maintenanceData) {
        for (const item of maintenanceData[key]) {
          if (!addedAddresses.includes(item.property_id)) {
            addedAddresses.push(item.property_id);
            if (!propertyList.includes(item.property_address)) {
              propertyList.push({
                property_uid: item.property_id,
                address: item.property_address + " " + item.property_unit,
                checked: true,
              });
            }
          }
        }
      }

      if (propertyIdFromPropertyDetail) {
        for (const property of propertyList) {
          if (property.property_uid !== propertyIdFromPropertyDetail) {
            property.checked = false;
          }
        }
      }

      setFilterPropertyList(propertyList);
    }
  }, [maintenanceData]);

  function convertToStandardFormat(monthName, year) {
    const months = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    return `${year}-${months[monthName]}`;
  }

  function handleFilter(maintenanceArray, month, year, filterPropertyList) {
    var filteredArray = [];

    if (month && year) {
      const filterFormatDate = convertToStandardFormat(month, year);
      for (const item of maintenanceArray) {
        if (item.maintenance_request_created_date.startsWith(filterFormatDate)) {
          filteredArray.push(item);
        }
      }
    } else {
      filteredArray = maintenanceArray;
    }

    if (filterPropertyList?.length > 0) {
      filteredArray = filteredArray.filter((item) => {
        for (const filterItem of filterPropertyList) {
          if (filterItem.property_uid === item.property_id && filterItem.checked) {
            return true;
          }
        }
        return false;
      });
    }

    return filteredArray;
  }

  function displayFilterString(month, year) {
    if (month && year) {
      return month + " " + year;
    } else {
      return "Last 30 Days";
    }
  }

  function displayPropertyFilterTitle(filterPropertyList) {
    var count = 0;
    var displayList = [];
    for (const item of filterPropertyList) {
      if (item.checked) {
        count++;
        displayList.push(item.address);
      }
    }
    if (count === filterPropertyList.length) {
      return "All Properties";
    } else if (count < 3) {
      return displayList.join(", ");
    } else {
      return "Selected " + count + " Properties";
    }
  }

  function clearFilters() {
    setMonth(null);
    setYear(null);
    setFilterPropertyList([]);
  }

  useEffect(() => {
    maintenanceOwnerDataCollectAndProcess(setMaintenanceData, setShowSpinner, profileId);
  }, []);

  useEffect(() => {
    const handleMaintenanceUpdate = () => {
      // Using a closure to capture the current profileId when the effect runs
      const currentProfileId = profileId;
      maintenanceOwnerDataCollectAndProcess(setMaintenanceData, setShowSpinner, currentProfileId);
    };

    window.addEventListener("maintenanceUpdate", handleMaintenanceUpdate);

    return () => {
      window.removeEventListener("maintenanceUpdate", handleMaintenanceUpdate);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleRowClick = (index, row) => {
    if (isMobile) {
      navigate(`/maintenance/detail`, {
        state: {
          maintenance_request_index: index,
          status: row.maintenance_status,
          maintenanceItemsForStatus: maintenanceData[row.maintenance_status],
          allMaintenanceData: maintenanceData,
        },
      });
    } else {
      // Save data to session storage
      sessionStorage.setItem("selectedRequestIndex", index);
      sessionStorage.setItem("selectedStatus", row.maintenance_status);
      sessionStorage.setItem("maintenanceItemsForStatus", JSON.stringify(maintenanceData[row.maintenance_status]));
      sessionStorage.setItem("allMaintenanceData", JSON.stringify(maintenanceData));

      setSelectedRequestIndex(index);
      setSelectedStatus(row.maintenance_status);

      // Trigger the custom event
      window.dispatchEvent(new Event("maintenanceRequestSelected"));
    }
  };

  const handleBackButton = () => {
    const { fromProperty, index } = location.state;
    if (location.state && fromProperty === true) {
      // navigate('/properties', { state: { index } }); - PM CHanged
      navigate("/propertiesPM", { state: { index } });
    } else {
      navigate(-1); // Fallback to default behavior if onBack is not provided
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
        <Grid container sx={{ padding: "10px" }}>
          <Grid
            item
            xs={12}
            sm={5}
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <Paper
              style={{
                margin: "5px",
                backgroundColor: theme.palette.primary.main,
                width: "95%",
                paddingTop: "10px",
                paddingBottom: "30px",
              }}
            >
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                sx={{
                  paddingBottom: "20px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <Box component='span' display='flex' justifyContent='flex-start' alignItems='flex-start' position='relative'>
                  <Button onClick={handleBackButton}>
                    <ArrowBackIcon
                      sx={{
                        color: theme.typography.common.blue,
                        fontSize: "30px",
                        margin: "5px",
                      }}
                    />
                  </Button>
                </Box>
                <Box component='span' display='flex' justifyContent='center' alignItems='center' position='relative' flex={1}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                    }}
                  >
                    Maintenance
                  </Typography>
                </Box>
                <Box position='relative' display='flex' justifyContent='flex-end' alignItems='center'>
                  <Button onClick={() => navigateToAddMaintenanceItem()} id='addMaintenanceButton'>
                    <AddIcon
                      sx={{
                        color: theme.typography.common.blue,
                        fontSize: "30px",
                        margin: "5px",
                      }}
                    />
                  </Button>
                </Box>
              </Stack>
              <Box component='span' m={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Button sx={{ textTransform: "capitalize" }} onClick={() => setShowSelectMonth(true)}>
                  <CalendarTodayIcon
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: theme.typography.smallFont,
                      margin: "5px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: theme.typography.smallFont,
                    }}
                  >
                    {displayFilterString(month, year)}
                  </Typography>
                </Button>
                <Button sx={{ textTransform: "capitalize" }} onClick={() => setShowPropertyFilter(true)}>
                  <HomeWorkIcon
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: theme.typography.smallFont,
                      margin: "5px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: theme.typography.smallFont,
                    }}
                  >
                    {displayPropertyFilterTitle(filterPropertyList)}
                  </Typography>
                </Button>

                <SelectMonthComponent
                  month={month}
                  showSelectMonth={showSelectMonth}
                  setShowSelectMonth={setShowSelectMonth}
                  setMonth={setMonth}
                  setYear={setYear}
                ></SelectMonthComponent>
                <SelectPropertyFilter
                  showPropertyFilter={showPropertyFilter}
                  setShowPropertyFilter={setShowPropertyFilter}
                  filterList={filterPropertyList}
                  setFilterList={setFilterPropertyList}
                />
              </Box>

              <div
                style={{
                  borderRadius: "10px",

                  margin: "20px",
                }}
              >
                {colorStatus.map((item, index) => {
                  let mappingKey = item.mapping;

                  let maintenanceArray = maintenanceData[mappingKey] || [];

                  let filteredArray = handleFilter(maintenanceArray, month, year, filterPropertyList);

                  for (const item of filteredArray) {
                    newDataObject[mappingKey].push(item);
                  }

                  return (
                    <MaintenanceStatusTable
                      key={index}
                      status={item.status}
                      color={item.color}
                      maintenanceItemsForStatus={filteredArray}
                      allMaintenanceData={maintenanceData}
                      maintenanceRequestsCount={maintenanceArray}
                      onRowClick={handleRowClick}
                    />
                  );
                })}
              </div>
            </Paper>
          </Grid>

          {!isMobile && (
            <Grid item xs={7}>
              {editMaintenanceView && selectedRole === "OWNER" ? (
                <EditMaintenanceItem />
              ) : showNewMaintenance && selectedRole === "OWNER" ? (
                <AddMaintenanceItem onBack={() => setshowNewMaintenance(false)} />
              ) : desktopView && selectedRole === "OWNER" ? (
                <>
                  <QuoteRequestForm maintenanceItem={JSON.parse(sessionStorage.getItem("maintenanceItem"))} navigateParams={JSON.parse(sessionStorage.getItem("navigateParams"))} />
                </>
              ) : quoteAcceptView && selectedRole === "OWNER" ? (
                <>
                  <QuoteAcceptForm maintenanceItem={JSON.parse(sessionStorage.getItem("maintenanceItem"))} navigateParams={JSON.parse(sessionStorage.getItem("navigateParams"))} />
                </>
              ) : rescheduleView && selectedRole === "OWNER" ? (
                <>
                  <RescheduleMaintenance
                    maintenanceItem={JSON.parse(sessionStorage.getItem("maintenanceItem"))}
                    navigateParams={JSON.parse(sessionStorage.getItem("navigateParams"))}
                    quotes={JSON.parse(sessionStorage.getItem("quotes"))}
                  />
                </>
              ) : payMaintenanceView && selectedRole === "OWNER" ? (
                <>
                  <PayMaintenanceForm
                    maintenanceItem={JSON.parse(sessionStorage.getItem("maintenanceItem"))}
                    navigateParams={JSON.parse(sessionStorage.getItem("navigateParams"))}
                  />
                </>
              ) : (
                Object.keys(maintenanceData).length > 0 && (
                  <MaintenanceRequestDetailNew
                    maintenance_request_index={selectedRequestIndex}
                    status={selectedStatus}
                    maintenanceItemsForStatus={maintenanceData[selectedStatus]}
                    allMaintenanceData={newDataObject}
                  />
                )
              )}
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
