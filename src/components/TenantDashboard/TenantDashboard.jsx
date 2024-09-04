import { Box, Button, Container, CardMedia, Grid, Menu, MenuItem, Paper, Stack, ThemeProvider, Typography, MobileStepper } from "@mui/material";
import PlaceholderImage from "./MaintenanceIcon.png"; // "./PlaceholderImage.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add"; // For "New Request"
import { PropertyCard, PropertyListings } from "../Property/PropertyListings";
import CircleIcon from "@mui/icons-material/Circle";
import { DataGrid } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import documentIcon from "../../images/Subtract.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import NewCardSlider from "../Announcement/NewCardSlider";
import PropertyInfo from "../Property/PropertyInfo";
import TenantApplication from "../Applications/TenantApplication";
import TenantProfileEdit from "../Profile/TenantProfile/TenantProfileEdit";
// import AccountBalanceWidget from "../Payments/AccountBalanceWidget";
import Announcements from "../Announcement/Announcements";
import { Announcement, Payment } from "@mui/icons-material";
import TenantMaintenanceItemDetail from "../Maintenance/TenantMaintenanceItemDetail";
import AddTenantMaintenanceItem from "../Maintenance/AddTenantMaintenanceItem";
import ViewLease from "../Leases/ViewLease";
import Payments from "../Payments/Payments";
import TenantApplicationEdit from "../Applications/TenantApplicationEdit";
import TenantLeases from "../Leases/TenantLeases/TenantLeases";
import EditMaintenanceItem from "../Maintenance/EditMaintenanceItem";
import defaultHouseImage from "../Property/defaultHouseImage.png";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

