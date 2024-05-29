import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext.jsx";
// import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
// import { Box } from '@mui/material';
import Status from "../../Templates/Status.jsx";
import theme from "../../../theme/theme.js";
import { Button, Box, ThemeProvider, Typography, Grid, Container } from "@mui/material";
import { nextMonday } from "date-fns";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function LeaseWidget(props) {
  console.log("In Lease Widget", props);
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const { leaseRoutingBasedOnSelectedRole, user, selectedRole } = useUser();

  // console.log("Role: ", user);
  // console.log("Selected Role: ", selectedRole);

  // let date = new Date();
  let moveoutsInSixWeeks = 0;
  let MTMCount = 0;
  let leaseStatusData = props.leaseData;

  // const currentYear = new Date().getFullYear();
  // const currentMonth = new Date().getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
  // console.log("Current Month: ", currentMonth);
  var leaseStatus = {};
  const leaseStatusDictionary = {};

  // Date object for today
  const today = new Date();
  const currentDay = today.getDate();
  // console.log("Today: ", today, currentDay);
  let nextMonth = today.getMonth();
  let currentMonth = today.getMonth() + 1; // Adding 1 to adjust to 1-indexed months
  if (currentMonth === 12) {
    nextMonth = 1;
  } else {
    nextMonth = currentMonth + 1;
  }
  const currentYear = new Date().getFullYear();
  //   console.log("Dates: ", currentDay, currentMonth, nextMonth, currentYear);

  leaseStatusData.forEach((item) => {
    // console.log("Lease item: ", item);
    // console.log("Lease end month ", item.lease_end_month);
    // console.log("Lease end num ", item.lease_end_num);
    // console.log("Leases_expiring ", item.leases_expiring);
    // console.log("Move Out ", item.move_out);
    if (item.lease_end_month !== "MTM" && item.lease_end_month !== "FUTURE") {
      leaseStatusDictionary[item.lease_end_num] = item.leases_expiring;
      // console.log(currentMonth, item.lease_end_num, currentMonth === item.lease_end_num);
      if (currentMonth === item.lease_end_num) {
        moveoutsInSixWeeks = moveoutsInSixWeeks + item.move_out;
      }
    }
    if (item.lease_end_month === "MTM") {
      MTMCount++;
    }
  });

  leaseStatus = leaseStatusDictionary;
  // console.log("Lease Status: ", leaseStatus);
  // console.log("Lease Status March: ", leaseStatus[3]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          backgroundColor: "#F2F2F2",
          borderRadius: "10px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Grid
          container
          item
          sx={{
            // height: '200px',
            width: "100%",
            padding: "15px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/Leases")}
          xs={12}
          rowSpacing={6}
        >
          <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#160449" }}>
              Leases Expiring: Next 12 Months
            </Typography>
          </Grid>
          <Grid item container xs={12}>
            <Grid item container justifyContent="center" alignItems="center" xs={12} md={9} rowSpacing={4}>
              {[...Array(12)].map((_, index) => (
                <Grid item key={index} xs={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: (currentMonth === index + 1 && "#F87C7A") || (currentMonth + 1 === index + 1 && "#FFC85C") || "#FFFFFF",
                      color: "#160449",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <Typography sx={{ fontWeight: "900", fontSize: "18px" }}>{leaseStatus && leaseStatus[index + 1] ? leaseStatus[index + 1] : 0}</Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>{monthNames[index].toUpperCase()}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Grid
              container
              item
              justifyContent="space-evenly"
              alignItems="center"
              xs={12}
              md={3}
              rowSpacing={3}
              columnSpacing={6}
              sx={{
                marginTop: isMediumScreen ? "10px" : "0",
              }}
            >
              <Grid item xs={4} md={8}>
                <Box
                  sx={{
                    // width: '80%',
                    height: "35px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#F87C7A",
                    borderRadius: "5px",
                    color: "#160449",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Move-outs</Typography>
                    {!isMediumScreen && <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>(Next 6 Weeks)</Typography>}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>{moveoutsInSixWeeks}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4} md={8}>
                <Box
                  sx={{
                    // width: '80%',
                    height: "35px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFC85C",
                    borderRadius: "5px",
                    color: "#160449",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>MTM</Typography>
                    {!isMediumScreen && <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>(Month-To-Month)</Typography>}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>{MTMCount}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
