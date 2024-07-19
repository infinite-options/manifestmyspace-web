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

import axios from "axios";

import {
  // getTotalRevenueByType,
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




export default function ManagerTransactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getProfileId } = useUser(); // Access the user object from UserContext

  const profileId = getProfileId();
  const selectedRole = user.selectedRole; // Get the selected role from user object
  const [ showSpinner, setShowSpinner ] = useState(false);  


  const [activeButton, setActiveButton] = useState("Cashflow");

  const [showChart, setShowChart] = useState("Current");

  const [month, setMonth] = useState(location.state?.month || "July"); //fix
  const [year, setYear] = useState(location.state?.year || "2024");
  const cashflowWidgetData = location.state?.cashflowWidgetData

  const [showSelectMonth, setShowSelectMonth] = useState(false);
  const [openSelectProperty, setOpenSelectProperty] = useState(false);

  const [cashflowData, setCashflowData] = useState(null); // Cashflow data from API  

  const [ rentsByProperty, setRentsByProperty ] = useState([]);
  const [ profits, setProfits ] = useState([]);
  const [ payouts, setPayouts ] = useState([]);

  const [ profitsTotal, setProfitsTotal ] = useState({});
  const [ rentsTotal, setRentsTotal ] = useState({});
  const [ payoutsTotal, setPayoutsTotal ] = useState({});

  const [ transactions, setTransactions ] = useState([]);

  const [ transactionsNew, setTransactionsNew ] = useState([]); // rohit - change to transactions

  async function fetchCashflow(userProfileId, month, year) {
    try {
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
      const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowRevised/${userProfileId}`);
      console.log("Manager Cashflow Data: ", cashflow.data);
      return cashflow.data;
    } catch (error) {
      console.error("Error fetching cashflow data:", error);
    }
  }

  const getPurchaseGroupStatus = ( purchaseGroup ) => {
    if(purchaseGroup.pur_amount_due_total === purchaseGroup.total_paid_total){
        return "fully_paid";
    } else if (purchaseGroup.total_paid_total === null){
        return "not_paid";
    } else {
        return "partially_paid";
    }
  }

//   useEffect(() => {
//     console.log("cashflowData - ", cashflowData);
//   }, [cashflowData]);

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
    console.log("ROHIT - transactions - ", transactions);
  }, [transactions]);

  useEffect(() => {
    console.log("ROHIT - transactionsNew - ", transactionsNew);
  }, [transactionsNew]);

  useEffect(() => {
    fetchCashflow(profileId)
      .then((data) => {
        setCashflowData(data);
        // let currentMonthYearRevenueExpected = get
      })
      .catch((error) => {
        console.error("Error fetching cashflow data:", error);
      });
  }, []);

  useEffect(() => {   
    
    
    //PROFIT
    const profitDatacurrentMonth = cashflowData?.Profit?.result?.filter( item => item.cf_month === month && item.cf_year === year);    

    const rentDataCurrentMonth = profitDatacurrentMonth?.filter(item => ((item.purchase_type === "Rent" || item.purchase_type === "Late Fee") && item.pur_cf_type === "revenue"));
    

    const payoutsCurrentMonth = profitDatacurrentMonth?.filter(item => ((item.purchase_type === "Rent" || item.purchase_type === "Late Fee") && item.pur_cf_type === "expense"));
    const payoutsByProperty = payoutsCurrentMonth?.reduce((acc, item) => {
        const propertyUID = item.property_id;
        const propertyInfo = {
            property_id: item.property_id,
            property_address: item.property_address,
            property_unit: item.property_unit,
        }

        const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
        const totalActual = parseFloat(item.total_paid_total) || 0

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
    }, {})  
    setPayouts(payoutsByProperty);
    const totalPayouts = payoutsByProperty ? Object.values(payoutsByProperty).reduce(
        (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
        },
        { totalExpected: 0, totalActual: 0 }
    ) : { totalExpected: 0, totalActual: 0 };
    // console.log("totalPayouts - ", totalPayouts);
    setPayoutsTotal(totalPayouts);

    // const profitsCurrentMonth = profitDatacurrentMonth?.filter(item => item.purchase_type === "Management" || item.purchase_type === "Management - Late Fees");
    // const profitsCurrentMonth = profitDatacurrentMonth?.filter(item => item.purchase_type === "Management" || item.purchase_type === "Management - Late Fees");
    const profitsCurrentMonth = profitDatacurrentMonth?.filter(item => item.pur_payer?.startsWith('110') && item.pur_receiver?.startsWith('600'));
    
    const profitsByProperty = profitsCurrentMonth?.reduce((acc, item) => {
        const propertyUID = item.property_id;
        const propertyInfo = {
            property_id: item.property_id,
            property_address: item.property_address,
            property_unit: item.property_unit,
        }

        const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
        const totalActual = parseFloat(item.total_paid_total) || 0

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
    }, {})    
    
    // console.log("profitsByProperty - ", profitsByProperty);
    setProfits(profitsByProperty);
    const totalProfits = profitsByProperty ? Object.values(profitsByProperty).reduce(
        (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
        },
        { totalExpected: 0, totalActual: 0 }
    ) : { totalExpected: 0, totalActual: 0 };
    // console.log("totalProfits - ", totalProfits);
    setProfitsTotal(totalProfits);        
    

    const rentsDataByProperty = rentDataCurrentMonth?.reduce((acc, item) => {
        const propertyUID = item.property_id;
        const propertyInfo = {
            property_id: item.property_id,
            property_address: item.property_address,
            property_unit: item.property_unit,
        }

        const totalExpected = parseFloat(item.pur_amount_due_total) || 0;
        const totalActual = parseFloat(item.total_paid_total) || 0

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
    }, {})    
    
    setRentsByProperty(rentsDataByProperty);
    console.log("rentsDataByProperty - ", rentsDataByProperty);
    const totalRents = rentsDataByProperty ? Object.values(rentsDataByProperty).reduce(
        (acc, property) => {
            acc.totalExpected += property.totalExpected;
            acc.totalActual += property.totalActual;
            return acc;
        },
        { totalExpected: 0, totalActual: 0 }
    ) : { totalExpected: 0, totalActual: 0 };
    console.log("totalRents - ", totalRents);
    setRentsTotal(totalRents);




    //TRANSACTIONS
    const transactionsCurrentMonth = cashflowData?.Transactions?.result?.filter( item => item.cf_month === month && item.cf_year === year);  
    
    const getSortOrder = (transaction) => {
        const { pur_payer, pur_receiver } = transaction;
    
        if (pur_payer.startsWith("350") && pur_receiver.startsWith("600")) {
            return 1;
        } else if (pur_payer.startsWith("600") && pur_receiver.startsWith("110")) {
            return 2;
        } else if (pur_payer.startsWith("110") && pur_receiver.startsWith("600")) {
            return 3;
        } else {
            return 4; // Default sort order for unspecified conditions
        }
    };
    const transactionsData = transactionsCurrentMonth?.map(transaction => {        
        return (
            {
                ...transaction,
                transactions: JSON.parse(transaction?.transactions).sort((a,b) => {
                    return getSortOrder(a) - getSortOrder(b);
                }),
            }
        )
    })

    // console.log("transactionsCurrentMonth - ", transactionsData)

    setTransactions(transactionsData);

    const transactionsByProperty = transactionsData?.reduce((acc, item) => {
      const propertyUID = item.property_id;
      const propertyInfo = {
          property_id: item.property_id,
          property_address: item.property_address,
          property_unit: item.property_unit,
      }

      // const totalExpected = item.purchaseGroups?.reduce( (acc, item) => {
      //   return acc + parseFloat(item.pur_amount_due_total) || 0
      // }, 0);
      
      
      // const totalActual = parseFloat(item.total_paid_total) || 0


      if (!acc[propertyUID]) {
          // acc[propertyUID] = [];
          acc[propertyUID] = {
              propertyInfo: propertyInfo,
              purchaseGroups: [],
              // totalExpected: 0,
              // totalActual: 0,
          };
      }

      const groupStatus = getPurchaseGroupStatus(item)      
      acc[propertyUID].purchaseGroups.push({...item, purchaseGroupStatus: groupStatus});
      // acc[propertyUID].totalExpected += totalExpected;
      // acc[propertyUID].totalActual += totalActual;
      
      return acc;
  }, {})    

  if (transactionsByProperty && Object.keys(transactionsByProperty).length > 0) {
    Object.keys(transactionsByProperty)?.forEach(propertyUID => {
      const purchaseGroups = transactionsByProperty[propertyUID].purchaseGroups;
      const allFullyPaid = purchaseGroups.every(group => group.purchaseGroupStatus === "fully_paid");

      const totalExpected = transactionsByProperty[propertyUID].purchaseGroups?.reduce( (acc, item) => {
        return acc + parseFloat(item.pur_amount_due_total) || 0
      }, 0);

      const totalActual = transactionsByProperty[propertyUID].purchaseGroups?.reduce( (acc, item) => {
        return acc + parseFloat(item.total_paid_total) || 0
      }, 0);

      transactionsByProperty[propertyUID].propertyPurchaseStatus = allFullyPaid ? "fully_paid" : "not_paid";
      transactionsByProperty[propertyUID].totalExpected = totalExpected;
      transactionsByProperty[propertyUID].totalActual = totalActual;
    });
  }

  console.log("ROHIT - transactionsByProperty - ", transactionsByProperty);

  setTransactionsNew(transactionsByProperty);
    
  }, [month, year, cashflowData]);

  // useEffect(() => {
  //     console.log("revenueByType", revenueByType)
  //     console.log("expenseByType", expenseByType)
  // }, [revenueByType, expenseByType])

  const getCircleColor = ( transaction ) => {
    if(transaction.pur_amount_due_total === transaction.total_paid_total){
        return "#76B148";
    } else if (transaction.total_paid_total === null){
        return "#A52A2A";
    } else {
        return "#FFC614";
    }
  }

  const getPropertyCircleColor = ( property ) => {
    if(property.propertyPurchaseStatus === "fully_paid"){
        return "#76B148";
    } else if (property.propertyPurchaseStatus === "not_paid"){
        return "#A52A2A";
    } else {
        return "#000000";
    }
  }

  const isTransactionPayable = (transaction) => {
    if(transaction.pur_amount_due_total === transaction.total_paid_total){
        return false;
    } else if (transaction.total_paid_total === null){
        return false;
    } else {
        return true;
    }
  }

  const handlePayment = ( transaction ) => {
    console.log("handlePayment - transactions - ", transaction.transactions);
    const purchaseUIDs = [];
    const ownerPayments = transaction.transactions?.filter( item => item.pur_payer === getProfileId()) //payments from 600 to 110
    const managerPayments = transaction.transactions?.filter( item => (item.pur_receiver === getProfileId() && item.pur_payer?.startsWith('110'))) //payments from 110 to 600
    // transaction.transactions.forEach(transaction => purchaseUIDs.push({ purchase_uid: transaction.purchase_uid, pur_amount_due: parseFloat(transaction.pur_amount_due)?.toFixed(2)?.toString()}))
    ownerPayments.forEach(transaction => purchaseUIDs.push({ purchase_uid: transaction.purchase_uid, pur_amount_due: parseFloat(transaction.pur_amount_due)?.toFixed(2)?.toString()}))
    managerPayments.forEach(transaction => purchaseUIDs.push({ purchase_uid: transaction.purchase_uid, pur_amount_due: parseFloat(transaction.pur_amount_due)?.toFixed(2)?.toString()}))
    
    // console.log("handlePayment - purchaseUIDs - ", purchaseUIDs);

    const totalOwnerPayment = ownerPayments.reduce( (acc, transaction) => {
        return acc + transaction.pur_amount_due;
    }, 0);

    const totalManagerPayment = managerPayments.reduce( (acc, transaction) => {
        return acc + transaction.pur_amount_due;
    }, 0);

    const total = totalOwnerPayment - totalManagerPayment;

    // console.log("handlePayment - totalOwnerPayment - ", totalOwnerPayment);
    // console.log("handlePayment - totalManagerPayment - ", totalManagerPayment);    
    // console.log("handlePayment - total - ", total);
    // console.log("handlePayment - total.toFixed(1) - ", total.toFixed(1));
    // console.log("handlePayment - parseFloat(total.toFixed(1)) - ", parseFloat(total.toFixed(1)));

    const paymentData = {
        currency: "usd",
        //customer_uid: '100-000125', // customer_uid: user.user_uid currently gives error of undefined
        customer_uid: getProfileId(),
        // customer_uid: user.user_uid,
        // business_code: "IOTEST",
        business_code: "",
        item_uid: "320-000054",
        // payment_summary: {
        //     total: "0.0"
        // },

        // balance: "0.0",
        balance: total.toFixed(2).toString(),
        purchase_uids: purchaseUIDs,
    };

    console.log("handlePayment - paymentData - ", paymentData);
    


    navigate("/selectPayment", {
        state: { paymentData: paymentData, total: parseFloat(total.toFixed(1)), selectedItems: [], paymentMethodInfo: {} },
    });

  }

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth="lg" sx={{ paddingTop: "10px", height: '90vh', }}>
        <Grid container spacing={6} sx={{height: '90%'}}>          
          <Grid item xs={12} md={4}>
            <ManagerCashflowWidget propsMonth={month} propsYear={year} profitsTotal={profitsTotal} rentsTotal={rentsTotal} payoutsTotal={payoutsTotal} graphData={cashflowData?.Profit?.result}/>
          </Grid>

          <Grid container item xs={12} md={8} columnSpacing={6}>
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
                <Stack direction="row" justifyContent="center">
                  <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                    {month} {year} Transactions
                  </Typography>
                </Stack>

                <Box component="span" m={2} display="flex" justifyContent="space-between" alignItems="center">
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
                      <img src={AllOwnerIcon} alt="All Owners" style={{ width: "10px", height: "10px" }} />
                      <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>All Owners</Typography>
                    </Button>
                  )}

                  
                </Box>
                {/* <Box
                  component="span"
                //   m={3}
                //   padding={3}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  // onClick={() => setActiveButton('ExpectedCashflow')}
                  // style={{
                  //   backgroundColor: theme.palette.custom.blue,
                  //   borderRadius: "5px",
                  // }}
                >
                  <Box sx={{
                    width: '180px',
                  }}>

                  </Box>
                  <Box sx={{ backgroundColor: '#FFE3AD', padding: '5px', borderRadius: '5px', width: '100px', display: 'flex', justifyContent: 'center', }}>                    
                    <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: '15px', }}>
                        Expected
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#8696BE', padding: '5px', borderRadius: '5px', width: '100px', display: 'flex', justifyContent: 'center',}}>                    
                    <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: '15px', }}>
                        Actual
                    </Typography>
                  </Box>

                </Box> */}

                <Grid container item xs={12}>
                    <Grid item xs={6.5}>                        
                    </Grid>                                    
                    <Grid container justifyContent="flex-end" item xs={3}>
                        <Box sx={{ backgroundColor: '#FFE3AD', padding: '5px', borderRadius: '5px', width: '80px', display: 'flex', justifyContent: 'center', }}>                    
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: '15px', }}>
                                Expected
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container justifyContent="flex-end" item xs={2}>
                        <Box sx={{ backgroundColor: '#8696BE', padding: '5px', borderRadius: '5px', width: '80px', display: 'flex', justifyContent: 'center',}}>                    
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: '15px', }}>
                                Actual
                            </Typography>
                        </Box>

                    </Grid>
                </Grid>                      

                {
                  transactionsNew && Object.keys(transactionsNew)?.map( (propertyID, index) => {
                    const property = transactionsNew[propertyID]                                                        
                    return (
                      <Accordion
                          sx={{
                              backgroundColor: theme.palette.primary.main,
                              boxShadow: "none",
                              marginTop: '15px',
                          }}
                          key={propertyID}
                      >                                                       
                      <Grid container item xs={12}>
                          <Grid container justifyContent="flex-start" item xs={6.5}>
                              <Grid container direction="row" sx={{ height: '35px',}}>
                                  <Grid container alignContent="flex-start" item xs={10}>
                                      <AccordionSummary 
                                          sx={{
                                              '&.Mui-expanded': {
                                                  minHeight: 'unset', // Override the min-height when expanded
                                              },
                                          }}
                                          expandIcon={<ExpandMoreIcon />}
                                      >
                                          <Box style={{ display: 'flex', alignItems: 'center' }}>
                                              <Box 
                                                  sx={{
                                                      width: '20px',
                                                      height: '20px',
                                                      borderRadius: '50%',
                                                      backgroundColor: getPropertyCircleColor(property) , 
                                                      marginRight: '10px',
                                                  }}
                                              >
                                              </Box>
                                              <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight }}>
                                                  {`${property.propertyInfo?.property_address}, Unit - ${property.propertyInfo?.property_unit}`}
                                              </Typography>                                               
                                          </Box>
                                      </AccordionSummary>
                                  </Grid>                                  
                              </Grid>
                          </Grid>                                    
                          <Grid container justifyContent="flex-end" alignItems="center" item xs={3}>
                              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>                                    
                                  ${property?.totalExpected ? property?.totalExpected : "0.00"}
                              </Typography>                                    
                          </Grid>

                          <Grid container justifyContent="flex-end" alignItems="center" item xs={2}>
                              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                  ${property?.totalActual ? property?.totalActual : "0.00"}                                
                              </Typography>

                          </Grid>


                      </Grid>

                      <AccordionDetails>
                          {
                            property.purchaseGroups?.map( (purGroup, index) => {
                              const isPayable = isTransactionPayable(purGroup);
                              return (
                                <Accordion
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: "none",
                                        marginTop: '5px',
                                        marginLeft: '10px',

                                    }}
                                    key={purGroup.pur_group}
                                >                                                       
                                <Grid container item xs={12}>
                                    <Grid container justifyContent="flex-start" item xs={6.5}>
                                        <Grid container direction="row" sx={{ height: '35px',}}>
                                            <Grid container alignContent="flex-start" item xs={10}>
                                                <AccordionSummary 
                                                    sx={{
                                                        '&.Mui-expanded': {
                                                            minHeight: 'unset', // Override the min-height when expanded
                                                        },
                                                    }}
                                                    expandIcon={<ExpandMoreIcon />}
                                                >
                                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box 
                                                            sx={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                backgroundColor: getCircleColor(purGroup) , 
                                                                marginRight: '10px',
                                                            }}
                                                        >
                                                        </Box>
                                                        <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight }}>
                                                            {`Purchase Group - ${purGroup.pur_group}`}
                                                        </Typography>                                               
                                                    </Box>
                                                </AccordionSummary>
                                            </Grid> 
                                            <Grid item xs={2}>
                                            {
                                                isPayable && (
                                                    <Button 
                                                        onClick={ () =>  handlePayment(purGroup)}
                                                        sx={{
                                                            backgroundColor: '#8696BE',
                                                            color: "#160449",
                                                            '&:hover': {
                                                                backgroundColor: '#160449',
                                                                color: '#FFFFFF'
                                                            }
                                                        }}
                                                    >
                                                        <Typography sx={{ color: 'inherit', fontWeight: theme.typography.common.fontWeight, textTransform: 'none', fontSize: '15px', }}>                                    
                                                            Pay
                                                        </Typography>                                    
                                                    </Button>
                                                )
                                            }
                                        </Grid>                                 
                                        </Grid>
                                    </Grid>                                    
                                    <Grid container justifyContent="flex-end" alignItems="center" item xs={3}>
                                        <Typography sx={{ color: "#000000", fontWeight: theme.typography.common.fontWeight }}>                                    
                                            ${purGroup?.pur_amount_due_total ? purGroup?.pur_amount_due_total : "0.00"}
                                        </Typography>                                    
                                    </Grid>

                                    <Grid container justifyContent="flex-end" alignItems="center" item xs={2}>
                                        <Typography sx={{ color: "#000000", fontWeight: theme.typography.common.fontWeight }}>
                                            ${purGroup?.total_paid_total ? purGroup?.total_paid_total : "0.00"}                                
                                        </Typography>

                                    </Grid>


                                </Grid>

                                <AccordionDetails>
                                  {
                                    purGroup?.transactions?.map((purchase, index) => {
                                        return (
                                            <>                                                
                                                <Grid container item xs={12}>
                                                    <Grid container justifyContent="flex-start" item xs={6.5} sx={{ paddingLeft: '30px',}}>
                                                        
                                                      <Typography>
                                                          {purchase.pur_payer?.startsWith('350') && purchase.pur_receiver?.startsWith('600') ? "Tenant Payment" : ""}
                                                          {purchase.pur_payer?.startsWith('600') && purchase.pur_receiver?.startsWith('110') ? "Owner Payment" : ""}
                                                          {purchase.pur_payer?.startsWith('110') && purchase.pur_receiver?.startsWith('600') ? "Manager Payment" : ""}
                                                      </Typography>
                                                        
                                                    </Grid>                                    
                                                    <Grid container justifyContent="flex-end" item xs={3}>
                                                        <Typography sx={{ fontWeight: theme.typography.common.fontWeight }}>                                    
                                                            ${purchase?.pur_amount_due ? purchase?.pur_amount_due : "0"}
                                                        </Typography>                                    
                                                    </Grid>

                                                    <Grid container justifyContent="flex-end" item xs={2}>
                                                        <Typography sx={{ fontWeight: theme.typography.common.fontWeight }}>
                                                            ${purchase?.total_paid ? purchase?.total_paid : "0"}                                
                                                        </Typography>

                                                    </Grid>


                                                </Grid>                                         
                                            </>

                                        );
                                    })
                                  }
                                </AccordionDetails>
                              </Accordion>  
                              );
                            })
                          }
                      </AccordionDetails>
                      </Accordion>     
                  );

                  })
                }




                
                
              </Paper>              
            </Box>                                
          </Grid>
        </Grid>
      </Container>      
    </ThemeProvider>
  );
}

function SelectMonthComponentTest(props) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const lastYear = new Date().getFullYear() - 1;
  const currentYear = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;

  return (
    <Dialog open={props.showSelectMonth} onClose={() => props.setShowSelectMonth(false)} maxWidth="lg">
      <DialogTitle>
        <IconButton
          aria-label="close"
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
    console.log("getCategoryCount - allItems - ", allItems);
    let items = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    return "(" + items.length + ")";
  }

  function getCategoryItems(category, type) {
    let filteredIitems = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
    let items = filteredIitems?.map(item => ({ ...item, property:JSON.parse(item.property)}));
    
    console.log("getCategoryItems", items)
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
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, marginLeft: '25px', }}>
                            Property UID
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            Property Address
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            Property Unit
                          </Typography>
                        </TableCell>
                        <TableCell  align="right">
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                            Expected
                          </Typography>
                        </TableCell>
                        <TableCell  align="right">
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, marginRight: '25px', }}>
                            Actual
                          </Typography>
                        </TableCell>
                      </TableRow>
                    
                
                    {                      
                      item?.property?.map( property => {
                        return (
                          <TableRow sx={{ }}>    
                            <TableCell>
                              <Typography sx={{ fontSize: theme.typography.smallFont, marginLeft: '25px', }}>
                                {property.property_uid}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: theme.typography.smallFont, }}>
                                {property.property_address}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: theme.typography.smallFont, }}>
                                {property.property_unit}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: theme.typography.smallFont, }}>
                                ${property.individual_purchase[0]?.pur_amount_due? property.individual_purchase[0]?.pur_amount_due : 0}
                              </Typography>
                            </TableCell>
                            <TableCell  align="right">
                              <Typography sx={{ fontSize: theme.typography.smallFont,marginRight: '25px', }}>
                                ${property.individual_purchase[0]?.total_paid? property.individual_purchase[0]?.total_paid : 0}
                              </Typography>
                            </TableCell>
                          
                          </TableRow>
                        );
                      })
                    }                
                                
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
                        <TableCell align="right">
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>${value ? value : 0}</Typography>
                        </TableCell>
                        <TableCell align="right">
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
                        <TableCell sx={{width: '150px',}}>
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, }}>
                            {" "}
                            {category} {getCategoryCount(category)}{" "}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight, width: '250px', }}>${value ? value : 0}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>${categoryTotalMapping[category] ? categoryTotalMapping[category] : 0}</Typography>
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
