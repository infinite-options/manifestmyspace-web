import React, { useState, useEffect } from "react";
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
    Modal
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
import SelectProperty from "../Leases/SelectProperty";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

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
    const [showSpinner, setShowSpinner] = useState(false);
    const [history, setTransactionList] = useState([]);
    console.log("history ", history);
    // https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/allTransactions/110-000095
    // const [transactionList, setTransactionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("payment_date");
    const [searchOutgoing, setSearchOutgoing] = useState("");
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const [openSelectProperty, setOpenSelectProperty] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState({});
    const handleClose = () => {
        setOpenSelectProperty(false);
    };
    const handleOpen = () => {
        setOpenSelectProperty(true);
    };
    useEffect(() => {
        console.log("selectedProperty", selectedProperty)   
       },[selectedProperty])


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
            id: "initiator_user_name",
            numeric: false,
            label: "Initiator"
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

    const capitalizeCategoryType = (purchase_type) => {
        let words = purchase_type.split(" ");
        let capitalizedWords = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

        return capitalizedWords.join(" ");
    }

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
                  sx={{ fontSize: 18 }}
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
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TransactionsOwnerData setShowSpinner={setShowSpinner} setTransactionList={setTransactionList} selectedProperty={selectedProperty} setLoading={setLoading}></TransactionsOwnerData>
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
                            <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont}}/>
                            <Typography 
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont}}
                            >
                            Last 30 Days
                            </Typography>
                        </Button>
                            {/* <SelectMonthComponent month={month} showSelectMonth={showSelectMonth} setShowSelectMonth={setShowSelectMonth} setMonth={setMonth} setYear={setYear}></SelectMonthComponent> */}
                        <Button sx={{ textTransform: 'capitalize' }} onClick={handleOpen}>
                            <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont, margin:'5px'}}/>
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont}}>
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
                    {loading && 
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {loading && <CircularProgress color="inherit" />}
                          </div>    
                        }
                    {!loading &&
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                        <Table>
                        <EnhancedTableHeadOutgoingPayments
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={history ? history.length : 0}
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
                                    if (!val) return false;
                                    const query = searchOutgoing.toLowerCase();
                                    const propertyAddress = val.property_address || '';
                                    const propertyUnit = String(val.property_unit) || '';
                                    const propertyCity = val.property_city || '';
                                    const propertyZip = val.property_zip || '';
                
                                    return (
                                        propertyAddress.toLowerCase().includes(query) ||
                                        propertyUnit.toLowerCase().includes(query) ||
                                        propertyCity.toLowerCase().includes(query) ||
                                        propertyZip.toLowerCase().includes(query)
                                    );
                                })
                                .map((row, index) => {
                                    {console.log(row)}  
                                    return row.purchase_status === "COMPLETED" || row.purchase_status === "PAID" ? (
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
                                        <TableCell align="left" className={classes.cell_short} sx={{ fontSize: 18 }}>
                                            {row.purchase_date !== null
                                                ? moment(row.purchase_date.substring(0, 10)).format('MM/DD/YY')
                                                : "Not Available"}
                                        </TableCell>
                                        <TableCell align="left" className={classes.cell_short} sx={{ fontSize: 18 }}>
                                            {capitalizeCategoryType(row.purchase_type.toLowerCase())}
                                        </TableCell>
                                        <TableCell align="left" className={classes.cell_long} sx={{ fontSize: 18}}>
                                            {row.initiator_user_name}
                                        </TableCell>
                                        <TableCell align="left" className={classes.cell_long} sx={{ fontSize: 18}}>
                                            {row.property_address + " " + row.property_unit}
                                        </TableCell>
                                        <TableCell align="left" className={classes.cell_short}>
                                            <Typography sx={{color: row.pur_cf_type === 'expense' ? theme.palette.custom.pinkText : theme.palette.custom.bgBlue, fontSize: 18}}>
                                                {row.pur_cf_type === 'expense' && '-'}${Math.abs(row.pur_amount_due).toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                   ) : (
                                    ""
                                    );
                                })}
                            </TableBody>
                        )}
                        </Table>
                    </Stack>}
                    </Paper>
                </Box>
                <Modal sx={{
                    overflowY: 'scroll',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                    open={openSelectProperty}
                    disableScrollLock={false}
                >
                    <Box sx={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <SelectProperty closeTab={handleClose} setSelectedProperty={setSelectedProperty}/>
                    </Box>

                </Modal>
                </ThemeProvider>
        </>
    )
}