import React, { useState, useEffect } from "react";
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
  Badge,
} from "@mui/material";

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

const SearchBar = ({ propertyList, newPMRequestList, setFilteredItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.trim() === "") {
      setFilteredItems([...newPMRequestList, ...propertyList]);  // Reset to the original list if the search bar is cleared
    } else{
      const terms = query.split(" ").map(term => term.toLowerCase());
      const combinedList = [ ...newPMRequestList, ...propertyList];  // Split the search term into individual terms
      const filtered = combinedList.filter(item => 
        terms.some(
          term => 
            item.property_address.toLowerCase().includes(term)
        
          )
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
};

const paymentStatusMap = {
  "UNPAID": "Not Paid",
  "PAID LATE": "Paid Late",
  "PAID": "Paid On Time",
  "Partial": "Partially Paid",
  "VACANT": "Vacant",
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
    p.type = "property"
    p.applications = appsMap.get(p.property_uid) || [];
    p.applicationsCount = [...p.applications].filter(a => a.lease_status === "NEW").length;
    return p;
  })
}

function getNewPMRequestList(data) {
  const newPMRequestList = data["NewPMRequests"].result;

  return newPMRequestList.map(r => {
    r.type = "new_pm_request"
    return r;
  })
}

export default function PMProperties({}) {
  let navigate = useNavigate();
  const { getProfileId } = useUser();
  const [propertyList, setPropertyList] = useState([]);
  const [newPMRequestList, setNewPMRequestList] = useState([]);
  useEffect(() => {
    console.log("propertyList - ");
    console.log(propertyList);
  }, [propertyList]);
  const [displayedItems, setDisplayedItems] = useState([]);
  // useEffect(()=> {
  //   console.log("displayedItems", displayedItems);
  // }, [displayedItems]);
  // const [maintenanceData, setMaintenanceData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const profileId = getProfileId();

  console.log("getProfileId information", getProfileId());

  function numberOfMaintenanceItems(maintenanceItems){
    console.log(maintenanceItems)
    if(maintenanceItems && maintenanceItems.length > 0){
        return maintenanceItems.filter(mi => !!mi.maintenance_request_uid).length
    } else {
        return 0
    }
  }

  const calculateTimeDiff = (date) => {
    // const announcement_date = new Date("announcementData["announcement_date"]");
    const announcement_date = new Date(date);
    // const announcement_date = new Date(Date.UTC(
    //     announcementData["announcement_date"].getFullYear(),
    //     announcementData["announcement_date"].getMonth(),
    //     announcementData["announcement_date"].getDate(),
    //     announcementData["announcement_date"].getHours(),
    //     announcementData["announcement_date"].getMinutes(),
    //     announcementData["announcement_date"].getSeconds()
    // ));
    if (announcement_date === null) {
        return "<TIME AGO>";
    }
    const now = new Date();
    const timeDiff = now - announcement_date;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let durationString;
    if (days > 0) {
        durationString = `${days} days`;
    } else if (hours > 0) {
        durationString = `${hours} hours`;
    } else if (minutes > 0) {
        durationString = `${minutes} minutes`;
    } else {
        durationString = `${seconds} seconds`;
    }

    console.log(now, announcement_date, durationString, seconds, minutes, hours, days);
    return durationString;
  };

  useEffect(() => {
    console.log("PMProperties useEffect");
    console.log(propertyList);
    const fetchData = async () => {
      setShowSpinner(true);
      // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/600-000003`)
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${profileId}`)
      const propertyData = await response.json();
      const propertyList = getPropertyList(propertyData);
      const newPMRequestList = getNewPMRequestList(propertyData);
      setPropertyList([...propertyList]);
      setNewPMRequestList([...newPMRequestList]);
      setDisplayedItems([...newPMRequestList, ...propertyList]);
      setShowSpinner(false);
    };
    fetchData();
  }, []);

  function handlePropertyDetailNavigation(property, index, propertyList) { 

    console.log("theoretically property", property)
    console.log("handlePropertyDetailNavigation");
    navigate(`/propertyDetail`, { state: { index, propertyList } });
  }

  function getBadgeContent(index) {
    // return propertyList?.[index]?.num_open_maintenace_req ?? 0;
    return displayedItems?.[index]?.num_open_maintenace_req ?? 0;
    
  }

  function getNoOfApplications(index) {
    // return propertyList?.[index]?.applicationsCount || 0;
    return displayedItems?.[index]?.applicationsCount || 0;
  }

  function getCoverPhoto(property) {
    if (property.property_images) {
      let imagesArray = JSON.parse(property.property_images);
      return imagesArray[0];
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
            maxWidth: "800px", // You can set a max-width if needed
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
          <Box sx={{ padding: "10px" }}>
            <SearchBar propertyList={propertyList} newPMRequestList={newPMRequestList} setFilteredItems={setDisplayedItems} sx={{ width: "100%" }} />
            <List>
              {displayedItems.map((property, index) => (
                property.type === "property"?
                (
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
                    // onClick={() => handlePropertyDetailNavigation(property, (index - newPMRequestList.length), propertyList)}
                    onClick={() => handlePropertyDetailNavigation(property, index, displayedItems)}
                  >
                    <Avatar
                      src={getCoverPhoto(property)}
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
                      {/* <Typography
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
                      > */}
                        {/* {property.property_address}  #{property.property_unit}<br />
                        {property.property_city + " " + property.property_state + " " + property.property_zip}
                        */}
                        {displayAddress(property)}
                      {/* </Typography> */}
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
                      <Button onClick={() => navigate("/maintenance")} sx={{ border: "none", "&:hover, &:focus, &:active": { backgroundColor: "#F2F2F2"}, }}>
                        <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "50px", height: "50px" }} />
                        {/* <Box fixed sx={{
                            height: '20px',
                            width: '20px',
                            background: '#A52A2A',
                            borderRadius: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '30%',
                            boxShadow: '0px 4px 4px #A52A2A',
                        }}>
                          <Typography
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: theme.typography.primary.fontWeight,
                          fontSize: theme.typography.smallFont,
                          textAlign: "center", // Ensure text is centered within itself
                        }}
                      ></Typography>
                        </Box> */}
                        
                      </Button>
                    </Badge>
                  </ListItem>
                ) : (                  
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
                        console.log("Contract clicked - contract_uid: ", property.contract_uid);
                        navigate('/managementContractDetails', {state: {contract_uid: property.contract_uid, contract_business_id: property.contract_business_id, contract_property_id: property.contract_property_id, property_owner_id: property.property_owner_id}});
                    }} 
                  >
                    <Avatar
                      src={getCoverPhoto(property)}
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
                      {/* <Typography
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
                      > */}
                        {/* {property.property_address}  #{property.property_unit}<br />
                        {property.property_city + " " + property.property_state + " " + property.property_zip}
                        */}
                        {displayAddress(property)}
                      {/* </Typography> */}
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: '#428038',
                        width: "25%", 
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "5px",
                        border: "none",
                        margin: "0px",
                      }}
                    >
                      
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: theme.typography.primary.fontWeight,
                            // fontSize: theme.typography.smallFont,
                            fontSize: '13px',
                            margin: "0px", // Ensure no margin
                            padding: "0px", // Ensure no padding
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          {property.contract_status === "NEW"? "New Request" : property.contract_status}
                        </Typography>
                    </Box>
                    
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          maxWidth: '20%',
                          padding: '5px',
                          fontSize: '10px',
                        }}
                      >
                        <Box
                          sx={{
                            margin: 'auto',
                          }}
                        >
                          Open
                        </Box>
                        <Box>
                          {property.contract_start_date? calculateTimeDiff(property.contract_start_date) : "<NUM_DAYS>"}
                        </Box>
                      </Box>
                    
                  </ListItem>
                )
              ))}
            </List>
            
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export { SearchBar, getPaymentStatusColor, getPaymentStatus };
