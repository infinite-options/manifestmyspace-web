import React from 'react';
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

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ReactImageGallery from 'react-image-gallery';
<<<<<<< HEAD
=======
import { useLocation } from 'react-router-dom';
>>>>>>> nb_0814

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

const PropertyInfo = (props) => {
<<<<<<< HEAD
=======
    const location = useLocation();
    const index = location.state.index;
    const property = location.state.data;

    const listed_rent = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(property.property_listed_rent);

>>>>>>> nb_0814
    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'flex-start',
                    marginTop: theme.spacing(2),
                    paddingLeft: '25px',
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ paddingTop: '25px' }}
                >
                    <Box>
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
<<<<<<< HEAD
                                Pacific Oaks
=======
                                {property.property_address}
>>>>>>> nb_0814
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
<<<<<<< HEAD
                            103 N. Abel St, Milpitas CA 95035
=======
                            {property.property_address +
                                ', ' +
                                property.property_city +
                                ', ' +
                                property.property_state +
                                ' ' +
                                property.property_zip}
>>>>>>> nb_0814
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
                                6 days ago
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
<<<<<<< HEAD
                            <strong>$3213</strong> Per Month
=======
                            <strong>{listed_rent}</strong> Per Month
>>>>>>> nb_0814
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                            }}
                        >
                            Apply Now
                        </Button>
                    </Stack>
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        direction="row"
                        sx={{ margin: '5px 10px' }}
                    >
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
<<<<<<< HEAD
                                Condo
=======
                                {property.property_type}
>>>>>>> nb_0814
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
<<<<<<< HEAD
                                2
=======
                                {property.property_num_beds}
>>>>>>> nb_0814
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
<<<<<<< HEAD
                                2
=======
                                {property.property_num_baths}
>>>>>>> nb_0814
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
<<<<<<< HEAD
                                1200
=======
                                {property.property_area}
>>>>>>> nb_0814
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
<<<<<<< HEAD
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Modi beatae doloribus incidunt quidem,
                            reiciendis ratione praesentium illo deleniti,
                            molestias sint id ullam laboriosam, culpa molestiae
                            qui nulla dolores vero cum.
=======
                            {property.property_description}
>>>>>>> nb_0814
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
                        <Box height={'150px'}></Box>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                            }}
                        >
                            Community Amenities
                        </Typography>
                        <Box height={'150px'}></Box>
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
<<<<<<< HEAD
                            103 N. Abel St, Milpitas CA 95035
=======
                            {property.property_address +
                                ', ' +
                                property.property_city +
                                ', ' +
                                property.property_state +
                                ' ' +
                                property.property_zip}
>>>>>>> nb_0814
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
