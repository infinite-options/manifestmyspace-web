import { Box, ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Button, Checkbox } from "@mui/material";
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

      "announcement_title":"New PM Request",
      "announcement_msg":"PM Quote Requested", 
      "announcement_sender":ownerId,
      "announcement_date":formattedDate,
      "announcement_properties":selectedProperty,
      "announcement_mode":"NEW",
      "announcement_receiver":managerData.business_uid, 
      "announcement_type":"PM Request",
      "Email":0, "Text":0, "App":1,
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

    let contract_data = JSON.stringify({
        "contract_property_id":selectedProperty,
        "contract_business_id": managerData.business_uid,
        "contract_start_date": formattedDate,
        "contract_status":"NEW"
      });  

    let config_contract = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : contract_data
      };
  
    
      axios.request(config_contract)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

      navigate("/managerDetails",{ state: 
        {   ownerId: ownerId, 
            managerBusinessId: managerData.business_uid
        }});
  
  };

  let propertyDisplayValue = "";

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
                    { propertyDisplayValue =   property.property_unit+" "+property.property_address+" "+property.property_city+" "+property.property_state+" "+property.property_zip} 
                    </Typography>
                    </Box></div>
                
                ))}
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
