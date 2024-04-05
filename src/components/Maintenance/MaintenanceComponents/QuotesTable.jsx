import {Grid, Accordion, AccordionSummary, AccordionDetails, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { First } from 'react-bootstrap/esm/PageItem';

export default function QuotesTable({maintenanceItem, maintenanceQuotesForItem}){
    // maintenanceQuotes is a state variable that is set in the grandparent component
    // maintenanceItem is a prop that is passed from the parent component
    let oneAcceptedQuote = maintenanceQuotesForItem.some(quote => quote.quote_status === "ACCEPTED") // check that there is exactly one quote that has been accepted

    let request_status = maintenanceItem.maintenance_request_status
    let status = maintenanceItem.maintenance_status

    let tableText = {color: "#FFFFFF", fontWeight: 500, fontSize: "18px"}
    let tableHeader = {color: "#FFFFFF", fontWeight: 700, fontSize: "18px"}
    let tableCell = {padding: "0px", margin: "0px"}

    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
        setExpanded(!expanded);
    };
    

    // sort maintenanceQuotesForItem so that the accepted quote is First, then the sent quotes and then the rejected and cancelled quotes.
    maintenanceQuotesForItem.sort((a, b) => {
        const order = ["FINISHED", "SCHEDULED", "ACCEPTED", "SENT", "REQUESTED", "REJECTED", "CANCELLED", undefined];
        return order.indexOf(a.quote_status) - order.indexOf(b.quote_status);
    });
    

    if (request_status !== "NEW"){
        
        if (oneAcceptedQuote){
            let acceptedQuote = maintenanceQuotesForItem.find(quote => quote.quote_status === "ACCEPTED") // get the accepted quote (should just be one)
            let otherQuotes = maintenanceQuotesForItem.filter(quote => quote.quote_status !== "ACCEPTED") // get all other quotes

            return (
                <Grid item xs={12}>
                    {console.log("One Accepted Quote and Other Quotes", acceptedQuote, otherQuotes)}
                    <Typography sx={{color: "#FFFFFF", fontWeight: 900, fontSize: "24px",}}>Quotes Table</Typography>
                    <Typography sx={tableText}> {maintenanceQuotesForItem.length} Quotes</Typography>
                    <Table sx={{padding: "0px"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableHeader}> Business Name </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableHeader}> ID </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableHeader}> Amount </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableHeader}> Status </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableHeader}> Date </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell sx={tableCell}>
                                <Typography sx={tableText}> {acceptedQuote.maint_business_name}</Typography>
                            </TableCell>
                            <TableCell sx={tableCell}>
                                <Typography sx={tableText}> {acceptedQuote.maint_business_uid} </Typography>
                            </TableCell>
                            <TableCell sx={tableCell}>
                                <Typography sx={tableText}> {acceptedQuote.quote_total_estimate ? "$" + acceptedQuote.quote_total_estimate : "Not Provided"} </Typography>
                            </TableCell>
                            <TableCell sx={tableCell}>
                                <Typography sx={tableText}> {acceptedQuote.quote_status} </Typography>
                            </TableCell>
                            <TableCell sx={tableCell}>
                                <Typography sx={tableText}> {acceptedQuote.quote_created_date} </Typography>
                            </TableCell>
                        </TableRow>
                    </Table>
                    {otherQuotes.length > 0 ? (
                        <Accordion
                            sx={{
                                boxShadow: "none",
                                backgroundColor: "transparent",
                                padding: expanded ? "0px 0px" : "0px",
                                margin: "0px",
                                minHeight: "flex",
                            }}
                            expanded={expanded} 
                            onChange={handleChange}
                        >
                            <AccordionSummary sx={{color: "#FFFFFF", fontWeight: 700, fontSize: "18px", padding: expanded ? "0px 0px" : "0px", margin: "0px", flexDirection: "row-reverse", minHeight: "flex"}} expandIcon={<ExpandMoreIcon sx={{color: "#FFFFFF", minHeight: "flex"}} />} onClick={(e) => e.stopPropagation()}>
                                All other quotes
                            </AccordionSummary>
                            <AccordionDetails sx={{padding: "0px"}}>
                                <Table sx={{padding: "0px"}}>
                                    {otherQuotes.map((quote, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.maint_business_name} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.maint_business_uid} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_total_estimate ? "$" + quote.quote_total_estimate : "Not Provided"} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_status} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_created_date} </Typography>
                                            </TableCell>
                                        </TableRow> 
                                    ))}
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    ) : (
                        <Typography sx={tableText}> No other quotes have been submitted </Typography>
                    )}
                </Grid>
            )
        }
        else {
            // if there is no accepted quote, and it is in scheduled then the PM is doing it
            if (request_status === "SCHEDULED" || request_status === "COMPLETED" || request_status === "PAID"){ 
                let anyAcceptedQuotes = maintenanceQuotesForItem.some(quote => quote.quote_status === "ACCEPTED" || quote.quote_status === "SCHEDULED" || quote.quote_status === "FINISHED") // check that there is at least one accepted quote
                if (!anyAcceptedQuotes) {
                    return (
                        <>
                            <Grid item xs={12}>
                                <Typography sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: "24px" }}>Quotes Table</Typography>
                                <Table sx={{ padding: "0px" }}>
                                    {maintenanceQuotesForItem.length > 0 ? (
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={tableCell}>
                                                    <Typography sx={tableHeader}> Business Name </Typography>
                                                </TableCell>
                                                <TableCell sx={tableCell}>
                                                    <Typography sx={tableHeader}> ID </Typography>
                                                </TableCell>
                                                <TableCell sx={tableCell}>
                                                    <Typography sx={tableHeader}> Amount </Typography>
                                                </TableCell>
                                                <TableCell sx={tableCell}>
                                                    <Typography sx={tableHeader}> Status </Typography>
                                                </TableCell>
                                                <TableCell sx={tableCell}>
                                                    <Typography sx={tableHeader}> Date </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                    ) : null}
                                    {maintenanceQuotesForItem.map((quote, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.maint_business_name}</Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.maint_business_uid} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_total_estimate ? quote.quote_total_estimate : "Not Provided"} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_status} </Typography>
                                            </TableCell>
                                            <TableCell sx={tableCell}>
                                                <Typography sx={tableText}> {quote.quote_created_date} </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Table>
                                {maintenanceQuotesForItem.length === 0 ? <Typography sx={tableText}> No quotes have been submitted </Typography> : null}
                            </Grid>
                            <Grid item xs={12}>
                                {request_status === "COMPLETED" ? (
                                    <Typography sx={{color: "#FFFFFF", fontWeight: 900, fontSize: "24px" }}> Property Manager handled this ticket.</Typography>
                                ) : (
                                    <Typography sx={{color: "#FFFFFF", fontWeight: 900, fontSize: "24px" }}> Property Manager is handling this ticket.</Typography>
                                )}
                            </Grid>
                        </>
                    );
                }                
            }
            return (
                <Grid item xs={12}>
                    <Typography sx={{color: "#FFFFFF", fontWeight: 900, fontSize: "24px",}}>Quotes Table</Typography>
                    <Typography sx={tableText}> {maintenanceQuotesForItem.length} Quotes</Typography>
                    <Table sx={{padding: "0px"}}>
                        {maintenanceQuotesForItem.length > 0 ? (
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableCell}>
                                        <Typography sx={tableHeader}> Business Name </Typography>
                                    </TableCell>
                                    <TableCell sx={tableCell}>
                                        <Typography sx={tableHeader}> ID </Typography>
                                    </TableCell>
                                    <TableCell sx={tableCell}>
                                        <Typography sx={tableHeader}> Amount </Typography>
                                    </TableCell>
                                    <TableCell sx={tableCell}>
                                        <Typography sx={tableHeader}> Status </Typography>
                                    </TableCell>
                                    <TableCell sx={tableCell}>
                                        <Typography sx={tableHeader}> Date </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        ) : null}
                        {maintenanceQuotesForItem.map((quote, index) => (
                            <TableRow key={index}>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableText}> {quote.maint_business_name}</Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableText}> {quote.maint_business_uid} </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableText}> {quote.quote_total_estimate ? quote.quote_total_estimate : "Not Provided"} </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableText}> {quote.quote_status} </Typography>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    <Typography sx={tableText}> {quote.quote_created_date} </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                    {maintenanceQuotesForItem.length === 0 ? <Typography sx={tableText}> No quotes have been submitted </Typography> : null}
                </Grid>
            )
        }
    }
}
    
    // else{
    //     return (
    //         <Grid item xs={12}>
    //             <Typography sx={{color: "#FFFFFF", fontWeight: 900, fontSize: "24px",}}>Quotes Table</Typography>
    //             <Typography sx={tableText}> {maintenanceQuotesForItem.length} Quotes</Typography>
    //             <Typography sx={tableText}> No quotes have been requested yet. </Typography>
    //         </Grid>
    //     )
    // }
