import { useEffect, useState } from "react";
import "../../css/propertyRent.css";
import PropertyRentAccordionView from "./PropertyRentAccordionView";
import axios from "axios";

function PropertyRentFlow() {
    const [ownerData, setOwnerData] = useState([]);
    
    useEffect(() => {
        const requestURL = "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/ownerDashboard";
        const config = {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5MDk1NDYxMywianRpIjoiZThiYjljN2EtM2I4NS00N2I0LTgwNjAtN2FhYWEwN2I0NmY3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwOTAiLCJmaXJzdF9uYW1lIjoiSmluc2VvayIsImxhc3RfbmFtZSI6IkhlbyIsInBob25lX251bWJlciI6Iig2NTApIDc3Mi04MDg3IiwiZW1haWwiOm51bGwsInJvbGUiOiJNQU5BR0VSLFRFTkFOVCxNQUlOVEVOQU5DRSxPV05FUiIsImdvb2dsZV9hdXRoX3Rva2VuIjoieWEyOS5hMEFiVmJZNlBGa3ZXaXpxYjNJQWhqMmxvTlBxd0pUZnVjRWVwQV9NYWNIbXBzNkZLcjBBR3RzUGg2ZWhmUC1nVlRDQkhMRWhsTHB6X0xUQXFRTkV5SVQ3Q2RobUhXV3lqMW9rS3piVC0zR0toTlkydFhhU0llMDVPeFZfcUNqZHZPOTlYQ2RSeDFaU1hLU0pIZlhnbldMYUZmZmw1LWFDZ1lLQWNvU0FSRVNGUUZXS3ZQbFZFR0xSM3NjdjBqYUVSX3NsNkdVLWcwMTYzIiwiYnVzaW5lc3NlcyI6W3siYnVzaW5lc3NfdWlkIjoiNjAwLTAwMDAyMCIsImJ1c2luZXNzX3R5cGUiOiJNQU5BR0VNRU5UIiwiYnVzaW5lc3NfbmFtZSI6IkppbnNlb2sgUHJvcGVydHkgTWFuYWdlbWVudCIsImJ1c2luZXNzX3Bob25lX251bWJlciI6Iig2NTApIDc3Mi04MDg3IiwiYnVzaW5lc3NfZW1haWwiOiJnZW5pZS5oMUBnbWFpbC5jb20iLCJidXNpbmVzc19laW5fbnVtYmVyIjoiNTYtMTIzNDU2IiwiYnVzaW5lc3Nfc2VydmljZXNfZmVlcyI6Ilt7XCJvZlwiOiBcIkdyb3NzIFJlbnRcIiwgXCJjaGFyZ2VcIjogXCIxNSVcIiwgXCJmZWVfbmFtZVwiOiBcIlNlcnZpY2UgQ2hhcmdlXCIsIFwiZmVlX3R5cGVcIjogXCIlXCIsIFwiZnJlcXVlbmN5XCI6IFwiTW9udGhseVwifV0iLCJidXNpbmVzc19sb2NhdGlvbnMiOiJbe1wiZGlzdGFuY2VcIjogXCIxNVwiLCBcImxvY2F0aW9uXCI6IFwiU3Vubnl2YWxlXCJ9XSIsImJ1c2luZXNzX3BheXBhbCI6ImdlbmllLmgxQGdtYWlsLmNvbSIsImJ1c2luZXNzX2FwcGxlX3BheSI6bnVsbCwiYnVzaW5lc3NfemVsbGUiOm51bGwsImJ1c2luZXNzX3Zlbm1vIjpudWxsLCJidXNpbmVzc19hY2NvdW50X251bWJlciI6bnVsbCwiYnVzaW5lc3Nfcm91dGluZ19udW1iZXIiOm51bGwsImJ1c2luZXNzX2RvY3VtZW50cyI6IltdIiwiZW1wbG95ZWVfcm9sZSI6Ik93bmVyIn0seyJidXNpbmVzc191aWQiOiI2MDAtMDAwMDIxIiwiYnVzaW5lc3NfdHlwZSI6Ik1BSU5URU5BTkNFIiwiYnVzaW5lc3NfbmFtZSI6IkppbnNlb2sgTWFpbnRlbmFuY2UiLCJidXNpbmVzc19waG9uZV9udW1iZXIiOiIoNjUwKSA3NzItODA4NyIsImJ1c2luZXNzX2VtYWlsIjoiZ2VuaWUuaDFAZ21haWwuY29tIiwiYnVzaW5lc3NfZWluX251bWJlciI6IjU2LTEyMzQ1NiIsImJ1c2luZXNzX3NlcnZpY2VzX2ZlZXMiOiJbe1wicGVyXCI6IFwiSG91clwiLCBcImNoYXJnZVwiOiBcIjEwMFwiLCBcImV2ZW50X3R5cGVcIjogXCIxIEhvdXIgSm9iXCIsIFwic2VydmljZV9uYW1lXCI6IFwiRWxlY3RyaWNpdHlcIiwgXCJ0b3RhbF9lc3RpbWF0ZVwiOiAxMDB9XSIsImJ1c2luZXNzX2xvY2F0aW9ucyI6Ilt7XCJkaXN0YW5jZVwiOiBcIjE1XCIsIFwibG9jYXRpb25cIjogXCJTdW5ueXZhbGVcIn1dIiwiYnVzaW5lc3NfcGF5cGFsIjoiZ2VuaWUuaDFAZ21haWwuY29tIiwiYnVzaW5lc3NfYXBwbGVfcGF5IjpudWxsLCJidXNpbmVzc196ZWxsZSI6ImdlbmllLmgxQGdtYWlsLmNvbSIsImJ1c2luZXNzX3Zlbm1vIjoiZ2VuaWUuaDFAZ21haWwuY29tIiwiYnVzaW5lc3NfYWNjb3VudF9udW1iZXIiOm51bGwsImJ1c2luZXNzX3JvdXRpbmdfbnVtYmVyIjpudWxsLCJidXNpbmVzc19kb2N1bWVudHMiOiJbXSIsImVtcGxveWVlX3JvbGUiOiJPd25lciJ9XSwidGVuYW50X2lkIjpbeyJ0ZW5hbnRfaWQiOiIzNTAtMDAwMDUzIn1dfSwibmJmIjoxNjkwOTU0NjEzLCJleHAiOjE2OTA5NTgyMTN9.bJt4fdjF0uzwAduIZf5fn_y1AZ2TehTMJvGqQVExSqc"
            }
        }
        axios.get(requestURL, config).then(res => {
            //console.log("Owner Dashboard: ", res.data.result);
            setOwnerData(res.data.result);
        });
    }, []);
    return (
        <div className="property-rent-container">
            <div className="property-rent-title-container">
                <div className="property-rent-title-emptybox" />
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
                <div className="property-rent-subtext-days">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3.125" y="6.25" width="18.75" height="15.625" rx="2" stroke="#3D5CAC" stroke-width="2" />
                        <path d="M3.125 10.25C3.125 8.36438 3.125 7.42157 3.71079 6.83579C4.29657 6.25 5.23938 6.25 7.125 6.25H17.875C19.7606 6.25 20.7034 6.25 21.2892 6.83579C21.875 7.42157 21.875 8.36438 21.875 10.25V10.4167H3.125V10.25Z" fill="#3D5CAC" />
                        <path d="M7.29166 3.125L7.29166 6.25" stroke="#3D5CAC" stroke-width="2" stroke-linecap="round" />
                        <path d="M17.7083 3.125L17.7083 6.25" stroke="#3D5CAC" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Last 30 Days
                </div>
                <div className="property-rent-subtext-select">
                    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.49423 10.97C5.20833 11.6165 5.20833 12.3519 5.20833 13.8228V18.4166C5.20833 20.4594 5.20833 21.4807 5.81852 22.1153C6.37694 22.6961 7.24682 22.7454 8.89583 22.7495V17.3333C8.89583 16.2201 9.77331 15.25 10.9375 15.25H14.0625C15.2267 15.25 16.1042 16.2201 16.1042 17.3333V22.7495C17.7532 22.7454 18.6231 22.6961 19.1815 22.1153C19.7917 21.4807 19.7917 20.4594 19.7917 18.4166V13.8228C19.7917 12.3519 19.7917 11.6165 19.5058 10.97C19.2199 10.3236 18.6829 9.84493 17.6091 8.88768L16.5674 7.9591C14.6265 6.22888 13.656 5.36377 12.5 5.36377C11.344 5.36377 10.3735 6.22888 8.43255 7.9591L7.39088 8.88768C6.31704 9.84493 5.78012 10.3236 5.49423 10.97ZM14.1042 22.7499V17.3333C14.1042 17.2974 14.091 17.2737 14.0782 17.2604C14.0719 17.2538 14.067 17.2512 14.0653 17.2505L14.0652 17.2504C14.0644 17.2501 14.0642 17.25 14.0625 17.25H10.9375C10.9358 17.25 10.9355 17.2501 10.9348 17.2504L10.9347 17.2505C10.933 17.2512 10.9281 17.2538 10.9218 17.2604C10.909 17.2737 10.8958 17.2974 10.8958 17.3333V22.7499H14.1042Z" fill="#3D5CAC" />
                    </svg>
                    Select Property
                </div>
            </div>
            <div className="property-rent-all-property">
                View All {ownerData.length} Properties
            </div>
            <PropertyRentAccordionView data={ownerData} />

        </div>
    );
}

export default PropertyRentFlow;