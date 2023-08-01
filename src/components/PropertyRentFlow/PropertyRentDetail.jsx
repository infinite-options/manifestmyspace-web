import { useState } from "react";
import "../../css/propertyRent.css";
import { getStatusColor } from "../utils/propertyRentFunctions";

function PropertyRentDetail() {
    const [propertyStatus, setPropertyStatus] = useState("Not Paid");
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
            <div className="property-rent-detail-container">
                <div className="property-rent-detail-navbar-box">
                    <div className="property-rent-detail-navbar">
                        <div className="property-rent-detail-navbar-np" style={{ backgroundColor: getStatusColor("Not Paid") }} onClick={()=>setPropertyStatus("Not Paid")}/>
                        <div className="property-rent-detail-navbar-pp" style={{ backgroundColor: getStatusColor("Paid Partially") }} onClick={()=>setPropertyStatus("Paid Partially")}/>
                        <div className="property-rent-detail-navbar-pl" style={{ backgroundColor: getStatusColor("Paid Late") }} onClick={()=>setPropertyStatus("Paid Late")}/>
                        <div className="property-rent-detail-navbar-pot" style={{ backgroundColor: getStatusColor("Paid On Time") }} onClick={()=>setPropertyStatus("Paid On Time")}/>
                        <div className="property-rent-detail-navbar-v" style={{ backgroundColor: getStatusColor("Vacant") }} onClick={()=>setPropertyStatus("Vacant")}/>
                    </div>
                </div>
                <div className="property-rent-detail-background">
                    <div className="property-rent-detail-status-indicator" style={{backgroundColor:getStatusColor(propertyStatus)}}/>
                    <div className="property-rent-detail-selector-container">
                        <div className="property-rent-detail-selector-icon-left">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z" fill="#160449" />
                            </svg>
                        </div>
                        <div className="property-rent-detail-selector-icon-text">
                            1 Of 3 Not Paid
                        </div>
                        <div className="property-rent-detail-selector-icon-right">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z" fill="#160449" />
                            </svg>
                        </div>
                    </div>
                    <div className="property-rent-detail-info-container">
                        <div className="property-rent-detail-image">
                            
                        </div>
                        <div className="property-rent-detail-info-text-container">
                            <div className="property-rent-detail-info-text-title">
                                103 N. Abel St, Milpitas CA 95035
                            </div>
                            <div className="property-rent-detail-info-text-description">
                                $2300
                                due 07/02/2022
                                11 Days Overdue
                            </div>
                        </div>
                    </div>
                    <div className="property-rent-detail-table-container">
                        <div className="property-rent-detail-table-title">
                            Rent History
                        </div>
                        <div className="property-rent-detail-table-contents">
                            <table>
                                <tr style={{ "border-bottom": "1px solid #3D5CAC" }}>
                                    <th>
                                        Month
                                    </th>
                                    <th>
                                        Paid
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Rent Status
                                    </th>
                                    <th>
                                        Fees
                                    </th>
                                </tr>
                                <PropertyRow data={["MAR", "-", "-", "Not Paid", ""]} />
                                <PropertyRow data={["FEB", "02/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["JAN", "01/10", "$2300", "Paid Late", "+$200"]} />
                                <PropertyRow data={["DEC", "12/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["NOV", "11/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["OCT", "10/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["SEP", "09/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["AUG", "08/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["JUL", "07/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["JUN", "06/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["MAY", "05/05", "$2300", "Paid On Time", ""]} />
                                <PropertyRow data={["APR", "04/05", "$2300", "Paid On Time", ""]} />
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyStatus(props) {
    const status = props.data;
    const color = getStatusColor(status);
    return (
        <div className="property-rent-detail-table-contents-status" style={{ backgroundColor: color }}>
            {status}
        </div>
    );
}

function PropertyRow(props) {
    const [month, paid, amount, status, fees] = props.data;

    return (
        <tr>
            <td>
                {month}
            </td>
            <td>
                {paid}
            </td>
            <td>
                {amount}
            </td>
            <td>
                <PropertyStatus data={status} />
            </td>
            <td>
                {fees}
            </td>
        </tr>
    );

}

export default PropertyRentDetail;