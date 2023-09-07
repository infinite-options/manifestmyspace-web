import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import CashflowOwner from "./Cashflow/CashflowOwner";
// import Footer from './Footer';

import SelectMonthComponent from "./SelectMonthComponent";
// import PropertyListData from "./Property/PropertyListData";
import AddExpense from "./Cashflow/AddExpense";
import AddRevenue from "./Cashflow/AddRevenue";
import AddUtility from "./Cashflow/AddUtility";
import ViewLease from "./Leases/ViewLease";
import EditLease from "./Leases/EditLease";
import LeasePDF from "./Leases/LeasePDF";
import FindProperty from "./Property/FindProperty";

import Announcement from "./Announcement/Announcement";
import TenantDocuments from "./Documents/TenantDocuments/TenantDocuments";
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
import Settings from "./Settings/SettingsOwner";

import PropertyInfo from "./Property/PropertyInfo";
import MaintenanceWidget from "./Dashboard-Components/Maintenance/MaintenanceWidget";

import Contacts from "./Contacts/Contacts";
import ContactDetails from "./Contacts/ContactDetails";
import AddContacts from "./Contacts/AddContacts";

import PropertyList from "./Property/PropertyList";
import Dashboard from "./Dashboard";
import Maintenance from "./Maintenance/Maintenance";
import AddMaintenanceItem from "./Maintenance/AddMaintenanceItem";
import MaintenanceRequestDetail from "./Maintenance/MaintenanceRequestDetail";
import AddProperty from "./Property/AddProperty";
import EditProperty from "./Property/EditProperty";
import PropertyDetail from "./Property/PropertyDetail";
import TenantMaintenance from "./Maintenance/TenantMaintenance";
import AddTenantMaintenanceItem from "./Maintenance/AddTenantMaintenanceItem";
import MaintenanceRequestNavigator from "./Maintenance/MaintenanceRequestNavigator";
import TenantProperty from "./Property/TenantProperty";
// import TenantMaintenanceItem from "./Maintenance/TenantMaintenanceItem";
import TenantMaintenanceItemDetail from "./Maintenance/TenantMaintenanceItemDetail";
import DocumentPDF from "./Documents/OwnerDocuments/DocumentPDF";

import EditProfileSettings from "./Settings/EditProfileSettings";
import ChangePasswordSettings from "./Settings/ChangePasswordSettings";
import AddCard from "./Settings/AddCard";
import CardDetailsSettings from "./Settings/CardDetailsSettings";
import { Footer } from "./Footer";
function Main () {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box
          sx={{
            flex: "1", // Allow content to take remaining space
            overflow: "auto", // Enable scrolling when content overflows
          }}
        >
          {/* <Box sx={{display: "flex",
          flexDirection: "column",
          // minHeight: "100vh",
          overflow: "auto", // Enable scrolling when content overflows
        }}> */}
          <Header></Header>
          <Router>
            <Routes>
              <Route exact path="/dashboard" element={<MaintenanceWidget />} />
              <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
              {/* <Route exact path="/properties" element={<PropertyListData />} /> */}
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
              <Route exact path="/ownerDocumentsPDF" element={<DocumentPDF />} />
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

              <Route exact path="/transactionHistory" element={<TransactionHistory />} />
              <Route exact path="/viewTransactionOwner" element={<ViewTransactionOwner />} />
              <Route exact path="/paymentsTenant" element={<PaymentsTenant />} />
              <Route exact path="/card" element={<CardDetails />} />
              <Route exact path="/cashflowManager" element={<CashflowManager />} />
              <Route exact path="/managerDashboard" element={<ManagerDashboard />} />
              <Route exact path="/settingsOwner" element={<Settings />} />
              <Route exact path="/editProfileSettings" element={<EditProfileSettings />} />
              <Route exact path="/changePasswordSettings" element={<ChangePasswordSettings />} />
              <Route exact path="/addCardSettings" element={<AddCard />} />
              <Route exact path="/cardDetailsSettings" element={<CardDetailsSettings />} />

              <Route exact path="/propertyInfo" element={<PropertyInfo />} />
              <Route exact path="/contacts" element={<Contacts />} />
              <Route exact path="/contactDetails" element={<ContactDetails />} />
              <Route exact path="/addContacts" element={<AddContacts />} />

              <Route exact path="/maintenance" element={<Maintenance />} />
              <Route exact path="/" element={<Dashboard />} />

              <Route exact path="/addMaintenanceItem" element={<AddMaintenanceItem />} />
              <Route exact path="/maintenanceRequestDetail" element={<MaintenanceRequestDetail />} />
              <Route exact path="/maintenanceRequestNavigator" element={<MaintenanceRequestNavigator />} />
              <Route exact path="/addProperty" element={<AddProperty />} />
              <Route exact path="/editProperty" element={<EditProperty />} />
              <Route exact path="/propertyDetail" element={<PropertyDetail />} />
              <Route exact path="/tenantMaintenance" element={<TenantMaintenance />} />
              <Route exact path="/addTenantMaintenanceItem" element={<AddTenantMaintenanceItem />} />
              <Route exact path="/myProperty" element={<TenantProperty />} />
              <Route exact path="/properties" element={<PropertyList />} />
              {/* <Route exact path="/tenantMaintenanceItem" element={<TenantMaintenanceItem />} /> */}
              <Route exact path="/tenantMaintenanceItem/:id" element={<TenantMaintenanceItemDetail />} />
            </Routes>
          </Router>
          <Footer></Footer>
          {/* </Box> */}
        </Box>
      </div>
    </>
  );
}
export default Main;
