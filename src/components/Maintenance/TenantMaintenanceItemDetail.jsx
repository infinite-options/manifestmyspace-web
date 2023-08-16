import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    CardMedia,
    Input,
    Container,
    Radio,
    FormLabel,
    TableCell,
    TableRow,
    TableBody,
    Table,
    Divider
} from "@mui/material";
import theme from '../../theme/theme';
import ReturnButtonIcon from '../Property/refundIcon.png';
import maintenaceRequestImage from './maintenanceRequest.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


export default function TenantMaintenanceItemDetail(){
    // const [currentIndex, setCurrentIndex] = useState(requestIndex);
    const [activeStep, setActiveStep] = useState(0);

    const location = useLocation();
    let navigate = useNavigate();

    const color = location.state.color
    const item = location.state.request

    console.log(location.state)
    
    // const handleNextCard = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex + 1) % requestData.length);
    //   };
    
    //   const handlePreviousCard = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex - 1 + requestData.length) % requestData.length);
    //   };
    
      const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    function closeAddTenantMaintenanceItem(){
        navigate('/tenantMaintenance')
    }

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

    const statusTimeline = [
        {
            message: "Scheduled for [date] [time]",
            date: "10/10/2021",
            time: "10:00 AM"
        },
        {
            message: "Assigned to Technician",
            date: "10/10/2021",
            time: "10:00 AM"
        },
        {
            message: "Complaint Received",
            date: "10/10/2021",
            time: "10:00 AM"
        },
    ]
    const maxSteps = images.length;

    console.log(item)
    console.log(color)

    return (
        <Paper
            style={{
                margin: '30px',
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                paddingTop: '10px',
            }}
        >
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                position="relative"
            >
                <Box left={0} direction="column" alignItems="center">
                    <Button onClick={() => closeAddTenantMaintenanceItem()}>
                        {/* <ArrowBackIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/> */}
                        <img src={ReturnButtonIcon} alt="Return Button Icon" style={{width: '25px', height: '25px', marginRight: '10px'}}/>
                            <Typography sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '16px'}}>
                                    Return to Viewing All Properties
                            </Typography>
                    </Button>
                </Box>
            </Stack>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                padding="10px"
            >
                <Box
                    sx={{
                        margin: "0px"
                    }}
                >
                    <Paper
                        style={{
                            margin: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: color,
                            padding: '20px',
                        }}
                    >
                        <Grid container spacing={3}>
                            
                            <Grid item xs={12}>
                                <Typography 
                                    sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "22px"}}
                                >
                                    Maintenance Request #{item.maintenance_property_id}
                                </Typography>
                            </Grid>

                            
                            <Grid item xs={7}>
                                <Typography 
                                    sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "18px"}}
                                >
                                    {item.maintenance_title}
                                </Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography 
                                    sx={{color: "#160449", fontWeight: 900, fontSize: "16px"}}
                                >
                                    Status: {item.maintenance_request_status}
                                </Typography>
                            </Grid>

                            
                            <Grid item xs={7}>
                                <Typography 
                                    sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px"}}
                                >
                                    Reported: {item.maintenance_request_created_date}
                                </Typography>
                            </Grid>

                            
                            <Grid item xs={5}>
                                <Typography 
                                    sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px"}}
                                >
                                    Open: X Days
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex",
                            }}>
                                <Typography
                                    sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "18px"}}
                                >
                                    {item.maintenance_priority} Priority
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
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
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography 
                                    sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px"}}
                                >
                                    {item.maintenance_desc}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography 
                                    sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.common.fontWeight, fontSize: "20px"}}
                                >
                                    Status Timeline
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack>
                                    {statusTimeline.map((status, index) =>
                                        <Box 
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row', // This makes the children list vertically
                                                // ... add any other styles you want
                                                alignContent: 'center',
                                                borderLeftColor: "#FFFFFF",
                                                borderLeftStyle: "dotted",
                                                paddingBottom: "10px"

                                            }}
                                            key={index}
                                        >   
                                            <Typography
                                                sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px"}}
                                                >
                                                {status.message}
                                            </Typography>
                                            <Typography
                                                sx={{color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px"}}
                                                >
                                                {status.date} {status.time}
                                            </Typography>                                            
                                        </Box> 
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Stack>
        </Paper>
    )
}