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
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


function QuoteNavigator({ onPrevious, onNext }) {
    return (
        <div>
            <button onClick={onPrevious}>Previous</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
}

export default function QuoteAcceptForm(){

    console.log("QuoteAcceptForm")
    const navigate = useNavigate();
    const location = useLocation();
    const maintenanceItem = location.state.maintenanceItem;
    const navigationParams = location.state.navigateParams
    console.log("navigationParams", navigationParams)
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [maintenanceQuotes, setMaintenanceQuotes] = useState([])

    const [estimatedTotalCost, setEstimatedTotalCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("");
    const [earliestAvailability, setEarliestAvailability] = useState("");

    useEffect(() => {
        
        const getMaintenanceItemQuotes = async () => {
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes/${maintenanceItem.maintenance_quote_uid}`)
            const data = await response.json()
            console.log(data);
            const quotes = data.result
            console.log("quotes",  quotes)
            setMaintenanceQuotes(quotes)
        }
        getMaintenanceItemQuotes()  
    }, [maintenanceItem])

    const handleNextQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % maintenanceQuotes.length);
    };
    
    const handlePreviousQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + maintenanceQuotes.length) % maintenanceQuotes.length);
    };

    useEffect(() => {
        const currentQuote = maintenanceQuotes[currentQuoteIndex];
        console.log("currentQuote", currentQuote)
        if(currentQuote && currentQuote.maintenance_quote_uid !== null && currentQuote.quote_services_expenses !== null) {
            const parseServicesExpenses = (expenses) => {
                let servicesObject = JSON.parse(expenses)
                console.log(servicesObject)
                // Object.keys(servicesObject).forEach(([key, value])=> {
                //     console.log(key, value)
                // })
                var partsCost = 0
                for (const item in servicesObject.parts){
                    partsCost += parseInt(servicesObject.parts[item].cost)
                }
    
                setEstimatedLaborCost(servicesObject.total_estimate)
                setEstimatedPartsCost(partsCost)
    
                setEstimatedTotalCost(servicesObject.total_estimate + partsCost)
    
                // let total = 0;
                // expenses.forEach(expense => {
                //     total += expense.expense_cost
                // })
                // return total;
            }
            
            parseServicesExpenses(currentQuote.quote_services_expenses)
            setEstimatedTime(currentQuote.quote_event_type)
            setEarliestAvailability(currentQuote.quote_earliest_availability)
        }

    }, [currentQuoteIndex, maintenanceQuotes])

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        console.log("handleBackButton")
        let maintenance_request_index = navigationParams.maintenanceRequestIndex
        let status = navigationParams.status
        let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
        let allMaintenanceData = navigationParams.allData
        console.log("-----navigationParams-----")
        console.log("maintenance_request_index", maintenance_request_index)
        console.log("status", status)
        console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
        console.log("allMaintenanceData", allMaintenanceData)
        console.log("--------------------------")

        navigate("/maintenance/detail", {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        }); 
    }


    const handleSubmit = () => {
        console.log("handleSubmit")
        
        
        // const changeMaintenanceRequestStatus = async () => {
        //     try {
        //         const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 "maintenance_request_uid": maintenanceItem?.maintenance_request_uid,
        //                 "maintenance_request_status": "ACCEPTED"
        //             })
        //         });

        //         const responseData = await response.json();
        //         console.log(responseData);
        //         if (response.status === 200) {
        //             console.log("success")
        //             navigate("/maintenance")
        //         } else{
        //             console.log("error setting status")
        //         }
        //     } catch (error){
        //         console.log("error", error)
        //     }
        // }

        const changeMaintenanceQuoteStatus = async () => {

            var formData = new FormData();

            formData.append("maintenance_quote_uid", maintenanceQuotes[currentQuoteIndex]?.maintenance_quote_uid);
            formData.append("quote_status", "ACCEPTED");

            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
                    method: 'PUT',
                    body: formData,
                });            
                let responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    navigate("/maintenance")
                }
            } catch (error){
                console.log("error", error)
            }
        }

        // changeMaintenanceRequestStatus()
        // PUT /maintenanceQuotes/{maintenance_quote_uid}
        changeMaintenanceQuoteStatus()


    }

    function displayQuoteDetails(quote_expenses){
        let quoteJSON = JSON.parse(quote_expenses)

        let parts = quoteJSON.parts

        
    }

    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    useEffect(() => {
        let imageArray = JSON.parse(maintenanceItem?.maintenance_images)
        setDisplayImages(imageArray)
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
                    <Stack
                        direction="row"
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
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                     >
                        <Grid item xs={12}>
                        <Card
                                sx={{
                                    backgroundColor: "#C06A6A",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                    paddingTop: "25px"
                                }}>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center">
                                            {numImages() > 0 ? 
                                                (
                                                    Array.isArray(displayImages) && displayImages.length > 0 ? 
                                                    displayImages.map((image, index) => (
                                                        <Grid item key={index}>
                                                            <img 
                                                                src={image} 
                                                                alt={`Image ${index}`} 
                                                                style={{ width: '50px', height: '50px' }} 
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
                                {/* {Object.entries(maintenanceItem).map(([key, value], index) => (
                                        <Grid item xs={12}>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                <b>{key} : {value}</b>
                                            </Typography>
                                        </Grid>
                                    )
                                )} */}
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            backgroundColor: "#C06A6A",
                        }}
                    > 
                        <Grid item xs={12}>
                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                <b>Viewing Quotes {currentQuoteIndex + 1} of {maintenanceQuotes.length}</b>
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
                                disabled={currentQuoteIndex == maintenanceQuotes.length}
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
                    {(maintenanceQuotes[currentQuoteIndex]?.quote_status==="SENT")?(
    
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                    >
                        
                        <Grid item xs={12}>
                            {/* {currentQuote.maintenanceContact ? currentQuote.maintenanceContact : currentQuote.quote_status + " from business id:" + currentQuote.quote_business_id} */}
                            {maintenanceQuotes[currentQuoteIndex]?.quote_status ? maintenanceQuotes[currentQuoteIndex]?.quote_status + " from business id:" + maintenanceQuotes[currentQuoteIndex]?.quote_business_id : "no quote status found for " + maintenanceQuotes[currentQuoteIndex]?.quote_business_id}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                Quote
                            </Typography>
                            <Container maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                                {/* <TextField
                                    multiline
                                    rows={10}
                                    value={currentQuote?.quote_services_expenses}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                    readOnly: true,
                                    style: { backgroundColor: 'white' }
                                    }}
                                /> */}

                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                            Estimated Total: ${estimatedTotalCost}
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Estimated Labor Cost: ${estimatedLaborCost}
                            </Typography>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Estimated Parts Cost: ${estimatedPartsCost}
                            </Typography>

                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Estimated Time: {estimatedTime}
                                </Typography>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                                Earliest Availability: {earliestAvailability}
                                </Typography>  
                                </Container>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    Notes
                                </Typography>
                                <Container maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                                    <TextField
                                        multiline
                                        rows={10}
                                        value={maintenanceQuotes[currentQuoteIndex]?.quote_notes}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                        readOnly: true,
                                        style: { backgroundColor: 'white' }
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        backgroundColor: "#CB8E8E",
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "100%",
                                    }}
                                    onClick={() => handleSubmit("CANCELLED")}
                                    >
                                    <Typography sx={{
                                        color: "#160449",
                                        fontWeight: theme.typography.primary.fontWeight, 
                                        fontSize: "14px"
                                    }}>
                                        Decline Quote
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        backgroundColor: "#9EAED6",
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "100%",
                                    }}
                                    onClick={() => handleSubmit()}
                                    >
                                    <Typography sx={{
                                        color: "#160449",
                                        fontWeight: theme.typography.primary.fontWeight, 
                                        fontSize: "14px"
                                    }}>
                                        Accept Quote
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
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
                        null
                    )
                }
                </Stack>
            </Paper>
        </Box>
    )
}