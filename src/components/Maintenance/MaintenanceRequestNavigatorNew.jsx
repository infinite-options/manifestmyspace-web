import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardContent,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	OutlinedInput,
	Typography,
	Button,
	Box,
	Stack,
	Grid,
} from '@mui/material';
import theme from '../../theme/theme';
import maintenanceRequestImage from './maintenanceRequest.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import QuotesTable from './MaintenanceComponents/QuotesTable';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import APIConfig from '../../utils/APIConfig';

function getInitialImages(requestData, currentIndex) {
	try {
		if (
			requestData[currentIndex] &&
			requestData[currentIndex].maintenance_images &&
			requestData[currentIndex].maintenance_images !== '[]'
		) {
			const parsedData = JSON.parse(requestData[currentIndex].maintenance_images);
			return parsedData;
		}
	} catch (error) {
		console.error('Error parsing maintenance_images:', error);
	}
	return [maintenanceRequestImage];
}

export default function MaintenanceRequestNavigatorNew({
	requestIndex,
	backward_active_status,
	forward_active_status,
	updateRequestIndex,
	requestData,
	color,
	item,
	allData,
	maintenanceQuotes,
	currentTabValue,
	status,
	tabs,
	navigateParams,
}) {
	//console.log('----inside maintainance navigator---', maintenanceQuotes);
	const [currentIndex, setCurrentIndex] = useState(requestIndex);

	const [activeStep, setActiveStep] = useState(0);
	const [formattedDate, setFormattedDate] = useState('');
	const [numOpenRequestDays, setNumOpenRequestDays] = useState('');
	const [images, setImages] = useState([maintenanceRequestImage]);
	let [currentTab, setCurrentTab] = useState(currentTabValue);

	const [month, setMonth] = useState(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [priorities, setPriorities] = useState(
		requestData.map((request) => request.maintenance_priority || 'Medium')
	);

	const maintenancePrimary = {
		color: '#FFFFFF',
		fontWeight: 900,
		fontSize: '24px',
		paddingBottom: '5px',
	};

	const maintenanceSecondary = {
		color: '#FFFFFF',
		fontWeight: 600,
		fontSize: '20px',
		paddingBottom: '0px',
	};

	const maintenanceTertiary = {
		color: '#FFFFFF',
		fontWeight: 300,
		fontSize: '18px',
		paddingBottom: '0px',
	};

	function navigateToEditMaintenanceItem(
		testIssue,
		testProperty,
		testIssueItem,
		testCost,
		testTitle,
		testPriority,
		completionStatus,
		requestUid,
		propID
	) {
		if (isMobile) {
			navigate('/editMaintenanceItem', {
				state: {
					testIssue,
					testProperty,
					testIssueItem,
					testCost,
					testTitle,
					testPriority,
					completionStatus,
					requestUid,
					propID,
					month,
					year,
				},
			});
		} else {
			// Setting properties into sessionStorage
			sessionStorage.setItem('testIssue', testIssue);
			sessionStorage.setItem('testProperty', testProperty);
			sessionStorage.setItem('testIssueItem', testIssueItem);
			sessionStorage.setItem('testCost', testCost);
			sessionStorage.setItem('testTitle', testTitle);
			sessionStorage.setItem('testPriority', testPriority);
			sessionStorage.setItem('completionStatus', completionStatus);
			sessionStorage.setItem('requestUid', requestUid);
			sessionStorage.setItem('propID', propID);
			sessionStorage.setItem('month', month);
			sessionStorage.setItem('year', year);
			sessionStorage.setItem('editMaintenanceView', true);
			sessionStorage.setItem('selectedRequestIndex', requestIndex);
			sessionStorage.setItem('selectedStatus', status);
			window.dispatchEvent(new Event('storage'));
			setTimeout(() => {
				window.dispatchEvent(new Event('maintenanceRequestSelected'));
			}, 0);
		}
	}

	useEffect(() => {
		setCurrentIndex(requestIndex);
	}, [requestIndex]);

	useEffect(() => {
		const initialImages = getInitialImages(requestData, currentIndex);
		setImages(initialImages);
		setActiveStep(0);

		if (requestData[currentIndex] && requestData[currentIndex].maintenance_request_created_date !== 'null') {
			let formattedDate = dayjs(requestData[currentIndex].maintenance_request_created_date).format('MM-DD-YYYY');
			setFormattedDate(formattedDate);
			const today = dayjs();
			let diff = today.diff(formattedDate, 'day');
			setNumOpenRequestDays(diff);
		} else {
			setFormattedDate('N/A');
			setNumOpenRequestDays('N/A');
		}
	}, [currentIndex]);

	const maxSteps = images.length;

	const handleNextCard = () => {
		setCurrentIndex((prevIndex) => {
			let newIndex = prevIndex + 1;
			if (prevIndex < requestData.length - 1) {
				updateRequestIndex(newIndex, { changeTab: 'noChange' });
				return newIndex;
			} else {
				updateRequestIndex(newIndex, { changeTab: 'forward' });
				return newIndex;
			}
		});
	};

	const handlePreviousCard = () => {
		setCurrentIndex((prevIndex) => {
			let newIndex = prevIndex - 1;
			if (prevIndex > 0) {
				updateRequestIndex(newIndex, { changeTab: 'noChange' });
				return newIndex;
			} else {
				if (newIndex === -1) {
					newIndex = 1;
				}
				updateRequestIndex(newIndex, { changeTab: 'backward' });
				return newIndex;
			}
		});
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	function displayScheduledDate(data) {

		console.log('displayScheduledDate from this one:', data);
		if (data.maintenance_request_closed_date) {
			return data.maintenance_request_closed_date !== 'null'
				? `Closed: ${data.maintenance_request_closed_date}`
				: `Closed: `;
		}
		if (
			!data.maintenance_scheduled_date ||
			!data.maintenance_scheduled_time ||
			data.maintenance_scheduled_time === 'null' ||
			data.maintenance_scheduled_date === 'null'
		) {
			return 'Not Scheduled';
		} else {
			const formattedTime = dayjs(data.maintenance_scheduled_time, 'HH:mm').format('h:mm A');
			return `Scheduled for ${data.maintenance_scheduled_date} ${formattedTime}`;
		}
	}
	const data = requestData[currentIndex];

	let propertyAddress = ' ';
	propertyAddress = propertyAddress.concat(
		' ',
		data?.property_address,
		' ',
		data?.property_unit,
		' ',
		data?.property_city,
		' ',
		data?.property_state,
		' ',
		data?.property_zip
	);

	let estimatedCost = ' ';
	estimatedCost = estimatedCost.concat(
		' ',
		data?.maintenance_estimated_cost ? data?.maintenance_estimated_cost : 'Not reported'
	);

	let completionStatus = 'no';
	if (data?.maintenance_request_status === 'Completed' || data?.maintenance_request_status === 'Closed') {
		completionStatus = 'yes';
	} else {
		completionStatus = 'no';
	}

	const [scrollPosition, setScrollPosition] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollPosition;
		}
	}, [scrollPosition]);

	const handleScroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 200;
			const currentScrollPosition = scrollRef.current.scrollLeft;

			if (direction === 'left') {
				const newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
				scrollRef.current.scrollLeft = newScrollPosition;
			} else {
				const newScrollPosition = currentScrollPosition + scrollAmount;
				scrollRef.current.scrollLeft = newScrollPosition;
			}
		}
	};

	const tenantName = `${data?.tenant_first_name ? data?.tenant_first_name : ''} ${
		data?.tenant_last_name ? data?.tenant_last_name : ''
	}`.trim();

	const priorityOptions = ['Low', 'Medium', 'High'];

	const handlePriorityChange = async (event) => {
		const newPriority = event.target.value;
		const updatedPriorities = [...priorities];
		updatedPriorities[currentIndex] = newPriority;
		setPriorities(updatedPriorities);

		try {
			const editFormData = new FormData();

			editFormData.append('maintenance_request_uid', data?.maintenance_request_uid);
			editFormData.append('maintenance_priority', newPriority);

			const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
				method: 'PUT',
				body: editFormData,
			});
			const priorityData = await response.json();
			console.log('data response handlePriorityChange', priorityData);
			window.location.reload();
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'Low':
				return '#FFC614'; // Yellow
			case 'Medium':
				return '#FF8A00'; // Orange
			case 'High':
				return '#A52A2A'; // Red
			default:
				return '#FF9800'; // Default color
		}
	};
	useEffect(() => {
		displayScheduledDate(data);
	}, [data]);

	return (
		<div style={{ paddingBottom: '10px' }}>
			<Box
				sx={{
					flexDirection: 'column',
					justifyContent: 'center',
					width: '100%',
					marginTop: theme.spacing(2),
					backgroundColor: theme.palette.primary.main,
					borderRadius: '10px',
				}}
			>
				<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
					<Typography
						sx={{
							color: '#160449',
							fontWeight: theme.typography.secondary.fontWeight,
							fontSize: theme.typography.largeFont,
						}}
					>
						{
							<u>
								{data?.property_address}{' '}
								{data?.property_unit !== '' ? 'Unit ' + data?.property_unit : null},{' '}
								{data?.property_city} {data?.property_state} {data?.property_zip}
							</u>
						}
					</Typography>
					<Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
						<Button onClick={handlePreviousCard} disabled={backward_active_status}>
							<ArrowBackIcon sx={{ color: '#160449' }} />
						</Button>
						<Stack direction="column" justifyContent="center" alignItems="center" spacing={2} width="100px">
							<Typography
								sx={{
									color: '#160449',
									fontWeight: theme.typography.secondary.fontWeight,
									fontSize: theme.typography.largeFont,
								}}
							>
								{currentIndex + 1} of {requestData.length}
							</Typography>
						</Stack>
						<Button onClick={handleNextCard} disabled={forward_active_status}>
							<ArrowForwardIcon sx={{ color: '#160449' }} />
						</Button>
					</Stack>
				</Stack>
				<Stack alignItems="center" justifyContent="center" sx={{ paddingBottom: '0px' }}>
					<Card
						sx={{
							backgroundColor: theme.palette.primary.main,
							boxShadow: 'none',
							elevation: '0',
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '0px',
						}}
					>
						<CardContent
							sx={{
								flexDirection: 'column',
								alignItems: 'left',
								justifyContent: 'left',
								width: '100%',
								padding: '0px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: 2,
									position: 'relative',
								}}
							>
								<IconButton
									onClick={() => handleScroll('left')}
									disabled={scrollRef.current?.scrollLeft === 0}
								>
									<ArrowBackIosIcon />
								</IconButton>
								<Box
									ref={scrollRef}
									sx={{
										display: 'flex',
										overflowX: 'auto',
										scrollbarWidth: 'none',
										msOverflowStyle: 'none',
										'&::-webkit-scrollbar': {
											display: 'none',
										},
									}}
								>
									<ImageList sx={{ display: 'flex', flexWrap: 'nowrap' }} cols={5}>
										{images.map((image, index) => (
											<ImageListItem
												key={index}
												sx={{
													width: 'auto',
													flex: '0 0 auto',
													border: '1px solid #ccc',
													margin: '0 2px',
												}}
											>
												<img
													src={image}
													alt={`maintenance-${index}`}
													style={{ height: '150px', width: '150px', objectFit: 'cover' }}
												/>
											</ImageListItem>
										))}
									</ImageList>
								</Box>
								<IconButton onClick={() => handleScroll('right')}>
									<ArrowForwardIosIcon />
								</IconButton>
							</Box>
						</CardContent>
						<CardContent
							sx={{
								flexDirection: 'column',
								alignItems: 'left',
								justifyContent: 'left',
								width: '100%',
								padding: '0px',
							}}
						>
							<Box style={{ alignContent: 'left', justifyContent: 'left', alignItems: 'left' }}>
								<Stack direction="row">
									<CreateIcon
										sx={{
											color: '#160449',
											marginLeft: 'auto',
											fontSize: '18px',
											padding: '15px',
										}}
										onClick={() =>
											navigateToEditMaintenanceItem(
												data?.maintenance_desc,
												data?.property_address,
												data?.maintenance_request_type,
												estimatedCost,
												data.maintenance_title,
												priorities[currentIndex], // Use local state here
												completionStatus,
												data.maintenance_request_uid,
												data.maintenance_property_id
											)
										}
									/>
								</Stack>

								<Box
									sx={{
										padding: 2,
										backgroundColor: theme.palette.primary.main,
										borderRadius: '10px',
										marginTop: 2,
										color: '#2D2F48',
									}}
								>
									<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
										<strong style={{ minWidth: '150px' }}>Issue:</strong> {data?.maintenance_title}
									</Typography>
									<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 5 }}>
										<strong style={{ minWidth: '150px' }}>Description:</strong> {data?.maintenance_desc}
									</Typography>
									<Typography
										variant="body1"
										sx={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
									>
										<strong style={{ minWidth: '150px' }}>Priority:</strong>
										<FormControl
											variant="outlined"
											sx={{
												marginLeft: 1,
												minWidth: 80,
												backgroundColor: '#FF9800',
												borderRadius: 1,
											}}
										>
											<Select
												value={priorities[currentIndex]} // Use local state here
												onChange={handlePriorityChange}
												input={
													<OutlinedInput
														sx={{
															padding: '4px 8px',
															color: 'white',
															'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
														}}
													/>
												}
												sx={{
													height: '32px',
													backgroundColor: getPriorityColor(priorities[currentIndex]),
													color: 'white',
													borderRadius: '5px',
													minWidth: '80px',
													'& .MuiSelect-icon': {
														color: 'white',
													},
													'& .MuiOutlinedInput-notchedOutline': {
														border: 'none',
													},
												}}
											>
												{priorityOptions.map((option) => (
													<MenuItem key={option} value={option}>
														{option}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Typography>
									<Grid container spacing={2} sx={{ marginTop: 1 }}>
										<Grid item xs={6}>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 5 }}>
												<strong style={{ minWidth: '150px' }}>Reported By:</strong> {data?.maintenance_request_created_by}
											</Typography>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 5 }}>
												<strong style={{ minWidth: '150px' }}>Tenant:</strong> {tenantName}
											</Typography>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 1 }}>
												<strong style={{ minWidth: '150px' }}>Owner:</strong>{' '}
												{data?.owner_first_name + ' ' + data?.owner_last_name}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 5 }}>
												<strong style={{ minWidth: '150px' }}>Reported On:</strong>{' '}
												{dayjs(data?.maintenance_request_created_date).format('MM-DD-YYYY')}
											</Typography>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 5 }}>
												<strong style={{ minWidth: '150px' }}>Days Open:</strong>{' '}
												{dayjs().diff(dayjs(data?.maintenance_request_created_date), 'day')}{' '}
												days
											</Typography>
											<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center',marginBottom: 1 }}>
												<strong style={{ minWidth: '150px' }}>Maintenance ID:</strong> {data?.maintenance_request_uid}
											</Typography>
										</Grid>
									</Grid>
								</Box>
								
								<Grid container sx={{ padding: '0px' }}>
									<QuotesTable
										maintenanceItem={data}
										navigateParams={navigateParams}
										maintenanceQuotesForItem={maintenanceQuotes}
									/>
								</Grid>
							</Box>
						</CardContent>
					</Card>
				</Stack>
			</Box>
		</div>
	);
}
