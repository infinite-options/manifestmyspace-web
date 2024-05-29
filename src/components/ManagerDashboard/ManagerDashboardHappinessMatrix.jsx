import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, Paper, Typography, Stack, Grid, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
// import CashflowData from '../Cashflow/CashflowData';
// import { getPast12MonthsCashflow, fetchCashflow } from '../Cashflow/CashflowFetchData';
import MixedChart from "../Graphs/OwnerCashflowGraph";
import CommentIcon from "@mui/icons-material/Comment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";

export default function ManagerDashboardHappinessMatrix(props) {
  console.log("In ManagerDashboardHappinessMatrix");
  const navigate = useNavigate();
  const location = useLocation();
  let matrixData = location.state.matrixData;
  let clicked_owner_index = location.state.clicked_index;

  const { user, getProfileId } = useUser();
  const profileId = getProfileId();
  const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  let date = new Date();
  let currentMonth = date.toLocaleString("default", { month: "long" });
  let currentYear = date.getFullYear().toString();
  let [p_owner, p_owner_setter] = useState(matrixData[clicked_owner_index]);
  const [cashflowData, setCashflowData] = useState(null);
  const [last12Months, setLast12Months] = useState([]);

  // useEffect(() => {
  //     fetchCashflow(profileId).then((data) => {
  //         setCashflowData(data)
  //         // let currentMonthYearRevenueExpected = get

  //     }).catch((error) => {
  //         console.error("Error fetching cashflow data:", error)
  //     })
  // }, [])

  // useEffect(() => {
  //     if (cashflowData){
  //          setLast12Months(getPast12MonthsCashflow(cashflowData,currentMonth, currentYear));
  //     }

  // }, [cashflowData])

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <CashflowData setShowSpinner={setShowSpinner} year={currentYear} month={currentMonth} role={'Owner'} userID={user.user_uid} setRevenueCashflowByMonth={setRevenueCashflowByMonth}></CashflowData> */}
      <ThemeProvider theme={theme}>
        <Paper
          component={Stack}
          direction="column"
          justifyContent="center"
          style={{
            justifyContent: "center",
            width: "100%", // Take up full screen width
            marginTop: "60px", // Set the margin to 60px
          }}
        >
          <Box component="span" display="flex" justifyContent="center" alignItems="center" position="relative">
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              Happiness Matrix
            </Typography>
          </Box>

          <Paper
            style={{
              margin: "50px", // Add margin here
              padding: "40px",
              backgroundColor: theme.palette.primary.main,
              height: 400,
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
          ></Paper>
          <Paper
            style={{
              margin: "50px", // Add margin here
              marginTop: "20px",
              padding: 10,
              backgroundColor: theme.palette.primary.main,
              height: "25%",
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
            // onClick={() => navigate('/cashflow')}
          >
            <Stack direction="row" justifyContent="left">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={3}>
                  <AccountCircleIcon
                    sx={{
                      color: theme.typography.common.blue,
                      width: 70,
                      height: 70,
                    }}
                  ></AccountCircleIcon>
                </Grid>
                <Grid item xs={8}>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                      {p_owner?.name || ""}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                      {p_owner?.total_properties || ""} Properties Managed by You
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                      {p_owner?.vacancy_num || ""} Properties Vacant
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                      {`$${p_owner?.delta_cashflow} (${p_owner?.delta_cashflow_perc}%) Cashflow Delta`}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={1}>
                  <Stack direction="row" justifyContent="right">
                    <CommentIcon sx={{ color: theme.typography.common.blue }}></CommentIcon>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>

            <Stack direction="row" justifyContent="left">
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                December 2023 Cashflow
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="left">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}>{`Actual Cashflow: \$ ${p_owner?.cashflow}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="left">
                    <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}>
                      {`Expected Cashflow: \$ ${p_owner?.expected_cashflow}`}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="right" height={150}>
                    {/* <MixedChart revenueCashflowByMonth={revenueCashflowByMonth}></MixedChart> */}
                    {/* <MixedChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} /> */}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Paper>
      </ThemeProvider>
    </>
  );
}
