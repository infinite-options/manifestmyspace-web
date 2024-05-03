import { Box, Button, Typography, Stack, Grid, MenuItem, Menu, Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, ListItemAvatar } from "@mui/material";
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
import { Dashboard } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article"; // For "Document"
import PhoneIcon from "@mui/icons-material/Phone"; // For "Phone"
import BuildIcon from "@mui/icons-material/Build"; // For "Maintenance"
import AddIcon from "@mui/icons-material/Add"; // For "New Request"
import { PropertyCard } from "../Property/PropertyListings";
import CircleIcon from "@mui/icons-material/Circle";
import TenantMaintenanceModal from "./TenantMaintenanceModal"
import { DataGrid } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import documentIcon from "../../images/Subtract.png";

function TenantDashboard(props) {
  console.log("In Tenant Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);

  const [paymentData, setPaymentData] = useState({});

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
  const [paymentHistory, setPaymentHistory] = useState([])
  const [paymentExpected, setPaymentExpected] = useState([])
  const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([])

  const [rentFees, setRentFees] = useState([])
  const [lateFees, setLateFees] = useState([])
  const [utilityFees, setUtilityFees] = useState([])

  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState(`${getProfileId()}`);
  const [total, setTotal] = useState("0.00");

  const [anchorEl, setAnchorEl] = useState(null);

  const [userLeases, setUserLeases] = useState(null);
  const [selectedLease, setSelectedLease] = useState(null);
  // const [refresh, setRefresh] = useState(false || location.state?.refresh);

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
        {lease_status === "ENDED" ? <CircleIcon fontSize="small" sx={{ color: "#000000", paddingRight: "10px" }} /> : null /* black */}
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
    };
    // return property?.property_status ? statusColorMapping[property?.property_status] : "#ddd"
    return status ? statusColorMapping[status] : "#ddd";
  };

  useEffect(() => {
    // console.log("In UseEffect")
    if (!getProfileId()) navigate("/PrivateprofileName");
    const getTenantData = async () => {
      setShowSpinner(true);
      try {
        // console.log("Call endpoints")
        const tenantRequests = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
        const announcementsResponse = await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`);
        const paymentsReponse = await fetch(`${APIConfig.baseURL.dev}/paymentStatus/${getProfileId()}`)

        const tenantRequestsData = await tenantRequests.json();
        const announcementsResponseData = await announcementsResponse.json();
        const paymentsResponseData = await paymentsReponse.json();

        let propertyData = tenantRequestsData?.property?.result;
        let maintenanceRequestsData = tenantRequestsData?.maintenanceRequests?.result;
        let leaseDetailsData = tenantRequestsData?.leaseDetails?.result;
        let announcementsReceivedData = announcementsResponseData?.received?.result;
        let paymentsReceivedData = paymentsResponseData?.MoneyPaid?.result
        let paymentsExpectedData = paymentsResponseData?.MoneyToBePaid?.result

        const allNonActiveLease = propertyData.every((item) => item.lease_status !== "ACTIVE");
        // console.log("Maintenance data from endpoint: ", maintenanceRequestsData )
        // console.log("allNonActiveLease: ", allNonActiveLease)

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
        setPaymentHistory(paymentsReceivedData || [])
        setPaymentExpected(paymentsExpectedData || [])

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
    // setRefresh(false);
  }, [getProfileId, location.state?.propertyId, navigate, user.first_name]); // NOTE:  removed refresh from dependancies array to reduce endpoint calls by 1 set.  Not sure what the impact of removing refresh is.


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

      setAnnouncementsData(filteredAnnouncements);
    }
    if (paymentHistory && paymentExpected){
      let filteredPaymentHistory = paymentHistory.filter((payment) => payment.pur_property_id === selectedProperty.property_uid)
      let filteredPaymentExpected = paymentExpected.filter((payment) => payment.pur_property_id === selectedProperty.property_uid)
      var rentFeeSum = 0
      var utilityFeeSum = 0
      var lateFeeSum = 0
      filteredPaymentExpected.forEach((payment) => {
        if (payment.purchase_type === "Rent"){
          rentFeeSum += parseInt(payment.pur_amount_due)
        }
        if (payment.purchase_type === "Utility"){
          utilityFeeSum += parseInt(payment.pur_amount_due)
        }
        if (payment.purchase_type === "Late Fee"){
          console.log("I found something that says Late Fees", payment)
          lateFeeSum += parseInt(payment.pur_amount_due)
        }
      })
      setRentFees(rentFeeSum)
      setUtilityFees(utilityFeeSum)
      setLateFees(lateFeeSum)
      console.log("ALL SUMMED FEES", rentFeeSum, utilityFeeSum, lateFeeSum)
      setFilteredPaymentHistory(filteredPaymentHistory)
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

  const thStyle = {
    color: "#160449",
    fontWeight: "600",
    fontSize: "10px",
  };

  function handleTenantMaintenanceNavigate() {
    let navPropertyData = propertyData.find((item) => item.property_address === selectedProperty.property_address);
    const propertyLeaseData = leaseDetails.find((item) => item.lease_property_id === selectedProperty.lease_property_id);
    console.log("Navigating to /addTenantMaintenanceItem - propertyLeaseData - ", propertyLeaseData);
    navigate("/addTenantMaintenanceItem", {
      state: { propertyData: navPropertyData, leaseData: propertyLeaseData },
    });
  }

  function handleViewLeaseNavigate(lease_uid) {
    navigate("/viewLease", {
      state: {
        lease_id: lease_uid,
      },
    });
  }

  const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";


  function NonActiveLeaseDashboardTab({ property, leaseStatus, lease }) {
    return <PropertyCard data={property} status={leaseStatus} leaseData={lease} />;
  }

  return (
    <>
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
                marginTop: "7px",
                marginBottom: "7px",
              }}
              spacing={2}
            >
              <Grid item xs={12} md={12} lg={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    alignText: "center",
                    alignContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: "600",
                    }}
                  >
                    Welcome, {firstName}!
                  </Typography>
                  <Typography sx={{fontSize: "16px", fontWeight: 400, paddingLeft: "15px", alignItems: "center", }}>
                    <u>Not you?</u>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    alignItems: "center",
                    color: "#160449",
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
              </Grid>
              <Grid item xs={3}>
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
                    Search Property
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {selectedProperty?.lease_status === "ACTIVE" ? (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <DashboardTab sx={{ height: '100%' }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "10px",
                        paddingRight: "0px",
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
                            alignItems: "center"
                          }}
                        >
                          <Typography sx={{ fontSize: "35px", fontWeight: "bold", color: "#160449" }}>
                            Account Balance
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "22px",
                              fontWeight: "600",
                              color: "#3D5CAC",
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
                          <Box sx={{fontSize: "55px", fontWeight: "bold", color: "#3D5CAC", margin: "10px", alignItems: "center", alignContent: "center" }}>
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
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            // handleStripePayment()
                            navigate("/payments");
                          }}
                        >
                          Make a Payment
                        </Box>
                      </Box>
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItem: "center",
                        justifyContent: "center",
                        margin: "20px",
                        paddingTop: "20px",
                        paddingBottom: "20px"
                      }}>
                        <Typography sx={{fontSize: "35px", fontWeight: "bold"}}>Balance Details</Typography>
                        <Grid container>
                          <Grid item xs={6} sx={{color: "#3D5CAC", fontSize: "20px", fontWeight: 700}}> Description </Grid>
                          <Grid item xs={6} sx={{color: "#3D5CAC", fontSize: "20px", fontWeight: 700, textAlign: "right"}}> Amount </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> Rent </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> ${rentFees} </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> Late Fees </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> ${lateFees} </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> Utility </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> ${utilityFees} </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItem: "center",
                        justifyContent: "center",
                        margin: "20px",
                        paddingTop: "20px",
                        paddingBottom: "20px"
                      }}>
                        <Typography sx={{fontSize: "35px", fontWeight: "bold"}}>Lease Details</Typography>
                        <Grid container>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> Start Date </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> {selectedLease?.lease_start ? selectedLease?.lease_start : ""} </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> End Date</Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> {selectedLease?.lease_end ? selectedLease?.lease_end : ""} </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%"}}> Address </Grid>
                          <Grid item xs={6} sx={{color: "#000000", fontSize: "20px", fontWeight: 500, opacity: "50%", textAlign: "right"}}> {selectedLease?.property_address ? selectedLease?.property_address : ""} {selectedLease?.property_unit ? selectedLease?.property_unit : ""}</Grid>
                        </Grid>
                      </Box>
                      <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItem: "left",
                        justifyContent: "left",
                        margin: "20px",
                        cursor: "pointer",
                        color: "#3D5CAC",
                        fontSize: "20px",
                        fontWeight: 600
                      }}
                        onClick={() => handleViewLeaseNavigate()}
                      >
                        <img src={documentIcon} alt="document-icon" style={{ width: "15px", height: "17px", margin: "0px", paddingLeft: "15px", paddingRight: "15px" }} />
                        <u>View Full Lease</u>
                      </Box>
                  </DashboardTab>
                </Grid>
                <Grid item xs={8}>
                  <Grid container>
                  <Grid item xs={12}>
                      <DashboardTab>
                        <Stack direction="row"
                          sx={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "10px",
                            alignContent: "center",
                            justifyContent: "center",

                          }}
                        >
                          <Box
                              sx={{
                                color: "#160449",
                                fontSize: "35px",
                                fontWeight: "bold",
                                marginLeft: "5px",
                                marginTop: "10px",
                              }}
                            >
                              Announcements
                            </Box>
                          </Box>
                          <Box
                              sx={{
                                color: "#007AFF",
                                fontSize: "18px",
                                marginLeft: "20px",
                                marginTop: "10px",
                                textAlign: "right"
                              }}
                              onClick={() => {
                                navigate("/announcement", { state: { announcementsData, propertyAddr } });
                              }}
                            >
                              View all ({announcementsData.length})
                          </Box>
                        </Stack>
                        <CardSlider data={announcementsData} />
                      </DashboardTab>
                    </Grid>
                    <Grid item xs={12}>
                      <DashboardTab>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            margin: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              color: "#160449",
                              fontSize: "35px",
                              fontWeight: "bold",
                              marginLeft: "5px",
                              marginTop: "10px",
                            }}
                          >
                            Payment History
                          </Box>
                          <Box
                            sx={{
                              color: "#007AFF",
                              fontSize: "18px",
                            }}
                            onClick={() => {
                              navigate("/payments", { state: { announcementsData, propertyAddr } });
                            }}
                          >
                          </Box>
                        </Box>
                        <Stack>
                          <TenantPaymentHistoryTable data={filteredPaymentHistory}/>
                        </Stack>
                      </DashboardTab>
                    </Grid>
                    <Grid item xs={12}>
                      <DashboardTab>
                        <Stack direction="row"
                          sx={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            margin: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              color: "#160449",
                              fontSize: "35px",
                              fontWeight: "bold",
                              marginLeft: "5px",
                              marginTop: "10px",
                            }}
                          >
                            Maintenance ({maintenanceRequests.length})
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "right",
                            backgroundColor: "#3D5CAC",
                            borderRadius: "5px",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            marginTop: "10px",
                            marginRight: "10px",
                            height: "35px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              cursor: "pointer",
                            }}
                            onClick={() => handleTenantMaintenanceNavigate()}
                          >
                            <Box
                              sx={{
                                marginTop: "5px",
                                color: "#FFFFFF",
                              }}
                            >
                              <AddIcon />
                            </Box>
                            <Button
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                              }}
                            >
                              <Typography sx={{ textTransform: "none", color: "#FFFFFF", fontWeight: theme.typography.common.fontWeight, fontSize: "16px" }}>New Request</Typography>
                            </Button>
                          </Box>
                        </Box>
                        </Stack>
                        <Stack>
                          <TenantMaintenanceRequestsTable data={maintenanceRequests} navToMaintenance={handleTenantMaintenanceNavigate}/>
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
    </>
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

function DashboardActionItem(props) {
  return (
    <Box sx={boxStyle} onClick={props.onClick}>
      <Box sx={innerBoxStyle}>{props.icon}</Box>
      <Box sx={innerTextStyle}>{props.text}</Box>
    </Box>
  );
}

function DashboardTab(props) {
  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        borderRadius: "10px",
        marginTop: "7px",
        marginBottom: "7px",
        boxShadow: "0px 2px 4px #00000040",
      }}
    >
      {props.children}
    </Box>
  );
}

export default TenantDashboard;

function TenantPaymentHistoryTable(props){

  const columnsList = [
    {
      field: "latest_date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value ? params.value : params.row.pur_due_date}</Box>,
    },

    {
      field: "purchase_uid",
      headerName: "ID",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "purchase_type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "pur_description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "pur_property_id",
      headerName: "Property UID",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "property_address",
      headerName: "Address",
      flex: 2,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "property_unit",
      headerName: "Unit",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "payer_profile_uid",
      headerName: "Payer ID",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "payer_user_name",
      headerName: "Payer Name",
      flex: 2,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "payment_status",
      headerName: "Status",
      flex: 1,
      headerStyle: {
        fontWeight: "bold", // Apply inline style to the header cell
      },
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "pur_amount_due",
      headerName: "Amount Due",
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
          $ {parseFloat(params.value).toFixed(2)}
        </Box>
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

  if (props.data && props.data.length > 0){
    return (
        <DataGrid
          rows={props.data}
          columns={columnsList}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={(row) => row.purchase_uid}
          pageSizeOptions={[5, 10, 25, 100]}
          // onRowClick={(row) => {
          //   console.log("Row =", row);
          //     navigate(`/tenantMaintenanceItemDetail`, {
          //       state: {
          //           item: row.row
          //       }
          //   })
          // }}
        /> 
    )
  } else{
    return (
      <p> no data grid because props.data is null or == zero</p>
    )
  }
}

function TenantMaintenanceRequestsTable(props) {
  // console.log("In Maintenance Request Table from Stack")
  const data = props.data;
  // console.log("Data in MRD from props: ", data)
  const location = useLocation();
  let navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false)


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

  const columnsList = [
    {
      field: "favorite_image",
      headerName: "Images",
      flex: 0.5,
      renderCell: (params) => <img src={params.value} alt="Maintenance" style={{ width: "60px", height: "55px" }} />,
      headerAlign: "center",
    },
    {
      field: "maintenance_title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold", textAlign: "center" }}>{params.value}</Box>,
      headerAlign: "center",
    },
    {
      field: "maintenance_request_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value}</Box>,
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
      field: "maintenance_request_created_date",
      headerName: "Created Date",
      flex: 1,
      headerStyle: {
        fontWeight: "bold",
      },
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
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

  if (data.length > 0) {
    // console.log("Passed Data ", data);
    return (
      <>
        <DataGrid
          rows={data}
          columns={columnsList}
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
                    item: row.row
                }
            })
          }}
        /> 
      </>      
    );
  } else {
    return <></>;
  }
}
