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
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default Main;
