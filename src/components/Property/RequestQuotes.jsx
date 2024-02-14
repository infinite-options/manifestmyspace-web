import { Box, ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Button, Checkbox, Grid, TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../../contexts/UserContext";
import ReturnArrow from "../../images/refund_back.png";

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

const RequestQuotes = () => { 
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const location = useLocation();
  const managerData = location.state.managerData;
  const propertyData = location.state.propertyData;
  const index = location.state.index;

  const requestingPropertyId = propertyData[index].property_uid;

  const { getProfileId } = useUser();
  const profileId = getProfileId();
  const [ownerId, setOwnerId] = useState(getProfileId());
  
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${profileId}`);
      const propertyData = await response.json();
      setProperties([...propertyData["Property"].result]);
    };
    fetchData();
  }, []);

  const [selectedProperties, setSelectedProperties] = useState([requestingPropertyId]); // Set initial value to requestingPropertyId

  const handlePropertyCheck = (event) => {
    const checkedProperty = event.target.name;
    if (selectedProperties.length === 1 && selectedProperties.includes(checkedProperty)) {
      // Do not allow unchecking if it's the only selected property
      return;
    }

    if (selectedProperties.includes(checkedProperty)) {
      setSelectedProperties(selectedProperties.filter(property => property !== checkedProperty));
    } else {
      setSelectedProperties([...selectedProperties, checkedProperty]);
    }
  };

  const determineChecked = (property) => {
    return selectedProperties.includes(property.property_uid);
  };

  const handleRequestQuotes = async () => {
    // Check if at least one property is selected
    if (selectedProperties.length === 0) {
      alert("Please select at least one property.");
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
   
    let announcement_data = JSON.stringify({
      "announcement_title": announcementTitle,
      "announcement_msg": announcementMsg, 
      "announcement_sender": ownerId,
      "announcement_date": formattedDate,
      "announcement_properties": selectedProperties,
      "announcement_mode": "CONTRACT",
      "announcement_receiver": [managerData.business_uid],
      "announcement_type": ["App"],
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${ownerId}`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: announcement_data
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }


    // Prepare form data for contracts endpoint
    const formData = new FormData();

    // Stringify the array and append it as a single value
    formData.append("contract_property_ids", JSON.stringify(selectedProperties)); 

    // Append other required fields
    formData.append("contract_business_id", managerData.business_uid);
    formData.append("contract_start_date", formattedDate);
    formData.append("contract_status", "NEW");


    const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts`; 
    // const url = `http://localhost:4000/contracts`; 

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("Data added successfully");
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }

    navigate("/propertyDetail", { 
      state: {
        propertyList: propertyData,
        index: index,
      }
    });
  };

  let propertyDisplayValue = "";

  const handleTitleChange = (event) => {
    setAnnouncementTitle(event.target.value);
  };

  const handleMsgChange = (event) => {
    setAnnouncementMsg(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
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
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: "5px",
                }}
                onClick={() => navigate(-1)}
              >
                <img src={ReturnArrow} style={{ verticalAlign: 'middle', paddingRight: "5px" }}  alt="back" />
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    cursor: "pointer",
                  }}
                >
                  {"Back"}
                </Typography>
              </Box>
            </Box>
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
                Send a Quote Request to <u>{managerData.business_name}</u>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                backgroundColor: "background.gray",
                paddingBottom: "5%"
              }}
            > 
              <Box
                sx={{
                  padding: "13px",
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                  justifyContent: "center",
                }}
              >
                <Grid container columnSpacing={12} rowSpacing={6}>
                  <Grid item xs={12}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont}}>
                      Title
                    </Typography>
                    <TextField 
                      fullWidth
                      sx={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        borderRadius: '7px',
                      }}
                      size="small"  
                      multiline={true} 
                      onChange={handleTitleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont}}>
                      Message
                    </Typography>
                    <TextField 
                      fullWidth
                      sx={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        borderRadius: '7px',
                      }}
                      size="small"  
                      multiline={true} 
                      onChange={handleMsgChange}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{padding: '10px'}}></Box>
              <Box 
                sx={{
                  height: "195px", 
                  overflow: "auto",
                  paddingBottom: '20px'
                }}
              >
                <Box
                  sx={{
                    padding: "15px",
                    backgroundColor: "#D6D5DA",
                    borderRadius: "10px",
                    justifyContent: "center",
                    marginBottom: '20px',
                  }}
                >
                  {properties.map((property) => (
                    <Box 
                      key={property.property_uid} 
                      sx={{ paddingBottom: "10px" }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "10px",
                          padding: "5px",
                          fontSize: "13px",
                          display: "flex",
                        }}
                      >     
                        <Checkbox 
                          sx={{ color: theme.typography.common.blue }} 
                          name={property.property_uid} 
                          onChange={handlePropertyCheck} 
                          checked={determineChecked(property)}
                        />  
                        <Typography sx={{paddingTop:"2%"}}>
                          {propertyDisplayValue =   property.property_address + " #" + property.property_unit} 
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: `40%`,
                height: `5%`,
                left: `30%`,
                top: `30%`,
                borderRadius: "10px 10px 10px 10px",
              }}
              onClick={handleRequestQuotes}
              disabled={selectedProperties.length === 0} // Disable button when no property is selected
            >
              Request Quote
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RequestQuotes;
