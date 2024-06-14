import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, Container, Grid, responsiveFontSizes } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import APIConfig from "../../utils/APIConfig";
import Leases from "./Leases";
import axios from "axios";
import theme from "../../theme/theme";


export default function LeasesDashboard() {
    const [leaseDetails, setLeaseDetails] = useState([]);
    const [selectedLeaseId, setSelectedLeaseId] = useState(0);
    const [dataReady, setDataReady] = useState(true);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        // axios.get(`${APIConfig.baseURL.dev}/leaseDetails/${getProfileId()}`).then((res) => {
        axios.get(`${APIConfig.baseURL.dev}/leaseDetails/110-000003`).then((res) => {
            const fetchData = res.data["Lease_Details"].result;
            if (res.status === 200) {
                console.log('In Leases dashboard', fetchData);
                setLeaseDetails(fetchData);
                setDataReady(true);
            } 
        }).catch(err => {
            console.log("Error in fetching lease details", err)
        })

        setShowSpinner(false);
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ paddingTop: '10px', paddingBottom: '20px', marginTop: theme.spacing(2) }}>
                {showSpinner || !dataReady ? (
                    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (<Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <Leases leaseDetails={leaseDetails} setSelectedLeaseId={setSelectedLeaseId} />
                    </Grid>
                    <Grid item xs={12} md={8}>

                    </Grid>
                </Grid>)}
            </Container>
        </ThemeProvider>
    )
};