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
import PropTypes from 'prop-types';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import RescheduleMaintenance from "./Manager/RescheduleMaintenance";
import CompleteMaintenance from "./Manager/CompleteMaintenance";
import PaidMaintenance from "./Manager/PaidMaintenance";
import { useUser } from "../../contexts/UserContext";
import useMediaQuery from '@mui/material/useMediaQuery';


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


export function MaintenanceRequestDetail(){
    const location = useLocation();
    const { user, getProfileId, roleName, maintenanceRoutingBasedOnSelectedRole } = useUser();
    let navigate = useNavigate();
    let profileId = getProfileId();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    console.log("--DEBUG-- MaintenanceRequestDetail location.state", location.state)

    const [fromProperty, setFromProperty] = useState(location.state?.fromProperty || false);

    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        // console.log("handleBackButton")
        if(fromProperty){
            navigate(-1)
        } else{
            navigate(maintenanceRoutingBasedOnSelectedRole());
        }
    }

    function deactivateTab(key, maintenanceData){
        if(maintenanceData[key]){
            return maintenanceData[key].length > 0 ? false : true;
        }
        else{
            return true;
        }
    }
    let [areTabsGrey, setAreTabsGrey] = useState([0,0,0,0,0,0]);

    let [tabs, setTabs] = useState({})
    function greyOutTab(key, maintenanceData, color){
        let greyColor = "#D9D9D9"
        if(maintenanceData[key]){
            return maintenanceData[key].length > 0 ? color : greyColor;  
        }
        else{
            return greyColor;
        }
    }

    function getColorStatusBasedOnSelectedRole(){
        const role = roleName()
        console.log("role", role)   

        if (role === "Manager"){
            return theme.colorStatusPMO
        } else if (role === "Owner"){
            return theme.colorStatusO
        } else if (role === "Maintenance"){
            return theme.colorStatusMM
        } else if (role === "PM Employee"){
            return theme.colorStatusPMO
        } else if (role === "Maintenance Employee"){
            return theme.colorStatusMM
        } else if (role === "Tenant"){
            return theme.colorStatusTenant
        }
    }

    const colorStatus = getColorStatusBasedOnSelectedRole()
    console.log("--DEBUG-- colorStatus", colorStatus)
   

    const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(location.state.maintenance_request_index);
    const [status, setStatus] = useState(location.state.status);
    const [maintenanceItemsForStatus, setMaintenanceItemsForStatus] = useState(location.state.maintenanceItemsForStatus);
    // const [value, setValue] = useState(4); // this tab value is for the tab navigator and it needs to change
    const [maintenanceQuotes, setMaintenanceQuotes] = useState([]);    
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [value, setValue] = useState(colorStatus.findIndex((item) => item.status === status));
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [navParams, setNavParams] = useState({})
    const allData = location.state.allMaintenanceData;

    console.log("--DEBUG-- allData", allData)

    useEffect(() => {
        setNavParams({
            maintenanceRequestIndex,
            status,
            maintenanceItemsForStatus,
            allData,
            filteredQuotes,
        })
        colorStatus.find((item, index) => {
            if(item.status === status){
                // console.log("status", item.status, "===", status)
                setValue(index);
            }
        })
        let j = colorStatus.map((item, index) => {
            let key = item.mapping
            console.log("--DEBUG-- key", key)
            console.log("--DEBUG-- allData keys", Object.keys(allData))
            let isGrey = allData[key].length > 0 ? 0 : 1;  
            let temp = areTabsGrey;
            setAreTabsGrey(prev => { 
                temp[index]= isGrey;
                return temp;
            });
            let firstTab = temp.indexOf(0)
            let lastTab = temp.lastIndexOf(0);
            setTabs({firstTab, lastTab});
        })
    }, [maintenanceRequestIndex, status])


    useEffect(() => {
        var quotesFilteredById = maintenanceQuotes.filter((item) => item.quote_maintenance_request_id === maintenanceItemsForStatus[maintenanceRequestIndex].maintenance_request_uid)
        quotesFilteredById.sort((a, b) => { 
            if(a.quote_status === "SENT"){
                return -1
            } else if (b.quote_status === "SENT"){
                return 1
            } else {
                return 0
            }
        })
        // deduplicate these if they come from the same buiness id

        const uniqueQuotes = [];
        const uniqueKeys = new Set();

        quotesFilteredById.forEach((quote, index) => {
            let key = quote.quote_business_id + quote.maintenance_quote_uid + quote.quote_maintenance_request_id
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                uniqueQuotes.push(quote);
            }
        });

        // if quote_business_id, maintenance_quote_uid, and quote_maintenance_request_id

        setFilteredQuotes(uniqueQuotes)
    }, [maintenanceRequestIndex, maintenanceQuotes, maintenanceItemsForStatus])

    useEffect(() => {
        const getMaintenanceItemQuotes = async () => {
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes/${profileId}`)
            const data = await response.json()
            const quotes = data.maintenanceQuotes.result
            setMaintenanceQuotes(quotes)
        }
        getMaintenanceItemQuotes()
    },[])
    

    useEffect(() => {
        colorStatus.find((item, index) => {
            if(item.mapping === status){
                setValue(index);
            }
        })
    }, [status, fromProperty])

    const handleChange = (event, newValue) => {
        console.log("handleChange", newValue, colorStatus[newValue].status, colorStatus[newValue].mapping.toUpperCase())
        setStatus(colorStatus[newValue].status)
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
                handleChange(null, i); // Re-use handleChange to ensure consistent state update
            }
        } else if (direction.changeTab === 'backward') {
            let i = value - 1;
    
            while (areTabsGrey[i] === 1) {
                i--;
                if (i < 0) break;
            }
    
            if (i >= 0) {
                let requestType = colorStatus[i].mapping.toUpperCase();
                let lastIndex = allData[requestType] && allData[requestType].length ? allData[requestType].length - 1 : 0;
                // console.log(requestType, lastIndex, allData[requestType])
                const keysForAllData = Object.keys(allData);
                // console.log("keysForAllData", keysForAllData)
                // Update the tab and maintenance request index correctly
                setValue(i); // Change tab
                setMaintenanceRequestIndex(lastIndex); // Update index to the last item of the new status array
                // Optionally, update maintenanceItemsForStatus if your app's state requires it
                setMaintenanceItemsForStatus(allData[requestType] || []);
            }
        }
    };


    function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
      
    return(
        <ThemeProvider theme={theme}>
            <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
            >
                <Paper
                    style={{
                        margin: '10px',
                        backgroundColor: theme.palette.primary.main,
                        width: '100%', // Occupy full width with 25px margins on each side
                        paddingTop: '10px',
                        paddingBottom: '30px',
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
                        <Box position="absolute" left={30}>
                            <Button onClick={() => handleBackButton()}>
                                <ArrowBackIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Maintenance 
                            </Typography>
                        </Box>
                        <Box position="absolute" right={30}>
                            <Button onClick={() => navigateToAddMaintenanceItem()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: "20px"

                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                            width: '95%',
                        }}>
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
                                    }
                                }}
                                sx={{
                                    [theme.breakpoints.up('sm')]: {
                                        height: '5px', // padding for screens wider than 'sm'
                                        },

                                }}
                            >
                                {colorStatus.map((item, index) => {

                                        let color = greyOutTab(item.mapping, allData, item.color)
                                        let title = item.status
                                        
                                        return (
                                            <Tab key={index}
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
                                                    <Typography sx={{
                                                        color: theme.typography.primary.grey, 
                                                        fontWeight: theme.typography.secondary.fontWeight, 
                                                        fontSize: isMobile ? 8 : theme.typography.smallFont,
                                                    }}>
                                                        {title}
                                                    </Typography>
                                                }
                                            />
                                        )
                                    }
                                )}
                            </Tabs>
                            {colorStatus.map((item, index) =>
                                <div key={index}>
                                    <CustomTabPanel key={index} value={value} index={index} style={{
                                        backgroundColor: item.color,
                                        borderBottomRightRadius: "10px",
                                        borderBottomLeftRadius: "10px",
                                    }}>
                                        <Grid
                                            sx={{
                                                backgroundColor: item.color,
                                                justifyContent: "center",
                                                marginLeft: "25px",
                                                marginRight: "25px",
                                                paddingBottom: "0px"

                                        }}>
                                            {allData[item.mapping] && allData[item.mapping][maintenanceRequestIndex] ? (
                                                <MaintenanceRequestNavigator 
                                                    requestIndex={maintenanceRequestIndex} 
                                                    backward_active_status={maintenanceRequestIndex=== 0 && value===tabs.firstTab} 
                                                    forward_active_status={value===tabs.lastTab && allData[item.mapping].length-1 === maintenanceRequestIndex} 
                                                    updateRequestIndex={handleMaintenaceRequestIndexChange} 
                                                    requestData={allData[item.mapping]} 
                                                    status={status} 
                                                    color={item.color} 
                                                    item={item} 
                                                    allData={allData} 
                                                    maintenanceQuotes={filteredQuotes} 
                                                    currentTabValue={value}
                                                    tabs={tabs}
                                                />
                                            )
                                            : null}
                                        </Grid>
                                    </CustomTabPanel>
                                </div>
                            )}
                            <Box
                                sx={{
                                    paddingBottom: "20px",
                                    paddingTop: "20px",
                                }}
                            >
                                {colorStatus[value]?.status === "New Requests" && maintenanceItemsForStatus[maintenanceRequestIndex] ?
                                    <NewRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null 
                                }
                                {colorStatus[value]?.status === "Quotes Requested" ?
                                    <QuotesRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams} quotes={filteredQuotes}/>
                                    : null
                                }
                                {colorStatus[value]?.status === "Quotes Accepted" ?
                                    <QuotesAccepted maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams} quotes={filteredQuotes}/>
                                    : null
                                }
                                {colorStatus[value]?.status === "Scheduled" ?    
                                    <ScheduleMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams} quotes={filteredQuotes}/>
                                    : null
                                }
                                {colorStatus[value]?.status === "Completed" ?
                                    <CompleteMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams} quotes={filteredQuotes}/>
                                    : null
                                }
                                {colorStatus[value]?.status === "Paid" ?
                                    <PaidMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams} quotes={filteredQuotes}/> 
                                    : null
                                }
                            </Box>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}