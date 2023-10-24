import { useState, useEffect } from "react"
import { state, useNavigate } from "react-router-dom";

import theme from "../../../theme/theme";
import { useUser } from "../../../contexts/UserContext";
import Status from "../../Templates/Status";
import { Typography, Box, Grid } from "@mui/material";
import MaintenanceStatusTable01 from "./MaintenanceStatusTable01";

import { InputBase, Paper, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function MaintenanceWorkerDashboardWidget(){
    const navigate = useNavigate();

    const { getProfileId } = useUser();
    const colorStatus = theme.colorStatusMM
    const [showSpinner, setShowSpinner] = useState(false);
    const [currentActivities, setCurrentActivities] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const [query, setQuery] = useState('');
    

    useEffect(() => {
        const dataObject = {};
        const fetchMaintenanceDashboardData = async () => {
            console.log("in useEffect")
            setShowSpinner(true);
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceDashboard/${getProfileId()}`)
            const jsonData = await response.json()
            console.log("CurrentActivities", jsonData.CurrentActivities.result)
            console.log("WorkOrders", jsonData.WorkOrders.result)
            setWorkOrders(jsonData.WorkOrders.result)
            setCurrentActivities(jsonData.CurrentActivities.result)
            setShowSpinner(false);
        }

        const getMaintenanceData = async () => {
            setShowSpinner(true);
            const maintenanceRequests1 = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceStatus/${getProfileId()}`)
            const maintenanceRequestsData1 = await maintenanceRequests1.json()
            console.log("maintenanceRequestsData1", maintenanceRequestsData1)
            
            let array1 = maintenanceRequestsData1.result?.REQUESTED?.maintenance_items ??[];
            let array2 = maintenanceRequestsData1.result?.SUBMITTED?.maintenance_items ?? [];
            let array3 = maintenanceRequestsData1.result?.ACCEPTED?.maintenance_items ??[];
            let array4 = maintenanceRequestsData1.result?.SCHEDULED?.maintenance_items ?? [];
            let array5 = maintenanceRequestsData1.result?.FINISHED?.maintenance_items ??[];
            let array6 = maintenanceRequestsData1.result?.PAID?.maintenance_items ?? [];
           
            dataObject["REQUESTED"] = [...array1];
            dataObject["SUBMITTED"] = [...array2];
            dataObject["ACCEPTED"] = [...array3];
            dataObject["SCHEDULED"] = [...array4];
            dataObject["FINISHED"] = [...array5];
            dataObject["PAID"] = [...array6];
            
            console.log("dataObject from new api call", dataObject)
            setMaintenanceRequests(prevData => ({
                ...prevData, 
                ...dataObject
            }));
            setShowSpinner(false);
        }
        getMaintenanceData();

        fetchMaintenanceDashboardData();
    }, []);
    
    function handleFilter(filterString, searchArray){
        console.log("filterString", filterString)
        console.log("searchArray", searchArray)
        let filteredArray = []
        if(filterString === "All" || filterString === ""){
            filteredArray = searchArray
        } else {
            filteredArray = searchArray.filter(item => item.maintenance_title === filterString)
        }
        return filteredArray
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    return(
        <div style={{
            borderRadius: "10px",
            margin: "20px",
        }}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={4} sx={{paddingLeft:"5px"}}>
                <Grid item xs={12}>
                    <Box sx={{paddingLeft:"5px"}}>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Work Orders
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{paddingLeft:"5px", alignContent:"center", alignItems: "center"}}>
                        <Button
                            variant="contained" 
                            sx={{
                                backgroundColor: 'darkgrey', // Set the dark grey background
                                borderRadius: '25px', // Set border radius to half of the height to create an oval shape
                                height: '40px', // Set height
                                width: '100px', // Set width
                                '&:hover': {
                                    backgroundColor: 'grey', // Set a different color on hover if desired
                                },
                            }}
                            onClick={() => {
                                setQuery("All");
                            }}
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                All
                            </Typography>
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={10} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Paper component="form" style={{ padding: '2px 4px', display: 'flex', alignItems: 'center', width: 400, alignContent:"center"}}>
                        <InputBase
                            style={{ marginLeft: '8px', flex: 1 }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            value={query}
                            onChange={handleInputChange}
                        />
                        <IconButton type="submit" style={{ padding: '10px' }} onClick={() => console.log("test")} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    {colorStatus.map((item, index) => {

                        let mappingKey = item.mapping

                        let maintenanceArray = maintenanceRequests[mappingKey]|| []

                        let filteredArray = handleFilter(query, maintenanceRequests[mappingKey])

                        return (
                            <MaintenanceStatusTable01
                                key={index}
                                status={item.status}
                                color={item.color}
                                maintenanceItemsForStatus={maintenanceArray}
                                allMaintenanceData={maintenanceRequests}
                                maintenanceRequestsCount={maintenanceArray}
                            />
                        );
                    })}
                </Grid>
            </Grid>


        </div>
    )

}