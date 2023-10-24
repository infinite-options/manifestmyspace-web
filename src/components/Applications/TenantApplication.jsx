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
    console.log(property)

    const [tenantProfile, setTenantProfile] = useState(null);
    
    const [vehicles, setVehicles] = useState(null);
    const [adultOccupants, setAdultOccupants] = useState(null);
    const [petOccupants, setPetOccupants] = useState(null);
    const [childOccupants, setChildOccupants] = useState(null);


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
            setVehicles(info)
            for (const vehicle of info){
                console.log(vehicle)
            }
        }
    }

    function formatTenantAdultOccupants(){
        if (!tenantProfile){
            return "No Adult Occupants"
        } else {
            let info = JSON.parse(tenantProfile?.tenant_adult_occupants)
            setAdultOccupants(info)
            for (const occupant of info){
                console.log(occupant)
            }
        }
    }

    function formatTenantPetOccupants(){
        if (!tenantProfile){
            return "No Adult Occupants"
        } else {
            let info = JSON.parse(tenantProfile?.tenant_pet_occupants)
            setPetOccupants(info)
            for (const pet of info){
                console.log(pet)
            }
        } 
    }
    function formatTenantChildOccupants(){
        if (!tenantProfile){
            return "No Adult Occupants"
        } else {
            let info = JSON.parse(tenantProfile?.tenant_children_occupants)
            setChildOccupants(info)
            for (const child of info){
                console.log(child)
            }
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

    useEffect(() => {
        formatTenantVehicleInfo()
        formatTenantAdultOccupants()
        formatTenantPetOccupants()
        formatTenantChildOccupants()
    }, [tenantProfile])

    function handleApplicationSubmit(){
        //submit to backend
        console.log("Application Submitted")
        console.log("should call /annoucements")
        console.log("should call /leases")
        let date = new Date()


        const annoucementsResponse = fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "announcement_title" : "New Tenant App",
                "announcement_msg" : "You have a new tenant application for your property",
                "announcement_sender": getProfileId(),
                "announcement_date": date.toDateString(),
                "announcement_properties": property.property_uid,
                "announcement_mode": "",
                "announcement_receiver": "",
                "announcement_type": "",
                "Email": 1,
                "Text": 1,
                "App": 1,
            })
        })

        const leaseApplicationResponse = fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "lease_property_id": property.property_uid,
                "lease_start": "2023-11-01",
                "lease_end": "2024-10-31",
                "lease_status": "Application",
                "lease_assigned_contacts": "[]",
                "lease_documents": "[]",
                "lease_adults": JSON.stringify(adultOccupants),
                "lease_children": JSON.stringify(childOccupants),
                "lease_pets": JSON.stringify(petOccupants),
                "lease_vehicles": "[]", //JSON.stringify(vehicles),
                "lease_referred": "[]",
                "lease_rent": "[]",
                "lease_effective_date": "2023-11-01",
            })
        })
    }

                    
//     "lease_property_id":"200-000022"
//     , "lease_start":"2023-11-01"
//     , "lease_end":"2023-10-31"
//     , "lease_status":"Application"
//     , "lease_assigned_contacts":"[{\"email\": \"pmarathay@gmail.com\", \"last_name\": \"Marathay\", \"first_name\": \"Prashant\", \"company_role\": \"Property Manager\", \"phone_number\": \"(408) 476-0001\"}]"
//     , "lease_documents":"[]"
//     , "lease_adults":"[]"
//     , "lease_children":"[]"
//     , "lease_pets":"[]"
//     , "lease_vehicles":"[]"
//     , "lease_referred":"[]"
//     , "lease_effective_date":"2023-11-01"

    return(
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    paddingBottom: "50px",
                }}
            >
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
                                {tenantProfile?.tenant_email}
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
                                {adultOccupants?.length} Adults
                            </Typography>
                            {adultOccupants && adultOccupants.map((occupant, index) => (
                                <Typography
                                    sx={{
                                        justifySelf: 'center',
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.light.fontWeight,
                                        fontSize: theme.typography.smallFont
                                    }}
                                    key={index}
                                >
                                    {occupant.name} {occupant.last_name} | {occupant.relationship} | DOB: {occupant.dob}
                                </Typography>    
                            ))}
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
                                {childOccupants?.length} Children
                            </Typography>
                            {childOccupants && childOccupants.map((occupant, index) => (
                                <Typography
                                    sx={{
                                        justifySelf: 'center',
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.light.fontWeight,
                                        fontSize: theme.typography.smallFont
                                    }}
                                    key={index}
                                >
                                    {occupant.name} {occupant.last_name} | {occupant.relationship} | DOB: {occupant.dob}
                                </Typography>    
                            ))}
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
                                {petOccupants?.length} Pets
                            </Typography>
                                {/* <Typography
                                    sx={{
                                        justifySelf: 'center',
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.light.fontWeight,
                                        fontSize: theme.typography.smallFont
                                    }}
                                >
                                    Otto | Cat | 16 lbs | 2 years old
                                </Typography> */}
                                {petOccupants && petOccupants.map((occupant, index) => (
                                    <Typography
                                        sx={{
                                            justifySelf: 'center',
                                            color: theme.typography.primary.black,
                                            fontWeight: theme.typography.light.fontWeight,
                                            fontSize: theme.typography.smallFont
                                        }}
                                        key={index}
                                    >
                                        {occupant.name} {occupant.last_name} | {occupant.relationship} | DOB: {occupant.dob}
                                    </Typography>    
                                ))}
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
                                {vehicles?.length} Vehicles
                            </Typography>
                            {vehicles && vehicles.map((vehicle, index) => (
                                <Typography
                                    sx={{
                                        justifySelf: 'center',
                                        color: theme.typography.primary.black,
                                        fontWeight: theme.typography.light.fontWeight,
                                        fontSize: theme.typography.smallFont
                                    }}
                                    key={index}
                                >
                                    {vehicle.make} {vehicle.model} | {vehicle.year} | {vehicle.license} | {vehicle.state}
                                </Typography>    
                            ))}
                            {/* <Typography
                                sx={{
                                    justifySelf: 'center',
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.light.fontWeight,
                                    fontSize: theme.typography.smallFont
                                }}
                            >
                                Porsche Cayenne S | SUV | ASD1235 | CA
                            </Typography> */}
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
                                onClick={() => handleApplicationSubmit()}
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
            </Box>
        </ThemeProvider>
    )
}