import { ThemeProvider, Typography, Box, Tabs, Tab, Paper, Card, CardHeader, Slider, Stack, Button, Grid } from "@mui/material";

import theme from "../../theme/theme";
import PropertyNavigator from "../Property/PropertyNavigator";

export default function PropertyDetail({ setEditPropertyState, setTenantAppNavState, setPmQuoteRequestedState, setManagerDetailsState, onShowSearchManager, index, propertyList, allRentStatus, isDesktop, allContracts }) {
  console.log("In Property Detail Desktop", allContracts);
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%", // Take up full screen width
          // minHeight: "100vh", // Set the Box height to full height
          height:"100%",
        }}
      >
        <PropertyNavigator  setEditPropertyState= {setEditPropertyState} setTenantAppNavState={setTenantAppNavState} setPmQuoteRequestedState={setPmQuoteRequestedState} setManagerDetailsState={setManagerDetailsState} onShowSearchManager={onShowSearchManager} index={index} propertyList={propertyList} allRentStatus={allRentStatus} isDesktop={isDesktop} contracts={allContracts}/>
      </Box>
    </ThemeProvider>
  );
}
