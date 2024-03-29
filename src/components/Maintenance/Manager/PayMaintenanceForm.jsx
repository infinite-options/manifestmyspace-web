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
import userFillIcon from './User_fill.png'
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function PayMaintenanceForm(){

    const navigate = useNavigate();
    const location = useLocation();
    const maintenanceItem = location.state.maintenanceItem;
    const navigationParams = location.state.navigateParams;
    const [displayImages, setDisplayImages] = useState([])
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [showSpinner, setShowSpinner] = useState(false);
    let maintenance_request_index = navigationParams.maintenanceRequestIndex
    let status = navigationParams.status
    let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
    let allMaintenanceData = navigationParams.allData

    console.log(maintenanceItem)

    const handleSubmit = () => {
        navigate("/payments", {state: {maintenanceItem}})
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
                                    margin: "10px",
                                    paddingTop: "25px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px"
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
                    <Grid container spacing={0}
                        alignContent="left"
                        justifyContent="left"
                        alignItems="left"
                        direction="column"
                    >
                        
                        <Grid item xs={12} sx={{padding: "25px"}}>
                            <img src={userFillIcon} alt="user" style={{ width: '25px', height: '25px' }} />
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                                <u>{maintenanceItem.business_name}</u>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{paddingTop: "25px"}}>
                        <Grid item xs={12}>
                            <Container style={{ 
                                display: 'flex',           // Turn the container into a flex container
                                flexDirection: 'column',   // Stack children vertically
                                justifyContent: 'center',  // Center children vertically
                                alignItems: 'center',      // Center children horizontally
                                backgroundColor: '#FFFFFF', 
                                padding: '20px',
                                width: '90%',             // Make sure the container takes the full width of its parent
                                borderRadius: '10px',      // Rounded border
                            }} maxWidth={false}> 
                                <Typography align="center" sx={{color: theme.typography.primary.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>  {/* This will center the text inside the Typography component */}
                                    {maintenanceItem.bill_amount !== null ? `${maintenanceItem.bill_amount}` : "No Invoice Submitted"}
                                </Typography>
                            </Container>       
                        </Grid>
                        {maintenanceItem.bill_amount !== null ? (
                            <>
                                <Grid item xs={12}>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        Notes
                                    </Typography>
                                    <Container maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                                        <TextField
                                            multiline
                                            rows={10}
                                            defaultValue={maintenanceItem.bill_notes}
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                                style: { backgroundColor: 'white' }
                                            }}
                                            sx={{
                                                width: '90%',
                                            }}
                                        />
                                    </Container>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        Paypal: bossanova43@gmail.com
                                    </Typography>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        Venmo: bossanova43@gmail.com
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        
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
                            </>
                            ) : null}
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}