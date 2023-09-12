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
    TextField,
    MenuItem,
    Select,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

export default function QuoteRequestForm(){

    console.log("QuoteRequestFormPage")
    
    const location = useLocation();
    const navigate = useNavigate();
    const maintenanceItem = location.state.maintenanceItem;
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState("")
    const [maintenanceContact, setMaintenanceContact] = useState("Doolittle Maintenance")

    console.log(maintenanceItem)

    const handleSubmit = () => {
        console.log("handleSubmit")
        console.log("need to implement navigation")
        navigate("/maintenance")
    }

    const handleStateChange = (event) => {
        console.log("handleStateChange")
        setMaintenanceContact(event.target.value)
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
                        <Box
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Maintenance
                        </Typography>
                    </Box>
                    <Grid container spacing={3}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                     >
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    backgroundColor: "#A52A2A",
                                    borderRadius: "10px",
                                    width: "85%",
                                    height: "100%",
                                    padding: "10px",
                                    margin: "10px",
                                }}>
                                {Object.entries(maintenanceItem).map(([key, value], index) => (
                                        <Grid item xs={12}>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                                <b>{key} : {value}</b>
                                            </Typography>
                                        </Grid>
                                    )
                                )}
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
                                <b>Requesting Quotes for Maintenance</b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                    >
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                View All Maintenance Contacts
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Select 
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderRadius: '7px',
                                }}
                                size="small"
                                fullWidth
                                onChange={handleStateChange} 
                            >
                                <MenuItem value={"Doolittle Maintenance"}>Doolittle Maintenance</MenuItem>
                                <MenuItem value={"Kim Deal"}>Kim Deal</MenuItem>
                                <MenuItem value={"Invite +"}>Invite +</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Additional Information
                            </Typography>
                            <TextField 
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderRadius: '7px',
                                }}
                                placeholder={additionalInfo}
                                value={additionalInfo}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
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
                                    Send Quote Request
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    )
}