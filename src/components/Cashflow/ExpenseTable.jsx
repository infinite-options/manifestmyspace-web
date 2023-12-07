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

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function getExpenseTypeItems(expenseType){
    // console.log("searching through", expenseList)
    let items = expenseList.filter((item) => item.purchase_type.toUpperCase() === expenseType[0]);
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
                    ${item.total_paid}
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
    <>
      <ThemeProvider theme={theme}>
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
                          ${expenseType[1]}
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
        </ThemeProvider>
    </>
  );
};
export default ExpenseTable;
