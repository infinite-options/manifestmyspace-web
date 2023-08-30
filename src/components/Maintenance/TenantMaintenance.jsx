import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider,
    Form,
    TextField,
    Badge,
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
    InputAdornment,
    TableCell,
    AccordionSummary,
    AppBar,
    Divider,
    TableRow,
    Table,
    TableBody,
    AccordionDetails,
    IconButton,
    Toolbar,
    Accordion,
    Avatar,
} from "@mui/material";
import theme from '../../theme/theme';
import TenantMaintenanceMenu from './TenantMaintenanceMenu.png';
import TenantMaintenanceView from './TenantMaintenanceView';
import AddTenantMaintenanceItem from './AddTenantMaintenanceItem';


export default function TenantMaintenance(){
    const [filterToggle, setFilterToggle] = useState(false);
    const [tenantMaintenanceData, setTenantMaintenanceData] = useState([]);
    const [newRequestBool, setNewRequestBool] = useState(false);
    const [propertyAddress, setPropertyAddress] = useState("")
    const [propertyId, setPropertyId] = useState("200-000029")

    let navigate = useNavigate();

    const color = "#FFFFFF"


    const handleFilterToggle = () => {
        setFilterToggle((prev) => !prev);
    };


    useEffect(() => {

        // const getPropertyDetails = async () => {
        //     console.log("Getting Property Details")
        //     try {
        //         const response = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/Property/' + propertyId);
        //         const jsonData = await response.json();
        //         const data = jsonData.PropertyDetails.result;
        //     } catch (err) {
        //         console.error(err.message);
        //     }
        // };

        const getTenantMaintenanceData = async () => {
            console.log("Getting Tenant Maintenance Data")
            try {
                const response = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/200-000029');
                const jsonData = await response.json();
                const data = jsonData.MaintenanceProjects.result;
                setTenantMaintenanceData(data)
            } catch (err) {
                console.error(err.message);
            }
        };
        getTenantMaintenanceData();
        // getPropertyDetails();
    }, []);

    function handleNewRequestButton(){
        setNewRequestBool(!newRequestBool)
    }



    return(
        <ThemeProvider theme={theme}>
            <Box
            style={{
                justifyContent: 'center',
                // minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px

            }}
            >   
                <Stack
                    direction="row"
                    sx={{
                        display: 'flex',
                    }}
                >
                    <Box sx={{
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'center'
                        }}>
                        <Button 
                            onClick={() => console.log("tenant maintenance menu button")}
                            sx={{
                                padding: '0px',
                            }}
                        >
                            <img src={TenantMaintenanceMenu} alt="Tenant Maintenance Menu" width="25px" height="25px"/> 
                        </Button>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 1,
                    }}>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.fontWeightBold,
                                fontSize: theme.typography.h4.fontSize,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                            }}
                        >
                            Maintenance
                        </Typography>
                    </Box>
                </Stack>
                <Divider 
                        component="div" 
                        role="presentation"
                        sx={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: theme.palette.primary.main,
                        }}
                    />
                <Stack sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: '30px',
                    flexDirection: 'row',
                    padding: theme.spacing(2),
                }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    <Typography sx={{
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.mediumFont,
                        paddingLeft: "10px"
                    }}>
                        {/* Property Address */}
                        {propertyAddress}
                        {/* {tenantMaintenanceData[0].propertyAddress} {tenantMaintenanceData[0].unit} */}
                    </Typography>
                </Stack>
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
                        paddingTop: '10px',
                    }}
                >
                    {newRequestBool ?
                        (<AddTenantMaintenanceItem
                            closeAddTenantMaintenanceItem={handleNewRequestButton}
                            propertyId={propertyId}
                        /> ):(
                            <TenantMaintenanceView
                                tenantMaintenanceData={tenantMaintenanceData}
                                handleNewRequestButton={handleNewRequestButton}
                                handleRequestDetailPage={() => console.log("Handle Request Detail Page")}
                                filterToggle={filterToggle}
                                handleFilterToggle={handleFilterToggle}
                            />
                        )
                    }
                </Paper>
            </Box>
        </ThemeProvider>
    )
}