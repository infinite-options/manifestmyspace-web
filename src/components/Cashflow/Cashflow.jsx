import React, { useEffect, useState } from 'react';
import { Paper, DialogContent, Grid, Box, Modal, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogTitle,  Table, TableBody, TableCell, TableHead, TableRow  } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../theme/theme';
import RevenueTable from './RevenueTable';
import ExpectedRevenueTable from './ExpectedRevenueTable'
import SelectMonthComponent from '../SelectMonthComponent';
import ExpenseTable from './ExpenseTable';
import ExpectedExpenseTable from './ExpectedExpenseTable';
import MixedChart from '../Graphs/OwnerCashflowGraph';
import SelectProperty from '../Leases/SelectProperty';
import AddRevenueIcon from '../../images/AddRevenueIcon.png'
import AllOwnerIcon from '../Rent/RentComponents/AllOwnerIcon.png'
import { useUser } from '../../contexts/UserContext'; // Import the UserContext
import Backdrop from "@mui/material/Backdrop"; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/selectMonth.css";
import { getTotalRevenueByType, getTotalExpenseByType, fetchCashflow, getTotalExpenseByMonthYear, getTotalRevenueByMonthYear, getTotalExpectedRevenueByMonthYear, getTotalExpectedExpenseByMonthYear, getPast12MonthsCashflow, getNext12MonthsCashflow, getRevenueList, getExpenseList } from "../Cashflow/CashflowFetchData";


