import { Chart } from "react-google-charts";
import { Button, Box, ThemeProvider, Grid, Container, Paper, Typography } from "@mui/material";
import { PieChart, Pie, Legend, Cell } from "recharts";
import CashflowWidget2 from "../Dashboard-Components/Cashflow/CashflowWidget2";
import MaintenanceWidget2 from "../Dashboard-Components/Maintenance/MaintenanceWidget2";
import "../../css/maintenance.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../../theme/theme";
import Dollar from "../../images/Dollar.png";
import File_dock_fill from "../../images/File_dock_fill.png";
import User_fill_dark from "../../images/User_fill_dark.png";
import { useUser } from "../../contexts/UserContext";
import OwnerPropertyRentWidget from "./OwnerPropertyRentWidget";
import LeaseWidget from "../Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@material-ui/core";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import useMediaQuery from "@mui/material/useMediaQuery";
import NewCardSlider from "../Announcement/NewCardSlider";
import APIConfig from "../../utils/APIConfig";

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
    paddingTop: "25px",
  },
  row: {
    marginBottom: "20px", // Adjust the spacing between rows
  },
});

export default function OwnerDashboard2() {
  const { user, getProfileId } = useUser();
  const classes = useStyles();
  const navigate = useNavigate();
  let date = new Date();
  // const [loading, setLoading] = useState(true);
  const [rentStatus, setRentStatus] = useState([]);
  const [leaseStatus, setLeaseStatus] = useState([]);
  const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);

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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [announcementsData, setAnnouncementsData] = useState([]);
  // const [allAnnouncementsData, setAllAnnouncementsData] = useState([]);

  const [showReferralWelcomeDialog, setShowReferralWelcomeDialog] = useState(false);

  useEffect(() => {
    const dataObject = {};
    const fetchData = async () => {
      if (!getProfileId()) navigate("/PrivateprofileName");
      setShowSpinner(true);
      const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
      const jsonData = await response.json();
      const announcementsResponse = await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`);
      const announcementsResponseData = await announcementsResponse.json();

      let announcementsReceivedData = announcementsResponseData?.received?.result;
      // console.log("OwnerDashboar2 - announcementsReceivedData", announcementsReceivedData);
      setAnnouncementsData(announcementsReceivedData || ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"]);

      // MAINTENANCE Status
      setMaintenanceStatusData(jsonData.MaintenanceStatus.result);

      // RENT Status
      setRentStatus(jsonData.RentStatus.result);

      // LEASE Status
      setLeaseStatus(jsonData.LeaseStatus.result);
      setShowSpinner(false);
    };
    fetchData();
    const signedUpWithReferral = localStorage.getItem("signedUpWithReferral");
    if (signedUpWithReferral && signedUpWithReferral === "true") {
      setShowReferralWelcomeDialog(true);
      localStorage.removeItem("signedUpWithReferral");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
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
                Welcome, {user.first_name}.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <CashflowWidget2 />
          </Grid>

          <Grid container item xs={12} md={8} columnSpacing={6}>
            <Grid item xs={12} md={6} sx={{ marginBottom: isMobile ? "10px" : "1px" }}>
              <OwnerPropertyRentWidget rentData={rentStatus} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ marginBottom: "1px" }}>
              <MaintenanceWidget2 maintenanceData={maintenanceStatusData} />
            </Grid>
            <Grid item xs={12}>
              <LeaseWidget leaseData={leaseStatus} />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ backgroundColor: "#F2F2F2", paddingBottom: "40px", borderRadius: "10px", height: "100%" }}>
                <Grid
                  container
                  direction="row"
                  sx={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                    <Box
                      sx={{
                        flexGrow: 1, // Allow this Box to grow and fill space
                        display: "flex",
                        justifyContent: "center", // Center the content of this Box
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#160449",
                          fontSize: { xs: "18px", sm: "18px", md: "24px" },
                          fontWeight: "bold",
                        }}
                      >
                        Announcements
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1, // Look into this for all the components
                        flex: 1,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          color: "#007AFF",
                          fontSize: "15px",
                          paddingRight: "25px",
                          fontWeight: "bold",
                        }}
                        // onClick={() => {
                        //   navigate("/announcements", { state: { announcementsData, propertyAddr } });
                        // }}
                      >
                        {isMobile ? `(${announcementsData.length})` : `View all (${announcementsData.length})`}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                {announcementsData.length > 0 ? (
                  <NewCardSlider announcementList={announcementsData} isMobile={isMobile} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", minHeight: "235px" }}>
                    <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" } }}>No Announcements</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* } */}
      <Dialog open={showReferralWelcomeDialog} onClose={() => setShowReferralWelcomeDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">Referral Sent</DialogTitle> */}
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Hello, {user.first_name}!. Welcome to ManifestMySpace. To complete your profile setup, please verify your information by clicking the profile button below. You'll need
            to add additional details such as your SSN and address. Thank you!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => setShowReferralWelcomeDialog(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
