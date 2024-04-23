import { Chart } from "react-google-charts";
import { Button, Box, ThemeProvider } from "@mui/material";
import { PieChart, Pie, Legend, Cell } from "recharts";
import CashflowWidget from "./Dashboard-Components/Cashflow/CashflowWidget";
import MaintenanceWidget from "./Dashboard-Components/Maintenance/MaintenanceWidget";
import "../css/maintenance.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../theme/theme";
import Dollar from "../images/Dollar.png";
import File_dock_fill from "../images/File_dock_fill.png";
import User_fill_dark from "../images/User_fill_dark.png";
import { useUser } from "../contexts/UserContext";
import PropertyRentWidget from "./Dashboard-Components/PropertyRent/PropertyRentWidget";
import LeaseWidget from "./Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import APIConfig from "../utils/APIConfig";

export default function OwnerDashboard() {
  const { user, getProfileId } = useUser();
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
  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="mt-widget-main">
        <CashflowWidget />
        <div className="mt-container">
          <MaintenanceWidget maintenanceData={maintenanceStatusData} />
          <PropertyRentWidget rentData={rentStatus} />
        </div>

        <div className="mt-container">
          <LeaseWidget leaseData={leaseStatus} />
        </div>

        <div className="bottom-buttons">
          <Button
            variant="outlined"
            id="revenue"
            className="bottom-item"
            onClick={() => {
              navigate("/transactionHistory");
            }}
          >
            {" "}
            <img src={Dollar}></img> Transactions
          </Button>
          <Button
            variant="outlined"
            id="expense"
            className="bottom-item"
            onClick={() => {
              navigate("/ownerDocuments");
            }}
          >
            {" "}
            <img src={File_dock_fill}></img> Documents
          </Button>
          <Button
            variant="outlined"
            id="maintenance"
            className="bottom-item"
            onClick={() => {
              navigate("/ownerContacts");
            }}
          >
            {" "}
            <img src={User_fill_dark}></img> Contacts
          </Button>
        </div>
        <br />
      </div>
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
