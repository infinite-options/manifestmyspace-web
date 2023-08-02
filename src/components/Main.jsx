import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import PropertyList from "./Property/PropertyList";
import AddExpense from "./Cashflow/AddExpense";
import AddRevenue from "./Cashflow/AddRevenue";
import AddUtility from "./Cashflow/AddUtility";
import Dashboard from './Dashboard';
import Maintenance from './Maintenance/Maintenance';
import AddMaintenanceItem from './Maintenance/AddMaintenanceItem';
import MaintenanceRequestDetail from './Maintenance/MaintenanceRequestDetail';


function Main(){

    return (
        <div>
            <Header/>
            <Router>
                <Routes>
                    <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
                    <Route exact path="/properties" element={<PropertyList />} />
                    <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
                    <Route exact path="/addExpense" element={<AddExpense/>}/>
                    <Route exact path="/addRevenue" element={<AddRevenue/>}/>
                    <Route exact path="/addUtility" element={<AddUtility/>}/>
                    <Route exact path="/maintenance" element={<Maintenance />} />
                    <Route exact path="/" element={<Dashboard />} />
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/addMaintenanceItem" element={<AddMaintenanceItem />} />
                    <Route exact path="/maintenanceRequestDetail/:id" element={<MaintenanceRequestDetail />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Main;