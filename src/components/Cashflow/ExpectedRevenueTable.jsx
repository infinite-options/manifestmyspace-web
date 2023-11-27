import React, { Component, useState } from 'react';
import { ThemeProvider, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';

const RevenueTable = (props) => {
    const [expanded, setExpanded] = useState(false);
    const revenueSummary = props.revenueSummary;
    const revenue = props.revenue;
    console.log("props resummary", props.revenueSummary)
    
    const expectedRevenueByType = props.expectedRevenueByType;
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
                .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedRent ? expectedRevenueByType.expectedRent.toFixed(2) : '0.00'}
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
                return rev.purchase_type === "RENT" ? (
                    <TableRow>
                    <TableCell align="left">
                      <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{fontSize: '12px'}}>
                      $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedExtraCharges ? expectedRevenueByType.expectedExtraCharges.toFixed(2) : '0.00'}
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
                return rev.purchase_type === "EXTRA CHARGES" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                $
              {revenueSummary && revenueSummary.find((reS) => reS.purchase_type === "DEPOSIT") ?
              (revenueSummary
                .find((reS) => reS.purchase_type === "DEPOSIT")
                .amount_due.toFixed(2)) : '0.00'}
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
                return rev.purchase_type === "DEPOSIT" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedUtilities ? expectedRevenueByType.expectedUtilities.toFixed(2) : '0.00'}
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
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                          .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedLateFee ? expectedRevenueByType.expectedLateFee.toFixed(2) : '0.00'}
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
                return rev.purchase_type === "LATE FEE" ? (
                    <TableRow>
                    <TableCell align="left">
                    <Typography sx={{fontSize: '12px'}}>
                        {rev.property_address} {rev.property_unit}
                        {/* {rev.city}, {rev.state},{rev.zip} */}
                    </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography sx={{fontSize: '12px'}}>
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedMaintenance ? expectedRevenueByType.expectedMaintenance.toFixed(2) : '0.00'}
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
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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
                .amount_due.toFixed(2)) : '0.00'} */}
                {expectedRevenueByType  && expectedRevenueByType.expectedRepairs ? expectedRevenueByType.expectedRepairs.toFixed(2) : '0.00'}
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
                        $ {rev && rev.pur_amount_due ? rev.pur_amount_due : '0.00'}
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