import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidjet from './MaintenanceWidget';
import SignIn from "./Tenant-Components/SignIn";
import SignUp from "./Tenant-Components/SignUp";
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
              <Route exact path="/login" element={<SignIn />} />
              <Route exact path="/signup" element={<SignUp />} />
            </Routes>
            </Router>
            </div>
        </>

    )
}

export default Main;