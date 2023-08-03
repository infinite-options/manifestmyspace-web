import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack } from '@mui/material';
import theme from '../../theme/theme';
import maintenaceRequestImage from './maintenanceRequest.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


export default function RequestNavigator({requestData, color, item}){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const images = [
        {
          label: 'San Francisco – Oakland Bay Bridge, United States',
          imgPath:
            'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
        },
        {
          label: 'Bird',
          imgPath:
            'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
        },
        {
          label: 'Bali, Indonesia',
          imgPath:
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
        },
        {
          label: 'Goč, Serbia',
          imgPath:
            'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
        },
      ];
    const maxSteps = images.length;

    const handleNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % requestData.length);
    };
  
    const handlePreviousCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + requestData.length) % requestData.length);
    };
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleStepChange = (step) => {
      setActiveStep(step);
    };
  

    const data = requestData[currentIndex]

    return(
        <div style={{paddingBottom: "10px"}}>
            <Box
                sx={{
                    flexDirection: 'column', // Added this to stack children vertically
                    justifyContent: 'center',
                    width: "100%", // Take up full screen width
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    // backgroundColor: '#3D5CAC80',
                    backgroundColor: color,
                }}
            > 
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    // width= "100%" // Take up full screen width
                    spacing={2}
                >
                    <Button onClick={handlePreviousCard} disabled={requestData.length <= 1}>
                        <ArrowBackIcon />
                    </Button>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        // width= "100%" // Take up full screen width
                        spacing={2}
                    >
                        <Typography
                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont}}
                            >
                            {item.status}
                        </Typography>
                        <Typography
                            sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont}}
                        >
                            {currentIndex + 1} of {requestData.length}
                        </Typography>
                    </Stack>
                    <Button onClick={handleNextCard} disabled={requestData.length <= 1}>
                        <ArrowForwardIcon />
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
                        // sx={{
                        //     backgroundColor: color,
                        //     boxShadow: "none",
                        //     elevation: "0",
                        //     width: "100%",
                        //     center: "true",
                        //     alignItems: "center",
                        //     justifyContent: "center",
                        // }}
                        >
                        <CardContent 
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                            // sx={{
                            //     center: "true",
                            //     alignItems: "center",
                            //     justifyContent: "center",
                            //     width:"100%",
                            // }}
                        >
                            <CardMedia
                                component="img"
                                image={images[activeStep].imgPath}
                                sx={{
                                    elevation: "0",
                                    boxShadow: "none",
                                    minWidth: "50%",
                                    center: "true",
                                    alignContent: "center",
                                    justifyContent: "center",
                                }}
                            />
                            <MobileStepper
                                steps={maxSteps}
                                position="static"
                                activeStep={activeStep}
                                nextButton={
                                <Button
                                    size="small"
                                    onClick={handleNext}
                                    disabled={activeStep === maxSteps - 1}
                                >
                                    Next
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
                                    Back
                                </Button>
                                }
                            />
                            {/* <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.largeFont}}
                            >
                                {data.title}    
                            </Typography> */}
                            <div
                                style={{paddingTop: "10px"}}
                            >
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.priority} Priority
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.request_created_date}
                                </Typography>
                                <Typography
                                    sx={{
                                        overflowWrap: 'break-word',
                                        color: theme.typography.secondary.white, 
                                        fontWeight: theme.typography.secondary.fontWeight, 
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.description}
                                </Typography>
                                <Typography
                                    sx={{
                                        overflowWrap: 'break-word',
                                        color: theme.typography.secondary.white, 
                                        fontWeight: theme.typography.secondary.fontWeight, 
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.request_type}
                                </Typography>
                                <Typography
                                    sx={{
                                        overflowWrap: 'break-word',
                                        color: theme.typography.secondary.white, 
                                        fontWeight: theme.typography.secondary.fontWeight, 
                                        fontSize: theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.notes}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </div>
    )
}