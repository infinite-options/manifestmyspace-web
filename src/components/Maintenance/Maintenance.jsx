import { 
    Typography, 
    Grid, 
    Box, 
    Stack,
    Paper,
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import theme from '../../theme/theme';
import MaintenanceStatusTable from './MaintenanceStatusTable';
import { get } from "../utils/api";


export default function Maintenance(){
    const location = useLocation();
    const data = location.state.maintenanceData;
    const [maintenanceData, setMaintenanceData] = useState({});

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let dataObject = {};
    //         const data = await get(`/maintenanceRequests`)  
    //         for (const item of data.result) {
    //             if (!dataObject[item.request_status]){
    //                 dataObject[item.request_status] = [];
    //             }
    //             dataObject[item.request_status].push(item);
    //         }            
    //         setMaintenanceData(prevData => ({ ...prevData, ...dataObject }))
    //     }
    //     fetchData();
    // }, []);

    console.log("Maintenance data", data)

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
                }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Maintenance
                        </Typography>
                    </Stack>
                    {Object.keys(maintenanceData).map((key, index) => <MaintenanceStatusTable key={index} status={key} data={maintenanceData[key]}/>)}
                </Paper>
            </Box>
        </ThemeProvider>
    )
}
