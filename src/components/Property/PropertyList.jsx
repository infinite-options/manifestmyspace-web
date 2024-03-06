import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Typography, Box, Stack, Paper, Button, ThemeProvider, Form, TextField, ToggleButton, ToggleButtonGroup, FormControl, InputLabel,
MenuItem, Select, Grid, Input, Container, Radio, FormLabel, FormControlLabel, RadioGroup, UploadFile, InputAdornment, InputBase, IconButton,
CardMedia, CardContent, CardActions, ListItemText, ListItem, List, Avatar, Badge,} from "@mui/material";

import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import propertyImage from "./propertyImage.png";
import maintenanceIcon from "./maintenanceIcon.png";
import samplePropertyData from "./samplePropertyData";
import { useUser } from "../../contexts/UserContext";
import { get } from "../utils/api";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
// import PropertyData from './PropertyData';

const SearchBar = ({ propertyList, setFilteredItems }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);
        if (query.trim() === "") {
        setFilteredItems(propertyList);  // Reset to the original list if the search bar is cleared
        } else{
        const terms = query.split(" ").map(term => term.toLowerCase());  // Split the search term into individual terms
        const filtered = propertyList.filter(item => 
            terms.every(term => (item.property_address + item.property_unit + item.property_city + item.property_state + item.property_zip ).toLowerCase().includes(term))
        );
        setFilteredItems(filtered);  // Updating the state with filtered items
        }
    }

    const clearSearch = () => {
        setSearchTerm("");
        setFilteredItems(propertyList);
    };

    return (
        <Paper
        component="form"
        sx={{
            p: "2px 4px",
            alignItems: "center",
            backgroundColor: theme.palette.form.main,
            display: "flex"
        }}
        >
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
        </IconButton>
        <InputBase
            sx={{ ml: 1, zIndex: 1000, flexGrow: 1}}
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={handleSearchChange}
            color={theme.typography.common.blue}
        />
        {searchTerm && (
            <IconButton aria-label="clear" onClick={clearSearch}>
            <CloseIcon />
            </IconButton>
        )}
        </Paper>
    );
    };

    const paymentStatusColorMap = {
        "Paid On Time": theme.palette.priority.clear,
        "Partially Paid": theme.palette.priority.medium,
        "Paid Late": theme.palette.priority.low,
        "Not Paid": theme.palette.priority.high,
        "Vacant": "#160449",
        "No Manager": theme.palette.priority.low,
    };

    const paymentStatusMap = {
        "UNPAID": "Not Paid",
        "PAID LATE": "Paid Late",
        "PAID": "Paid On Time",
        "Partial": "Partially Paid",
        "VACANT": "Vacant",
        "NO MANAGER": "No Manager",
    };


    function getPaymentStatusColor(paymentStatus) {
    if (paymentStatus === null || paymentStatus === undefined) {
        return paymentStatusColorMap["Vacant"];
    } else {
        const status = paymentStatusMap[paymentStatus];
        return paymentStatusColorMap[status];
    }
    }

    function getPaymentStatus(paymentStatus) {
    if (paymentStatus === null || paymentStatus === undefined) {
        return paymentStatusMap["VACANT"];
    } else {
        const status = paymentStatusMap[paymentStatus];
        return status;
    }
    }

    function getPropertyList(data) {
    const propertyList = data["Property"].result;
    const applications = data["Applications"].result;
    const appsMap = new Map();
    applications.forEach(a => {
        const appsByProperty = appsMap.get(a.property_uid) || []
        appsByProperty.push(a);
        appsMap.set(a.property_uid, appsByProperty);
    });
    return propertyList.map(p => {
        p.applications = appsMap.get(p.property_uid) || [];
        p.applicationsCount = [...p.applications].filter(a => a.lease_status === "NEW").length;
        return p;
    })
    }

