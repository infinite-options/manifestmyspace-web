import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CashflowOwner from './Cashflow/CashflowOwner';
// import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import PropertyList from './Property/PropertyList';
import AddExpense from './Cashflow/AddExpense';
import AddRevenue from './Cashflow/AddRevenue';
import AddUtility from './Cashflow/AddUtility';
import ViewLease from './Leases/ViewLease';
import EditLease from './Leases/EditLease';
import LeasePDF from './Leases/LeasePDF';
import FindProperty from './Property/FindProperty';
import PropertyInfo from './Property/PropertyInfo';

import MaintenanceWidget from './MaintenanceWidget';
import PropertyRentFlow from './PropertyRentFlow/PropertyRentFlow';
import PropertyRentDetail from './PropertyRentFlow/PropertyRentDetail';

import Announcement from './Announcement/Announcement';
import TenantDocuments from './Documents/TenantDocuments/TenantDocuments';
import TenantProfile from './Profile/TenantProfile/TenantProfile';
import TenantDashboard from './TenantDashboard/TenantDashboard';

import OwnerDocuments from './Documents/OwnerDocuments/OwnerDocuments';
import OwnerUploadDocuments from './Documents/OwnerDocuments/OwnerUploadDocuments';
import OwnerLeases from './Leases/OwnerLeases/OwnerLeases';
import OwnerProfile from './Profile/OwnerProfile/OwnerProfile';

import PMProfile from './Profile/PMProfile/PMProfile';
import PMLeases from './Leases/PMLeases/PMLeases';
import PMContracts from './Contracts/PMContracts/PMContracts';
import PMDocuments from './Documents/PMDocuments/PMDocuments';
import PMUploadDocuments from './Documents/PMDocuments/PMUploadDocuments';
import TenantProfileEdit from './Profile/TenantProfile/TenantProfileEdit';
function Main() {
    return (
        <>
            <div>
                <Header></Header>
                <Router>
                    <Routes>
                        <Route
                            exact
                            path="/dashboard"
                            element={<MaintenanceWidget />}
                        />
                        <Route
                            exact
                            path="/cashflowOwner"
                            element={<CashflowOwner />}
                        />
                        <Route
                            exact
                            path="/properties"
                            element={<PropertyList />}
                        />
                        <Route
                            exact
                            path="/selectMonthComponent"
                            element={<SelectMonthComponent />}
                        />
                        <Route
                            exact
                            path="/addExpense"
                            element={<AddExpense />}
                        />
                        <Route
                            exact
                            path="/addRevenue"
                            element={<AddRevenue />}
                        />
                        <Route
                            exact
                            path="/propertyRent"
                            element={<PropertyRentFlow />}
                        />
                        <Route
                            exact
                            path="/propertyRentDetail"
                            element={<PropertyRentDetail />}
                        />
                        <Route
                            exact
                            path="/addExpense"
                            element={<AddExpense />}
                        />
                        <Route
                            exact
                            path="/addUtility"
                            element={<AddUtility />}
                        />
                        <Route
                            exact
                            path="/findProperty"
                            element={<FindProperty />}
                        />

                        <Route
                            exact
                            path="/viewLease"
                            element={<ViewLease />}
                        />
                        <Route
                            exact
                            path="/editLease"
                            element={<EditLease />}
                        />
                        <Route
                            exact
                            path="/leaseDocument"
                            element={<LeasePDF />}
                        />

                        <Route
                            exact
                            path="/announcement"
                            element={<Announcement />}
                        />
                        <Route
                            exact
                            path="/ownerProfile"
                            element={<OwnerProfile />}
                        />
                        <Route
                            exact
                            path="/ownerDocuments"
                            element={<OwnerDocuments />}
                        />
                        <Route
                            exact
                            path="/ownerUploadDocuments"
                            element={<OwnerUploadDocuments />}
                        />
                        <Route
                            exact
                            path="/ownerLeases"
                            element={<OwnerLeases />}
                        />

                        <Route
                            exact
                            path="/tenantDocuments"
                            element={<TenantDocuments />}
                        />
                        <Route
                            exact
                            path="/tenantProfile"
                            element={<TenantProfile />}
                        />
                        <Route
                            exact
                            path="/tenantProfileEdit"
                            element={<TenantProfileEdit />}
                        />
                        <Route
                            exact
                            path="/tenantDashboard"
                            element={<TenantDashboard />}
                        />

                        <Route
                            exact
                            path="/pmProfile"
                            element={<PMProfile />}
                        />
                        <Route exact path="/pmLeases" element={<PMLeases />} />
                        <Route
                            exact
                            path="/pmContracts"
                            element={<PMContracts />}
                        />
                        <Route
                            exact
                            path="/pmDocuments"
                            element={<PMDocuments />}
                        />
                        <Route
                            exact
                            path="/pmUploadDocuments"
                            element={<PMUploadDocuments />}
                        />
                        <Route
                            exact
                            path="/propertyInfo"
                            element={<PropertyInfo />}
                        />
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default Main;
