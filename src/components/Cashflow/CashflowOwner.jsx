import React, { useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CashflowData from './CashflowData';
import theme from '../../theme/theme';
import RevenueTable from './RevenueTable';
import SelectMonthComponent from '../SelectMonthComponent';
// import ExpenseTable from './ExpenseTable';

const CashflowOwner = () => {
    const [revenueDropdown, setRevenueDropdown] = useState(false);
    const [expenseDropdown, setExpenseDropdown] = useState(false);

    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [month, setMonth] = useState('June');
    const [year, setYear] = useState('2023');

    const [revenue, setRevenue] = useState(null);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [expense, setExpense] = useState(null);
    const [expenseSummary, setExpenseSummary] = useState(null);
    console.log("cashflow revenue ", revenue);
    console.log("cashflow expense ", expense);
    console.log("cashflow revenueSummary ", revenueSummary, month);
    console.log("cashflow expenseSummary ", expenseSummary);

    const handleRevenueDropdown = () => {
        setRevenueDropdown(!revenueDropdown);
    }
    const handleExpenseDropdown = () => {
        setExpenseDropdown(!expenseDropdown);
    }
    
    return (
        <ThemeProvider theme={theme}>
            <CashflowData year={year} month={month} filter={false} role={'Owner'} userID={'100-000003'} setRevenueSummary={setRevenueSummary} setExpenseSummary={setExpenseSummary} setExpense={setExpense} setRevenue={setRevenue}></CashflowData>
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
                backgroundColor: theme.palette.primary.main,
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
                        Select Month / Year
                        </Typography>
                    </Button>
                    <SelectMonthComponent showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent>
                    <Button sx={{ textTransform: 'capitalize' }}>
                        <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                        Select Property
                        </Typography>
                    </Button>
                </Box>
               <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                        backgroundColor: theme.palette.custom.blue,
                        borderRadius: '5px'
                }}
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${
                        revenueSummary && expenseSummary ?
                        ((revenueSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0) -
                        expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        ).toFixed(2)) : '0.00'}
                    </Typography>
                </Box>
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                        backgroundColor: theme.palette.custom.grey,
                        borderRadius: '5px',
                }}
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Expected Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${
                        revenueSummary && expenseSummary ?
                        ((revenueSummary.reduce(function (prev, current) {
                            return prev + +current.amount_due;
                        }, 0) -
                        expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_due;
                        }, 0)
                        ).toFixed(2)) : '0.00'}
                    </Typography>
                </Box>
                <Accordion sx={{backgroundColor: theme.palette.primary.main, boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                       March Revenue
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${revenueSummary ?
                        (revenueSummary
                        .reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        .toFixed(2)) : '0.00'}
                    </Typography>
                </Box>
                <AccordionDetails>
                    <RevenueTable revenue={revenue} revenueSummary={revenueSummary}></RevenueTable>
                </AccordionDetails>
                </Accordion>
                <Accordion sx={{backgroundColor: theme.palette.primary.main, boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                       March Expense
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                        ${expenseSummary ?
                        (expenseSummary
                        .reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        .toFixed(2)) : '0.00'}
                    </Typography>
                </Box>
                <AccordionDetails>
                    {/* <ExpenseTable expense={expense} expenseSummary={expenseSummary}></ExpenseTable> */}
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
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>Add Revenue</Button>
                    <Button sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>Add Expense</Button>
                </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      );
    };
    

export default CashflowOwner;
