import { Button, Box, ThemeProvider, Grid, Typography, Container } from "@mui/material";
import MaintenanceWidget2 from "../Dashboard-Components/Maintenance/MaintenanceWidget2";
import RevenueWidget from "../Dashboard-Components/Revenue/RevenueWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import Dollar from "../../images/Dollar.png";
import File_dock_fill from "../../images/File_dock_fill.png";
import User_fill_dark from "../../images/User_fill_dark.png";
import { useUser } from "../../contexts/UserContext";
import PropertyRentWidget2 from "../Dashboard-Components/PropertyRent/PropertyRentWidget2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddRevenueIcon from "../../images/AddRevenueIcon.png";
import LeaseWidget from "../Dashboard-Components/Lease/LeaseWidget";
import LeaseWidget2 from "../Dashboard-Components/Lease/LeaseWidget2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import OwnerList from "./OwnerList";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HappinessMatrix2 from './HappinessMatrix2';
import HappinessMatrixWidget from "../Dashboard-Components/HappinessMatrix/HappinessMatrixWidget";
import { Paper } from "@mui/material";

import APIConfig from "../../utils/APIConfig";
// import { Container } from "react-bootstrap";

// console.log("In Manager Dashboard");
// console.log(window.getComputedStyle(document.body).fontFamily);

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px", // Adjust the spacing between buttons as needed
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
    marginBottom: "20px", // Adjust the spacing between rows
  },
});

