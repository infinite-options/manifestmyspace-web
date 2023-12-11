import { useState, useEffect } from 'react';
import theme from '../../theme/theme';
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    ButtonGroup,
    Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    CheckCircle,
    ExpandMore,
    LocationOn,
    TurnedInNot,
} from '@mui/icons-material';
import {
    DateCalendar,
    DigitalClock,
    LocalizationProvider,
} from '@mui/x-date-pickers';
import Scheduler from '../utils/Scheduler';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ReactImageGallery from 'react-image-gallery';
import { useNavigate, useLocation } from 'react-router-dom';
import backButton from '../Payments/backIcon.png';
import { set } from 'date-fns';


dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

const PropertyInfo = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const index = location.state.index;
    const property = location.state.data;
    const status = location.state.status;
    const lease = location.state.lease;
    const ppt_images = property.property_images.split(',');
    const amenities_apartment = property.property_amenities_unit.split(",");
    const amenities_community = property.property_amenities_community.split(",");
    const [showScheduler, setShowScheduler] = useState(false);
    const [schedulerDate, setSchedulerDate] = useState();
    const [buttonColor, setButtonColor] = useState('#3D5CAC');
    console.log(property)
    console.log(status)

    useEffect(() => {
        window.scrollTo(0, 0);

        if (status === "") {
            setButtonColor("#3D5CAC")
        } else if (status === "NEW") {
            setButtonColor("#3D5CAC")
        } else if (status === "PROCESSING"){
            setButtonColor("#7AD15B")
        } else if (status === "TENANT APPROVED"){
            setButtonColor("#7AD15B")
        } else if (status === "REJECTED"){
            setButtonColor("#490404")
        } else if (status === "REFUSED"){
            setButtonColor("#CB8E8E")
        } else if (status === "ACTIVE"){
            setButtonColor("#412591")
        }
    }, []);

    const listed_rent = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(property.property_listed_rent);

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

    function displayListingDate(date) {
        const d = dayjs(date);

        const daysAgo = dayjs().diff(d, 'day');
        if (daysAgo === 0) {
            return 'Listed today';
        } else if (daysAgo === 1) {
            return 'Listed yesterday';
        } else {
            return 'Listed ' + daysAgo + ' days ago';
        }
    }

    function renderCorrectButtonText() {
        if (status === "" || status === null) { 
            return 'Apply Now';
        } else if (status === "NEW") {
            return 'View Application';            
        } else if (status === "PROCESSING"){
            return 'Approved'
        } else if (status === "TENANT APPROVED"){
            return 'Approved'
        } else if (status === "REJECTED"){
            return 'Not Approved'
        } else if (status === "ACTIVE"){
            return 'Apply Now'
        }
    }

    // function navigateToCorrectPage(){
    //     if (status === "" || status === "NEW") {
    //         navigate('/tenantApplication', {state: { property: property, status: status, lease: lease }})
    //     } else if (status === "TENANT APPROVED" || status === "PROCESSING"){
    //         navigate('/tenantLeases', {state: { property: property, status: status, lease: lease }})
    //     } else {
    //         return null
    //     }
    // }

    function navigateToCorrectPage(){
        if (["", "NEW", "ACTIVE"].includes(status)) 
            return {url: '/tenantApplication', params: { property: property, status: status, lease: lease } }
        
        if (status === "TENANT APPROVED" || status === "PROCESSING")
            return {url: '/tenantLeases', params: { property: property, status: status, lease: lease }}
        
        else 
            return null
    }

    return (
        <ThemeProvider theme={theme}>
            <Scheduler 
                show={showScheduler} 
                setShow={setShowScheduler} 
                date={schedulerDate} 
                setDate={setSchedulerDate} 
            />
            <Box
                component="span"
                display='flex'
                justifyContent='center'
                alignItems='center'
                position='relative'
            >
                <Button
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        padding: '10px 10px 0px 10px',
                        textDecoration: 'underline',
                        position: 'relative',
                    }}
                >
                    <img src={backButton} style={{width: '20px', height: '20px', margin:'0 5px'}}/>
                    <Typography
                        sx={{
                            justifySelf: 'center',
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.medium.fontWeight,
                            fontSize: theme.typography.smallFont,
                            textAlign: 'center',
                        }}>

                        <u>Return to All Listings</u>
                    </Typography>
                </Button>
            </Box>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '90vh',
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    style={{
                        margin: '15px 30px 30px',
                        padding: '15px',
                        paddingTop: '0px',
                        backgroundColor: theme.palette.primary.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                    }}
                >
                    <Stack>
                        <Stack
                            direction="row"
                            justifyContent={'space-between'}
                            sx={{
                                color: theme.typography.common.blue,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '25px',
                                }}
                            >
                                {property.property_address}
                            </Typography>
                            <Box>
                                <LocationOn /> <TurnedInNot />
                            </Box>
                        </Stack>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontSize: '18px',
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
                    </Stack>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={5}
                        sx={{ padding: '20px' }}
                    >
                        <Box
                            sx={{
                                background: '#9EAED666',
                                borderRadius: '10px',
                            }}
                        >
                            <ButtonGroup variant="outlined">
                                <Button
                                    sx={{ color: theme.typography.common.blue }}
                                >
                                    Photos
                                </Button>
                                <Button
                                    sx={{ color: theme.typography.common.blue }}
                                >
                                    Video
                                </Button>
                                <Button
                                    sx={{ color: theme.typography.common.blue }}
                                >
                                    Map
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Stack>
                    <ReactImageGallery
                        items={images}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showThumbnails={false}
                    />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            color: theme.typography.common.blue,
                            marginTop: '10px',
                        }}
                    >
                        <Box>
                            <Stack
                                direction="row"
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
                            <Typography
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontsize: theme.typography.smallFont,
                                }}
                            >
                                {displayListingDate(property.property_listed_date)}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            color: theme.typography.common.blue,
                            padding: '15px 0',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '16px',
                            }}
                        >
                            <strong>{listed_rent}</strong> Per Month
                        </Typography>
                        <Button
                             variant="contained"
                             sx={{
                                 background: buttonColor,
                                 color: theme.palette.background.default,
                                 textTransform: 'none',
                             }}
                            //  onClick={() => navigateToCorrectPage()}
                            onClick={() => {
                                const {url, params}=navigateToCorrectPage() 
                                navigate(url,  {state: params}) } }
                         >
                           {renderCorrectButtonText()}
                         </Button>
                    </Stack>
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        direction="row"
                        sx={{ margin: '5px 10px' }}
                    >
                        {property.property_pets_allowed > 0 ? (
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{ margin: '5px' }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7AD15B',
                                        fontWeight:
                                            theme.typography.primary.fontWeight,
                                        fontSize: '16px',
                                    }}
                                >
                                    <CheckCircle />
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.primary.black,

                                        fontSize: '12px',
                                    }}
                                >
                                    Pet Friendly
                                </Typography>
                            </Stack>
                        ) : (
                            <></>
                        )}
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 10px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '15px',
                                }}
                            >
                                {property.property_type}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '12px',
                                }}
                            >
                                Type
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 10px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '15px',
                                }}
                            >
                                {property.property_num_beds}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '12px',
                                }}
                            >
                                Bed
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 10px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '15px',
                                }}
                            >
                                {property.property_num_baths}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,

                                    fontSize: '12px',
                                }}
                            >
                                Bath
                            </Typography>
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ margin: '5px 10px' }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: '15px',
                                }}
                            >
                                {property.property_area}
                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontSize: '12px',
                                }}
                            >
                                Sq Ft
                            </Typography>
                        </Stack>
                    </Stack>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                            sx={{
                                backgroundColor: '#97A7CF',
                                boxShadow: 'none',
                                color: '#FFF',
                                padding: '10px',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                }}
                            >
                                Schedule a Tour
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: '10px' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <DateCalendar />
                                    <DigitalClock
                                        timeStep={60}
                                        disablePast
                                        sx={{ width: '50%' }}
                                    />
                                </Stack>
                                <Box
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#97A7CF',
                                            color: theme.palette.background
                                                .default,
                                        }}
                                        onClick={() => setShowScheduler(true)}
                                    >
                                        Schedule
                                    </Button>
                                </Box>
                            </LocalizationProvider>
                        </AccordionDetails>
                    </Accordion>
                    <Stack
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{ margin: '25px 0' }}
                    >
                        <Typography
                            sx={{
                                fontWeight: theme.typography.primary.fontWeight,
                                color: theme.typography.primary.black,
                            }}
                        >
                            Description
                        </Typography>
                        <Typography sx={{ textAlign: 'justify' }}>
                            {property.property_description}
                        </Typography>
                        <Typography
                            sx={{ color: theme.typography.common.blue }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clip-path="url(#clip0_1650_4326)">
                                    <path
                                        d="M3.5 13.5H1.5C1.23478 13.5 0.98043 13.3946 0.792893 13.2071C0.605357 13.0196 0.5 12.7652 0.5 12.5V1.5C0.5 1.23478 0.605357 0.98043 0.792893 0.792893C0.98043 0.605357 1.23478 0.5 1.5 0.5H12.5C12.7652 0.5 13.0196 0.605357 13.2071 0.792893C13.3946 0.98043 13.5 1.23478 13.5 1.5V12.5C13.5 12.7652 13.3946 13.0196 13.2071 13.2071C13.0196 13.3946 12.7652 13.5 12.5 13.5H10.5M0.5 3.5H13.5M7 13.5V7"
                                        stroke="#3D5CAC"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M4.5 9.5L7 7L9.5 9.5"
                                        stroke="#3D5CAC"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1650_4326">
                                        <rect
                                            width="14"
                                            height="14"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                            &nbsp; Visit Property Website
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                            }}
                        >
                            Apartment Amenities
                        </Typography>
                        
                        <Box
                            component="span"
                            display= 'flex'
                            justifyContent= 'flex-start'
                            paddingBottom="20px"
                            position= 'relative'
                            flexDirection="column"
                            sx={{
                                color: '#3D5CAC',
                                fontsize: theme.typography.smallFont,
                            }}
                        >
                            {
                                amenities_apartment.map(amenity => (
                                    <Box>{amenity}</Box>                                    
                                ))
                            }                            
                        </Box>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                            }}
                        >
                            Community Amenities
                        </Typography>
                        <Box
                            component="span"
                            display= 'flex'
                            justifyContent= 'flex-start'
                            paddingBottom="20px"
                            position= 'relative'
                            flexDirection="column"
                            sx={{
                                color: '#3D5CAC',
                                fontsize: theme.typography.smallFont,
                            }}
                        >
                            {
                                amenities_community.map(amenity => (
                                    <Box>{amenity}</Box>                                    
                                ))
                            }                            
                        </Box>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                            }}
                        >
                            Location
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
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
                        <Box height={'150px'}></Box>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                            }}
                        >
                            Places Nearby
                        </Typography>
                        <Box height={'150px'}></Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default PropertyInfo;
