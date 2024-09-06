import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Typography,
	Box,
	Stack,
	Paper,
	Button,
	ThemeProvider,
	TextField,
	MenuItem,
	Select,
	Grid,
	Checkbox,
	FormControlLabel,
	CardMedia,
	InputAdornment,
	Radio,
	Menu,
} from '@mui/material';
import theme from '../../theme/theme';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
// import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageUploader from '../ImageUploader';
// import dataURItoBlob from '../utils/dataURItoBlob';
// import defaultHouseImage from './defaultHouseImage.png';
// import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useUser } from '../../contexts/UserContext';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import { Assessment } from '@mui/icons-material';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getLatLongFromAddress } from '../../utils/geocode';
import AddressAutocompleteInput from './AddressAutocompleteInput';
import { useCookies } from 'react-cookie';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import APIConfig from '../../utils/APIConfig';
// import PropertyNavigator from './PropertyNavigator';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function EditProperty(props) {
	// console.log("In Edit Property");
	const { state } = useLocation();
	let navigate = useNavigate();
	const { getProfileId } = useUser();
	// const propertyData = location.state.item
	// const propertyId = location.state.propertyId;

	// Check with Laysa
	// replaced with line below
	// let { index, propertyList, page, isDesktop, allRentStatus,rawPropertyData } = state || editPropertyState;
	let { index, propertyList, setPropertyList, page, isDesktop, allRentStatus, rawPropertyData, onBackClick, } = props;

	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const [isReturnDisabled, setIsReturnDisabled] = useState(false);
	const [saveButtonText, setSaveButtonText] = useState('Save and Return to Dashboard');

	const [cookies, setCookie] = useCookies(['default_form_vals']);
	const cookiesData = cookies['default_form_vals'];

	const [propertyData, setPropertyData] = useState(propertyList[index]);
	// console.log("Property propertyData---", propertyData)
	// console.log("Property Data in Edit Property", propertyData);
	const { user, selectedRole, selectRole, Name } = useUser();
	const [showSpinner, setShowSpinner] = useState(false);
	const [ownerId, setOwnerId] = useState(getProfileId());
	const us_states = [
		'AL',
		'AK',
		'AZ',
		'AR',
		'CA',
		'CO',
		'CT',
		'DE',
		'FL',
		'GA',
		'HI',
		'ID',
		'IL',
		'IN',
		'IA',
		'KS',
		'KY',
		'LA',
		'ME',
		'MD',
		'MA',
		'MI',
		'MN',
		'MS',
		'MO',
		'MT',
		'NE',
		'NV',
		'NH',
		'NJ',
		'NM',
		'NY',
		'NC',
		'ND',
		'OH',
		'OK',
		'OR',
		'PA',
		'RI',
		'SC',
		'SD',
		'TN',
		'TX',
		'UT',
		'VT',
		'VA',
		'WA',
		'WV',
		'WI',
		'WY',
	];
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [propertyState, setPropertyState] = useState('');
	const [zip, setZip] = useState('');
	const [propertyType, setPropertyType] = useState('');
	const [squareFootage, setSquareFootage] = useState('');
	const [bedrooms, setBedrooms] = useState('');
	const [bathrooms, setBathrooms] = useState('');
	const [isListed, setListed] = useState(false);
	const [activeDate, setActiveDate] = useState(null);
	const [description, setDescription] = useState('');
	const [selectedImageList, setSelectedImageList] = useState('');
	const [imageState, setImageState] = useState([]);
	const [deletedImageList, setDeletedImageList] = useState([]);
	const [favImage, setFavImage] = useState('');
	const [activeStep, setActiveStep] = useState(0);
	const [maxSteps, setMaxSteps] = useState(0);
	const [notes, setNotes] = useState('');
	const [unit, setUnit] = useState('');
	const [propertyValue, setPropertyValue] = useState('');
	const [assessmentYear, setAssessmentYear] = useState('');
	const [deposit, setDeposit] = useState('');
	const [listedRent, setListedRent] = useState('');
	const [petsAllowed, setPetsAllowed] = useState(false);
	const [depositForRent, setDepositForRent] = useState(false);
	const [taxes, setTaxes] = useState('');
	const [mortgages, setMortgages] = useState('');
	const [insurance, setInsurance] = useState('');
	const [communityAmenities, setCommunityAmenities] = useState('');
	const [unitAmenities, setUnitAmenities] = useState('');
	const [nearbyAmenities, setNearbyAmenities] = useState('');
	// const [page, setPage] = useState("Edit");
	const [initialData, setInitialData] = useState({});

	const [initaddress, setInitAddress] = useState('');
	const [initcity, setInitCity] = useState('');
	const [initpropertyState, setInitPropertyState] = useState('');
	const [initzip, setInitZip] = useState('');
	const [initpropertyType, setInitPropertyType] = useState('');
	const [initsquareFootage, setInitSquareFootage] = useState('');
	const [initbedrooms, setInitBedrooms] = useState('');
	const [initbathrooms, setInitBathrooms] = useState('');
	const [initisListed, setInitListed] = useState(false);
	const [initnotes, setInitNotes] = useState('');
	const [initunit, setInitUnit] = useState('');
	const [initpropertyValue, setInitPropertyValue] = useState('');
	const [initassessmentYear, setInitAssessmentYear] = useState('');
	const [initselectedImageList, setInitSelectedImageList] = useState('');
	const [initfavImage, setInitFavImage] = useState('');

	const [hasChanges, setHasChanges] = useState(false);
	const [imagesTobeDeleted, setImagesTobeDeleted] = useState([]);
	const [deletedIcons, setDeletedIcons] = useState(
		propertyData?.property_images? new Array(JSON.parse(propertyData.property_images).length).fill(false) : []
	);
	const [favoriteIcons, setFavoriteIcons] = useState(
		propertyData?.property_images? JSON.parse(propertyData.property_images).map(image => image === propertyData.property_favorite_image) : []
  );

