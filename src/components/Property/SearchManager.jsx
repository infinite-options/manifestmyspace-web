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
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

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
  const [showSpinner, setShowSpinner] = useState(false);
  const handleSearch = async () => {
    setShowSpinner(true);
    const url =
      "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/searchManager";
    const args = {};
    if (searchTerm) args.business_name = searchTerm;
    const response = await axios.get(url + objToQueryString(args));
    setManagers(response.data.result);
    setShowSpinner(false);
  };
  useEffect(() => {
    handleSearch();
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
                  <DocumentCard data={m} />
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
          {obj.business_name}
        </Box>
      </Box>
      <Box></Box>
      <Box
        sx={{
          display: "grid",
        }}
      >
        <Box>
          Area of service: {obj.business_locations[0].location} +-{" "}
          {obj.business_locations[0].distance} miles
        </Box>
        <Box>
          <Button
            sx={{
              textTransform: "none",
              color: "#160449",
              width: `45%`,
              height: `85%`,
              left: `1%`,
              right: `1%`,
              top: `10%`,
              fontSize: `11px`,
            }}
          >
            <div>
              <img src={ArrowDown} alt="down" />
              Estimated Fees
            </div>
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: `40%`,
              height: `85%`,
              left: `15%`,
              top: `10%`,
              borderRadius: "10px 10px 10px 10px",
              fontSize: `10px`,
            }}
          >
            Request Quote
          </Button>
        </Box>
        <Box></Box>
      </Box>
    </Box>
  );
}

export default SearchManager;
