import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  Grid,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import theme from "../../theme/theme";
import propertyImage from "./propertyImage.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"; // Ensure this is correctly imported

import LeaseIcon from "./leaseIcon.png";
import CreateIcon from "@mui/icons-material/Create";
import { getPaymentStatusColor, getPaymentStatus } from "./PropertyList.jsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "../../contexts/UserContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { maintenanceOwnerDataCollectAndProcess } from "../Maintenance/MaintenanceOwner.jsx";
import { maintenanceManagerDataCollectAndProcess } from "../Maintenance/MaintenanceManager.jsx";

import APIConfig from "../../utils/APIConfig";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

//const getAppColor = (app) => (app.lease_status !== "REJECTED" ? (app.lease_status !== "REFUSED" ? "#778DC5" : "#874499") : "#A52A2A");

const getAppColor = (app) => (app.lease_status !== "REJECTED" ? (app.lease_status !== "REFUSED" ? "#778DC5" : "#874499") : "#A52A2A");

export default function PropertyNavigator({
  index,
  propertyList,
  allRentStatus,
  rawPropertyData,
  contracts,
  isDesktop = true,
  onEditClick,
  onViewLeaseClick,
  onViewContractClick,
  setEditPropertyState,
  setTenantAppNavState,
  setPmQuoteRequestedState,
  setManagerDetailsState,
  onShowSearchManager,
  handleViewApplication,
  handleViewPMQuotesRequested,
  onAddListingClick,
  handleViewManagerDetailsClick,
  props,
}) {
  // console.log("In Property Navigator", onEditClick);
  // console.log(index, propertyList);
  // console.log("props contracts", contracts);
  const navigate = useNavigate();
  const { getProfileId, isManager, roleName, selectedRole } = useUser();

  const [propertyData, setPropertyData] = useState(propertyList || []);
  const [currentIndex, setCurrentIndex] = useState(index !== undefined ? index : 0);
  const [property, setProperty] = useState(propertyList ? propertyList[currentIndex] : null);
  const { property_uid } = property || { property_uid: null };
  const [currentId, setCurrentId] = useState(property_uid);
  const [contactDetails, setContactDetails] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([{}]);
  const [propertyRentStatus, setpropertyRentStatus] = useState(allRentStatus);
  const [rentFee, setrentFee] = useState({});
  const [appliances, setAppliances] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentApplRow, setcurrentApplRow] = useState(null);
  const [modifiedApplRow, setModifiedApplRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [applianceCategories, setApplianceCategories] = useState([]);
  const [applianceCategoryToUIDMap, setApplianceCategoryToUIDMap] = useState({});
  const [applianceUIDToCategoryMap, setApplianceUIDToCategoryMap] = useState({});

  const [happinessData, setHappinessData] = useState([]);
  const [dataforhappiness, setdataforhappiness] = useState([]);

  const [applianceList, setApplianceList] = useState([]);
  const [initialApplData, setInitialApplData] = useState(null);

  // console.log("PropertyNavigator - location state allRentStatus - ", allRentStatus);

  const getDataFromAPI = async () => {
    const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
    // const url = `${APIConfig.baseURL.dev}/contacts/600-000003`;
    try {
      const response = await axios.get(url);
      // console.log("--response in nav----", response);
      const data = response["management_contacts"];
      // console.log("--response data----", data);
      const ownerContacts = data["owners"];
      // console.log("--response ownerContacts----", ownerContacts);
      setContactDetails(ownerContacts);
    } catch (error) {
      // console.log("Error fetching owner contacts: ", error);
    }
  };

  //   const fetchApplianceList = async () => {
  //     try {
  //         const response = await fetch(`${APIConfig.baseURL.dev}/lists?list_category=appliances`);
  //         const data = await response.json();
  //         const validAppliances = data.result.filter(item => item.list_item.trim() !== "");
  //         setApplianceList(validAppliances);
  //     } catch (error) {
  //         console.error("Error fetching appliances:", error);
  //     }
  // };

  useEffect(() => {
    getDataFromAPI();
    // fetchApplianceList();
    getApplianceCategories();
  }, []);

  useEffect(() => {
    // console.log("ROHIT - appliances - ", appliances);
  }, [appliances]);

  useEffect(() => {
    // console.log("ROHIT - currentApplRow - ", currentApplRow);
  }, [currentApplRow]);

  useEffect(() => {
    // console.log("ROHIT - modifiedApplRow - ", modifiedApplRow);
  }, [modifiedApplRow]);

  useEffect(() => {
    // console.log("PropertyNavigator - propertyRentStatus - ", propertyRentStatus);
  }, [propertyRentStatus]);

  useEffect(() => {
    // console.log("PropertyNavigator - currentId - ", currentId);
  }, [currentId]);

  //const handleOpen = () => setOpen(true);
  //const handleClose = () => setOpen(false);

  // Parse property images once outside the component
  //const parsedPropertyImages = propertyData[currentIndex].property_images ? JSON.parse(propertyData[currentIndex].property_images) : [];
  // console.log('parsedImages:', parsedPropertyImages);
  // console.log('parsedImages.length:', parsedPropertyImages.length);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Parse property images once outside the component
  const parsedPropertyImages =
    propertyData && propertyData[currentIndex] && propertyData[currentIndex].property_images ? JSON.parse(propertyData[currentIndex].property_images) : [];
  // console.log('parsedImages:', parsedPropertyImages);
  // console.log('parsedImages.length:', parsedPropertyImages.length);

  // Initialize state with parsed images or fallback to propertyImage if empty
  const [images, setImages] = useState(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

  // Initialize maxSteps state
  const [maxSteps, setMaxSteps] = useState(0);

  // Log images and its length after it's updated
  useEffect(() => {
    // console.log("What's in Images: ", images, images.length);
    setMaxSteps(images.length); // Update maxSteps state
    // console.log('MaxSteps: ', images.length); // Log maxSteps within useEffect
  }, [images]); // This useEffect will re-run whenever the 'images' state changes

  // console.log('MaxSteps: ', maxSteps); // Log maxSteps outside of useEffect

  const [activeStep, setActiveStep] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [contractsData, setContractsData] = useState(contracts);
  const [contractsNewSent, setContractsNewSent] = useState(0);
  const [maintenanceReqData, setMaintenanceReqData] = useState([{}]);
  // console.log('Maintenance Request Data1: ', maintenanceReqData);
  const [displayMaintenanceData, setDisplayMaintenanceData] = useState([{}]);

  const color = theme.palette.form.main;
  const [propertyId, setPropertyId] = useState(propertyData && propertyData[currentIndex] ? propertyData[currentIndex].property_uid : null);
  let data = "";
  const role = roleName();
  if (role === "Manager") {
    data = "maintenance_status";
  } else if (role === "Owner") {
    data = "maintenance_request_status";
  }

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
    setPropertyData(propertyList || []);
    const nextIndex = index !== undefined ? index : 0;
    setCurrentIndex(nextIndex);
    const nextId = propertyList && propertyList[nextIndex] ? propertyList[nextIndex].property_uid : null;
    setCurrentId(nextId);
    setProperty(propertyList && propertyList[nextIndex]);
    const parsedPropertyImages = propertyList && propertyList[nextIndex] && propertyList[nextIndex].property_images ? JSON.parse(propertyList[nextIndex].property_images) : [];
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);
    setContractsData(contracts);
    setActiveStep(0);
  }, [index, propertyList]);

  useEffect(() => {
    if (propertyData && propertyData[currentIndex]) {
      // console.log("propertyId use Effect called ***************************************************");
      // console.log("setting propertyId - ", propertyData[currentIndex].property_uid);
      setPropertyId(propertyData[currentIndex].property_uid);

      //   const getContractsForOwner = async () => {
      //     try {
      //       const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
      //       // const response = await fetch(`${APIConfig.baseURL.dev}/contracts/600-000003`);
      //       if (!response.ok) {
      //         console.log('Error fetching contracts data');
      //       }
      //       const contractsResponse = await response.json();
      //       var count = 0;
      //       const contracts = contractsResponse.result.filter((contract) => contract.property_id === propertyId);
      //       contracts.forEach((contract) => {
      //         if (contract.contract_status === 'SENT' || contract.contract_status === 'NEW') {
      //           count++;
      //         }
      //       });
      //       setContractsNewSent(count);
      //       setContractsData(contracts);
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   };
      //   getContractsForOwner();
      var count = 0;
      const filtered = contractsData.filter((contract) => contract.property_id === propertyId);
      // console.log("ROHIT - PropertyNavigator - filtered contracts - ", filtered);
      filtered.forEach((contract) => {
        if (contract.contract_status === "SENT" || contract.contract_status === "NEW") {
          count++;
        }
      });
      // console.log("ROHIT - PropertyNavigator - contract count - ", count);
      setContractsNewSent(count);
      setContractsData(contracts);

      const rentDetails = getRentStatus();
      // console.log("rentDetails - ", rentDetails);
      setpropertyRentStatus(rentDetails);

      if (property.leaseFees !== null) {
        const rent = JSON.parse(propertyData[currentIndex].leaseFees).find((fee) => fee.fee_name === "Rent");
        setrentFee(rent);
        // console.log('check rent', rent);
      } else {
        setrentFee(null);
      }

      const propertyApplicances = JSON.parse(propertyData[currentIndex].appliances);
      // console.log("Appliances", propertyApplicances);
      if (property.appliances != null) {
        setAppliances(propertyApplicances);

        //   console.log('Appliances categories', applianceCategories, typeof (applianceCategories));
      } else {
        setAppliances([]);
      }
    }
  }, [currentIndex, propertyId, allRentStatus, index, propertyList, contracts, propertyData]);
  // }, [currentIndex, propertyId, allRentStatus]);

  const tenant_detail = property && property.lease_start && property.tenant_uid ? `${property.tenant_first_name} ${property.tenant_last_name}` : "No Tenant";
  const manager_detail = property && property.business_uid ? `${property.business_name}` : "No Manager";
  const [arrowButton1_color, set_arrow1_color] = useState(
    tenant_detail === "No Tenant" && manager_detail === "No Manager" ? theme.typography.common.gray : theme.typography.common.blue
  );

  //   useEffect(() => {
  //     let profileId = getProfileId();
  //     // console.log('getProfileID', getProfileId());
  //     if (profileId.startsWith('600')) {
  //       maintenanceManagerDataCollectAndProcess(
  //         setMaintenanceReqData,
  //         setShowSpinner,
  //         setDisplayMaintenanceData,
  //         profileId
  //       );
  //     } else if (profileId.startsWith('110')) {
  //       maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
  //     } else if (profileId.startsWith('200')) {
  //       maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
  //     }
  //   }, [currentIndex, propertyId]);

  let dashboard_id = getProfileId();
  useEffect(() => {
    const fetchDashboardData = async () => {
      setShowSpinner(true);
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
        // const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const jsonData = await response.json();
        setHappinessData(jsonData.HappinessMatrix);
        setdataforhappiness(jsonData);
      } catch (error) {
        console.error(error);
      }
      setShowSpinner(false);
    };
    fetchDashboardData();
  }, [dashboard_id]);

  function getColorStatusBasedOnSelectedRole() {
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

  const handleOwnerClick = (ownerData) => {
    navigate("/ownerContactDetailsHappinessMatrix", {
      // navigate(`/ownerContactTest`, {
      state: {
        ownerUID: ownerData,
        navigatingFrom: "PropertyNavigator",
        index: index,
        happinessMatrixData: dataforhappiness,
        happinessData: happinessData,
        contactDetail: contactDetails,
      },
    });
  };

  function handleOnClickNavigateToMaintenance(row) {
    const role = roleName();
    // console.log(role);
    let status = "NEW REQUEST";
    // console.log('initial Status: ', status);
    // console.log('handleOnClickNavigateToMaintenance');
    // console.log('row', row);
    // console.log('New data: ', property.maintenance);
    // console.log(
    //  'maintenance_request_index_new',
    //  property.maintenance.findIndex((item) => item.maintenance_request_uid === row.id)
    // );

    // console.log('Row: ', row);
    // console.log('Row1: ', row.row);
    // console.log('Row2: ', row.row.maintenance_status);

    if (role === "Manager") {
      // These maitenance_status fields work for a Property Manager.  Need to make this Role Specific
      status = row.row.maintenance_status;
      // console.log('Manager status', status);

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
      // console.log('Owner status', status);

      if (status === "NEW") {
        status = "NEW REQUEST";
      } else if (status === "INFO") {
        status = "INFO REQUESTED";
      }
    }

    try {
      if (!isDesktop) {
        navigate("/maintenance/detail", {
          state: {
            maintenance_request_index: maintenanceReqData[status].findIndex((item) => item.maintenance_request_uid === row.id), // index in the status array
            status: status,
            maintenanceItemsForStatus: maintenanceReqData[status],
            allMaintenanceData: maintenanceReqData,
            fromProperty: true,
            index: currentIndex,
            isDesktop: isDesktop,
          },
        });
      } else {
        navigate("/ownerMaintenance", {
          state: {
            maintenance_request_index: maintenanceReqData[status].findIndex((item) => item.maintenance_request_uid === row.id), // index in the status array
            status: status,
            maintenanceItemsForStatus: maintenanceReqData[status],
            allMaintenanceData: maintenanceReqData,
            fromProperty: true,
            index: currentIndex,
            propertyId: propertyId,
          },
        });
      }
    } catch (error) {
      console.log(error);
      alert("Error navigating to maintenance detail", error);
    }
  }

  function displayTopMaintenanceItem() {
    const colorStatus = getColorStatusBasedOnSelectedRole();
    if (property && property.maintenanceCount > 0) {
      // console.log("Passed Data ", property.maintenance); // This is the same as maintenanceData
      return (
        <DataGrid
          rows={property.maintenance}
          columns={maintenanceColumns}
          disableColumnMenu={!isDesktop}
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
            // console.log("Row =", row);
            handleOnClickNavigateToMaintenance(row);
          }}
        />
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
    let nextIndex = (currentIndex + 1) % (propertyData ? propertyData.length : 1);
    setCurrentIndex(nextIndex);
    const nextId = propertyData && propertyData[nextIndex] ? propertyData[nextIndex].property_uid : null;
    setCurrentId(nextId);
    setProperty(propertyData && propertyData[nextIndex]);

    const parsedPropertyImages = propertyData && propertyData[nextIndex] && propertyData[nextIndex].property_images ? JSON.parse(propertyData[nextIndex].property_images) : [];
    // console.log('parsedImages:', parsedPropertyImages);
    // console.log('parsedImages.length:', parsedPropertyImages.length);
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

    setActiveStep(0);
  };

  const handlePreviousCard = () => {
    let previousIndex = (currentIndex - 1 + (propertyData ? propertyData.length : 1)) % (propertyData ? propertyData.length : 1);
    setCurrentIndex(previousIndex);
    const previousId = propertyData && propertyData[previousIndex] ? propertyData[previousIndex].property_uid : null;
    setCurrentId(previousId);
    setProperty(propertyData && propertyData[previousIndex]);

    const parsedPropertyImages =
      propertyData && propertyData[previousIndex] && propertyData[previousIndex].property_images ? JSON.parse(propertyData[previousIndex].property_images) : [];
    // console.log('parsedImages:', parsedPropertyImages);
    // console.log('parsedImages.length:', parsedPropertyImages.length);
    setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleManagerChange = (index) => {
    if (property && property.business_uid) {
      /* navigate('/managerDetails', {
        state: {
          ownerId: property.owner_uid,
          managerBusinessId: property.business_uid,
          managerData: property,
          propertyData: propertyData,
          index: currentIndex,
          isDesktop: isDesktop,
        },
      }); */
      const state = {
        ownerId: property.owner_uid,
        managerBusinessId: property.business_uid,
        managerData: property,
        propertyData: propertyData,
        index: currentIndex,
        isDesktop: isDesktop,
      };
      //console.log("---inside prop nav state---", state);
      setManagerDetailsState(state);
      handleViewManagerDetailsClick();
    } else {
      // navigate('/searchManager', { state: { index: currentIndex, propertyData, isDesktop } });
      const state = { index: currentIndex, propertyData, isDesktop };
      //console.log('inside prop nav----', state);
      onShowSearchManager(state);
    }
  };

  const handleAppClick = (index) => {
    /* navigate('/tenantApplicationNav', {
			state: { index: index, propertyIndex: currentIndex, property: property, isDesktop: isDesktop },
		}); */

    handleViewApplication();
    const state = { index: index, propertyIndex: currentIndex, property: property, isDesktop: isDesktop };
    // setTenantAppNavState(state);
  };

  const getRentStatus = () => {
    try {
      const rentStatus = allRentStatus.filter((data) => data.property_uid == currentId && data.rent_status != "VACANT");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formatData = (data) => {
        return data.map((item, index) => {
          // console.log("item - ", item.rent_detail_index);
          return {
            ...item,
            // idx: index,
            cf_monthName: monthNames[item.cf_month - 1],
            total_paid_formatted: item.total_paid ? `$${item.total_paid}` : "-",
            latest_date_formatted: item.latest_date || "-",
            fees: "-",
          };
        });
      };

      // console.log("getRentStatus - rentStatus - ", rentStatus);
      // console.log("getRentStatus - propertyRentStatus - ", propertyRentStatus);
      const formattedData = propertyRentStatus ? formatData(rentStatus) : [];
      // console.log("getRentStatus - formattedData - ", formattedData);
      return formattedData;
    } catch (error) {
      console.log(error);
    }
  };

  const paymentStatusColorMap = (value) => {
    if (value === "PAID") {
      return theme.palette.priority.clear;
    } else if (value === "UNPAID") {
      return theme.palette.priority.high;
    } else if (value === "PARTAILLY PAID") {
      return theme.palette.priority.medium;
    } else if (value === "PAID LATE" || "NO MANAGER") {
      return theme.palette.priority.low;
    }
  };

  const getLateFeesColor = (fee) => {
    if (fee.lf_purchase_status === "PAID") return "green";
    else return "red";
  };

  const rentStatusColumns = [
    {
      field: "cf_monthName",
      headerName: "Month",
      sortable: isDesktop,
      flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
    {
      field: "latest_date_formatted",
      headerName: "Paid",
      sortable: isDesktop,
      // flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
    {
      // field: 'total_paid_formatted',\
      field: "pur_amount_due",
      headerName: "Amount",
      sortable: isDesktop,
      flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },

    {
      field: "rent_status",
      headerName: "Rent Status",
      sortable: isDesktop,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              width: "100%",
              margin: "0px",
              textAlign: "center",
              color: "#F2F2F2",
              backgroundColor: paymentStatusColorMap(params.value),
              overflowWrap: "break-word",
              whiteSpace: "break-spaces",
              fontSize: "13px",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "fees",
      headerName: "Late Fees",
      sortable: isDesktop,
      flex: 1,
      renderCell: (params) => {
        // return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.value}</Box>;
        // return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.row.lf_pur_amount_due}</Box>;
        return <Box sx={{ width: "100%", color: getLateFeesColor(params.row) }}>{params.row.lf_pur_amount_due}</Box>;
      },
    },
    {
      field: "pur_description",
      headerName: "pur_description",
      sortable: isDesktop,
      flex: 2,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
    // {
    //   field: "rent_detail_index",
    //   headerName: "rent_detail_index",
    //   sortable: isDesktop,
    //   flex: 3,
    //   renderCell: (params) => {
    //     return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
    //   },
    // },
    {
      field: "property_uid",
      headerName: "property_uid",
      sortable: isDesktop,
      flex: 1,
      renderCell: (params) => {
        return <Box sx={{ width: "100%", color: "#3D5CAC" }}>{params.value}</Box>;
      },
    },
  ];

  const handleEditClick = (row) => {
    // console.log("ROHIT - handleEditClick - row - ", row);
    setInitialApplData(row);
    setcurrentApplRow(row);
    setModifiedApplRow({ appliance_uid: row.appliance_uid });
    setIsEditing(true);
    handleOpen();
  };

  const handleViewLeaseClick = () => {
    onViewLeaseClick("ViewLease");
  };

  const handleViewContractClick = () => {
    onViewContractClick("ViewContract");
  };

  const handleDeleteClick = (id) => {
    setAppliances(appliances.filter((appliance) => appliance.appliance_uid !== id));
  };

  const addAppliance = async (appliance) => {
    // console.log("inside editOrUpdateAppliance", appliance);
    try {
      setShowSpinner(true);
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "*",
      };

      const applianceFormData = new FormData();

      Object.keys(appliance).forEach((key) => {
        // console.log(`Key: ${key}`);

        applianceFormData.append(key, appliance[key]);
      });
      // applianceFormData.append('appiliance_uid', appliance.uid);

      // console.log("ROHIT _ editOrUpdateProfile - profileFormData - ");
      // for (var pair of profileFormData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }

      axios
        .post("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/appliances", applianceFormData, headers)
        .then((response) => {
          // console.log("Data updated successfully", response);
          // showSnackbar("Your profile has been successfully updated.", "success");
          // handleUpdate();
          setAppliances([...appliances, { ...appliance, appliance_uid: response?.data?.appliance_uid }]);
          setShowSpinner(false);
        })
        .catch((error) => {
          setShowSpinner(false);
          // showSnackbar("Cannot update your profile. Please try again", "error");
          if (error.response) {
            console.log(error.response.data);
          }
        });
      setShowSpinner(false);
      // setModifiedData([]);
    } catch (error) {
      // showSnackbar("Cannot update the lease. Please try again", "error");
      console.log("Cannot Update Appliances", error);
      setShowSpinner(false);
    }
  };

  const getAppliancesChanges = () => {
    const changes = {};

    if (!initialApplData) {
      return changes;
    }

    Object.keys(currentApplRow).forEach((key) => {
      if (initialApplData[key] != currentApplRow[key]) {
        changes[key] = currentApplRow[key];
      }
    });
    return changes;
  };

  const editAppliance = async (appliance) => {
    console.log("inside editAppliance", appliance);
    try {
      setShowSpinner(true);
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "*",
      };

      const changedFields = getAppliancesChanges();

      if (Object.keys(changedFields).length == 0) {
        console.log("No changes detected.");
        setShowSpinner(false);
        return;
      }

      const applianceFormData = new FormData();

      // Object.keys(appliance).forEach((key) => {
      //   // console.log(`Key: ${key}`);

      //   applianceFormData.append(key, changedFields[key]);
      // });
      // applianceFormData.append('appiliance_uid', appliance.uid);

      // console.log("ROHIT _ editOrUpdateProfile - profileFormData - ");
      // for (var pair of profileFormData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }

      for (const [key, value] of Object.entries(changedFields)) {
        applianceFormData.append(key, value);
      }

      for (let [key, value] of applianceFormData.entries()) {
        console.log(key, value);
      }

      if (appliance.appliance_uid) {
        applianceFormData.append("appliance_uid", appliance.appliance_uid);
      }

      axios
        .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/appliances", applianceFormData, headers)
        .then((response) => {
          // console.log("Data updated successfully", response);
          // showSnackbar("Your profile has been successfully updated.", "success");
          // handleUpdate();
          // setAppliances([...appliances, { ...appliance, appliance_uid: response?.data?.appliance_uid }]);
          // setAppliances([...appliances, { ...currentApplRow }]);
          setAppliances((prevAppliances) => {
            const index = prevAppliances.findIndex((appliance) => appliance.appliance_uid === currentApplRow.appliance_uid);

            if (index !== -1) {
              // Update existing item
              return prevAppliances.map((appliance, i) => (i === index ? { ...appliance, ...currentApplRow } : appliance));
            } else {
              // Add new item
              return [...prevAppliances, { ...currentApplRow }];
            }
          });
          setShowSpinner(false);
        })
        .catch((error) => {
          setShowSpinner(false);
          // showSnackbar("Cannot update your profile. Please try again", "error");
          if (error.response) {
            console.log(error.response.data);
          }
        });
      setShowSpinner(false);
      // setModifiedData([]);
    } catch (error) {
      // showSnackbar("Cannot update the lease. Please try again", "error");
      // console.log("Cannot Update Appliances", error);
      setShowSpinner(false);
    }
  };

  const handleAddAppln = () => {
    const newError = {};
    if (!currentApplRow.appliance_type) newError.appliance_type = "Type is required";

    setError(newError);
    if (Object.keys(newError).length === 0) {
      if (isEditing) {
        // setAppliances(appliances.map((appliance) => (appliance.appliance_uid === currentApplRow.appliance_uid ? currentApplRow : appliance)));
        // editOrUpdateAppliance(currentApplRow)

        // editAppliance(modifiedApplRow)
        editAppliance(currentApplRow);
      } else {
        // setAppliances([...appliances, { ...currentApplRow, appliance_uid: uuidv4() }]);
        addAppliance(currentApplRow);
      }
      handleClose();
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getApplianceCategories = async () => {
    try {
      const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
      //const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
      if (!response.ok) {
        // console.log("Error fetching lists data");
      }
      const responseJson = await response.json();
      const applnCategories = responseJson.result.filter((res) => res.list_category === "appliances" && res.list_item.trim() !== "");
      // console.log("ROHIT - appliance categories - ", applnCategories);
      setApplianceCategories(applnCategories);
      const listItemToUidMapping = applnCategories.reduce((acc, item) => {
        acc[item.list_item] = item.list_uid;
        return acc;
      }, {});
      // console.log("ROHIT - appliance categories to UIDs- ", listItemToUidMapping);
      setApplianceCategoryToUIDMap(listItemToUidMapping);
      const listUidToItemMapping = applnCategories.reduce((acc, item) => {
        acc[item.list_uid] = item.list_item;
        return acc;
      }, {});
      // console.log("ROHIT - appliance UIDs to categories- ", listUidToItemMapping);
      setApplianceUIDToCategoryMap(listUidToItemMapping);
    } catch (error) {
      console.log(error);
    }
  };

  const applnColumns = [
    { field: "appliance_uid", headerName: "UID", width: 80 },
    { field: "appliance_item", headerName: "Appliance", width: 100 },
    { field: "appliance_desc", headerName: "Description", width: 80 },
    { field: "appliance_manufacturer", headerName: "Manufacturer", width: 80 },
    { field: "appliance_purchased_from", headerName: "Purchased From", width: 80 },
    { field: "appliance_purchased", headerName: "Purchased On", width: 80 },
    { field: "appliance_purchase_order", headerName: "Purchase Order Number", width: 80 },
    { field: "appliance_installed", headerName: "Installed On", width: 80 },
    { field: "appliance_serial_num", headerName: "Serial Number", width: 80 },
    { field: "appliance_model_num", headerName: "Model Number", width: 80 },
    { field: "appliance_warranty_till", headerName: "Warranty Till", width: 80 },
    { field: "appliance_warranty_info", headerName: "Warranty Info", width: 80 },
    { field: "appliance_url", headerName: "URLs", width: 80 },
    { field: "appliance_images", headerName: "Images", width: 80 },
    { field: "appliance_documents", headerName: "Documents", width: 80 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.appliance_uid)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper
      style={{
        marginTop: "10px",
        backgroundColor: theme.palette.primary.main,
        width: "100%", // Occupy full width with 25px margins on each side
      }}
    >
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box
        sx={{
          flexDirection: "column", // Added this to stack children vertically
          justifyContent: "center",
          width: "100%", // Take up full screen width
          height: "100%",
        }}
      >
        {/* Property Navigator Header Including Address and x of y Properties */}
        <Grid container sx={{ marginTop: "15px", alignItems: "center", justifyContent: "center" }}>
          <Grid item md={1} xs={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handlePreviousCard} disabled={currentIndex === 0 || !propertyData || propertyData.length === 0}>
              {currentIndex === 0 ? (
                <ArrowBackIcon sx={{ color: "#A0A0A0", width: "25px", height: "25px", margin: "0px" }} />
              ) : (
                <ArrowBackIcon sx={{ color: "#000000", width: "25px", height: "25px", margin: "0px" }} />
              )}
            </Button>
          </Grid>
          <Grid
            item
            md={8}
            xs={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
                textAlign: "center",
              }}
              paddingBottom='10px'
            >
              {property
                ? `${property.property_address} ${property.property_unit}, ${property.property_city} ${property.property_state} ${property.property_zip}`
                : "No Property Selected"}
            </Typography>
            <Typography
              sx={{
                color: "#3D5CAC",
                fontWeight: theme.typography.propertyPage.fontWeight,
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Property UID: {property?.property_uid} 
            </Typography>
            <Typography
              sx={{
                color: "#3D5CAC",
                fontWeight: theme.typography.propertyPage.fontWeight,
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {currentIndex + 1} of {propertyData ? propertyData.length : 0} Properties
            </Typography>
          </Grid>
          <Grid item md={1} xs={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleNextCard} disabled={currentIndex === propertyData.length - 1 || !propertyData || propertyData.length === 0}>
              {currentIndex === propertyData.length - 1 ? (
                <ArrowForwardIcon sx={{ color: "#A0A0A0", width: "25px", height: "25px", margin: "0px" }} />
              ) : (
                <ArrowForwardIcon sx={{ color: "#000000", width: "25px", height: "25px", margin: "0px" }} />
              )}
            </Button>
          </Grid>
        </Grid>
        {/* End Property Navigator Header Including Address and x of y Properties */}
        {/* Property Detail Cards */}
        <Box
          sx={{
            alignItems: "center",
            justifyContent: "center",
            margin: "10px",
          }}
        >
          <Grid container rowSpacing={4} columnSpacing={4} justify='space-between' alignItems='stretch'>
            {/* Top Card */}
            <Grid item xs={12} md={12}>
              <Card
                sx={{
                  backgroundColor: color,
                  boxShadow: "none",
                  elevation: "0",
                  padding: "16px",
                }}
              >
                {/* Top Container */}
                <Grid container spacing={2}>
                  {/* Image with Image Arrows */}
                  <Grid item xs={12} md={3}>
                    <Card
                      sx={{
                        backgroundColor: color,
                        boxShadow: "none",
                        elevation: "0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%", // Ensure card takes full height of its container
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          padding: "0 !important",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            height: "200px",
                            width: "100%",
                          }}
                        >
                          {/* Image */}
                          <CardMedia
                            component='img'
                            image={images[activeStep]}
                            sx={{
                              elevation: "0",
                              boxShadow: "none",
                              flexGrow: 1,
                              objectFit: "fill",
                              width: "100%",
                              height: "100px",
                            }}
                          />
                          {/* End Image */}
                          <MobileStepper
                            steps={maxSteps}
                            position='static'
                            activeStep={activeStep}
                            variant='text'
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
                              <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1} sx={{ minWidth: "40px", width: "40px" }}>
                                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                              </Button>
                            }
                            backButton={
                              <Button size='small' onClick={handleBack} disabled={activeStep === 0} sx={{ minWidth: "40px", width: "40px" }}>
                                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                              </Button>
                            }
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* End Image with Image Arrows */}
                  <Grid item xs={0} md={0.5} />
                  {/* Middle Column with Property Details */}
                  <Grid item xs={12} md={5}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Type
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property ? property.property_type : "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
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
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property ? property.property_area : "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Bedrooms
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property ? property.property_num_beds : "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          Bathrooms
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.light.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: "left",
                          }}
                        >
                          {property ? property.property_num_baths : "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          Property Value
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
                          {property ? `$${property.property_value}` : "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                          }}
                        >
                          $ Per Sqft
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
                          {property ? `$${(property.property_value / property.property_area).toFixed(2)}` : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* End Middle Column with Property Details */}
                  {/* Buttons */}
                  <Grid item xs={12} md={3.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {property && property.property_available_to_rent === 1 ? (
                          // padding extra on the bottom
                          <Box sx={{ pb: 40 }}>
                            <Button
                              variant='outlined'
                              sx={{
                                background: "#3D5CAC",
                                backgroundColor: theme.palette.success.main,
                                cursor: "pointer",
                                textTransform: "none",
                                minWidth: "150px", // Fixed width for the button
                                minHeight: "35px",
                                width: "100%",
                                "&:hover": {
                                  backgroundColor: theme.palette.success.dark,
                                },
                              }}
                              size='small'
                            >
                              <CheckIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
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
                                {"Listed For Rent"}
                              </Typography>
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ pb: 40 }}>
                            <Button
                              variant='outlined'
                              sx={{
                                background: "#3D5CAC",
                                backgroundColor: theme.palette.priority.high,
                                cursor: "pointer",
                                textTransform: "none",
                                minWidth: "150px", // Fixed width for the button
                                minHeight: "35px",
                                width: "100%",
                              }}
                              size='small'
                            >
                              <CloseIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
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
                                {"Not Listed"}
                              </Typography>
                            </Button>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          {/* Edit Property Button */}
                          <Button
                            variant='outlined'
                            sx={{
                              background: "#3D5CAC",
                              color: theme.palette.background.default,
                              cursor: "pointer",
                              textTransform: "none",
                              minWidth: "150px", // Fixed width for the button
                              minHeight: "35px",
                              width: "100%",
                            }}
                            size='small'
                            onClick={() => {
                              // console.log('typeof edit', typeof(onEditClick));
                              onEditClick("edit_property");
                            }}
                            // onClick={handleEditButton}
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
                      {selectedRole === "MANAGER" && property && property.property_available_to_rent !== 1 && (
                        <Grid item xs={12}>
                          <Button
                            variant='outlined'
                            sx={{
                              background: "#3D5CAC",
                              color: theme.palette.background.default,
                              cursor: "pointer",
                              textTransform: "none",
                              minWidth: "150px",
                              minHeight: "35px",
                              width: "100%",
                            }}
                            size='small'
                            onClick={() => onAddListingClick("create_listing")}
                          >
                            <PostAddIcon sx={{ color: "#FFFFFF", fontSize: "18px", margin: "5px" }} />
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: "#FFFFFF",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                              }}
                            >
                              {"Create Listing"}
                            </Typography>
                          </Button>
                        </Grid>
                      )}
                      {selectedRole === "MANAGER" && property && property.property_available_to_rent === 1 && (
                        <Grid item xs={12}>
                          <Button
                            variant='outlined'
                            sx={{
                              background: "#3D5CAC",
                              color: theme.palette.background.default,
                              cursor: "pointer",
                              textTransform: "none",
                              minWidth: "150px",
                              minHeight: "35px",
                              width: "100%",
                            }}
                            size='small'
                            onClick={() => onAddListingClick("edit_listing")}
                          >
                            <PostAddIcon sx={{ color: "#FFFFFF", fontSize: "18px", margin: "5px" }} />
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
                              {"Edit Listing"}
                            </Typography>
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  {/* End Buttons */}
                </Grid>
                {/* End Top Container */}
              </Card>
            </Grid>
            {/* End Top Card */}

            {/* Lease Details and Management Details Cards */}
            {/* Left component */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: color, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                      textAlign: "center",
                    }}
                  >
                    Lease Details
                  </Typography>
                  {property?.lease_uid && (
                    <Button
                      sx={{
                        padding: "0px",
                        "&:hover": {
                          backgroundColor: theme.palette.form.main,
                        },
                      }}
                      className='.MuiButton-icon'
                      onClick={handleViewLeaseClick}
                      // onClick={() =>
                      //   navigate('/viewLease', {
                      //     state: {
                      //       lease_id: property.lease_uid,
                      //       index: currentIndex,
                      //       isDesktop: isDesktop,
                      //     },
                      //   })
                      // }
                    >
                      <img src={LeaseIcon} />
                    </Button>
                  )}
                </Box>
                <CardContent
                  sx={{
                    flexDirection: "column",
                    alignItems: "left",
                    justifyContent: "left",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Rent:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {property ? (property.property_listed_rent ? "$" + property.property_listed_rent : "No Rent Listed") : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Available To Pay:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {rentFee ? rentFee.available_topay + " days in advance" : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Frequency:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {rentFee ? rentFee.frequency : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Lease Expires:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {property ? (property.lease_end ? property.lease_end : "No Lease") : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          textTransform: "none",
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Tenant:
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
                        {tenant_detail}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Due:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {rentFee ? rentFee.due_by : "No Due Date Listed"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Late Fee:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {rentFee ? rentFee.late_fee : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        Late Fee Per Day:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.light.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                      >
                        {rentFee ? rentFee.perDay_late_fee : "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Right component */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: color, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                      textAlign: "center",
                    }}
                  >
                    Management Details
                  </Typography>
                  {property?.contract_uid && (
                    <Button
                      sx={{
                        padding: "0px",
                        "&:hover": {
                          backgroundColor: theme.palette.form.main,
                        },
                      }}
                      className='.MuiButton-icon'
                      onClick={handleViewContractClick}
                      // onClick={() =>
                      //   navigate('/viewLease', {
                      //     state: {
                      //       lease_id: property.lease_uid,
                      //       index: currentIndex,
                      //       isDesktop: isDesktop,
                      //     },
                      //   })
                      // }
                    >
                      <img src={LeaseIcon} />
                    </Button>
                  )}
                </Box>
                <CardContent
                  sx={{
                    flexDirection: "column",
                    alignItems: "left",
                    justifyContent: "left",
                  }}
                >
                  <Grid container spacing={2}>
                    {selectedRole === "OWNER" && (
                      <Grid container item spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              textTransform: "none",
                              color: theme.typography.primary.black,
                              fontWeight: theme.typography.secondary.fontWeight,
                              fontSize: theme.typography.smallFont,
                              paddingRight: "15px",
                            }}
                          >
                            Property Manager:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                              }}
                            >
                              {property && property.business_uid ? `${property.business_name}` : "No Manager Selected"}
                            </Typography>
                            <KeyboardArrowRightIcon
                              sx={{
                                color: theme.typography.common.blue,
                                cursor: "pointer",
                              }}
                              onClick={() => handleManagerChange(currentIndex)}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                    {selectedRole === "MANAGER" && (
                      <Grid container item spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              textTransform: "none",
                              color: theme.typography.primary.black,
                              fontWeight: theme.typography.secondary.fontWeight,
                              fontSize: theme.typography.smallFont,
                            }}
                          >
                            Owner:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate("/ownerContactDetailsHappinessMatrix", {
                                state: {
                                  ownerUID: property.owner_uid,
                                  navigatingFrom: "PropertyNavigator",
                                  // index: index,
                                  happinessData: happinessData,
                                  // happinessMatrixData: dataforhappiness,
                                },
                              })
                            }
                          >
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont,
                              }}
                            >
                              {property ? `${property.owner_first_name}  ${property.owner_last_name}` : "-"}
                            </Typography>
                            <KeyboardArrowRightIcon
                              sx={{
                                color: theme.typography.common.blue,
                                cursor: "pointer",
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    <Grid container item spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            textTransform: "none",
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.secondary.fontWeight,
                            fontSize: theme.typography.smallFont,
                            paddingRight: "50px",
                            paddingLeft: "4px",
                          }}
                        >
                          Open Maintenance Tickets:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (property && property.maintenanceCount > 0) {
                              if (selectedRole === "OWNER") {
                                navigate("/ownerMaintenance", {
                                  state: {
                                    propertyId: propertyId,
                                    fromProperty: true,
                                    index: currentIndex,
                                  },
                                });
                              } else {
                                navigate("/managerMaintenance", {
                                  state: {
                                    propertyId: propertyId,
                                    fromProperty: true,
                                    index: currentIndex,
                                  },
                                });
                              }
                            }
                          }}
                        >
                          <Badge
                            badgeContent={property?.maintenanceCount || 0}
                            showZero
                            color='error'
                            sx={{
                              paddingRight: "10px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    {contractsData && contractsData.length > 0 && selectedRole !== "MANAGER" ? (
                      <>
                        <Grid item xs={10.7} md={10.7}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                                paddingRight: "88px", // here padding
                              }}
                            >
                              PM Quotes Requested:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: contractsNewSent ? "pointer" : "default",
                              }}
                              onClick={contractsNewSent ? handleViewPMQuotesRequested : null}
                            >
                              <Badge color="success" badgeContent={contractsNewSent} showZero />
                            </Box>
                          </Box>
                        </Grid>
                        {contractsNewSent ? (
                          <Grid item xs={1.3} md={1.3}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0px 0px 0px 8px",
                              }}
                            >
                              <KeyboardArrowRightIcon
                                sx={{ color: arrowButton1_color, cursor: "pointer" }}
                                onClick={() => {
                                  /* navigate('/pmQuotesRequested', {
                                      state: {
                                        index: currentIndex,
                                        propertyData: propertyData,
                                        contracts: contractsData,
                                        isDesktop: isDesktop,
                                      },
                                    }); */
                                  // const state = {
                                  //   index: currentIndex,
                                  //   propertyData: propertyData,
                                  //   contracts: contractsData,
                                  //   isDesktop: isDesktop,
                                  // };
                                  // setPmQuoteRequestedState(state);
                                  handleViewPMQuotesRequested();
                                }}
                              />
                            </Box>
                          </Grid>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : null}
                    {property && property.applications.length > 0 && (
                      <>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              sx={{
                                textTransform: "none",
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                                paddingRight: "103px",
                              }}
                            >
                              Applications:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <Badge
                                color='success'
                                badgeContent={property.applications.filter((app) => app.lease_status === "NEW" || app.lease_status === "PROCESSING").length}
                                showZero
                                sx={{
                                  paddingRight: "50px",
                                }}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Accordion theme={theme} sx={{ backgroundColor: "#e6e6e6", marginLeft: "-5px" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                              <Typography
                                sx={{
                                  textTransform: "none",
                                  color: theme.typography.primary.black,
                                  fontWeight: theme.typography.secondary.fontWeight,
                                  fontSize: theme.typography.smallFont,
                                }}
                              >
                                View All Applications
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "0px 5px 5px 5px",
                              }}
                            >
                              {property.applications.map((app, index) => (
                                <Button
                                  key={index}
                                  onClick={() => handleAppClick(index)}
                                  sx={{
                                    backgroundColor: getAppColor(app),
                                    color: "#FFFFFF",
                                    textTransform: "none",
                                    width: "100%",
                                    height: "70px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 2,
                                    "&:hover, &:focus, &:active": {
                                      backgroundColor: getAppColor(app),
                                    },
                                  }}
                                >
                                  <Box sx={{ display: "flex" }}>
                                    <Typography
                                      sx={{
                                        fontSize: theme.typography.smallFont,
                                        mr: 1,
                                      }}
                                    >
                                      {app.tenant_first_name + " " + app.tenant_last_name + " "}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: theme.typography.smallFont,
                                        mr: 1,
                                      }}
                                    >
                                      {app.lease_status + " "}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: theme.typography.smallFont,
                                      }}
                                    >
                                      {app.lease_application_date}
                                    </Typography>
                                  </Box>
                                </Button>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* End Lease Details and Management Details Cards */}
          </Grid>

          {/* Rent history grid */}
          <Grid item xs={12} sx={{ pt: "10px" }}>
            <Card sx={{ backgroundColor: color, height: "100%" }}>
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Rent History
              </Typography>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <DataGrid
                  rows={propertyRentStatus}
                  columns={rentStatusColumns}
                  disableColumnMenu={!isDesktop}
                  autoHeight
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
                    "& .MuiDataGrid-cell": {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#3D5CAC",
                      textAlign: "center",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      textAlign: "center",
                      font: "bold",
                      width: "100%",
                    },
                    "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": { display: "none" },
                    "@media (maxWidth: 600px)": {
                      "& .MuiDataGrid-columnHeaderTitle": {
                        width: "100%",
                        margin: "0px",
                        padding: "0px",
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          {/* End Rent history grid */}

          {/* Appliances grid */}
          <Grid item xs={12} md={12} sx={{ pt: "10px" }}>
            <Card sx={{ backgroundColor: color, height: "100%" }}>
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0px 15px 0px 10px",
                  }}
                >
                  <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                    <Typography
                      sx={{
                        color: theme.typography.primary.black,
                        fontWeight: theme.typography.primary.fontWeight,
                        fontSize: theme.typography.largeFont,
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    >
                      Appliances
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    sx={{
                      background: "#3D5CAC",
                      color: theme.palette.background.default,
                      cursor: "pointer",
                      textTransform: "none",
                      minWidth: "30px",
                      minHeight: "30px",
                      fontWeight: theme.typography.secondary.fontWeight,
                      fontSize: theme.typography.smallFont,
                    }}
                    size='small'
                    onClick={() => {
                      setcurrentApplRow({
                        appliance_uid: "",
                        appliance_url: "",
                        appliance_type: "",
                        appliance_desc: "",
                        appliance_images: "",
                        appliance_available: 0,
                        appliance_installed: null,
                        appliance_model_num: "",
                        appliance_purchased: null,
                        appliance_serial_num: "",
                        appliance_property_id: propertyId,
                        appliance_manufacturer: "",
                        appliance_warranty_info: "",
                        appliance_warranty_till: null,
                        appliance_purchase_order: "",
                        appliance_purchased_from: "",
                      });
                      setIsEditing(false);
                      handleOpen();
                    }}
                  >
                    <AddIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
                  </Button>
                </Box>
                <DataGrid
                  rows={appliances}
                  columns={applnColumns}
                  pageSize={5}
                  getRowId={(row) => row.appliance_uid}
                  autoHeight
                  sx={{
                    fontSize: "10px",
                    "& .wrap-text": {
                      whiteSpace: "normal !important",
                      wordWrap: "break-word !important",
                      overflow: "visible !important",
                    },
                  }}
                />
                <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                  <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: "100%" }}>
                    Please fill in all required fields.
                  </Alert>
                </Snackbar>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>{isEditing ? "Edit Appliance" : "Add New Appliance"}</DialogTitle>
                  <DialogContent>
                    <FormControl margin='dense' fullWidth variant='outlined' sx={{ marginTop: "10px" }}>
                      <InputLabel required>Appliance Type</InputLabel>
                      <Select
                        margin='dense'
                        label='Appliance Type'
                        fullWidth
                        required
                        variant='outlined'
                        value={currentApplRow?.appliance_type ? applianceUIDToCategoryMap[currentApplRow?.appliance_type] : "range"}
                        // value={currentApplRow?.appliance_type || ""}
                        onChange={(e) => {
                          if (isEditing) {
                            // fix - send only updated fields
                            // setModifiedApplRow({
                            //   ...modifiedApplRow,
                            //   appliance_type: applianceCategoryToUIDMap[e.target.value],
                            // })
                            // console.log("ROHIT - setting appliance type to - ", e.target.value);
                            setcurrentApplRow({
                              ...currentApplRow,
                              appliance_type: applianceCategoryToUIDMap[e.target.value],
                            });
                          } else {
                            // console.log("ROHIT - setting appliance type to - ", applianceCategoryToUIDMap[e.target.value]);
                            setcurrentApplRow({
                              ...currentApplRow,
                              appliance_type: applianceCategoryToUIDMap[e.target.value],
                            });
                          }
                        }}
                      >
                        {applianceCategories &&
                          applianceCategories.map((appln) => (
                            <MenuItem key={appln.list_uid} value={appln.list_item}>
                              {appln.list_item}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <TextField
                      margin='dense'
                      label='Description'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_desc || ""}
                      onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_desc: e.target.value })}
                    />
                    <TextField
                      margin='dense'
                      label='Manufacturer Name'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_manufacturer || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_manufacturer: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin='dense'
                      label='Purchased From'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_purchased_from || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_purchased_from: e.target.value,
                        })
                      }
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='Purchased On'
                        value={currentApplRow?.appliance_purchased ? dayjs(currentApplRow.appliance_purchased) : null}
                        // onChange={(e) =>
                        //   setcurrentApplRow({
                        //     ...currentApplRow,
                        //     appliance_purchased: e.target.value,
                        //   })
                        // }
                        onChange={(date) => {
                          const formattedDate = dayjs(date).format("MM-DD-YYYY");
                          setcurrentApplRow({
                            ...currentApplRow,
                            appliance_purchased: formattedDate,
                          });
                        }}
                        textField={(params) => (
                          <TextField
                            {...params}
                            margin='dense'
                            fullWidth
                            size='small'
                            variant='outlined'
                            sx={{
                              "& .MuiInputBase-root": {
                                fontSize: "14px",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: "20px",
                              },
                            }}
                          />
                        )}
                        sx={{ marginTop: "10px", width: "535px" }}
                      />
                    </LocalizationProvider>
                    <TextField
                      margin='dense'
                      label='Purchase Order Number'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_purchase_order || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_purchase_order: e.target.value,
                        })
                      }
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='Installed On'
                        value={currentApplRow?.appliance_installed ? dayjs(currentApplRow.appliance_installed) : null}
                        onChange={(date) => {
                          const formattedDate = dayjs(date).format("MM-DD-YYYY");
                          setcurrentApplRow({
                            ...currentApplRow,
                            appliance_installed: formattedDate,
                          });
                        }}
                        textField={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            sx={{
                              "& .MuiInputBase-root": {
                                fontSize: "14px",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: "20px",
                              },
                            }}
                          />
                        )}
                        sx={{ marginTop: "10px", width: "535px" }}
                      />
                    </LocalizationProvider>

                    <TextField
                      margin='dense'
                      label='Serial Number'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_serial_num || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_serial_num: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin='dense'
                      label='Model Number'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_model_num || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_model_num: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin='dense'
                      label='Warranty Info'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_warranty_info || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_warranty_info: e.target.value,
                        })
                      }
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='Warranty Till'
                        value={currentApplRow?.appliance_warranty_till ? dayjs(currentApplRow.appliance_warranty_till) : null}
                        onChange={(date) => {
                          const formattedDate = dayjs(date).format("MM-DD-YYYY");
                          setcurrentApplRow({
                            ...currentApplRow,
                            appliance_warranty_till: formattedDate,
                          });
                        }}
                        textField={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            sx={{
                              "& .MuiInputBase-root": {
                                fontSize: "14px",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: "20px",
                              },
                            }}
                          />
                        )}
                        sx={{ marginTop: "10px", width: "535px" }}
                      />
                    </LocalizationProvider>
                    <TextField
                      margin='dense'
                      label='URLs'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_url || ""}
                      onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_url: e.target.value })}
                    />
                    <TextField
                      margin='dense'
                      label='Images'
                      fullWidth
                      variant='outlined'
                      value={currentApplRow?.appliance_images || ""}
                      onChange={(e) =>
                        setcurrentApplRow({
                          ...currentApplRow,
                          appliance_images: e.target.value,
                        })
                      }
                    />
                  </DialogContent>
                  <DialogActions sx={{ alignContent: "center", justifyContent: "center" }}>
                    <Button
                      variant='outlined'
                      sx={{
                        background: "#3D5CAC",
                        color: theme.palette.background.default,
                        cursor: "pointer",
                        textTransform: "none",
                        width: "30%",
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                      size='small'
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='outlined'
                      sx={{
                        background: "#3D5CAC",
                        color: theme.palette.background.default,
                        cursor: "pointer",
                        textTransform: "none",
                        width: "30%",
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                      size='small'
                      onClick={handleAddAppln}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Card>
          </Grid>
          {/* End Appliances grid */}
        </Box>
        {/* End Property Detail Cards */}
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
