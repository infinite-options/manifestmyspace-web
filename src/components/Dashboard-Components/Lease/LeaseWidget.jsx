import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Legend, Cell } from 'recharts';
import { Chart } from "react-google-charts";
// import { Box } from '@mui/material';
import Status from "../../Templates/Status";
import theme from "../../../theme/theme";
import { Button, Box, ThemeProvider } from '@mui/material';


export default function LeaseWidget({moveOut, leaseData}) {
    // leaseStatus = leaseData;
    console.log('in LeaseWidget');
    console.log('leaseWidget lease Data:', leaseData);
    console.log('leaseWidget moveOut Data:', moveOut);
    // console.log('leaseWidget lease Status:', leaseStatus);



    const navigate = useNavigate();
    let date = new Date();
    // const [leaseStatus, setLeaseStatus] = useState(leaseData);
    const [currentMonth, setCurrentMonth] = useState(date.getMonth()+1);
    // const [moveoutsInSixWeeks, setMoveoutsInSixWeeks] = useState(0);

    let moveoutsInSixWeeks = moveOut
    let leaseStatus = leaseData
    console.log('After setting leaseStatus:', leaseStatus);
    console.log('After setting moveoutsInSixWeeks:', moveoutsInSixWeeks);

    return (

        <ThemeProvider theme={theme}>

        {/* LEASES WIDGET */}
        <div className="mt-widget-expiry" onClick={() => navigate("/ownerLeases")}>
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

        <br />
            
        {/* } */}
        </ThemeProvider>
    )
}