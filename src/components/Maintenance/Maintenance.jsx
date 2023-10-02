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
import CloseIcon from '@mui/icons-material/Close';
import HomeWorkIcon from '@mui/icons-material/HomeWork';


export default function Maintenance(){
    const location = useLocation();
    let navigate = useNavigate();
    const [maintenanceData, setMaintenanceData] = useState({});
    const [displayMaintenanceData, setDisplayMaintenanceData] = useState([{}]);
    const [propertyId, setPropertyId] = useState("200-000029")
    const colorStatus = theme.colorStatusPMO

    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [showPropertyFilter, setShowPropertyFilter] = useState(false);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const [filterPropertyList, setFilterPropertyList] = useState([]);


    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year, propertyId}})
    }

    useEffect(() => {
        if (maintenanceData){
            console.log("maintenanceData", maintenanceData)
            const propertyList = [];
            const addedAddresses = [];
            for (const key in maintenanceData){
                for (const item of maintenanceData[key]){
                    if (!addedAddresses.includes(item.property_address)){
                        addedAddresses.push(item.property_address);
                        if (!propertyList.includes(item.property_address)){
                            propertyList.push({
                                "address": item.property_address,
                                "checked": true
                            });
                        }
                    }
                }
            }
            
            console.log("filterPropertyList", propertyList)
            setFilterPropertyList(propertyList);
        }
    }, [maintenanceData])

    function convertToStandardFormat(monthName, year) {
        const months = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12'
        };
    
        return `${year}-${months[monthName]}`;
    }

    function handleFilter(maintenanceArray, month, year, filterPropertyList){
        var filteredArray = [];

        // Filtering by date
        if (month && year){
            const filterFormatDate = convertToStandardFormat(month, year);
            for (const item of maintenanceArray){
                if (item.maintenance_request_created_date.startsWith(filterFormatDate)){
                    filteredArray.push(item);
                }
            }
        } else {
            filteredArray = maintenanceArray;
        }
    
        // Filtering by property
        if (filterPropertyList?.length > 0){
            //filteredArray = filteredArray.filter(item => filterPropertyList.includes(item.property_address));
            filteredArray = filteredArray.filter(item => {
                for (const filterItem of filterPropertyList){
                    if (filterItem.address === item.property_address && filterItem.checked){
                        return true;
                    }
                }
                return false;
            })
        }
    
        //setDisplayMaintenanceData(filteredArray);
        return filteredArray
    }

    function displayFilterString(month, year){
        if(month && year){
            return month + " " + year
        } else{
            return "Last 30 Days"
        }
    }

    function displayPropertyFilterTitle(filterPropertyList){
        var count = 0;
        for (const item of filterPropertyList){
            if(item.checked){
                count++;
            }
        }
        if(count === filterPropertyList.length){
            return "All Properties"
        } else{
            return "Selected " + count + " Properties"
        }
    }

    function clearFilters(){
        setMonth(null);
        setYear(null);
        setFilterPropertyList([]);
    }

    useEffect(() => {
        // console.log("Maintenance useEffect")
        const dataObject = {};
        const getMaintenanceData = async () => {
            // const propertiesByOwnerResponse = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByOwner/110-000003')
            // const propertyData = await propertiesByOwnerResponse.json()

            // const maintenanceRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequestsByOwner/110-000003')
            const maintenanceRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceStatus/600-000003')
            const maintenanceRequestsData = await maintenanceRequests.json()

            let array1 = maintenanceRequestsData.result["NEW REQUEST"].maintenance_items
            let array2 = maintenanceRequestsData.result["QUOTES REQUESTED"].maintenance_items
            let array3 = maintenanceRequestsData.result["QUOTES ACCEPTED"].maintenance_items
            let array4 = maintenanceRequestsData.result["SCHEDULED"].maintenance_items
            let array5 = maintenanceRequestsData.result["COMPLETED"].maintenance_items
            let array6 = maintenanceRequestsData.result["PAID"].maintenance_items

            dataObject["NEW REQUEST"] = [];
            dataObject["QUOTES REQUESTED"] = [];
            dataObject["QUOTES ACCEPTED"] = [];
            dataObject["SCHEDULED"] = [];
            dataObject["COMPLETED"] = [];
            dataObject["PAID"] = [];

            for (const item of array1) {
                // console.log(item.maintenance_request_uid)
                dataObject["NEW REQUEST"].push(item);
            }
            for (const item of array2) {
                dataObject["QUOTES REQUESTED"].push(item);
            }
            for (const item of array3) {
                dataObject["QUOTES ACCEPTED"].push(item);
            }
            for (const item of array4) {
                dataObject["SCHEDULED"].push(item);
            }
            for (const item of array5) {
                dataObject["COMPLETED"].push(item);
            }
            for (const item of array6) {
                dataObject["PAID"].push(item);
            }
            setMaintenanceData(prevData => ({
                ...prevData, 
                ...dataObject
            }));
            setDisplayMaintenanceData(prevData => ({
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
                                    {displayFilterString(month, year)}
                                </Typography>
                            </Button>
                            <Button sx={{ textTransform: 'capitalize' }} onClick={() => setShowPropertyFilter(true)}>
                                <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                                <Typography 
                                    sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                                >
                                    {displayPropertyFilterTitle(filterPropertyList)}
                                </Typography>
                            </Button>
                        
                            <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent>
                            <SelectPropertyFilter showPropertyFilter={showPropertyFilter} setShowPropertyFilter={setShowPropertyFilter} filterList={filterPropertyList} setFilterList={setFilterPropertyList}/>
                        </Box>
                        <Box
                            component="span"
                            m={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                        >
                            <Typography 
                                sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {displayFilterString(month, year)}
                                {displayFilterString(month, year) === "Last 30 Days" ? null :(
                                <Button onClick={() => clearFilters()} sx={{
                                    padding: "0px",
                                    position: "absolute", 
                                    right: 0, 
                                    opacity: displayFilterString(month, year) === "Last 30 Days" ? 0 : 1,  // Adjust opacity based on condition
                                    pointerEvents: displayFilterString(month, year) === "Last 30 Days" ? 'none' : 'auto'  // Ensure the button is not clickable when hidden
                                }}>
                                    <CloseIcon sx={{color: theme.typography.common.blue, fontSize: "14px"}}/>
                                </Button>
                            )}
                            </Typography>
                        </Box>
                    <div style={{
                        borderRadius: "10px",
                        margin: "20px",
                    }}>
                        {colorStatus.map((item, index) => {
                            // construct mapping key if it doesn't exist
                            // var mappingKey = ""
                            // if (item.mapping === "SCHEDULED") { // a known key with color mapping
                            //     mappingKey = "SCHEDULED" // a mapped key to the maintenanceData object
                            // } else if (item.mapping == "PAID"){
                            //     mappingKey = "PAID"
                            // } else{
                            //     mappingKey = item.mapping
                            // }

                            let mappingKey = item.mapping

                            let maintenanceArray = maintenanceData[mappingKey]|| []

                            let filteredArray = handleFilter(maintenanceArray, month, year, filterPropertyList)

                            return (
                                <MaintenanceStatusTable 
                                    key={index}
                                    status={item.status}
                                    color={item.color}
                                    maintenanceItemsForStatus={filteredArray}
                                    allMaintenanceData={maintenanceData}
                                    maintenanceRequestsCount={maintenanceArray}
                                />
                            );
                        })}
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}