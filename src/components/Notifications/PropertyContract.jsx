import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import {
    ThemeProvider,
    Box,
    Stack,
    Typography,
    Button,
    IconButton,
    
} from '@mui/material';
import theme from '../../theme/theme';
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from '@mui/icons-material/Close';
import documentIcon from "../../images/Subtract.png"
import User_fill from '../../images/User_fill.png';

function PropertyContract(props) {

    const { getProfileId } = useUser();
    const navigate = useNavigate();

    const [ownerId, setOwnerId] = useState(getProfileId());


    const {state} = useLocation();
    const { announcementData } = state;
    
    // const [contractBusinessID, setContractBusinessID] = useState(null);
    // useEffect(() => {
    //     console.log('CONTRACT BUSINESS ID: ', contractBusinessID);
    // }, [contractBusinessID]);
 
    // const [contractPropertyID, setContractPropertyID] = useState(null);
    // useEffect(() => {
    //     console.log('CONTRACT PROPERTY ID: ', contractPropertyID);
    // }, [contractPropertyID]);

    const [showSpinner, setShowSpinner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [propertiesData, setPropertiesData] = useState([]);
    const [propertyData, setPropertyData] = useState();
    //const [filteredPropertiesData, setFilteredPropertiesData] = useState([]); // filter out the properties that aren't included in announcement_properties
    
    const [contractData, setContractData] = useState([]);
    const [contract, setContract] = useState();

    // useEffect(() => {
    //     // setContractPropertyID(filteredPropertiesData["property_uid"]);
    // }, [filteredPropertiesData]); // rohit
    const [filteredPropertiesData, setFilteredPropertiesData] = useState([]); // filter out the properties that aren't included in announcement_properties
   
    const [timeDiff, setTimeDiff] = useState(null);
    const [index, setIndex] = useState(0);

    const [contractName, setContractName] = useState("");
    const [contractStartDate, setContractStartDate] = useState("");
    const [contractEndDate, setContractEndDate] = useState("");
    const [contractFees, setContractFees] = useState([]);

    useEffect(() => {
        
        const fetchData = async () => {
            setShowSpinner(true);
            console.log("ANNOUNCEMENT DATA", announcementData);

            const responseContract = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/`+ownerId)
            const responseContractData = await responseContract.json();
            const contracts = responseContractData.result? responseContractData.result : [];

            //setContractData(contracts)         

            // const announcementPropertiesArray = announcementData.announcement_properties.split(','); //If "announcement_properties" is a string
            // const filteredContracts = contracts.filter(contract => announcementPropertiesArray.includes(contract.contract_property_id));
            // Ann property = 200-000114

            /*contracts.forEach(contract => {
                if (contract.contract_property_id===announcementData.announcement_properties) {
                    setContract(contracts[0]);
                }
            });*/



            setContract(contracts[0])

            setContractFees(contracts[0].contract_fees ? JSON.parse(contracts[0].contract_fees) : []);
            
            //console.log("Contract: "+JSON.stringify(contract))
            
            const responseProperties = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/`+ownerId)
            const responsePropertiesData = await responseProperties.json();
            
            const properties = responsePropertiesData.Property.result ? responsePropertiesData.Property.result : [];
            console.log("PROPERTIES", JSON.stringify(properties));
            
            properties.forEach(property => {

                if (property.property_uid===announcementData.announcement_properties) {
                    setPropertyData(property);
                }
            });

            //console.log("Property: "+propertyData)

            setIsLoading(false);
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

            console.log(now, announcement_date, announcementData["announcement_date"], durationString, seconds, minutes, hours, days);
            return durationString;
        };
        fetchData();
        setTimeDiff(calculateTimeDiff());
    }, []);

    const handleBackBtn = () => {
        navigate(-1);
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleAcceptOfferClick = () => {

    };

    const handleDeclineOfferClick = () => {

    };

    const handleContractNameChange = (event) => {
        setContractName(event.target.value);
    }

    const handleStartDateChange = (event) => {
        setContractStartDate(event.target.value);
    }

    const handleEndDateChange = (event) => {
        setContractEndDate(event.target.value);
    }

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{
                backgroundColor: '#D6D5DA',
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
                    
                    <Box sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'text.darkblue',
                            padding: '0',
                            minWidth: '300px',
                        }}
                    >
                        Property Manager Contract
                    </Box>
                
                    <IconButton onClick={handleBackBtn}>
                        <CloseIcon />
                    </IconButton>
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
                        {propertyData.property_available_to_rent === 1? 'Not Rented' : 'Rented'}
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
                        fontSize: '15px',
                        fontWeight: 'bold',
                        padding: '5px',
                        color: '#3D5CAC',
                }}
            >
                
                    Management Agreement Name
            </Box>
            <TextInputField name="management_agreement_name" placeholder="Enter contract name" value={contractName} onChange={handleContractNameChange}>First Name</TextInputField>
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
                    <TextInputField name="start_date" placeholder="mm/dd/yy" value={contractStartDate} onChange={handleStartDateChange}>Start Date</TextInputField>
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
                    <TextInputField name="end_date" placeholder="mm/dd/yy" value={contractEndDate} onChange={handleEndDateChange}>End Date</TextInputField>
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
                    
            </Box>
            <Box sx={{
                        //background: "#FFFFFF",
                        fontSize: '13px',
                        padding: '5px',
                        color: '#3D5CAC',
                        borderRadius: '5px',

                }}
            >   
                 {contractFees.length === 0 ? (
                    // <p>No fees to display</p>
                    <Box
                        sx={{
                            height: "13px",
                        }}
                    >
                    </Box>
                ) : (
                    contractFees.map((fee, index) => (
                        <Box 
                            key={index}
                            // FeeIndex={index}
                            sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                                
                            }}
                           // onClick={() => handleOpenEditFee(index)}
                        >
                            <Box>{fee.fee_name}: {fee.isPercentage ? `${fee.charge}% of ${fee.of}` : ` $${fee.charge}`}</Box>
                        </Box>
                        
                    ))
                )} 
                
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
                    {/* <img
                    src={User_fill}
                    alt="User Icon"
                    style={{width: '15px', height: '20px', margin:'0px', paddingRight: "15px"}}
                    /> */}
                    Property Manager
                    Marie Schrader
                    </Box>
                </Box>
            </Box>
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
                        <img src={documentIcon} style={{width: '15px', height: '20px', margin:'0px', paddingRight: "15px"}}/>View Document 
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
                    onClick={handleDeclineOfferClick}
                    >
                    <Typography sx={{
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize: "14px",
                        color: "#160449",
                        textTransform: "none",
                    }}>
                        Decline Contract
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
                    onClick={handleAcceptOfferClick}
                    >
                    <Typography sx={{
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize: "14px",
                        color: "#160449",
                        textTransform: "none",
                    }}>
                        Accept Contract
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


export default PropertyContract;