import React, { useEffect, useState } from "react";
import {
  Paper,
  DialogContent,
  Grid,
  Box,
  Modal,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
import RevenueTable from "./RevenueTable";
import ExpectedRevenueTable from "./ExpectedRevenueTable";
import SelectMonthComponent from "../SelectMonthComponent";
import ExpenseTable from "./ExpenseTable";
import ExpectedExpenseTable from "./ExpectedExpenseTable";
import MixedChart from "../Graphs/OwnerCashflowGraph";
import SelectProperty from "../Leases/SelectProperty";
import AddRevenueIcon from "../../images/AddRevenueIcon.png";
import AllOwnerIcon from "../Rent/RentComponents/AllOwnerIcon.png";
import { useUser } from "../../contexts/UserContext"; // Import the UserContext
import Backdrop from "@mui/material/Backdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/selectMonth.css";

import CashflowWidget from "../Dashboard-Components/Cashflow/CashflowWidget";
import AddRevenue from "./AddRevenue";
import AddExpense from "./AddExpense";

import {
  // getTotalRevenueByType,
  // getTotalExpenseByType,
  fetchCashflow,
  // getTotalExpenseByMonthYear,
  // getTotalRevenueByMonthYear,
  // getTotalExpectedRevenueByMonthYear,
  // getTotalExpectedExpenseByMonthYear,
  // getPast12MonthsCashflow,
  // getNext12MonthsCashflow,
  // getRevenueList,
  // getExpenseList,
} from "../Cashflow/CashflowFetchData";

import {
  getTotalRevenueByType,
  getTotalExpenseByType,
  fetchCashflow2,
  getTotalExpenseByMonthYear,
  getTotalRevenueByMonthYear,
  getTotalExpectedRevenueByMonthYear,
  getTotalExpectedExpenseByMonthYear,
  getPast12MonthsCashflow,
  getNext12MonthsCashflow,
  getRevenueList,
  getExpenseList,
} from "../Cashflow/CashflowFetchData2";

import axios from "axios";

export default function Cashflow() {
  const location = useLocation();

  const { user, getProfileId } = useUser(); // Access the user object from UserContext

  const profileId = getProfileId();
  const [showSpinner, setShowSpinner] = useState(false);

  const [month, setMonth] = useState(location.state.month || "January");
  const [year, setYear] = useState(location.state.year || "2024");
  const cashflowWidgetData = location.state.cashflowWidgetData;

  const [cashflowData, setCashflowData] = useState(null); // Cashflow data from API
  const [cashflowData2, setCashflowData2] = useState(null); // Cashflow data from API

  const [expectedRevenueByMonth, setExpectedRevenueByMonth] = useState(0);
  const [expectedExpenseByMonth, setExpectedExpenseByMonth] = useState(0);

  const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0);

  const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);

  const [expenseList, setExpenseList] = useState([]);
  const [revenueList, setRevenueList] = useState([]);

  const [revenueByType, setRevenueByType] = useState({});
  const [expenseByType, setExpenseByType] = useState({});
  const [expectedRevenueByType, setExpectedRevenueByType] = useState([]);
  const [expectedExpenseByType, setExpectedExpenseByType] = useState([]);

  const [last12Months, setLast12Months] = useState([]);
  const [next12Months, setNext12Months] = useState([]);

  const displays = ["Cashflow", "ExpectedCashflow"];

  const [currentWindow, setCurrentWindow] = useState(location.state?.currentWindow || "CASHFLOW_DETAILS");

  const [propertyList, setPropertyList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("ALL");

  // useEffect(() => {
  //   fetchCashflow(profileId)
  //     .then((data) => {
  //       setCashflowData(data);
  //       // let currentMonthYearRevenueExpected = get
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching cashflow data:", error);
  //     });
  // }, []);

  async function fetchProperties(userProfileId, month, year) {
    try {
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
      const properties = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${userProfileId}`);
      console.log("Owner Properties: ", properties.data);
      return properties.data;
    } catch (error) {
      console.error("Error fetching properties data:", error);
    }
  }

  useEffect(() => {
    fetchCashflow2(profileId)
      .then((data) => {
        setCashflowData2(data);
        // let currentMonthYearRevenueExpected = get
      })
      .catch((error) => {
        console.error("Error fetching cashflow data:", error);
      });

    fetchProperties(profileId)
      .then((data) => {
        setPropertyList(data?.Property?.result);
      })
      .catch((error) => {
        console.error("Error fetching PropertyList:", error);
      });
  }, []);

  useEffect(() => {
    if (cashflowData2 !== null && cashflowData2 !== undefined) {
      let currentMonthYearTotalRevenue = getTotalRevenueByMonthYear(cashflowData2, month, year);
      let currentMonthYearTotalExpense = getTotalExpenseByMonthYear(cashflowData2, month, year);
      let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(cashflowData2, month, year);
      let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(cashflowData2, month, year);
      setTotalRevenueByMonth(currentMonthYearTotalRevenue); // currently using sum(total_paid)
      setTotalExpenseByMonth(currentMonthYearTotalExpense); // currently using sum(total_paid)
      setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
      setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
      setRevenueList(getRevenueList(cashflowData2));
      setExpenseList(getExpenseList(cashflowData2));
      // console.log("--debug-- expenseList", revenueList)
      // console.log("--debug-- expenseList", expenseList)

      let revenueMapping = getTotalRevenueByType(cashflowData2, month, year, false);
      let expenseMapping = getTotalExpenseByType(cashflowData2, month, year, false);
      // console.log("revenueMapping", revenueMapping)
      // console.log("expenseMapping", expenseMapping)
      setRevenueByType(revenueMapping);
      setExpenseByType(expenseMapping);

      let expectedRevenueByType = getTotalRevenueByType(cashflowData2, month, year, true);
      let expectedExpenseByType = getTotalExpenseByType(cashflowData2, month, year, true);
      // console.log("expectedRevenueByType", expectedRevenueByType)
      // console.log("expectedExpenseByType", expectedExpenseByType)
      setExpectedRevenueByType(expectedRevenueByType);
      setExpectedExpenseByType(expectedExpenseByType);

      let last12months = getPast12MonthsCashflow(cashflowData2, month, year);
      let next12Months = getNext12MonthsCashflow(cashflowData2, month, year);

      setLast12Months(last12months);
      setNext12Months(next12Months);
    }
  }, [month, year, cashflowData2]);

  useEffect(() => {
    // console.log("ROHIT - propertyList - ", propertyList);
  }, [propertyList]);

  useEffect(() => {
    // console.log("ROHIT - cashflowData2 - ", cashflowData2);
  }, [cashflowData2]);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Container maxWidth='lg' sx={{ paddingTop: "10px", height: "90vh" }}>
        <Grid container spacing={6} sx={{ height: "90%" }}>
          <Grid item xs={12} md={4}>
            <CashflowWidget
              data={cashflowWidgetData}
              setCurrentWindow={setCurrentWindow}
              page='OwnerCashflow'
              propertyList={propertyList}
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
            />
          </Grid>

          <Grid container item xs={12} md={8} columnSpacing={6}>
            {currentWindow === "CASHFLOW_DETAILS" && (
              <CashflowDetails
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                expectedExpenseByMonth={expectedExpenseByMonth}
                totalExpenseByMonth={totalExpenseByMonth}
                expectedRevenueByMonth={expectedRevenueByMonth}
                totalRevenueByMonth={totalRevenueByMonth}
                expectedRevenueByType={expectedRevenueByType}
                expectedExpenseByType={expectedExpenseByType}
                revenueByType={revenueByType}
                expenseByType={expenseByType}
                revenueList={revenueList}
                expenseList={expenseList}
                last12Months={last12Months}
                next12Months={next12Months}
              />
            )}

            {currentWindow === "ADD_REVENUE" && <AddRevenue propertyList={propertyList} setCurrentWindow={setCurrentWindow} />}

            {currentWindow === "ADD_EXPENSE" && <AddExpense propertyList={propertyList} setCurrentWindow={setCurrentWindow} />}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

const CashflowDetails = ({
  month,
  setMonth,
  year,
  setYear,
  expectedExpenseByMonth,
  totalExpenseByMonth,
  expectedRevenueByMonth,
  totalRevenueByMonth,
  expectedRevenueByType,
  revenueByType,
  expectedExpenseByType,
  expenseByType,
  revenueList,
  expenseList,
  last12Months,
  next12Months,
}) => {
  const navigate = useNavigate();
  const { user, getProfileId } = useUser();

  const profileId = getProfileId();
  const selectedRole = user.selectedRole;

  const [showSelectMonth, setShowSelectMonth] = useState(false);
  const [openSelectProperty, setOpenSelectProperty] = useState(false);

  const [activeButton, setActiveButton] = useState("Cashflow");

  const [showChart, setShowChart] = useState("Current");

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%", // Take up full screen width
        }}
      >
        <Paper
          style={{
            // marginTop: "30px",
            padding: theme.spacing(2),
            backgroundColor: activeButton === "Cashflow" ? theme.palette.primary.main : theme.palette.primary.secondary,
            width: "95%", // Occupy full width with 25px margins on each side
            // [theme.breakpoints.down("sm")]: {
            //   width: "80%",
            // },
            // [theme.breakpoints.up("sm")]: {
            //   width: "50%",
            // },
          }}
        >
          <Stack direction='row' justifyContent='center'>
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
              {month} {year} Cashflow
            </Typography>
          </Stack>
          <Box component='span' m={2} display='flex' justifyContent='space-between' alignItems='center'>
            <Button sx={{ textTransform: "capitalize" }} onClick={() => setShowSelectMonth(true)}>
              <CalendarTodayIcon sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }} />
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>Select Month / Year</Typography>
            </Button>
            <SelectMonthComponentTest
              selectedMonth={month}
              selectedYear={year}
              setMonth={setMonth}
              setYear={setYear}
              showSelectMonth={showSelectMonth}
              setShowSelectMonth={setShowSelectMonth}
            />
            {selectedRole === "MANAGER" && (
              <Button sx={{ textTransform: "capitalize" }} onClick={() => {}}>
                <img src={AllOwnerIcon} alt='All Owners' style={{ width: "10px", height: "10px" }} />
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>All Owners</Typography>
              </Button>
            )}

            <Button sx={{ textTransform: "capitalize" }} onClick={() => setOpenSelectProperty(true)}>
              <HomeWorkIcon sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont, margin: "5px" }} />
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "12px" }}>Property</Typography>
            </Button>
          </Box>
          {/* <Box
            component="span"
            m={3}
            padding={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // onClick={()=> setActiveButton('Cashflow')}
            style={{
              backgroundColor: "Cashflow" === "Cashflow" ? theme.palette.custom.blue : theme.palette.custom.grey,
              borderRadius: "5px",
            }}
          >
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>Cashflow</Typography>
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
              $
              {totalRevenueByMonth !== null && totalRevenueByMonth !== undefined && totalExpenseByMonth !== null && totalExpenseByMonth !== undefined
                ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2)
                : "0.00"}
            </Typography>
          </Box> */}
          {/* <Accordion
            sx={{
              backgroundColor: "Cashflow" === "Cashflow" ? theme.palette.primary.main : theme.palette.primary.secondary,
              boxShadow: "none",
            }}
          >
            
            <Box component="span" m={3} display="flex" justifyContent="space-between" alignItems="center">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                  {"Cashflow" === "Cashflow" ? "" : "Expected"} {month} Revenue
                </Typography>
              </AccordionSummary>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                ${" "}
                {"Cashflow" === "Cashflow" ? (totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00") : expectedRevenueByMonth ? expectedRevenueByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>
            <AccordionDetails>
              
              <StatementTable
                categoryTotalMapping={revenueByType}
                allItems={revenueList}
                activeView={"Cashflow"}
                tableType="Revenue"
                categoryExpectedTotalMapping={expectedRevenueByType}
                month={month}
                year={year}
              />
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion
            sx={{
              backgroundColor: "Cashflow" === "Cashflow" ? theme.palette.primary.main : theme.palette.primary.secondary,
              boxShadow: "none",
            }}
          >
            
            <Box component="span" m={3} display="flex" justifyContent="space-between" alignItems="center">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                  {"Cashflow" === "Cashflow" ? "" : "Expected"} {month} Expense
                </Typography>
              </AccordionSummary>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                ${" "}
                {"Cashflow" === "Cashflow" ? (totalExpenseByMonth ? totalExpenseByMonth.toFixed(2) : "0.00") : expectedExpenseByMonth ? expectedExpenseByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>

            <AccordionDetails>
              <StatementTable
                categoryTotalMapping={expenseByType}
                allItems={expenseList}
                activeView={"Cashflow"}
                tableType="Expense"
                categoryExpectedTotalMapping={expectedExpenseByType}
                month={month}
                year={year}
              />
            </AccordionDetails>
          </Accordion> */}

          <Box
            component='span'
            m={3}
            padding={3}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            // onClick={() => setActiveButton('ExpectedCashflow')}
            // style={{
            //   backgroundColor: theme.palette.custom.blue,
            //   borderRadius: "5px",
            // }}
          >
            <Box
              sx={{
                width: "140px",
              }}
            ></Box>
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>Expected</Typography>
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>Actual</Typography>
          </Box>

          <Box
            component='span'
            m={2}
            padding={3}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            // onClick={() => setActiveButton('ExpectedCashflow')}
            style={{
              backgroundColor: theme.palette.custom.blue,
              borderRadius: "5px",
            }}
          >
            <Typography sx={{ width: "270px", color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
              Cashflow
            </Typography>
            <Typography sx={{ width: "200px", color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
              $
              {expectedRevenueByMonth !== null && expectedRevenueByMonth !== undefined && expectedExpenseByMonth !== null && expectedExpenseByMonth !== undefined
                ? (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2)
                : "0.00"}
            </Typography>
            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
              $
              {totalRevenueByMonth !== null && totalRevenueByMonth !== undefined && totalExpenseByMonth !== null && totalExpenseByMonth !== undefined
                ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2)
                : "0.00"}
            </Typography>
          </Box>
          <Accordion
            sx={{
              backgroundColor: theme.palette.primary.main,
              boxShadow: "none",
            }}
          >
            {/* This is Revenue Bar underneath the Yellow Expected Cashflow box */}
            <Box component='span' m={3} display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{ width: "270px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>{month} Revenue</Typography>
                </AccordionSummary>
              </Box>
              <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{ width: "200px" }}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                  ${" "}
                  {"ExpectedCashflow" === "Cashflow"
                    ? totalRevenueByMonth
                      ? totalRevenueByMonth.toFixed(2)
                      : "0.00"
                    : expectedRevenueByMonth
                    ? expectedRevenueByMonth.toFixed(2)
                    : "0.00"}
                </Typography>
              </Box>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                ${" "}
                {"Cashflow" === "Cashflow" ? (totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00") : expectedRevenueByMonth ? expectedRevenueByMonth.toFixed(2) : "0.00"}
              </Typography>
            </Box>

            <AccordionDetails>
              {/* <RevenueTable totalRevenueByType={revenueByType} expectedRevenueByType={expectedRevenueByType} revenueList={revenueList} activeView={activeButton}/>             */}
              <StatementTable
                categoryTotalMapping={revenueByType}
                allItems={revenueList}
                activeView={"ExpectedCashflow"}
                tableType='Revenue'
                categoryExpectedTotalMapping={expectedRevenueByType}
                month={month}
                year={year}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              backgroundColor: theme.palette.primary.main,
              boxShadow: "none",
            }}
          >
            <Box component='span' m={3} display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{ width: "270px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>{month} Expense</Typography>
                </AccordionSummary>
              </Box>
              <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: "200px" }}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                  ${" "}
                  {"ExpectedCashflow" === "Cashflow"
                    ? totalExpenseByMonth
                      ? totalExpenseByMonth.toFixed(2)
                      : "0.00"
                    : expectedExpenseByMonth
                    ? expectedExpenseByMonth.toFixed(2)
                    : "0.00"}
                </Typography>
              </Box>
              <Box display='flex' justifyContent='flex-end' alignItems='center' sx={{ width: "200px" }}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                  ${" "}
                  {"Cashflow" === "Cashflow"
                    ? totalExpenseByMonth
                      ? totalExpenseByMonth.toFixed(2)
                      : "0.00"
                    : expectedExpenseByMonth
                    ? expectedExpenseByMonth.toFixed(2)
                    : "0.00"}
                </Typography>
              </Box>
            </Box>

            <AccordionDetails>
              <StatementTable
                categoryTotalMapping={expenseByType}
                allItems={expenseList}
                activeView={"ExpectedCashflow"}
                tableType='Expense'
                categoryExpectedTotalMapping={expectedExpenseByType}
                month={month}
                year={year}
              />
            </AccordionDetails>
          </Accordion>

          {/* This is where the GRAPH Component starts */}
          <Stack direction='row' justifyContent='center'>
            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.largeFont }}>
              {showChart} Cashflow and Revenue
            </Typography>
          </Stack>

          <Stack direction='row' justifyContent='center' height={300}>
            {showChart === "Current" ? (
              <MixedChart revenueCashflowByMonth={last12Months} activeButton={activeButton}></MixedChart>
            ) : (
              <MixedChart revenueCashflowByMonth={next12Months} activeButton={activeButton}></MixedChart>
            )}
          </Stack>

          <Stack direction='row' justifyContent='center' textTransform={"none"}>
            <Button onClick={() => setShowChart(showChart === "Current" ? "Expected" : "Current")} variant='outlined'>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>
                {showChart === "Current" ? "Show Expected Cashflow" : "Show Current Cashflow"}
              </Typography>
            </Button>
          </Stack>
        </Paper>

        <Paper
          style={{
            margin: "2px",
            padding: theme.spacing(2),
            boxShadow: "none",
            width: "85%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
          }}
        >
          <Box component='span' m={2} marginTop={15} marginBottom={30} display='flex' justifyContent='space-between' alignItems='center'>
            <Button
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.smallFont,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                textTransform: "none",
              }}
              onClick={() => {
                navigate("/addRevenue", { state: { edit: false, itemToEdit: null } });
              }}
            >
              {" "}
              <img src={AddRevenueIcon}></img> Revenue
            </Button>
            <Button
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.smallFont,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                textTransform: "none",
              }}
              onClick={() => {
                navigate("/addExpense", { state: { edit: false, itemToEdit: null } });
              }}
            >
              {" "}
              <img src={AddRevenueIcon}></img> Expense
            </Button>
            {/* <Button
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.smallFont,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                textTransform: "none",
              }}
              onClick={() => {
                navigate("/addUtility", { state: { edit: false, itemToEdit: null } });
              }}
            >
              {" "}
              <img src={AddRevenueIcon}></img> Utility
            </Button> */}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

function SelectMonthComponentTest(props) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const lastYear = new Date().getFullYear() - 1;
  const currentYear = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;

  return (
    <Dialog open={props.showSelectMonth} onClose={() => props.setShowSelectMonth(false)} maxWidth='lg'>
      <DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => props.setShowSelectMonth(false)}
          sx={{
            position: "absolute",
            right: 1,
            top: 1,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box>
          {monthNames.map((month, index) => {
            return (
              <Typography className={props.selectedMonth === month ? "selected" : "unselected"} key={index} onClick={() => props.setMonth(month)}>
                {month}
              </Typography>
            );
          })}
        </Box>
        <Box>
          <Typography className={props.selectedYear === lastYear.toString() ? "selected" : "unselected"} onClick={() => props.setYear(lastYear.toString())}>
            {lastYear}
          </Typography>
          <Typography className={props.selectedYear === currentYear.toString() ? "selected" : "unselected"} onClick={() => props.setYear(currentYear.toString())}>
            {currentYear}
          </Typography>
          <Typography className={props.selectedYear === nextYear.toString() ? "selected" : "unselected"} onClick={() => props.setYear(nextYear.toString())}>
            {nextYear}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// This is the function that controls what and how the cashflow data is displayed
function StatementTable(props) {
  console.log("In Statement Table: ", props);
  const navigate = useNavigate();

  const activeView = props.activeView;
  const tableType = props.tableType;

  const month = props.month;
  const year = props.year;

  const categoryTotalMapping = props.categoryTotalMapping;
  const allItems = props.allItems;

  const categoryExpectedTotalMapping = props.categoryExpectedTotalMapping;
  const allExpectedItems = [];

  const navigateType = "/edit" + tableType;

  function handleNavigation(type, item) {
    console.log(item);
    navigate(type, { state: { itemToEdit: item, edit: true } });
  }

  // console.log("--debug-- tableType categoryTotalMapping", tableType, categoryTotalMapping)
  // console.log("activeView", activeView)
  // console.log("statement table year/month", year, month)

  function getCategoryCount(category) {
    // console.log("getCategoryCount - allItems - ", allItems);
    let items = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    return "(" + items.length + ")";
  }

  function getCategoryItems(category, type) {
    let filteredIitems = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    let items = filteredIitems?.map((item) => ({ ...item, property: JSON.parse(item.property) }));

    // console.log("getCategoryItems", items)
    var key = "total_paid";
    if (activeView === "Cashflow") {
      key = "total_paid";
    } else {
      key = "pur_amount_due";
    }
    return (
      <>
        {items.map((item, index) => {
          return activeView === "Cashflow" ? (
            <TableRow key={index} onClick={() => handleNavigation(type, item)}>
              <TableCell></TableCell>
              <TableCell>
                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                  {" "}
                  {item.property_address} {item.property_unit}{" "}
                </Typography>
              </TableCell>
              {/* <TableCell>
                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>${item[key] ? item[key] : 0}</Typography>
              </TableCell> */}
              <TableCell>
                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                  ${item["pur_amount_due"] ? item["pur_amount_due"] : 0}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                  ${item["total_paid"] ? item["total_paid"] : 0}
                </Typography>
              </TableCell>
              {/* <TableCell align="right">
                <DeleteIcon />
              </TableCell> */}
            </TableRow>
          ) : (
            //   <>
            //   <Accordion
            //       sx={{
            //         backgroundColor: theme.palette.custom.pink,
            //         boxShadow: "none",
            //       }}
            //       key={category}
            //     >
            //       <AccordionSummary sx={{ flexDirection: "space-between" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
            //         <TableRow key={index}>
            //           <TableCell>{item.purchase_uid}</TableCell>
            //           <TableCell>{item.pur_property_id}</TableCell>
            //           <TableCell>{item.pur_payer}</TableCell>
            //           <TableCell>
            //             <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //               {" "}
            //               {item.property_address} {item.property_unit}{" "}
            //             </Typography>
            //           </TableCell>
            //           <TableCell>{item.pur_notes}</TableCell>
            //           <TableCell>{item.pur_description}</TableCell>
            //           <TableCell>
            //             <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //               ${item["pur_amount_due"] ? item["pur_amount_due"] : 0}
            //             </Typography>
            //           </TableCell>
            //           <TableCell>
            //             <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //               ${item["total_paid"] ? item["total_paid"] : 0}
            //             </Typography>
            //           </TableCell>
            //           {/* <TableCell align="right">
            //             <EditIcon />
            //           </TableCell> */}
            //         </TableRow>
            //       </AccordionSummary>
            //       <AccordionDetails>
            //           {
            //             item?.property?.map( property => {
            //               return (
            //                 <TableRow>
            //                   <TableCell>
            //                     <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //                       {property.property_uid}
            //                     </Typography>
            //                   </TableCell>
            //                   <TableCell>
            //                     <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //                       {property.property_address}
            //                     </Typography>
            //                   </TableCell>
            //                   <TableCell>
            //                     <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //                       {property.property_unit}
            //                     </Typography>
            //                   </TableCell>
            //                   <TableCell>
            //                     <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //                       ${property.individual_purchase[0]?.pur_amount_due? property.individual_purchase[0]?.pur_amount_due : 0}
            //                     </Typography>
            //                   </TableCell>
            //                   <TableCell>
            //                     <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
            //                       ${property.individual_purchase[0]?.total_paid? property.individual_purchase[0]?.total_paid : 0}
            //                     </Typography>
            //                   </TableCell>

            //                 </TableRow>
            //               );
            //             })
            //           }
            //       </AccordionDetails>
            //     </Accordion>

            // </>
            <>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, marginLeft: "25px" }}>Property UID</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>Property Address</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>Property Unit</Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>Expected</Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, marginRight: "25px" }}>Actual</Typography>
                </TableCell>
              </TableRow>

              {item?.property?.map((property) => {
                return (
                  <TableRow sx={{}}>
                    <TableCell>
                      <Typography sx={{ fontSize: theme.typography.smallFont, marginLeft: "25px" }}>{property.property_uid}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: theme.typography.smallFont }}>{property.property_address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: theme.typography.smallFont }}>{property.property_unit}</Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontSize: theme.typography.smallFont }}>
                        ${property.individual_purchase[0]?.pur_amount_due ? property.individual_purchase[0]?.pur_amount_due : 0}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontSize: theme.typography.smallFont, marginRight: "25px" }}>
                        ${property.individual_purchase[0]?.total_paid ? property.individual_purchase[0]?.total_paid : 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          );
        })}
      </>
    );
  }

  return (
    <>
      {activeView === "Cashflow" ? (
        <>
          {Object.entries(categoryTotalMapping).map(([category, value]) => {
            return (
              <Accordion
                sx={{
                  backgroundColor: theme.palette.custom.pink,
                  boxShadow: "none",
                }}
                key={category}
              >
                <AccordionSummary sx={{ flexDirection: "row-reverse" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            {" "}
                            {category} {getCategoryCount(category)}{" "}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>${value ? value : 0}</Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>${value ? value : 0}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </AccordionSummary>
                <AccordionDetails>
                  <Table>
                    <TableBody>{getCategoryItems(category, navigateType)}</TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </>
      ) : (
        <>
          {Object.entries(categoryExpectedTotalMapping).map(([category, value]) => {
            return (
              <Accordion
                sx={{
                  backgroundColor: theme.palette.custom.pink,
                  boxShadow: "none",
                }}
                key={category}
              >
                <AccordionSummary sx={{ flexDirection: "space-between" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "150px" }}>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            {" "}
                            {category} {getCategoryCount(category)}{" "}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, width: "250px" }}>
                            ${value ? value : 0}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            ${categoryTotalMapping[category] ? categoryTotalMapping[category] : 0}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </AccordionSummary>
                <AccordionDetails>
                  <Table>
                    <TableBody>{getCategoryItems(category)}</TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </>
      )}
    </>
  );
}
