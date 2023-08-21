import React from "react";
import Header from "./Header";
// import Footer from './Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CashflowOwner from "./Cashflow/CashflowOwner";

import SelectMonthComponent from "./SelectMonthComponent";
import PropertyList from "./Property/PropertyList";

import AddExpense from "./Cashflow/AddExpense";
import AddRevenue from "./Cashflow/AddRevenue";
import AddUtility from "./Cashflow/AddUtility";

import ViewLease from "./Leases/ViewLease";
import EditLease from "./Leases/EditLease";
import LeasePDF from "./Leases/LeasePDF";
import FindProperty from "./Property/FindProperty";
import PropertyInfo from "./Property/PropertyInfo";

import MaintenanceWidget from "./MaintenanceWidget";
import TenantDocuments from "./Documents/TenantDocuments/TenantDocuments";
import Announcement from "./Announcement/Announcement";
import TenantProfile from "./Profile/TenantProfile/TenantProfile";
import TenantDashboard from "./TenantDashboard/TenantDashboard";
import TenantProfileEdit from "./Profile/TenantProfile/TenantProfileEdit";
import TenantLeases from "./Leases/TenantLeases/TenantLeases";

import OwnerDocuments from "./Documents/OwnerDocuments/OwnerDocuments";
import OwnerUploadDocuments from "./Documents/OwnerDocuments/OwnerUploadDocuments";
import OwnerLeases from "./Leases/OwnerLeases/OwnerLeases";
import OwnerProfile from "./Profile/OwnerProfile/OwnerProfile";
import OwnerRent from "./Rent/OwnerRent/OwnerRent";

import PMProfile from "./Profile/PMProfile/PMProfile";
import PMLeases from "./Leases/PMLeases/PMLeases";
import PMContracts from "./Contracts/PMContracts/PMContracts";
import PMDocuments from "./Documents/PMDocuments/PMDocuments";
import PMUploadDocuments from "./Documents/PMDocuments/PMUploadDocuments";
import OwnerRentDetail from "./Rent/OwnerRent/OwnerRentDetail";
import PMRent from "./Rent/PMRent/PMRent";
import PMRentDetail from "./Rent/PMRent/PMRentDetail";

import Contacts from "./Contacts/Contacts";

function Main() {
  return (
    <>
      <div>
        <Header></Header>
        <Router>
          <Routes>
            <Route exact path="/dashboard" element={<MaintenanceWidget />} />
            <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
            <Route exact path="/properties" element={<PropertyList />} />
            <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
            <Route exact path="/addExpense" element={<AddExpense />} />
            <Route exact path="/addRevenue" element={<AddRevenue />} />
            <Route exact path="/propertyRent" element={<PropertyRentFlow />} />
            <Route exact path="/propertyRentDetail" element={<PropertyRentDetail />} />
            <Route exact path="/addUtility" element={<AddUtility />} />
            <Route exact path="/findProperty" element={<FindProperty />} />

            <Route exact path="/viewLease" element={<ViewLease />} />
            <Route exact path="/editLease" element={<EditLease />} />
            <Route exact path="/leaseDocument" element={<LeasePDF />} />

            <Route exact path="/announcement" element={<Announcement />} />
            <Route exact path="/ownerProfile" element={<OwnerProfile />} />
            <Route exact path="/ownerDocuments" element={<OwnerDocuments />} />
            <Route exact path="/ownerUploadDocuments" element={<OwnerUploadDocuments />} />
            <Route exact path="/ownerLeases" element={<OwnerLeases />} />
            <Route exact path="/ownerRent" element={<OwnerRent />} />
            <Route exact path="/ownerRentDetail" element={<OwnerRentDetail />} />

            <Route exact path="/tenantDocuments" element={<TenantDocuments />} />
            <Route exact path="/tenantLeases" element={<TenantLeases />} />
            <Route exact path="/tenantProfile" element={<TenantProfile />} />
            <Route exact path="/tenantProfileEdit" element={<TenantProfileEdit />} />
            <Route exact path="/tenantDashboard" element={<TenantDashboard />} />

            <Route exact path="/pmProfile" element={<PMProfile />} />
            <Route exact path="/pmLeases" element={<PMLeases />} />
            <Route exact path="/pmContracts" element={<PMContracts />} />
            <Route exact path="/pmDocuments" element={<PMDocuments />} />
            <Route exact path="/pmUploadDocuments" element={<PMUploadDocuments />} />
            <Route exact path="/pmRent" element={<PMRent />} />
            <Route exact path="/pmRentDetail" element={<PMRentDetail />} />
            <Route exact path="/propertyInfo" element={<PropertyInfo />} />
            <Route exact path="/contacts" element={<Contacts />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default Main;
