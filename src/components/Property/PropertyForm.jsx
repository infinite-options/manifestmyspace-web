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
import { useLocation, useNavigate } from "react-router-dom";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddressAutocompleteInput from './AddressAutocompleteInput';
import theme from '../../theme/theme';
import { useUser } from '../../contexts/UserContext';
import ImageUploader from '../ImageUploader';
import { getLatLongFromAddress } from "../../utils/geocode";
import StaticMap from "./StaticMap"
import APIConfig from "../../utils/APIConfig";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    let navigate = useNavigate();
    const { getProfileId } = useUser();
	const { user, selectedRole, selectRole, Name } = useUser();
	const [readOnlyNotes, setReadOnlyNotes] = useState(selectedRole === "MANAGER" ? true : false);
	//const [readOnlyNotes, setReadOnlyNotes] = useState(false);
	const [selectedImageList, setSelectedImageList] = useState([]);

    const location = useLocation();
  // const { property_endpoint_resp } = location.state;

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
    const [ownerId, setOwnerId] = useState(getProfileId());
    const [selectedOwner, setSelectedOwner] = useState("");
	const [notes, setNotes] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
  const [isListed, setListed] = useState(false);
  const [ownerList, setOwnerList] = useState([]);
  const [applianceList, setApplianceList] = useState([]);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

	const handleAddressSelect = async (address) => {
		setAddress(address.street ? address.street : '');
		setCity(address.city ? address.city : '');
		setState(address.state ? address.state : '');
		setZip(address.zip ? address.zip : '');

	const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zip}`;
    const coords = await getLatLongFromAddress(fullAddress);
    setCoordinates(coords);
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
		navigate(-1); };

    const handleOwnerChange = (event) => {
            setSelectedOwner(event.target.value);
         
	};

    const handleListedChange = (event) => {
        setListed(event.target.checked);
      };
	
	  const handleNotesChange = (event) => {
		setNotes(event.target.value);
	  };

	  const handleApplianceChange = (event) => {
        const value = event.target.value;
        setSelectedAppliances((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((item) => item !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };

    const handleSubmit = async (event) => {
        console.log("is it in handlesubmit");
        event.preventDefault();
        setShowSpinner(true);
        const formData = new FormData();
    
        const currentDate = new Date();
        // const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
        const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${currentDate.getFullYear()}`;
    
        const fullAddress = `${address}, ${city}, ${state}, ${zip}`;
    
        const coordinates = await getLatLongFromAddress(fullAddress);

		//console.log("----selectedAppliances----", selectedAppliances);
    
    
        if (coordinates) {
          formData.append("property_latitude", coordinates.latitude);
          formData.append("property_longitude", coordinates.longitude);
        }
    
        formData.append("property_owner_id", selectedOwner ? selectedOwner : ownerId);
        
        formData.append("property_active_date", formattedDate);
        formData.append("property_address", address);
        formData.append("property_unit", unit);
        formData.append("property_city", city);
        formData.append("property_state", state);
        formData.append("property_zip", zip);
        formData.append("property_type", type);
        formData.append("property_num_beds", bedrooms);
        formData.append("property_num_baths", bathrooms);
        formData.append("property_value", cost);
        formData.append("property_area", squareFootage);
        formData.append("property_listed", 0);
        formData.append("property_notes", notes);
		// Add selected appliances in the correct format

		console.log("----selectedAppliances---", JSON.stringify(selectedAppliances));
    /*selectedAppliances.forEach(appliance => {
        formData.append("appliances[]", JSON.stringify(appliance));
    }); */
	formData.append("appliances", JSON.stringify(selectedAppliances));
    console.log("Formdata:", formData);

    for (let [key, value] of formData.entries()) {
        console.log("Property Data entered");
        console.log(key, value);
    }
    
        const files = selectedImageList;
        let i = 0;
        for (const file of selectedImageList) {
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
            formData.append("img_favorite", key);
          }
        }
    
        
    
        let responsePropertyUID = null;
        try {
          const response = await fetch(`${APIConfig.baseURL.dev}/properties`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log("response data", data);
          responsePropertyUID = data.property_UID;
          console.log("response data - property UID: ", responsePropertyUID);
        } catch (error) {
          console.log("Error posting data:", error);
        } 
        /*
        // create new contract if profile === manager
        if (selectedRole === "MANAGER") {
          const contractFormData = new FormData();
    
          console.log("In Create new contract");
    
          const currentDate = new Date();
          const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${currentDate.getFullYear()}`;
    
          // responsePropertyUID = [responsePropertyUID];  // This doesn't work since it returns the string in single quotes
          responsePropertyUID = '["' + responsePropertyUID + '"]';
          console.log("Reformated property data: ", responsePropertyUID);
          contractFormData.append("contract_property_ids", responsePropertyUID);
          console.log("Immediately after: ", contractFormData);
          contractFormData.append("contract_business_id", getProfileId());
          contractFormData.append("contract_start_date", formattedDate);
          contractFormData.append("contract_status", "NEW");
          // console.log("Contract Formdata:", contractFormData);
    
          console.log("In Create new contract - contractFormData = ", contractFormData);
          const url = `${APIConfig.baseURL.dev}/contracts`;
    
          let responseContractUID = null;
    
          try {
            const response = await fetch(url, {
              method: "POST",
              body: contractFormData,
            });
    
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("contracts - POST - response data = ", data);
    
            responseContractUID = data.contract_UID;
            console.log("response data - contract UID: ", responseContractUID);
    
            // console.log('navigating to /managementContractDetails', responseContractUID, getProfileId(), responsePropertyUID);
    
            navigate("/managementContractDetails", {
              state: {
                contract_uid: responseContractUID,
                contract_business_id: getProfileId(),
                contract_property_id: responsePropertyUID,
                // property_endpoint_resp: property_endpoint_resp,
              },
            });
          } catch (error) {
            console.error("Error:", error);
          }
        }
     */
        setAddress("");
        setCity("");
        setState("");
        setZip("");
        setType("");
        setSquareFootage("");
        setBedrooms("");
        setBathrooms("");
        setNotes("");
        setSelectedImageList([]);
        setActiveStep(0);
        setShowSpinner(false);
        if (selectedRole === "OWNER") {
          navigate("/properties", {state:{isBack:true}});
        }
      };

      useEffect(() => {
        //This runs for a manager who wants to select an owner while adding a property
        if (selectedRole === "MANAGER") {
          console.log("MANAGER ID", ownerId);
          const getOwnerContacts = async () => {
            try {
              const response = await fetch(`${APIConfig.baseURL.dev}/contacts/${getProfileId()}`);
    
              if (!response.ok) {
                console.log("Error fetching owner data");
                return;
              }
              const ownerdata = await response.json();
              console.log(ownerdata);
              let contactArray = ownerdata.management_contacts.owners;
              let ownerObjList = [];
              contactArray.forEach((contact) => {
                let obj = {
                  owner_id: contact.contact_uid,
                  owner_name: contact.contact_first_name + " " + contact.contact_last_name,
                };
                ownerObjList.push(obj);
              });
              setOwnerList(ownerObjList);
            } catch (error) {
              console.log(error);
            }
          };
          getOwnerContacts();
        }
      }, []);

	  useEffect(() => {
        const fetchAppliances = async () => {
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/lists?list_category=appliances`);
                const data = await response.json();
                const validAppliances = data.result.filter(item => item.list_item.trim() !== "");
            setApplianceList(validAppliances);
            } catch (error) {
                console.error("Error fetching appliances:", error);
            }
        };
        fetchAppliances();
    }, []);

	return (
		<Container maxWidth="md" style={{ backgroundColor: '#F2F2F2', padding: '16px', borderRadius: '8px' }}>
			
			<Button onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ color: theme.typography.primary.black, fontSize: "30px", marginLeft: -20}} />
              </Button>
            
			<Card sx={{ backgroundColor: '#D6D5DA', marginBottom: '18px', padding: '16px', borderRadius: '8px' }}>
				<CardContent className={classes.cardContent}>
					<Grid container spacing={8}>
						<Grid item xs={12} sm={4} className={classes.addPicturesButtonContainer}>
						
            <StaticMap
              latitude={coordinates?.latitude}
              longitude={coordinates?.longitude}
              size="400x400"
              zoom={15}
			  defaultCenter={{ lat: 37.3382, lng: -121.8863 }}
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

                                        value={city}
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
                                        disabled
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
                                    value={state}
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
                                        disabled
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
                                    disabled
                                    value={zip}
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
					<Grid container spacing={8}>
						<Grid item xs={12} sm={4} sx={{
		display: 'flex',
		justifyContent: 'center', 
		alignItems: 'center',
	}}>
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
        <Typography>{squareFootage ? Math.round(cost / squareFootage) : 0}</Typography>
    </Grid>
							</Grid>
						</Grid>
                        <Grid item xs={12}>
                  {selectedRole === "MANAGER" ? (
                    <div>
                      <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                        Owner
                      </Typography>
                      <Select
                        sx={{
                          backgroundColor: "white",
                          borderColor: "black",
                          borderRadius: "7px",
                        }}
                        size="small"
                        fullWidth
                        value={selectedOwner}
                        onChange={handleOwnerChange}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Owner
                        </MenuItem>
                        {ownerList.map((option, index) => (
                          <MenuItem key={index} value={option.owner_id}>
                            {option.owner_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {selectedRole === "MANAGER" ? (
                    <div>
                      <FormControlLabel control={<Checkbox checked={isListed} onChange={handleListedChange} />} label="Available to rent" />
                    </div>
                  ) : (
                    <div></div>
                  )}
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
							onChange={handleNotesChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography
							sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 14 }}
						>
							Appliances Included
						</Typography>
						<Grid container spacing={0}>
						{applianceList.map((appliance, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={appliance.list_uid}
                                                checked={selectedAppliances.includes(appliance.list_uid)}
                                                onChange={handleApplianceChange}
                                            />
                                        }
                                        label={appliance.list_item}
                                    />
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
                        onClick={handleSubmit}
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
