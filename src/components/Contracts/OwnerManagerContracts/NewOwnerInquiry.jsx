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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material';
import theme from '../../../theme/theme';
import CircularProgress from "@mui/material/CircularProgress";



function NewOwnerInquiry(props) {
    const { getProfileId } = useUser();
    const navigate = useNavigate();

    const {state} = useLocation();
    const { announcementData } = state;

    const [showSpinner, setShowSpinner] = useState(false);
    const [propertiesData, setPropertiesData] = useState([]);
    const [filteredPropertiesData, setFilteredPropertiesData] = useState([]); // filter out the properties that aren't included in announcement_properties
    

    
    const [index, setIndex] = useState(0);
    const [timeDiff, setTimeDiff] = useState(null);



    useEffect(() => {
        console.log("New Owner Inquiry UseEffect");
        
        const fetchData = async () => {
            setShowSpinner(true);

            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000096`)
            
            
            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)

            

            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${announcementData["announcement_sender"]}`)
            
            const responseData = await response.json();

            setPropertiesData(responseData["Property"]["result"]? responseData["Property"]["result"] : []);
            setFilteredPropertiesData(propertiesData.filter(property => announcementData.announcement_properties.includes(property.property_uid)));

            console.log("PROPERTIES DATA", propertiesData);

            
            const announcementPropertiesArray = announcementData.announcement_properties.split(','); //If "announcement_properties" is a string
            const filteredProperties = propertiesData.filter(property => announcementPropertiesArray.includes(property.property_uid));
            // const filteredProperties = properties.filter(property => announcementData.announcement_properties.includes(property.property_uid)); // if "announcement_properties" is an array
            // console.log("FILTERED PROPERTIES DATA", filteredProperties);
            setFilteredPropertiesData(filteredProperties)

            console.log("FILTERED PROPERTIES DATA", filteredPropertiesData);


            console.log("ANNOUNCEMENT DATA", announcementData);


            setShowSpinner(false);
        };
        const calculateTimeDiff = () => {
            const announcement_date = new Date(announcementData["announcement_date"]);
            if (announcement_date === null) {
                return "<TIME AGO>";
            }
            const now = new Date();
            const timeDiff = now - announcement_date;

            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let durationString;
            if (days > 0) {
                durationString = `${days} days ago`;
            } else if (hours > 0) {
                durationString = `${hours} hours ago`;
            } else if (minutes > 0) {
                durationString = `${minutes} minutes ago`;
            } else {
                durationString = `${seconds} seconds ago`;
            }

            // console.log(durationString, seconds, minutes, hours, days, now);
            return durationString;
        };
        fetchData();
        setTimeDiff(calculateTimeDiff());
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
                <Box flexDirection ="row"
                    alignItems="center"
                    sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}
                >
                    <Box onClick={() => {
                            console.log("Previous button clicked. INDEX - ", index);
                            index > 0? setIndex(index-1) : setIndex(filteredPropertiesData.length - 1)
                        }}
                    >
                        <svg
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="#160449"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                            />
                        </svg>
                    </Box>
                    <Box
                        sx= {{
                            display: 'flex',
                            justifyContent:'center',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight:
                                    theme.typography.primary
                                        .fontWeight,
                            }}
                        >
                            {index + 1} of {filteredPropertiesData.length} Properties 
                            {/* {contactsTab} */}
                        </Typography>
                    </Box>
                    <Box onClick={() => {
                        console.log("Next button clicked. INDEX - ", index);
                        (index < filteredPropertiesData.length - 1) ? setIndex(index+1) : setIndex(0)
                    }}
                    >
                        <svg
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="#160449"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                            />
                        </svg>
                    </Box>
                </Box>
                <PropertyCard data={filteredPropertiesData[index]? filteredPropertiesData[index]: []} timeDifference={timeDiff}/>
                
            </Box>
        </ThemeProvider>
    )

}

