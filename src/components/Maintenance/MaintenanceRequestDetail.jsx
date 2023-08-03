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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import RequestCard from './RequestCard';
import RequestNavigator from './RequestNavigator';
import AddIcon from '@mui/icons-material/Add';
import SelectMonthComponent from '../SelectMonthComponent';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


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

    const colorStatus = [
        {'color': '#B62C2A', 'status': 'New Requests', 'mapping': 'NEW'},
        {'color': '#D4736D', 'status': 'Quotes Requested', 'mapping': 'PROCESSING'},
        {'color': '#DEA19C', 'status': 'Quotes Accepted', 'mapping': 'CANCELLED'},
        {'color': '#92A9CB', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
        {'color': '#6788B3', 'status': 'Completed', 'mapping': 'COMPLETED'},
        {'color': '#173C8D', 'status': 'Paid', 'mapping': 'INFO'}
    ]

    console.log("Maintenance Request Detail data", location.state.data)
    console.log("status", location.state.status)
    console.log("allData", location.state.allData)

    const requestData = location.state.data;
    const status = location.state.status;
    const allData = location.state.allData;

    const [value, setValue] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    console.log("MaintenanceRequestDetail", location.state.allData);

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
                //display: 'flex',
                justifyContent: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        // [theme.breakpoints.down('sm')]: {
                        //     width: '80%',
                        // },
                        // [theme.breakpoints.up('sm')]: {
                        //     width: '50%',
                        // },
                        paddingTop: '10px',
                    }}
                >
                     <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        sx={{
                            paddingBottom: "20px"
                        }}
                    >
                         <Box position="absolute" left={0}>
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
                        <Box position="absolute" right={0}>
                            <Button onClick={() => navigateToAddMaintenanceItem()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        sx={{
                            margin: "20px",
                            backgroundColor: "teal",
                            width: '100%',
                            // direction="row"
                            // justifyContent="center"
                            // alignItems="center"
                            // position="relative"
                            paddingBottom: "20px"

                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                        }}>
                            <Tabs 
                                variant="fullWidth" 
                                value={value} 
                                onChange={handleChange} 
                                aria-label="basic tabs example"
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: 'transparent',
                                        border: '0px',
                                        minWidth: '5px',
                                    }
                                }}
                            >
                                {colorStatus.map((item, index) =>
                                    <Tab {...a11yProps(index)} sx={{
                                        backgroundColor: item.color,
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px',
                                        // maxWidth: '25px',
                                        minWidth: '5px',
                                    }}/>
                                )}
                            </Tabs>
                        </Box>
                        {colorStatus.map((item, index) =>
                            <div>
                                <CustomTabPanel key={index} value={value} index={index} style={{
                                    backgroundColor: item.color,
                                    paddingBottom: '10px',

                                }}>
                                    <Grid container spacing={2}
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            justifyContent: "center",
                                    }}>
                                        <RequestNavigator requestData={allData[item.mapping]} color={item.color} item={item}/>
                                    </Grid>
                                </CustomTabPanel>
                            </div>
                        )}
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}