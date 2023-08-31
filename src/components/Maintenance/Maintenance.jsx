import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider, 
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    ListItemText,
    Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import MaintenanceStatusTable from './MaintenanceStatusTable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import SelectMonthComponent from '../SelectMonthComponent';
import SelectPropertyFilter from '../SelectPropertyFilter/SelectPropertyFilter';


export default function Maintenance(){
    const location = useLocation();
    let navigate = useNavigate();
    const [maintenanceData, setMaintenanceData] = useState({});
    const [propertyId, setPropertyId] = useState("200-000029")
    const maintenanceRequests = location.state.maintenanceRequests;
    const colorStatus = location.state.colorStatus;

    console.log("maintenanceRequests", maintenanceRequests)

    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const [filterPropertyList, setFilterPropertyList] = useState([]);

    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year, propertyId}})
    }

    function createdPropertyList(){
    }

    function handleFilter(maintenanceArray){
        var filteredArray = []

        
        // if (filterPropertyList.length !== 0){

        //     for (const item of maintenanceArray){
        //         if (item.propertyId in filterPropertyList){
        //             filteredArray.push(item)
        //         }
        //     }
        // } else{
        //     console.log(maintenanceArray)
        //     return filteredArray
        // }
        return maintenanceArray
    }

    // console.log("numMaintenanceRequests", numMaintenanceRequests)

    // useEffect(() => {
    //     const getPropertyData = async () => {
    //         const properties = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByOwner/110-000003')
    //         const propertiesData = await properties.json()
    //         console.log("propertiesData", propertiesData)
    //     }
    // }, [filterPropertyList])

    useEffect(() => {
        // console.log("Maintenance useEffect")
        const dataObject = {};
        const getMaintenanceData = async () => {
            // const propertiesByOwnerResponse = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByOwner/110-000003')
            // const propertyData = await propertiesByOwnerResponse.json()

            const maintenanceRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequestsByOwner/110-000003')
            const maintenanceRequestsData = await maintenanceRequests.json()

            for (const item of maintenanceRequestsData.MaintenanceProjects.result) {
                console.log(item)
                if (!dataObject[item.maintenance_request_status]){
                    dataObject[item.maintenance_request_status] = [];
                }
                if (handleFilter(item)){
                    dataObject[item.maintenance_request_status].push(item);
                }
            }
            // console.log("dataObject from new api call", dataObject)
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
                                    Last 30 Days
                                    {/* { showSelectMonth ? `${month} ${year}` : "Last 30 days"} */}
                                </Typography>
                            </Button>
                        
                            <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent>
                            {/* <Button sx={{ textTransform: 'capitalize' }}>
                                <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                                    Select Property
                                </Typography>
                            </Button> */}
                            <SelectPropertyFilter/>
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
                                    maintenanceItemsForStatus={handleFilter(maintenanceArray)}
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