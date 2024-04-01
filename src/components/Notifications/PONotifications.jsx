import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import {
    ThemeProvider,
    Box,
    Stack,
    Button,
} from '@mui/material';
import theme from '../../theme/theme';
import CircularProgress from "@mui/material/CircularProgress";
import APIConfig from "../../utils/APIConfig";

function PONotifications(props) {
    const { getProfileId } = useUser();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        console.log("New Owner Inquiry UseEffect");
        
        const fetchData = async () => {
            setShowSpinner(true);
            
            //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/600-000051`);
            const response = await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`);
            const announcementData = await response.json();

            console.log(announcementData);
            
            if(announcementData!==undefined){
                setAnnouncements(announcementData.result);
            }
            setShowSpinner(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("ANNOUNCEMENT DATA:");
        console.log(announcements);
    }, [announcements]);
    
    const handleBackBtn = () => {
        navigate(-1);
    };

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{
                backgroundColor: '#F2F2F2',
                borderRadius: '10px',
                margin: '25px',
                padding: '15px',
                fontFamily: 'Source Sans Pro',
            }}>
                <Stack 
                    flexDirection ="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        sx={{ padding: '0', minWidth: '150px' }}
                        onClick={handleBackBtn}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                                fill="#3D5CAC"
                            />
                        </svg>
                    </Button>
                    <Box sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'text.darkblue',
                            padding: '0',
                            minWidth: '300px',
                        }}
                    >
                        Notifications
                    </Box>
                </Stack>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'flex-end',
                    alignItems: 'center',
                    paddingTop: '0px',
                    width: '100%',
                }}>
                    
                    {/* <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                        }}
                    >
                        Show Completed
                    </Box> */}
                    
                </Box>
                
                {announcements.map((announcement) => (
                    <AnnouncementCard data={announcement} key={announcement.announcement_uid}/>
                
                ))}
              
            </Box>
        </ThemeProvider>
    )

}

function AnnouncementCard(props){
    const announcement = props.data;

    const navigate = useNavigate();

    return (<Box
                        sx={{
                            display:'flex',
                            flexDirection: "column",
                            backgroundColor: "#D6D5DA",
                            borderRadius: "10px",
                            padding: "5px",
                            marginBottom: "10px",
                            fontSize: "13px",
                            color: 'text.darkblue',
                        }}
                        key={announcement.announcement_uid}
                        onClick={() => {
                            navigate('/propertyContract', {state: {announcementData: announcement}});
                        }}
                    >     
                    
                        <Box sx={{
                                paddingTop:"2%",
                                fontWeight: 'bold',
                            }}
                        >
                        {/* { propertyDisplayValue =   property.property_unit+" "+property.property_address+" "+property.property_city+" "+property.property_state+" "+property.property_zip}  */}
                        {announcement.announcement_title}
                        </Box>
                        <Box sx={{
                                paddingTop:"2%",
                            }}
                        >
                        {/* { propertyDisplayValue =   property.property_unit+" "+property.property_address+" "+property.property_city+" "+property.property_state+" "+property.property_zip}  */}
                        {/* {announcement.announcement_title} */}
                        { (calculateTimeDiff(announcement.announcement_date))}
                        </Box>
                    </Box>
    );

} 

const calculateTimeDiff = (announcement_date) => {
  //  const announcement_date = new Date(announcementData["announcement_date"]);
    // const announcement_date = new Date(Date.UTC(
    //     announcementData["announcement_date"].getFullYear(),
    //     announcementData["announcement_date"].getMonth(),
    //     announcementData["announcement_date"].getDate(),
    //     announcementData["announcement_date"].getHours(),
    //     announcementData["announcement_date"].getMinutes(),
    //     announcementData["announcement_date"].getSeconds()
    // ));
    if (announcement_date === null) {
        return "<TIME AGO>";
    }
    const now = new Date();
    var dateObject = new Date(announcement_date);

    // Define options for formatting the date
    var options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'long'
    };
    
    // Format the date as a string in the desired format
    var formattedDate = dateObject.toLocaleDateString('en-US', options);
    const timeDiff = now - dateObject;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let durationString;
    if (days > 0) {
        durationString = `${days} days ago`;
    } else if (hours > 0) {
        durationString = `${hours} hours ago`;
    } else if (minutes > 0) {
        durationString = `${minutes} minutes ago`;
    } else {
        durationString = `${seconds} seconds ago`;
    }

    //console.log(now, announcement_date, announcementData["announcement_date"], durationString, seconds, minutes, hours, days);
    return durationString;
};


export default PONotifications;