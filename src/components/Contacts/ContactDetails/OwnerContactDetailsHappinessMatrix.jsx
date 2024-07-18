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

const OwnerContactDetailsHappinessMatrix = (props) => {
  console.log("In Owner Contact Details - Happiness Matrix", props);
  const { selectedRole, getProfileId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigatingFrom = location.state.navigatingFrom;
  const happinessData = location.state?.happinessData;

  const [contactDetails, setContactDetails] = useState();
  const [contactsTab, setContactsTab] = useState("");

  const [index, setIndex] = useState(location.state.index);
  const ownerUID = location.state.ownerUID;

  const cashflowData = location.state?.cashflowData;
  const [filteredCashflowData, setFilteredCashflowData] = useState(cashflowData);
  const cashflowDetails = happinessData?.delta_cashflow_details?.result;
  const cashflowDetailsByProperty = happinessData?.delta_cashflow_details_by_property?.result;
  const cashflowDetailsByPropertyByMonth = happinessData?.delta_cashflow_details_by_property_by_month?.result;
  const [filteredCashflowDetails, setFilteredCashflowDetails] = useState(cashflowDetails);
  const [filteredCashflowDetailsByProperty, setFilteredCashflowDetailsByProperty] = useState(cashflowDetailsByProperty);
  const [filteredCashflowDetailsByPropertyByMonth, setFilteredCashflowDetailsByPropertyByMonth] = useState(cashflowDetailsByPropertyByMonth);

  const [happinessMatrixData, setHappinessMatrixData] = useState([]);
  let [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    if (location.state?.happinessMatrixData) {
      try {
        setHappinessMatrixData(setting_matrix_data(location.state?.happinessMatrixData));
      } catch (error) {
        console.error("Error in setting_matrix_data:", error);
      }
    }
  }, []);

  // useEffect(() => {
  //   console.log("filteredCashflowDetails - ", filteredCashflowDetails);
  // }, [filteredCashflowDetails]);

  // useEffect(() => {
  //   console.log("filteredCashflowDetailsByProperty", filteredCashflowDetailsByProperty)
  // }, [filteredCashflowDetailsByProperty]);

  // useEffect(() => {
  //   console.log("filteredCashflowDetailsByPropertyByMonth", filteredCashflowDetailsByPropertyByMonth)
  // }, [filteredCashflowDetailsByPropertyByMonth]);

  useEffect(() => {
    const getDataFromAPI = async () => {
      // const url = `http://localhost:4000/contacts/${getProfileId()}`;
      console.log("Calling contacts endpoint");
      const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
  
      await axios
        .get(url)
        .then((resp) => {
          const data = resp.data["management_contacts"];
          const ownerContacts = data["owners"];
          console.log("Owner Contact info in OwnerContactDetailsHappinessMatrix", ownerContacts);
          setContactDetails(ownerContacts);
          console.log("Set Contact Details 1", ownerContacts);
          const index = ownerContacts.findIndex((contact) => contact.owner_uid === ownerUID);
          console.log("Owner Index: ", index);
          setIndex(index);
        })
        .catch((e) => {
          console.error(e);
        });
    };

    if (navigatingFrom === "HappinessMatrixWidget" || navigatingFrom == "PropertyNavigator") {
      getDataFromAPI();
      setContactsTab("Owner");
    } else if (navigatingFrom === "PMContacts") {
      setContactDetails(location.state.dataDetails);
      console.log("Set Contact Details 2");
      setContactsTab(location.state.tab);
    }
  }, []);

  useEffect(() => {
    if (contactDetails) {
    setFilteredCashflowDetails(contactDetails != null ? cashflowDetails.filter((item) => item.owner_uid === contactDetails[index]?.owner_uid) : []);
    setFilteredCashflowDetailsByProperty(contactDetails != null ? cashflowDetailsByProperty.filter((item) => item.owner_uid === contactDetails[index]?.owner_uid) : []);
    setFilteredCashflowDetailsByPropertyByMonth(
      contactDetails != null ? cashflowDetailsByPropertyByMonth.filter((item) => item.owner_uid === contactDetails[index]?.owner_uid) : []
    );
    setFilteredCashflowData(contactDetails != null ? cashflowData.filter((item) => item.owner_uid === contactDetails[index]?.owner_uid) : []);
  }
  }, [index]);

  const setting_matrix_data = (happiness_response) => {
    console.log("setting_matrix_data - happiness_response - ", happiness_response);
    console.log("NAVIGATING FROM", navigatingFrom);
    
    return happiness_response.HappinessMatrix.vacancy.result.map((vacancyItem, i) => {
      const deltaCashflowItem = happiness_response.HappinessMatrix.delta_cashflow.result.find((item) => item.owner_uid === vacancyItem.owner_uid);
      let fullName = "";
      let ownerUID = "";
      let percent_delta_cashflow = 0;
      let owner_photo_url = "";
      let cashflow = 0;
      let expected_cashflow = 0;
      let actual_cashflow = 0;

      if (deltaCashflowItem) {
        fullName = `${deltaCashflowItem.owner_first_name} ${deltaCashflowItem.owner_last_name}`;
        ownerUID = deltaCashflowItem.owner_uid;
        percent_delta_cashflow = deltaCashflowItem.percent_delta_cashflow;
        owner_photo_url = deltaCashflowItem.owner_photo_url;
        cashflow = deltaCashflowItem.cashflow;
        expected_cashflow = deltaCashflowItem.expected_cashflow;
        actual_cashflow = deltaCashflowItem.actual_cashflow;
      }

      let quarter;
      let vacancy_perc = parseFloat(vacancyItem.vacancy_perc);
      let delta_cf_perc = -1 * parseFloat(percent_delta_cashflow);

      if (delta_cf_perc > -0.5 && vacancy_perc > -50) {
        quarter = 1;
      } else if (delta_cf_perc < -0.5 && vacancy_perc > -50) {
        quarter = 2;
      } else if (delta_cf_perc < -0.5 && vacancy_perc < -50) {
        quarter = 3;
      } else if (delta_cf_perc > -0.5 && vacancy_perc < -50) {
        quarter = 4;
      }

      let borderColor;
      switch (quarter) {
        case 1:
          borderColor = "#006400"; // Green
          break;
        case 2:
          borderColor = "#FF8A00"; // Orange color
          break;
        case 3:
          borderColor = "#D22B2B"; // Red color
          break;
        case 4:
          borderColor = "#FFC85C"; // Yellow color
          break;
        default:
          borderColor = "#000000"; // Black color
      }

      return {
        owner_uid: ownerUID,
        name: fullName.trim(),
        photo: owner_photo_url,
        vacancy_perc: parseFloat(vacancyItem.vacancy_perc).toFixed(2),
        delta_cashflow_perc: percent_delta_cashflow || 0,
        vacancy_num: vacancyItem.vacancy_num || 0,
        cashflow: cashflow || 0,
        expected_cashflow: expected_cashflow || 0,
        actual_cashflow: actual_cashflow || 0,
        delta_cashflow: actual_cashflow - expected_cashflow,
        index: i,
        color: borderColor,
        total_properties: vacancyItem.total_properties || 0,
      };
    });
  };

  const handleBackBtn = () => {
    // navigate('/PMContacts');
    navigate(-1);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "50px", marginTop: "10px", backgroundColor: "#FFFFFF" }}>
          <Grid container columnSpacing={5} sx={{ marginTop: "10px" }}>
            {!isMobile && (
              <Grid container item xs={12} md={4} sx={{ padding: "10px", backgroundColor: theme.palette.primary.main, borderRadius: "10px" }}>
                <Grid item xs={12} sx={{ marginBottom: "10px" }}>
                  <Paper
                    elevation={0}
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#D6D5DA",
                      width: "100%",
                    }}
                  >
                    <HappinessMatrixWidget page={"OwnerContactDetails"} data={happinessMatrixData} happinessData={happinessData} setIndex={setIndex} contactDetails={contactDetails} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      width: "100%",
                    }}
                  >
                    <AllContacts data={contactDetails} currentIndex={index} setIndex={setIndex} />
                  </Paper>
                </Grid>
              </Grid>
            )}

            <Grid container item xs={12} md={8}>
              <OwnerContactDetail
                contactDetails={contactDetails}
                index={index}
                setIndex={setIndex}
                filteredCashflowDetails={filteredCashflowDetails}
                filteredCashflowDetailsByProperty={filteredCashflowDetailsByProperty}
                filteredCashflowDetailsByPropertyByMonth={filteredCashflowDetailsByPropertyByMonth}
              />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

