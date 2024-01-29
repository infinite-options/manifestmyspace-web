import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import ReturnArrow from "../../images/refund_back.png";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Box, Avatar, Grid, Button } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../images/search.svg";
import EmailIcon from "./messageIconDark.png";
import PhoneIcon from "./phoneIconDark.png";
import AddressIcon from "./addressIconDark.png";
import MapIcon from "./mapIcon.png";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import documentIcon from "../../images/Subtract.png"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { SignalWifiStatusbarNullTwoTone } from "@mui/icons-material";

const ManagerDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ownerId, managerBusinessId, managerData, propertyData, index } = location.state;

    // console.log("ownerId", ownerId);
    // console.log("managerBusinessId", managerBusinessId);
    // console.log("managerData", managerData);
    // console.log("propertyData", propertyData);
    // console.log("index", index);

    if (managerData) {
        
        let businessLocations = managerData.business_locations ? managerData.business_locations : ""
        if (businessLocations !== ""){
            let city = businessLocations[0]!==undefined ? businessLocations[0].location : "";
            let distance = businessLocations[0]!==undefined ? businessLocations[0].distance : "";
            let feesArray = JSON.parse(managerData.business_services_fees);
        }
    
    } else{
        let business_locations = ""
        let city = "";
        let distance = "";
        let feesArray = [];
    }

    const [showSpinner, setShowSpinner] = useState(false);
    const [properties, setProperties] = useState([
        {
        business_name: "",
        business_address: "",
        business_city: "",
        business_state: "",
        business_zip: "",
        business_photo_url: "",
        business_phone_number: "",
        business_email: "",
        },
    ]);

    function sortProperties(properties){
        const uniqueProperties = properties.filter((property, index, self) => 
            self.findIndex(p => p.contract_uid === property.contract_uid) === index
        );
        uniqueProperties.sort((a, b) => {
            if (a.contract_status === "NEW" && b.contract_status !== "NEW") {
            return -1;
            }
            if (a.contract_status !== "NEW" && b.contract_status === "NEW") {
            return 1;
            }
            return a.contract_status > b.contract_status;
        })
        return uniqueProperties;
    }

    const fetchManagerProperties = async () => {
        setShowSpinner(true);
        const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByManager/${ownerId}/${managerBusinessId}`;
        const response = await axios.get(url);
        let uniqueProperties = sortProperties(response.data.result);
        console.log("uniqueProperties", uniqueProperties) 
        setProperties(uniqueProperties);
        setShowSpinner(false);
    };

    useEffect(() => {
        fetchManagerProperties();
    }, []);

    function handleCancel(obj){
        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        try {
    
            const formData = new FormData();
            formData.append("contract_uid", obj.contract_uid)
            formData.append("contract_status", "INACTIVE")

             console.log(formData.contract_uid);
             console.log(formData.contract_status);

            const response = axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts", formData, headers);
            console.log("PUT result", response);
            if (response.code === 200) {
                return true;
            }

        } catch (error){
            console.log("error", error)
            return false;
        }

        setCancelContractDialogOpen(false);

    }

    const [cancelContractDialogOpen, setCancelContractDialogOpen] = useState(false);

    const openCancelContractDialog = () => {
        setCancelContractDialogOpen(true);
    };

    const closeCancelContractDialog = () => {
        setCancelContractDialogOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <Box
            sx={{
            fontFamily: "Source Sans Pro",
            color: "text.darkblue",
            padding: "25px",
            paddingLeft: "30px",
            paddingRight: "30px",
            backgroundColor: "background.gray",
            borderRadius: "10px",
            }}
        >
            <Box
            sx={{
                padding: "18px",
                backgroundColor: "#F2F2F2",
                borderRadius: "9px",
            }}
            >
            <Box
                sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                color: "text.darkblue",
                }}
            >
                <Typography
                    sx={{ flex: 1, textAlign: "center", paddingLeft: "22px", fontSize: "25px", fontWeight: 700 }}
                >
                    {"Property Manager"}
                </Typography>
                <SearchIcon onClick={() => navigate("/searchManager")} />
            </Box>
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.blue",
                fontWeight: "bold",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onClick={() => navigate("/propertyDetail", {state: {index, propertyList: propertyData}})} // need to pass in the index and the propertyData
                >
                    <img src={ReturnArrow} style={{ verticalAlign: 'middle', paddingRight: "5px" }}  alt="back" />
                    <Box>
                        <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.primary.fontWeight,
                            cursor: "pointer",
                        }}
                        >
                            {"Return to Property"}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    position: "relative",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    top: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        padding: "13px",
                        backgroundColor: "#3D5CAC",
                        flex: 1,
                        position: "relative",
                        borderRadius: "10px 10px 0 0",
                        padding: "15px"
                    }}
                >
                    <Typography
                        align="center"
                        sx={{
                        fontSize: "15px",
                        fontFamily: "Source Sans 3, sans-serif",
                        margin: "0 18px",
                        color: "#FFFFFF",
                        fontWeight: 800,
                        marginTop: "30px",
                        marginBottom: "30px",
                        }}
                    >
                        {managerData && managerData.business_name}
                    </Typography>
                    <Avatar
                        src={managerData?.business_photo_url}
                        sx={{
                            width: "60px",
                            height: "60px",
                            position: "absolute",
                            bottom: "-30px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#FFFFFF",
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundColor: "#D6D5DA",
                        flex: 3,
                        border: "0 0 10px 10px",
                        padding: "40px 10px 40px 10px"
                        // paddingTop: "35px",
                        // paddingBottom: "35px",
                        // paddingLeft: "10px",
                        // paddingRight: "10px",
                    }}
                >
                    <Grid container>
                        <Grid item xs={1}>
                        <img src={EmailIcon} alt="email" />
                        </Grid>
                        <Grid item xs={7}>
                            <Typography
                                sx={{
                                fontSize: 18,
                                paddingLeft: "10px",
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                                }}
                            >
                                {managerData?.business_email}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                sx={{
                                fontSize: 15,
                                fontFamily: "Source Sans Pro, sans-serif",
                                fontWeight: 800,
                                color: "#160449",
                                }}
                            >
                                {"Manager since:"}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                        <img src={PhoneIcon} alt="phone" />
                        </Grid>
                        <Grid item xs={7}>
                            <Typography
                                sx={{
                                fontSize: 18,
                                paddingLeft: "10px",
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                                }}
                            >
                                {managerData?.business_phone_number}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                sx={{
                                fontSize: 18,
                                paddingLeft: "10px",
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                                }}
                            >
                                {`${properties[index]?.contract_start_date}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <img src={AddressIcon} alt="address" />
                        </Grid>
                        <Grid item xs={11}>
                            <Typography
                                sx={{
                                fontSize: 18,
                                paddingLeft: "10px",
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                                }}
                            >
                                {`${managerData?.business_address}, ${managerData?.business_city}, ${managerData?.business_state} ${managerData?.business_zip}`}
                            </Typography>
                        </Grid>
                    </Grid>

                        <Typography
                            sx={{
                            paddingLeft: "10px",
                            fontFamily: "Source Sans Pro, sans-serif",
                            fontWeight: 800,
                            color: "#160449",
                            }}
                        >
                            {/* {`Manages ${properties.length} of your properties`} */}
                            
                            {`Manages ${properties.filter(property => property.business_uid === managerData.business_uid).length} of your properties`}

                            
                        </Typography>
                        {console.log(properties)}
                        {(properties.filter((property) => property.business_uid === managerData.business_uid)).map((p) => { 
                                let index=properties.findIndex((property)=>property.property_uid===p.property_uid);
                                // console.log(p)
                                let docList = JSON.parse(p.contract_documents);
                                // console.log(docList, typeof(docList))
                                const doc =docList && docList.find(
                                    (document) => document.type === "contract"
                                );
                                const contractDocumentLink = doc ? doc.link : '';
                                return (
                                        < >
                                            <Grid container direction="row">
                                                <Grid item xs={8}>
                                                    <Box display="flex" alignItems="left"> 
                                                        <Typography
                                                            sx={{
                                                            paddingLeft: "15px",
                                                            fontFamily: "Source Sans Pro, sans-serif",
                                                            fontWeight: 600,
                                                            color: "#160449",
                                                            textDecoration: "underline",
                                                            cursor: "pointer"
                                                            }}
                                                            onClick={() => navigate("/propertyDetail", {state: {index, propertyList: propertyData}})}
                                                        >
                                                            {`${p.property_address}, ${p.property_unit && p.property_unit+ ', ' } ${p.property_city}, ${p.property_state} ${p.property_zip}`}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Box display="flex" alignItems="right"> 
                                                        <Typography
                                                            sx={{
                                                            fontWeight: 800,
                                                            paddingLeft: "10px",
                                                            fontFamily: "Source Sans Pro, sans-serif",
                                                            color: "#160449",
                                                            }}
                                                        >
                                                            {p.contract_status === "NEW" ? "New" : p.contract_status === "ACTIVE" ? "Active" : "Inactive"}
                                                            
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Box display="flex" alignItems="right" alignContent="right"> 
                                                        {contractDocumentLink !== "" ? (
                                                            <Box onClick={()=>{
                                                                window.open(contractDocumentLink, "_blank");
                                                                // console.log("we should show a document here")
                                                            }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        paddingLeft: "10px",
                                                                        fontFamily: "Source Sans Pro, sans-serif",
                                                                        color: "#160449",
                                                                        cursor: "pointer"
                                                                    }}
                                                                >
                                                                    <img src={documentIcon} alt="document-icon" style={{width: '15px', height: '17px', margin:'0px', paddingLeft: "15px"}}/>
                                                                </Typography>
                                                            </Box>
                                                        )
                                                        : null
                                                    }
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                        )}
                        <Box sx={{
                            paddingTop: "10px",
                            display: "flex",
                        }}>
                            {managerData.contract_status === "ACTIVE" ? (
                                <>
                                    <Button
                                        sx={{
                                        paddingLeft: "15px",
                                        fontFamily: "Source Sans Pro, sans-serif",
                                        fontWeight: 800,
                                        backgroundColor: "#160449",
                                        }}
                                        onClick={openCancelContractDialog}
                                    >
                                        Cancel Contracts
                                    </Button>
                                    <Dialog
                                        open={cancelContractDialogOpen}
                                        onClose={closeCancelContractDialog}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">Confirm Cancellation</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to cancel the contract?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={closeCancelContractDialog} color="primary">
                                                No
                                            </Button>
                                            <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus>
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </>
                            ) : (
                            null
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
        </ThemeProvider>
    );
};

export default ManagerDetails;
