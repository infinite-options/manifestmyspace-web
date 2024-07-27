import { Box, Container, Grid, Paper, ThemeProvider, Typography } from "@mui/material";
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import RevenueWidget from "../Dashboard-Components/Revenue/RevenueWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import PropertyRentWidget from "../Dashboard-Components/PropertyRent/PropertyRentWidget";
import LeaseWidget from "../Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import HappinessMatrixWidget from "../Dashboard-Components/HappinessMatrix/HappinessMatrixWidget";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIConfig from "../../utils/APIConfig";

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px",
  },
  container: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: "20px",
  },
});

function ManagerDashboard() {
  console.log("In Manager Dashboard function");

  const navigate = useNavigate();
  const { getProfileId, user, selectedRole } = useUser();
  const [rentStatus, setRentStatus] = useState([]);
  const [leaseStatus, setLeaseStatus] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [happinessData, setHappinessData] = useState([]);
  const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
  const [contractRequests, setContractRequests] = useState([]);

  const [showSpinner, setShowSpinner] = useState(true);
  const [showReferralWelcomeDialog, setShowReferralWelcomeDialog] = useState(false);
  const sliceColors = ["#A52A2A", "#FF8A00", "#FFC85C", "#160449", "#3D5CAC"];
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // Can we delete these?
  const [dataforhappiness, setdataforhappiness] = useState([]);
  const [matrixData, setMatrixData] = useState([]);
  const [property_endpoint_resp, set_property_endpoint_resp] = useState([]);

  //
  //
  // Check if No Profile ID or if Employee Profile ID or if some other Role
  console.log("User Info: ", getProfileId(), selectedRole, user);

  let dashboard_id = getProfileId();
  if (selectedRole === "PM_EMPLOYEE") dashboard_id = user.businesses?.MANAGEMENT?.business_uid || user?.pm_supervisor;

  if (!getProfileId()) {
    let newRole = "MANAGER";
    navigate("/addNewRole", { state: { user_uid: user.user_uid, newRole } });
  }

  // This should be done at User Login and Not on the Dashboard
  // Employee Verification useEffect
  useEffect(() => {
    setShowSpinner(true);
    if (selectedRole === "PM_EMPLOYEE") {
      const emp_verification = async () => {
        try {
          const response = await fetch(`${APIConfig.baseURL.dev}/profile/${getProfileId()}`);
          // const response = await fetch(`${APIConfig.baseURL.dev}/profile/600-000003`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          const employee = data.result[0]; // Assuming there's only one employee
          if (!employee?.employee_verification) {
            navigate("/emp_waiting");
          }
        } catch (error) {
          console.error(error);
        }
      };

      emp_verification();
      setShowSpinner(false);
    }
    const signedUpWithReferral = localStorage.getItem("signedUpWithReferral");
    if (signedUpWithReferral && signedUpWithReferral === "true") {
      setShowReferralWelcomeDialog(true);
      localStorage.removeItem("signedUpWithReferral");
    }
  }, []);

  //
  //
  // Console Logs for useState variables
  useEffect(() => {
    console.log("RentStatus check --", rentStatus);
  }, [rentStatus]);

  useEffect(() => {
    console.log("property endpoint resp - ", property_endpoint_resp);
  }, [property_endpoint_resp]);

  useEffect(() => {
    console.log("Contract requests - ", contractRequests);
  }, [contractRequests]);

  useEffect(() => {
    console.log("Happiness Matrix Info - ", happinessData);
  }, [happinessData]);

  //
  //
  // This should be done in Happiness Matrix Widget - Divya
  const setting_matrix_data = (happiness_response) => {
    // console.log("In Setting Happiness Matrix", happiness_response);
    // Transforming the data
    // console.log("setting_matrix_data - happiness_response - ", happiness_response);
    const transformedData = happiness_response.HappinessMatrix.vacancy.result.map((vacancyItem, i) => {
      // console.log("In Happiness Matrix before vacancy");
      // console.log("setting_matrix_data - vacancyItem - ", vacancyItem);
      const deltaCashflowItem = happiness_response.HappinessMatrix.delta_cashflow.result.find((item) => item.owner_uid === vacancyItem.owner_uid);
      // console.log("setting_matrix_data - deltaCashflowItem - ", deltaCashflowItem);

      let fullName = "";
      let ownerUID = "";
      let percent_delta_cashflow = 0;
      let owner_photo_url = "";
      let cashflow = 0;
      let expected_cashflow = 0;
      let actual_cashflow = 0;

      if (deltaCashflowItem) {
        // console.log("deltaCashflowItem - ", deltaCashflowItem);
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

      // console.log("delta_cf_perc, vacancy_perc  - ", delta_cf_perc, vacancy_perc);
      // console.log("quarter - ", fullName, quarter);

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

    setMatrixData(transformedData);
  };
  // End of Happiness Matrix Widget Info - Divya

  //
  //
  //  USE EFFECT gets all the data
  useEffect(() => {
    // const dataObject = {};
    // console.log("In UseEffect");
    // console.log(getProfileId());

    // console.log("In UseEffect after if");
    const fetchData = async () => {
      setShowSpinner(true);

      const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${dashboard_id}`);
      // const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`);

      try {
        const jsonData = await response.json();
        console.log("Manager Dashboard jsonData: ", jsonData);

        // RENT Status
        setRentStatus(jsonData.RentStatus.result);

        // LEASE Status
        setLeaseStatus(jsonData.LeaseStatus.result);

        // REVENUE DATA
        setRevenueData(jsonData.Profitability);

        // HAPPINESS MATRIX
        setHappinessData(jsonData.HappinessMatrix);

        // DATA FOR HAPPINESS - Need to Remove this after Divya moves the Happiness Matrix Widget Info
        setdataforhappiness(jsonData);
        setting_matrix_data(jsonData);
        set_property_endpoint_resp(jsonData);

        // MAINTENANCE Status
        setMaintenanceStatusData(jsonData.MaintenanceStatus.result);

        // NEW PM REQUESTS
        setContractRequests(jsonData.NewPMRequests.result);
      } catch (error) {
        console.error(error);
      }

      setShowSpinner(false);
    };
    fetchData();
  }, []);

  if (showSpinner) {
    return (
      <>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <ShimmerUI />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: isMobile ? "center" : "left",
                paddingLeft: "10px",
                paddingRight: "10px",
                alignText: "center",
                alignContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "22px", sm: "28px", md: "32px" },
                  fontWeight: "600",
                }}
              >
                Welcome, {user.first_name}!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <PropertyRentWidget rentData={rentStatus} contractRequests={contractRequests} propertyEndpointResp={property_endpoint_resp} />
          </Grid>
          <Grid item xs={12} md={9}>
            <RevenueWidget revenueData={revenueData} />
            <LeaseWidget leaseData={leaseStatus} />
            <Grid container item xs={12} spacing={6}>
              <Grid item xs={12} md={6}>
                <HappinessMatrixWidget
                  happinessData={happinessData}
                  // data={matrixData}
                  // dataforhappiness={dataforhappiness}
                />
              </Grid>
              <Grid item xs={12} md={6} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
                <MaintenanceWidget maintenanceData={maintenanceStatusData} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

const ShimmerUI = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "30px", paddingBottom: "50px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{
                height: "48px",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: isMobile ? "center" : "left",
                paddingLeft: "10px",
                paddingRight: "10px",
                alignText: "center",
                alignContent: "center",
              }}
            ></Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              style={{
                borderRadius: "10px",
                backgroundColor: theme.palette.primary.main,
                height: 780,
                [theme.breakpoints.down("sm")]: {
                  width: "80%",
                },
                [theme.breakpoints.up("sm")]: {
                  width: "50%",
                },
              }}
            ></Paper>
          </Grid>
          <Grid item xs={12} md={9} rowSpacing={6}>
            {/* <RevenueWidget revenueData={null} shimmer /> */}
            <Paper
              style={{
                borderRadius: "10px",
                backgroundColor: theme.palette.primary.main,
                height: 162,
                [theme.breakpoints.down("sm")]: {
                  width: "80%",
                },
                [theme.breakpoints.up("sm")]: {
                  width: "50%",
                },
              }}
            >
              {/* <HappinessMatrixWidget data={null} shimmer /> */}
            </Paper>

            <Paper
              style={{
                marginTop: "10px",
                borderRadius: "10px",
                backgroundColor: theme.palette.primary.main,
                height: 198,
                [theme.breakpoints.down("sm")]: {
                  width: "80%",
                },
                [theme.breakpoints.up("sm")]: {
                  width: "50%",
                },
              }}
            >
              {/* <HappinessMatrixWidget data={null} shimmer /> */}
            </Paper>

            <Grid container item xs={12} spacing={6}>
              <Grid item xs={12} md={6}>
                <Paper
                  style={{
                    marginTop: "10px",
                    borderRadius: "10px",
                    backgroundColor: theme.palette.primary.main,
                    height: 400,
                    [theme.breakpoints.down("sm")]: {
                      width: "80%",
                    },
                    [theme.breakpoints.up("sm")]: {
                      width: "50%",
                    },
                  }}
                >
                  {/* <HappinessMatrixWidget data={null} shimmer /> */}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  style={{
                    marginTop: "10px",
                    borderRadius: "10px",
                    backgroundColor: theme.palette.primary.main,
                    height: 400,
                    [theme.breakpoints.down("sm")]: {
                      width: "80%",
                    },
                    [theme.breakpoints.up("sm")]: {
                      width: "50%",
                    },
                  }}
                >
                  {/* <HappinessMatrixWidget data={null} shimmer /> */}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ManagerDashboard;
