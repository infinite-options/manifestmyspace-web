import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Button,
    Grid,
} from "@mui/material";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';

import AccordionView from '../Templates/AccordionView';
import TenantMaintenanceItem from './TenantMaintenanceItem';
import theme from '../../theme/theme';


// TO BE REMOVED

export default function TenantMaintenanceView({tenantMaintenanceData, handleNewRequestButton, handleRequestDetailPage, filterToggle, handleFilterToggle}) {

    const color = "#000000"

    const colorStatus = theme.colorStatusTenant;

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
                <AccordionView
                    colorStatusType={colorStatus}
                    data={tenantMaintenanceData}
                    ItemComponent={TenantMaintenanceItem}
                />
            </Grid>
        </Grid>
    )
}