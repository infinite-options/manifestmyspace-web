import React from 'react';
import {
  Typography,
  Grid,
  Box,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function WorkerInvoiceView({maintenanceItem}){

    const purchaseKeys = Object.keys(maintenanceItem).filter(key => key.startsWith("pur"));
    const billKeys = Object.keys(maintenanceItem).filter(key => key.startsWith("bill"));

    return (
        
        <Grid container direction="column" columnSpacing={6} rowSpacing={6} sx={{paddingTop: "10px"}}>
            <Grid item xs={12} sx={{
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box
                    variant="contained"
                    
                    sx={{
                        flexDirection: "column",
                        backgroundColor: "#D6D5DA",
                        textTransform: "none",
                        paddingRight: "10px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "10px",
                        paddingLeft: "10px",
                        display: 'flex',
                        width: 'flex',
                    }}
                >
                    {maintenanceItem.purchase_uid && maintenanceItem.bill_uid ? (
                        <>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                                Invoice Details
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                Invoice Status: {maintenanceItem.purchase_status} 
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                Description: {maintenanceItem.pur_description}
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                Amount: ${maintenanceItem.pur_amount_due}
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                Due Date: {maintenanceItem.pur_due_date}
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                            No Invoice Created
                        </Typography>
                    )}
                </Box>
            </Grid>
        </Grid>
    )
}
