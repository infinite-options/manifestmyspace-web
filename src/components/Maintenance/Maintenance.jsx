import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    ThemeProvider, 
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import theme from '../../theme/theme';
import MaintenanceStatusTable from './MaintenanceStatusTable';


export default function Maintenance(){
    const location = useLocation();
    const data = location.state.maintenanceData;
    const colorStatus = location.state.colorStatus;

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
                    <div style={{
                        borderRadius: "10px"
                    }}>
                    {colorStatus.map((item, index) => <MaintenanceStatusTable key={index} status={item.status} data={data[item.mapping]} color={item.color}/>)}
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}
