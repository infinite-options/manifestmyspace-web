import {
  ßChip,
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  MenuItem,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  ListItemAvatar,
} from "@mui/material";
import CardSlider from "../TenantDashboard/CardSlider";
// import PlaceholderImage from "./MaintenanceIcon.png"; // "./PlaceholderImage.png";
// import MaintenanceIcon from "./MaintenanceIcon.png";
import defaultMaintenanceImage from "../Property/maintenanceIcon.png";
import { NavigationType, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Co2Sharp, Dashboard } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article"; // For "Document"
import PhoneIcon from "@mui/icons-material/Phone"; // For "Phone"
import BuildIcon from "@mui/icons-material/Build"; // For "Maintenance"
import AddIcon from "@mui/icons-material/Add"; // For "New Request"
import { PropertyCard, PropertyListings } from "../Property/PropertyListings";
import CircleIcon from "@mui/icons-material/Circle";
import { DataGrid } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import documentIcon from "../../images/Subtract.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import NewCardSlider from "../Announcement/NewCardSlider";
import PropertyInfo from "../Property/PropertyInfo";

function DashboardTab(props) {
  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        borderRadius: "10px",
        marginTop: "7px",
        marginBottom: "7px",
        boxShadow: "0px 2px 4px #00000040",
        height: props.fullHeight ? "90%" : "auto",
      }}
    >
      {props.children}
    </Box>
  );
}

const AccountBalanceWidget = ({ selectedProperty, selectedLease, propertyAddr, propertyData, total, rentFees, lateFees, utilityFees }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const returnLeaseStatusColor = (status) => {
    const statusColorMapping = {
      ACTIVE: "#3D5CAC",
      REFUSED: "#FF8832",
      WITHDRAWN: "#FF8832",
      NEW: "#FAD102",
      PROCESSING: "#00D100",
      REJECTED: "#FA0202",
      ENDED: "#000000",
      RESCIND: "#FF8832",
    };
    // return property?.property_status ? statusColorMapping[property?.property_status] : "#ddd"
    return status ? statusColorMapping[status] : "#ddd";
  };

  const showLeaseStatusIndicator = (lease_status) => {
    return (
      <>
        {lease_status === "ACTIVE" ? <CircleIcon fontSize="small" sx={{ color: "#3D5CAC", paddingRight: "10px" }} /> : null /* blue */}
        {lease_status === "REFUSED" || lease_status === "WITHDRAWN" ? <CircleIcon fontSize="small" sx={{ color: "#FF8832", paddingRight: "10px" }} /> : null /* orange */}
        {lease_status === "NEW" ? <CircleIcon fontSize="small" sx={{ color: "#FAD102", paddingRight: "10px" }} /> : null /* yellow */}
        {lease_status === "PROCESSING" ? <CircleIcon fontSize="small" sx={{ color: "#00D100", paddingRight: "10px" }} /> : null /* green */}
        {lease_status === "REJECTED" ? <CircleIcon fontSize="small" sx={{ color: "#FA0202", paddingRight: "10px" }} /> : null /* red */}
        {lease_status === "RESCIND" ? <CircleIcon fontSize="small" sx={{ color: "#000000", paddingRight: "10px" }} /> : null /* black */}
        {lease_status === "ENDED" ? <CircleIcon fontSize="small" sx={{ color: "#2E2E2E", paddingRight: "10px" }} /> : null /* black */}
      </>
    );
  };

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleViewLeaseNavigate(lease_uid) {
    navigate("/viewLease", {
      state: {
        lease_id: lease_uid,
        // property_uid: propertyId,
      },
    });
  }

  return (
    // <>
    //   {selectedProperty === "" ? (
    //     <DashboardTab fullHeight={!isMobile ? true : false}>
    //       <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" }, fontWeight: "bold" }}>Hello World</Typography>
    //     </DashboardTab>
    //   ) : (
    <DashboardTab fullHeight={!isMobile ? true : false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          paddingRight: "0px",
          flex: "1",
        }}
      >
        <Box
          sx={{
            marginLeft: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" }, fontWeight: "bold", color: "#160449" }}>Account Balance</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                alignItems: "center",
                color: "#160449",
                // width: "100%",
              }}
            >
              <Box
                sx={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: returnLeaseStatusColor(selectedProperty?.lease_status),
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#3D5CAC",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "#3D5CAC",
                    // flexGrow: 1
                  }}
                >
                  <Typography>{propertyAddr}</Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: { xs: "35px", sm: "35px", md: "35px", lg: "55px" },
                fontWeight: "bold",
                color: "#3D5CAC",
                margin: "10px",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              ${total}
            </Box>
            <Box sx={{ fontSize: "20px", fontWeight: "600", color: "#160449", marginLeft: "5px", opacity: "50%", alignItems: "center", alignContent: "center" }}>
              Due: {selectedProperty == null || !selectedProperty.earliest_due_date ? "No Data" : selectedProperty.earliest_due_date}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItem: "center",
          justifyContent: "center",
          margin: "20px",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItem: "center",
          justifyContent: "center",
          margin: isMobile ? "10px" : "20px",
          paddingTop: isMobile ? "5px" : isMedium ? "10px" : "20px",
          paddingBottom: isMobile ? "5px" : "20px",
        }}
      >
        <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" }, fontWeight: "bold" }}>Balance Details</Typography>

        <Grid container>
          <Grid item xs={6} sx={{ color: "#3D5CAC", fontSize: "20px", fontWeight: 700 }}>
            {" "}
            Description{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#3D5CAC", fontSize: "20px", fontWeight: 700, textAlign: "right" }}>
            {" "}
            Amount{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Rent{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${rentFees}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Late Fees{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${lateFees}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Utility{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${utilityFees}{" "}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItem: "center",
          justifyContent: "center",
          margin: isMobile ? "10px" : "20px",
          paddingTop: isMobile ? "5px" : "20px",
          paddingBottom: isMobile ? "5px" : "20px",
        }}
      >
        <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" }, fontWeight: "bold" }}>Lease Details</Typography>
        <Grid container>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Start Date{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_start ? selectedLease?.lease_start : ""}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            End Date
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_end ? selectedLease?.lease_end : ""}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Address{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.property_address ? selectedLease?.property_address : ""} {selectedLease?.property_unit ? selectedLease?.property_unit : ""}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Lease UID{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_uid}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItem: "left",
          justifyContent: "left",
          margin: isMobile ? "0px" : "20px",
          paddingBottom: isMobile ? "5px" : "10px",
          cursor: "pointer",
          color: "#3D5CAC",
          fontSize: "20px",
          fontWeight: 600,
        }}
        onClick={() => handleViewLeaseNavigate(selectedLease.lease_uid)}
      >
        <img src={documentIcon} alt="document-icon" style={{ width: "15px", height: "17px", margin: "0px", paddingLeft: "15px", paddingRight: "15px" }} />
        <u>View Full Lease</u>
      </Box>
    </DashboardTab>
    //   )}
    // </>
  );
};

export default AccountBalanceWidget;
