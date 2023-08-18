import { Box } from "@mui/system";
import { getStatusColor } from "./RentComponents";

export function BackIcon(props) {

    return (
        <Box sx={{
            marginRight: '10px',
        }}>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7L1.58579 8.41421L0.171572 7L1.58579 5.58579L3 7ZM8 20C6.89543 20 6 19.1046 6 18C6 16.8954 6.89543 16 8 16L8 20ZM6.58579 13.4142L1.58579 8.41421L4.41421 5.58579L9.41421 10.5858L6.58579 13.4142ZM1.58579 5.58579L6.58579 0.585787L9.41421 3.41421L4.41421 8.41421L1.58579 5.58579ZM3 5L13.5 5L13.5 9L3 9L3 5ZM13.5 20L8 20L8 16L13.5 16L13.5 20ZM21 12.5C21 16.6421 17.6421 20 13.5 20L13.5 16C15.433 16 17 14.433 17 12.5L21 12.5ZM13.5 5C17.6421 5 21 8.35786 21 12.5L17 12.5C17 10.567 15.433 9 13.5 9L13.5 5Z" fill="#3D5CAC" />
            </svg>
        </Box>

    )
}

export function RentDetailNavbarTab(props) {
    const color = props.style;
    const update = props.update;

    return (
        <Box sx={{
            width: '20%',
            height: '60px',
            borderRadius: '10px',
            boxShadow: '0px 4px 4px #00000040',
            backgroundColor: color,
        }}
            onClick={() => update()} />
    )
}

const StatusText = (status) => {
    switch (status) {
        case 'UNPAID':
            return 'Not Paid';
        case 'PAID PARTIALLY':
            return 'Paid Partially';
        case 'PAID LATE':
            return 'Paid Late';
        case 'PAID':
            return 'Paid On Time';
        case 'VACANT':
            return 'Vacant';
        default:
            return '';
    }
}

export function RentDetailBody(props) {
    const [rentDetailsData, propertyID, index, propertyStatus] = props.data;
    const [decrementIndex, incrementIndex] = props.updator;
    const [getProperties] = props.methods;

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    }
    const thStyle = {
        fontWeight: 'inherit',
    }

    function formatDate(inputDate) {
        if (inputDate === null) {
            return '';
        }
        const year = inputDate.substring(0, 4);
        const month = inputDate.substring(5, 7);
        const day = inputDate.substring(8, 10);

        return `${month}/${day}/${year}`;
    }

    return (
        <Box sx={{
            position: 'relative',
            borderRadius: '10px',
            boxShadow: '0px 4px 4px #00000040',
            backgroundColor: '#FFFFFF',
            bottom: '30px',

            color: '#160449',
            fontWeight: '600',
        }}>
            <Box
                sx={{
                    width: '100%',
                    height: '20px',
                    borderRadius: '10px 10px 0px 0px',
                    backgroundColor: getStatusColor(propertyStatus),
                }}
            />

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '15px',
                paddingLeft: '10px',
                paddingRight: '10px',
            }}>
                <Box onClick={() => decrementIndex()}>
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z" fill="#160449" />
                    </svg>
                </Box>
                <Box>
                    {index + 1} Of {getProperties(propertyStatus).length} {StatusText(propertyStatus)}
                </Box>
                <Box onClick={() => incrementIndex()}>
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z" fill="#160449" />
                    </svg>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                padding: '20px',
                justifyContent: 'space-evenly',
            }}>
                <Box
                    sx={{
                        minWidth: '130px',
                        height: '130px',
                        marginRight: '20px',
                        backgroundColor: 'grey',
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Box sx={{
                        fontSize: '18px',
                        textDecoration: 'underline',
                    }}>
                        {getProperties(propertyStatus).length > 0 ? (`${getProperties(propertyStatus)[index].property_address}, ${getProperties(propertyStatus)[index].property_city} ${getProperties(propertyStatus)[index].property_state} ${getProperties(propertyStatus)[index].property_zip}, ${getProperties(propertyStatus)[index].property_unit}`) : (<></>)}
                    </Box>
                    <Box sx={{
                        marginBottom: '0px',
                        marginTop: 'auto',
                        fontSize: '14px',
                    }}>
                        <Box>
                            {getProperties(propertyStatus).length > 0 ? (`$ ${getProperties(propertyStatus)[index].pur_amount_due}`) : (<></>)}
                        </Box>
                        <Box>
                            {getProperties(propertyStatus).length > 0 ? (`due ${formatDate(getProperties(propertyStatus)[index].pur_due_date)}`) : (<></>)}
                        </Box>
                        <Box>
                            11 Days Overdue
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                fontSize: '13px',
                fontWeight: '600',
                color: '#3D5CAC',
            }}>
                <Box sx={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#160449',
                }}>
                    Rent History
                </Box>
                <table style={tableStyle}>
                    <tr style={{ "border-bottom": "1px solid #3D5CAC" }}>
                        <th style={thStyle}>
                            Month
                        </th>
                        <th style={thStyle}>
                            Paid
                        </th>
                        <th style={thStyle}>
                            Amount
                        </th>
                        <th style={thStyle}>
                            Rent Status
                        </th>
                        <th style={thStyle}>
                            Fees
                        </th>
                    </tr>
                    {rentDetailsData.length > 0 ? (
                        rentDetailsData.map((rentDetails, i) => {
                            const month = rentDetails.cf_month;
                            const paid = rentDetails.total_paid !== null ? '$' + rentDetails.total_paid : '$0';;
                            const amount = rentDetails.pay_amount !== null ? '$' + rentDetails.pay_amount : '$0';
                            const payment_status = rentDetails.payment_status;

                            return (
                                <>
                                    {
                                        rentDetails.property_id === propertyID ? (
                                            <PropertyRow data={[month, paid, amount, payment_status, ""]} />
                                        ) : (<></>)
                                    }
                                </>
                            )
                        })
                    ) : (<></>)

                    }
                </table>
            </Box>
        </Box>
    )
}
function PropertyRow(props) {
    const [month, paid, amount, status, fees] = props.data;
    const tdStyle = {
        textAlign: 'center',
    }

    function getMonthAbbreviation(monthName) {
        const monthIndexMap = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
        };

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const index = monthIndexMap[monthName];
        if (index !== undefined) {
            return months[index];
        } else {
            return "Invalid Month";
        }
    }

    return (
        <tr>
            <td style={tdStyle}>
                {getMonthAbbreviation(month)}
            </td>
            <td style={tdStyle}>
                {paid}
            </td>
            <td style={tdStyle}>
                {amount}
            </td>
            <td style={tdStyle}>
                <PropertyStatus data={status} />
            </td>
            <td style={tdStyle}>
                {fees}
            </td>
        </tr>
    );
}
function PropertyStatus(props) {
    const status = props.data;
    const color = status !== null ? getStatusColor(status) : '#FFFFF';
    return (
        <Box sx={{
            backgroundColor: color,
            color: '#FFFFFF',
            textAlign: 'left',
            paddingLeft: '5px',
        }}>
            {StatusText(status)}
        </Box>
    );
}