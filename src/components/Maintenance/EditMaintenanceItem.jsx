import {
	Typography,
	Box,
	Stack,
	Paper,
	Button,
	ThemeProvider,
	Form,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Grid,
	Input,
	Container,
	Radio,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	UploadFile,
	InputAdornment,
} from '@mui/material';

import { darken } from '@mui/system';

import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageUploader from '../ImageUploader';

import theme from '../../theme/theme';
import dataURItoBlob from '../utils/dataURItoBlob';
import { useUser } from '../../contexts/UserContext';
import { get } from '../utils/api';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from '@mui/material';
import APIConfig from '../../utils/APIConfig';

import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function EditMaintenanceItem() {
	const location = useLocation();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	let testIssue1, testProperty1, testIssueItem1, testCost1;
    let testTitle1, testPriority1, completionStatus1;
    let requestUid1, propID1, maintainanceImages, maintainanceFavImage;

	if (isMobile) {
		testIssue1 = location.state.testIssue;
		testProperty1 = location.state.testProperty;
		testIssueItem1 = location.state.testIssueItem;
		testCost1 = location.state.testCost;
		testTitle1 = location.state.testTitle;
	    testPriority1 = location.state.testPriority;
        completionStatus1 = location.state.completionStatus;
        requestUid1 = location.state.requestUid;
        propID1 = location.state.propID;
	} else {
		testIssue1 = sessionStorage.getItem('testIssue');
		testProperty1 = sessionStorage.getItem('testProperty');
		testIssueItem1 = sessionStorage.getItem('testIssueItem');
		testCost1 = sessionStorage.getItem('testCost');
		testTitle1 = sessionStorage.getItem('testTitle');
		testPriority1 = sessionStorage.getItem('testPriority');
		completionStatus1 = sessionStorage.getItem('completionStatus');
		requestUid1 = sessionStorage.getItem('requestUid');
		propID1 = sessionStorage.getItem('propID');

		maintainanceImages = sessionStorage.getItem('maintainanceImages');
		maintainanceFavImage = sessionStorage.getItem('maintainanceFavImage');
		console.log('---maintainanceImages---', maintainanceImages);
		console.log('---maintainanceFavImage---', maintainanceFavImage);
	}

	// setCost(testCost1);
	// cost = testCost1;
	// setTitle(location.state.testTitle);
	// title = testTitle1;

	// setPriority(testPriority1);

	// setCompleted(completionStatus1);
	// console.log("completed>>>",completed);


	let navigate = useNavigate();
	const { user, getProfileId, maintenanceRoutingBasedOnSelectedRole } = useUser();
	const [propertyId, setPropertyId] = useState(propID1);
	const [properties, setProperties] = useState([]);
	const [property, setProperty] = useState(testProperty1);
	const [issue, setIssue] = useState(testIssueItem1);
	const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
	const [toggleAlignment, setToggleAlignment] = useState('low');
	const [priority, setPriority] = useState(testPriority1);
	const [completed, setCompleted] = useState('');
	const [cost, setCost] = useState(testCost1);
	const [title, setTitle] = useState(testTitle1);
	const [description, setDescription] = useState(testIssue1);
	const [selectedImageList, setSelectedImageList] = useState([]);
	const [showSpinner, setShowSpinner] = useState(false);

	const [deletedImageList, setDeletedImageList] = useState([]);
	const [favImage, setFavImage] = useState(maintainanceFavImage);

	const profileId = getProfileId();

	const [imagesTobeDeleted, setImagesTobeDeleted] = useState([]);
	const [deletedIcons, setDeletedIcons] = useState(
		new Array(JSON.parse(maintainanceImages).length).fill(false)
	);
	const [favoriteIcons, setFavoriteIcons] = useState(
    JSON.parse(maintainanceImages).map(image => image === maintainanceFavImage)
  );

	const handlePropertyChange = (event) => {
		console.log('handlePropertyChange', event.target.value);
		setProperty(event.target.value);
		setPropertyId(event.target.value);
	};

	const handleIssueChange = (event) => {
		console.log('handleIssueCategoryChange', event.target.value);
		setIssue(event.target.value);
	};

	const handleCostChange = (event) => {
		console.log('handleCostChange', event.target.value);
		setCost(event.target.value);
	};

	const handleTitleChange = (event) => {
		console.log('handleTitleChange', event.target.value);
		setTitle(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		console.log('handleDescriptionChange', event.target.value);
		setDescription(event.target.value);
	};

	// const handlePriorityChange = (event, newToggleGroupValue) => {
	//     console.log("handlePriorityChange", event.target.value)
	//     // console.log("handleToggleGroupChange", newToggleGsroupValue)
	//     setPriority(event.target.value)
	//     // setPriority(testPriority1)
	//     // setToggleGroupValue(newToggleGroupValue);
	//     // setToggleAlignment(newToggleGroupValue);
	// };
	const handlePriorityChange = (priority) => {
		setToggleAlignment(priority);
		setToggleGroupValue(priority);
		setPriority(priority);

		// Update styles for all toggle buttons based on the selected priority
		const buttons = document.querySelectorAll('.MuiToggleButton-root');
		buttons.forEach((button) => {
			const buttonPriority = button.getAttribute('value');

			if (buttonPriority === priority) {
				// Set white border for the selected button
				button.style.borderColor = 'white';
			} else {
				// Reset border color for other buttons
				button.style.borderColor = '';
			}
		});
	};

	const handleCompletedChange = (event, newToggleGroupValue) => {
		console.log('handleToggleGroupChange', newToggleGroupValue);
		setCompleted(event.target.value);
		console.log('completed>>>,>>', completed);
	};

	const handleBackButton = () => {
		console.log('handleBackButton');
		if(isMobile){navigate(-1);
        } else {
            sessionStorage.removeItem('testIssue');
			sessionStorage.removeItem('testProperty');
			sessionStorage.removeItem('testIssueItem');
			sessionStorage.removeItem('testCost');
			sessionStorage.removeItem('testTitle');
			sessionStorage.removeItem('testPriority');
			sessionStorage.removeItem('completionStatus');
			sessionStorage.removeItem('requestUid');
			sessionStorage.removeItem('propID');
			sessionStorage.removeItem('month');
			sessionStorage.removeItem('year');
			sessionStorage.removeItem('editMaintenanceView');
			sessionStorage.removeItem('maintainanceImages');
		sessionStorage.removeItem('maintainanceFavImage');

			window.dispatchEvent(new Event('storage'));
			// Dispatch the custom event
            setTimeout(() => {
				window.dispatchEvent(new Event('maintenanceRequestSelected'));
			}, 0);
			setTimeout(() => {
				window.dispatchEvent(new Event('maintenanceUpdate'));
			}, 0);
        }
	};

	useEffect(() => {
		console.log(user.owner_id);

		const getProperties = async () => {
			setShowSpinner(true);
			const response = await fetch(`${APIConfig.baseURL.dev}/properties/${getProfileId()}`);

			const propertyData = await response.json();
			console.log('inside edit property useEffect');
			// const propertyData = data.Property.result
			console.log('properties', propertyData);
			// setProperties(properties)
			setProperties([...propertyData['Property'].result]);
			setShowSpinner(false);
		};

		getProperties();
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();

		const editFormData = new FormData();

		const currentDate = new Date();
		// const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
		const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
			currentDate.getDate()
		).padStart(2, '0')}-${currentDate.getFullYear()}`;

		console.log('toggleAlignment', toggleAlignment);
		console.log('*************propertyId******************* ', propertyId);
		console.log('*************description******************* ', description);
		editFormData.append('maintenance_request_uid', requestUid1);
		editFormData.append('maintenance_property_id', propertyId);
		// editFormData.append("maintenance_property_id", propID1);
		editFormData.append('maintenance_title', title);
		editFormData.append('maintenance_desc', description);
		editFormData.append('maintenance_request_type', issue);
		editFormData.append('maintenance_request_created_by', getProfileId()); // problem is here it was 600-000003, changed it 600-000012
		editFormData.append('maintenance_priority', priority);
		editFormData.append('maintenance_can_reschedule', 1);
		editFormData.append('maintenance_assigned_business', null);
		editFormData.append('maintenance_assigned_worker', null);
		editFormData.append('maintenance_scheduled_date', null);
		editFormData.append('maintenance_scheduled_time', null);
		editFormData.append('maintenance_frequency', 'One Time');
		editFormData.append('maintenance_notes', null);
		editFormData.append('maintenance_request_created_date', formattedDate); // Convert to ISO string format
		editFormData.append('maintenance_request_closed_date', null);
		editFormData.append('maintenance_request_adjustment_date', null);

		if (imagesTobeDeleted.length > 0) {
			console.log('-----deleted_images----', imagesTobeDeleted);
		
			let updatedImages = JSON.parse(maintainanceImages);
			updatedImages = updatedImages.filter(image => !imagesTobeDeleted.includes(image));
			maintainanceImages = JSON.stringify(updatedImages);
			editFormData.append('delete_images', JSON.stringify(imagesTobeDeleted));
		  }

		  editFormData.append('maintenance_images', maintainanceImages);
		  editFormData.append('maintenance_favorite_image', favImage);
			  
			  let i = 0;
			  for (const file of selectedImageList) {
				  // let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
				  let key = `img_${i++}`;
				  if (file.file !== null) {
					  // newProperty[key] = file.file;
					  editFormData.append(key, file.file);
				  } else {
					  // newProperty[key] = file.image;
					  editFormData.append(key, file.image);
				   }
				  if (file.coverPhoto) {
					editFormData.set('maintenance_favorite_image', key);
				  }
			  }

		// for (let i = 0; i < selectedImageList.length; i++) {
		// 	try {
		// 		let key = i === 0 ? 'img_cover' : `img_${i - 1}`;

		// 		if (selectedImageList[i].startsWith('data:image')) {
		// 			const imageBlob = dataURItoBlob(selectedImageList[i]);
		// 			editFormData.append(key, imageBlob);
		// 		} else {
		// 			editFormData.append(key, selectedImageList[i]);
		// 		}
		// 	} catch (error) {
		// 		console.log('Error uploading images', error);
		// 	}
		// }
		console.log('editFormData>>>>>>');
		for (let [key, value] of editFormData.entries()) {
			console.log(key, value);
		}

		const putData = async () => {
			setShowSpinner(true);
			try {
				const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
					method: 'PUT',
					// headers: {
					//     'Content-Type': 'application/json',
					// },
					// body : JSON.stringify({
					//     "maintenance_property_id" : propertyId,
					//     "maintenance_title": title,
					//     "maintenance_desc": description,
					//     "maintenance_request_type": issue,
					//     "maintenance_request_created_by": getProfileId(),  // problem is here it was 600-000003, changed it 600-000012
					//     "maintenance_priority": priority,
					//     "maintenance_can_reschedule": 1,
					//     "maintenance_assigned_business": null,
					//     "maintenance_assigned_worker": null,
					//     "maintenance_scheduled_date": null,
					//     "maintenance_scheduled_time": null,
					//     "maintenance_frequency": "One Time",
					//     "maintenance_notes": null,
					//     "maintenance_request_created_date": formattedDate, // Convert to ISO string format
					//     "maintenance_request_closed_date": null,
					//     "maintenance_request_adjustment_date": null
					// })
					// body: JSON.stringify(editFormData)
					body: editFormData,
				});
				const data = await response.json();
				console.log('data response', data);
			} catch (err) {
				console.error('Error: ', err.message);
			}
			setShowSpinner(false);
		};
		putData();

		// setSelectedImageList([])
		// setProperty('')
		// setIssue('')
		// setToggleGroupValue('')
		// setToggleAlignment('')
		// setCost('')
		// setTitle('')
		// setDescription('')
		navigate(maintenanceRoutingBasedOnSelectedRole());
		handleBackButton();
	};

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
			setScrollPosition((prevScrollPosition) => {
				const currentScrollPosition = scrollRef.current.scrollLeft;
				let newScrollPosition;
	
				if (direction === 'left') {
					newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
				} else {
					newScrollPosition = currentScrollPosition + scrollAmount;
				}
	
				return newScrollPosition;
			});
		}
	};

	const handleDelete = (index) => {
		const updatedDeletedIcons = [...deletedIcons];
		updatedDeletedIcons[index] = !updatedDeletedIcons[index];
		setDeletedIcons(updatedDeletedIcons);

		const imageToDelete = JSON.parse(maintainanceImages)[index];
		setImagesTobeDeleted((prev) => [...prev, imageToDelete]);

		console.log('Delete image at index:', JSON.stringify(deletedIcons));
	};

	const handleFavorite = (index) => {
    const updatedFavoriteIcons = new Array(favoriteIcons.length).fill(false);
    updatedFavoriteIcons[index] = true;
    setFavoriteIcons(updatedFavoriteIcons);
  
    const newFavImage = JSON.parse(maintainanceImages)[index];
    setFavImage(newFavImage);
    setSelectedImageList(prevState =>
      prevState.map((file, i) => ({
        ...file,
        coverPhoto: i === index
      }))
    );
  
    console.log(`Favorite image at index: ${index}`);
  };

  const handleUpdateFavoriteIcons = () => {
    setFavoriteIcons(new Array(favoriteIcons.length).fill(false));
};

	return (
		<ThemeProvider theme={theme}>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Box
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					width: '100%', // Ensure the box spans the full viewport width
					height: '100vh', // Ensure the box spans the full viewport height
					paddingTop: '30px',
				}}
			>
				<Paper
					style={{
						// margin: '30px',
						padding: theme.spacing(2),
						backgroundColor: theme.palette.form.main,
						width: '85%', // Occupy full width with 25px margins on each side
						[theme.breakpoints.down('sm')]: {
							width: '80%',
						},
						[theme.breakpoints.up('sm')]: {
							width: '50%',
						},
						paddingTop: '10px',
					}}
				>
					<Stack direction="row" justifyContent="center" alignItems="center" position="relative">
						<Box direction="row" justifyContent="center" alignItems="center">
							<Typography
								sx={{
									color: theme.typography.primary.black,
									fontWeight: theme.typography.primary.fontWeight,
									fontSize: theme.typography.largeFont,
								}}
							>
								Edit Maintenance
							</Typography>
						</Box>
						<Box position="absolute" left={0}>
							<Button onClick={() => handleBackButton()}>
								<ArrowBackIcon
									sx={{ color: theme.typography.common.blue, fontSize: '30px', margin: '5px' }}
								/>
							</Button>
						</Box>
					</Stack>
						<Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
							<Grid container columnSpacing={12} rowSpacing={6}>
								{/* Select Field for Property */}
								<Grid item xs={12}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: 2,
									}}
								>
									<IconButton
										onClick={() => handleScroll('left')}
										disabled={scrollPosition === 0}
									>
										<ArrowBackIosIcon />
									</IconButton>
									<Box
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
										<Box
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
											<ImageList 
											ref={scrollRef}
											sx={{ display: 'flex', flexWrap: 'nowrap' }} cols={5}>
												{JSON.parse(maintainanceImages)?.map((image, index) => (
													<ImageListItem
														key={index}
														sx={{
															width: 'auto',
															flex: '0 0 auto',
															border: '1px solid #ccc',
															margin: '0 2px',
															position: 'relative', // Added to position icons
														}}
													>
														<img
															src={image}
															alt={`maintenance-${index}`}
															style={{
																height: '150px',
																width: '150px',
																objectFit: 'cover',
															}}
														/>
														<Box sx={{ position: 'absolute', top: 0, right: 0 }}>
															<IconButton
																onClick={() => handleDelete(index)}
																sx={{
																	color: deletedIcons[index] ? 'red' : 'black',
																	backgroundColor: 'rgba(255, 255, 255, 0.7)',
																	'&:hover': {
																		backgroundColor: 'rgba(255, 255, 255, 0.9)',
																	},
																	margin: '2px',
																}}
															>
																<DeleteIcon />
															</IconButton>
														</Box>
														<Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
															<IconButton
																onClick={() => handleFavorite(index)}
																sx={{
																	color: favoriteIcons[index] ? 'red' : 'black',
																	backgroundColor: 'rgba(255, 255, 255, 0.7)',
																	'&:hover': {
																		backgroundColor: 'rgba(255, 255, 255, 0.9)',
																	},
																	margin: '2px',
																}}
															>
																{favoriteIcons[index] ? (
																	<FavoriteIcon />
																) : (
																	<FavoriteBorderIcon />
																)}
															</IconButton>
														</Box>
													</ImageListItem>
												))}
											</ImageList>
										</Box>
									</Box>
									<IconButton onClick={() => handleScroll('right')}>
										<ArrowForwardIosIcon />
									</IconButton>
								</Box>
							
									

								</Grid>
								
								<Grid item xs={12}>
									<ImageUploader
										selectedImageList={selectedImageList}
										setSelectedImageList={setSelectedImageList}
										page={'QuoteRequestForm'}

									setDeletedImageList={setDeletedImageList}
                  setFavImage={setFavImage}
                  favImage={favImage}
                  updateFavoriteIcons={handleUpdateFavoriteIcons}
									/>
								</Grid>
								<Grid item xs={12}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Property
									</Typography>
									<FormControl
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
										}}
										size="small"
									>
										{/* <Tooltip title={testProperty1} style={{ zIndex: '1' }}>   */}
										<InputLabel hidden={true} shrink={false}>
											{testProperty1}
										</InputLabel>
										<Select
											// value={testProperty1}
											// display={" "}
											// onFocus={true}
											onChange={handlePropertyChange}
											MenuProps={{
												PaperProps: {
													style: {
														maxHeight: '250px', // you can adjust this value as needed
														overflow: 'auto',
													},
												},
											}}
										>
											{properties.map((property) => (
												<MenuItem key={property.property_uid} value={property.property_uid}>
													{property.property_address} {property?.property_unit}
												</MenuItem>
											))}
										</Select>
										{/* </Tooltip> */}
									</FormControl>
								</Grid>


								{/* Select Field for Issue and Cost Estimate */}
								<Grid item xs={6}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Issue
									</Typography>
									<FormControl
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '7px',
										}}
										size="small"
									>
										<InputLabel>{testIssueItem1}</InputLabel>
										<Select onChange={handleIssueChange} defaultValue={testIssueItem1}>
											<MenuItem value={'Plumbing'}>Plumbing</MenuItem>
											<MenuItem value={'Electrical'}>Electrical</MenuItem>
											<MenuItem value={'Appliance'}>Appliance</MenuItem>
											<MenuItem value={'HVAC'}>HVAC</MenuItem>
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={6}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Estimated Cost
									</Typography>
									<TextField
										placeholder={testCost1}
										defaultValue={testCost1}
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '7px',
										}}
										size="small"
										InputProps={{
											startAdornment: <InputAdornment position="start">$</InputAdornment>,
										}}
										onChange={handleCostChange}
									/>
								</Grid>

								{/* Text Field for Title */}
								<Grid item xs={12}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Title
									</Typography>
									<TextField
										placeholder={testTitle1}
										defaultValue={testTitle1}
										onChange={handleTitleChange}
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '7px',
										}}
										size="small"
										fullWidth
									/>
								</Grid>

								{/* Priority Toggle Field */}
								<Grid item xs={12}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Priority
									</Typography>
									<ToggleButtonGroup
										exclusive
										fullWidth
										value={testPriority1}
										// value={toggleAlignment}
										// onChange={handlePriorityChange}
										onChange={(event, value) => handlePriorityChange(value)}
										aria-label="Priority"
										size="small"
										sx={{
											'& .MuiToggleButton-root.Mui-selected': {
												// backgroundColor: 'transparent', // Selected background color
												color: 'white', // Selected text color
											},
											'&.Mui-selected + .MuiToggleButton-root': {
												// borderLeftColor: 'white',
											},
											// display: "grid",
											// gridTemplateColumns: "auto auto auto auto",
											// gridGap: "50px",
											// padding: "10px",
										}}
									>
										<ToggleButton
											// value="Low"
											key={'Low'}
											value={'Low'}
											sx={{
												backgroundColor: theme.palette.priority.low,
												borderRadius: '20px',
												color: 'white',
												marginRight: '10px',
												borderWidth: '3px',
												borderColor: theme.palette.priority.low,
												'&.Mui-selected': {
													borderColor: 'white',
													color: 'white',
													backgroundColor: theme.palette.priority.low,
													borderWidth: '3px', // Ensure consistent border width
												},
												'&:hover': {
													borderColor: 'white',
													backgroundColor: darken(theme.palette.priority.low, 0.3),
												},
											}}
											onClick={() => handlePriorityChange('Low')}
											isSelected={toggleAlignment === 'Low'}
										>
											Low
										</ToggleButton>
										<ToggleButton
											// value="Medium"
											key={'Medium'}
											value={'Medium'}
											sx={{
												backgroundColor: theme.palette.priority.medium,
												borderRadius: '20px',
												color: 'white',
												marginRight: '10px',
												borderWidth: '3px',
												borderColor: theme.palette.priority.medium,
												'&.Mui-selected': {
													borderColor: 'white',
													color: 'white',
													backgroundColor: theme.palette.priority.medium,
													borderWidth: '3px', // Ensure consistent border width
												},
												'&:hover': {
													borderColor: 'white',
													backgroundColor: darken(theme.palette.priority.medium, 0.3),
												},
												'&.Mui-selected + .MuiToggleButton-root': {
													borderLeftColor: 'white',
												},
											}}
											onClick={() => handlePriorityChange('Medium')}
											isSelected={toggleAlignment === 'Medium'}
										>
											Medium
										</ToggleButton>
										<ToggleButton
											key={'High'}
											value={'High'}
											// value="High"
											sx={{
												backgroundColor: theme.palette.priority.high,
												borderRadius: '20px',
												color: 'white',
												marginRight: '10px',
												borderWidth: '3px',
												borderColor: theme.palette.priority.high,
												'&.Mui-selected': {
													borderColor: 'white',
													color: 'white',
													backgroundColor: theme.palette.priority.high,
													borderWidth: '3px', // Ensure consistent border width
												},
												'&:hover': {
													borderColor: 'white',
													backgroundColor: darken(theme.palette.priority.high, 0.3),
												},
												'&.Mui-selected + .MuiToggleButton-root': {
													borderLeftColor: 'white',
												},
											}}
											onClick={() => handlePriorityChange('High')}
											isSelected={toggleAlignment === 'High'}
										>
											High
										</ToggleButton>
									</ToggleButtonGroup>
								</Grid>

								{/* Text Field for Description */}
								<Grid item xs={12}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Description
									</Typography>
									<TextField
										fullWidth
										// label="Description"
										size="small"
										multiline
										placeholder={testIssue1}
										defaultValue={testIssue1}
										onChange={handleDescriptionChange}
										sx={{
											width: '100%',
											backgroundColor: 'white',
										}}
									/>
								</Grid>

								{/* Radio Button for Already Completed */}
								<Grid item xs={12}>
									<Typography
										sx={{
											color: theme.typography.common.blue,
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: theme.typography.mediumFont,
										}}
									>
										Already Completed?
									</Typography>
									<FormControl component="fieldset">
										<RadioGroup
											column
											onChange={handleCompletedChange}
											defaultValue={completionStatus1}
										>
											<FormControlLabel value="yes" control={<Radio />} label="Yes" />
											<FormControlLabel value="no" control={<Radio />} label="No" />
										</RadioGroup>
									</FormControl>
								</Grid>

								{/* File Upload Field */}
								

								{/* Submit Button */}
								<Grid item xs={12}>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										sx={{ backgroundColor: '#9EAED6' }}
									>
										<Typography
											sx={{
												color: theme.typography.common.blue,
												fontWeight: theme.typography.primary.fontWeight,
												fontSize: theme.typography.mediumFont,
											}}
										>
											Save Maintenance
										</Typography>
										<input type="file" hidden />
									</Button>
								</Grid>
							</Grid>
						</Box>
					
				</Paper>
			</Box>
		</ThemeProvider>
	);
}
