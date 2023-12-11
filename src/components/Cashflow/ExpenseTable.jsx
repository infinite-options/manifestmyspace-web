import React, { Component, useEffect, useState } from "react";
import { ThemeProvider, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import theme from "../../theme/theme";

const ExpenseTable = (props) => {
  const [expanded, setExpanded] = useState(false);
  const expenseSummary = props.expenseSummary;
  const expense = props.expense;
  console.log("props expenseSummary", props.expenseSummary);

  const totalExpenseByType = props.totalExpenseByType;
  const expenseList = props.expenseList;
  const expectedExpenseByType = props.expectedExpenseByType

  const activeView = props.activeView;

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  console.log("expenseList", expenseList)
  console.log("totalExpenseByType", totalExpenseByType)

  console.log("expenseSummary", expenseSummary)
  console.log("expense", expense)

  function getExpenseTypeItems(expenseType){
    let items = expenseList.filter((item) => item.purchase_type.toUpperCase() === expenseType[0]);
    if (items.length > 0) {
        return items.map((item, index) => (
            <TableRow key={index}>
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
                {Object.entries(totalExpenseByType).map((expenseType) => {
                return (
                    <Accordion
                    sx={{
                        backgroundColor: theme.palette.custom.pink,
                        boxShadow: "none",
                    }}
                    key={expenseType[0]}
                    >
                    <AccordionSummary sx={{ flexDirection: "row-reverse" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}> {expenseType[0]} </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography sx={{ fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight }}>
                                ${expenseType[1] ? expenseType[1] : 0}
                                </Typography>
                            </TableCell>
                            </TableRow>
                        </TableHead>
                        </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table>
                        <TableBody>
                            {getExpenseTypeItems(expenseType)} 
                        </TableBody>
                        </Table>
                    </AccordionDetails>
                    </Accordion>
                )})}
            </>
        ) : (
            <>
                {Object.entries(expectedExpenseByType).map((expenseType) => {
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
                                            <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> {expenseType[0]} </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                        <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                                            $
                                            {expenseType[1] ? expenseType[1] : 0.00}
                                        </Typography>
                                        </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableBody>
                                        {expenseList && expenseList.length > 0 ? (
                                            (expenseList.map((rev, i) => {
                                                return rev.purchase_type.toUpperCase() === expenseType[0] ? (
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
};
export default ExpenseTable;
