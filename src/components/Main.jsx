import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowWidget from './Dashboard-Components/Cashflow/CashflowWidget';
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';

function Main(){
    return (
        <>
            <div>
            <Header></Header>
            <Router>
            <Routes>
              <Route exact path="/dashboard" element={<CashflowWidget />} />
              <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
            </Routes>
            </Router>
            </div>
        </>

    )
}

export default Main;