import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider, 
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    ListItemText,
    Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';


function QuoteRequestForm(){
    return (
        // form
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
        }}>
            <Stack spacing={2} sx={{
                width: "100%",
                maxWidth: "500px",
            }}>

                <FormControl sx={{ m: 1, width: "100%" }}>
                    <InputLabel id="demo-multiple-checkbox-label">Service Type</InputLabel>
                    <Select>

                    </Select>
                </FormControl>
            </Stack>
        </Box>
    )
}

export default function MaintenanceQuoteRequestPage(){

    const location = useLocation();
    let navigate = useNavigate();

    const maintenanceItem = location.state.maintenanceItem;

    return (
        <div>
            <h1>Maintenance Quote Request Page</h1>
        </div>
    )
}