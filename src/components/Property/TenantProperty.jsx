import React, { useEffect, useState } from 'react';

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
    CardContent,
    CardMedia,
    Badge,
    MobileStepper,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import AddIcon from '@mui/icons-material/Add';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import PropertyNavigator from '../Property/PropertyNavigator';
import refundIcon from './refundIcon.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// import propertyImage from './propertyImage.png';
import propertyImage from './propertyImage.png';
import ArrowLeft from './ArrowLeft.png';
import ArrowRight from './ArrowRight.png';
import LeaseIcon from './leaseIcon.png';
import MapIcon from './mapIcon.png';
import EmailIcon from './emailIcon.png';
import PhoneIcon from './phoneIcon.png';



export default function TenantProperty({ }) {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(0);

    const paymentStatusMap = {
        "Paid On Time": theme.palette.priority.clear,
        "Partially Paid": theme.palette.priority.low,
        "Paid Late": theme.palette.priority.medium,
        "Not Paid": theme.palette.priority.high
    }
    
    const location = useLocation();
    const propertyData = location.state.propertyData[0];

    const color = theme.palette.form.main

    // const images = [
    //     {
    //       label: 'maintenanceRequest',
    //       imgPath: propertyImage,
    //     },
    //     {
    //       label: 'maintenanceRequest',
    //       imgPath: propertyImage,
    //     },
    //     {
    //       label: 'maintenanceRequest',
    //       imgPath: propertyImage,
    //     },
    //     {
    //       label: 'maintenanceRequest',
    //       imgPath: propertyImage,
    //     },
    //   ];
      let images = JSON.parse(propertyData.property_images);

    
      const maxSteps = images.length;
    
      const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };


    return( 
        <ThemeProvider theme={theme}>
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
                        margin: '30px',
                        backgroundColor: theme.palette.primary.main,
                        width: '100%', // Occupy full width with 25px margins on each side
                        paddingTop: '10px',
                    }}
                >
                     <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingBottom: "10px"
                        }}
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                My Property
                            </Typography>
                        </Box>
                        <Box position="absolute" right={30}>
                            {/* <Button onClick={() => navigateToAddProperty()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button> */}
                        </Box>
                    </Stack>
                    {/* <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        // sx={{
                        //     paddingBottom: "20px"
                        // }}
                    >
                        <Box>
                            <Button onClick={() => handleBackButton()}>

                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
                                <Typography sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '16px'}}>
                                    Return to Viewing All Properties
                                </Typography>
                            </Button>
                        </Box>
                    </Stack> */}
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                            width: '95%',
                            paddingBottom: '20px',
                        }}>
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
                                    {/* <Stack
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
                                    </Stack> */}
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
                                                    {/* {item.property_address} {item.property_unit}, {item.property_city} {item.property_state} {item.property_zip} */}
                                                    {propertyData.property_address} {propertyData.property_unit}, {propertyData.property_city} {propertyData.property_state} {propertyData.property_zip}
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
                                                            minHeight: "200px",
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
                                            {/* <Grid container spacing={0}
                                                alignContent="center"
                                                justifyContent="center"
                                                alignItems="center"
                                                direction="column"
                                                sx={{
                                                    backgroundColor: paymentStatusMap["Paid Late"],
                                                }}
                                            >   
                                                <Grid item xs={12}>
                                                    <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                        <b>Rent Status:</b> Paid Late
                                                    </Typography>
                                                </Grid>
                                            </Grid> */}
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
                                                    <Grid container spacing={8}>
                                                        <Grid item xs={6}>
                                                            <Typography
                                                                sx={{
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                }}
                                                            >
                                                            Rent: ${propertyData.property_listed_rent}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.medium.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingBottom: "10px"
                                                                }}
                                                            >
                                                                Due: {propertyData.earliest_due_date}                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                sx={{
                                                                    padding: "0px"
                                                                }}
                                                                onClick={() => { console.log("View Lease"); navigate('/tenantLeases')}}
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
                                                                        fontWeight: theme.typography.medium.fontWeight,
                                                                        fontSize:theme.typography.smallFont,
                                                                    }}
                                                                >
                                                                    Expiring: {propertyData.lease_end}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
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
                                                                    {/* $527,000 (2022) */}
                                                                    ???
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
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
                                                                {/* {item.property_area} */}
                                                                {propertyData.property_area}
                                                              
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
                                                                    {propertyData.property_type}
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
                                                                    {/* {item.property_num_beds} */}
                                                                    {propertyData.property_num_beds}
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
                                                                    {/* {item.property_num_baths} */}
                                                                    {propertyData.property_num_baths}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px",
                                                                    // justifyContent: 'center',
                                                                    // alignItems: 'center',
                                                                    // textAlign: 'center',
                                                                }}
                                                            >
                                                                Open Maps
                                                                <img src={MapIcon} style={{ paddingLeft: "20px", margin:'0px', width:"20px", height: "20px", verticalAlign: 'middle',}}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}
                                                            >
                                                                Open Maintenance Tickets ??
                                                            </Typography>
                                                            <Typography
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        color: theme.typography.primary.black,
                                                                        fontWeight: theme.typography.light.fontWeight,
                                                                        fontSize:theme.typography.smallFont,
                                                                    }}
                                                                >
                                                                    05/05/2021: Water Heater ??
                                                                    <Badge
                                                                        overlap="circular"
                                                                        color="error"
                                                                        badgeContent={10} //{property.maintenanceItems.length}
                                                                        anchorOrigin={{
                                                                            vertical: 'center',
                                                                            horizontal: 'center',
                                                                        }}
                                                                        style={{
                                                                            color: "#000000",
                                                                            paddingLeft: "10px",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            borderRadius: '50%'
                                                                            // color: theme.palette.custom.blue,   
                                                                        }}
                                                                    > 
                                                                    </Badge>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={2} sx={{display: "flex", alignContent: "right"}}>
                                                            <img src={ArrowRight} style={{ 
                                                                margin:'0px', 
                                                                width:"20px", 
                                                                height: "20px",
                                                                alignContent: 'center',
                                                                alignItems: 'center',
                                                                verticalAlign: 'middle',
                                                            }}/>
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
                                                                    05/05/2021: Ringo Starr ?
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
                                                                    <img src={PhoneIcon} style={{ paddingLeft: "20px", margin:'0px', width:"20px", height: "20px"}}/>
                                                                    <img src={EmailIcon} style={{ paddingLeft: "20px", margin:'0px', width:"20px", height: "20px"}}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                       color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    Community Codes ??
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={1}></Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    Gym
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    #1234
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={1}></Grid>
                                                        <Grid item xs={1}></Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    Pool
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    #1234
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={1}></Grid>
                                                        <Grid item xs={1}></Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    Main Gate
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={5}
                                                            sx={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    color: theme.typography.primary.black,
                                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                                    fontSize:theme.typography.smallFont,
                                                                    paddingRight: "10px"
                                                                }}>
                                                                    #1234
                                                                </Typography>
                                                        </Grid>
                                                        <Grid item xs={1}></Grid>
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}