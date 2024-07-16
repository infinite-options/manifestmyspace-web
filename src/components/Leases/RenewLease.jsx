import React from "react";
import { useEffect, useState, useRef } from "react";
import {
    Typography, Box, Paper, Grid, TextField, MenuItem, Button, FormControl, InputAdornment, Select, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, Snackbar, Alert, InputLabel, Accordion, AccordionSummary, AccordionDetails,
    Card, CardContent, CardMedia,
} from "@mui/material";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../theme/theme";
import LeaseIcon from "../Property/leaseIcon.png";
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
import FeesDetails from "./FeesDetails";

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
    const [newStartDate, setNewStartDate] = useState(null);
    const [newEndDate, setNewEndDate] = useState(null);
    const [moveoutDate, setMoveoutDate] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
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

    const handleDeleteFeeClick = (id) => {
        setLeaseFees(leaseFees.filter(fee => fee.leaseFees_uid !== id));
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
                            {leaseFees && 
                            <FeesDetails getDateAdornmentString={getDateAdornmentString} leaseFees={leaseFees} setLeaseFees={setLeaseFees}/>
                        }
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