import React, { useEffect, useState } from 'react';
import theme from '../../theme/theme';
import { useNavigate } from 'react-router-dom';
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Menu,
    MenuItem,
    IconButton,
    InputBase,
    Card,
    CardContent,
    CardActions,
    Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
    ArrowDropDown,
    FilterDrama,
    LocationOn,
    Search,
    Tune,
    TurnedInNot,
} from '@mui/icons-material';
import ReactImageGallery from 'react-image-gallery';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import defaultPropertyImage from './paintedLadies.jpeg';



const SearchBar = ({ propertyList, setFilteredItems, ...props }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);
        if (query.trim() === "") {
          setFilteredItems(propertyList);  // Reset to the original list if the search bar is cleared
        } else{
          const terms = query.split(" ").map(term => term.toLowerCase());  // Split the search term into individual terms
          const filtered = propertyList.filter(item => 
            terms.some(term => item.property_address.toLowerCase().includes(term))
          );
          setFilteredItems(filtered);  // Updating the state with filtered items
        }
    }
    
    const clearSearch = () => {
        setSearchTerm("");
        setFilteredItems(propertyList);
    };

    return (
        <Box
            sx={{
                p: "2px 4px",
                alignItems: "center",
                backgroundColor: theme.palette.form.main,
                display: "flex"
            }}
        >
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, zIndex: 1000, flexGrow: 1}}
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearchChange}
                color={theme.typography.common.blue}
            />
            {searchTerm && (
                <IconButton aria-label="clear" onClick={clearSearch}>
                <CloseIcon />
                </IconButton>
            )}
        </Box>
    )
}

