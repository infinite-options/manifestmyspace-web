import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid, Badge } from '@mui/material';
import theme from '../../theme/theme';
import propertyImage from './propertyImage.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ArrowLeft from './ArrowLeft.png';
import ArrowRight from './ArrowRight.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeaseIcon from './leaseIcon.png';
import CreateIcon from '@mui/icons-material/Create';
import { getPaymentStatusColor, getPaymentStatus } from './PropertyList.jsx';

export default function PropertyNavigator({index, propertyData, paymentStatus, paymentStatusColor}){
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(index);
    const item = propertyData[currentIndex];
    const [currentId, setCurrentId] = useState(item.property_uid);
    const [activeStep, setActiveStep] = useState(0);
    const [maintenanceData, setMaintenanceData] = useState([{}]);
    const [images, setImages] = useState(JSON.parse(propertyData[currentIndex].property_images));
    const color = theme.palette.form.main
    const maxSteps = images.length;

    useEffect(() => {
        const getMintenanceForProperty = async () => {
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${item.property_uid}`);
                if(!response.ok){
                    console.log("Error fetching maintenance data")
                }
                const data = await response.json();
                console.log("Maintenance Data", data)
                setMaintenanceData(data["MaintenanceProjects"].result);
            } catch (error) {
                console.log(error);
            }
        }
        getMintenanceForProperty();
    }, []);

    function displayTopMaintenanceItem(){

        console.log(maintenanceData)
        if(maintenanceData && maintenanceData.length > 0 && maintenanceData[0].maintenance_request_uid){
            const date = new Date(maintenanceData[0].maintenance_request_created_date)
            // console.log(date.toLocaleDateString())
            const title = maintenanceData[0].maintenance_title 
            // console.log(title)
            return date.toLocaleDateString() + "  " + title
        } else {
            return "No Open Maintenance Tickets"
        }
    }

    function numberOfMaintenanceItems(maintenanceItems){
        console.log(maintenanceItems)
        if(maintenanceItems && maintenanceItems.length > 0){
            return maintenanceItems.filter(mi => !!mi.maintenance_request_uid).length
        } else {
            return 0
        }
    }

    function navigateToMaintenanceAccordion(){
        console.log("click to maintenance accordion for property")
        navigate("/maintenance")

        // TODO: Need to send props to /maintenance to navigate to correct tab and item
    }

    
    const handleNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % propertyData.length);
      const nextId = propertyData[currentIndex+1].property_uid
      setCurrentId(nextId);
      setImages(JSON.parse(propertyData[currentIndex+1].property_images))
      setActiveStep(0);
    };
  
    const handlePreviousCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + propertyData.length) % propertyData.length);
        const previousId = propertyData[currentIndex-1].property_uid
        setCurrentId(previousId);
        setImages(JSON.parse(propertyData[currentIndex-1].property_images))
        setActiveStep(0);
    };
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleManagerChange = () => {
        if(item.business_uid) navigate("/managerDetails", { state: { ownerId: item.owner_uid, managerBusinessId: item.business_uid } });
        else navigate("/searchManager");
    };

    return(
        <Paper 
            sx={{
                backgroundColor: theme.palette.form.main,
            }}
            >
            <Box
                sx={{
                    flexDirection: 'column', // Added this to stack children vertically
                    justifyContent: 'center',
                    width: "100%", // Take up full screen width
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    paddingTop: "20px"
                }}
            > 
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Button onClick={handlePreviousCard} disabled={currentIndex == 0}>
                        {currentIndex === 0 ? (
                            // <img src={ArrowLeft} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowBackIcon sx={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                        ) : (
                            // <img src={ArrowLeft} style={{width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowBackIcon sx={{color: "#000000", width: '25px', height: '25px', margin:'0px'}}/>
                        )}
                    </Button>
                    <Stack
                        direction="column"
                        margin='0px'
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography
                            sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: '16px'}}
                        >
                            {currentIndex + 1} of {propertyData.length} Properties
                        </Typography>
                    </Stack>
                    <Button onClick={handleNextCard} disabled={currentIndex == propertyData.length-1}>
                        {currentIndex == propertyData.length-1 ? (
                            // <img src={ArrowRight} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowForwardIcon sx={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                        ) : (
                            // <img src={ArrowRight} style={{width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowForwardIcon sx={{color: "#000000", width: '25px', height: '25px', margin:'0px'}}/>
                        )}
                    </Button>  
                </Stack>
                <Stack
                    alignItems="center"
                    justifyContent="center"
                >
                    <Card
                       sx={{
                        backgroundColor: color,
                        boxShadow: "none",
                        elevation: "0",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                        >
                        <CardContent 
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Typography sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: theme.typography.propertyPage.fontSize}} paddingBottom="20px">
                                {item.property_address} {item.property_unit}, {item.property_city} {item.property_state} {item.property_zip}
                            </Typography>
                            <Box
                                sx={{
                                    // display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // width: "50%",
                                }}
                            >

                                <CardMedia
                                    component="img"
                                    image={images[activeStep]}
                                    sx={{
                                        elevation: "0",
                                        boxShadow: "none",
                                        maxWidth: "500px",
                                        minWidth: "200px",
                                        maxHeight: "500px",
                                        minHeight: "100px",
                                        height: "300px",
                                        objectFit: "cover",
                                        center: "true",
                                        alignContent: "center",
                                        justifyContent: "center",
                                    }}
                                />
                            </Box>
                            <MobileStepper
                                steps={maxSteps}
                                position="static"
                                activeStep={activeStep}
                                variant='text'
                                sx={{
                                    backgroundColor: color,
                                    width: "100%",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    elevation: "0",
                                    boxShadow: "none",

                                }}
                                nextButton={
                                    <Button
                                        size="small"
                                        onClick={handleNext}
                                        disabled={activeStep === maxSteps - 1}
                                    >
                                        {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                        ) : (
                                        <KeyboardArrowRight />
                                        )}
                                    </Button>
                                }
                                backButton={
                                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                        {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                        ) : (
                                        <KeyboardArrowLeft />
                                        )}
                                    </Button>
                                }
                            />
                        </CardContent>
                        <Grid container spacing={0}
                            alignContent="center"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            sx={{
                                backgroundColor: getPaymentStatusColor(item.rent_status),
                            }}
                        >   
                            <Grid item xs={12}>
                                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    <b>Rent Status:</b> {getPaymentStatus(item.rent_status)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <CardContent
                            sx={{
                                flexDirection: "column",
                                alignItems: "left",
                                justifyContent: "left",
                                width: "90%",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                    alignContent: "left",
                                    justifyContent: "left",
                                    alignItems: "left",
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                            }}
                                        >
                                            Rent: ${item.property_listed_rent}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingBottom: "10px"
                                            }}
                                        >
                                            Due: {item.lease_rent_due_by}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            sx={{
                                                padding: "0px"
                                            }}
                                            onClick={() => {console.log("View Lease")}}
                                        >
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                                View Lease
                                            </Typography>
                                            <img src={LeaseIcon} style={{ margin:'0px'}}/>
                                        </Button>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                Expiring: {item.lease_end}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Property Value
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                $527,000 (2022)

                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            $ Per Sqft
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                ${(1300/830).toFixed(2)}

                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    paddingLeft: "0px"
                                                }}
                                                onClick={() => {navigate('/editProperty', {state:{ currentId, item }})}}
                                            >
                                                <CreateIcon sx={{
                                                    color: theme.typography.common.blue,
                                                    paddingLeft: "0px"
                                                }}/>
                                            </Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Type
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_type}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Sqft
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                            {item.property_area}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Bed
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_num_beds}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Bath
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_num_baths}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                                Open Maintenance Tickets
                                            </Typography>
                                            <Badge 
                                                badgeContent={numberOfMaintenanceItems(maintenanceData)} 
                                                color="error"
                                                sx={{
                                                    paddingRight:"10px"
                                                }}
                                            />
                                            {/* <div style={{paddingLeft: "20px"}}>
                                                {maintenanceData && maintenanceData.length > 0 ? (
                                                    <Box display="flex" alignItems="right">
                                                        <KeyboardArrowRightIcon sx={{paddingRight: "10px"}} onClick={() => navigateToMaintenanceAccordion()}/>
                                                    </Box>
                                                ) : (null)}
                                            </div> */}
                                        </div>
                                    </Grid>
                                    <Grid item xs={1}></Grid>
                                    <Grid item xs={11}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                            }}
                                        >
                                            {displayTopMaintenanceItem()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        {maintenanceData && maintenanceData.length > 0 && maintenanceData[0].maintenance_request_uid &&
                                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue }}/>}
                                    </Grid>
                                    {/* <Grid item xs={2}>
                                        <Badge badgeContent={numberOfMaintenanceItems(maintenanceData)} color="error" width="20px" height="20px" 
                                            sx={{
                                                paddingRight:"10px"
                                            }}
                                        >
                                        </Badge>
                                    </Grid> */}
                                    {/* <Grid item xs={6}>
                                        {maintenanceData && maintenanceData.length > 0 ? (
                                            <Box display="flex" alignItems="right">
                                                <KeyboardArrowRightIcon sx={{paddingRight: "10px"}} onClick={() => navigateToMaintenanceAccordion()}/>
                                            </Box>
                                        ) : (null)}
                                    </Grid> */}
                                    <Grid item xs={11}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Tenant
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {(item.lease_start && item.tenant_uid)?
                                                `${item.lease_start}: ${item.tenant_first_name} ${item.tenant_last_name}`:
                                                "No Tenant"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}></Grid>
                                    <Grid item xs={11}>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                            Property Manager
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                            {(item.business_uid)?
                                            `${item.business_name}`:
                                            "No Manager"}
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={1} sx={{ display: "flex", flexWrap: "wrap", alignContent: "end" }}>
                                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue, cursor: "pointer" }} onClick={handleManagerChange}/>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </Paper>
    )
}