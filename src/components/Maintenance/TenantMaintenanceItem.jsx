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
    TableCell,
    TableRow,
    TableBody,
    Table,
    Divider
} from "@mui/material";
import theme from '../../theme/theme';

export default function TenantMaintenanceItem({color, request}){
    
    const location = useLocation();
    let navigate = useNavigate();

    const tableTextStyle = {
        backgroundColor: color, 
        color: '#FFFFFF', 
        fontFamily: 'Source Sans Pro', 
        fontSize: '15px', 
        fontWeight:600,
    }

    function handleRequestDetailPage(maintenance_request_uid, color){
        // console.log("handleRequestDetailPage", property_uid, maintenance_request_uid)
        // navigate(`/app/tenantmaintenance/${property_uid}/${maintenance_request_uid}`)
        console.log("handleRequestDetailPage color:", color)
        navigate(`/tenantMaintenanceItem/${maintenance_request_uid}`, {
            state: {
                request, 
                color
            }
        })
    }

    return (
        <div
            style={{
                paddingLeft: "15px",
                paddingRight: "15px",
            }}
        >
            <Table>
                <TableBody>
                    <TableRow onClick={() => handleRequestDetailPage(request.maintenance_request_uid, color)}>
                        <TableCell align="left">
                            <Typography 
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                            >
                                {request.maintenance_request_uid}
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
                            {request.maintenance_title}
                            </Typography>
                        </TableCell>
                        {/* <Divider orientation="vertical" color="white"/> */}
                        <TableCell align="right">
                            <Typography 
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "16px"}}
                            >
                                {request.maintenance_request_created_date}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Divider color="white"/>
        </div>
    )
}