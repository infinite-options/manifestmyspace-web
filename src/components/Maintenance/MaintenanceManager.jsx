import { Typography, Box, Stack, Paper, Button, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import MaintenanceStatusTable from "./MaintenanceStatusTable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import SelectMonthComponent from "../SelectMonthComponent";
import SelectPropertyFilter from "../SelectPropertyFilter/SelectPropertyFilter";
import CloseIcon from "@mui/icons-material/Close";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export async function maintenanceManagerDataCollectAndProcess(setMaintenanceData, setShowSpinner, setDisplayMaintenanceData, profileId) {
  const dataObject = {};

  function dedupeQuotes(array) {
    // we want to find all the quotes that have the same maintenance_request_uid

    const mapping = {};
    const dedupeArray = [];

    for (const item of array) {
      if (!mapping[item.maintenance_request_uid]) {
        mapping[item.maintenance_request_uid] = [];
      }
      mapping[item.maintenance_request_uid].push(item);
    }

    for (const key in mapping) {
      if (mapping[key].length > 0) {
        const quotes = [];
        for (const item of mapping[key]) {
          const keys = Object.keys(item).filter((key) => key.startsWith("quote_"));
          const quoteObject = {};
          for (const key of keys) {
            quoteObject[key] = item[key];
          }
          quotes.push(quoteObject);
        }
        // console.log("quotes", quotes)

        mapping[key][0].quotes = quotes;
        // delete all keys that start with quote_
        const keysToDelete = Object.keys(mapping[key][0]).filter((key) => key.startsWith("quote_"));
        // console.log(keysToDelete)
        keysToDelete.forEach((e) => delete mapping[key][0][e]);
        for (const keyToDelete in keysToDelete) {
          delete mapping[key][0][keyToDelete];
        }
        dedupeArray.push(mapping[key][0]);
      }
    }
    return dedupeArray;
  }

  const getMaintenanceData = async () => {
    // Returns colors and Maintenenace Requests sorted into different catergories
    console.log("In MaintenanceManager >> getMaintenanceData before maintenanceStatus endpoint call");
    setShowSpinner(true);

    const maintenanceRequests = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceStatus/${profileId}`); // Change back to ${getProfileId()}
    const maintenanceRequestsData = await maintenanceRequests.json();

    console.log("[DEBUG] Data returned from maintenanceStatus endpoint:", maintenanceRequestsData);

    if (profileId.startsWith("600")) {
      // maintenanceDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, propertyId)
      // console.log("Manager ID. and we need to return maintenance that is properly parsed")
      console.log("Manager selected");

      let array1 = maintenanceRequestsData.result["NEW REQUEST"].maintenance_items;
      let array2 = dedupeQuotes(maintenanceRequestsData.result["QUOTES REQUESTED"].maintenance_items);
      let array3 = maintenanceRequestsData.result["QUOTES ACCEPTED"].maintenance_items;
      let array4 = maintenanceRequestsData.result["SCHEDULED"].maintenance_items;
      let array5 = maintenanceRequestsData.result["COMPLETED"].maintenance_items;
      let array6 = maintenanceRequestsData.result["PAID"].maintenance_items;

      dataObject["NEW REQUEST"] = [];
      dataObject["QUOTES REQUESTED"] = [];
      dataObject["QUOTES ACCEPTED"] = [];
      dataObject["SCHEDULED"] = [];
      dataObject["COMPLETED"] = [];
      dataObject["PAID"] = [];

      for (const item of array1) {
        // console.log(item.maintenance_request_uid)
        dataObject["NEW REQUEST"].push(item);
      }
      for (const item of array2) {
        dataObject["QUOTES REQUESTED"].push(item);
      }
      for (const item of array3) {
        dataObject["QUOTES ACCEPTED"].push(item);
      }
      for (const item of array4) {
        dataObject["SCHEDULED"].push(item);
      }
      for (const item of array5) {
        dataObject["COMPLETED"].push(item);
      }
      for (const item of array6) {
        dataObject["PAID"].push(item);
      }
    } else if (profileId.startsWith("110")) {
      // maintenanceDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, propertyId)
      // console.log("Manager ID. and we need to return maintenance that is properly parsed")
      console.log("Owner selected");
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
        // console.log(item.maintenance_request_uid)
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
    }

    // let array1 = maintenanceRequestsData.result["NEW REQUEST"].maintenance_items;
    // let array2 = dedupeQuotes(maintenanceRequestsData.result["QUOTES REQUESTED"].maintenance_items);
    // let array3 = maintenanceRequestsData.result["QUOTES ACCEPTED"].maintenance_items;
    // let array4 = maintenanceRequestsData.result["SCHEDULED"].maintenance_items;
    // let array5 = maintenanceRequestsData.result["COMPLETED"].maintenance_items;
    // let array6 = maintenanceRequestsData.result["PAID"].maintenance_items;

    // dataObject["NEW REQUEST"] = [];
    // dataObject["QUOTES REQUESTED"] = [];
    // dataObject["QUOTES ACCEPTED"] = [];
    // dataObject["SCHEDULED"] = [];
    // dataObject["COMPLETED"] = [];
    // dataObject["PAID"] = [];

    // for (const item of array1) {
    //   // console.log(item.maintenance_request_uid)
    //   dataObject["NEW REQUEST"].push(item);
    // }
    // for (const item of array2) {
    //   dataObject["QUOTES REQUESTED"].push(item);
    // }
    // for (const item of array3) {
    //   dataObject["QUOTES ACCEPTED"].push(item);
    // }
    // for (const item of array4) {
    //   dataObject["SCHEDULED"].push(item);
    // }
    // for (const item of array5) {
    //   dataObject["COMPLETED"].push(item);
    // }
    // for (const item of array6) {
    //   dataObject["PAID"].push(item);
    // }

    setMaintenanceData((prevData) => ({
      ...prevData,
      ...dataObject,
    }));
    setDisplayMaintenanceData((prevData) => ({
      ...prevData,
      ...dataObject,
    }));
    setShowSpinner(false);
  };
  getMaintenanceData();
}

export default function MaintenanceManager() {
  console.log("In MaintenanceManager");
  const location = useLocation();
  let navigate = useNavigate();
  const { user, getProfileId } = useUser();
  const [maintenanceData, setMaintenanceData] = useState({});
  const [displayMaintenanceData, setDisplayMaintenanceData] = useState([{}]);
  const [propertyId, setPropertyId] = useState("");
  const colorStatus = theme.colorStatusPMO;
  const [refresh, setRefresh] = useState(false || location.state?.refresh);

  const newDataObject = {};
  newDataObject["NEW REQUEST"] = [];
  newDataObject["QUOTES REQUESTED"] = [];
  newDataObject["QUOTES ACCEPTED"] = [];
  newDataObject["SCHEDULED"] = [];
  newDataObject["COMPLETED"] = [];
  newDataObject["PAID"] = [];

  const [showSelectMonth, setShowSelectMonth] = useState(false);
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [filterPropertyList, setFilterPropertyList] = useState([]);
  const [maintenanceItemQuotes, setMaintenanceItemQuotes] = useState([]);

  const businessId = user.businesses.MAINTENANCE.business_uid;

  function navigateToAddMaintenanceItem() {
    navigate("/addMaintenanceItem");
  }

  useEffect(() => {
    if (maintenanceData) {
      // console.log("maintenanceData", maintenanceData)
      const propertyList = [];
      const addedAddresses = [];
      for (const key in maintenanceData) {
        for (const item of maintenanceData[key]) {
          if (!addedAddresses.includes(item.property_address)) {
            addedAddresses.push(item.property_address);
            if (!propertyList.includes(item.property_address)) {
              propertyList.push({
                address: item.property_address,
                checked: true,
              });
            }
          }
        }
      }

      // console.log("filterPropertyList", propertyList)
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
    // Filtering by date
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

    // Filtering by property
    if (filterPropertyList?.length > 0) {
      //filteredArray = filteredArray.filter(item => filterPropertyList.includes(item.property_address));
      filteredArray = filteredArray.filter((item) => {
        for (const filterItem of filterPropertyList) {
          if (filterItem.address === item.property_address && filterItem.checked) {
            return true;
          }
        }
        return false;
      });
    }

    //setDisplayMaintenanceData(filteredArray);
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
    for (const item of filterPropertyList) {
      if (item.checked) {
        count++;
      }
    }
    if (count === filterPropertyList.length) {
      return "All Properties";
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
    // console.log("Maintenance useEffect")
    // getMaintenanceData();
    let profileId = getProfileId();
    maintenanceManagerDataCollectAndProcess(setMaintenanceData, setShowSpinner, setDisplayMaintenanceData, profileId);
    setRefresh(false);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%", // Take up full screen width
          minHeight: "100vh", // Set the Box height to full height
          // marginTop: theme.spacing(2), // Set the margin to 20px
          marginTop: "25px",
        }}
      >
        <Paper
          style={{
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "95%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
            borderRadius: "10px",
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" position="relative">
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                Maintenance
              </Typography>
            </Box>
            <Box position="absolute" right={0}>
              <Button onClick={() => navigateToAddMaintenanceItem()}>
                <AddIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          </Stack>
          <Box component="span" m={2} display="flex" justifyContent="space-between" alignItems="center">
            <Button sx={{ textTransform: "capitalize" }} onClick={() => setShowSelectMonth(true)}>
              <CalendarTodayIcon
                sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont, margin: "5px" }}
              />
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                {displayFilterString(month, year)}
              </Typography>
            </Button>
            <Button sx={{ textTransform: "capitalize" }} onClick={() => setShowPropertyFilter(true)}>
              <HomeWorkIcon sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont, margin: "5px" }} />
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
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
          <Box component="span" m={2} display="flex" justifyContent="center" alignItems="center" position="relative">
            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
              {displayFilterString(month, year)}
              {displayFilterString(month, year) === "Last 30 Days" ? null : (
                <Button
                  onClick={() => clearFilters()}
                  sx={{
                    padding: "0px",
                    position: "absolute",
                    right: 0,
                    opacity: displayFilterString(month, year) === "Last 30 Days" ? 0 : 1, // Adjust opacity based on condition
                    pointerEvents: displayFilterString(month, year) === "Last 30 Days" ? "none" : "auto", // Ensure the button is not clickable when hidden
                  }}
                >
                  <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "14px" }} />
                </Button>
              )}
            </Typography>
          </Box>
          <div
            style={{
              borderRadius: "20px",
              margin: "10px",
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
                  allMaintenanceData={newDataObject}
                  maintenanceRequestsCount={filteredArray}
                  // maintenanceItemQuotes={maintenanceItemQuotes}
                />
              );
            })}
          </div>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
