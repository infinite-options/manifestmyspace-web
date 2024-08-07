import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Stack, ThemeProvider, Button, Container, Select, Menu, MenuItem, FormControl } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../../../css/cashflow.css";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import DashboardChart from "../../Graphs/ManagerProfitGraph";
import { months } from "moment";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { ReactComponent as HomeIcon } from "../../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../../images/calendar_icon.svg";
import AddRevenueIcon from "../../../images/AddRevenueIcon.png";

// "../../images/AddRevenueIcon.png"

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px", // Adjust the spacing between buttons as needed
  },
  container: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: "20px", // Adjust the spacing between rows
  },
});

function getTotalRevenueByMonthYear(data, month, year) {
  console.log("In getTotalRevenueByMonthYear: ", data, month, year);
  let revenueItems = data?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "revenue");
  console.log("After filter revenueItems: ", revenueItems);
  let totalRevenue = revenueItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid_total"] ? item["total_paid_total"] : 0.0);
  }, 0.0);
  console.log("Cashflow Fetch Data total Revenue: ", totalRevenue);
  return totalRevenue;
}

function getTotalExpenseByMonthYear(data, month, year) {
  let expenseItems = data?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "expense");
  let totalExpense = expenseItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid_total"] ? item["total_paid_total"] : 0.0);
  }, 0.0);
  return totalExpense;
}

function getTotalExpectedRevenueByMonthYear(data, month, year) {
  // console.log("In getTotalExpectedRevenueByMonthYear: ", data, month, year);
  let revenueItems = data?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "revenue");
  let totalRevenue = revenueItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due_total"] ? item["pur_amount_due_total"] : 0.0);
  }, 0.0);
  return totalRevenue;
}

function getTotalExpectedExpenseByMonthYear(data, month, year) {
  // console.log(data)
  let expenseItems = data?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "expense");
  let totalExpense = expenseItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due_total"] ? item["pur_amount_due_total"] : 0.0);
  }, 0.0);
  return totalExpense;
}

function getTotalExpectedProfitByMonthYear(data, month, year) {
  // console.log("In getTotalExpectedRevenueByMonthYear: ", data, month, year);
  let profitItems = data?.filter((item) => item.pur_payer?.startsWith("110") && item.pur_receiver?.startsWith("600") && item.cf_month === month && item.cf_year === year);
  let totalProfit = profitItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due_total"] ? item["pur_amount_due_total"] : 0.0);
  }, 0.0);
  return totalProfit;
}

function getTotalProfitByMonthYear(data, month, year) {
  let profitItems = data?.filter((item) => item.pur_payer?.startsWith("110") && item.pur_receiver?.startsWith("600") && item.cf_month === month && item.cf_year === year);
  let totalProfit = profitItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid_total"] ? item["total_paid_total"] : 0.0);
  }, 0.0);
  return totalProfit;
}

function getTotalExpectedRentByMonthYear(data, month, year) {
  // console.log("In getTotalExpectedRevenueByMonthYear: ", data, month, year);
  let revenueItems = data?.filter((item) => item.pur_cf_type === "revenue");
  let rentItems = revenueItems?.filter((item) => item.pur_payer?.startsWith("350") && item.pur_receiver?.startsWith("600") && item.cf_month === month && item.cf_year === year);
  let totalRent = rentItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due_total"] ? item["pur_amount_due_total"] : 0.0);
  }, 0.0);
  return totalRent;
}

function getTotalRentByMonthYear(data, month, year) {
  let revenueItems = data?.filter((item) => item.pur_cf_type === "revenue");
  let rentItems = revenueItems?.filter((item) => item.pur_payer?.startsWith("350") && item.pur_receiver?.startsWith("600") && item.cf_month === month && item.cf_year === year);
  let totalRent = rentItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid_total"] ? item["total_paid_total"] : 0.0);
  }, 0.0);
  return totalRent;
}

