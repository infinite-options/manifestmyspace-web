import React, { useEffect, useState, useRef } from "react";
import {
    ThemeProvider, Box, Paper, Typography, Grid, Snackbar, Alert, AlertTitle, Accordion, AccordionSummary, AccordionDetails,
    Button
} from "@mui/material";
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
import { useUser } from "../../contexts/UserContext";
import CloseIcon from "@mui/icons-material/Close";


export default function TenantApplicationEdit({ profileData, lease_uid, setRightPane, property, from }) {
    console.log('Inside TenantApplicationEdit', profileData, lease_uid, from);
    const [adults, setAdults] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
    const [children, setChildren] = useState([{ id: 1, name: "", lastName: "", relation: "", dob: "" }]);
    const [pets, setPets] = useState([{ id: 1, name: "", breed: "", type: "", weight: "" }]);
    const [vehicles, setVehicles] = useState([{ id: 1, make: "", model: "", year: "", license: "", state: "" }]);
    const [documents, setDocuments] = useState([]);
    const documentsRef = useRef([]);
    const [uploadedFiles, setuploadedFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [states, setStates] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showSpinner, setShowSpinner] = useState(false);
    const [lease, setLease] = useState([]);
    const { user, getProfileId, roleName } = useUser();
    const [isReload, setIsReload] = useState(false);

    const [ occupantsExpanded, setOccupantsExpanded ] = useState(true);

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
            if (lease_uid) {
                axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
                    .then((response) => {
                        const fetchData = response.data["Lease_Details"].result;
                        const leaseData = fetchData.filter((lease) => lease.lease_uid === lease_uid)
                        setLease(leaseData);
                        setAdults(JSON.parse(leaseData[0].lease_adults) || []);
                        setChildren(JSON.parse(leaseData[0].lease_children) || []);
                        setPets(JSON.parse(leaseData[0].lease_pets) || []);
                        setVehicles(JSON.parse(leaseData[0].lease_vehicles) || []);

                        const parsedDocs = JSON.parse(leaseData[0].lease_documents);
                        const docs = parsedDocs
                            ? parsedDocs.map((doc, index) => ({
                                ...doc,
                                id: index,
                            }))
                            : [];
                        setDocuments(docs);
                        documentsRef.current = parsedDocs;
                        setShowSpinner(false);
                    })
            } else {
                const profileResponse = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`);
                const profileData = profileResponse.data.profile.result[0];
                setAdults(profileData && profileData.tenant_adult_occupants ? JSON.parse(profileData.tenant_adult_occupants) : []);
                setChildren(profileData && profileData.tenant_children_occupants ? JSON.parse(profileData.tenant_children_occupants) : []);
                setPets(profileData && profileData.tenant_pet_occupants ? JSON.parse(profileData.tenant_pet_occupants) : []);
                setVehicles(profileData && profileData.tenant_vehicle_info ? JSON.parse(profileData.tenant_vehicle_info) : []);

                const parsedDocs = profileData && profileData.tenant_documents ? JSON.parse(profileData.tenant_documents) : [];
                const docs = parsedDocs
                    ? parsedDocs.map((doc, index) => ({
                        ...doc,
                        id: index,
                    }))
                    : [];
                setDocuments(docs);
                documentsRef.current = parsedDocs;
                setShowSpinner(false);
            }
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
        getListDetails();
    }, []);

    useEffect(() => {
        console.log("calling profileData useEffect");

        // setIsSave(false);
        setProfileData();
    }, [lease_uid, isReload]);

    const editOrUpdateLease = async () => {
        // console.log('--dhyey-- inside edit lease - ', lease[0]);
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
                                leaseApplicationFormData.append(`file_${i}`, file.file, file.name);
                                const fileType = 'pdf';
                                const documentObject = {
                                    // file: file,
                                    fileIndex: i,
                                    fileName: file.name,
                                    contentType: file.contentType,
                                    // type: file.type,
                                };
                                documentsDetails.push(documentObject);
                            });
                            leaseApplicationFormData.append("lease_documents_details", JSON.stringify(documentsDetails));
                        }
                    } else {
                        leaseApplicationFormData.append(item.key, JSON.stringify(item.value));
                    }
                });
                leaseApplicationFormData.append('lease_uid', lease[0].lease_uid); // Here is the problem when upload new docs because there is no lease right now and it require lease_uid

                axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
                    .then((response) => {
                        console.log('Data updated successfullyyy', response);
                        showSnackbar("Your lease application has been successfully updated.", "success");
                        setIsReload((prev) => !prev);
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

    const editOrUpdateTenant = async () => {
        console.log("inside editOrUpdateTenant", modifiedData);
        try {
            if (modifiedData.length > 0) {
                setShowSpinner(true);
                const headers = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Credentials": "*",
                };

                const profileFormData = new FormData();

                modifiedData.forEach((item) => {
                    console.log(`Key: ${item.key}`);
                    if (item.key === "uploadedFiles") {
                        console.log("uploadedFiles", item.value);
                        if (item.value.length) {
                            const documentsDetails = [];
                            [...item.value].forEach((file, i) => {
                                profileFormData.append(`file_${i}`, file.file, file.name);
                                const fileType = "pdf";
                                const documentObject = {
                                    // file: file,
                                    fileIndex: i,
                                    fileName: file.name,
                                    contentType: file.contentType,
                                    // type: file.type,
                                };
                                documentsDetails.push(documentObject);
                            });
                            profileFormData.append("tenant_documents_details", JSON.stringify(documentsDetails));
                        }
                    } else {
                        profileFormData.append(item.key, JSON.stringify(item.value));
                    }
                });
                profileFormData.append("tenant_uid", profileData.tenant_uid);

                axios
                    .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile", profileFormData, headers)
                    .then((response) => {
                        console.log("Data updated successfully", response);
                        showSnackbar("Your profile has been successfully updated.", "success");
                        setIsReload((prev) => !prev);
                        setShowSpinner(false);
                    })
                    .catch((error) => {
                        setShowSpinner(false);
                        showSnackbar("Cannot update your profile. Please try again", "error");
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
            showSnackbar("Cannot update the lease!!. Please try again", "error");
            console.log("Cannot Update the lease", error);
            setShowSpinner(false);
        }
    };

    const handleCloseButton = (e) => {
        e.preventDefault();
        const state = {
            data: property, status: lease_uid === null ? "" : lease[0].lease_status, lease:  lease_uid === null ? [] : lease[0] , from: from
        }
        setRightPane?.({ type: "tenantApplication", state: state });
    };

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
                    <Grid item xs={11} md={11}>
                        <Typography align='center' gutterBottom sx={{ fontSize: "24px", fontWeight: "bold", color: "#1f1f1f" }}>
                            Tenant Application Edit
                        </Typography>
                    </Grid>
                    <Grid item xs={11} md={11}>
                        <Typography align='center' gutterBottom sx={{ fontSize: "16px", fontWeight: "bold", color: "#1f1f1f" }}>                            
                            Your changes will be saved to the Lease Application without impacting your profile.
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                        <Box>
                            <Button onClick={(e) => handleCloseButton(e)}>
                                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px" }} />
                            </Button>
                        </Box>
                    </Grid>
                    <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', height: "100%" }}>
                            <AlertTitle>{snackbarSeverity === "error" ? "Error" : "Success"}</AlertTitle>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>

                    {/* occupancy details                     */}
                    <Grid container justifyContent='center' sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
                        <Grid item xs={12}>
                            <Accordion sx={{ backgroundColor: "#F0F0F0", boxShadow: "none" }} expanded={occupantsExpanded} onChange={() => setOccupantsExpanded(prevState => !prevState)}>
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
                                            editOrUpdateLease={lease_uid !== null ? editOrUpdateLease : editOrUpdateTenant}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={lease_uid !== null ? "lease_adults" : "tenant_adult_occupants"}
                                        />
                                    )}
                                    {children && (
                                        <ChildrenOccupant
                                            leaseChildren={children}
                                            relationships={relationships}
                                            editOrUpdateLease={lease_uid !== null ? editOrUpdateLease : editOrUpdateTenant}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={lease_uid !== null ? "lease_children" : "tenant_children_occupants"}
                                        />
                                    )}
                                    {pets && (
                                        <PetsOccupant
                                            leasePets={pets}
                                            editOrUpdateLease={lease_uid !== null ? editOrUpdateLease : editOrUpdateTenant}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={lease_uid !== null ? "lease_pets" : "tenant_pet_occupants"}
                                        />
                                    )}
                                    {vehicles && (
                                        <VehiclesOccupant
                                            leaseVehicles={vehicles}
                                            states={states}
                                            editOrUpdateLease={lease_uid !== null ? editOrUpdateLease : editOrUpdateTenant}
                                            modifiedData={modifiedData}
                                            setModifiedData={setModifiedData}
                                            dataKey={lease_uid !== null ? "lease_vehicles" : "tenant_vehicle_info"}
                                            ownerOptions={[...adults, ...children]}
                                        />
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    
                    {/* documents details */}
                    <Grid container justifyContent='center' sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
                        <Grid item xs={12} md={12}>
                        <Documents
                            documents={documents}
                            setDocuments={setDocuments}
                            setuploadedFiles={setuploadedFiles}
                            editOrUpdateLease={editOrUpdateLease}
                            documentsRef={documentsRef}
                            setDeletedFiles={setDeletedFiles}
                            modifiedData={modifiedData}
                            setModifiedData={setModifiedData}
                            dataKey={"lease_documents"}
                            isAccord={true}
                        />
                        </Grid>
                    </Grid>

                    <Grid container justifyContent='center' item xs={11} md={11}>
                        <Button
                            sx={{
                                backgroundColor: '#3D5CAC',                                
                            }}
                            onClick={(e) => handleCloseButton(e)}
                        >
                            <Typography sx={{ textTransform: 'none', fontWeight: 'bold', color: "#FFFFFF",}}>
                                Return to Application
                            </Typography>

                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    )
}