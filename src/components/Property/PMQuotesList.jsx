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


export default function PMQuotesList({}){
    let navigate = useNavigate();
    const location = useLocation();
    const property_endpoint_resp=location.state.property_endpoint_resp
    const { getProfileId} = useUser();
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
                // 
                console.log("contractsResponse", contractsData)
                setContractRequests(contractsData)
                setShowSpinner(false);
            }
            catch (error){
                console.log(error);
            }
        }
        // NewPMRequests

        const getProperties = async () => {
            setShowSpinner(true);
            try {
                console.log(property_endpoint_resp)
                setProperties(property_endpoint_resp.Property.result)
                setContractRequests(property_endpoint_resp.NewPMRequests.result)
                setShowSpinner(false);         
            } catch (error) {
                console.log(error)
            }
        }

        // getContractsForPM();
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
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%", // Take up full screen width
                minHeight: "100vh", // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    sx={{
                        margin: "10px",
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.main,
                        width: "100%", // Occupy full width with 25px margins on each side
                        maxWidth: "800px", // You can set a max-width if needed
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: theme.spacing(2), position: "relative", paddingBottom: "25px" }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                }}
                            >
                                All Property Management Requests
                            </Typography>
                        </Box>
                    </Stack>
                    {contractRequests.map((contract, index) => {
                            return (            
                                <ContractCard contract={contract} property_endpoint_resp={property_endpoint_resp}/>
                            )
                        })}
                </Paper>
            </Box>
        </ThemeProvider>
    )
}

function ContractCard(props){
    let navigate = useNavigate();

    const contract = props.contract;
    const property_endpoint_resp= props.property_endpoint_resp
    // const property = props.property;
    // console.log(contract)
    return (
        <Box sx={{
                backgroundColor: '#D6D5DA',
                borderRadius: '10px',
                padding: '5px',
                marginBottom: '10px',
                fontSize: '13px',
            }}
            onClick={() => navigate('/managementContractDetails', {
                state: {
                    contract_uid: contract.contract_uid, 
                    contract_business_id: contract.business_id, 
                    contract_property_id: contract.property_id,
                    contractUID: contract.contract_uid,
                    property_endpoint_resp
                }})
            }
        >
            {/* <h2>{contract.contract_uid}</h2> */}
            <h2>{contract.contract_status}</h2>
            <h3>{contract.property_address} {contract.property_city} {contract.property_state} {contract.property_zip}</h3>
            <p>Beds: {contract.property_num_beds}</p> 
            <p>Baths: {contract.property_num_baths}</p>
        </Box>
    )
}