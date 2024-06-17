import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, Typography, Box, Paper, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../theme/theme";

export default function RenewLease({ leaseDetails, selectedLeaseId }) {
    const [currentLease, setCurrentLease] = useState("");
    const [tenantWithId, setTenantWithId] = useState([]);
    const color = theme.palette.form.main;

    useEffect(() => {
        const filtered = leaseDetails.find(lease => lease.lease_uid === selectedLeaseId);
        setCurrentLease(filtered);
        console.log('In Renew Lease', leaseDetails, selectedLeaseId, currentLease);
        const tenantsRow = JSON.parse(filtered.tenants);
        setTenantWithId(tenantsRow);
    }, [leaseDetails, selectedLeaseId])

    const tenantColumns = [
        {
            field: "tenant_uid",
            headerName: "UID",
            flex: 1,
        },
        {
            field: "tenant_first_name",
            headerName: "First Name",
            flex: 1,
        },
        {
            field: "tenant_last_name",
            headerName: "Last Name",
            flex: 1,
        },
        {
            field: "tenant_email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "tenant_phone_number",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "lt_responsibility",
            headerName: "Responsibility",
            flex: 1,
        },
    ]

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
                    <Grid item xs={12} md={12}>
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
                    <Grid item xs={12} md={12}>
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
                            {currentLease.tenants && currentLease.tenants.length > 0 && (
                                <DataGrid
                                    rows={tenantWithId}
                                    columns={tenantColumns}
                                    pageSize={5}
                                    pageSizeOptions={[5]}
                                    getRowId={(row) => row.tenant_uid}
                                    sx={{
                                        '& .MuiDataGrid-columnHeader': {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "#3D5CAC",
                                        },
                                        '& .MuiDataGrid-columnHeaderTitle': {
                                            font: "bold",
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: "bold",
                                        },
                                        '& .MuiDataGrid-cell': {
                                            color: "#3D5CAC",
                                            fontWeight: "bold",
                                        },

                                    }}
                                />
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
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
                    <Grid item xs={12} md={12}>
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
                    <Grid item xs={12} md={12}>
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