import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';

function TenantLeases(props) {

    const [tenantLeases, setTenantLeases] = useState([]);
    useEffect(() => {
        axios.get('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/350-000038')
            .then((res) => {
                const fetchData = res.data['Lease Details'].result;
                // console.log(fetchData[0]);
                setTenantLeases(fetchData[0]);
            });
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
    return (
        <Box sx={{
            fontFamily: 'Source Sans Pro',
            padding: '30px',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                color: '#160449',
            }}>
                <Box>
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z" fill="#160449" />
                    </svg>
                </Box>
                <Box sx={{
                    fontSize: '25px',
                    fontWeight: 'bold',
                }}>
                    Lease
                </Box>
                <Box>

                </Box>
            </Box>
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
                        fontSize: '11px',
                        fontWeight: '600',
                    }}>
                        103 N. Abel St unit #104
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
                                {tenantLeases.lease_start}
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
                                {tenantLeases.lease_end}
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
                                ${tenantLeases.late_fee}
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
                                {getDayText(tenantLeases.due_by)} of month
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
                                {'?'}
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
                                {tenantLeases.lease_end}
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
                                ${tenantLeases.perDay_late_fee}
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
                                {'?'}
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
                                {'?'}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                }}>
                    <Box sx={{
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
                    }}>
                        End Lease
                    </Box>
                    <Box sx={{
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
                    }}>
                        Renew Lease
                    </Box>
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
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.96875 1.1875C8.96875 1.12948 8.9457 1.07384 8.90468 1.03282C8.86366 0.991797 8.80802 0.96875 8.75 0.96875H2.625C1.98682 0.96875 1.37478 1.22226 0.923524 1.67352C0.472265 2.12478 0.21875 2.73682 0.21875 3.375V15.625C0.21875 16.2632 0.472265 16.8752 0.923524 17.3265C1.37478 17.7777 1.98682 18.0312 2.625 18.0312H11.375C12.0132 18.0312 12.6252 17.7777 13.0765 17.3265C13.5277 16.8752 13.7812 16.2632 13.7812 15.625V7.00363C13.7812 6.94561 13.7582 6.88997 13.7172 6.84895C13.6762 6.80792 13.6205 6.78488 13.5625 6.78488H9.625C9.45095 6.78488 9.28403 6.71573 9.16096 6.59266C9.03789 6.46959 8.96875 6.30267 8.96875 6.12863V1.1875ZM9.625 9.71875C9.79905 9.71875 9.96597 9.78789 10.089 9.91096C10.2121 10.034 10.2812 10.201 10.2812 10.375C10.2812 10.549 10.2121 10.716 10.089 10.839C9.96597 10.9621 9.79905 11.0312 9.625 11.0312H4.375C4.20095 11.0312 4.03403 10.9621 3.91096 10.839C3.78789 10.716 3.71875 10.549 3.71875 10.375C3.71875 10.201 3.78789 10.034 3.91096 9.91096C4.03403 9.78789 4.20095 9.71875 4.375 9.71875H9.625ZM9.625 13.2188C9.79905 13.2188 9.96597 13.2879 10.089 13.411C10.2121 13.534 10.2812 13.701 10.2812 13.875C10.2812 14.049 10.2121 14.216 10.089 14.339C9.96597 14.4621 9.79905 14.5312 9.625 14.5312H4.375C4.20095 14.5312 4.03403 14.4621 3.91096 14.339C3.78789 14.216 3.71875 14.049 3.71875 13.875C3.71875 13.701 3.78789 13.534 3.91096 13.411C4.03403 13.2879 4.20095 13.2188 4.375 13.2188H9.625Z" fill="#3D5CAC" />
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
    )
}
export default TenantLeases;