function getPast12MonthsCashflow(data, month, year) {
  // console.log("In getPast12MonthsExpectedCashflow: ", data, month, year);
  var pastTwelveMonths = [];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var currentMonth = month;
  var currentYear = year;

  // create a loop that goes back 12 months
  for (var i = 0; i < 12; i++) {
    // console.log(currentMonth, currentYear)

    let expectedMonthRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
    let expectedMonthExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);
    let currentMonthRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
    let currentMonthExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

    let expectedMonthProfit = getTotalExpectedProfitByMonthYear(data, currentMonth, currentYear);
    let currentMonthProfit = getTotalProfitByMonthYear(data, currentMonth, currentYear);

    let expectedMonthRent = getTotalExpectedRentByMonthYear(data, currentMonth, currentYear);
    let currentMonthRent = getTotalRentByMonthYear(data, currentMonth, currentYear);

    console.log("getPast12MonthsCashflow - expectedMonthProfit, currentMonthProfit", expectedMonthProfit, currentMonthProfit);

    // console.log("expectedMonthRevenue", expectedMonthRevenue);
    // console.log("expectedMonthExpense", expectedMonthExpense);
    // console.log("currentMonthRevenue", currentMonthRevenue);
    // console.log("currentMonthExpense", currentMonthExpense);

    pastTwelveMonths.push({
      month: currentMonth,
      year: currentYear,
      // expected_cashflow: expectedMonthRevenue - expectedMonthExpense,
      // cashflow: currentMonthRevenue - currentMonthExpense,

      // expected_revenue: expectedMonthRevenue,
      // revenue:currentMonthRevenue,
      // expected_expense: expectedMonthExpense,
      // expense: currentMonthExpense,

      expected_profit: expectedMonthProfit,
      profit: currentMonthProfit,
      expected_rent: expectedMonthRent,
      rent: currentMonthRent,

      monthYear: currentMonth?.slice(0, 3) + " " + currentYear?.slice(2, 4),
      // "expected_revenue": expectedMonthRevenue,
      // "expected_cashflow": expectedMonthRevenue - expectedMonthExpense,
    });
    if (currentMonth === "January") {
      currentMonth = "December";
      currentYear = (parseInt(currentYear) - 1).toString();
      // console.log(currentYear)
    } else {
      currentMonth = months[months.indexOf(currentMonth) - 1];
    }
  }
  // console.log("Past 12 months: ", pastTwelveMonths);

  pastTwelveMonths.reverse();

  return pastTwelveMonths;
}

