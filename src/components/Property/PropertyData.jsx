// import React, { useState, useEffect } from 'react';
// import { get, post } from "../utils/api";
// import {
//     days,
//     descendingComparator as descendingComparator,
//     getComparator as getComparator,
//     stableSort as stableSort,
// } from "../utils/helper";

// const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5MDk5MjQ1NiwianRpIjoiMDlkNjNmM2UtNWJhMC00Yzc3LWIwZWMtYWU0NjBmNGFkZWI3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwODIiLCJmaXJzdF9uYW1lIjoiUHJpeWFua2EiLCJsYXN0X25hbWUiOiJDb3JuZWxpdXMiLCJwaG9uZV9udW1iZXIiOiIoNDA4KSAzNTUtODI3NyIsImVtYWlsIjoicHJpeWFua2EwMWNvcm5lbGl1c0BnbWFpbC5jb20iLCJyb2xlIjoiT1dORVIsVEVOQU5ULE1BTkFHRVIsTUFJTlRfRU1QTE9ZRUUsUE1fRU1QTE9ZRUUiLCJnb29nbGVfYXV0aF90b2tlbiI6InlhMjkuYTBBYlZiWTZONjZSeTNVR2FGczFPMkRpNUYzdUFPTl9ndEJNZ1lVTHU4VFp2bGw3SXk4RWJJNGRNYW9yczRyMTNINjV0dVN0M3pSQTV0WnFOVVkwZHk0cFRaODhzYzAxUkw2VWpvZUZ4QXZGM0dsN1U1Qk1MQ3BiR3IwZEpvdG9WdV9kUnlRalFSODQza0YtMnpZUjlfeXpEQTA2UlNyX2N1YUNnWUtBV1VTQVJBU0ZRRldLdlBsYV9UTWtxbHctVENKZ1NpRTFJaFZ6dzAxNjciLCJidXNpbmVzc2VzIjpbeyJidXNpbmVzc191aWQiOiI2MDAtMDAwMDE5IiwiYnVzaW5lc3NfdHlwZSI6Ik1BTkFHRU1FTlQiLCJidXNpbmVzc19uYW1lIjoiUHJpeWFua2EgTWFuYWdlbWVudCBCdXNpbmVzcyIsImJ1c2luZXNzX3Bob25lX251bWJlciI6Iig0MDgpIDM1NS04Mjc3IiwiYnVzaW5lc3NfZW1haWwiOiJwcml5YW5rYTAxY29ybmVsaXVzQGdtYWlsLmNvbSIsImJ1c2luZXNzX2Vpbl9udW1iZXIiOiIxMjMiLCJidXNpbmVzc19zZXJ2aWNlc19mZWVzIjoiW3tcIm9mXCI6IFwiR3Jvc3MgUmVudFwiLCBcImNoYXJnZVwiOiBcIjUlXCIsIFwiZmVlX25hbWVcIjogXCJTZXJ2aWNlIGNoYXJnZVwiLCBcImZlZV90eXBlXCI6IFwiJFwiLCBcImZyZXF1ZW5jeVwiOiBcIldlZWtseVwifV0iLCJidXNpbmVzc19sb2NhdGlvbnMiOiJbe1wiZGlzdGFuY2VcIjogXCIxMFwiLCBcImxvY2F0aW9uXCI6IFwiU2FuIEpvc2VcIn1dIiwiYnVzaW5lc3NfcGF5cGFsIjpudWxsLCJidXNpbmVzc19hcHBsZV9wYXkiOm51bGwsImJ1c2luZXNzX3plbGxlIjoicHJpeWFua2EwMWNvcm5lbGl1c0BnbWFpbC5jb20iLCJidXNpbmVzc192ZW5tbyI6bnVsbCwiYnVzaW5lc3NfYWNjb3VudF9udW1iZXIiOm51bGwsImJ1c2luZXNzX3JvdXRpbmdfbnVtYmVyIjpudWxsLCJidXNpbmVzc19kb2N1bWVudHMiOiJbXSIsImVtcGxveWVlX3JvbGUiOiJPd25lciJ9LHsiYnVzaW5lc3NfdWlkIjoiNjAwLTAwMDAwMiIsImJ1c2luZXNzX3R5cGUiOiJNQUlOVEVOQU5DRSIsImJ1c2luZXNzX25hbWUiOiJBSyBNYWludGVuYW5jZSIsImJ1c2luZXNzX3Bob25lX251bWJlciI6IjIxMzg1ODEzNDQiLCJidXNpbmVzc19lbWFpbCI6ImFudS5zYW5kaHU3ODkzQGdtYWlsLmNvbSIsImJ1c2luZXNzX2Vpbl9udW1iZXIiOiI3NC01NzU0NzQ1IiwiYnVzaW5lc3Nfc2VydmljZXNfZmVlcyI6Ilt7XCJwZXJcIjogXCJIb3VyXCIsIFwiY2hhcmdlXCI6IFwiMTAwXCIsIFwic2VydmljZV9uYW1lXCI6IFwiUGFpbnRpbmcgU2VydmljZXNcIn0sIHtcInBlclwiOiBcIkhvdXJcIiwgXCJjaGFyZ2VcIjogXCIxNTBcIiwgXCJzZXJ2aWNlX25hbWVcIjogXCJQbHVtYmluZyBTZXJ2aWNlc1wifV0iLCJidXNpbmVzc19sb2NhdGlvbnMiOiJbe1wiZGlzdGFuY2VcIjogXCIxMFwiLCBcImxvY2F0aW9uXCI6IFwiTG9uZyBCZWFjaCwgQ0FcIn1dIiwiYnVzaW5lc3NfcGF5cGFsIjoiYWtvd25lciIsImJ1c2luZXNzX2FwcGxlX3BheSI6bnVsbCwiYnVzaW5lc3NfemVsbGUiOm51bGwsImJ1c2luZXNzX3Zlbm1vIjoiYWttYWludCIsImJ1c2luZXNzX2FjY291bnRfbnVtYmVyIjpudWxsLCJidXNpbmVzc19yb3V0aW5nX251bWJlciI6bnVsbCwiYnVzaW5lc3NfZG9jdW1lbnRzIjoiW10iLCJlbXBsb3llZV9yb2xlIjoibWFpbnRlbmFuY2UifSx7ImJ1c2luZXNzX3VpZCI6IjYwMC0wMDAwMDEiLCJidXNpbmVzc190eXBlIjoiTUFOQUdFTUVOVCIsImJ1c2luZXNzX25hbWUiOiJBSyBNYW5hZ2VtZW50IiwiYnVzaW5lc3NfcGhvbmVfbnVtYmVyIjoiMjEzODU4MTM0NCIsImJ1c2luZXNzX2VtYWlsIjoiYW51LnNhbmRodTc4OTNAZ21haWwuY29tIiwiYnVzaW5lc3NfZWluX251bWJlciI6IjEyLTEyMzQ1NjciLCJidXNpbmVzc19zZXJ2aWNlc19mZWVzIjoiW3tcIm9mXCI6IFwiR3Jvc3MgUmVudFwiLCBcImNoYXJnZVwiOiBcIjVcIiwgXCJmZWVfbmFtZVwiOiBcIlNDXCIsIFwiZmVlX3R5cGVcIjogXCIlXCIsIFwiZnJlcXVlbmN5XCI6IFwiTW9udGhseVwifSwge1wib2ZcIjogXCJHcm9zcyBSZW50XCIsIFwiY2hhcmdlXCI6IFwiNzUwXCIsIFwiZmVlX25hbWVcIjogXCJSZW5ld2FsIEZlZVwiLCBcImZlZV90eXBlXCI6IFwiJFwiLCBcImZyZXF1ZW5jeVwiOiBcIkFubnVhbGx5XCJ9XSIsImJ1c2luZXNzX2xvY2F0aW9ucyI6Ilt7XCJkaXN0YW5jZVwiOiBcIjE1XCIsIFwibG9jYXRpb25cIjogXCJMb25nIEJlYWNoLCBDQVwifV0iLCJidXNpbmVzc19wYXlwYWwiOiJha21nbXQiLCJidXNpbmVzc19hcHBsZV9wYXkiOiJha21nbXQiLCJidXNpbmVzc196ZWxsZSI6ImFrbWdtdCIsImJ1c2luZXNzX3Zlbm1vIjoiYWttZ210IiwiYnVzaW5lc3NfYWNjb3VudF9udW1iZXIiOiIxMjM0NTY3OTgiLCJidXNpbmVzc19yb3V0aW5nX251bWJlciI6IjIyMzQ1NyIsImJ1c2luZXNzX2RvY3VtZW50cyI6Ilt7XCJsaW5rXCI6IFwiaHR0cHM6Ly9zMy11cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9pby1wbS9idXNpbmVzc2VzLzYwMC0wMDAwMDEvZG9jXzBcIiwgXCJuYW1lXCI6IFwiYmFjay5wZGZcIiwgXCJzaGFyZWRcIjogZmFsc2UsIFwiZGVzY3JpcHRpb25cIjogXCJ0ZXN0XCIsIFwiY3JlYXRlZF9kYXRlXCI6IFwiMjAyMy0wMy0yM1wifV0iLCJlbXBsb3llZV9yb2xlIjoiZW1wbG95ZWUifV0sInRlbmFudF9pZCI6W3sidGVuYW50X2lkIjoiMzUwLTAwMDA1MiJ9XX0sIm5iZiI6MTY5MDk5MjQ1NiwiZXhwIjoxNjkwOTk2MDU2fQ.voFwr8nKIVJifqRRxHbmLoZhXhIFJ_CfWFSd8CcTWeM';
// const PropertyData = (props) => {
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
//         props.setPropertyList(response.result)
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
// export default PropertyData;
