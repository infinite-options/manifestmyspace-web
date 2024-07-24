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


const ManagerProfitability = ({ propsMonth, propsYear, profitsTotal, profits, rentsTotal, rentsByProperty, payoutsTotal, payouts, setMonth, setYear, }) => {

    const { user, getProfileId, selectedRole } = useUser();
    const [ activeButton, setActiveButton ] = useState("Cashflow");
    
    const [ showSelectMonth, setShowSelectMonth ] = useState(false);
    const [ openSelectProperty, setOpenSelectProperty ] = useState(false);
    const [ profitsExpanded, setProfitsExpanded ] = useState(true);
  
    const month = propsMonth || "July"; //fix
    const year = propsYear || "2024";
  
  
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
            <Stack direction="row" justifyContent="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                {month} {year} Profitability
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
            <Grid container item xs={12}>
                <Grid item xs={8}>                        
                </Grid>                                    
                <Grid container justifyContent="flex-end" item xs={2}>
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
                                    
            <Accordion
              sx={{
                backgroundColor: theme.palette.primary.main,
                boxShadow: "none",
              }}
              expanded={profitsExpanded}
              onChange={ () => {
                setProfitsExpanded( (prevState) => !prevState);
              }}
            >
              {/* This is Revenue Bar underneath the Yellow Expected Cashflow box */}
              <Grid container item xs={12}>
                <Grid container justifyContent="flex-start" item xs={8}>
                    <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                        
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight }}>
                                Profit
                                </Typography>
                            </AccordionSummary>
                        
                    </Grid>
                </Grid>
                {/* <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ width: '200px',}}> */}
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $                        
                    {
                        (profitsTotal && profitsTotal?.totalExpected) ? profitsTotal?.totalExpected?.toFixed(2) : "0.00"
                    }
                  </Typography>
                </Grid>
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $
                    { (profitsTotal && profitsTotal?.totalActual) ? profitsTotal?.totalActual?.toFixed(2) : "0.00" }
                    </Typography>
                </Grid>
              </Grid>
                
              
  
              <AccordionDetails>
              {
                    profits && Object.keys(profits)?.map( (propertyUID, index) => {                            
                        const property = profits[propertyUID]                                                        
                        return (
                            <>                                   
                                <Accordion
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: "none",
                                    }}
                                    key={index}
                                    >
                                    <Grid container item xs={12}>
                                        <Grid container justifyContent="flex-start" item xs={8}>
                                            <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                        {`${property?.propertyInfo?.property_address},`}
                                                        {' '}
                                                        {property?.propertyInfo?.property_unit && 'Unit - '}
                                                        {property?.propertyInfo?.property_unit && property?.propertyInfo?.property_unit}
                                                    </Typography>
                                                </AccordionSummary>
                                            </Grid>                                            
                                        </Grid>
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                        
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                $                        
                                                {
                                                    (property?.totalExpected) ? property?.totalExpected?.toFixed(2) : "0.00"
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                            $
                                            { (property?.totalActual) ? property?.totalActual?.toFixed(2) : "0.00" }
                                            </Typography>
                                        </Grid>
                                    </Grid>
  
                                    <AccordionDetails>
                                        <Grid container item xs={12}>
                                            {
                                                
                                                property?.profitItems?.map( (item, index) => {
                                                    return (
                                                        <Grid item container xs={12} key={index}>
                                                            <Grid item xs={8}>{item.purchase_type}</Grid>
                                                            <Grid container  justifyContent='flex-end' item xs={2}><Typography>${item.pur_amount_due_total? item.pur_amount_due_total : parseFloat(0).toFixed(2)}</Typography></Grid>
                                                            <Grid container  justifyContent='flex-end' item xs={2}><Typography>${item.total_paid_total? item.total_paid_total : parseFloat(0).toFixed(2)}</Typography></Grid>
                                                            {/* <Grid item xs={2}>{item.pur_cf_type}</Grid> */}
                                                        </Grid>
  
                                                    );
                                                })
                                            }
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        );
                    })
                }
              </AccordionDetails>
            </Accordion>
  
            <Accordion
              sx={{
                backgroundColor: theme.palette.primary.main,
                boxShadow: "none",
              }}
            >                  
              <Grid container item xs={12}>
                <Grid container justifyContent="flex-start" item xs={8}>
                    <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight }}>
                            Rents
                            </Typography>
                        </AccordionSummary>
                    </Grid>
                </Grid>
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $                        
                    {
                        (rentsTotal && rentsTotal?.totalExpected) ? rentsTotal?.totalExpected?.toFixed(2) : "0.00"
                    }
                  </Typography>
                </Grid>
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $
                    { (rentsTotal && rentsTotal?.totalActual) ? rentsTotal?.totalActual?.toFixed(2) : "0.00" }
                    </Typography>
                </Grid>
              </Grid>
  
              <AccordionDetails>
                {/* <RevenueTable totalRevenueByType={revenueByType} expectedRevenueByType={expectedRevenueByType} revenueList={revenueList} activeView={activeButton}/>             */}
                {/* <StatementTable
                  categoryTotalMapping={revenueByType}
                  allItems={revenueList}
                  activeView={"ExpectedCashflow"}
                  tableType="Revenue"
                  categoryExpectedTotalMapping={expectedRevenueByType}
                  month={month}
                  year={year}
                /> */}
                {
                    rentsByProperty && Object.keys(rentsByProperty)?.map( (propertyUID, index) => {                            
                        const property = rentsByProperty[propertyUID]                                                        
                        return (
                            <>                                   
                                <Accordion
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: "none",
                                    }}
                                    >
                                    
                                    <Grid container item xs={12}>
                                        <Grid container justifyContent="flex-start" item xs={8}>
                                            <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                        {`${property?.propertyInfo?.property_address},`}
                                                        {' '}
                                                        {property?.propertyInfo?.property_unit && 'Unit - '}
                                                        {property?.propertyInfo?.property_unit && property?.propertyInfo?.property_unit}
                                                    </Typography>
                                                </AccordionSummary>
                                            </Grid>
                                        </Grid>
                                        
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                $                        
                                                {
                                                    (property?.totalExpected) ? property?.totalExpected?.toFixed(2) : "0.00"
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                            $
                                            { (property?.totalActual) ? property?.totalActual?.toFixed(2) : "0.00" }
                                            </Typography>                                            
                                        </Grid>
                                    </Grid>
  
                                    <AccordionDetails>
                                        <Grid container item xs={12}>
                                            {
                                                
                                                property?.rentItems?.map( (item, index) => {
                                                    return (
                                                        <Grid item container xs={12} key={index}>
                                                            <Grid item xs={8}>{item.purchase_type}</Grid>
                                                            <Grid container justifyContent='flex-end' item xs={2}>${item.pur_amount_due_total? item.pur_amount_due_total : parseFloat(0).toFixed(2)}</Grid>
                                                            <Grid container justifyContent='flex-end' item xs={2}>${item.total_paid_total? item.total_paid_total : parseFloat(0).toFixed(2)}</Grid>
                                                            {/* <Grid item xs={2}>{item.pur_cf_type}</Grid> */}
                                                        </Grid>
  
                                                    );
                                                })
                                            }
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        );
                    })
                }
              </AccordionDetails>
            </Accordion>
  
            <Accordion
              sx={{
                backgroundColor: theme.palette.primary.main,
                boxShadow: "none",
              }}
            >                  
              <Grid container item xs={12}>
                <Grid container justifyContent="flex-start" item xs={8}>
                    <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight }}>
                            Payouts
                            </Typography>
                        </AccordionSummary>
                    </Grid>
                </Grid>
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $                        
                    {
                        (payoutsTotal && payoutsTotal?.totalExpected) ? payoutsTotal?.totalExpected?.toFixed(2) : "0.00"
                    }
                  </Typography>
                </Grid>
                <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                    $
                    { (payoutsTotal && payoutsTotal?.totalActual) ? payoutsTotal?.totalActual?.toFixed(2) : "0.00" }
                    </Typography>
                </Grid>
              </Grid>
  
              <AccordionDetails>
              {
                    payouts && Object.keys(payouts)?.map( (propertyUID, index) => {                            
                        const property = payouts[propertyUID]                                                        
                        return (
                            <>                                   
                                <Accordion
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: "none",
                                    }}
                                    key={index}                                        
                                    >                                        
                                    <Grid container item xs={12}>
                                        <Grid container justifyContent="flex-start" item xs={8}>
                                            <Grid container direction="row" alignContent='center' sx={{ height: '35px',}}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                        {`${property?.propertyInfo?.property_address},`}
                                                        {' '}
                                                        {property?.propertyInfo?.property_unit && 'Unit - '}
                                                        {property?.propertyInfo?.property_unit && property?.propertyInfo?.property_unit}
                                                    </Typography>
                                                </AccordionSummary>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                                $                        
                                                {
                                                    (property?.totalExpected) ? property?.totalExpected?.toFixed(2) : "0.00"
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid container alignContent='center' justifyContent='flex-end' item xs={2}>
                                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight }}>
                                            $
                                            { (property?.totalActual) ? property?.totalActual?.toFixed(2) : "0.00" }
                                            </Typography>                                            
                                        </Grid>
                                    </Grid>
  
                                    <AccordionDetails>
                                        <Grid container item xs={12}>
                                            {
                                                
                                                property?.payoutItems?.map( (item, index) => {
                                                    return (
                                                        <Grid item container xs={12} key={index}>
                                                            <Grid item xs={8}>{item.purchase_type}</Grid>
                                                            <Grid container justifyContent='flex-end' item xs={2}>${item.pur_amount_due_total? item.pur_amount_due_total : parseFloat(0).toFixed(2)}</Grid>
                                                            <Grid container justifyContent='flex-end' item xs={2}>${item.total_paid_total? item.total_paid_total : parseFloat(0).toFixed(2)}</Grid>
                                                            {/* <Grid item xs={2}>{item.pur_cf_type}</Grid> */}
                                                        </Grid>
  
                                                    );
                                                })
                                            }
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        );
                    })
                }
              </AccordionDetails>
            </Accordion>
            
            
          </Paper>              
        </Box> 
      </>
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
  

export default ManagerProfitability;

