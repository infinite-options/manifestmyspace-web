import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from "./Cashflow/CashflowOwner";
// import Footer from './Footer';
import SelectMonthComponent from "./SelectMonthComponent";
import PropertyData from "./Property/PropertyData";
import AddExpense from "./Cashflow/AddExpense";
import AddRevenue from "./Cashflow/AddRevenue";
import AddUtility from "./Cashflow/AddUtility";
import ViewLease from "./Leases/ViewLease";
import EditLease from "./Leases/EditLease";
import LeasePDF from "./Leases/LeasePDF";
import FindProperty from "./Property/FindProperty";

import MaintenanceWidjet from "./MaintenanceWidget";

import Announcement from "./Announcement/Announcement";
import TenantDoucments from "./Documents/TenantDocuments/TenantDocuments";
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

import ViewTransactionOwner from "./Transactions/ViewTransactionOwner";
import PaymentsTenant from "./Payments/PaymentsTenant";
import TransactionHistory from "./Transactions/TransactionHistory";
import CardDetails from "./Payments/CardDetails";
import CashflowManager from "./Cashflow/CashflowManager";
import ManagerDashboard from "./Cashflow/ManagerDashboard";
import Settings from "./Settings/SeetingsOwner";

function Main() {
  return (
    <>
      <div>
        <Header></Header>
        <Router>
          <Routes>
            <Route exact path="/dashboard" element={<MaintenanceWidjet />} />
            <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
            <Route exact path="/properties" element={<PropertyData />} />
            <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
            <Route exact path="/addExpense" element={<AddExpense />} />
            <Route exact path="/addRevenue" element={<AddRevenue />} />
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

            <Route exact path="/tenantDocuments" element={<TenantDoucments />} />
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

            <Route exact path="/transactionHistory" element={<TransactionHistory />} />
            <Route exact path="/viewTransactionOwner" element={<ViewTransactionOwner />} />
            <Route exact path="/paymentsTenant" element={<PaymentsTenant />} />
            <Route exact path="/card" element={<CardDetails />} />
            <Route exact path="/cashflowManager" element={<CashflowManager />} />
            <Route exact path="/managerDashboard" element={<ManagerDashboard />} />
            <Route exact path="/settingsOwner" element={<Settings />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
export default Main;
