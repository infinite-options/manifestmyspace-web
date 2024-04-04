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
    TextField,
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
import SelectPropertyFilter from "../SelectPropertyFilter/SelectPropertyFilter";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

import APIConfig from "../../utils/APIConfig";

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
    // console.log("history ", history);
    // https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/allTransactions/110-000095
    // const [transactionList, setTransactionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("payment_date");
    const [searchOutgoing, setSearchOutgoing] = useState("");
    const [showPropertyFilter, setShowPropertyFilter] = useState(false);
    const [filterPropertyList, setFilterPropertyList] = useState([]);
    const [reduceBy30Days, setReduceBy30Days] = useState(false);
    const { getProfileId } = useUser();
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    useEffect(() => {
        const fetchOwnerTransactions = async () => {
            setShowSpinner(true);
            // const res = await axios.get(`http://127.0.0.1:4000/allTransactions/${getProfileId()}`);
            const res = await axios.get(`${APIConfig.baseURL.dev}/allTransactions/${getProfileId()}`);
            // console.log("payments", res);
            // setTransactionsResult(res.data.result);
            const transactions = res.data.result;
            setTransactionList(res.data.result);
            setLoading(false);
            setShowSpinner(false);
          };
        const fetchOwnerProperties = async () => {
            setShowSpinner(true);
            const res = await axios.get(`${APIConfig.baseURL.dev}/properties/${getProfileId()}`);
            const properties = res.data.Property.result;
            const propertyList = []
            const addedAddresses = [];
            console.log(properties)
            for (const property of properties){
                if (!addedAddresses.includes(property.property_uid)){
                    addedAddresses.push(property.property_uid);
                    if (!propertyList.includes(property.property_address)){
                        propertyList.push({
                            "property_uid": property.property_uid,
                            "address": property.property_address + " " + property.property_unit,
                            "checked": true
                        });
                    }
                }
            }
            setFilterPropertyList(propertyList);
            setShowSpinner(false);
        }
        fetchOwnerTransactions();
        fetchOwnerProperties();
    }, []);


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

    function displayPropertyFilterTitle(filterPropertyList){
        var count = 0;
        var displayList = []
        for (const item of filterPropertyList){
            if(item.checked){
                count++;
                displayList.push(item.address)
            }
        }
        if(count === filterPropertyList.length){
            return "All Properties"
        } else if(count < 3){
            return displayList.join(", ")
        }    
        else{
            return "Selected " + count + " Properties"
        }
    }

    function reduceItemsBy30Days(){
        console.log("reduceBy30Days ", !reduceBy30Days)
        setReduceBy30Days(!reduceBy30Days);
    }

    function EnhancedTableHeadOutgoingPayments(props) {
        const { order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
    
        return (
          <TableHead>
            <TableRow
                sx={{borderBottom: '1px solid #000000'}}
            >
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
            {/* <TransactionsOwnerData setShowSpinner={setShowSpinner} setTransactionList={setTransactionList} selectedProperty={selectedProperty} setLoading={setLoading}></TransactionsOwnerData> */}
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '100vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    paddingBottom: "20px",
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
                        <Button sx={{ textTransform: 'capitalize' }} onClick={reduceItemsBy30Days}>
                            <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont}}/>
                            <Typography 
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.mediumFont}}
                            >
                            {reduceBy30Days ?  "View All" : "Last 30 Days"}
                            </Typography>
                        </Button>
                        <Button sx={{ textTransform: 'capitalize' }} onClick={() => setShowPropertyFilter(true)}>
                            <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                            <Typography 
                                sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {displayPropertyFilterTitle(filterPropertyList)}
                            </Typography>
                        </Button>

                        <TextField
                            type="text"
                            placeholder="Search"
                            size="small"
                            onChange={(event) => {
                                setSearchOutgoing(event.target.value);
                            }}
                            variant="outlined"
                            sx={{
                                backgroundColor: "#FFFFFF",
                            }}
                        />
                    </Box>
                    <SelectPropertyFilter showPropertyFilter={showPropertyFilter} setShowPropertyFilter={setShowPropertyFilter} filterList={filterPropertyList} setFilterList={setFilterPropertyList}/>
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
                            {history.filter((row) => row.purchase_status === "COMPLETED" || row.purchase_status === "PAID").length === 0 ? (
                                <TableRow>
                                    <div>No Payment History</div> 
                                </TableRow>
                            ) : (
                                <TableBody>
                                    {stableSort(history, getComparator(order, orderBy))
                                    .filter((val) => {
                                        const query = searchOutgoing.toLowerCase();
                                        const allowedAttributes = [
                                            "initiator_profile_uid",
                                            "initiator_user_name",
                                            "property_uid", 
                                            "purchase_uid", 
                                            "purchase_status", 
                                            "purchase_type", 
                                            "purchase_date",
                                            "tenant_uid",
                                            "pur_initiator",
                                            "property_address",
                                            "receiver_user_name",
                                        ];
                                        return Object.values(val).some((value, index) => {
                                            const attribute = Object.keys(val)[index];
                                            if (allowedAttributes.includes(attribute)) {
                                                return String(value).toLowerCase().includes(query);
                                            }
                                            return false;
                                        });
                                    }).filter((row) => {
                                        if (filterPropertyList.length === 0){
                                            return true
                                        } else {
                                            for (const item of filterPropertyList){
                                                if (item.property_uid === row.property_uid && item.checked === true){
                                                    return true
                                                }
                                            }
                                            return false
                                        }
                                    }).filter((row) => {
                                        if (reduceBy30Days){
                                            console.log(row)
                                            const today = new Date();
                                            const date = new Date(row.purchase_date);
                                            console.log(today, date)
                                            const diffTime = Math.abs(today - date);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                                            return diffDays <= 30
                                        } else {
                                            return true
                                        }
                                    })
                                    .map((row, index) => {
                                        // {console.log(row)}  
                                        return row.purchase_status === "COMPLETED" || row.purchase_status === "PAID" ? (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.purchase_uid}
                                                sx={{borderBottom: '1px solid #000000'}}
                                                onClick={()=>{
                                                    console.log("row.pur_amount_due ", row.pur_amount_due);
                                                    navigate('/viewTransactionOwner', { state: { history: history, purchase_uid: row.purchase_uid } });
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
                                                <TableCell align="right" className={classes.cell_short}>
                                                    <Typography sx={{color: row.pur_cf_type === 'expense' ? theme.palette.custom.pinkText : theme.palette.custom.bgBlue, fontSize: 18}}>
                                                        {/* {row.pur_cf_type === 'expense' && '-'}${Math.abs(row.pur_amount_due).toFixed(2)} */}
                                                        {row.pur_cf_type === 'expense' && '-'}${Math.abs(row.total_paid).toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                    ) : null
                                })}
                                </TableBody>
                            )}
                            </Table>
                        </Stack>
                    }
                    </Paper>
                </Box>
            </ThemeProvider>
        </>
    )
}