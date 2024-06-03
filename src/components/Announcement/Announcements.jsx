import { useEffect, useState } from "react";
import "../../css/announcement.css";
import AnnouncementCard from "./AnnouncementCard";
import Searchbar from "./Searchbar";
import axios from "axios";
import SearchFilter from "./SearchFilter";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import AnnouncementPopUp from "./AnnouncementPopUp";
import Button from "@mui/material/Button";
import { Paper, Box, InputBase, Stack, ThemeProvider, FormControl, Select, MenuItem, FormControlLabel, Typography, TextField, IconButton, Checkbox, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import APIConfig from "../../utils/APIConfig";


// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& .MuiFilledInput-root": {
//       backgroundColor: "#F2F2F2", // Update the background color here
//       borderRadius: 10,
//       height: 30,
//       marginBlock: 10,
//       paddingBottom: '15px', // Add this line for vertically center alignment
//       "&:hover, &:focus, &:active": {
//         backgroundColor: "#F2F2F2", // Change background color on hover, focus and active states
//       },
//     },
//   },
// }));


export default function Announcements() {
  console.log("intial commit");
  const { user, getProfileId, selectedRole, selectRole, Name } = useUser();
  const [announcementData, setAnnouncementData] = useState([]);
  const [sentData, setSentData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [readData, setReadData] = useState([]);
  const [filteredSentData, setFilteredSentData] = useState([]);
  const [filteredReceivedData, setFilteredReceivedData] = useState([]);
  const [filteredReadData, setFilteredReadData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  // If announcements need to be filtered by owner_uid after navigation from PmQuotesLists.jsx
  const location = useLocation();
  const owner_uid_filter = location?.state?.owner_uid;
  //
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [annData, setAnnData] = useState("");
  const [readAllChecked, setReadAllChecked] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [clickedAnnouncementUid, setClickedAnnouncementUid] = useState(null);

  // const [announcementClicked, setAnnouncementClicked] = useState(false);
  const [announcementClicked, setAnnouncementClicked] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSentData(sentData);
      setFilteredReceivedData(receivedData);
      setFilteredReadData(readData);
    } else {
      setFilteredSentData(sentData.filter((announcement) => announcement.announcement_title.toLowerCase().includes(searchTerm.toLowerCase())));
      setFilteredReceivedData(receivedData.filter((announcement) => announcement.announcement_title.toLowerCase().includes(searchTerm.toLowerCase())));
      setFilteredReadData(readData.filter((announcement) => announcement.announcement_title.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, sentData, receivedData, readData]);


  useEffect(() => {
    setShowSpinner(true);
    axios.get(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`).then((res) => {
      //   setAnnouncementData(res.data?.received?.result || res.data?.result || []);
      // setAnnouncementData(res.data);

      // let sent_data = (!res.data.sent.result.announcement_read) ? res.data.sent.result : null;
      // let received_data = (!res.data.received.result.announcement_read) ? res.data.received.result : null;
      let sent_data = res.data.sent.result;
      let received_data = res.data.received.result.filter(item => item.announcement_read === null);
      let read_data = res.data.received.result.filter(item => item.announcement_read != null);

      console.log("res.data?",res.data)
      console.log("received_data before filter???", received_data)
      console.log("sent_data before filter???", sent_data)
      console.log("read_data before filter???", read_data)
      console.log("owner_uid_filter}",typeof(owner_uid_filter))
      if (owner_uid_filter) {
        console.log("inside owner_uid_filter>>");
        // If announcements need to be filtered by owner_uid after navigation from PmQuotesLists.jsx
        received_data = received_data.filter((record) => record.announcement_sender === owner_uid_filter);
        read_data = read_data.filter((record) => record.announcement_sender === owner_uid_filter);
        sent_data = sent_data.filter((record) => record.announcement_receiver === owner_uid_filter);
        console.log("received_data after filter???", received_data)
        console.log("sent_data after filter???", sent_data)
        console.log("read_data after filter???", read_data)
      }
      
      sent_data.sort((a, b) => {
        if (a.announcement_uid < b.announcement_uid) return 1;
        if (a.announcement_uid > b.announcement_uid) return -1;
        return 0;
      });
      received_data.sort((a, b) => {
        if (a.announcement_uid < b.announcement_uid) return 1;
        if (a.announcement_uid > b.announcement_uid) return -1;
        return 0;
      });
      read_data.sort((a, b) => {
        if (a.announcement_uid < b.announcement_uid) return 1;
        if (a.announcement_uid > b.announcement_uid) return -1;
        return 0;
      });
      setSentData(sent_data);
      setReceivedData(received_data);
      setReadData(read_data);
      setShowSpinner(false);
    });
  }, [owner_uid_filter, getProfileId]);

  // Handle Navigation to the Contacts

  const [dataDetails, setDataDetails] = useState({});


  const fetchContactData = async () => {
    const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
    setShowSpinner(true);
    let data = null;

    await axios
      .get(url)
      .then((resp) => {
        // console.log("selectedRole - ", selectedRole);
        if (selectedRole === "MANAGER") {
          data = resp.data["management_contacts"];
          setDataDetails((prev) => {
            return { ...prev, Tenant: data["tenants"], Owner: data["owners"], Maintenance: data["maintenance"] };
          });
        } else if (selectedRole === "OWNER") {
          data = resp.data["owner_contacts"];
          setDataDetails((prev) => {
            return { ...prev, Tenant: data["tenants"], Manager: data["managers"] };
          });
        } else if (selectedRole === "MAINTENANCE") {
          data = resp.data["maintenance_contacts"];
          setDataDetails((prev) => {
            return { ...prev, Tenant: data["tenants"], Manager: data["managers"] };
          });
        }

        setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        setShowSpinner(false);
      });
    console.log(dataDetails);
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // function onClick
  //

  // const clearSearch = () => {
  //   setSearchTerm("");
  //   setFilteredItems(propertyList);
  // };

  //Function called when any announcement item is clicked 
  const handleAnnouncements = async (announcement) => {
    console.log("inside handleAnnouncements")
    console.log(announcement)
    const currentTimestamp = new Date().toISOString();
    // setAnnouncementClicked(true);
    setAnnouncementClicked(announcement);
    console.log("announcementClicked>>>", announcementClicked)

    if (receivedData.some(item => item.announcement_uid === announcement.announcement_uid)) {
      try {
        console.log("inside 1st try block,,,")
        const response = await fetch(`${APIConfig.baseURL.dev}/announcements`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                      "announcement_uid": [announcement.announcement_uid]
                      // announcement_uid: announcement.announcement_uid,
                      // announcement_read: currentTimestamp,
                    }),
                  });
        // const response = await axios.put(`${APIConfig.baseURL.dev}/announcements`, {
        //   announcement_uid: announcement.announcement_uid,
        //   announcement_read: currentTimestamp,
        // });

      //   // If the update is successful, update the state accordingly
        if (response.status === 200) {
          console.log("response success")
          console.log("before mapping date receivedData.....",receivedData)
          console.log("before mapping date sentData.....",sentData)
          console.log("announcement.announcement_uid>>",announcement.announcement_uid)
          // console.log("prevData>>",prevData)
          // console.log("ann.announcement_uid",ann.announcement_uid);
           setReceivedData((prevData) => 
            prevData.map((ann) => 
              ann.announcement_uid === announcement.announcement_uid ? { ...ann, announcement_read: currentTimestamp } : ann
        )
          );
          
          
        }
      } catch (error) {
        console.error("Error updating announcement:", error);
      }
    }
      // console.log("after mapping date receivedData.....",receivedData)
      // console.log("after mapping date sentData.....",sentData)



    if (announcement.announcement_mode == "PROPERTIES") {
      console.log(announcement.announcement_title);
      navigate("/newOwnerInquiry", { state: { announcementData: announcement } });
    } else if (announcement.announcement_mode == "CONTRACT") {
      // console.log(announcement.announcement_title)
      // navigate("/propertyContract",{state: {announcementData: announcement}});
      setAnnData(announcement);
      setShowAnnouncement(true);
    } else if (announcement.announcement_mode == "LEASE") {
      console.log(announcement.announcement_title);
      setAnnData(announcement);
      setShowAnnouncement(true);
    }
  };

  const handleAnnouncementClick = (announcement) => {
    setClickedAnnouncementUid(announcement.announcement_uid);
    // Handle additional logic when an announcement is clicked
    handleAnnouncements(announcement);
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="announcement-container">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        className="announcement-title"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        
        <Box
          className="announcement-title-text"
          sx={{
            width: "95%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Box className="announcement-title-text">{"Announcements 1"}</Box>
        </Box>
        <Box
          sx={{
            width: "5%",
            height: "30px",
            paddingTop: "15px",
            paddingBottom: "5px",
            paddingRight: "10px",
            paddingLeft: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              navigate("/managerCreateAnnouncement");
            }}
            sx={{
              backgroundColor: "#3F51B5",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              width: "100%",
              "&:hover, &:focus, &:active": {
                backgroundColor: "#3F51B5",
              },
            }}
          >
            +
          </Button>
        </Box>

      </Box>

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

        <Paper
            style={{
              margin: "30px",
              padding: 20,
              borderRadius: "7px",
              backgroundColor: theme.palette.primary.main,
              // backgroundColor: theme.palette.primary.pink,
              // width: "85%", // Occupy full width with 25px margins on each side
              
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
          >
      <div className="announcement-searchbar-container">
        {/* <Searchbar /> */}
        
        <div className="announcement-searchbar" >
          <IconButton type="submit" style={{ padding: "10px", }} onClick={() => console.log("test")} aria-label="search">
                <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, zIndex: 1000, flexGrow: 1, }}
            placeholder="Search announcements..."
            // inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            // onChange={handleSearchChange}
            onChange={(e) => setSearchTerm(e.target.value)}
            color={theme.typography.common.blue}
          />
          {/* {searchTerm && (
            <IconButton aria-label="clear" onClick={clearSearch}>
              <CloseIcon />
            </IconButton>
          )} */}
          {/* <TextField
            type="small"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
               
              marginTop: "10px",
              "& input": {
                height: "20px",
                padding: "5px",
                // opacity:"25%",
                // backgroundColor: "#A9AAAB",
                // borderRadius: "7px",
              },
            }}
          /> */}
        </div>
      </div>
      <div className="announcement-menu-container">
        <div className="announcement-menu-bar">
          <div className="announcement-view">
            <div className="announcement-view-icon">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.375" y="4.75" width="14.25" height="11.875" rx="2" stroke="#3D5CAC" strokeWidth="2" />
                <path
                  d="M2.375 7.91667C2.375 6.828 2.375 6.28367 2.58125 5.86542C2.77598 5.47056 3.09556 5.15098 3.49042 4.95625C3.90867 4.75 4.453 4.75 5.54167 4.75H13.4583C14.547 4.75 15.0913 4.75 15.5096 4.95625C15.9044 5.15098 16.224 5.47056 16.4187 5.86542C16.625 6.28367 16.625 6.828 16.625 7.91667V7.91667H2.375V7.91667Z"
                  fill="#3D5CAC"
                />
                <path d="M5.54169 2.375L5.54169 4.75" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
                <path d="M13.4583 2.375L13.4583 4.75" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="announcement-view-text">View Last 30 Days</div>
          </div>
          <div className="announcement-readall">
            <div className="announcement-readall-text">Read All</div>
            <div className="announcement-readall-checkbox" onChange={(e) => {  setReadAllChecked(e.target.checked);}}>
              <input type="checkbox" />
              

            </div>
          </div>
        </div>
        <Grid container spacing={isMobile ? 1 : 3}  >
          <Grid item xs={16} md={3.9} sx={{marginLeft: "5px", height: "100%",}}className="announcement-category">
            {/* <DashboardTab fullHeight={!isMobile ? true : false}> */}
        <Box width="100%" >            
        <div style={{  marginBottom: "20px", fontSize: "20px" }} className="announcement-view-text">
          Received
        </div>
        <div style={{  marginBottom: "30px", width: "100%", overflow: "auto",}}> {/* backgroundColor:"#D9D9D9", opacity:"100%", borderRadius:"7px" }}>*/}
          <div className="announcement-list-container" style={{ maxHeight: "100%", overflowY: "auto",  width:"100%"}} >
          {/* <div className={`announcement-list-container ${announcementClicked ? 'clicked' : ''}`} style={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}> */}
          {/* <div className="announcement-list-card" style={{ maxHeight: "100%", overflowY: "auto",  width:"100%", backgroundColor: announcementClicked ? "red" : "transparent",}}> */}
            {filteredReceivedData.length > 0
              ? filteredReceivedData.map((announcement, i) => {
                  let role = announcement?.sender_role;
                  let pageToNavigate;
                  let navigationParams;
                  try {
                    let indx = dataDetails[role].findIndex((contact) => contact.contact_uid === announcement?.announcement_sender);
                    if (indx >= 0) {
                      pageToNavigate = `/${role.toLowerCase()}ContactDetails`;
                      navigationParams = {
                        state: {
                          dataDetails: dataDetails[role],
                          tab: role,
                          index: indx,
                          viewData: dataDetails[role],
                        },
                      };
                    }
                  } catch (e) {
                    // console.log(e);
                  }

                  return (

                    // {receivedData.map((announcement) => (
                    //   <div key={announcement.announcement_uid} onClick={() => handleAnnouncements(announcement)}>
                    //     <input
                    //       type="checkbox"
                    //       id={`checkbox-${announcement.announcement_uid}`}
                    //       checked={announcement.announcement_read !== null}
                    //       readOnly
                    //     />
                    //     <span>{announcement.announcement_title}</span>
                    //     {/* other elements */}
                    //   </div>
                    // ))}


                    // <div className="announcement-cards">
                    //     {receivedData.length > 0 ? (
                    //       receivedData.map((announcement, index) => (
                    //         <div
                    //           key={index}
                    //           onClick={() => handleAnnouncements(announcement)}
                    //           style={{
                    //             cursor: "pointer",
                    //             backgroundColor: announcement.announcement_read ? "#E0E0E0" : announcementClicked === announcement ? "#ADD8E6" : "white",
                    //           }}
                    //         >
                    //           <AnnouncementCard
                    //             title={announcement.announcement_title}
                    //             message={announcement.announcement_message}
                    //             date={announcement.announcement_date}
                    //             checked={announcement.announcement_read || announcementClicked === announcement}
                    //           />
                    //         </div>
                    //       ))
                    //     ) : (
                    //       <div className="no-announcements">No Announcements</div>
                    //     )}
                    //   </div>

                    <div key={i} className={`announcement-card-content ${announcementClicked && announcementClicked === announcement.announcement_uid ? 'announcement-clicked' : ''}`}
                    onClick={() => handleAnnouncements(announcement)}
                              style={{
                                cursor: "pointer",
                                backgroundColor: announcement.announcement_read ? "#E0E0E0" : announcementClicked === announcement ? "#ADD8E6" : "white",
                              }}
                    >
                      {/* <Box
                        onClick={() => {
                           handleAnnouncements(announcement);
                        }}
                        sx={{
                          backgroundColor: announcement === announcementClicked ? 'blue' : 'transparent',
                          transition: 'background-color 0.3s ease',
                          borderRadius: '7px',
                          cursor: 'pointer',
                        }}
                      > */}
                        {
                          <AnnouncementCard 
                          // key={announcement.announcement_uid}
                          // announcement={{ ...announcement, isClicked: announcement.announcement_uid === clickedAnnouncementUid }}
                          // onAnnouncementClick={handleAnnouncementClick}
                            data={announcement}
                            role={getProfileId}
                            isContract={announcement.announcement_mode == "CONTRACT"}
                            isLease={announcement.announcement_mode == "LEASE"}
                            pageToNavigate={pageToNavigate}
                            navigationParams={navigationParams}
                            sent_or_received={"Received"}
                            readAllChecked={readAllChecked}
                            showCheckbox={true}
                          />
                        }

                      {/* </Box> */}
                    </div>
                  );
                })
              : "No announcements"}
          </div>
        {/* </div> */}
        </div>

          {/* </DashboardTab> */}
          </Box>
          </Grid>

          <Grid item xs={16} md={3.9} style={{ marginLeft: isMobile ? '0px' : '10px', }} className="announcement-category">

        <div style={{ marginBottom: "20px", fontSize: "20px", }} className="announcement-view-text">
          Read
        </div>
        <div style={{ width: "100%", height: "420px", overflow: "auto",}}>
          <div className="announcement-list-container">
            {filteredReadData.length > 0
              ? filteredReadData.map((announcement, i) => {
                  let role = announcement?.sender_role;
                  let pageToNavigate;
                  let navigationParams;
                  try {
                    let indx = dataDetails[role].findIndex((contact) => contact.contact_uid === announcement?.announcement_sender);
                    if (indx >= 0) {
                      pageToNavigate = `/${role.toLowerCase()}ContactDetails`;
                      navigationParams = {
                        state: {
                          dataDetails: dataDetails[role],
                          tab: role,
                          index: indx,
                          viewData: dataDetails[role],
                        },
                      };
                    }
                  } catch (e) {
                    // console.log(e);
                  }

                  return (
                    <div key={i}>
                      <Box
                        onClick={() => {
                          handleAnnouncements(announcement);
                        }}
                      >
                        {
                          <AnnouncementCard 
                            data={announcement}
                            role={getProfileId}
                            isContract={announcement.announcement_mode == "CONTRACT"}
                            isLease={announcement.announcement_mode == "LEASE"}
                            pageToNavigate={pageToNavigate}
                            navigationParams={navigationParams}
                            sent_or_received={"Received"}
                            showCheckbox={false}
                          />
                        }
                        
                      </Box>
                    </div>
                  );
                })
              : "No announcements"}
          </div>
        </div>
        
          </Grid>

          <Grid item xs={16} md={3.9} style={{ marginLeft: isMobile ? '0px' : '10px', }} className="announcement-category">

        <div style={{ marginBottom: "20px", fontSize: "20px", }} className="announcement-view-text">
          Sent
        </div>
        <div style={{ width: "100%", height: "420px", overflow: "auto",}}>
          <div className="announcement-list-container">
            {filteredSentData.length > 0
              ? filteredSentData.map((announcement, i) => {
                  let role = announcement?.receiver_role;
                  let pageToNavigate;
                  let navigationParams;
                  try {
                    let indx = dataDetails[role].findIndex((contact) => contact.contact_uid === announcement?.announcement_receiver);
                    if (indx >= 0) {
                      pageToNavigate = `/${role.toLowerCase()}ContactDetails`;
                      navigationParams = {
                        state: {
                          dataDetails: dataDetails[role],
                          tab: role,
                          index: indx,
                          viewData: dataDetails[role],
                        },
                      };
                    }
                  } catch (e) {
                    // console.log(e);
                  }

                  return (
                    <div key={i}>
                      <Box
                        onClick={() => {
                          handleAnnouncements(announcement);
                        }}
                      >
                        {
                          <AnnouncementCard
                            data={announcement}
                            role={getProfileId}
                            isContract={announcement.announcement_mode == "CONTRACT"}
                            isLease={announcement.announcement_mode == "LEASE"}
                            pageToNavigate={pageToNavigate}
                            navigationParams={navigationParams}
                            sent_or_received={"Sent"}
                            showCheckbox={true}
                          />
                        }
                        
                      </Box>
                    </div>
                  );
                })
              : "No announcements"}
          </div>
        </div>
        
          </Grid>
        </Grid>
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
      <Box sx={{ paddingBottom: "10%", width: "100%", marginLeft: "20px", marginRight: "20px" }}></Box>
      </Paper>
    </div>
    </ThemeProvider>
  );
}
