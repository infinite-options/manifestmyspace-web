import { Chart } from "react-google-charts";
import { Button, Container, Box, ThemeProvider, Grid, Typography } from "@mui/material";
import { PieChart, Pie, Legend, Cell } from "recharts";
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import Dollar from "../../images/Dollar.png";
import File_dock_fill from "../../images/File_dock_fill.png";
import User_fill_dark from "../../images/User_fill_dark.png";
import { useUser } from "../../contexts/UserContext";
import PropertyRentWidget from "../Dashboard-Components/PropertyRent/PropertyRentWidget";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddRevenueIcon from "../../images/AddRevenueIcon.png";
import LeaseWidget from "../Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import OwnerList from "./OwnerList";

// console.log("In Manager Dashboard");

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

function ManagerDashboard() {
  console.log("In Manager Dashboard function");
  const classes = useStyles();
  const { getProfileId } = useUser();
  const navigate = useNavigate();
  let date = new Date();
  // const [loading, setLoading] = useState(true);
  const [rentStatus, setRentStatus] = useState([]);
  const [leaseStatus, setLeaseStatus] = useState([]);
  const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);
  const [contractRequests, setContractRequests] = useState([]);
  const [property_endpoint_resp, set_property_endpoint_resp] = useState([]);
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

  // console.log("In Manager Dashboard Step 2");
  let [matrixData, setMatrixData] = useState([]);

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

  // USE EFFECT gets all the data
  useEffect(() => {
    // const dataObject = {};
    // console.log("In UseEffect");
    // console.log(getProfileId());
    if (!getProfileId()) navigate("/PrivateprofileName");
    // console.log("In UseEffect after if");
    const fetchData = async () => {
      setShowSpinner(true);
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`);
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

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="mt-widgest-main">
        <div className="mt-container">
          <MaintenanceWidget maintenanceData={maintenanceStatusData} />
          <PropertyRentWidget rentData={rentStatus} />
        </div>

        <div className="mt-container">
          <LeaseWidget leaseData={leaseStatus} />
        </div>

        <br />
        <div className="mt-widget-owner-happiness">
          <h2 className="mt-expiry-widget-title"> Owner Happiness </h2>
          <OwnerList matrixData={matrixData} />
        </div>
        <br />

        <div className={classes.container}>
          <Grid container spacing={2} className={classes.row}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="revenue"
                className={classes.button}
                style={{
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/payments");
                }}
              >
                {/* <img src={User_fill_dark} alt="Payments" /> */}
                <CurrencyExchangeIcon sx={{ paddingRight: "5px" }} />
                Pay Bills
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="revenue"
                className={classes.button}
                style={{
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/PMContacts");
                }}
              >
                <img src={User_fill_dark} alt="Contacts" />
                Contacts
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="revenue"
                className={classes.button}
                style={{
                  fontSize: "9px",
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/pmQuotesList", { state: { property_endpoint_resp } });
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#160449",
                    fontSize: "20px",
                    paddingRight: "20px",
                  }}
                >
                  {/* {contractRequests.length()} */}
                  {contractRequests.length}
                </Box>
                New Requests
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.row}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="revenue"
                className={classes.button}
                style={{
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/transactionHistory", { state: { month: "January", year: "2024" } });
                }}
              >
                <img src={Dollar} alt="Transactions" />
                Transactions
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="expense"
                className={classes.button}
                style={{
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/pmDocuments");
                }}
              >
                <img src={File_dock_fill} alt="Documents" />
                Documents
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                id="maintenance"
                className={classes.button}
                style={{
                  fontSize: "9px",
                  height: "100%",
                }}
                onClick={() => {
                  navigate("/addMaintenanceItem");
                }}
              >
                <img src={User_fill_dark} alt="Add Ticket" />
                Add Ticket
              </Button>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
      </div>
      {/* } */}
    </ThemeProvider>
  );
}
// console.log("In Manager Dashboard Step 5");

export default ManagerDashboard;
