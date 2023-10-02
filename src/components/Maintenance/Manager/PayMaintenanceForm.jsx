import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider, 
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    ListItemText,
    Checkbox,
    Grid,
    Card,
    TextField,
    Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import User_fill from './User_fill.png';


export default function PayMaintenanceForm(){

    const navigate = useNavigate();
    const location = useLocation();
    const maintenanceItem = location.state.maintenanceItem;
    const navigationParams = location.state.navigateParams;
    const [displayImages, setDisplayImages] = useState([])
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    let maintenance_request_index = navigationParams.maintenanceRequestIndex
    let status = navigationParams.status
    let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
    let allMaintenanceData = navigationParams.allData

    console.log("PayMaintenanceForm", maintenanceItem, navigationParams)

    const handleSubmit = () => {
        console.log("handleSubmit")
        const changeMaintenanceRequestStatus = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "maintenance_request_uid": maintenanceItem.maintenance_request_uid,
                        "maintenance_request_status": "PAID"
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
        const changeMaintenanceQuoteStatus = async () => {

            const formData = new FormData();
            //formData.append("quote_maintenance_request_id", maintenanceItem.maintenance_quote_uid)
            formData.append("maintenance_quote_uid", maintenanceItem.maintenance_quote_uid);
            formData.append("maintenance_request_status", "COMPLETED")
            
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
                    method: 'PUT',
                    body: formData
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    changeMaintenanceRequestStatus()
                    navigate("/maintenance/detail", {
                        state: {
                            maintenance_request_index,
                            status,
                            maintenanceItemsForStatus,
                            allMaintenanceData,
                        }
                    }); 
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
        }
        changeMaintenanceQuoteStatus()
    }

    useEffect(() => {
        let imageArray = JSON.parse(maintenanceItem.maintenance_images)

        setDisplayImages(imageArray)
    }, [])


    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate("/maintenance/detail", {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        }); 
    }

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
                        paddingTop: "20px",
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
                                    backgroundColor: "#3D5CAC",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                    paddingTop: "30px"
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
                                            <u>{maintenanceItem?.property_address}, {maintenanceItem.property_city} {maintenanceItem.property_state} {maintenanceItem.property_zip}</u>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <b>{maintenanceItem.maintenance_title}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <b>{maintenanceItem.maintenance_desc}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            Estimated Cost: <b>{maintenanceItem.maintenance_desc}</b>
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
                            backgroundColor: "#3D5CAC",
                        }}
                    >   
                        <Grid item xs={12}>
                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                <b>Paying Maintenance</b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="row"
                        sx={{
                            paddingTop: "20px",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                        }}
                    >
                        <Grid item xs={12}>
                            <img
                                src={User_fill}
                                alt="User Icon"
                                style={{ width: "25px", height: "26px", margin:'0px' }}
                            />
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                {maintenanceItem.business_name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                            <Container 
                                maxWidth="sm" 
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    backgroundColor: '#FFFFFF', 
                                    padding: '10px', 
                                    width: '100%',
                                    borderRadius: '10px',
                                }}
                            >    
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "20px"}}>
                                    $100
                                </Typography>   
                            </Container>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                Notes
                            </Typography>
                            <Container 
                                maxWidth="sm" 
                                style={{ 
                                    display: 'flex', 
                                    // flexDirection: 'column', 
                                    // justifyContent: 'center', 
                                    // alignItems: 'center', 
                                    backgroundColor: '#FFFFFF', 
                                    padding: '10px', 
                                    width: '100%',
                                    borderRadius: '10px',
                                }}
                            >    
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.secondary.fontWeight, fontSize: "14px"}}>
                                    {maintenanceItem.quote_notes}
                                </Typography>   
                            </Container>
                        </Grid>
                        <Grid item xs={12}>
                            Paypal: bossanova43@gmail.com
                        </Grid>
                        <Grid item xs={12}>
                            Venmo: bossanova43@gmail.com
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
                                    Pay Maintenance
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}