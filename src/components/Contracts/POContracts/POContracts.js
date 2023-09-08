import { Box, ThemeProvider, createTheme } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import ReturnArrow from '../../../images/refund_back.png'
import ArrowDown from '../../../images/ArrowDown.png'
import theme from '../../../theme/theme';
import {
    Typography,
    Button
} from '@mui/material';

// const theme = createTheme({
//     palette: {
//         background: {
//             basic: '#000000',
//             gray: '#F2F2F2',
//             blue: '#3D5CAC',
//         },
//         text: {
//             blue: '#3D5CAC',
//             gray: '#F2F2F2',
//             darkblue: '#160449',
//         },
//     },
// });
function POContracts(props) {
    
    const statusList = ["Applications", "Leases", "Agreements", "Notices", "Contracts"];
    const statusColor = ['#A52A2A', '#FF8A00', '#FFC614', '#3D5CAC', '#160449'];
    const [tabStatus, setTabStatus] = useState(0);
   
    const navigate = useNavigate();
    function getColor(status) {
        return statusColor[status];
    }
    function navigateTo(url) {
        navigate(url);
    }

    const result = [
        {
            business_uid: "600-000019",
            business_user_id: "100-000082",
            business_type: "MANAGEMENT",
            business_name: "Priyanka Management Business",
            business_phone_number: "(408) 355-8277",
            business_email: "priyanka01cornelius@gmail.com",
            business_ein_number: "123",
            business_services_fees: "[{\"of\: \"Gross Rent\", \"charge\: \"5%\", \"fee_name\: \"Service charge\", \"fee_type\: \"$\", \"frequency\: \"Weekly\"}]",
            business_locations: [{"distance": 10, "location": "San Jose"}],
            business_paypal: null,
            business_apple_pay: null,
            business_zelle: "priyanka01cornelius@gmail.com",
            business_venmo: null,
            business_account_number: null,
            business_routing_number: null,
            business_documents: "[]",
            business_address: null,
            business_unit: null,
            business_city: null,
            business_state: null,
            business_zip: null,
            distance: "10",
            location: "San Jose"
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                fontFamily: 'Source Sans Pro',
                color: 'text.darkblue',
                padding: '15px',
            }}>
                <Box sx={{
                    backgroundColor: 'background.gray',
                    borderRadius: "10px",
                    padding: '10px',
                    paddingLeft: '15px',
                    paddingRight: '15px',
                }}>
                     <Box sx={{
                            padding: '13px',
                            backgroundColor: '#F2F2F2',
                            borderRadius: "9px",
                        }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Box sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'text.darkblue',
                        }} >
                            Search For Property Manager
                        </Box>
                       
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.blue',
                        fontWeight: 'bold',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <img src={ReturnArrow}/>
                            <Box>
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Return to Viewing Property Manager</Typography>
                            </Box>
                        </Box>
                        {/* <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        </Box> */}
                    </Box>
        
                    <Box sx={{
                        position: 'relative',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        top: '10px',
                    }}>
                        
                        <Box sx={{
                            padding: '13px',
                            backgroundColor: '#D6D5DA',
                            borderRadius: "10px",
                        }}>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                            <DocumentCard data={result[0]}/>
                
                        </Box>
                    </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

function NavTab(props) {
    const color = props.color;
    return (
        <Box sx={{
            backgroundColor: color,
            width: '20%',
            height: '60px',
            borderRadius: '10px',
        }}>
            <Box sx={{
                marginTop: '5px',
            }}>
                {props.children}
            </Box>
        </Box>
    )

}

function DocumentCard(props) {

    const obj = props.data

    return (
        <Box sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '5px',
            marginBottom: '10px',
            fontSize: '13px',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                }}>
                    {obj.business_name}
                </Box>
               {/*  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{
                        marginRight: '3px',
                    }}>
                         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10.5L2.625 6.125L3.85 4.85625L6.125 7.13125V0H7.875V7.13125L10.15 4.85625L11.375 6.125L7 10.5ZM1.75 14C1.26875 14 0.856626 13.8285 0.513626 13.4855C0.170626 13.1425 -0.000581848 12.7307 1.48557e-06 12.25V9.625H1.75V12.25H12.25V9.625H14V12.25C14 12.7312 13.8285 13.1434 13.4855 13.4864C13.1425 13.8294 12.7307 14.0006 12.25 14H1.75Z" fill="#3D5CAC" />
                        </svg> 
                    </Box>
                    <Box>
                         <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 10.625C9.67361 10.625 10.625 9.67361 10.625 8.5C10.625 7.32639 9.67361 6.375 8.5 6.375C7.32639 6.375 6.375 7.32639 6.375 8.5C6.375 9.67361 7.32639 10.625 8.5 10.625Z" fill="#3D5CAC" />
                            <path d="M16.4369 8.31938C15.812 6.70313 14.7273 5.30539 13.3167 4.29892C11.9062 3.29245 10.2316 2.72137 8.5 2.65625C6.7684 2.72137 5.09383 3.29245 3.68326 4.29892C2.2727 5.30539 1.18796 6.70313 0.563124 8.31938C0.520925 8.43609 0.520925 8.56391 0.563124 8.68062C1.18796 10.2969 2.2727 11.6946 3.68326 12.7011C5.09383 13.7075 6.7684 14.2786 8.5 14.3438C10.2316 14.2786 11.9062 13.7075 13.3167 12.7011C14.7273 11.6946 15.812 10.2969 16.4369 8.68062C16.4791 8.56391 16.4791 8.43609 16.4369 8.31938ZM8.5 11.9531C7.81704 11.9531 7.14941 11.7506 6.58155 11.3712C6.01368 10.9917 5.57109 10.4524 5.30973 9.82145C5.04837 9.19048 4.97999 8.49617 5.11322 7.82633C5.24646 7.15649 5.57534 6.5412 6.05827 6.05827C6.5412 5.57534 7.15649 5.24647 7.82633 5.11323C8.49617 4.97999 9.19048 5.04837 9.82145 5.30973C10.4524 5.57109 10.9917 6.01368 11.3712 6.58155C11.7506 7.14941 11.9531 7.81704 11.9531 8.5C11.9517 9.41539 11.5875 10.2929 10.9402 10.9402C10.2929 11.5875 9.41539 11.9517 8.5 11.9531Z" fill="#3D5CAC" />
                        </svg>
                    </Box> 
                </Box>*/}
            </Box>
            <Box>
                
            </Box>
            <Box sx={{
                display: 'grid',
            }}>
                                    {/* {obj.business_services_fees.map(feeOjb =>{
                                        
                                    })} */}
                
                <Box>
                    Area of service: {obj.business_locations[0].location} +- {obj.business_locations[0].distance} miles
                </Box>
                <Box>
                
                
                <Button 
                sx={{
                    textTransform: 'none',
                    color:'#160449',
                    width: `45%`,
                    height: `85%`,
                    left: `1%`,
                    right: `1%`,
                    top: `10%`,
                    fontSize: `11px`
                }} ><div>
                    <img src={ArrowDown}/>Estimated Fees
                    </div></Button>
                <Button 
                variant="contained"
                sx={{
                    textTransform: 'none',
                    background: '#3D5CAC',
                    color: theme.palette.background.default,
                    width: `40%`,
                    height: `85%`,
                    left: `15%`,
                    top: `10%`,
                    borderRadius: '10px 10px 10px 10px',
                    fontSize: `10px`
                }} >
                    Request Quote
                    </Button>
                </Box>
                <Box>
                    
                </Box>
            </Box>
        </Box>
    );
}

export default POContracts;