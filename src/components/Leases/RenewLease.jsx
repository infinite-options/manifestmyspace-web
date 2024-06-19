import React from "react";
import { useEffect, useState } from "react";
import {
    ThemeProvider, Typography, Box, Paper, Grid, FormControlLabel, Radio, RadioGroup,
    TextField, MenuItem, Button, OutlinedInput, FormControl, InputAdornment, Select
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-input": {
            border: 0,
            borderRadius: 3,
            color: "#3D5CAC",
            fontSize: 50,
        },
    },
}));

export default function RenewLease({ leaseDetails, selectedLeaseId }) {
    const classes = useStyles();
    const [currentLease, setCurrentLease] = useState("");
    const [tenantWithId, setTenantWithId] = useState([]);
    const [utilities, setUtilities] = useState([]);
    const [newUtilities, setNewUtilities] = useState([]);
    const [leaseFees, setLeaseFees] = useState([]);
    const [rent, setRent] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [remainingUtils, setRemainingUtils] = useState([]);
    const [selectedAddUtil, setSelectedAddUtil] = useState(null);
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
        console.log('utils', utils);
        const fees = JSON.parse(filtered.lease_fees);
        setLeaseFees(fees)

        const rentFee = fees.find(fee => fee.fee_name === "Rent");
        console.log('All lease fees', fees)
        console.log('rent values', rentFee)
        setRent(rentFee);

        const newUtilityIds = new Set(newUtilities.map(utility => utility.utility_type_id));
        // Create a map of items that are present in utilitiesMap but not in newUtilities
        const missingUtilitiesMap = new Map();

        for (const [key, value] of utilitiesMap) {
            if (!newUtilityIds.has(key)) {
                missingUtilitiesMap.set(key, value);
            }
        }

        setRemainingUtils(missingUtilitiesMap);
        console.log('missing', typeof (missingUtilitiesMap));
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
        ["050-000001", "electricity"],
        ["050-000002", "water"],
        ["050-000003", "gas"],
        ["050-000004", "trash"],
        ["050-000005", "sewer"],
        ["050-000006", "internet"],
        ["050-000007", "cable"],
        ["050-000008", "hoa dues"],
        ["050-000009", "security system"],
        ["050-000010", "pest control"],
        ["050-000011", "gardener"],
        ["050-000012", "maintenance"],
    ]);

    const formatUtilityName = (utility) => {
        const formattedUtility = utility.replace(/_/g, " ");
        return formattedUtility.charAt(0).toUpperCase() + formattedUtility.slice(1);
    };

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

    const onAddUtilitiesClick = () => {
        const utilityTypeId = selectedAddUtil;
        const name = utilitiesMap.get(utilityTypeId);

        // Check if the utility already exists in the newUtilities array
        const exists = newUtilities.some(util => util.utility_type_id === utilityTypeId);

        if (!exists) {
            const newUtil = {
                utility_desc: name,
                utility_payer_id: "050-000041",
                utility_type_id: utilityTypeId
            };
            console.log('Adding new util', newUtil);
            setNewUtilities(prevUtilities => [...prevUtilities, newUtil]);
            setRemainingUtils(prevUtils => {
                const newUtils = new Map(prevUtils);
                newUtils.delete(utilityTypeId);
                return newUtils;
            });
        }
    }

    const onAddUtilTextChange = (e) => {
        setSelectedAddUtil(e.target.value);
    }

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
                                        <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Start Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_start}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        value={dayjs(currentLease.lease_end).add(1, 'day')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small" // Reduce the size of the TextField
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontSize: '14px', // Adjust the font size
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        fontSize: '20px', // Adjust the icon size
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>End Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_end}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        value={dayjs()}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small" // Reduce the size of the TextField
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontSize: '14px', // Adjust the font size
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        fontSize: '20px', // Adjust the icon size
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
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
                                        <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                            <Grid item xs={1} />
                                            <Grid item xs={4}>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Move-Out Date</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        value={dayjs()}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small" // Reduce the size of the TextField
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontSize: '14px', // Adjust the font size
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        fontSize: '20px', // Adjust the icon size
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
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
                                            {newUtilities.map((newUtility, index) => {
                                                // Find the corresponding utility in newUtilities
                                                const utilityIndex = utilities.findIndex(u => u.utility_type_id === newUtility.utility_type_id);
                                                const utility = utilityIndex !== -1 ? utilities[utilityIndex] : null;
                                                console.log('map', utilityIndex, utility, newUtilities);
                                                return (
                                                    <React.Fragment key={newUtility.utility_type_id}>
                                                        <Grid item xs={2} />
                                                        <Grid item xs={3} container alignItems="center">
                                                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>{formatUtilityName(utilitiesMap.get(newUtility.utility_type_id))}</Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            {utility !== null && (
                                                                <RadioGroup
                                                                    row
                                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                                    name="row-radio-buttons-group"
                                                                    value={utility.utility_payer_id === "050-000041" ? "owner" : "tenant"}
                                                                >
                                                                    <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small" />} />
                                                                    <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" />} />
                                                                </RadioGroup>)
                                                            }
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <RadioGroup
                                                                row
                                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                                name="row-radio-buttons-group"
                                                                value={newUtility.utility_payer_id === "050-000041" ? "owner" : "tenant"}
                                                            >
                                                                <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small" />} />
                                                                <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" />} />
                                                            </RadioGroup>
                                                        </Grid>
                                                    </React.Fragment>
                                                )
                                            }
                                            )}

                                            {/* Utilities map end */}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} md={2} />
                                                <Grid item>
                                                    <TextField
                                                        id="addUtilityText"
                                                        select
                                                        label="Add Utilities"
                                                        defaultValue=""
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'visible',
                                                            textOverflow: 'clip',
                                                            width: "150px",
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#636363',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#636363',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#636363',
                                                                },
                                                            },
                                                        }}
                                                        onChange={(e) => {
                                                            onAddUtilTextChange(e)
                                                        }}
                                                    >
                                                        {remainingUtils && Array.from(remainingUtils.entries()).map(([key, value]) => (
                                                            <MenuItem key={key} value={key}>
                                                                {value}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                    <Button
                                                        sx={{
                                                            minWidth: "55px",
                                                            minHeight: "55px",
                                                            marginLeft: "5px",
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#c2c2c2',
                                                            "&:hover": {
                                                                backgroundColor: '#cfcfcf'
                                                            },
                                                        }}
                                                        onClick={onAddUtilitiesClick}
                                                    >
                                                        <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "20px" }} />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Rent</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>${rent.charge}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                            value={rent.charge}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Frequency</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.frequency}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Select
                                                        value={rent.frequency}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Select frequency"
                                                        className={classes.select}
                                                    >
                                                        <MenuItem value="One-time">One-time</MenuItem>
                                                        <MenuItem value="Weekly">Weekly</MenuItem>
                                                        <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
                                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                                        <MenuItem value="Annually">Annually</MenuItem>
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Due Date</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.due_by}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={rent.due_by}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Available to Pay</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.available_topay}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={rent.available_topay}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee After</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.late_by}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={rent.late_by}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.late_fee}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={rent.late_fee}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Late Fee Per Day</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.perDay_late_fee}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"

                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={rent.perDay_late_fee}
                                                        />
                                                    </FormControl>
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