import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { getStatusColor } from "./propertyRentFunctions";
import theme from "../../theme/theme";
import { useNavigate } from "react-router";

function PropertyRentAccordionCard(props) {
    const ownerData = props.ownerData;
    const [index, property, amount] = props.data;
    const navigate = useNavigate();
    function navigateTo(url, index) {
        navigate(url, {
            state:
            {
                index: index,
                data: ownerData
            }
        });
    }
    return (
        <div className="property-rent-property-status-card">
            <div className="property-rent-property-status-card-text" onClick={()=>navigateTo("/propertyRentDetail", index)}>
                {property}
            </div>
            <div className="property-rent-property-status-card-amount">
                ${amount}
            </div>
        </div>
    );
}
function PropertyRentAccordion(props) {
    const status = props.status;
    const [ownerData, properties] = props.data;
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
                    {properties.length}
                </div>
            </AccordionSummary>
            {properties.map((property, index)=>
                <AccordionDetails>
                    <PropertyRentAccordionCard ownerData={ownerData} data={[index, property.address, property.deposit]} />
                </AccordionDetails>

            )}
        </Accordion>
    );
}

function PropertyRentAccordionView(props) {
    const ownerData = props.data;
    return (
        <div className="property-rent-property-status-container">
            <PropertyRentAccordion status={"Not Paid"} data={[ownerData, ownerData]}/>
            <PropertyRentAccordion status={"Paid Partially"} data={[ownerData, ownerData]}/>
            <PropertyRentAccordion status={"Paid Late"} data={[ownerData, ownerData]}/>
            <PropertyRentAccordion status={"Paid on Time"} data={[ownerData, ownerData]}/>
            <PropertyRentAccordion status={"Vacant"} data={[ownerData, ownerData]}/>
        </div>
    );
}
export default PropertyRentAccordionView;