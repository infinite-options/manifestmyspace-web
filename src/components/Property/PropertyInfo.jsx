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
} from '@mui/material';
import { LocationOn, TurnedInNot } from '@mui/icons-material';

const PropertyInfo = (props) => {
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
                                Pacific Oaks
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
                            103 N. Abel St, Milpitas CA 95035
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
                        <Box
                            height={'140px'}
                            width={'80%'}
                            sx={{
                                backgroundColor: '#CCC',
                                padding: '15px',
                            }}
                        >
                            <Typography>Images</Typography>
                        </Box>
                    </Stack>
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
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default PropertyInfo;
