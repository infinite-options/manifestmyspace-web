import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
} from "@mui/material";
import documentIcon from "../../images/Subtract.png"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../theme/theme';
import refundIcon from './refundIcon.png';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { CustomTabPanel } from "../Maintenance/MaintenanceRequestDetail";
import { useUser } from "../../contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop"; 

export default function PMQuotesList({}) {
    let navigate = useNavigate();
    const location = useLocation();
    const property_endpoint_resp = location.state.property_endpoint_resp
    const { getProfileId } = useUser();
    const [contractRequests, setContractRequests] = useState([]);
    const [properties, setProperties] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const getContractsForPM = async () => {
            setShowSpinner(true);
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`);
                const contractsResponse = await response.json();
                const contractsData = contractsResponse.result.filter(contract => contract.contract_status !== "ACTIVE")
                setContractRequests(contractsData)
                setShowSpinner(false);
            } catch (error) {
                console.error(error);
            }
        }
    
        const getProperties = async () => {
            setShowSpinner(true);
            try {
                console.log(property_endpoint_resp);
    
                // Assuming property_endpoint_resp is an object with the 'Property' and 'NewPMRequests' properties
                const properties = property_endpoint_resp.Property.result;
                const newPMRequests = property_endpoint_resp.NewPMRequests.result;
    
                // Correct the announcements field for each property
                properties.forEach(property => {
                    if (property.announcements) {
                        property.announcements = property.announcements.replace(/\\"/g, '"');
                        property.announcements = JSON.parse(property.announcements);
                    }
                });
    
                setProperties(properties);
                setContractRequests(newPMRequests);
                setShowSpinner(false);
            } catch (error) {
                console.error(error);
            }
        }
    
        getProperties();
    }, [refresh]);
    

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: "100%", // Take up full screen width
                    minHeight: "100vh", // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Stack
                    sx={{
                        backgroundColor: "#fff",
                        width: "100%", // Occupy full width with 25px margins on each side
                        maxWidth: "800px", // You can set a maxWidth if needed
                        textAlign: "center", // Center align text
                    }}
                    spacing={2}
                    p={2}
                >
                    <Typography
                        sx={{
                            color: "#160449",
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.largeFont,
                        }}
                    >
                        All Property Management Requests
                    </Typography>
                    {contractRequests.map((contract, index) => (
                        <ContractCard key={index} contract={contract} property_endpoint_resp={property_endpoint_resp} />
                    ))}
                </Stack>
            </Stack>
        </ThemeProvider>
    )
}

function ContractCard(props) {
    let navigate = useNavigate();

    const contract = props.contract;
    const property_endpoint_resp = props.property_endpoint_resp;

    // Define a dictionary to map contract_status to text color
    const statusTextColorMap = {
        REJECTED: "#A52A2A",
        REFUSED: "#A52A2A",
        SENT: "#0CAA25",
    };

    // Determine text color based on contract_status or use default blue
    const textColor = statusTextColorMap[contract.contract_status] || "#3D5CAC";
    let announcements= JSON.parse(contract.announcements)
    if (Array.isArray(announcements))
    announcements.sort((a, b) => new Date(b.announcement_date) - new Date(a.announcement_date));
    console.log('Ramin')
    console.log(announcements)
    console.log('Ramin')
    return (
        <Box
            sx={{
                backgroundColor: '#D6D5DA',
                borderRadius: '10px',
                padding: '10px',
                marginBottom: '20px',
                fontSize: '11px',
                cursor: 'pointer',
                position: 'relative',
            }}
            onClick={() => navigate('/managementContractDetails', {
                state: {
                    contract_uid: contract.contract_uid,
                    contract_business_id: contract.business_id,
                    contract_property_id: contract.property_id,
                    contractUID: contract.contract_uid,
                    property_endpoint_resp
                },
            })}
        >
            <Grid container alignItems="center">
                {/* Empty left corner */}
                <Grid item xs={3}></Grid>
                {/* Centered image container */}
                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={contract.owner_photo_url}
                        alt="Business Photo"
                        style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                        }}
                    />
                </Grid>
                {/* Left corner with contract status */}
                <Grid item xs={3} sx={{ textAlign: 'right', marginLeft: '-5px' }}>
                    <Typography
                        sx={{
                            color: textColor, // Set the text color dynamically
                            fontWeight: "bold",
                            fontSize: '20px',
                            marginLeft: '5px', // Move the status slightly to the right
                        }}
                    >
                        {contract.contract_status}
                    </Typography>
                </Grid>
            </Grid>
            {/* Remaining content of ContractCard component */}
            {/* Lines below the first line with increased space */}
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px', marginTop: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Title:</span> {`${announcements[0]?.announcement_title || 'No title'}`}
            </Typography>
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px', marginTop: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Message:</span> {`${announcements[0]?.announcement_msg || 'No message'}`}
            </Typography>

            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px', marginTop: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Owner:</span> {`${contract.owner_first_name} ${contract.owner_last_name}`}
            </Typography>
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Email:</span> {contract.owner_email}
            </Typography>
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Address:</span> {contract.property_address} {contract.property_city} {contract.property_state} {contract.property_zip}
            </Typography>
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Phone Number:</span> {contract.owner_phone_number}
            </Typography>
            <Typography sx={{ color: "#160449", fontSize: '11px', marginBottom: '5px' }}>
                <span style={{ fontWeight: "bold" }}>Beds:</span> {contract.property_num_beds}   <span style={{ fontWeight: "bold", marginLeft: '15px' }}>Baths:</span> {contract.property_num_baths}
            </Typography>
        </Box>
    );
}