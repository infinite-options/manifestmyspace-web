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
    InputAdornment
} from "@mui/material";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormHelperText from '@mui/material/FormHelperText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import theme from '../../theme/theme';

export default function AddMaintenanceItem({}){
    const location = useLocation();
    let navigate = useNavigate();

    const [property, setProperty] = useState('');
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('left');


    const handlePropertyChange = (event) => {
        console.log("handlePropertyChange", event.target.value)
        setProperty(event.target.value);
    };

    const handleIssueCategoryChange = (event) => {
        console.log("handleIssueCategoryChange", event.target.value)
        setIssue(event.target.value);
    };

    const handleToggleGroupChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
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
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Grid container spacing={3}>
                                <Grid item padding="20px">
                                    <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
                                        <InputLabel>Select Property</InputLabel>
                                        <Select
                                            value={property}
                                            label="Select Property"
                                            // helperText="Select Property"
                                            onChange={handlePropertyChange}
                                        >
                                            <MenuItem value={"6123 Corte de la Reina"}>6123 Corte de la Reina</MenuItem>
                                            <MenuItem value={"9501 Kempler Drive"}>9501 Kempler Drive</MenuItem>
                                            <MenuItem value={"9107 Japonica Court"}>9107 Japonica Court</MenuItem>
                                        </Select>
                                        {/* <FormHelperText>Property</FormHelperText> */}
                                    </FormControl>
                                </Grid>
                                <Grid item padding="20px">
                                    <TextField fullWidth
                                        id="outlined-basic" 
                                        label="Estimated Cost" 
                                        variant="outlined" 
                                        size="small"
                                        // helperText="Estimated Cost"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                    />
                                </Grid>
                                <Grid item padding="20px">
                                    <ToggleButtonGroup
                                        color="primary"
                                        // value={alignment}
                                        sx={{ m: 1, minWidth: 400 }}
                                        size="small"
                                        exclusive
                                        onChange={handleToggleGroupChange}
                                    >
                                        <ToggleButton value="low" key="low">Low</ToggleButton>
                                        <ToggleButton value="medium" key="medium">Medium</ToggleButton>
                                        <ToggleButton value="high" key="high">High</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item padding="20px">
                                    <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
                                        <InputLabel>Issue</InputLabel>
                                        <Select
                                            value={issue}
                                            label="Select Category"
                                            onChange={handleIssueCategoryChange}
                                        >
                                            <MenuItem value={"Plumbing"}>Plumbing</MenuItem>
                                            <MenuItem value={"Electrical"}>Electrical</MenuItem>
                                            <MenuItem value={"Appliance"}>Appliance</MenuItem>
                                            <MenuItem value={"HVAC"}>HVAC</MenuItem>
                                        </Select>
                                        <FormHelperText>Issue</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Button>
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                        Add Maintenance
                                    </Typography>
                                </Button>
                            </Grid>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}