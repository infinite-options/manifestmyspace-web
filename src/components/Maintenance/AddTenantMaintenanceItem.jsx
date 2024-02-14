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
import { useUser } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';
import dataURItoBlob from '../utils/dataURItoBlob'
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import theme from '../../theme/theme';
import { darken } from '@mui/system';
import ReturnButtonIcon from '../Property/refundIcon.png';

export default function AddTenantMaintenanceItem({closeAddTenantMaintenanceItem}){
    const location = useLocation();
    let navigate = useNavigate();
    const { getProfileId } = useUser();
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [property, setProperty] = useState(location.state.propertyData);
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('left');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        console.log(selectedImageList)
    }, [selectedImageList])

    const handlePropertyChange = (event) => {
        setProperty(event.target.value);
    };

    const handleIssueChange = (event) => {
        setIssue(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // const handlePriorityChange = (event, newToggleGroupValue) => {
    //     setToggleGroupValue(newToggleGroupValue);
    //     setToggleAlignment(newToggleGroupValue);
    // };

    const handlePriorityChange = (priority) => {
        setToggleAlignment(priority);
        setToggleGroupValue(priority);
    
        // Update styles for all toggle buttons based on the selected priority
        const buttons = document.querySelectorAll('.MuiToggleButton-root');
        buttons.forEach(button => {
            const buttonPriority = button.getAttribute('value');
    
            if (buttonPriority === priority) {
                // Set white border for the selected button
                button.style.borderColor = 'white';
            } else {
                // Reset border color for other buttons
                button.style.borderColor = '';
            }
        });
    };

    const handleCompletedChange = (event, newToggleGroupValue) => {
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
    };
    
    const handleFileChange = (event) => {
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


        formData.append("maintenance_property_id", property.property_uid);
        formData.append("maintenance_title", title);
        formData.append("maintenance_desc", description);
        formData.append("maintenance_request_type", issue);
        formData.append("maintenance_request_created_by", getProfileId());
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
            try {
                let key = i === 0 ? "img_cover" : `img_${i-1}`;

                if(selectedImageList[i]?.image?.startsWith("data:image")){
                    const imageBlob = dataURItoBlob(selectedImageList[i].image);
                    formData.append(key, imageBlob)
                } else {
                    formData.append(key, selectedImageList[i])
                }
            } catch (error) {
                console.log("Error uploading images", error)
            }
        }


        for (let [key, value] of formData.entries()) {
            console.log(key, value);    
        }
        

        const postData = async () => {
            setShowSpinner(true);
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
            setShowSpinner(false);
        }
        postData();

        setSelectedImageList([])
        setProperty('')
        setIssue('')
        setToggleGroupValue('tenant')
        setToggleAlignment('left')
        setPhoneNumber('')
        setTitle('')
        setDescription('')
        navigate('/tenantDashboard');
    }

    
    return(
        <Paper
            style={{
                margin: '30px',
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                paddingTop: '10px',
            }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                    id="addTenantMaintenanceItemForm"
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
                                <Select defaultValue={property.property_uid} onChange={handlePropertyChange}>
                                    <MenuItem value={property.property_uid}>{property.property_address} {property.property_unit}</MenuItem>
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
                            value={toggleAlignment}
                            onChange={(event, value) => handlePriorityChange(value)}
                            aria-label="Priority"
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root.Mui-selected': {
                                // backgroundColor: 'lightblue', // Selected background color
                                color: 'white', // Selected text color
                            },
                            }}
                        >
                            <ToggleButton 
                                key={"Low"}
                                value={"Low"}
                                sx={{
                                    backgroundColor: theme.palette.priority.low,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    borderWidth: "3px",
                                    '&.Mui-selected': {
                                    borderColor: "white",
                                    // borderBlockColor: "white",
                                    borderWidth: "3px",
                                    backgroundColor: theme.palette.priority.low,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    // backgroundColor: theme.palette.priority.low,
                                    backgroundColor: darken(theme.palette.priority.low, 0.3),
                                    },
                                    '&.Mui-selected + .MuiToggleButton-root': {
                                        borderLeftColor: 'white',
                                    },
                                }}
                                onClick={() => handlePriorityChange("Low")}
                                isSelected={toggleAlignment === "Low"}
                                >
                                Low
                            </ToggleButton>
                            <ToggleButton 
                                key={"Medium"}
                                value={"Medium"}
                                sx={{
                                    backgroundColor: theme.palette.priority.medium,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    '&.Mui-selected': {
                                    borderColor: "black",
                                    // borderColor: "white",
                                    color: "white",
                                    borderWidth: "3px",
                                    backgroundColor: theme.palette.priority.medium,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    // backgroundColor: theme.palette.priority.medium,
                                    backgroundColor: darken(theme.palette.priority.medium, 0.3),
                                    },
                                }}
                                onClick={() => handlePriorityChange("Medium")}
                                isSelected={toggleAlignment === "Medium"}
                                >
                                Medium
                            </ToggleButton>
                            <ToggleButton 
                                key={"Medium"}
                                value={"Medium"}
                                sx={{
                                    backgroundColor: theme.palette.priority.high,
                                    borderRadius: '20px',
                                    color: 'white',
                                    marginRight: "10px",
                                    '&.Mui-selected': {
                                    // borderColor: "black",
                                    color: "white",
                                    borderColor: "white",
                                    borderWidth: "3px",
                                    backgroundColor: theme.palette.priority.high,
                                    },
                                    '&:hover': {
                                    borderColor: "white",
                                    backgroundColor: darken(theme.palette.priority.high, 0.3),
                                    // backgroundColor: theme.palette.priority.high,
                                    },
                                    '&.Mui-selected + .MuiToggleButton-root': {
                                        borderLeftColor: 'white',
                                    },
                                }}
                                onClick={() => handlePriorityChange("High")}
                                isSelected={toggleAlignment === "High"}
                                >
                                High
                            </ToggleButton>

                            {/* <ToggleButton
                                value="vol1"
                                onClick={() => handlePriorityChange('vol1')}
                                selected={toggleAlignment === 'vol1'}
                                sx={{
                                    borderRadius: '20px',
                                    marginRight: "10px",
                                    borderColor: toggleAlignment === 'vol1' ? 'white' : '',
                                    color: toggleAlignment === 'vol1' ? 'white' : 'black',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: toggleAlignment === 'vol1' ? darken(theme.palette.priority.vol1, 0.3) : '',
                                    },
                                }}
                            >
                                Vol1
                            </ToggleButton>

                            <ToggleButton
                                value="vol2"
                                onClick={() => handlePriorityChange('vol2')}
                                selected={toggleAlignment === 'vol2'}
                                sx={{
                                    borderRadius: '20px',
                                    marginRight: "10px",
                                    borderColor: toggleAlignment === 'vol2' ? 'white' : '',
                                    color: toggleAlignment === 'vol2' ? 'white' : 'black',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: toggleAlignment === 'vol2' ? darken(theme.palette.priority.vol2, 0.3) : '',
                                    },
                                }}
                            >
                                Vol2
                            </ToggleButton>

                            <ToggleButton
                                value="vol3"
                                onClick={() => handlePriorityChange('vol3')}
                                selected={toggleAlignment === 'vol3'}
                                sx={{
                                    borderRadius: '20px',
                                    marginRight: "10px",
                                    borderColor: toggleAlignment === 'vol3' ? 'white' : '',
                                    color: toggleAlignment === 'vol3' ? 'white' : 'black',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: toggleAlignment === 'vol3' ? darken(theme.palette.priority.vol3, 0.3) : '',
                                    },
                                }}
                            >
                                Vol3
                            </ToggleButton> */}
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
                                onChange={handlePhoneNumberChange}
                            />
                        </Grid>

                        {/* File Upload Field */}
                        <Grid item xs={12}>
                            <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList} page={"QuoteRequestForm"}/>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" sx={{
                                width: "100%",
                                backgroundColor: theme.typography.common.blue,
                                color: "#FFFFFF",
                                form:"addTenantMaintenanceItemForm"
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
        </Paper>
    )
}