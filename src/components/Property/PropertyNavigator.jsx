import React, { useState, useEffect } from 'react';
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


export default function PropertyNavigator({propertyId, index, propertyData, maintenanceData, paymentStatus, paymentStatusColor}){
    const [currentIndex, setCurrentIndex] = useState(index);
    const [currentId, setCurrentId] = useState(propertyId);
    const [activeStep, setActiveStep] = useState(0);
    const [images, setImages] = useState(JSON.parse(propertyData[currentIndex].property_images));

    const color = theme.palette.form.main
    const maxSteps = images.length;
    const item = propertyData[currentIndex];
    const maintenanceItems = maintenanceData[currentIndex];

    console.log(item)
    console.log(maintenanceItems)

    function displayTopMaintenanceItem(maintenanceItems){
        console.log(maintenanceItems)
        if(maintenanceItems && maintenanceItems.length > 0){
            const date = new Date(maintenanceItems[0].maintenance_request_created_date)
            // console.log(date.toLocaleDateString())
            const title = maintenanceItems[0].maintenance_title 
            // console.log(title)
            return date.toLocaleDateString() + "  " + title
        } else {
            return "No Open Maintenance Tickets"
        }
    }

    function numberOfMaintenanceItems(maintenanceItems){
        console.log(maintenanceItems)
        if(maintenanceItems && maintenanceItems.length > 0){
            return maintenanceItems.length
        } else {
            return 0
        }
    }

    function navigateToMaintenanceAccordion(){
        console.log("click to maintenance accordion for property")
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
                                backgroundColor: getPaymentStatusColor(item.payment_status),
                            }}
                        >   
                            <Grid item xs={12}>
                                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    <b>Rent Status:</b> {getPaymentStatus(item.payment_status)}
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
                                            Due: {item.due}
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
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
                                        
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
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                            }}
                                        >
                                            {displayTopMaintenanceItem(maintenanceItems)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Badge badgeContent={numberOfMaintenanceItems(maintenanceItems)} color="error" width="20px" height="20px" 
                                            sx={{
                                                paddingRight:"10px"
                                            }}
                                        >
                                        </Badge>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {maintenanceItems && maintenanceItems.length > 0 ? (
                                            <Box display="flex" alignItems="right">
                                                <KeyboardArrowRightIcon sx={{paddingRight: "10px"}} onClick={() => navigateToMaintenanceAccordion()}/>
                                            </Box>
                                        ) : (null)}
                                    </Grid>
                                    <Grid item xs={12}>
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
                                                05/05/2021: Ringo Starr
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
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
                                            <Button
                                                sx={{
                                                    paddingLeft: "0px"
                                                }}
                                                onClick={() => {console.log("edit property manager")}}
                                            >
                                                <CreateIcon sx={{
                                                    color: theme.typography.common.blue,
                                                    paddingLeft: "0px"
                                                }}/>
                                            </Button>
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                John Lennon
                                        </Typography>

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