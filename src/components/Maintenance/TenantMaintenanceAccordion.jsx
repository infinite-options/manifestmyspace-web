import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider,
    Form,
    TextField,
    Badge,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Input,
    Container,
    Radio,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    UploadFile,
    InputAdornment,
    TableCell,
    AccordionSummary,
    AppBar,
    Divider,
    TableRow,
    Table,
    TableBody,
    AccordionDetails,
    IconButton,
    Toolbar,
    Accordion,
    Avatar,
} from "@mui/material";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';


export default function TenantMaintenanceAccordion({tenantMaintenanceData, handleNewRequestButton, handleRequestDetailPage, filterToggle, handleFilterToggle}) {

    const color = "#FFFFFF"

    const tableTextStyle = {
        backgroundColor: color, 
        color: '#FFFFFF', 
        fontFamily: 'Source Sans Pro', 
        fontSize: '15px', 
        fontWeight:600,
    }


    return (
        <Grid container columnSpacing={12} rowSpacing={6}>
            <Grid item xs={3}>                                
                <Button onClick={() => handleFilterToggle()}>
                    <CalendarTodayIcon sx={{ paddingRight: "10px", color: theme.typography.common.blue, fontSize:theme.typography.mediumFont}}/>  
                    <Typography sx={{ 
                        transformText: "none",
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.mediumFont,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        {filterToggle ? "Click for last 30 days" : "View All"}
                    </Typography>
                </Button>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}
            sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                display: "flex",
            }}>
                <Button 
                    variant="contained"
                    onClick={() => handleNewRequestButton()}
                    sx={{
                        backgroundColor: theme.typography.common.blue,
                        color: "#FFFFFF",
                    }}
                >
                    <AddIcon sx={{ paddingRight: "10px", color: theme.typography.primary.white, fontSize:theme.typography.mediumFont}}/>  
                    <Typography sx={{ 
                        color: theme.typography.common.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.mediumFont,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        New Request
                    </Typography>
                </Button>
            </Grid>
            <Grid item xs={12}
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "25px",
                }}
            >
                <Typography sx={{
                    fontWeight: theme.typography.primary.fontWeight, 
                    fontSize:theme.typography.mediumFont,
                }}
                >
                        Viewing {filterToggle ? "all Requests": "last 30 days" }
                </Typography>
            </Grid>
            <Grid item xs={12}>
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
                        {/* <p>{status}</p> */}
                        {/* <span style={{float: "right", alignContent: "center", alignItems: "center"}}>{tenantMaintenanceData.length}</span> */}
                    </div>  
                </AccordionSummary>
                    {tenantMaintenanceData.map((item, index) => 
                        <AccordionDetails key={index}>
                            <div
                                style={{
                                    paddingLeft: "15px",
                                    paddingRight: "15px",
                                }}
                            >
                                <Table>
                                    <TableBody>
                                        <TableRow> {/*onClick={() => handleRequestDetailPage(item.property_uid, item.maintenance_request_uid)} */}
                                            <TableCell align="left">
                                                <Typography 
                                                    sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                                                >
                                                    {item.property_uid}
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
                                                {item.maintenance_title}
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
            </Grid>
        </Grid>
    )
}