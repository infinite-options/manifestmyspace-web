import React from "react";
import { useEffect, useState, useRef } from "react";
import {
    Typography, Box, Paper, Grid, FormControlLabel, Radio, RadioGroup,
    TextField, MenuItem, Button, OutlinedInput, FormControl, InputAdornment, Select, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, Snackbar, Alert, InputLabel, Accordion, AccordionSummary, AccordionDetails,
    Card, CardContent, CardMedia,
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import propertyImage from "../../images/house.png";
import TenantDetails from "./TenantDetails";
import UtilitiesManager from "./Utilities";
import { Close } from '@mui/icons-material';

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

export default function RenewLease({ leaseDetails, selectedLeaseId, setIsEndClicked }) {
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
    const [showSpinner, setShowSpinner] = useState(false);
    //image slider
    const [image, setImage] = useState([]);


    useEffect(() => {
        setShowSpinner(true);
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

        //set images
        const parsedPropertyImages = currentLease.property_images ? JSON.parse(currentLease.property_favorite_image) : null;
        setImage(parsedPropertyImages === null ? propertyImage : parsedPropertyImages);
        setShowSpinner(false);
    }, [leaseDetails, selectedLeaseId])

    useEffect(() => {
        if (snackbarOpen && alertRef.current) {
            alertRef.current.focus();
        }
    }, [snackbarOpen]);

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
            flex: 0.7,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleEditFeeClick(params.row)}
                    >
                        <EditIcon sx={{ color: "#3D5CAC" }} />
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
                            type: file.type,
                        };
                        documentsDetails.push(documentObject);
                    });
                    leaseApplicationFormData.append("lease_documents", JSON.stringify(documentsDetails));
                }

                console.log("leaseApplicationFormData", leaseApplicationFormData);

                // axios.post('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
                //     .then((response) => {
                //         console.log('Data updated successfully');
                //         showSnackbar("Successfully Renewed the lease.", "success");
                //     })
                //     .catch((error) => {
                //         if (error.response) {
                //             console.log(error.response.data);
                //             showSnackbar("Cannot Renew the lease. Please Try Again", "error");
                //         }
                //     });
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

    const dayOptionsForWeekly = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
    ];

    const dayOptionsForBiWeekly = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
        { value: "monday-week-2", label: "Monday - week 2" },
        { value: "tuesday-week-2", label: "Tuesday - week 2" },
        { value: "wednesday-week-2", label: "Wednesday - week 2" },
        { value: "thursday-week-2", label: "Thursday - week 2" },
        { value: "friday-week-2", label: "Friday - week 2" },
        { value: "saturday-week-2", label: "Saturday - week 2" },
        { value: "sunday-week-2", label: "Sunday - week 2" },
    ];

    const lateByOptionsForWeekly = [
        { value: 1, label: "1st day after due date" },
        { value: 2, label: "2nd day after due date" },
        { value: 3, label: "3rd day after due date" },
        { value: 4, label: "4th day after due date" },
        { value: 5, label: "5th day after due date" },
        { value: 6, label: "6th day after due date" },
        { value: 7, label: "7th day after due date" },
    ];

    const lateByOptionsForBiWeekly = [
        { value: 1, label: "1st day after due date" },
        { value: 2, label: "2nd day after due date" },
        { value: 3, label: "3rd day after due date" },
        { value: 4, label: "4th day after due date" },
        { value: 5, label: "5th day after due date" },
        { value: 6, label: "6th day after due date" },
        { value: 7, label: "7th day after due date" },
        { value: 8, label: "8th day after due date" },
        { value: 9, label: "9th day after due date" },
        { value: 10, label: "10th day after due date" },
        { value: 11, label: "11th day after due date" },
        { value: 12, label: "12th day after due date" },
        { value: 13, label: "13th day after due date" },
        { value: 14, label: "14th day after due date" },
    ];

    const availableToPayOptionsForWeekly = [
        { value: 1, label: "1 day before due date" },
        { value: 2, label: "2 days before due date" },
        { value: 3, label: "3 days before due date" },
        { value: 4, label: "4 days before due date" },
        { value: 5, label: "5 days before due date" },
        { value: 6, label: "6 days before due date" },
        { value: 7, label: "7 days before due date" },
    ];

    const availableToPayOptionsForBiWeekly = [
        { value: 1, label: "1 day before due date" },
        { value: 2, label: "2 days before due date" },
        { value: 3, label: "3 days before due date" },
        { value: 4, label: "4 days before due date" },
        { value: 5, label: "5 days before due date" },
        { value: 6, label: "6 days before due date" },
        { value: 7, label: "7 days before due date" },
        { value: 8, label: "8 days before due date" },
        { value: 9, label: "9 days before due date" },
        { value: 10, label: "10 days before due date" },
        { value: 11, label: "11 days before due date" },
        { value: 12, label: "12 days before due date" },
        { value: 13, label: "13 days before due date" },
        { value: 14, label: "14 days before due date" },
    ];

    const daytoValueMap = new Map([
        ["monday", 0],
        ["tuesday", 1],
        ["wednesday", 2],
        ["thursday", 3],
        ["friday", 4],
        ["saturday", 5],
        ["sunday", 6],
        ["monday-week-2", 7],
        ["tuesday-week-2", 8],
        ["wednesday-week-2", 9],
        ["thursday-week-2", 10],
        ["friday-week-2", 11],
        ["saturday-week-2", 12],
        ["sunday-week-2", 13],
    ]);

    const handleDeleteButtonClick = () => {
        setIsEndClicked(true);
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
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Grid container sx={{ marginTop: '15px', marginBottom: '15px', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10px" }}>
                            <Typography
                                sx={{
                                    color: "#160449",
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
                    {/* Start */}
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "10px", backgroundColor: color, paddingBottom: "10px" }}>
                            <Grid container spacing={2}>
                                <Grid item md={0.5} />
                                <Grid item xs={12} md={2.5}>
                                    <Card
                                        sx={{
                                            backgroundColor: color,
                                            boxShadow: 'none',
                                            elevation: '0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%', // Ensure card takes full height of its container
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                padding: '0 !important',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    height: '150px',
                                                    width: '100%',
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={image}
                                                    sx={{
                                                        elevation: '0',
                                                        boxShadow: 'none',
                                                        flexGrow: 1,
                                                        objectFit: 'fill',
                                                        width: '100%',
                                                        height: '100px',
                                                        marginTop: "5px"
                                                    }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={0} md={0.5} />
                                <Grid item md={3}>
                                    <Grid container marginTop="10px">
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Lease Start</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{currentLease.lease_start}</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Lease End</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{formatDate(currentLease.lease_end)}</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Move In</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{currentLease.lease_move_in_date}</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Move Out</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>TBD</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={0} md={0.5} />
                                <Grid item md={4}>
                                    <Grid container marginTop="10px">
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Rent</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>${rent.charge}</Typography>
                                        </Grid>

                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Frequency</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{rent.frequency}</Typography>
                                        </Grid>

                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Available to Pay</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{rent.available_topay} Days Before</Typography>
                                        </Grid>

                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>Due Date</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={{ marginBottom: "10px" }}>
                                            <Typography sx={{
                                                textTransform: 'none',
                                                color: "#160449",
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                            }}>{rent.due_by} {getDateAdornmentString(rent.due_by)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* End */}

                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            {tenantWithId && tenantWithId.length > 0 && (
                                <TenantDetails tenantWithId={tenantWithId} setTenantWithId={setTenantWithId} />
                            )}
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography
                                            sx={{
                                                color: "#160449",
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
                                        <Button
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
                                            hideFooter={true}
                                            rowsPerPageOptions={[10]}
                                            getRowId={(row) => row.leaseFees_uid}
                                            sx={{
                                                '& .MuiDataGrid-columnHeader': {
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: "#160449",
                                                },
                                                '& .MuiDataGrid-columnHeaderTitle': {
                                                    font: "bold",
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontWeight: "bold",
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    color: "#160449",
                                                    fontWeight: "bold",
                                                },

                                            }}
                                        />
                                        <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                                                {snackbarMessage}
                                            </Alert>
                                        </Snackbar>
                                        <Dialog open={open} onClose={handleFeeModalClose} maxWidth="md">
                                            <DialogTitle
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: "#160449",
                                                    fontWeight: theme.typography.primary.fontWeight,
                                                    fontSize: theme.typography.small,
                                                }}
                                            >
                                                <span style={{ flexGrow: 1, textAlign: 'center' }}>Fee Details</span>
                                                <Button onClick={handleFeeModalClose} sx={{ ml: 'auto' }}>
                                                    <Close sx={{
                                                        color: theme.typography.primary.black,
                                                        fontSize: '20px',
                                                    }} />
                                                </Button>
                                            </DialogTitle>
                                            <DialogContent>
                                                <Grid container columnSpacing={8}>
                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Fee Name
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={10}>
                                                        <TextField
                                                            sx={{ backgroundColor: '#D6D5DA', }}
                                                            margin="dense"
                                                            label="Fee Name"
                                                            fullWidth
                                                            required
                                                            variant="outlined"
                                                            value={currentFeeRow?.fee_name || ''}
                                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, fee_name: e.target.value })}
                                                        />
                                                    </Grid>

                                                    {/* fee type */}
                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Fee Type
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={10}>
                                                        <TextField
                                                            sx={{ backgroundColor: '#D6D5DA', }}
                                                            margin="dense"
                                                            label="Fee Type"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentFeeRow?.fee_type || ''}
                                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, fee_type: e.target.value })}
                                                        />
                                                    </Grid>


                                                    {/* Charge */}
                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Fee Amount
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4}>
                                                        <TextField
                                                            sx={{ backgroundColor: '#D6D5DA', }}
                                                            margin="dense"
                                                            label="Amount"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentFeeRow?.charge || ''}
                                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, charge: e.target.value })}
                                                        />
                                                    </Grid>

                                                    {/* Frequency */}
                                                    <Grid item md={6} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Grid container>
                                                            <Grid item md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                                    Frequency
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={8}>
                                                                <FormControl sx={{ width: '335px', height: '70px' }}>
                                                                    <InputLabel sx={{ color: theme.palette.grey, textAlign: 'center', paddingTop: '5px' }}>Frequency</InputLabel>
                                                                    <Select
                                                                        value={currentFeeRow?.frequency || ''}
                                                                        onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, frequency: e.target.value })}
                                                                        size="small"
                                                                        fullWidth
                                                                        label="Frequency"
                                                                        className={classes.select}
                                                                        sx={{
                                                                            marginTop: "10px",
                                                                            height: '50px',
                                                                            backgroundColor: '#D6D5DA',
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
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Due Date */}
                                                    <Grid item md={6}>
                                                        <Grid container>
                                                            <Grid item md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                                    Due Date
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "") && (
                                                                    <TextField
                                                                        margin="dense"
                                                                        name="due_by"
                                                                        value={currentFeeRow.due_by !== null && currentFeeRow.due_by !== "" ? currentFeeRow.due_by : ""}
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, due_by: e.target.value })}
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment position="start">{getDateAdornmentString(currentFeeRow.due_by)}</InputAdornment>,
                                                                        }}
                                                                        sx={{ marginLeft: '5px', width: '295px', backgroundColor: '#D6D5DA', }}
                                                                    />
                                                                )}

                                                                {currentFeeRow && (currentFeeRow.frequency === "One-time" || currentFeeRow.frequency === "Annually") && (
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            label="Due By"
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
                                                                            sx={{ marginTop: "10px", marginLeft: '5px', width: '295px', backgroundColor: '#D6D5DA', }}
                                                                        />
                                                                    </LocalizationProvider>)}

                                                                {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                                                    <Box
                                                                        sx={{
                                                                            paddingTop: "10px",
                                                                        }}
                                                                    >
                                                                        <Select
                                                                            name="available_topay"
                                                                            value={currentFeeRow.available_topay !== null ? currentFeeRow.available_topay : ""}
                                                                            size="small"
                                                                            fullWidth
                                                                            // onChange={(e) => handleAvailableToPayChange(e, row.id, "weekly")}
                                                                            placeholder="Select Available to Pay By Day"
                                                                            className={classes.select}
                                                                            sx={{ width: '295px', marginLeft: '5px', height: '40px', backgroundColor: '#D6D5DA', }}
                                                                        >
                                                                            {currentFeeRow.frequency &&
                                                                                currentFeeRow.frequency === "Weekly" &&
                                                                                availableToPayOptionsForWeekly.map((option) => (
                                                                                    <MenuItem key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            {currentFeeRow.frequency &&
                                                                                currentFeeRow.frequency === "Bi-Weekly" &&
                                                                                availableToPayOptionsForBiWeekly.map((option) => (
                                                                                    <MenuItem key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </Box>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Bills post X days in advance */}
                                                    <Grid item md={3} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Bills Post X Days in Advance
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={3}>
                                                        {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "One-time" ||
                                                            currentFeeRow.frequency === "Annually" || currentFeeRow.frequency === "") && (
                                                                <TextField
                                                                    sx={{ backgroundColor: '#D6D5DA', }}
                                                                    margin="dense"
                                                                    label="# Days Before"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    value={currentFeeRow?.available_topay || ''}
                                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, available_topay: e.target.value })}
                                                                />)}

                                                        {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                                            <Box
                                                                sx={{
                                                                    paddingTop: "10px",
                                                                }}
                                                            >
                                                                <Select
                                                                    sx={{backgroundColor: '#D6D5DA',}}
                                                                    name="available_topay"
                                                                    value={currentFeeRow.available_topay !== null ? currentFeeRow.available_topay : ""}
                                                                    size="small"
                                                                    fullWidth
                                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, available_topay: e.target.value })}
                                                                    placeholder="Select Available to Pay By Day"
                                                                >
                                                                    {currentFeeRow.frequency &&
                                                                        currentFeeRow.frequency === "Weekly" &&
                                                                        availableToPayOptionsForWeekly.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    {currentFeeRow.frequency &&
                                                                        currentFeeRow.frequency === "Bi-Weekly" &&
                                                                        availableToPayOptionsForBiWeekly.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </Box>
                                                        )}
                                                    </Grid>


                                                    {/* Late after x days */}
                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Late After X Days
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4}>
                                                        {currentFeeRow && (currentFeeRow.frequency === "Monthly" || currentFeeRow.frequency === "One-time" || currentFeeRow.frequency === "Annually" || currentFeeRow.frequency === "") && (
                                                            <TextField
                                                                sx={{ backgroundColor: '#D6D5DA', }}
                                                                margin="dense"
                                                                label="# Days By"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={currentFeeRow?.late_by || ''}
                                                                onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_by: e.target.value })}
                                                            />
                                                        )}

                                                        {currentFeeRow && (currentFeeRow.frequency === "Weekly" || currentFeeRow.frequency === "Bi-Weekly") && (
                                                            <Box
                                                                sx={{
                                                                    paddingTop: "10px",
                                                                }}
                                                            >
                                                                <Select
                                                                sx={{backgroundColor: '#D6D5DA',}}
                                                                    name="late_by"
                                                                    value={currentFeeRow.late_by !== null ? currentFeeRow.late_by : ""}
                                                                    size="small"
                                                                    fullWidth
                                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_by: e.target.value })}
                                                                    placeholder="Select Late By Day"
                                                                >
                                                                    {currentFeeRow.frequency &&
                                                                        currentFeeRow.frequency === "Weekly" &&
                                                                        lateByOptionsForWeekly.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    {currentFeeRow.frequency &&
                                                                        currentFeeRow.frequency === "Bi-Weekly" &&
                                                                        lateByOptionsForBiWeekly.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </Box>
                                                        )}
                                                    </Grid>

                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            One Time Late Fee
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4}>
                                                        <TextField
                                                            sx={{ backgroundColor: '#D6D5DA', }}
                                                            margin="dense"
                                                            label="Amount"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentFeeRow?.late_fee || ''}
                                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_fee: e.target.value })}
                                                        />
                                                    </Grid>

                                                    <Grid md={6} />

                                                    <Grid item md={2} sx={{ display: 'flex', alignItems: 'center', }}>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC", }}>
                                                            Per Day Late Fee
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4}>
                                                        <TextField
                                                            sx={{ backgroundColor: '#D6D5DA', }}
                                                            margin="dense"
                                                            label="Amount"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={currentFeeRow?.perDay_late_fee || ''}
                                                            onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, perDay_late_fee: e.target.value })}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {/* <TextField
                                                    margin="dense"
                                                    label="Charge"
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    value={currentFeeRow?.charge || ''}
                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, charge: e.target.value })}
                                                /> */}

                                                {/* <TextField
                                                    margin="dense"
                                                    label="Available To Pay (Days Before)"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={currentFeeRow?.available_topay || ''}
                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, available_topay: e.target.value })}
                                                /> */}

                                                {/* <TextField
                                                    margin="dense"
                                                    label="Late By (Days After)"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={currentFeeRow?.late_by || ''}
                                                    onChange={(e) => setcurrentFeeRow({ ...currentFeeRow, late_by: e.target.value })}
                                                /> */}
                                                {/* <TextField
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
                                                /> */}
                                            </DialogContent>
                                            <DialogActions sx={{ alignContent: "center", justifyContent: "center" }}>
                                                <Button variant="outlined"
                                                    sx={{
                                                        background: "#F87C7A",
                                                        color: "#160449",
                                                        cursor: "pointer",
                                                        width: "100px",
                                                        height: "31px",
                                                        fontWeight: theme.typography.secondary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            backgroundColor: '#f76462',
                                                        },
                                                    }}
                                                    onClick={handleFeeModalClose}>
                                                    Cancel
                                                </Button>
                                                <Button variant="outlined"
                                                    sx={{
                                                        marginRight: '5px', background: "#FFC614",
                                                        color: "#160449",
                                                        cursor: "pointer",
                                                        width: "100px",
                                                        height: "31px",
                                                        fontWeight: theme.typography.secondary.fontWeight,
                                                        fontSize: theme.typography.smallFont,
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            backgroundColor: '#fabd00',
                                                        },
                                                    }}
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
                            <Accordion sx={{ backgroundColor: color }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="occupants-content"
                                    id="occupants-header"
                                >
                                    <Typography
                                        sx={{
                                            color: "#160449",
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
                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <Documents documents={documents} setDocuments={setDocuments}
                                uploadedFiles={uploadedFiles} setuploadedFiles={setuploadedFiles} />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Paper sx={{ margin: "0px 10px 10px 10px", backgroundColor: color }}>
                            <UtilitiesManager newUtilities={newUtilities} utils={utilities}
                                utilitiesMap={utilitiesMap} handleNewUtilityChange={handleNewUtilityChange}
                                remainingUtils={remainingUtils} setRemainingUtils={setRemainingUtils}
                                setNewUtilities={setNewUtilities} />
                        </Paper>
                    </Grid>

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
                                // onClick={handlePageToggle}
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
                                // onClick={handlePageToggle}
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
                                {/* <EndLeaseButton theme={theme} handleEndLease={handleEndLease}
                                        moveoutDate={moveoutDate} leaseData={currentLease} setEndLeaseStatus={setEndLeaseStatus} /> */}
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
                                    onClick={handleDeleteButtonClick}
                                >
                                    <Typography sx={{
                                        textTransform: "none",
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                        whiteSpace: "nowrap",
                                        marginLeft: "1%",
                                    }}>
                                        End
                                    </Typography>
                                </Button>
                            </Grid>

                            {/* <Grid item md={3} container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <EndLeaseButton theme={theme} handleEndLease={handleEndLease}
                                    moveoutDate={moveoutDate} leaseData={currentLease} setEndLeaseStatus={setEndLeaseStatus} isTerminate={true} />
                            </Grid> */}
                        </Grid>
                    </Grid>

                    {/* {isPageUpdateOrRenew === true &&
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
                                        leaseData={currentLease} setIsPageUpdateOrRenew={setIsPageUpdateOrRenew} />
                                </Grid>
                            </Grid>
                        </Grid>
                    } */}
                </Grid>
            </Paper>
        </Box >

    );
}