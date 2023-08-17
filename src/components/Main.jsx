import React from "react";
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CashflowOwner from './Cashflow/CashflowOwner';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidjet from './MaintenanceWidget';
import PropertyList from "./Property/PropertyData";
import AddExpense from "./Cashflow/AddExpense";
import AddRevenue from "./Cashflow/AddRevenue";
import AddUtility from "./Cashflow/AddUtility";
import ViewTransactionOwner from "./Transactions/ViewTransactionOwner"
import PaymentsTenant from "./Payments/PaymentsTenant";
import TransactionHistory from "./Transactions/TransactionHistory";
import CardDetails from "./Payments/CardDetails";
import CashflowManager from "./Cashflow/CashflowManager"
import ManagerDashboard from "./Cashflow/ManagerDashboard"
function Main(){
    return (
        <>
            <div>
            <Header></Header>
            <Router>
            <Routes>
              <Route exact path="/dashboard" element={<MaintenanceWidjet />} />
              <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
              <Route exact path="/properties" element={<PropertyList />} />
              <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />
              <Route exact path="/addExpense" element={<AddExpense/>}/>
              <Route exact path="/addRevenue" element={<AddRevenue/>}/>
              <Route exact path="/addUtility" element={<AddUtility/>}/>
              <Route exact path='/transactionHistory' element={<TransactionHistory/>}/>
              <Route exact path='/viewTransactionOwner' element={<ViewTransactionOwner/>}/>
              <Route exact path='/paymentsTenant' element={<PaymentsTenant/>}/>
              <Route exact path='/card' element={<CardDetails/>}/>
              <Route exact path='/cashflowManager' element={<CashflowManager/>}/>
              <Route exact path='/managerDashboard' element={<ManagerDashboard/>}/>
            </Routes>
            </Router>
            </div>
        </>

    )
}

export default Main;