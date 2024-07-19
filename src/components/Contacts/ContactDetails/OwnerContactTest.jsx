import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import axios from "axios";
import APIConfig from "../../../utils/APIConfig";
import {
  Typography,
  Box,
  Grid,
  Container,
  ThemeProvider,
  Paper,
} from "@mui/material";
import theme from "../../../theme/theme";
import HappinessMatrixWidget from "../../Dashboard-Components/HappinessMatrix/HappinessMatrixWidget";
import useMediaQuery from "@mui/material/useMediaQuery";

const OwnerContactTest = (props) => {
  const { getProfileId } = useUser();
  const location = useLocation();
  const [contactDetails, setContactDetails] = useState([]);
  const [index, setIndex] = useState(location.state?.index || 0);
  const [happinessMatrixData, setHappinessMatrixData] = useState([]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ownerUID = location.state?.ownerUID;
  const happinessData = location.state?.happinessData || {};
  const cashflowData = location.state?.cashflowData || [];
  const [filteredCashflowData, setFilteredCashflowData] = useState([]);
  const cashflowDetails = happinessData?.delta_cashflow_details?.result || [];
  const cashflowDetailsByProperty = happinessData?.delta_cashflow_details_by_property?.result || [];
  const cashflowDetailsByPropertyByMonth = happinessData?.delta_cashflow_details_by_property_by_month?.result || [];
  const [filteredCashflowDetails, setFilteredCashflowDetails] = useState([]);
  const [filteredCashflowDetailsByProperty, setFilteredCashflowDetailsByProperty] = useState([]);
  const [filteredCashflowDetailsByPropertyByMonth, setFilteredCashflowDetailsByPropertyByMonth] = useState([]);

  const [contactsTab, setContactsTab] = useState("");

  useEffect(() => {
    console.log("location state", location.state);
    if (location.state?.happinessMatrixData) {
      setHappinessMatrixData(setting_matrix_data(location.state.happinessMatrixData));
    }
  }, [location]);

  useEffect(() => {
    const getDataFromAPI = async () => {
      try {
        const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
        const resp = await axios.get(url);
        const data = resp.data["management_contacts"];
        const ownerContacts = data["owners"];
        console.log("Owner Contact info", ownerContacts);
        setContactDetails(ownerContacts);
        const ownerIndex = ownerContacts.findIndex(contact => contact.owner_uid === ownerUID);
        setIndex(ownerIndex);
      } catch (e) {
        console.error(e);
      }
    };

    if (location.state?.navigatingFrom === "PropertyNavigator") {
      getDataFromAPI();
      setContactsTab("Owner");
    }
  }, [location.state, getProfileId, ownerUID]);

  useEffect(() => {
    console.log("OwnerContactTest - contactDetails", contactDetails);
    console.log("OwnerContactTest - index", index);
    console.log("OwnerContactTest - happinessData", happinessData);
    console.log("OwnerContactTest - happinessMatrixData", happinessMatrixData);
    console.log("OwnerContactTest - happinessMatrixData isArray", Array.isArray(happinessMatrixData));
  }, [contactDetails, index, happinessData, happinessMatrixData]);

  useEffect(() => {
    const currentOwnerUID = contactDetails[index]?.owner_uid;
    if (currentOwnerUID) {
      setFilteredCashflowDetails(cashflowDetails.filter((item) => item.owner_uid === currentOwnerUID));
      setFilteredCashflowDetailsByProperty(cashflowDetailsByProperty.filter((item) => item.owner_uid === currentOwnerUID));
      setFilteredCashflowDetailsByPropertyByMonth(cashflowDetailsByPropertyByMonth.filter((item) => item.owner_uid === currentOwnerUID));
      setFilteredCashflowData(cashflowData.filter((item) => item.owner_uid === currentOwnerUID));
    }
  }, [index, contactDetails, cashflowDetails, cashflowDetailsByProperty, cashflowDetailsByPropertyByMonth, cashflowData]);

  const setting_matrix_data = (happiness_response) => {
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
  return (
    <Box>
      {data.map((contact, idx) => (
        <Box key={idx} onClick={() => setIndex(idx)}>
          <Typography>{contact.owner_first_name} {contact.owner_last_name}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const OwnerContactDetail = ({ contactDetails, index }) => {
  const contact = contactDetails[index] || {};
  return (
    <Box>
      <Typography>Owner Information</Typography>
      <Typography>{contact.owner_first_name} {contact.owner_last_name}</Typography>
      <Typography>{contact.owner_email}</Typography>
    </Box>
  );
};

export default OwnerContactTest;
