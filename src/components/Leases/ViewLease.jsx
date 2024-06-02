import React, { useEffect, useState, useMemo } from "react";
import theme from "../../theme/theme";
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
import { useUser } from "../../contexts/UserContext";
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
import documentIcon from "../documentIcon.png";
import Divider from "@mui/material/Divider";
import { DataGrid } from "@mui/x-data-grid";

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

const ViewLease = (props) => {
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
  const [moveOutDate, setMoveOutDate] = useState(dayjs(new Date()));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMoveOut(formatDate(moveOutDate));
  }, [moveOutDate]);

  const closeEndLeaseDialog = () => {
    setEndLeaseDialogOpen(false);
  };

  const closeRenewLeaseDialog = () => {
    setRenewLeaseDialogOpen(false);
  };

  const handleViewButton = (link) => {
    // console.log("LEASE DATA - documents: ", JSON.parse(leaseData.lease_documents));
    window.open(link, "_blank", "rel=noopener noreferrer");
  };

  const handleEndLease = () => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "*",
    };

    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
    leaseApplicationFormData.append("move_out_date", formatDate(moveOut));
    leaseApplicationFormData.append("lease_status", "END-REQUEST");

    axios
      .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication", leaseApplicationFormData, headers)
      .then((response) => {
        console.log("Data updated successfully");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        }
      });
    const sendAnnouncement = async () => {
      try {
        const receiverPropertyMapping = {
          [leaseData.business_uid]: [leaseData.lease_property_id],
        };

        await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            announcement_title: "End Lease Request from Tenant",
            // announcement_msg: `Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease.`,
            announcement_msg: endLeaseAnnouncement ? endLeaseAnnouncement : "",
            announcement_sender: getProfileId(),
            announcement_date: new Date().toDateString(),
            // announcement_properties: property.property_uid,
            announcement_properties: JSON.stringify(receiverPropertyMapping),
            announcement_mode: "LEASE",
            announcement_receiver: [leaseData.business_uid],
            announcement_type: ["Text", "Email"],
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };
    sendAnnouncement();
    setEndLeaseDialogOpen(false);
    setConfirmEndLeaseDialogOpen(false);
    navigate(-1);
  };
  const leaseID = location.state.lease_id; //'300-000005';
  const propertyUID = location.state.property_uid;

  // console.log(location.state)
  // console.log("leaseID", leaseID)
  // console.log("propertyUID", propertyUID)

  useEffect(() => {
    setShowSpinner(true);
    // axios.get(`http://localhost:4000/leaseDetails/${getProfileId()}`).then((res) => {
    axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`).then((res) => {
      const data = res.data["Lease_Details"].result;
      // setFetchData(data);
      data.forEach((lease) => {
        if (lease.lease_uid === leaseID) {
          console.log(JSON.parse(lease.lease_fees));
          console.log(JSON.parse(lease.property_utilities));
          console.log(JSON.parse(lease.lease_documents));
          setLeaseFees(JSON.parse(lease.lease_fees));
          setLeaseDocuments(JSON.parse(lease.lease_documents));
          const utilities = JSON.parse(lease.property_utilities);

          const utils = utilities.map((utility) => utility.utility_desc).join(", ");
          // console.log(utils)
          setUtilityString(utils);

          setLeaseData(lease);
          setTenantsData(lease.tenants ? JSON.parse(lease?.tenants) : []);
          setAdultsData(lease.tenants ? JSON.parse(lease?.lease_adults) : []);
          setChildrenData(lease.tenants ? JSON.parse(lease?.lease_children) : []);
          setVehiclesData(lease.tenants ? JSON.parse(lease?.lease_vehicles) : []);
          setPetsData(lease.tenants ? JSON.parse(lease?.lease_pets) : []);

          console.log("Lease data", lease);
          console.log("lease fees", lease.leaseFees);
          // setDocument(lease.lease_documents);
        }
      });
      setShowSpinner(false);
    });
  }, []);

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

  const handleRenewLease = () => {
    navigate("/editLease", {
      state: {
        leaseData: leaseData,
      },
    });
  };

  const handleToggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Container maxWidth="xl" sx={{ paddingBottom: "25px" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          fontFamily: "Source Sans Pro",
          justifyContent: "center",
          width: "100%",
          minHeight: "85vh",
          marginTop: theme.spacing(2),
        }}
      >
        <Grid container sx={{ paddingTop: "20px" }}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography sx={{ fontSize: { xs: "36px", sm: "36px", md: "36px", lg: "36px" }, fontWeight: "bold", color: "#160449" }}>Lease</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
              <Typography sx={{ fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "35px" }, fontWeight: "bold", color: "#160449" }}>Lease Details</Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Start Date</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {leaseData.lease_start}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>End Date</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {leaseData.lease_end}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Landlord</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>
                    {leaseData?.owner_first_name} {leaseData?.owner_last_name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Tenant Utilities</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>{utilityString}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
              <Typography sx={{ fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "35px" }, fontWeight: "bold", color: "#160449" }}>Rent Details</Typography>
              {leaseFees.map((item, index) => (
                <Grid container direction={"row"} key={index} sx={{ paddingBottom: "10px" }}>
                  <Grid item xs={12} sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                    <Typography sx={{ color: "#3D5CAC", fontSize: "26px", fontWeight: 700 }}>{item.fee_name ? item.fee_name : "None"}</Typography>
                  </Grid>
                  <Grid container sx={{ marginLeft: "15px" }}>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Amount</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {`$${item.charge}` || "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Frequency</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {item.frequency ? item.frequency : "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Late Fee After</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>{item.late_by ? `${item.late_by} days` : "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Late Fee After Per Day</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>{`$${item.late_fee}` ?? "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Rent Due Date</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>{item.due_by ? `${item.due_by} of month` : "None"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Available to Pay</Typography>
                      <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>
                        {" "}
                        {item.available_topay ? `${item.available_topay} days before` : "None"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
              <Typography sx={{ fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "35px" }, fontWeight: "bold", color: "#160449" }}>Occupancy Details</Typography>
              <Grid container>
                <Grid item xs={12}>
                  <TenantsDataGrid data={tenantsData} />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}>Move In Date</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {leaseData?.lease_move_in_date ?? "Not Specified"} </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}># of Occupants</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>
                    {" "}
                    {leaseData ? countNoOfOccupents(leaseData) || "None" : "Null"}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}># of Pets </Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}> {leaseData ? CountNoOfPets(leaseData) || "None" : "Null"} </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700 }}># of Vehicles</Typography>
                  <Typography sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "80%" }}>
                    {" "}
                    {leaseData ? CountNoOfVehicles(leaseData) || "None" : "Null"}{" "}
                  </Typography>
                </Grid>
                {/* <Grid>
                  <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700, cursor: "pointer" }} onClick={handleToggleAccordion}>
                    Show All Tenant Details
                  </Typography>
                </Grid> */}
                <Accordion expanded={expanded} onChange={handleToggleAccordion}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography sx={{ color: "#3D5CAC", fontSize: "18px", fontWeight: 700, cursor: "pointer" }} onClick={handleToggleAccordion}>
                      Show All Tenant Details
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {adultsData.length > 0 ? (
                      <Grid item xs={12}>
                        <Typography>Adults</Typography>
                        <AdultsDataGrid data={adultsData} />
                      </Grid>
                    ) : (
                      <Typography>No Adult details available.</Typography>
                    )}
                  </AccordionDetails>

                  <AccordionDetails>
                    {childrenData.length > 0 ? (
                      <Grid item xs={12}>
                        <Typography>Children</Typography>
                        <ChildrenDataGrid data={childrenData} />
                      </Grid>
                    ) : (
                      <Typography>No Children details available.</Typography>
                    )}
                  </AccordionDetails>

                  <AccordionDetails>
                    {petsData.length > 0 ? (
                      <Grid item xs={12}>
                        <Typography>Pets</Typography>
                        <PetsDataGrid data={petsData} />
                      </Grid>
                    ) : (
                      <Typography>No Adult details available.</Typography>
                    )}
                  </AccordionDetails>

                  <AccordionDetails>
                    {vehiclesData.length > 0 ? (
                      <Grid item xs={12}>
                        <Typography>Vehicles</Typography>
                        <VehiclesDataGrid data={vehiclesData} />
                      </Grid>
                    ) : (
                      <Typography>No Vehicle details available.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: "#F2F2F2", display: "flex", flexDirection: "column", padding: "25px", borderRadius: "5px" }}>
              <Typography sx={{ fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "35px" }, fontWeight: "bold", color: "#160449" }}>Lease Documents</Typography>
              {leaseDocuments.map((document, index) => (
                <Box key={index} sx={{ cursor: "pointer", display: "flex", alignContent: "center", alignItems: "center" }} onClick={() => handleViewButton(document.link)}>
                  <img src={documentIcon} style={{ width: "20px", height: "25px", margin: "5px", paddingRight: "5px" }} />
                  <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#3D5CAC" }}>{document.filename}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            {(selectedRole === "MANAGER" || selectedRole === "TENANT") && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative" sx={{ paddingTop: "15px" }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.common.fontWeight,
                    backgroundColor: theme.palette.custom.pink,
                    margin: "10px",
                    ":hover": {
                      backgroundColor: darken(theme.palette.custom.pink, 0.2),
                    },
                  }}
                  onClick={() => setEndLeaseDialogOpen(true)}
                >
                  End Lease
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.common.fontWeight,
                    backgroundColor: theme.palette.custom.blue,
                    margin: "10px",
                    ":hover": {
                      backgroundColor: darken(theme.palette.custom.blue, 0.2),
                    },
                  }}
                  onClick={() => {
                    setRenewLeaseDialogOpen(true);
                  }}
                >
                  Renew Lease
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog open={endLeaseDialogOpen} onClose={closeEndLeaseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
            }}
          >
            Please select a Move-Out Date
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                value={moveOutDate}
                onChange={(newValue) => setMoveOutDate(newValue)}
                disablePast={true}
                sx={{
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
                renderInput={(params) => <TextField className={classes.root} {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmEndLeaseDialogOpen(true)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            Next
          </Button>
          <Button
            onClick={() => setEndLeaseDialogOpen(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={renewLeaseDialogOpen} onClose={closeRenewLeaseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Confirm Renew Lease</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Are you sure you want to renew the lease?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleRenewLease(leaseData)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => setRenewLeaseDialogOpen(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmEndLeaseDialog
        leaseData={leaseData}
        dialogOpen={confirmEndLeaseDialogOpen}
        setDialogOpen={setConfirmEndLeaseDialogOpen}
        handleEndLease={handleEndLease}
        setEndLeaseAnnouncement={setEndLeaseAnnouncement}
      />
    </Container>
  );
};

function countNoOfOccupents(leaseData) {
  let adultNo = leaseData.lease_adults ? JSON.parse(leaseData.lease_adults) : [];
  let ChildNo = leaseData.lease_children ? JSON.parse(leaseData.lease_children) : [];

  let no_of_occupants = 0;
  if (adultNo) {
    // console.log("Adults: ", JSON.parse(leaseData.lease_adults));
    console.log("Adults: ", adultNo);
    no_of_occupants += adultNo.length;
  }
  if (ChildNo) {
    no_of_occupants += ChildNo.length;
  }
  return no_of_occupants;
}

function CountNoOfPets(leaseData) {
  let pets = leaseData.lease_pets ? JSON.parse(leaseData.lease_pets) : [];
  return pets.length;
}
function CountNoOfVehicles(leaseData) {
  let vehicles = leaseData.lease_vehicles ? JSON.parse(leaseData.lease_vehicles) : [];
  return vehicles.length;
}

function getTenantName(leaseData) {
  let name = "";

  let tenants = leaseData.tenants ? JSON.parse(leaseData.tenants) : [];

  console.log(tenants);
  name += tenants && tenants[0] ? tenants[0].tenant_first_name : "";
  if (name.length > 0) {
    name += " ";
  }
  name += tenants && tenants[0] ? tenants[0].tenant_last_name : "";

  return name;
}
export default ViewLease;

const ConfirmEndLeaseDialog = ({ leaseData, dialogOpen, setDialogOpen, handleEndLease, setEndLeaseAnnouncement }) => {
  // const [endLeaseAnnouncement, setEndLeaseAnnouncement] = useState('');

  const getConfirmEndLeaseDialogText = (leaseData) => {
    const currentDate = new Date();
    const noticePeriod = leaseData.lease_end_notice_period ? leaseData.lease_end_notice_period : 30; //30 by default
    // const moveOutDate = new Date(moveOut);
    const leaseEndDate = new Date(leaseData.lease_end);

    const noticeDate = new Date(leaseEndDate);
    noticeDate.setDate(leaseEndDate.getDate() - noticePeriod);
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + noticePeriod);
    const newLeaseEndDate = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0);

    if (leaseData.lease_status === "ACTIVE") {
      if (currentDate < noticeDate) {
        // setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(leaseEndDate)}`);
        return `Your lease will end on ${formatDate(
          leaseEndDate
        )} and you are responsible for rent payments until the end of the lease. Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
      } else {
        // setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(newLeaseEndDate)}`);
        return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${formatDate(
          newLeaseEndDate
        )} and you will be responsible for payments through that date. Are you sure you want to end the lease?`;
      }
    } else if (leaseData.lease_status === "ACTIVE-M2M") {
      if (currentDate < noticeDate) {
        // setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(leaseEndDate)}`);
        return `Your lease will end on ${formatDate(
          leaseEndDate
        )} and you are responsible for rent payments until the end of the lease. Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
      } else {
        // setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(newLeaseEndDate)}`);
        return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${formatDate(
          newLeaseEndDate
        )} and you will be responsible for payments through that date. Are you sure you want to end the lease?`;
      }
    } else {
      return 'ERROR: lease status is not "ACTIVE" or "ACTIVE-M2M"';
    }
  };

  const memoizedDialogText = useMemo(() => getConfirmEndLeaseDialogText(leaseData), [leaseData]);

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">End Lease Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            color: theme.typography.common.blue,
            fontWeight: theme.typography.common.fontWeight,
          }}
        >
          {memoizedDialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleEndLease()}
          sx={{
            color: "white",
            backgroundColor: "#3D5CAC80",
            ":hover": {
              backgroundColor: "#3D5CAC",
            },
          }}
          autoFocus
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
          sx={{
            color: "white",
            backgroundColor: "#3D5CAC80",
            ":hover": {
              backgroundColor: "#3D5CAC",
            },
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TenantsDataGrid = ({ data }) => {
  const columns = [
    { field: "tenant_uid", headerName: "UID", width: 150 },
    { field: "tenant_first_name", headerName: "First Name", width: 150 },
    { field: "tenant_last_name", headerName: "Last Name", width: 150 },
    { field: "tenant_email", headerName: "Email", width: 200 },
    { field: "tenant_phone_number", headerName: "Phone Number", width: 150 },
    { field: "lt_responsibility", headerName: "Responsibility", width: 150 },
  ];

  console.log("TenantsDataGrid - props.data - ", data);

  return (
    <>
      <DataGrid
        rows={data}
        getRowId={(row) => row.tenant_uid}
        columns={columns}
        sx={{
          border: "0px",
        }}
      />
    </>
  );
};

const AdultsDataGrid = ({ data }) => {
  const columns = [
    { field: "dob", headerName: "Date of Birth", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "relationship", headerName: "Relationship", width: 150 },
  ];

  console.log("AdultsDataGrid - props.data - ", data);

  return (
    <>
      <DataGrid
        rows={data}
        getRowId={(index) => index}
        columns={columns}
        sx={{
          border: "0px",
        }}
      />
    </>
  );
};

const ChildrenDataGrid = ({ data }) => {
  const columns = [
    { field: "dob", headerName: "Date of Birth", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "relationship", headerName: "Relationship", width: 150 },
  ];

  console.log("AdultsDataGrid - props.data - ", data);

  return (
    <>
      <DataGrid
        rows={data}
        getRowId={(index) => index}
        columns={columns}
        sx={{
          border: "0px",
        }}
      />
    </>
  );
};

const PetsDataGrid = ({ data }) => {
  const columns = [
    { field: "type", headerName: "Type", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "breed", headerName: "Breed", width: 150 },
    { field: "weight", headerName: "Weight", width: 150 },
  ];

  console.log("PetsDataGrid - props.data - ", data);

  return (
    <>
      <DataGrid
        rows={data}
        getRowId={(index) => index}
        columns={columns}
        sx={{
          border: "0px",
        }}
      />
    </>
  );
};

const VehiclesDataGrid = ({ data }) => {
  const columns = [
    { field: "year", headerName: "Year", width: 150 },
    { field: "make", headerName: "Make", width: 150 },
    { field: "model", headerName: "Model", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "license", headerName: "License Plate", width: 150 },
  ];

  console.log("VehiclesDataGrid - props.data - ", data);

  return (
    <>
      <DataGrid
        rows={data}
        getRowId={(index) => index}
        columns={columns}
        sx={{
          border: "0px",
        }}
      />
    </>
  );
};