export default function Cashflow(){
    const location = useLocation();
    const navigate = useNavigate();
    const { user, getProfileId } = useUser(); // Access the user object from UserContext

    const profileId = getProfileId();
    const selectedRole = user.selectedRole; // Get the selected role from user object

    const [activeButton, setActiveButton] = useState('Cashflow');

    const [showChart, setShowChart] = useState('Current');
    
    const [month, setMonth] = useState(location.state.month || "January");
    const [year, setYear] = useState(location.state.year || "2024")
    
    const [showSelectMonth, setShowSelectMonth] = useState(false);
    const [openSelectProperty, setOpenSelectProperty] = useState(false);

    const [cashflowData, setCashflowData] = useState(null); // Cashflow data from API

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

    const displays = ["Cashflow", "ExpectedCashflow"]

    useEffect(() => {
        fetchCashflow(profileId).then((data) => {
            setCashflowData(data)
            // let currentMonthYearRevenueExpected = get

        }).catch((error) => {
            console.error("Error fetching cashflow data:", error)
        })
    }, [])

    useEffect(() => {
        if (cashflowData !== null && cashflowData !== undefined){
            let currentMonthYearTotalRevenue = getTotalRevenueByMonthYear(cashflowData, month, year)
            let currentMonthYearTotalExpense= getTotalExpenseByMonthYear(cashflowData, month, year)
            let currentMonthYearExpectedRevenue = getTotalExpectedRevenueByMonthYear(cashflowData, month, year)
            let currentMonthYearExpectedExpense = getTotalExpectedExpenseByMonthYear(cashflowData, month, year)
            setTotalRevenueByMonth(currentMonthYearTotalRevenue) // currently useing sum(total_paid)
            setTotalExpenseByMonth(currentMonthYearTotalExpense) // currently using sum(total_paid)
            setExpectedRevenueByMonth(currentMonthYearExpectedRevenue)
            setExpectedExpenseByMonth(currentMonthYearExpectedExpense)
            setRevenueList(getRevenueList(cashflowData))
            setExpenseList(getExpenseList(cashflowData))
            // console.log("--debug-- expenseList", revenueList)
            // console.log("--debug-- expenseList", expenseList)

            let revenueMapping = getTotalRevenueByType(cashflowData, month, year, false)
            let expenseMapping = getTotalExpenseByType(cashflowData, month, year, false)
            // console.log("revenueMapping", revenueMapping)
            // console.log("expenseMapping", expenseMapping)
            setRevenueByType(revenueMapping)
            setExpenseByType(expenseMapping)


            let expectedRevenueByType = getTotalRevenueByType(cashflowData, month, year, true)
            let expectedExpenseByType = getTotalExpenseByType(cashflowData, month, year, true)
            // console.log("expectedRevenueByType", expectedRevenueByType)
            // console.log("expectedExpenseByType", expectedExpenseByType)
            setExpectedRevenueByType(expectedRevenueByType)
            setExpectedExpenseByType(expectedExpenseByType)

            let last12months = getPast12MonthsCashflow(cashflowData, month, year)
            let next12Months = getNext12MonthsCashflow(cashflowData, month, year)

            setLast12Months(last12months)
            setNext12Months(next12Months)

        }
    }, [month, year, cashflowData])

    // useEffect(() => {
    //     console.log("revenueByType", revenueByType)
    //     console.log("expenseByType", expenseByType)
    // }, [revenueByType, expenseByType])
    
    return (
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                }}
            >
                <Paper
                    style={{
                        marginTop: '30px',
                        padding: theme.spacing(2),
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
                        <Button sx={{ textTransform: 'capitalize' }} onClick={() => setShowSelectMonth(true)}>
                            <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}/>
                            <Typography 
                                sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '14px'}}
                            >
                                Select Month / Year
                            </Typography>
                        </Button>
                        <SelectMonthComponentTest
                            selectedMonth={month}
                            selectedYear={year}
                            setMonth={setMonth}
                            setYear={setYear}
                            showSelectMonth={showSelectMonth}
                            setShowSelectMonth={setShowSelectMonth}
                        />
                        {selectedRole === 'MANAGER' && <Button sx={{ textTransform: 'capitalize' }} onClick={()=>{}}>
                                <img src={AllOwnerIcon} alt='All Owners' style={{ width: '10px', height: '10px' }}/>
                                <Typography 
                                    sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '14px'}}
                                >
                                    All Owners
                                </Typography>
                            </Button>
                        }
                        
                        <Button sx={{ textTransform: 'capitalize' }} onClick={() => setOpenSelectProperty(true)}>
                            <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '12px'}}>
                                Property
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
                        // onClick={()=> setActiveButton('Cashflow')}
                        style={{
                            backgroundColor: 'Cashflow' === 'Cashflow' ? theme.palette.custom.blue : theme.palette.custom.grey,
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
                            (totalRevenueByMonth !== null && totalRevenueByMonth !== undefined && totalExpenseByMonth !== null && totalExpenseByMonth !== undefined) ?
                                (totalRevenueByMonth - totalExpenseByMonth).toFixed(2) : '0.00'
                            }
                        </Typography>
                    </Box>
                    <Accordion 
                    sx={{
                        backgroundColor: 'Cashflow' === 'Cashflow' ? theme.palette.primary.main : theme.palette.primary.secondary,
                        boxShadow: 'none'
                    }}>
                        <Box
                            component="span"
                            m={3}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                    {'Cashflow' === 'Cashflow' ? '' : 'Expected'} {month} Revenue
                                </Typography>
                            </AccordionSummary>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                $ {'Cashflow' === 'Cashflow' ?
                                    (
                                        totalRevenueByMonth?
                                        totalRevenueByMonth.toFixed(2) : '0.00'
                                    ):(
                                        expectedRevenueByMonth?
                                        expectedRevenueByMonth.toFixed(2) : '0.00'
                                    )}
                            </Typography>
                        </Box>
                        <AccordionDetails>
                            {/* <RevenueTable totalRevenueByType={revenueByType} expectedRevenueByType={expectedRevenueByType} revenueList={revenueList} activeView={activeButton}/>             */}
                            <StatementTable categoryTotalMapping={revenueByType} allItems={revenueList} activeView={'Cashflow'} tableType="Revenue" categoryExpectedTotalMapping={expectedRevenueByType} month={month} year={year}/>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion 
                        sx={{
                            backgroundColor: "Cashflow" === 'Cashflow' ? theme.palette.primary.main : theme.palette.primary.secondary,
                            boxShadow: 'none'
                        }}>
                        <Box
                            component="span"
                            m={3}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                    {"Cashflow" === 'Cashflow' ? '' : 'Expected'} {month} Expense
                                </Typography>
                            </AccordionSummary>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                $ {"Cashflow" === 'Cashflow' ?
                                    (
                                        totalExpenseByMonth?
                                        totalExpenseByMonth.toFixed(2) : '0.00'
                                    ):(
                                        expectedExpenseByMonth ?
                                        expectedExpenseByMonth.toFixed(2) : '0.00'
                                    )}
                            </Typography>
                        </Box>
                        <AccordionDetails>
                            <StatementTable categoryTotalMapping={expenseByType} allItems={expenseList} activeView={"Cashflow"} tableType="Expense" categoryExpectedTotalMapping={expectedExpenseByType} month={month} year={year}/>
                        </AccordionDetails>
                    </Accordion>
                    
                    <Box
                        component="span"
                        m={3}
                        padding={3}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        // onClick={() => setActiveButton('ExpectedCashflow')}
                        style={{
                            backgroundColor: "ExpectedCashflow" === 'Cashflow' ? theme.palette.custom.grey : theme.palette.custom.yellowHighlight,
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
                            (expectedRevenueByMonth !== null && expectedRevenueByMonth !== undefined && expectedExpenseByMonth !== null && expectedExpenseByMonth !== undefined) ?
                            (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2) : '0.00'
                            }
                        </Typography>
                    </Box>
                    <Accordion 
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            boxShadow: 'none'
                        }}>
                        <Box
                            component="span"
                            m={3}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                    {"ExpectedCashflow" === 'Cashflow' ? '' : 'Expected'} {month} Revenue
                                </Typography>
                            </AccordionSummary>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                $ {"ExpectedCashflow" === 'Cashflow' ?
                                    (
                                        totalRevenueByMonth?
                                        totalRevenueByMonth.toFixed(2) : '0.00'
                                    ):(
                                        expectedRevenueByMonth?
                                        expectedRevenueByMonth.toFixed(2) : '0.00'
                                    )}
                            </Typography>
                        </Box>
                        <AccordionDetails>
                            {/* <RevenueTable totalRevenueByType={revenueByType} expectedRevenueByType={expectedRevenueByType} revenueList={revenueList} activeView={activeButton}/>             */}
                            <StatementTable categoryTotalMapping={revenueByType} allItems={revenueList} activeView={"ExpectedCashflow"} tableType="Revenue" categoryExpectedTotalMapping={expectedRevenueByType} month={month} year={year}/>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion 
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            boxShadow: 'none'
                        }}>
                        <Box
                            component="span"
                            m={3}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                    {"ExpectedCashflow" === 'Cashflow' ? '' : 'Expected'} {month} Expense
                                </Typography>
                            </AccordionSummary>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                                $ {"ExpectedCashflow" === 'Cashflow' ?
                                    (
                                        totalExpenseByMonth?
                                        totalExpenseByMonth.toFixed(2) : '0.00'
                                    ):(
                                        expectedExpenseByMonth ?
                                        expectedExpenseByMonth.toFixed(2) : '0.00'
                                    )}
                            </Typography>
                        </Box>
                        <AccordionDetails>
                            <StatementTable categoryTotalMapping={expenseByType} allItems={expenseList} activeView={"ExpectedCashflow"} tableType="Expense" categoryExpectedTotalMapping={expectedExpenseByType} month={month} year={year}/>
                        </AccordionDetails>
                    </Accordion>
                    <Stack
                        direction="row"
                        justifyContent="center"
                    >
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                            {showChart} Cashflow and Revenue
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        height={300}
                    >
                        {showChart === "Current" ? (
                                <MixedChart revenueCashflowByMonth={last12Months} activeButton={activeButton}></MixedChart>
                            ) : (
                                <MixedChart revenueCashflowByMonth={next12Months} activeButton={activeButton}></MixedChart>
                        )}
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        textTransform={"none"}
                    >
                         <Button
                            onClick={() => setShowChart(showChart === "Current" ? "Expected" : "Current")}
                        >
                             <Typography 
                                sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '14px'}}
                            >
                                Change Chart
                            </Typography>
                        </Button>
                    </Stack>
                </Paper>
                <Paper
                    style={{
                        margin: '2px',
                        padding: theme.spacing(2),
                        boxShadow: "none",
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                          width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                          width: '50%',
                        },
                      }}
                >
                    <Box
                        component="span"
                        m={2}
                        marginTop={15}
                        marginBottom={30}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button 
                            sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont, backgroundColor: theme.palette.primary.main, borderRadius: 3, textTransform: 'none'}}
                            onClick={()=>{navigate('/addRevenue', {state: {edit: false, itemToEdit: null}})}}> <img src={AddRevenueIcon}></img> Revenue</Button>
                        <Button 
                            sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont, backgroundColor: theme.palette.primary.main, borderRadius: 3, textTransform: 'none'}}
                            onClick={()=>{navigate('/addExpense', {state: {edit: false, itemToEdit: null}})}}> <img src={AddRevenueIcon}></img> Expense</Button>
                        <Button 
                            sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont, backgroundColor: theme.palette.primary.main, borderRadius: 3, textTransform: 'none'}}
                            onClick={()=>{navigate('/addUtility', {state: {edit: false, itemToEdit: null}})}}> <img src={AddRevenueIcon}></img> Utility</Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}


