import React from "react";
import { useEffect, useState, useRef } from "react";
import {
    Typography, Box, Paper, Grid, FormControlLabel, Radio, RadioGroup,
    TextField, MenuItem, Button, OutlinedInput, FormControl, InputAdornment, Select, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, Snackbar, Alert, InputLabel, Accordion, AccordionSummary, AccordionDetails
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
import EndLeaseButton from "./EndLeaseButton";
import Documents from "./Documents";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import RenewLeaseButton from "./RenewLeaseButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import APIConfig from '../../utils/APIConfig';

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
    const { selectedRole } = useUser();
    //New contract states
    const [newRent, setNewRent] = useState(null);
    const [newFreq, setNewFreq] = useState(null);
    const [newDueBy, setNewDueBy] = useState(null);
    const [newAvlToPay, setNewAvlToPay] = useState(null);
    const [newLateBy, setNewLateBy] = useState(null);
    const [newLateFee, setNewLateFee] = useState(null);
    const [newLateFeePerDay, setNewLateFeePerDay] = useState(null);
    const [newStartDate, setNewStartDate] = useState(null);
    const [newEndDate, setNewEndDate] = useState(null);
    const [moveoutDate, setMoveoutDate] = useState(null);
    const [currentFeeRow, setcurrentFeeRow] = useState(null);
    const [isEditing, setIsFeeEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [open, setOpen] = useState(false);
    const [leaseAdults, setLeaseAdults] = useState([]);
    const [leaseChildren, setLeaseChildren] = useState([]);
    const [leasePets, setLeasePets] = useState([]);
    const [leaseVehicles, setLeaseVehicles] = useState([]);
    const color = theme.palette.form.main;
    const [relationships, setRelationships] = useState([]);
    const [states, setStates] = useState([]);
    const [endLeaseStatus, setEndLeaseStatus] = useState("");
    const [isRenewNeeded, setIsRenewNeeded] = useState(false);
    const alertRef = useRef(null);
    const [uploadedFiles, setuploadedFiles] = useState([]);
    const [isPageUpdateOrRenew, setIsPageUpdateOrRenew] = useState(false);
    const [tenantUtils, setTenantUtils] = useState("");

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
        const tenantUtils = utils
            .filter((util) => util.utility_payer_id === "050-000043")
            .map((util) => util.utility_desc)
            .join(", ");
        setTenantUtils(tenantUtils)
        console.log('tenantUtils', tenantUtils);

        //Set fees details
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

        console.log('initial docs', docs);
        setDocuments(docs);
        const leaseDoc = docs.find(doc => doc.type && doc.type === "Lease Contract");
        console.log('leaselink', leaseDoc);
        setSignedLease(leaseDoc);

        // Set all new contract values
        setMoveoutDate(dayjs(filtered.lease_end));
        setNewStartDate(dayjs(filtered.lease_end).add(1, 'day'));
        setNewEndDate(dayjs(filtered.lease_end).add(1, 'year'));
        setNewRent(rentFee.charge);
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
        getListDetails();
    }, [leaseDetails, selectedLeaseId])

    useEffect(() => {
        if (snackbarOpen && alertRef.current) {
            alertRef.current.focus();
        }
    }, [snackbarOpen]);

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
            if (isEditing === true) {
                setLeaseFees(leaseFees.map(fee => (fee.leaseFees_uid === currentFeeRow.leaseFees_uid ? currentFeeRow : fee)));
                // if (currentFeeRow.fee_name === "Rent") {
                //     setRent(currentFeeRow);
                // }
                setIsRenewNeeded(true);
            } else {
                setLeaseFees([...leaseFees, { ...currentFeeRow, lease_uid: uuidv4() }]);
                setIsRenewNeeded(true);
            }
            handleFeeModalClose();

        } else {
            showSnackbar("Kindly enter all the required fields", "error");
            setSnackbarOpen(true);
        };

    }

    const handleFeeModalOpen = () => setOpen(true);
    const handleFeeModalClose = () => setOpen(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
                setIsRenewNeeded(true);
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
            const toChange = { ...updatedUtilities[utilityIndex], utility_payer_id: value === 'owner' ? '050-000041' : '050-000043' };
            updatedUtilities[utilityIndex] = toChange;
            console.log('updated util', updatedUtilities);
            return updatedUtilities;
        });
        setIsRenewNeeded(true);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        console.log('check date', dateString, date)
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    const handleEndLease = () => {
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "*",
        };

        const leaseApplicationFormData = new FormData();
        const formattedMoveOutDate = formatDate(moveoutDate);;
        leaseApplicationFormData.append("lease_uid", currentLease.lease_uid);
        leaseApplicationFormData.append("move_out_date", formattedMoveOutDate);
        leaseApplicationFormData.append("lease_status", endLeaseStatus);
        if (endLeaseStatus === "EARLY TERMINATION") {
            const currentDate = new Date();
            const currentDateFormatted = dayjs(currentDate).format("MM-DD-YYYY");
            leaseApplicationFormData.append("lease_early_end_date", currentDateFormatted);
        }

        console.log('formattedMoveOutDate', formattedMoveOutDate, typeof (formattedMoveOutDate))
        console.log('end form', leaseApplicationFormData);
        axios
            .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication", leaseApplicationFormData, headers)
            .then((response) => {
                console.log("Data updated successfully", response);
                showSnackbar(`Your lease has been moved to ${endLeaseStatus} status.`, "success");
            })
            .catch((error) => {
                if (error.response) {
                    showSnackbar("Cannot End the lease. Please Try Again", "error");
                    console.log(error.response.data);
                }
            });
    }

    const handleRenewLease = async () => {
        try {
            //Renew the lease by creating a new lease row in DB with lease status - "PROCESSING" if requested by Manager 
            //or "NEW" if requested by tenant
            console.log(uploadedFiles);
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "*",
            };
            console.log('tenantWithId', tenantWithId, typeof (tenantWithId));
            // Renew for all tenants in tenants list
            for (let i = 0; i < tenantWithId.length; i++) {
                const leaseApplicationFormData = new FormData();
                let date = new Date()

                leaseApplicationFormData.append('lease_property_id', currentLease.property_uid);
                leaseApplicationFormData.append("lease_start", formatDate(newStartDate));
                leaseApplicationFormData.append("lease_end", formatDate(newEndDate));
                leaseApplicationFormData.append("lease_end_notice_period", currentLease.lease_end_notice_period);
                leaseApplicationFormData.append('lease_assigned_contacts', currentLease.lease_assigned_contacts);
                //leaseApplicationFormData.append('lease_documents', documents ? JSON.stringify(documents) : null);
                leaseApplicationFormData.append('lease_adults', leaseAdults ? JSON.stringify(leaseAdults) : null);
                leaseApplicationFormData.append('lease_children', leaseChildren ? JSON.stringify(leaseChildren) : null);
                leaseApplicationFormData.append('lease_pets', leasePets ? JSON.stringify(leasePets) : null);
                leaseApplicationFormData.append('lease_vehicles', leaseVehicles ? JSON.stringify(leaseVehicles) : null);
                leaseApplicationFormData.append('lease_application_date', formatDate(date.toLocaleDateString()));
                leaseApplicationFormData.append('tenant_uid', tenantWithId[i].tenant_uid);
                leaseApplicationFormData.append('lease_referred', currentLease.lease_referred)
                leaseApplicationFormData.append("lease_move_in_date", currentLease.lease_move_in_date);
                leaseApplicationFormData.append("property_listed_rent", newRent);
                leaseApplicationFormData.append("frequency", newFreq);
                const feesJSON = JSON.stringify(leaseFees)
                leaseApplicationFormData.append("lease_fees", feesJSON);

                if (selectedRole === "MANAGER") {
                    leaseApplicationFormData.append('lease_status', "PROCESSING");
                } else {
                    leaseApplicationFormData.append('lease_status', "NEW");
                }

                if (uploadedFiles.length) {
                    const documentsDetails = [];
                    [...uploadedFiles].forEach((file, i) => {
                        leaseApplicationFormData.append(`file-${i}`, file, file.name);
                        // const fileType = contractFileTypes[i] || '';
                        const fileType = 'pdf';
                        const documentObject = {
                            // file: file,
                            fileIndex: i,
                            fileName: file.name,
                            fileType: fileType,
                            type: "Lease Agreement",
                        };
                        documentsDetails.push(documentObject);
                    });
                    leaseApplicationFormData.append("lease_documents", JSON.stringify(documentsDetails));
                }

                axios.post('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
                    .then((response) => {
                        console.log('Data updated successfully');
                        showSnackbar("Successfully Renewed the lease.", "success");
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.log(error.response.data);
                            showSnackbar("Cannot Renew the lease. Please Try Again", "error");
                        }
                    });
            }
        } catch (error) {
            console.log("Cannot Renew the lease");
        }
    }

    const handlePageToggle = () => {
        setIsPageUpdateOrRenew(true);
    }

    const updateLease = async () => {
        try {
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "*",
            };

            if (isRenewNeeded) {
                //step 1 - END the current lease

                const leaseApplicationFormData = new FormData();
                const formattedMoveOutDate = formatDate(moveoutDate);;
                leaseApplicationFormData.append("lease_uid", currentLease.lease_uid);
                leaseApplicationFormData.append("lease_status", "ENDED");

                console.log('formattedMoveOutDate', formattedMoveOutDate, typeof (formattedMoveOutDate))
                console.log('end form', leaseApplicationFormData);
                axios
                    .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication", leaseApplicationFormData, headers)
                    .then((response) => {
                        console.log("Data updated successfully", response);
                    })
                    .catch((error) => {
                        if (error.response) {
                            showSnackbar("Cannot Update the lease. Please Try Again", "error");
                            console.log(error.response.data);
                        }
                    });

                //Step 2 - Create a new row for the lease
                handleRenewLease();
            } else {
                for (let i = 0; i < tenantWithId.length; i++) {
                    const leaseApplicationFormData = new FormData();

                    leaseApplicationFormData.append('lease_documents', documents ? JSON.stringify(documents) : null);
                    const feesJSON = JSON.stringify(leaseFees)
                    leaseApplicationFormData.append("lease_fees", feesJSON);

                    axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
                        .then((response) => {
                            console.log('Data updated successfully');
                            showSnackbar("Successfully Updated the lease.", "success");
                        })
                        .catch((error) => {
                            if (error.response) {
                                console.log(error.response.data);
                                showSnackbar("Cannot Update the lease. Please Try Again", "error");
                            }
                        });
                }
            }
        } catch (error) {
            console.log("Cannot Update the lease");
        }
    }

    const showSnackbar = (message, severity) => {
        console.log('Inside show snackbar');
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const getListDetails = async () => {
        try {
            const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
            if (!response.ok) {
                console.log("Error fetching lists data");
            }
            const responseJson = await response.json();
            const relationships = responseJson.result.filter(res => res.list_category === "relationships");
            const states = responseJson.result.filter(res => res.list_category === "states");
            setRelationships(relationships);
            setStates(states);
        } catch (error) {
            console.log(error);
        }
    }

    const getDateAdornmentString = (d) => {
        if (d === null || d === 0) return "";
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
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
                            {signedLease && <Button
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
                    {isPageUpdateOrRenew === false &&
                        <>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ margin: "10px 5px 10px 10px", backgroundColor: color, paddingBottom: "10px" }}>
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
                                        Lease Details
                                    </Typography>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Start Date</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_start}</Typography>
                                        </Grid>

                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>End Date</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{formatDate(currentLease.lease_end)}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Move-In Date</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_move_in_date}</Typography>
                                        </Grid>

                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Move-Out Date</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.move_out_date ? currentLease.move_out_date : "-"}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={1} />
                                        <Grid item md={11}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Utilities Paid By Tenant</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{tenantUtils}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ margin: "10px 10px 10px 5px", backgroundColor: color, paddingBottom: "10px" }}>
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
                                        Rent Details
                                    </Typography>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Rent</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>${rent.charge}</Typography>
                                        </Grid>

                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Frequency</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.frequency}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Due Date</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.due_by} {getDateAdornmentString(rent.due_by)}</Typography>
                                        </Grid>

                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Available To Pay</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.available_topay} Days Before</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Late Fee After</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>{rent.late_by} Days</Typography>
                                        </Grid>

                                        <Grid item md={5}>
                                            <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Late Fee Per Day</Typography>
                                            <Typography sx={{ fontSize: "14px", color: "black" }}>${rent.perDay_late_fee}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </>}

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
                                paddingTop="5px"
                            >
                                Tenant Details
                            </Typography>
                            {currentLease.tenants && currentLease.tenants.length > 0 && (
                                <DataGrid
                                    rows={tenantWithId}
                                    columns={tenantColumns}
                                    hideFooterPagination={true}
                                    rowsPerPageOptions={[]}
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
                    {isPageUpdateOrRenew === true &&
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
                                                            value={newStartDate}
                                                            onChange={e => {
                                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                setNewStartDate(dayjs(formattedDate));
                                                                setIsRenewNeeded(true);
                                                            }}
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
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{formatDate(currentLease.lease_end)}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            value={newEndDate}
                                                            onChange={e => {
                                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                setNewEndDate(dayjs(formattedDate));
                                                                setIsRenewNeeded(true);
                                                            }
                                                            }
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
                                                    <Typography sx={{ fontSize: "14px", color: "black" }}>{currentLease.lease_move_in_date ? formatDate(currentLease.lease_move_in_date) : "-"}</Typography>
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
                                                            value={moveoutDate}
                                                            onChange={e => {
                                                                const formattedDate = e ? e.format("MM-DD-YYYY") : null;
                                                                setMoveoutDate(dayjs(formattedDate));
                                                                setIsRenewNeeded(true);
                                                            }}
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
                                                                    "&:hover, &:focus, &:active": { background: theme.palette.primary.main }
                                                                }}
                                                                onClick={onAddUtilitiesClick}
                                                            >
                                                                <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
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
                                                                onChange={e => {
                                                                    setNewRent(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }
                                                                }
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
                                                                onChange={e => {
                                                                    setNewFreq(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }
                                                                }
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
                                                                onChange={e => {
                                                                    setNewDueBy(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }}
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
                                                                onChange={e => { setNewAvlToPay(e.target.value); setIsRenewNeeded(true); }}
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
                                                                onChange={e => {
                                                                    setNewLateBy(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }}
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
                                                                onChange={e => {
                                                                    setNewLateFee(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }}
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
                                                                onChange={e => {
                                                                    setNewLateFeePerDay(e.target.value);
                                                                    setIsRenewNeeded(true);
                                                                }}
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
                    }
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Accordion sx={{ backgroundColor: color }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="occupants-content"
                                    id="occupants-header"
                                >
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
                                                paddingLeft: "50px"
                                            }}
                                        >
                                            Fee Details
                                        </Typography>
                                        <Button variant="outlined"
                                            sx={{
                                                // background: "#3D5CAC",
                                                // color: theme.palette.background.default,
                                                "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                                                cursor: "pointer",
                                                textTransform: "none",
                                                minWidth: "40px",
                                                minHeight: "40px",
                                                width: "40px",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}
                                            size="small"
                                            onClick={() => {
                                                setcurrentFeeRow({
                                                    fee_Type: '$',
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
                                            <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                                        </Button>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>

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
                                            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                                                {snackbarMessage}
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
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Documents documents={documents} setDocuments={setDocuments}
                                uploadedFiles={uploadedFiles} setuploadedFiles={setuploadedFiles} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Accordion sx={{ backgroundColor: color }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="occupants-content"
                                    id="occupants-header"
                                >
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary.black,
                                            fontWeight: theme.typography.primary.fontWeight,
                                            fontSize: theme.typography.small,
                                            textAlign: 'center',
                                            paddingBottom: "10px",
                                            paddingTop: "5px",
                                            flexGrow: 1,
                                            paddingLeft: "50px",
                                        }}
                                        paddingTop="5px"
                                        paddingBottom="10px"
                                    >
                                        Occupants Details
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {leaseAdults &&
                                        <AdultOccupant leaseAdults={leaseAdults} setLeaseAdults={setLeaseAdults} relationships={relationships} />
                                    }
                                    {leaseChildren &&
                                        <ChildrenOccupant leaseChildren={leaseChildren} setLeaseChildren={setLeaseChildren} relationships={relationships} />
                                    }
                                    {leasePets &&
                                        <PetsOccupant leasePets={leasePets} setLeasePets={setLeasePets} />
                                    }
                                    {leaseVehicles &&
                                        <VehiclesOccupant leaseVehicles={leaseVehicles} setLeaseVehicles={setLeaseVehicles} states={states} />
                                    }
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid>

                    {isPageUpdateOrRenew === false &&
                        <Grid item xs={12} md={12}>
                            <Grid container sx={{ alignItems: "center", justifyContent: "center" }} spacing={2}>
                                <Grid item xs={4} md={4} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            background: "#6788B3",
                                            color: theme.palette.background.default,
                                            cursor: "pointer",
                                            textTransform: "none",
                                            minWidth: "150px",
                                            minHeight: "35px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            '&:hover': {
                                                background: '#9ab0cd',
                                            },
                                        }}
                                        size="small"
                                        onClick={handlePageToggle}
                                    >
                                        <Typography sx={{
                                            textTransform: "none",
                                            color: theme.typography.primary.black,
                                            fontWeight: theme.typography.secondary.fontWeight,
                                            fontSize: theme.typography.smallFont,
                                            whiteSpace: "nowrap",
                                            marginLeft: "1%",
                                        }}>
                                            {"Edit/Update"}
                                        </Typography>
                                    </Button>
                                </Grid>

                                <Grid item xs={4} md={4} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <Button
                                        variant="outlined"
                                        sx={{
                                            background: "#ffa500",
                                            color: theme.palette.background.default,
                                            cursor: "pointer",
                                            textTransform: "none",
                                            minWidth: "150px",
                                            minHeight: "35px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            '&:hover': {
                                                background: '#ffc04d',
                                            },
                                        }}
                                        size="small"
                                        onClick={handlePageToggle}
                                    >
                                        <Typography sx={{
                                            textTransform: "none",
                                            color: theme.typography.primary.black,
                                            fontWeight: theme.typography.secondary.fontWeight,
                                            fontSize: theme.typography.smallFont,
                                            whiteSpace: "nowrap",
                                            marginLeft: "1%",
                                        }}>
                                            {"Renew"}
                                        </Typography>
                                    </Button>
                                </Grid>

                                <Grid item xs={4} md={4} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                    <EndLeaseButton theme={theme} handleEndLease={handleEndLease}
                                        moveoutDate={moveoutDate} leaseData={currentLease} setEndLeaseStatus={setEndLeaseStatus} isTerminate={false} />
                                </Grid>

                                {/* <Grid item md={3} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <EndLeaseButton theme={theme} handleEndLease={handleEndLease}
                                    moveoutDate={moveoutDate} leaseData={currentLease} setEndLeaseStatus={setEndLeaseStatus} isTerminate={true} />
                            </Grid> */}
                            </Grid>
                        </Grid>
                    }

                    {isPageUpdateOrRenew === true &&
                        <Grid item xs={12} md={12}>
                            <Grid container sx={{ alignItems: "center", justifyContent: "center" }} spacing={2}>
                                <Grid item xs={6} md={6} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            background: "#D4736D",
                                            color: theme.palette.background.default,
                                            cursor: "pointer",
                                            textTransform: "none",
                                            minWidth: "150px",
                                            minHeight: "35px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            '&:hover': {
                                                background: '#DEA19C',
                                            },
                                        }}
                                        size="small"
                                        // onClick={handleUpdateLease}
                                    >
                                        <Typography sx={{
                                            textTransform: "none",
                                            color: theme.typography.primary.black,
                                            fontWeight: theme.typography.secondary.fontWeight,
                                            fontSize: theme.typography.smallFont,
                                            whiteSpace: "nowrap",
                                            marginLeft: "1%",
                                        }}>
                                            {"Update Lease (No Signature Required)"}
                                        </Typography>
                                    </Button>
                                </Grid>

                                <Grid item xs={6} md={6} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                    <RenewLeaseButton theme={theme} handleRenewLease={handleRenewLease} 
                                    leaseData={currentLease} setIsPageUpdateOrRenew={setIsPageUpdateOrRenew}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </Box >

    );
}