import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid } from '@mui/material';
import theme from '../../theme/theme';
import maintenanceRequestImage from './maintenanceRequest.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import BuildIcon from '@mui/icons-material/Build';
import CreateIcon from '@mui/icons-material/Create';
import Slider from 'react-slick';
import QuotesTable from './MaintenanceComponents/QuotesTable';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton }from '@mui/material';

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
	console.log('----inside maintainance navigator---', requestIndex, updateRequestIndex);
	const [currentIndex, setCurrentIndex] = useState(requestIndex);

	const [activeStep, setActiveStep] = useState(0);
	const [formattedDate, setFormattedDate] = useState('');
	const [numOpenRequestDays, setNumOpenRequestDays] = useState('');
	const [images, setImages] = useState([maintenanceRequestImage]);
	let [currentTab, setCurrentTab] = useState(currentTabValue);

	const [month, setMonth] = useState(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const navigate = useNavigate();

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
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
				let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;

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
				let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;
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
		// console.log("display quote info", JSON.parse(data.quote_info))
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
			// setFormattedTime(formattedTime)
			// setFormattedDate(dayjs(data.maintenance_scheduled_date, "MM-DD-YYYY"));
			return `Scheduled for ${data.maintenance_scheduled_date} ${formattedTime}`;
		}
	}

	function displayEarliestAvailableDate(data) {
		console.log('maintenance quotes in maintenanceRequestNavigator', maintenanceQuotes);
		if (data) {
			console.log(data);
		}
	}
	console.log('This is the requestData passed to Quotes Table: ', requestData);
	console.log('This is the currentIndex to Quotes Table: ', currentIndex);
	const data = requestData[currentIndex];
	console.log('This is the data passed to Quotes Table: ', data);

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
	// console.log("propertyAddress",typeof(propertyAddress))

	let estimatedCost = ' ';
	estimatedCost = estimatedCost.concat(
		' ',
		data?.maintenance_estimated_cost ? data?.maintenance_estimated_cost : 'Not reported'
	);
	// console.log("estimatedCost>>",typeof(estimatedCost))

	let completionStatus = 'no';
	if (data?.maintenance_request_status === 'Completed' || data?.maintenance_request_status === 'Closed') {
		// console.log("inside ifffff", data?.maintenance_request_status)
		completionStatus = 'yes';
	} else {
		// console.log(data?.maintenance_request_status)
		completionStatus = 'no';
		// console.log(completionStatus)
	}

    //const images1 = [<BuildIcon />, <BuildIcon />, <BuildIcon />, <BuildIcon />, <BuildIcon />]; // Example images
    
        const [scrollPosition, setScrollPosition] = useState(0);
        const scrollRef = useRef();
      
        const scrollLeft = () => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 200;
            setScrollPosition(scrollRef.current.scrollLeft);
          }
        };
      
        const scrollRight = () => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += 200;
            setScrollPosition(scrollRef.current.scrollLeft);
          }
        };

	useEffect(() => {
		displayScheduledDate(data);
	}, [data]);
	//automatic refresh problem - the data is not displaying after save update
   
	return (
		<div style={{ paddingBottom: '10px' }}>
			<Box
				sx={{
					flexDirection: 'column', // Added this to stack children vertically
					justifyContent: 'center',
					width: '100%', // Take up full screen width
					marginTop: theme.spacing(2), // Set the margin to 20px
					// backgroundColor: '#3D5CAC80',
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
						{/* {item.status} */}
						{<u>
										{data?.property_address}{' '}
										{data?.property_unit !== '' ? 'Unit ' + data?.property_unit : null},{' '}
										{data?.property_city} {data?.property_state} {data?.property_zip}
									</u>}
					</Typography>
					<Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
						<Button onClick={handlePreviousCard} disabled={backward_active_status}>
							<ArrowBackIcon sx={{ color: '#160449' }}/>
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
							<ArrowForwardIcon sx={{ color: '#160449' }}/>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    <IconButton onClick={scrollLeft} disabled={scrollPosition === 0}>
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
                      <ImageList sx={{ display: 'flex', flexWrap: 'nowrap' }} cols={4}>
                        {images.map((image, index) => (
                          <ImageListItem key={index} sx={{ width: 'auto', flex: '0 0 auto' }}>
                            <img src={image} alt={`maintenance-${index}`} style={{ maxHeight: '150px', maxWidth: '150px', objectFit: 'contain' }} />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                    <IconButton onClick={scrollRight}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
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
											color: '#FFFFFF',
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
												data.maintenance_priority,
												completionStatus,
												data.maintenance_request_uid,
												data.maintenance_property_id
											)
										}
									/>
								</Stack>
								<Typography sx={maintenanceSecondary}>
									<u>
										{data?.property_address}{' '}
										{data?.property_unit !== '' ? 'Unit ' + data?.property_unit : null},{' '}
										{data?.property_city} {data?.property_state} {data?.property_zip}
									</u>
								</Typography>
								<Typography sx={maintenanceSecondary}>
									Estimated Cost:{' '}
									{data?.maintenance_estimated_cost
										? '$' + data?.maintenance_estimated_cost
										: 'Not reported'}
								</Typography>
								<Typography sx={maintenanceSecondary}>
									Reported: {formattedDate} | Open: {numOpenRequestDays} days
								</Typography>
								<Typography sx={maintenanceSecondary}>{displayEarliestAvailableDate(data)}</Typography>
								<Typography sx={maintenanceSecondary}>{displayScheduledDate(data)}</Typography>
								<Typography sx={maintenanceTertiary}>{data?.maintenance_desc}</Typography>
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
