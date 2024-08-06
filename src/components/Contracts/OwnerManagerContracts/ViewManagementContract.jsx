import React, { useEffect, useState, useMemo } from "react";
import theme from "../../../theme/theme";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  ThemeProvider,
  Grid,
  Container,
  Box,
  Stack,
  Typography,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  InputAdornment,
} from "@mui/material";
import { CalendarToday, Close, Description, ExpandMore } from "@mui/icons-material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowBack, Chat, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@material-ui/core/styles";
import { darken } from "@mui/material/styles";
import documentIcon from "../../documentIcon.png";
import Divider from "@mui/material/Divider";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      border: 0,
      borderRadius: 3,
      color: "#3D5CAC",
      fontSize: 50,
    },
  },
}));

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("-");
}

const ViewManagementContract = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProfileId, selectedRole } = useUser();

  const [moveOut, setMoveOut] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [leaseFees, setLeaseFees] = useState([]);
  const [utilityString, setUtilityString] = useState("");
  const [leaseData, setLeaseData] = useState([]);
  const [tenantsData, setTenantsData] = useState([]);
  const [adultsData, setAdultsData] = useState([]);
  const [childrenData, setChildrenData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [petsData, setPetsData] = useState([]);
  const [leaseDocuments, setLeaseDocuments] = useState([]);
  const [endLeaseDialogOpen, setEndLeaseDialogOpen] = useState(false);
  const [confirmEndLeaseDialogOpen, setConfirmEndLeaseDialogOpen] = useState(false);
  const [renewLeaseDialogOpen, setRenewLeaseDialogOpen] = useState(false);
  const [endLeaseAnnouncement, setEndLeaseAnnouncement] = useState("");
  // const [moveOutDate, setMoveOutDate] = useState(dayjs(new Date()));
  const [moveOutDate, setMoveOutDate] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  const [index, setIndex] = useState(props.index);
  const [contractFees, setContractFees] = useState([]);
  const [contractDocuments, setContractDocuments] = useState([]);

  // const [leaseID, setLeaseID] = useState("");

  const handleViewButton = (link) => {
    // console.log("LEASE DATA - documents: ", JSON.parse(leaseData.lease_documents));
    window.open(link, "_blank", "rel=noopener noreferrer");
  };

  // console.log(location.state)
  // console.log("leaseID", leaseID)
  // console.log("propertyUID", propertyUID)

  //   const leaseID = props.lease_id ? props.lease_id : location.state.lease_id;
  //   const propertyUID = props.lease_id ? props.property_uid : location.state.property_uid;
  //   const isDesktop = props.lease_id ? props.isDesktop : location.state.isDesktop;
  //   const index = props.lease_id ? props.index : location.state.index;

  const propertyList = props.propertyList ? props.propertyList : [];
  useEffect(() => {
    const index = props.index;
    setIndex(index);
    // console.log("ROHIT - propertyList - ", propertyList);
    // console.log("ROHIT - index - ", index);

    const contractFees = propertyList[index]?.contract_fees ? JSON.parse(propertyList[index]?.contract_fees) : [];
    setContractFees(contractFees);

    const contractDocuments = propertyList[index]?.contract_documents ? JSON.parse(propertyList[index]?.contract_documents) : [];
    setContractDocuments(contractDocuments);
  }, [props.index]);

  function getDayText(day) {
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  const handleCloseButton = (e) => {
    e.preventDefault();
    props.onBackClick();
  };

  const handleToggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Container maxWidth='xl' sx={{ paddingBottom: "25px" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Grid container sx={{ paddingTop: "20px" }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <Typography sx={{ fontSize: { xs: "24px", sm: "24px", md: "24px", lg: "24px" }, fontWeight: "bold", color: "#160449" }}>Contract</Typography>
            <Box position='absolute' right={20}>
              <Button onClick={(e) => handleCloseButton(e)}>
                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px" }} />
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
            <Typography sx={{ fontSize: { xs: "24px", sm: "24px", md: "24px", lg: "24px" }, fontWeight: "bold", color: "#160449" }}>Contract Details</Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Contract Name</Typography>
                <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {propertyList[index]?.contract_name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Contract Status</Typography>
                <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {propertyList[index]?.contract_status}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Start Date</Typography>
                <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {propertyList[index]?.contract_start_date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>End Date</Typography>
                <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {propertyList[index]?.contract_end_date}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
            <Typography sx={{ fontSize: { xs: "24px", sm: "24px", md: "24px", lg: "24px" }, fontWeight: "bold", color: "#160449" }}>Contract Fees</Typography>
            {contractFees?.map((item, index) => (
              <Grid container direction={"row"} key={index} sx={{ paddingBottom: "10px" }}>
                <Grid item xs={12} sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "24px", fontWeight: 700 }}>{item.fee_name ? item.fee_name : "None"}</Typography>
                </Grid>
                {/* <Grid item xs={12} sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                    <Typography sx={{ color: "#3D5CAC", fontSize: "24px", fontWeight: 700 }}>{item.fee_type ? item.fee_type : "None"}</Typography>
                  </Grid>  */}
                {item.fee_type === "PERCENT" && (
                  <Grid container sx={{ marginLeft: "10px" }}>
                    <Grid item xs={4}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Amount</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {`${item.charge} %` || "None"}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Of</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {`${item.of}` || "None"}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Frequency</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {item.frequency ? item.frequency : "None"}</Typography>
                    </Grid>
                  </Grid>
                )}
                {item.fee_type === "FLAT-RATE" && (
                  <Grid container sx={{ marginLeft: "15px" }}>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Amount</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {`$${item.charge}` || "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Frequency</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {item.frequency ? item.frequency : "None"}</Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
            <Typography sx={{ fontSize: { xs: "24px", sm: "24px", md: "24px", lg: "24px" }, fontWeight: "bold", color: "#160449" }}>Contract Documents</Typography>
            {contractDocuments.map((document, index) => (
              <Box key={index} sx={{ cursor: "pointer", display: "flex", alignContent: "center", alignItems: "center" }} onClick={() => handleViewButton(document.link)}>
                <img src={documentIcon} style={{ width: "20px", height: "25px", margin: "5px", paddingRight: "5px" }} />
                <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#3D5CAC" }}>{document.filename}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewManagementContract;
