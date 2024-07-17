import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, Container, Grid } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import APIConfig from "../../utils/APIConfig";
import Leases from "./Leases";
import axios from "axios";
import theme from "../../theme/theme";
import RenewLease from "./RenewLease";
import { useUser } from '../../contexts/UserContext';
import EndLeaseButton from "./EndLeaseButton";


export default function LeasesDashboard() {
    const [leaseDetails, setLeaseDetails] = useState([]);
    const [selectedLeaseId, setSelectedLeaseId] = useState(null);
    const [dataReady, setDataReady] = useState(false);
    const { getProfileId, isManager, roleName, selectedRole } = useUser();
    const [isEndClicked, setIsEndClicked] = useState(false);
    const [currentLease, setCurrentLease] = useState(null);

    useEffect(() => {
        axios.get(`${APIConfig.baseURL.dev}/leaseDetails/${getProfileId()}`).then((res) => {
        //axios.get(`${APIConfig.baseURL.dev}/leaseDetails/110-000003`).then((res) => {
            const fetchData = res.data["Lease_Details"].result;
            if (res.status === 200) {
                console.log('In Leases dashboard', fetchData);
                setLeaseDetails(fetchData);
                // setSelectedLeaseId(fetchData[0].lease_uid);
                const filtered = fetchData.find(lease => lease.lease_uid === selectedLeaseId);
                setCurrentLease(filtered);
                setDataReady(true);
            }
        }).catch(err => {
            console.log("Error in fetching lease details", err)
        })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ paddingTop: '10px', paddingBottom: '20px', marginTop: theme.spacing(2) }}>
                {!dataReady ? (
                    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (<Grid container spacing={5}>
                    <Grid item xs={12} md={leaseDetails && leaseDetails.length > 0 ? 4: 12}>
                        <Leases leaseDetails={leaseDetails} setSelectedLeaseId={setSelectedLeaseId} />
                    </Grid>
                    {selectedLeaseId != null && isEndClicked === false && (<Grid item xs={12} md={8}>
                        <RenewLease leaseDetails={leaseDetails} selectedLeaseId={selectedLeaseId} setIsEndClicked={setIsEndClicked}/>
                    </Grid>)}
                    {selectedLeaseId != null && isEndClicked === true && (<Grid item xs={12} md={8}>
                        <EndLeaseButton theme={theme} leaseData={currentLease} setIsEndClicked={setIsEndClicked}/>
                    </Grid>)}
                </Grid>)}
            </Container>
        </ThemeProvider>
    )
};