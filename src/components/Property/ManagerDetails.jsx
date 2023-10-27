import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import ReturnArrow from "../../images/refund_back.png";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Box, Avatar, Grid } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../images/search.svg";
import EmailIcon from "./messageIconDark.png";
import PhoneIcon from "./phoneIconDark.png";
import AddressIcon from "./addressIconDark.png";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

const ManagerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ownerId, managerBusinessId } = location.state;
  const [showSpinner, setShowSpinner] = useState(false);
  const [properties, setProperties] = useState([
    {
      business_name: "",
      business_address: "",
      business_city: "",
      business_state: "",
      business_zip: "",
      business_photo_url: "",
      business_phone_number: "",
      business_email: "",
    },
  ]);
  const fetchManagerProperties = async () => {
    setShowSpinner(true);
    const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByManager/${ownerId}/${managerBusinessId}`;
    const response = await axios.get(url);
    setProperties(response.data.result);
    setShowSpinner(false);
  };
  useEffect(() => {
    fetchManagerProperties();
  }, []);

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
          padding: "25px",
          paddingLeft: "30px",
          paddingRight: "30px",
          backgroundColor: "background.gray",
          borderRadius: "10px",
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
              color: "text.darkblue",
            }}
          >
            <Typography
              sx={{ flex: 1, textAlign: "center", paddingLeft: "22px" }}
            >
              {"Property Manager"}
            </Typography>
            <SearchIcon onClick={() => navigate("/searchManager")} />
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
                  {"Return to viewing Property"}
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
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                padding: "13px",
                backgroundColor: "#3D5CAC",
                flex: 1,
                position: "relative",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Typography
                align="center"
                sx={{
                  fontSize: "15px",
                  fontFamily: "Source Sans 3, sans-serif",
                  margin: "0 18px",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  marginTop: "30px",
                  marginBottom: "30px",
                }}
              >
                {properties[0] && properties[0].business_name}
              </Typography>
              <Avatar
                src={properties[0].business_photo_url}
                sx={{
                  width: "60px",
                  height: "60px",
                  position: "absolute",
                  bottom: "-30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </Box>
            <Box
              sx={{
                backgroundColor: "#D6D5DA",
                flex: 3,
                border: "0 0 10px 10px",
                paddingTop: "35px",
              }}
            >
              <Grid container>
                <Grid item xs={1}>
                  <img src={EmailIcon} alt="email" />
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      paddingLeft: "10px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      color: "#160449",
                    }}
                  >
                    {properties[0].business_email}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontFamily: "Source Sans Pro, sans-serif",
                      fontWeight: 800,
                      color: "#160449",
                    }}
                  >
                    {"Manager since:"}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <img src={PhoneIcon} alt="phone" />
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      paddingLeft: "10px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      color: "#160449",
                    }}
                  >
                    {properties[0].business_phone_number}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      paddingLeft: "10px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      color: "#160449",
                    }}
                  >
                    {"TBD"}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <img src={AddressIcon} alt="address" />
                </Grid>
                <Grid item xs={11}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      paddingLeft: "10px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      color: "#160449",
                    }}
                  >{`${properties[0].business_address}, ${properties[0].business_city}, ${properties[0].business_state} ${properties[0].business_zip}`}</Typography>
                </Grid>
              </Grid>

              <Typography
                sx={{
                  paddingLeft: "10px",
                  fontFamily: "Source Sans Pro, sans-serif",
                  fontWeight: 800,
                  color: "#160449",
                }}
              >{`Manages ${properties.length} of your properties`}</Typography>
              {properties.map((p) => (
                <>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      paddingLeft: "10px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      color: "#160449",
                    }}
                  >
                    {p.contract_status}
                  </Typography>
                  <Typography
                    sx={{
                      paddingLeft: "15px",
                      fontFamily: "Source Sans Pro, sans-serif",
                      fontWeight: 600,
                      color: "#160449",
                      textDecoration: "underline",
                    }}
                  >{`${p.property_address}, ${p.property_city}, ${p.property_state} ${p.property_zip}`}</Typography>
                </>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerDetails;
