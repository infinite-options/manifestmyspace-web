import {
  ThemeProvider,
  Box,
  Paper,
  Stack,
  Typography,
  Grid,
  Divider,
  Button,
  ButtonGroup,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import backButton from "../../Payments/backIcon.png";
import theme from "../../../theme/theme";

function TenantLeases(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getProfileId } = useUser();
  const [tenantLeases, setTenantLeases] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [property, setProperty] = useState(location.state.property);
  const [status, setStatus] = useState(location.state.status);
  const [lease, setLease] = useState(location.state.lease);

  const [pets, setPets] = useState(JSON.parse(lease.lease_pets));
  const [vehicles, setVehicles] = useState(JSON.parse(lease.lease_vehicles));
  const [adultOccupants, setAdultOccupants] = useState(JSON.parse(lease.lease_adults));
  const [childrenOccupants, setChildrenOccupants] = useState(JSON.parse(lease.lease_children));
  const [fees, setFees] = useState(JSON.parse(lease.leaseFees));

  useEffect(() => {
    console.log("property", property);
    console.log("status", status);
    console.log("lease", lease);
    console.log("fees", fees);

    async function fetchData() {
      console.log("In fetch data");
      const leaseResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`);

      if (!leaseResponse.ok) {
        // Handle the error as needed (maybe set an error state or log the error)
        console.error("API call failed");
        setShowSpinner(false);
        return;
      }
      const leaseData = await leaseResponse.json();
      console.log("leaseData.Lease_Details.result", leaseData.Lease_Details.result);
    }

    fetchData();
  }, []);

  const CenteringBox = ({ children, flexDirection = "column", justifyContent = "flex-start" }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: justifyContent,
        alignItems: "center",
        flexDirection: flexDirection,
        height: "100%",
      }}
    >
      {children}
    </Box>
  );

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

  function displayPropertyAddress() {
    if (lease.property_unit) {
      return (
        <>
          {lease.property_address} #{lease.property_unit} {lease.property_city}, {lease.property_state} {lease.property_zipcode}
        </>
      );
    } else {
      return (
        <>
          {lease.property_address} {lease.property_city} {lease.property_state} {lease.property_zipcode}
        </>
      );
    }
  }

  async function handleTenantRefuse() {
    const leaseApplicationFormData = new FormData();

    leaseApplicationFormData.append("lease_uid", lease.lease_uid);
    leaseApplicationFormData.append("lease_status", "REFUSED");

    try {
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
        method: "PUT",
        body: leaseApplicationFormData,
      });
      const data = await response.json();
      if (data.lease_update.code === 200) {
        navigate("/listings");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }


    const sendAnnouncement = async () => {
        try {
            const receiverPropertyMapping = {            
                [property.contract_business_id]: [property.property_uid],
              };
          
            //   await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
                await fetch(`http://localhost:4000/announcements/${getProfileId()}`, { //rohit
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  announcement_title: "Lease Rejected by Tenant",
                  announcement_msg: `Lease for ${property.property_address}, Unit -${property.property_unit} has been rejected by the Tenant.`,
                  announcement_sender: getProfileId(),
                  announcement_date: new Date().toDateString(),
                  // announcement_properties: property.property_uid,
                  announcement_properties: JSON.stringify(receiverPropertyMapping),        
                  announcement_mode: "LEASE",
                  announcement_receiver: [property.contract_business_id],
                  announcement_type: ["Text", "Email"],
                }),
              });
          } catch (error) {
            console.log(error);
          }


    }
    sendAnnouncement();
  }

  async function handleTenantAccept() {
    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", lease.lease_uid);

    try {
      var status = "TENANT APPROVED";
      const date = new Date();

      if (lease.lease_effective_date < date) {
        status = "ACTIVE";
      }
      leaseApplicationFormData.append("lease_status", status);
      const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
        method: "PUT",
        body: leaseApplicationFormData,
      });
      const data = await response.json();
      if (data.lease_update.code === 200) {
        navigate("/listings");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }

    const sendAnnouncement = async () => {
        try {
            const receiverPropertyMapping = {            
                [property.contract_business_id]: [property.property_uid],
              };
          
            //   await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
                await fetch(`http://localhost:4000/announcements/${getProfileId()}`, { //rohit
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  announcement_title: "Lease Accepted by Tenant",
                  announcement_msg: `Lease for ${property.property_address}, Unit -${property.propery_unit} has been accepted by the Tenant.`,
                  announcement_sender: getProfileId(),
                  announcement_date: new Date().toDateString(),
                  // announcement_properties: property.property_uid,
                  announcement_properties: JSON.stringify(receiverPropertyMapping),        
                  announcement_mode: "LEASE",
                  announcement_receiver: [property.contract_business_id],
                  announcement_type: ["Text", "Email"],
                }),
              });
          } catch (error) {
            console.log(error);
          }


    }
    sendAnnouncement();
  }

  const getDateAdornmentString = (d) => {
    if (d === null || d === 0) return "";
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const biweeklyDueByValuetoDayMap = {
    0: "Monday - week 1",
    1: "Tuesday - week 1",
    2: "Wednesday - week 1",
    3: "Thursday - week 1",
    4: "Friday - week 1",
    5: "Saturday - week 1",
    6: "Sunday - week 1",
    7: "Monday - week 2",
    8: "Tuesday - week 2",
    9: "Wednesday - week 2",
    10: "Thursday - week 2",
    11: "Friday - week 2",
    12: "Saturday - week 2",
    13: "Sunday - week 2",
  };

  const weeklyDueByValuetoDayMap = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
  };

  const getFeesDueBy = (fee) => {
    if (fee.frequency === "Bi-Weekly") {
      return biweeklyDueByValuetoDayMap[fee.due_by];
    } else if (fee.frequency === "Weekly") {
      return weeklyDueByValuetoDayMap[fee.due_by];
    } else if (fee.frequency === "Monthly") {
      return `${fee.due_by}${getDateAdornmentString(fee.due_by)} of the month`;
    } else if (fee.frequency === "One-time" || fee.frequency === "Annually") {
      return `${fee.due_by_date}`;
    } else {
      return "-";
    }
  };

  const getFeesLateBy = (fee) => {
    if (fee.frequency === "Bi-Weekly" || fee.frequency === "Weekly" || fee.frequency === "Monthly" || fee.frequency === "Annually" || fee.frequency === "One-time") {
      return `${fee.late_by}${getDateAdornmentString(fee.late_by)} day after due`;
    } else {
      return "-";
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "Source Sans Pro",
        padding: "10px",
      }}
    >
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container>
        <Grid item xs={2}>
          <Button
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              textDecoration: "underline",
            }}
          >
            <img src={backButton} style={{ width: "20px", height: "20px", margin: "5px" }} />
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              color: "#160449",
            }}
          >
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.primary.black,
                fontWeight: theme.typography.medium.fontWeight,
                fontSize: "25px",
              }}
            >
              Lease
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          Help Icon
        </Grid>
        <Grid item xs={12}>
          <CenteringBox>
            <Typography sx={{ color: theme.typography.common.black, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
              {displayPropertyAddress()}
            </Typography>
          </CenteringBox>
        </Grid>
      </Grid>
      <Paper
        style={{
          margin: "30px",
          backgroundColor: theme.palette.primary.main,
          padding: "10px",
        }}
      >
        <Grid
          container
          rowSpacing={2}
          sx={{
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Grid item xs={12}>
            <CenteringBox>
              <Typography sx={{ color: theme.typography.common.black, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                Viewing Current Lease
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>Start Date</Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {lease.lease_start}
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                Move In Date
              </Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {lease.lease_move_in_date ? lease.lease_move_in_date : "No Move In Date"}
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>End Date</Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {lease.lease_end}
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                # of Occupants
              </Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {JSON.parse(lease.lease_adults).length + JSON.parse(lease.lease_children).length}
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}># of Pets</Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {JSON.parse(lease.lease_pets).length}
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={4}>
            <CenteringBox justify_content="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                # of Vehicles
              </Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                {JSON.parse(lease.lease_vehicles).length}
              </Typography>
            </CenteringBox>
          </Grid>

          <Grid container>
            <Grid item xs={1}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Fee</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={2}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Amount</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={2}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Frequency</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={2}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Due By</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={2}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Late By</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={1}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Late Fee</Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={2}>
              <CenteringBox>
                <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.mediumFont }}>Per Day Fee</Typography>
              </CenteringBox>
            </Grid>
          </Grid>
          {fees &&
            fees.map((fee, index) => (
              <Grid container key={index}>
                <Divider sx={{ width: "100%", borderWidth: "1px", borderColor: "#D6D5DA" }} />
                <Grid item xs={1}>
                  <Box>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.mediumFont }}>
                      {/* {lease.fees[key].fee_name} */}
                      {fee.fee_name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      paddingRight: "40px",
                    }}
                  >
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] ? <> {lease.fees[key].fee_type}{lease.fees[key].charge} </> : "N/A"} */}
                      {fee.charge}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <CenteringBox>
                    {/* <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Frequency
                                    </Typography> */}
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] ? <> {lease.fees[key].frequency} </> : "N/A"} */}
                      {fee.frequency}
                    </Typography>
                  </CenteringBox>
                </Grid>
                <Grid item xs={2}>
                  <CenteringBox>
                    {/* <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Due By
                                    </Typography> */}
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] && lease.fees[key].due_by ? <> {getDayText(lease.fees[key].due_by)} of the month </> : "N/A"} */}
                      {getFeesDueBy(fee)}
                    </Typography>
                  </CenteringBox>
                </Grid>
                <Grid item xs={2}>
                  <CenteringBox>
                    {/* <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Late By
                                    </Typography> */}
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] && lease.fees[key].late_by ? <> {getDayText(lease.fees[key].late_by)} of the month</> : "N/A"} */}
                      {getFeesLateBy(fee)}
                    </Typography>
                  </CenteringBox>
                </Grid>
                <Grid item xs={1}>
                  <CenteringBox>
                    {/* <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Late Fee
                                    </Typography> */}
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] ? <> {lease.fees[key].fee_type}{lease.fees[key].late_fee}</> : "N/A"} */}
                      {fee.late_fee}
                    </Typography>
                  </CenteringBox>
                </Grid>
                <Grid item xs={2}>
                  <CenteringBox>
                    {/* <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Per Day Fee
                                    </Typography> */}
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                      {/* {lease.fees[key] ? <> {lease.fees[key].fee_type}{lease.fees[key].perDay_late_fee}</> : "N/A"} */}
                      {fee.perDay_late_fee}
                    </Typography>
                  </CenteringBox>
                </Grid>
              </Grid>
            ))}

          <Grid item xs={6}>
            <CenteringBox justifyContent="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>Utilities</Typography>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                Gas | Electricity | Water | Trash
              </Typography>
            </CenteringBox>
          </Grid>
          <Grid item xs={6}>
            <CenteringBox justifyContent="flex-start">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                <Box>
                  <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.96875 1.1875C8.96875 1.12948 8.9457 1.07384 8.90468 1.03282C8.86366 0.991797 8.80802 0.96875 8.75 0.96875H2.625C1.98682 0.96875 1.37478 1.22226 0.923524 1.67352C0.472265 2.12478 0.21875 2.73682 0.21875 3.375V15.625C0.21875 16.2632 0.472265 16.8752 0.923524 17.3265C1.37478 17.7777 1.98682 18.0312 2.625 18.0312H11.375C12.0132 18.0312 12.6252 17.7777 13.0765 17.3265C13.5277 16.8752 13.7812 16.2632 13.7812 15.625V7.00363C13.7812 6.94561 13.7582 6.88997 13.7172 6.84895C13.6762 6.80792 13.6205 6.78488 13.5625 6.78488H9.625C9.45095 6.78488 9.28403 6.71573 9.16096 6.59266C9.03789 6.46959 8.96875 6.30267 8.96875 6.12863V1.1875ZM9.625 9.71875C9.79905 9.71875 9.96597 9.78789 10.089 9.91096C10.2121 10.034 10.2812 10.201 10.2812 10.375C10.2812 10.549 10.2121 10.716 10.089 10.839C9.96597 10.9621 9.79905 11.0312 9.625 11.0312H4.375C4.20095 11.0312 4.03403 10.9621 3.91096 10.839C3.78789 10.716 3.71875 10.549 3.71875 10.375C3.71875 10.201 3.78789 10.034 3.91096 9.91096C4.03403 9.78789 4.20095 9.71875 4.375 9.71875H9.625ZM9.625 13.2188C9.79905 13.2188 9.96597 13.2879 10.089 13.411C10.2121 13.534 10.2812 13.701 10.2812 13.875C10.2812 14.049 10.2121 14.216 10.089 14.339C9.96597 14.4621 9.79905 14.5312 9.625 14.5312H4.375C4.20095 14.5312 4.03403 14.4621 3.91096 14.339C3.78789 14.216 3.71875 14.049 3.71875 13.875C3.71875 13.701 3.78789 13.534 3.91096 13.411C4.03403 13.2879 4.20095 13.2188 4.375 13.2188H9.625Z"
                      fill="#3D5CAC"
                    />
                  </svg>
                  <Box sx={{ paddingLeft: "5px" }}>View Lease</Box>
                </Box>
              </Typography>
            </CenteringBox>
          </Grid>

          <Grid item xs={6}>
            <CenteringBox>
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#CB8E8E",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  minWidth: "90px",
                  width: "150px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#160449",
                  textTransform: "none",
                }}
                onClick={() => handleTenantRefuse()}
              >
                Reject Lease
              </Button>
            </CenteringBox>
          </Grid>
          <Grid item xs={6}>
            <CenteringBox>
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#9EAED6",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  minWidth: "90px",
                  width: "150px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#160449",
                  textTransform: "none",
                }}
                onClick={() => handleTenantAccept()}
              >
                Accept Lease
              </Button>
            </CenteringBox>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
export default TenantLeases;
