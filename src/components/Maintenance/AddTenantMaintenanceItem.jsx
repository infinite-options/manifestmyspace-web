import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider,
    Form,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Input,
    Container,
    Radio,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    UploadFile,
    InputAdornment
} from "@mui/material";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';
import dataURItoBlob from '../utils/dataURItoBlob'

import theme from '../../theme/theme';

import ReturnButtonIcon from '../Property/refundIcon.png';

export default function AddTenantMaintenanceItem({closeAddTenantMaintenanceItem, propertyId}){
    const location = useLocation();
    let navigate = useNavigate();

    const [selectedImageList, setSelectedImageList] = useState([]);
    const [property, setProperty] = useState('200-000029');
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('left');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');

    const handlePropertyChange = (event) => {
        console.log("handlePropertyChange", event.target.value)
        setProperty(event.target.value);
    };

    const handleIssueChange = (event) => {
        console.log("handleIssueCategoryChange", event.target.value)
        setIssue(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        console.log("handlePhoneNumberChange", event.target.value)
        setPhoneNumber(event.target.value);
    };

    const handleTitleChange = (event) => {
        console.log("handleTitleChange", event.target.value)
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        console.log("handleDescriptionChange", event.target.value)
        setDescription(event.target.value);
    };

    const handlePriorityChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
    };

    const handleCompletedChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
    };
    
    const handleFileChange = (event) => {
        console.log("handleFileChange", event.target.value)
        setFile(event.target.value);
    };

    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }

    const handleSubmit = (event) => {

        console.log("handleSubmit")
        event.preventDefault();

        const formData = new FormData();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;


        formData.append("maintenance_property_id", property);
        formData.append("maintenance_title", title);
        formData.append("maintenance_desc", description);
        formData.append("maintenance_request_type", issue);
        formData.append("maintenance_request_created_by", "600-000003");
        formData.append("maintenance_priority", toggleAlignment);
        formData.append("maintenance_can_reschedule", 1);
        formData.append("maintenance_assigned_business", null);
        formData.append("maintenance_assigned_worker", null);
        formData.append("maintenance_scheduled_date", null);
        formData.append("maintenance_scheduled_time", null);
        formData.append("maintenance_frequency", "One Time");
        formData.append("maintenance_notes", null);
        formData.append("maintenance_request_created_date", formattedDate); // Convert to ISO string format
        formData.append("maintenance_request_closed_date", null);
        formData.append("maintenance_request_adjustment_date", null);

        for (let i = 0; i < selectedImageList.length; i++) {
            console.log("selectedImageList[i].file", selectedImageList[i].data_url)
            const imageBlob = dataURItoBlob(selectedImageList[i].data_url);
            console.log(imageBlob)
            if(i === 0){
                formData.append("img_cover", imageBlob);
            } else{
                formData.append("img_" + i, imageBlob);
            }
        }


        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }
        

        const postData = async () => {
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests", {
                    method: "POST",
                    body: formData,
                })
                const data = await response.json();
                console.log("data response", data)
            } catch (err) {
                console.error("Error posting data:", err);
            }
        }
        postData();
    }

    
    return(
        <>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                position="relative"
            >
                <Box
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Add Maintenance
                    </Typography>
                </Box>

                <Box left={0} direction="column" alignItems="center">
                    <Button onClick={() => (closeAddTenantMaintenanceItem ? closeAddTenantMaintenanceItem() : handleBackButton())}>
                        {/* <ArrowBackIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/> */}
                        <img src={ReturnButtonIcon} alt="Return Button Icon" style={{width: '25px', height: '25px', marginRight: '10px'}}/>
                            <Typography sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '16px'}}>
                                    {closeAddTenantMaintenanceItem ? "Return to Viewing All Properties" : "Return to Dashboard"}
                            </Typography>
                    </Button>
                </Box>
            </Stack>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                padding="25px"
            >
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={6}>
                        {/* Select Field for Issue and Cost Estimate */}
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Maintenance Type
                            </Typography>
                            <FormControl 
                                fullWidth
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderRadius: '7px',
                                }}
                                size="small" 
                            >
                                {/* <InputLabel>Select Issue Category</InputLabel> */}
                                <Select defaultValue="" onChange={handleIssueChange}>
                                    <MenuItem value={"Plumbing"}>Plumbing</MenuItem>
                                    <MenuItem value={"Electrical"}>Electrical</MenuItem>
                                    <MenuItem value={"Appliance"}>Appliances</MenuItem>
                                    <MenuItem value={"HVAC"}>HVAC</MenuItem>
                                    <MenuItem value={"Landscaping"}>Landscaping</MenuItem>
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Select Field for Property */}
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Property
                            </Typography>
                            <FormControl 
                                fullWidth
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                }}
                                size="small"
                            >
                                {/* <InputLabel>Select Property</InputLabel> */}
                                <Select defaultValue="" onChange={handlePropertyChange}>
                                    <MenuItem value={property}>5640 W. Sunset Road</MenuItem>
                                    {/* <MenuItem value={"9501 Kempler Drive"}>9501 Kempler Drive</MenuItem>
                                    <MenuItem value={"9107 Japonica Court"}>9107 Japonica Court</MenuItem> */}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Text Field for Title */}
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Title
                            </Typography>
                            <TextField 
                                onChange={handleTitleChange} 
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderRadius: '7px',
                                }}
                                size="small"
                                fullWidth
                            />
                        </Grid>

                        {/* Text Field for Description */}
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                // label="Description"
                                size="small"
                                multiline
                                onChange={handleDescriptionChange}
                                sx={{ 
                                    width: '100%',
                                    backgroundColor: 'white'
                                }}
                            />
                        </Grid>

                        {/* Priority Toggle Field */}
                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Priority
                            </Typography>
                        <ToggleButtonGroup
                            exclusive
                            fullWidth
                            onChange={handlePriorityChange}
                            aria-label="Priority"
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root.Mui-selected': {
                                backgroundColor: 'lightblue', // Selected background color
                                color: 'white', // Selected text color
                            },
                            }}
                        >
                            <ToggleButton 
                                value="low"
                                sx={{
                                    backgroundColor: theme.palette.priority.low,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    '&.Mui-selected': {
                                    borderColor: "black",
                                    backgroundColor: theme.palette.priority.low,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    backgroundColor: theme.palette.priority.low,
                                    },
                                }}>
                                Low
                            </ToggleButton>
                            <ToggleButton 
                                value="medium"
                                sx={{
                                    backgroundColor: theme.palette.priority.medium,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    '&.Mui-selected': {
                                    borderColor: "black",
                                    backgroundColor: theme.palette.priority.medium,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    backgroundColor: theme.palette.priority.medium,
                                    },
                                }}>
                                Medium
                            </ToggleButton>
                            <ToggleButton 
                                value="high"
                                sx={{
                                    backgroundColor: theme.palette.priority.high,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    '&.Mui-selected': {
                                    borderColor: "black",
                                    backgroundColor: theme.palette.priority.high,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    backgroundColor: theme.palette.priority.high,
                                    },
                                }}>
                                High
                            </ToggleButton>
                        </ToggleButtonGroup>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                Call Back Number
                            </Typography>
                            <TextField
                                fullWidth
                                sx={{
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderRadius: '7px',
                                }}
                                size="small"
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">$</InputAdornment>
                                //     ),
                                // }}
                                onChange={handlePhoneNumberChange}
                            />
                        </Grid>

                        {/* File Upload Field */}
                        <Grid item xs={12}>
                            <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
                            {/* <Container fixed sx={{
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderRadius: '7px',
                                borderStyle: 'dashed',
                                borderColor: theme.typography.common.blue,
                            }}>
                                <Box
                                    justifyContent="center"
                                    alignItems="center"
                                    display="flex"
                                    padding={10}
                                >
                                    <Button>
                                        <AddPhotoAlternateIcon sx={{color: theme.typography.common.blue, fontSize: "30px", marginRight: "10px"}}/>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Add Photos
                                        </Typography>
                                    </Button>
                                </Box>
                            </Container> */}
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" sx={{
                                width: "100%",
                                backgroundColor: theme.typography.common.blue,
                                color: "#FFFFFF",
                            }}>
                                <Typography sx={{
                                    color: theme.typography.common.white, 
                                    fontWeight: theme.typography.primary.fontWeight, 
                                    fontSize:theme.typography.mediumFont,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                        Add Maintenance
                                </Typography>
                                <input type="file" hidden/>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </>
    )
}