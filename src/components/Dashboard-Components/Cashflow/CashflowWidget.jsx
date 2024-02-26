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
import { fetchCashflow, getTotalExpenseByMonthYear, getPast12MonthsCashflow, getTotalRevenueByMonthYear } from "../../Cashflow/CashflowFetchData";

export default function CashflowWidget(props) {
  const navigate = useNavigate();
  let date = new Date();
  let currentYear = date.getFullYear().toString();
  let currentMonth = date.toLocaleString("default", { month: "long" });
  console.log("Current month:", currentMonth, currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  let cashflowStatusData = props.cashflowData;
  //   console.log("Cashflow data available: ", cashflowStatusData);
  //   console.log("Cashflow data available: ", cashflowStatusData[0]);
  //   console.log("Cashflow data available: ", cashflowStatusData[0]?.cf_month);

  let cashflowRevenue = 0;
  let cashflowExpense = 0;
  let cashflow = cashflowRevenue - cashflowExpense;

  console.log("Cashflow Revenue: ", cashflowRevenue);
  console.log("Cashflow Expense: ", cashflowExpense);

  const { user, getProfileId } = useUser();
  const profileId = getProfileId();
  const [showSpinner, setShowSpinner] = useState(false);

  const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0);
  const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);
  const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);
  const [last12Months, setLast12Months] = useState([]);
  const [cashflowData, setCashflowData] = useState(null);

  // Loop throught each item to find the current month
  console.log("Current month ", currentMonth);
  console.log(cashflowStatusData);
  //   let currentMonthData = cashflowStatusData.filter((item) => item.cf_month === currentMonth && item.cf_year === currentYear);

  cashflowStatusData.forEach((item) => {
    // console.log("Cashflow item: ", item);
    // console.log("Cashflow month ", item.cf_month);
    // console.log("Cashflow amount ", item.amount);
    // console.log("Cashflow purchase type ", item.pur_cf_type);

    if (item.cf_month === currentMonth && item.cf_year === currentYear) {
      if (item.pur_cf_type === "revenue") {
        cashflowRevenue = item.amount;
      } else if (item.pur_cf_type === "expense") {
        cashflowExpense = item.amount;
      }
    }

    cashflow = cashflowRevenue - cashflowExpense;
    // console.log("Cashflow Revenue: ", cashflowRevenue);
    // console.log("Cashflow Expense: ", cashflowExpense);
    // console.log("Cashflow: ", cashflowRevenue - cashflowExpense);
  });

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
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>${cashflow ? cashflow.toFixed(2) : "0.00"}</Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Revenue</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>${cashflowRevenue ? cashflowRevenue : "0.00"}</Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Expenses</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>${cashflowExpense ? cashflowExpense : "0.00"}</Typography>
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

// export default CashflowWidget;
