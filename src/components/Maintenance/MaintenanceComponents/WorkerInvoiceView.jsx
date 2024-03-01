import React from 'react';
import {
  Typography,
  Grid,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function WorkerInvoiceView({maintenanceItem}){

    const purchaseKeys = Object.keys(maintenanceItem).filter(key => key.startsWith("pur"));
    const billKeys = Object.keys(maintenanceItem).filter(key => key.startsWith("bill"));

    return (
        <Grid container direction="column" columnSpacing={6} rowSpacing={6}>
            {purchaseKeys.map((item, index) => (
                <Typography key={index} sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    {maintenanceItem[item]}
                </Typography>
            ))}
            {billKeys.map((item, index) => (
                <Typography key={index} sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    {maintenanceItem[item]}
                </Typography>
            ))}
        </Grid>
    )
}
