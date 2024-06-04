import { ThemeProvider, Typography, Box, Tabs, Tab, Paper, Card, CardHeader, Slider, Stack, Button, Grid } from "@mui/material";

import theme from "../../theme/theme";
import PropertyNavigator from "../Property/PropertyNavigator";

export default function PropertyDetail({ index, propertyList, allRentStatus, isDesktop }) {
  console.log("In Property Detail Desktop");
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%", // Take up full screen width
          minHeight: "100vh", // Set the Box height to full height
          height:"100%",
        }}
      >
        <PropertyNavigator index={index} propertyList={propertyList} allRentStatus={allRentStatus} isDesktop={isDesktop}/>
      </Box>
    </ThemeProvider>
  );
}
