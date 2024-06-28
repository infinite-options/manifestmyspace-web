import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
// import "./../../css/contacts.css";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, InputAdornment, TextField, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import { Message, Search } from "@mui/icons-material";
import { getStatusColor } from "../ContactsFunction";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Container,
  Grid,
  Tabs,
  Tab,
  Badge,
  Switch,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import defaultHouseImage from "../../Property/defaultHouseImage.png";
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";
import maintenanceIcon from "../../Property/maintenanceIcon.png";
import User_fill from "../../../images/User_fill_dark.png";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";



import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

import AES from "crypto-js/aes";

import APIConfig from "../../../utils/APIConfig";

import ProfileInformation from "./ProfileInformation";



const MaintenanceContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

    // const { selectedRole, getProfileId } = useUser();  
  
    const [ contactDetails, setContactDetails ] = useState([]);
  
    useEffect(() => {
      setContactDetails(data)
    }, [data]);
  
    return (
      <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
          <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
              <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                  Maintenance Contact
              </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center" >
              <Typography sx={{fontSize: '20px', color: '#3D5CAC'}}>
                {currentIndex + 1} of {contactDetails?.length} Maintenance Contacts
              </Typography>                    
          </Grid>                
          <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#A52A2A', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px', }}>                            
              <Grid item xs={1}>
                  <Box
                      onClick={() => {
                        console.log("Previous button clicked", currentIndex, contactDetails.length);
                        currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(contactDetails.length - 1);
                      }}
                      sx={{
                        paddingLeft: '10px',
                      }}
                  >
                      <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                          d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                          fill={theme.typography.secondary.white}
                          />
                      </svg>
                  </Box>
              </Grid>
              <Grid container direction='row' item xs={10} >
                  <Grid item xs={12} container justifyContent="center">
                    <Typography sx={{fontSize: '25px', fontWeight: 'bold', color: '#F2F2F2' }}>
                    {`
                      ${(contactDetails && contactDetails[currentIndex]?.business_name) ? contactDetails[currentIndex]?.business_name : ""}                    
                    `}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="center">
                    <Box
                      sx={{
                        backgroundColor: "#A9A9A9",
                        height: "68px",
                        width: "68px",
                        borderRadius: "68px",
                        // marginTop: "-34px",
                      }}
                    >
                    <img
                      src={(contactDetails && contactDetails[currentIndex]?.contact_photo_url) ? contactDetails[currentIndex].contact_photo_url : User_fill}
                      alt="profile placeholder"
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "68px",
                        margin: "4px",
                      }}
                    />
                    </Box>
                  </Grid>
              </Grid>
              <Grid item xs={1}  container justifyContent='flex-end'>
                  <Box
                      onClick={() => {
                        console.log("Next button clicked");
                        currentIndex < contactDetails.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                      }}
                      sx={{
                        paddingRight: '10px',
                      }}
                  >
                      <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                          d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                          fill={theme.typography.secondary.white}
                          />
                      </svg>
                  </Box>
              </Grid>
          </Grid>
          <Grid container item xs={12} columnSpacing={1} rowSpacing={1}>
              <Grid item xs={12}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          minHeight: 230,
                          // maxHeight: 230, 
                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          // width: "100%",
                          padding: '10px',
                      }}
                  >
                      {
                        contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                          <ProfileInformation contactDetails={contactDetails[currentIndex]} type="maintenance"/>
                        ) :
                        <></>
                      }
                      
                  </Paper>
              </Grid>
              <Grid container item xs={12} columnSpacing={1}>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        style={{
                            // margin: '50p', // Add margin here
                            borderRadius: "10px",
                            backgroundColor: "#D6D5DA",
                            height: 100,
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
  
                            // [theme.breakpoints.down("sm")]: {
                            //     width: "80%",
                            // },
                            // [theme.breakpoints.up("sm")]: {
                            //     width: "50%",
                            // },
                            // width: "100%",
                            padding: '10px',
                        }}
                    >
                        {/* {
                          contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                            <PropertiesInformation 
                              propertiesData={propertiesData} 
                              contractsData={contractsData}
                              ownerUID={contactDetails[currentIndex]?.contact_uid}                       
                            />
                          ) :
                          <></>
                        } */}
                        <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                          {
                            contactDetails && contactDetails[currentIndex]?.business_services_fees ? (
                              <>
                                Category: <Typography component="span" sx={{fontSize: '20px', color: '#160449', }}>{JSON.parse(contactDetails[currentIndex]?.business_services_fees).map(fee => fee.service_name).join(', ')}</Typography>
                              </>
                            ) : (
                              <>Category: </>
                            )
                          }
                        </Typography>
  
                        <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                          {
                            contactDetails && contactDetails[currentIndex]?.business_locations ? (
                              <>
                                Service Locations: <Typography component="span" sx={{fontSize: '20px', color: '#160449', }}>{JSON.parse(contactDetails[currentIndex]?.business_locations).map(location => (`${location.city}, ${location.state} (+-${location.miles} miles)` )).join(', ')}</Typography>
                              </>
                            ) : (
                              <>Service Locations: </>
                            )
                          }
                        </Typography>
                        
                    </Paper>
                </Grid>
              
              
                <Grid item xs={12} md={6} >
                    <Paper
                        elevation={0}
                        style={{
                            // margin: '50p', // Add margin here
                            borderRadius: "10px",
                            backgroundColor: "#D6D5DA",
                            minHeight: 100,                                                                                                        
  
                            // [theme.breakpoints.down("sm")]: {
                            //     width: "80%",
                            // },
                            // [theme.breakpoints.up("sm")]: {
                            //     width: "50%",
                            // },
                            // width: "100%",
                            padding: '10px',
                        }}
                    >
                      <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                        Notes:
                      </Typography>
                        
                        
                        
                    </Paper>
                </Grid>
              </Grid>    
              <Grid item xs={12} md={6}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          minHeight: 260,
  
                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          // width: "100%",
                          padding: '10px',
                      }}
                  >
                      {
                          contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                            // <PropertiesInformation 
                            //   propertiesData={propertiesData} 
                            //   contractsData={contractsData}
                            //   ownerUID={contactDetails[currentIndex]?.contact_uid}                       
                            // />
                            <WorkOrdersAccordion data={contactDetails[currentIndex]}/>
                          ) :
                          <></>
                        }
                      
                  </Paper>
              </Grid>  
                    
              <Grid item xs={12} md={6}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          // backgroundColor: "#D6D5DA",
                          minHeight: 260,
  
                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          // width: "100%",
                          // padding: '10px',
                      }}
                  >
                      {
                        contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                          <MaintenanceCashflowWidget 
                            data={contactDetails[currentIndex]}
                          />
                        ) :
                        <></>
                      }
                      
                  </Paper>
              </Grid>             
          </Grid>                     
      </Grid>    
    
    );
  }
  
  const WorkOrdersAccordion = ({ data }) => {
    const colorStatus = theme.colorStatusMM;
    console.log("ROHIT - WorkOrdersAccordion - data - ", data);
    // const allMaintenanceRequests = [];
    const [ maintenanceRequests, setMaintenanceRequests ] = useState({})
  
    
  
    useEffect(() => {
  
      const maintenanceData = data?.maintenance_by_status? JSON.parse(data?.maintenance_by_status) : []
  
      const maintenanceScheduled = maintenanceData?.find( maintenance => maintenance.maintenance_status === "SCHEDULED")  
      const maintenanceRequested = maintenanceData?.find( maintenance => maintenance.maintenance_status === "REQUESTED")
      const maintenanceSubmitted = maintenanceData?.find( maintenance => maintenance.maintenance_status === "SUBMITTED")
      const maintenanceAccepted = maintenanceData?.find( maintenance => maintenance.maintenance_status === "ACCEPTED")
      const maintenanceFinished = maintenanceData?.find( maintenance => maintenance.maintenance_status === "FINISHED")
      const maintenancePaid = maintenanceData?.find( maintenance => maintenance.maintenance_status === "PAID")
  
      setMaintenanceRequests( prevState => ({
        ...prevState,
        'SCHEDULED': maintenanceScheduled,
        'REQUESTED': maintenanceRequested,
        'SUBMITTED': maintenanceSubmitted,
        'ACCEPTED': maintenanceAccepted,
        'FINISHED': maintenanceFinished,
        'PAID': maintenancePaid,
      }));
  
  
    }, [data]);
  
    useEffect(() => {
      console.log("ROHIT - WorkOrdersAccordion - maintenanceRequests - ", maintenanceRequests);
    }, [maintenanceRequests]);
  
    
  
    const [showSpinner, setShowSpinner] = useState(false);
    const { getProfileId } = useUser();
    // const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const [query, setQuery] = useState("");
  
    // useEffect(() => {
    //     const dataObject = {};        
    
    //     const getMaintenanceData = async () => {
    //         setShowSpinner(true);
    //         const maintenanceRequests1 = await fetch(`${APIConfig.baseURL.dev}/maintenanceStatus/${getProfileId()}`);
    //         const maintenanceRequestsData1 = await maintenanceRequests1.json();
    
    //         let array1 = maintenanceRequestsData1.result?.REQUESTED?.maintenance_items ?? [];
    //         let array2 = maintenanceRequestsData1.result?.SUBMITTED?.maintenance_items ?? [];
            
    //         // This removes rejected quotes and adds it to another array.
    //         // let rejectedQuotes = [];
    //         // for (let i = 0; i < array2.length; i++) {
    //         //     let item = array2[i];
    //         //     if (item.quote_status === "REJECTED") {
    //         //         rejectedQuotes.push(item);
    //         //         array2.splice(i, 1);
    //         //         i--;
    //         //     }
    //         // }
    //         let array3 = maintenanceRequestsData1.result?.ACCEPTED?.maintenance_items ?? [];
    //         let array4 = maintenanceRequestsData1.result?.SCHEDULED?.maintenance_items ?? [];
    //         let array5 = maintenanceRequestsData1.result?.FINISHED?.maintenance_items ?? [];
    //         let array6 = maintenanceRequestsData1.result?.PAID?.maintenance_items ?? [];
    
    //         dataObject["REQUESTED"] = [...array1];
    //         dataObject["SUBMITTED"] = [...array2];
    //         dataObject["ACCEPTED"] = [...array3];
    //         dataObject["SCHEDULED"] = [...array4];
    //         dataObject["FINISHED"] = [...array5];
    //         dataObject["PAID"] = [...array6];
    
    //         // dataObject["REJECTED"] = [...rejectedQuotes];
    
    //         // console.log("dataObject from new api call", dataObject)
    //         setMaintenanceRequests((prevData) => ({
    //             ...prevData,
    //             ...dataObject,
    //         }));
    //         setShowSpinner(false);
    //     };
    //         getMaintenanceData();            
    //   }, []);
  
      function handleFilter(filterString, searchArray) {
        let filteredArray = [];
        if (filterString === "All" || filterString === "") {
          filteredArray = searchArray;
        } else {
          filteredArray = searchArray.filter((item) => item.maintenance_title === filterString);
        }
        return filteredArray;
      }
  
    return (
        <>
            <Grid item xs={12} sx={{width: '90%', margin: 'auto',}}>
                {colorStatus.map((item, index) => {
                    let mappingKey = item.mapping;
  
                    let maintenanceArray = maintenanceRequests[mappingKey];
                    // let maintenanceItems = maintenanceArray? JSON.parse(maintenanceArray?.maintenance_request_info) : []
                    let maintenanceItems = maintenanceArray? maintenanceArray?.maintenance_request_info : []
                    console.log("ROHIT - maintenanceArray - ", maintenanceArray);
                    console.log("ROHIT - maintenanceArray.maintenance_request_info - ", maintenanceArray?.maintenance_request_info);                  
                    console.log("ROHIT - maintenanceItems - ", maintenanceItems);
  
                    // let maintenanceArray = maintenanceRequests[mappingKey]?  JSON.parse(maintenanceRequests[mappingKey]?.maintenance_request_info) : [];
  
                    let filteredArray = handleFilter(query, maintenanceRequests[mappingKey]);
                    // console.log("[DEBUG] MaintenanceWorkerDashboardWidget.jsx before MaintenanceStatusTable01")
  
                    return (
                    <WorkerMaintenanceStatusTable
                        key={index}
                        status={item.status}
                        color={item.color}
                        // maintenanceItemsForStatus={maintenanceArray}
                        maintenanceItemsForStatus={maintenanceItems}
                        allMaintenanceData={maintenanceRequests}
                        maintenanceRequestsCount={maintenanceItems? maintenanceItems.length : 0}
                    />
                    );
                })}
            </Grid>
        </>
    )
  }
  
  const getChipColor = (priority) => {
    switch (priority) {
      case "High":
        return "#A52A2A";
      case "Medium":
        return "#FF8A00";
      case "Low":
        return "#FFC614";
      case "REJECTED":
        return "#A52A2A";
      case "WITHDRAWN":
        return "#FF8A00";
      case "SENT":
        return "#FFC614";
      case "ACCEPTED":
        return "#4CAF50";
      default:
        return "default";
    }
  };
  
  const WorkerMaintenanceStatusTable = ({ status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount }) => {
    const location = useLocation();
    let navigate = useNavigate();
  
    console.log("ROHIT - WorkerMaintenanceStatusTable - maintenanceItemsForStatus - ", maintenanceItemsForStatus);
    // console.log("MaintenanceStatusTable", status, color, maintenanceItemsForStatus)
  
    const tableTextStyle = {
      backgroundColor: color,
      color: "#FFFFFF",
      fontFamily: "Source Sans Pro",
      fontSize: "15px",
      fontWeight: 600,
    };
  
    const columns = [
      {
        headerName: "Property",
        field: "property_name",
        renderCell: (params) => {
          return `${params.row.property_address} ${params.row.property_unit}`;
        },
        flex: 1,
        minWidth: 175,
      },
      {
        headerName: "Type",
        field: "maintenance_request_type",
        flex: 1,
        hide: true,
        minWidth: 100,
      },
      {
        headerName: "Priority",
        field: "maintenance_priority",
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => {
          return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
        },
      },
      {
        headerName: "Status",
        field: "maintenance_status",
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => {
          return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
        },
      },
      {
        headerName: "Title",
        field: "maintenance_title",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "ID",
        field: "maintenance_request_uid",
        flex: 0.5,
        minWidth: 75,
        renderCell: (params) => {
          return `${params.row.maintenance_request_uid.substr(params.row.maintenance_request_uid.length - 3)}`;
        },
      },
      {
        headerName: "Date Created",
        field: "maintenance_request_created_date",
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Scheduled Date",
        field: "maintenance_scheduled_date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const scheduledDate = params.row.maintenance_scheduled_date;
          return scheduledDate && scheduledDate !== "null" ? dayjs(params.row.maintenance_scheduled_date).format("MM-DD-YYYY") : "N/A";
        },
      },
      {
        headerName: "Scheduled Time",
        field: "maintenance_scheduled_time",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const scheduledTime = params.row.maintenance_scheduled_date;
          return scheduledTime && scheduledTime !== "null" ? dayjs(params.row.maintenance_scheduled_time, "HH:mm").format("h:mm A") : "N/A";
        },
      },
    ];
  
    function handleRequestDetailPage(maintenance_request_index, property_uid, maintenance_request_uid) {
      // console.log("handleRequestDetailPage")
      // console.log("maintenance_request_index", maintenance_request_index)
      // console.log("status", status)
      // console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
      // console.log("allMaintenanceData", allMaintenanceData)
  
      navigate(`/workerMaintenance/detail`, {
        state: {
          maintenance_request_index,
          status,
          maintenanceItemsForStatus,
          allMaintenanceData,
        },
      });
    }
  
    return (
      <ThemeProvider theme={theme}>
        <Accordion
          sx={{
            backgroundColor: color,
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            sx={{
              flexDirection: "row", // Changed this from 'row-reverse'
              "& .MuiIconButton-edgeEnd": {
                // This targets the IconButton
                marginLeft: "auto", // This pushes the IconButton to the right
              },
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                backgroundColor: color,
                color: "#FFFFFF",
                fontFamily: "Source Sans Pro",
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: "10px",
                alignItems: "center",
                position: "sticky",
                paddingTop: "5px",
                paddingLeft: "15px",
              }}
            >
              <p>{status}</p>
              <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>
                {/* {maintenanceItemsForStatus ? maintenanceItemsForStatus.length : maintenanceRequestsCount ? maintenanceRequestsCount : 0} */}
                {maintenanceRequestsCount}
                {/* {2000} */}
              </span>
            </div>
          </AccordionSummary>
          {maintenanceItemsForStatus.length !== 0 ? (
            <AccordionDetails>
              <DataGrid
                rows={maintenanceItemsForStatus}
                columns={columns}
                rowHeight={50}
                hideFooter={true}
                sx={{
                  "& .MuiDataGrid-cell": {
                    fontSize: "14px", // Change the font size
                    fontWeight: theme.typography.common.fontWeight, // Change the font weight
                    color: theme.typography.secondary.white,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    fontSize: "16px", // Change the font size
                    fontWeight: theme.typography.common.fontWeight, // Change the font weight
                    color: theme.typography.secondary.white, // Change the font color of the headers
                  },
                  border: 0,
                  "& .MuiDataGrid-main": {
                    border: 0, // Removes the inner border
                  },
                  "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                    borderBottom: "none", // Removes the border of the last row
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none", // Remove vertical borders in the header
                  },
                }}
                disableExtendRowFullWidth={true}
                getRowId={(row) => row.maintenance_request_uid}
                pageSizeOptions={[5]}
                onRowClick={(params) => {
                  const index = maintenanceItemsForStatus.findIndex((row) => row.maintenance_request_uid === params.row.maintenance_request_uid);
                  handleRequestDetailPage(index, params.row.property_uid, params.row.maintenance_request_uid);
                }}
              />
            </AccordionDetails>
          ) : null}
        </Accordion>
      </ThemeProvider>
    );
  }
  
  const MaintenanceCashflowWidget = ({ data }) => {
    const [ maintenanceRequests, setMaintenanceRequests ] = useState({})
  
    
  
    useEffect(() => {
  
      const maintenanceData = data?.maintenance_by_status? JSON.parse(data?.maintenance_by_status) : []
  
      const maintenanceScheduled = maintenanceData?.find( maintenance => maintenance.maintenance_status === "SCHEDULED")  
      const maintenanceRequested = maintenanceData?.find( maintenance => maintenance.maintenance_status === "REQUESTED")
      const maintenanceSubmitted = maintenanceData?.find( maintenance => maintenance.maintenance_status === "SUBMITTED")
      const maintenanceAccepted = maintenanceData?.find( maintenance => maintenance.maintenance_status === "ACCEPTED")
      const maintenanceFinished = maintenanceData?.find( maintenance => maintenance.maintenance_status === "FINISHED")
      const maintenancePaid = maintenanceData?.find( maintenance => maintenance.maintenance_status === "PAID")
  
      setMaintenanceRequests( prevState => ({
        ...prevState,
        'SCHEDULED': maintenanceScheduled,
        'REQUESTED': maintenanceRequested,
        'SUBMITTED': maintenanceSubmitted,
        'ACCEPTED': maintenanceAccepted,
        'FINISHED': maintenanceFinished,
        'PAID': maintenancePaid,
      }));
  
  
    }, [data]);
  
    useEffect(() => {
      console.log("ROHIT - MaintenanceCashflowWidget - maintenanceRequests - ", maintenanceRequests);
    }, [maintenanceRequests]);
  
  
    return (
      <Grid item xs={12} sx={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: '#F2F2F2'
      }}>
          <Grid container direction="column" columnGap={1} rowGap={1}>
              <Grid item xs={12} sx={{
                backgroundColor: "#CEA892",
                textTransform: "none",                            
                borderRadius: "10px",
                display: 'flex',
                flexDirection: "column",                            
                alignItems: "center",
              }}>                
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                    Quotes Submitted Cashflow
                </Typography>
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                    {/* ${quotesSubmittedCashflow} */}
                    {`$${maintenanceRequests?.SUBMITTED?.total_estimate? maintenanceRequests?.SUBMITTED?.total_estimate : 0}`}
                </Typography>
                 
              </Grid>
              <Grid item xs={12} sx={{
                backgroundColor: "#BAAC7A",
                textTransform: "none",                            
                borderRadius: "10px",
                display: 'flex',
                flexDirection: "column",                            
                alignItems: "center",
              }}>
                  
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                    Quotes Accepted Cashflow
                </Typography>
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                    {/* ${quotesAcceptedCashflow} */}
                    {`$${maintenanceRequests?.ACCEPTED?.total_estimate? maintenanceRequests?.ACCEPTED?.total_estimate : 0}`}
                </Typography>
                  
              </Grid>
  
              <Grid item xs={12} sx={{
                backgroundColor: "#959A76",
                textTransform: "none",                            
                borderRadius: "10px",
                display: 'flex',
                flexDirection: "column",                            
                alignItems: "center",
              }}>
                  
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                    Quotes Scheduled Cashflow
                </Typography>
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                    {/* ${quotesScheduledCashflow} */}
                    {`$${maintenanceRequests?.SCHEDULED?.total_estimate? maintenanceRequests?.SCHEDULED?.total_estimate : 0}`}
                </Typography>                
              </Grid>
  
  
              <Grid item xs={12} sx={{
                backgroundColor: "#598A96",
                textTransform: "none",                            
                borderRadius: "10px",
                display: 'flex',
                flexDirection: "column",                            
                alignItems: "center",
              }}>
                  
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                    Quotes Finished Cashflow
                </Typography>
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                    {/* ${quotesFinishedCashflow} */}
                    {`$${maintenanceRequests?.FINISHED?.total_estimate? maintenanceRequests?.FINISHED?.total_estimate : 0}`}
                </Typography>                
              </Grid>
  
              <Grid item xs={12} sx={{
                backgroundColor: "#6588AC",
                textTransform: "none",                            
                borderRadius: "10px",
                display: 'flex',
                flexDirection: "column",                            
                alignItems: "center",
              }}>
                  
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                    Quotes Paid
                </Typography>
                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                    {/* ${quotesFinishedCashflow} */}
                    {`$${maintenanceRequests?.PAID?.total_estimate? maintenanceRequests?.PAID?.total_estimate : 0}`}
                </Typography>                
              </Grid>
          </Grid>
      </Grid>
    );
  }

export default MaintenanceContactDetail;