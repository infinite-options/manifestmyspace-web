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
    Checkbox,
    FormControlLabel,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import refundIcon from './../../Property/refundIcon.png';
import documentIcon from './Subtract.png'
import maintenanceRequestImage from "./../maintenanceRequest.png";



// /businessDeclineQuoteForm
// /businessAcceptQuoteForm
export default function BusinessQuoteForm({acceptBool}){

    console.log("QuoteAcceptForm")
    const navigate = useNavigate();
    const location = useLocation();
    // const maintenanceItem = location.state.maintenanceItem;
    // const navigationParams = location.state.navigateParams

    const quoteRequest = {
        maintenance_quote_uid: "MQ12345678",
        quote_maintenance_request_id: "MR12345678",
        quote_business_id: "BIZ1234567",
        quote_services_expenses: JSON.stringify({
            labor: 150.50,
            parts: [
                { name: "Pipe", cost: 25.00 },
                { name: "Valve", cost: 10.50 }
            ],
            taxes: 18.75,
            total: 204.75
        }),
        quote_earliest_availability: new Date().toISOString(),
        quote_event_type: "Repair",
        quote_event_duration: "2 hours",
        quote_notes: "Pipe leakage repair",
        quote_status: "Pending",
        quote_created_date: new Date().toISOString(),
        quote_total_estimate: "$204.75",
        quote_maintenance_images: JSON.stringify([
            maintenanceRequestImage,
            maintenanceRequestImage
        ]),
        quote_adjustment_date: new Date().toISOString()
    }

    const maintenanceItem = {
        maintenance_request_uid: "MR12345678",
        maintenance_property_id: "PROP123456",
        maintenance_title: "Pipe Leakage",
        maintenance_desc: "There's a leakage in the pipe located in the bathroom, causing water to spill over.",
        maintenance_images: JSON.stringify([
            "https://example.com/maintenance_image1.jpg",
            "https://example.com/maintenance_image2.jpg"
        ]),
        maintenance_request_type: "Repair",
        maintenance_request_created_by: "JohnDoe45",
        maintenance_priority: "High",
        maintenance_can_reschedule: 1, // Assuming 1 is true and 0 is false
        maintenance_assigned_business: "BIZ1234567",
        maintenance_assigned_worker: "WRK1234567",
        maintenance_scheduled_date: "2023-09-25",
        maintenance_scheduled_time: "15:30",
        maintenance_frequency: "One-time",
        maintenance_notes: "The leak seems to be from a broken seal. Might require replacement parts.",
        maintenance_request_status: "Scheduled",
        maintenance_request_created_date: new Date("2023-09-18T10:30:00").toISOString(),
        maintenance_request_closed_date: null, // Assuming it's not closed yet
        maintenance_request_adjustment_date: new Date("2023-09-18T11:00:00").toISOString(),
        maintenance_callback_number: "123-456-7890",
        maintenance_estimated_cost: "$150"
    };



    //console.log("navigationParams", navigationParams)
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [checked, setChecked] = useState(true);

    const [part, setPart] = useState('');
    const [partCost, setPartCost] = useState('');
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [availabilityTime, setAvailabilityTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleChange = (event) => {
        console.log("handleChange", event.target.checked)
        setChecked(event.target.checked);
    };

    const handleNotesChange = (event) => {
        console.log("handleNotesChange", event.target.value)
        setNotes(event.target.value);
    }


    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        // console.log("handleBackButton")
        // let maintenance_request_index = navigationParams.maintenanceRequestIndex
        // let status = navigationParams.status
        // let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
        // let allMaintenanceData = navigationParams.allData
        // console.log("-----navigationParams-----")
        // console.log("maintenance_request_index", maintenance_request_index)
        // console.log("status", status)
        // console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
        // console.log("allMaintenanceData", allMaintenanceData)
        // console.log("--------------------------")

        // navigate("/maintenance/detail", {
        //     state: {
        //         maintenance_request_index,
        //         status,
        //         maintenanceItemsForStatus,
        //         allMaintenanceData,
        //     }
        // }); 
        navigate(-1)
    }


    const handleSubmit = (status) => {
        console.log("handleSubmit")
        
        
        const changeMaintenanceRequestStatus = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "maintenance_request_uid": maintenanceItem?.maintenance_request_uid,
                        "maintenance_request_status": "ACCEPTED"
                    })
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    navigate("/maintenance")
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
        }

        const changeQuoteStatus = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/quotes", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "quote_maintenance_request_id": quoteRequest?.maintenance_quote_uid,
                        "quote_maintenance_contacts": quoteRequest?.quote_business_id,
                        "quote_notes": notes,
                        "quote_status": status
                    })
                });

            } catch (error){
                console.log("error", error)
            }
        }


        changeMaintenanceRequestStatus()
        changeQuoteStatus()
    }

    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    useEffect(() => {
        let imageArray = JSON.parse(quoteRequest?.quote_maintenance_images)
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
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                        }}
                    >
                        <Box position="absolute" left={10}>
                            <Button onClick={() => handleBackButton()}>
                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
                                <Typography sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '14px'}}>
                                    Return to Viewing All Properties
                                </Typography>
                            </Button>
                        </Box>
                        <Box position="absolute" right={10}>
                            <Button onClick={() => navigateToAddMaintenanceItem()}>
                                <ArrowForwardIcon sx={{color: "#3D5CAC", fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                    {/* <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                     >
                        <Grid item xs={12}> */}
                            <Card
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                    paddingTop: "25px",
                                    minWidth: "300px"
                                }}>
                                <Grid container
                                    // alignContent="center"
                                    // justifyContent="center"
                                    // alignItems="center"
                                    direction="column"
                                >
                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "15px"}}>
                                                {maintenanceItem.maintenance_title}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center" sx={{padding: "0px"}}>
                                            {numImages() > 0 ? 
                                                (
                                                    Array.isArray(displayImages) && displayImages.length > 0 ? 
                                                    displayImages.map((image, index) => (
                                                        <Grid item key={index} sx={{paddingLeft: "0px", paddingTop: "0px"}}>
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
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            { numImages() > 0 ? numImages() + " Images" : "No Images" }
                                        </Typography>
                                    </Grid>
                                     <Grid item xs={12}>
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            <b>{maintenanceItem?.maintenance_priority} Priority</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            <b>Property Address</b>
                                        </Typography>
                                        <div style={{paddingLeft: "10px"}}>
                                            <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                                103 N. Abel St, Milpitas CA 95035
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            <b>Reported</b>
                                        </Typography>
                                        <div style={{paddingLeft: "10px"}}>
                                            <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                                04/17/22
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                         <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            <b>Days Open</b>
                                        </Typography>
                                        <div style={{paddingLeft: "10px"}}>
                                            <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                                3 Days
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                         <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            <b>Description</b>
                                        </Typography>
                                        <div style={{paddingLeft: "10px"}}>
                                            <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                                Urgent maintenance is required due to a broken pipe. The pipe has suffered damage, resulting in water leakage and potential water damage. Immediate attention is needed to repair the pipe and prevent further complications 
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" spacing={1}>
                                    {acceptBool ? (
                                        <>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    # of hours
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    Charge/Hour
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    Total Cost
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    Cost of Parts
                                                </Typography>
                                            </Grid>
                                            {/* <Grid container spacing={1}> */}
                                                <Grid item xs={6} sx={{paddingTop: "10px"}}>
                                                    <TextField
                                                        label="Part"
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sx={{paddingTop: "10px"}}>
                                                    <TextField
                                                        label="Part Cost"
                                                        size="small"
                                                    />
                                                </Grid>
                                            {/* </Grid> */}
                                            <Grid item xs={12}>
                                                <Button sx={{
                                                    color: "#3D5CAC",
                                                    textTransform: "none",
                                                }}>
                                                    <AddIcon/> 
                                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                                        Add Row
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                                    Earliest Availability
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{paddingTop: "10px"}}>
                                                <TextField
                                                    label="Date"
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sx={{paddingTop: "10px"}}>
                                                <TextField
                                                    label="Time"
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                                    Notes
                                                </Typography>
                                                <div style={{paddingLeft: "10px"}}>
                                                    <TextField
                                                        multiline
                                                        required
                                                        rows={2}
                                                        borderRadius="10px"
                                                        variant="outlined"
                                                        fullWidth 
                                                        InputProps={{
                                                            readOnly: false,
                                                            style: { 
                                                                backgroundColor: 'white',
                                                                borderColor: '#000000'
                                                            }
                                                        }}
                                                        onChange={handleNotesChange}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={handleChange}
                                                            color="primary"
                                                            sx={{
                                                                color: "#3D5CAC"
                                                            }}
                                                        />
                                                    }
                                                    sx={{
                                                        color: "#3D5CAC"
                                                    }}
                                                    label="Diagnostic fees included or extra"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                                <Button
                                                    sx={{
                                                        padding: "0px"
                                                    }}
                                                >
                                                    <img src={documentIcon} style={{width: '18px', height: '25px', margin:'5px'}}/>
                                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                        Add Document
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                                <Button
                                                    variant="contained"
                                                    disableElevation
                                                    sx={{
                                                        backgroundColor: "#668AAE",
                                                        textTransform: "none",
                                                        borderRadius: "10px",
                                                        display: 'flex',
                                                        width: "100%",
                                                    }}
                                                    onClick={() => handleSubmit("SENT")}
                                                    >
                                                    <Typography sx={{
                                                        fontWeight: theme.typography.primary.fontWeight, 
                                                        fontSize: "14px",
                                                        color: "#FFFFFF",
                                                        textTransform: "none",
                                                    }}>
                                                        Send Quote
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                                    Notes
                                                </Typography>
                                                <div style={{paddingLeft: "10px"}}>
                                                    <TextField
                                                        multiline
                                                        required
                                                        rows={5}
                                                        borderRadius="10px"
                                                        variant="outlined"
                                                        fullWidth 
                                                        InputProps={{
                                                            readOnly: false,
                                                            style: { 
                                                                backgroundColor: 'white',
                                                                borderColor: '#000000'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                                <Button
                                                    variant="contained"
                                                    disableElevation
                                                    sx={{
                                                        backgroundColor: "#668AAE",
                                                        textTransform: "none",
                                                        borderRadius: "10px",
                                                        display: 'flex',
                                                        width: "100%",
                                                    }}
                                                    onClick={() => handleSubmit("REFUSED")}
                                                    >
                                                    <Typography sx={{
                                                        fontWeight: theme.typography.primary.fontWeight, 
                                                        fontSize: "14px",
                                                        color: "#FFFFFF",
                                                        textTransform: "none",
                                                    }}>
                                                        Decline Quote
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Card>
                </Stack> 
            </Paper>
        </Box>
    )
}