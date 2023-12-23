import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Legend, Cell } from 'recharts';
import { Chart } from "react-google-charts";
// import { Box } from '@mui/material';
import Status from "../../Templates/Status";
import theme from "../../../theme/theme";
import { Button, Box, ThemeProvider } from '@mui/material';
import Dollar         from '../../../images/Dollar.png'
import File_dock_fill from '../../../images/File_dock_fill.png'
import User_fill_dark from '../../../images/User_fill_dark.png'


export default function PropertyRentWidget({selectedRole}) {
    const navigate = useNavigate();
    let date = new Date();
    const [leaseStatus, setLeaseStatus] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(date.getMonth()+1);
    const [moveoutsInSixWeeks, setMoveoutsInSixWeeks] = useState(0);

    // console.log(props)
    // let data = props.rentData

    // const renderColorfulLegendText = (value, entry) => {
    //     const { color } = entry;
    //     const status = data.find(item => item.fill === color)?.rent_status;
    //     const num = data.find(item => item.fill === color)?.number;
    //     return <span style={{color: '#160449', fontFamily:'Source Sans Pro', fontSize:'18px' }}>{num} {status}</span>;
    // };


    return (
        // <Box 
        //     style={{ 
        //         backgroundColor: "#F5F5F5",
        //         marginTop: "30px",
        //         width: "42.75%",
        //         height: "392px",
        //         borderRadius: "10px",
        //         cursor: "pointer",
        //         position: "relative",
        //     }}
        // >
        //     <h2 className="mt-widget-title"> Property Rent</h2> 
        //     <h2 className="mt-widget-title"> selected Role</h2>
        //     <Box 
        //         style={{ 
        //             display: 'flex', 
        //             alignItems: 'center', 
        //             justifyContent: 'center',
        //         }}
        //     >
        //     </Box>
        // </Box>

        <ThemeProvider theme={theme}>
        {/* <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop> */}
        {/* {loading && 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {loading && <CircularProgress color="inherit" />}
        </div>    
        }
        {!loading && */}
            <div className="mt-widget-main">
                {/* <CashflowWidget /> */}
                {/* <div className="mt-container">
                    <MaintenanceWidget selectedRole={"OWNER"} maintenanceData={maintenanceStatusData}/>
                    <PropertyRentWidget {...propsForPropertyRentWidget}/>
                    <LeaseWidget selectedRole={"OWNER"}/>
                </div> */}


                {/* RENT WIDGET */}
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