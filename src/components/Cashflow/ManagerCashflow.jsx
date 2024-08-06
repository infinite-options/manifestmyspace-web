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

import ManagerCashflowWidget from "../Dashboard-Components/Cashflow/ManagerCashflowWidget";
import ManagerProfitability from "./ManagerProfitability";
import ManagerTransactions from "./ManagerTransactions";
import PaymentsManager from "../Payments/PaymentsManager";
import MakePayment from "./MakePayment";
import AddRevenue from "./AddRevenue";
import AddExpense from "./AddExpense";

import axios from "axios";

import // getTotalRevenueByType,
// getTotalExpenseByType,
//   fetchCashflow,
// getTotalExpenseByMonthYear,
// getTotalRevenueByMonthYear,
// getTotalExpectedRevenueByMonthYear,
// getTotalExpectedExpenseByMonthYear,
// getPast12MonthsCashflow,
// getNext12MonthsCashflow,
// getRevenueList,
// getExpenseList,
"../Cashflow/CashflowFetchData";

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

export default function ManagerCashflow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getProfileId } = useUser(); // Access the user object from UserContext

  const profileId = getProfileId();
  const selectedRole = user.selectedRole; // Get the selected role from user object
  const [showSpinner, setShowSpinner] = useState(false);

  const [activeButton, setActiveButton] = useState("Cashflow");

  const [showChart, setShowChart] = useState("Current");

  const [month, setMonth] = useState(location.state?.month || "July"); //fix
  const [year, setYear] = useState(location.state?.year || "2024");
  const cashflowWidgetData = location.state?.cashflowWidgetData;

  const [cashflowData, setCashflowData] = useState(null); // Cashflow data from API

  const [rentsByProperty, setRentsByProperty] = useState([]);
  const [profits, setProfits] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [profitsTotal, setProfitsTotal] = useState({});
  const [rentsTotal, setRentsTotal] = useState({});
  const [payoutsTotal, setPayoutsTotal] = useState({});

  const [profitabilityData, setProfitabilityData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);

  const [currentWindow, setCurrentWindow] = useState(location.state?.currentWindow || "PROFITABILITY");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [propertyList, setPropertyList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("ALL");

  async function fetchCashflow(userProfileId, month, year) {
    setShowSpinner(true);
    try {
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
      const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowRevised/${userProfileId}`);
      console.log("Manager Cashflow Data: ", cashflow.data);
      setShowSpinner(false);
      return cashflow.data;
    } catch (error) {
      console.error("Error fetching cashflow data:", error);
      setShowSpinner(false);
    }
  }

  async function fetchProperties(userProfileId, month, year) {
    setShowSpinner(true);
    try {
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
      const properties = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${userProfileId}`);
      console.log("Manager Properties: ", properties.data);
      setShowSpinner(false);
      return properties.data;
    } catch (error) {
      console.error("Error fetching properties data:", error);
      setShowSpinner(false);
    }
  }

  useEffect(() => {
    // console.log("ROHIT - cashflowData - ", cashflowData);
  }, [cashflowData]);

  useEffect(() => {
    // console.log("ROHIT - propertyList - ", propertyList);
  }, [propertyList]);

  useEffect(() => {
    // console.log("ROHIT - ManagerCashflow - selectedProperty - ", selectedProperty);
  }, [selectedProperty]);

  //   useEffect(() => {
  //     console.log("rentsByProperty - ", rentsByProperty);
  //   }, [rentsByProperty]);

  //   useEffect(() => {
  //     console.log("profits - ", profits);
  //   }, [profits]);
  //   useEffect(() => {
  //     console.log("payouts - ", payouts);
  //   }, [payouts]);

  useEffect(() => {
    fetchCashflow(profileId)
      .then((data) => {
        setCashflowData(data);
        setProfitabilityData(data?.Profit);
        setTransactionsData(data?.Transactions);
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

  const refreshCashflowData = () => {
    fetchCashflow(profileId)
      .then((data) => {
        setCashflowData(data);
        setProfitabilityData(data?.Profit);
        setTransactionsData(data?.Transactions);
        // let currentMonthYearRevenueExpected = get
      })
      .catch((error) => {
        console.error("Error fetching cashflow data:", error);
      });
  };

  useEffect(() => {
    //PROFITS
    const allProfitData = cashflowData?.Profit?.result;
    let filteredProfitData = [];
    if (selectedProperty === "ALL") {
      filteredProfitData = allProfitData;
      // console.log("ROHIT - filteredProfitData - ", filteredProfitData);
    } else {
      filteredProfitData = allProfitData?.filter((item) => item.property_id === selectedProperty);
      // console.log("ROHIT - filteredProfitData - ", filteredProfitData);
    }
    const profitDatacurrentMonth = filteredProfitData?.filter((item) => item.cf_month === month && item.cf_year === year);

    const rentDataCurrentMonth = profitDatacurrentMonth?.filter((item) => (item.purchase_type === "Rent" || item.purchase_type === "Late Fee") && item.pur_cf_type === "revenue");

    const payoutsCurrentMonth = profitDatacurrentMonth?.filter((item) => (item.purchase_type === "Rent" || item.purchase_type === "Late Fee") && item.pur_cf_type === "expense");
    const payoutsByProperty = payoutsCurrentMonth?.reduce((acc, item) => {
      const propertyUID = item.property_id;
      const propertyInfo = {
        property_id: item.property_id,
        property_address: item.property_address,
        property_unit: item.property_unit,
      };

      const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
      const totalActual = parseFloat(item.total_paid_total) || 0;

      if (!acc[propertyUID]) {
        // acc[propertyUID] = [];
        acc[propertyUID] = {
          propertyInfo: propertyInfo,
          payoutItems: [],
          totalExpected: 0,
          totalActual: 0,
        };
      }

      acc[propertyUID].payoutItems.push(item);
      acc[propertyUID].totalExpected += totalExpected;
      acc[propertyUID].totalActual += totalActual;
      return acc;
    }, {});
    setPayouts(payoutsByProperty);
    const totalPayouts = payoutsByProperty
      ? Object.values(payoutsByProperty).reduce(
          (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
          },
          { totalExpected: 0, totalActual: 0 }
        )
      : { totalExpected: 0, totalActual: 0 };
    // console.log("totalPayouts - ", totalPayouts);
    setPayoutsTotal(totalPayouts);

    // const profitsCurrentMonth = profitDatacurrentMonth?.filter(item => item.purchase_type === "Management" || item.purchase_type === "Management - Late Fees");
    // const profitsCurrentMonth = profitDatacurrentMonth?.filter(item => item.purchase_type === "Management" || item.purchase_type === "Management - Late Fees");
    const profitsCurrentMonth = profitDatacurrentMonth?.filter((item) => item.pur_payer?.startsWith("110") && item.pur_receiver?.startsWith("600"));

    const profitsByProperty = profitsCurrentMonth?.reduce((acc, item) => {
      const propertyUID = item.property_id;
      const propertyInfo = {
        property_id: item.property_id,
        property_address: item.property_address,
        property_unit: item.property_unit,
      };

      const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
      const totalActual = parseFloat(item.total_paid_total) || 0;

      if (!acc[propertyUID]) {
        // acc[propertyUID] = [];
        acc[propertyUID] = {
          propertyInfo: propertyInfo,
          profitItems: [],
          totalExpected: 0,
          totalActual: 0,
        };
      }

      acc[propertyUID].profitItems.push(item);
      acc[propertyUID].totalExpected += totalExpected;
      acc[propertyUID].totalActual += totalActual;
      return acc;
    }, {});

    // console.log("profitsByProperty - ", profitsByProperty);
    setProfits(profitsByProperty);
    const totalProfits = profitsByProperty
      ? Object.values(profitsByProperty).reduce(
          (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
          },
          { totalExpected: 0, totalActual: 0 }
        )
      : { totalExpected: 0, totalActual: 0 };
    // console.log("totalProfits - ", totalProfits);
    setProfitsTotal(totalProfits);

    const rentsDataByProperty = rentDataCurrentMonth?.reduce((acc, item) => {
      const propertyUID = item.property_id;
      const propertyInfo = {
        property_id: item.property_id,
        property_address: item.property_address,
        property_unit: item.property_unit,
      };

      const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
      const totalActual = parseFloat(item.total_paid_total) || 0;

      if (!acc[propertyUID]) {
        // acc[propertyUID] = [];
        acc[propertyUID] = {
          propertyInfo: propertyInfo,
          rentItems: [],
          totalExpected: 0,
          totalActual: 0,
        };
      }

      acc[propertyUID].rentItems.push(item);
      acc[propertyUID].totalExpected += totalExpected;
      acc[propertyUID].totalActual += totalActual;
      return acc;
    }, {});

    setRentsByProperty(rentsDataByProperty);
    console.log("rentsDataByProperty - ", rentsDataByProperty);
    const totalRents = rentsDataByProperty
      ? Object.values(rentsDataByProperty).reduce(
          (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
          },
          { totalExpected: 0, totalActual: 0 }
        )
      : { totalExpected: 0, totalActual: 0 };
    console.log("totalRents - ", totalRents);
    setRentsTotal(totalRents);
  }, [month, year, cashflowData, selectedProperty]);

  // useEffect(() => {
  //     console.log("revenueByType", revenueByType)
  //     console.log("expenseByType", expenseByType)
  // }, [revenueByType, expenseByType])

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Container maxWidth='lg' sx={{ paddingTop: "10px", height: "90vh" }}>
        <Grid container spacing={6} sx={{ height: "90%" }}>
          <Grid item xs={12} md={4}>
            <ManagerCashflowWidget
              propsMonth={month}
              propsYear={year}
              profitsTotal={profitsTotal}
              rentsTotal={rentsTotal}
              payoutsTotal={payoutsTotal}
              graphData={profitabilityData?.result}
              setCurrentWindow={setCurrentWindow}
              propertyList={propertyList}
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
            />
          </Grid>

          <Grid container item xs={12} md={8} columnSpacing={6}>
            {currentWindow === "PROFITABILITY" && (
              <ManagerProfitability
                propsMonth={month}
                propsYear={year}
                profitsTotal={profitsTotal}
                profits={profits}
                rentsTotal={rentsTotal}
                rentsByProperty={rentsByProperty}
                payoutsTotal={payoutsTotal}
                payouts={payouts}
                setMonth={setMonth}
                setYear={setYear}
              />
            )}
            {currentWindow === "TRANSACTIONS" && (
              <ManagerTransactions
                propsMonth={month}
                propsYear={year}
                setMonth={setMonth}
                setYear={setYear}
                transactionsData={transactionsData}
                setSelectedPayment={setSelectedPayment}
                setCurrentWindow={setCurrentWindow}
                selectedProperty={selectedProperty}
              />
            )}
            {currentWindow === "PAYMENTS" && <PaymentsManager />}
            {currentWindow === "MAKE_PAYMENT" && <MakePayment selectedPayment={selectedPayment} refreshCashflowData={refreshCashflowData} setCurrentWindow={setCurrentWindow} />}
            {currentWindow === "ADD_REVENUE" && <AddRevenue propertyList={propertyList} setCurrentWindow={setCurrentWindow} />}
            {currentWindow === "ADD_EXPENSE" && <AddExpense propertyList={propertyList} setCurrentWindow={setCurrentWindow} />}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
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
    console.log("getCategoryCount - allItems - ", allItems);
    let items = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    return "(" + items.length + ")";
  }

  function getCategoryItems(category, type) {
    let filteredIitems = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    let items = filteredIitems?.map((item) => ({ ...item, property: JSON.parse(item.property) }));

    console.log("getCategoryItems", items);
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