function SelectMonthComponentTest(props){

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December"
    ]
    
    const lastYear = new Date().getFullYear() - 1;
    const currentYear = new Date().getFullYear();
    const nextYear = new Date().getFullYear() + 1;

    return (
        <Dialog open={props.showSelectMonth} onClose={() => props.setShowSelectMonth(false)} maxWidth="lg">
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={()=>props.setShowSelectMonth(false)}
                    sx={{
                        position: 'absolute',
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
                            <Typography 
                                className={props.selectedMonth === month ? "selected" : "unselected"}
                                key={index}
                                onClick={() => props.setMonth(month)}
                            >
                                {month}
                            </Typography>
                        )
                    })}
                </Box>
                <Box>
                    <Typography 
                        className={props.selectedYear === lastYear.toString() ? "selected" : "unselected"}
                        onClick={() => props.setYear(lastYear.toString())}
                    >
                        {lastYear}
                    </Typography>
                    <Typography 
                        className={props.selectedYear === currentYear.toString() ? "selected" : "unselected"}
                        onClick={() => props.setYear(currentYear.toString())}
                    >
                        {currentYear}
                    </Typography>
                    <Typography 
                        className={props.selectedYear === nextYear.toString() ? "selected" : "unselected"}
                        onClick={() => props.setYear(nextYear.toString())}
                    >
                        {nextYear}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )

}

