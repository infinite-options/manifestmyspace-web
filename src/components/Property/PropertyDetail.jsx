import { ThemeProvider, Typography, Box, Paper, Stack, Button,} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import PropertyNavigator from "../Property/PropertyNavigator";
import refundIcon from "./refundIcon.png";

export default function PropertyDetail({}) {
  console.log("In Property Detail Mobile");
  const location = useLocation();
  let navigate = useNavigate();
  //   const [contractsForProperty, setContractsForProperty] = useState([]);
  // const contracts = location.state.contracts;
  const propertyList = location.state?.propertyList; // list of Property Details + Applications + Maintenance from /properties endpoint
  const index = location.state?.index;
  const allRentStatus = location.state.allRentStatus?location.state.allRentStatus: [];
  const rawPropertyData = location.state.rawPropertyData?location.state.rawPropertyData: [];
  const isDesktop = location.state.isDesktop?location.state.isDesktop: true;

  

  console.log("LOCATION STATE", location.state)
  console.log("all rentStatus", allRentStatus)

  // useEffect(() => {
  //   console.log("all rentStatus", allRentStatus)
	// }, [allRentStatus]); 

  //   const [index, setIndex] = useState(location.state.index);

  // console.log("--debug-- all contracts PropertyDetail", contracts)

  //   useEffect(() => {
  //     // filter contracts for this property
  //     if (contracts === undefined) {
  //       // get contracts from database
  //     } else {
  //       console.log("Welcome to Property: ", propertyList[index]);
  //       let contractsForThisProperty = contracts.filter((contract) => contract.property_id === propertyList[index].property_uid);
  //       // console.log("--debug-- contracts for this property", contractsForThisProperty)
  //       setContractsForProperty(contractsForThisProperty);
  //     }
  //   }, []);

  function handleBackButton() {
    console.log("handleBackButton");
    navigate('/properties', { state: { index: index } });
  }

  function navigateToAddProperty() {
    console.log("navigateToAddProperty");
    navigate("/addProperty", {state:{property_endpoint_resp: rawPropertyData}});
  }

  function navigateToAddListing() {
    console.log("navigateToAddListing");
    navigate("/addListing");
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: theme.spacing(2),
        }}
      >
        <Paper
          style={{
            maxWidth: "900px",
            width: "100%",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Stack direction="column" alignItems="center">
            <Box display="flex" justifyContent="center" width="100%" position="relative">
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                All Properties
              </Typography>
              <Button
                onClick={navigateToAddProperty}
                sx={{
                  position: "absolute",
                  right: 0,
                }}
              >
                <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "30px" }} />
              </Button>
            </Box>
            <Button
              onClick={handleBackButton}
              sx={{
                textTransform: "none",
                color: theme.typography.common.blue,
                fontWeight: theme.typography.common.fontWeight,
                fontSize: "16px",
                marginTop: theme.spacing(2),
                display: "flex",
                alignItems: "center",
                "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
              }}
            >
              <Box
                component="img"
                src={refundIcon}
                sx={{
                  width: "25px",
                  height: "25px",
                  marginRight: "10px",
                  objectFit: "contain",
                }}
              />
              <Typography>Return to Viewing All Properties</Typography>
            </Button>
            <Box
              sx={{
                marginTop: theme.spacing(4),
                width: "100%",
              }}
            >
              <PropertyNavigator
                index={index}
                propertyList={propertyList}
                allRentStatus={allRentStatus}
                isDesktop={isDesktop}
                rawPropertyData={rawPropertyData}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}