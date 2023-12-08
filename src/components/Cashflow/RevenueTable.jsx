import React, { Component, useState } from 'react';
import { ThemeProvider, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import theme from '../../theme/theme';

const RevenueTable = (props) => {
    const [expanded, setExpanded] = useState(false);
    const revenueSummary = props.revenueSummary;
    const revenue = props.revenue;
  
    const totalRevenueByType = props.totalRevenueByType;
    const revenueList = props.revenueList;
    const expectedRevenueByType = props.expectedRevenueByType
    const activeView = props.activeView;
    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };
    

    console.log("revenueList", revenueList)
    console.log("totalRevenueByType", totalRevenueByType)

    console.log("revenueSummary", revenueSummary)
    console.log("revenue", revenue)

    function getRevenueTypeItems(revenueType){
      // console.log("searching through", expenseList)
      let items = revenueList.filter((item) => item.purchase_type.toUpperCase() === revenueType[0]);
      // console.log(expenseType[0], items)
      if (items.length > 0) {
          // console.log("items.length > 0")
          return items.map((item) => (
              <TableRow>
                  <TableCell>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {item.property_address} {item.property_unit} </Typography>
                  </TableCell>
                  <TableCell align="right">
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                      ${item.total_paid ? item.total_paid : 0}
                  </Typography>
                  </TableCell>
              </TableRow>
              )
          )
      } else {
          // console.log("items.length <= 0")
          return (
              <TableRow>
                  <TableCell>
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> no items </Typography>
                  </TableCell>
                  <TableCell align="right">
                  <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                      $0
                  </Typography>
                  </TableCell>
              </TableRow>
          )
      }
    }



    return (
    
      <ThemeProvider theme={theme}>
        {activeView === "Cashflow" ? (
            <>
                {Object.entries(totalRevenueByType).map((revenueType) => {
                return (
                    <Accordion
                    sx={{
                        backgroundColor: theme.palette.custom.pink,
                        boxShadow: "none",
                    }}
                    key={revenueType[0]}
                    >
                    <AccordionSummary sx={{ flexDirection: "row-reverse" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {revenueType[0]} </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                ${revenueType[1] ? revenueType[1] : 0}
                                </Typography>
                            </TableCell>
                            </TableRow>
                        </TableHead>
                        </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table>
                        <TableBody>
                            {getRevenueTypeItems(revenueType)} 
                        </TableBody>
                        </Table>
                    </AccordionDetails>
                    </Accordion>
                )})}
            </>
        ) : (
            <>
                {Object.entries(expectedRevenueByType).map((revenueType) => {
                    return (
                            <Accordion 
                                sx={{
                                    backgroundColor: theme.palette.custom.pink,
                                    boxShadow: 'none',
                                }}
                            >
                            <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>
                                            <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> {revenueType[0]} </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                        <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                                            $
                                            {revenueType[1] ? revenueType[1] : 0.00}
                                        </Typography>
                                        </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableBody>
                                        {revenueList && revenueList.length > 0 ? (
                                            (revenueList.map((rev, i) => {
                                                return rev.purchase_type.toUpperCase() === revenueType[0] ? (
                                                    <TableRow>
                                                    <TableCell align="left">
                                                    <Typography sx={{fontSize: '12px'}}>
                                                        {rev.property_address} {rev.property_unit}
                                                    {/* {rev.city}, {rev.state},{rev.zip} */}
                                                    </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                    <Typography sx={{fontSize: '12px'}}>
                                                        $ {rev.pur_amount_due}
                                                    </Typography>
                                                    </TableCell>
                                                    </TableRow>
                                                ) : null}
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell align="left">
                                                    <Typography sx={{fontSize: '12px'}}>
                                                        No items
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{fontSize: '12px'}}>
                                                        $ 0.00
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    )}
                )}
            </>
        )}
    </ThemeProvider>
  );
}
export default RevenueTable;