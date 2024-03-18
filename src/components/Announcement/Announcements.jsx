import { useEffect, useState } from "react";
import "../../css/announcement.css"
import AnnouncementCard from "./AnnouncementCard";
import Searchbar from "./Searchbar";
import axios from "axios";
import SearchFilter from "./SearchFilter";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import AnnouncementPopUp from "./AnnouncementPopUp";
import Button from "@mui/material/Button";

export default function Announcements() {
    const { getProfileId } = useUser();
    const [announcementData, setAnnouncementData] = useState([]);
    const [sentData, setSentData] = useState([]);
    const [receivedData, setReceivedData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [annData, setAnnData] = useState("");

    const result =[
        {
        "announcement_uid": "020-000223",
        "announcement_title": "test formdata LEASE",
        "announcement_msg": "test formdata LEASE",
        "announcement_sender": "110-000096",
        "announcement_date": "2023-10-31 18:43:26",
        "announcement_properties": "200-000114",
        "announcement_mode": "LEASE",
        "announcement_receiver": "110-000096",
        "announcement_type": null,
        "Email": null,
        "Text": null,
        "App": 1
        },
        {
        "announcement_uid": "020-000210",
        "announcement_title": "test notification PROPERTIES",
        "announcement_msg": "test notification PROPERTIES",
        "announcement_sender": "110-000096",
        "announcement_date": "2023-10-30 02:39:13",
        "announcement_properties": "200-000114",
        "announcement_mode": "PROPERTIES",
        "announcement_receiver": "110-000096",
        "announcement_type": null,
        "Email": null,
        "Text": null,
        "App": 1
        },
        {
            "announcement_uid": "020-000210",
            "announcement_title": "test notification contract",
            "announcement_msg": "test notification contract",
            "announcement_sender": "110-000096",
            "announcement_date": "2023-10-30 02:39:13",
            "announcement_properties": "200-000114",
            "announcement_mode": "CONTRACT",
            "announcement_receiver": "110-000096",
            "announcement_type": null,
            "Email": null,
            "Text": null,
            "App": 1
            }
        ];

    useEffect(() => {
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`)
            .then((res) => {
             //   setAnnouncementData(res.data?.received?.result || res.data?.result || []);
             setAnnouncementData(res.data);
             setSentData(res.data.sent.result)
             setReceivedData(res.data.received.result)
            
            setShowSpinner(false);
            });
    }, []);


    const { user, selectedRole, selectRole, Name } = useUser();
    
    const handleAnnouncements = (announcement) => {
            if(announcement.announcement_mode=="PROPERTIES"){
                console.log(announcement.announcement_title)
                navigate("/newOwnerInquiry",{state: {announcementData: announcement}});
            }else if(announcement.announcement_mode=="CONTRACT"){
                // console.log(announcement.announcement_title)      
                // navigate("/propertyContract",{state: {announcementData: announcement}});          
                setAnnData(announcement)
                setShowAnnouncement(true)

            }else if(announcement.announcement_mode=="LEASE"){
                console.log(announcement.announcement_title)    
                setAnnData(announcement)
                setShowAnnouncement(true)

            }
    };

    return (
        <div className="announcement-container">
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="announcement-title">
                <div className="announcement-title-icon">
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z" fill="#160449" />
                    </svg>
                </div>
                <div className="announcement-title-text">
                    {"Notifications"}
                </div>
                <div className="announcement-title-emptybox" />
            </div>
            <hr />
            {/* <div className="announcement-location">
                <div className="announcement-location-icon">
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14.5" cy="14.5" r="14.5" fill="#D9D9D9" />
                    </svg>
                </div>
                <div className="announcement-location-text">
                    103 N. Abel St unit #104
                </div>
            </div> */}
            <div className="announcement-menu-container">
                <Searchbar />
                <Box
                    sx={{
                        width: "100%",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        paddingRight: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        onClick={()=>{navigate("/managerCreateAnnouncement")}}
                        sx={{
                            backgroundColor: "#3F51B5",
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "none",
                            width: "10%",
                            "&:hover, &:focus, &:active": {
                            backgroundColor: "#3F51B5",
                            },
                        }}
                        >              
                        +
                    </Button>
                </Box>
                <div className="announcement-menu-bar">
                    <div className="announcement-view">
                        <div className="announcement-view-icon">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.375" y="4.75" width="14.25" height="11.875" rx="2" stroke="#3D5CAC" strokeWidth="2" />
                                <path d="M2.375 7.91667C2.375 6.828 2.375 6.28367 2.58125 5.86542C2.77598 5.47056 3.09556 5.15098 3.49042 4.95625C3.90867 4.75 4.453 4.75 5.54167 4.75H13.4583C14.547 4.75 15.0913 4.75 15.5096 4.95625C15.9044 5.15098 16.224 5.47056 16.4187 5.86542C16.625 6.28367 16.625 6.828 16.625 7.91667V7.91667H2.375V7.91667Z" fill="#3D5CAC" />
                                <path d="M5.54169 2.375L5.54169 4.75" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
                                <path d="M13.4583 2.375L13.4583 4.75" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="announcement-view-text">
                            View Last 30 Days
                        </div>
                    </div>
                    <div className="announcement-readall">
                        <div className="announcement-readall-text">
                            Read All
                        </div>
                        <div className="announcement-readall-checkbox">
                            <input type="checkbox" />
                        </div>
                    </div>
                </div>
                <div className="announcement-view-text">
                           Sent
                </div>
                <div style={{width:"100%", height: "150px", overflow: "auto"}}>
                 <div className="announcement-list-container">
                    {sentData.length > 0 ? (
                        sentData.map((announcement, i) => {
                            let pageToNavigate= undefined;
                            let navigationParams=undefined;
                            if (announcement.announcement_mode=="CONTRACT"){
                                pageToNavigate= "/propertyContract"
                                navigationParams= {state: {announcementData: announcement}}
                            }
                            {/* else if (announcement.announcement_mode=="LEASE"){
                                pageToNavigate= "/viewLease"
                                navigationParams= { state: { lease_id: property.lease_uid, }}
                            
                            } */}
                            return (
                            <div key={i}>
                                <Box onClick={()=>{handleAnnouncements(announcement)}}>
                                   { <AnnouncementCard data={announcement} role={getProfileId} isContract={announcement.announcement_mode=="CONTRACT"} isLease={announcement.announcement_mode=="LEASE"} pageToNavigate={pageToNavigate}  navigationParams={navigationParams} /> }
                                </Box>
                            </div>)
                    }
                    )) : "No announcements"}
                </div>
                </div>

                <div className="announcement-view-text">
                           Received
                </div>
                <div style={{width:"100%", height: "150px", overflow: "auto"}}>
                 <div className="announcement-list-container">
                    {receivedData.length > 0 ? (
                        receivedData.map((announcement, i) =>{
                            let pageToNavigate= undefined;
                            let navigationParams=undefined;
                            if (announcement.announcement_mode=="CONTRACT"){
                                pageToNavigate= "/propertyContract"
                                navigationParams= {state: {announcementData: announcement}}
                            }
                            {/* else if (announcement.announcement_mode=="LEASE"){
                                pageToNavigate= "/viewLease"
                                navigationParams= { state: { lease_id: property.lease_uid, }}
                            
                            } */}

                            return (
                            <div key={i}>
                                <Box onClick={()=>{handleAnnouncements(announcement)}}>
                                   { <AnnouncementCard data={announcement} role={getProfileId} isContract={announcement.announcement_mode=="CONTRACT"} isLease={announcement.announcement_mode=="LEASE"} pageToNavigate={pageToNavigate}  navigationParams={navigationParams} /> }
                                </Box>
                            </div>)
                    }
                        )) : "No announcements"}
                </div>
                </div>
            </div>
            {/**
            <hr/>
            <SearchFilter/>
             */}
             <AnnouncementPopUp 
                showAnnouncement={showAnnouncement} 
                setShowAnnouncement={setShowAnnouncement} 
                annData={annData} 
                sx={{ width: "50%", height: "50%" }} // Adjust the width and height here
            />
             <Box sx={{paddingBottom:"10%", width: "100%", marginLeft: "10%", marginRight: "10%"}}></Box>
        </div>
    );
}
