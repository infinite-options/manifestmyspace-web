import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { getStatusColor } from "../utils/propertyRentFunctions";
import theme from "../../theme/theme";
import { useState } from "react";
function PropertyRentAccordionCard(props) {
    const [property, amount] = props.data;
    return (
        <div className="property-rent-property-status-card">
            <div className="property-rent-property-status-card-text">
                {property}
            </div>
            <div className="property-rent-property-status-card-amount">
                {amount}
            </div>
        </div>
    );
}
function PropertyRentAccordion(props) {
    const [status] = props.status;
    const [accordionCount, setAccordionCount] = useState(0);
    return (
        <Accordion theme={theme} style={{ backgroundColor: getStatusColor(status), "font-family": 'Source Sans Pro', color: "#FFFFFF"}}>
            <AccordionSummary
                expandIcon={
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F2F2F2" stroke-width="2.5" />
                    </svg>
                }
                className="property-rent-property-status-summary-text-container"
            >
                <div className="property-rent-property-status-summary-text-1">
                    {status}
                </div>
                <div className="property-rent-property-status-summary-text-2">
                    {accordionCount}
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <PropertyRentAccordionCard data={["103 N. Abel St, Milpitas CA 95035", "$2300"]} />
            </AccordionDetails>
            <AccordionDetails>
                <PropertyRentAccordionCard data={["104 N. Abel St, Milpitas CA 95035", "$2400"]} />
            </AccordionDetails>
        </Accordion>
    );
}

function PropertyRentAccordionView(props) {
    return (
        <div className="property-rent-property-status-container">
            <PropertyRentAccordion status={["Not Paid"]} />
            <PropertyRentAccordion status={["Paid Partially"]} />
            <PropertyRentAccordion status={["Paid Late"]} />
            <PropertyRentAccordion status={["Paid on Time"]} />
            <PropertyRentAccordion status={["Vacant"]} />
        </div>
    );
}
export default PropertyRentAccordionView;