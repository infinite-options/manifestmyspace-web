import { Box, Button, Typography, Stack, Grid, MenuItem, Menu, Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, ListItemAvatar } from "@mui/material";
import CardSlider from "./CardSlider";
import PlaceholderImage from "./PlaceholderImage.png";
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
import { DataGrid } from "@mui/x-data-grid";

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
  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState(`${getProfileId()}`);
  const [total, setTotal] = useState("0.00");

  const [anchorEl, setAnchorEl] = useState(null);

  const [userLeases, setUserLeases] = useState(null);
  const [selectedLease, setSelectedLease] = useState(null);
  // const [refresh, setRefresh] = useState(false || location.state?.refresh);

  const open = Boolean(anchorEl);

  // useEffect(() => {
  //   console.log("selectedProperty - ", selectedProperty);
  // }, [selectedProperty]);

  // useEffect(() => {
  //   console.log("selectedLease - ", selectedLease);
  // }, [selectedLease]);

  // useEffect(() => {
  //   console.log("maintenanceRequests - ", maintenanceRequests);
  // }, [maintenanceRequests]);

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user } = useUser();

  let automatic_navigation_handler = (propertyData) => {
    const allNonActiveLease = propertyData.every((item) => item.lease_status !== "ACTIVE"); // Checks if there is any active lease or not
    if (!propertyData || propertyData.length === 0 || allNonActiveLease) {
      navigate("/listings");
    }
  };

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
    if (!getProfileId()) navigate("/PrivateprofileName");
    const getTenantData = async () => {
      setShowSpinner(true);
      try {
        const tenantRequests = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`);
        // const leaseResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
        // const propertyResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/listings/${getProfileId()}`); //removing /listings endpoint call from Tenant Dashboard
        const announcementsResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`);

        const tenantRequestsData = await tenantRequests.json();
        // const leaseData = await leaseResponse.json();
        // const propertyResponseData = await propertyResponse.json(); //removing /listings endpoint call from Tenant Dashboard
        const announcementsResponseData = await announcementsResponse.json();

        // setUserLeases(propertyResponseData.Tenant_Leases.result); //removing /listings endpoint call from Tenant Dashboard

        let propertyData = tenantRequestsData?.property?.result;
        let maintenanceRequestsData = tenantRequestsData?.maintenanceRequests?.result;
        let leaseDetailsData = tenantRequestsData?.leaseDetails?.result;
        let announcementsReceivedData = announcementsResponseData?.received?.result;
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

        if (!propertyData || propertyData.length === 0 || allNonActiveLease) {
          navigate("/listings");
        }

        setPropertyData(propertyData || []);
        setLeaseDetails(leaseDetailsData || []);
        setAllMaintenanceRequests(maintenanceRequestsData);
        setMaintenanceRequests(maintenanceRequestsData || []);

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

  // useEffect(() => {
  //   let navPropertyData = propertyData.find((item) =>  item.property_uid === location.state?.propertyId);
  //   setSelectedProperty(navPropertyData);
  // }, [location.state?.propertyId]);

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
        
        if(announcementPropertiesString == null){
          return false;
        }       

        
        let announcementPropertiesArray;        
        if (announcementPropertiesString.startsWith('[') && announcementPropertiesString.endsWith(']')) {            
            announcementPropertiesArray = JSON.parse(announcementPropertiesString);
        } else {            
            announcementPropertiesArray = [announcementPropertiesString];
        }        
        return announcement.announcement_properties.includes(selectedProperty.property_uid);
        
      });

      filteredAnnouncements.sort((a, b) => b.announcement_uid.localeCompare(a.announcement_uid));      

      setAnnouncementsData(filteredAnnouncements);
    }
  }, [allAnnouncementsData, allMaintenanceRequests, propertyData, selectedProperty]);

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

  // const handleStripePayment = async (e) => {
  //   setShowSpinner(true);
  //   console.log("Stripe Payment");
  //   try {
  //     //const stripe = await stripePromise;
  //     const response = await fetch(API_CALL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(paymentData),
  //     });
  //     const checkoutURL = await response.text();
  //     //console.log(response.text());
  //     window.location.href = checkoutURL;
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setShowSpinner(false);
  // };

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
            >
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "22px",
                      fontWeight: "600",
                    }}
                  >
                    Hello {firstName}!
                  </Box>
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
                    onClick={() => {
                      navigate("/myProperty", {
                        state: {
                          propertyData: propertyData,
                          propertyId: propertyId,
                        },
                      });
                    }}
                  ></Box>
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
              <>
                <DashboardTab>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
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
                          flexDirection: "row",
                        }}
                      >
                        {/* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#00000080",
                              padding: "6px",
                            }}
                          >
                            Pay before {propertyData[0] !== undefined ? propertyData[0].earliest_due_date : "No Data"}
                          </Box> */}
                        <Box sx={{ fontSize: "20px", fontWeight: "bold", color: "#160449" }}>Balance</Box>
                        <Box sx={{ fontSize: "20px", fontWeight: "bold", color: "#160449", marginLeft: "5px" }}>
                          (Pay before: {(selectedProperty == null || !selectedProperty.earliest_due_date) ? "No Data" : selectedProperty.earliest_due_date})
                        </Box>
                      </Box>
                      <Box sx={{ fontSize: "26px", fontWeight: "bold", color: "#A52A2A", margin: "10px" }}>${total}</Box>
                      <Box
                        sx={{ fontSize: "15px", fontWeight: "600", color: "#3D5CAC" }}
                        onClick={() => {
                          navigate("/payments");
                        }}
                      >
                        View Details
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItem: "center",
                        justifyContent: "center",
                        marginRight: "20px",
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
                        }}
                        onClick={() => {
                          // handleStripePayment()
                          navigate("/payments");
                        }}
                      >
                        Make a Payment
                      </Box>
                    </Box>
                  </Box>
                </DashboardTab>
                <DashboardTab>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        color: "#160449",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginTop: "10px",
                      }}
                      // onClick={() => navigate("/tenantMaintenance")}
                    >
                      Maintenance ({maintenanceRequests.length})
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                  </Box>
                  
                  <Stack>
                    <MaintenanceRequestsTable data={maintenanceRequests}/>
                    </Stack>
                </DashboardTab>
                <DashboardTab>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        color: "#160449",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginTop: "10px",
                      }}
                    >
                      Announcements
                    </Box>
                    <Box
                      sx={{
                        color: "#007AFF",
                        fontSize: "18px",
                        marginLeft: "20px",
                        marginTop: "10px",
                      }}
                      onClick={() => {
                        navigate("/announcement", { state: { announcementsData, propertyAddr } });
                      }}
                    >
                      View all ({announcementsData.length})
                    </Box>
                  </Box>
                  <CardSlider data={announcementsData} />
                  {/*debug*/}
                  {/* <Box>
                      {announcementsData.map((announcement, index) => {
                        return (
                          <>
                          <Box>{index} - {announcement.announcement_title}</Box>
                          </>
                        )
                      })}
                    </Box> */}
                </DashboardTab>
                <DashboardTab>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={6} md={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <DashboardActionItem
                          icon={<PhoneIcon />}
                          text={"Call Manager"}
                          onClick={() => {
                            console.log("Call Manager");
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <DashboardActionItem
                          icon={<BuildIcon />}
                          text={"Maintenance"}
                          onClick={() => {
                            handleTenantMaintenanceNavigate();
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <DashboardActionItem
                          icon={<ArticleIcon />}
                          text={"View Lease"}
                          onClick={() => {
                            handleViewLeaseNavigate(selectedProperty.lease_uid);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <DashboardActionItem
                          icon={<ArticleIcon />}
                          text={"Documents"}
                          onClick={() => {
                            navigate("/tenantDocuments", {
                              state: { propertyAddr: propertyAddr },
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </DashboardTab>
              </>
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



function MaintenanceRequestsTable(props) {
  const data = props.data;  

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

  data.forEach(item => {
    let favoriteImage = "";
    const maintenanceImagesList = JSON.parse(item.maintenance_images) 
    
    if (maintenanceImagesList && maintenanceImagesList.length > 0) {      
      favoriteImage = maintenanceImagesList.find((url) => url.endsWith("img_cover"));      
    } else {
      favoriteImage = PlaceholderImage;      
    }
    item.favorite_image = favoriteImage

  })
  console.log("MaintenanceRequestsTable - data - ", data);

  const columnsList = [
    {
      field: "favorite_image",
      headerName: "Images",
      flex: 0.5,
      renderCell: (params) => <img src={params.value} alt="Maintenance" style={{ width: "60px", height: "55px" }} />,
      headerAlign: 'center',
    },
    {
      field: "maintenance_title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>{params.value}</Box>,
      headerAlign: 'center',
    },
    {
      field: "maintenance_request_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => <Box sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'  }}>{params.value}</Box>,
      headerAlign: 'center',      
    },

    {
      field: "maintenance_priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => <Box sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'  }}>{params.value}</Box>,
      headerAlign: 'center',
    },

    {
      field: "maintenance_request_created_date",
      headerName: "Created Date",
      flex: 1,
      headerStyle: {
        fontWeight: 'bold', 
      },
      renderCell: (params) => <Box sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'  }}>{params.value? params.value : "-"}</Box>,
      headerAlign: 'center',
    },

    {
      field: "maintenance_scheduled_date",
      headerName: "Scheduled Date",
      flex: 1,
      headerStyle: {
        fontWeight: 'bold',
      },
      renderCell: (params) => <Box sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'  }}>{params.value? getValidDate(params.value) : "-"}</Box>,
      headerAlign: 'center',
    },

    {
      field: "maintenance_scheduled_time",
      headerName: "Scheduled Time",
      flex: 1,
      headerStyle: {
        width: '100%',
        fontWeight: 'bold', 
      },
      renderCell: (params) => <Box sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'  }}>{params.value? formatTime(params.value) : "-"}</Box>,
      headerAlign: 'center',
    },
  ];

  if (data.length > 0) {    
    console.log("Passed Data ", data);
    return (
      <>
        <DataGrid
          rows={data}
          columns={columnsList}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          getRowId={(row) => row.maintenance_request_uid}
          pageSizeOptions={[5, 10, 25]}          
          onRowClick={(row) => {
            {
              console.log("Row =", row);
            }
            // handleOnClickNavigateToMaintenance(row);
          }}
          //   onRowClick={(row) => handleOnClickNavigateToMaintenance(row)}
        />        
      </>      
    );
  } else {
    return <></>;
  }
}
