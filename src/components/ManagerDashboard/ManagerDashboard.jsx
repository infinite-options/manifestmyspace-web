import { Chart } from "react-google-charts";
import { Button, Box, ThemeProvider, CircularProgress, Grid } from '@mui/material';
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
    const [loading, setLoading] = useState(true);
    const [rentStatus, setRentStatus] = useState([]);
    const [leaseStatus, setLeaseStatus] = useState([]);
    const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);

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

    const renderColorfulLegendText = (value, entry) => {
        const { color } = entry;
        const status = data.find(item => item.fill === color)?.rent_status;
        const num = data.find(item => item.fill === color)?.number;
        return <span style={{color: '#160449', fontFamily:'Source Sans Pro', fontSize:'18px' }}>{num} {status}</span>;
    };
    
    useEffect(() => {
        const dataObject = {};
        const fetchData = async () => {
            console.log("in useEffect")
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/managerDashboard/${getProfileId()}`)
            const jsonData = await response.json()
            console.log(jsonData)   
            console.log("--DEBUG-- maintenance status result for ", getProfileId(), jsonData.MaintenanceStatus.result)
            setMaintenanceStatusData(jsonData.MaintenanceStatus.result)
            setRentStatus(jsonData.RentStatus.result);
            setLoading(false);
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
            let totalPropertiesCount = unpaidCount + partialPaidCount + paidLateCount + vacantCount + paidCount;
            setTotalPropertiesCount(totalPropertiesCount);

            let leaseStatus = jsonData.LeaseStatus.result;
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth()+1; // Adding 1 because getMonth() returns 0-based index
            const leaseStatusDictionary = {};

            // Date object for today
            const today = new Date();
            // Date object for six weeks from now
            const sixWeeksLater = new Date();
            sixWeeksLater.setDate(today.getDate() + 6 * 7); // Adding 6 weeks worth of days
            let moveoutsInSixWeeks = 0;

            leaseStatus.forEach(item => {
            if (item.lease_end) {
                const leaseEndDate = new Date(item.lease_end);
                if (leaseEndDate.getFullYear() === currentYear) {
                    const cy_month = leaseEndDate.getMonth() + 1; //current year month
                    if (cy_month >= currentMonth) {
                        if (!leaseStatusDictionary[cy_month]) {
                            leaseStatusDictionary[cy_month] = 0;
                        }
                        leaseStatusDictionary[cy_month] += item.num;
                    }
                }
                else if (leaseEndDate.getFullYear() === currentYear + 1) {
                    const ny_month = leaseEndDate.getMonth() + 1; //next year month
                    if (ny_month < currentMonth) {
                        if (!leaseStatusDictionary[ny_month]) {
                            leaseStatusDictionary[ny_month] = 0;
                        }
                        leaseStatusDictionary[ny_month] += item.num;
                    }
                }

                if (leaseEndDate >= today && leaseEndDate <= sixWeeksLater) {
                    moveoutsInSixWeeks = moveoutsInSixWeeks + item.num;
                    console.log('The date is within the next six weeks.');
                  } else {
                    console.log('The date is not within the next six weeks.');
                  }
            }
            });
            setLeaseStatus(leaseStatusDictionary);
            setMoveoutsInSixWeeks(moveoutsInSixWeeks);
            console.log("leaseStatusDictionary ", leaseStatusDictionary)
        }
        fetchData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
        {loading && 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {loading && <CircularProgress color="inherit" />}
            </div>    
        }
            {!loading &&
                <div className="mt-widgest-main">
                    <div className="mt-container">
                        <MaintenanceWidget selectedRole={"MANAGER"} maintenanceData={maintenanceStatusData}/>
                        <PropertyRentWidget {...propsForPropertyRentWidget}/>
                        {/* <div className="mt-prop-widget-container" onClick={() => navigate("/pmRent")}>
                            <h2 className="mt-prop-widget-title"> Property Rent</h2>
                            <div className="mt-prop-widget-graph">
                                <PieChart width={200} height={250} >
                                    <Legend
                                        height={36}
                                        iconType="circle"
                                        layout="vertical"
                                        verticalAlign="bottom"
                                        iconSize={5}
                                        padding={5}
                                        formatter={renderColorfulLegendText}
                                    />
                                    <Pie
                                        data={data}
                                        cx={80}
                                        cy={100}
                                        innerRadius={35}
                                        outerRadius={50}
                                        paddingAngle={0}
                                        dataKey="number"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                        
                                    </Pie>
                                    <text
                                        x={85}
                                        y={100}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        cursor="pointer"
                                        style={{
                                            fontFamily: 'Source Sans Pro',
                                            fontSize: '9px',
                                            fill: '#160449',
                                            fontWeight: '600',
                                        }}
                                        onClick={(e) => { e.stopPropagation(); navigate('/properties') }}
                                    >
                                        View All {totalPropertiesCount}
                                        <tspan x={85} y={110}>properties</tspan>
                                    </text>
                                </PieChart>
                            </div>
                        </div> */}
                    </div>
                    <div className="mt-widget-expiry" onClick={() => navigate("/pmLeases")}>
                        {/* <div className="mt-expiry-container"> */}
                        <h2 className="mt-expiry-widget-title"> Leases Expiring: Next 12 Months </h2>
                        <div className="months-and-moveouts">
                            <div className="months">
                                <div id="first-row">
                                    <div className="box" style={{ backgroundColor: (currentMonth === 1 && '#F87C7A') || (currentMonth + 1 === 1 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[1] ? leaseStatus[1] : 0
                                                }
                                            </b>
                                        </div>
                                        <div> JAN </div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 2 && '#F87C7A') || (currentMonth + 1 === 2 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[2] ? leaseStatus[2] : 0
                                                }
                                            </b></div>
                                        <div>FEB</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 3 && '#F87C7A') || (currentMonth + 1 === 3 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[3] ? leaseStatus[3] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>MAR</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 4 && '#F87C7A') || (currentMonth + 1 === 4 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[4] ? leaseStatus[4] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>APR</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 5 && '#F87C7A') || (currentMonth + 1 === 5 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[5] ? leaseStatus[5] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>MAY</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 6 && '#F87C7A') || (currentMonth + 1 === 6 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[6] ? leaseStatus[6] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>JUN</div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div id="second-row">
                                    <div className="box" style={{ backgroundColor: (currentMonth === 7 && '#F87C7A') || (currentMonth + 1 === 7 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[7] ? leaseStatus[7] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>JUL</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: currentMonth === 8 && '#F87C7A' || currentMonth + 1 === 8 && '#FFC85C' }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[8] ? leaseStatus[8] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>AUG</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: currentMonth === 9 && '#F87C7A' || currentMonth + 1 === 9 && '#FFC85C' }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[9] ? leaseStatus[9] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>SEP</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 10 && '#F87C7A') || (currentMonth + 1 === 10 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[10] ? leaseStatus[10] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>OCT</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 11 && '#F87C7A') || (currentMonth + 1 === 11 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[11] ? leaseStatus[11] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>NOV</div>
                                    </div>
                                    <div className="box" style={{ backgroundColor: (currentMonth === 12 && '#F87C7A') || (currentMonth + 1 === 12 && '#FFC85C') }}>
                                        <div style={{ fontSize: '14px' }}>
                                            <b>
                                                {
                                                    leaseStatus && leaseStatus[12] ? leaseStatus[12] : 0
                                                }
                                            </b>
                                        </div>
                                        <div>DEC</div>
                                    </div>
                                </div>
                            </div>
                            <div className="moveouts">
                                <h2 className="move-out-title"> Move-outs</h2>
                                <div className="big-box">
                                    <div> {moveoutsInSixWeeks} </div>
                                    <div> IN NEXT </div>
                                    <div> 6 WEEKS </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
            
                    <div className="mt-widget-owner-happiness" onClick={() => navigate("/managerDashboardHappinessMatrix")}>
                        <h2 className="mt-expiry-widget-title"> Owner Happiness </h2>
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
                            navigate('/contacts');
                            }}
                        >
                            <img src={User_fill_dark} alt="Owner" />
                            Owner
                        </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            id="expense"
                            className={classes.button}
                            onClick={() => {
                            navigate();
                            }}
                        >
                            <img src={User_fill_dark} alt="Tenant" />
                            Tenant
                        </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            id="maintenance"
                            className={classes.button}
                            onClick={() => {
                            navigate();
                            }}
                        >
                            <img src={User_fill_dark} alt="Maintenance" />
                            Maintenance
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
                            navigate('/transactionHistory');
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
            }
        </ThemeProvider>
    )
}

export default ManagerDashboard;