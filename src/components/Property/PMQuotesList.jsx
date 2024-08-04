import { ThemeProvider, Typography, Box, Tabs, Tab, Card, CardHeader, Slider, Stack, Button, Grid, Container, } from "@mui/material";
import documentIcon from "../../images/Subtract.png";
import Bell_fill from "../../images/Bell_fill.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import refundIcon from "./refundIcon.png";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { CustomTabPanel } from "../Maintenance/MaintenanceRequestDetail";
import { useUser } from "../../contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import APIConfig from "../../utils/APIConfig";
import ManagementContractDetails from "../Contracts/OwnerManagerContracts/ManagementContractDetails";

export default function PMQuotesList() {
  let navigate = useNavigate();
  const location = useLocation();
  console.log("In PMQuoteList");
  console.log("In PMQuoteList property_endpoint_resp: ", location.state?.property_endpoint_resp);

  const selectedContractUID = location?.state?.selected_contract_uid;
  // const selectedContractUID = "010-000361";

  const property_endpoint_resp = location.state.property_endpoint_resp;
  const { getProfileId } = useUser();
  const [contractRequests, setContractRequests] = useState([]);
  // const [contractRequests, setContractRequests] = useState(property_endpoint_resp);  
  const [properties, setProperties] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // const [ currentContract, setCurrentContract ] = useState(null);
  const [ index, setIndex ] = useState(0);
  // const [ currentContractUID, setCurrentContractUID ] = useState(contractRequests[0]?.contract_uid);
  const [ currentContractUID, setCurrentContractUID ] = useState(null);
  // const [ currentContractPropertyUID, setCurrentContractPropertyUID ] = useState(contractRequests[0]?.property_id);
  const [ currentContractPropertyUID, setCurrentContractPropertyUID ] = useState(null);

  // useEffect(() => {
  //   console.log("index - ", index);
  // }, [index]);

  useEffect(() => {
    // console.log("contractRequests - ", contractRequests);
    if (selectedContractUID !== null && selectedContractUID !== undefined && contractRequests !== null && contractRequests !== undefined) {            
      const index = contractRequests.findIndex(contract => contract.contract_uid === selectedContractUID);
      // console.log("contractRequests useEffect index - ", index);
      if (index !== -1) {
        setIndex(index)
      }
    }   
  }, [contractRequests]);

  // useEffect(() => {  
  //   console.log("currentContractUID - ", currentContractUID);
  // }, [currentContractUID]);

  // useEffect(() => {
  //   console.log("currentContractPropertyUID - ", currentContractPropertyUID);
  // }, [currentContractPropertyUID]);


  useEffect(() => {
    const contract = contractRequests[index];    
    if(contract) setCurrentContractUID(contract?.contract_uid);
    if(contract) setCurrentContractPropertyUID(contract?.property_id);
  }, [index, contractRequests]);

  // useEffect(() => {
  //   const getContractsForPM = async () => {
  //     setShowSpinner(true);
  //     try {
  //       const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
  //       const contractsResponse = await response.json();
  //       console.log("contractResponse: ", contractsResponse);
  //       const contractsData = contractsResponse.result.filter((contract) => contract.contract_status !== "ACTIVE");
  //       console.log("contractData: ", contractsData);
  //       setContractRequests(contractsData);
  //       setShowSpinner(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   console.log("ContractRequests: ", contractRequests);

  //   const getProperties = async () => {
  //     setShowSpinner(true);
  //     try {
  //       console.log("In getProperties:", property_endpoint_resp);

  //       // Assuming property_endpoint_resp is an object with the 'Property' and 'NewPMRequests' properties
  //       // const properties = property_endpoint_resp.Property.result;
  //       // console.log("Properties: ", properties);
  //       // const newPMRequests = property_endpoint_resp.NewPMRequests.result;
  //       const newPMRequests = property_endpoint_resp;
  //       console.log("NewPMRequests: ", newPMRequests);

  //       // Correct the announcements field for each property
  //       // properties.forEach((property) => {
  //       //   if (property.announcements) {
  //       //     property.announcements = property.announcements.replace(/\\"/g, '"');
  //       //     property.announcements = JSON.parse(property.announcements);
  //       //   }
  //       // });

  //       // setProperties(properties);
  //       setContractRequests(newPMRequests);
  //       setShowSpinner(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   getProperties();
  // }, [refresh]);

  useEffect(() => {
    // const dataObject = {};
    // console.log("In UseEffect");
    // console.log(getProfileId());

    // console.log("In UseEffect after if");
    const fetchData = async () => {
      setShowSpinner(true);

      const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
      // const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`);

      try {
        const jsonData = await response.json();
        // console.log("Manager Dashboard jsonData: ", jsonData);        
        // NEW PM REQUESTS
        const requests = jsonData?.NewPMRequests?.result;
        setContractRequests(requests);        
        // setCurrentContractUID(requests[0]?.contract_uid)
        // setCurrentContractPropertyUID(requests[0]?.property_uid)
      } catch (error) {
        console.error(error);
      }

      setShowSpinner(false);
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color='inherit' />
      </Backdrop>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <QuotesList
              propertyData={property_endpoint_resp}
              contractRequests={contractRequests}
              setIndex={setIndex}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <ManagementContractDetails
              contractUID={currentContractUID}
              contractPropertyUID={currentContractPropertyUID}
              // properties={property_endpoint_resp}
              properties={contractRequests}
            />
            
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

//LHS
const QuotesList = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const property_endpoint_resp = props.propertyData;
  const contractRequests = props.contractRequests;
  const setIndex = props.setIndex;



  return (
    <>
      <ThemeProvider theme={theme}>
        
        <Grid container item xs={12} sx={{backgroundColor: '#F2F2F2', padding: '10px', borderRadius: '10px', height: '100%' }}>
          <Stack
            direction='column'
            alignItems='center'
            // justifyContent='center'
            sx={{
              width: "100%", // Take up full screen width
              height: "100%", // Set the Box height to full height
              // marginTop: theme.spacing(2), // Set the margin to 20px
            }}
          >
            <Stack
              sx={{
                // backgroundColor: "#fff",
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
              <Stack
                direction='column'
                // alignItems='center'
                // justifyContent='center'
                sx={{
                  width: "100%", // Take up full screen width
                  height: "100vh", // Set the Box height to full height
                  borderRadius: '10px',
                  // paddingTop: '1200px',
                  overflow: 'auto',
                  // marginTop: theme.spacing(2), // Set the margin to 20px
                }}                
              >

            
              {contractRequests.map((contract, index) => (
                <ContractCard key={index} contract={contract} property_endpoint_resp={property_endpoint_resp} index={index} setIndex={setIndex} />
              ))}
            </Stack>
            </Stack>
          </Stack>
        </Grid>
      </ThemeProvider>
    </>

  );
}

function ContractCard(props) {
  let navigate = useNavigate();

  const contract = props.contract;
  const property_endpoint_resp = props.property_endpoint_resp;

  const index = props.index;
  const setCurrentIndex = props.setIndex;

  // Define a dictionary to map contract_status to text color
  const statusTextColorMap = {
    REJECTED: "#A52A2A",
    REFUSED: "#A52A2A",
    SENT: "#0CAA25",
  };

  // Determine text color based on contract_status or use default blue
  const textColor = statusTextColorMap[contract.contract_status] || "#3D5CAC";
  let announcements = JSON.parse(contract.announcements);
  if (Array.isArray(announcements)) announcements.sort((a, b) => new Date(b.announcement_date) - new Date(a.announcement_date));

  return (
    // <Box
    //   sx={{
    //     backgroundColor: "#D6D5DA",
    //     borderRadius: "10px",
    //     padding: "10px",
    //     marginBottom: "20px",
    //     fontSize: "11px",
    //     cursor: "pointer",
    //     position: "relative",
    //   }}
    //   onClick={() =>
    //     navigate("/managementContractDetails", {
    //       state: {
    //         contract_uid: contract.contract_uid,
    //         contract_business_id: contract.business_id,
    //         contract_property_id: contract.property_id,
    //         contractUID: contract.contract_uid,
    //         property_endpoint_resp,
    //       },
    //     })
    //   }
    // >
    <Grid container item xs={12} sx={{
        backgroundColor: "#D6D5DA",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "20px",
        fontSize: "11px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => setCurrentIndex(index)}
    >

      <Grid container alignItems='center'>
        <Grid item xs={4}></Grid>

        <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={contract.owner_photo_url}
            alt='Business Photo'
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              objectFit: "cover",
            }}
          />
        </Grid>

        <Grid container item xs={4} sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography
            sx={{
              color: textColor,
              fontWeight: "bold",
              fontSize: "16px",
              // marginLeft: "5px",
              
            }}
          >
            {contract.contract_status}
          </Typography>
          {announcements?.length && (
            <img
              src={Bell_fill}
              alt='Bell Icon'
              style={{ display: "block", cursor: "pointer", marginTop: "5px", marginLeft: "10px", }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/announcements", { state: { owner_uid: contract.owner_uid } });
              }}
            />
          )}
        </Grid>
     </Grid>
     <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px",  }}>
          <span style={{ fontWeight: "bold" }}>Contract UID:</span> {`${contract.contract_uid}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px",  }}>
          <span style={{ fontWeight: "bold" }}>Contract Proprty ID:</span> {`${contract.contract_property_id}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px",  }}>
          <span style={{ fontWeight: "bold" }}>Title:</span> {`${announcements?.length ? announcements[0]?.announcement_title : "No title"}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px",  }}>
          <span style={{ fontWeight: "bold" }}>Message:</span> {`${announcements?.length ? announcements[0]?.announcement_msg : "No message"}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px",  }}>
          <span style={{ fontWeight: "bold" }}>Owner:</span> {`${contract.owner_first_name} ${contract.owner_last_name}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px", }}>
          <span style={{ fontWeight: "bold" }}>Email:</span> {contract.owner_email}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px", }}>
          <span style={{ fontWeight: "bold" }}>Address:</span> {contract.property_address} {contract.property_city} {contract.property_state} {contract.property_zip}
        </Typography>
      </Grid>  
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px", }}>
          <span style={{ fontWeight: "bold" }}>Phone Number:</span> {contract.owner_phone_number}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px", }}>
          <span style={{ fontWeight: "bold" }}>Beds:</span> {contract.property_num_beds} <span style={{ fontWeight: "bold", marginLeft: "15px" }}>Baths:</span>{" "}
          {contract.property_num_baths}
        </Typography>
      </Grid>
    </Grid>
  );
}
