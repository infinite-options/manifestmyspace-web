import React, { Component, useState } from 'react';
import { ThemeProvider, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';

const RevenueTable = (props) => {
    const [expanded, setExpanded] = useState(false);
    const revenueSummary = props.revenueSummary;
    const revenue = props.revenue;
    console.log("props resummary", props.revenueSummary)
    
    const totalRevenueByType = props.totalRevenueByType;
    const revenueList = props.revenueList;
    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };
    return (<>
        <ThemeProvider theme={theme}>
        <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
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
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Rent </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "RENT")
              ? (revenueSummary
                .find((reS) => reS.purchase_type === "RENT")
                .total_paid.toFixed(2)) : '0.00'} */}
                {totalRevenueByType && totalRevenueByType.totalRent ? totalRevenueByType.totalRent : '0.00'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
                return rev.purchase_type === "RENT" && rev.payment_status !== "UNPAID" ? (
                    <TableRow>
                    <TableCell align="left">
                      <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
    
    {/* extra charges */}
    <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
            boxShadow: 'none',
        }}
        >
        <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Extra Charges </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "EXTRA CHARGES")
              ? (revenueSummary
                .find((reS) => reS.purchase_type === "EXTRA CHARGES")
                .total_paid.toFixed(2)) : '0.00'} */}
              {totalRevenueByType && totalRevenueByType.totalExtraCharges ? totalRevenueByType.totalExtraCharges : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
                return rev.purchase_type === "EXTRA CHARGES" && rev.payment_status !== "UNPAID" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
    
    {/* deposits */}
    <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
            boxShadow: 'none',
        }}
        >
        <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Deposits </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $0.00
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "DEPOSIT") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "DEPOSIT")
                .total_paid.toFixed(2)) : '0.00'} */}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
                return rev.purchase_type === "DEPOSIT" && rev.payment_status !== "UNPAID" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
    
    {/* ulitilies */}
    <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
            boxShadow: 'none',
        }}
        >
        <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Utilities </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "UTILITY") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "UTILITY")
                .total_paid.toFixed(2)) : '0.00'} */}
              {totalRevenueByType && totalRevenueByType.totalUtilities ? totalRevenueByType.totalUtilities : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
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
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
    
    {/* late fee */}
    <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
            boxShadow: 'none',
        }}
        >
        <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}> Late Fee </Typography>
              </TableCell>
              <TableCell align="right">
              <Typography sx={{fontSize: theme.typography.smallFont, fontWeight: theme.typography.primary.fontWeight}}>
                $
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "LATE FEE") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "LATE FEE")
                          .total_paid.toFixed(2)) : '0.00'} */}
              {totalRevenueByType && totalRevenueByType.totalLateFee ? totalRevenueByType.totalLateFee : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
                return rev.purchase_type === "LATE FEE" && rev.payment_status !== "UNPAID" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
    
    {/* maintenance */}
    <Accordion 
        sx={{
            backgroundColor: theme.palette.custom.yellow,
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
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "MAINTENANCE") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "MAINTENANCE")
                .total_paid.toFixed(2)) : '0.00'} */}
              {totalRevenueByType && totalRevenueByType.totalMaintenance ? totalRevenueByType.totalMaintenance : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
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
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
            backgroundColor: theme.palette.custom.yellow,
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
              {/* {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "REPAIRS") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "REPAIRS")
                .total_paid.toFixed(2)) : '0.00'} */}
              {totalRevenueByType && totalRevenueByType.totalRepairs ? totalRevenueByType.totalRepairs : '0.00'}
              </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        </AccordionSummary>
        <AccordionDetails>
        <Table>
          <TableBody>
            {revenueList ? 
            (revenueList.map((rev, i) => {
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
                        $ {rev && rev.total_paid ? rev.total_paid : '0.00'}
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
export default RevenueTable;