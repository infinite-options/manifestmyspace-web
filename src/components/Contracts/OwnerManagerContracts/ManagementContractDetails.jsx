import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
// import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import {
  ThemeProvider,
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import theme from "../../../theme/theme";
import CircularProgress from "@mui/material/CircularProgress";

import PropertyCard from "./PropertyCard";

import { isValidDate } from "../../../utils/dates";

function ManagementContractDetails(props) {
  const { getProfileId } = useUser();
  const navigate = useNavigate();

  const { state } = useLocation();
  const {
    contract_uid,
    contract_business_id,
    contract_property_id,
    property_endpoint_resp,
  } = state;

  const [contractUID, setContractUID] = useState(null);

  const [contractPropertyID, setContractPropertyID] = useState(null);

  const [showSpinner, setShowSpinner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [propertiesData, setPropertiesData] = useState([]);
  const [filteredPropertiesData, setFilteredPropertiesData] = useState([]); // filter out the properties that aren't included in announcement_properties

  const [index, setIndex] = useState(0);
  const [timeDiff, setTimeDiff] = useState(null);

  useEffect(() => {
    console.log("Management Contract Details UseEffect");

    const fetchData = async () => {
      setShowSpinner(true);

      setContractUID(contract_uid);

      const properties = property_endpoint_resp["NewPMRequests"]["result"]
        ? property_endpoint_resp["NewPMRequests"]["result"]
        : [];
      console.log("PROPERTIES", properties);
      setPropertiesData(properties);

      const filteredProperties = properties.filter(
        (property) => property.property_uid === contract_property_id
      );
      console.log("FILTERED PROPERTIES", filteredProperties);
      setFilteredPropertiesData(filteredProperties);

      // console.log("FILTERED PROPERTIES DATA", filteredProperties);

      // setContractPropertyID(filteredProperties[0]["property_uid"]);
      setContractPropertyID(contract_property_id);

      setIsLoading(false);
      setShowSpinner(false);
    };
    const calculateTimeDiff = () => {
      const announcement_date = new Date();
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
        durationString = `${days} days ago`;
      } else if (hours > 0) {
        durationString = `${hours} hours ago`;
      } else if (minutes > 0) {
        durationString = `${minutes} minutes ago`;
      } else {
        durationString = `${seconds} seconds ago`;
      }

      // console.log(now, announcement_date, announcementData["announcement_date"], durationString, seconds, minutes, hours, days);
      return durationString;
    };
    fetchData();
    setTimeDiff(calculateTimeDiff());
  }, []);

  const handleBackBtn = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
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
          backgroundColor: "#F2F2F2",
          borderRadius: "10px",
          margin: "25px",
          padding: "15px",
          fontFamily: "Source Sans Pro",
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            sx={{ padding: "0", minWidth: "150px" }}
            onClick={handleBackBtn}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                fill="#3D5CAC"
              />
            </svg>
          </Button>
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "text.darkblue",
              padding: "0",
              minWidth: "300px",
            }}
          >
            Management Contract
          </Box>
        </Stack>
        <Box
          flexDirection="row"
          alignItems="center"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Box
            onClick={() => {
              console.log("Previous button clicked. INDEX - ", index);
              index > 0
                ? setIndex(index - 1)
                : setIndex(filteredPropertiesData.length - 1);
            }}
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="#160449"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z" />
            </svg>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              {index + 1} of {filteredPropertiesData.length} Properties
              {/* {contactsTab} */}
            </Typography>
          </Box>
          <Box
            onClick={() => {
              console.log("Next button clicked. INDEX - ", index);
              index < filteredPropertiesData.length - 1
                ? setIndex(index + 1)
                : setIndex(0);
            }}
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="#160449"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z" />
            </svg>
          </Box>
        </Box>
        <PropertyCard
          data={
            filteredPropertiesData[index] ? filteredPropertiesData[index] : []
          }
          timeDifference={timeDiff}
          contractUID={contractUID}
          contractBusinessID={getProfileId()}
          contractPropertyID={contractPropertyID}
        />
      </Box>
    </ThemeProvider>
  );
}

export default ManagementContractDetails;
