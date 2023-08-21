import React, { Component, useState } from 'react';
import { ThemeProvider, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import theme from '../../theme/theme';

const ExpenseTable = (props) => {
    const [expanded, setExpanded] = useState(false);
    const expenseSummary = props.expenseSummary;
    const expense = props.expense;
    console.log("props expenseSummary", props.expenseSummary)

    const totalExpenseByType = props.totalExpenseByType;
    const expenseList = props.expenseList;

    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };
    return (<>
        <ThemeProvider theme={theme}>
        {/* Maintenance */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Maintenance </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MAINTENANCE") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "MAINTENANCE")
                            .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalMaintenance ? totalExpenseByType.totalMaintenance : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "MAINTENANCE" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
    
        {/* repairs */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Repairs </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "REPAIRS") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "REPAIRS")
                    .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalRepairs ? totalExpenseByType.totalRepairs : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "REPAIRS" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
        
        {/* Mortgage */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Mortgage </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MORTGAGE") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "MORTGAGE")
                    .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalMortgage ? totalExpenseByType.totalMortgage : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "MORTGAGE" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
        
        {/* Taxes */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Taxes </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "TAXES") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "TAXES")
                    .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalTaxes ? totalExpenseByType.totalTaxes : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "TAXES" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
        
        {/* Insurance */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Insurance </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "INSURANCE") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "INSURANCE")
                    .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalInsurance ? totalExpenseByType.totalInsurance : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "INSURANCE" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
        
        {/* Utility */}
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
                    <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Utility </Typography>
                </TableCell>
                <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                    $
                {/* {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "UTILITY") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "UTILITY")
                    .total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalUtilities ? totalExpenseByType.totalUtilities : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expenseList ? 
                (expenseList.map((rev, i) => {
                    return rev.purchase_type === "UTILITY" && rev.payment_status !== "UNPAID" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.total_paid}
                        </Typography>
                        </TableCell>
                        </TableRow>
                    ) : (
                        ""
                    );
                })
                ) : ''}
            </TableBody>
            </Table>
        </AccordionDetails>
        </Accordion>
        
        {/* Management */}
        <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.pink,
            boxShadow: 'none',
        }}
        // expanded={expanded}
        // onChange={handleAccordionChange}
        >
          <AccordionSummary sx={{ flexDirection: 'row-reverse' }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Management </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
                {/* {expenseSummary && expenseSummary.find((revS) => revS.purchase_type === "MANAGEMENT") ?
                (expenseSummary.find(
                  (revS) => revS.purchase_type === "MANAGEMENT"
                ).total_paid.toFixed(2)) : '0.00'} */}
                {totalExpenseByType && totalExpenseByType.totalManagement ? totalExpenseByType.totalManagement : '0.00'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {expenseList ? 
            (expenseList.map((rev, i) => {
                return rev.purchase_type.includes("OWNER PAYMENT") && rev.payment_status !== "UNPAID" ? (
                    <TableRow>
                    <TableCell align="left">
                      <Typography sx={{fontSize: '12px'}}>
                      {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{fontSize: '12px'}}>
                        $ {rev.total_paid}
                      </Typography>
                    </TableCell>
                    </TableRow>
                ) : (
                    ""
                );
            })
            ) : ''}
        </TableBody>
        </Table>
        </AccordionDetails>
        </Accordion>
        </ThemeProvider>
    </>)
}
export default ExpenseTable;