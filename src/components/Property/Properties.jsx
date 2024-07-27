import { Box, Container, Grid, Paper, ThemeProvider, Typography } from "@mui/material";
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import RevenueWidget from "../Dashboard-Components/Revenue/RevenueWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropertiesList from "./PropertiesList";

function Properties() {
  const [dataReady, setDataReady] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  // useEffect(() => {
  //   // console.log("PropertyList useEffect");
  //   // console.log(propertyList);
  //   const fetchData = async () => {
  //     //   console.log("Profile: ", profileId);
  //     //   console.log("GetProfile: ", getProfileId);
  //     setShowSpinner(true);
  //     // const response = await fetch(`http://localhost:4000/properties/${profileId}`)
  //     //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000003`)
  //     const response = await fetch(`${APIConfig.baseURL.dev}/properties/${profileId}`);

  //     const propertyData = await response.json();
  //     console.log("In Property List >> Property Data: ", propertyData); // This has Applications, MaintenanceRequests, NewPMRequests and Property info from endpoint
  //     const propertyList = getPropertyList(propertyData);
  //     // console.log("In Property List >> Property List: ", propertyList);
  //     // console.log("Testing Property Data", propertyData.Property.result);
  //     setRawPropertyData(propertyData);
  //     console.log("New Set PM Requests: ", rawPropertyData);

  //     setPropertyList([...propertyList]);
  //     setDisplayedItems([...propertyList]);
  //     const propertyRent = await propertyRentDetails();
  //     setAllRentStatus(propertyRent.RentStatus.result);
  //     if (location.state) {
  //       if (location.state.isBack === true) {
  //         setPropertyIndex(propertyList.length - 1);
  //         navigate(location.pathname, { replace: true, state: {} });
  //       } else {
  //         setPropertyIndex(location.state.index);
  //         navigate(location.pathname, { replace: true, state: {} });
  //       }
  //     }
  //     if (propertyData.Property.code == 200 && propertyRent.RentStatus.code == 200) {
  //       setDataReady(true);
  //     }
  //     if (selectedRole == "MANAGER" && sessionStorage.getItem("isrent") == "true") {
  //       setFromRentWidget(true);
  //     } else {
  //       setFromRentWidget(false);
  //       sessionStorage.removeItem("isrent");
  //     }
  //   };
  //   fetchData();
  //   // Check screen size on initial load
  //   handleResize();
  //   setShowSpinner(false);
  //   // Optionally, add a resize event listener
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    console.log("dataReady", dataReady);
    console.log("showSpinner", showSpinner);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg' sx={{ paddingTop: "10px", paddingBottom: "20px", marginTop: theme.spacing(2) }}>
        {/* {showSpinner || !dataReady ? (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color='inherit' />
          </Backdrop>
        ) : ( */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              All Properties List
            </Typography>
            {/* <PropertiesList /> */}
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              Proprty Navigator
            </Typography>
          </Grid>
        </Grid>
        {/* )} */}
      </Container>
    </ThemeProvider>
  );
}

export default Properties;
