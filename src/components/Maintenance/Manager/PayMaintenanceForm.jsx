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
import CreateChargeModal from "../../CreateChargeModal";

import APIConfig from "../../../utils/APIConfig";

import dayjs from "dayjs";

export default function PayMaintenanceForm(){

    const navigate = useNavigate();
    const location = useLocation();
    const maintenanceItem = location.state.maintenanceItem;
    const navigationParams = location.state.navigateParams;
    const [displayImages, setDisplayImages] = useState([])
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [showSpinner, setShowSpinner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // const [amount, setAmount] = useState(props.maintenanceItem.bill_amount || '');
    let maintenance_request_index = navigationParams.maintenanceRequestIndex
    let status = navigationParams.status
    let maintenanceItemsForStatus = navigationParams.maintenanceItemsForStatus
    let allMaintenanceData = navigationParams.allData


    const handleSubmit = () => {
        navigate("/payments", {state: {maintenanceItem}})
    }

    const modalSubmit = async (chargeAmount) => {
        console.log("Printing modal submit")

        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        console.log("now, nextWeek", now, nextWeek)

        const formData = new FormData();
        // WIP TODO
        formData.append("bill_description", `Maintenance ID: ${maintenanceItem.maintenance_request_uid} Completed On: ${maintenanceItem.maintenance_scheduled_date}`);
        formData.append("bill_created_by", `${maintenanceItem.business_uid}`)
        formData.append("bill_utility_type", "maintenance")
        formData.append("bill_amount", Number(chargeAmount))
        formData.append("bill_split", "Uniform")
        formData.append("bill_property_id", JSON.stringify([{"property_uid":`${maintenanceItem.property_uid}`}]))
        formData.append("bill_notes", `Charge from ${maintenanceItem.business_name} for ${maintenanceItem.maintenance_title}`)
        formData.append("bill_maintenance_quote_id", `Completed by ${maintenanceItem.business_uid} on ${maintenanceItem.maintenance_scheduled_date}`)

        console.log(`url ${APIConfig.baseURL.dev}/bills`)

        try {
            fetch(`${APIConfig.baseURL.dev}/bills`, {
                method: "POST",
                body: formData,
            })
        } catch (error) {
            console.log(error)
        }
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
                            <Container
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#FFFFFF',
                                    padding: '20px',
                                    width: '90%',
                                    borderRadius: '10px',
                                }}
                                maxWidth={false}
                            >
                                <Typography
                                    align="center"
                                    sx={{
                                        color: theme.typography.primary.blue,
                                        fontWeight: theme.typography.primary.fontWeight,
                                        fontSize: '16px',
                                    }}
                                >
                                    {maintenanceItem.bill_amount !== null && maintenanceItem.quote_status === 'FINISHED'
                                        ? `$${maintenanceItem.bill_amount}`
                                        : (
                                            // maintenanceItem.bill_amount === null &&
                                                maintenanceItem.quote_status !== 'FINISHED' && maintenanceItem.quote_status !== 'COMPLETED' &&
                                                maintenanceItem.maintenance_request_status === 'COMPLETED' ? (
                                                    <Grid item xs={12}>
                                                        <Button variant="contained" color="primary" type="submit" sx={{backgroundColor: "#3D5CAC", pointerEvents: "auto"}} onClick={() => setShowModal(true)}>
                                                            <Typography sx={{color: "#FFFFFF",  textTransform: "none", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                                Create Charge for Owner
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                ) : 'No Invoice Submitted'
                                            )}
                                </Typography>
                            </Container>
                        </Grid>
                        {maintenanceItem.bill_amount !== null && maintenanceItem.quote_status === "FINISHED" ? (
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
            <CreateChargeModal
                open={showModal}
                setOpenModal={setShowModal}
                maintenanceItem={maintenanceItem}
                handleModalSubmit={modalSubmit}
            />
        </Box>
    )
}