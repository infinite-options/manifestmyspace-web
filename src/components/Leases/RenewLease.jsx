import React from "react";
import { useEffect, useState } from "react";
import {
    Typography, Box, Paper, Grid, FormControlLabel, Radio, RadioGroup,
    TextField, MenuItem, Button, OutlinedInput, FormControl, InputAdornment, Select, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, Snackbar, Alert, InputLabel
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import LeaseIcon from "../Property/leaseIcon.png";
import { v4 as uuidv4 } from 'uuid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdultOccupant from "./AdultOccupant";
import ChildrenOccupant from "./ChildrenOccupant";
import PetsOccupant from "./PetsOccupant";
import VehiclesOccupant from "./VehiclesOccupant";

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
    const [signedLease, setSignedLease] = useState(null);
    const [remainingUtils, setRemainingUtils] = useState([]);
    const [selectedAddUtil, setSelectedAddUtil] = useState(null);
    //New contract states
    const [newRent, setNewRent] = useState(null);
    const [newFreq, setNewFreq] = useState(null);
    const [newDueBy, setNewDueBy] = useState(null);
    const [newAvlToPay, setNewAvlToPay] = useState(null);
    const [newLateBy, setNewLateBy] = useState(null);
    const [newLateFee, setNewLateFee] = useState(null);
    const [newLateFeePerDay, setNewLateFeePerDay] = useState(null);
    const [newContractName, setNewContractName] = useState("");
    const [newStartDate, setNewStartDate] = useState(null);
    const [newEndDate, setNewEndDate] = useState(null);
    const [currentFeeRow, setcurrentFeeRow] = useState(null);
    const [isEditing, setIsFeeEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [leaseAdults, setLeaseAdults] = useState([]);
    const [leaseChildren, setLeaseChildren] = useState([]);
    const [leasePets, setLeasePets] = useState([]);
    const [leaseVehicles, setLeaseVehicles] = useState([]);
    const color = theme.palette.form.main;

    useEffect(() => {
        const filtered = leaseDetails.find(lease => lease.lease_uid === selectedLeaseId);
        setCurrentLease(filtered);
        console.log('In Renew Lease', leaseDetails, selectedLeaseId, filtered);
        const tenantsRow = JSON.parse(filtered.tenants);
        setTenantWithId(tenantsRow);

        //Set utilities details
        const utils = JSON.parse(filtered.property_utilities);
        setUtilities(utils);
        setNewUtilities(utils);
        console.log('utils', utils);
        const fees = JSON.parse(filtered.lease_fees);
        setLeaseFees(fees)

        // Get the rent details from the list of fees
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
        const docs = JSON.parse(filtered.lease_documents).map((doc, index) => ({
            ...doc,
            id: index
        }));

        setDocuments(docs);
        const leaseDoc = docs.find(doc => doc.description.trim().toLowerCase() === "modified unsigned lease".trim().toLowerCase());
        console.log('leaselink', leaseDoc);
        setSignedLease(leaseDoc);

        // Set all new contract values
        setNewStartDate(dayjs(filtered.lease_end).add(1, 'day'));
        setNewEndDate(dayjs(filtered.lease_end).add(1, 'year'));
        setNewRent(rentFee.charge);
        setNewContractName(filtered.contract_name);
        setNewFreq(rentFee.frequency);
        setNewDueBy(rentFee.due_by);
        setNewAvlToPay(rentFee.available_topay);
        setNewLateFee(rentFee.late_fee);
        setNewLateBy(rentFee.late_by);
        setNewLateFeePerDay(rentFee.perDay_late_fee);
        setNewLateBy(rentFee.late_by);
        const adults = JSON.parse(filtered.lease_adults);
        const children = JSON.parse(filtered.lease_children);
        const pets = JSON.parse(filtered.lease_pets);
        const vehicles = JSON.parse(filtered.lease_vehicles);
        setLeaseAdults(adults);
        setLeaseChildren(children);
        setLeasePets(pets);
        setLeaseVehicles(vehicles);
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
            field: "fee_name",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 1,
        },
        {
            field: "-",
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
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditFeeClick(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteFeeClick(params.row.leaseFees_uid)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ]

    const handleEditFeeClick = (row) => {
        setcurrentFeeRow(row);
        setIsFeeEditing(true);
        handleFeeModalOpen();
    };


    const handleDeleteFeeClick = (id) => {
        setLeaseFees(leaseFees.filter(fee => fee.leaseFees_uid !== id));
    };

    const handleAddNewFee = () => {
        console.log('add', currentFeeRow);
        const newError = {};
        if (!currentFeeRow.fee_name) newError.fee_name = "Fee Name is required";
        if (!currentFeeRow.charge) newError.charge = "Charge is required";
        if (!currentFeeRow.due_by_date) newError.due_by_date = "Due By Date is required";
        if (!currentFeeRow.frequency) newError.frequency = "Frequency is required";

        if (Object.keys(newError).length === 0) {
            if (setIsFeeEditing) {
                setLeaseFees(leaseFees.map(fee => (fee.leaseFees_uid === currentFeeRow.leaseFees_uid ? currentFeeRow : fee)));
                // if (currentFeeRow.fee_name === "Rent") {
                //     setRent(currentFeeRow);
                // }
            } else {
                setLeaseFees([...leaseFees, { ...currentFeeRow, lease_uid: uuidv4() }]);
            }
            handleFeeModalClose();

        } else {
            setSnackbarOpen(true);
        };

    }

    const handleFeeModalOpen = () => setOpen(true);
    const handleFeeModalClose = () => setOpen(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const docsColumns = [
        {
            field: "id",
            headerName: "UID",
            flex: 0.5,
        },
        {
            field: "description",
            headerName: "Document",
            flex: 1,
        },
        {
            field: "created_date",
            headerName: "Date Added",
            flex: 1,
        },
        {
            field: "link",
            headerName: "Action",
            flex: 0.5,
            renderCell: (params) => {
                // console.log('params', params);
                return (
                    <Button
                        sx={{
                            padding: "0px",
                            '&:hover': {
                                backgroundColor: theme.palette.form.main,
                            },
                        }}
                        className=".MuiButton-icon"
                        onClick={() =>
                            window.open(params.value, "_blank", "rel=noopener noreferrer")
                        }
                    >
                        <img src={LeaseIcon} />
                    </Button>
                )
            },
        },
    ]

    const onAddUtilitiesClick = () => {
        const utilityTypeId = selectedAddUtil;
        console.log('utilityTypeId', utilityTypeId);
        if (utilityTypeId !== null) {
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
    }

    const onAddUtilTextChange = (e) => {
        setSelectedAddUtil(e.target.value);
    }

    const handleNewUtilityChange = (e, newUtility, utilityIndex) => {
        console.log('change', utilityIndex, newUtility);
        const { value } = e.target;
        setNewUtilities((prevUtilities) => {
          const updatedUtilities = [...prevUtilities];
          const toChange = {...updatedUtilities[utilityIndex],  utility_payer_id: value === 'owner' ? '050-000041' : '050-000043'};
          updatedUtilities[utilityIndex] = toChange;
          console.log('updated util', updatedUtilities);
          return updatedUtilities;
        });
      };

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
                <Grid container sx={{ marginTop: '15px', marginBottom: '15px', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10px" }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                    textAlign: 'center'
                                }}
                            >
                                {currentLease.property_address} {currentLease.property_unit}, {currentLease.property_city} {currentLease.property_state} {currentLease.property_zip}
                            </Typography>
                            {signedLease !== null && <Button
                                sx={{
                                    padding: "0px",
                                    '&:hover': {
                                        backgroundColor: theme.palette.form.main,
                                    },
                                }}
                                className=".MuiButton-icon"
                                onClick={() =>
                                    window.open(signedLease.link, "_blank", "rel=noopener noreferrer")
                                }
                            >
                                <img src={LeaseIcon} />
                            </Button>}
                        </Box>
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
                                paddingTop="5px"
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
                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>Contract Name</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.contract_name}</Typography>
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
                                                        value={newContractName}
                                                        onChange={e => setNewContractName(e.target.name)}
                                                    />
                                                </FormControl>
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
                                                        value={newStartDate}
                                                        onChange={e => setNewStartDate(e.target.value)}
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
                                                        value={newEndDate}
                                                        onChange={e => setNewEndDate(e.target.value)}
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
                                                        // onChange={e => setNewMDate(e.target.value)}
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
                                            {newUtilities && newUtilities.map((newUtility, index) => {
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
                                                                onChange={(e, newUtility, utilityIndex) => handleNewUtilityChange(e, newUtility, index)}
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
                                                <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Box sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <TextField
                                                            id="addUtilityText"
                                                            select
                                                            label="Add Utility"
                                                            textAlign="center"
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'visible',
                                                                textOverflow: 'clip',
                                                                width: "150px",
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '40px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '& .MuiInputLabel-root': {
                                                                        top: '50%',
                                                                        transform: 'translateY(-50%)',
                                                                        textAlign: 'center',
                                                                    },
                                                                    '& fieldset': {
                                                                        borderColor: '#6e6e6e',
                                                                    },
                                                                    '&:hover fieldset': {
                                                                        borderColor: '#6e6e6e',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: '#6e6e6e',
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
                                                                minWidth: "40px",
                                                                minHeight: "40px",
                                                                marginLeft: "5px",
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#3D5CAC',
                                                                "&:hover": {
                                                                    backgroundColor: '#3D5CAC'
                                                                },
                                                            }}
                                                            onClick={onAddUtilitiesClick}
                                                        >
                                                            <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                                                        </Button>
                                                    </Box>
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
                                                            value={newRent}
                                                            onChange={e => setNewRent(e.target.value)}
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
                                                    {newFreq &&
                                                        <Select
                                                            value={newFreq}
                                                            size="small"
                                                            fullWidth
                                                            placeholder="Select frequency"
                                                            className={classes.select}
                                                            sx={{ fontSize: "14px" }}
                                                            onChange={e => setNewFreq(e.target.value)}
                                                        >
                                                            <MenuItem value="One-time">One-time</MenuItem>
                                                            <MenuItem value="Weekly">Weekly</MenuItem>
                                                            <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
                                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                                            <MenuItem value="Annually">Annually</MenuItem>
                                                        </Select>
                                                    }
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
                                                            value={newDueBy}
                                                            onChange={e => setNewDueBy(e.target.value)}
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
                                                        <InputLabel htmlFor="outlined-adornment-weight" sx={{ color: '#787878' }}>
                                                            Days Before
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"
                                                            label="Days Befores"
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{ height: "42px", fontSize: "14px" }}
                                                            value={newAvlToPay}
                                                            onChange={e => setNewAvlToPay(e.target.value)}
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
                                                        <InputLabel htmlFor="outlined-adornment-weight" sx={{ color: '#787878' }}>
                                                            Days After
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-weight"
                                                            label="Days After"
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight',
                                                            }}
                                                            sx={{
                                                                height: "42px", fontSize: "14px", '& .MuiInputLabel-root': {
                                                                    color: '#ffffff',
                                                                },
                                                            }}
                                                            value={newLateBy}
                                                            onChange={e => setNewLateBy(e.target.value)}
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
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{newLateFee}</Typography>
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
                                                            onChange={e => setNewLateFee(e.target.value)}
                                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
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
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{newLateFeePerDay}</Typography>
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
                                                            value={newLateFeePerDay}
                                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                            onChange={e => setNewLateFeePerDay(e.target.value)}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Typography
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.primary.fontWeight,
                                        fontSize: theme.typography.small,
                                        textAlign: 'center',
                                        paddingBottom: "10px",
                                        paddingTop: "5px",
                                        flexGrow: 1,
                                    }}
                                >
                                    Fee Details
                                </Typography>
                                <Button variant="outlined"
                                    sx={{
                                        background: "#3D5CAC",
                                        color: theme.palette.background.default,
                                        cursor: "pointer",
                                        textTransform: "none",
                                        minWidth: "40px",
                                        minHeight: "40px",
                                        width: "40px",
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        marginBottom: "5px",
                                    }}
                                    size="small"
                                    onClick={() => {
                                        setcurrentFeeRow({
                                            fee_Type: '',
                                            available_topay: '',
                                            charge: '',
                                            due_by: '',
                                            due_by_date: dayjs(),
                                            fee_name: '',
                                            fee_type: '',
                                            frequency: '',
                                            late_by: '',
                                            late_fee: '',
                                            perDay_late_fee: '',
                                        });
                                        setIsFeeEditing(false);
                                        handleFeeModalOpen();
                                    }}>
                                    <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                                </Button>
                            </Box>

                            {leaseFees && <>
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
                                <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                    <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                                        Please fill in all required fields.
                                    </Alert>
                                </Snackbar>
                                <Dialog open={open} onClose={handleFeeModalClose}>
                                    <DialogTitle>{isEditing ? 'Edit Fee' : 'Add Fee'}</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            margin="dense"
                                            label="Fee Name"
                                            fullWidth
                                            required
                                            variant="outlined"
                                            value={currentFeeRow?.fee_name || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, fee_name: e.target.value })}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Charge"
                                            fullWidth
                                            required
                                            variant="outlined"
                                            value={currentFeeRow?.charge || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, charge: e.target.value })}
                                        />
                                        <FormControl fullWidth sx={{ marginTop: "10px" }}>
                                            <InputLabel sx={{ color: theme.palette.grey }}>Frequency *</InputLabel>
                                            <Select
                                                value={currentFeeRow?.frequency || ''}
                                                onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, frequency: e.target.value })}
                                                size="small"
                                                fullWidth
                                                label="Frequency"
                                                className={classes.select}
                                                sx={{
                                                    marginTop: "10px",
                                                }}
                                                required
                                            >
                                                <MenuItem value="One-time">One-time</MenuItem>
                                                <MenuItem value="Weekly">Weekly</MenuItem>
                                                <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
                                                <MenuItem value="Monthly">Monthly</MenuItem>
                                                <MenuItem value="Annually">Annually</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Due By *"
                                                value={currentFeeRow?.due_by_date ? dayjs(currentFeeRow.due_by_date) : null}
                                                onChange={(e) => {
                                                    // console.log('dueby row', e)
                                                    const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                    setcurrentFeeRow({ ...currentFeeRow, due_by_date: formattedDate })
                                                }
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        required
                                                        {...params}
                                                        size="small"
                                                        sx={{
                                                            '& .MuiInputBase-root': {
                                                                fontSize: '14px',
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: '20px',
                                                            },
                                                        }}
                                                    />
                                                )}
                                                sx={{ marginTop: "10px" }}
                                            />
                                        </LocalizationProvider>

                                        <TextField
                                            margin="dense"
                                            label="Available To Pay (Days Before)"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.available_topay || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, available_topay: e.target.value })}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Late By (Days After)"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.late_by || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_by: e.target.value })}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Late Fee"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.late_fee || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_fee: e.target.value })}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Late Fee Per Day"
                                            fullWidth
                                            variant="outlined"
                                            value={currentFeeRow?.perDay_late_fee || ''}
                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, perDay_late_fee: e.target.value })}
                                        />
                                    </DialogContent>
                                    <DialogActions sx={{ alignContent: "center", justifyContent: "center" }}>
                                        <Button variant="outlined"
                                            sx={{
                                                background: "#3D5CAC",
                                                color: theme.palette.background.default,
                                                cursor: "pointer",
                                                textTransform: "none",
                                                width: "30%",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}
                                            size="small" onClick={handleFeeModalClose}>
                                            Cancel
                                        </Button>
                                        <Button variant="outlined"
                                            sx={{
                                                background: "#3D5CAC",
                                                color: theme.palette.background.default,
                                                cursor: "pointer",
                                                textTransform: "none",
                                                width: "30%",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}
                                            size="small"
                                            onClick={handleAddNewFee}>
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Typography
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.primary.fontWeight,
                                        fontSize: theme.typography.small,
                                        textAlign: 'center',
                                        paddingBottom: "10px",
                                        paddingTop: "5px",
                                        flexGrow: 1,
                                    }}
                                    paddingTop="5px"
                                    paddingBottom="10px"
                                >
                                    Documents
                                </Typography>
                                {/* <Button variant="outlined"
                                    sx={{
                                        background: "#3D5CAC",
                                        color: theme.palette.background.default,
                                        cursor: "pointer",
                                        textTransform: "none",
                                        minWidth: "40px",
                                        minHeight: "40px",
                                        width: "40px",
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        marginBottom: "5px",
                                    }}
                                    size="small"
                                    onClick={() => {
                                        setcurrentFeeRow({
                                            fee_Type: '',
                                            available_topay: '',
                                            charge: '',
                                            due_by: '',
                                            due_by_date: dayjs(),
                                            fee_name: '',
                                            fee_type: '',
                                            frequency: '',
                                            late_by: '',
                                            late_fee: '',
                                            perDay_late_fee: '',
                                        });
                                        setIsFeeEditing(false);
                                        handleFeeModalOpen();
                                    }}>
                                    <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                                </Button> */}
                            </Box>
                            <DataGrid
                                rows={documents}
                                columns={docsColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                getRowId={(row) => row.id}
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
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    textAlign: 'center',
                                    paddingBottom: "10px",
                                    paddingTop: "5px",
                                    flexGrow: 1,
                                }}
                                paddingTop="5px"
                                paddingBottom="10px"
                            >
                                Occupants Details
                            </Typography>
                            {leaseAdults &&
                                <AdultOccupant leaseAdults={leaseAdults} setLeaseAdults={setLeaseAdults} />
                            }
                            {leaseChildren &&
                                <ChildrenOccupant leaseChildren={leaseChildren} setLeaseChildren={setLeaseChildren} />
                            }
                            {leasePets &&
                                <PetsOccupant leasePets={leasePets} setLeasePets={setLeasePets} />
                            }
                             {leaseVehicles &&
                                <VehiclesOccupant leaseVehicles={leaseVehicles} setLeaseVehicles={setLeaseVehicles} />
                            }
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Grid container sx={{ alignItems: "center", justifyContent: "center" }} spacing={2}>
                            <Grid item md={6} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        background: "#D4736D",
                                        color: theme.palette.background.default,
                                        cursor: "pointer",
                                        textTransform: "none",
                                        minWidth: "150px",
                                        minHeight: "35px",
                                        width: "95%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        '&:hover': {
                                            background: '#DEA19C',
                                        },
                                    }}
                                    size="small"
                                >
                                    <Typography sx={{
                                        textTransform: "none",
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        whiteSpace: "nowrap",
                                        marginLeft: "1%",
                                    }}>
                                        {"End Lease"}
                                    </Typography>
                                </Button>
                            </Grid>

                            <Grid item md={6} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        background: "#6788B3",
                                        color: theme.palette.background.default,
                                        cursor: "pointer",
                                        textTransform: "none",
                                        minWidth: "150px",
                                        minHeight: "35px",
                                        width: "95%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        '&:hover': {
                                            background: '#92A9CB',
                                        },
                                    }}
                                    size="small"
                                >
                                    <Typography sx={{
                                        textTransform: "none",
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        whiteSpace: "nowrap",
                                        marginLeft: "1%",
                                    }}>
                                        {"Renew Lease"}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box >

    );
}