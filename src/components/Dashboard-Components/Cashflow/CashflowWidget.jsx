import React, { useState } from "react";
import { Typography, Grid, Box, Stack, ThemeProvider } from "@mui/material";
import "../../../css/cashflow.css";
import CashflowData from "../../Cashflow/CashflowData";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import MixedChart from "../../Graphs/OwnerCashflowGraph";

function CashflowWidget() {
  const navigate = useNavigate();

  const [revenue, setRevenue] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [expense, setExpense] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);

  const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0);
  const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);
  const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <div className="cf-widget-main" onClick={() => navigate("/cashflowOwner")}>
        <CashflowData
          year={"2023"}
          month={"June"}
          filter={false}
          role={"Owner"}
          userID={"100-000003"}
          setRevenueSummary={setRevenueSummary}
          setExpenseSummary={setExpenseSummary}
          setExpense={setExpense}
          setRevenue={setRevenue}
          setTotalRevenueByMonth={setTotalRevenueByMonth}
          setTotalExpenseByMonth={setTotalExpenseByMonth}
          setRevenueCashflowByMonth={setRevenueCashflowByMonth}
        ></CashflowData>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                June 2023
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
                $
                {
                  totalRevenueByMonth && totalExpenseByMonth ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2) : "0.00"
                }
              </Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Revenue</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                $
                {totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>
            <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Expenses</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                $
                {totalExpenseByMonth ? totalExpenseByMonth : "0.00"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <MixedChart revenueCashflowByMonth={revenueCashflowByMonth}></MixedChart>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default CashflowWidget;
