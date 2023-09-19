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

    function greyOutTab(key, maintenanceData, color){
        let greyColor = "#D9D9D9"
        if(maintenanceData[key]){
            return maintenanceData[key].length > 0 ? color : greyColor;  
        }
        else{
            return greyColor;
        }
    }

    // const colorStatus = [
    //     {'color': '#B62C2A', 'status': 'New Requests', 'mapping': 'NEW'},
    //     {'color': '#BC6666', 'status': 'Quotes Requested', 'mapping': 'PROCESSING'}, // #D4736D
    //     {'color': '#DEA19C', 'status': 'Quotes Accepted', 'mapping': 'CANCELLED'}, 
    //     {'color': '#92A9CB', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
    //     {'color': '#6788B3', 'status': 'Completed', 'mapping': 'COMPLETED'},
    //     {'color': '#173C8D', 'status': 'Paid', 'mapping': 'INFO'}
    // ]

    const colorStatus = theme.colorStatusPMO

    // console.log("Maintenance Request Detail", location.state.numOfRequests)
    // console.log("index", location.state.maintenance_request_index)
    // console.log("status", location.state.status)
    // console.log("maintenanceDataForStatus", location.state.maintenanceItemsForStatus)
    // console.log("allData", location.state.allMaintenanceData)

    // const requestData = location.state.numOfRequests;
    // const maintenanceRequestIndex = location.state.maintenance_request_index;
    const [maintenanceRequestIndex, setMaintenanceRequestIndex] = useState(location.state.maintenance_request_index);
    // const status = location.state.status;
    const [status, setStatus] = useState(location.state.status);
    const [value, setValue] = useState(4); // this tab value is for the tab navigator and it needs to change
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const maintenanceItemsForStatus = location.state.maintenanceItemsForStatus;
    const allData = location.state.allMaintenanceData;

    console.log(maintenanceRequestIndex, status, maintenanceItemsForStatus, allData)


    useEffect(() => {
        console.log("useEffect")
        console.log("status value", status)
        colorStatus.find((item, index) => {
            if(item.status === status){
                console.log("status", item.status, "===", status)
                setValue(index);
            }
        })
    }, [status])

    const handleChange = (event, newValue) => {
        console.log("tab is changing to ", newValue)
        setStatus(colorStatus[newValue].status)
        setValue(newValue);
        setMaintenanceRequestIndex(0);
    };

    const handleMaintenaceRequestIndexChange = (index) => {
        setMaintenanceRequestIndex(index);  
    }

    useEffect(() => {
        console.log(maintenanceRequestIndex, "requestIndexChange MaintenanceRequestDetail useEffect")
    }, [maintenanceRequestIndex])

    // console.log("all data MaintenanceRequestDetail", location.state.allData);

    function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
      }

    const handleNext = () => {
        if (value < 5){
            setValue(value + 1);
        }
    }

    const handleBack = () => {
        if (value > 0){
            setValue(value - 1);
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
                                            {allData[item.mapping] && allData[item.mapping][maintenanceRequestIndex] ?
                                                <MaintenanceRequestNavigator requestIndex={maintenanceRequestIndex} updateRequestIndex={handleMaintenaceRequestIndexChange} requestData={allData[item.mapping]} status={status} color={item.color} item={item} allData={allData}/>
                                                : <MaintenanceRequestNavigator requestIndex={maintenanceRequestIndex} updateRequestIndex={handleMaintenaceRequestIndexChange} requestData={[]} status={status} color={item.color} item={item} allData={allData}/>
                                            }
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
                                {colorStatus[value].status === "New Requests" && maintenanceItemsForStatus[maintenanceRequestIndex] ?
                                    <NewRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null 
                                }
                                {colorStatus[value].status === "Quotes Requested" ?
                                    <QuotesRequestAction maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value].status === "Quotes Accepted" ?
                                    <QuotesAccepted maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value].status === "Scheduled" ?
                                    <ScheduleMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value].status === "Completed" ?
                                    <CompleteMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value].status === "Paid" ?
                                    <PaidMaintenance maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/> 
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