const FilterButtons = ({ propertyList, filteredItems, setFilteredItems, ...props }) => {
    const [menuStates, setMenuStates] = useState({
        price: null,
        type: null,
        beds: null,
        bath: null
    });
    const [param, setParam] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        price: '',
        type: '',
        beds: '',
        bath: ''
    });

    useEffect(() => {
        console.log(selectedFilters);
    }, [selectedFilters]);

    const areAnyFiltersSet = Object.values(selectedFilters).some(value => value !== '');

    const handleClick = (filterName, event) => {
        setMenuStates(prev => ({ ...prev, [filterName]: event.currentTarget }));
    };

    const handleSelect = (filterName, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        filterResults(filterName, value);
    };

    const sortPropertiesByRent = (propertyList, value) => {
        const sortedProperties = [...propertyList].sort((a, b) => {
            const rentA = Number(a.property_listed_rent);
            const rentB = Number(b.property_listed_rent);
            if (value === 'Low-High') {
                return rentA - rentB;
            } else { //High-Low
                return rentB - rentA;
            }
        });
        return sortedProperties;
    };

    const filterResults = (filterName, value) => {
        let filtered = [...filteredItems];

        if (filterName === 'price') {
            filtered = sortPropertiesByRent(filtered, value);
        } 
        
        if (filterName === 'type') {
            filtered = filtered.filter(item => item.property_type === value);            
        }
        
        if (filterName === 'beds') {
            filtered = filtered.filter(item => {
                if (value == "3+") {
                    return item.property_num_beds >= 3;
                }
                return item.property_num_beds === parseInt(value);
            });
        } 
        
        if (filterName === 'bath') {
            filtered = filtered.filter(item => {
                if (value == "3+") {
                    return item.property_num_baths >= 3;
                }
                return item.property_num_baths === parseInt(value);
            });
        }
        setFilteredItems(filtered);
    }

    const clearFilters = (filterName) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterName]: ''
        }));
        setFilteredItems(propertyList);
    }

    const clearAllFilters = () => {
        setSelectedFilters({
            price: '',
            type: '',
            beds: '',
            bath: ''
        });
        setFilteredItems(propertyList);
    }



 

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                position="relative"
                sx={{ padding: '10px' }}
            >
                <Box>
                    <Stack
                        direction="column"
                    >
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                            onClick={(event) => handleClick('price', event)}
                        >
                            Price {selectedFilters.price}
                            <ArrowDropDown />
                        </Button>
                        <Menu
                            anchorEl={menuStates.price}
                            open={Boolean(menuStates.price)}
                            onClose={() => setMenuStates(prev => ({ ...prev, price: null }))}
                        >
                            {/* The values here are just examples */}
                            <MenuItem onClick={() => handleSelect('price', 'Low-High')}>Low-High</MenuItem>
                            <MenuItem onClick={() => handleSelect('price', 'High-Low')}>High-Low</MenuItem>
                            {selectedFilters.price !== "" ? <MenuItem onClick={() => clearFilters('price')}>Clear</MenuItem> : null}
                        </Menu>
                    </Stack>
                </Box>
                <Box>
                    <Stack
                        direction="column"
                    >
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                            onClick={(event) => handleClick('type', event)}
                        >
                            Type {selectedFilters.type}
                            <ArrowDropDown />
                        </Button>
                        <Menu
                            anchorEl={menuStates.type}
                            open={Boolean(menuStates.type)}
                            onClose={() => setMenuStates(prev => ({ ...prev, type: null }))}
                        >
                            {/* The values here are just examples */}
                            <MenuItem onClick={() => handleSelect('type', 'House')}>House</MenuItem>
                            <MenuItem onClick={() => handleSelect('type', 'Apartment')}>Apartment</MenuItem>
                            <MenuItem onClick={() => handleSelect('type', 'Condo')}>Condo</MenuItem>
                            <MenuItem onClick={() => handleSelect('type', 'Multi Family')}>Multi Family</MenuItem>
                            <MenuItem onClick={() => handleSelect('type', 'Single Family')}>Single Family</MenuItem>
                            <MenuItem onClick={() => handleSelect('type', 'Townhome')}>Townhome</MenuItem>
                            {selectedFilters.type !== "" ? <MenuItem onClick={() => clearFilters('type')}>Clear</MenuItem> : null}
                        </Menu>
                    </Stack>
                </Box>
                <Box>
                    <Stack
                        direction="column"
                    >
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                            onClick={(event) => handleClick('beds', event)}
                        >
                            Beds {selectedFilters.beds}
                            <ArrowDropDown />
                        </Button>
                        <Menu
                            anchorEl={menuStates.beds}
                            open={Boolean(menuStates.beds)}   
                            onClose={() => setMenuStates(prev => ({ ...prev, beds: null }))}
                        >
                            {/* The values here are just examples */}
                            <MenuItem onClick={() => handleSelect('beds', '1')}>1</MenuItem>
                            <MenuItem onClick={() => handleSelect('beds', '2')}>2</MenuItem>
                            <MenuItem onClick={() => handleSelect('beds', '3+')}>3+</MenuItem>
                            {selectedFilters.beds !== "" ? <MenuItem onClick={() => clearFilters('beds')}>Clear</MenuItem> : null}
                        </Menu>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction="column">
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                            onClick={(event) => handleClick('bath', event)}
                        >
                            Bath {selectedFilters.bath}
                            <ArrowDropDown />
                        </Button>
                        <Menu
                            anchorEl={menuStates.bath}
                            open={Boolean(menuStates.bath)}
                            onClose={() => setMenuStates(prev => ({ ...prev, bath: null }))}
                        >
                            {/* The values here are just examples */}
                            <MenuItem onClick={() => handleSelect('bath', '1')}>1</MenuItem>
                            <MenuItem onClick={() => handleSelect('bath', '2')}>2</MenuItem>
                            <MenuItem onClick={() => handleSelect('bath', '3+')}>3+</MenuItem>
                            {selectedFilters.bath !== "" ? <MenuItem onClick={() => clearFilters('bath')}>Clear</MenuItem> : null }
                        </Menu>
                    </Stack>
                </Box>
            </Stack>
            { areAnyFiltersSet ? (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    position="relative"
                    display="flex"
                    sx={{ padding: '10px' }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            color: theme.typography.secondary.white,
                            fontWeight: theme.typography.common.fontWeight,
                            backgroundColor: theme.palette.custom.blue,
                            margin: '5px',
                        }}
                        onClick={clearAllFilters}
                    >
                        Clear All Filters
                    </Button>
                </Stack>
            ) : (null)}
        </>
    )
}