export default function PropertyList({}) {
    let navigate = useNavigate();
    const { getProfileId, isManagement, isOwner } = useUser();
    const [propertyList, setPropertyList] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    // const [maintenanceData, setMaintenanceData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [activeContracts, setActiveContracts] = useState([]);
    const profileId = getProfileId();
    const [citySortOrder, setCitySortOrder] = useState("asc");
    const [stateSortOrder, setStateSortOrder] = useState("asc");
    const [addressSortOrder, setAddressSortOrder] = useState("asc");
    const [statusSortOrder, setStatusSortOrder] = useState("asc");
    const [zipSortOrder, setZipSortOrder] = useState("asc");
    // console.log("getProfileId information", getProfileId());

    function numberOfMaintenanceItems(maintenanceItems){
        console.log(maintenanceItems)
        if(maintenanceItems && maintenanceItems.length > 0){
            return maintenanceItems.filter(mi => !!mi.maintenance_request_uid).length
        } else {
            return 0
        }
    }

    useEffect(() => {
        // console.log("PropertyList useEffect");
        // console.log(propertyList);
        const fetchData = async () => {
        setShowSpinner(true);
        // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000003`)
        const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${profileId}`)
        // const response = await fetch(`http://localhost:4000/properties/${profileId}`)
        const propertyData = await response.json();
        const propertyList = getPropertyList(propertyData)
        setPropertyList([...propertyList]);
        setDisplayedItems([...propertyList]);
        setShowSpinner(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const getContractsForOwner = async () => {
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`);
                if(!response.ok){
                    console.log("Error fetching contracts data")
                }
                const contractsResponse = await response.json();
                // console.log("contractsResponse", contractsResponse.result)
                setContracts(contractsResponse.result)
            }
            catch (error){
                console.log(error);
            }
        }
        getContractsForOwner();
    }, []);

    function sortByCity() {
        let items = [...displayedItems];
        items.sort((property1, property2) => property1.property_city.localeCompare(property2.property_city));
        setDisplayedItems(citySortOrder === "asc" ? items : items.reverse());
        setCitySortOrder(citySortOrder === "asc" ? "desc" : "asc");
    }
    
    function sortByAddress() {
        let items = [...displayedItems];
        items.sort((property1, property2) => property1.property_address.localeCompare(property2.property_address));
        setDisplayedItems(addressSortOrder === "asc" ? items : items.reverse());
        setAddressSortOrder(addressSortOrder === "asc" ? "desc" : "asc");
    }

    
    function sortByState() {
        let items = [...displayedItems];
        items.sort((property1, property2) => property1.property_state.localeCompare(property2.property_state));
        setDisplayedItems(stateSortOrder === "asc" ? items : items.reverse());
        setStateSortOrder(stateSortOrder === "asc" ? "desc" : "asc");
    }


    function sortByZip() {
        let items = [...displayedItems];
        items.sort((property1, property2) => property1.property_zip-property2.property_zip);
        setDisplayedItems(zipSortOrder === "asc" ? items : items.reverse());
        setZipSortOrder(zipSortOrder === "asc" ? "desc" : "asc");
    }
    
    function sortByStatus() {
        let items = [...displayedItems];
        items.sort((property1, property2) => {
            if (property1.rent_status === "NO MANAGER") {
                return -1; // Property1 comes first
            } else if (property2.rent_status === "NO MANAGER") {
                return 1; // Property2 comes first
            } else {
                return property1.rent_status.localeCompare(property2.rent_status);
            }
        });
        setDisplayedItems(statusSortOrder === "asc" ? items : items.reverse());
        setStatusSortOrder(statusSortOrder === "asc" ? "desc" : "asc");
    }

    function handlePropertyDetailNavigation(property, index, propertyList) {

        // console.log("theoretically property", property)
        // console.log("handlePropertyDetailNavigation");
        navigate(`/propertyDetail`, { state: { index, propertyList, contracts } });
    }

    function getBadgeContent(index) {
        return propertyList?.[index]?.num_open_maintenace_req ?? 0;
    }

    function getNoOfApplications(index) {
        return propertyList?.[index]?.applicationsCount || 0;
    }

    function getCoverPhoto(property) {
        const imageArray = JSON.parse(property.property_images);
        if (property.property_favorite_image) {
            const index = imageArray.findIndex(image => image === property.property_favorite_image);
            if(index !== -1){
                return property.property_favorite_image;
            }else{
                return propertyImage;
            }
                
        } else if (imageArray.length !== 0) {
            return imageArray[0];
        } else {
            return propertyImage;
        }
    }

    function displayAddress(property){
        if (property.property_unit !== ""){
        return (
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
            {property.property_address}  #{property.property_unit}<br />
            {property.property_city + " " + property.property_state + " " + property.property_zip}
            </Typography>
        )
        } else {
        return (
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
            {property.property_address} <br />
            {property.property_city + " " + property.property_state + " " + property.property_zip}
            </Typography>
        )
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <Box
            sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%", // Take up full screen width
            minHeight: "100vh", // Set the Box height to full height
            marginTop: theme.spacing(2), // Set the margin to 20px
            }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Paper
            sx={{
                margin: "30px",
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: "100%", // Occupy full width with 25px margins on each side
                maxWidth: "800px", // You can set a maxWidth if needed
            }}
            >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: theme.spacing(2), position: "relative" }}>
                <Box sx={{ flex: 1 }} />
                <Box position="absolute" left="50%" sx={{ transform: "translateX(-50%)" }}>
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
                <Button position="absolute" right={0} sx={{ "&:hover, &:focus, &:active": {background: theme.palette.primary.main } }} onClick={() => navigate("/addProperty")}>
                <AddIcon onClick={() => navigate("/addProperty")} sx={{ color: theme.typography.primary.black, fontSize: "30px", margin: "5px" }} />
                </Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: theme.spacing(2), position: "relative" }}>
                {/* New Buttons */}
                <Typography> Sort by</Typography>
                <Button onClick={sortByZip} color="inherit">
                  Zip
                </Button>
                <Button onClick={sortByState}  color="inherit">
                  State
                </Button>
                <Button onClick={sortByAddress}  color="inherit">
                  Address
                </Button>
                <Button onClick={sortByCity} color="inherit">
                  City
                </Button>
                <Button onClick={sortByStatus} color="inherit">
                  Rent Status
                </Button>
                <Box sx={{ flex: 1 }} />
                <Box position="absolute" left="50%" sx={{ transform: "translateX(-50%)" }}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                    }}
                  ></Typography>
                </Box>      
            </Stack>
            <Box sx={{ padding: "10px" }}>
                <SearchBar propertyList={propertyList} setFilteredItems={setDisplayedItems} sx={{ width: "100%" }} />
                
                
                <List>
                {displayedItems.map((property, index) => (
                    <ListItem
                        key={index}
                        style={{
                            justifyContent: "space-between",
                            display: "flex",
                            height: "100%",
                            alignItems: "flex-start",
                            backgroundColor: theme.palette.form.main,
                            paddingLeft: "10px",
                            paddingRight: "10px",
                        }}
                        onClick={() => {
                            let i=propertyList.findIndex(p=>p.property_uid===property.property_uid)
                            handlePropertyDetailNavigation(property, i, propertyList)
                        }}
                    >
                    <Avatar
                        // src={getCoverPhoto(property)}
                        src={`${getCoverPhoto(property)}?${Date.now()}`}
                        alt="property image"
                        sx={{
                        borderRadius: "0",
                        marginRight: "10px",
                        width: "75px",
                        height: "75px",
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
                        {displayAddress(property)}
                    </Box>
                    <Box
                        sx={{
                        display: "flex",
                        alignItems: "center", // vertically align items to the center
                        justifyContent: "center", // horizontally align items to the center
                        height: "100%", // to take full height of its parent
                        width: "50%", // to take full width of its parent
                        }}
                    >
                        <Stack>
                            <Typography  
                                sx={{
                                    color: "#000000",
                                    fontWeight: 700,
                                    fontSize: "15px",
                                    margin: "0px", // Ensure no margin
                                    padding: "0px", // Ensure no padding
                                    textAlign: "center", // Ensure text is centered within itself
                                    verticalAlign: "middle", // Vertically align text in the middle
                                    alignItems: "center", // vertically align items to the center
                                }}
                            >
                                {property.tenant_first_name} {property.tenant_last_name} 
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#000000",
                                    fontWeight: 700,
                                    fontSize: "15px",
                                    margin: "0px", // Ensure no margin
                                    padding: "0px", // Ensure no padding
                                    textAlign: "center", // Ensure text is centered within itself
                                    verticalAlign: "middle", // Vertically align text in the middle
                                    alignItems: "center", // vertically align items to the center
                                }}
                            >
                                {property.lease_uid}
                            </Typography>
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                        backgroundColor: getPaymentStatusColor(property.rent_status),
                        width: "25%", // Ensure it takes up full width of its parent
                        height: "100%", // Ensure it takes up full height of its parent
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0px",
                        border: "none",
                        margin: "0px",
                        }}
                    >
                        <Badge
                        overlap="circular"
                        color="success"
                        badgeContent={getNoOfApplications(index)}
                        invisible={!getNoOfApplications(index)}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        style={{
                            color: "#000000",
                            width: "100%",
                        }}
                        >
                        <Typography
                            sx={{
                            color: theme.palette.primary.main,
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            margin: "0px", // Ensure no margin
                            padding: "0px", // Ensure no padding
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            }}
                        >
                            {getPaymentStatus(property.rent_status)}
                        </Typography>
                        </Badge>
                    </Box>
                    <Badge
                        overlap="circular"
                        color="error"
                        badgeContent={getBadgeContent(index)}
                        anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                        }}
                        style={{
                        color: "#000000",
                        // color: theme.palette.custom.blue,
                        }}
                    >
                        <Button onClick={() => navigate("/maintenance")} sx={{ border: "none", "&:hover, &:focus, &:active": {backgroundColor: "#d6d5da"}}}>
                        <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "50px", height: "50px" }} />
                        </Button>
                    </Badge>
                    </ListItem>
                ))}
                </List>
            </Box>
            </Paper>
        </Box>
        </ThemeProvider>
    );
}

export { SearchBar, getPaymentStatusColor, getPaymentStatus };
