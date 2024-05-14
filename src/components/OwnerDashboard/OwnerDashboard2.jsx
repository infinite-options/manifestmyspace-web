import { Chart } from "react-google-charts";
import { Button, Box, ThemeProvider, Grid, Container, Paper } from "@mui/material";
import { PieChart, Pie, Legend, Cell } from "recharts";
import CashflowWidget from "../Dashboard-Components/Cashflow/CashflowWidget";
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
import LeaseWidget2 from "../Dashboard-Components/Lease/LeaseWidget2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@material-ui/core";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
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

  const [showReferralWelcomeDialog, setShowReferralWelcomeDialog] = useState(false);

  useEffect(() => {
    const dataObject = {};
    const fetchData = async () => {
      if (!getProfileId()) navigate("/PrivateprofileName");
      setShowSpinner(true);
      const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
      const jsonData = await response.json();

      // MAINTENANCE Status
      setMaintenanceStatusData(jsonData.MaintenanceStatus.result);

      // RENT Status
      setRentStatus(jsonData.RentStatus.result);

      // LEASE Status
      setLeaseStatus(jsonData.LeaseStatus.result);
      setShowSpinner(false);
    };
    fetchData();
    const signedUpWithReferral = localStorage.getItem('signedUpWithReferral');
    if (signedUpWithReferral && signedUpWithReferral === 'true') {
      setShowReferralWelcomeDialog(true);      
      localStorage.removeItem('signedUpWithReferral');
    }
  }, []);

  // RETURN statement has HTML, CSS and uses all the DATA
//   return (
//     <ThemeProvider theme={theme}>
//       <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
//         <CircularProgress color="inherit" />
//       </Backdrop>

//       <div className="mt-widget-main">
//         <CashflowWidget />
//         <div className="mt-container">
//           <MaintenanceWidget maintenanceData={maintenanceStatusData} />
//           <PropertyRentWidget rentData={rentStatus} />
//         </div>

//         <div className="mt-container">
//           <LeaseWidget leaseData={leaseStatus} />
//         </div>

//         <div className={classes.container}>
//           <Grid container spacing={2} className={classes.row}>
//             <Grid item xs={6}>
//               <Button
//                 variant="outlined"
//                 id="revenue"
//                 className={classes.button}
//                 onClick={() => {
//                   navigate("/transactionHistory");
//                 }}
//               >
//                 {" "}
//                 <img src={Dollar}></img> Transactions
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 variant="outlined"
//                 id="expense"
//                 className={classes.button}
//                 onClick={() => {
//                   navigate("/ownerDocuments");
//                 }}
//               >
//                 {" "}
//                 <img src={File_dock_fill}></img> Documents
//               </Button>
//             </Grid>
//               <Grid item xs={6}>
//                 <Button
//                   variant="outlined"
//                   id="maintenance"
//                   className={classes.button}
//                   onClick={() => {
//                     navigate("/ownerContacts");
//                   }}
//                 >
//                   {" "}
//                   <img src={User_fill_dark}></img> Contacts
//                 </Button>
//               </Grid>
//               <Grid item xs={6}>
//                 <Button
//                   variant="outlined"
//                   id="revenue"
//                   className={classes.button}
//                   style={{
//                     height: "100%",
//                   }}
//                   onClick={() => {
//                     navigate("/payments");
//                   }}
//                 >
//                   {/* <img src={User_fill_dark} alt="Payments" /> */}
//                   <CurrencyExchangeIcon sx={{ paddingRight: "5px" }} />
//                   Pay Bills
//                 </Button>
//             </Grid>
//           </Grid>
//         </div>
//         <br />
//       </div>
//       {/* } */}
//       <Dialog open={showReferralWelcomeDialog} onClose={() => setShowReferralWelcomeDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
//         {/* <DialogTitle id="alert-dialog-title">Referral Sent</DialogTitle> */}
//         <DialogContent>                
//           <DialogContentText
//             id="alert-dialog-description"
//             sx={{
//               color: theme.typography.common.blue,
//               fontWeight: theme.typography.common.fontWeight,
//               paddingTop: "10px",
//             }}
//           >
//             Hello, {user.first_name}!. Welcome to ManifestMySpace. To complete your profile setup, please verify your information by clicking the profile button below. You'll need to add additional details such as your SSN and address. Thank you!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
//           <Button
//             onClick={() => setShowReferralWelcomeDialog(false)}
//             sx={{
//               color: "white",
//               backgroundColor: "#3D5CAC80",
//               ":hover": {
//                 backgroundColor: "#3D5CAC",
//               },
//             }}
//             autoFocus
//           >
//             OK
//           </Button>          
//         </DialogActions>
//       </Dialog>
//     </ThemeProvider>
//   );

return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth="lg" sx={{paddingTop: '20px', paddingBottom: '50px', }}>
            <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                    <Paper
                        style={{
                            // margin: '50p', // Add margin here
                            borderRadius: '10px',
                            backgroundColor: theme.palette.primary.main,
                            height: 800,
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        Cashflow Widget
                    </Paper>
                </Grid>
                
                <Grid container item xs={12} md={8} columnSpacing={6}>
                    <Grid item xs={12} md={6}>
                        <OwnerPropertyRentWidget rentData={rentStatus} />

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MaintenanceWidget2 maintenanceData={maintenanceStatusData} />
                    </Grid>
                    <Grid item xs={12}>
                      <LeaseWidget2 leaseData={leaseStatus} />
                    </Grid>
                    <Grid item xs={12}>
                      <LeaseWidget2 leaseData={leaseStatus} />
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
            Hello, {user.first_name}!. Welcome to ManifestMySpace. To complete your profile setup, please verify your information by clicking the profile button below. You'll need to add additional details such as your SSN and address. Thank you!
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
