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


function CustomTabPanel(props) {
    // console.log("CustomTabPanel")
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


export default function MaintenanceRequestDetail(){
    const location = useLocation();
    let navigate = useNavigate();

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate('/maintenance'); 
    }

    function deactivateTab(maintenance_items){
        if(maintenance_items){
            return maintenance_items.length > 0 ? false : true;
        }
        else{
            return true;
        }
    }

    function greyOutTab(maintenance_items, color){
        let greyColor = "#D9D9D9"
        if(maintenance_items){
            return maintenance_items.length > 0 ? color : greyColor;  
        }
        else{
            return greyColor;
        }
    }


    const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(location.state.maintenance_request_index);
    const [status, setStatus] = useState(location.state.status);
    const [maintenanceItemsForStatus, setMaintenanceItemsForStatus] = useState(location.state.maintenanceItemsForStatus);
    const [allMaintenanceData, setAllMaintenanceData] = useState(location.state.allMaintenanceData);
    const [tabValue, setTabValue] = useState(4); // this tab value is for the tab navigator and it needs to change
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [navParams, setNavParams] = useState({})


    useEffect(() => {
        setNavParams({
            maintenanceRequestIndex,
            status,
            maintenanceItemsForStatus,
            allMaintenanceData,
        })
    }, [maintenanceRequestIndex, status])


    useEffect(() => {
        // console.log("useEffect")
        // console.log("status value", status)
        allMaintenanceData.find((item, index) => {
            if(item.maintenance_status === status){
                // console.log("status", item.status, "===", status)
                setTabValue(index);
            }
        })
    }, [status])

    const handleChange = (event, newValue) => {
        console.log("tab is changing to ", newValue)
        setStatus(allMaintenanceData[newValue].maintenance_status)
        setTabValue(newValue);
        setMaintenanceRequestIndex(0);
        setMaintenanceItemsForStatus(allMaintenanceData[newValue].maintenance_items)
    };

    const handleMaintenaceRequestIndexChange = (index) => {
        setMaintenanceRequestIndex(index);  
    }

    function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
      }

    const handleNext = () => {
        if (tabValue < 5){
            setTabValue(tabValue + 1);
        }
    }

    const handleBack = () => {
        if (tabValue > 0){
            setTabValue(tabValue - 1);
        }
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
                                value={tabValue} 
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
                                {allMaintenanceData.map((item, index) => {
                                        let color = greyOutTab(item.maintenance_items, item.maintenance_color)
                                        return (
                                            <Tab key={index}
                                                disabled={deactivateTab(item.maintenance_items)}
                                                {...a11yProps(index)} 
                                                sx={{
                                                    backgroundColor: color,
                                                    borderTopLeftRadius: '10px',
                                                    borderTopRightRadius: '10px',
                                                    height: '10%',
                                                    minWidth: '5px',
                                                    padding: '0px',
                                                }}
                                            />
                                        )
                                    }
                                )}
                            </Tabs>
                            {allMaintenanceData.map((item, index) => {
                                // console.log("item", item, "index", index)
                                return (
                                    <div key={index}>
                                        <CustomTabPanel key={index} value={tabValue} index={index} style={{
                                            backgroundColor: item.maintenance_color,
                                        }}>
                                            <Grid
                                                sx={{
                                                    backgroundColor: item.maintenance_color,
                                                    justifyContent: "center",
                                                    marginLeft: "25px",
                                                    marginRight: "25px",
                                                    paddingBottom: "0px"

                                            }}>
                                                <MaintenanceRequestNavigator 
                                                    requestIndex={maintenanceRequestIndex} 
                                                    updateRequestIndex={handleMaintenaceRequestIndexChange} 
                                                    requestData={item.maintenance_items} 
                                                    status={status} 
                                                    color={item.maintenance_color} 
                                                    item={item} 
                                                    allData={allMaintenanceData}
                                                />
                                            </Grid>
                                        </CustomTabPanel>
                                    </div>
                                )}
                            )}
                            <Box
                            sx={{
                                paddingBottom: "20px",
                                paddingTop: "20px",
                            }}
                            >
                                {status === "NEW REQUEST" ?
                                    <NewRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null 
                                }
                                {status === "QUOTES REQUESTED" ?
                                    <QuotesRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null
                                }
                                {status === "QUOTES ACCEPTED" ?
                                    <QuotesAccepted maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null
                                }
                                {status === "SCHEDULED" ?    
                                    <ScheduleMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null
                                }
                                {status === "COMPLETED" ?
                                    <CompleteMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/>
                                    : null
                                }
                                {status === "PAID" ?
                                    <PaidMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]} navigateParams={navParams}/> 
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