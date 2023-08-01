import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getStatusColor } from "../utils/propertyRentFunctions";
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
    const [id] = props.property;
    return (
        <Accordion style={{backgroundColor:getStatusColor(status), "font-family": 'Source Sans Pro', color: "#FFFFFF"}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                {status}
            </AccordionSummary>
            <AccordionDetails>
                <PropertyRentAccordionCard data={["103 N. Abel St, Milpitas CA 95035", "$2300"]}/>
            </AccordionDetails>
            <AccordionDetails>
                <PropertyRentAccordionCard data={["104 N. Abel St, Milpitas CA 95035", "$2400"]}/>
            </AccordionDetails>
        </Accordion>
    );
}

function PropertyRentAccordionView(props) {
    return (
        <div className="property-rent-property-status-container">
            <PropertyRentAccordion status={["Not Paid"]} property={["panel1a-header"]} />
            <PropertyRentAccordion status={["Paid Partially"]} property={["panel2a-header"]} />
            <PropertyRentAccordion status={["Paid Late"]} property={["panel2a-header"]} />
            <PropertyRentAccordion status={["Paid on Time"]} property={["panel2a-header"]} />
            <PropertyRentAccordion status={["Vacant"]} property={["panel3a-header"]} />
        </div>
    );
}
export default PropertyRentAccordionView;