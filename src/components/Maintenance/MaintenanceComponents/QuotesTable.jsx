import {Grid, Accordion, AccordionSummary, AccordionDetails, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function QuotesTable({maintenanceItem, maintenanceQuotes}){
    // maintenanceQuotes is a state variable that is set in the grandparent component
    // maintenanceItem is a prop that is passed from the parent component
    let oneAcceptedQuote = maintenanceQuotes.some(quote => quote.quote_status === "ACCEPTED") // check that there is exactly one quote that has been accepted

    // let allRequestedQuotes = maintenanceQuotes.(quote => quote.quote_status === "REQUESTED") // check that there is exactly one quote that has been accepted

    let request_status = maintenanceItem.maintenance_request_status
    let status = maintenanceItem.maintenance_status

    console.log("QuotesTable maintenanceQuotes", maintenanceQuotes)

    let tableText = {color: "#FFFFFF", fontWeight: 500, fontSize: "16px"}


    if (request_status !== "NEW"){
        
        if (oneAcceptedQuote){
            let acceptedQuote = maintenanceQuotes.find(quote => quote.quote_status === "ACCEPTED") // get the accepted quote (should just be one)
            let otherQuotes = maintenanceQuotes.filter(quote => quote.quote_status !== "ACCEPTED") // get all other quotes
            console.log("acceptedQuote", acceptedQuote)
            return (
                <Grid item xs={12}>
                    <Typography sx={{color: "#FFFFFF", fontWeight: 800, fontSize: "22px"}}>Quotes Table</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography sx={tableText}> Business Id </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={tableText}> Quote Amount </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={tableText}> Quote Status </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={tableText}> Quote Date </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    {/* {acceptedQuotes.map((quote, index) => ( */}
                        <TableRow>
                            <TableCell>
                                <Typography sx={tableText}> {acceptedQuote.quote_business_id} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {acceptedQuote.quote_total_estimate ? "$" + acceptedQuote.quote_total_estimate : "Not Provided"} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {acceptedQuote.quote_status} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {acceptedQuote.quote_created_date} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {acceptedQuote.quote_notes} </Typography>
                            </TableCell>
                        </TableRow>
                    </Table>
                    {/* ))} */}
                        <Accordion
                        sx={{
                            boxShadow: "none",
                        }}
                        >
                            <AccordionSummary sx={{ flexDirection: "row-reverse" }} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                                All other quotes
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    {otherQuotes.map((quote, index) => (
                                        
                                        <TableRow>
                                            <TableCell>
                                                <Typography sx={tableText}> {quote.quote_business_id} </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={tableText}> {quote.quote_total_estimate ? "$" + quote.quote_total_estimate : "Not Provided"} </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={tableText}> {quote.quote_status} </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={tableText}> {quote.quote_created_date} </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={tableText}> {quote.quote_notes} </Typography>
                                            </TableCell>
                                        </TableRow>
                                        
                                    ))}
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                </Grid>
            )
        }
        else {
            return (
                <Grid item xs={12}>
                     <Typography sx={{color: "#FFFFFF", fontWeight: 800, fontSize: "22px"}}>Quotes Table</Typography>
                    {maintenanceQuotes.length > 0 ? (
                         <TableHead>
                         <TableRow>
                             <TableCell>
                                <Typography sx={tableText}> Business ID</Typography>
                             </TableCell>
                             <TableCell>
                                <Typography sx={tableText}> Quote Amount </Typography>
                             </TableCell>
                             <TableCell>
                                <Typography sx={tableText}> Quote Status </Typography>
                             </TableCell>
                             <TableCell>
                                <Typography sx={tableText}> Quote Date </Typography>
                             </TableCell>
                             <TableCell>
                                <Typography sx={tableText}> Quote Notes </Typography>
                             </TableCell>
                         </TableRow>
                     </TableHead>
                    ) : null}
                    {maintenanceQuotes.map((quote, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Typography sx={tableText}> {quote.quote_business_id} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {quote.quote_total_estimate ? quote.quote_total_estimate : "Not Provided"} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {quote.quote_status} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {quote.quote_created_date} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={tableText}> {quote.quote_pm_notes} </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
    
                    {maintenanceQuotes.length === 0 ? <Typography sx={tableText}> No quotes have been submitted </Typography> : null}
                </Grid>
            )
        }
    } else{
        return (
            <Grid item xs={12}>
                <Typography sx={{color: "#FFFFFF", fontWeight: 800, fontSize: "22px"}}>Quotes Table</Typography>
                <Typography sx={tableText}> No quotes have been requested yet. </Typography>
            </Grid>
        )
    }
}