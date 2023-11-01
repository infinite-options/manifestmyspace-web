import { Accordion, AccordionDetails, AccordionSummary, Modal, Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import SelectProperty from "../SelectProperty";
import AllOwnerIcon from './AllOwnerIcon.png';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

function PMLeases(props) {
    const { getProfileId } = useUser();
    // Select Property Tab
    const [open, setOpen] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const currentMonth = new Date().getMonth()+1; // Adding 1 because getMonth() returns 0-based index
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const [moveoutCount, setMoveoutCount] = useState(0);
    const [leaseDate, setLeaseDate] = useState([]);
    useEffect(() => {
        function getMoveoutNum(leases) {
            let num = 0;
            for (let i = 0; i < leases.length; i++) {
                const lease = leases[i];
                if(lease.lease_renew_status === 'MOVING') {
                    num++;
                }
            }
            return num;
        }
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`)
            .then((res) => {
                // console.log(res.data['Lease Details'].result);
                const fetchData = res.data['Lease_Details'].result;
                console.log("leases fetchData", fetchData)

                // Parse lease_end strings to Date objects
                fetchData.forEach((obj) => {
                    obj.lease_end = new Date(obj.lease_end);
                });
                
                // Sort the array by lease_end Date objects
                fetchData.sort((a, b) => a.lease_end - b.lease_end);
                
                // Convert the Date objects back to the original string format
                fetchData.forEach((obj) => {
                    const year = obj.lease_end.getFullYear();
                    const month = String(obj.lease_end.getMonth() + 1).padStart(2, "0");
                    const day = String(obj.lease_end.getDate()).padStart(2, "0");
                    obj.lease_end = `${year}-${month}-${day}`;
                });
                console.log("leases sorted FetchData", fetchData)

                const leases = new Map([]);
                let moveoutNum = 0;
                fetchData.forEach((lease) => {
                    const date = lease.lease_end.slice(0, 7);
                    if (leases.get(date) === undefined) {
                        leases.set(date, [lease]);
                    } else {
                        const arr = leases.get(date);
                        arr.push(lease);
                        leases.set(date, arr);
                        moveoutNum += getMoveoutNum(arr);                        
                    }
                });
                setLeaseDate(leases);
                setMoveoutCount(moveoutNum);
                setShowSpinner(false);
            });
    }, []);

    return (
        <Box>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{
                fontFamily: 'Source Sans Pro',
                backgroundColor: '#F2F2F2',
                fontSize: '14px',
                color: '#3D5CAC',
                justifyContent: 'center',
                padding: '10px',
                paddingLeft: '20px',
                paddingRight: '20px',
            }}>
                <Box sx={{
                    color: '#160449',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}>
                    Leases Expiring and Move-Outs
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    marginTop: '10px',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '2px',
                        }}>
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3.125" y="6.25" width="18.75" height="15.625" rx="2" stroke="#3D5CAC" stroke-width="2" />
                                <path d="M3.125 10.25C3.125 8.36438 3.125 7.42157 3.71079 6.83579C4.29657 6.25 5.23938 6.25 7.125 6.25H17.875C19.7606 6.25 20.7034 6.25 21.2892 6.83579C21.875 7.42157 21.875 8.36438 21.875 10.25V10.4167H3.125V10.25Z" fill="#3D5CAC" />
                                <path d="M7.29166 3.125L7.29166 6.25" stroke="#3D5CAC" stroke-width="2" stroke-linecap="round" />
                                <path d="M17.7083 3.125L17.7083 6.25" stroke="#3D5CAC" stroke-width="2" stroke-linecap="round" />
                            </svg>
                        </Box>
                        <Box>
                            Next 1 Year
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '2px',
                        }}>
                            <img src={AllOwnerIcon} alt="Owner Icon" style={{ width: '22px', height: '22px' }} />
                        </Box>
                        <Box>
                            All Owners
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '2px',
                        }}>
                            <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.49423 10.97C5.20833 11.6165 5.20833 12.3519 5.20833 13.8228V18.4166C5.20833 20.4594 5.20833 21.4807 5.81852 22.1153C6.37694 22.6961 7.24682 22.7454 8.89583 22.7495V17.3333C8.89583 16.2201 9.77331 15.25 10.9375 15.25H14.0625C15.2267 15.25 16.1042 16.2201 16.1042 17.3333V22.7495C17.7532 22.7454 18.6231 22.6961 19.1815 22.1153C19.7917 21.4807 19.7917 20.4594 19.7917 18.4166V13.8228C19.7917 12.3519 19.7917 11.6165 19.5058 10.97C19.2199 10.3236 18.6829 9.84493 17.6091 8.88768L16.5674 7.9591C14.6265 6.22888 13.656 5.36377 12.5 5.36377C11.344 5.36377 10.3735 6.22888 8.43255 7.9591L7.39088 8.88768C6.31704 9.84493 5.78012 10.3236 5.49423 10.97ZM14.1042 22.7499V17.3333C14.1042 17.2974 14.091 17.2737 14.0782 17.2604C14.0719 17.2538 14.067 17.2512 14.0653 17.2505L14.0652 17.2504C14.0644 17.2501 14.0642 17.25 14.0625 17.25H10.9375C10.9358 17.25 10.9355 17.2501 10.9348 17.2504L10.9347 17.2505C10.933 17.2512 10.9281 17.2538 10.9218 17.2604C10.909 17.2737 10.8958 17.2974 10.8958 17.3333V22.7499H14.1042Z" fill="#3D5CAC" />
                            </svg>
                        </Box>
                        <Box onClick={handleOpen}>
                            Property
                        </Box>
                    </Box>
                </Box>
                <Accordion sx={{
                    backgroundColor: '#A52A2A',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    marginTop: '15px',
                    marginBottom: '15px',
                    boxShadow: '0px 4px 4px #00000032',
                }}>
                    <AccordionSummary sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                    }}
                        expandIcon={
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F2F2F2" stroke-width="2.5" />
                            </svg>
                        }>
                        <Box>
                            Move-Outs
                        </Box>
                        <Box sx={{
                            marginLeft: 'auto',
                            marginRight: '5px',
                        }}>
                            {moveoutCount}
                        </Box>
                    </AccordionSummary>
                    {[...leaseDate.keys()].map((date, i) => {
                        const leases = leaseDate.get(date);
                        return (
                            <>
                                {
                                    leases.map((lease, j) => {
                                        return (
                                            <>
                                                {
                                                    (lease.lease_renew_status === 'MOVING') ?
                                                        (<AccordionDetails>
                                                            <Box>
                                                                {`${lease.lease_end}:`}
                                                            </Box>
                                                            <Box sx={{
                                                                fontWeight: 'bold',
                                                                borderBottomStyle: 'solid',
                                                                borderWidth: '1px',
                                                                width: 'fit-content',
                                                            }}>
                                                                {`${lease.property_address}, ${lease.property_city} ${lease.property_state} ${lease.property_zip}`}
                                                            </Box>
                                                        </AccordionDetails>)
                                                        : (<></>)
                                                }
                                            </>
                                        )

                                    }
                                    )
                                }
                            </>
                        );
                    })}
                </Accordion>
                {[...leaseDate.keys()].map((date, i) => {
                    const leases = leaseDate.get(date);
                    let tabColor = '#FFFFFF';
                    const endMonth = date.split('-')[1];
                    // console.log("lease endDate ", date, Number(endMonth), Number(currentMonth))
                    if(Number(currentMonth) === Number(endMonth)){
                        tabColor = '#F87C7A'
                    } else if(Number(currentMonth+1) === Number(endMonth+1)){
                        tabColor = '#FFC614'
                    }
                    return (
                        <LeaseMonth key={i} data={[date, leases]} style={[tabColor]} />
                    );
                })}
            </Box>
            <Modal sx={{
                overflowY: 'scroll',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
                open={open}
                disableScrollLock={false}
            >
                <Box sx={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <SelectProperty closeTab={handleClose} />
                </Box>

            </Modal>
        </Box>
    );
}

function LeaseMonth(props) {
    const [date, leaseData] = props.data;
    let [year, month] = ['-', '-'];
    const [tabColor] = props.style;

    function parseDate(data) {
        const dateList = data.split('-');
        function getMonth(num) {
            const months = [
                'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
            ];

            const index = parseInt(num, 10) - 1;

            if (index >= 0 && index < months.length) {
                return months[index];
            } else {
                return 'N/A';
            }
        }
        return [dateList[0], getMonth(dateList[1])]
    }
    if (leaseData.lease_end !== null) {
        [year, month] = parseDate(date);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '20px',
        }}>
            <Box sx={{
                width: '10%',
                backgroundColor: tabColor,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '5px',
                paddingBottom: '10px',

                fontSize: '15px',
                color: '#160449',
            }}>
                <Box>
                    {month}
                </Box>
                <Box>
                    {year}
                </Box>
                <Box sx={{
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    marginBottom: '0px',
                }}>
                    {leaseData.length}
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
            }}>
                {leaseData.map((lease, i) => (
                    <LeaseComponent key={i} data={lease} />
                ))}
            </Box>
        </Box>
    );
}
function LeaseComponent(props) {
    const leaseData = props.data;

    function getLeaseStatusText(status) {
        switch (status) {
            case 'MOVING':
                return 'Moving out';
            case 'RENEWED':
                return 'Renewed to';
            default:
                break;
        }
    }
    function getLeaseStatusIcon(status) {
        const moveoutIcon =
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 6.5L6.5 19.5" stroke="#3D5CAC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.5 6.5L19.5 19.5" stroke="#3D5CAC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>;
        const renewIcon =
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.20833 14.5833L8.60809 17.1331C9.03678 17.4547 9.64272 17.3811 9.98205 16.9664L18.75 6.25" stroke="#3D5CAC" stroke-width="2.5" stroke-linecap="round" />
            </svg>;
        const nullIcon =
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="#3D5CAC" stroke-width="2" />
            </svg>;
        let outputIcon;
        switch (status) {
            case 'MOVING':
                outputIcon = moveoutIcon;
                break;
            case 'RENEWED':
                outputIcon = renewIcon;
                break;
            default:
                outputIcon = nullIcon;
                break;
        }
        return outputIcon;
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: '10px',
        }}>
            <Box sx={{
                marginLeft: '0px',
                marginRight: 'auto',
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                    borderBottomStyle: 'solid',
                    borderWidth: '1px',
                    width: 'fit-content',
                }}>
                    {`${leaseData.property_address} ${leaseData.property_unit}, ${leaseData.property_city} ${leaseData.property_state} ${leaseData.property_zip}`}
                </Box>
                <Box>
                    {leaseData.lease_end}: {getLeaseStatusText(leaseData.lease_renew_status)}
                </Box>
            </Box>
            <Box sx={{
                marginLeft: 'auto',
                marginRight: '0px',
            }}>
                {getLeaseStatusIcon(leaseData.lease_renew_status)}
            </Box>
        </Box>
    );
}

export default PMLeases;