const AllContacts = ({ data, currentIndex, setIndex }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactsData, setContactsData] = useState([]);
  const [filteredContactsData, setFilteredContactsData] = useState([]);

  useEffect(() => {
    const processedData = data?.map((contact) => {
      return {
        ...contact,
        entities: contact.entities != null ? JSON.parse(contact.entities) : [],
      };
    });
    console.log("AllContacts - processedData -", processedData);
    setContactsData(processedData);
    console.log("Set FilteredContactsData 1");
    setFilteredContactsData(processedData);
  }, [data]);

  useEffect(() => {
    const filteredValues = contactsData?.filter((item) => {
      return item.owner_first_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.owner_last_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    console.log("Set FilteredContactsData 2");
    setFilteredContactsData(filteredValues);
  }, [searchTerm]);

  return (
    <>
      <Container sx={{ padding: "5px" }}>
        <Grid container justifyContent="center" sx={{ padding: "10px 10px" }}>
          <Typography sx={{ fontSize: "35px", color: "#160449", fontWeight: "bold" }}>All Owner Contacts</Typography>
          <Grid container item xs={12} justifyContent="center">
            <TextField
              value={searchTerm}
              placeholder="Search Keyword"
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: "100%",
                marginBottom: "10px",
                "& input": {
                  height: "15px",
                  padding: "10px 14px",
                  borderRadius: "15px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#3D5CAC", fontSize: "1.5rem" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="center" sx={{ height: "380px", overflow: "auto" }}>
            {filteredContactsData?.map((contact, index) => {
              return (
                <Grid item xs={12} key={index} sx={{ marginBottom: "5px" }} onClick={() => setIndex(index)}>
                  <Paper
                    elevation={0}
                    style={{
                      borderRadius: "10px",
                      backgroundColor: index === currentIndex ? "#9EAED6" : "#D6D5DA",
                      width: "100%",
                    }}
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={11}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#160449",
                            fontSize: "20px",
                          }}
                        >
                          {contact?.owner_first_name + " " + contact.owner_last_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <CommentIcon sx={{ color: "#3D5CAC" }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ fontWeight: "600", color: "#160449", fontSize: "15px" }}>{`${contact?.PROPERTY_count} properties`}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: "#160449", fontSize: "15px" }}>{contact?.owner_email}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: "#160449", fontSize: "15px" }}>{contact?.owner_phone_number}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const OwnerContactDetail = ({ contactDetails, index, setIndex, filteredCashflowDetails, filteredCashflowDetailsByProperty, filteredCashflowDetailsByPropertyByMonth }) => {
  const { selectedRole, getProfileId } = useUser();
  const [propertiesData, setPropertiesData] = useState([]);
  const [contractsData, setContractsData] = useState([]);

  // const getPropertiesData = async () => {
  //   const url = `${APIConfig.baseURL.dev}/properties/${getProfileId()}`;

  //   await axios
  //     .get(url)
  //     .then((resp) => {
  //       const data = resp.data;
  //       setPropertiesData(data);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

  // const getContractsData = async () => {
  //   // const url = `http://localhost:4000/contracts/${getProfileId()}`;
  //   console.log("Calling contRacts endpoint");
  //   const url = `${APIConfig.baseURL.dev}/contracts/${getProfileId()}`;

  //   await axios
  //     .get(url)
  //     .then((resp) => {
  //       const data = resp.data?.result;
  //       setContractsData(data);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

  // // useEffect(() => {
  // //   getPropertiesData();
  // //   getContractsData();
  // // }, []);

  return (
    <Grid container sx={{ backgroundColor: theme.palette.primary.main, borderRadius: "10px", padding: "10px" }}>
      <Grid item xs={12} container justifyContent="center" sx={{ height: "50px" }}>
        <Typography sx={{ fontSize: "35px", fontWeight: "bold", color: "#160449" }}>Owner Contact</Typography>
      </Grid>
      <Grid item xs={12} container justifyContent="center">
        <Typography sx={{ fontSize: "20px", color: "#3D5CAC" }}>
          {index + 1} of {contactDetails?.length} Owners
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        direction="row"
        alignContent="space-between"
        sx={{ backgroundColor: "#3D5CAC", borderRadius: "10px", marginBottom: "10px", paddingTop: "5px", paddingBottom: "10px" }}
      >
        <Grid item xs={1}>
          <Box
            onClick={() => {
              console.log("Previous button clicked", index, contactDetails.length);
              index > 0 ? setIndex(index - 1) : setIndex(contactDetails.length - 1);
            }}
            sx={{
              paddingLeft: "10px",
            }}
          >
            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                fill={theme.typography.secondary.white}
              />
            </svg>
          </Box>
        </Grid>
        <Grid container direction="row" item xs={10}>
          <Grid item xs={12} container justifyContent="center">
            <Typography sx={{ fontSize: "25px", fontWeight: "bold", color: "#F2F2F2" }}>
              {`
                    ${contactDetails && contactDetails[index]?.owner_first_name ? contactDetails[index]?.owner_first_name : "<FIRST_NAME>"}
                    ${contactDetails && contactDetails[index]?.owner_last_name ? contactDetails[index]?.owner_last_name : "<LAST_NAME>"}
                  `}
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Box
              sx={{
                backgroundColor: "#A9A9A9",
                height: "68px",
                width: "68px",
                borderRadius: "68px",
                // marginTop: "-34px",
              }}
            >
              <img
                src={contactDetails && contactDetails[index]?.owner_photo_url ? contactDetails[index].owner_photo_url : User_fill}
                alt="profile placeholder"
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "68px",
                  margin: "4px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={1} container justifyContent="flex-end">
          <Box
            onClick={() => {
              console.log("Next button clicked");
              index < contactDetails.length - 1 ? setIndex(index + 1) : setIndex(0);
            }}
            sx={{
              paddingRight: "10px",
            }}
          >
            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                fill={theme.typography.secondary.white}
              />
            </svg>
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={12} columnSpacing={5} rowSpacing={5} sx={{ marginBottom: "10px" }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            style={{
              borderRadius: "10px",
              backgroundColor: "#D6D5DA",
              height: 370,
              padding: "10px",
            }}
          >
            <OwnerInformation contactDetails={contactDetails} index={index} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            style={{
              borderRadius: "10px",
              backgroundColor: "#D6D5DA",
              height: 390,
              width: "100%",
            }}
          >
            <PropertiesInformation
              propertiesData={propertiesData}
              contractsData={contractsData}
              ownerUID={contactDetails && index >= 0 && index < contactDetails.length ? contactDetails[index]?.owner_uid : null}
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container item xs={12} columnSpacing={10}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            style={{
              borderRadius: "10px",
              backgroundColor: "#D6D5DA",
              height: 355,
              width: "100%",
            }}
          >
            <CashflowDataGrid
              cashflowDetails={filteredCashflowDetails} //by month
              cashflowDetailsByProperty={filteredCashflowDetailsByProperty}
              cashflowDetailsByPropertyByMonth={filteredCashflowDetailsByPropertyByMonth}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

const OwnerInformation = ({ contactDetails, index }) => {
  console.log("In OwnerInformation: ", index, contactDetails);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (contactDetails) {
      setPaymentMethods(contactDetails[index]?.payment_method ? JSON.parse(contactDetails[index]?.payment_method) : []);
    }
  }, [contactDetails]);

  const formatPaymentMethodType = (type) => {
    return type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#160449", marginTop: "10px" }}>CONTACT INFORMATION</Typography>
      </Grid>
      <Grid container direction="row" item xs={12} alignContent="center">
        <img src={EmailIcon} alt="email" />
        <Typography sx={{ color: "#160449" }}>{contactDetails && contactDetails[index]?.owner_email}</Typography>
      </Grid>
      <Grid container direction="row" item xs={12} alignContent="center">
        <img src={PhoneIcon} alt="phone" />
        <Typography sx={{ color: "#160449" }}>{contactDetails && contactDetails[index]?.owner_phone_number}</Typography>
      </Grid>
      <Grid container direction="row" item xs={12} alignItems="center">
        <img src={AddressIcon} alt="address" />

        <Typography sx={{ color: "#160449" }}>
          {contactDetails &&
            contactDetails[index]?.owner_address + ", " + contactDetails[index]?.owner_city + ", " + contactDetails[index]?.owner_state + ", " + contactDetails[index]?.owner_zip}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "15px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#160449" }}>CONFIDENTIAL INFORMATION</Typography>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: "15px", fontWeight: "600", color: "#160449" }}>SSN</Typography>
          <Typography sx={{ fontSize: "15px", color: "#160449" }}>
            {contactDetails && contactDetails[index]?.owner_ssn ? maskSSN(contactDetails[index]?.owner_ssn) : "No SSN provided"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#160449", fontWeight: "600" }}>EIN</Typography>
          <Typography sx={{ fontSize: "15px", color: "#160449" }}>
            {contactDetails && contactDetails[index]?.owner_ein_number ? maskEIN(contactDetails[index]?.owner_ein_number) : "No EIN provided"}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "15px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#160449" }}>PAYMENT METHODS</Typography>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: "15px", fontWeight: "600", color: "#160449" }}>
            Active {`(${paymentMethods.filter((method) => method.paymentMethod_status === "Active").length})`}
          </Typography>
          {paymentMethods
            .filter((method) => method.paymentMethod_status === "Active")
            .map((method, index) => {
              return (
                <Typography key={index} sx={{ fontSize: "15px", color: "#160449" }}>
                  {formatPaymentMethodType(method.paymentMethod_type)}
                </Typography>
              );
            })}
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: "15px", color: "#160449", fontWeight: "600" }}>
            Inactive {`(${paymentMethods.filter((method) => method.paymentMethod_status === "Inactive").length})`}
          </Typography>
          {paymentMethods
            .filter((method) => method.paymentMethod_status === "Inactive")
            .map((method, index) => {
              return (
                <Typography key={index} sx={{ fontSize: "15px", color: "#160449" }}>
                  {formatPaymentMethodType(method.paymentMethod_type)}
                </Typography>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};

const PropertiesInformation = ({ propertiesData, contractsData, ownerUID }) => {

  const activeProperties = propertiesData?.Property?.result.filter((property) => property.owner_uid === ownerUID);
  const activePropertyUIDs = activeProperties?.map((property) => property.property_uid);

  const maintenanceRequests = propertiesData?.MaintenanceRequests?.result.filter((request) => activePropertyUIDs.includes(request.maintenance_property_id));

  const mapPropertiesToMaintenanceRequests = (maintenanceRequests) => {
    const propertyToRequests = {};

    maintenanceRequests?.forEach((request) => {
      const propertyId = request.maintenance_property_id;
      if (!propertyToRequests[propertyId]) {
        propertyToRequests[propertyId] = [];
      }
      propertyToRequests[propertyId].push(request);
    });

    return propertyToRequests;
  };

  const maintenanceReqsByProperty = mapPropertiesToMaintenanceRequests(maintenanceRequests);
  // console.log("maintenanceReqsByProperty - ", maintenanceReqsByProperty);

  const sentContracts = contractsData?.filter((contract) => contract.property_owner_id === ownerUID && contract.contract_status === "SENT");

  const newContracts = contractsData?.filter((contract) => contract.property_owner_id === ownerUID && contract.contract_status === "NEW");

  return (
    <>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#160449", marginTop: "10px" }}>YOU MANAGE {activeProperties?.length} OF THEIR PROPERTIES</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "15px", fontWeight: "bold", color: "#160449", marginTop: "10px", marginLeft: "20px" }}>Active {`(${activeProperties?.length})`}</Typography>
      </Grid>
      <Grid container sx={{ padding: "10px", maxHeight: "220px", overflow: "auto" }}>
        <Grid item xs={12}>
          <PropertiesDataGrid data={activeProperties} maintenanceRequests={maintenanceReqsByProperty} />
        </Grid>
      </Grid>
      <Grid container direction="row" sx={{ padding: "10px" }}>
        <Grid container item xs={6} justifyContent="center">
          <Button
            sx={{
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#9EAED6",
              },
            }}
          >
            <Typography sx={{ fontSize: "15px", fontWeight: "bold", color: "#160449" }}>New {`(${newContracts?.length})`}</Typography>
          </Button>
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <Button
            sx={{
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#9EAED6",
              },
            }}
          >
            <Typography sx={{ fontSize: "15px", fontWeight: "bold", color: "#160449" }}>Sent {`(${sentContracts?.length})`}</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const PropertiesDataGrid = ({ data, maintenanceRequests }) => {
  const navigate = useNavigate();
  const paymentStatusColorMap = {
    "Paid On Time": theme.palette.priority.clear,
    "Partially Paid": theme.palette.priority.medium,
    "Paid Late": theme.palette.priority.low,
    "Not Paid": theme.palette.priority.high,
    Vacant: "#160449",
    "No Manager": theme.palette.priority.low,
  };

  const paymentStatusMap = {
    UNPAID: "Not Paid",
    "PAID LATE": "Paid Late",
    PAID: "Paid On Time",
    Partial: "Partially Paid",
    VACANT: "Vacant",
    "NO MANAGER": "No Manager",
  };

  function getPaymentStatusColor(paymentStatus) {
    if (paymentStatus === null || paymentStatus === undefined) {
      return paymentStatusColorMap["Vacant"];
    } else {
      const status = paymentStatusMap[paymentStatus];
      return paymentStatusColorMap[status];
    }
  }

  const getNumOfMaintenanceReqs = (property_uid) => {
    const count = maintenanceRequests[property_uid]?.length;
    if (count == null) {
      return 0;
    }
    return count;
  };

  const columns = [
    {
      field: "property_address",
      // width: 200,
      flex: 1,
      renderCell: (params) => <Typography sx={{ fontSize: "14px", color: "#160449" }}>{`${params.row.property_address}, Unit - ${params.row.property_unit}`}</Typography>,
    },
    {
      field: "rent_status",
      // width: 100,
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: getPaymentStatusColor(params.row.rent_status),
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            border: "none",
            margin: "0px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontWeight: theme.typography.primary.fontWeight,
              fontSize: "12px",
              margin: "0px",
              padding: "0px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            {params.row.rent_status}
          </Typography>
        </Box>
      ),
    },
    {
      field: "maintenance",
      // width: 100,
      flex: 0.3,
      renderCell: (params) => (
        <Box
          sx={{ margin: "0px" }}
          onClick={() =>
            getNumOfMaintenanceReqs(params.row.property_uid) > 0
              ? navigate("/managerMaintenance", {
                  state: {
                    selectedProperty: {
                      address: params.row.property_address,
                      property_uid: params.row.property_uid,
                      checked: true,
                    },
                  },
                })
              : null
          }
        >
          <Badge
            overlap="circular"
            color="error"
            badgeContent={getNumOfMaintenanceReqs(params.row.property_uid)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            style={{
              color: "#000000",
              width: "35px",
              height: "20px",
              fontSize: "5px",
            }}
          >
            <Button
              // onClick={() => navigate("/maintenance")}
              sx={{ border: "none", "&:hover, &:focus, &:active": { backgroundColor: "#d6d5da" }, alignContent: "left", justifyContent: "left" }}
            >
              <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "30px", height: "30px" }} />
            </Button>
          </Badge>
        </Box>
      ),
    },
  ];

  if (!data) {
    return <></>;
  }

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        getRowHeight={() => "auto"}
        slots={{
          columnHeaders: () => null,
        }}
        getRowId={(row) => row.property_uid}
        sx={{
          border: "0px",
        }}
        hideFooter={true}
      />
    </>
  );
};

