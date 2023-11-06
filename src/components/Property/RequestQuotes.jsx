import { Box, ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Button, Checkbox, Grid, TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../../contexts/UserContext";

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

  const { getProfileId } = useUser();
  const profileId = getProfileId();
  const [ownerId, setOwnerId] = useState(getProfileId());
  
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${profileId}`)
      const propertyData = await response.json();
      setProperties([...propertyData["Property"].result]);
    };
    fetchData();
  }, []);

  const [selectedProperty, setSelectedProperty] = useState("");

  const handlePropertyCheck = (event) => {
    setSelectedProperty(event.target.name);
  };

  const handleRequestQuotes = async () => {


    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

   
    let announcement_data = JSON.stringify({

      "announcement_title":announcementTitle,
      "announcement_msg":announcementMsg, 
      "announcement_sender":ownerId,
      "announcement_date":formattedDate,
      "announcement_properties":[selectedProperty],
      "announcement_mode":"CONTRACT",
      "announcement_receiver":[managerData.business_uid],
      "announcement_type":["App"],
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/'+ownerId,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : announcement_data
    };

    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });


    const formData = new FormData();
    formData.append("contract_property_id", selectedProperty)
    formData.append("contract_business_id", managerData.business_uid)
    formData.append("contract_start_date", formattedDate)
    formData.append("contract_status", "NEW")


    const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts`; 

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else{
            console.log("Data added successfully");
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

      navigate("/managerDetails",{ state: 
        {   ownerId: ownerId, 
            managerBusinessId: managerData.business_uid
        }});
  
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
                {"Search For Property"}
              </Box>
            </Box>
        

            <Box
              sx={{
                position: "relative",
                backgroundColor: "background.gray",
                paddingBottom:"5%"
                }}
            > <Box
            sx={{
              padding: "13px",
              backgroundColor: "#D6D5DA",
              borderRadius: "10px",
              justifyContent: "center",
            }}
          >
              <Grid container columnSpacing={12} rowSpacing={6}>
                <Grid item xs={12}>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                  Title</Typography>
                  <TextField fullWidth
                  sx={{
                      backgroundColor: 'white',
                      borderColor: 'black',
                      borderRadius: '7px',
                  }}
                  size="small"  multiline={true} onChange={handleTitleChange}/>
                  </Grid>
                  <Grid item xs={12}>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                  Message</Typography>
                  <TextField fullWidth
                  sx={{
                      backgroundColor: 'white',
                      borderColor: 'black',
                      borderRadius: '7px',
                  }}
                  size="small"  multiline={true} onChange={handleMsgChange}/>
                  </Grid>
                  {/* <Grid item xs={12}>

                  </Grid> */}
              </Grid>
              </Box>

              <div style={{height: "195px", overflow: "auto"}}>
              <Box
                sx={{
                  padding: "13px",
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                  justifyContent: "center",
                  
                }}
              >
                {properties.map((property) => (

                    <div>
                        <Box
                    sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        padding: "5px",
                        marginBottom: "10px",
                        fontSize: "13px",
                        display: "flex",
                    }}>     
                    <Checkbox sx={{ color: theme.typography.common.blue }} name={property.property_uid} onChange={handlePropertyCheck} />  
                    <Typography sx={{paddingTop:"2%"}}>
                    {/* { propertyDisplayValue =   property.property_address+" "+property.property_city+" "+property.property_state+" "+property.property_zip+" #"+property.property_unit}  */}
                    { propertyDisplayValue =   property.property_address+" #"+property.property_unit} 

                    </Typography>
                    </Box></div>
                
                ))}
              </Box>
              </div>
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
           onClick={handleRequestQuotes}>
            Request Quote
          </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RequestQuotes;
