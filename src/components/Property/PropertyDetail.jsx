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
} from "@mui/material";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import PropertyNavigator from '../Property/PropertyNavigator';
import refundIcon from './refundIcon.png';

export default function PropertyDetail({}){
    const location = useLocation();
    let navigate = useNavigate(); 

    const property = location.state.property
    const index = location.state.index;
    const propertyList = location.state.propertyList;
    // const maintenanceData = location.state.maintenanceData;

    console.log("property from PropertyDetail", property)

    // console.log("Maintenance Data in Property Detail", maintenanceData)
    // console.log("This maintenance data's thing", maintenanceData[index])

    
    function handleBackButton(){
        console.log("handleBackButton")
        navigate(-1); 
    }

    function navigateToAddProperty(){
        console.log("navigateToAddProperty")
        navigate("/addProperty");
    }

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
                            paddingBottom: "0px"
                        }}
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                All Properties
                            </Typography>
                        </Box>
                        <Box position="absolute" right={30}>
                            <Button onClick={() => navigateToAddProperty()}>
                                <AddIcon sx={{color: theme.typography.primary.black, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box>
                            <Button onClick={() => handleBackButton()}>

                                {/* <UTurnLeftIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px', transform: 'rotate(90deg)', fontWeight: theme.typography.common.fontWeight}}/> */}
                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
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
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                            width: '75%',
                        }}>
                            <PropertyNavigator property={property} index={index} propertyData={propertyList}/>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}