//   useEffect(() => {
// 	console.log("assessmentYear - ", assessmentYear);
//   }, [assessmentYear]);
  

	useEffect(() => {
		const property = propertyList[index];
		setInitialData(property);
		console.log('Intial data', initialData);
		setPropertyData(property);
		setAddress(property.property_address);
		setInitAddress(property.property_address);
		setCity(property.property_city);
		setInitCity(property.property_city);
		setPropertyState(property.property_state);
		setInitPropertyState(property.property_state);
		setZip(property.property_zip);
		setInitZip(property.property_zip);
		setPropertyType(property.property_type);
		setInitPropertyType(property.property_type);
		setSquareFootage(property.property_area);
		setInitSquareFootage(property.property_area);
		setBedrooms(property.property_num_beds);
		setInitBedrooms(property.property_num_beds);
		setBathrooms(property.property_num_baths);
		setInitBathrooms(property.property_num_baths);
		setListed(property.property_available_to_rent === 1 ? true : false);
		setInitListed(property.property_available_to_rent === 1 ? true : false);
		setActiveDate(property.property_active_date);
		setDescription(property.property_description);
		setSelectedImageList(JSON.parse(property.property_images));
		setInitSelectedImageList(JSON.parse(property.property_images));
		setFavImage(property.property_favorite_image);
		setInitFavImage(property.property_favorite_image);
		setMaxSteps(selectedImageList?.length);
		setNotes(property.property_notes);
		setInitNotes(property.property_notes);
		setUnit(property.property_unit);
		setInitUnit(property.property_unit);
		setPropertyValue(property.property_value);
		setInitPropertyValue(property.property_value);
		setAssessmentYear(property.property_value_year);
		setInitAssessmentYear(property.property_value_year);
		setDeposit(property.property_deposit);
		setListedRent(property.property_listed_rent);
		setPetsAllowed(property.property_pets_allowed === 1 ? true : false);
		setDepositForRent(property.property_deposit_for_rent === 1 ? true : false);
		setTaxes(property.property_taxes);
		setMortgages(property.property_mortgages);
		setInsurance(property.property_insurance);
		setCommunityAmenities(property.property_amenities_community);
		setUnitAmenities(property.property_amenities_unit);
		setNearbyAmenities(property.property_amenities_nearby);
	}, [index]);

	const getChangedFields = () => {
		const changes = {};
		// if (bedrooms === initialData.property_num_beds) {
		//   console.log("Nothing has changed");
		// }
		if (bedrooms !== initialData.property_num_beds) changes.property_num_beds = bedrooms;
		if (address !== initialData.property_address) changes.property_address = address;
		if (city !== initialData.property_city) changes.property_city = city;
		if (propertyState !== initialData.property_state) changes.property_state = propertyState;
		if (zip !== initialData.property_zip) changes.property_zip = zip;
		if (propertyType !== initialData.property_type) changes.property_type = propertyType;
		if (squareFootage !== initialData.property_area) changes.property_area = squareFootage;
		if (bathrooms !== initialData.property_num_baths) changes.property_num_baths = bathrooms;
		if (isListed !== (initialData.property_available_to_rent === 1))
			changes.property_available_to_rent = isListed ? 1 : 0;
		if (description !== initialData.property_description) changes.property_description = description;
		if (notes !== initialData.property_notes) changes.property_notes = notes;
		if (unit !== initialData.property_unit) changes.property_unit = unit;
		if (propertyValue !== initialData.property_value) changes.property_value = propertyValue;
		if (assessmentYear !== initialData.property_value_year) changes.property_value_year = assessmentYear;
		if (deposit !== initialData.property_deposit) changes.property_deposit = deposit;
		if (listedRent !== initialData.property_listed_rent) changes.property_listed_rent = listedRent;
		if (petsAllowed !== (initialData.property_pets_allowed === 1))
			changes.property_pets_allowed = petsAllowed ? 1 : 0;
		if (depositForRent !== (initialData.property_deposit_for_rent === 1))
			changes.property_deposit_for_rent = depositForRent ? 1 : 0;
		if (taxes !== initialData.property_taxes) changes.property_taxes = taxes;
		if (mortgages !== initialData.property_mortgages) changes.property_mortgages = mortgages;
		if (insurance !== initialData.property_insurance) changes.property_insurance = insurance;
		if (communityAmenities !== initialData.property_amenities_community)
			changes.property_amenities_community = communityAmenities;
		if (unitAmenities !== initialData.property_amenities_unit) changes.property_amenities_unit = unitAmenities;
		if (nearbyAmenities !== initialData.property_amenities_nearby)
			changes.property_amenities_nearby = nearbyAmenities;		
		if (favImage !== initialData.property_favorite_image) changes.property_favorite_image = favImage;
		
		console.log("changes - ", changes);

		return changes;
	};

	useEffect(() => {
		const hasImageChanges = imageState.length > 0 || deletedImageList.length > 0 || favImage !== propertyData.property_favorite_image;
		const otherChanges = Object.keys(getChangedFields()).length > 0;
	  
		const hasUnsavedChanges = hasImageChanges || otherChanges;

		// Update states based on unsaved changes
		setHasChanges(hasUnsavedChanges);
		setIsSaveDisabled(!hasUnsavedChanges);
		setIsReturnDisabled(false);
		setSaveButtonText(hasUnsavedChanges? 'Save and Return to Dashboard' : 'Return to Dashboard');
	}, [imageState, deletedImageList, favImage, address, city, propertyState, zip, propertyType, squareFootage, bedrooms, bathrooms, isListed, description, notes, unit, propertyValue, assessmentYear, deposit, listedRent, depositForRent]);
	

	// useEffect(() => {
	// 	console.log('Size of selectedImageList:', selectedImageList.length);
	// 	console.log('Contents of selectedImageList:', selectedImageList);
	// }, [selectedImageList]);

	const handleUnitChange = (event) => {
		console.log('handleUnitChange', event.target.value);
		setUnit(event.target.value);
	};

	const handleBackButton = (e) => {
		console.log('close clicked');
		e.preventDefault();
		onBackClick();
	};

	const handleListedChange = (event) => {
		setListed(event.target.checked);
	};

	const handleSubmit = async (event, hasChanges) => {
		event.preventDefault();
		console.log('handleSubmit');

		// setIsSaveDisabled(true);
		// setSaveButtonText('Return to Dashboard');

		// if (stayOnPage) {
		// 	setSavedClicked(true);
		// }

		if (!hasChanges) {
			navigateBackToDashboard();
			return;
		}

		const changedFields = getChangedFields();
		if (Object.keys(changedFields).length === 0 && imageState.length === 0 && imagesTobeDeleted.length === 0) {
			setHasChanges(false);
			console.log('No changes detected.');
			return;
		}

		setIsSaveDisabled(true);
		setSaveButtonText('Return to Dashboard');
		setIsReturnDisabled(false);

		const formData = new FormData();

		for (const [key, value] of Object.entries(changedFields)) {
			formData.append(key, value);
		}

		const currentDate = new Date();
		// const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
		const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
			currentDate.getDate()
		).padStart(2, '0')}-${currentDate.getFullYear()}`;

		const promises = [];
		const promises_added = []; // debug

		const fullAddress = `${address}, ${city}, ${propertyState}, ${zip}`;

		const coordinates = await getLatLongFromAddress(fullAddress);

		console.log('EditProperty - handleSubmit - coordinates - ', coordinates);

		if (propertyData.property_uid) {
			formData.append('property_uid', propertyData.property_uid);
		}

		if (changedFields.property_address && coordinates) {
			formData.append('property_latitude', coordinates.latitude);
			formData.append('property_longitude', coordinates.longitude);
		}
    if (imagesTobeDeleted.length > 0) {
  
      let updatedImages = JSON.parse(propertyData.property_images);
      updatedImages = updatedImages.filter(image => !imagesTobeDeleted.includes(image));
      propertyData.property_images = JSON.stringify(updatedImages);
      formData.append('delete_images', JSON.stringify(imagesTobeDeleted));
    }
		//console.log("--debug selectedImageList--", selectedImageList, selectedImageList.length);
		formData.append('property_images', propertyData.property_images);
    	formData.append('property_favorite_image', favImage);
		// const files = imageState;
		let i = 0;
		for (const file of imageState) {
			// let key = file.coverPhoto ? "img_cover" : `img_${i++}`;
			let key = `img_${i++}`;
			if (file.file !== null) {
				// newProperty[key] = file.file;
				formData.append(key, file.file);
			} else {
				// newProperty[key] = file.image;
				formData.append(key, file.image);
			 }
			if (file.coverPhoto) {
				formData.set('property_favorite_image', key);
			}
		}

    //console.log('---FavImage----', favImage);

		if (deletedImageList.length > 0) {
			formData.append('deleted_images', JSON.stringify(deletedImageList));
		}

		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		const putData = async () => {
			setShowSpinner(true);
			promises.push(
				// fetch(`http://localhost:4000/properties`, {
				fetch(`${APIConfig.baseURL.dev}/properties`, {
					method: 'PUT',
					body: formData,
				})
			);
			// promises_added.push("putData");
			setShowSpinner(false);
			setImageState([])

			// navigate("/propertyDetail", { state: { index, propertyList }});
		};

		const autoUpdate = async () => {
			const updateResponse = await fetch(
				`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${propertyData.property_uid}`
			);
	
			const updatedJson = await updateResponse.json();
			const updatedProperty = updatedJson.Property.result[0];
			const newPropertyList = propertyList.map((property) => {
				if (property.property_uid === updatedProperty.property_uid) {
					return { ...property, ...updatedProperty }
				} else {
					return property;
				}
			});
	
			setPropertyData(newPropertyList[index]);
			setPropertyList(newPropertyList);
	
			// Reset the image delete/favorite icons after update
			setDeletedIcons(new Array(JSON.parse(updatedProperty.property_images).length).fill(false));
			setFavoriteIcons(JSON.parse(updatedProperty.property_images).map(image => image === updatedProperty.property_favorite_image));
	
			return newPropertyList[index];
		};

		putData();
		try {
			await Promise.all(promises);
			await autoUpdate();
			navigateBackToDashboard();
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const navigateBackToDashboard = () => {
		if (isDesktop) {
			props.setRHS('PropertyNavigator');
			navigate('/propertiesPM', { state: { index, propertyList } });
		} else {
			navigate('/propertiesPM', {
				state: { index, propertyList, allRentStatus, isDesktop, rawPropertyData },
			});
		}
	};


	const isCoverPhoto = (link) => {
		if (link === favImage) {
			return true;
		}
		return false;
	};

	const loadImages = async () => {
		const files = [];
		const images = JSON.parse(propertyData.property_images);
		for (let i = 0; i < images.length; i++) {
			files.push({
				index: i,
				image: images[i],
				file: null,
				coverPhoto: isCoverPhoto(images[i]),
			});
		}
		setImageState(files);
		setActiveStep(files.findIndex((file) => file.coverPhoto));
	};

	const handleAddressSelect = (address) => {
		console.log('handleAddressSelect', address);
		setAddress(address.street ? address.street : '');
		setCity(address.city ? address.city : '');
		setPropertyState(address.state ? address.state : '');
		setZip(address.zip ? address.zip : '');
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
	
		const imageToDelete = JSON.parse(propertyData.property_images)[index];
	
		setImagesTobeDeleted((prev) => {
			let updatedImagesToBeDeleted;
			if (updatedDeletedIcons[index]) {
				updatedImagesToBeDeleted = [...prev, imageToDelete];
			} else {
				// Remove image from the delete list if the delete icon is toggled off
				updatedImagesToBeDeleted = prev.filter(image => image !== imageToDelete);
			}
	
			const hasImageChanges = updatedImagesToBeDeleted.length > 0 || imageState.length > 0 || favImage !== propertyData.property_favorite_image;
			const otherChanges = Object.keys(getChangedFields()).length > 0;
			const hasUnsavedChanges = hasImageChanges || otherChanges;
	
			setHasChanges(hasUnsavedChanges);
			setIsSaveDisabled(!hasUnsavedChanges);
			setIsReturnDisabled(false);
			setSaveButtonText(hasUnsavedChanges ? 'Save and Return to Dashboard' : 'Return to Dashboard');
	
			return updatedImagesToBeDeleted;
		});
	
		console.log('Delete image at index:', JSON.stringify(updatedDeletedIcons));
	};
	

	const handleFavorite = (index) => {
    const updatedFavoriteIcons = new Array(favoriteIcons.length).fill(false);
    updatedFavoriteIcons[index] = true;
    setFavoriteIcons(updatedFavoriteIcons);
  
    const newFavImage = JSON.parse(propertyData.property_images)[index];
    setFavImage(newFavImage);
    setSelectedImageList(prevState =>
      prevState.map((file, i) => ({
        ...file,
        coverPhoto: i === index
      }))
    );
  
    console.log(`Favorite image at index: ${index}`);
	setHasChanges(true);
	setIsSaveDisabled(false);
    setIsReturnDisabled(false);
    setSaveButtonText('Save and Return to Dashboard');
  };

  const handleUpdateFavoriteIcons = () => {
    setFavoriteIcons(new Array(favoriteIcons.length).fill(false));
};
  
	return (
		<ThemeProvider theme={theme}>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Stack
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'center',
					width: '100%',
					minHeight: '100vh',
					paddingBottom: '25px',
				}}
			>
				<Paper
					style={{
						marginTop: '15px',
						backgroundColor: theme.palette.form.main,
						width: '80%', // Adjust width as needed
						padding: '25px',
						boxShadow: theme.shadows[3],
					}}
				>
					<Stack direction="row" justifyContent="center" alignItems="center" position="relative">
						<Box direction="row" justifyContent="center" alignItems="center">
							{page === 'edit_property' && (
								<Typography
									sx={{
										color: theme.typography.primary.black,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.largeFont,
										marginTop: '10px',
									}}
								>
									Edit Property
								</Typography>
							)}
							{page === 'add_listing' && (
								<Typography
									sx={{
										color: theme.typography.primary.black,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.largeFont,
									}}
								>
									Create Listing
								</Typography>
							)}
							{page === 'edit_listing' && (
								<Typography
									sx={{
										color: theme.typography.primary.black,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.largeFont,
									}}
								>
									Edit Listing
								</Typography>
							)}
						</Box>
						<Box position="absolute" right={0}>
							<Button onClick={(e) => handleBackButton(e)}>
								<CloseIcon
									sx={{ color: theme.typography.common.blue, fontSize: '30px', margin: '5px' }}
								/>
							</Button>
						</Box>
					</Stack>

					<Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" id="editPropertyForm">
						<Grid container columnSpacing={12} rowSpacing={6}>
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
												{JSON.parse(propertyData.property_images)?.map((image, index) => (
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
									selectedImageList={imageState}
									setSelectedImageList={setImageState}
									setDeletedImageList={setDeletedImageList}
									page={page}
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
									Address
								</Typography>
								<AddressAutocompleteInput
									onAddressSelect={handleAddressSelect}
									defaultValue={`${address}, ${city}, ${propertyState}`}
									gray={0}
								/>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Unit
								</Typography>
								<TextField
									onChange={(e) => setUnit(e.target.value)}
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									placeholder={unit}
									value={unit}
									size="small"
									fullWidth
								/>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Zip Code
								</Typography>
								<TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									onChange={(e) => setZip(e.target.value)}
									value={zip}
									disabled
								/>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Type
								</Typography>
								<Select
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									fullWidth
									onChange={(e) => setPropertyType(e.target.value)}
									value={propertyType}
								>
									<MenuItem value={'Single Family'}>Single Family</MenuItem>
									<MenuItem value={'Multi Family'}>Multi Family</MenuItem>
									<MenuItem value={'Condo'}>Condo</MenuItem>
									<MenuItem value={'Apartment'}>Apartment</MenuItem>
									<MenuItem value={'Tiny Home'}>Tiny Home</MenuItem>
								</Select>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Square Footage
								</Typography>
								<TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									placeholder={squareFootage}
									onChange={(e) => setSquareFootage(e.target.value)}
									value={squareFootage}
								/>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Bedrooms
								</Typography>
								<TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									placeholder={bedrooms}
									onChange={(e) => setBedrooms(e.target.value)}
									value={bedrooms}
								/>
							</Grid>

							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Bathrooms
								</Typography>
								<TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									placeholder={bathrooms}
									onChange={(e) => setBathrooms(e.target.value)}
									value={bathrooms}
								/>
							</Grid>
							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Property Value
								</Typography>
								<TextField
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
									onChange={(e) => setPropertyValue(e.target.value)}
									value={propertyValue}
								/>
							</Grid>
							<Grid item xs={6}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Assessment Year
								</Typography>
								{/* <TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									onChange={(e) => setAssessmentYear(e.target.value)}
									value={assessmentYear}
								/> */}
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										// label="Year"
										value={assessmentYear ? dayjs(assessmentYear) : null}
										views={['year']}
										format="YYYY"
										maxDate={dayjs(new Date())}
										onChange={(e) => {
											const formattedDate = e ? e.format("YYYY") : null;
											setAssessmentYear(formattedDate)
										}}
										sx={{ 
											backgroundColor: '#FFFFFF',
											width: '100%',
											borderRadius: '3px',
											marginTop: '5px',
											'& .MuiInputBase-input': {
												height: '30px', // Adjust the height here
												padding: '5px 10px', // Adjust padding if needed
											},
										}}
										fullWidth
										InputLabelProps={{
											sx: {
												fontSize: '10px',
												height: '40px',
											},
										}}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12}>
								<Typography
									sx={{
										color: theme.typography.common.blue,
										fontWeight: theme.typography.primary.fontWeight,
										fontSize: theme.typography.mediumFont,
									}}
								>
									Owner Notes
								</Typography>
								<TextField
									fullWidth
									sx={{
										backgroundColor: 'white',
										borderColor: 'black',
										borderRadius: '7px',
									}}
									size="small"
									multiline={true}
									placeholder={notes}
									onChange={(e) => setNotes(e.target.value)}
									value={notes}
								/>
							</Grid>
							<Grid item xs={12}>
								{page === 'add_listing' || page === 'edit_listing' ? (
									<Stack direction="column" justifyContent="left" padding="15px" width="85%">
										<FormControlLabel
											control={<Checkbox checked={isListed} onChange={handleListedChange} />}
											label="Available to rent"
										/>
									</Stack>
								) : (
									<div></div>
								)}
							</Grid>
						</Grid>
					</Box>
				</Paper>

				<Box
				sx={{
					marginBottom: '30px',
					width: '80%',
					paddingBottom: '30px',
				}}
			>
			<Stack direction="row" spacing={6} justifyContent="center" sx={{ marginTop: '20px' }}>
			<Button
				variant="contained"
				sx={{ backgroundColor: theme.typography.formButton.background }}
				onClick={(event) => handleSubmit(event, hasChanges)}
				disabled={false} // The button should always be enabled
			>
				<Typography
				sx={{
					color: '#FFFFFF',
					fontWeight: theme.typography.primary.fontWeight,
					fontSize: theme.typography.mediumFont,
				}}
				>
				{hasChanges ? 'Save and Return to Dashboard' : 'Return to Dashboard'}
				</Typography>
			</Button>
			</Stack>
			</Box>

			</Stack>
		</ThemeProvider>
	);
}

export default EditProperty;
