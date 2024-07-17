import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Grid,
	Select,
	MenuItem,
	Typography,
	FormControlLabel,
	Checkbox,
	Card,
	CardContent,
	Container,
	Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import MapIcon from '@mui/icons-material/Map';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddressAutocompleteInput from './AddressAutocompleteInput';
import theme from '../../theme/theme';
import { useUser } from '../../contexts/UserContext';
import ImageUploader from '../ImageUploader';

const useStyles = makeStyles({
	card: {
		backgroundColor: '#D6D5DA', // Grey background for card
		padding: '16px',
		borderRadius: '8px', // Rounded corners for card
	},
	cardContent: {
		padding: '16px',
		backgroundColor: '#D6D5DA', // Grey background for card content
		borderRadius: '8px', // Rounded corners for card content
	},
	button: {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '1px dashed #ccc',
		borderRadius: '8px',
		color: '#160449',
		textTransform: 'none', // Ensure text is not transformed to uppercase
	},
	formControl: {
		minWidth: 120,
	},
	appliances: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	buttonPrimary: {
		backgroundColor: '#6a5acd',
		color: '#fff',
		textTransform: 'none', // Ensure text is not transformed to uppercase
		'&:hover': {
			backgroundColor: '#483d8b',
		},
	},
	buttonSecondary: {
		backgroundColor: '#bc8f8f',
		color: '#fff',
		textTransform: 'none', // Ensure text is not transformed to uppercase
		'&:hover': {
			backgroundColor: '#8b7b8b',
		},
	},
	label: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: theme.typography.primary.fontWeight,
		color: '#160449',
		fontSize: 16,
		marginBottom: '8px', // Add space below the label
	},
	inputField: {
		backgroundColor: 'white',
		borderColor: 'black',
		borderRadius: '3px',
		height: '40px', // Consistent height for all text fields
		marginTop: '8px', // Add space above the text field
	},
	autocompleteInput: {
		width: '100%',
		height: '40px', // Consistent height for the autocomplete input
		marginTop: '8px', // Add space above the autocomplete input
	},
	addPicturesButtonContainer: {
		display: 'flex',
		justifyContent: 'center', // Center horizontally
		alignItems: 'center', // Center vertically
	},
});

