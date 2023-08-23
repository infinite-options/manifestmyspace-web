import React, { useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CashflowData from './CashflowData';
import theme from '../../theme/theme';
import RevenueTable from './RevenueTable';
import ExpectedRevenueTable from './ExpectedRevenueTable'
import SelectMonthComponent from '../SelectMonthComponent';
import ExpenseTable from './ExpenseTable';
import ExpectedExpenseTable from './ExpectedExpenseTable';
import MixedChart from '../Graphs/OwnerCashflowGraph';

const CashflowManager = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('Cashflow');
    const [revenueDropdown, setRevenueDropdown] = useState(false);
    const [expenseDropdown, setExpenseDropdown] = useState(false);

    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [month, setMonth] = useState('June');
    const [year, setYear] = useState('2023');

    const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0);
    const [expectedRevenueByMonth, setExpectedRevenueByMonth] = useState(0);
    const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);
    const [expectedExpenseByMonth, setExpectedExpenseByMonth] = useState(0);

    const [totalRevenueByType, setTotalRevenueByType] = useState({});
    const [expectedRevenueByType, setExpectedRevenueByType] = useState({});
    const [totalExpenseByType, setTotalExpenseByType] = useState({});
    const [expectedExpenseByType, setExpectedExpenseByType] = useState({});

    const [revenueList, setRevenueList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);

    const [revenue, setRevenue] = useState(null);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [expense, setExpense] = useState(null);
    const [expenseSummary, setExpenseSummary] = useState(null);
    console.log("cashflow revenue ", revenue);
    console.log("cashflow expense ", expense);
    console.log("cashflow revenueSummary ", revenueSummary, month);
    console.log("cashflow expenseSummary ", expenseSummary);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };
    
    const handleRevenueDropdown = () => {
        setRevenueDropdown(!revenueDropdown);
    }
    const handleExpenseDropdown = () => {
        setExpenseDropdown(!expenseDropdown);
    }
    
    return (
        <ThemeProvider theme={theme}>
            <CashflowData year={year} month={month} filter={false} role={'Owner'} userID={'100-000003'} setRevenueSummary={setRevenueSummary} setExpenseSummary={setExpenseSummary} setExpense={setExpense} setRevenue={setRevenue} setTotalRevenueByMonth={setTotalRevenueByMonth} setExpectedRevenueByMonth={setExpectedRevenueByMonth} setTotalExpenseByMonth={setTotalExpenseByMonth} setExpectedExpenseByMonth={setExpectedExpenseByMonth} setTotalRevenueByType={setTotalRevenueByType} setExpectedRevenueByType={setExpectedRevenueByType} setTotalExpenseByType={setTotalExpenseByType} setExpectedExpenseByType={setExpectedExpenseByType} setRevenueList={setRevenueList} setExpenseList={setExpenseList} setRevenueCashflowByMonth={setRevenueCashflowByMonth}></CashflowData>
          <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
          >
            <Paper
              style={{
                margin: '30px',
                padding: theme.spacing(2),
                // backgroundColor: theme.palette.primary.main,
                backgroundColor: activeButton === 'Cashflow' ? theme.palette.primary.main : theme.palette.primary.secondary,
                width: '85%', // Occupy full width with 25px margins on each side
                [theme.breakpoints.down('sm')]: {
                  width: '80%',
                },
                [theme.breakpoints.up('sm')]: {
                  width: '50%',
                },
              }}
            >
                <Stack
                direction="row"
                justifyContent="center"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    {month} {year} Cashflow
                    </Typography>
                </Stack>
                <Box
                    component="span"
                    m={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button sx={{ textTransform: 'capitalize' }} onClick={()=>setShowSelectMonth(true)}>
                        <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}/>
                        <Typography 
                        sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                        >
                        Last 30 Days
                        </Typography>
                    </Button>
                        <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent>
                    <Button sx={{ textTransform: 'capitalize' }}>
                        <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                        All Owners
                        </Typography>
                    </Button>
                    <Button sx={{ textTransform: 'capitalize' }}>
                        <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                        Property
                        </Typography>
                    </Button>
                </Box>
                <Stack
                direction="row"
                justifyContent="center">
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                    Steve Albini - All Properties
                    </Typography>
                </Stack>
               <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={()=>{handleButtonClick('Cashflow')}}
                    style={{
                        // backgroundColor: theme.palette.custom.blue,
                        backgroundColor: activeButton === 'Cashflow' ? theme.palette.custom.blue : theme.palette.custom.grey,
                        borderRadius: '5px'
                }}
                >
                    <Typography 
                    sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}
                    >
                        Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${
                        totalRevenueByMonth && totalExpenseByMonth ?
                            (totalRevenueByMonth - totalExpenseByMonth).toFixed(2) : '0.00'
                        }
                    </Typography>
                </Box>
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={()=>{handleButtonClick('ExpectedCashflow')}}
                    style={{
                        // backgroundColor: theme.palette.custom.grey,
                        backgroundColor: activeButton === 'Cashflow' ? theme.palette.custom.grey : theme.palette.custom.yellowHighlight,
                        borderRadius: '5px',
                }}
                >
                    <Typography 
                    sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}
                    >
                        Expected Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${
                        // revenueSummary && expenseSummary ?
                        // ((revenueSummary.reduce(function (prev, current) {
                        //     return prev + +current.amount_due;
                        // }, 0) -
                        // expenseSummary.reduce(function (prev, current) {
                        //     return prev + +current.amount_due;
                        // }, 0)
                        // ).toFixed(2)) : '0.00'}
                        expectedRevenueByMonth && expectedExpenseByMonth ?
                        (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2) : '0.00'
                        }
                    </Typography>
                </Box>
                <Accordion 
                sx={{
                    // backgroundColor: theme.palette.primary.main, 
                    backgroundColor: activeButton === 'Cashflow' ? theme.palette.primary.main : theme.palette.primary.secondary,
                    boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                    {activeButton === 'Cashflow' ? '' : 'Expected'} {month} Revenue
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                    $ {activeButton === 'Cashflow' ?
                        (
                            // revenueSummary ?
                            //     (revenueSummary
                            //     .reduce(function (prev, current) {
                            //         return prev + +current.amount_paid;
                            //     }, 0)
                            //     .toFixed(2)) : '0.00'
                            totalRevenueByMonth?
                            totalRevenueByMonth.toFixed(2) : '0.00'
                        ):(
                            // revenueSummary ?
                            //     (revenueSummary
                            //     .reduce(function (prev, current) {
                            //         return prev + +current.amount_due;
                            //     }, 0)
                            //     .toFixed(2)) : '0.00'
                            expectedRevenueByMonth?
                            expectedRevenueByMonth.toFixed(2) : '0.00'
                        )}
                    </Typography>
                </Box>
                <AccordionDetails>
                {activeButton === 'Cashflow' ?
                    (
                        <RevenueTable revenue={revenue} revenueSummary={revenueSummary} totalRevenueByType={totalRevenueByType} revenueList={revenueList}></RevenueTable>
                    ):(
                        <ExpectedRevenueTable revenue={revenue} revenueSummary={revenueSummary} expectedRevenueByType={expectedRevenueByType} revenueList={revenueList}></ExpectedRevenueTable>
                    )}
                </AccordionDetails>
                </Accordion>
                <Accordion 
                sx={{
                    // backgroundColor: theme.palette.primary.main, 
                    backgroundColor: activeButton === 'Cashflow' ? theme.palette.primary.main : theme.palette.primary.secondary,
                    boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                       {activeButton === 'Cashflow' ? '' : 'Expected'} {month} Expense
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                       $ {activeButton === 'Cashflow' ?
                        (
                            // expenseSummary ?
                            //     (expenseSummary
                            //     .reduce(function (prev, current) {
                            //         return prev + +current.amount_paid;
                            //     }, 0)
                            //     .toFixed(2)) : '0.00'
                            totalExpenseByMonth?
                            totalExpenseByMonth.toFixed(2) : '0.00'
                        ) : 
                        (
                            // expenseSummary ?
                            //     (expenseSummary
                            //     .reduce(function (prev, current) {
                            //         return prev + +current.amount_due;
                            //     }, 0)
                            //     .toFixed(2)) : '0.00'
                            expectedExpenseByMonth?
                            expectedExpenseByMonth.toFixed(2) : '0.00'
                        )}
                    </Typography>
                </Box>
                <AccordionDetails>
                {activeButton === 'Cashflow' ?
                    (
                        <ExpenseTable expense={expense} expenseSummary={expenseSummary} totalExpenseByType={totalExpenseByType} expenseList={expenseList}></ExpenseTable>
                    )
                    :(
                        <ExpectedExpenseTable expense={expense} expenseSummary={expenseSummary} expectedExpenseByType={expectedExpenseByType} expenseList={expenseList}></ExpectedExpenseTable>
                    )}
                </AccordionDetails>
                </Accordion>
                <Stack
                direction="row"
                justifyContent="center"
                >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                    Cashflow and Revenue by Month
                    </Typography>
                </Stack>
                <Stack
                direction="row"
                justifyContent="center"
                >
               <MixedChart revenueSummary={revenueSummary} expenseSummary={expenseSummary} revenueCashflowByMonth={revenueCashflowByMonth}></MixedChart>
                </Stack>
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button 
                        sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}
                        onClick={()=>{navigate('/addRevenue')}}>Add Revenue</Button>
                    <Button 
                        sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}
                        onClick={()=>{navigate('/addExpense')}}>Add Expense</Button>
                    <Button 
                        sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}
                        onClick={()=>{navigate('/addUtility')}}>Add Utility</Button>
                </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      );
    };
    

export default CashflowManager;
