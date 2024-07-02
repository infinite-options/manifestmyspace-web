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
import theme from '../../../theme/theme';
import RequestCard from '../MaintenanceRequestCard';
import WorkerMaintenanceRequestNavigator from "./WorkerMaintenanceRequestNavigator";
import AddIcon from '@mui/icons-material/Add';
import WorkerPaidMaintenance from "./WorkerPaidMaintenance";
import WorkerQuotesAccepted from "./WorkerQuotesAccepted";
import WorkerScheduledMaintenance from "./WorkerScheduledMaintenance";
import WorkerFinishedMaintenance from "./WorkerFinishedMaintenance";
import WorkerQuotesRequestedAction from "./WorkerQuotesRequestedAction";
import WorkerQuotesSubmittedAction from "./WorkerQuotesSubmittedAction";

import useMediaQuery from "@mui/material/useMediaQuery";

function CustomTabPanel(props) {
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


export default function WorkerMaintenanceRequestDetail({maintenance_request_index, propstatus, propmaintenanceItemsForStatus, alldata, maintenance_request_uid}){
    const location = useLocation();
    let navigate = useNavigate();
    const colorStatus = theme.colorStatusMM

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    //const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(location.state.maintenance_request_index);

    const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(isMobile ? location.state.maintenance_request_index : maintenance_request_index);
  
    const [status, setStatus] = useState(isMobile ? location.state.status : propstatus);
    const [value, setValue] = useState(4); // this tab value is for the tab navigator and it needs to change
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [maintenanceItemsForStatus, setMaintenanceItemsForStatus] = useState(isMobile ? location.state.maintenanceItemsForStatus : propmaintenanceItemsForStatus);
    const allData = isMobile ? location.state.data : alldata;

    const [maintenanceRequestId, setMaintenanceRequestId] = useState(isMobile ? location.state.maintenance_request_uid: maintenance_request_uid);


    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        // console.log("handleBackButton")
        navigate(-1); 
    }

    function deactivateTab(key, maintenanceData){
        if(maintenanceData[key]){
            return maintenanceData[key].length > 0 ? false : true;
        }
        else{
            return true;
        }
    }
    let [areTabsGrey, setAreTabsGrey]= useState([0,0,0,0,0,0]);
    let [tabs, setTabs]=useState({})
    function greyOutTab(key, maintenanceData, color){
        let greyColor = "#D9D9D9"
        if(maintenanceData[key]){
            return maintenanceData[key].length > 0 ? color : greyColor;  
        }
        else{
            return greyColor;
        }
    }

    useEffect(() => {
        // console.log("useEffect")
        // console.log("status value", status)
        colorStatus.find((item, index) => {
            if(item.status === status){
                // console.log("status", item.status, "===", status)
                setValue(index);
            }
        })
        let j = colorStatus.map((item, index) => {
            let key= item.mapping
            let isGrey= allData[key].length > 0 ? 0 : 1;  
            let temp= areTabsGrey;
            setAreTabsGrey(prev => { 
                temp[index]= isGrey;
                return temp;
            });
            let firstTab = temp.indexOf(0)
            let lastTab = temp.lastIndexOf(0);
            setTabs({firstTab, lastTab});
        })

    }, [maintenanceRequestIndex, status])


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
                setValue(i); // Change tab
                setStatus(colorStatus[i].status)
                setMaintenanceRequestIndex(lastIndex); // Update index to the last item of the new status array
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
                    // display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    width: '100%', // Take up full screen width
                    // maxWidth: '60%',
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
                            <Typography sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Maintenance Quote
                            </Typography>
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
                                        let title = item.mapping

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
                                                    <Typography sx={{color: theme.typography.primary.grey, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}>
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
                                                <WorkerMaintenanceRequestNavigator 
                                                    requestIndex={maintenanceRequestIndex} 
                                                    backward_active_status={maintenanceRequestIndex=== 0 && value===tabs.firstTab} 
                                                    forward_active_status={value===tabs.lastTab && allData[item.mapping].length-1 === maintenanceRequestIndex} 
                                                    updateRequestIndex={handleMaintenaceRequestIndexChange} 
                                                    requestData={allData[item.mapping]} 
                                                    status={status} 
                                                    color={item.color} 
                                                    item={item} 
                                                    allData={allData}
                                                    currentTabValue={value}
                                                    tabs={tabs}
                                                />
                                            ) : null}
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
                                {colorStatus[value]?.mapping === "REQUESTED" && maintenanceItemsForStatus[maintenanceRequestIndex] ?
                                    <WorkerQuotesRequestedAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null 
                                }
                                {colorStatus[value]?.mapping === "SUBMITTED" ?
                                    <WorkerQuotesSubmittedAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                 {colorStatus[value]?.mapping === "ACCEPTED" ?
                                    <WorkerQuotesAccepted maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "SCHEDULED" ?
                                    <WorkerScheduledMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "FINISHED" ?
                                    <WorkerFinishedMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "PAID" ?
                                    <WorkerPaidMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/> 
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