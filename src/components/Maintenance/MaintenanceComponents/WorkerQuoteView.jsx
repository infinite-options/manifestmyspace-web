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
    responsiveFontSizes,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import { useUser } from "../../../contexts/UserContext";
import ManagerProfileLink from "./ManagerProfileLink";
import QuoteDetailInfo from "../Worker/QuoteDetailInfo";


export default function WorkerQuoteView({maintenanceItem}){
    return (
        <Grid container direction="column" columnSpacing={6} rowSpacing={6}>
            <ManagerProfileLink maintenanceItem={maintenanceItem}/>
            <Grid item xs={12} sx={{
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box
                    variant="contained"
                    disableElevation
                    sx={{
                        flexDirection: "column",
                        backgroundColor: "#D6D5DA",
                        textTransform: "none",
                        paddingRight: "10px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "10px",
                        paddingLeft: "10px",
                        display: 'flex',
                        width: "flex",
                    }}
                >
                    <QuoteDetailInfo maintenanceItem={maintenanceItem}/>
                    {maintenanceItem?.quote_status == "REFUSED" && 
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont}}>
                            Quote Refused
                        </Typography>
                    }
                </Box>
            </Grid>
            <Grid item xs={12} sx={{
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Notes
                </Typography>
                <Box
                    variant="contained"
                    disableElevation
                    sx={{
                        backgroundColor: "#D6D5DA",
                        textTransform: "none",
                        paddingRight: "10px",
                        borderRadius: "10px",
                        paddingLeft: "10px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        display: 'flex',
                        width: "flex",
                    }}
                >
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                        {/* {console.log("[DEBUG]", maintenanceItem?.quote_notes)} */}
                        {maintenanceItem?.quote_notes === "" || maintenanceItem?.quote_notes === undefined || maintenanceItem?.quote_notes === null ? "No Notes" : maintenanceItem.quote_notes}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    )
}