import {
  ThemeProvider,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Card,
  CardHeader,
  Slider,
  Stack,
  Button,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import RequestCard from "./MaintenanceRequestCard";
import MaintenanceRequestNavigator from "./MaintenanceRequestNavigator";
import AddIcon from "@mui/icons-material/Add";
import SelectMonthComponent from "../SelectMonthComponent";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NewRequestAction from "./Manager/NewRequestAction";
import QuotesRequestAction from "./Manager/QuotesRequestAction";
import QuotesAccepted from "./Manager/QuotesAccepted";
import ScheduleMaintenance from "./Manager/ScheduleMaintenance";
import RescheduleMaintenance from "./Manager/RescheduleMaintenance";
import CompleteMaintenance from "./Manager/CompleteMaintenance";
import PaidMaintenance from "./Manager/PaidMaintenance";
import { useUser } from "../../contexts/UserContext";
import useMediaQuery from "@mui/material/useMediaQuery";

import APIConfig from "../../utils/APIConfig";

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function MaintenanceRequestDetail({child_parent_detail_params}) {
  console.log("In MaintenanceRequestDetail");
  const location = useLocation();
  const {
    user,
    getProfileId,
    roleName,
    maintenanceRoutingBasedOnSelectedRole,
  } = useUser();
  let navigate = useNavigate();
  let profileId = getProfileId();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log('1')
  console.log(child_parent_detail_params)
  console.log('2')
  // console.log("--DEBUG-- MaintenanceRequestDetail location.state", location.state)

  const [fromProperty, setFromProperty] = useState(
    location.state?.fromProperty || false
  );

  function navigateToAddMaintenanceItem() {
    // console.log("navigateToAddMaintenanceItem")
    navigate("/addMaintenanceItem", { state: { month, year } });
  }

  function handleBackButton() {
    // console.log("handleBackButton")
    if (fromProperty) {
      navigate(-1);
    } else {
      navigate(maintenanceRoutingBasedOnSelectedRole());
    }
  }

  function deactivateTab(key, maintenanceData) {
    if (maintenanceData[key]) {
      return maintenanceData[key].length > 0 ? false : true;
    } else {
      return true;
    }
  }
  let [areTabsGrey, setAreTabsGrey] = useState([0, 0, 0, 0, 0, 0]);

  let [tabs, setTabs] = useState({});
  function greyOutTab(key, maintenanceData, color) {
    let greyColor = "#D9D9D9";
    if (maintenanceData[key]) {
      return maintenanceData[key].length > 0 ? color : greyColor;
    } else {
      return greyColor;
    }
  }

  function getColorStatusBasedOnSelectedRole() {
    const role = roleName();

    if (role === "Manager") {
      return theme.colorStatusPMO;
    } else if (role === "Owner") {
      return theme.colorStatusO;
    } else if (role === "Maintenance") {
      return theme.colorStatusMM;
    } else if (role === "PM Employee") {
      return theme.colorStatusPMO;
    } else if (role === "Maintenance Employee") {
      return theme.colorStatusMM;
    } else if (role === "Tenant") {
      return theme.colorStatusTenant;
    }
  }

  const colorStatus = getColorStatusBasedOnSelectedRole();
  let maintenanceRequestIndex_v=child_parent_detail_params?.state.maintenance_request_index;
  const [maintenanceRequestIndex_s, setMaintenanceRequestIndex_s] = useState(
    isMobile 
      ? location.state.maintenance_request_index
      : child_parent_detail_params?.state.maintenance_request_index
  );
  let status_v=child_parent_detail_params?.state?.status
  const [status_s, set_status_s] = useState(
    isMobile
      ? location.state.status
      : child_parent_detail_params?.state.status
  );
  var maintenanceItemsForStatus_v=child_parent_detail_params?.state?.maintenanceItemsForStatus;

  const [maintenanceItemsForStatus_s, setMaintenanceItemsForStatus_s] = useState(
    isMobile
      ? location.state.maintenanceItemsForStatus
      : child_parent_detail_params?.state?.maintenanceItemsForStatus
  );
  const [maintenanceQuotes, setMaintenanceQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [value, setValue] = useState(
    colorStatus.findIndex((item) => item.status === (status_v || status_s))
  );
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [navParams_s, setNavParams_s] = useState({});
  let navParams_v = {}
  const allData = isMobile
    ? location.state.allMaintenanceData
    : child_parent_detail_params?.state.allMaintenanceData;

  useEffect(() => {
    setNavParams_s({
      maintenanceRequestIndex: maintenanceRequestIndex_v || maintenanceRequestIndex_s,
      status: status_v || status_s,
      maintenanceItemsForStatus: (maintenanceItemsForStatus_v || maintenanceItemsForStatus_s),
      allData,
      filteredQuotes,
    });
    navParams_v= {
      maintenanceRequestIndex: maintenanceRequestIndex_v || maintenanceRequestIndex_s,
      status: status_v || status_s,
      maintenanceItemsForStatus: (maintenanceItemsForStatus_v || maintenanceItemsForStatus_s),
      allData,
      filteredQuotes,
    }


    colorStatus.find((item, index) => {
      if (item.status === (status_v || status_s)) {
        // console.log("status", item.status, "===", status)
        setValue(index);
      }
    });
    let j = colorStatus.map((item, index) => {
      let key = item.mapping;
      let isGrey = allData[key].length > 0 ? 0 : 1;
      let temp = areTabsGrey;
      setAreTabsGrey((prev) => {
        temp[index] = isGrey;
        return temp;
      });
      let firstTab = temp.indexOf(0);
      let lastTab = temp.lastIndexOf(0);
      setTabs({ firstTab, lastTab });
    });
  }, [maintenanceRequestIndex_s, status_s, child_parent_detail_params]);

  useEffect(() => {
    console.log(
      "--DEBUG-- in useeffect for quotes",
      maintenanceRequestIndex_s,
      maintenanceItemsForStatus_s,
      maintenanceQuotes
    );
    var quotesFilteredById = maintenanceQuotes.filter(
      (item) =>
        item.quote_maintenance_request_id ===      (maintenanceItemsForStatus_v?.length ? maintenanceItemsForStatus_v[maintenanceRequestIndex_v]?.maintenance_request_uid : maintenanceItemsForStatus_s[maintenanceRequestIndex_s].maintenance_request_uid)
    );
    quotesFilteredById.sort((a, b) => {
      if (a.quote_status === "SENT") {
        return -1;
      } else if (b.quote_status === "SENT") {
        return 1;
      } else {
        return 0;
      }
    });
    // deduplicate these if they come from the same buiness id

    const uniqueQuotes = [];
    const uniqueKeys = new Set();

    quotesFilteredById.forEach((quote, index) => {
      let key =
        quote.quote_business_id +
        quote.maintenance_quote_uid +
        quote.quote_maintenance_request_id;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueQuotes.push(quote);
      }
    });

    // if quote_business_id, maintenance_quote_uid, and quote_maintenance_request_id

    setFilteredQuotes(uniqueQuotes);
  }, [maintenanceRequestIndex_s, maintenanceQuotes, maintenanceItemsForStatus_s]);

  useEffect(() => {
    const getMaintenanceItemQuotes = async () => {
      const response = await fetch(
        `${APIConfig.baseURL.dev}/maintenanceQuotes/${profileId}`
      );
      const data = await response.json();
      const quotes = data.maintenanceQuotes.result;
      setMaintenanceQuotes(quotes);
    };
    getMaintenanceItemQuotes();
  }, []);

  useEffect(() => {
    colorStatus.find((item, index) => {
      if (item.mapping === status_s) {
        setValue(index);
      }
    });
  }, [status_s, fromProperty]);

  const handleChange = (event, newValue) => {
    set_status_s(colorStatus[newValue].status);
    status_v=colorStatus[newValue].status;
    setValue(newValue);
    setMaintenanceRequestIndex_s(0);
    maintenanceRequestIndex_v=0;
    const newStatus = colorStatus[newValue].mapping;
    const maintenanceItemsForNewStatus = allData[newStatus.toUpperCase()] || [];
    maintenanceItemsForStatus_v=maintenanceItemsForNewStatus;
    setMaintenanceItemsForStatus_s(maintenanceItemsForNewStatus);
  };

  const handleMaintenaceRequestIndexChange = (index, direction) => {
    setMaintenanceRequestIndex_s(index);
    maintenanceRequestIndex_v=index

    if (direction.changeTab === "forward") {
      let i = value + 1;

      while (areTabsGrey[i] === 1) {
        i++;
        if (i > 5) break;
      }

      if (i <= 5) {
        handleChange(null, i); // Re-use handleChange to ensure consistent state update
      }
    } else if (direction.changeTab === "backward") {
      let i = value - 1;

      while (areTabsGrey[i] === 1) {
        i--;
        if (i < 0) break;
      }

      if (i >= 0) {
        let requestType = colorStatus[i].mapping.toUpperCase();
        let lastIndex =
          allData[requestType] && allData[requestType].length
            ? allData[requestType].length - 1
            : 0;
        // console.log(requestType, lastIndex, allData[requestType])
        const keysForAllData = Object.keys(allData);
        // console.log("keysForAllData", keysForAllData)
        // Update the tab and maintenance request index correctly
        setValue(i); // Change tab
        set_status_s(colorStatus[i].status);
        status_v= colorStatus[i].status;
        setMaintenanceRequestIndex_s(lastIndex); // Update index to the last item of the new status array
        maintenanceRequestIndex_v= lastIndex; 
        maintenanceItemsForStatus_v =  (allData[requestType] || []);
        setMaintenanceItemsForStatus_s(allData[requestType] || []);
      }
    }
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: 'center',
          width: "100%", // Take up full screen width
          minHeight: "100vh", // Set the Box height to full height
          marginTop: theme.spacing(2), // Set the margin to 20px
        }}
      >
        <Paper
          style={{
            margin: "10px",
            backgroundColor: theme.palette.primary.main,
            width: "100%", // Occupy full width with 25px margins on each side
            paddingTop: "10px",
            paddingBottom: "30px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              paddingBottom: "20px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
           { isMobile && <Box position="absolute" left={30}>
              <Button onClick={() => handleBackButton()}>
                <ArrowBackIcon
                  sx={{
                    color: theme.typography.primary.black,
                    fontSize: "30px",
                    margin: "5px",
                  }}
                />
              </Button>
            </Box>}
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                Maintenance
              </Typography>
              
              
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                Maintenance2 + {status_v} + {status_s}
              </Typography>

            </Box>
            {isMobile && <Box position="absolute" right={30}>
              <Button onClick={() => navigateToAddMaintenanceItem()}>
                <AddIcon
                  sx={{
                    color: theme.typography.primary.black,
                    fontSize: "30px",
                    margin: "5px",
                  }}
                />
              </Button>
            </Box>}
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <Box
              sx={{
                borderBottom: 0,
                width: "95%",
              }}
            >
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChange}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "transparent",
                    border: "0px",
                    minWidth: "5px",
                    height: "10px",
                    padding: "0px",
                  },
                }}
                sx={{
                  [theme.breakpoints.up("sm")]: {
                    height: "5px", // padding for screens wider than 'sm'
                  },
                }}
              >
                {colorStatus.map((item, index) => {
                  let color = greyOutTab(item.mapping, allData, item.color);
                  let title = item.status;

                  return (
                    <Tab
                      key={index}
                      disabled={deactivateTab(item.mapping, allData)}
                      {...a11yProps(index)}
                      sx={{
                        backgroundColor: color,
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        height: "10%",
                        minWidth: "5px",
                        padding: "0px",
                      }}
                      label={
                        <Typography
                          sx={{
                            color: theme.typography.primary.grey,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: isMobile ? 8 : theme.typography.smallFont,
                          }}
                        >
                          {title}
                        </Typography>
                      }
                    />
                  );
                })}
              </Tabs>
              {colorStatus.map((item, index) => (
                <div key={index}>
                  <CustomTabPanel
                    key={index}
                    value={value}
                    index={index}
                    style={{
                      backgroundColor: item.color,
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    <Grid
                      sx={{
                        backgroundColor: item.color,
                        justifyContent: "center",
                        marginLeft: "25px",
                        marginRight: "25px",
                        paddingBottom: "0px",
                      }}
                    >
                      {allData[item.mapping] &&
                      allData[item.mapping][(maintenanceRequestIndex_v || maintenanceRequestIndex_s)] ? (
                        <MaintenanceRequestNavigator
                          requestIndex={(maintenanceRequestIndex_v || maintenanceRequestIndex_s)}
                          backward_active_status={
                            (maintenanceRequestIndex_v || maintenanceRequestIndex_s) === 0 &&
                            value === tabs.firstTab
                          }
                          forward_active_status={
                            value === tabs.lastTab &&
                            allData[item.mapping].length - 1 ===
                              (maintenanceRequestIndex_v || maintenanceRequestIndex_s)
                          }
                          updateRequestIndex={
                            handleMaintenaceRequestIndexChange
                          }
                          requestData={allData[item.mapping]}
                          status={ status_v || status_s}
                          color={item.color}
                          item={item}
                          allData={allData}
                          maintenanceQuotes={filteredQuotes}
                          currentTabValue={value}
                          tabs={tabs}
                          navigateParams={navParams_v || navParams_s}
                        />
                      ) : null}
                    </Grid>
                  </CustomTabPanel>
                </div>
              ))}
              <Box
                sx={{
                  paddingBottom: "20px",
                  paddingTop: "20px",
                }}
              >
                {colorStatus[value]?.status === "New Requests" &&
                maintenanceItemsForStatus_s[maintenanceRequestIndex_s] ? (
                  <NewRequestAction
                    maintenanceItem={
                      maintenanceItemsForStatus_s[maintenanceRequestIndex_s]
                    }
                    navigateParams={navParams_v || navParams_s}
                  />
                ) : null}
                {colorStatus[value]?.status === "Quotes Requested" ? (
                  <QuotesRequestAction
                    maintenanceItem={
                      maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                    }
                    navigateParams={navParams_v || navParams_s}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === "Quotes Accepted" ? (
                  <QuotesAccepted
                    maintenanceItem={
                      maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                    }
                    navigateParams={navParams_v || navParams_s}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === "Scheduled" ? (
                  <ScheduleMaintenance
                    maintenanceItem={
                      maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                    }
                    navigateParams={navParams_v || navParams_s}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === "Completed" &&
                maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                  .maintenance_request_status !== "CANCELLED" ? (
                  <CompleteMaintenance
                    maintenanceItem={
                      maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                    }
                    navigateParams={navParams_v || navParams_s}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === "Paid" ? (
                  <PaidMaintenance
                    maintenanceItem={
                      maintenanceItemsForStatus_s[(maintenanceRequestIndex_v || maintenanceRequestIndex_s)]
                    }
                    navigateParams={navParams_v || navParams_s}
                    quotes={filteredQuotes}
                  />
                ) : null}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