function ManagerDashboard2() {
  console.log("In Manager Dashboard function");
  const classes = useStyles();
  const { getProfileId, user, selectedRole } = useUser();
  let dashboard_id = getProfileId();
  if (selectedRole === "PM_EMPLOYEE") dashboard_id = user.businesses?.MANAGEMENT?.business_uid || user?.pm_supervisor;
  const navigate = useNavigate();
  let date = new Date();
  // const [loading, setLoading] = useState(true);
  const [rentStatus, setRentStatus] = useState([]);
  const [leaseStatus, setLeaseStatus] = useState([]);
  const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);
  const [contractRequests, setContractRequests] = useState([]);
  const [property_endpoint_resp, set_property_endpoint_resp] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  // console.log("In Manager Dashboard Step 1");

  const [moveoutsInSixWeeks, setMoveoutsInSixWeeks] = useState(0);
  const sliceColors = ["#A52A2A", "#FF8A00", "#FFC85C", "#160449", "#3D5CAC"];
  const rentData = [
    ["Properties", "Rent status"],
    ["not paid", 18],
    ["paid partially", 6],
    ["paid late", 3],
    ["vacant", 3],
    ["paid on time", 36],
  ];

  const [showReferralWelcomeDialog, setShowReferralWelcomeDialog] = useState(false);

  // console.log("In Manager Dashboard Step 2");
  let [matrixData, setMatrixData] = useState([]);
  let [p_owner, p_owner_setter] = useState()

  const setting_matrix_data = (happiness_response) => {
    // console.log("In Setting Happiness Matrix", happiness_response);
    // Transforming the data
    const transformedData = happiness_response.HappinessMatrix.vacancy.result.map((vacancyItem, i) => {
      // console.log("In Happiness Matrix before vacancy");
      const deltaCashflowItem = happiness_response.HappinessMatrix.delta_cashflow.result.find((item) => item.owner_id === vacancyItem.owner_uid);
      // console.log("In Happiness Matrix before cashflow");
      const fullName = `${deltaCashflowItem.owner_first_name} ${deltaCashflowItem.owner_last_name}`;

      // console.log("In Happiness Matrix before quarter");
      let quarter;
      if (deltaCashflowItem.delta_cashflow_perc < -50 && vacancyItem.vacancy_perc < -50) {
        quarter = 1;
      } else if (deltaCashflowItem.delta_cashflow_perc > -50 && vacancyItem.vacancy_perc < -50) {
        quarter = 2;
      } else if (deltaCashflowItem.delta_cashflow_perc < -50 && vacancyItem.vacancy_perc > -50) {
        quarter = 3;
      } else if (deltaCashflowItem.delta_cashflow_perc > -50 && vacancyItem.vacancy_perc > -50) {
        quarter = 4;
      }

      // console.log("In Happiness Matrix before boarder");
      let borderColor;
      switch (quarter) {
        case 1:
          borderColor = "#A52A2A"; // Red color
          break;
        case 2:
          borderColor = "#FF8A00"; // Orange color
          break;
        case 3:
          borderColor = "#FFC85C"; // Yellow color
          break;
        case 4:
          borderColor = "#3D5CAC"; // Blue color
          break;
        default:
          borderColor = "#000000"; // Black color
      }

      return {
        name: fullName.trim(),
        photo: deltaCashflowItem.owner_photo_url,
        vacancy_perc: parseFloat(vacancyItem.vacancy_perc).toFixed(2),
        delta_cashflow_perc: deltaCashflowItem.delta_cashflow_perc || 0,
        vacancy_num: vacancyItem.vacancy_num || 0,
        cashflow: deltaCashflowItem.cashflow || 0,
        expected_cashflow: deltaCashflowItem.expected_cashflow || 0,
        delta_cashflow: deltaCashflowItem.cashflow - deltaCashflowItem.expected_cashflow,
        index: i,
        color: borderColor,
        total_properties: vacancyItem.total_properties || 0,
      };
    });

    // Sorting transformedData based on the color
    const sortedData = transformedData.sort((a, b) => {
      const colorOrder = {
        "#A52A2A": 1,
        "#FF8A00": 2,
        "#FFC85C": 3,
        "#3D5CAC": 4,
        "#000000": 5,
      };
      return colorOrder[a.color] - colorOrder[b.color];
    });

    setMatrixData(sortedData);
  };

  // console.log("In Manager Dashboard Step 3");

  // Employee Verification useEffect
  
  useEffect(() => {
    setShowSpinner(true);
    if (selectedRole === "PM_EMPLOYEE") {
      const emp_verification = async () => {
        try {
          const response = await fetch(`${APIConfig.baseURL.dev}/profile/${getProfileId()}`);
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

  // USE EFFECT gets all the data
  useEffect(() => {
    // const dataObject = {};
    // console.log("In UseEffect");
    // console.log(getProfileId());
    if (!getProfileId()) navigate("/PrivateprofileName");
    // console.log("In UseEffect after if");
    const fetchData = async () => {
      setShowSpinner(true);

    //   const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${dashboard_id}`); 
      const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`); //rohit

      // const propertiesResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`);
      try {
        const jsonData = await response.json();
        // const propertiesResponseJSON = await propertiesResponse.json();

        // MAINTENANCE Status
        setMaintenanceStatusData(jsonData.MaintenanceStatus.result);

        // RENT Status
        setRentStatus(jsonData.RentStatus.result);

        // LEASE Status
        setLeaseStatus(jsonData.LeaseStatus.result);

        // HAPPINESS MATRIX
        setting_matrix_data(jsonData);

        // REVENUE DATA
        setRevenueData(jsonData.Profitability);

        // NEW PM REQUESTS
        // set_property_endpoint_resp(propertiesResponseJSON);
        // setContractRequests(propertiesResponseJSON.NewPMRequests.result);
        set_property_endpoint_resp(jsonData);
        setContractRequests(jsonData.NewPMRequests.result);
      } catch (error) {
        console.error(error);
      }

      setShowSpinner(false);
    };
    fetchData();
  }, []);
  if(showSpinner){
    return (
        <>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ShimmerUI />
        </>
        
      );
  }  

return (
    <ThemeProvider theme={theme}>        
        <Container maxWidth="lg" sx={{paddingTop: '30px', paddingBottom: '50px', }}>
            <Grid container spacing={6}>
                <Grid item xs={12} md={3}>
                    <PropertyRentWidget2 rentData={rentStatus} propertyEndpointResp={property_endpoint_resp} contractRequests={contractRequests}/>
                </Grid>
                <Grid item xs={12} md={9}>
                    <RevenueWidget revenueData={revenueData}/>

                    <LeaseWidget2 leaseData={leaseStatus} />                    

                    <Grid container item xs={12} spacing={6}>
                        <Grid item xs={12} md={5.25}>
                            {/* <OwnerList matrixData={matrixData} /> */}
                            {/* HappinessMatrixWidget */}
                            <Paper
                                style={{
                                    // margin: '50p', // Add margin here
                                    borderRadius: '10px',
                                    backgroundColor: theme.palette.primary.main,
                                    height: 400,
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                }}
                            >
                                <HappinessMatrixWidget data={matrixData} />
                            </Paper>
                        </Grid>
                        <Grid item xs={0} md={0.25}>

                        </Grid>


                        <Grid item xs={12} md={6.5} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <MaintenanceWidget2 maintenanceData={maintenanceStatusData} />
                        </Grid>
                    </Grid>
                </Grid>                
            </Grid>            
        </Container>        
    </ThemeProvider>
  );
}
// console.log("In Manager Dashboard Step 5");

const ShimmerUI = () => (
  <ThemeProvider theme={theme}>
    <Container maxWidth="lg" sx={{ paddingTop: '30px', paddingBottom: '50px', }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={3}>
            <Paper
                style={{
                  borderRadius: '10px',
                  backgroundColor: theme.palette.primary.main,
                  height: 780,
                  [theme.breakpoints.down('sm')]: {
                    width: '80%',
                  },
                  [theme.breakpoints.up('sm')]: {
                    width: '50%',
                  },
                }}
              >                
              </Paper>
        </Grid>
        <Grid item xs={12} md={9} rowSpacing={6}>
          {/* <RevenueWidget revenueData={null} shimmer /> */}
          <Paper
                style={{
                    borderRadius: '10px',                    
                    backgroundColor: theme.palette.primary.main,
                    height: 162,
                    [theme.breakpoints.down('sm')]: {
                    width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                    width: '50%',
                    },
                }}
                >
                {/* <HappinessMatrixWidget data={null} shimmer /> */}
            </Paper>

            <Paper
                style={{
                    marginTop: '10px',
                    borderRadius: '10px',
                    backgroundColor: theme.palette.primary.main,
                    height: 198,
                    [theme.breakpoints.down('sm')]: {
                    width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                    width: '50%',
                    },
                }}
                >
                {/* <HappinessMatrixWidget data={null} shimmer /> */}
            </Paper>

          <Grid container item xs={12} spacing={6}>
            <Grid item xs={12} md={5}>
              <Paper
                style={{
                  marginTop: '10px',
                  borderRadius: '10px',
                  backgroundColor: theme.palette.primary.main,
                  height: 400,
                  [theme.breakpoints.down('sm')]: {
                    width: '80%',
                  },
                  [theme.breakpoints.up('sm')]: {
                    width: '50%',
                  },
                }}
              >
                {/* <HappinessMatrixWidget data={null} shimmer /> */}
              </Paper>
            </Grid>
            <Grid md={0.5}></Grid>
            <Grid item xs={12} md={6.5} >
                <Paper
                    style={{
                    marginTop: '10px',
                    borderRadius: '10px',
                    backgroundColor: theme.palette.primary.main,
                    height: 400,
                    [theme.breakpoints.down('sm')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('sm')]: {
                        width: '50%',
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

export default ManagerDashboard2;
