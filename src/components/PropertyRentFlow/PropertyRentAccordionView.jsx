import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function PropertyRentAccordion(props) {
    const [status] = props.status;
    const [id] = props.property;
    return (
        <div className="property-rent-property-status-type">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>{status}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    1Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
                <AccordionDetails>
                    2Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </Accordion>
        </div>

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