import {
  ThemeProvider,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Stack,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../../theme/theme';
import RequestCard from './MaintenanceRequestCard';
import MaintenanceRequestNavigator from './MaintenanceRequestNavigator';
import AddIcon from '@mui/icons-material/Add';
import SelectMonthComponent from '../SelectMonthComponent';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NewRequestAction from './Manager/NewRequestAction';
import QuotesRequestAction from './Manager/QuotesRequestAction';
import QuotesAccepted from './Manager/QuotesAccepted';
import ScheduleMaintenance from './Manager/ScheduleMaintenance';
import RescheduleMaintenance from './Manager/RescheduleMaintenance';
import CompleteMaintenance from './Manager/CompleteMaintenance';
import PaidMaintenance from './Manager/PaidMaintenance';
import { useUser } from '../../contexts/UserContext';
import useMediaQuery from '@mui/material/useMediaQuery';

import APIConfig from '../../utils/APIConfig';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function MaintenanceRequestDetail({
  maintenance_request_index,
  status: initialStatus,
  maintenanceItemsForStatus: initialMaintenanceItemsForStatus,
  allMaintenanceData,
}) {
  console.log('In MaintenanceRequestDetail');
  const location = useLocation();
  const { user, getProfileId, roleName, maintenanceRoutingBasedOnSelectedRole } = useUser();
  let navigate = useNavigate();
  let profileId = getProfileId();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [fromProperty, setFromProperty] = useState(location.state?.fromProperty || false);

  function navigateToAddMaintenanceItem() {
    navigate('/addMaintenanceItem', { state: { month, year } });
  }

  function handleBackButton() {
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
    let greyColor = '#D9D9D9';
    if (maintenanceData[key]) {
      return maintenanceData[key].length > 0 ? color : greyColor;
    } else {
      return greyColor;
    }
  }

  function getColorStatusBasedOnSelectedRole() {
    const role = roleName();
    if (role === 'Manager') {
      return theme.colorStatusPMO;
    } else if (role === 'Owner') {
      return theme.colorStatusO;
    } else if (role === 'Maintenance') {
      return theme.colorStatusMM;
    } else if (role === 'PM Employee') {
      return theme.colorStatusPMO;
    } else if (role === 'Maintenance Employee') {
      return theme.colorStatusMM;
    } else if (role === 'Tenant') {
      return theme.colorStatusTenant;
    }
  }

  const colorStatus = getColorStatusBasedOnSelectedRole();

  const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(maintenance_request_index);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [maintenanceItemsForStatus, setMaintenanceItemsForStatus] = useState(initialMaintenanceItemsForStatus);
  const [maintenanceQuotes, setMaintenanceQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [value, setValue] = useState(colorStatus.findIndex((item) => item.status === initialStatus));
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [navParams, setNavParams] = useState({});
  const allData = allMaintenanceData;

  useEffect(() => {
    setNavParams({
      maintenanceRequestIndex,
      status: currentStatus,
      maintenanceItemsForStatus,
      allData,
      filteredQuotes,
    });
    colorStatus.find((item, index) => {
      if (item.status === currentStatus) {
        setValue(index);
      }
    });
    colorStatus.map((item, index) => {
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
  }, [maintenanceRequestIndex, currentStatus]);

  useEffect(() => {
    console.log('--DEBUG-- in useEffect for quotes');
    console.log('--DEBUG-- MaintenanceRequestIndex', maintenanceRequestIndex);
    console.log('--DEBUG-- maintenanceItemsForStatus', maintenanceItemsForStatus);
    console.log('--DEBUG-- maintenanceQuotes', maintenanceQuotes);
    var quotesFilteredById = maintenanceQuotes.filter(
      (item) => item.quote_maintenance_request_id === maintenanceItemsForStatus[maintenanceRequestIndex].maintenance_request_uid
    );
    console.log('--DEBUG-- quotesFilteredById', quotesFilteredById);
    quotesFilteredById.sort((a, b) => {
      if (a.quote_status === 'SENT') {
        return -1;
      } else if (b.quote_status === 'SENT') {
        return 1;
      } else {
        return 0;
      }
    });

    const uniqueQuotes = [];
    const uniqueKeys = new Set();

    quotesFilteredById.forEach((quote, index) => {
      let key = quote.quote_business_id + quote.maintenance_quote_uid + quote.quote_maintenance_request_id;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueQuotes.push(quote);
      }
    });

    setFilteredQuotes(uniqueQuotes);
  }, [maintenanceRequestIndex, maintenanceQuotes, maintenanceItemsForStatus]);

  useEffect(() => {
    const getMaintenanceItemQuotes = async () => {
      const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes/${profileId}`);
      const data = await response.json();
      const quotes = data.maintenanceQuotes.result;
      setMaintenanceQuotes(quotes);
    };
    getMaintenanceItemQuotes();
  }, []);

  useEffect(() => {
    colorStatus.find((item, index) => {
      if (item.mapping === currentStatus) {
        setValue(index);
      }
    });
  }, [currentStatus, fromProperty]);

  const handleChange = (event, newValue) => {
    setCurrentStatus(colorStatus[newValue].status);
    setValue(newValue);
    setMaintenanceRequestIndex(0);
    const newStatus = colorStatus[newValue].mapping;
    const maintenanceItemsForNewStatus = allData[newStatus.toUpperCase()] || [];
    setMaintenanceItemsForStatus(maintenanceItemsForNewStatus);
  };

  const handleMaintenaceRequestIndexChange = (index, direction) => {
    setMaintenanceRequestIndex(index);

    if (direction.changeTab === 'forward') {
      let i = value + 1;
      while (areTabsGrey[i] === 1) {
        i++;
        if (i > 5) break;
      }
      if (i <= 5) {
        handleChange(null, i);
      }
    } else if (direction.changeTab === 'backward') {
      let i = value - 1;
      while (areTabsGrey[i] === 1) {
        i--;
        if (i < 0) break;
      }
      if (i >= 0) {
        let requestType = colorStatus[i].mapping.toUpperCase();
        let lastIndex =
          allData[requestType] && allData[requestType].length ? allData[requestType].length - 1 : 0;
        setValue(i);
        setCurrentStatus(colorStatus[i].status);
        setMaintenanceRequestIndex(lastIndex);
        setMaintenanceItemsForStatus(allData[requestType] || []);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100vh',
          marginTop: theme.spacing(2),
        }}
      >
        <Paper
          style={{
            margin: '10px',
            backgroundColor: theme.palette.primary.main,
            width: '100%',
            paddingTop: '10px',
            paddingBottom: '30px',
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              paddingBottom: '20px',
              paddingLeft: '0px',
              paddingRight: '0px',
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
                Request #XX-Xx
              </Typography>
            </Box>
          </Stack>
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: '20px',
            }}
          >
            <Box
              sx={{
                borderBottom: 0,
                width: '95%',
              }}
            >
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChange}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: 'transparent',
                    border: '0px',
                    minWidth: '5px',
                    height: '10px',
                    padding: '0px',
                  },
                }}
                sx={{
                  [theme.breakpoints.up('sm')]: {
                    height: '5px',
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
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        height: '10%',
                        minWidth: '5px',
                        padding: '0px',
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
                      borderBottomRightRadius: '10px',
                      borderBottomLeftRadius: '10px',
                    }}
                  >
                    <Grid
                      sx={{
                        backgroundColor: item.color,
                        justifyContent: 'center',
                        marginLeft: '25px',
                        marginRight: '25px',
                        paddingBottom: '0px',
                      }}
                    >
                      {allData[item.mapping] && allData[item.mapping][maintenanceRequestIndex] ? (
                        <MaintenanceRequestNavigator
                          requestIndex={maintenanceRequestIndex}
                          backward_active_status={
                            maintenanceRequestIndex === 0 && value === tabs.firstTab
                          }
                          forward_active_status={
                            value === tabs.lastTab &&
                            allData[item.mapping].length - 1 === maintenanceRequestIndex
                          }
                          updateRequestIndex={handleMaintenaceRequestIndexChange}
                          requestData={allData[item.mapping]}
                          status={currentStatus}
                          color={item.color}
                          item={item}
                          allData={allData}
                          maintenanceQuotes={filteredQuotes}
                          currentTabValue={value}
                          tabs={tabs}
                          navigateParams={navParams}
                        />
                      ) : null}
                    </Grid>
                  </CustomTabPanel>
                </div>
              ))}
              <Box
                sx={{
                  paddingBottom: '20px',
                  paddingTop: '20px',
                }}
              >
                {colorStatus[value]?.status === 'New Requests' &&
                maintenanceItemsForStatus[maintenanceRequestIndex] ? (
                  <NewRequestAction
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
                  />
                ) : null}
                {colorStatus[value]?.status === 'Quotes Requested' ? (
                  <QuotesRequestAction
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === 'Quotes Accepted' ? (
                  <QuotesAccepted
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === 'Scheduled' ? (
                  <ScheduleMaintenance
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === 'Completed' &&
                maintenanceItemsForStatus[maintenanceRequestIndex].maintenance_request_status !==
                  'CANCELLED' ? (
                  <CompleteMaintenance
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
                    quotes={filteredQuotes}
                  />
                ) : null}
                {colorStatus[value]?.status === 'Paid' ? (
                  <PaidMaintenance
                    maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}
                    navigateParams={navParams}
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

MaintenanceRequestDetail.propTypes = {
  maintenance_request_index: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  maintenanceItemsForStatus: PropTypes.array.isRequired,
  allMaintenanceData: PropTypes.object.isRequired,
};
