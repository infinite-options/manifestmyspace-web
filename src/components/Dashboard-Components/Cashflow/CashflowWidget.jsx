import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Stack, ThemeProvider } from "@mui/material";
import "../../../css/cashflow.css";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import MixedChart from "../../Graphs/OwnerCashflowGraph";
import { months } from "moment";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchCashflow,
  getTotalRevenueByMonthYear,
  getTotalExpenseByMonthYear,
  getPast12MonthsCashflow,
  getPast12MonthsExpectedCashflow,
  getTotalExpectedRevenueByMonthYear,
  getTotalExpectedExpenseByMonthYear,
} from "../../Cashflow/CashflowFetchData";

function CashflowWidget() {
  const navigate = useNavigate();

  let date = new Date();
  let currentMonth = date.toLocaleString("default", { month: "long" });
  let currentYear = date.getFullYear().toString();
  console.log("Crrrent Month: ", currentMonth);
  console.log("Current Year: ", currentYear);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const { user, getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0);
  const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);
  const [expectedRevenueByMonth, setExpectedRevenueByMonth] = useState(0);
  const [expectedExpenseByMonth, setExpectedExpenseByMonth] = useState(0);
  const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);
  const [last12Months, setLast12Months] = useState([]);
  const profileId = getProfileId();
  const [cashflowData, setCashflowData] = useState(null);

  useEffect(() => {
    fetchCashflow(profileId)
      .then((data) => {
        console.log("Back in Widget: ", data);
        setCashflowData(data);
        let currentMonthYearRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
        let currentMonthYearExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

        let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
        let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);

        console.log("Before last 12 months call");
        // let last12months = getPast12MonthsCashflow(data, currentMonth, currentYear);
        let last12months = getPast12MonthsExpectedCashflow(data, currentMonth, currentYear);

        setTotalRevenueByMonth(currentMonthYearRevenue); // currently useing sum(total_paid)
        setTotalExpenseByMonth(currentMonthYearExpense); // currently using sum(total_paid)
        setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
        setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
        setLast12Months(last12months);
        // setTotalRevenueByMonth(50);  // This works.  Problem:  currentMonthYearRevenue is returning 0
      })
      .catch((error) => {
        console.error("Error fetching cashflow data:", error);
      });
  }, []);

  console.log("TotalRevenueByMonth: ", totalRevenueByMonth);
  console.log("TotalExpenseByMonth: ", totalExpenseByMonth);
  console.log("ExpectedTotalRevenueByMonth: ", expectedRevenueByMonth);
  console.log("ExpectedTotalExpenseByMonth: ", expectedExpenseByMonth);
  console.log("Last12Months: ", last12Months);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className="cf-widget-main"
        onClick={() =>
          navigate("/cashflow", {
            state: {
              month,
              year,
            },
          })
        }
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                {month} {year}
              </Typography>
            </Stack>
            <Box
              component="span"
              m={1}
              padding={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{
                backgroundColor: theme.palette.custom.blue,
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Cashflow</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${totalRevenueByMonth ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2) : "0.00"}
              </Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, ml: 4 }}> Revenue</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, ml: 4 }}> Expenses</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${totalExpenseByMonth ? totalExpenseByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>
            <Box
              component="span"
              m={1}
              padding={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{
                backgroundColor: theme.palette.custom.yellow,
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Expected Cashflow</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${expectedRevenueByMonth ? (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2) : "0.00"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <MixedChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default CashflowWidget;
