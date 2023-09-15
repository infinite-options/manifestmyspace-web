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
    Container,
    TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function QuoteAcceptForm(){

    console.log("QuoteAcceptForm")
    const navigate = useNavigate();
    const location = useLocation();
    const maintenanceItem = location.state.maintenanceItem;
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedImageList, setSelectedImageList] = useState([]);

    const [maintenanceQuote, setMaintenanceQuotes] = useState([
        {
            maintenanceContact: "Doolittle Maintenance",
            maintenanceQuote: "Estimated Cost: $2400-$3000\nEstimated Time: 4 days - 2 weeks\nEarliest Availability: 05/03/2023",
            maintenanceNotes: "I will have to replace all of the pipes. This is the worst plumbing I have ever seen. All of the flooring should be replaced due to water damage as well, which I can take care of too. See you soon, Timberlake"
        },
        {
            maintenanceContact: "Kim Deal",
            maintenanceQuote: "Estimated Cost: $100-$120\nEstimated Time: 30 minutes\nEarliest Availability: 04/19/22",
            maintenanceNotes: "Hi John, The pipe seems to only have a minor leak, so I should be able to get it patched up without replacing it. I don’t see any water damage yet but it should be fixed urgently. Thanks, Kim"
        }
    ])

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate(-1); 
    }



    console.log(maintenanceItem)

    const handleSubmit = () => {
        console.log("handleSubmit")
        console.log("need to implement navigation")
        navigate("/maintenance")
    }

    function numImages(){
        if (maintenanceItem.maintenance_images == "[]"){
            return 0
        } else{
            return maintenanceItem.maintenance_images.length
        }
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
                                    backgroundColor: "#C06A6A",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                }}>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2} justifyContent="center">
                                            {numImages() > 0 ? 
                                                (
                                                    Array.isArray(maintenanceItem.maintenance_images) && maintenanceItem.maintenance_images.length > 0 ? 
                                                    maintenanceItem.maintenance_images.map((image, index) => (
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
                                            <b>{maintenanceItem.maintenance_priority} Priority</b>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                            <u>{maintenanceItem.property_address}, {maintenanceItem.property_city} {maintenanceItem.property_state} {maintenanceItem.property_zip}</u>
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
                                {/* {Object.entries(maintenanceItem).map(([key, value], index) => (
                                        <Grid item xs={12}>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                <b>{key} : {value}</b>
                                            </Typography>
                                        </Grid>
                                    )
                                )} */}
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            backgroundColor: "#C06A6A",
                        }}
                    >   
                        <Grid item xs={12}>
                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                <b>Viewing Quotes From Doolittle Maintenance</b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                    >
                        
                        <Grid item xs={12}>
                            Doolittle Maintenance
                        </Grid>
                        <Grid item xs={12}>
                            <Container maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                                <TextField
                                    multiline
                                    rows={10}
                                    defaultValue="Estimated Cost: $2400-$3000
                                    Estimated Time: 4 days - 2 weeks
                                    Earliest Availability: 05/03/2023"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                    readOnly: true,
                                    style: { backgroundColor: 'white' }
                                    }}
                                />
                            </Container>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                Notes
                            </Typography>
                            <Container maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                                <TextField
                                    multiline
                                    rows={10}
                                    defaultValue="I will have to replace all of the pipes. This is the worst plumbing I have ever seen. All of the flooring should be replaced due to water damage as well, which I can take care of too. 
                                    See you soon, Timberlake"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                    readOnly: true,
                                    style: { backgroundColor: 'white' }
                                    }}
                                />
                            </Container>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    backgroundColor: "#CB8E8E",
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
                                    Decline Quote
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                disableElevation
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
                                    Accept Quote
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}