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

import { useEffect, useState } from "react";
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
    const [contractsForProperty, setContractsForProperty] = useState([]);
    const index = location.state.index; // need to pass to property navigator
    const propertyList = location.state.propertyList; // need to pass to property navigator
    const contracts = location.state.contracts;

    // console.log("--debug-- all contracts PropertyDetail", contracts)

    useEffect(() => {
        // filter contracts for this property
        if (contracts === undefined){
            // get contracts from database

        } else{
            console.log(propertyList[index])
            let contractsForThisProperty = contracts.filter(contract => contract.property_id === propertyList[index].property_uid);
            console.log("--debug-- contracts for this property", contractsForThisProperty)
            setContractsForProperty(contractsForThisProperty);
        }
    }, [])

    function handleBackButton(){
        console.log("handleBackButton")
        navigate("/properties"); 
    }

    function navigateToAddProperty(){
        console.log("navigateToAddProperty")
        navigate("/addProperty");
    }

    function navigateToAddListing(){
        console.log("navigateToAddListing")
        navigate("/addListing");
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
                marginBottom: theme.spacing(2), // Set the margin to 20px
                paddingBottom: "50px"
            }}
            >
                <Paper
                    style={{
                        margin: '30px',
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
                            <Button onClick={() => handleBackButton()} sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '16px', "&:hover, &:focus, &:active": {background: theme.palette.primary.main}}}>

                                {/* <UTurnLeftIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px', transform: 'rotate(90deg)', fontWeight: theme.typography.common.fontWeight}}/> */}
                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
                                <Typography>
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
                            <PropertyNavigator index={index} propertyData={propertyList} contracts={contractsForProperty}/>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}