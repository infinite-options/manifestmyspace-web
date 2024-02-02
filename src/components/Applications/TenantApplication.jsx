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
import { Form, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import backButton from '../Payments/backIcon.png';

export default function TenantApplication(){
    const location = useLocation();
    const navigate = useNavigate();
    const { user, getProfileId, roleName } = useUser();


    const [property, setProperty] = useState(location.state.property)
    const [status, setStatus] = useState(location.state.status)
    const [lease, setLease] = useState(location.state.lease)
    console.log("status", status)
    console.log(property)

    const [tenantProfile, setTenantProfile] = useState(null);
    
    const [vehicles, setVehicles] = useState(null);
    const [adultOccupants, setAdultOccupants] = useState(null);
    const [petOccupants, setPetOccupants] = useState(null);
    const [childOccupants, setChildOccupants] = useState(null);

    const [tenantDocuments, setTenantDocuments] = useState([]);


    function formatDocumentType(type) {
        switch(type){            
            case "income_proof": return "Proof of Income";
            case "bank_statement": return "Bank Statement";
            case "id": return "ID";
            case "renters_insurance_proof": return "Proof of Renter's Insurance";
            case "ssn": return "SSN";
            case "credit_report": return "Credit Report";
            case "reference": return "Reference";
            case "other": return "Other";
            
            default: return "";            
        }
    }
    function formattedAddress(){
        return `${property.property_address} ${property.property_unit} ${property.property_city} ${property.property_state} ${property.property_zip}`
    }

    function formatTenantAddress(){
        if (!tenantProfile){ return "No Previous Address"} 
        else { return `${tenantProfile.tenant_address}` }
    }

    function formatTenantCityState(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            return `${tenantProfile.tenant_city}, ${tenantProfile.tenant_state}`
        }
    }

    function formatTenantZip(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            return `${tenantProfile.tenant_zip}`
        }
    }

    function formatTenantUnit(){
        if (!tenantProfile){
            return "No Previous Address"
        } else{
            return `${tenantProfile.tenant_unit}`
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
            console.log(tenantProfile?.tenant_adult_occupants)
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
        setTenantDocuments(tenantProfile? JSON.parse(tenantProfile?.tenant_documents): []);
    }, [tenantProfile])

    function getApplicationDate(){
        return "10-31-2023"
    }

    function displaySSN(){
        return `Last 4 digits: ${tenantProfile?.tenant_ssn.slice(-4)}`
    }

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
                "announcement_title" : "New Tenant Application",
                "announcement_msg" : "You have a new tenant application for your property",
                "announcement_sender": getProfileId(),
                "announcement_date": date.toDateString(),
                "announcement_properties": property.contract_property_id,
                "announcement_mode": "LEASE",
                "announcement_receiver": property.contract_business_id,
                "announcement_type": ["App"]
            })
        })

        const leaseApplicationData = new FormData();
        leaseApplicationData.append('lease_property_id', property.property_uid)
        leaseApplicationData.append('lease_status', "NEW")
        leaseApplicationData.append('lease_assigned_contacts', JSON.stringify([getProfileId()]))
        leaseApplicationData.append('lease_documents', "[]")
        leaseApplicationData.append('lease_adults', tenantProfile?.tenant_adult_occupants)
        leaseApplicationData.append('lease_children', tenantProfile?.tenant_children_occupants)
        leaseApplicationData.append('lease_pets', tenantProfile?.tenant_pet_occupants)
        leaseApplicationData.append('lease_vehicles', tenantProfile?.tenant_vehicle_info)
        leaseApplicationData.append('lease_referred', "[]")
        leaseApplicationData.append('lease_rent', "[]")
        leaseApplicationData.append('lease_application_date', date.toLocaleDateString())
        leaseApplicationData.append('tenant_uid', getProfileId())
        
        const leaseApplicationResponse = fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
            method: 'POST',
            body: leaseApplicationData
        })

        

        Promise.all([annoucementsResponse, leaseApplicationResponse]).then((values) => {
            navigate("/listings") // send success data back to the propertyInfo page
        })
    }

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
                <Box
                    component="span"
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    position='relative'
                    sx={{  paddingBottom: "10px"}}
                >
                   <Button
                        // onClick={() => navigate("-1")}
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
                <Divider light />
                {status ? (
                    <Box
                        component="span"
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        position='relative'
                        sx={{  padding: "10px"}}
                    >
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.secondaryFont
                            }}
                        >
                            Applied on {lease.lease_application_date}
                        </Typography>
                    </Box>   
                ) : (null)}
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
                                {/* {tenantProfile?.tenant_ssn} */}
                                {displaySSN()}
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
                                {formatTenantAddress()}
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
                                {formatTenantUnit()}
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
                                {formatTenantCityState()}
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
                                {formatTenantZip()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    justifySelf: 'center',
                                    color: theme.typography.common.blue,
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
                                        {occupant.name} {occupant.type} | {occupant.relationship} | DOB: {occupant.dob}
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
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    justifySelf: 'center',
                                    color: theme.typography.common.blue,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.secondaryFont
                                }}
                            >
                                Your Documents:
                            </Typography>
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '5px',
                                    color: theme.typography.common.blue,
                                }}
                            >
                                <Box>Filename</Box>
                                <Box>Type</Box>
                                
                            </Box>
                            {[...tenantDocuments].map((doc, i) => (
                                <>                                
                                    <Box
                                        key={i} 
                                        sx={{
                                            display:'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                            <Box
                                                sx={{
                                                    // height: '16px',
                                                    width: '100%', 
                                                    
                                                    
                                                    cursor: 'pointer', // Change cursor to indicate clickability
                                                    color: '#3D5CAC',
                                                }}
                                            >
                                            {doc.filename}
                                            </Box>
                                        </a>
                                        {formatDocumentType(doc.type)}
                                        
                                    </Box>
                                </>                                        
                            ))}
                        </Grid>
                        {status ? (
                          null
                        ) : (
                            <>
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
                            </>
                        )}
                    </Grid>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}