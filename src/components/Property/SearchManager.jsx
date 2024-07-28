// Import statements
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, ThemeProvider } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import ReturnArrow from "../../images/refund_back.png";
import theme from "../../theme/theme";
import { Typography, Button, TextField, InputAdornment, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as SearchIcon } from "../../images/search.svg";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#F2F2F2",
      borderRadius: 10,
      height: "30px",
      width: "90%",
      marginBlock: 10,
      paddingBottom: "15px",
      marginLeft: "5%",
    },
  },
}));

// SearchManager Component
const SearchManager = ({ searchManagerState }) => {
  // State declarations
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const managerState = location.state || searchManagerState;
  const { index, propertyData, isDesktop } = managerState || {};
  console.log('---propertyData searchmanager---', propertyData, index);
  const [displayed_managers, set_displayed_managers] = useState([]);
  const [all_managers, set_all_managers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getProfileId } = useUser();
  const [ownerId, setOwnerId] = useState(getProfileId());
  const [showSpinner, setShowSpinner] = useState(false);

  // Function to fetch manager information
  const get_manager_info = async () => {
    setShowSpinner(true);
    const url = "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/searchManager";
    const args = {};
    const response = await axios.get(url);
    const managers = response.data.result;
    set_all_managers(managers);
    set_displayed_managers(managers);
    setShowSpinner(false);
  };

  // useEffect to fetch manager information on component mount
  useEffect(() => {
    get_manager_info();
  }, []);

  // Function to handle search
  const handleSearch = (search_string) => {
    const managers = all_managers.filter((manager) =>
      manager.business_name.toLowerCase().includes(search_string.toLowerCase())
    );
    set_displayed_managers(managers);

  };

  const navigateToPrev = () => {
    if(isDesktop === true){
      navigate('/properties', {state:{index:index}});
    }else{
      navigate(-1);
    }
  }

  // ... (Rest of the component code)

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          fontFamily: "Source Sans Pro",
          color: "text.darkblue",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.gray",
            borderRadius: "10px",
            padding: "10px",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          <Box
            sx={{
              padding: "13px",
              backgroundColor: "#F2F2F2",
              borderRadius: "9px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "text.darkblue",
                }}
              >
                {"Search For Property Manager"}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.blue",
                fontWeight: "bold",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center', // This ensures vertical alignment with the image
                    paddingLeft: "5px",
                  }}
                  onClick={navigateToPrev}
                >
                  <img src={ReturnArrow} style={{ verticalAlign: 'middle', paddingRight: "5px" }} alt="back" />
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.primary.fontWeight,
                      cursor: "pointer",
                    }}
                  >
                    {"Return to viewing Property Manager"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                position: "relative",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                top: "10px",
              }}
            >
              <Box
                sx={{
                  padding: "13px",
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                }}
              >
                <TextField
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  variant="filled"
                  fullWidth
                  placeholder="Search for new Property Manager"
                  className={classes.root}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          alignItems: "baseline",
                          paddingBottom: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {displayed_managers.map((m) => (
                  <DocumentCard data={m} ownerId={ownerId} propertyData={propertyData} index={index} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// ... (Other components and exports)


function DocumentCard(props) {
  const obj = props.data;
  const ownerId = props.ownerId;
  const propertyData = props.propertyData;
  const index = props.index;
  const isDesktop = props.isDesktop;
  const navigate = useNavigate();

  console.log("BUSINESS Locations - ", obj.business_locations);
  let location1 = "";
  if(obj.business_locations !== null && obj.business_locations.length > 2){
    console.log("Valid business location");
    location1 = JSON.parse(obj.business_locations);
  }  
  let city = "";
  if(location1.length > 0){
    city = (location1[0]!==undefined && location1[0]!==null) ? location1[0]?.location : "";
  }  
  let distance = location1[0]!==undefined ? location1[0]?.distance : "";
  let feesArray = JSON.parse(obj.business_services_fees);

  const handleRequestQuotes = async (obj) => {
    console.log('---handle request quotes---', propertyData, index);

    navigate("/requestQuotes",{
      state:{
        managerData: obj,
        propertyData: propertyData,
        index: index,
        isDesktop: isDesktop,
      }
    }
    );    
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px",
        fontSize: "13px",
      }}
    >
        <Grid container>
            <Grid item xs={8}>
                <Box
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    <Typography>{obj.business_name}</Typography>
                </Box>
                <Box>
                    <Typography>
                        Area of service: {city} +-{" "}{distance} miles
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            background: "#3D5CAC",
                            color: theme.palette.background.default,
                            borderRadius: "10px 10px 10px 10px",
                        }}
                        onClick={() => handleRequestQuotes(obj)}
                    >
                        Request Quote
                    </Button>
                </Box>
            </Grid>
        </Grid>
        <Box sx={{paddingTop: "10px", paddingBottom: "10px"}}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>
                        Estimated Fees
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {feesArray && feesArray.map((fee) =>{
                        return( <FeesTextCard fee={fee}/>)
                    })}
                </AccordionDetails>
            </Accordion>
        </Box>
    </Box>
  );
}

function FeesTextCard(props) {
    let fee = props.fee;
    return(
        <Typography>
            {fee.fee_name}:{fee.charge}{fee.fee_type}
        </Typography>
    )
}

export default SearchManager;
