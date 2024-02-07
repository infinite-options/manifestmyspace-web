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

import { darken } from '@mui/system';


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormHelperText from '@mui/material/FormHelperText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';

import theme from '../../theme/theme';
import dataURItoBlob from '../utils/dataURItoBlob'
import { useUser } from "../../contexts/UserContext";
import { get } from "../utils/api";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function AddMaintenanceItem(){
    const location = useLocation();
    let navigate = useNavigate();
    const { user, getProfileId, maintenanceRoutingBasedOnSelectedRole } = useUser();
    const [propertyId, setPropertyId] = useState('')
    const [properties, setProperties] = useState([])
    const [property, setProperty] = useState('');
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('low');
    const [priority, setPriority] = useState('Low');
    const [completed, setCompleted] = useState('');
    const [cost, setCost] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    const profileId = getProfileId(); 

    const priorityOptions = ['low', 'medium', 'high'];

    const PriorityToggleButton = ({ value, onClick, isSelected }) => (
        <Button
            variant="outlined"
            size="small"
            onClick={() => onClick(value)}
            sx={{
                borderRadius: '20px',
                marginRight: "10px",
                borderColor: isSelected ? 'white' : '',
                color: isSelected ? 'white' : 'black',
                '&:hover': {
                    borderColor: 'white',
                    backgroundColor: isSelected ? darken(theme.palette.priority[value], 0.3) : '',
                },
            }}
        >
            {value.charAt(0).toUpperCase() + value.slice(1)}
        </Button>
    );



    const handlePropertyChange = (event) => {
        console.log("handlePropertyChange", event.target.value)
        setProperty(event.target.value);
        setPropertyId(event.target.value);
    };

    const handleIssueChange = (event) => {
        console.log("handleIssueCategoryChange", event.target.value)
        setIssue(event.target.value);
    };

    const handleCostChange = (event) => {
        console.log("handleCostChange", event.target.value)
        setCost(event.target.value);
    };

    const handleTitleChange = (event) => {
        console.log("handleTitleChange", event.target.value)
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        console.log("handleDescriptionChange", event.target.value)
        setDescription(event.target.value);
    };

    // const handlePriorityChange = (event, newToggleGroupValue) => {
    //     console.log("handlePriorityChange", event.target.value)
    //     // console.log("handleToggleGroupChange", newToggleGsroupValue)
    //     setPriority(event.target.value)
    //     // setToggleGroupValue(newToggleGroupValue);
    //     // setToggleAlignment(newToggleGroupValue);
    // };

    const handlePriorityChange = (priority) => {
        setToggleAlignment(priority);
    
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

    


    // const handlePriorityChange = (value) => {
    //     setToggleGroupValue(value);
    //     setToggleAlignment(value);
    // };

    const handleCompletedChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setCompleted(event.target.value)
    };

    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }

    useEffect(() => {
        console.log(user.owner_id)

        const getProperties = async () => {
            setShowSpinner(true);
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)

            const propertyData = await response.json();
            // console.log("data", data)
            // const propertyData = data.Property.result
            console.log("properties", propertyData)
            // setProperties(properties)
            setProperties([...propertyData["Property"].result]);
            setShowSpinner(false);
        }

        getProperties();

    }, [])



    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        
        const currentDate = new Date();
        // const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
        console.log(formattedDate)
        console.log("toggleAlignment", toggleAlignment)

        formData.append("maintenance_property_id", propertyId);
        formData.append("maintenance_title", title);
        formData.append("maintenance_desc", description);
        formData.append("maintenance_request_type", issue);
        formData.append("maintenance_request_created_by", getProfileId());  // problem is here it was 600-000003, changed it 600-000012
        formData.append("maintenance_priority", priority);
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
            } catch (err){  
                console.error("Error: ", err.message)
            }
            setShowSpinner(false);
        }
        postData();

        setSelectedImageList([])
        setProperty('')
        setIssue('')
        setToggleGroupValue('')
        setToggleAlignment('')
        setCost('')
        setTitle('')
        setDescription('')
        navigate(maintenanceRoutingBasedOnSelectedRole())
    }


    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    width: '100%', // Ensure the box spans the full viewport width
                    height: '100vh', // Ensure the box spans the full viewport height
                    paddingTop: "30px"
                }}
            >
                <Paper
                    style={{
                        // margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.form.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                        paddingTop: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Add Maintenance
                            </Typography>
                        </Box>
                        <Box position="absolute" left={0}>
                            <Button onClick={() => handleBackButton()}>
                                <ArrowBackIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
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
                            onSubmit={handleSubmit}
                            noValidate
                            autoComplete="off"
                        >
                             <Grid container spacing={6}>
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
                                        <Select 
                                            onChange={handlePropertyChange}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: '250px',  // you can adjust this value as needed
                                                        overflow: 'auto'
                                                    },
                                                },
                                            }}
                                        >
                                            {properties.map((property) => (
                                                <MenuItem key={property.property_uid} value={property.property_uid}>{property.property_address} {property?.property_unit}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Select Field for Issue and Cost Estimate */}
                                <Grid item xs={6}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Issue
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
                                        <Select onChange={handleIssueChange}>
                                            <MenuItem value={"Plumbing"}>Plumbing</MenuItem>
                                            <MenuItem value={"Electrical"}>Electrical</MenuItem>
                                            <MenuItem value={"Appliance"}>Appliance</MenuItem>
                                            <MenuItem value={"HVAC"}>HVAC</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Estimated Cost
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderRadius: '7px',
                                        }}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                        onChange={handleCostChange}
                                    />
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

                                {/* Priority Toggle Field */}
                                <Grid item xs={12}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Priority
                                    </Typography>
                                    <ToggleButtonGroup
                                        exclusive
                                        fullWidth
                                        value={toggleAlignment}
                                        // onChange={handlePriorityChange}
                                        onChange={(event, value) => handlePriorityChange(value)}
                                        // onClick={selectingPriority}
                                        aria-label="Priority"
                                        size="small"
                                        sx={{
                                            '& .MuiToggleButton-root.Mui-selected': {
                                                // backgroundColor: 'transparent', // Selected background color
                                                color: 'white', // Selected text color
                                            },
                                            '&.Mui-selected + .MuiToggleButton-root': {
                                                // borderLeftColor: 'white',
                                            },

                                            // display: "grid",
                                            // gridTemplateColumns: "auto auto auto auto",
                                            // gridGap: "50px",
                                            padding: "10px",
                                        }}
                                    >
                                        {/* {priorityOptions.map((option) => (
                                            <PriorityToggleButton
                                                key={option}
                                                value={option}
                                                onClick={() => handlePriorityChange(option)}
                                                isSelected={toggleAlignment === option}
                                            />
                                        ))} */}
                                        <ToggleButton 
                                            // value="Low"
                                            key={"Low"}
                                            value={"Low"}
                                            sx={{
                                                backgroundColor: theme.palette.priority.low,
                                                borderRadius: '20px',
                                                color: 'white',
                                                marginRight: "10px",
                                                borderWidth: "3px",
                                                borderColor: theme.palette.priority.low,
                                                '&.Mui-selected': {
                                                    borderColor: "white",
                                                    color: "white",
                                                    backgroundColor: theme.palette.priority.low,
                                                    borderWidth: "3px"  // Ensure consistent border width
                                                },
                                                '&:hover': {
                                                    borderColor: "white",
                                                    backgroundColor: darken(theme.palette.priority.low, 0.3),
                                                },
                                            }}
                                            onClick={() => handlePriorityChange("Low")}
                                            isSelected={toggleAlignment === "Low"}
                                            >
                                            Low
                                        </ToggleButton>
                                        <ToggleButton 
                                            // value="Medium"
                                            key={"Medium"}
                                            value={"Medium"}
                                            sx={{
                                                backgroundColor: theme.palette.priority.medium,
                                                borderRadius: '20px',
                                                color: 'white',
                                                marginRight: "10px",
                                                borderWidth: "3px",
                                                borderColor: theme.palette.priority.medium,
                                                '&.Mui-selected': {
                                                    borderColor: "white",
                                                    color: "white",
                                                    backgroundColor: theme.palette.priority.medium,
                                                    borderWidth: "3px",  // Ensure consistent border width
                                                    // borderLeftWidth: "3px",
                                                },
                                                '&:hover': {
                                                    // borderLeftColor: 'white',
                                                    // borderLeftWidth: "3px",
                                                    borderColor: "white",
                                                    backgroundColor: darken(theme.palette.priority.medium, 0.3),
                                                },
                                                '&.Mui-selected + .MuiToggleButton-root': {
                                                    borderLeftColor: 'white',
                                                    // borderRightWidth: "3px",
                                                },
                                            }}
                                            onClick={() => handlePriorityChange("Medium")}
                                            isSelected={toggleAlignment === "Medium"}
                                            >
                                            Medium
                                        </ToggleButton>
                                        <ToggleButton 
                                            value="High"
                                            sx={{
                                                backgroundColor: theme.palette.priority.high,
                                                borderRadius: '20px',
                                                color: 'white',
                                                marginRight: "10px",
                                                borderWidth: "3px",
                                                borderColor: theme.palette.priority.high,
                                                '&.Mui-selected': {
                                                    borderColor: "white",
                                                    color: "white",
                                                    backgroundColor: theme.palette.priority.high,
                                                    borderWidth: "3px",  // Ensure consistent border width
                                                    borderLeftWidth: "3px",
                                                },
                                                '&:hover': {
                                                    borderLeftColor: 'white',
                                                    // borderLeftWidth: "3px",
                                                    borderColor: "white",
                                                    backgroundColor: darken(theme.palette.priority.high, 0.3),
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
                                    </ToggleButtonGroup>

                                    {/* <ToggleButtonGroup
                                        exclusive
                                        fullWidth
                                        value={toggleAlignment}
                                        onChange={(event, value) => handlePriorityChange(value)}
                                        aria-label="Priority"
                                        size="small"
                                        sx={{
                                            '& .MuiToggleButton-root.Mui-selected': {
                                                backgroundColor: 'lightblue',
                                                color: 'white',
                                                borderColor: 'white',
                                            },
                                            '&.Mui-selected + .MuiToggleButton-root': {
                                                borderLeftColor: 'white',
                                            },
                                        }}
                                    >
                                        {/* Priority ToggleButtons */}
                                        {/* {priorityOptions.map((option) => (
                                            <PriorityToggleButton
                                                key={option}
                                                value={option}
                                                onClick={handlePriorityChange}
                                                isSelected={toggleAlignment === option}
                                            />
                                        ))} */} 

                                        {/* Additional ToggleButtons for vol1, vol2, vol3
                                        <ToggleButton
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
                                                    backgroundColor: toggleAlignment === 'vol1' ? darken(theme.palette.priority.medium, 0.3) : '',
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
                                                    backgroundColor: toggleAlignment === 'vol2' ? darken(theme.palette.priority.medium, 0.3) : '',
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
                                                    backgroundColor: toggleAlignment === 'vol3' ? darken(theme.palette.priority.medium, 0.3) : '',
                                                },
                                            }}
                                        >
                                            Vol3
                                        </ToggleButton>
                                    </ToggleButtonGroup> */}

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

                                {/* Radio Button for Already Completed */}
                                <Grid item xs={12}>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Already Completed?
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup column onChange={handleCompletedChange}>
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                {/* File Upload Field */}
                                <Grid item xs={12}>
                                    <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList} page={"QuoteRequestForm"}/>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type="submit" sx={{backgroundColor: "#9EAED6"}}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                Add Maintenance
                                        </Typography>
                                        <input type="file" hidden/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}