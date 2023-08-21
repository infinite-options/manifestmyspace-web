import React, { useState } from "react";
import moment from 'moment';
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    TableSortLabel,
    Box,
    ThemeProvider,
    IconButton,
    Paper,
    Button,
    Typography,
    Stack,
    TableContainer
  } from "@mui/material";
  import CloseIcon from '@mui/icons-material/Close';
  import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
  import HomeWorkIcon from '@mui/icons-material/HomeWork';
  import PropTypes from "prop-types";
  import { visuallyHidden } from "@mui/utils";
  import {
      descendingComparator as descendingComparator,
      getComparator as getComparator,
      stableSort as stableSort,
  } from "../utils/helper";
  import { useNavigate } from "react-router-dom";
  import theme from "../../theme/theme";
  import { makeStyles } from "@material-ui/core/styles";
  import TransactionsOwnerData from "./TransactionsOwnerData";
import ViewTransactionOwner from "./ViewTransactionOwner";

  const useStyles = makeStyles(theme => ({
    cell_long: {
      width: '50%',
      minWidth: 1,
    },
    cell_short: {
          width: '10%',
        },
  
    }));
export default function TransactionHistory(props) { 
    const classes = useStyles();
    const navigate = useNavigate();
    // const history = props.data; //array of objects

    const [history, setTransactionList] = useState([]);
    console.log("history ", history);
    // const [transactionList, setTransactionList] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("payment_date");
    const [searchOutgoing, setSearchOutgoing] = useState("");
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const paymentsOutgoingHeadCell = [
        {
            id: "payment_date",
            numeric: false,
            label: "Date",
        },
        { 
            id: "payment_type", 
            numeric: false, 
            label: "Type"
        },
        {
            id: "address",
            numeric: false,
            label: "Address",
        },
        {
            id: "amount_paid",
            numeric: true,
            label: "Amount",
        },
    ]

    function EnhancedTableHeadOutgoingPayments(props) {
        const { order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
    
        return (
          <TableHead>
            <TableRow
            sx={{borderBottom: '1px solid #000000'}}>
              {paymentsOutgoingHeadCell.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{ fontSize: 13 }}
                  align="left"
                  size="small"
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    align="center"
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={{ ...visuallyHidden, margin: 0 }}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
    }
    
    EnhancedTableHeadOutgoingPayments.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(["asc", "desc"]).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
      };

    return (
        <>
            <ThemeProvider theme={theme}>
            <TransactionsOwnerData setTransactionList={setTransactionList}></TransactionsOwnerData>
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
                        padding: 2,
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
                    {/* <IconButton
                        aria-label="close"
                        onClick={() => navigate(-1)}
                        sx={{
                            position: 'sticky',
                            left: '90vw',
                            top: 1,
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.common.fontWeight
                        }}
                    >
                        <CloseIcon />
                    </IconButton> */}
                    
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                        <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Transaction History
                        </Typography>
                    </Stack>
                    <Box
                        component="span"
                        m={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button sx={{ textTransform: 'capitalize' }}>
                            <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}/>
                            <Typography 
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                            Last 30 Days
                            </Typography>
                        </Button>
                            {/* <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent> */}
                        <Button sx={{ textTransform: 'capitalize' }}>
                            <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                            Property
                            </Typography>
                        </Button>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={(event) => {
                            setSearchOutgoing(event.target.value);
                            }}
                            style={{
                            width: "60px",
                            border: "1px solid black",
                            borderRadius: '40px',
                            padding: "5px",
                            }}
                        />
                    </Box>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                        {/* <TableContainer> */}
                        {/* <Table stickyHeader> */}
                        <Table>
                        <EnhancedTableHeadOutgoingPayments
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={history.length}
                            />
                        {history.filter((row) => row.purchase_status === "COMPLETED").length ===
                        0 ? (
                            <TableRow>
                            <div>No Payment History</div>
                            </TableRow>
                        ) : (
                            <TableBody>
                                {stableSort(history, getComparator(order, orderBy))
                                .filter((val) => {
                                    const query = searchOutgoing.toLowerCase();
                
                                    return (
                                    val.property_address.toLowerCase().includes(query) ||
                                    String(val.property_unit).toLowerCase().includes(query) ||
                                    val.property_city.toLowerCase().includes(query) ||
                                    val.property_zip.toLowerCase().includes(query)
                                    );
                                })
                                .map((row, index) => {
                                    return row.purchase_status === "COMPLETED" ? (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.purchase_uid}
                                        sx={{borderBottom: '1px solid #000000'}}
                                        onClick={()=>{
                                            console.log("row.pur_amount_due ", row.pur_amount_due);
                                            navigate('/viewTransactionOwner', { state: { history, index } });
                                        }}
                                    >
                                            <TableCell align="left" className={classes.cell_short} sx={{ fontSize: 12 }}>
                                            {row.purchase_date !== null
                                                ? moment(row.purchase_date.substring(0, 10)).format('MM/DD/YY')
                                                : "Not Available"}
                                            </TableCell>
                                            <TableCell align="left" className={classes.cell_short} sx={{ fontSize: 12 }}>{row.purchase_type}</TableCell>
                                        <TableCell align="left" className={classes.cell_long} sx={{ fontSize: 12}}>
                                            {/* <TableRow> */}
                                            {row.property_address +
                                            " " +
                                            row.property_unit +
                                            "," +
                                            row.property_city +
                                            ", "}
                                            {/* </TableRow>
                                            <TableRow> */}
                                            {row.property_state +
                                            " " +
                                            row.property_zip}
                                            {/* </TableRow> */}
                                        </TableCell>
                                        <TableCell align="left" className={classes.cell_short} sx={{ fontSize: 12 }}>
                                        ${Math.abs(row.pur_amount_due).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                   ) : (
                                    ""
                                    );
                                })}
                            </TableBody>
                        )}
                        </Table>
                        {/* </TableContainer> */}
                    </Stack>
                    </Paper>
                </Box>
                </ThemeProvider>
        </>
    )
}