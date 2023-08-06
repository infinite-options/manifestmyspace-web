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
import Announcement from "./Announcement/Announcement"
import Profile from "./Profile/Profile";
import Documents from "./Documents/Documents";
import Leases from "./Leases/Leases";
import TenantDoucments from "./Documents/TenantDocuments/TenantDocuments";
import TenantProfile from "./Profile/TenantProfile/TenantProfile";
function Main(){
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
              <Route exact path="/addExpense" element={<AddExpense/>}/>
              <Route exact path="/announcement" element={<Announcement />} />
              <Route exact path="/propertyRent" element={<PropertyRentFlow />} />
              <Route exact path="/propertyRentDetail" element={<PropertyRentDetail />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/documents" element={<Documents />} />
              <Route exact path="/leases" element={<Leases />} />
              <Route exact path="/tenantDocuments" element={<TenantDoucments />} />
              <Route exact path="/tenantProfile" element={<TenantProfile />} />
            </Routes>
            </Router>
            </div>
        </>

    )
}

export default Main;