import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidget from './MaintenanceWidget';
import PropertyList from './Property/PropertyList';
import AddExpense from './Cashflow/AddExpense';
import AddRevenue from './Cashflow/AddRevenue';
import AddUtility from './Cashflow/AddUtility';
import ViewLease from './Leases/ViewLease';
import EditLease from './Leases/EditLease';
import LeasePDF from './Leases/LeasePDF';
import FindProperty from './Property/FindProperty';

function Main() {
    return (
        <>
            <div>
                <Header />
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
                            path="/addUtility"
                            element={<AddUtility />}
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
                            path="/findProperty"
                            element={<FindProperty />}
                        />
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default Main;
