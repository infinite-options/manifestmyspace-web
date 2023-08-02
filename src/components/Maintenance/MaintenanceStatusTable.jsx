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



export default function MaintenanceStatusTable({status, data, color, allData}){
    const location = useLocation();
    let navigate = useNavigate();

    const tableTextStyle = {
        backgroundColor: color, 
        color: '#FFFFFF', 
        fontFamily: 'Source Sans Pro', 
        fontSize: '15px', 
        fontWeight:600,
    }

    function handleRequestDetailPage(property_uid, maintenance_request_uid){
        console.log("handleRequestDetailPage", property_uid, maintenance_request_uid)
        navigate('/maintenanceRequestDetail/' + maintenance_request_uid, {state: {data, status, allData}})
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
                    <span style={{float: "right", alignContent: "center", alignItems: "center"}}>{data.length}</span>
                </div>  
            </AccordionSummary>
            {data.map((item, index) => 
                <AccordionDetails key={index}>
                    <div
                        style={{
                            paddingLeft: "15px",
                            paddingRight: "15px",
                        }}
                    >
                        <Table>
                            <TableBody>
                                <TableRow onClick={() => handleRequestDetailPage(item.property_uid, item.maintenance_request_uid)}>
                                    <TableCell align="left">
                                    <Typography 
                                        sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                    >
                                        {item.property_uid}
                                    </Typography>
                                    </TableCell>
                                    <TableCell align="left"
                                        style={{
                                            verticalAlign: 'middle', // Vertically center the text
                                            ...tableTextStyle // Include your existing styles
                                        }}>
                                        <Typography 
                                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                        >
                                        {item.request_type}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography 
                                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                        >
                                            {item.request_created_date}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Divider />
                    </div>
                </AccordionDetails>
            )}
            </Accordion>
        </ThemeProvider>
    )
}