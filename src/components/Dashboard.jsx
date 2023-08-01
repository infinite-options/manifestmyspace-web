import { Chart } from "react-google-charts";
import { Button } from '@mui/material';
import { PieChart, Pie, Legend, Cell } from 'recharts';
import CashflowWidget from "./Dashboard-Components/Cashflow/CashflowWidget";
import MaintenanceWidget from "./Dashboard-Components/Maintenance/MaintenanceWidget";
import "../css/maintenance.css";
function Dashboard() {
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
        { rent_status: "not paid", number: 18, fill: "#A52A2A" },
        { rent_status: "paid partially", number: 6, fill: "#FF8A00" },
        { rent_status: "paid late", number: 3, fill: "#FFC85C" },
        { rent_status: "vacant", number: 3, fill: "#160449" },
        { rent_status: "paid on time", number: 36, fill: "#3D5CAC" }
      ];

    const renderColorfulLegendText = (value, entry) => {
        const { color } = entry;
        const status = data.find(item => item.fill === color)?.rent_status;
        const num = data.find(item => item.fill === color)?.number;
        return <span style={{color: '#160449', fontFamily:'Source Sans Pro', fontSize:'18px' }}>{status} {num}</span>;
      };
    return(
        <div className="mt-widget-main">
            <CashflowWidget/>
            <div className="mt-container">
                <MaintenanceWidget/>
                <div className="mt-prop-widget-container">
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
                    </PieChart>
                     <Button
                        color="primary"
                        style={{    position: 'absolute', 
                                    top: '32%', left: '50%', 
                                    transform: 'translate(-50%, -50%)', 
                                    textTransform: 'inherit', 
                                    fontFamily: 'Source Sans Pro',
                                    fontSize: '9px',
                                    color: '#160449',
                                    fontWeight: 600,}}>
                        View All 63 <br />properties
                    </Button>
                    </div>
                </div>
            </div>  
            <div className="mt-widget-expiry">
                {/* <div className="mt-expiry-container"> */}
                    <h2 className="mt-expiry-widget-title"> Leases Expiring by Month </h2>  
                    <div className="months-and-moveouts">
                        <div className="months">
                                <div id="first-row">
                                <div className="box">
                                    <div style={{fontSize: '14px'}}> <b> 2</b> </div>
                                    <div> JAN </div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 3</b></div>
                                    <div>FEB</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>MAR</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>APR</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>MAY</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>JUN</div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <div id="second-row">
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>JUL</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>AUG</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>SEP</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>OCT</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>NOV</div>
                                </div>
                                <div className="box">
                                    <div style={{fontSize: '14px'}}><b> 2</b></div>
                                    <div>DEC</div>
                                </div>
                            </div>
                        </div>
                        <div className="moveouts">
                                <h2 className="move-out-title"> Move-outs</h2>
                                <div className="big-box"> 
                                    <div>5 </div>
                                    <div> IN NEXT </div> 
                                    <div> 6 WEEKS </div>
                                </div>
                        </div>
                    </div>
            </div>
            <br />
            <div className="bottom-buttons">
                <Button variant="outlined" id="revenue" className="bottom-item"> 
                    Revenue            
                </Button>
                <Button variant="outlined" id="expense" className="bottom-item"> 
                    Expense
                </Button>
                <Button variant="outlined" id="maintenance" className="bottom-item"> 
                    Maintenance
                </Button>
            </div>
            <br/>
        </div>
    )
}

export default Dashboard;