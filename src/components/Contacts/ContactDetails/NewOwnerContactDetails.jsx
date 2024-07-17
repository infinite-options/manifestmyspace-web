import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import axios from "axios";
import APIConfig from "../../../utils/APIConfig";
import User_fill from "../../../images/User_fill_dark.png";
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
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../../theme/theme";
import SearchIcon from "@mui/icons-material/Search";
import HappinessMatrixWidget from "../../Dashboard-Components/HappinessMatrix/HappinessMatrixWidget";
import CommentIcon from "@mui/icons-material/Comment";
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";
import maintenanceIcon from "../../Property/maintenanceIcon.png";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";
import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import useMediaQuery from "@mui/material/useMediaQuery";

const NewOwnerContactDetails = (props) => {
  console.log("In NewOwnerContactDetails");

  const location = useLocation();
  const { selectedRole, getProfileId } = useUser();
  const [contactDetails, setContactDetails] = useState([]);
  const [index, setIndex] = useState(location.state.index);

  const navigatingFrom = location.state.navigatingFrom;
  const ownerUID = location.state.ownerUID;
  //   const index = location.state.index;
  const happinessData = location.state.happinessData;
  const happinessMatrixData = location.state.happinessMatrixData;

  console.log("navigatingFrom: ", navigatingFrom);
  console.log("ownerUID: ", ownerUID);
  console.log("index: ", index);
  console.log("happinessData: ", happinessData);
  console.log("In happinessMatrixData: ", happinessMatrixData);

  //   const getDataFromAPI = async () => {
  //     // if (propertyList?.length > 0) {
  //     //     return;
  //     // }

  //     // const propertiesResponse = await fetch(`${APIConfig.baseURL.dev}/properties/600-000003`);
  //     const resp = await fetch(`${APIConfig.baseURL.dev}/contacts/${getProfileId()}`);
  //     try {
  //       const contactData = await resp.json();
  //       // console.log("PropertyRentWidget - propertyData - ", propertyData);
  //       // setPropertiesList(propertiesResponseJSON.Property.result);

  //       const data = contactData["management_contacts"];
  //       //         const ownerContacts = data["owners"];

  //       const contactList = data["owners"];
  //       console.log("In Contact List >> Property List: ", contactList);
  //       // console.log("Testing Property Data", propertyData.Property.result);

  //       await setContactDetails(...contactList);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  useEffect(() => {
    const getDataFromAPI = async () => {
      // if (propertyList?.length > 0) {
      //     return;
      // }

      // const propertiesResponse = await fetch(`${APIConfig.baseURL.dev}/properties/600-000003`);
      const resp = await fetch(`${APIConfig.baseURL.dev}/contacts/${getProfileId()}`);
      try {
        const contactData = await resp.json();
        // console.log("PropertyRentWidget - propertyData - ", propertyData);
        // setPropertiesList(propertiesResponseJSON.Property.result);

        const data = contactData["management_contacts"];
        //         const ownerContacts = data["owners"];

        const contactList = data["owners"];
        console.log("In Contact List >> Property List: ", contactList);
        // console.log("Testing Property Data", propertyData.Property.result);

        await setContactDetails(contactList);
        console.log("Contact Data - from owner 2 ", contactDetails);
      } catch (error) {
        console.error(error);
      }
    };
    console.log("Contact Data - from owner 1 ", contactDetails);
    getDataFromAPI();
    console.log("Contact Data - from owner 3 ", contactDetails);
  }, [contactDetails]);

  //   const getDataFromAPI = async () => {
  //     // const url = `http://localhost:4000/contacts/${getProfileId()}`;
  //     console.log("Calling contacts endpoint");
  //     const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
  //     // setShowSpinner(true);

  //     await axios
  //       .get(url)
  //       .then((resp) => {
  //         const data = resp.data["management_contacts"];
  //         const ownerContacts = data["owners"];
  //         console.log("After Endpoint Call", ownerContacts);
  //         setContactDetails(ownerContacts);
  //         // const index = ownerContacts.findIndex((contact) => contact.owner_uid === ownerUID);
  //         // console.log("Owner Index: ", index);
  //         // setIndex(index);

  //         // setAllTenantsData(data["tenants"]);
  //         // setAllMaintenanceData(data["maintenance"]);

  //         // setShowSpinner(false);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //         // setShowSpinner(false);
  //       });
  //   };

  //     useEffect(() => {
  //         getDataFromAPI();
  //         console.log("Contact Data - from owner ", contactDetails);
  //     }, []);

  // useEffect(() => {
  //     getDataFromAPI();
  // }, []);

  //   getDataFromAPI();
};

export default NewOwnerContactDetails;
