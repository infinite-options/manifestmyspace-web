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

    const expectedExpenseByType = props.expectedExpenseByType;
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
                        {expectedExpenseByType && expectedExpenseByType.expectedMaintenance ? expectedExpenseByType.expectedMaintenance.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "MAINTENANCE" ? (
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
                        {expectedExpenseByType && expectedExpenseByType.expectedRepairs ? expectedExpenseByType.expectedRepairs.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "REPAIRS" ? (
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
                {expectedExpenseByType && expectedExpenseByType.expectedMortgage ? expectedExpenseByType.expectedMortgage.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "MORTGAGE" ? (
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
                {expectedExpenseByType && expectedExpenseByType.expectedTaxes ? expectedExpenseByType.expectedTaxes.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "TAXES" ? (
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
                {expectedExpenseByType && expectedExpenseByType.expectedInsurance ? expectedExpenseByType.expectedInsurance.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "INSURANCE" ? (
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
                {expectedExpenseByType && expectedExpenseByType.expectedUtilities ? expectedExpenseByType.expectedUtilities.toFixed(2) : '0.00'}
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
                    return rev.purchase_type === "UTILITY" ? (
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
                {expectedExpenseByType && expectedExpenseByType.expectedManagement ? expectedExpenseByType.expectedManagement.toFixed(2) : '0.00'}
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
                return rev.purchase_type.includes("OWNER PAYMENT") ? (
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