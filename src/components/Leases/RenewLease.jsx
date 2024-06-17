import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, Typography, Box, Paper, Grid } from "@mui/material";
import theme from "../../theme/theme";

export default function RenewLease({ leaseDetails, selectedLeaseId }) {
    const [currentLease, setCurrentLease] = useState("");
    const color = theme.palette.form.main;

    useEffect(() => {
        const filtered = leaseDetails.find(lease => lease.lease_uid === selectedLeaseId);
        setCurrentLease(filtered);
        console.log('In Renew Lease', leaseDetails, selectedLeaseId, currentLease);
    }, [leaseDetails, selectedLeaseId])

    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Paper
                style={{
                    marginTop: "10px",
                    backgroundColor: theme.palette.primary.main,
                    width: "100%", // Occupy full width with 25px margins on each side
                }}
            >
                <Grid container sx={{ marginTop: '15px', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item sx={12} md={12}>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.largeFont,
                                textAlign: 'center'
                            }}
                            paddingBottom="10px"
                        >
                            {currentLease.property_address} {currentLease.property_unit}, {currentLease.property_city} {currentLease.property_state} {currentLease.property_zip}
                        </Typography>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <Paper sx={{ margin: "10px", backgroundColor: color }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    textAlign: 'center'
                                }}
                                paddingBottom="10px"
                            >
                                Tenant Details
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <Paper sx={{ margin: "10px", backgroundColor: color }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    textAlign: 'center'
                                }}
                                paddingBottom="10px"
                            >
                                Fee Details
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <Paper sx={{ margin: "10px", backgroundColor: color }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    textAlign: 'center'
                                }}
                                paddingBottom="10px"
                            >
                                Documents
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <Paper sx={{ margin: "10px", backgroundColor: color }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    textAlign: 'center'
                                }}
                                paddingBottom="10px"
                            >
                                Occupants Details
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>

    );
}