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
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";

export default function TenantApplication(){
    const location = useLocation();
    const navigate = useNavigate();
    const { user, getProfileId, roleName } = useUser();


    const [property, setProperty] = useState(location.state.property)

    const [tenantProfile, setTenantProfile] = useState(null);


    function formattedAddress(){
        return `${property.property_address} ${property.property_unit} ${property.property_city} ${property.property_state} ${property.property_zip}`
    }

    function formatPreviousAddress(){
        // let address = "test"
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            let address = JSON.parse(tenantProfile?.tenant_previous_address)
            return `${address.street} ${address.unit} ${address.city} ${address.state} ${address.zip}`
        }
    }

    function formatPreviousCityState(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            let address = JSON.parse(tenantProfile?.tenant_previous_address)
            return `${address.city}, ${address.state}`
        }
    }

    function formatPreviousZip(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            let address = JSON.parse(tenantProfile?.tenant_previous_address)
            return `${address.zip}`
        }
    }

    function formatPreviousUnit(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            let address = JSON.parse(tenantProfile?.tenant_previous_address)
            return `${address.unit}`
        }
    }

    function formatTenantVehicleInfo(){
        if (!tenantProfile){
            return "No Vehicle Information"
        } else{
            let info = JSON.parse(tenantProfile?.tenant_vehicle_info)
            
        }
    }

    useEffect(() => {
        const getTenantProfileInformation = async () => {

            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantProfile/${getProfileId()}`)
            const data = await response.json()
            const tenantProfileData = data.Profile.result[0]
            setTenantProfile(tenantProfileData)
            console.log("tenantProfileData", tenantProfileData)
        }
        getTenantProfileInformation()
    }, []);

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
                        {formattedAddress()}
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
                            {tenantProfile?.tenant_first_name} {tenantProfile?.tenant_last_name}
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
                            {tenantProfile?.teannt_phone_number}
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
                            {tenantProfile?.tenant_phone_number}
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
                            {tenantProfile?.tenant_ssn}
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
                            {tenantProfile?.tenant_drivers_license_number}
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
                            {tenantProfile?.tenant_drivers_license_state} 
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
                            ${tenantProfile?.tenant_current_salary}
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
                            {tenantProfile?.tenant_salary_frequency}
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
                            {tenantProfile?.tenant_current_job_company}
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
                            {tenantProfile?.tenant_current_job_title}
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
                            {formatPreviousAddress()}
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
                            {formatPreviousUnit()}
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
                            {formatPreviousCityState()}
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
                            {formatPreviousZip()}
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
                            onClick={() => navigate("/tenantProfileEdit")}
                        >
                            Edit
                        </Button>
                    </Grid>

                    
                </Grid>
            </Paper>
        </ThemeProvider>
    )
}