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
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../../theme/theme";
import LeaseIcon from "../../Property/leaseIcon.png";
import APIConfig from "../../../utils/APIConfig";

function TenantLeases(props) {
  // console.log("In Tenant Leases", props);
  const location = useLocation();
  const navigate = useNavigate();
  const { getProfileId } = useUser();
  const [tenantLeases, setTenantLeases] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [property, setProperty] = useState(props.property);
  const [status, setStatus] = useState("01-01-2024");
  const [lease, setLease] = useState(props?.lease);
  // const [pets, setPets] = useState(JSON.parse(lease.lease_pets));
  // const [vehicles, setVehicles] = useState(JSON.parse(lease.lease_vehicles));
  // const [adultOccupants, setAdultOccupants] = useState(JSON.parse(lease.lease_adults));
  // const [childrenOccupants, setChildrenOccupants] = useState(JSON.parse(lease.lease_children));
  const [pets, setPets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [adultOccupants, setAdultOccupants] = useState([]);
  const [childrenOccupants, setChildrenOccupants] = useState([]);
  const [fees, setFees] = useState([]);
  const [signedLease, setSignedLease] = useState(null);

  const [managerID, setManagerID ] = useState("");

  useEffect(() => {
    console.log("Props passed to TenantLeases: ", props);
    setProperty(props.property);
    setLease(props.lease);
  }, [props.property, props.lease]);

  useEffect(() => {    
    console.log("62 - lease - ", lease);
  }, [lease]);

  useEffect(() => {    
    console.log("68 - managerID - ", managerID);
  }, [managerID]);

  useEffect(() => {
    setShowSpinner(true);
    // console.log("property", property);
    // console.log("status", status);
    console.log("lease", lease);
    // console.log("fees", fees);

    async function fetchData() {
      console.log("In fetch data");
      const leaseResponse = await fetch(`${APIConfig.baseURL.dev}/leaseDetails/${getProfileId()}`);

      if (!leaseResponse.ok) {
        // Handle the error as needed (maybe set an error state or log the error)
        console.error("API call failed");
        setShowSpinner(false);
        return;
      }
      const leaseData = await leaseResponse.json();
      console.log("leaseData.Lease_Details.result", leaseData);
      console.log("leaseData.Lease_Details.result", leaseData.Lease_Details.result);

      const properties_with_details = leaseData.Lease_Details.result;
      console.log("properties_with_details", properties_with_details);
      console.log("Lease id: ", lease.lease_uid);
      let detailed_property = properties_with_details.filter((p) => p.lease_uid === lease.lease_uid);
      console.log("Lease: ", lease);
      console.log("detailed_property", detailed_property);

      if (Array.isArray(detailed_property) && detailed_property.length > 0) {
        detailed_property = detailed_property[0];
        console.log("inside if Detailed Property: ", detailed_property);
        setPets(detailed_property.lease_pets ? JSON.parse(detailed_property?.lease_pets) : []);
        setVehicles(detailed_property.lease_vehicles ? JSON.parse(detailed_property?.lease_vehicles) : []);
        setAdultOccupants(detailed_property.lease_adults ? JSON.parse(detailed_property?.lease_adults) : []);
        setChildrenOccupants(detailed_property.lease_children ? JSON.parse(detailed_property?.lease_children) : []);
        setFees(detailed_property?.lease_fees ? JSON.parse(detailed_property.lease_fees) : []);
        setStatus(detailed_property?.lease_effective_date ?? null);
        //lease link
        const parsedDocs = JSON.parse(detailed_property.lease_documents);
        const leaseDoc = parsedDocs.find(doc => doc.type && doc.type === "Lease Agreement");
        console.log('leaselink', leaseDoc);
        setSignedLease(leaseDoc);
        setManagerID(detailed_property.contract_business_id);
      }
    }

    fetchData();
    setShowSpinner(false);
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
    console.log("leases", lease);
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

    const sendAnnouncement = async () => {
      try {
        const receiverPropertyMapping = {
          [managerID]: [property.property_uid],
        };

        await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`, {
          // await fetch(`http://localhost:4000/announcements/${getProfileId()}`, {
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
            announcement_receiver: [managerID],
            announcement_type: ["Text", "Email"],
          }),
        });
      } catch (error) {
        console.log("Error in Tenant refuse announcements:", error);
        alert("We were unable to Text the Property Manager but we were able to send them a notification through the App");

      }
    };

    try {
      const response = await fetch(`${APIConfig.baseURL.dev}/leaseApplication`, {
        method: "PUT",
        body: leaseApplicationFormData,
      });
      const data = await response.json();
      if (data.lease_update.code === 200) {
        alert("You have successfully Rejected the lease.");
        await sendAnnouncement();
        props.setRightPane({ type: "" });
        props.setReload(prev => !prev);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleTenantAccept() {
    console.log("Data we have1: ", lease);
    console.log("Data we have2: ", property);
    console.log("Data we have3: ", status);
    console.log("Data we have4: ", pets);
    // console.log("Lease Application Data1: ", leaseApplicationFormData);
    // console.log("In handle Accept: ", detailed_property?.lease_effective_date);
    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", lease.lease_uid);
    console.log("Lease Application Data2: ", leaseApplicationFormData);

    console.log("221 - property: ", property);
    console.log("221 - lease: ", lease);

    const sendAnnouncement = async () => {
      try {
        console.log("Announcements ID: ", property);
        console.log("Announcements ID: ", property.contract_business_id);
        const receiverPropertyMapping = {
          [managerID]: [property.property_uid],
        };

        await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`, {
          // await fetch(`http://localhost:4000/announcements/${getProfileId()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            announcement_title: "Lease Accepted by Tenant",
            announcement_msg: `Lease for ${property.property_address}, Unit -${property.property_unit} has been accepted by the Tenant.`,
            announcement_sender: getProfileId(),
            announcement_date: new Date().toDateString(),
            // announcement_properties: property.property_uid,
            announcement_properties: JSON.stringify(receiverPropertyMapping),
            announcement_mode: "LEASE",
            announcement_receiver: [managerID],
            announcement_type: ["Text", "Email"],
          }),
        });
      } catch (error) {
        console.log("Error in Tenant accept announcements:", error);
        alert("We were unable to Text the Property Manager but we were able to send them a notification through the App");

      }
    };

    try {
      var lease_status = "TENANT APPROVED";
      // var status = "TENANT APPROVED";
      const date = new Date();
      console.log("Date: ", date);
      console.log("Lease Effective Date, ", status);
      if (status) {
        const [month, day, year] = status.split("-").map(Number);
        const leaseDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date objects
        console.log("Lease Effective Date, ", leaseDate);

        if (leaseDate <= date) {
          lease_status = "ACTIVE";
          console.log("Lease Status Changed: ", lease_status);
          // if (lease.lease_effective_date <= date) {
          // status = "ACTIVE";
        }
      }
      console.log("Status: ", status);
      leaseApplicationFormData.append("lease_status", lease_status);
      const response = await fetch(`${APIConfig.baseURL.dev}/leaseApplication`, {
        method: "PUT",
        body: leaseApplicationFormData,
      });
      const data = await response.json();
      console.log('Divyy', data);
      if (data.lease_docs.code === 200) {
        alert("You have successfully Accepted the lease.");
        await sendAnnouncement();
        props.setRightPane({ type: "" });
        props.setReload(prev => !prev);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
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
      return `${fee.due_by_date ?? "No Due Date"}`;
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
    <Paper sx={{ marginTop: '7px', backgroundColor: theme.palette.primary.main, borderRadius: "5px", boxShadow: "0px 2px 4px #00000040" }}>
      <Box
        sx={{
          fontFamily: "Source Sans Pro",
          padding: "10px",
        }}
      >
        <Grid container>
          <Grid item xs={11}>
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
          <Grid item xs={1}>
            <Button
              onClick={() => {
                if (props.from && props.from === "accwidget") {
                  props.setRightPane("");
                } else {
                  props.setRightPane({ type: "listings" });
                }
              }
              }

              sx={{
                textTransform: "none",
                textDecoration: "underline",
              }}
            >
              <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px" }} />
            </Button>
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
            <Grid item xs={3}>
              <CenteringBox justify_content="flex-start">
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>Start Date</Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                  {lease.lease_start}
                </Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={3}>
              <CenteringBox justify_content="flex-start">
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                  Move In Date
                </Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                  {lease.lease_move_in_date ? lease.lease_move_in_date : "No Move In Date"}
                </Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={3}>
              <CenteringBox justify_content="flex-start">
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                  Effective Date
                </Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                  {lease.lease_effective_date ? lease.lease_effective_date : "No Effective Date"}
                </Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={3}>
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
                  {/* {JSON.parse(lease.lease_adults).length + JSON.parse(lease.lease_children).length} */}
                  {adultOccupants.length + childrenOccupants.length}
                </Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={4}>
              <CenteringBox justify_content="flex-start">
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}># of Pets</Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                  {/* {JSON.parse(lease.lease_pets).length} */}
                  {pets.length}
                </Typography>
              </CenteringBox>
            </Grid>
            <Grid item xs={4}>
              <CenteringBox justify_content="flex-start">
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
                  # of Vehicles
                </Typography>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize: theme.typography.mediumFont.fontSize }}>
                  {/* {JSON.parse(lease.lease_vehicles).length} */}
                  {vehicles.length}
                </Typography>
              </CenteringBox>
            </Grid>

            <Grid container sx={{ marginTop: '20px' }}>
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
                <Grid container key={index} sx={{ marginTop: '10px' }}>
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
                {signedLease &&
                  <Box>
                    <Button
                      sx={{
                        padding: "0px",
                        '&:hover': {
                          backgroundColor: theme.palette.form.main,
                        },
                      }}
                      className=".MuiButton-icon"
                      onClick={() =>
                        window.open(signedLease.link, "_blank", "rel=noopener noreferrer")
                      }
                    > <img src={LeaseIcon} />


                    </Button>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: '14px',
                        display: 'inline-flex', // Ensure inline-flex to keep elements on the same line
                        alignItems: 'center',  // Vertically align items
                        textTransform: 'none'
                      }}
                    >

                      View Lease
                    </Typography>
                  </Box>}
              </CenteringBox>
            </Grid>
          </Grid>

          <Box
            sx={{
              fontSize: "13px",
              marginTop: "7px",
              marginBottom: "7px",
            }}
          >
            {adultOccupants?.length ?? 0} Adults
          </Box>

          {adultOccupants?.map((adult) => (
            <Box
              sx={{
                fontSize: "13px",
                color: "#160449",
                marginBottom: "7px",
              }}
            >
              {`${adult?.name} | ${adult?.relationship} | DOB: ${adult?.dob}`}
            </Box>
          ))}

          <Box
            sx={{
              fontSize: "13px",
              marginTop: "7px",
              marginBottom: "7px",
            }}
          >
            {childrenOccupants?.length ?? 0} Child
          </Box>
          {childrenOccupants?.map((child) => (
            <Box
              sx={{
                fontSize: "13px",
                color: "#160449",
                marginBottom: "7px",
              }}
            >
              {`${child.name} | ${child.relationship} | DOB: ${child.dob}`}
            </Box>
          ))}

          <Box
            sx={{
              fontSize: "13px",
              marginTop: "7px",
              marginBottom: "7px",
            }}
          >
            {pets?.length ?? 0} Pets
          </Box>

          {pets?.map((pet) => (
            <Box
              sx={{
                fontSize: "13px",
                color: "#160449",
                marginBottom: "7px",
              }}
            >
              {`${pet.name} | ${pet.type} | ${pet.weight} lbs`}
            </Box>
          ))}

          <Box
            sx={{
              fontSize: "13px",
              marginTop: "7px",
              marginBottom: "7px",
            }}
          >
            {vehicles?.length ?? 0} Vehicles
          </Box>

          {vehicles?.map((vehicle) => (
            <Box
              sx={{
                fontSize: "13px",
                color: "#160449",
                marginBottom: "7px",
              }}
            >
              {`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.license} | ${vehicle.state}`}
            </Box>
          ))}

          <Grid container spacing={2}>
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
                    color: "#FFFFFF",
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
                    color: "#FFFFFF",
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
    </Paper>
  );
}
export default TenantLeases;