function TenantDashboard(props) {
  // console.log("In Tenant Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);
  const [rightPane, setRightPane] = useState("");

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

  const [tenantMaintenanceItemDetailState, setTenantMaintenanceItemDetailState] = useState(null);
  const [newTenantMaintenanceState, setnewTenantMaintenanceState] = useState(null);
  const [viewLeaseState, setViewLeaseState] = useState(location.state?.viewLeaseState ? location.state?.viewLeaseState : null);
  const [paymentState, setPaymentState] = useState(null);
  const [tenantApplicationNavState, setTenantApplicationNavState] = useState(null);
  const [viewApprovedLeaseNavState, setViewApprovedLeaseNavState] = useState(null);
  const [reload, setReload] = useState(false);
  const [propertyListingData, setPropertyListingData] = useState([]);
  const [leaseListingData, setLeaseListingData] = useState([]);

  const open = Boolean(anchorEl);

  const { user } = useUser();

  // useEffect(() => {
  //   console.log("paymentState - ", paymentState);
  // }, [paymentState]);

  useEffect(() => {
    async function fetchData() {
      const propertyResponse = await fetch(`${APIConfig.baseURL.dev}/listings/${getProfileId()}`);
      const propertyDataListings = await propertyResponse.json();

      const listings = propertyDataListings.Available_Listings?.result;
      const tenants = propertyDataListings?.Tenant_Leases?.result;

      const filteredListings = listings.filter((listing) => tenants.some((tenant) => tenant.lease_property_id === listing.property_uid));

      setPropertyListingData(filteredListings);
      setLeaseListingData(tenants);
    }
    fetchData();
  }, [getProfileId]);

  //  Main UseEffect
  useEffect(() => {
    // console.log("In Tenant Dashboard UseEffect");
    // console.log("Tenant ID: ", tenantId, "   Property ID: ", propertyId ? propertyId : "Not Selected");

    // Reset addMaintenance to false
    setAddMaintenance(false);

    // Check if the profile ID is available
    if (!getProfileId()) {
      // console.log("profile id is ***", getProfileId());
      let newRole = "TENANT";
      navigate("/addNewRole", { state: { user_uid: user.user_uid, newRole } });
      return;
    }

    // Function to fetch tenant data
    const getTenantData = async () => {
      if (!getProfileId()) return;

      setShowSpinner(true);

      try {
        // console.log("Call endpoints");

        // Fetch data from multiple endpoints
        const tenantRequests = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
        const announcementsResponse = await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`);
        const paymentsReponse = await fetch(`${APIConfig.baseURL.dev}/paymentStatus/${getProfileId()}`);

        // Parse the response data
        const tenantRequestsData = await tenantRequests.json();
        const announcementsResponseData = await announcementsResponse.json();
        const paymentsResponseData = await paymentsReponse.json();

        // Extract the necessary data
        let propertyData = tenantRequestsData?.property?.result || [];
        // console.log("propertyData: ", propertyData);
        let maintenanceRequestsData = tenantRequestsData?.maintenanceRequests?.result || [];
        let leaseDetailsData = tenantRequestsData?.leaseDetails?.result || [];
        let announcementsReceivedData = announcementsResponseData?.received?.result || [];
        let paymentsReceivedData = paymentsResponseData?.MoneyPaid?.result || [];
        let paymentsExpectedData = paymentsResponseData?.MoneyToBePaid?.result || [];

        // console.log("[DEBUG] announcementsReceivedData", announcementsReceivedData);
        console.log("[DEBUG] leaseDetailsdData", leaseDetailsData);

        // Check if all leases are not active
        const allNonActiveLease = propertyData.every((item) => item.lease_status !== "ACTIVE");
        // console.log("Non Active Leases: ", allNonActiveLease);

        // Sort propertyData by lease_status so that active lease is first
        propertyData.sort((a, b) => (a.lease_status === "ACTIVE" ? -1 : b.lease_status === "ACTIVE" ? 1 : 0));

        // Set the state with the fetched data
        setPropertyData(propertyData);
        setLeaseDetails(leaseDetailsData);
        setAllMaintenanceRequests(maintenanceRequestsData);
        setMaintenanceRequests(maintenanceRequestsData);
        setPaymentHistory(paymentsReceivedData);
        setPaymentExpected(paymentsExpectedData);
        setAllAnnouncementsData(announcementsReceivedData);

        // Determine the property address and set it
        let propertyAddress = propertyData[0] ? propertyData[0].property_address + " " + propertyData[0].property_unit : "No Data";
        setPropertyAddr(propertyAddress);
        setFirstName(user.first_name);

        // Set the total balance
        setTotal(propertyData[0] ? propertyData[0].balance : "0.00");

        // Set the selected property based on the location state
        if (location.state?.propertyId) {
          // console.log("Property ID exists: ", propertyId);
          let navPropertyData = propertyData.find((item) => item.property_uid === location.state.propertyId);
          // console.log("navProperty Data set to: ", navPropertyData);
          setSelectedProperty(navPropertyData);
          setPropertyAddr(navPropertyData.property_address + " " + navPropertyData.property_unit);
        } else {
          // console.log("Property ID does NOT exist: ", propertyData);
          // console.log("Setting selectedProperty to : ", propertyData[0]);
          setSelectedProperty(propertyData[0] || null);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }

      setShowSpinner(false);
    };

    getTenantData();
    setRefresh(false);

    // List all dependencies in the dependency array
  }, [reload]);
  //[getProfileId, location.state?.propertyId, navigate, user.first_name, addMaintenance, tenantId]);
  // End Main UseEffect

  useEffect(() => {
    if (propertyData && propertyData.length === 0) {
      const activeLeases = propertyData?.filter((property) => property.lease_status === "ACTIVE");
      // console.log("activeLeases - ", activeLeases)

      if (activeLeases && activeLeases.length === 0) {
        setRightPane({ type: "listings" });
      } else {
        setRightPane("");
      }
    } else {
      setRightPane("");
    }
  }, [propertyData]);

  useEffect(() => {
    if (tenantMaintenanceItemDetailState) {
      setRightPane({ type: "tenantmaintenanceitem" });
    }
  }, [tenantMaintenanceItemDetailState]);

  useEffect(() => {
    if (newTenantMaintenanceState) {
      setRightPane({ type: "addtenantmaintenance" });
    }
  }, [newTenantMaintenanceState]);

  useEffect(() => {
    if (paymentState) {
      setRightPane({ type: "payment" });
    }
  }, [paymentState]);

  useEffect(() => {
    if (viewLeaseState) {
      setRightPane({ type: "viewlease" });
    }
  }, [viewLeaseState]);

  useEffect(() => {
    // console.log("tenantApplicationNavState", tenantApplicationNavState);
    if (tenantApplicationNavState) {
      setRightPane({ type: "tenantApplication", state: tenantApplicationNavState });
    }
  }, [tenantApplicationNavState]);

  useEffect(() => {
    // console.log("viewApprovedLeaseNavState", viewApprovedLeaseNavState);
    if (viewApprovedLeaseNavState) {
      setRightPane({ type: "tenantLeases", state: viewApprovedLeaseNavState });
    }
  }, [viewApprovedLeaseNavState]);

  useEffect(() => {
    const navPropertyData = propertyData.find((item) => item.property_uid === location.state?.propertyId);
    // console.log("Nav Property Data that will be used to setSelectedProperty: ", navPropertyData);

    if (navPropertyData) {
      // console.log("Inside IF, navPropertyData set: ", navPropertyData);
      setSelectedProperty(navPropertyData);
    }
  }, [location.state?.propertyId, propertyData]);

  useEffect(() => {
    if (propertyData) {
      let filteredLease = propertyData.find((lease) => lease.lease_uid === selectedProperty?.lease_uid);
      setSelectedLease(filteredLease);
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
      // console.log("filteredAnnouncements", filteredAnnouncements);
      setAnnouncementsData(filteredAnnouncements);
    }
    if (paymentHistory && paymentExpected) {
      // console.log("Payments exist: ", paymentHistory, paymentExpected);
      // console.log("---selectedProperty.property_uid---", selectedProperty);
      let filteredPaymentHistory = paymentHistory.filter((payment) => payment.pur_property_id === selectedProperty.property_uid);
      // console.log("---filteredPaymentHistory---", filteredPaymentHistory);
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
          // console.log("I found something that says Late Fees", payment);
          lateFeeSum += parseInt(payment.pur_amount_due);
        }
      });
      setRentFees(rentFeeSum);
      setUtilityFees(utilityFeeSum);
      setLateFees(lateFeeSum);
      // console.log("ALL SUMMED FEES", rentFeeSum, utilityFeeSum, lateFeeSum);
      setFilteredPaymentHistory(filteredPaymentHistory);
    }
    if (allMaintenanceRequests) {
      let filteredMaintenanceItems = allMaintenanceRequests.filter((request) => request.property_uid === selectedProperty.property_uid);
      setMaintenanceRequests(sortMaintenanceRequests(filteredMaintenanceItems));
    }
    // }, [allAnnouncementsData, allMaintenanceRequests, propertyData, selectedProperty, paymentHistory]);
  }, [allAnnouncementsData, allMaintenanceRequests, propertyData, selectedProperty, paymentHistory, paymentExpected]);

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

  const renderRightPane = () => {
    console.log("---rightPane.type---", rightPane.type);
    // console.log("336 - rightPane.state - ", rightPane.state);
    switch (rightPane.type) {
      case "listings":
        return <PropertyListings setRightPane={setRightPane} />;
      case "propertyInfo":
        return <PropertyInfo {...rightPane.state} setRightPane={setRightPane} />;
      case "tenantApplication":
        return <TenantApplication {...rightPane.state} setRightPane={setRightPane} setReload={setReload} />;
      case "tenantApplicationEdit":
        return <TenantApplicationEdit {...rightPane.state} setRightPane={setRightPane} />;
      // navigate('/profileEditor');
      case "tenantLeases":
        return <TenantLeases {...rightPane.state} setRightPane={setRightPane} setReload={setReload} />;
      case "announcements":
        return <Announcements setRightPane={setRightPane} />;
      case "tenantmaintenanceitem":
        return <TenantMaintenanceItemDetail tenantMaintenanceItemDetailState={tenantMaintenanceItemDetailState} setRightPane={setRightPane} />;
      case "addtenantmaintenance":
        return <AddTenantMaintenanceItem newTenantMaintenanceState={newTenantMaintenanceState} setRightPane={setRightPane} setReload={setReload} />;
      case "viewlease":
        return (
          <ViewLease
            key={`${viewLeaseState.property_uid}-${viewLeaseState.lease_id}-${viewLeaseState.isDesktop}`}
            property_uid={viewLeaseState.property_uid}
            lease_id={viewLeaseState.lease_id}
            isDesktop={viewLeaseState.isDesktop}
            setRightPane={setRightPane}
          />
        );
      case "payment":
        return <Payments accountBalanceWidgetData={paymentState} setRightPane={setRightPane} />;
      case "editmaintenance":
        return <EditMaintenanceItem setRightPane={setRightPane} />;
      default:
        return null;
    }
  };

  function handleTenantMaintenanceNavigate() {
    let navPropertyData = propertyData.find((item) => item.property_address === selectedProperty.property_address);
    const propertyLeaseData = leaseDetails.find((item) => item.lease_property_id === selectedProperty.lease_property_id);
    // console.log("Navigating to /addTenantMaintenanceItem - propertyLeaseData - ", propertyLeaseData);
    /* navigate("/addTenantMaintenanceItem", {
      state: { propertyData: navPropertyData, leaseData: propertyLeaseData },
    }); */
    const state = { propertyData: navPropertyData, leaseData: propertyLeaseData };
    setnewTenantMaintenanceState(state);
    setAddMaintenance(true);
  }

  // const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

  function NonActiveLeaseDashboardTab({ property, leaseStatus, lease }) {
    return <PropertyCard data={property} status={leaseStatus} leaseData={lease} />;
  }

  // console.log("Selected Property before return: ", selectedProperty);
  // console.log("[DEBUG] leaseDetails", leaseDetails);

  return (
    <ThemeProvider theme={theme}>
      {showSpinner ? (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      ) : (
        <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
          <Grid container spacing={6}>
            {/* <Grid item xs={12}> */}

            {/* welcome message */}
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
                    fontSize: { xs: "22px", sm: "28px", md: "32px" },
                    fontWeight: "600",
                  }}
                >
                  Welcome, {user.first_name}!
                </Typography>
              </Box>
            </Grid>
            
            {/* search icon */}
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
                  variant='contained'
                  sx={{
                    backgroundColor: "#97A7CF",
                    color: theme.typography.secondary.white,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setRightPane({ type: "listings" })}
                >
                  <SearchIcon />
                  {!isMobile && "Search Property"}
                </Button>
              </Box>
            </Grid>
            {/* </Grid> */}

            {/* left side render widget */}
            <Grid item xs={12} md={4}>
              <AccountBalanceWidget
                selectedProperty={selectedProperty}
                selectedLease={selectedLease}
                propertyAddr={propertyAddr}
                propertyData={propertyData}
                total={total}
                rentFees={rentFees}
                lateFees={lateFees}
                utilityFees={utilityFees}
                setPropertyAddr={setPropertyAddr}
                setPropertyId={setPropertyId}
                setSelectedProperty={setSelectedProperty}
                setSelectedLease={setSelectedLease}
                setTotal={setTotal}
                setViewLeaseState={setViewLeaseState}
                rightPane={rightPane.type}
                setPaymentState={setPaymentState}
                setRightPane={setRightPane}
                setTenantApplicationNavState={setTenantApplicationNavState}
                // property={propertyListingData}
                // property={selectedProperty}
                property={propertyData}
                lease={leaseListingData}
                setViewApprovedLeaseNavState={setViewApprovedLeaseNavState}
                propertyLeaseData={leaseDetails}
              />
            </Grid>
            
            {/* right side render */}
            <Grid item xs={12} md={8}>
              {rightPane !== "" ? (
                renderRightPane()
              ) : (
                <Grid container>
                  <Grid item xs={12}>
                    <DashboardTab>
                      <Grid
                        container
                        direction='row'
                        sx={{
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
                                fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" },
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
                                setRightPane({ type: "announcements" });
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
                      <Grid container direction='row' sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
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
                                fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" },
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
                      <Grid container direction='row' sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
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
                                fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" },
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
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                      <Stack>
                        <TenantMaintenanceRequestsTable
                          setTenantMaintenanceItemDetailState={setTenantMaintenanceItemDetailState}
                          data={maintenanceRequests}
                          navToMaintenance={handleTenantMaintenanceNavigate}
                          isMobile={isMobile}
                          isMedium={isMedium}
                          selectedproperty={propertyAddr}
                        />
                      </Stack>
                    </DashboardTab>
                  </Grid>
                </Grid>
              )}
            </Grid>

            <></>
          </Grid>
        </Container>
      )}
    </ThemeProvider>
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
        height: props.fullHeight ? "99%" : "auto",
      }}
    >
      {props.children}
    </Box>
  );
}

export default TenantDashboard;

// NEED THIS FOR PROPERTY DROP DOWN MENU
const AccountBalanceWidget = ({
  selectedProperty,
  selectedLease,
  propertyAddr,
  propertyData,
  total,
  rentFees,
  lateFees,
  utilityFees,
  setPropertyAddr,
  setPropertyId,
  setTotal,
  setSelectedProperty,
  setSelectedLease,
  setViewLeaseState,
  rightPane,
  setPaymentState,
  setRightPane,
  setTenantApplicationNavState,
  property,
  lease,
  setViewApprovedLeaseNavState,
  propertyLeaseData,
}) => {
  const navigate = useNavigate();
  console.log("---selectedProperty in acc---", selectedProperty);
  // console.log("---selectedLease in acc---", selectedLease);
  console.log("---propertyLeaseData in acc---", propertyLeaseData);
  // console.log("---propertyLeaseData in acc---", propertyLeaseData[0].business_name);
  console.log("---propertyData in acc---", propertyData);
  // console.log("---property in acc---", property);

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
        {lease_status === "ACTIVE" ? <CircleIcon fontSize='small' sx={{ color: "#3D5CAC", paddingRight: "10px" }} /> : null /* blue */}
        {lease_status === "REFUSED" || lease_status === "WITHDRAWN" ? <CircleIcon fontSize='small' sx={{ color: "#FF8832", paddingRight: "10px" }} /> : null /* orange */}
        {lease_status === "NEW" ? <CircleIcon fontSize='small' sx={{ color: "#FAD102", paddingRight: "10px" }} /> : null /* yellow */}
        {lease_status === "PROCESSING" ? <CircleIcon fontSize='small' sx={{ color: "#00D100", paddingRight: "10px" }} /> : null /* green */}
        {lease_status === "REJECTED" ? <CircleIcon fontSize='small' sx={{ color: "#FA0202", paddingRight: "10px" }} /> : null /* red */}
        {lease_status === "RESCIND" ? <CircleIcon fontSize='small' sx={{ color: "#000000", paddingRight: "10px" }} /> : null /* black */}
        {lease_status === "ENDED" ? <CircleIcon fontSize='small' sx={{ color: "#2E2E2E", paddingRight: "10px" }} /> : null /* black */}
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
    /* navigate("/viewLease", {
      state: {
        lease_id: lease_uid,
        // property_uid: propertyId,
      },
    }); */
    const state = {
      lease_id: lease_uid,
      property_uid: selectedProperty.property_uid,
      isDesktop: true,
    };
    // console.log('---state to be passed---', state);
    setViewLeaseState(state);
  }

  function handleViewApplicationNavigate(property, lease) {
    const state = {
      data: property,
      status: property.lease_status,
      lease: lease,
      from: "accwidget",
    };
    setTenantApplicationNavState(state);
  }

  function handleViewAprovedLeaseNavigate(property, lease) {
    const state = {
      property: property,
      lease: lease,
      from: "accwidget",
    };
    setViewApprovedLeaseNavState(state);
  }

  function handlePaymentNavigate() {
    const state = {
      selectedProperty,
      selectedLease,
      propertyAddr,
      propertyData,
      total,
      rentFees,
      lateFees,
      utilityFees,
    };
    // console.log('---state to be passed in handlePaymentNavigate---', state);
    setPaymentState(state);
  }

  function handlePropertyChange(item) {
    setPropertyAddr(item.property_address + " " + item.property_unit);
    setPropertyId(item.property_uid);
    setTotal(item.balance);
    setSelectedProperty(item);
    const lease = propertyData.find((lease) => lease.lease_uid === item.lease_uid);
    setSelectedLease(lease);
    if (rightPane == "viewlease") {
      if (
        item.lease_status === "REFUSED" ||
        item.lease_status === "WITHDRAWN" ||
        item.lease_status === "NEW" ||
        item.lease_status === "PROCESSING" ||
        item.lease_status === "RESCIND" ||
        item.lease_status === "REJECTED"
      ) {
        setRightPane("tenantApplication");
        handleViewApplicationNavigate(item, lease);
      } else {
        handleViewLeaseNavigate(item.lease_uid);
      }
    } else if (rightPane == "tenantApplication") {
      if (
        item.lease_status === "REFUSED" ||
        item.lease_status === "WITHDRAWN" ||
        item.lease_status === "NEW" ||
        item.lease_status === "PROCESSING" ||
        item.lease_status === "RESCIND" ||
        item.lease_status === "REJECTED"
      ) {
        handleViewApplicationNavigate(item, lease);
      } else {
        setRightPane("viewlease");
        handleViewLeaseNavigate(item.lease_uid);
      }
    } else if (rightPane === "tenantLeases") {
      if (
        item.lease_status === "REFUSED" ||
        item.lease_status === "WITHDRAWN" ||
        item.lease_status === "NEW" ||
        item.lease_status === "PROCESSING" ||
        item.lease_status === "RESCIND" ||
        item.lease_status === "REJECTED"
      ) {
        handleViewAprovedLeaseNavigate(item, lease);
      } else {
        setRightPane("viewlease");
        handleViewLeaseNavigate(item.lease_uid);
      }
    }
    handleClose();
  }

  const [image, setImage] = useState(defaultHouseImage);
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("No Email");
  const [businesPhone, setBusinessPhone] = useState("No Phone Number");

  useEffect(() => {
    if (selectedProperty) {
      // console.log("selectedProperty: ", selectedProperty);
      // console.log("property: ", property);
      const selectedPropertyImages = propertyData.find((property) => property.property_uid === selectedProperty.property_uid)?.property_favorite_image;
      // console.log("selectedPropertyImages: ", selectedPropertyImages);
      if (selectedPropertyImages) {
        setImage(selectedPropertyImages);
      } else {
        setImage(defaultHouseImage);
      }
    }
  }, [selectedProperty, propertyData]);

  useEffect(() => {
    if (selectedProperty && propertyLeaseData) {
      // console.log("selectedProperty: ", selectedProperty);
      // console.log("propertyLeaseData: ", propertyLeaseData);
      // let selectedPropertyBusinessName = "Business Failing";
      const foundProperty = propertyLeaseData.find((property) => property.property_uid === selectedProperty.property_uid);
      setBusinessName(foundProperty?.business_name ? foundProperty?.business_name : "Not A Real Business");
      setBusinessEmail(foundProperty?.business_email ? foundProperty?.business_email : "No Email")
      setBusinessPhone(foundProperty?.business_phone_number ? foundProperty?.business_phone_number : "No Phone")
    }
  }, [selectedProperty, propertyLeaseData]);

  function handlePropertyChange(item) {
    setPropertyAddr(item.property_address + " " + item.property_unit);
    setPropertyId(item.property_uid);
    setTotal(item.balance);
    setSelectedProperty(item);

    const lease = propertyData.find((lease) => lease.lease_uid === item.lease_uid);
    setSelectedLease(lease);

    handleClose();
  }

  return (
    <DashboardTab fullHeight={!isMobile ? true : false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          paddingRight: "0px",
          flex: 1, // Make the Box take up the remaining space
        }}
      >
        <Box
          sx={{
            flex: 1, // Ensures this box takes up available space
            marginLeft: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%", // Ensure it takes full height
            }}
          >
            <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" }, fontWeight: "bold", color: "#160449" }}>Account Balance</Typography>
            <Box // This is the property image
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
                {" "}
                {/* Adjusted size */}
                <CardMedia
                  component='img'
                  image={image}
                  alt='property image'
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "150px",
                  }}
                />
              </Box>
            </Box>
            <Box // Not sure what this is
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                color: "#160449",
                width: "100%",
                marginTop:"10px"
              }}
            >
              <Box // This is the Lease Status circle indictor to the Left of the address
                sx={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: returnLeaseStatusColor(selectedProperty?.lease_status),
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <Box // This is the Address box including the drop down menu
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
                  <Menu // This is the drop down menu
                    id='demo-customized-menu'
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
                            handlePropertyChange(item);
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
            <Box // Total amount due
              sx={{
                fontSize: { xs: "35px", sm: "35px", md: "35px", lg: "35px" },
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
      
      {/* Make payment */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            handlePaymentNavigate();
          }}
        >
          Make a Payment
        </Box>
      </Box>
      
      {/* Balance Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "10px" : "20px",
          paddingTop: isMobile ? "5px" : isMedium ? "10px" : "20px",
          paddingBottom: isMobile ? "5px" : "20px",
        }}
      >
        <Typography sx={{ fontSize: { xs: "15px", sm: "15px", md: "18px", lg: "21px" }, fontWeight: "bold", color: "#160449" }}>Balance Details</Typography>

        <Grid container>
          <Grid item xs={6} sx={{ color: "#3D5CAC", fontSize: "16px", fontWeight: 700 }}>
            {" "}
            Description{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#3D5CAC", fontSize: "16px", fontWeight: 700, textAlign: "right" }}>
            {" "}
            Amount{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Rent{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${rentFees}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Late Fees{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${lateFees}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Utility{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            ${utilityFees}{" "}
          </Grid>
        </Grid>
      </Box>

      {/* lease details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "10px" : "20px",
          paddingTop: isMobile ? "5px" : "20px",
          paddingBottom: isMobile ? "5px" : "20px",
        }}
      >
        <Typography sx={{ fontSize: { xs: "15px", sm: "15px", md: "18px", lg: "21px" }, fontWeight: "bold" }}>Lease Details</Typography>
        <Grid container>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Start Date{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_start ? selectedLease?.lease_start : ""}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            End Date
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_end ? selectedLease?.lease_end : ""}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Address{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.property_address ? selectedLease?.property_address : ""} {selectedLease?.property_unit ? selectedLease?.property_unit : ""}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Lease UID{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {selectedLease?.lease_uid}
          </Grid>
        </Grid>
      </Box>
      
      {/* For property manager info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "10px" : "20px",
          paddingTop: isMobile ? "5px" : "20px",
          paddingBottom: isMobile ? "5px" : "20px",
        }}
      >
        <Typography sx={{ fontSize: { xs: "15px", sm: "15px", md: "18px", lg: "21px" }, fontWeight: "bold" }}>Property Manager</Typography>
        <Grid container>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Name{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {businessName}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Email{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {businessEmail}{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%" }}>
            {" "}
            Phone{" "}
          </Grid>
          <Grid item xs={6} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "right" }}>
            {" "}
            {businesPhone}{" "}
          </Grid>
        </Grid>
      </Box>

      {/* <Box>Hello</Box>
      <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "24px" }, fontWeight: "bold" }}>Property Manager</Typography>
      <Grid container>
        <Grid item xs={12} sx={{ color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%", textAlign: "left" }}>
          {" "}
          {businessName}
        </Grid>
      </Grid>
      <Box>Goodbye</Box> */}

      {propertyData &&
        propertyData.length > 0 &&
        (selectedProperty?.lease_status === "NEW" ||
        selectedProperty?.lease_status === "REFUSED" ||
        selectedProperty?.lease_status === "WITHDRAWN" ||
        selectedProperty?.lease_status === "PROCESSING" ||
        selectedProperty?.lease_status === "REJECTED" ||
        selectedProperty?.lease_status === "RESCIND" ? (
          <Box // Lease Application Box
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
            onClick={() => handleViewApplicationNavigate(selectedProperty, selectedLease)}
          >
            <img src={documentIcon} alt='document-icon' style={{ width: "15px", height: "17px", margin: "0px", paddingLeft: "15px", paddingRight: "15px" }} />
            <u>View Application</u>
          </Box>
        ) : (
          <Box // View Lease Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItem: "center",
              justifyContent: "center",
              margin: isMobile ? "0px" : "20px",
              paddingBottom: isMobile ? "5px" : "10px",
              cursor: "pointer",
              color: "#3D5CAC",
              fontSize: "20px",
              fontWeight: 600,
            }}
            onClick={() => handleViewLeaseNavigate(selectedLease.lease_uid)}
          >
            <img src={documentIcon} alt='document-icon' style={{ width: "15px", height: "20px", marginTop: "3px", paddingLeft: "0px", paddingRight: "10px" }} />
            <u>View Full Lease</u>
          </Box>
        ))}

      {propertyData && propertyData.length > 0 && selectedProperty?.lease_status === "PROCESSING" && (
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
          onClick={() => handleViewAprovedLeaseNavigate(selectedProperty, selectedLease)}
        >
          <img src={documentIcon} alt='document-icon' style={{ width: "15px", height: "17px", margin: "0px", paddingLeft: "15px", paddingRight: "15px" }} />
          <u>View Approved Lease</u>
        </Box>
      )}
    </DashboardTab>
  );
};

function TenantPaymentHistoryTable(props) {
  // console.log("In Tenant Payment History Table from Stack");
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
        fontWeight: "bold",
      },
      renderCell: (params) => (
        <Box
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
      ),
    },

    {
      field: "total_paid",
      headerName: "Total Paid",
      flex: 0.7,
      headerStyle: {
        fontWeight: "bold",
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
    {
      field: "pur_description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    // {
    //   field: "pur_property_id",
    //   headerName: "Property (200)",
    //   flex: 1,
    //   align: "right",
    //   renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value.slice(-4)}</Box>,
    // },
  ];

  const columnList = () => {
    if (isMobile || isMedium) {
      return mobileColumnsList;
    } else {
      return mobileColumnsList.concat(desktopColumnsList);
    }
  };

  if (props.data && props.data.length > 0) {
    // console.log("In Tenant Payment History Table from Stack - Displaying Info");
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
      <Box sx={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", minHeight: "200px" }}>
        <Typography sx={{ fontSize: { xs: "16px", sm: "16px", md: "16px", lg: "16px" } }}>No Payment History Available</Typography>
      </Box>
    );
  }
}

function TenantMaintenanceRequestsTable(props) {
  // console.log("In Maintenance Request Table from Stack");
  const data = props.data;
  const isMobile = props.isMobile;
  const isMedium = props.isMedium;
  // console.log("TenantMaintenanceRequestTable is Mobile", isMobile);
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
  // console.log('----data in dashboard----', data);
  // data.forEach((item) => {
  //   let favoriteImage = "";
  //   const maintenanceImagesList = JSON.parse(item.maintenance_images);

  //   if (maintenanceImagesList && maintenanceImagesList.length > 0) {
  //     favoriteImage = maintenanceImagesList.find((url) => url.endsWith("img_cover"));
  //   }else {
  //     favoriteImage = PlaceholderImage;
  //   }
  //   item.favorite_image = favoriteImage;
  // });

  const getColorForStatus = (status) => {
    switch (status) {
      case "NEW":
        return "#B62C2A";
      case "INFO REQUESTED":
        return "#D4736D";
      case "PROCESSING":
        return "#DEA19C";
      case "SCHEDULED":
        return "#99CCFF";
      case "COMPLETED":
        return "#6699FF";
      case "CANCELLED":
        return "#0000FF";
      default:
        return "#000000";
    }
  };

  const getColorForPriority = (priority) => {
    switch (priority) {
      case "Low":
        return "#FFFF00";
      case "Medium":
        return "#FFA500";
      case "High":
        return "#FF0000";
      default:
        return "#FFFFFF";
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
            padding: "5px",
            color: "#FFFFFF",
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
      renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
      headerAlign: "center",
    },
  ];

  const columnsListDesktop = [
    {
      field: "maintenance_favorite_image",
      headerName: "Images",
      flex: 0.5,
      renderCell: (params) => {
        const imageUrl = params.value ? params.value : PlaceholderImage;
        return <img src={imageUrl} alt='Maintenance' style={{ width: "60px", height: "55px" }} />;
      },
      headerAlign: "center",
    },
    {
      field: "maintenance_priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getColorForPriority(params.value),
              color: "#000000",
              width: "80px",
              height: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>{params.value}</Typography>
          </Box>
        </Box>
      ),
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
    return (
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
          /*navigate(`/tenantMaintenanceItemDetail`, {
            state: {
              item: row.row,
            },
          }); 
          */
          const state = {
            item: row.row,
            property: props.selectedproperty,
          };
          props.setTenantMaintenanceItemDetailState(state);
        }}
      />
    );
  } else {
    return (
      <Box sx={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center", minHeight: "200px" }}>
        <Typography sx={{ fontSize: { xs: "16px", sm: "16px", md: "16px", lg: "16px" } }}>No Maintenance Requests Available</Typography>
      </Box>
    );
  }
}