const PropertyListings = (props) => {
    const [propertyData, setPropertyData] = useState([]);
    const [userLeases, setUserLeases] = useState([]);
    const [tenantLeaseDetails, setTenantLeaseDetails] = useState([]);
    const [sortedProperties, setSortedProperties] = useState([]);
    const [displayProperties, setDisplayProperties] = useState([]);
    const { getProfileId } = useUser();
    const profileId = getProfileId();
    const [showSpinner, setShowSpinner] = useState(false);
    const [searchText, setSearchText] = useState("");





    // const url = 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties';

    useEffect(() => {
        setShowSpinner(true);
        fetchData()
    }, []);

    async function fetchData(){
        const leaseResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
        const propertyResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/listings/${getProfileId()}`)

        if (!leaseResponse.ok || !propertyResponse.ok) {
            // Handle the error as needed (maybe set an error state or log the error)
            console.error("API call failed");
            setShowSpinner(false);
            return;
        }

        const leaseData = await leaseResponse.json();
        console.log("leaseData.Lease_Details.result", leaseData.Lease_Details.result)
        const propertyData = await propertyResponse.json();
        setUserLeases(propertyData.Tenant_Leases.result)
        if(JSON.stringify(leaseData) === "{}"){
            console.log("No Lease Data")
            if(!propertyData.Available_Listings.result){
                console.error("Data is missing from the API response");
                setShowSpinner(false);
                return;
            } else {
                setPropertyData(propertyData.Available_Listings.result);
            }
        } else{
            if (!leaseData.Lease_Details.result || !propertyData.Available_Listings.result) {
                console.error("Data is missing from the API response");
                setShowSpinner(false);
                return;
            } else{
                setTenantLeaseDetails(leaseData.Lease_Details.result);
                setPropertyData(propertyData.Available_Listings.result);
            }
        }

        sortProperties(leaseData, propertyData.Available_Listings.result)

        setShowSpinner(false);
    }

    function sortProperties(leaseData, propertyData) {
        if (JSON.stringify(leaseData) !== "{}") {
            var activePropertyArray = [];
            const leases = leaseData.Lease_Details.result;
            var sortedProperties = [...propertyData]; // Create a shallow copy to avoid mutating the original array
            leases.forEach((lease) => {
                const appliedPropertyIndex = sortedProperties.findIndex((property) => property.property_uid === lease.property_id); 
                // console.log("applied to property at index", appliedPropertyIndex, lease.lease_status)
                if (appliedPropertyIndex > -1) { // Make sure the property was found
                    const appliedProperty = sortedProperties.splice(appliedPropertyIndex, 1)[0]; // Remove the property and store it
                    if(appliedProperty.lease_status === "ACTIVE"){
                        activePropertyArray.push(appliedProperty);
                    } else{
                        sortedProperties.unshift(appliedProperty); // Add the property to the beginning of the array
                    }
                }
            });
        
            setSortedProperties([...activePropertyArray, ...sortedProperties]);
            setDisplayProperties([...activePropertyArray, ...sortedProperties])
        } else {
            setSortedProperties(propertyData);
            setDisplayProperties(propertyData)
        }
    }
    
    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '90vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
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
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        sx={{ paddingBottom: '25px', paddingTop: '15px' }}
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '18px',
                                }}
                            >
                                Search For Your New Home
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <SearchBar propertyList={sortedProperties} setFilteredItems={setDisplayProperties} sx={{ width: "100%" }} />
                    </Stack>
                    <Stack>
                        <FilterButtons propertyList={sortedProperties} filteredItems={displayProperties} setFilteredItems={setDisplayProperties} />
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ padding: '5px 15px' }}
                    >
                        <Box position="relative" left={0}>
                            <Typography
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontWeight:
                                        theme.typography.common.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                }}
                            >
                                Map
                                <LocationOn
                                    sx={{
                                        fontSize: theme.typography.largeFont,
                                    }}
                                />
                            </Typography>
                        </Box>
                        <Box position="relative" right={0}>
                            <Typography
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontWeight:
                                        theme.typography.common.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                }}
                            >
                                Saved Search
                                <TurnedInNot
                                    sx={{
                                        fontSize: theme.typography.largeFont,
                                    }}
                                />
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack
                        alignItems="flex-start"
                        sx={{ padding: '10px 15px' }}
                    >
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: '16px',
                            }}
                        >
                            Apartments For Rent In San Jose CA
                            {/* Units Available for Rent */}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontSize: theme.typography.smallFont,
                            }}
                        >
                            {displayProperties.length} Available
                        </Typography>
                    </Stack>
                    {console.log("sorted properties", displayProperties)}
                    {displayProperties.length > 0 && displayProperties.map((property, index) => {
                        var status = ""
                        let i = sortedProperties.findIndex(p=>p.property_uid===property.property_uid) // This is to make sure the filtered property items don't confuse with sorted property items, and there's no wrong label or attribute                        
                        const appliedData = userLeases
                            .filter(lease => lease.lease_property_id === property.property_uid && lease.lease_uid !== null)
                            .sort((a, b) => {
                                const uidA = parseInt(a.lease_uid.split('-')[1]);
                                const uidB = parseInt(b.lease_uid.split('-')[1]);                                                                
                                return uidB - uidA;
                              })[0];
                                                      
                        console.log("appliedData", appliedData)
                        console.log("userLeases", userLeases)
                        if (appliedData) { 
                            console.log(appliedData.lease_status, appliedData.property_area, appliedData.lease_start, appliedData.lease_status)
                            status = appliedData.lease_status;
                            console.log(appliedData.property_address, "lease status", status)
                        } 
                        // else{
                        //     console.log("No Lease Data for Property", property.property_address)
                        // }
                        return <PropertyCard data={property} key={i} status={status} leaseData={appliedData}/>;
                    })}
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

function PropertyCard(props) {
    const navigate = useNavigate();

    const [status, setStatus] = useState(props.status);

    const [lease, setLease] = useState(props.leaseData || {})

    const property = props.data;

    const propertyImages = property?.property_images || "";
    const ppt_images = propertyImages.split(',');   

    // useEffect(() => {
    //     if(status !== "" || status !== null){
    //         console.log(property.property_address, "has status", status)
    //     }
    // }, []);

    function parseImageData(data) {
        if (data === undefined) {
            return;
        }
        const s = data.indexOf('http');
        const l = data.indexOf('"', s);
        const imageString = data.slice(s, l);
        return imageString;
    }

    const images = ppt_images.map((data) => {
        try {
            const url = parseImageData(data);
            if (url == "") {
                return { original: defaultPropertyImage };
            }
            return { original: url };
        } catch (e) {
            console.error(e);
        }
    });
    

    const listed_rent = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(property?.property_listed_rent);

    const handleDetailsButton = () => {
        navigate('/propertyInfo', {
            state: {
                index: props.index,
                data: property,
                status: status,
                lease: lease,
            },
        });
    };

    function formatAddress(){
        if(property?.property_unit !== ""){
            return property?.property_address + " Unit " + property?.property_unit;
        }
        return property?.property_address;
    }
    
    const new_label= <Box  sx={{
                        backgroundColor: theme.typography.common.blue,
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => navigate("/tenantApplication", {state: { property: property, status: status, lease: lease }})}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Applied {lease.lease_application_date}
                    </Typography>
                </Box>
    const processing_label= <Box sx={{
                        backgroundColor: "#7AD15B",
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => {
                            console.log('lease:', lease)
                            console.log('property:', property)                            
                            console.log('status:', status)
                            navigate("/tenantLeases", {state: { property: property, status: status, lease: lease }})
                        }}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Approved {lease.lease_application_date}
                    </Typography>
                </Box>
    const rejected_label= <Box sx={{
                        backgroundColor: "#490404",
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => console.log("Clicked Approved Button for Property", property, "with lease", lease, "and status", status)}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Not Approved {lease.lease_application_date}
                    </Typography>
                </Box>
    const refused_label= <Box sx={{
                        backgroundColor: "#CB8E8E",
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => console.log("Clicked Approved Button for Property", property, "with lease", lease, "and status", status)}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Declined {lease.lease_application_date}
                    </Typography>
                </Box>
                        
    const tenant_approved_label= <Box sx={{
                        backgroundColor: "#CB8E8E",
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => console.log("Clicked Approved Button for Property", property, "with lease", lease, "and status", status)}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Tenant Approved {lease.lease_application_date}
                    </Typography>
                </Box>
    const active_label= <Box sx={{
                        backgroundColor: "#412591",
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                        textTransform: 'none'
                    }}
                    onClick={() => console.log("Clicked Approved Button for Property", property, "with lease", lease, "and status", status)}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Active {lease.lease_application_date}
                    </Typography>
                </Box>

    let status_label={'NEW': new_label , 'ACTIVE': active_label, 'REFUSED': refused_label, 'REJECTED': rejected_label, "TENANT APPROVED": tenant_approved_label, "PROCESSING": processing_label}

    return (
        <Card sx={{ margin: 5 }}>
            <ReactImageGallery
                items={images}
                showFullscreenButton={false}
                showPlayButton={false}
                showThumbnails={false}
            />

            <Stack
                direction="row" 
                justifyContent="space-between" 
            >
                <Box
                    sx={{
                        backgroundColor: '#8897BA',
                        color: theme.typography.secondary.white,
                        boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.4)',
                        zIndex: 5,
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '8px',
                        margin: '-20px 15px 5px',
                        padding: '3px 5px',
                        alignSelf: 'flex-start',
                    }}
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                        }}
                    >
                        {listed_rent}
                        <span style={{ opacity: '60%' }}> / Month</span>
                    </Typography>
                </Box>
                {status_label[status]}
            </Stack>
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    sx={{
                        color: theme.typography.common.blue,
                    }}
                >
                    <Box>
                        <Stack
                            direction={'row'}
                            sx={{
                                color: theme.palette.primary.lightYellow,
                            }}
                        >
                            <Rating
                                name="read-only"
                                precision={0.5}
                                value={5}
                            />
                            <Typography
                                sx={{
                                    color: theme.typography.common.blue,
                                }}
                            >
                                (2)
                            </Typography>
                        </Stack>
                    </Box>
                    <Box>
                        <LocationOn /> <TurnedInNot />
                    </Box>
                </Stack>
                <Stack>
                    <Typography
                        sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.common.fontWeight,
                            fontSize: '18px',
                        }}
                    >
                        {formatAddress()}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.primary.black,
                            fontSize: '16px',
                        }}
                    >
                        {property?.property_city +
                            ', ' +
                            property?.property_state +
                            ' ' +
                            property?.property_zip}
                    </Typography>
                    <Stack
                        justifyContent={'center'}
                        alignItems={'center'}
                        direction={'row'}
                        sx={{ padding: '5px 10px' }}
                    >
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 15px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '16px',
                                }}
                            >
                                {property?.property_type}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '16px',
                                }}
                            >
                                Type
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 15px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '16px',
                                }}
                            >
                                {property?.property_num_beds}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '16px',
                                }}
                            >
                                Bed
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 15px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '16px',
                                }}
                            >
                                {property?.property_num_baths}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '16px',
                                }}
                            >
                                Bath
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 15px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '16px',
                                }}
                            >
                                {property?.property_area}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '16px',
                                }}
                            >
                                Sq Ft
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions
                sx={{
                    // justifyContent: 'space-evenly',
                    justifyContent: 'center',
                    flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
                    display: 'flex',
                    width: '100%'
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="space-evenly"
                    direction="row"
                    spacing={2}
                    sx={{
                        flexWrap: 'wrap',
                        rowGap: '10px',
                    }}
                >
                    <Button
                        variant="text"
                        sx={{
                            border: '1px solid',
                            color: theme.typography.common.blue,
                            marginRight: '5px',
                            textTransform: 'none',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Contact Property
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#97A7CF",
                            color: theme.typography.secondary.white,
                            marginLeft: '5px',
                            textTransform: 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onClick={handleDetailsButton}
                    >
                        View Details
                    </Button>
                    {status === "NEW" ? (
                         <Button
                         variant="contained"
                         sx={{
                             backgroundColor: theme.typography.common.blue,
                             color: theme.typography.secondary.white,
                             marginLeft: '5px',
                             textTransform: 'none',
                             whiteSpace: 'nowrap'
                         }}
                         onClick={() => navigate('/tenantApplication', {state: { property: property, status: status, lease: lease }})}
                         >
                             View Application
                     </Button>
                    ) : (null)}
                     {status === "PROCESSING" ? (
                         <Button
                         variant="contained"
                         sx={{
                             //backgroundColor: theme.typography.common.blue,
                             backgroundColor: "#7AD15B",
                             color: theme.typography.secondary.white,
                             marginLeft: '5px',
                             textTransform: 'none',
                             whiteSpace: 'nowrap'
                         }}
                         onClick={() => navigate('/tenantLeases', {state: { property: property, status: status, lease: lease }})}
                         >
                             View Lease
                     </Button>
                    ) : (null)}
                </Stack>
            </CardActions>
        </Card>
    );
}

export {PropertyListings, PropertyCard};