const CashflowDataGrid = ({ cashflowDetails, cashflowDetailsByProperty, cashflowDetailsByPropertyByMonth }) => {
  const [data, setData] = useState(
    cashflowDetails.map((row, index) => {
      return { ...row, index };
    })
  );
  const [tab, setTab] = useState("by_month");

  useEffect(() => {
    if (tab === "by_month") {
      setData(
        cashflowDetails.map((row, index) => {
          return { ...row, index };
        })
      );
    } else if (tab === "by_property") {
      setData(
        cashflowDetailsByProperty.map((row, index) => {
          return { ...row, index };
        })
      );
    } else if (tab === "by_property_by_month") {
      setData(
        cashflowDetailsByPropertyByMonth.map((row, index) => {
          return { ...row, index };
        })
      );
    }
  }, [tab, cashflowDetails, cashflowDetailsByProperty, cashflowDetailsByPropertyByMonth]);

  const columns = [
    {
      field: "owner_uid",
      headerName: "Owner UID - DEBUG",
      width: 100,
    },
    {
      field: "owner_name",
      headerName: "Owner Name - DEBUG",
      width: 150,
      renderCell: (params) => (
        <span>
          {params.row.owner_first_name} {params.row.owner_last_name}
        </span>
      ),
    },
    ...(tab !== "by_month"
      ? [
          {
            field: "property_address",
            headerName: "Address",
            width: 150,
            renderCell: (params) => <span>{params.row.property_address !== null ? params.row.property_address : "-"}</span>,
          },
        ]
      : []),
    ...(tab !== "by_property"
      ? [
          {
            field: "year_month",
            headerName: "Month",
            width: 100,
            renderCell: (params) => <span>{params.row.cf_month !== null ? params.row.cf_month : "-"}</span>,
          },
        ]
      : []),
    ...(tab !== "by_property"
      ? [
          {
            field: "year",
            headerName: "Year",
            width: 100,
            renderCell: (params) => <span>{params.row.cf_year !== null ? params.row.cf_year : "-"}</span>,
          },
        ]
      : []),
    {
      field: "actual_cashflow",
      headerName: "Actual Cashflow",
      width: 100,
    },
    {
      field: "expected_cashflow",
      headerName: "Expected Cashflow",
      width: 100,
    },
    {
      field: "delta_cashflow",
      headerName: "Delta Cashflow",
      width: 100,
      renderCell: (params) => <span>{parseFloat(params.row.actual_cashflow) - parseFloat(params.row.expected_cashflow)}</span>,
    },
    {
      field: "percent_delta_cashflow",
      headerName: "% Delta Cashflow",
      width: 100,
    },
  ];


  const handleSelectTab = (tabName) => {
    console.log("tabName - ", tabName);
    setTab(tabName);
  };

  return (
    <>
      <Grid container item xs={12} sx={{ padding: "10px" }}>
        <Grid container justifyContent="center" item xs={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Vertically centers the children
              justifyContent: "center", // Horizontally centers the children (optional)
              // height: "100vh", // Adjust the height as needed
            }}
          >
            <Typography sx={{ fontSize: "15px", fontWeight: "bold", color: "#160449" }}>CASHFLOW</Typography>
          </Box>
        </Grid>
        <Grid container justifyContent="center" item xs={3}>
          <Button
            sx={{
              width: "150px",
              backgroundColor: tab === "by_month" ? "#3D5CAC" : "#9EAED6",
              textTransform: "none",
              "&:hover": {
                backgroundColor: tab === "by_month" ? "#3D5CAC" : "#9EAED6",
              },
            }}
            onClick={() => handleSelectTab("by_month")}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#160449" }}>By Month</Typography>
          </Button>
        </Grid>
        <Grid container justifyContent="center" item xs={3}>
          <Button
            sx={{
              width: "150px",
              backgroundColor: tab === "by_property" ? "#3D5CAC" : "#9EAED6",
              textTransform: "none",
              "&:hover": {
                backgroundColor: tab === "by_property" ? "#3D5CAC" : "#9EAED6",
              },
            }}
            onClick={() => handleSelectTab("by_property")}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#160449" }}>By Property</Typography>
          </Button>
        </Grid>
        <Grid container justifyContent="center" item xs={3}>
          <Button
            sx={{
              width: "200px",
              backgroundColor: tab === "by_property_by_month" ? "#3D5CAC" : "#9EAED6",
              textTransform: "none",
              "&:hover": {
                backgroundColor: tab === "by_property_by_month" ? "#3D5CAC" : "#9EAED6",
              },
            }}
            onClick={() => handleSelectTab("by_property_by_month")}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#160449" }}>By Property By Month</Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.index}
          sx={{
            height: "300px",
            overflow: "auto",
            "& .totals-row": {
              fontWeight: "bold",
              // backgroundColor: '#f1f1f1',
            },
            border: "0px",
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
        />
      </Grid>
    </>
  );
};

export default OwnerContactDetailsHappinessMatrix;
