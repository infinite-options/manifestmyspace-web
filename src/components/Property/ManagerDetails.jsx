import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { useState, useEffect } from "react";
import ReturnArrow from "../../images/refund_back.png";
import theme from "../../theme/theme";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../images/search.svg";

const ManagerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ownerId, managerBusinessId } = location.state;
  const [properties, setProperties] = useState([]);
  const fetchManagerProperties = async () => {
    const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByManager/${ownerId}/${managerBusinessId}`;
    const response = await axios.get(url);
    setProperties(response.data.result);
  };
  useEffect(() => {
    fetchManagerProperties();
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
                color: "text.darkblue",
              }}
            >
              <Typography
                sx={{ flex: 1, textAlign: "center", paddingLeft: "22px" }}
              >
                {"Property Manager"}
              </Typography>
              <SearchIcon />
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
              }}
            >
              <Box
                sx={{
                  padding: "13px",
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                }}
              >
                <Typography>{`Manages ${properties.length} of your properties`}</Typography>
                {properties.map((p) => (
                  <Typography>{`${p.property_address}, ${p.property_city}, ${p.property_state} ${p.property_zip}`}</Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerDetails;
