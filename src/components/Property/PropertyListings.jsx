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
    TextField,
    InputAdornment,
    Card,
    CardContent,
    CardActions,
    Rating,
} from '@mui/material';
import {
    ArrowDropDown,
    LocationOn,
    Search,
    Tune,
    TurnedInNot,
} from '@mui/icons-material';
import ReactImageGallery from 'react-image-gallery';
import { useUser } from "../../contexts/UserContext";
import axios from 'axios';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import leaseIcon from './leaseIcon.png';

const PropertyListings = (props) => {
    const [propertyData, setPropertyData] = useState([]);
    const [tenantLeaseDetails, setTenantLeaseDetails] = useState([]);
    const [sortedProperties, setSortedProperties] = useState([]);
    const { getProfileId } = useUser();
    const profileId = getProfileId();
    const [showSpinner, setShowSpinner] = useState(false);

    const url = 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties';

    useEffect(() => {
        console.log('fetch data')
        setShowSpinner(true);
        fetchData();
        getLeaseDetails();
        sortProperties();
    }, []);

    async function getLeaseDetails(){
        const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
        const leaseData = await response.json();
        console.log(leaseData)
        setTenantLeaseDetails(leaseData.Lease_Details.result);
        setShowSpinner(false);
    }
    
    async function fetchData(){
        const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/listings")
        const propertyData = await response.json();
        console.log(propertyData)
        setPropertyData(propertyData.Property_Dashboard.result)
        setShowSpinner(false);
    }


    function sortProperties(){
        // move the properties the tenant has applied to, to the top of the list

        // console.log("tenantLeaseDetails", tenantLeaseDetails)
        // console.log("propertyData", propertyData)

        var sortedProperties = propertyData;

        tenantLeaseDetails.forEach((lease) => {
            const appliedPropertyIndex = sortedProperties.findIndex((property) => property.property_uid === lease.property_id);

            const appliedProperty = sortedProperties.splice(appliedPropertyIndex);

            sortedProperties.unshift(appliedProperty);
        })

        setSortedProperties(sortedProperties)
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
                        <Box position="absolute" left={0}>
                            <Button>
                                <svg
                                    width="19"
                                    height="16"
                                    viewBox="0 0 19 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z"
                                        fill="#160449"
                                    />
                                </svg>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{ padding: '0 15px' }}
                    >
                        <TextField
                            variant="filled"
                            label="Search Place"
                            fullWidth
                            sx={{
                                border: '1px solid',
                                borderRadius: 10,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize:
                                                theme.typography.smallFont,
                                            paddingRight: '5px',
                                        }}
                                    >
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontSize:
                                                theme.typography.smallFont,
                                            paddingLeft: '5px',
                                        }}
                                    >
                                        <Tune />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        position="relative"
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
                        >
                            Price
                            <ArrowDropDown />
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                        >
                            Type
                            <ArrowDropDown />
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                        >
                            Beds
                            <ArrowDropDown />
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '5px',
                            }}
                        >
                            Bath
                            <ArrowDropDown />
                        </Button>
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
                            {propertyData.length} Available
                        </Typography>
                    </Stack>
                    {/* {console.log("tenantLeaseDetails", tenantLeaseDetails)} */}
                    {/* {console.log("propertyData", propertyData)} */}
                    
                    {sortedProperties.map((property, index) => {
                        var status = false
                        const applied = tenantLeaseDetails.find((lease) => lease.property_id === property.property_uid);
                        if (applied) { status = true; }
                        return <PropertyCard data={property} key={index} status={status} lease={applied}/>;
                    })}
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

function PropertyCard(props) {
    const navigate = useNavigate();

    const property = props.data;

    const applied = props.status;

    const lease = props.lease;

    console.log("applied in PropertyCard", applied)

    const ppt_images = property.property_images.split(',');

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
            return { original: url };
        } catch (e) {
            console.error(e);
            return { original: '' };
        }
    });

    // console.log(images);

    const listed_rent = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(property.property_listed_rent);

    const handleDetailsButton = () => {
        navigate('/propertyInfo', {
            state: {
                index: props.index,
                data: property,
                status: applied
            },
        });
    };

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
                {applied ? (
                <Box
                    sx={{
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
                >
                    <Typography
                        sx={{
                            padding: '5px',
                            fontSize: '18px',
                            fontWeight: '800px'
                        }}
                    >
                        Applied
                    </Typography>
                </Box>): (null)}
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
                        {property.property_address}
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.typography.primary.black,
                            fontSize: '16px',
                        }}
                    >
                        {property.property_address +
                            ', ' +
                            property.property_city +
                            ', ' +
                            property.property_state +
                            ' ' +
                            property.property_zip}
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
                                {property.property_type}
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
                                {property.property_num_beds}
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
                                {property.property_num_baths}
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
                                {property.property_area}
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
                    {applied ? (
                         <Button
                         variant="contained"
                         sx={{
                             backgroundColor: theme.typography.common.blue,
                             color: theme.typography.secondary.white,
                             marginLeft: '5px',
                             textTransform: 'none',
                             whiteSpace: 'nowrap'
                         }}
                         onClick={() => navigate('/tenantApplication', {state: { property: property, status: applied, lease: lease }})}
                         >
                             View Application
                     </Button>
                    ) : (null)}
                </Stack>
            </CardActions>
        </Card>
    );
}

export default PropertyListings;
