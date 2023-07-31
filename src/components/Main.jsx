import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidjet from './MaintenanceWidget';
import Announcement from "./Announcement/Announcement";
import PropertyRentFlow from "./PropertyRentFlow/PropertyRentFlow";
import PropertyRentDetail from "./PropertyRentFlow/PropertyRentDetail";

function Main(){
    return (
        <>
            <div>
            <Header></Header>
            <Router>
            <Routes>
              <Route exact path="/dashboard" element={<MaintenanceWidjet />} />
              <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
              <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
              <Route exact path="/announcement" element={<Announcement />} />
              <Route exact path="/propertyRent" element={<PropertyRentFlow />} />
              <Route exact path="/propertyRentDetail" element={<PropertyRentDetail />} />
            </Routes>
            </Router>
            </div>
        </>

    )
}

export default Main;