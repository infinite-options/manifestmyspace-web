import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ManagerDashboardHappinessMatrix from "./ManagerDashboard/ManagerDashboardHappinessMatrix";
import Settings from "./Settings/SettingsOwner";

import PropertyInfo from "./Property/PropertyInfo";
import MaintenanceWidget from "./Dashboard-Components/Maintenance/MaintenanceWidget";

import Contacts from "./Contacts/Contacts";
import ContactDetails from "./Contacts/ContactDetails";
import AddContacts from "./Contacts/AddContacts";
import TenantContactDetails from './Contacts/TenantContactDetails';

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
import ManagerDashboard from "./ManagerDashboard/ManagerDashboard";

import SettingsACH1 from "./SettingsACH/SettingsACH1";
import SettingsACH2 from "./SettingsACH/SettingsACH2";
import SettingsACH3 from "./SettingsACH/SettingsACH3";
import SettingsACH4 from "./SettingsACH/SettingsACH4";
import SettingsACH5 from "./SettingsACH/SettingsACH5";
import POContracts from "./Contracts/POContracts/POContracts";
import theme from "../theme/theme";
import QuoteAcceptForm from "./Maintenance/Manager/QuoteAcceptForm";
import QuoteRequestForm from "./Maintenance/Manager/QuoteRequestForm";
import RescheduleMaintenance from "./Maintenance/Manager/RescheduleMaintenance";
import PayMaintenanceForm from "./Maintenance/Manager/PayMaintenanceForm";

import Onboarding from "./Onboarding/Onboarding";
import NewUser from "./Onboarding/NewUser";
import Register from "./Onboarding/Register";
import ReturningUser from "./Onboarding/ReturningUser";
import UserLogin from "./Onboarding/UserLogin";
import OnboardingRouter from "./Onboarding/OnboardingRouter";
import ContactInfo from "./Onboarding/ContactInfo";

import SelectRole from "./Onboarding/SelectRole";

import BusinessQuoteForm from "./Maintenance/Business/BusinessQuoteForm";
import BusinessInvoiceForm from "./Maintenance/Business/BusinessInvoiceForm";

import Maintenance01 from "./Maintenance/Maintainance01/Maintainance01";
import MaintenanceRequestDetail01 from "./Maintenance/Maintainance01/MaintenanceRequestDetail01";

import ProfileName from "./Onboarding/ProfileName";
import ProfileInfo from "./Onboarding/ProfileInfo";
import PersonalInfo from "./Onboarding/PersonalInfo";
import ProfilePayment from "./Onboarding/ProfilePayment";


function Main() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box
          sx={{
            flex: "1", // Allow content to take remaining space
            overflow: "auto", // Enable scrolling when content overflows
          }}
        >
          <Header/>
            <Routes>
              {/* <Route path="/" element={<Navigate to={selectedRoleRoute} />} /> */}
              <Route exact path="/" element={<Onboarding />} />
              <Route exact path="/dashboard" element={<MaintenanceWidget />} />
              <Route exact path="/cashflow" element={<CashflowOwner />} />
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
              <Route exact path="/managerDashboardHappinessMatrix" element={<ManagerDashboardHappinessMatrix />} />
              <Route exact path="/settingsOwner" element={<Settings />} />
              <Route exact path="/editProfileSettings" element={<EditProfileSettings />} />
              <Route exact path="/changePasswordSettings" element={<ChangePasswordSettings />} />
              <Route exact path="/addCardSettings" element={<AddCard />} />
              <Route exact path="/cardDetailsSettings" element={<CardDetailsSettings />} />

              <Route exact path="/propertyInfo" element={<PropertyInfo />} />
              <Route exact path="/contacts" element={<Contacts />} />
              <Route exact path="/contactDetails" element={<ContactDetails />} />
              <Route exact path="/addContacts" element={<AddContacts />} />
              <Route exact path="/tenantContactDetails" element={<TenantContactDetails />} />

              <Route exact path="/maintenance" element={<Maintenance />} />
              <Route exact path="/ownerDashboard" element={<Dashboard />} />

              <Route exact path="/addMaintenanceItem" element={<AddMaintenanceItem />} />
              <Route exact path="/maintenance/detail" element={<MaintenanceRequestDetail />} />
              <Route exact path="/maintenanceRequestNavigator" element={<MaintenanceRequestNavigator />} />
              <Route exact path="/addProperty" element={<AddProperty />} />
              <Route exact path="/editProperty" element={<EditProperty />} />
              <Route exact path="/propertyDetail" element={<PropertyDetail />} />
              <Route exact path="/tenantMaintenance" element={<TenantMaintenance />} />
              <Route exact path="/addTenantMaintenanceItem" element={<AddTenantMaintenanceItem />} />
              <Route exact path="/myProperty" element={<TenantProperty />} />
              <Route exact path="/properties" element={<PropertyList />} />
              {/* <Route exact path="/tenantMaintenanceItem" element={<TenantMaintenanceItem />} /> */}
              <Route exact path="/tenantMaintenanceItem" element={<TenantMaintenanceItemDetail />} />

              <Route exact path="/settingsManagerACH1" element={<SettingsACH1 />} />
              <Route exact path="/settingsManagerACH2" element={<SettingsACH2 />} />
              <Route exact path="/settingsManagerACH3" element={<SettingsACH3 />} />
              <Route exact path="/settingsManagerACH4" element={<SettingsACH4 />} />
              <Route exact path="/settingsManagerACH5" element={<SettingsACH5 />} />

              <Route exact path="/poContracts" element={<POContracts />} />
              <Route exact path="/managerDashboard" element={<ManagerDashboard/>} />
              {/* <Route exact path="/onboarding" element={<Onboarding />} /> */}
            
            <Route exact path="/newUser" element={<NewUser />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/returningUser" element={<ReturningUser />} />
            <Route exact path="/userLogin" element={<UserLogin />} />
            <Route exact path="/selectRole" element={<SelectRole />} />
            <Route exact path="/profileName" element={<ProfileName />} />
            <Route exact path="/profileInfo" element={<ProfileInfo />} />
            <Route exact path="/personalInfo" element={<PersonalInfo />} />
            <Route exact path="/profilePayment" element={<ProfilePayment />} />
            <Route exact path="/onboardingRouter" element={<OnboardingRouter />} />
            <Route exact path="/contactInfo" element={<ContactInfo />} />

            <Route exact path="/quoteAccept" element={<QuoteAcceptForm />} />
            <Route exact path="/quoteRequest" element={<QuoteRequestForm />} />
            <Route exact path="/scheduleMaintenance" element={<RescheduleMaintenance />} />
            <Route exact path="/rescheduleMaintenance" element={<RescheduleMaintenance />} />
            <Route exact path="/payMaintenance" element={<PayMaintenanceForm />} />

            <Route exact path="/businessDeclineQuoteForm" element={<BusinessQuoteForm acceptBool={false}/>} />
            <Route exact path="/businessAcceptQuoteForm" element={<BusinessQuoteForm acceptBool={true}/>} />
            <Route exact path="/businessInvoiceForm" element={<BusinessInvoiceForm/>} />
            <Route exact path="/maintenanceMM" element={<Maintenance01 />} />
            <Route exact path="/maintenanceMM/detail" element={<MaintenanceRequestDetail01 />} />

            </Routes>
            <Footer/>
        </Box>
      </div>
    </>
  );
}
export default Main;
