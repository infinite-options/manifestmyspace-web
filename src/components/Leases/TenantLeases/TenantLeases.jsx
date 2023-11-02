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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import backButton from '../../Payments/backIcon.png';
import theme from '../../../theme/theme';

function TenantLeases(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { getProfileId } = useUser();
    const [tenantLeases, setTenantLeases] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [property, setProperty] = useState(location.state.property)
    const [status, setStatus] = useState(location.state.status)
    const [lease, setLease] = useState(location.state.lease)
    useEffect(() => {
        console.log("property", property)
        console.log("status", status);
        console.log("lease", lease);
    }, [])

    function getDayText(day) {
        switch (day % 10) {
            case 1:
                return day + 'st';
            case 2:
                return day + 'nd';
            case 3:
                return day + 'rd';
            default:
                return day + 'th';
        }
    }

    async function handleTenantRefuse(){
        const response =  await fetch(
            `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lease_uid: lease.lease_uid,
                    lease_status: "REFUSED",
                }),
            }
        );
        const data = await response.json();
    }

    async function handleTenantAccept(){

        const status = "TENANT APPROVED";
        const date = new Date();

        if (lease.lease_effective_date < date) {
            status = "ACTIVE";
        }

        const response =  await fetch(
            `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lease_uid: lease.lease_uid,
                    lease_status: status,
                }),
            }
        );
        const data = await response.json();
        navigate(-1)
    }

    return (
        <Box sx={{
            fontFamily: 'Source Sans Pro',
            padding: '30px',
        }}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container>
                <Grid item xs={2}>
                    <Button
                            onClick={() => navigate(-1)}
                            sx={{
                                textTransform: 'none',
                                textDecoration: 'underline',
                            }}
                        >
                            <img src={backButton} style={{width: '20px', height: '20px', margin:'5px'}}/>
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: '#160449',
                    }}>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.medium.fontWeight,
                                fontSize: '25px'
                            }}>
                            Lease
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
            <Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#160449',
                }}>
                    <Box sx={{
                        height: '30px',
                        width: '30px',
                        backgroundColor: '#bbb',
                        borderRadius: '50%',
                        marginRight: '5px',
                    }}>

                    </Box>
                    <Box sx={{
                        fontSize: '15px',
                        fontWeight: '600',
                    }}>
                        {lease.property_address}
                    </Box>
                </Box>
            </Box>
            <hr />
            <Box sx={{
                backgroundColor: '#F2F2F2',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                padding: '15px',
                justifyContent: 'center',
                alignItems: 'center',

                color: '#3D5CAC',
            }}>
                <Box sx={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#160449',
                }}>
                    Viewing Current Lease
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}>
                    <Box sx={{
                        margin: '20px',
                    }}>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Start Date
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {lease.lease_start}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Rent
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                ${lease.lease_actual_rent}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Late Fee After
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                ${lease.lease_rent_late_fee}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Rent Due Date
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {getDayText(lease.lease_rent_due_by)} of month
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Move In Date
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {'?'}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                # of Pets
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {console.log(JSON.parse(lease.lease_pets))}
                                {JSON.parse(lease.lease_pets).length}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Utilities
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {JSON.parse(lease.lease_vehicles).length}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        margin: '20px',
                    }}>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                End Date
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {lease.lease_end}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Rent Frequency
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {tenantLeases.frequency}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Late Fee Per Day
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                ${lease.lease_rent_perDay_late_fee}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                Available to Pay
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {tenantLeases.available_topay} days before
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                # of Occupants
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {JSON.parse(lease.lease_adults).length + JSON.parse(lease.lease_children).length}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                # of Vehicles
                            </Box>
                            <Box sx={{
                                fontSize: '14px',
                                marginTop: '5px',
                                marginLeft: '10px',
                                marginBottom: '10px',
                            }}>
                                {JSON.parse(lease.lease_vehicles).length}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}>
                                View Lease
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'left',
                                alignItems: 'center',
                                width: '90%',
                                margin: '10px',
                            }}>
                                <Box>
                                    <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.96875 1.1875C8.96875 1.12948 8.9457 1.07384 8.90468 1.03282C8.86366 0.991797 8.80802 0.96875 8.75 0.96875H2.625C1.98682 0.96875 1.37478 1.22226 0.923524 1.67352C0.472265 2.12478 0.21875 2.73682 0.21875 3.375V15.625C0.21875 16.2632 0.472265 16.8752 0.923524 17.3265C1.37478 17.7777 1.98682 18.0312 2.625 18.0312H11.375C12.0132 18.0312 12.6252 17.7777 13.0765 17.3265C13.5277 16.8752 13.7812 16.2632 13.7812 15.625V7.00363C13.7812 6.94561 13.7582 6.88997 13.7172 6.84895C13.6762 6.80792 13.6205 6.78488 13.5625 6.78488H9.625C9.45095 6.78488 9.28403 6.71573 9.16096 6.59266C9.03789 6.46959 8.96875 6.30267 8.96875 6.12863V1.1875ZM9.625 9.71875C9.79905 9.71875 9.96597 9.78789 10.089 9.91096C10.2121 10.034 10.2812 10.201 10.2812 10.375C10.2812 10.549 10.2121 10.716 10.089 10.839C9.96597 10.9621 9.79905 11.0312 9.625 11.0312H4.375C4.20095 11.0312 4.03403 10.9621 3.91096 10.839C3.78789 10.716 3.71875 10.549 3.71875 10.375C3.71875 10.201 3.78789 10.034 3.91096 9.91096C4.03403 9.78789 4.20095 9.71875 4.375 9.71875H9.625ZM9.625 13.2188C9.79905 13.2188 9.96597 13.2879 10.089 13.411C10.2121 13.534 10.2812 13.701 10.2812 13.875C10.2812 14.049 10.2121 14.216 10.089 14.339C9.96597 14.4621 9.79905 14.5312 9.625 14.5312H4.375C4.20095 14.5312 4.03403 14.4621 3.91096 14.339C3.78789 14.216 3.71875 14.049 3.71875 13.875C3.71875 13.701 3.78789 13.534 3.91096 13.411C4.03403 13.2879 4.20095 13.2188 4.375 13.2188H9.625Z" fill="#3D5CAC" />
                                    </svg>
                                </Box>
                                <Box sx={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    padding: '10px',
                                }}>
                                    View lease document
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between', // changed from 'center' to 'space-between'
                    alignItems: 'center', // added for vertical alignment, if needed
                    width: '100%',
                    padding: '0 20px', // optional: added padding to the sides of the container
                }}>
                    <Button 
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#CB8E8E',
                            borderRadius: '5px',
                            padding: '5px',
                            minWidth: '150px',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                        onClick={() => handleTenantRefuse()}
                    >
                        Reject Lease
                    </Button>
                    <Button 
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#9EAED6',
                            borderRadius: '5px',
                            padding: '5px',
                            minWidth: '150px',
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                        onClick={() => handleTenantAccept()}
                    >
                        Accept Lease
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
export default TenantLeases;