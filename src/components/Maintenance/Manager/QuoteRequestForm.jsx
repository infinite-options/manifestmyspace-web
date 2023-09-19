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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import dataURItoBlob from "../../utils/dataURItoBlob";

export default function QuoteRequestForm(){

    console.log("QuoteRequestFormPage")
    
    const location = useLocation();
    const navigate = useNavigate();
    const maintenanceItem = location.state.maintenanceItem;
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState("")
    const [contactList, setContactList] = useState([])
    const [maintenanceContacts, setMaintenanceContacts] = useState([])
    const [loadingContacts, setLoadingContacts] = useState(true)
    const [maintenanceData, setMaintenanceData] = useState([])
    const [success, setSuccess] = useState(false)
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])


    console.log(maintenanceItem)
 

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function handleBackButton(){
        console.log("handleBackButton")
        navigate(-1); 
    }

    // const getMaintenanceDataForNavigate = async () = {
    //     const maintenanceRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequestsByOwner/110-000003')

    // }

    const handleSubmit = () => {
        console.log("handleSubmit")
        console.log("need to implement navigation")

        const changeMaintenanceRequestStatus = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "maintenance_request_uid": maintenanceItem.maintenance_request_uid,
                        "maintenance_request_status": "PROCESSING"
                    })
                });
            } catch (error){
                console.log("error", error)
            }
        }

        const submitQuoteRequest = async () => {

            const formData = new FormData();

            formData.append("quote_maintenance_request_id", maintenanceItem.maintenance_request_uid)
            formData.append("quote_notes", additionalInfo)

            if (selectedImageList.length > 0){
                for (let i = 0; i < selectedImageList.length; i++){
                    const imageBlob = dataURItoBlob(selectedImageList[i].data_url);
                    console.log(imageBlob)
                    formData.append(`img_${i}`, imageBlob)
                }
            }

            // also make a put request to the maintenanceRequest endpoint to update the images there

            let maintenanceContactIds = []
            if (maintenanceContacts.length > 0){
                for(let i = 0; i < maintenanceContacts.length; i++){
                    maintenanceContactIds.append(maintenanceContacts[i].maintenance_contact_uid)
               }
               formData.append("quote_maintenance_contacts", maintenanceContactIds)
            }

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }


            try {

                console.log("right before call")
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/quotes", {
                    method: 'POST',
                    body: formData
                });

                const responseData = await response.json();
        
                if (response.status === 200) {
                    console.log("success");
                    changeMaintenanceRequestStatus()
                    // Fetch all maintenance requests for the owner
                    // const maintenanceRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequestsByOwner/110-000003');
                    // const maintenanceRequestsData = await maintenanceRequests.json();
        
                    // const allMaintenanceData = maintenanceRequestsData.Maintenance_Requests.result;
        
                    // const processingItems = allMaintenanceData["PROCESSING"];
                    // const maintenance_request_index = processingItems.findIndex(item => item.maintenance_request_uid === maintenanceItem.maintenance_request_uid);
        
                    // if (maintenance_request_index !== -1) {
                    //     navigate("/maintenance/detail", {
                    //         state: {
                    //             maintenance_request_index,
                    //             status: "PROCESSING",
                    //             maintenanceItemsForStatus: processingItems,
                    //             allMaintenanceData
                    //         }
                    //     });
                    // } else {
                    //     console.error("Failed to find the updated maintenance request");
                    // }
                    navigate("/maintenance")
        
                } else {
                    console.error(`Request failed with status: ${response.status}`);
                }
        
            } catch (error) {
                console.log("An error occurred while submitting the quote:", error);
            }
        }
        
        submitQuoteRequest();       
    }

    const handleMaintenanceChange = (event) => {
        console.log("handleStateChange", event.target.value)
        setMaintenanceContacts(event.target.value)
    }

    function numImages(){
        if (displayImages.length == 0){
            return 0
        } else{
            return displayImages.length
        }
    }

    function displayContactList(){
        console.log("displayContactList")
        console.log("contactList length", contactList.length)
        if(contactList.length > 0){
            return (contactList.map((contact, index) => (
                <MenuItem key={index} value={contact}> {contact.business_name} </MenuItem>
            )))
        } else{
            return (
                <MenuItem value={"Loading"}>Loading</MenuItem>
            )
        }
    }

    useEffect(() => {
        console.log("get all maintenance workers")

        const getMaintenanceWorkers = async () => {
            const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contactsMaintenance")
            const data = await response.json()
            const workers = data.Maintenance_Contacts.result
            console.log("workers",  workers)
            //workers.filter((worker) => worker.business_name != "DoLittle Maintenance")
            setContactList(workers)
        }
        getMaintenanceWorkers().then(() => setLoadingContacts(false))

        let imageArray = JSON.parse(maintenanceItem.maintenance_images)

        setDisplayImages(imageArray)

    }, [])

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
                    backgroundColor: '#D6D5DA',
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
                    <Grid container spacing={6}
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                     >
                        <Grid item xs={12}
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Card
                                sx={{
                                    backgroundColor: "#A52A2A",
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
                                                    Array.isArray(displayImages) && displayImages.length > 0 ? 
                                                    displayImages.map((image, index) => (
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
                            <img 
                                src="src/components/Maintenance/Manager/User_fill.png" 
                                alt="User Icon" 
                                style={{ marginRight: '8px' }}  // Adds some spacing between the image and the text
                            />
                            <Typography component="span" sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                View All Maintenance Contacts
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{width: '90%'}}>
                            {loadingContacts ? (
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                    Loading Contacts
                                </Typography>
                            ) : (
                                <Select 
                                    sx={{
                                        backgroundColor: 'white',
                                        borderColor: 'black',
                                        borderRadius: '7px',
                                    }}
                                    size="small"
                                    fullWidth
                                    onChange={e => handleMaintenanceChange(e)} 
                                >
                                    {displayContactList()}
                                </Select>
                            )}

                        </Grid>
                        <Grid item xs={12} sx={{width: '90%'}}>
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
                        <Grid item xs={12} sx={{width: '90%'}}>
                            <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
                        </Grid>
                        <Grid item xs={12} sx={{width: '90%'}}>
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