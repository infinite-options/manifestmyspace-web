// import React, { useState, useEffect } from 'react';
// import { get, post } from "../utils/api";
// import {
//     days,
//     descendingComparator as descendingComparator,
//     getComparator as getComparator,
//     stableSort as stableSort,
// } from "../utils/helper";
  
// const PropertyList = () => {
//     const [daysCompleted, setDaysCompleted] = useState("10");

//     const fetchOwnerDashboard = async () => {
//         // if (access_token === null || user.role.indexOf("OWNER") === -1) {
//         //     navigate("/");
//         //     return;
//         // }
//         const response = await get("/ownerDashboard", access_token);
//         console.log("response ", response);
//         if (response.msg === "Token has expired") {
//             // console.log("here msg");
//             // refresh();
//             return;
//         }
    
//         let pu = response.result;
//         pu.forEach((property) => {
//             const forwarded = property.property_manager.filter(
//                 (item) => item.management_status === "FORWARDED"
//             );
//             const sent = property.property_manager.filter(
//                 (item) => item.management_status === "SENT"
//             );
//             const refused = property.property_manager.filter(
//                 (item) => item.management_status === "REFUSED"
//             );
    
//             const pmendearly = property.property_manager.filter(
//                 (item) => item.management_status === "PM END EARLY"
//             );
//             const ownerendearly = property.property_manager.filter(
//                 (item) => item.management_status === "OWNER END EARLY"
//             );
//             property.management = {
//                 forwarded: forwarded.length,
//                 sent: sent.length,
//                 refused: refused.length,
//                 pmendearly: pmendearly.length,
//                 ownerendearly: ownerendearly.length,
//             };
//         });
//         // console.log(pu);
//         // setOwnerData(pu);
    
//         let requests = [];
//         if (parseInt(daysCompleted) >= 0) {
//             response.result.forEach((res) => {
//                 if (res.maintenanceRequests.length > 0) {
//                     res.maintenanceRequests.forEach((mr) => {
//                         if (
//                             days(new Date(mr.request_closed_date), new Date()) >=
//                             parseInt(daysCompleted) &&
//                             mr.request_status === "COMPLETED"
//                         ) {
//                         } else {
//                             requests.push(mr);
//                         }
//                     });
//                 }
//             });
//         } else {
//             response.result.forEach((res) => {
//                 if (res.maintenanceRequests.length > 0) {
//                     res.maintenanceRequests.forEach((mr) => {
//                         requests.push(mr);
//                     });
//                 }
//             });
//         }
    
//         // setMaintenanceRequests(requests);
//         // setIsLoading(false);
//     };
    
//     useEffect(() => {
//         fetchOwnerDashboard();
//     }, [access_token]);

//     return (
//         <>
            
//         </>
//     )
// }
// export default PropertyList;