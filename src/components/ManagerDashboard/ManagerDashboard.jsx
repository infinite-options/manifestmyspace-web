import { Chart } from "react-google-charts";
import { Button, Container, Box, ThemeProvider, Grid, Typography } from '@mui/material';
import { PieChart, Pie, Legend, Cell } from 'recharts';
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import Dollar from '../../images/Dollar.png'
import File_dock_fill from '../../images/File_dock_fill.png'
import User_fill_dark from '../../images/User_fill_dark.png'
import { useUser } from "../../contexts/UserContext";
import PropertyRentWidget from "../Dashboard-Components/PropertyRent/PropertyRentWidget";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AddRevenueIcon from '../../images/AddRevenueIcon.png'
import LeaseWidget from "../Dashboard-Components/Lease/LeaseWidget";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import OwnerList from "./OwnerList";

const useStyles = makeStyles({
    button: {
      width: '100%',
      fontSize: '13px',
      marginBottom: '10px', // Adjust the spacing between buttons as needed
    },
    container: {
      width: '90%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
        marginBottom: '20px', // Adjust the spacing between rows
      },
  });

function ManagerDashboard() {
    const classes = useStyles();
    const { getProfileId } = useUser();
    const navigate = useNavigate();
    let date = new Date();
    // const [loading, setLoading] = useState(true);
    const [rentStatus, setRentStatus] = useState([]);
    const [leaseStatus, setLeaseStatus] = useState([]);
    const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(date.getMonth()+1);
    const [contractRequests, setContractRequests] = useState([])
    

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


    // let propsForPropertyRentWidget = {
    //     rentData: data,
    //     unpaidRentStatusCount: totalPropertiesCount,
    //     profile: "manager",
    // }

    // const renderColorfulLegendText = (value, entry) => {
    //     const { color } = entry;
    //     const status = data.find(item => item.fill === color)?.rent_status;
    //     const num = data.find(item => item.fill === color)?.number;
    //     return <span style={{color: '#160449', fontFamily:'Source Sans Pro', fontSize:'18px' }}>{num} {status}</span>;
    // };
    

    // USE EFFECT gets all the data
    useEffect(() => {
        // const dataObject = {};
        const fetchData = async () => {
            // console.log("in useEffect")
            // console.log("PROFILE ID: ", getProfileId())

            setShowSpinner(true);
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`)
            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/600-000003`)
            const contractsResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`)

            const propertiesResponse = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)
            try {
                const contractsData = await contractsResponse.json();
                const jsonData = await response.json()
                const propertiesResponseJSON = await propertiesResponse.json()
                setContractRequests(propertiesResponseJSON.NewPMRequests.result)
                // MAINTENANCE Status
                setMaintenanceStatusData(jsonData.MaintenanceStatus.result)
                
                // RENT Status
                setRentStatus(jsonData.RentStatus.result);
                
                // LEASE Status
                setLeaseStatus(jsonData.LeaseStatus.result);
            } catch (error) {
                console.error(error)                    
            }

            setShowSpinner(false);
        }
        fetchData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        {/* {loading && 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {loading && <CircularProgress color="inherit" />}
            </div>    
        } 
            {!loading && */}
                <div className="mt-widgest-main">
                    <div className="mt-container">
                        <MaintenanceWidget selectedRole={"MANAGER"} maintenanceData={maintenanceStatusData}/>
                        <PropertyRentWidget profile={"MANAGER"} rentData={rentStatus}/>
                    </div>

                    <div className="mt-container">
                        {/* <LeaseWidget selectedRole={"OWNER"}/> */}
                        <LeaseWidget leaseData={leaseStatus}/>
                    </div>

                    <br />
                    <div className="mt-widget-owner-happiness" >
                        <h2 className="mt-expiry-widget-title"> Owner Happiness </h2>
                        <OwnerList />
                    </div>
                    <br />
            
                    <div className={classes.container}>
                    <Grid container spacing={2} className={classes.row}>
                        <Grid item xs={4}>
                            <Button
                                variant="outlined"
                                id="revenue"
                                className={classes.button}
                                onClick={() => {
                                    navigate('/payments');
                                }}
                            >
                                {/* <img src={User_fill_dark} alt="Payments" /> */}
                                <CurrencyExchangeIcon sx={{paddingRight: "5px"}}/>
                                Pay Bills
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="outlined"
                                id="revenue"
                                className={classes.button}
                                onClick={() => {
                                navigate('/PMContacts');
                                }}
                            >
                                <img src={User_fill_dark} alt="Contacts" />
                                Contacts
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="outlined"
                                id="revenue"
                                className={classes.button}
                                onClick={() => {
                                    navigate('/pmQuotesList');
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        backgroundColor: 'primary.main',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: '#160449',
                                        fontSize: '2rem',
                                        paddingRight: '10px'
                                    }}
                                >
                                    {/* {contractRequests.length()} */}
                                    {contractRequests.length}
                                </Box>
                                New Requests
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className={classes.row}>
                        <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            id="revenue"
                            className={classes.button}
                            onClick={() => {
                                navigate('/transactionHistory', {state: {month: "January", year: "2024"}});
                            }}
                        >
                            <img src={Dollar} alt="Transactions" />
                            Transactions
                        </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            id="expense"
                            className={classes.button}
                            onClick={() => {
                            navigate('/ownerDocuments');
                            }}
                            >

                            <img src={File_dock_fill} alt="Documents" />
                            Documents
                        </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            id="maintenance"
                            className={classes.button}
                            onClick={() => {
                            navigate('/addMaintenanceItem');
                            }}
                        >
                            <img src={User_fill_dark} alt="Add Ticket" />
                            Add Ticket
                        </Button>
                        </Grid>
                    </Grid>
                    </div>
                <br />
                <br />
                </div>
            {/* } */}
        </ThemeProvider>
    )
}

export default ManagerDashboard;