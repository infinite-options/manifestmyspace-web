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
                            {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MAINTENANCE") ?
                            (expenseSummary
                                .find((reS) => reS.purchase_type === "MAINTENANCE")
                                        .amount_paid.toFixed(2)) : '0.00'}
                            </Typography>
                        </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "MAINTENANCE" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "REPAIRS") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "REPAIRS")
                    .amount_paid.toFixed(2)) : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "REPAIRS" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MORTGAGE") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "MORTGAGE")
                    .amount_paid.toFixed(2)) : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "MORTGAGE" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "TAXES") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "TAXES")
                    .amount_paid.toFixed(2)) : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "TAXES" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "INSURANCE") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "INSURANCE")
                    .amount_paid.toFixed(2)) : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "INSURANCE" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "UTILITY") ?
                (expenseSummary
                    .find((reS) => reS.purchase_type === "UTILITY")
                    .amount_paid.toFixed(2)) : '0.00'}
                </Typography>
                </TableCell>
                </TableRow>
            </TableHead>
            </Table>
            </AccordionSummary>
            <AccordionDetails>
            <Table>
            <TableBody>
                {expense ? 
                (expense.map((rev, i) => {
                    return rev.purchase_type === "UTILITY" ? (
                        <TableRow>
                        <TableCell align="left">
                        <Typography sx={{fontSize: '12px'}}>
                            {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                            {rev.zip}
                        </Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography sx={{fontSize: '12px'}}>
                            $ {rev.amount_paid}
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
                {expenseSummary && expenseSummary.find((revS) => revS.purchase_type === "MANAGEMENT") ?
                (expenseSummary.find(
                  (revS) => revS.purchase_type === "MANAGEMENT"
                ).amount_paid.toFixed(2)) : '0.00'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {expense ? 
            (expense.map((rev, i) => {
                return rev.purchase_type === "MANAGEMENT" ? (
                    <TableRow>
                    <TableCell align="left">
                      <Typography sx={{fontSize: '12px'}}>
                        {rev.address} {rev.unit}, {rev.city}, {rev.state}
                        {rev.zip}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{fontSize: '12px'}}>
                        $ {rev.amount_paid}
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
    
    {/* Management Rent */}
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
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Management Rent </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MANAGEMENT RENT")
              ? (expenseSummary
                .find((reS) => reS.purchase_type === "MANAGEMENT RENT")
                .amount_paid.toFixed(2)) : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {expense ? 
            (expense.map((rev, i) => {
                return rev.purchase_type === "MANAGEMENT RENT" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                        {rev.zip}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev.amount_paid}
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
    
    {/* Management Extra Charges */}
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
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Management Extra Charges </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MANAGEMENT EXTRA CHARGES") ?
              (expenseSummary
                .find((reS) => reS.purchase_type === "MANAGEMENT EXTRA CHARGES")
                .amount_paid.toFixed(2)) : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {expense ? 
            (expense.map((rev, i) => {
                return rev.purchase_type === "MANAGEMENT EXTRA CHARGES" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                        {rev.zip}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev.amount_paid}
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
    
    {/* Management Late Fee */}
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
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Management Late Fee </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {expenseSummary && expenseSummary.find((reS) => reS.purchase_type === "MANAGEMENT LATE FEE") ?
              (expenseSummary
                .find((reS) => reS.purchase_type === "MANAGEMENT LATE FEE")
                .amount_paid.toFixed(2)) : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {expense ? 
            (expense.map((rev, i) => {
                return rev.purchase_type === "MANAGEMENT LATE FEE" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.address} {rev.unit}, {rev.city}, {rev.state}{" "}
                        {rev.zip}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev.amount_paid}
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