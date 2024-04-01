import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
    Container,
    TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import QuoteDetailInfo from "../Worker/QuoteDetailInfo";

import APIConfig from "../../../utils/APIConfig";

export default function QuoteAcceptForm(){

    const navigate = useNavigate();
    const location = useLocation();
    const { maintenanceRoutingBasedOnSelectedRole } = useUser();
    
    const maintenanceItem = location.state.maintenanceItem;
    const navigationParams = location.state.navigateParams
    // const quotes = location.state.quotes
    // console.log("navigationParams", navigationParams)
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])
    const [quoteImages, setQuoteImages] = useState([])
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [maintenanceQuotes, setMaintenanceQuotes] = useState(location.state.quotes)
    const [showSpinner, setShowSpinner] = useState(false);
    const [estimatedTotalCost, setEstimatedTotalCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("");
    const [earliestAvailability, setEarliestAvailability] = useState("");

    const handleNextQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % maintenanceQuotes.length);
    };
    
    const handlePreviousQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + maintenanceQuotes.length) % maintenanceQuotes.length);
    };

    useEffect(() => {
        const currentQuote = maintenanceQuotes[currentQuoteIndex];
        if(currentQuote && currentQuote.maintenance_quote_uid !== null && currentQuote.quote_services_expenses !== null) {
            const parseServicesExpenses = (expenses) => {
                let servicesObject = JSON.parse(expenses)
                var partsCost = 0
                for (const item in servicesObject.parts){
                    partsCost += parseInt(servicesObject.parts[item].cost)
                }
    
                setEstimatedLaborCost(servicesObject.total_estimate)
                setEstimatedPartsCost(partsCost)
                setEstimatedTotalCost(servicesObject.total_estimate + partsCost)
            }
            
            parseServicesExpenses(currentQuote.quote_services_expenses)
            setEstimatedTime(currentQuote.quote_event_type)
            setEarliestAvailability(currentQuote.quote_earliest_availability)
        }

    }, [currentQuoteIndex, maintenanceQuotes])

    function navigateToAddMaintenanceItem(){
        // console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        // console.log("handleBackButton")
        let maintenance_request_index = navigationParams.maintenanceRequestIndex
        let status = navigationParams.status
        let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
        let allMaintenanceData = navigationParams.allData
        let maintenanceQuotes = navigationParams.maintenanceQuotes

        // console.log("-----navigationParams-----")
        // console.log("maintenance_request_index", maintenance_request_index)
        // console.log("status", status)
        // console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
        // console.log("allMaintenanceData", allMaintenanceData)
        // console.log("--------------------------")

        navigate("/maintenance/detail", {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
                maintenanceQuotes
            }
        }); 
    }


    const handleSubmit = (quoteStatusParam) => {
        console.log("handleSubmit", quoteStatusParam)
        
        const changeMaintenanceQuoteStatus = async (quoteStatusParam) => {
            setShowSpinner(true);
            var formData = new FormData();

            formData.append("maintenance_quote_uid", maintenanceQuotes[currentQuoteIndex]?.maintenance_quote_uid);
            formData.append("quote_status", quoteStatusParam);

            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
                    method: 'PUT',
                    body: formData,
                });            
                let responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    // navigate("/maintenance")
                    navigate(maintenanceRoutingBasedOnSelectedRole(), {state: {refresh: true}})
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }

        changeMaintenanceQuoteStatus(quoteStatusParam)
    }

    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    useEffect(() => {
        try {
            let imageArray = JSON.parse(maintenanceItem?.maintenance_images || '[]');
            let quoteImageArray = JSON.parse(maintenanceItem?.quote_maintenance_images || '[]');
            setDisplayImages(imageArray);
            setQuoteImages(quoteImageArray);
        } catch (error) {
            console.error("Error parsing image arrays:", error);
            // Handle the error as needed, e.g., set default values or show an error message
            setDisplayImages([]);
            setQuoteImages([]);
        }
    }, [])

    return (
        <Box
        style={{
            display: 'flex',
            justifyContent: 'center',
            // alignItems: 'center',
            width: '100%', // Take up full screen width
            minHeight: '100vh', // Set the Box height to full height
            marginTop: theme.spacing(2), // Set the margin to 20px
        }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Paper
                style={{
                    margin: '10px',
                    backgroundColor: theme.palette.primary.main,
                    width: '100%', // Occupy full width with 25px margins on each side
                    paddingTop: '10px',
                    paddingBottom: '30px',
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        paddingBottom: "20px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }}
                >
                    <Box position="absolute" left={30}>
                        <Button onClick={() => handleBackButton()}>
                            <ArrowBackIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                        </Button>
                    </Box>
                    <Box
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Maintenance
                        </Typography>
                    </Box>
                    <Box position="absolute" right={30}>
                        <Button onClick={() => navigateToAddMaintenanceItem()}>
                            <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                        </Button>
                    </Box>
                </Stack>
                <Card
                    sx={{
                        backgroundColor: "#C06A6A",
                        borderRadius: "10px",
                        padding: "10px",
                        margin: "10px",
                        paddingTop: "25px",
                        display: "flex",
                        flexDirection: "column",
                    }}>

                    <Grid item xs={12}>
                        <Grid container spacing={2} justifyContent="center" direction="row">
                            {numImages() > 0 ? 
                                (
                                    Array.isArray(displayImages) && displayImages.length > 0 ? 
                                    displayImages.map((image, index) => (
                                        <Grid item key={index}>
                                            <img 
                                                src={image} 
                                                alt={`Image ${index}`} 
                                                style={{ width: '125px', height: '125px' }} 
                                            />
                                        </Grid>
                                    ))
                                    : 
                                    null
                                )
                            : null }
                        </Grid>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            { numImages() > 0 ? numImages() + " Images" : "No Images" }
                        </Typography>
                    </Grid>
                        <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            <b>{maintenanceItem?.maintenance_priority} Priority</b>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            <u>{maintenanceItem?.property_address}, {maintenanceItem?.property_city} {maintenanceItem?.property_state} {maintenanceItem?.property_zip}</u>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            <b>{maintenanceItem?.maintenance_title}</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            <b>{maintenanceItem?.maintenance_desc}</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            Estimated Cost: <b>{maintenanceItem?.maintenance_desc}</b>
                        </Typography>
                    </Grid>
                </Card>

                <Grid container spacing={0}
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    display="flex"
                    sx={{
                        backgroundColor: "#C06A6A",
                    }}
                > 
                    <Grid item xs={12}>
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            <b>Viewing Quotes {currentQuoteIndex + 1} of {maintenanceQuotes?.length}</b>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <Button 
                            onClick={handlePreviousQuote} 
                            disabled={currentQuoteIndex == 0}
                            style={{
                                color: 'grey',            // change text/icon color if desired
                                width: '100%',             // to make the button fill the Grid item's width
                                height: '100%'             // to make the button fill the Grid item's height
                            }}
                        >
                            <ArrowBackIcon/>
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                    </Grid>
                    <Grid item xs={2}>
                        <Button 
                            onClick={handleNextQuote} 
                            disabled={currentQuoteIndex == maintenanceQuotes?.length}
                            style={{
                                color: 'grey',            // change text/icon color if desired
                                width: '100%',             // to make the button fill the Grid item's width
                                height: '100%'             // to make the button fill the Grid item's height
                            }}
                        >
                            <ArrowForwardIcon />
                        </Button>
                    </Grid>
                </Grid>
                    {(maintenanceQuotes[currentQuoteIndex]?.quote_status==="SENT" || maintenanceQuotes[currentQuoteIndex]?.quote_status==="REJECTED") ? (
                        <Stack direction="column" display="flex" spacing={2} padding="20px">
                            <Box alignContent="center"
                                justifyContent="center"
                                alignItems="center">
                                {/* <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}> */}
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "18px"}}>
                                        Quote Sent from {maintenanceQuotes[currentQuoteIndex]?.maint_business_name} {maintenanceQuotes[currentQuoteIndex]?.quote_business_id}
                                </Typography>
                                
                            </Box>
                            <QuoteDetailInfo maintenanceItem={maintenanceQuotes[currentQuoteIndex]}/>
                            {maintenanceQuotes[currentQuoteIndex]?.quote_status!=="REJECTED" ? (
                                <>
                                    <Button
                                        variant="contained"
                                        
                                        sx={{
                                            backgroundColor: "#9EAED6",
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            display: 'flex',
                                            width: "100%",
                                        }}
                                        onClick={() => handleSubmit("ACCEPTED")}
                                        >
                                        <Typography sx={{
                                            color: "#160449",
                                            fontWeight: theme.typography.primary.fontWeight, 
                                            fontSize: "14px"
                                        }}>
                                            Accept Quote
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        
                                        sx={{
                                            backgroundColor: "#CB8E8E",
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            display: 'flex',
                                            width: "100%",
                                        }}
                                        onClick={() => handleSubmit("REJECTED")}
                                        >
                                        <Typography sx={{
                                            color: "#160449",
                                            fontWeight: theme.typography.primary.fontWeight, 
                                            fontSize: "14px"
                                        }}>
                                            Decline Quote
                                        </Typography>
                                    </Button>
                                </>) : (
                                    <Box alignContent="center" justifyContent="center" alignItems="center">
                                        <Typography sx={{
                                            color: "#160449",
                                            fontWeight: theme.typography.primary.fontWeight, 
                                            fontSize: "20px"
                                        }}>
                                            Rejected
                                        </Typography>
                                    </Box>
                                )}
                        </Stack>
                    ): maintenanceQuotes[currentQuoteIndex]?.quote_status==="REQUESTED" ? (
                            <Grid container spacing={3}
                                alignContent="center"
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                            >
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    Quote Requested from {maintenanceQuotes[currentQuoteIndex]?.quote_business_id}
                                </Typography>
                                <Grid item xs={12}>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        Awaiting quote details...
                                    </Typography>
                                </Grid>
                            </Grid>
                    ) : maintenanceQuotes[currentQuoteIndex]?.quote_status==="REFUSED" ? (
                            <Grid container spacing={3}
                            alignContent="center"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            >
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    Refused to quote request from {maintenanceQuotes[currentQuoteIndex]?.quote_business_id}
                                </Typography>
                            </Grid>
                    ) : maintenanceQuotes[currentQuoteIndex]?.quote_status==="REJECTED" ?(
                        <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        >
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                Your quote has been {maintenanceQuotes[currentQuoteIndex]?.quote_status}
                            </Typography>
                        </Grid>
                    ) : maintenanceQuotes[currentQuoteIndex]?.quote_status==="WITHDRAWN" ?(
                        <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        >
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                This quote request has been {maintenanceQuotes[currentQuoteIndex]?.quote_status}
                            </Typography>
                        </Grid>

                    ) : (
                        <Typography> {maintenanceQuotes[currentQuoteIndex]?.quote_business_id} {maintenanceQuotes[currentQuoteIndex]?.maintenance_quote_uid} {maintenanceQuotes[currentQuoteIndex]?.quote_status}</Typography>
                    )
                }
            </Paper>
        </Box>
    )
}