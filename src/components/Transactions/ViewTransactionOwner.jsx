import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    ThemeProvider,
    Paper,
    Button,
    Typography,
    Stack,
  } from "@mui/material";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import theme from "../../theme/theme";
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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
export default function ViewTransactionOwner(props) {
    const location = useLocation();
    const history = location.state.history;
    const curr_index = location.state.index;
    const [rows, setRows] = useState(getInitialRows());
    
    const navigate = useNavigate();
    
    const [activeStep, setActiveStep] = React.useState(curr_index);
    // const maxSteps = images.length;
    const maxSteps = rows.length;

    function getInitialRows() {
        const initialRows = history.map((txn) => {
            return txn
        })
        console.log("printing - initialRows", initialRows);
        return initialRows;
    }

    useEffect(() => {
        setRows(getInitialRows());
        console.log("printing - history, curr_index ", history, curr_index, rows)
      }, [history, curr_index]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };
    return (
        <>
            <ThemeProvider theme={theme}>
            {/* <PropertyListData setPropertyList={setPropertyList}></PropertyListData> */}
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '100vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: 20,
                        backgroundColor: theme.palette.primary.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                    }}
                >
                    {/* <IconButton
                        aria-label="close"
                        onClick={() => navigate(-1)}
                        sx={{
                            position: 'sticky',
                            left: '90vw',
                            top: 1,
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.common.fontWeight
                        }}
                    >
                        <CloseIcon />
                    </IconButton> */}
                    
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Transaction History
                        </Typography>
                    </Stack>
                    <Stack>
                    <Button sx={{ textTransform: 'capitalize' }} onClick={()=>navigate(-1)}>
                        <UTurnLeftIcon sx={{transform: "rotate(90deg)", color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont, padding: 5}}/>
                        <Typography 
                        sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                        >
                        Return to Viewing All Payments
                        </Typography>
                    </Button>
                    </Stack>
                    {/* ****** */}
                    
                    <Box m={0} sx={{ flexGrow: 1 }}>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pl: 2,
                        bgcolor: 'background.default',
                        }}
                    >
                        {/* <Typography>{images[activeStep].label}</Typography> */}
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {rows.map((txn, index) => (
                        // <div key={step.label}>
                        //     {Math.abs(activeStep - index) <= 2 ? (
                        //     <Box
                        //         component="img"
                        //         sx={{
                        //         height: 255,
                        //         display: 'block',
                        //         maxWidth: 400,
                        //         overflow: 'hidden',
                        //         width: '100%',
                        //         }}
                        //         src={step.imgPath}
                        //         alt={step.label}
                        //     />
                        //     ) : null}
                        // </div>
                        <Paper
                        style={{
                            // padding: 10,
                            backgroundColor: theme.palette.primary.secondary,
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}>
                            <Box
                            sx={{height: '20vh', backgroundColor: theme.palette.custom.palePink}}>
                                <Box
                                component="span"
                                m={0}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                >
                                <Button size="small" sx={{color: theme.typography.primary.black}} onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                    <ArrowForwardIcon />
                                    ) : (
                                    <ArrowBackIcon />
                                    )}
                                </Button>
                                <Typography>{index+1} of {history.length} Payments</Typography>
                                <Button
                                    size="small"
                                    sx={{color: theme.typography.primary.black}} 
                                    onClick={handleNext}
                                    disabled={activeStep === maxSteps - 1}
                                >
                                    {theme.direction === 'rtl' ? (
                                    <ArrowBackIcon />
                                    ) : (
                                    <ArrowForwardIcon />
                                    )}
                                </Button>
                                </Box>
                                <Stack
                                direction="row"
                                justifyContent="center"
                                >
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                    Paul McCartney
                                    </Typography>
                                </Stack>
                                <Box
                                component="span"
                                m={0}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                >
                                    <div style={{flex: 1, height: 2, backgroundColor: '#000000'}}></div>
                                    <Typography sx={{margin:'10px', color: theme.typography.primary.black}}>
                                    to
                                    </Typography>
                                    <div style={{flex: 1, height: 2, backgroundColor: '#000000'}}></div>
                                </Box>
                                <Stack
                                direction="row"
                                justifyContent="center"
                                >
                                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                    Doolittle Maintenance
                                    </Typography>
                                </Stack>
                            </Box>
                            <Stack
                            direction="row"
                            justifyContent="center"
                            >
                                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                ${txn.pur_amount_due}
                                </Typography>
                            </Stack>
                            <Stack
                            direction="row"
                            justifyContent="center"
                            >
                                <Typography sx={{color: theme.typography.primary.black, fontSize:theme.typography.smallFont}}>
                                Date Paid: {txn.purchase_date}
                                </Typography>
                            </Stack>
                            <Stack
                            direction="row"
                            justifyContent="center"
                            >
                                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                {txn.purchase_type}
                                </Typography>
                            </Stack>
                            <Stack
                            direction="row"
                            justifyContent="center"
                            >
                                <Typography sx={{color: theme.typography.common.blue, fontSize:theme.typography.smallFont}}>
                                {txn.pur_notes}
                                </Typography>
                            </Stack>
                            <Stack
                            direction="row"
                            justifyContent="center"
                            >
                                <Typography sx={{color: theme.typography.common.black, fontSize:theme.typography.smallFont}}>
                                Paypal
                                </Typography>
                            </Stack>
                            
                            <Box
                            component="span"
                            m={0}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            >
                                <Typography sx={{color: theme.typography.common.blue, fontSize:theme.typography.smallFont}}>
                                Transaction ID: 133
                                </Typography>
                                <Typography sx={{color: theme.typography.common.blue, fontSize:theme.typography.smallFont}}>
                                Recipient ID: 123
                                </Typography>
                            </Box>
                        </Paper>
                        ))}
                    </SwipeableViews>
                    {/* <Box
                    component="span"
                    m={0}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    >
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            Back
                        </Button>
                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            <KeyboardArrowRight />
                        </Button>
                    </Box> */}
                    {/* <MobileStepper
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
                    /> */}
                    </Box>
                    </Paper>
                </Box>
            </ThemeProvider>
        </>
    )
}