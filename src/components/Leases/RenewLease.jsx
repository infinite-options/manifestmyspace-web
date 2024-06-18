import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, Typography, Box, Paper, Grid, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../theme/theme";


export default function RenewLease({ leaseDetails, selectedLeaseId }) {
    const [currentLease, setCurrentLease] = useState("");
    const [tenantWithId, setTenantWithId] = useState([]);
    const [utilities, setUtilities] = useState([]);
    const [newUtilities, setNewUtilities] = useState([]);
    const [leaseFees, setLeaseFees] = useState([]);
    const [rent, setRent] = useState([]);
    const [documents, setDocuments] = useState([]);
    const color = theme.palette.form.main;

    useEffect(() => {
        const filtered = leaseDetails.find(lease => lease.lease_uid === selectedLeaseId);
        setCurrentLease(filtered);
        console.log('In Renew Lease', leaseDetails, selectedLeaseId, currentLease);
        const tenantsRow = JSON.parse(filtered.tenants);
        setTenantWithId(tenantsRow);
        const utils = JSON.parse(filtered.property_utilities);
        setUtilities(utils);
        setNewUtilities(utils);
        const fees = JSON.parse(filtered.lease_fees);
        setLeaseFees(fees)
        const rentFee = fees.find(fee => fee.fee_name === "Rent");
        console.log('feess', rentFee)
        setRent(rentFee);
        setDocuments(JSON.parse(filtered.lease_documents));
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

    const utilitiesMap = new Map([
        ["050-000001", "Electricity"],
        ["050-000002", "Water"],
        ["050-000003", "Gas"],
        ["050-000004", "Trash"],
        ["050-000005", "Sewer"],
        ["050-000006", "Internet"],
        ["050-000007", "Cable"],
        ["050-000008", "HOA Dues"],
        ["050-000009", "Security System"],
        ["050-000010", "Pest Control"],
        ["050-000011", "Gardener"],
        ["050-000012", "Maintenance"],
    ]);

    const entitiesMap = new Map([
        ["050-000041", "owner"],
        ["050-000043", "tenant"],
    ]);

    const feesColumns = [
        {
            field: "leaseFees_uid",
            headerName: "UID",
            flex: 1,
        },
        {
            field: "fee_type",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 1,
        },
        {
            field: "fee_name",
            headerName: "Description",
            flex: 1,
        },
        {
            field: "charge",
            headerName: "Amount",
            flex: 1,
        },
        {
            field: "late_by",
            headerName: "Late",
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
                        <Paper sx={{ margin: "10px 10px 15px 10px", backgroundColor: color }}>
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
                                    rowsPerPageOptions={[5]}
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
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Box sx={{ color: "#3D5CAC", fontSize: "14px" }}>
                                <Grid container spacing={2} alignItems="center" sx={{ padding: "10px" }}>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={1} />
                                            <Grid item xs={4} />
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>CURRENT</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>NEW</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Start Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_start}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>NEW</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>End Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_end}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>NEW</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Move-In Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_move_in_date ? currentLease.lease_move_in_date : "-"}</Typography>
                                            </Grid>
                                            <Grid item xs={3} />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Move-Out Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>{currentLease.move_out_date ? currentLease.move_out_date : "-"}</Typography>
                                            </Grid>
                                            <Grid item xs={3} />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Utilities Responsibilities</Typography>
                                            </Grid>
                                            <Grid item xs={7} />

                                            <Grid item xs={5} />
                                            <Grid item xs={3}>
                                                <Grid container>
                                                    <Grid item xs={4} md={4}>
                                                        <Typography sx={{ fontSize: "14px" }}>Owner</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} md={4}>
                                                        <Typography sx={{ fontSize: "14px" }}>Tenant</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Grid container sx={{ marginBottom: "5px" }}>
                                                    <Grid item xs={4} md={4}>
                                                        <Typography sx={{ fontSize: "14px" }}>Owner</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} md={4}>
                                                        <Typography sx={{ fontSize: "14px" }}>Tenant</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {/* utilities map */}
                                            {utilities.map((utility) =>
                                                <React.Fragment key={utility.utility_type_id}>
                                                    <Grid item xs={2} />
                                                    <Grid item xs={3} container alignItems="center">
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>{utilitiesMap.get(utility.utility_type_id)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <RadioGroup
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                            name="row-radio-buttons-group"
                                                            value={utility.utility_payer_id === "050-000041" ? "owner" : "tenant"}
                                                        >
                                                            <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small" />} />
                                                            <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" />} />
                                                        </RadioGroup>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <RadioGroup
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                            name="row-radio-buttons-group"
                                                        >
                                                            <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small" />} />
                                                            <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" />} />
                                                        </RadioGroup>
                                                    </Grid>
                                                </React.Fragment>
                                            )}
                                            {/* Utilities map end */}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Rent</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>${rent.charge}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Frequency</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.frequency}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Due Date</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.due_by_date ? rent.due_by_date : "-"}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Available to Pay</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.available_topay}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee After</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.late_by}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.late_fee}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee Per Day</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.perDay_late_fee}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px" }}>NEW</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
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
                            
                            {leaseFees && 
                            <DataGrid
                                rows={leaseFees}
                                columns={feesColumns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                getRowId={(row) => row.leaseFees_uid}
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
                        }
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
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
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
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
        </Box >

    );
}