function ManagerCashflowWidget({
  profitsTotal,
  rentsTotal,
  payoutsTotal,
  propsMonth,
  propsYear,
  graphData,
  setCurrentWindow,
  propertyList,
  selectedProperty,
  setSelectedProperty,
}) {
  console.log("In ManagerCashflow Widget ");
  console.log("ManagerCashflow widget - propertyList - ", propertyList);
  const navigate = useNavigate();
  const classes = useStyles();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //   let date = new Date();
  //   let currentMonth = date.toLocaleString("default", { month: "long" });
  //   const monthNumber = new Date(Date.parse(currentMonth + " 1, 2024")).getMonth() + 1;
  //   // let currentMonthNumber = date.getMonth() + 1;
  // //   let currentYear = date.getFullYear().toString();
  //   console.log("Cashflow Widget Current Month: ", currentMonth);
  //   // console.log("Cashflow Widget Current Month Number: ", currentMonthNumber);
  //   console.log("Cashflow Widget Current Year: ", currentYear);

  //   const monthIndex = new Date(Date.parse(propsMonth + " 1, 2024")).getMonth();
  //   const date = new Date(propsYear, monthIndex);
  //   let currentMonth = date.toLocaleString("default", { month: "long" });
  //   let currentYear = date.getFullYear().toString();
  let currentMonth = propsMonth;
  let currentYear = propsYear;
  console.log("ManagerCashflowWidget Current Month: ", currentMonth);
  console.log("ManagerCashflowWidget Current Year: ", currentYear);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const { user, getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const profileId = getProfileId();

  //   const expenseCurrentMonth = data?.result?.find( (item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "expense")
  //   const revenueCurrentMonth = data?.result?.find( (item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "revenue")

  //   console.log("expenseCurrentMonth - ", expenseCurrentMonth);
  //   console.log("revenueCurrentMonth - ", revenueCurrentMonth);

  const [profits, setProfits] = useState(null);
  const [rents, setRents] = useState(null);
  const [payouts, setPayouts] = useState(null);
  const [cashflowData, setCashflowData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  const [last12Months, setLast12Months] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  //   useEffect(() => {
  //     console.log("last12Months - ", last12Months);
  //   }, [last12Months]);

  // useEffect(() => {
  //   fetchCashflow(profileId)
  //     .then((data) => {
  //       // console.log("Back in Widget: ", data);
  //       setCashflowData(data);
  //       let currentMonthYearRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
  //       let currentMonthYearExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

  //       let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
  //       let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);

  //       // let last12months = getPast12MonthsCashflow(data, currentMonth, currentYear);
  //       let last12months = getPast12MonthsExpectedCashflow(data, currentMonth, currentYear);

  //       setTotalRevenueByMonth(currentMonthYearRevenue); // currently useing sum(total_paid)
  //       setTotalExpenseByMonth(currentMonthYearExpense); // currently using sum(total_paid)
  //       setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
  //       setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
  //       setLast12Months(last12months);
  //       // setTotalRevenueByMonth(50);  // This works.  Problem:  currentMonthYearRevenue is returning 0
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching cashflow data:", error);
  //     });
  // }, []);

  const getCashflowData = (data) => {
    console.log("getCashflowData - data - ", data);
    if (data === null || data === undefined) return [];

    // const past12Months = getPast12MonthsCashflow(data, month, year)
    const past12Months = getPast12MonthsCashflow(data, month, year);

    console.log("getCashflowData - past12Months - ", past12Months);

    return past12Months;
  };

  useEffect(() => {
    // setCashflowData(data);
    // let currentMonthYearRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
    // let currentMonthYearExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

    // let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
    // let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);

    // // let last12months = getPast12MonthsCashflow(data, currentMonth, currentYear);
    // let last12months = getPast12MonthsExpectedCashflow(data, currentMonth, currentYear);

    // setTotalRevenueByMonth(currentMonthYearRevenue); // currently useing sum(total_paid)
    // setTotalExpenseByMonth(currentMonthYearExpense); // currently using sum(total_paid)
    // setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
    // setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
    // setLast12Months(last12months);
    // setTotalRevenueByMonth(50);  // This works.  Problem:  currentMonthYearRevenue is returning 0

    setProfits(profitsTotal);
    setRents(rentsTotal);
    setPayouts(payoutsTotal);
    setMonth(propsMonth);
    setYear(propsYear);
    let filteredGraphdata = [];
    if (selectedProperty === "ALL") {
      filteredGraphdata = graphData;
      // console.log("ROHIT - filteredGraphdata - ", filteredGraphdata);
    } else {
      filteredGraphdata = graphData?.filter((item) => item.property_id === selectedProperty);
      // console.log("ROHIT - filteredGraphdata - ", filteredGraphdata);
    }
    let cashflowLast12Months = getCashflowData(filteredGraphdata);
    setLast12Months(cashflowLast12Months);
    // let revenue = getRevenueData(graphData);
    // setCashflowData(cashflow);
    // setRevenueData(revenue);
  }, [profitsTotal, rentsTotal, payoutsTotal, propsMonth, propsYear, graphData]);

  const handlePropertyChange = (propertyUID) => {
    console.log("ManagerCashflowWidget - handlePropertyChange - value - ", propertyUID);
    setSelectedProperty(propertyUID);
    setAnchorEl(null);
  };

  const handleSelectAllProperties = () => {
    setSelectedProperty("ALL");
  };

  const viewProperties = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>
      {/* <div
        className="cf-widget-main"
        onClick={() =>
          navigate("/cashflow", {
            state: {
              month,
              year,
            },
          })
        }
      > */}
      <Container sx={{ backgroundColor: "#F2F2F2", borderRadius: "5px", marginTop: "2px" }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          //   onClick={() =>
          //     navigate("/cashflow", {
          //       state: {
          //         month,
          //         year,
          //         cashflowWidgetData: data,
          //       },
          //     })
          //   }
        >
          <Grid container item xs={12} rowSpacing={0} sx={{ marginTop: "15px" }}>
            <Stack direction='row' justifyContent='center' width='100%' sx={{ marginBottom: "0px" }}>
              {/* <Typography sx={{ color: theme.typography.primary.black, fontWeight: "800", fontSize: "24px", }}> */}
              <Typography variant='h5' sx={{ fontWeight: "bold", color: "#160449" }}>
                {month} {year} Cashflow
              </Typography>
            </Stack>
            <Grid item container xs={12}>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Button
                  variant='outlined'
                  id='revenue'
                  // className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    // backgroundColor: '#160449',
                    color: "#3D5CAC",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    // navigate(propertyRoutingBasedOnSelectedRole());
                  }}
                >
                  <CalendarIcon stroke='#3D5CAC' width='20' height='20' style={{ marginRight: "4px" }} />
                  Last 30 days
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <Button
                  variant='outlined'
                  id='revenue'
                  className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    // backgroundColor: '#160449',
                    color: "#3D5CAC",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                  onClick={viewProperties}
                >
                  <HomeIcon fill='#3D5CAC' width='15' height='15' style={{ marginRight: "4px" }} />
                  {!isMobile && "Select Property"}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  // onChange={handlePropertyChange}
                  onClose={handleClose}
                >
                  {/* <Select value={selectedProperty} onChange={handlePropertyChange} variant="filled" displayEmpty> */}
                  {propertyList?.map((property, index) => {
                    return (
                      <MenuItem
                        key={property.property_uid}
                        value={property}
                        onClick={() => {
                          handlePropertyChange(property.property_uid);
                        }}
                      >
                        {property.property_address}
                        {property.property_unit ? `, Unit - ${property.property_unit}` : ""}
                      </MenuItem>
                    );
                  })}
                  {/* </Select> */}
                </Menu>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <Button
                  variant='outlined'
                  id='all_properties'
                  // className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    // backgroundColor: '#160449',
                    color: "#3D5CAC",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    handleSelectAllProperties();
                  }}
                >
                  {/* <CalendarIcon stroke="#3D5CAC" width="20" height="20" style={{ marginRight: "4px" }} /> */}
                  All Properties
                </Button>
              </Grid>
            </Grid>
            <Grid item container xs={12} sx={{ marginBottom: "10px" }}>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                  variant='outlined'
                  id='revenue'
                  // className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    backgroundColor: "#D0D0D0",
                    color: "#160449",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // navigate("/addRevenue", { state: { edit: false, itemToEdit: null } });
                    setCurrentWindow("ADD_REVENUE");
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Revenue
                </Button>
              </Grid>

              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                  variant='outlined'
                  id='revenue'
                  // className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    backgroundColor: "#D0D0D0",
                    color: "#160449",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // navigate("/addExpense", { state: { edit: false, itemToEdit: null } });
                    setCurrentWindow("ADD_EXPENSE");
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Expense
                </Button>
              </Grid>
            </Grid>
            <Grid container direction='row' item xs={12} columnSpacing={3}>
              <Grid item xs={5}></Grid>
              <Grid item xs={3} sx={{ backgroundColor: "#FFE3AD", borderRadius: "5px", padding: "5px", display: "flex", justifyContent: "center" }}>
                Expected
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid
                container
                item
                xs={3}
                justifyContent='center'
                sx={{ backgroundColor: "#8696BE", borderRadius: "5px", padding: "5px", display: "flex", justifyContent: "center" }}
              >
                Actual
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              onClick={(e) => {
                // e.stopPropagation();
                setCurrentWindow("PROFITABILITY");
              }}
              sx={{
                cursor: "pointer",
              }}
            >
              <Grid container direction='row' item xs={12} columnSpacing={3} sx={{ backgroundColor: "#160449", borderRadius: "5px", marginTop: "5px" }}>
                <Grid item xs={5} sx={{ padding: "5px", display: "flex" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>{`Profit`}</Typography>
                </Grid>
                <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    {/* ${(profits?.pur_amount_due != null && revenueCurrentMonth?.pur_amount_due != null ) ? (parseFloat(revenueCurrentMonth.pur_amount_due) - parseFloat(expenseCurrentMonth.pur_amount_due)).toFixed(2) : 0} */}
                    ${profits?.totalExpected ? parseFloat(profits?.totalExpected).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    ${profits?.totalActual ? parseFloat(profits?.totalActual).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction='row' item xs={12} columnSpacing={3} sx={{ backgroundColor: "#9EAED6", borderRadius: "5px", marginTop: "5px" }}>
                <Grid item xs={5} sx={{ padding: "5px", display: "flex" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>{`Rents`}</Typography>{" "}
                </Grid>
                <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    ${rents?.totalExpected ? parseFloat(rents?.totalExpected).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    ${rents?.totalActual ? parseFloat(rents?.totalActual).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction='row' item xs={12} columnSpacing={3} sx={{ backgroundColor: "#979797", borderRadius: "5px", marginTop: "5px" }}>
                <Grid item xs={5} sx={{ padding: "5px", display: "flex" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>{`Payouts`}</Typography>
                </Grid>
                <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    ${payouts?.totalExpected ? parseFloat(payouts?.totalExpected).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight }}>
                    ${payouts?.totalActual ? parseFloat(payouts?.totalActual).toFixed(2) : "0.00"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item container xs={12} sx={{ marginBottom: "10px", marginTop: "10px" }}>
            <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <Button
                variant='outlined'
                id='revenue'
                // className={classes.button}
                style={{
                  // height: "100%",
                  width: "60%",
                  backgroundColor: "#D0D0D0",
                  color: "#160449",
                  fontSize: "13px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate("/addRevenue", { state: { edit: false, itemToEdit: null } });
                  navigate("/payments", { state: { managerCashflowWidgetData: { profitsTotal, rentsTotal, payoutsTotal, propsMonth, propsYear, graphData } } });

                  // setShowProfitability(false);
                  // setShowTransactions(false)
                  // setShowPayments(true);
                }}
              >
                Pay Bills
              </Button>
            </Grid>

            <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <Button
                variant='outlined'
                id='revenue'
                // className={classes.button}
                style={{
                  // height: "100%",
                  width: "60%",
                  backgroundColor: "#D0D0D0",
                  color: "#160449",
                  fontSize: "13px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate("/managerTransactions");
                  setCurrentWindow("TRANSACTIONS");
                }}
              >
                Transactions
              </Button>
            </Grid>

            {/* <Grid item xs={4} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  id="profits"
                  // className={classes.button}
                  style={{
                    // height: "100%",
                    // width: '80%',
                    backgroundColor: "#D0D0D0",
                    color: "#160449",
                    fontSize: "13px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/managerCashflow");
                  }}
                >                                    
                  Profits
                </Button>
              </Grid> */}
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant='h5' sx={{ fontWeight: "bold", color: "#160449" }}>
              Cashflow and Revenue
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ height: "350px" }}>
            <DashboardChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} />
          </Grid>
          {/* <Grid container item xs={12}>
            {
              graphDataKeys.map( (dataKey, index) => {
                const color = dataKey?.color;
                return (
                  <Grid container direction='row' alignContent='center' justifyContent='center' item xs={6} key={index}>
                    <Box                      
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '15px',
                        backgroundColor: color,
                        marginRight: '10px',
                      }}
                    >

                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                      }}                    
                    >
                      <Typography sx={{color: color,}}>
                        {dataKey.name}
                      </Typography>
                    </Box>
                  </Grid> 
                );
              })

            }
          </Grid> */}
        </Grid>
      </Container>
      {/* </div> */}
    </ThemeProvider>
  );
}

export default ManagerCashflowWidget;
