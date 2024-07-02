import {
  Chip,
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
import CardSlider from "./CardSlider";
import PlaceholderImage from "./MaintenanceIcon.png"; // "./PlaceholderImage.png";
import MaintenanceIcon from "./MaintenanceIcon.png";
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
import { PropertyCard } from "../Property/PropertyListings";
import CircleIcon from "@mui/icons-material/Circle";
import { DataGrid } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import documentIcon from "../../images/Subtract.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import NewCardSlider from "../Announcement/NewCardSlider";

function TenantDashboard(props) {
  console.log("In Tenant Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);

  const [paymentData, setPaymentData] = useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const { getProfileId } = useUser();

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [allMaintenanceRequests, setAllMaintenanceRequests] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [leaseDetails, setLeaseDetails] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [allAnnouncementsData, setAllAnnouncementsData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [propertyAddr, setPropertyAddr] = useState();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentExpected, setPaymentExpected] = useState([]);
  const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);

  const [rentFees, setRentFees] = useState([]);
  const [lateFees, setLateFees] = useState([]);
  const [utilityFees, setUtilityFees] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState(`${getProfileId()}`);
  const [total, setTotal] = useState("0.00");
  const [addMaintenance, setAddMaintenance] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [userLeases, setUserLeases] = useState(null);
  const [selectedLease, setSelectedLease] = useState(null);
  const [refresh, setRefresh] = useState(false || location.state?.refresh);

  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user } = useUser();

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

  useEffect(() => {
    console.log("In Tenant Dashboard UseEffect");
    setAddMaintenance(false);
    if (!getProfileId()) navigate("/PrivateprofileName");
    const getTenantData = async () => {
      setShowSpinner(true);
      try {
        console.log("Call endpoints");
        const tenantRequests = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
        const announcementsResponse = await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`);
        const paymentsReponse = await fetch(`${APIConfig.baseURL.dev}/paymentStatus/${getProfileId()}`);

        const tenantRequestsData = await tenantRequests.json();
        const announcementsResponseData = await announcementsResponse.json();
        const paymentsResponseData = await paymentsReponse.json();

        let propertyData = tenantRequestsData?.property?.result;
        let maintenanceRequestsData = tenantRequestsData?.maintenanceRequests?.result;
        let leaseDetailsData = tenantRequestsData?.leaseDetails?.result;
        let announcementsReceivedData = announcementsResponseData?.received?.result;
        console.log("[DEBUG] announcementsReceivedData", announcementsReceivedData);
        let paymentsReceivedData = paymentsResponseData?.MoneyPaid?.result;
        let paymentsExpectedData = paymentsResponseData?.MoneyToBePaid?.result;

        const allNonActiveLease = propertyData.every((item) => item.lease_status !== "ACTIVE");

        // sort propertyData by lease_status so that active lease is first
        propertyData.sort((a, b) => {
          if (a.lease_status === "ACTIVE") {
            return -1;
          }
          if (b.lease_status === "ACTIVE") {
            return 1;
          }
          return 0;
        });

        // console.log("Property Data after sorting: ", propertyData);
        // Routes User to Listings Page if there are no active Leases
        if (!propertyData || propertyData.length === 0 || allNonActiveLease) {
          navigate("/listings");
        }

        setPropertyData(propertyData || []);
        setLeaseDetails(leaseDetailsData || []);
        setAllMaintenanceRequests(maintenanceRequestsData);
        setMaintenanceRequests(maintenanceRequestsData || []);
        setPaymentHistory(paymentsReceivedData || []);
        setPaymentExpected(paymentsExpectedData || []);

        // setAnnouncementsData(announcementsData || ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"]);
        setAllAnnouncementsData(announcementsReceivedData || ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"]);

        let propertyAddress = propertyData[0] !== undefined ? propertyData[0].property_address + " " + propertyData[0].property_unit : "No Data";
        setPropertyAddr(propertyAddress);
        setFirstName(user.first_name);

        setTotal(propertyData[0] !== undefined ? propertyData[0].balance : "0.00");

        if (location.state?.propertyId) {
          let navPropertyData = propertyData.find((item) => item.property_uid === location.state?.propertyId);
          setSelectedProperty(navPropertyData);
          setPropertyAddr(navPropertyData.property_address + " " + navPropertyData.property_unit);
        } else {
          setSelectedProperty(propertyData[0] !== undefined ? propertyData[0] : null);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
      setShowSpinner(false);
    };
    getTenantData();
    setRefresh(false); //refersh set for image
  }, [getProfileId, location.state?.propertyId, navigate, user.first_name, addMaintenance]); // NOTE:  removed refresh from dependancies array to reduce endpoint calls by 1 set.  Not sure what the impact of removing refresh is.

  useEffect(() => {
    const navPropertyData = propertyData.find((item) => item.property_uid === location.state?.propertyId);

    if (navPropertyData) {
      setSelectedProperty(navPropertyData);
    }
  }, [location.state?.propertyId, propertyData]);

  useEffect(() => {
    if (propertyData) {
      let filteredLease = propertyData.find((lease) => lease.lease_uid === selectedProperty?.lease_uid);
      setSelectedLease(filteredLease);
    }
    if (allMaintenanceRequests) {
      let filteredMaintenanceItems = allMaintenanceRequests.filter((request) => request.property_uid === selectedProperty.property_uid);
      setMaintenanceRequests(sortMaintenanceRequests(filteredMaintenanceItems));
    }
    if (allAnnouncementsData) {
      const filteredAnnouncements = allAnnouncementsData.filter((announcement) => {
        const announcementPropertiesString = announcement.announcement_properties;

        if (announcementPropertiesString == null) {
          return false;
        }

        let announcementPropertiesArray;
        if (announcementPropertiesString.startsWith("[") && announcementPropertiesString.endsWith("]")) {
          announcementPropertiesArray = JSON.parse(announcementPropertiesString);
        } else {
          announcementPropertiesArray = [announcementPropertiesString];
        }
        return announcement.announcement_properties.includes(selectedProperty.property_uid);
      });

      filteredAnnouncements.sort((a, b) => b.announcement_uid.localeCompare(a.announcement_uid));
      console.log("filteredAnnouncements", filteredAnnouncements);
      setAnnouncementsData(filteredAnnouncements);
    }
    if (paymentHistory && paymentExpected) {
      let filteredPaymentHistory = paymentHistory.filter((payment) => payment.pur_property_id === selectedProperty.property_uid);
      let filteredPaymentExpected = paymentExpected.filter((payment) => payment.pur_property_id === selectedProperty.property_uid);
      var rentFeeSum = 0;
      var utilityFeeSum = 0;
      var lateFeeSum = 0;
      filteredPaymentExpected.forEach((payment) => {
        if (payment.purchase_type === "Rent") {
          rentFeeSum += parseInt(payment.pur_amount_due);
        }
        if (payment.purchase_type === "Utility") {
          utilityFeeSum += parseInt(payment.pur_amount_due);
        }
        if (payment.purchase_type === "Late Fee") {
          console.log("I found something that says Late Fees", payment);
          lateFeeSum += parseInt(payment.pur_amount_due);
        }
      });
      setRentFees(rentFeeSum);
      setUtilityFees(utilityFeeSum);
      setLateFees(lateFeeSum);
      console.log("ALL SUMMED FEES", rentFeeSum, utilityFeeSum, lateFeeSum);
      setFilteredPaymentHistory(filteredPaymentHistory);
    }
  }, [allAnnouncementsData, allMaintenanceRequests, propertyData, selectedProperty, paymentHistory]);

  function sortMaintenanceRequests(maintenanceDataArray) {
    const statusSortPriority = {
      NEW: 0,
      "INFO REQUESTED": 1,
      PROCESSING: 2,
      SCHEDULED: 3,
      COMPLETED: 4,
      CANCELLED: 5,
    };
    return maintenanceDataArray.sort((a, b) => statusSortPriority[a.maintenance_request_status] - statusSortPriority[b.maintenance_request_status]);
  }

  function handleTenantMaintenanceNavigate() {
    let navPropertyData = propertyData.find((item) => item.property_address === selectedProperty.property_address);
    const propertyLeaseData = leaseDetails.find((item) => item.lease_property_id === selectedProperty.lease_property_id);
    console.log("Navigating to /addTenantMaintenanceItem - propertyLeaseData - ", propertyLeaseData);
    navigate("/addTenantMaintenanceItem", {
      state: { propertyData: navPropertyData, leaseData: propertyLeaseData },
    });
    setAddMaintenance(true);
  }

  function handleViewLeaseNavigate(lease_uid) {
    navigate("/viewLease", {
      state: {
        lease_id: lease_uid,
        // property_uid: propertyId,
      },
    });
  }

  const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

  function NonActiveLeaseDashboardTab({ property, leaseStatus, lease }) {
    return <PropertyCard data={property} status={leaseStatus} leaseData={lease} />;
  }

  return (
    <Container maxWidth="xl">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {selectedProperty !== null ? (
        <>
          <Box
            sx={{
              fontFamily: "Source Sans Pro",
              padding: "14px",
            }}
          >
            <Grid
              container
              sx={{
                paddingBottom: "10px",
                marginTop: isMobile ? "0px" : "7px",
                marginBottom: isMobile ? "0px" : "7px",
              }}
            >
              <Grid item xs={8} md={6} lg={6}>
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
                      fontSize: { xs: "22px", sm: "28px", md: "36px", lg: "40px" },
                      fontWeight: "600",
                    }}
                  >
                    Welcome, {firstName}!
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={4} md={6} lg={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                    alignItems: "center",
                    color: "#160449",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#97A7CF",
                      color: theme.typography.secondary.white,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => navigate("/listings")}
                  >
                    <SearchIcon />
                    {!isMobile && "Search Property"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {selectedProperty?.lease_status === "ACTIVE" ? (
              <Grid container spacing={isMobile ? 1 : 3}>
                <Grid item xs={12} md={4} sx={{ height: !isMobile ? "80vh" : "auto" }}>
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
                                <KeyboardArrowDownIcon sx={{ alignItem: "center" }} onClick={(event) => handleOpen(event)} />
                                <Menu
                                  id="demo-customized-menu"
                                  MenuListProps={{
                                    "aria-labelledby": "demo-customized-button",
                                  }}
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                >
                                  {propertyData.map((item, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        onClick={() => {
                                          setPropertyAddr(item.property_address + " " + item.property_unit);
                                          setPropertyId(item.property_uid);
                                          setTotal(item.balance);
                                          setSelectedProperty(item);
                                          setSelectedLease(propertyData.find((lease) => lease.lease_uid === item.lease_uid));
                                          handleClose();
                                        }}
                                        disableRipple
                                      >
                                        {showLeaseStatusIndicator(item.lease_status)}
                                        {item.property_address + " " + item.property_unit}
                                      </MenuItem>
                                    );
                                  })}
                                </Menu>
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
                    >
                      <Box
                        sx={{
                          backgroundColor: "#3D5CAC",
                          borderRadius: "10px",
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "22px",
                          padding: "10px",
                          paddingRight: "20px",
                          paddingLeft: "20px",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          navigate("/payments");
                        }}
                      >
                        Make a Payment
                      </Box>
                    </Box>
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
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DashboardTab>
                        <Grid
                          container
                          direction="row"
                          sx={{
                            // paddingTop: "10px",
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
                                  fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" },
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
                                  fontSize: "18px",
                                  paddingRight: "25px",
                                  fontWeight: "bold",
                                }}
                                onClick={() => {
                                  navigate("/announcements", { state: { announcementsData, propertyAddr } });
                                }}
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
                      </DashboardTab>
                    </Grid>
                    <Grid item xs={12}>
                      <DashboardTab>
                        <Grid container direction="row" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
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
                                  fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" },
                                  fontWeight: "bold",
                                }}
                              >
                                Payment History
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2}></Grid>
                        </Grid>
                        <Stack>
                          <TenantPaymentHistoryTable data={filteredPaymentHistory} isMobile={isMobile} isMedium={isMedium} />
                        </Stack>
                      </DashboardTab>
                    </Grid>
                    <Grid item xs={12}>
                      <DashboardTab>
                        <Grid container direction="row" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
                          <Grid item xs={2}></Grid>
                          <Grid item xs={8}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1, // Look into this for all the components
                                flex: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "35px" },
                                  fontWeight: "bold",
                                }}
                              >
                                Maintenance ({maintenanceRequests.length})
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
                                  display: "flex", // Enables flexbox
                                  flexDirection: "row", // Sets the flex direction to row
                                  justifyContent: "center", // Centers content horizontally
                                  alignItems: "center", // Centers content vertically
                                  backgroundColor: "#3D5CAC",
                                  color: "#FFFFFF",
                                  textTransform: "none",
                                  fontSize: isMobile ? "8px" : "16px",
                                  "&:hover": {
                                    backgroundColor: "#3457A0", // Optional: Darken on hover
                                  },
                                  padding: isMobile ? "0px" : "10px",
                                  margin: isMobile ? "1px" : "auto",
                                  borderRadius: 1,
                                  cursor: "pointer",
                                  alignItems: "center",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                                onClick={() => handleTenantMaintenanceNavigate()}
                              >
                                <AddIcon />
                                {!isMobile && !isMedium && <span style={{ marginLeft: "8px" }}>New Request</span>}
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                        <Stack>
                          <TenantMaintenanceRequestsTable data={maintenanceRequests} navToMaintenance={handleTenantMaintenanceNavigate} isMobile={isMobile} isMedium={isMedium} />
                        </Stack>
                      </DashboardTab>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <>
                <NonActiveLeaseDashboardTab property={selectedProperty} leaseStatus={selectedProperty?.lease_status} lease={selectedLease} />
              </>
            )}
          </Box>
        </>
      ) : (
        <></>
      )}
      {/* </Box> */}
    </Container>
  );
}

const boxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "125px",
  height: "35px",
  backgroundColor: "#DEDFE3",
  color: "#160449",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "3px 2px 4px #00000019",
  borderRadius: "10px",
  cursor: "pointer",
};

const innerBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: "5px",
};

const innerTextStyle = {
  paddingLeft: "5px", // Adjust as needed
  paddingRight: "5px", // Adjust as needed
};

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

export default TenantDashboard;

function TenantPaymentHistoryTable(props) {
  const isMobile = props.isMobile;
  const isMedium = props.isMedium;

  const mobileColumnsList = [
    {
      field: "latest_date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value ? params.value : params.row.pur_due_date}</Box>,
    },

    {
      field: "purchase_type",
      headerName: "Type",
      flex: 0,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "payment_status",
      headerName: "Status",
      flex: 1,
      headerStyle: {
        fontWeight: "bold", // Apply inline style to the header cell
      },
      renderCell: (params) => (
        <Box
          // label={params.value} // This value is all caps, so I need to convert it to regular cased
          sx={{
            backgroundColor: theme.colorStatusPaymentHistoryTenant.find((item) => item.status === params.value)?.color,
            textTransform: "none",
            fontWeight: "bold",
            width: "100px",
            height: "20px",
            borderRadius: "4px",
            alignItems: "center",
            textAlign: "center",
            alignContent: "center",
            color: "#FFFFFF",
          }}
        >
          {params.value}
        </Box>
        // <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>
      ),
    },

    {
      field: "total_paid",
      headerName: "Total Paid",
      flex: 0.7,
      headerStyle: {
        fontWeight: "bold", // Apply inline style to the header cell
      },
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: "bold",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          $ {params.value === null || parseFloat(params.value) === 0 ? "0.00" : parseFloat(params.value).toFixed(2)}
        </Box>
      ),
    },
  ];

  const desktopColumnsList = [
    // {
    //   field: "property_address",
    //   headerName: "Address",
    //   flex: 2,
    //   renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    // },
    // {
    //   field: "property_unit",
    //   headerName: "Unit",
    //   flex: 1,
    //   renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    // },
    // {
    //   field: "pur_amount_due",
    //   headerName: "Amount Due",
    //   flex: 0.7,
    //   headerStyle: {
    //     fontWeight: "bold", // Apply inline style to the header cell
    //   },
    //   renderCell: (params) => (
    //     <Box
    //       sx={{
    //         fontWeight: "bold",
    //         width: "100%",
    //         display: "flex",
    //         flexDirection: "row",
    //         justifyContent: "flex-end",
    //       }}
    //     >
    //       $ {parseFloat(params.value).toFixed(2)}
    //     </Box>
    //   ),
    // },
    {
      field: "purchase_uid",
      headerName: "Purchase (400)",
      flex: 1,
      align: "right",
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value.slice(-4)}</Box>,
    },
    {
      field: "payer_profile_uid",
      headerName: "Payer (350)",
      flex: 1,
      align: "right",
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value.slice(-4)}</Box>,
    },
    // {
    //   field: "payer_user_name",
    //   headerName: "Payer Name",
    //   flex: 2,
    //   renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    // },
    // {
    //   field: "pur_description",
    //   headerName: "Description",
    //   flex: 2,
    //   renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    // },
    {
      field: "pur_property_id",
      headerName: "Property (200)",
      flex: 1,
      align: "right",
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value.slice(-4)}</Box>,
    },
  ];

  const columnList = () => {
    if (isMobile || isMedium) {
      return mobileColumnsList;
    } else {
      return mobileColumnsList.concat(desktopColumnsList);
    }
  };

  if (props.data && props.data.length > 0) {
    return (
      <DataGrid
        rows={props.data}
        columns={columnList()}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        getRowId={(row) => row.purchase_uid}
        pageSizeOptions={[5, 10, 25, 100]}
      />
    );
  } else {
    return (
      <Box sx={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", minHeight: "331px" }}>
        <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" } }}>No Payment History Available</Typography>
      </Box>
    );
  }
}

function TenantMaintenanceRequestsTable(props) {
  console.log("In Maintenance Request Table from Stack")
  const data = props.data;
  const isMobile = props.isMobile;
  const isMedium = props.isMedium;
  // const getColorForPriority = (priority) => {
  //   const colorObj = theme.colorStatusMaintenancePriorityTenant.find(item => item.status.toLowerCae() == priority.toLowerCase());
  //   const color = colorObj? colorObj.color : '#000000';
  //   console.log('Priority: ${priority}, color: ${color}');
  //   return color;
  // }
  console.log("TenantMaintenanceRequestTable", isMobile);
  // console.log("Data in MRD from props: ", data)
  // console.log( theme.colorStatusMaintenanceTenant.find(item => item.status === "NEW REQUEST") )
  const location = useLocation();
  let navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  function formatTime(time) {
    if (time == null || !time.includes(":")) {
      return "-";
    }
    const [hours, minutes] = time.split(":").map(String);

    let formattedHours = hours % 12;
    if (formattedHours === 0) formattedHours = 12;

    const period = hours >= 12 ? "pm" : "am";
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }
  function getValidDate(date) {
    if (date == null || !date.includes("-")) {
      return "-";
    }
    return date;
  }

  // Set favorite image
  data.forEach((item) => {
    // console.log("For Each Item: ", item)
    let favoriteImage = "";
    const maintenanceImagesList = JSON.parse(item.maintenance_images);

    if (maintenanceImagesList && maintenanceImagesList.length > 0) {
      favoriteImage = maintenanceImagesList.find((url) => url.endsWith("img_cover"));
    } else {
      favoriteImage = PlaceholderImage;
    }
    // This line actually sets the favorite image in the data object to favoriteImage
    item.favorite_image = favoriteImage;
  });

  // Function for status color
  const getColorForStatus = (status) => {
    switch (status) {
      case "NEW":
        return "#B62C2A"; // Red
      case "INFO REQUESTED":
        return "#D4736D"; // Light Red
      case "PROCESSING":
        return "#DEA19C"; // Lighter Red
      case "SCHEDULED":
        return "#99CCFF"; // Lighter Blue
      case "COMPLETED":
        return "#6699FF"; // Light Blue
      case "CANCELLED":
        return "#0000FF"; // Blue
      default:
        return "#000000"; // Black
    }
  };

  const columnsListDefault = [
    {
      field: "maintenance_title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            background: getColorForStatus(params.row.maintenance_request_status),
            //backgroundColor: theme.colorStatusMaintenanceTenant.find((item) => item.status === params.row.maintenance_request_status)?.color || "#FF0000", // checking 2
            padding: "5px",
            color: "#FFFFFF", //checking 1
            borderRadius: "4px",
          }}
        >
          {params.value}
        </Box>
      ),
      headerAlign: "center",
    },
    {
      field: "maintenance_request_created_date",
      headerName: "Created Date",
      flex: 1,
      headerStyle: {
        fontWeight: "bold",
      },
      // align: "center",
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
      headerAlign: "center",
    },
  ];

  const columnsListDesktop = [
    {
      field: "favorite_image",
      headerName: "Images",
      flex: 0.5,
      renderCell: (params) => <img src={params.value} alt="Maintenance" style={{ width: "60px", height: "55px" }} />,
      headerAlign: "center",
    },
    {
      field: "maintenance_priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value}</Box>,
      headerAlign: "center",
    },
    {
      field: "maintenance_scheduled_date",
      headerName: "Scheduled Date",
      flex: 1,
      headerStyle: {
        fontWeight: "bold",
      },
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? getValidDate(params.value) : "-"}</Box>,
      headerAlign: "center",
    },

    {
      field: "maintenance_scheduled_time",
      headerName: "Scheduled Time",
      flex: 1,
      headerStyle: {
        width: "100%",
        fontWeight: "bold",
      },
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? formatTime(params.value) : "-"}</Box>,
      headerAlign: "center",
    },
  ];

  const columnList = () => {
    if (isMobile || isMedium) {
      return columnsListDefault;
    } else {
      return columnsListDefault.concat(columnsListDesktop);
    }
  };

  if (data.length > 0) {
    // console.log("Passed Data ", data);
    return (
      <>
        <DataGrid
          rows={data}
          columns={columnList()}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={(row) => row.maintenance_request_uid}
          pageSizeOptions={[5, 10, 25, 100]}
          onRowClick={(row) => {
            console.log("Row =", row);
            navigate(`/tenantMaintenanceItemDetail`, {
              state: {
                item: row.row,
              },
            });
          }}
        />
      </>
    );
  } else {
    return (
      <Box sx={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", minHeight: "331px" }}>
        <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" } }}>No Maintenance Requests Available</Typography>
      </Box>
    );
  }
}
