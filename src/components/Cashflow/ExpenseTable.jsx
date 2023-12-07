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

  // const [expenseTypeList, setExpenseTypeList] = useState([
  //   { type: "MAINTENANCE", total: 0.0 },
  //   { type: "REPAIRS", total: 0.0 },
  //   { type: "MORTGAGE", total: 0.0 },
  //   { type: "TAXES", total: 0.0 },
  //   { type: "INSURANCE", total: 0.0 },
  //   { type: "UTILITY", total: 0.0 },
  //   { type: "MANAGEMENT", total: 0.0 },
  //   { type: "BILL POSTING", total: 0.0 },
  // ]);

  // const [expenseTypeObject, setExpenseTypeObject] = useState({
  //   "MAINTENANCE": 0.0,
  //   "REPAIRS": 0.0,
  //   "MORTGAGE": 0.0,
  //   "TAXES": 0.0,
  //   "INSURANCE": 0.0,
  //   "UTILITY": 0.0,
  //   "MANAGEMENT": 0.0,
  //   "BILL POSTING": 0.0,
  // });
  

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  // useEffect(() => {
  //   if (expenseList) {
  //     const updateExpenseTypes = { ...expenseTypeObject };
  //     for (const expenseType in updateExpenseTypes) {
  //       if (expenseList.hasOwnProperty(expenseType.toUpperCase())) {
  //         const matchingItem = expenseList[expenseType.toUpperCase()];
  //         console.log("matchingItem", matchingItem)
  //         if (matchingItem) {
  //           updateExpenseTypes[expenseType] += parseFloat(matchingItem.pur_amount_due);
  //         }
  //       }
  //     }
  
  //     setExpenseTypeObject(updateExpenseTypes);
  //   }
  //   console.log("expenseTypeObject", expenseTypeObject);
  // }, [expenseList]);

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
