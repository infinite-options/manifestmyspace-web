import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack } from '@mui/material';
import theme from '../../theme/theme';
import maintenaceRequestImage from './maintenanceRequest.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


export default function MaintenanceRequestNavigator({requestIndex, requestData, color, item, allData}){
    const [currentIndex, setCurrentIndex] = useState(requestIndex);
    const [activeStep, setActiveStep] = useState(0);
    const [formattedDate, setFormattedDate] = useState("")
    const [numOpenRequestDays, setNumOpenRequestDays] = useState("")


    console.log("RequestNavigator")
    console.log("requestIndex", requestIndex)
    console.log("requestData", requestData)
    console.log("color", color)
    console.log("item", item)
    console.log("allData", allData)

    const images = [
        {
          label: 'maintenanceRequest',
          imgPath: maintenaceRequestImage,
        },
        {
          label: 'maintenanceRequest',
          imgPath: maintenaceRequestImage,
        },
        {
          label: 'maintenanceRequest',
          imgPath: maintenaceRequestImage,
        },
        {
          label: 'maintenanceRequest',
          imgPath: maintenaceRequestImage,
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
  
    function formatDate(date){
        let formattedDate = ""
        let openTime = ""
        if (date){
            const postDate = new Date(date)
            let currentDate = new Date()
            formattedDate = postDate.toLocaleDateString()
            const diffInMilliseconds = currentDate.getTime() - postDate.getTime()
            openTime = Math.floor(diffInMilliseconds / (1000 * 3600 * 24))
        }
        console.log("formattedDate", formattedDate, "openTime", openTime)
        setNumOpenRequestDays(openTime)
        setFormattedDate(formattedDate)
    }


    const data = requestData[currentIndex]
    // which tab are we on?
    // console.log("requestData", requestData)
    // console.log("data", data)

    useEffect(() => {
        formatDate(data.maintenance_request_created_date)
    }, [data]) 
    

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
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                    ) : (
                                    <KeyboardArrowLeft />
                                    )}
                                </Button>
                                <CardMedia
                                    component="img"
                                    image={images[activeStep].imgPath}
                                    sx={{
                                        elevation: "0",
                                        boxShadow: "none",
                                        maxWidth: "450px",
                                        center: "true",
                                        alignContent: "center",
                                        justifyContent: "center",
                                    }}
                                />
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
                            </div>
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
                                nextButton={<></>}
                                backButton={<></>}
                            />
                        </CardContent>
                        <CardContent
                            sx={{
                                flexDirection: "column",
                                alignItems: "left",
                                justifyContent: "left",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: "10px",
                                    paddingLeft:"10px",
                                    alignContent:"left",
                                    justifyContent:"left",
                                    alignItems:"left"
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.maintenance_priority} Priority
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    <u>{data.property_address}</u>
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    {data.maintenance_title}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    Estimated Cost: {data.maintenance_estimated_cost ? "$" + data.maintenance_estimated_cost : "Not reported"}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.secondary.white,
                                        fontWeight: theme.typography.secondary.fontWeight,
                                        fontSize:theme.typography.smallFont,
                                        paddingBottom: "10px"
                                    }}
                                >
                                    Reported: {formattedDate} | Open: {numOpenRequestDays} days
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
                                    {data.maintenance_desc}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </div>
    )
}