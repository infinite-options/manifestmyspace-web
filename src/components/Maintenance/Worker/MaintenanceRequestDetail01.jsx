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
import MaintenanceRequestNavigator01 from "./MaintenanceRequestNavigator01";
import AddIcon from '@mui/icons-material/Add';
import PaidMaintenance01 from "./PaidMaintenance01";
import QuotesRequestAction01 from "./QuotesRequestAction01";
import QuotesAccepted01 from "./QuotesAccepted01";
import ScheduleMaintenance01 from "./ScheduleMaintenance01";
import CompleteMaintenance01 from "./CompleteMaintenance01";
import QuotesRequestedAction01 from "./NewRequestAction01";
import QuotesSubmittedAction01 from "./QuotesRequestAction01";



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


export default function MaintenanceRequestDetail01(){
    const location = useLocation();
    let navigate = useNavigate();

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

    // const colorStatus = [
    //     {'color': '#B62C2A', 'status': 'New Requests', 'mapping': 'NEW'},
    //     {'color': '#BC6666', 'status': 'Quotes Requested', 'mapping': 'PROCESSING'}, // #D4736D
    //     {'color': '#DEA19C', 'status': 'Quotes Accepted', 'mapping': 'CANCELLED'}, 
    //     {'color': '#92A9CB', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
    //     {'color': '#6788B3', 'status': 'Completed', 'mapping': 'COMPLETED'},
    //     {'color': '#173C8D', 'status': 'Paid', 'mapping': 'INFO'}
    // ]

    const colorStatus = theme.colorStatusMM

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

    // console.log(maintenanceRequestIndex, status, maintenanceItemsForStatus, allData)


    useEffect(() => {
        // console.log("useEffect")
        // console.log("status value", status)
        colorStatus.find((item, index) => {
            if(item.status === status){
                // console.log("status", item.status, "===", status)
                setValue(index);
            }
        })
        let j=colorStatus.map((item, index) => {
            let key= item.mapping
            let isGrey= allData[key].length > 0 ? 0 : 1;  
            let temp= areTabsGrey;
            setAreTabsGrey(prev =>{ 
                temp[index]= isGrey;
            return temp;});
            let firstTab = areTabsGrey.indexOf(0)
            let lastTab = areTabsGrey.lastIndexOf(0);
            setTabs({firstTab, lastTab});
        })

    }, [status])

    const handleChange = (event, newValue) => {
        setStatus(colorStatus[newValue].status)
        setValue(newValue);
        setMaintenanceRequestIndex(0);
    };

    const handleMaintenaceRequestIndexChange = (index, direction, prevTabLastIndex) => {
        setMaintenanceRequestIndex(index);  
        if (direction.changeTab==='forward'){
            let i= value+1;
              
            while(areTabsGrey[i]===1 ){
            i++;
            if (i>5)
            break;}
    
            if(i<=5)
            {setValue(i);
            setMaintenanceRequestIndex(0);}
         }
        
         if (direction.changeTab==='backward'){
            let i= value-1;
            
            while(areTabsGrey[i]===1 ){
            i--;
            if (i<0)
            break;}
    
            if(i >= 0){
                
                let requestType= colorStatus[i].mapping.toUpperCase();
                // console.log(allData)
                let j= allData[requestType].length-1
                setValue(i);
                setMaintenanceRequestIndex(j)
            }
         }  
    }

    // useEffect(() => {
    //     console.log(maintenanceRequestIndex, "requestIndexChange MaintenanceRequestDetail useEffect")
    // }, [maintenanceRequestIndex])

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
                            <Typography sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Maintenance Quote
                            </Typography>
                        </Box>
                        {/* <Box position="absolute" right={30}>
                            <Button onClick={() => navigateToAddMaintenanceItem()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box> */}
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
                                                <MaintenanceRequestNavigator01 requestIndex={maintenanceRequestIndex } backward_active_status={maintenanceRequestIndex=== 0 && value===tabs.firstTab} forward_active_status={  value===tabs.lastTab && allData[item.mapping].length-1 === maintenanceRequestIndex  } updateRequestIndex={handleMaintenaceRequestIndexChange} requestData={allData[item.mapping]} status={status} color={item.color} item={item} allData={allData}  currentTabValue={value}
                                                    tabs={tabs}
                                                />

                                            
                            )
                            :null}
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
                                    <QuotesRequestedAction01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null 
                                }
                                {colorStatus[value]?.mapping === "SUBMITTED" ?
                                    <QuotesSubmittedAction01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                 {colorStatus[value]?.mapping === "ACCEPTED" ?
                                    <QuotesAccepted01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "SCHEDULED" ?
                                    <ScheduleMaintenance01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "FINISHED" ?
                                    <CompleteMaintenance01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/>
                                    : null
                                }
                                {colorStatus[value]?.mapping === "PAID" ?
                                    <PaidMaintenance01 maintenanceItem={maintenanceItemsForStatus[maintenanceRequestIndex]}/> 
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