const PropertyForm = () => {
	const classes = useStyles();
	const { user, selectedRole, selectRole, Name } = useUser();
	//const [readOnlyNotes, setReadOnlyNotes] = useState(selectedRole === "MANAGER" ? true : false);
	const [readOnlyNotes, setReadOnlyNotes] = useState(false);
	const [selectedImageList, setSelectedImageList] = useState([]);

	const [address, setAddress] = useState('');
	const [unit, setUnit] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	const [type, setType] = useState('');
	const [squareFootage, setSquareFootage] = useState('');
	const [bedrooms, setBedrooms] = useState('');
	const [bathrooms, setBathrooms] = useState('');
	const [cost, setCost] = useState('');

	const [notes, setNotes] = useState('');
	const [appliances, setAppliances] = useState([]);

	const handleAddressSelect = (address) => {
		setAddress(address.street ? address.street : '');
		setCity(address.city ? address.city : '');
		setState(address.state ? address.state : '');
		setZip(address.zip ? address.zip : '');
	};

	const handleUnitChange = (event) => {
		setUnit(event.target.value);
	};

	const handleCityChange = (event) => {
		setCity(event.target.value);
	};

	const handleStateChange = (event) => {
		setState(event.target.value);
	};

	const handleZipCodeChange = (event) => {
		setZip(event.target.value);
	};

	const handleTypeChange = (event) => {
		setType(event.target.value);
	};

	const handleSquareFootageChange = (event) => {
		setSquareFootage(event.target.value);
	};

	const handleBedroomsChange = (event) => {
		setBedrooms(event.target.value);
	};

	const handleBathroomsChange = (event) => {
		setBathrooms(event.target.value);
	};

	const handleCostChange = (event) => {
		setCost(event.target.value);
	};

	const handleBackButton = () => {
		navigate(-1);
	};

	return (
		<Container maxWidth="md" style={{ backgroundColor: '#F2F2F2', padding: '16px', borderRadius: '8px' }}>
			<Card sx={{ backgroundColor: '#D6D5DA', marginBottom: '18px', padding: '16px', borderRadius: '8px' }}>
				<CardContent className={classes.cardContent}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={4} className={classes.addPicturesButtonContainer}>
							<Button
								sx={{
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									border: '1px dashed #ccc',
									borderRadius: '8px',
									color: '#160449',
									textTransform: 'none', // Ensure text is not transformed to uppercase
								}}
								fullWidth
								startIcon={<MapIcon />}
							>
								Show Google Map
							</Button>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Grid container spacing={3}>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Address
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<AddressAutocompleteInput
										className={classes.autocompleteInput}
										onAddressSelect={handleAddressSelect}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Unit
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										size="small"
										fullWidth
                                        onChange={handleUnitChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										City
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="City"
                                        onChange={handleCityChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										State
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="State"
                                        onChange={handleStateChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Zip Code
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="Zip Code"
                                        onChange={handleZipCodeChange}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ backgroundColor: '#D6D5DA', marginBottom: '18px', padding: '16px', borderRadius: '8px' }}>
				<CardContent className={classes.cardContent}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={4} className={classes.addPicturesButtonContainer}>
							<ImageUploader
								selectedImageList={selectedImageList}
								setSelectedImageList={setSelectedImageList}
								page={'Add'}
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Grid container spacing={3}>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Type
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<Select
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '7px',
											marginTop: '4px',
										}}
										size="small"
										fullWidth
										onChange={handleTypeChange}
									>
										<MenuItem value={'Single Family'}>Single Family</MenuItem>
										<MenuItem value={'Multi Family'}>Multi Family</MenuItem>
										<MenuItem value={'Condo'}>Condo</MenuItem>
										<MenuItem value={'Apartment'}>Apartment</MenuItem>
										<MenuItem value={'Tiny Home'}>Tiny Home</MenuItem>
									</Select>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										SqFt
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="Enter sqft"
                                        onChange={handleSquareFootageChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Bedrooms
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="# of bedrooms"
                                        onChange={handleBedroomsChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Bathrooms
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="# of bathrooms"
                                        onChange={handleBathroomsChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										Property Value
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<TextField
										size="small"
										fullWidth
										sx={{
											backgroundColor: 'white',
											borderColor: 'black',
											borderRadius: '3px',
											height: '40px', // Consistent height for all text fields
											marginTop: '4px', // Add space above the text field
										}}
										placeholder="$"
                                        onChange={handleCostChange}
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography
										sx={{
											marginTop: '4px',
											color: '#160449',
											fontWeight: theme.typography.primary.fontWeight,
											fontSize: 14,
										}}
									>
										$/SqFt
									</Typography>
								</Grid>
								<Grid item xs={10}>
									<Typography>0</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ backgroundColor: '#D6D5DA', marginBottom: '18px', padding: '16px', borderRadius: '8px' }}>
				<CardContent className={classes.cardContent}>
					<Grid item xs={12}>
						<Typography
							sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 14 }}
						>
							Owner Notes
						</Typography>
						<TextField
							fullWidth
							sx={{
								backgroundColor: readOnlyNotes ? theme.palette.form.main : 'white',
								borderColor: 'black',
								borderRadius: '7px',
								marginTop: '8px',
							}}
							InputProps={{
								readOnly: readOnlyNotes,
							}}
							size="small"
							multiline={true}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography
							sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 14 }}
						>
							Appliances Included
						</Typography>
						<Grid container spacing={0}>
							{[
								'Fridge',
								'Oven/Range',
								'Cooktop',
								'Washer',
								'Dryer',
								'Air Conditioning',
								'Central Heating',
								'Dishwasher',
								'Garbage Disposal',
								'Microwave',
								'Ceiling Fans',
								'Window Coverings',
								'Fireplace',
								'Other',
							].map((appliance, index) => (
								<Grid item xs={6} sm={4} key={index}>
									<FormControlLabel control={<Checkbox />} label={appliance} />
								</Grid>
							))}
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Button
						variant="contained"
						fullWidth
						sx={{
							backgroundColor: '#9EAED6',
							'&:hover': {
								backgroundColor: '#9EAED6',
							},
							color: '#160449',
							fontWeight: 'bold',
							textTransform: 'none',
						}}
					>
						Save Property
					</Button>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Button
						variant="contained"
						fullWidth
						sx={{
							backgroundColor: '#D29494',
							'&:hover': {
								backgroundColor: '#D29494',
							},
							color: '#160449',
							fontWeight: 'bold',
							textTransform: 'none',
						}}
					>
						Save Property & Select Property Manager
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
};

export default PropertyForm;
