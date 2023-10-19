import React, {useEffect, useState} from 'react';
import theme from '../../theme/theme';
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Grid,
    Divider,
    Button,
    ButtonGroup,
    Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";

export default function TenantApplication(){
    const location = useLocation();
    const { user, getProfileId, roleName } = useUser();

    return(
        <ThemeProvider theme={theme}>
            <Box
                component="span"
                display='flex'
                justifyContent='center'
                alignItems='center'
                position='relative'
                sx={{
                    paddingTop: "20px",
                }}
            >
                <Typography
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black,
                        fontWeight: theme.typography.primary.fontWeight,
                        fontSize: theme.typography.largeFont
                    }}>
                        Your Application For
                </Typography>
            </Box>
            <Box
                component="span"
                display='flex'
                justifyContent='center'
                alignItems='center'
                position='relative'
                sx={{  paddingBottom: "20px"}}
            >
                 <Typography
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black,
                        fontWeight: theme.typography.medium.fontWeight,
                        fontSize: theme.typography.smallFont
                    }}>
                        1234 Main St, San Jose, CA 95131
                </Typography>
            </Box>
            <Divider light />
           <Paper
                style={{
                    margin: '25px',
                    padding: 20,
                    backgroundColor: theme.palette.primary.main,
                    height: '25%',
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Name
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Ranjit
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Email
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            rmarathay@gmail.com
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Phone
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            408-476-1238
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            SSN #
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            123-45-6789
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            License #
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            123456789
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            License State
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            TX
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Current Salary
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            $87,900
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Salary Frequency
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Bi-weekly
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Company Name
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            RPM Capital Management LLC
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Job Title
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Business Person
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Current Address
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            1934 1st Ave
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Unit #
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            5
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            City/State
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            New York, NY
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.mediumFont
                            }}
                        >
                            Zip Code
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            10029
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.secondaryFont
                            }}
                        >
                            Who plans to live in the unit <span style={{ color: 'red' }}>*</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            1 Adults
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Ranjit Marathay | Tenant | DOB: 01/18/1996
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            0 Children
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            2 Pets
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Otto | Cat | 16 lbs | 2 years old
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Leo | Cat | 8 lbs | 1 years old
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            2 Vehicles
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Porsche 911 S Targa | Sports Car | ASD1234 | CA
                        </Typography>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.light.fontWeight,
                                fontSize: theme.typography.smallFont
                            }}
                        >
                            Porsche Cayenne S | SUV | ASD1235 | CA
                        </Typography>
                    </Grid>

                    <Grid item xs={6} alignContent={'center'}>
                        <Button
                            sx={{
                                justifyContent: 'center',
                                color: "#160449",
                                backgroundColor: "#9EAED6",
                                fontWeight: theme.typography.medium.fontWeight,
                                fontSize: theme.typography.mediumFont,
                                textTransform: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid item xs={6} alignContent={'center'}>
                        <Button
                            sx={{
                                justifyContent: 'center',
                                color: "#000000",
                                backgroundColor: "#CB8E8E",
                                fontWeight: theme.typography.medium.fontWeight,
                                fontSize: theme.typography.mediumFont,
                                textTransform: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            Edit
                        </Button>
                    </Grid>

                    
                </Grid>
            </Paper>
        </ThemeProvider>
    )
}