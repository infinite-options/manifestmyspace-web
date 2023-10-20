import { Box, ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReturnArrow from "../../images/refund_back.png";
import ArrowDown from "../../images/ArrowDown.png";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Button, TextField, InputAdornment } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as SearchIcon } from "../../images/search.svg";
import { objToQueryString } from "../utils/helper";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const SearchManager = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState();

  const { getProfileId } = useUser();
  const [ownerId, setOwnerId] = useState(getProfileId());

  const handleSearch = async () => {
    const url =
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile";
    const args = {
      business_type: "MANAGEMENT",
    };
    if (searchTerm) args.business_name = searchTerm;
    const response = await axios.get(url + objToQueryString(args));
    setManagers(response.data.result);
  };
  useEffect(() => {
    handleSearch();
  }, []);

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
                <img src={ReturnArrow} alt="back" />
                <Box>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.primary.fontWeight,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(-1)}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                        <SearchIcon onClick={handleSearch} />
                      </InputAdornment>
                    ),
                  }}
                />
                {managers.map((m) => (
                  <DocumentCard data={m} ownerId={ownerId} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

function DocumentCard(props) {
  const obj = props.data;
  const ownerId = props.ownerId;

//  console.log("Business Profile "+JSON.stringify(obj))

  let location1 = JSON.parse(obj.business_locations);
  let city = location1[0]!==undefined ? location1[0].location : "";
  let distance = location1[0]!==undefined ? location1[0].distance : "";
  let feesArray = JSON.parse(obj.business_services_fees);

  const handleRequestQuotes = async () => {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    let data = JSON.stringify({

      "announcement_title":"New PM Request",
      "announcement_msg":"PM Quote Requested", 
      "announcement_sender":ownerId,
      "announcement_date":formattedDate,
      "announcement_properties":"",
      "announcement_mode":"",
      "announcement_receiver":" ", 
      "announcement_type":"PM Request",
      "Email":0, "Text":0, "App":1,
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
    
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        padding: "5px",
        marginBottom: "10px",
        fontSize: "13px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
          }}
        >
          <Typography>{obj.business_name}</Typography>
        </Box>
      </Box>
      <Box></Box>
      <Box
        sx={{
          display: "grid",
        }}
      >
        <Box>
          <Typography>
           Area of service: {city} +-{" "}{distance} miles
          </Typography>
        </Box>
        <Box>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
      
          <Typography sx={{
              textTransform: "none",
              width: `40%`,
              height: `5%`,
              left: `15%`,
              top: `10%`,
            }} >Estimated Fees</Typography>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: `40%`,
              height: `5%`,
              left: `15%`,
              top: `10%`,
              borderRadius: "10px 10px 10px 10px",
            }}
            onClick={handleRequestQuotes}
          >
            Request Quote
          </Button>
        
        </AccordionSummary>
            <AccordionDetails>
                {feesArray.map((fee) =>{
                  return( <FeesTextCard fee={fee}/>)
                })}
              </AccordionDetails>
        </Accordion>
        </Box>
        <Box></Box>
      </Box>
    </Box>
  );
}

function FeesTextCard(props) {

  let fee = props.fee;
 return(<Typography>{fee.fee_name}:{fee.charge}{fee.fee_type}</Typography>)
}

export default SearchManager;
