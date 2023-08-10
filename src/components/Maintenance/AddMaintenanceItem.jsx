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
import FormHelperText from '@mui/material/FormHelperText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';

import theme from '../../theme/theme';

export default function AddMaintenanceItem({}){
    const location = useLocation();
    let navigate = useNavigate();

    const [property, setProperty] = useState('');
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('left');
    const [cost, setCost] = useState('');
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


    return (
        <ThemeProvider theme={theme}>
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
                            noValidate
                            autoComplete="off"
                        >
                             <Grid container spacing={3}>
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
                                        <Select onChange={handlePropertyChange}>
                                            <MenuItem value={"6123 Corte de la Reina"}>6123 Corte de la Reina</MenuItem>
                                            <MenuItem value={"9501 Kempler Drive"}>9501 Kempler Drive</MenuItem>
                                            <MenuItem value={"9107 Japonica Court"}>9107 Japonica Court</MenuItem>
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
                                    <ImageUploader/>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type="submit">
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