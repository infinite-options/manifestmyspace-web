import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Avatar,
} from '@mui/material';
import theme from '../../../theme/theme';
import CircularProgress from "@mui/material/CircularProgress";



function NewOwnerInquiry(props) {
    const { getProfileId } = useUser();
    const navigate = useNavigate();

    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        console.log("New Owner Inquiry UseEffect");
        
        const fetchData = async () => {
        setShowSpinner(true);
        
        // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000096`)
        
        
        // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)

        const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/600-000003`)
        const propertyData = await response.json();
        console.log(propertyData)

        setShowSpinner(false);
    };
    fetchData();
    }, []);

    const handleBackBtn = () => {
        navigate(-1);
    };



    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{
                backgroundColor: '#F2F2F2',
                borderRadius: '10px',
                margin: '25px',
                padding: '15px',
                fontFamily: 'Source Sans Pro',
            }}>
                <Stack 
                    flexDirection ="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        sx={{ padding: '0', minWidth: '150px' }}
                        onClick={handleBackBtn}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                                fill="#3D5CAC"
                            />
                        </svg>
                    </Button>
                    <Box sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'text.darkblue',
                            padding: '0',
                            minWidth: '300px',
                        }}
                    >
                        New Owner Inquiry
                    </Box>
                </Stack>
                <Box sx={{
                    display: 'flex',
                    padding: '5px',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    fontSize: '20px',
                    color: '#160449',
                    // color: '#3D5CAC',
                }}>
                    <Box
                        sx={{
                            minWidth: '130px',
                            height: '130px',
                            marginRight: '20px',
                            backgroundColor: 'grey',
                        }}
                    >
                        <img src={"https://squarefootphotography.com/wp-content/uploads/2022/01/SQFT-9754-min-scaled.jpg"} alt="Property Img" style={{
                            width: '130px',
                            height: '130px',
                        }} />
                        
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Box sx={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}>
                            {/* {getProperties(propertyStatus).length > 0 ? (`${getProperties(propertyStatus)[index].property_address}, ${(getProperties(propertyStatus)[index].property_unit !== null && getProperties(propertyStatus)[index].property_unit !== '' ? (getProperties(propertyStatus)[index].property_unit + ',') : (''))} ${getProperties(propertyStatus)[index].property_city} ${getProperties(propertyStatus)[index].property_state} ${getProperties(propertyStatus)[index].property_zip}`) : (<></>)} */}
                            789 Maple Lane, San Diego, CA 92101, USA
                        </Box>
                        <Box sx={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            paddingTop: '10px',
                        }}>
                            Owner:
                        </Box>
                        <Box sx={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}>
                            Steve Albini
                        </Box>
                        <Box sx={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            paddingTop: '5px',
                        }}>
                            Not Rented
                        </Box>
                        <Box sx={{
                            fontSize: '10px',
                            paddingTop: '10px',
                            color: '#3D5CAC',
                        }}>
                            3 hours ago
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        Management Agreement Name
                </Box>
                <TextInputField name="management_agreement_name" placeholder="Enter contract name" value={""} onChange={console.log("input changed")}>First Name</TextInputField>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                    alignItems: 'center',
                    marginBottom: '7px',
                    width: '100%',
                }}>
                    <Box>
                        <Box sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                        
                            Start Date
                        </Box>
                        <TextInputField name="start_date" placeholder="mm/dd/yy" value={""} onChange={() => {console.log("input changed")}}>First Name</TextInputField>
                    </Box>
                    <Box>
                        <Box sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                        
                            End Date
                        </Box>
                        <TextInputField name="end_date" placeholder="mm/dd/yy" value={""} onChange={console.log("input changed")}>First Name</TextInputField>
                    </Box>

                </Box>
                <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        Management Fees
                </Box>
                <Box sx={{
                            background: "#FFFFFF",
                            fontSize: '13px',
                            padding: '5px',
                            color: '#3D5CAC',
                            borderRadius: '5px',

                    }}
                >   
                    <Box>
                        Monthly service charge: {'15% of all rent'}
                    </Box>
                    <Box>
                        Tenant Setup Fee: $100
                    </Box>
                    <Box>
                        Annual Inspection Fee: $200
                    </Box>
                    <Box>
                        Re-Keying Charge: $200
                    </Box>
                    <Box>
                        Annual Postage and Communication Fee: $20
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                    alignItems: 'center',
                    paddingTop: '50px',
                    marginBottom: '7px',
                    width: '100%',
                }}>
                    <Box>
                        <Box sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                        
                            Add Contact
                        </Box>
                        
                    </Box>
                    <Box>
                        <Box sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                        
                            Add Document
                        </Box>
                        
                    </Box>

                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    marginBottom: '7px',
                    width: '100%',
                }}>

                
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#CB8E8E",
                            textTransform: "none",
                            borderRadius: "5px",
                            display: 'flex',
                            width: "45%",
                        }}
                        // onClick={() => handleSubmit("SENT")}
                        >
                        <Typography sx={{
                            fontWeight: theme.typography.primary.fontWeight, 
                            fontSize: "14px",
                            color: "#160449",
                            textTransform: "none",
                        }}>
                            Decline Offer
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#9EAED6",
                            textTransform: "none",
                            borderRadius: "5px",
                            display: 'flex',
                            width: "45%",
                        }}
                        // onClick={() => handleSubmit("SENT")}
                        >
                        <Typography sx={{
                            fontWeight: theme.typography.primary.fontWeight, 
                            fontSize: "14px",
                            color: "#160449",
                            textTransform: "none",
                        }}>
                            Send Quote
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    )

}

function TextInputField(props) {
    const inputStyle = {
        border: 'none',        
        width: '100%',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        color: '#3D5CAC',
        opacity:'1',
        paddingLeft: '5px',
        borderRadius: '5px',
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '7px',
            width: '100%',
        }}>
            <input type='text' style={inputStyle} name={props.name} placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
        </Box>
    );
}





export default NewOwnerInquiry;