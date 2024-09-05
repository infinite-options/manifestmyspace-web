import { ThemeProvider, Typography, Box, Tabs, Tab, Card, CardHeader, Slider, Stack, Button, Grid, Container } from "@mui/material";
// import documentIcon from "../../images/Subtract.png";
import Bell_fill from "../../images/Bell_fill.png";
import { useEffect, useState, useContext, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
// import refundIcon from "./refundIcon.png";
// import SearchIcon from "@mui/icons-material/Search";
// import axios from "axios";
// import { CustomTabPanel } from "../Maintenance/MaintenanceRequestDetail";
// import { useUser } from "../../contexts/UserContext";
// import CircularProgress from "@mui/material/CircularProgress";
// import Backdrop from "@mui/material/Backdrop";

// import APIConfig from "../../utils/APIConfig";
import ManagementContractDetails from "../Contracts/OwnerManagerContracts/ManagementContractDetails";
import { ManagementContractProvider } from "../../contexts/ManagementContractContext";
import ManagementContractContext from "../../contexts/ManagementContractContext";


export default function PMQuotesList() {
  // let navigate = useNavigate();  
  const location = useLocation();
  // console.log("In PMQuoteList");
  // console.log("In PMQuoteList property_endpoint_resp: ", location.state?.property_endpoint_resp);

  return (
    <ManagementContractProvider>
      <ThemeProvider theme={theme}>
        {/* <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color='inherit' />
        </Backdrop> */}
        <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <QuotesList />
            </Grid>

            <Grid item xs={12} md={8}>
              <ManagementContractDetails />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </ManagementContractProvider>
  );
}

//LHS
const QuotesList = (props) => {  
  const { contractRequests } = useContext(ManagementContractContext); 
  

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container item xs={12} sx={{ backgroundColor: "#F2F2F2", padding: "10px", borderRadius: "10px", height: "100%" }}>
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
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    padding: "0px",  
                    margin: "0px",  
                    gap: "10px",  
                  }}
                >
                {contractRequests.map((contract, index) => (
                  <Grid item xs={12} key={index} sx={{marginBottom: 0}} >
                    <ContractCard 
                      key={index}
                      contract={contract}                      
                    />
                  </Grid>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </ThemeProvider>
    </>
  );
};

function ContractCard(props) {
  let navigate = useNavigate();
  const { currentContractUID, setCurrentContractUID, setCurrentContractPropertyUID, } = useContext(ManagementContractContext);

  // console.log("props for contract card", props);
  const contract = props.contract;
  // console.log("ContractCard - contract", contract);  


  // Define a dictionary to map contract_status to text color
  const statusTextColorMap = {
    REJECTED: "#A52A2A",
    REFUSED: "#A52A2A",
    SENT: "#0CAA25",
  };

  // Determine text color based on contract_status or use default blue
  const textColor = statusTextColorMap[contract.contract_status] || "#3D5CAC";
  let announcements = JSON.parse(contract.announcements);
  // console.log("Annoncements", announcements);
  if (Array.isArray(announcements)) announcements.sort((a, b) => new Date(b.announcement_date) - new Date(a.announcement_date));

  return (
      <Grid
        container
        item
        xs={12}
        sx={{
          backgroundColor: contract.contract_uid === currentContractUID ? "#A5D6A7" : "#D6D5DA", 
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "0px",
          fontSize: "11px",
          cursor: "pointer",
          border: contract.contract_uid === currentContractUID ? "2px solid #4CAF50" : "none", 
        }}
        onClick={() => {          
          setCurrentContractUID(contract.contract_uid);
          setCurrentContractPropertyUID(contract.contract_property_id);          
        }}
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

        <Grid container item xs={4} sx={{ textAlign: "center", alignItems: "center", justifyContent: "flex-end" }}>
        <Typography sx={{ color: textColor, fontWeight: "bold", fontSize: "16px" }}>
            {contract.contract_status}
          </Typography>
          {announcements?.length && (
            <img
              src={Bell_fill}
              alt="Bell Icon"
              style={{ display: "block", cursor: "pointer", marginTop: "5px", marginLeft: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/announcements", { state: { owner_uid: contract.owner_uid } });
              }}
            />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Contract UID:</span> {`${contract.contract_uid}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Contract Property ID:</span> {`${contract.contract_property_id}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Title:</span> {`${announcements?.length ? announcements[0]?.announcement_title : "No title"}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Message:</span> {`${announcements?.length ? announcements[0]?.announcement_msg : "No message"}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Owner:</span> {`${contract.owner_first_name} ${contract.owner_last_name}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Email:</span> {contract.owner_email}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Address:</span> {contract.property_address} {contract.property_city} {contract.property_state} {contract.property_zip}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Phone Number:</span> {contract.owner_phone_number}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "#160449", fontSize: "14px" }}>
          <span style={{ fontWeight: "bold" }}>Beds:</span> {contract.property_num_beds} <span style={{ fontWeight: "bold", marginLeft: "15px" }}>Baths:</span>{" "}
          {contract.property_num_baths}
        </Typography>
      </Grid>
    </Grid>
  );
}
