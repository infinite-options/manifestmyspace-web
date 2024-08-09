import React, { useEffect, useState, useRef } from "react";
import { ThemeProvider, Box, Paper, Stack, Typography, Grid, Divider, Button, ButtonGroup, Rating, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import theme from "../../theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import APIConfig from "../../utils/APIConfig";
import AdultOccupant from "../Leases/AdultOccupant";
import ChildrenOccupant from "../Leases/ChildrenOccupant";
import PetsOccupant from "../Leases/PetsOccupant";
import VehiclesOccupant from "../Leases/VehiclesOccupant";
import Documents from "../Leases/Documents";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


export default function TenantApplicationEdit({ profileData, lease }) {
    console.log('Inside TenantApplicationEdit', profileData, lease)
    const [adults, setAdults] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
    const [children, setChildren] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
    const [pets, setPets] = useState([{ id: 1, name: "", breed: "", type: "", weight: "" }]);
    const [vehicles, setVehicles] = useState([{ id: 1, make: "", model: "", year: "", license: "", state: "" }]);
    const [documents, setDocuments] = useState([]);
    const childrenRef = useRef(children);
    const petsRef = useRef(pets);
    const vehiclesRef = useRef(vehicles);
    const documentsRef = useRef([]);
    const [relationships, setRelationships] = useState([]);
    const [states, setStates] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showSpinner, setShowSpinner] = useState(false);

    const getListDetails = async () => {
        try {
            const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
            if (!response.ok) {
                console.log("Error fetching lists data");
            }
            const responseJson = await response.json();
            const relationships = responseJson.result.filter((res) => res.list_category === "relationships");
            const states = responseJson.result.filter((res) => res.list_category === "states");
            setRelationships(relationships);
            setStates(states);
        } catch (error) {
            console.log(error);
        }
    };

    const setProfileData = async () => {
        setShowSpinner(true);
        try {
            setAdults(JSON.parse(profileData.tenant_adult_occupants) || []);
            setChildren(JSON.parse(profileData.tenant_children_occupants) || []);
            setPets(JSON.parse(profileData.tenant_pet_occupants) || []);
            setVehicles(JSON.parse(profileData.tenant_vehicle_info) || []);

            const parsedDocs = JSON.parse(profileData.tenant_documents);
            const docs = parsedDocs
                ? parsedDocs.map((doc, index) => ({
                    ...doc,
                    id: index,
                }))
                : [];
            console.log('initial docs', docs);
            setDocuments(docs);
            documentsRef.current = parsedDocs;
            setShowSpinner(false);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setShowSpinner(false);
        }
    };

    const showSnackbar = (message, severity) => {
        console.log("Inside show snackbar");
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        console.log("calling useeffect");
        // setIsSave(false);

        setProfileData();

        getListDetails();
    }, []);

    useEffect(() => {
        console.log("calling profileData useEffect");

        // setIsSave(false);
        setProfileData();
    }, [profileData]);

    const editOrUpdateLease = async () => {
        console.log('inside edit', modifiedData);
        try {
            if (modifiedData.length > 0) {
                setShowSpinner(true);
                const headers = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Credentials": "*",
                };

                const leaseApplicationFormData = new FormData();

                modifiedData.forEach(item => {
                    console.log(`Key: ${item.key}`);
                    if (item.key === "uploadedFiles") {
                        console.log('uploadedFiles', item.value);
                        if (item.value.length) {
                            const documentsDetails = [];
                            [...item.value].forEach((file, i) => {
                                leaseApplicationFormData.append(`file-${i}`, file.file, file.name);
                                const fileType = 'pdf';
                                const documentObject = {
                                    // file: file,
                                    fileIndex: i,
                                    fileName: file.name,
                                    fileType: file.type,
                                    type: file.type,
                                };
                                documentsDetails.push(documentObject);
                            });
                            leaseApplicationFormData.append("lease_documents_details", JSON.stringify(documentsDetails));
                        }
                    } else {
                        leaseApplicationFormData.append(item.key, JSON.stringify(item.value));
                    }
                });
                leaseApplicationFormData.append('lease_uid', lease.lease_uid);

                axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
                    .then((response) => {
                        console.log('Data updated successfullyyy', response);
                        showSnackbar("Your lease application has been successfully updated.", "success");
                        // handleUpdate();
                        setShowSpinner(false);
                    })
                    .catch((error) => {
                        setShowSpinner(false);
                        showSnackbar("Cannot update the lease application. Please try again", "error");
                        if (error.response) {
                            console.log(error.response.data);
                        }
                    });
                setShowSpinner(false);
                setModifiedData([]);
            } else {
                showSnackbar("You haven't made any changes to the form. Please save after changing the data.", "error");
            }
        } catch (error) {
            showSnackbar("Cannot update the lease application. Please try again", "error");
            console.log("Cannot Update the lease application", error);
            setShowSpinner(false);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper
                style={{
                    margin: "5px",
                    padding: 20,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '10px',
                    boxShadow: "0px 2px 4px #00000040"
                }}
            >
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Typography align='center' gutterBottom sx={{ fontSize: "24px", fontWeight: "bold", color: "#1f1f1f" }}>
                            Tenant Application Edit
                        </Typography>
                    </Grid>

                    <Grid container justifyContent='center' sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
                        <Grid item xs={12}>
                            <Accordion sx={{ backgroundColor: "#F0F0F0", boxShadow: "none" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='occupants-content' id='occupants-header'>
                                    <Grid container>
                                        <Grid item md={11.2}>
                                            <Typography
                                                sx={{
                                                    color: "#160449",
                                                    fontWeight: theme.typography.primary.fontWeight,
                                                    fontSize: "20px",
                                                    textAlign: "center",
                                                    paddingBottom: "10px",
                                                    paddingTop: "5px",
                                                    flexGrow: 1,
                                                    paddingLeft: "50px",
                                                }}
                                                paddingTop='5px'
                                                paddingBottom='10px'
                                            >
                                                Occupancy Details
                                            </Typography>
                                        </Grid>
                                        <Grid item md={0.5} />
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {adults && (
                                        <AdultOccupant
                                            leaseAdults={adults}
                                            relationships={relationships}
                                            editOrUpdateLease={editOrUpdateLease}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={"lease_adults"}
                                        />
                                    )}
                                    {children && (
                                        <ChildrenOccupant
                                            leaseChildren={children}
                                            relationships={relationships}
                                            editOrUpdateLease={editOrUpdateLease}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={"lease_children"}
                                        />
                                    )}
                                    {pets && (
                                        <PetsOccupant
                                            leasePets={pets}
                                            editOrUpdateLease={editOrUpdateLease}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={"lease_pets"}
                                        />
                                    )}
                                    {vehicles && (
                                        <VehiclesOccupant
                                            leaseVehicles={vehicles}
                                            states={states}
                                            editOrUpdateLease={editOrUpdateLease}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={"lease_vehicles"}
                                        />
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    )
}