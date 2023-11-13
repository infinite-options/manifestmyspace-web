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

export default function PMQuotesRequested({}){
    const location = useLocation();
    let navigate = useNavigate(); 

    console.log("--debug location.state--", location.state)

    const contracts = location.state.contracts;

    const property = location.state.propertyData;
    const index = location.state.index;

    const statusList = ["New Quotes", "Contracts"];
    const statusColor = ['#3D5CAC', '#160449'];
    const [tabStatus, setTabStatus] = useState(0);
    const [activeContracts, setActiveContracts] = useState(getActiveContracts());

    function getColor(status) {
        return statusColor[status];
    }

    function getActiveContracts(){
        let activeContracts = [];
        contracts.forEach(contract => {
            if(contract.contract_status === "ACTIVE"){
                activeContracts.push(contract);
            }
        });
        return activeContracts;
    }

    const address = property[index].business_locations
    const headers = { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials":"*"
    };

    let dataValue = {};

    if(address!=null && address!=undefined){
        dataValue = {
            city: JSON.parse(address)[0].city,
            miles: JSON.parse(address)[0].miles
        }
    } else {
        dataValue = {
            city: "No data",
            miles: "No data"
        }
    }

    const [data, setData] = useState(property[index]);

    useEffect(() => {
        console.log("propertyData", property);
        console.log("contracts", contracts);
    }, []);

    function displayPMQuotesRequested(){
        return (
            <div>
                {contracts.length > 0 ? (
                    <div>
                        {contracts.map(contract => {
                            if(contract.contract_status === "SENT"){
                                return (
                                    <div>
                                        <DocumentCard data={contract}/>
                                         <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            position="relative"
                                            sx={{ padding: '8px', paddingTop: '8px' }}
                                        >
                                            <Button 
                                                variant="contained"
                                                sx={{
                                                    textTransform: 'none',
                                                    background: '#A52A2A',
                                                    color: theme.palette.background.default,
                                                    width: `40%`,
                                                    height: `85%`,
                                                    top: `10%`,
                                                    borderRadius: '10px 10px 10px 10px',
                                                    fontSize: `10px`
                                                }} onClick={()=>{handleDecline(contract)}}>
                                                    Decline
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                sx={{
                                                    textTransform: 'none',
                                                    background: '#76B148',
                                                    color: theme.palette.background.default,
                                                    width: `40%`,
                                                    height: `85%`,
                                                    top: `10%`,
                                                    borderRadius: '10px 10px 10px 10px',
                                                    fontSize: `10px`
                                                }} onClick={()=>{handleAccept(contract)}}>
                                                    Accept
                                            </Button>
                                        </Stack>
                                    </div>
                                )
                            } if (contract.contract_status === "WITHDRAW" || contract.contract_status === "REJECTED"){
                                return (
                                    <div>
                                        <DocumentCard data={contract}/>
                                    </div>
                                )
                            } if (contract.contract_status === "NEW"){
                                return (
                                    <div>
                                        <DocumentCard data={contract}/>
                                        <Stack 
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            position="relative"
                                            sx={{ padding: '8px', paddingTop: '8px' }}
                                        >
                                            <Button 
                                                variant="contained"
                                                sx={{
                                                    textTransform: 'none',
                                                    background: '#A52A2A',
                                                    color: theme.palette.background.default,
                                                    width: `40%`,
                                                    height: `85%`,
                                                    top: `10%`,
                                                    borderRadius: '10px 10px 10px 10px',
                                                    fontSize: `10px`
                                                }} 
                                                onClick={()=>{handleStatusChange(contract, "CANCELLED")}}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </div>  
                                )
                            }
                        })}
                    </div>
                ) : (
                    <div>
                        No Requested Contract Quotes
                    </div>
                )}
            </div>
        )
    }

    function displayActiveContracts(){
        return (
            <div>
                {activeContracts.length > 0 ? (
                    <div>
                        These are all the active contracts

                        {activeContracts.map((contract, index) => {
                            return (
                                <div key={index}>
                                    <DocumentCard data={contract}/>
                                    <p>{contract.contract_uid}</p>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div>
                        No active contracts
                    </div>
                )}
            </div>
        )
    }

    function handleAccept(obj){
        try {
    
            const formData = new FormData();
            formData.append("contract_uid", obj.contract_uid)
            formData.append("contract_status", "ACTIVE")

             console.log(formData.contract_uid);
             console.log(formData.contract_status);

            const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts`; 

            fetch(url, {
                method: 'PUT',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else{
                    console.log("Data added successfully");
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        } catch (error){
            console.log("error", error)
            return false;
        }

        setTabStatus(1);
    }
    
    function handleDecline(obj){
        try {
    
            const formData = new FormData();
            formData.append("contract_uid", obj.contract_uid)
            formData.append("contract_status", "REJECTED")

             console.log(formData.contract_uid);
             console.log(formData.contract_status);

            const response = axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts", formData, headers);
            console.log("PUT result", response);
            if (response.code === 200) {
                return true;
            }

        } catch (error){
            console.log("error", error)
            return false;
        }
    }
    
    function handleStatusChange(obj, status){
        try {

            const formData = new FormData();
            formData.append("contract_uid", obj.contract_uid)
            formData.append("contract_status", status)

            console.log(formData.contract_uid);
            console.log(formData.contract_status);

            const response = axios.put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts", formData, headers);
            console.log("PUT result", response);
            if (response.code === 200) {
                return true;
            }

        } catch (error){
            console.log("error", error)
            return false;
        }
    }

    return( 
        <ThemeProvider theme={theme}>
            <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        backgroundColor: theme.palette.primary.main,
                        width: '100%', // Occupy full width with 25px margins on each side
                        paddingTop: '10px',
                    }}
                >
                     <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingBottom: "0px"
                        }}
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                               Search for Properties Manager
                            </Typography>
                        </Box>
                        <Box position="absolute" right={30}>
                            <Button >
                                <SearchIcon />
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box 
                        onClick={() => navigate(-1)}>
                            <Button  sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '16px', "&:hover, &:focus, &:active": {background: theme.palette.primary.main}}}>

                                {/* <UTurnLeftIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px', transform: 'rotate(90deg)', fontWeight: theme.typography.common.fontWeight}}/> */}
                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
                                <Typography>
                                    Return to Viewing All Properties
                                </Typography>
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                            width: '95%',
                        }}>
                            <Tabs 
                                variant="fullWidth" 
                                value={tabStatus}
                                onChange={(e) => console.log(e)} 
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: 'transparent',
                                        border: '0px',
                                        minWidth: '5px',
                                        height: '10px',
                                        padding: '0px',
                                    }
                                }}
                                sx={{
                                    [theme.breakpoints.up('sm')]: {
                                        height: '5px', // padding for screens wider than 'sm'
                                        },
                                }}
                            >
                                
                                <Tab
                                    sx={{
                                        backgroundColor: statusColor[0],
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px',
                                        height: '10%',
                                        minWidth: '5px',
                                        padding: '0px',
                                        '&.Mui-selected': {
                                            color: '#FFFFFF', // Highlight color for selected tab
                                        },
                                        '&.MuiTab-root': {
                                            color: '#FFFFFF', // Highlight color for unselected tab
                                        },
                                        textTransform: 'none',
                                    }}
                                    onClick={() => setTabStatus(0)}
                                    label="Quotes Requested"
                                />
                                <Tab
                                    sx={{
                                        backgroundColor: statusColor[1],
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px',
                                        height: '10%',
                                        minWidth: '5px',
                                        padding: '0px',
                                        '&.Mui-selected': {
                                            color: '#FFFFFF', // Highlight color for selected tab
                                        },
                                        '&.MuiTab-root': {
                                            color: '#FFFFFF', // Highlight color for unselected tab
                                        },
                                        textTransform: 'none',
                                    }}
                                    onClick={() => setTabStatus(1)}
                                    label="Active Contracts"
                                />
                            </Tabs>
                            <Box sx={{
                                backgroundColor: getColor(tabStatus),
                                height: '15px',
                            }}></Box>
                        </Box>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box sx={{ 
                            borderBottom: 0,
                            width: '95%',
                        }}>
                        
                            <Box sx={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: "0px 0px 10px 10px",
                                bottom: '40px',
                            }}>
                                <Box sx={{
                                    padding: '15px',
                                }}>
                                    {tabStatus === 0 ? displayPMQuotesRequested() : displayActiveContracts() }
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}

function NavTab(props) {
    const color = props.color;
    return (
        <Box sx={{
            backgroundColor: color,
            width: '50%',
            height: '80px',
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

    const data = props.data

    // let navigate = useNavigate();

    // const getContractDocumentLink = () => {
    //     const documents = JSON.parse(obj.documents);
    //     if(documents === null || documents === undefined) return null;
    //     const contractDocument = documents.find(doc => doc.type === "contract");
    //     console.log("contractDocument link: ", contractDocument.link);
    //     return contractDocument.link;
    // }

    // const contractDocumentLink = getContractDocumentLink();

    
    const textStyle = {
        textTransform: 'none',
        color: theme.typography.propertyPage.color,
        fontWeight: theme.typography.light.fontWeight,
        fontSize: theme.typography.secondaryFont,
    };

    
    return (
        <Box sx={{
            backgroundColor: '#D6D5DA',
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
                <Typography sx={{fontWeight: 'bold', fontSize: "26px"}}>
                   {data.business_name}
                </Typography>
            </Box>                
            <Box>
                <Typography sx={textStyle}>
                    Area of service: {data.city} +-{data.miles} miles
                </Typography>
            </Box>
            <Box>
                <Typography sx={textStyle}>
                    Status: {data.contract_status}
                </Typography>
            </Box>
            <Box>
                <Typography sx={textStyle}>
                    Contract ID: {data.contract_uid}
                </Typography>
            </Box>

            <Box>
                <Typography sx={textStyle}>
                    Estimated Fees
                </Typography>
            </Box>
            {data !== null && data.contract_fees !== null ? (
                JSON.parse(data.contract_fees).map((fee, index) => {
                    <FeesTextCard key={index} fee={fee}/>
                })
            ) : (
                <Typography sx={textStyle}>
                    No fees
                </Typography>
            )} 
            <Box onClick={()=>{
                // window.open(contractDocumentLink, "_blank");
                console.log("we should show a document here")
            }}>
                <Typography sx={textStyle}>
                    View Contract <img src={documentIcon} style={{width: '15px', height: '20px', margin:'0px', paddingLeft: "15px"}}/>
                </Typography>
            </Box>
        </Box>
    );
}


function FeesTextCard(props) {

    const textStyle = {
        textTransform: 'none',
        color: theme.typography.propertyPage.color,
        fontWeight: theme.typography.light.fontWeight,
        fontSize:theme.typography.mediumFont,
    };

    let fee = props.fee;

    let type=fee.fee_type;
    if(fee.fee_type=="PERCENT"){
        type="%";
    }
    if(fee.fee_type=="DOLLAR"){
        type="$";
    }

   return(
        <Typography sx={textStyle}>
            {fee.fee_name}:{fee.charge}{type} of {fee.of}
        </Typography>
    )
  }
  
