import React from 'react';
import theme from '../../theme/theme';
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    CardActions,
} from '@mui/material';
import {
    ArrowDropDown,
    LocationOn,
    Search,
    Star,
    Tune,
    TurnedInNot,
} from '@mui/icons-material';

const FindProperty = (props) => {
    return (
        <ThemeProvider theme={theme}>
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
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        variant="filled"
                                        label="Search Place"
                                        fullWidth
                                        sx={{
                                            border: '1px solid',
                                            borderRadius: 10,
                                            // backgroundColor: '#A9AAAB',
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="start"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
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
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                        paddingLeft: '5px',
                                                    }}
                                                >
                                                    <Tune />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.typography.primary.black,
                                fontSize: theme.typography.smallFont,
                            }}
                        >
                            180 Available
                        </Typography>
                    </Stack>
                    <Card>
                        <CardMedia
                            image="./../../images/house.png"
                            sx={{ height: 140 }}
                        />
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
                                            color: theme.palette.primary
                                                .lightYellow,
                                        }}
                                    >
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Typography
                                            sx={{
                                                color: theme.typography.common
                                                    .blue,
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
                                        fontWeight:
                                            theme.typography.common.fontWeight,
                                        fontSize: '18px',
                                    }}
                                >
                                    Pacific Oaks
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '16px',
                                    }}
                                >
                                    123 Able Street, San Jose, CA 93117
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
                                                color: theme.typography.primary
                                                    .black,
                                                fontWeight:
                                                    theme.typography.primary
                                                        .fontWeight,
                                                fontSize: '16px',
                                            }}
                                        >
                                            Condo
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary
                                                    .black,

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
                                                color: theme.typography.primary
                                                    .black,
                                                fontWeight:
                                                    theme.typography.primary
                                                        .fontWeight,
                                                fontSize: '16px',
                                            }}
                                        >
                                            2
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary
                                                    .black,

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
                                                color: theme.typography.primary
                                                    .black,
                                                fontWeight:
                                                    theme.typography.primary
                                                        .fontWeight,
                                                fontSize: '16px',
                                            }}
                                        >
                                            2
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary
                                                    .black,

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
                                                color: theme.typography.primary
                                                    .black,
                                                fontWeight:
                                                    theme.typography.primary
                                                        .fontWeight,
                                                fontSize: '16px',
                                            }}
                                        >
                                            1200
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary
                                                    .black,

                                                fontSize: '16px',
                                            }}
                                        >
                                            Sq Ft
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                direction="row"
                            >
                                <Button
                                    variant="text"
                                    sx={{
                                        border: '1px solid',
                                        color: theme.typography.common.blue,
                                        margin: 10,
                                    }}
                                >
                                    Contact Property
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor:
                                            theme.typography.common.blue,
                                        color: theme.typography.secondary.white,
                                        margin: 10,
                                    }}
                                >
                                    View Details
                                </Button>
                            </Stack>
                        </CardActions>
                    </Card>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default FindProperty;
