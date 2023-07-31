import "../../css/propertyRent.css";

function PropertyRentDetail() {
    return (
        <div className="property-rent-container">
            <div className="property-rent-title-container">
                <div className="property-rent-title-emptybox">

                </div>
                <div className="property-rent-title-text">
                    Property Rent
                </div>
                <div className="property-rent-title-add">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L9 16" stroke="#160449" stroke-width="3" stroke-linecap="round" />
                        <path d="M16 9L2 9" stroke="#160449" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
            <div className="property-rent-subtext-container">
                <div className="property-rent-detail-subtext">
                    <div className="property-rent-subtext-select-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z" fill="#3D5CAC" />
                        </svg>
                    </div>
                    Return to Viewing All Listings
                </div>
            </div>
            <div className="property-rent-all-property">
                View All 63 Properties
            </div>
            <div className="property-rent-property-status-container">
                <div className="property-rent-property-status-type">
                    Not Paid
                </div>
                <div className="property-rent-property-status-type">
                    Paid Partially
                </div>
                <div className="property-rent-property-status-type">
                    Paid Late
                </div>
                <div className="property-rent-property-status-type">
                    Paid on Time
                </div>
                <div className="property-rent-property-status-type">
                    Vacant
                </div>
            </div>

        </div>
    );
}

export default PropertyRentDetail;