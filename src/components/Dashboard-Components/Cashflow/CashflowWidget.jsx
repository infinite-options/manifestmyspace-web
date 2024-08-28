import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Stack, ThemeProvider, Button, Container, Menu, MenuItem } from "@mui/material";
import "../../../css/cashflow.css";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import DashboardChart from "../../Graphs/OwnerDashboardGraph";
import { months } from "moment";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
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
  fetchCashflow2,
  getDataByProperty,
  // getPast12MonthsCashflow,
  // getNext12MonthsCashflow,
  // getRevenueList,
  // getExpenseList,
} from "../../Cashflow/CashflowFetchData2";

import { ReactComponent as HomeIcon } from "../../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../../images/calendar_icon.svg";
import AddRevenueIcon from "../../../images/AddRevenueIcon.png";

// "../../images/AddRevenueIcon.png"

function CashflowWidget({ data, setCurrentWindow, page, setSelectedProperty, setData, selectedProperty }) {
  // console.log("In Cashflow Widget ");
  // console.log("Cashflow Widget - data - ", data);
  const navigate = useNavigate();

  let date = new Date();
  let currentMonth = date.toLocaleString("default", { month: "long" });
  let currentYear = date.getFullYear().toString();

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
  const [cashflowData, setCashflowData] = useState(data?data:null);
  const [originalCashFlowData, setOriginalCashFlowData] = useState(null);
  const [propertyList, setPropertyList] = useState([]);
  const[widgetselectedProperty, setWidgetSelectedProperty] = useState(selectedProperty ? selectedProperty : "All Properties");
  const [propertyButtonName, setPropertyButtonName ] = useState(selectedProperty? (selectedProperty !== "All Properties"? "View all Properties" : "Select Property") : "Select Property")
  const [cfPeriodButtonName, setCfPeriodButtonName ] = useState("Last 12 Months")
  // console.log("From Cashflowwidget ", data)
  // const expenseCurrentMonth = data?.result?.find((item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "expense");
  // const revenueCurrentMonth = data?.result?.find((item) => item.cf_month === currentMonth && item.cf_year === currentYear && item.pur_cf_type === "revenue");


  const [anchorEl, setAnchorEl] = useState(null);

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

  async function fetchProperties(userProfileId, month, year) {
    try {
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
      // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
      const properties = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${userProfileId}`);

      // console.log("Owner Properties: ", properties.data);
      return properties.data;
    } catch (error) {
      console.error("Error fetching properties data:", error);
    }
  }

  useEffect(() => {
    if(cashflowData != null){
      let currentMonthYearRevenue = getTotalRevenueByMonthYear(cashflowData, currentMonth, currentYear);
      let currentMonthYearExpense = getTotalExpenseByMonthYear(cashflowData, currentMonth, currentYear);

      let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(cashflowData, currentMonth, currentYear);
      let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(cashflowData, currentMonth, currentYear);

      // let last12months = getPast12MonthsCashflow(data, currentMonth, currentYear);
      let last12months = getPast12MonthsExpectedCashflow(cashflowData, currentMonth, currentYear);

      setTotalRevenueByMonth(currentMonthYearRevenue); // currently useing sum(total_paid)
      setTotalExpenseByMonth(currentMonthYearExpense); // currently using sum(total_paid)
      setExpectedRevenueByMonth(currentMonthYearExpectedRevenue);
      setExpectedExpenseByMonth(currentMonthYearExpectedExpense);
      setLast12Months(last12months);
    }
    
    // setTotalRevenueByMonth(50);  // This works.  Problem:  currentMonthYearRevenue is returning 0
  }, [cashflowData]);

  // When cashflow data change it will call cashflowdatawidget with new data
  useEffect(()=>{
    if(data != null || data !== undefined){
      setCashflowData(data)
    }

    fetchCashflow2(profileId)
      .then((data) => {
        setOriginalCashFlowData(data);
        // let currentMonthYearRevenueExpected = get
      })
      .catch((error) => {
        console.error("Error fetching cashflow data:", error);
      });

  },[data])

  useEffect(()=>{
    fetchCashflow2(profileId)
      .then((data) => {
        if(cashflowData == null || cashflowData == undefined){
          setCashflowData(data);
        }
        setOriginalCashFlowData(data);
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

  }, [])
  
  const handlePropertyChange = (propertyUID) => {
    const dataByProperty = getDataByProperty(originalCashFlowData, propertyUID);
    setCashflowData(dataByProperty);
    if(setData != undefined){
      setData(dataByProperty);
    }

    setWidgetSelectedProperty(propertyUID);
    setPropertyButtonName('View all Properties');
    // console.log("from cashflowwidget - ", widgetselectedProperty);

    if(setSelectedProperty != undefined || setSelectedProperty != null){
      setSelectedProperty(propertyUID);
    }

    setAnchorEl(null);
  
  };

  const handleSelectAllProperties = () => {
    setSelectedProperty("ALL");
  };

  const viewProperties = async (event) => {
    event.stopPropagation();
    if(propertyButtonName === 'View all Properties'){
      // setSelectedProperty("ALL");
      setCashflowData(originalCashFlowData);
      if(setData != undefined){
        setData(originalCashFlowData);
      }
      setPropertyButtonName('Select Property');
      setWidgetSelectedProperty("All Properties");
      if(setSelectedProperty != undefined || setSelectedProperty != null){
        setSelectedProperty("All Properties");
      }
      // setAnchorEl(event.currentTarget);
    } else if(propertyButtonName === 'Select Property') {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPropertyName = (propertyUID) => {
    if (propertyUID === "All Properties") {
      return "All Properties";
    } else {
      const property = propertyList.find(p => p.property_uid === propertyUID);
      if (property) {
        return property.property_address;
      } else {
        return "Property not found"; // Return a fallback message if no match is found
      }
    }
  }

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
                cashFlowData: cashflowData,
                propertyList : propertyList,
                selectedProperty : widgetselectedProperty
              },
            })
          }
          sx={{
            cursor: "pointer",
          }}
        >

          {/* Table and all button component */}
          <Grid container item xs={12} rowSpacing={0} sx={{ marginTop: "15px" }}>
            <Stack direction='row' justifyContent='center' width='100%' sx={{ marginBottom: "0px" }}>
              <Typography variant='h5' sx={{ fontWeight: "bold", color: "#160449" }}>
                {month} {year} Cashflow
              </Typography>
            </Stack>

            {/* Last 30 days and select property component */}
            <Grid item container xs={12} sx={{marginY: "20px", marginRight:"10px"}}>
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
                  onClick={viewProperties}
                >
                  <HomeIcon fill='#3D5CAC' width='15' height='15' style={{ marginRight: "5px" }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {propertyButtonName}
                  </span>
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
                        onClick={(event) => {
                          event.stopPropagation();
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
              <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }}>
                {/* <Button
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
                  All Properties
                </Button> */}
                <Typography sx={{fontWeight: 'bold', textTransform: 'uppercase', fontSize:"15px", textAlign:"center"}}>
                  {propertyButtonName === 'Select Property'?  `All Properties, ${cfPeriodButtonName === 'Last 12 Months'? 'Current Month' : 'Last 12 Months'}` : ''}
                  {propertyButtonName === 'View all Properties'?  `Property: ${getPropertyName(widgetselectedProperty)}, ${cfPeriodButtonName === 'Last 12 Months'? 'Current Month' : 'Last 12 Months'}` : ''}
                </Typography>
              </Grid>
            </Grid>

            {/* All property button */}
            {/* <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start" }}>
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
              > */}
                {/* <CalendarIcon stroke="#3D5CAC" width="20" height="20" style={{ marginRight: "4px" }} /> */}
                {/* All Properties
              </Button>
            </Grid> */}

            {/* Header Row Actual and Expected */}
            <Grid container direction='row' item xs={12} columnSpacing={3}>
              <Grid item xs={5}></Grid>
              <Grid item xs={3} sx={{ backgroundColor: "#FFE3AD", borderRadius: "5px", padding: "5px", display: "flex", justifyContent: "center" }}>
                Expected
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid
                item
                xs={3}
                justifyContent='center'
                sx={{ backgroundColor: "#8696BE", borderRadius: "5px", padding: "5px", display: "flex", justifyContent: "center" }}
              >
                Actual
              </Grid>
            </Grid>

            {/* Total cashflow Row */}
            <Grid container direction='row' item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>{`Cashflow`}</Typography>
              </Grid>
              <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* $
                  {expenseCurrentMonth?.pur_amount_due != null && revenueCurrentMonth?.pur_amount_due != null
                    ? (parseFloat(revenueCurrentMonth.pur_amount_due) - parseFloat(expenseCurrentMonth.pur_amount_due)).toFixed(2)
                    : 0} */}
                    $
                  {expectedRevenueByMonth !== null && expectedRevenueByMonth !== undefined && expectedExpenseByMonth !== null && expectedExpenseByMonth !== undefined
                    ? (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2)
                    : "0.00"}
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* $
                  {expenseCurrentMonth?.total_paid != null && revenueCurrentMonth?.total_paid != null
                    ? (parseFloat(revenueCurrentMonth.total_paid) - parseFloat(expenseCurrentMonth.total_paid)).toFixed(2)
                    : 0} */}
                    $
                  {totalRevenueByMonth !== null && totalRevenueByMonth !== undefined && totalExpenseByMonth !== null && totalExpenseByMonth !== undefined
                    ? (totalRevenueByMonth - totalExpenseByMonth).toFixed(2)
                    : "0.00"}
                </Typography>
              </Grid>
            </Grid>

            {/* Revenue row */}
            <Grid container direction='row' item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>{`Revenue`}</Typography>{" "}
              </Grid>
              <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* ${revenueCurrentMonth?.pur_amount_due != null ? revenueCurrentMonth.pur_amount_due : 0} */}
                  ${" "}
                  {expectedRevenueByMonth ? expectedRevenueByMonth.toFixed(2) : "0.00"}
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* ${revenueCurrentMonth?.total_paid != null ? revenueCurrentMonth.total_paid : 0} */}
                  ${" "}
                  {totalRevenueByMonth ? totalRevenueByMonth.toFixed(2) : "0.00"}
                </Typography>
              </Grid>
            </Grid>

            {/* Expense Row */}
            <Grid container direction='row' item xs={12} columnSpacing={3}>
              <Grid item xs={5}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>{`Expense`}</Typography>
              </Grid>
              <Grid item xs={3} sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                {/* {revenueCurrentMonth.pur_amount_due? revenueCurrentMonth.pur_amount_due : 0} */}
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* ${expenseCurrentMonth?.pur_amount_due != null ? expenseCurrentMonth.pur_amount_due : 0} */}
                  ${" "}
                  {expectedExpenseByMonth
                    ? expectedExpenseByMonth.toFixed(2)
                    : "0.00"}
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid container item xs={3} justifyContent='center' sx={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                  {/* ${expenseCurrentMonth?.total_paid != null ? expenseCurrentMonth.total_paid : 0} */}
                  ${" "}
                  {totalExpenseByMonth
                      ? totalExpenseByMonth.toFixed(2)
                      : "0.00"}
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

          {/* Graph Header */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop:"10px"}}>
            {/* <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: "24px" }}> */}
            <Typography variant='h5' sx={{ fontWeight: "bold", color: "#160449" }}>
              Cashflow (Act vs. Est)
            </Typography>
          </Grid>
          
          {/* Graph Component */}
          <Grid item xs={12} sx={{ height: "350px" }}>
            <DashboardChart revenueCashflowByMonth={last12Months} activeButton={"Cashflow"} />
          </Grid>

          {/* Add revenue and add expense button */}
          <Grid item container xs={12} sx={{ marginBottom: "10px", marginTop:"30px"}}>

              {/* Add Revenue Button */}
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
                    if (page === "OwnerCashflow") {
                      setCurrentWindow("ADD_REVENUE");
                    } else if (page === "OwnerDashboard") {
                      navigate("/cashflow", { state: { currentWindow: "ADD_REVENUE", month, year, cashFlowData: cashflowData,
                        propertyList : propertyList,
                        selectedProperty : widgetselectedProperty } });
                    }
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Revenue
                </Button>
              </Grid>

              {/* Add Expense Button */}
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
                    if (page === "OwnerCashflow") {
                      setCurrentWindow("ADD_EXPENSE");
                    } else if (page === "OwnerDashboard") {
                      navigate("/cashflow", { state: { currentWindow: "ADD_EXPENSE", month, year, cashFlowData: cashflowData,
                        propertyList : propertyList,
                        selectedProperty : widgetselectedProperty } });
                    }
                  }}
                >
                  {/* <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }}/> */}
                  <img src={AddRevenueIcon}></img>
                  Expense
                </Button>
              </Grid>

          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default CashflowWidget;
