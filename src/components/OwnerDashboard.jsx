import { Chart } from "react-google-charts";
import { Button, Box, ThemeProvider } from '@mui/material';
import { PieChart, Pie, Legend, Cell } from 'recharts';
import CashflowWidget from "./Dashboard-Components/Cashflow/CashflowWidget";
import MaintenanceWidget from "./Dashboard-Components/Maintenance/MaintenanceWidget";
import "../css/maintenance.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../theme/theme";
import Dollar from '../images/Dollar.png'
import File_dock_fill from '../images/File_dock_fill.png'
import User_fill_dark from '../images/User_fill_dark.png'
import { useUser } from "../contexts/UserContext";
import PropertyRentWidget from "./Dashboard-Components/PropertyRent/PropertyRentWidget";
import LeaseWidget from "./Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function OwnerDashboard() {
    const { user, getProfileId } = useUser();
    const navigate = useNavigate();
    let date = new Date();
    // const [loading, setLoading] = useState(true);
    // const [rentStatus, setRentStatus] = useState([]);
    const [leaseStatus, setLeaseStatus] = useState([]);
    const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(date.getMonth()+1);
    
    const [unpaidRentStatusCount, setUnpaidRentStatusCount] = useState(0);
    const [partialPaidRentStatusCount, setPartialPaidRentStatusCount] = useState(0);
    const [paidLateRentStatusCount, setPaidLateRentStatusCount] = useState(0);
    const [vacantRentStatusCount, setVacantRentStatusCount] = useState(0);
    const [paidRentStatusCount, setPaidRentStatusCount] = useState(0);
    const [totalPropertiesCount, setTotalPropertiesCount] = useState(0);

    const [moveoutsInSixWeeks, setMoveoutsInSixWeeks] = useState(0);
    const sliceColors = ['#A52A2A', '#FF8A00', '#FFC85C', '#160449', '#3D5CAC'];
    const rentData = [
        ["Properties", "Rent status"],
        ["not paid", 18],
        ["paid partially", 6],
        ["paid late", 3],
        ["vacant", 3],
        ["paid on time", 36],
    ];

    const data = [
        { rent_status: "not paid", number: unpaidRentStatusCount, fill: "#A52A2A" },
        { rent_status: "paid partially", number: partialPaidRentStatusCount, fill: "#FF8A00" },
        { rent_status: "paid late", number: paidLateRentStatusCount, fill: "#FFC85C" },
        { rent_status: "vacant", number: vacantRentStatusCount, fill: "#160449" },
        { rent_status: "paid on time", number: paidRentStatusCount, fill: "#3D5CAC" }
    ];

    let propsForPropertyRentWidget = {
        rentData: data,
        unpaidRentStatusCount: totalPropertiesCount,
    }

    
    // USE EFFECT gets all the data
    useEffect(() => {
        const dataObject = {};
        const fetchData = async () => {
            // console.log("in useEffect")
            // console.log("PROFILE ID: ", getProfileId())
            
            setShowSpinner(true);
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`)
            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/110-000003`)
            const jsonData = await response.json()
            

            // MAINTENANCE Status
            setMaintenanceStatusData(jsonData.MaintenanceStatus.result);
            // console.log("DEBUG - OwnerDashboard - jsonData.MaintenanceStatus.result", jsonData.MaintenanceStatus.result)
            // setLoading(false);


            // RENT Status
            // setRentStatus(jsonData.RentStatus.result);
            let rentStatus = jsonData.RentStatus.result;

            let unpaidCount = rentStatus ? rentStatus.find(rs => rs.rent_status === 'UNPAID') : 0;
            unpaidCount = unpaidCount ? unpaidCount.num : 0;
            setUnpaidRentStatusCount(unpaidCount);

            let partialPaidCount = rentStatus ? rentStatus.find(rs => rs.rent_status === 'PAID PARTIALLY') : 0;
            partialPaidCount = partialPaidCount ? partialPaidCount.num : 0;
            setPartialPaidRentStatusCount(partialPaidCount);

            let paidLateCount = rentStatus ? rentStatus.find(rs => rs.rent_status === 'PAID LATE') : 0;
            paidLateCount = paidLateCount ? paidLateCount.num : 0;
            setPaidLateRentStatusCount(paidLateCount);

            let vacantCount = rentStatus ? rentStatus.find(rs => rs.rent_status === 'VACANT') : 0;
            vacantCount = vacantCount ? vacantCount.num : 0;
            setVacantRentStatusCount(vacantCount);

            let paidCount = rentStatus ? rentStatus.find(rs => rs.rent_status === 'PAID') : 0;
            paidCount = paidCount ? paidCount.num : 0;
            setPaidRentStatusCount(paidCount);

            // no check if rentSatus does not exist so this could result in a failure
            let totalPropertiesCount = unpaidCount + partialPaidCount + paidLateCount + vacantCount + paidCount;
            setTotalPropertiesCount(totalPropertiesCount);


            // LEASE Status
            setLeaseStatus(jsonData.LeaseStatus.result);
            let leaseStatusData = jsonData.LeaseStatus.result;
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth()+1; // Adding 1 because getMonth() returns 0-based index
            const leaseStatusDictionary = {};


            // Date object for today
            const today = new Date();
            // Date object for six weeks from now
            const sixWeeksLater = new Date();
            sixWeeksLater.setDate(today.getDate() + 6 * 7); // Adding 6 weeks worth of days
            let moveoutsInSixWeeks = 0;
            let diffDate = (sixWeeksLater - today)/ (1000 * 60 * 60 * 24);

            // Print statements
            console.log("Current Year: ", currentYear)
            console.log("Current Month: ", currentMonth)
            console.log("today ", today)
            console.log("sixWeeksLater ", sixWeeksLater)
            console.log("Date Difference ", diffDate)
            console.log("Lease Status: ", leaseStatus)
            console.log("Lease Status Data: ", leaseStatusData)
            console.log("Lease Dictionary: ", leaseStatusDictionary)
            

            leaseStatusData.forEach(item => {
                console.log("Lease item: ", item);
                console.log("Lease end date ", item.lease_end);
                const leaseEndDate = new Date(item.lease_end);
                console.log("leaseEndDate ", leaseEndDate)
                diffDate = Math.floor((leaseEndDate - today)/ (1000 * 60 * 60 * 24));
                // console.log("Calculated Date Difference ", Math.floor(diffDate))
                console.log("Calculated Date Difference ", diffDate)

                const cy_month = leaseEndDate.getMonth() + 1; //current year month
                console.log("Lease Month: ", cy_month)
                // leaseStatusDictionary[cy_month] = 0;
                leaseStatusDictionary[cy_month] = item.num;
                // leaseStatusDictionary[cy_month] += 5;
                console.log("Lease Status Dictionary: ", leaseStatusDictionary[cy_month])
                

                if (diffDate <= 56) {
                    moveoutsInSixWeeks = moveoutsInSixWeeks + item.num;
                    console.log('The date is within the next six weeks.');
                } 
                else {
                    console.log('The date is not within the next six weeks.');
                }
                console.log("Move Out ", moveoutsInSixWeeks)});
            
            
            console.log("Lease Status in Owner Dashboard ", leaseStatusData)
            console.log("leaseStatusDictionary ", leaseStatusDictionary)

            setLeaseStatus(leaseStatusDictionary);
            setMoveoutsInSixWeeks(moveoutsInSixWeeks);

            setShowSpinner(false);
        }
        fetchData();
    }, []);


    // RETURN statement has HTML, CSS and uses all the DATA
    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

                <div className="mt-widget-main">
                    <CashflowWidget />
                    <div className="mt-container">
                        <MaintenanceWidget selectedRole={"OWNER"} maintenanceData={maintenanceStatusData}/>
                        <PropertyRentWidget {...propsForPropertyRentWidget}/>
                    </div>

                    
                    <div className="mt-container">
                        {/* <LeaseWidget selectedRole={"OWNER"}/> */}
                        <LeaseWidget moveOut={moveoutsInSixWeeks} leaseData={leaseStatus}/>
                    </div>




                    <div className="bottom-buttons">
                        <Button
                            variant="outlined"
                            id="revenue"
                            className="bottom-item"
                            onClick={() => { navigate('/transactionHistory') }}> <img src={Dollar}></img> Transactions</Button>
                        <Button
                            variant="outlined"
                            id="expense"
                            className="bottom-item"
                            onClick={() => { navigate('/ownerDocuments') }}> <img src={File_dock_fill}></img> Documents</Button>
                        <Button
                            variant="outlined"
                            id="maintenance"
                            className="bottom-item"
                            onClick={() => { navigate('/ownerContacts') }}> <img src={User_fill_dark}></img> Contacts</Button>
                    </div>
                    <br />
                </div>
            {/* } */}
        </ThemeProvider>
    )
}