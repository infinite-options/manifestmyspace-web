import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from './Cashflow/CashflowOwner';
// import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidjet from './MaintenanceWidget';
import PropertyList from "./Property/PropertyList";
import AddExpense from "./Cashflow/AddExpense";
import PropertyRentFlow from "./PropertyRentFlow/PropertyRentFlow";
import PropertyRentDetail from "./PropertyRentFlow/PropertyRentDetail";

import Announcement from "./Announcement/Announcement";
import TenantDoucments from "./Documents/TenantDocuments/TenantDocuments";
import TenantProfile from "./Profile/TenantProfile/TenantProfile";
import TenantDashboard from "./TenantDashboard/TenantDashboard";

import OwnerDocuments from "./Documents/OwnerDocuments/OwnerDocuments";
import OwnerLeases from "./Leases/OwnerLeases/OwnerLeases";
import OwnerProfile from "./Profile/OwnerProfile/OwnerProfile";

import PMProfile from "./Profile/PMProfile/PMProfile";
import PMLeases from "./Leases/PMLeases/PMLeases";
import PMContracts from "./Contracts/PMContracts/PMContracts";
import PMDocuments from "./Documents/PMDocuments/PMDocuments";
function Main() {
    return (
        <>
            <div>
                <Header></Header>
                <Router>
                    <Routes>
                        <Route exact path="/dashboard" element={<MaintenanceWidjet />} />
                        <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
                        <Route exact path="/properties" element={<PropertyList />} />
                        <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
                        <Route exact path="/addExpense" element={<AddExpense />} />
                        <Route exact path="/propertyRent" element={<PropertyRentFlow />} />
                        <Route exact path="/propertyRentDetail" element={<PropertyRentDetail />} />

                        <Route exact path="/announcement" element={<Announcement />} />
                        <Route exact path="/ownerProfile" element={<OwnerProfile />} />
                        <Route exact path="/ownerDocuments" element={<OwnerDocuments />} />
                        <Route exact path="/ownerLeases" element={<OwnerLeases />} />

                        <Route exact path="/tenantDocuments" element={<TenantDoucments />} />
                        <Route exact path="/tenantProfile" element={<TenantProfile />} />
                        <Route exact path="/tenantDashboard" element={<TenantDashboard />} />

                        <Route exact path="/pmProfile" element={<PMProfile />} />
                        <Route exact path="/pmLeases" element={<PMLeases />} />
                        <Route exact path="/pmContracts" element={<PMContracts />} />
                        <Route exact path="/pmDocuments" element={<PMDocuments />} />
                    </Routes>
                </Router>
            </div>
        </>

    )
}

export default Main;