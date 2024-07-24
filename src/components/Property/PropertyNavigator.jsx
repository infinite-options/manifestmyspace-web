import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid, Badge, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, TextField, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import axios from "axios";
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
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../../contexts/UserContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { maintenanceOwnerDataCollectAndProcess } from '../Maintenance/MaintenanceOwner.jsx';
import { maintenanceManagerDataCollectAndProcess } from '../Maintenance/MaintenanceManager.jsx';

import APIConfig from '../../utils/APIConfig';
import { v4 as uuidv4 } from 'uuid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const getAppColor = (app) =>
	app.lease_status !== 'REJECTED' ? (app.lease_status !== 'REFUSED' ? '#778DC5' : '#874499') : '#A52A2A';

export default function PropertyNavigator({
	index,
	propertyList,
	allRentStatus,
	rawPropertyData,
	contracts,
	isDesktop = true,
	props,
}) {
	// console.log('In Property Navigator');
	// console.log(index, propertyList);
	// console.log(contracts);
	const navigate = useNavigate();
	const { getProfileId, isManager, roleName, selectedRole } = useUser();

    useEffect(() => {
        console.log("PropertyNavigator received index:", index);
      }, [index]);
      
  const [propertyData, setPropertyData] = useState(propertyList);
  const [currentIndex, setCurrentIndex] = useState(index !== undefined ? index : 0);
  const [property, setProperty] = useState(propertyList[currentIndex]);
  const [currentId, setCurrentId] = useState(property.property_uid);
  const [contactDetails, setContactDetails] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([{}]);
  const [propertyRentStatus, setpropertyRentStatus] = useState(allRentStatus);
  const [rentFee, setrentFee] = useState({});
  const [appliances, setAppliances] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentApplRow, setcurrentApplRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [applianceCategories, setApplianceCategories] = useState([]);

  const [happinessData, setHappinessData] = useState([]);
  const [dataforhappiness, setdataforhappiness] = useState([]);

//   console.log("lcation state rent status", allRentStatus);

  const getDataFromAPI = async () => {
    const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
	// const url = `${APIConfig.baseURL.dev}/contacts/600-000003`;
    try {
      const response = await axios.get(url);
      const data = response.data["management_contacts"];
      const ownerContacts = data["owners"];
      setContactDetails(ownerContacts);
    } catch (error) {
      console.error("Error fetching owner contacts: ", error);
    }
  };

  useEffect(() => {
    getDataFromAPI();
  }, []);



	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Parse property images once outside the component
	const parsedPropertyImages = propertyData[currentIndex].property_images
		? JSON.parse(propertyData[currentIndex].property_images)
		: [];
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
	const [propertyId, setPropertyId] = useState(propertyData[currentIndex].property_uid);

	let data = '';
	const role = roleName();
	if (role === 'Manager') {
		data = 'maintenance_status';
	} else if (role === 'Owner') {
		data = 'maintenance_request_status';
	}

	const maintenanceColumns = [
		{
			field: 'maintenance_request_uid',
			headerName: 'UID',
			flex: 1,
		},
		{
			field: 'maintenance_request_created_date',
			headerName: 'Created Date',
			flex: 1,
		},
		{
			field: 'maintenance_title',
			headerName: 'Title',
			flex: 1,
		},

		{
			field: data,
			headerName: 'Status',
			flex: 1,
		},
	];

	function getPropertyList(data) {
		const propertyList = data['Property'].result;
		const applications = data['Applications'].result;
		const appsMap = new Map();
		applications.forEach((a) => {
			const appsByProperty = appsMap.get(a.property_uid) || [];
			appsByProperty.push(a);
			appsMap.set(a.property_uid, appsByProperty);
		});
		return propertyList.map((p) => {
			p.applications = appsMap.get(p.property_uid) || [];
			p.applicationsCount = [...p.applications].filter((a) => a.lease_status === 'NEW').length;
			return p;
		});
	}

	useEffect(() => {
		setPropertyData(propertyList);
		const nextIndex = index !== undefined ? index : 0;
		setCurrentIndex(nextIndex);
		const nextId = propertyList[nextIndex].property_uid;
		setCurrentId(nextId);
		setProperty(propertyList[nextIndex]);
		const parsedPropertyImages = propertyList[nextIndex].property_images
			? JSON.parse(propertyList[nextIndex].property_images)
			: [];
		setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);
		setActiveStep(0);
	}, [index, propertyList]);

	useEffect(() => {
		setPropertyId(propertyData[currentIndex].property_uid);

		const getContractsForOwner = async () => {
			try {
				const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
				// const response = await fetch(`${APIConfig.baseURL.dev}/contracts/600-000003`);
				if (!response.ok) {
					console.log('Error fetching contracts data');
				}
				const contractsResponse = await response.json();
				var count = 0;
				const contracts = contractsResponse.result.filter((contract) => contract.property_id === propertyId);
				contracts.forEach((contract) => {
					if (contract.contract_status === 'SENT' || contract.contract_status === 'NEW') {
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
		const rentDetails = getRentStatus();
		setpropertyRentStatus(rentDetails);

		if (property.leaseFees !== null) {
			const rent = JSON.parse(propertyData[currentIndex].leaseFees).find((fee) => fee.fee_name === 'Rent');
			setrentFee(rent);
			// console.log('check rent', rent);
		} else {
			setrentFee(null);
		}

    const propertyApplicances = JSON.parse(propertyData[currentIndex].appliances);
    console.log('Appliances', propertyApplicances);
    if (property.appliances != null) {
      setAppliances(propertyApplicances);
      getApplianceCategories();
    //   console.log('Appliances categories', applianceCategories, typeof (applianceCategories));
    }
  }, [currentIndex, propertyId]);

	const tenant_detail =
		property.lease_start && property.tenant_uid
			? `${property.tenant_first_name} ${property.tenant_last_name}`
			: 'No Tenant';
	const manager_detail = property.business_uid ? `${property.business_name}` : 'No Manager';
	const [arrowButton1_color, set_arrow1_color] = useState(
		tenant_detail === 'No Tenant' && manager_detail === 'No Manager'
			? theme.typography.common.gray
			: theme.typography.common.blue
	);

	useEffect(() => {
		let profileId = getProfileId();
		// console.log('getProfileID', getProfileId());
		if (profileId.startsWith('600')) {
			maintenanceManagerDataCollectAndProcess(
				setMaintenanceReqData,
				setShowSpinner,
				setDisplayMaintenanceData,
				profileId
			);
		} else if (profileId.startsWith('110')) {
			maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
		} else if (profileId.startsWith('200')) {
			maintenanceOwnerDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, profileId);
		}
	}, [currentIndex, propertyId]);

	let dashboard_id = getProfileId();
	useEffect(() => {
		const fetchDashboardData = async () => {
		  setShowSpinner(true);
		  try {
			const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
			// const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`);
			if (!response.ok) {
			  throw new Error('Failed to fetch dashboard data');
			}
			const jsonData = await response.json();
			setHappinessData(jsonData.HappinessMatrix);
			setdataforhappiness(jsonData)
		  } catch (error) {
			console.error(error);
		  }
		  setShowSpinner(false);
		};
		fetchDashboardData();
	  }, [dashboard_id]);

	function getColorStatusBasedOnSelectedRole() {
		if (role === 'Manager') {
			return theme.colorStatusPMO;
		} else if (role === 'Owner') {
			return theme.colorStatusO;
		} else if (role === 'Maintenance') {
			return theme.colorStatusMM;
		} else if (role === 'PM Employee') {
			return theme.colorStatusPMO;
		} else if (role === 'Maintenance Employee') {
			return theme.colorStatusMM;
		} else if (role === 'Tenant') {
			return theme.colorStatusTenant;
		}
	}

	const handleOwnerClick = (ownerData) => {
		navigate('/ownerContactDetailsHappinessMatrix', {
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
		console.log(role);
		let status = 'NEW REQUEST';
		// console.log('initial Status: ', status);
		// console.log('handleOnClickNavigateToMaintenance');
		// console.log('row', row);
		// console.log('New data: ', property.maintenance);
		// console.log(
		// 	'maintenance_request_index_new',
		// 	property.maintenance.findIndex((item) => item.maintenance_request_uid === row.id)
		// );

		// console.log('Row: ', row);
		// console.log('Row1: ', row.row);
		// console.log('Row2: ', row.row.maintenance_status);

		if (role === 'Manager') {
			// These maitenance_status fields work for a Property Manager.  Need to make this Role Specific
			status = row.row.maintenance_status;
			// console.log('Manager status', status);

			if (status === 'NEW' || status === 'INFO') {
				status = 'NEW REQUEST';
			} else if (status === 'PROCESSING') {
				status = 'QUOTES REQUESTED';
			} else if (status === 'CANCELLED') {
				status = 'COMPLETED';
			}
		}

		if (role === 'Owner') {
			// Owner Status
			status = row.row.maintenance_request_status;
			// console.log('Owner status', status);

			if (status === 'NEW') {
				status = 'NEW REQUEST';
			} else if (status === 'INFO') {
				status = 'INFO REQUESTED';
			}
		}

		try {
			if (!isDesktop) {
				navigate('/maintenance/detail', {
					state: {
						maintenance_request_index: maintenanceReqData[status].findIndex(
							(item) => item.maintenance_request_uid === row.id
						), // index in the status array
						status: status,
						maintenanceItemsForStatus: maintenanceReqData[status],
						allMaintenanceData: maintenanceReqData,
						fromProperty: true,
						index: currentIndex,
						isDesktop: isDesktop,
					},
				});
			} else {
				navigate('/ownerMaintenance', {
					state: {
						maintenance_request_index: maintenanceReqData[status].findIndex(
							(item) => item.maintenance_request_uid === row.id
						), // index in the status array
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
			alert('Error navigating to maintenance detail', error);
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
						{	
							console.log('Row =', row);	
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
			return 'No Open Maintenance Tickets';	
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
		navigate('/maintenance');	

		// TODO: Need to send props to /maintenance to navigate to correct tab and item	
	}

	const handleNextCard = () => {
		let nextIndex = (currentIndex + 1) % propertyData.length;
		setCurrentIndex(nextIndex);
		const nextId = propertyData[nextIndex].property_uid;
		setCurrentId(nextId);
		setProperty(propertyData[nextIndex]);

		const parsedPropertyImages = propertyData[nextIndex].property_images
			? JSON.parse(propertyData[nextIndex].property_images)
			: [];
		// console.log('parsedImages:', parsedPropertyImages);
		// console.log('parsedImages.length:', parsedPropertyImages.length);
		setImages(parsedPropertyImages.length === 0 ? [propertyImage] : parsedPropertyImages);

		setActiveStep(0);
	};

	const handlePreviousCard = () => {
		let previousIndex = (currentIndex - 1 + propertyData.length) % propertyData.length;
		setCurrentIndex(previousIndex);
		const previousId = propertyData[previousIndex].property_uid;
		setCurrentId(previousId);
		setProperty(propertyData[previousIndex]);

		const parsedPropertyImages = propertyData[previousIndex].property_images
			? JSON.parse(propertyData[previousIndex].property_images)
			: [];
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
		if (property.business_uid) {
			navigate('/managerDetails', {
				state: {
					ownerId: property.owner_uid,
					managerBusinessId: property.business_uid,
					managerData: property,
					propertyData: propertyData,
					index: currentIndex,
					isDesktop: isDesktop,
				},
			});
		} else {
			navigate('/searchManager', { state: { index: currentIndex, propertyData, isDesktop } });
		}
	};

	const handleAppClick = (index) => {
		navigate('/tenantApplicationNav', {
			state: { index: index, propertyIndex: currentIndex, property: property, isDesktop: isDesktop },
		});
	};

	const getRentStatus = () => {
		try {
			const rentStatus = allRentStatus.filter(
				(data) => data.property_uid == currentId && data.rent_status != 'VACANT'
			);
			const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const formatData = (data) => {
				return data.map((item) => {
					return {
						...item,
						cf_monthName: monthNames[item.cf_month - 1],
						total_paid_formatted: item.total_paid ? `$${item.total_paid}` : '-',
						latest_date_formatted: item.latest_date || '-',
						fees: '-',
					};
				});
			};

			const formattedData = propertyRentStatus ? formatData(rentStatus) : [];
			return formattedData;
		} catch (error) {
			console.log(error);
		}
	};

	const paymentStatusColorMap = (value) => {
		if (value === 'PAID') {
			return theme.palette.priority.clear;
		} else if (value === 'UNPAID') {
			return theme.palette.priority.high;
		} else if (value === 'PARTAILLY PAID') {
			return theme.palette.priority.medium;
		} else if (value === 'PAID LATE' || 'NO MANAGER') {
			return theme.palette.priority.low;
		}
	};

	const rentStatusColumns = [
		{
			field: 'cf_monthName',
			headerName: 'Month',
			sortable: isDesktop,
			flex: 0.8,
			renderCell: (params) => {
				return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.value}</Box>;
			},
		},
		{
			field: 'latest_date_formatted',
			headerName: 'Paid',
			sortable: isDesktop,
			flex: 1,
			renderCell: (params) => {
				return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.value}</Box>;
			},
		},
		{
			field: 'total_paid_formatted',
			headerName: 'Amount',
			sortable: isDesktop,
			flex: 1,
			renderCell: (params) => {
				return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.value}</Box>;
			},
		},

		{
			field: 'rent_status',
			headerName: 'Rent Status',
			sortable: isDesktop,
			flex: 1,
			renderCell: (params) => {
				return (
					<Box
						sx={{
							width: '100%',
							margin: '0px',
							textAlign: 'center',
							color: '#F2F2F2',
							backgroundColor: paymentStatusColorMap(params.value),
							overflowWrap: 'break-word',
							whiteSpace: 'break-spaces',
							fontSize: '13px',
						}}
					>
						{params.value}
					</Box>
				);
			},
		},
		{
			field: 'fees',
			headerName: 'Fees',
			sortable: isDesktop,
			flex: 0.5,
			renderCell: (params) => {
				return <Box sx={{ width: '100%', color: '#3D5CAC' }}>{params.value}</Box>;
			},
		},
	];

	const handleEditClick = (row) => {
		setcurrentApplRow(row);
		setIsEditing(true);
		handleOpen();
	};

	const handleDeleteClick = (id) => {
		setAppliances(appliances.filter((appliance) => appliance.appliance_uid !== id));
	};

  const handleAddAppln = () => {
    const newError = {};
    if (!currentApplRow.appliance_type) newError.appliance_type = "Type is required";

		setError(newError);
		if (Object.keys(newError).length === 0) {
			if (isEditing) {
				setAppliances(
					appliances.map((appliance) =>
						appliance.appliance_uid === currentApplRow.appliance_uid ? currentApplRow : appliance
					)
				);
			} else {
				setAppliances([...appliances, { ...currentApplRow, appliance_uid: uuidv4() }]);
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
        console.log("Error fetching lists data");
      }
      const responseJson = await response.json();
      const applnCategories = responseJson.result.filter(res => res.list_category === "appliances");
      setApplianceCategories(applnCategories);
    } catch (error) {
      console.log(error);
    }
  }

  const applnColumns = [
    { field: 'appliance_uid', headerName: 'UID', width: 80 },
    { field: 'appliance_type', headerName: 'Appliance', width: 80 },
    { field: 'appliance_desc', headerName: 'Description', width: 80 },
    { field: 'appliance_manufacturer', headerName: 'Manufacturer', width: 80 },
    { field: 'appliance_purchased_from', headerName: 'Purchased From', width: 80 },
    { field: 'appliance_purchased', headerName: 'Purchased On', width: 80 },
    { field: 'appliance_purchase_order', headerName: 'Purchase Order Number', width: 80 },
    { field: 'appliance_installed', headerName: 'Installed On', width: 80 },
    { field: 'appliance_serial_num', headerName: 'Serial Number', width: 80 },
    { field: 'appliance_model_num', headerName: 'Model Number', width: 80 },
    { field: 'appliance_warranty_till', headerName: 'Warranty Till', width: 80 },
    { field: 'appliance_warranty_info', headerName: 'Warranty Info', width: 80 },
    { field: 'appliance_url', headerName: 'URLs', width: 80 },
    { field: 'appliance_images', headerName: 'Images', width: 80 },
    { field: 'appliance_documents', headerName: 'Documents', width: 80 },
    {
      field: 'actions',
      headerName: 'Actions',
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
      )
    }
  ];

	return (
		<Paper
			style={{
				marginTop: '10px',
				backgroundColor: theme.palette.primary.main,
				width: '100%', // Occupy full width with 25px margins on each side
			}}
		>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Box
				sx={{
					flexDirection: 'column', // Added this to stack children vertically
					justifyContent: 'center',
					width: '100%', // Take up full screen width
					height: '100%',
				}}
			>
				<Grid container sx={{ marginTop: '15px', alignItems: 'center', justifyContent: 'center' }}>
					<Grid item md={1} xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={handlePreviousCard} disabled={currentIndex == 0}>
							{currentIndex === 0 ? (
								<ArrowBackIcon
									sx={{ color: '#A0A0A0', width: '25px', height: '25px', margin: '0px' }}
								/>
							) : (
								<ArrowBackIcon
									sx={{ color: '#000000', width: '25px', height: '25px', margin: '0px' }}
								/>
							)}
						</Button>
					</Grid>
					<Grid
						item
						md={8}
						xs={8}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography
							sx={{
								color: theme.typography.primary.black,
								fontWeight: theme.typography.primary.fontWeight,
								fontSize: theme.typography.largeFont,
								textAlign: 'center',
							}}
							paddingBottom="10px"
						>
							{property.property_address} {property.property_unit}, {property.property_city}{' '}
							{property.property_state} {property.property_zip}
						</Typography>
						<Typography
							sx={{
								color: '#3D5CAC',
								fontWeight: theme.typography.propertyPage.fontWeight,
								fontSize: '16px',
								textAlign: 'center',
							}}
						>
							{currentIndex + 1} of {propertyData.length} Properties
						</Typography>
					</Grid>
					<Grid item md={1} xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={handleNextCard} disabled={currentIndex == propertyData.length - 1}>
							{currentIndex == propertyData.length - 1 ? (
								<ArrowForwardIcon
									sx={{ color: '#A0A0A0', width: '25px', height: '25px', margin: '0px' }}
								/>
							) : (
								<ArrowForwardIcon
									sx={{ color: '#000000', width: '25px', height: '25px', margin: '0px' }}
								/>
							)}
						</Button>
					</Grid>
				</Grid>

				<Box
					sx={{
						alignItems: 'center',
						justifyContent: 'center',
						margin: '10px',
					}}
				>
					<Grid container rowSpacing={4} columnSpacing={4} justify="space-between" alignItems="stretch">
						<Grid item xs={12} md={12}>
							<Card
								sx={{
									backgroundColor: color,
									boxShadow: 'none',
									elevation: '0',
									padding: '16px',
								}}
							>
								<Grid container spacing={2}>
									<Grid item xs={12} md={3}>
										<Card
											sx={{
												backgroundColor: color,
												boxShadow: 'none',
												elevation: '0',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												height: '100%', // Ensure card takes full height of its container
											}}
										>
											<CardContent
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
													width: '100%',
													height: '100%',
													padding: '0 !important',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'center',
														justifyContent: 'space-between',
														height: '200px',
														width: '100%',
													}}
												>
													<CardMedia
														component="img"
														image={images[activeStep]}
														sx={{
															elevation: '0',
															boxShadow: 'none',
															flexGrow: 1,
															objectFit: 'fill',
															width: '100%',
															height: '100px',
														}}
													/>
													<MobileStepper
														steps={maxSteps}
														position="static"
														activeStep={activeStep}
														variant="text"
														sx={{
															backgroundColor: color,
															width: '100%',
															justifyContent: 'center',
															alignContent: 'center',
															alignItems: 'center',
															elevation: '0',
															boxShadow: 'none',
														}}
														nextButton={
															<Button
																size="small"
																onClick={handleNext}
																disabled={activeStep === maxSteps - 1}
																sx={{ minWidth: '40px', width: '40px' }}
															>
																{theme.direction === 'rtl' ? (
																	<KeyboardArrowLeft />
																) : (
																	<KeyboardArrowRight />
																)}
															</Button>
														}
														backButton={
															<Button
																size="small"
																onClick={handleBack}
																disabled={activeStep === 0}
																sx={{ minWidth: '40px', width: '40px' }}
															>
																{theme.direction === 'rtl' ? (
																	<KeyboardArrowRight />
																) : (
																	<KeyboardArrowLeft />
																)}
															</Button>
														}
													/>
												</Box>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={0} md={0.5} />
									<Grid item xs={12} md={5}>
										<Grid container spacing={2} sx={{ height: '100%' }}>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.secondary.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													Type
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													{property.property_type}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.secondary.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													Sqft
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													{property.property_area}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.secondary.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													Bedrooms
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													{property.property_num_beds}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.secondary.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													Bathrooms
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
														textAlign: 'left',
													}}
												>
													{property.property_num_baths}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
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
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
													}}
												>
													${property.property_value}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													sx={{
														textTransform: 'none',
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
														textTransform: 'none',
														color: theme.typography.primary.black,
														fontWeight: theme.typography.light.fontWeight,
														fontSize: theme.typography.smallFont,
													}}
												>
													${(property.property_value / property.property_area).toFixed(2)}
												</Typography>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={12} md={3.5}>
										<Grid container spacing={2}>
											<Grid item xs={12}>
												{property.property_available_to_rent === 1 ? (
													// padding extra on the bottom
													<Box sx ={{ pb: 40}}>
														<Button
															variant="outlined"
															sx={{
																background: '#3D5CAC',
																backgroundColor: theme.palette.success.main,
																cursor: 'pointer',
																textTransform: 'none',
																minWidth: '150px', // Fixed width for the button
																minHeight: '35px',
																width: '100%',
																'&:hover': {
																	backgroundColor: theme.palette.success.dark,
																},
															}}
															size="small"
														>
															<CheckIcon sx={{ color: '#FFFFFF', fontSize: '18px' }} />
															<Typography
																sx={{
																	textTransform: 'none',
																	color: '#FFFFFF',
																	fontWeight: theme.typography.secondary.fontWeight,
																	fontSize: theme.typography.smallFont,
																	whiteSpace: 'nowrap',
																	marginLeft: '1%', // Adjusting margin for icon and text
																}}
															>
																{'Listed For Rent'}
															</Typography>
														</Button>
													</Box>
												) : (
													<Box>
														<Button
															variant="outlined"
															sx={{
																background: '#3D5CAC',
																backgroundColor: theme.palette.priority.high,
																cursor: 'pointer',
																textTransform: 'none',
																minWidth: '150px', // Fixed width for the button
																minHeight: '35px',
																width: '100%',
															}}
															size="small"
														>
															<CloseIcon sx={{ color: '#FFFFFF', fontSize: '18px' }} />
															<Typography
																sx={{
																	textTransform: 'none',
																	color: '#FFFFFF',
																	fontWeight: theme.typography.secondary.fontWeight,
																	fontSize: theme.typography.smallFont,
																	whiteSpace: 'nowrap',
																	marginLeft: '1%', // Adjusting margin for icon and text
																}}
															>
																{'Not Listed'}
															</Typography>
														</Button>
													</Box>
												)}
											</Grid>
											<Grid item xs={12}>
												<Box>
													<Button
														variant="outlined"
														sx={{
															background: '#3D5CAC',
															color: theme.palette.background.default,
															cursor: 'pointer',
															textTransform: 'none',
															minWidth: '150px', // Fixed width for the button
															minHeight: '35px',
															width: '100%',
														}}
														size="small"
														onClick={() => {
															navigate('/editProperty', {
																state: {
                                                                    currentId,
																	property,
																	index: currentIndex,
																	propertyList: propertyData,
																	page: 'edit_property',
																	isDesktop,
																	allRentStatus,
																	rawPropertyData,
																},
															});
														}}
													>
														<PostAddIcon sx={{ color: '#FFFFFF', fontSize: '18px' }} />
														<Typography
															sx={{
																textTransform: 'none',
																color: '#FFFFFF',
																fontWeight: theme.typography.secondary.fontWeight,
																fontSize: theme.typography.smallFont,
																whiteSpace: 'nowrap',
																marginLeft: '1%', // Adjusting margin for icon and text
															}}
														>
															{'Edit Property'}
														</Typography>
													</Button>
												</Box>
											</Grid>
											{selectedRole === 'MANAGER' && property.property_available_to_rent !== 1 && (
												<Grid item xs={12}>
													<Button
														variant="outlined"
														sx={{
															background: '#3D5CAC',
															color: theme.palette.background.default,
															cursor: 'pointer',
															textTransform: 'none',
															minWidth: '150px',
															minHeight: '35px',
															width: '100%',
														}}
														size="small"
														onClick={() => {
															navigate('/editProperty', {
																state: {
																	currentId,
																	property,
																	index: currentIndex,
																	propertyList: propertyData,
																	page: 'add_listing',
																	isDesktop,
																	allRentStatus,
																	rawPropertyData,
																},
															});
														}}
													>
														<PostAddIcon
															sx={{ color: '#FFFFFF', fontSize: '18px', margin: '5px' }}
														/>
														<Typography
															sx={{
																textTransform: 'none',
																color: '#FFFFFF',
																fontWeight: theme.typography.secondary.fontWeight,
																fontSize: theme.typography.smallFont,
															}}
														>
															{'Create Listing'}
														</Typography>
													</Button>
												</Grid>
											)}
											{selectedRole === 'MANAGER' && property.property_available_to_rent === 1 && (
												<Grid item xs={12}>
													<Button
														variant="outlined"
														sx={{
															background: '#3D5CAC',
															color: theme.palette.background.default,
															cursor: 'pointer',
															textTransform: 'none',
															minWidth: '150px',
															minHeight: '35px',
															width: '100%',
														}}
														size="small"
														onClick={() => {
															navigate('/editProperty', {
																state: {
																	currentId,
																	property,
																	index: currentIndex,
																	propertyList: propertyData,
																	page: 'edit_listing',
																	isDesktop,
																	allRentStatus,
																	rawPropertyData,
																},
															});
														}}
													>
														<PostAddIcon
															sx={{ color: '#FFFFFF', fontSize: '18px', margin: '5px' }}
														/>
														<Typography
															sx={{
																textTransform: 'none',
																color: '#FFFFFF',
																fontWeight: theme.typography.secondary.fontWeight,
																fontSize: theme.typography.smallFont,
																whiteSpace: 'nowrap',
																marginLeft: '1%', // Adjusting margin for icon and text
															}}
														>
															{'Edit Listing'}
														</Typography>
													</Button>
												</Grid>
											)}
										</Grid>
									</Grid>
								</Grid>
							</Card>
						</Grid>

						{/* Lease Detais grid */}
						{/* Left component */}
						<Grid item xs={12} md={6}>
							<Card sx={{ backgroundColor: color, height: '100%' }}>
							<Box
								sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: '10px',
								}}
							>
								<Typography
								sx={{
									color: theme.typography.primary.black,
									fontWeight: theme.typography.primary.fontWeight,
									fontSize: theme.typography.largeFont,
									textAlign: 'center',
								}}
								>
								Lease Details
								</Typography>
								{property?.lease_uid && (
								<Button
									sx={{
									padding: '0px',
									'&:hover': {
										backgroundColor: theme.palette.form.main,
									},
									}}
									className=".MuiButton-icon"
									onClick={() =>
									navigate('/viewLease', {
										state: {
										lease_id: property.lease_uid,
										index: currentIndex,
										isDesktop: isDesktop,
										},
									})
									}
								>
									<img src={LeaseIcon} />
								</Button>
								)}
							</Box>
							<CardContent
								sx={{
								flexDirection: 'column',
								alignItems: 'left',
								justifyContent: 'left',
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
									{property.property_listed_rent
										? '$' + property.property_listed_rent
										: 'No Rent Listed'}
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
									{rentFee ? rentFee.available_topay + ' days in advance' : '-'}
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
									{rentFee ? rentFee.frequency : '-'}
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
									{property.lease_end ? property.lease_end : 'No Lease'}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography
									sx={{
										textTransform: 'none',
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
										textTransform: 'none',
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
									{rentFee ? rentFee.due_by : 'No Due Date Listed'}
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
									{rentFee ? rentFee.late_fee : '-'}
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
									{rentFee ? rentFee.perDay_late_fee : '-'}
									</Typography>
								</Grid>
								</Grid>	
							</CardContent>
							</Card>
						</Grid>

						{/* Right component */}
						<Grid item xs={12} md={6}>
						<Card sx={{ backgroundColor: color, height: '100%' }}>
							<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: '10px',
							}}
							>
							<Typography
								sx={{
								color: theme.typography.primary.black,
								fontWeight: theme.typography.primary.fontWeight,
								fontSize: theme.typography.largeFont,
								textAlign: 'center',
								}}
							>
								Management Details
							</Typography>
							{property?.lease_uid && (
								<Button
								sx={{
									padding: '0px',
									'&:hover': {
									backgroundColor: theme.palette.form.main,
									},
								}}
								className=".MuiButton-icon"
								onClick={() =>
									navigate('/viewLease', {
									state: {
										lease_id: property.lease_uid,
										index: currentIndex,
										isDesktop: isDesktop,
									},
									})
								}
								>
								<img src={LeaseIcon} />
								</Button>
							)}
							</Box>
							<CardContent
							sx={{
								flexDirection: 'column',
								alignItems: 'left',
								justifyContent: 'left',
							}}
							>
							<Grid container spacing={2}>
							{selectedRole === 'OWNER' && (
								<Grid container item spacing={2}>
									<Grid item xs={6}>
										<Typography
										sx={{
											textTransform: 'none',
											color: theme.typography.primary.black,
											fontWeight: theme.typography.secondary.fontWeight,
											fontSize: theme.typography.smallFont,
											paddingRight: '15px',
										}}
										>
										Property Manager:
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
										>
										<Typography
											sx={{
											textTransform: 'none',
											color: theme.typography.primary.black,
											fontWeight: theme.typography.light.fontWeight,
											fontSize: theme.typography.smallFont,
											}}
										>
											{property.business_uid
											? `${property.business_name}`
											: 'No Manager Selected'}
										</Typography>
										<KeyboardArrowRightIcon
											sx={{
											color: theme.typography.common.blue,
											cursor: 'pointer',
											}}
											onClick={() => handleManagerChange(currentIndex)}
										/>
										</Box>
									</Grid>
								</Grid>
								)}
							{selectedRole === 'MANAGER' && (
									<Grid container item spacing={2}>
									<Grid item xs={6}>
										<Typography
										sx={{
											textTransform: 'none',
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
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										onClick={() =>
											navigate('/ownerContactDetailsHappinessMatrix', {
											state: {
												ownerUID: property.owner_uid,
												navigatingFrom: 'PropertyNavigator',
												index: index,
												happinessData: happinessData,
												happinessMatrixData: dataforhappiness,
											},
											})
										}
										>
										<Typography
											sx={{
											textTransform: 'none',
											color: theme.typography.primary.black,
											fontWeight: theme.typography.light.fontWeight,
											fontSize: theme.typography.smallFont,
											}}
										>
											{`${property.owner_first_name}  ${property.owner_last_name}`}
										</Typography>
										<KeyboardArrowRightIcon
											sx={{
											color: theme.typography.common.blue,
											cursor: 'pointer',
											}}
										/>
										</Box>
									</Grid>
									</Grid>
								)}

								<Grid container item spacing={2}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Typography
									sx={{
										textTransform: 'none',
										color: theme.typography.primary.black,
										fontWeight: theme.typography.secondary.fontWeight,
										fontSize: theme.typography.smallFont,
										paddingRight: '50px',
									}}
									>
									Open Maintenance Tickets:
									</Typography>
									<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() => {
										if (property.maintenanceCount > 0) {
										if (selectedRole === 'OWNER') {
											navigate('/ownerMaintenance', {
											state: {
												propertyId: propertyId,
												fromProperty: true,
												index: currentIndex,
											},
											});
										} else {
											navigate('/managerMaintenance', {
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
										badgeContent={property.maintenanceCount}
										showZero
										color="error"
										sx={{
										paddingRight: '10px',
										}}
									/>
									</Box>
								</Box>
								</Grid>
								{contractsData && contractsData.length > 0 && selectedRole !== 'MANAGER' ? (
								<>
									<Grid item xs={10.7} md={10.7}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Typography
										sx={{
											textTransform: 'none',
											color: theme.typography.primary.black,
											fontWeight: theme.typography.secondary.fontWeight,
											fontSize: theme.typography.smallFont,
											paddingRight: '85px', // here padding
										}}
										>
										PM Quotes Requested:
										</Typography>
										<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										>
										<Badge
											color="success"
											badgeContent={contractsNewSent}
											showZero
										/>
										</Box>
									</Box>
									</Grid>
									<Grid item xs={1.3} md={1.3}>
									<Box
										sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: '0px 0px 0px 8px',
										}}
									>
										<KeyboardArrowRightIcon
										sx={{ color: arrowButton1_color, cursor: 'pointer' }}
										onClick={() => {
											navigate('/pmQuotesRequested', {
											state: {
												index: currentIndex,
												propertyData: propertyData,
												contracts: contractsData,
												isDesktop: isDesktop,
											},
											});
										}}
										/>
									</Box>
									</Grid>
								</>
								) : null}
								{property.applications.length > 0 && (
								<>
								<Grid item xs={12} md={12}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Typography
										sx={{
											textTransform: 'none',
											color: theme.typography.primary.black,
											fontWeight: theme.typography.secondary.fontWeight,
											fontSize: theme.typography.smallFont,
											paddingRight: '100px',
										}}
										>
										Applications:
										</Typography>
										<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										>
										<Badge
											color="success"
											badgeContent={
											property.applications.filter(
												(app) =>
												app.lease_status === 'NEW' ||
												app.lease_status === 'PROCESSING'
											).length
											}
											showZero
											sx={{
											paddingRight: '50px',
											}}
										/>
										</Box>
									</Box>
								</Grid>
								<Grid item xs={12} md={12}>
									<Accordion
										theme={theme}
										sx={{ backgroundColor: '#e6e6e6', marginLeft: '-5px' }}
									>
										<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1-content"
										id="panel1-header"
										>
										<Typography
											sx={{
											textTransform: 'none',
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
											display: 'flex',
											flexDirection: 'column',
											padding: '0px 5px 5px 5px',
										}}
										>
										{property.applications.map((app, index) => (
											<Button
											key={index}
											onClick={() => handleAppClick(index)}
											sx={{
												backgroundColor: getAppColor(app),
												color: '#FFFFFF',
												textTransform: 'none',
												width: '100%',
												height: '70px',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												marginBottom: 2,
												'&:hover, &:focus, &:active': {
												backgroundColor: getAppColor(app),
												},
											}}
											>
											<Box sx={{ display: 'flex' }}>
												<Typography
												sx={{
													fontSize: theme.typography.smallFont,
													mr: 1,
												}}
												>
												{app.tenant_first_name +
													' ' +
													app.tenant_last_name +
													' '}
												</Typography>
												<Typography
												sx={{
													fontWeight: 'bold',
													fontSize: theme.typography.smallFont,
													mr: 1,
												}}
												>
												{app.lease_status + ' '}
												</Typography>
												<Typography
												sx={{
													fontWeight: 'bold',
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
						</Grid>

						{/* Rent history grid */}
						<Grid item xs={12} sx={{ pt: '10px' }}>
						<Card sx={{backgroundColor: color, height: '100%' }}>
							<Typography
							sx={{
								color: theme.typography.primary.black,
								fontWeight: theme.typography.primary.fontWeight,
								fontSize: theme.typography.largeFont,
								textAlign: 'center',
								marginTop: '10px',
							}}
							>
							Rent History
							</Typography>
							<CardContent
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-around',
								width: '100%',
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
								'& .MuiDataGrid-cell': {
									justifyContent: 'center',
									alignItems: 'center',
								},
								'& .MuiDataGrid-columnHeader': {
									justifyContent: 'center',
									alignItems: 'center',
									color: '#3D5CAC',
									textAlign: 'center',
								},
								'& .MuiDataGrid-columnHeaderTitle': {
									textAlign: 'center',
									font: 'bold',
									width: '100%',
								},
								'& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' },
								'@media (max-width: 600px)': {
									'& .MuiDataGrid-columnHeaderTitle': {
									width: '100%',
									margin: '0px',
									padding: '0px',
									},
								},
								}}
							/>
							</CardContent>
						</Card>
						</Grid>

            <Grid item xs={12} md={12} sx={{ pt: '10px' }}>
              <Card sx={{backgroundColor: color, height: "100%" }}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0px 15px 0px 10px" }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.primary.fontWeight,
                          fontSize: theme.typography.largeFont,
                          textAlign: "center",
                          marginTop: '10px',
                        }}
                      >
                        Appliances
                      </Typography>
                    </Box>
                    <Button variant="outlined"
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
                      size="small"
                      onClick={() => {
                        setcurrentApplRow({
                          appliance_uid: '', appliance_url: '',
                          appliance_type: '', appliance_desc:'', appliance_images: '', appliance_available: 0, appliance_installed: null,
                          appliance_model_num: '', appliance_purchased: null, appliance_serial_num: '',
                          appliance_property_id: { propertyId }, appliance_manufacturer: '',
                          appliance_warranty_info: '', appliance_warranty_till: null,
                          appliance_purchase_order: '', appliance_purchased_from: ''
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
                    sx={{fontSize:"10px",
                      '& .wrap-text': {
                        whiteSpace: 'normal !important',
                        wordWrap: 'break-word !important',
                        overflow: 'visible !important',
                      },
                    }}
                  />
                  <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                      Please fill in all required fields.
                    </Alert>
                  </Snackbar>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Appliance' : 'Add New Appliance'}</DialogTitle>
                    <DialogContent>
                      <FormControl margin="dense" fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                        <InputLabel required>Appliance Type</InputLabel>
                        <Select
                          margin="dense"
                          label="Appliance Type"
                          fullWidth
                          required
                          variant="outlined"
                          value={currentApplRow?.appliance_type || ''}
                          onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_type: e.target.value })}
                        >
                          {applianceCategories && applianceCategories.map((appln) => (
                            <MenuItem key={appln.list_uid} value={appln.list_item}>
                              {appln.list_item}
                            </MenuItem>
                          ))}

                        </Select>
                      </FormControl>
                      <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_desc || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_desc: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Manufacturer Name"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_manufacturer || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_manufacturer: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Purchased From"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_purchased_from || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_purchased_from: e.target.value })}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Purchased On"
                          value={currentApplRow?.appliance_purchased ? dayjs(currentApplRow.appliance_purchased) : null}
                          onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_purchased: e.target.value })}
                          textField={(params) => (
                            <TextField
                              {...params}
                              margin="dense"
                              fullWidth
                              size="small"
                              variant="outlined"
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '14px',
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: '20px',
                                },
                              }}
                            />
                          )}
                          sx={{ marginTop: "10px", width: "535px" }}
                        />
                      </LocalizationProvider>
                      <TextField
                        margin="dense"
                        label="Purchase Order Number"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_purchase_order || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_purchase_order: e.target.value })}
                      />

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Installed On"
                          value={currentApplRow?.appliance_installed ? dayjs(currentApplRow.appliance_installed) : null}
                          onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_installed: e.target.value })}
                          textField={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '14px',
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: '20px',
                                },
                              }}
                            />
                          )}
                          sx={{ marginTop: "10px", width: "535px" }}
                        />
                      </LocalizationProvider>

                      <TextField
                        margin="dense"
                        label="Serial Number"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_serial_num || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_serial_num: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Model Number"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_model_num || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_model_num: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Warranty Info"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_warranty_info || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_warranty_info: e.target.value })}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Warranty Till"
                          value={currentApplRow?.appliance_warranty_till ? dayjs(currentApplRow.appliance_warranty_till) : null}
                          onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_warranty_till: e.target.value })}
                          textField={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '14px',
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: '20px',
                                },
                              }}
                            />
                          )}
                          sx={{ marginTop: "10px", width: "535px" }}
                        />
                      </LocalizationProvider>
                      <TextField
                        margin="dense"
                        label="URLs"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_url || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_url: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Images"
                        fullWidth
                        variant="outlined"
                        value={currentApplRow?.appliance_images || ''}
                        onChange={(e) => setcurrentApplRow({ ...currentApplRow, appliance_images: e.target.value })}
                      />
                    </DialogContent>
                    <DialogActions sx={{ alignContent: "center", justifyContent: "center" }}>
                      <Button variant="outlined"
                        sx={{
                          background: "#3D5CAC",
                          color: theme.palette.background.default,
                          cursor: "pointer",
                          textTransform: "none",
                          width: "30%",
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                        size="small" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button variant="outlined"
                        sx={{
                          background: "#3D5CAC",
                          color: theme.palette.background.default,
                          cursor: "pointer",
                          textTransform: "none",
                          width: "30%",
                          fontWeight: theme.typography.secondary.fontWeight,
                          fontSize: theme.typography.smallFont,
                        }}
                        size="small"
                        onClick={handleAddAppln}>
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Card>
            </Grid>
        </Box>
      </Box>
    </Paper>
  );
}

function Contract(props) {
	const textStyle = {
		textTransform: 'none',
		color: theme.typography.propertyPage.color,
		fontWeight: theme.typography.light.fontWeight,
		fontSize: theme.typography.smallFont,
	};

	let contract = props.contract;

	return (
		<Typography sx={textStyle}>
			{contract.contract_business_id} {contract.business_name} {contract.contract_uid}{' '}
		</Typography>
	);
}
