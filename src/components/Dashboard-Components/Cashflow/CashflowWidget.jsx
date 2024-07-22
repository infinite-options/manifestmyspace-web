import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Stack, ThemeProvider, Button, Container } from "@mui/material";
import "../../../css/cashflow.css";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import DashboardChart from "../../Graphs/OwnerDashboardGraph";
import { months } from "moment";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import {
//   fetchCashflow,
//   // getTotalRevenueByMonthYear,
//   // getTotalExpenseByMonthYear,
//   getPast12MonthsCashflow,
//   // getPast12MonthsExpectedCashflow,
//   // getTotalExpectedRevenueByMonthYear,
//   // getTotalExpectedExpenseByMonthYear,
// } from "../../Cashflow/CashflowFetchData";

import {
  // getTotalRevenueByType,
  // getTotalExpenseByType,  
  getTotalExpenseByMonthYear,
  getTotalRevenueByMonthYear,
  getTotalExpectedRevenueByMonthYear,
  getTotalExpectedExpenseByMonthYear,
  getPast12MonthsExpectedCashflow,
  // getPast12MonthsCashflow,
  // getNext12MonthsCashflow,
  // getRevenueList,
  // getExpenseList,
} from "../../Cashflow/CashflowFetchData2";



import { ReactComponent as HomeIcon } from "../../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../../images/calendar_icon.svg";
import AddRevenueIcon from "../../../images/AddRevenueIcon.png";

// "../../images/AddRevenueIcon.png"

function CashflowWidget({ data }) {
  console.log("In Cashflow Widget ");
  console.log("Cashflow Widget - data - ", data);
  const navigate = useNavigate();

  let date = new Date();
  let currentMonth = date.toLocaleString("default", { month: "long" });
  // let currentMonthNumber = date.getMonth() + 1;
  let currentYear = date.getFullYear().toString();
  console.log("Cashflow Widget Current Month: ", currentMonth);
  // console.log("Cashflow Widget Current Month Number: ", currentMonthNumber);  
  console.log("Cashflow Widget Current Year: ", currentYear);

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

  const expenseCurrentMonth = data?.result?.find( (item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "expense")  
  const revenueCurrentMonth = data?.result?.find( (item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "revenue")

  console.log("expenseCurrentMonth - ", expenseCurrentMonth);
  console.log("revenueCurrentMonth - ", revenueCurrentMonth);

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


  useEffect(() => {    
        setCashflowData(data);
        let currentMonthYearRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
        let currentMonthYearExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

        let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
        let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);

        // let last12months = getPast12MonthsCashflow(data, currentMonth, currentYear);
        let last12months = getPast12MonthsExpectedCashflow(data, currentMonth, currentYear);        

        setTotalRevenueByMonth(currentMonthYearRevenue); // currently useing sum(total_paid)
        setTotalExpenseByMonth(currentMonthYearExpense); // currently using sum(total_paid)
        setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
        setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
        setLast12Months(last12months);
        // setTotalRevenueByMonth(50);  // This works.  Problem:  currentMonthYearRevenue is returning 0
      
  }, [data]);

  // Confirm data has been received.  Comment out before publishing
  // console.log("TotalRevenueByMonth: ", totalRevenueByMonth);
  // console.log("TotalExpenseByMonth: ", totalExpenseByMonth);
  // console.log("ExpectedTotalRevenueByMonth: ", expectedRevenueByMonth);
  // console.log("ExpectedTotalExpenseByMonth: ", expectedExpenseByMonth);
  // console.log("Last12Months: ", last12Months);

  //   return (
  //     <ThemeProvider theme={theme}>
  //       <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
  //         <CircularProgress color="inherit" />
  //       </Backdrop>
  //       <div
  //         className="cf-widget-main"
  //         onClick={() =>
  //           navigate("/cashflow", {
  //             state: {
  //               month,
  //               year,
  //             },
  //           })
  //         }
  //       >
  //         <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  //           <Grid item xs={6}>
  //             <Stack direction="row" justifyContent="center">
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
  //                 {month} {year}
  //               </Typography>
  //             </Stack>
  //             <Box
  //               component="span"
  //               m={1}
  //               padding={2}
  //               display="flex"
  //               justifyContent="space-between"
  //               alignItems="center"
  //               style={{
  //                 backgroundColor: theme.palette.custom.blue,
  //                 borderRadius: "5px",
  //               }}
  //             >
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Cashflow</Typography>
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
  //                 ${totalRevenueByMonth ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2) : "0.00"}
  //               </Typography>
  //             </Box>
  //             <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, ml: 4 }}> Revenue</Typography>
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
  //                 ${totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00"}
  //               </Typography>
  //             </Box>
  //             <Box component="span" m={1} padding={2} display="flex" justifyContent="space-between" alignItems="center">
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, ml: 4 }}> Expenses</Typography>
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
  //                 ${totalExpenseByMonth ? totalExpenseByMonth.toFixed(2) : "0.00"}
  //               </Typography>
  //             </Box>
  //             <Box
  //               component="span"
  //               m={1}
  //               padding={2}
  //               display="flex"
  //               justifyContent="space-between"
  //               alignItems="center"
  //               style={{
  //                 backgroundColor: theme.palette.custom.yellow,
  //                 borderRadius: "5px",
  //               }}
  //             >
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Expected Cashflow</Typography>
  //               <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
  //                 ${expectedRevenueByMonth ? (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2) : "0.00"}
  //               </Typography>
  //             </Box>
  //           </Grid>
  //           <Grid item xs={6}>
  //             <DashboardChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} />
  //           </Grid>
  //         </Grid>
  //       </div>
  //     </ThemeProvider>
  //   );
  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
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
      <Container sx={{ height: "100%", backgroundColor: "#F2F2F2", borderRadius: "10px", marginTop: "2px" }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          onClick={() =>
            navigate("/cashflow", {
              state: {
                month,
                year,
                cashflowWidgetData: data,
              },
            })
          }
        >
          <Grid container item xs={12} rowSpacing={0} sx={{ marginTop: "15px" }}>
            <Stack direction="row" justifyContent="center" width="100%" sx={{ marginBottom: "0px" }}>
              {/* <Typography sx={{ color: theme.typography.primary.black, fontWeight: "800", fontSize: "24px", }}> */}
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#160449" }}>
                {month} {year} Cashflow
              </Typography>
            </Stack>
            <Grid item container xs={12}>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Button
                  variant="outlined"
                  id="revenue"
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
                  <CalendarIcon stroke="#3D5CAC" width="20" height="20" style={{ marginRight: "4px" }} />
                  Last 30 days
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <Button
                  variant="outlined"
                  id="revenue"
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
                  // onClick={handleSelectPropertyClick}
                >
                  <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: "4px" }} />
                  Select Property
                </Button>
              </Grid>
            </Grid>
            <Grid item container xs={12} sx={{ marginBottom: "10px" }}>
              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  id="revenue"
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
                    navigate("/addRevenue", { state: { edit: false, itemToEdit: null } });
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Revenue
                </Button>
              </Grid>

              <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  id="revenue"
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
                    navigate("/addExpense", { state: { edit: false, itemToEdit: null } });
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Expense
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row" item xs={12} columnSpacing={3}>
              <Grid item xs={5}>                                    
              </Grid>
              <Grid item xs={3}  sx={{backgroundColor: '#FFE3AD', borderRadius: '5px', padding: '5px', display:'flex', justifyContent: 'center', }}>
                Expected
              </Grid>
              <Grid item xs={1}>

              </Grid>
              <Grid container item xs={3} justifyContent="center" sx={{backgroundColor: '#8696BE', borderRadius: '5px', padding: '5px', display:'flex', justifyContent: 'center',}}>
                Actual
              </Grid>

            </Grid>
            <Grid container direction="row" item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {`Cashflow`}
                </Typography>
              </Grid>
              <Grid item xs={3}  sx={{padding: '5px', display:'flex', justifyContent: 'center', }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  ${(expenseCurrentMonth?.pur_amount_due != null && revenueCurrentMonth?.pur_amount_due != null ) ? (parseFloat(revenueCurrentMonth.pur_amount_due) - parseFloat(expenseCurrentMonth.pur_amount_due)).toFixed(2) : 0}
                </Typography>
              </Grid>
              <Grid item xs={1}>

              </Grid>
              <Grid container item xs={3} justifyContent="center" sx={{padding: '5px', display:'flex', justifyContent: 'center',}}>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${(expenseCurrentMonth?.total_paid != null && revenueCurrentMonth?.total_paid != null ) ? (parseFloat(revenueCurrentMonth.total_paid) - parseFloat(expenseCurrentMonth.total_paid)).toFixed(2) : 0}
              </Typography>
              </Grid>

            </Grid>
            <Grid container direction="row" item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {`Revenue`}
                </Typography>              </Grid>
              <Grid item xs={3}  sx={{padding: '5px', display:'flex', justifyContent: 'center', }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  ${revenueCurrentMonth?.pur_amount_due != null ? revenueCurrentMonth.pur_amount_due : 0}
                </Typography>
              </Grid>
              <Grid item xs={1}>

              </Grid>
              <Grid container item xs={3} justifyContent="center" sx={{padding: '5px', display:'flex', justifyContent: 'center',}}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  ${revenueCurrentMonth?.total_paid  != null ? revenueCurrentMonth.total_paid : 0}
                </Typography>
              </Grid>

            </Grid>
            <Grid container direction="row" item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {`Expense`}
                </Typography>
              </Grid>
              <Grid item xs={3}  sx={{padding: '5px', display:'flex', justifyContent: 'center', }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  ${expenseCurrentMonth?.pur_amount_due  != null ? expenseCurrentMonth.pur_amount_due : 0}
                </Typography>
              </Grid>
              <Grid item xs={1}>

              </Grid>
              <Grid container item xs={3} justifyContent="center" sx={{padding: '5px', display:'flex', justifyContent: 'center',}}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  ${expenseCurrentMonth?.total_paid  != null ? expenseCurrentMonth.total_paid : 0}
                </Typography>
              </Grid>

            </Grid>
          </Grid>
          {/* <Grid item xs={12} sx={{ marginBottom: "20px" }}>
            <Box
              component="span"
              m={1}
              padding={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{
                backgroundColor: "#979797",
                borderRadius: "5px",
                // marginBottom: "20px",
              }}
            >
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Expected Cashflow</Typography>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                ${expectedRevenueByMonth ? (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2) : "0.00"}
              </Typography>
            </Box>
          </Grid> */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {/* <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: "24px" }}> */}
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#160449" }}>
              Cashflow (Act vs. Est)
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ height: "350px" }}>
            <DashboardChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} />
          </Grid>
        </Grid>
      </Container>
      {/* </div> */}
    </ThemeProvider>
  );
}

export default CashflowWidget;