function PropertyCard(props) {
    const propertyData = props.data;
    const timeDiff = props.timeDifference;
    const [showEditFees, setShowEditFees] = useState(false);

    const handleOpenEditFees = () => {
        setShowEditFees(true);
    };

    const handleCloseEditFees = () => {
        setShowEditFees(false);
    };

    return (
        <>
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
                        {/* 789 Maple Lane, San Diego, CA 92101, USA */}
                        {propertyData.property_address}{', '}{propertyData.property_city}{', '}{propertyData.property_state}{' '}{propertyData.property_zip}
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
                        {propertyData.owner_first_name}{' '}{propertyData.owner_last_name}
                    </Box>
                    <Box sx={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        paddingTop: '5px',
                    }}>
                        {'<Not Rented>'}
                    </Box>
                    <Box sx={{
                        fontSize: '10px',
                        paddingTop: '10px',
                        color: '#3D5CAC',
                    }}>
                        { timeDiff }
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Rent: {'$'}{propertyData.property_listed_rent? propertyData.property_listed_rent : '<RENT>' }
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Due: {propertyData.lease_rent_due_by? propertyData.lease_rent_due_by : '<DUE>' } of every Month

                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            View lease
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Expiring: {propertyData.lease_end? propertyData.lease_end : '<DATE>' }
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Property Value:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {'$'}{propertyData.property_value? propertyData.property_value : '<$$$>' } {'(<YEAR>)'}
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            $ Per SqFt
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >


                        {'$'}{(propertyData.property_value && propertyData.property_area)? (propertyData.property_value / propertyData.property_area) : '<$$$>' }
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Type
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_type? propertyData.property_type :'<TYPE>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            SqFt
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_area? propertyData.property_area : '<SFT>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Bed
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_num_beds? propertyData.property_num_beds : '<BEDS>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Bath
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_num_baths? propertyData.property_num_baths : '<BATHS>' }
                    </Box>
                </Box>
            </Box>
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Tenant:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.tenant_first_name? propertyData.tenant_first_name : '<TENANT_FIRST_NAME>' }{' '}
                            {propertyData.tenant_last_name? propertyData.tenant_last_name : '<TENANT_LAST_NAME>' }
                    </Box>
                </Box>

                
                
            </Box> */}
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>

                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Owner:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                        {propertyData.owner_first_name? propertyData.owner_first_name : '<OWNER_FIRST_NAME>' }{' '}
                        {propertyData.owner_last_name? propertyData.owner_last_name : '<OWNER_LAST_NAME>' }
                    </Box>
                </Box>
                
            </Box> */}
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>

                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Open Maintenance Tickets: {'<COUNT>'}
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {'<TICKET>' }
                    </Box>
                </Box>
                
            </Box> */}
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
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        padding: '5px',
                        color: '#3D5CAC',
                }}
            >
                    <Box>
                        Management Fees
                    </Box>
                    <Box
                        onClick={handleOpenEditFees}
                    >
                        Edit Fees
                    </Box>
                    
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
            {showEditFees && (
                <Box>
                    <EditFeesComponent open={showEditFees} handleClose={handleCloseEditFees} />
                </Box>
            )}
        </>

    );
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

function EditFeesComponent({ open, handleClose }) {
    const [selectedFeeType, setSelectedFeeType] = useState('PERCENT');

    useEffect(() => {
        console.log('FEE TYPE: ', selectedFeeType);
    }, [selectedFeeType]);

    const [percentage, setPercentage] = useState('0');

    useEffect(() => {
        console.log('PERCENTAGE: ', percentage);
    }, [percentage]);

    const [flatRate, setFlatRate] = useState('0');

    useEffect(() => {
        console.log('FEE TYPE: ', flatRate);
    }, [flatRate]);



    const handleFeeTypeChange = (event) => {
        setSelectedFeeType(event.target.value);
        // console.log('FEE TYPE: ', selectedFeeType);
    };

    return (
        <>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                      width: '60%',
                      maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        Management Fees
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Fee Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="fee_name"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box>Frequency</Box>
                                {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
                                <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '15px',
                            color: '#3D5CAC',
                    }}
                >
                    <RadioGroup
                        row
                        aria-label="fee-type-group-label"
                        name="fee-type-radio-buttons-group"
                        value={selectedFeeType}
                        onChange={handleFeeTypeChange}
                    >
                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >


                        
                            <FormControlLabel value="PERCENT" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Percent" />
                            {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
                            {selectedFeeType === 'PERCENT' && (
                                <Box>
                                    <TextField
                                        value={percentage}
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setPercentage(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Flat Rate" />
                            <Box sx={{width: '60px', height: '20px',}}>
                        </Box>
                            
                        </Box>
                        {selectedFeeType === 'FLAT-RATE' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Amount
                                    <TextField
                                        name="flat-rate"
                                        value={flatRate}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                            {selectedFeeType === 'PERCENT' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Applied To
                                    <TextField
                                        name="flat-rate"
                                        value={flatRate}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                    </RadioGroup> 

                </Box>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleClose}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );

}




export default NewOwnerInquiry;