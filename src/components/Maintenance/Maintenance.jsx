import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider, 
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import MaintenanceStatusTable from './MaintenanceStatusTable';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import SelectMonthComponent from '../SelectMonthComponent';


export default function Maintenance(){
    const location = useLocation();
    let navigate = useNavigate();
    const [maintenanceData, setMaintenanceData] = useState({});
    const maintenanceRequests = location.state.maintenanceRequests;
    const colorStatus = location.state.colorStatus;

    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    // console.log("numMaintenanceRequests", numMaintenanceRequests)

    useEffect(() => {
        // console.log("Maintenance useEffect")
        const dataObject = {};
        const getMaintenanceData = async () => {
            const response = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/200-000029');
            const jsonData = await response.json();
            // console.log("jsonData", jsonData)
            for (const item of jsonData.MaintenanceProjects) {
                if (!dataObject[item.maintenance_request_status]){
                    dataObject[item.maintenance_request_status] = [];
                }
                dataObject[item.maintenance_request_status].push(item);
            }
            // console.log("MAINTENANCE dataObject", dataObject)
            setMaintenanceData(prevData => ({
                ...prevData, 
                ...dataObject
            }));
        }
        getMaintenanceData();
    }, [])


    return(
        <ThemeProvider theme={theme}>
            <Box
            style={{
                display: 'flex',
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
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                        paddingTop: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                    >
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
                                <AddIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                        <Box
                            component="span"
                            m={2}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button sx={{ textTransform: 'capitalize' }} onClick={()=>setShowSelectMonth(true)}>
                                <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin: '5px'}}/>
                                <Typography 
                                    sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                                >
                                    Last 30 days
                                </Typography>
                            </Button>
                        
                            <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent>
                            
                            <Button sx={{ textTransform: 'capitalize' }}>
                                <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                                    Select Property
                                </Typography>
                            </Button>
                        </Box>
                        <Box
                            component="span"
                            m={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Button sx={{ textTransform: 'capitalize' }}>
                                {/* <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}/> */}
                                <Typography 
                                    sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                                >
                                All Properties
                                </Typography>
                            </Button>
                        </Box>
                    <div style={{
                        borderRadius: "10px",
                        margin: "20px",
                    }}>
                        {colorStatus.map((item, index) => {
                            // construct mapping key if it doesn't exist
                            var mappingKey = ""
                            if (item.mapping === "SCHEDULED") { // a known key with color mapping
                                mappingKey = "SCHEDULE" // a mapped key to the maintenanceData object
                            } else if (item.mapping == "PAID"){
                                mappingKey = "INFO"
                            } else{
                                mappingKey = item.mapping
                            }

                            let maintenanceArray = maintenanceData[mappingKey] || []

                            return (
                                <MaintenanceStatusTable 
                                    key={index}
                                    status={item.status}
                                    color={item.color}
                                    maintenanceItemsForStatus={maintenanceArray}
                                    allMaintenanceData={maintenanceData}
                                />
                            );
                        })}
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}