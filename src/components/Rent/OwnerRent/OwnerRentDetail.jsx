import { Box } from "@mui/system";
import { MainContainer, RentTitle, ViewOptionText, getStatusColor } from "../RentComponents/RentComponents";
import { BackIcon, RentDetailBody, RentDetailNavbarTab } from "../RentComponents/RentDetailComponents";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

function OwnerRentDetail(props) {
    const location = useLocation();
    const [index, setIndex] = useState(location.state.index);
    const [propertyStatus, setPropertyStatus] = useState(location.state.status);
    const rentData = location.state.data;

    const navigate = useNavigate();

    const getProperties = (status) => {
        switch (status) {
            case 'UNPAID':
                return rentData.unpaid;
            case 'PAID PARTIALLY':
                return rentData.partial;
            case 'PAID LATE':
                return rentData.late;
            case 'PAID':
                return rentData.paid;
            case 'VACANT':
                return rentData.vacant;
            default:
                return [];
        }
    };
    function incrementIndex() {
        if (index < getProperties(propertyStatus).length - 1) {
            setIndex(index + 1);
        }
    }
    function decrementIndex() {
        if (0 < index) {
            setIndex(index - 1);
        }
    }

    const [rentDetailsData, setRentDetailsData] = useState({});
    const [propertyID, setPropertyID] = useState('');
    useEffect(() => {
        const requestURL = "https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/rentDetails/110-000003";
        axios.get(requestURL).then(res => {
            // console.log(res.data.RentStatus.result);
            const fetchData = res.data.RentStatus.result;
            fetchData.sort((a, b) => {
                const months = {
                    "January": 1,
                    "February": 2,
                    "March": 3,
                    "April": 4,
                    "May": 5,
                    "June": 6,
                    "July": 7,
                    "August": 8,
                    "September": 9,
                    "October": 10,
                    "November": 11,
                    "December": 12
                };
                const comp1 = b.cf_year - a.cf_year;
                const comp2 = months[b.cf_month] - months[a.cf_month];
                return comp1 !== 0 ? comp1 : comp2;
            })
            setRentDetailsData(fetchData);
        });

        let property;
        switch (propertyStatus) {
            case 'UNPAID':
                property = rentData.unpaid;
                break;
            case 'PAID PARTIALLY':
                property = rentData.partial;
                break;
            case 'PAID LATE':
                property = rentData.late;
                break;
            case 'PAID':
                property = rentData.paid;
                break;
            case 'VACANT':
                property = rentData.vacant;
                break;
            default:
                property = [];
                break;
        }
        if (property.length > 0) {
            setPropertyID(property[index].property_id);
        }
    }, [propertyStatus, index, rentData]);

    // console.log('nav', getProperties(propertyStatus)[index]);
    // console.log('nav', rentDetailsData, propertyID);
    return (
        <MainContainer>
            <RentTitle>
                Property Rent
            </RentTitle>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
                onClick={() => {
                    navigate('/ownerRent');
                }}
            >
                <BackIcon />
                <ViewOptionText>
                    Return to Viewing All Listings
                </ViewOptionText>
            </Box>
            <Box sx={{
                display: 'flex',
                marginTop: '10px',
            }}>
                <RentDetailNavbarTab style={getStatusColor("UNPAID")} update={() => { setPropertyStatus("UNPAID"); setIndex(0); }} />
                <RentDetailNavbarTab style={getStatusColor("PAID PARTIALLY")} update={() => { setPropertyStatus("PAID PARTIALLY"); setIndex(0); }} />
                <RentDetailNavbarTab style={getStatusColor("PAID LATE")} update={() => { setPropertyStatus("PAID LATE"); setIndex(0); }} />
                <RentDetailNavbarTab style={getStatusColor("PAID")} update={() => { setPropertyStatus("PAID"); setIndex(0); }} />
                <RentDetailNavbarTab style={getStatusColor("VACANT")} update={() => { setPropertyStatus("VACANT"); setIndex(0); }} />
            </Box>
            <RentDetailBody data={[rentDetailsData, propertyID, index, propertyStatus]} updator={[decrementIndex, incrementIndex]} methods={[getProperties]} />
        </MainContainer>
    )
}
export default OwnerRentDetail;