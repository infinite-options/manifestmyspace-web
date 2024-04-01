import React, { useEffect } from "react"
import theme from '../../theme/theme';
import { useParams, useLocation } from "react-router-dom"
import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
    Avatar,
} from "@mui/material";

import APIConfig from "../../utils/APIConfig";

export default function PublicProfile(){
    let { id } = useParams();
    const location = useLocation();

    let maintenanceItem = location.state.maintenanceItem
    let profile = location.state.profile

    console.log("id", id)
    console.log(maintenanceItem)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/profile/${profile}`);
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    }, [])

    function cardFormatting(role){
        if (role === "Property Owner") {
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.owner_first_name} {maintenanceItem.owner_last_name}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.owner_email ? maintenanceItem.owner_email : "Email Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.owner_phone_number ? maintenanceItem.owner_phone_number : "Phone Number Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem ? maintenanceItem.owner_address + " " + maintenanceItem.business_city + " " + maintenanceItem.business_state + " " + maintenanceItem.business_zip: "Address Not Available"}
                    </Typography>
                </Stack>
            )
        } else if (role === "Property Manager") {
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.business_name}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.owner_email ? maintenanceItem.owner_email : "Email Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.owner_phone_number ? maintenanceItem.owner_phone_number : "Phone Number Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.business_address && maintenanceItem.business_zip ? maintenanceItem.business_address + " " + maintenanceItem.business_city + " " + maintenanceItem.business_state + " " + maintenanceItem.business_zip: "Address Not Available"}
                    </Typography>
                </Stack>
            )
        } else if (role === "Tenant") {
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.tenant_first_name} {maintenanceItem.tenant_last_name}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.tenant_email ? maintenanceItem.tenant_email : "Email Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem.tenant_phone_number ? maintenanceItem.tenant_phone_number : "Phone Number Not Available"}
                    </Typography>
                    <Typography sx={{color: theme.typography.common.white, fontWeight: theme.typography.light.fontWeight, fontSize: "20px"}}>
                        {maintenanceItem ? maintenanceItem.tenant_address + " " + maintenanceItem.tenant_city + " " + maintenanceItem.tenant_state + " " + maintenanceItem.tenant_zip: "Address Not Available"}
                    </Typography>
                </Stack>
            )
        }
    }
    
    return (
        <ThemeProvider theme={theme}>
            <Box
            sx={{
                display: "flex" ,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}>
                <Typography sx={{margin: "20px", color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "25px"}}>
                    {profile} Profile
                </Typography>
           
                <Paper
                    sx={{
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
                        width: "95%", // Adjust width as needed
                        [theme.breakpoints.down("sm")]: {
                            width: "80%",
                        },
                        [theme.breakpoints.up("sm")]: {
                            width: "80%",
                        },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            padding: theme.spacing(2),
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Avatar
                            alt="Profile Image"
                            sx={{
                                width: "35px",
                                height: "35px",
                                marginBottom: theme.spacing(2),
                            }}
                        />
                       {cardFormatting(profile)}
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}