import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid, Badge } from "@mui/material";
import theme from "../../theme/theme";
import propertyImage from "./propertyImage.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ArrowLeft from "./ArrowLeft.png";
import ArrowRight from "./ArrowRight.png";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LeaseIcon from "./leaseIcon.png";
import CreateIcon from "@mui/icons-material/Create";
import { getPaymentStatusColor, getPaymentStatus } from "./PropertyList.jsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { DataGrid } from "@mui/x-data-grid";
import { useUser } from "../../contexts/UserContext";

import { maintenanceOwnerDataCollectAndProcess } from "../Maintenance/MaintenanceOwner.jsx";
import { maintenanceManagerDataCollectAndProcess } from "../Maintenance/MaintenanceManager.jsx";

import APIConfig from "../../utils/APIConfig";

const getAppColor = (app) => (app.lease_status !== "REJECTED" ? (app.lease_status !== "REFUSED" ? "#778DC5" : "#874499") : "#A52A2A");

// export default function PropertyNavigator({ currentIndex, setCurrentIndex, propertyList, contracts, props }) {
export default function PropertyNavigator({ index, propertyList, allRentStatus, contracts, props }) {
  console.log("In Property Navigator");
  console.log(index, propertyList);
  console.log(contracts);
  const navigate = useNavigate();
  const { getProfileId, isManager, roleName, selectedRole } = useUser();

  const [propertyData, setPropertyData] = useState(propertyList);
  const [currentIndex, setCurrentIndex] = useState(index);
  // console.log(currentIndex);
  // const [item, setItem] = useState(propertyData[currentIndex]);
  const [property, setProperty] = useState(propertyData[currentIndex]);
  const [currentId, setCurrentId] = useState(property.property_uid);
  const [maintenanceData, setMaintenanceData] = useState([{}]);
  const [propertyRentStatus, setpropertyRentStatus] = useState([]);

  // Parse property images once outside the component
  const parsedPropertyImages = propertyData[currentIndex].property_images ? JSON.parse(propertyData[currentIndex].property_images) : [];
  console.log("parsedImages:", parsedPropertyImages);
  console.log("parsedImages.length:", parsedPropertyImages.length);

  // Initialize state with parsed images or fallback to propertyImage if empty
  const [images, setImages] = useState(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

  // Initialize maxSteps state
  const [maxSteps, setMaxSteps] = useState(0);

  // Log images and its length after it's updated
  useEffect(() => {
    console.log("What's in Images: ", images, images.length);
    setMaxSteps(images.length); // Update maxSteps state
    console.log("MaxSteps: ", images.length); // Log maxSteps within useEffect
  }, [images]); // This useEffect will re-run whenever the 'images' state changes

  console.log("MaxSteps: ", maxSteps); // Log maxSteps outside of useEffect

  const [activeStep, setActiveStep] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [contractsData, setContractsData] = useState(contracts);
  const [contractsNewSent, setContractsNewSent] = useState(0);
  const [maintenanceReqData, setMaintenanceReqData] = useState([{}]);
  console.log("Maintenance Request Data1: ", maintenanceReqData);
  const [displayMaintenanceData, setDisplayMaintenanceData] = useState([{}]);

  const color = theme.palette.form.main;
  const [propertyId, setPropertyId] = useState(propertyData[currentIndex].property_uid);

  // console.log(propertyId)
  console.log("Maintenance Request Data: ", maintenanceReqData);

  let data = "";
  const role = roleName();
  if (role === "Manager") {
    data = "maintenance_status";
  } else if (role === "Owner") {
    data = "maintenance_request_status";
  }
  console.log("Role is: ", role, data);

  const maintenanceColumns = [
    {
      field: "maintenance_request_uid",
      headerName: "UID",
      flex: 1,
    },
    {
      field: "maintenance_request_created_date",
      headerName: "Created Date",
      flex: 1,
    },
    {
      field: "maintenance_title",
      headerName: "Title",
      flex: 1,
    },

    {
      field: data,
      headerName: "Status",
      flex: 1,
    },
  ];

  function getPropertyList(data) {
    const propertyList = data["Property"].result;
    const applications = data["Applications"].result;
    const appsMap = new Map();
    applications.forEach((a) => {
      const appsByProperty = appsMap.get(a.property_uid) || [];
      appsByProperty.push(a);
      appsMap.set(a.property_uid, appsByProperty);
    });
    return propertyList.map((p) => {
      p.applications = appsMap.get(p.property_uid) || [];
      p.applicationsCount = [...p.applications].filter((a) => a.lease_status === "NEW").length;
      return p;
    });
  }

  useEffect(() => {
    const nextIndex = index;
    setCurrentIndex(nextIndex);
    const nextId = propertyData[nextIndex].property_uid;
    setCurrentId(nextId);
    setProperty(propertyData[nextIndex]);
    const parsedPropertyImages = propertyData[nextIndex].property_images ? JSON.parse(propertyData[nextIndex].property_images) : [];
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);
    setActiveStep(0);
  }, [index, propertyList]);

  useEffect(() => {
    // console.log("--debug NEW propertyId--", propertyData[currentIndex].property_uid)
    setPropertyId(propertyData[currentIndex].property_uid);

    const getContractsForOwner = async () => {
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
        if (!response.ok) {
          console.log("Error fetching contracts data");
        }
        const contractsResponse = await response.json();
        var count = 0;
        const contracts = contractsResponse.result.filter((contract) => contract.property_id === propertyId);
        // console.log("--debug Contracts for owner--", contracts)
        contracts.forEach((contract) => {
          if (contract.contract_status === "SENT" || contract.contract_status === "NEW") {
            count++;
          }
        });
        setContractsNewSent(count);
        setContractsData(contracts);
      } catch (error) {
        console.log(error);
      }
    };
    getContractsForOwner();
    // refreshPropertyData();
    const rentDetails = getRentStatus();
    setpropertyRentStatus(rentDetails)
  }, [currentIndex, propertyId]);

  //const [propertyId, setPropertyId] = useState('200-000028')
  const tenant_detail = property.lease_start && property.tenant_uid ? `${property.lease_start}: ${property.tenant_first_name} ${property.tenant_last_name}` : "No Tenant";
  const manager_detail = property.business_uid ? `${property.business_name}` : "No Manager";
  const [arrowButton1_color, set_arrow1_color] = useState(
    tenant_detail === "No Tenant" && manager_detail === "No Manager" ? theme.typography.common.gray : theme.typography.common.blue
  );

  //   useEffect(() => {
  //     const getMaintenanceForProperty = async () => {
  //       setShowSpinner(true);
  //       try {
  //         console.log("About to call maintenanceStatus endpoint Property Navigator");
  //         // const responseProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${property.property_uid}`);
  //         const responseProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceStatus/${getProfileId()}`);
  //         // call maintenanceStatus
  //         const propertyMaintenanceData = await responseProperty.json();
  //         const propertyMaintenanceDataResult = propertyMaintenanceData.result;
  //         setMaintenanceReqData(propertyMaintenanceDataResult);
  //         const property_uid = property.property_uid;
  //         var propertyMaintenanceList = [];
  //         Object.keys(propertyMaintenanceDataResult).forEach((status) => {
  //           // console.log("propertyMaintenanceDataResult[status]", status, propertyMaintenanceDataResult[status])
  //           // console.log("propertyMaintenanceDataResult[status].maintenance_items", status, propertyMaintenanceDataResult[status].maintenance_items)
  //           if (status === "COMPLETED" || status === "CANCELLED" || status === "PAID" || status === "0") {
  //             delete propertyMaintenanceDataResult[status];
  //           } else if (propertyMaintenanceDataResult[status].maintenance_items) {
  //             propertyMaintenanceDataResult[status].maintenance_items = propertyMaintenanceDataResult[status].maintenance_items.filter(
  //               (item) => item.maintenance_property_id === property_uid
  //             );
  //             propertyMaintenanceList = propertyMaintenanceList.concat(propertyMaintenanceDataResult[status].maintenance_items);
  //           }
  //         });
  //         setMaintenanceData(propertyMaintenanceList);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       setShowSpinner(false);
  //     };
  //     getMaintenanceForProperty();
  //   }, [currentIndex, propertyId]);

  useEffect(() => {
    let profileId = getProfileId();
    console.log("getProfileID", getProfileId());
    if (profileId.startsWith("600")) {
      // maintenanceDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, propertyId)
      // console.log("Manager ID. and we need to return maintenance that is properly parsed")
      maintenanceManagerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, setDisplayMaintenanceData, profileId);
    } else if (profileId.startsWith("110")) {
      // maintenanceDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, propertyId)
      // console.log("Manager ID. and we need to return maintenance that is properly parsed")
      maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
    } else if (profileId.startsWith("200")) {
      maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
    }
  }, [currentIndex, propertyId]);

  function getColorStatusBasedOnSelectedRole() {
    // const role = roleName();
    // console.log("role", role)

    if (role === "Manager") {
      return theme.colorStatusPMO;
    } else if (role === "Owner") {
      return theme.colorStatusO;
    } else if (role === "Maintenance") {
      return theme.colorStatusMM;
    } else if (role === "PM Employee") {
      return theme.colorStatusPMO;
    } else if (role === "Maintenance Employee") {
      return theme.colorStatusMM;
    } else if (role === "Tenant") {
      return theme.colorStatusTenant;
    }
  }

  function handleOnClickNavigateToMaintenance(row) {
    const role = roleName();
    console.log(role);
    let status = "NEW REQUEST";
    console.log("initial Status: ", status);
    console.log("handleOnClickNavigateToMaintenance");
    console.log("row", row);
    // console.log("maintenanceReqData", maintenanceReqData);
    // console.log("maintenanceData", maintenanceData);
    console.log("New data: ", property.maintenance);
    // console.log("New ID: ", property.maintenance);
    // console.log(
    //   "maintenance_request_index",
    //   maintenanceData.findIndex((item) => item.maintenance_request_uid === row.id)
    // );
    console.log(
      "maintenance_request_index_new",
      property.maintenance.findIndex((item) => item.maintenance_request_uid === row.id)
    );

    console.log("Row: ", row);
    console.log("Row1: ", row.row);
    console.log("Row2: ", row.row.maintenance_status);

    // console.log("maintenanceItemsForStatus", maintenanceReqData[status]);
    // console.log("allMaintenanceData", maintenanceReqData);

    if (role === "Manager") {
      // These maitenance_status fields work for a Property Manager.  Need to make this Role Specific
      status = row.row.maintenance_status;
      console.log("Manager status", status);

      if (status === "NEW" || status === "INFO") {
        status = "NEW REQUEST";
      } else if (status === "PROCESSING") {
        status = "QUOTES REQUESTED";
      } else if (status === "CANCELLED") {
        status = "COMPLETED";
      }
    }

    if (role === "Owner") {
      // Owner Status
      status = row.row.maintenance_request_status;
      console.log("Owner status", status);

      if (status === "NEW") {
        status = "NEW REQUEST";
      } else if (status === "INFO") {
        status = "INFO REQUESTED";
      }
    }

    console.log("Final status", status);
    console.log(row.id);
    console.log(maintenanceReqData[status].findIndex);
    console.log(maintenanceReqData[status]);
    console.log(maintenanceReqData);

    try {
      navigate("/maintenance/detail", {
        state: {
          maintenance_request_index: maintenanceReqData[status].findIndex((item) => item.maintenance_request_uid === row.id), // index in the status array
          status: status,
          maintenanceItemsForStatus: maintenanceReqData[status],
          allMaintenanceData: maintenanceReqData,
          fromProperty: true,
        },
        // try {
        //   navigate("/maintenance/detail", {
        //     state: {
        //       maintenance_request_index: maintenanceReqData[status].findIndex((item) => item.maintenance_request_uid === row.id), // index in the status array
        //       status: status,
        //       maintenanceItemsForStatus: maintenanceReqData[status],
        //       allMaintenanceData: maintenanceReqData,
        //       fromProperty: true,
        //     },
      });
    } catch (error) {
      console.log(error);
      alert("Error navigating to maintenance detail", error);
    }
  }

  function displayTopMaintenanceItem() {
    const colorStatus = getColorStatusBasedOnSelectedRole();
    if (property.maintenanceCount > 0) {
      // console.log("Passed Data ", property.maintenance); // This is the same as maintenanceData
      return (
        <DataGrid
          rows={property.maintenance}
          columns={maintenanceColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={(row) => row.maintenance_request_uid}
          pageSizeOptions={[5]}
          onRowClick={(row) => {
            {
              console.log("Row =", row);
            }
            handleOnClickNavigateToMaintenance(row);
          }}
        //   onRowClick={(row) => handleOnClickNavigateToMaintenance(row)}
        />

        // <DataGrid
        //   rows={property.maintenance}
        //   columns={maintenanceColumns}
        //   initialState={{
        //     pagination: {
        //       paginationModel: {
        //         pageSize: 5,
        //       },
        //     },
        //   }}
        //   getRowId={(row) => row.maintenance_request_uid}
        //   pageSizeOptions={[5]}
        //   onRowClick={(row) => {
        //     {
        //       console.log("List Item Clicked", property, i, propertyList);
        //     }
        //     handleOnClickNavigateToMaintenance(row)}}
        // />
      );
    } else {
      return "No Open Maintenance Tickets";
    }
  }

  //   function numberOfMaintenanceItems(maintenanceItems) {
  //     if (maintenanceItems && maintenanceItems.length > 0) {
  //       return maintenanceItems.filter((mi) => !!mi.maintenance_request_uid).length;
  //     } else {
  //       return 0;
  //     }
  //   }

  function navigateToMaintenanceAccordion() {
    // console.log("click to maintenance accordion for property")
    navigate("/maintenance");

    // TODO: Need to send props to /maintenance to navigate to correct tab and item
  }

  const handleNextCard = () => {
    //   setCurrentIndex((prevIndex) => (prevIndex + 1) % propertyData.length);
    let nextIndex = (currentIndex + 1) % propertyData.length;
    setCurrentIndex(nextIndex);
    const nextId = propertyData[nextIndex].property_uid;
    // console.log("next property id", nextId)
    setCurrentId(nextId);
    setProperty(propertyData[nextIndex]);

    // setImages(JSON.parse(propertyData[nextIndex].property_images));
    const parsedPropertyImages = propertyData[nextIndex].property_images ? JSON.parse(propertyData[nextIndex].property_images) : [];
    console.log("parsedImages:", parsedPropertyImages);
    console.log("parsedImages.length:", parsedPropertyImages.length);
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

    setActiveStep(0);
    //   setActiveStep((JSON.parse(propertyData[currentIndex+1].property_images)).findIndex(url => url === propertyData[currentIndex+1].property_favorite_image));
  };

  const handlePreviousCard = () => {
    let previousIndex = (currentIndex - 1 + propertyData.length) % propertyData.length;
    setCurrentIndex(previousIndex);
    const previousId = propertyData[previousIndex].property_uid;
    // console.log("previous property id", previousId)
    setCurrentId(previousId);
    setProperty(propertyData[previousIndex]);

    // setImages(JSON.parse(propertyData[previousIndex].property_images));
    const parsedPropertyImages = propertyData[previousIndex].property_images ? JSON.parse(propertyData[previousIndex].property_images) : [];
    console.log("parsedImages:", parsedPropertyImages);
    console.log("parsedImages.length:", parsedPropertyImages.length);
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

    setActiveStep(0);
    // setActiveStep((JSON.parse(propertyData[currentIndex-1].property_images)).findIndex(url => url === propertyData[currentIndex-1].property_favorite_image));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleManagerChange = (index) => {
    if (property.business_uid) {
      navigate("/managerDetails", {
        state: {
          ownerId: property.owner_uid,
          managerBusinessId: property.business_uid,
          managerData: property,
          propertyData: propertyData,
          index: currentIndex,
        },
      });
    } else {
      // console.log("--debug--", index, propertyData)
      navigate("/searchManager", { state: { index: index, propertyData } });
    }
  };

  const handleAppClick = (index) => {
    navigate("/tenantApplicationNav", { state: { index: index, property: property } });
  };

  const getRentStatus = () => {
    try {
      const rentStatus = allRentStatus.filter((data) => data.property_uid == currentId && data.rent_status != "VACANT");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formatData = (data) => {
        return data.map(item => {
          return {
            ...item,
            cf_monthName: monthNames[item.cf_month - 1],
            total_paid_formatted: item.total_paid ? `$${item.total_paid}` : "-",
            latest_date_formatted: item.latest_date || "-"
          };
        });
      };

      const formattedData = propertyRentStatus ? formatData(rentStatus) : [];
      return formattedData
    } catch (error) {
      console.log(error);
    }
  };

  const paymentStatusColorMap = (value) => {
    if (value === "PAID") {
      return theme.palette.priority.clear;
    }else if (value === "UNPAID") {
      return theme.palette.priority.high;
    } else if (value === "PARTAILLY PAID") {
      return theme.palette.priority.medium;
    } else if (value === "PAID LATE" || "NO MANAGER") {
      return theme.palette.priority.low
    } 
  };

  const rentStatusColumns = [
    {
      field: "cf_monthName",
      headerName: "Month",
      flex: 0.7,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
    {
      field: "latest_date_formatted",
      headerName: "Paid",
      flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
    {
      field: "total_paid_formatted",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },

    {
      field: "rent_status",
      headerName: "Rent Status",
      flex: 1,
      renderCell: (params) => {
        return <Box
          sx={{  width: '100%',
          margin: "0px", textAlign: "center", 
          color: "#F2F2F2", backgroundColor: paymentStatusColorMap(params.value), 
          overflowWrap: 'break-word',
          whiteSpace:'break-spaces',
          }}>
          {params.value}
        </Box>;
      },
    },
  ];

  return (
    <Paper
      style={{
        margin: "10px",
        backgroundColor: theme.palette.primary.main,
        width: "100%", // Occupy full width with 25px margins on each side
        paddingBottom: "30px",
      }}
    >
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          flexDirection: "column", // Added this to stack children vertically
          justifyContent: "center",
          width: "100%", // Take up full screen width
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Button onClick={handlePreviousCard} disabled={currentIndex == 0}>
            {currentIndex === 0 ? (
              // <img src={ArrowLeft} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
              <ArrowBackIcon sx={{ color: "#A0A0A0", width: "25px", height: "25px", margin: "0px" }} />
            ) : (
              // <img src={ArrowLeft} style={{width: '25px', height: '25px', margin:'0px'}}/>
              <ArrowBackIcon sx={{ color: "#000000", width: "25px", height: "25px", margin: "0px" }} />
            )}
          </Button>
          <Stack direction="column" margin="0px" justifyContent="center" alignItems="center" spacing={2}>
            <Typography sx={{ color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px" }}>
              {currentIndex + 1} of {propertyData.length} Properties
            </Typography>
          </Stack>
          <Button onClick={handleNextCard} disabled={currentIndex == propertyData.length - 1}>
            {currentIndex == propertyData.length - 1 ? (
              // <img src={ArrowRight} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
              <ArrowForwardIcon sx={{ color: "#A0A0A0", width: "25px", height: "25px", margin: "0px" }} />
            ) : (
              // <img src={ArrowRight} style={{width: '25px', height: '25px', margin:'0px'}}/>
              <ArrowForwardIcon sx={{ color: "#000000", width: "25px", height: "25px", margin: "0px" }} />
            )}
          </Button>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
          <Typography
            sx={{
              color: theme.typography.primary.black,
              fontWeight: theme.typography.primary.fontWeight,
              fontSize: theme.typography.largeFont,
            }}
            paddingBottom="20px"
          >
            {property.property_address} {property.property_unit}, {property.property_city} {property.property_state} {property.property_zip}
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "95%",
            }}
          >
            <Grid container rowSpacing={6} columnSpacing={6}>
              <Grid item xs={12} md={12}>
                <Card
                  sx={{
                    backgroundColor: color,
                    boxShadow: "none",
                    elevation: "0",
                    // width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        // display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        // width: "50%",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={images[activeStep]}
                        sx={{
                          elevation: "0",
                          boxShadow: "none",
                          maxWidth: "500px",
                          minWidth: "200px",
                          maxHeight: "500px",
                          minHeight: "100px",
                          height: "300px",
                          objectFit: "cover",
                          center: "true",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Box>
                    <MobileStepper
                      steps={maxSteps}
                      position="static"
                      activeStep={activeStep}
                      variant="text"
                      sx={{
                        backgroundColor: color,
                        width: "100%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        elevation: "0",
                        boxShadow: "none",
                      }}
                      nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                          {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                      }
                      backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                          {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={12} sx={{}}>
                <Box
                  sx={{
                    backgroundColor: getPaymentStatusColor(property.rent_status),
                    color: theme.typography.common.blue,
                    alignItems: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px", textAlign: "center" }}>
                    <b>Rent Status:</b> {getPaymentStatus(property.rent_status)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: color, height: "100%" }}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                      textAlign: "center",
                    }}
                  >
                    Property Details
                  </Typography>
                  <CardContent
                    sx={{
                      flexDirection: "column",
                      alignItems: "left",
                      justifyContent: "left",
                      width: "90%",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingRight: "10px",
                            textAlign: "left",
                          }}
                        >
                          Type
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property.property_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Sqft
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property.property_area}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Bed
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property.property_num_beds}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Bath
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property.property_num_baths}
                        </Typography>
                      </Grid>
                      {property?.lease_uid && (
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", width: "100%", justifyContent: "left", alignItems: "left" }}>
                            <Button
                              sx={{
                                padding: "0px",
                              }}
                              onClick={() =>
                                navigate("/viewLease", {
                                  state: {
                                    lease_id: property.lease_uid,
                                  },
                                })
                              }
                            >
                              <Typography
                                sx={{
                                  textTransform: "none",
                                  color: theme.typography.primary.black,
                                  fontWeight: theme.typography.secondary.fontWeight,
                                  fontSize: theme.typography.smallFont,
                                  paddingRight: "10px",
                                }}
                              >
                                View Lease
                              </Typography>
                              <img src={LeaseIcon} />
                            </Button>
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={property?.lease_uid ? 6 : 12}>
                        <Typography
                          sx={{
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          Rent: {property.property_listed_rent ? "$" + property.property_listed_rent : "No Rent Listed"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          Expiring: {property.lease_end ? property.lease_end : "No Lease"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingBottom: "10px",
                          }}
                        >
                          Due: {property.lease_rent_due_by ? property.lease_rent_due_by : "No Due Date Listed"}
                        </Typography>
                      </Grid>

                      <Grid item xs={5} md={4}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingRight: "10px",
                          }}
                        >
                          Property Value
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          ${property.property_value}
                        </Typography>
                      </Grid>
                      <Grid item xs={3} md={3}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            // paddingRight: "10px",
                          }}
                        >
                          $ Per Sqft
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          ${(property.property_value / property.property_area).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} md={5} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Box>
                        <Button
                          variant="outlined"
                          sx={{
                            background: "#3D5CAC",
                            color: theme.palette.background.default,
                            cursor: "pointer",
                            textTransform: "none",
                            minWidth: "110px", // Fixed width for the button
                            minHeight: "35px",
                          }}
                          size="small"
                          onClick={() => {
                            navigate("/editProperty", {
                              state: {
                                index: currentIndex,
                                propertyList: propertyData,
                                page: "edit_property",
                              },
                            });
                          }}
                        >
                          <PostAddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                          <Typography
                            sx={{
                              textTransform: "none",
                              color: "#FFFFFF",
                              fontWeight: theme.typography.secondary.fontWeight,
                              fontSize: theme.typography.smallFont,
                              whiteSpace: "nowrap",
                              marginLeft: "1%", // Adjusting margin for icon and text
                            }}
                          >
                            {"Edit Property"}
                          </Typography>
                        </Button>
                        </Box>
                      </Grid>

                      {/* {isManager() && item.applications.length > 0 && */}
                      {property.applications.length > 0 && (
                        <>
                          <Grid item xs={12}>
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                                paddingRight: "10px",
                              }}
                            >
                              {"Applications"}
                            </Typography>
                          </Grid>
                          {property.applications.map((app, index) => (
                            <Grid item xs={6}>
                              <Button
                                onClick={() => handleAppClick(index)}
                                sx={{
                                  backgroundColor: getAppColor(app),
                                  color: "#FFFFFF",
                                  textTransform: "none",
                                  width: "100%",
                                  "&:hover, &:focus, &:active": {
                                    backgroundColor: getAppColor(app),
                                  },
                                  height: "100%",
                                }}
                              >
                                <Stack>
                                  <Typography>{app.tenant_first_name + " " + app.tenant_last_name}</Typography>
                                  <Typography sx={{ fontWeight: "bold" }}>{app.lease_status}</Typography>
                                </Stack>
                              </Button>
                            </Grid>
                          ))}
                        </>
                      )}
                      <Grid item xs={11}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{
                              textTransform: "none",
                              color: theme.typography.primary.black,
                              fontWeight: theme.typography.secondary.fontWeight,
                              fontSize: theme.typography.smallFont,
                              paddingRight: "10px",
                            }}
                          >
                            Open Maintenance Tickets
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate("/ownerMaintenance", { state: { propertyId: propertyId } })}
                          >
                            <Badge
                              badgeContent={property.maintenanceCount}
                              color="error"
                              sx={{
                                paddingRight: "10px",
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <Box onClick={() => navigate("/ownerMaintenance", { state: { propertyId: propertyId } })}>
                          {maintenanceData && maintenanceData.length > 0 && maintenanceData[0].maintenance_request_uid && (
                            <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue }} />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          <Typography
                            sx={{
                              textTransform: "none",
                              color: theme.typography.primary.black,
                              fontWeight: theme.typography.light.fontWeight,
                              fontSize: theme.typography.smallFont,
                            }}
                          >
                            {displayTopMaintenanceItem()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingRight: "10px",
                          }}
                        >
                          Tenant
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          {tenant_detail}
                        </Typography>
                      </Grid>
                      {/* {console.log("--debug-- this is contractsData", contractsData)}
                                    {console.log("--debug-- contractsNewSent", contractsNewSent)} */}
                      {contractsData && contractsData.length > 0 && selectedRole !== "MANAGER" ? (
                        <>
                          <Grid item xs={11}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                sx={{
                                  textTransform: "none",
                                  color: theme.typography.primary.black,
                                  fontWeight: theme.typography.secondary.fontWeight,
                                  fontSize: theme.typography.smallFont,
                                  paddingRight: "10px",
                                  width: "400px",
                                }}
                              >
                                PM Quotes Requested
                              </Typography>
                              <Grid container>
                                <Typography
                                  sx={{
                                    textTransform: "none",
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.light.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                  }}
                                >
                                  {contractsData.length > 0
                                    ? contractsData.map((index, contract) => {
                                      if (contract.contract_status === "NEW" || contract.contract_status === "SENT") {
                                        return <Contract contract={contract} key={index} />;
                                      }
                                    })
                                    : "No PM Quotes"}
                                </Typography>
                                <Badge
                                  overlap="circular"
                                  color="success"
                                  badgeContent={contractsNewSent}
                                  // invisible={!contractsNewSent}
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  style={{
                                    color: "#000000",
                                    width: "100%",
                                  }}
                                />
                              </Grid>
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <KeyboardArrowRightIcon
                              sx={{ color: arrowButton1_color, cursor: "pointer" }}
                              onClick={() => {
                                navigate("/pmQuotesRequested", {
                                  state: {
                                    index: currentIndex,
                                    propertyData: propertyData,
                                    contracts: contractsData,
                                  },
                                });
                              }}
                            />
                          </Grid>
                        </>
                      ) : null}
                      <Grid item xs={11}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingRight: "10px",
                          }}
                        >
                          {property.business_uid ? "Property Manager" : "Find A Property Manager"}
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          {property.business_uid ? `${property.business_name}` : "No Manager Selected"}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} sx={{ display: "flex", flexWrap: "wrap", alignContent: "end" }}>
                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue, cursor: "pointer" }} onClick={() => handleManagerChange(currentIndex)} />
                      </Grid>
                      {property.property_available_to_rent !== 1 && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            sx={{
                              background: "#3D5CAC",
                              color: theme.palette.background.default,
                              cursor: "pointer",
                              textTransform: "none",
                            }}
                            size="small"
                            onClick={() => {
                              navigate("/editProperty", { state: { currentId, property, index: currentIndex, propertyList: propertyData, page: "add_listing" } });
                            }}
                          >
                            <PostAddIcon sx={{ color: "#FFFFFF", fontSize: "18px", margin: "5px" }} />
                            <Typography sx={{ textTransform: "none", color: "#FFFFFF", fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.smallFont }}>
                              {"Create Listing"}
                            </Typography>
                          </Button>
                        </Grid>
                      )}
                      {selectedRole == "MANAGER" && property.property_available_to_rent === 1 && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            sx={{
                              background: "#3D5CAC",
                              color: theme.palette.background.default,
                              cursor: "pointer",
                              textTransform: "none",
                              minWidth: "110px", // Fixed width for the button
                              minHeight: "35px",
                            }}
                            size="small"
                            onClick={() => {
                              navigate("/editProperty", { state: { currentId, property, index: currentIndex, propertyList: propertyData, page: "edit_listing" } });
                            }}
                          >
                            <PostAddIcon sx={{ color: "#FFFFFF", fontSize: "18px", margin: "5px" }} />
                            <Typography sx={{ textTransform: "none", color: "#FFFFFF", fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.smallFont }}>
                              {"Edit Listing"}
                            </Typography>
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: color, height: "100%" }}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                      textAlign: "center",
                    }}
                  >
                    Rent History
                  </Typography>
                  <CardContent
                    sx={{
                      flexDirection: "column",
                      alignItems: "left",
                      justifyContent: "left",
                      width: "90%",
                    }}
                  >
                    <DataGrid
                      rows={propertyRentStatus}
                      columns={rentStatusColumns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 12,
                          },
                        },
                      }}
                      getRowId={(row) => row.rent_detail_index}
                      pageSizeOptions={[12]}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          justifyContent: 'center',
                        },
                        '& .MuiDataGrid-columnHeader': {
                          justifyContent: 'center',
                          color: "#3D5CAC",
                          textAlign: "center",
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                          textAlign: 'center',
                          font: "bold",
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

function Contract(props) {
  const textStyle = {
    textTransform: "none",
    color: theme.typography.propertyPage.color,
    fontWeight: theme.typography.light.fontWeight,
    fontSize: theme.typography.smallFont,
  };

  let contract = props.contract;

  return (
    <Typography sx={textStyle}>
      {contract.contract_business_id} {contract.business_name} {contract.contract_uid}{" "}
    </Typography>
  );
}