function StatementTable(props){
    const navigate = useNavigate();

    const activeView = props.activeView;
    const tableType = props.tableType;

    const month = props.month
    const year = props.year

    const categoryTotalMapping = props.categoryTotalMapping
    const allItems = props.allItems

    const categoryExpectedTotalMapping = props.categoryExpectedTotalMapping
    const allExpectedItems = []

    const navigateType = "/edit" + tableType

    function handleNavigation(type, item){
        console.log(item)
        navigate(type, {state: {itemToEdit: item, edit: true}})
    }

    // console.log("--debug-- tableType categoryTotalMapping", tableType, categoryTotalMapping)
    // console.log("activeView", activeView)
    // console.log("statement table year/month", year, month)

    function getCategoryCount(category){
        let items = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
        return "(" + items.length + ")"
    }
    
    function getCategoryItems(category, type){
        let items = allItems.filter((item) => item.purchase_type.toUpperCase() === category.toUpperCase() && item.cf_month === month && item.cf_year === year);
        // console.log("getCategoryItems", items)
        var key = "total_paid"
        if (activeView === "Cashflow"){
            key = "total_paid"
        } else{
            key = "pur_amount_due"
        }
        return (
            <>
                {items.map((item, index) => {
                    return (
                        activeView === "Cashflow" ? (
                        <TableRow key={index} onClick={() => handleNavigation(type, item)}>
                            <TableCell></TableCell>
                            <TableCell>
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {item.property_address} {item.property_unit} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                    ${item[key] ? item[key] : 0}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <DeleteIcon/>
                            </TableCell>
                        </TableRow>
                        ) : (
                            <TableRow key={index}>
                                <TableCell></TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {item.property_address} {item.property_unit} </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                        ${item[key] ? item[key] : 0}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <EditIcon/>
                                </TableCell>
                            </TableRow>
                        )
                    )
                })}
            </>
        )
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
                                            <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {category} {getCategoryCount(category)} </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                                ${value ? value: 0}                                 
                                            </Typography>
                                        </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    </Table>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Table>
                                        <TableBody>
                                            {getCategoryItems(category, navigateType)} 
                                        </TableBody>
                                    </Table>
                                </AccordionDetails>
                            </Accordion>
                        )
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
                                <AccordionSummary sx={{ flexDirection: "row-reverse" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                            <TableCell>
                                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {category} {getCategoryCount(category)} </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                                    ${value ? value: 0}                                 
                                                </Typography>
                                            </TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Table>
                                        <TableBody>
                                            {getCategoryItems(category)} 
                                        </TableBody>
                                    </Table>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </>
            )}
        </>
    )
}