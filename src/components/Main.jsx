import Header from './Header';
import CashflowWidget from './Dashboard-Components/Cashflow/CashflowWidget';
import Footer from './Footer';
import SelectMonthComponent from './SelectMonthComponent';
import MaintenanceWidjet from './MaintenanceWidget';
function Main(){
    return (
        <>
            <Header></Header>
            <CashflowWidget></CashflowWidget>
            <MaintenanceWidjet></MaintenanceWidjet>
            {/* <SelectMonthComponent></SelectMonthComponent> */}
        </>

    )
}

export default Main;