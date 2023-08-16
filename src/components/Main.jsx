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
import AddProperty from './Property/AddProperty';
import EditProperty from './Property/EditProperty';
import PropertyDetail from './Property/PropertyDetail';
import TenantMaintenance from './Maintenance/TenantMaintenance';
import AddTenantMaintenanceItem from './Maintenance/AddTenantMaintenanceItem';
import MaintenanceRequestNavigator from "./Maintenance/MaintenanceRequestNavigator";
import TenantProperty from "./Property/TenantProperty";
import TenantMaintenanceItem from "./Maintenance/TenantMaintenanceItem";
import TenantMaintenanceItemDetail from "./Maintenance/TenantMaintenanceItemDetail";


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
                    <Route exact path="/maintenanceRequestDetail" element={<MaintenanceRequestDetail />} />
                    <Route exact path="/maintenanceRequestNavigator" element={<MaintenanceRequestNavigator />} />
                    <Route exact path="/addProperty" element={<AddProperty />} />
                    <Route exact path="/editProperty" element={<EditProperty />} />
                    <Route exact path="/propertyDetail" element={<PropertyDetail />} />
                    <Route exact path="/tenantMaintenance" element={<TenantMaintenance />} />
                    <Route exact path="/addTenantMaintenanceItem" element={<AddTenantMaintenanceItem />} />
                    <Route exact path="/myProperty" element={<TenantProperty />} />
                    {/* <Route exact path="/tenantMaintenanceItem" element={<TenantMaintenanceItem />} /> */}
                    <Route exact path="/tenantMaintenanceItem/:id" element={<TenantMaintenanceItemDetail />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Main;