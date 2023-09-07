import { 
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Divider from '@mui/material/Divider';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';



export default function MaintenanceStatusTable({status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount}){
    const location = useLocation();
    let navigate = useNavigate();

    // console.log("MaintenanceStatusTable", status, color, maintenanceItemsForStatus)

    const tableTextStyle = {
        backgroundColor: color, 
        color: '#FFFFFF', 
        fontFamily: 'Source Sans Pro', 
        fontSize: '15px', 
        fontWeight: 600,
    }

    function handleRequestDetailPage(maintenance_request_index, property_uid, maintenance_request_uid){
        // console.log("handleRequestDetailPage", property_uid, maintenance_request_uid)
        // There is some work that needs to be done here.
        // The maintenanceDataForStatus object is just an array of maintenance requests for a particular status.
        // Example: "NEW"
        // We need to pass all the data to it, by status

        console.log("handleRequestDetailPage")
        console.log("maintenance_request_index", maintenance_request_index)
        console.log("status", status)
        console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
        console.log("allMaintenanceData", allMaintenanceData)
        navigate('/maintenanceRequestDetail', {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        })
    }
      
    return(
        <ThemeProvider theme={theme}>
            <Accordion
            sx={{
                backgroundColor: color,
                boxShadow: 'none',
            }}>
            <AccordionSummary 
                sx={{
                    flexDirection: 'row', // Changed this from 'row-reverse'
                    '& .MuiIconButton-edgeEnd': { // This targets the IconButton
                        marginLeft: 'auto', // This pushes the IconButton to the right
                    },
                }} 
                expandIcon={<ExpandMoreIcon sx={{color: "white"}}/>} 
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ 
                    backgroundColor: color, 
                    color: '#FFFFFF', 
                    fontFamily: 'Source Sans Pro', 
                    fontSize: '18px', 
                    fontWeight:600, 
                    display:"flex",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingRight: '10px',
                    alignItems: "center",
                    position: "sticky",
                    paddingTop: "5px",
                    paddingLeft: "15px",
                }}>
                    <p>{status}</p>
                        <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>{maintenanceItemsForStatus ? maintenanceItemsForStatus.length : ( maintenanceRequestsCount ? maintenanceRequestsCount : 0 )}</span>
                </div>
            </AccordionSummary>
            {maintenanceItemsForStatus.map((item, index) => 
                <AccordionDetails key={index}>
                    <div
                        style={{
                            paddingLeft: "15px",
                            paddingRight: "15px",
                        }}
                    >
                        <Table>
                            <TableBody>
                                <TableRow onClick={() => handleRequestDetailPage(index, item.property_uid, item.maintenance_request_uid)}>
                                    <TableCell align="left">
                                        <Typography 
                                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                        >
                                            {item.property_address} {item.property_unit}
                                        </Typography>
                                    </TableCell>
                                    {/* <Divider orientation="vertical" flexItem color="white"/> */}
                                    <TableCell align="left"
                                        style={{
                                            verticalAlign: 'middle', // Vertically center the text
                                            ...tableTextStyle // Include your existing styles
                                        }}>
                                        <Typography 
                                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                        >
                                        {item.maintenance_request_type}
                                        </Typography>
                                    </TableCell>
                                    {/* <Divider orientation="vertical" color="white"/> */}
                                    <TableCell align="right">
                                        <Typography 
                                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                        >
                                            {item.maintenance_request_created_date}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Divider color="white"/>
                    </div>
                </AccordionDetails>
            )}
            </Accordion>
        </ThemeProvider>
    )
}