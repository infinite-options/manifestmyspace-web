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
    InputBase, 
    IconButton,
    CardMedia,
    CardContent,
    CardActions,
    ListItemText,
    ListItem,
    List,
    Avatar,
    Badge
} from "@mui/material";

import theme from '../../theme/theme';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import propertyImage from './propertyImage.png';
import maintenanceIcon from './maintenanceIcon.png';
import samplePropertyData from './samplePropertyData';

import { get } from "../utils/api"

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSearch = () => {
      // Perform the search logic here
      console.log('Searching for:', searchTerm);
    };
  
    return (
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          alignItems: 'center',
          backgroundColor: theme.palette.custom.blue,
        }}
      >
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1}}
          placeholder="Search..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={handleSearchChange}
          color={theme.typography.common.blue}
        />
      </Paper>
    );
  };

export default function PropertyList({}){
    let navigate = useNavigate();
    const [propertyList, setPropertyList] = useState([])
    const [maintenanceData, setMaintenanceData] = useState([])

    const paymentStatusMap = {
        "Paid On Time": theme.palette.priority.clear,
        "Partially Paid": theme.palette.priority.low,
        "Paid Late": theme.palette.priority.medium,
        "Not Paid": theme.palette.priority.high
    }

    useEffect(() => {
        const getMaintenaceDataForProperties = async (propertyList) =>{
            console.log("getMaintenaceDataForProperties")
            console.log(propertyList)
            let maintenanceData = {};
            for (const property of propertyList){
                console.log("property", property)
                const data = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${property.property_id}`)
                const propertyMaintenanceData = await data.json();
                console.log("propertyMaintenanceData", propertyMaintenanceData)
                maintenanceData[property.property_id] = propertyMaintenanceData
            }
            console.log("maintenanceData", maintenanceData)
            // setMaintenanceData([...maintenanceData])
        }

        console.log("PropertyList useEffect")
        console.log(propertyList)
        const fetchData = async () => {
            const data = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByOwner/110-000003')
            const propertyData = await data.json();
            console.log("propertyData", propertyData.Property)
            setPropertyList([...propertyData.Property])
        }
        fetchData()
        getMaintenaceDataForProperties(propertyList)
    }, [])

    // const getMaintenaceDataForProperties = async (propertyList) =>{
    //     console.log("getMaintenaceDataForProperties")
    //     console.log(propertyList)
    //     let maintenanceData = {};
    //     for (const property of propertyList){
    //         console.log("property", property)
    //         const data = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${property.property_id}`)
    //         const propertyMaintenanceData = await data.json();
    //         console.log("propertyMaintenanceData", propertyMaintenanceData)
    //         maintenanceData[property.property_id] = propertyMaintenanceData
    //     }
    //     console.log("maintenanceData", maintenanceData)
    //     return maintenanceData
    // }
    

    function handlePropertyDetailNavigation(propertyId, index, propertyList){
        console.log("handlePropertyDetailNavigation")
        navigate(`/propertyDetail`, {state: {propertyId, index, propertyList}});
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '100vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                sx={{
                    margin: '30px',
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.primary.main,
                    width: '100%', // Occupy full width with 25px margins on each side
                    maxWidth: '800px', // You can set a max-width if needed
                }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ padding: theme.spacing(2), position: 'relative' }}
                    >
                        <Box sx={{ flex: 1 }} />
                        <Box position="absolute" left="50%" sx={{ transform: 'translateX(-50%)' }}>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.largeFont,
                            }}
                        >
                            All Properties
                        </Typography>
                        </Box>
                        <Button position="absolute" right={0} onClick={() => console.log('this button should add a property')}>
                        <AddIcon
                            onClick={() => navigate('/addProperty')}
                            sx={{ color: theme.typography.primary.black, fontSize: '30px', margin: '5px' }}
                        />
                        </Button>
                    </Stack>
                    <Box sx={{ padding: '10px' }}>
                        <SearchBar sx={{ width: '100%' }} />
                        <List>
                            {propertyList.map((property, index) => (
                                <ListItem
                                    key={property.id}
                                    style={{
                                        justifyContent: 'space-between',
                                        display: 'flex',
                                        height: '100%',
                                        alignItems: 'flex-start',
                                        backgroundColor: theme.palette.form.main,
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                    }}
                                    onClick={() => handlePropertyDetailNavigation(property, index, propertyList)}
                                >
                                    <Avatar src={propertyImage} alt="property image"
                                        sx={{
                                            borderRadius: '0',
                                            marginRight: '10px',
                                            width: '75px',
                                            height: '75px',
                                        }}
                                    />
                                     <Box   
                                        sx={{
                                            display: "flex",
                                            alignItems: "center", // vertically align items to the center
                                            justifyContent: "center", // horizontally align items to the center
                                            height: "100%", // to take full height of its parent
                                            width: "50%", // to take full width of its parent
                                        }}
                                    >
                                        <Typography 
                                            sx={{
                                                color: theme.typography.common.blue,
                                                fontWeight: theme.typography.primary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                                margin: "0px", // Ensure no margin
                                                padding: "0px", // Ensure no padding
                                                textAlign: "center", // Ensure text is centered within itself                   
                                                verticalAlign: "middle", // Vertically align text in the middle
                                                alignItems: "center", // vertically align items to the center
                                            }}
                                        >
                                            {property.property_address} <br/>
                                            {property.property_city + " " + property.property_state + " " + property.property_zip}
                                        </Typography>
                                    </Box>
                                    <Box   
                                        sx={{
                                            backgroundColor: paymentStatusMap[property.paymentStatus],
                                            width: "25%", // Ensure it takes up full width of its parent
                                            height: "100%", // Ensure it takes up full height of its parent
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "0px",
                                            border: "none",
                                            margin: "0px"
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: theme.typography.primary.fontWeight,
                                                fontSize: theme.typography.smallFont,
                                                margin: "0px", // Ensure no margin
                                                padding: "0px", // Ensure no padding
                                                textAlign: "center", // Ensure text is centered within itself                                    
                                            }}
                                        >
                                            {property.paymentStatus}
                                        </Typography>
                                    </Box>
                                    <Badge
                                        overlap="circular"
                                        color="error"
                                        badgeContent={0} //{property.maintenanceItems.length}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        style={{
                                            color: "#000000"
                                            // color: theme.palette.custom.blue,   
                                        }}
                                    >
                                        <Button onClick={() => navigate('/maintenance')} sx={{border: "none"}}>
                                            <img src={maintenanceIcon} alt="maintenance icon" style={{width: '50px', height: '50px'}}/>
                                        </Button>
                                    </Badge>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}

