import React, { useEffect, useState } from "react";
import { ThemeProvider, Typography, Box, Tabs, Tab, Paper, Grid, Stack, Button } from "@mui/material";
import PropTypes from "prop-types";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import MaintenanceRequestNavigatorNew from "./MaintenanceRequestNavigatorNew";
import AddIcon from "@mui/icons-material/Add";
import SelectMonthComponent from "../SelectMonthComponent";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NewRequestAction from "./Manager/NewRequestAction";
import QuotesRequestAction from "./Manager/QuotesRequestAction";
import QuotesAccepted from "./Manager/QuotesAccepted";
import ScheduleMaintenance from "./Manager/ScheduleMaintenance";
import CompleteMaintenance from "./Manager/CompleteMaintenance";
import PaidMaintenance from "./Manager/PaidMaintenance";
import { useUser } from "../../contexts/UserContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIConfig from "../../utils/APIConfig";
import { useMaintenance } from "../../contexts/MaintenanceContext";

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

export default function MaintenanceRequestDetailNew() {
  const {
    selectedRequestIndex,
    selectedStatus,
    maintenanceItemsForStatus,
    setSelectedRequestIndex,
    setSelectedStatus,
    setMaintenanceItemsForStatus,
    allMaintenanceData,
    maintenanceQuotes,
    setMaintenanceQuotes,
  } = useMaintenance();


  const location = useLocation();
  const { user, getProfileId, roleName, maintenanceRoutingBasedOnSelectedRole } = useUser();
  let navigate = useNavigate();
  let profileId = getProfileId();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const colorStatus = roleName() === "Manager" ? theme.colorStatusPMO : theme.colorStatusMM;

  const [fromProperty, setFromProperty] = useState(location.state?.fromProperty || false);
  const [value, setValue] = useState(colorStatus.findIndex((item) => item.status === (isMobile ? location.state.status : selectedStatus)));
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [navParams, setNavParams] = useState({});
  const allData = isMobile ? location.state.allMaintenanceData : allMaintenanceData;
  const isDesktop = location.state?.isDesktop || false;
  const propertyIndex = location.state?.index || -1;

  // Tab grey-out logic
  let [areTabsGrey, setAreTabsGrey] = useState([0, 0, 0, 0, 0, 0]);
  let [tabs, setTabs] = useState({});

  function deactivateTab(key, maintenanceData) {
    if (maintenanceData && maintenanceData[key]) {
      return maintenanceData[key].length > 0 ? false : true;
    } else {
      return true;
    }
  }

  function greyOutTab(key, maintenanceData, color) {
    let greyColor = "#D9D9D9";
    if (maintenanceData && maintenanceData[key]) {
      return maintenanceData[key].length > 0 ? color : greyColor;
    } else {
      return greyColor;
    }
  }

  function navigateToAddMaintenanceItem() {
    navigate("/addMaintenanceItem", { state: { month, year } });
  }

  function handleBackButton() {
    if (fromProperty) {
      if (isDesktop === true) {
        navigate("/propertiesPM", { state: { index: propertyIndex } });
      } else {
        navigate(-1);
      }
    } else {
      navigate(maintenanceRoutingBasedOnSelectedRole());
    }
  }
  useEffect(() => {
    const handleMaintenanceRequestSelected = () => {

      console.log("---is event heard-----", selectedStatus, selectedRequestIndex);
      // Update state with the new values
      //setMaintenanceRequestIndex(selectedRequestIndex);
      //setCurrentStatus(selectedStatus);
      //setMaintenanceItemsForStatus(maintenanceItemsForStatus);

      // Find the tab index based on the status
      const statusIndex = colorStatus.findIndex((item) => item.status === selectedStatus);
      if (statusIndex !== -1) {
        setValue(statusIndex);
        handleChange(null, statusIndex, selectedRequestIndex);
      }
    };

  }, [selectedStatus, selectedRequestIndex]);

  useEffect(() => {
    setNavParams({
      maintenanceRequestIndex: selectedRequestIndex,
      status: selectedStatus,
      maintenanceItemsForStatus,
      allData,
      filteredQuotes,
    });
  }, [selectedRequestIndex, selectedStatus, maintenanceItemsForStatus]);

  useEffect(() => {
    var quotesFilteredById = maintenanceQuotes?.filter(
      (item) => item.quote_maintenance_request_id === maintenanceItemsForStatus[selectedRequestIndex]?.maintenance_request_uid
    );

    quotesFilteredById?.sort((a, b) => {
      if (a.quote_status === "SENT") return -1;
      if (b.quote_status === "SENT") return 1;
      return 0;
    });

    const uniqueQuotes = [];
    const uniqueKeys = new Set();

    quotesFilteredById?.forEach((quote) => {
      let key = quote.quote_business_id + quote.maintenance_quote_uid + quote.quote_maintenance_request_id;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueQuotes.push(quote);
      }
    });

    setFilteredQuotes(uniqueQuotes);
  }, [selectedRequestIndex, maintenanceQuotes, maintenanceItemsForStatus]);

  const fetchAndUpdateQuotes = async () => {
    const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes/${profileId}`);
    const data = await response.json();
    setMaintenanceQuotes(data.maintenanceQuotes.result);
  };

  useEffect(() => {
    fetchAndUpdateQuotes();
  }, []);

  useEffect(() => {
    colorStatus.find((item, index) => {
      if (item.mapping === selectedStatus) {
        setValue(index);
      }
    });
  }, [selectedStatus]);

  useEffect(() => {
    colorStatus.map((item, index) => {
      let key = item.mapping;
      let isGrey = allData[key] && allData[key].length > 0 ? 0 : 1;
      let temp = areTabsGrey;
      setAreTabsGrey((prev) => {
        temp[index] = isGrey;
        return temp;
      });
      let firstTab = temp.indexOf(0);
      let lastTab = temp.lastIndexOf(0);
      setTabs({ firstTab, lastTab });
    });
  }, [selectedRequestIndex, selectedStatus]);

  const handleChange = (event, newValue, index = 0) => {
    if (colorStatus && colorStatus.length > newValue) {
      setSelectedStatus(colorStatus[newValue].status);
      setValue(newValue);
      setSelectedRequestIndex(index);
      const newStatus = colorStatus[newValue].mapping;
      const maintenanceItemsForNewStatus = allData[newStatus.toUpperCase()] || [];
      setMaintenanceItemsForStatus(maintenanceItemsForNewStatus);
    }
  };

  const handleMaintenaceRequestIndexChange = (index, direction) => {
    setSelectedRequestIndex(index);

    if (direction.changeTab === "forward") {
      let i = value + 1;
      while (areTabsGrey[i] === 1) {
        i++;
        if (i > 5) break;
      }
      if (i <= 5) handleChange(null, i);
    } else if (direction.changeTab === "backward") {
      let i = value - 1;
      while (areTabsGrey[i] === 1) {
        i--;
        if (i < 0) break;
      }
      if (i >= 0) {
        const lastIndex = allData[colorStatus[i].mapping]?.length - 1 || 0;
        setValue(i);
        setSelectedStatus(colorStatus[i].status);
        setSelectedRequestIndex(lastIndex);
        setMaintenanceItemsForStatus(allData[colorStatus[i].mapping.toUpperCase()] || []);
      }
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Box
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
            width: "100%",
            paddingTop: "10px",
            paddingBottom: "30px",
          }}
        >
          {isMobile && (
            <Box position="absolute">
              <Button onClick={() => handleBackButton()}>
                <ArrowBackIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          )}
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
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                Maintenance Details
              </Typography>
            </Box>
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
                    height: "5px",
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
                      paddingBottom: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    <Grid
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        justifyContent: "center",
                        marginLeft: "5px",
                        marginRight: "5px",
                        paddingBottom: "0px",
                      }}
                    >
                      {allData[item.mapping]?.[selectedRequestIndex] ? (
                        <MaintenanceRequestNavigatorNew
                          requestIndex={selectedRequestIndex}
                          backward_active_status={selectedRequestIndex === 0 && value === tabs.firstTab}
                          forward_active_status={value === tabs.lastTab && allData[item.mapping]?.length - 1 === selectedRequestIndex}
                          updateRequestIndex={handleMaintenaceRequestIndexChange}
                          requestData={allData[item.mapping]}
                          status={selectedStatus}
                          color={item.color}
                          item={item}
                          allData={allData}
                          maintenanceQuotes={filteredQuotes}
                          currentTabValue={value}
                          tabs={tabs}
                          navigateParams={navParams}
                          fetchAndUpdateQuotes={fetchAndUpdateQuotes}
                        />
                      ) : null}
                    </Grid>
                  </CustomTabPanel>
                </div>
              ))}
              <Box
                sx={{
                  paddingBottom: "20px",
                  paddingTop: "0px",
                }}
              >
                {console.log('----return in maintenanceItemsForStatus---', maintenanceItemsForStatus)}
                {colorStatus[value]?.status === "New Requests" && maintenanceItemsForStatus[selectedRequestIndex] ? (
                  <NewRequestAction maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} />
                ) : null}
                {colorStatus[value]?.status === "Quotes Requested" ? (
                  <QuotesRequestAction maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} quotes={filteredQuotes} />
                ) : null}
                {colorStatus[value]?.status === "Quotes Accepted" ? (
                  <QuotesAccepted maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} quotes={filteredQuotes} />
                ) : null}
                {colorStatus[value]?.status === "Scheduled" ? (
                  <ScheduleMaintenance maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} quotes={filteredQuotes} />
                ) : null}
                {colorStatus[value]?.status === "Completed" && maintenanceItemsForStatus[selectedRequestIndex]?.maintenance_request_status !== "CANCELLED" ? (
                  <CompleteMaintenance maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} quotes={filteredQuotes} />
                ) : null}
                {colorStatus[value]?.status === "Paid" ? (
                  <PaidMaintenance maintenanceItem={maintenanceItemsForStatus[selectedRequestIndex]} navigateParams={navParams} quotes={filteredQuotes} />
                ) : null}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

MaintenanceRequestDetailNew.propTypes = {
  maintenance_request_index: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  maintenanceItemsForStatus: PropTypes.array.isRequired,
  allMaintenanceData: PropTypes.object.isRequired,
};

MaintenanceRequestDetailNew.defaultProps = {
  maintenance_request_index: 0,
  status: "",
  maintenanceItemsForStatus: [],
  allMaintenanceData: {},
};
