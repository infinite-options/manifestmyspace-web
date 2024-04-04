import React, { useEffect, useState } from "react";
import theme from "../../theme/theme";
import { Paper, ThemeProvider, Box, Stack, Typography, Button, Table, TableRow, TableCell, TableBody, TextField, InputAdornment } from "@mui/material";
import { CalendarToday, Close, Description } from "@mui/icons-material";
import { ArrowBack, Chat, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@material-ui/core/styles";
import { setDate } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      border: 0,
      borderRadius: 3,
      color: "#3D5CAC",
      fontSize: 50,
    },
  },
}));

const ViewLease = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [moveOut, setMoveOut] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);
  const { getProfileId, selectedRole } = useUser();
  // console.log("Selected Role: ", selectedRole);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("-");
  }
  const [fetchData, setFetchData] = useState([]);
  const [leaseData, setLeaseData] = useState([]);
  const [document, setDocument] = useState([]);

  const [endLeaseDialogOpen, setEndLeaseDialogOpen] = useState(false);
  const [confirmEndLeaseDialogOpen, setConfirmEndLeaseDialogOpen] = useState(false);
  const [renewLeaseDialogOpen, setRenewLeaseDialogOpen] = useState(false);

  const [endLeaseAnnouncement, setEndLeaseAnnouncement] = useState("");

  const [moveOutDate, setMoveOutDate] = useState(dayjs(new Date()));
  useEffect(() => {
    // console.log("Move-out Date - ", formatDate(moveOutDate));
    setMoveOut(formatDate(moveOutDate));
  }, [moveOutDate]);

  // useEffect(() => {
  //   console.log("leaseData - ", leaseData);    
  // }, [leaseData]);  

  const closeEndLeaseDialog = () => {
    setEndLeaseDialogOpen(false);
  };  
  
  const closeConfirmEndLeaseDialog = () => {
    setConfirmEndLeaseDialogOpen(false);
  }; 

  const closeRenewLeaseDialog = () => {
    setRenewLeaseDialogOpen(false);
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleMoveOutChange = (event) => {
    setMoveOut(event.target.value);
  };

  const getConfirmEndLeaseDialogText = () => {    
    const currentDate = new Date();
    const noticePeriod = leaseData.lease_end_notice_period ? leaseData.lease_end_notice_period : 30; //30 by default
    // const moveOutDate = new Date(moveOut);
    const leaseEndDate = new Date(leaseData.lease_end);
    

    const noticeDate = new Date(leaseEndDate);
    noticeDate.setDate(leaseEndDate.getDate() - noticePeriod);
    const futureDate = new Date(currentDate)
    futureDate.setDate(currentDate.getDate() + noticePeriod)
    const newLeaseEndDate = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0);

    if(leaseData.lease_status === "ACTIVE"){
      if(currentDate < noticeDate){
        setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(leaseEndDate)}`);
        return `Your lease will end on ${formatDate(leaseEndDate)} and you are responsible for rent payments until the end of the lease. Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
      } else {        
        setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(newLeaseEndDate)}`);
        return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${formatDate(newLeaseEndDate)} and you will be responsible for payments through that date. Are you sure you want to end the lease?`
      }

    }else if(leaseData.lease_status === "ACTIVE-M2M"){      
      if(currentDate < noticeDate){
        setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(leaseEndDate)}`);
        return `Your lease will end on ${formatDate(leaseEndDate)} and you are responsible for rent payments until the end of the lease. Ending the lease early will require approval from the Property Manager. Are you sure you want to end the lease?`;
      } else {        
        setEndLeaseAnnouncement(`Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease on ${formatDate(newLeaseEndDate)}`);
        return `Notice for ending the lease must be provided ${noticePeriod} days in advance. The lease can be terminated on ${formatDate(newLeaseEndDate)} and you will be responsible for payments through that date. Are you sure you want to end the lease?`
      }
    } else{
      return "ERROR: lease status is not \"ACTIVE\" or \"ACTIVE-M2M\"";
    }               
  }

  // console.log("Selected Role - ", selectedRole)
  const handleViewButton = (leaseData) => {
    console.log("LEASE DATA - documents: ", JSON.parse(leaseData.lease_documents));
    let link = JSON.parse(leaseData.lease_documents)[0]?.link;

    // navigate('/leaseDocument',{
    //     state:{
    //         document: leaseData.ld_link
    //     }
    // }
    // );
    window.open(link, "_blank", "rel=noopener noreferrer");
  };

  const handleEndLease = () => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "*",
    };

    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
    leaseApplicationFormData.append("move_out_date", formatDate(moveOut));
    leaseApplicationFormData.append("lease_status", "END-REQUEST");

    axios
      .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication", leaseApplicationFormData, headers)
      .then((response) => {
        console.log("Data updated successfully");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        }
      });
      const sendAnnouncement = async () => {
        try {
          const receiverPropertyMapping = {
            [leaseData.business_uid]: [leaseData.lease_property_id],
          };
  
          await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
            // await fetch(`http://localhost:4000/announcements/${getProfileId()}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              announcement_title: "End Lease Request from Tenant",
              // announcement_msg: `Tenant for ${leaseData.property_address}, Unit -${leaseData.property_unit} has requested to end the Lease.`,
              announcement_msg: endLeaseAnnouncement? endLeaseAnnouncement : "",
              announcement_sender: getProfileId(),
              announcement_date: new Date().toDateString(),
              // announcement_properties: property.property_uid,
              announcement_properties: JSON.stringify(receiverPropertyMapping),
              announcement_mode: "LEASE",
              announcement_receiver: [leaseData.business_uid],
              announcement_type: ["Text", "Email"],
            }),
          });
        } catch (error) {
          console.log(error);
        }
      };
      sendAnnouncement();
      setEndLeaseDialogOpen(false);
      setConfirmEndLeaseDialogOpen(false);
      navigate(-1);
  };
  const leaseID = location.state.lease_id; //'300-000005';

  

  useEffect(() => {
    setShowSpinner(true);
    // axios.get(`http://localhost:4000/leaseDetails/${getProfileId()}`).then((res) => {
    axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseDetails/${getProfileId()}`).then((res) => {
      const data = res.data["Lease_Details"].result;
      // console.log(data);
      setFetchData(data);
      data.forEach((lease) => {
        if (lease.lease_uid === leaseID) {
          setLeaseData(lease);
          console.log("Lease data " + JSON.stringify(lease));
          setDocument(lease.lease_documents);
        }
      });
      setShowSpinner(false);
    });
  }, []);

  function getDayText(day) {
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  const handleRenewLease = () => {
    navigate("/editLease", {
      state: {
        leaseData: leaseData,
      },
    });
  };

  console.log("document ", document);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          fontFamily: "Source Sans Pro",
          justifyContent: "center",
          width: "100%", // Take up full screen width
          minHeight: "85vh", // Set the Box height to full height
          marginTop: theme.spacing(2), // Set the margin to 20px
        }}
      >
        <Paper
          style={{
            margin: "30px",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
            paddingTop: "10px",
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" position="relative" sx={{ paddingBottom: "25px", paddingTop: "15px" }}>
            <Box position="absolute" left={0}>
              <Button onClick={() => handleBackButton()}>
                <ArrowBack
                  sx={{
                    color: theme.typography.primary.black,
                    fontSize: "30px",
                    margin: "5px",
                  }}
                />
              </Button>
            </Box>
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                Viewing Current Lease
              </Typography>
            </Box>
            {document > 0 ? (
              <Box
                position="absolute"
                right={0}
                onClick={() => {
                  handleViewButton(leaseData);
                }}
              >
                <Visibility
                  sx={{
                    color: theme.typography.primary.black,
                    fontSize: "20px",
                    margin: "5px",
                  }}
                />
              </Box>
            ) : (
              <div></div>
            )}
          </Stack>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    {`${leaseData.property_address}, ${leaseData.property_city}, ${leaseData.property_state} ${leaseData.property_zip}`}
                  </Typography>
                </TableCell>
              </TableRow>
              {selectedRole === "MANAGER" && (
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        color: theme.typography.primary.black,
                        fontWeight: theme.typography.primary.fontWeight,
                        fontSize: "16px",
                      }}
                    >
                      Owner: {`${leaseData.owner_first_name} ${leaseData.owner_last_name}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button>
                      <Chat
                        sx={{
                          color: theme.typography.common.blue,
                          fontSize: "16px",
                          margin: "5px",
                        }}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {selectedRole === "MANAGER" && (
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        color: theme.typography.primary.black,
                        fontWeight: theme.typography.primary.fontWeight,
                        fontSize: "16px",
                      }}
                    >
                      Tenant: {getTenantName(leaseData)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button>
                      <Chat
                        sx={{
                          color: theme.typography.common.blue,
                          fontSize: "16px",
                          margin: "5px",
                        }}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              {selectedRole === "MANAGER" && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: "16px",
                      }}
                    >
                      Contract Name
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontSize: "16px",
                      }}
                    >
                      {leaseData.ld_name}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Start Date
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.lease_start}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    End Date
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.lease_end}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Rent
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {`$${leaseData.property_listed_rent}` || ' NO RENT'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Rent Frequency
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.frequency ? leaseData.frequency : "NO FREQUENCY"}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Late Fee After
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.late_by} days
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Late Fee Per Day
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {`$${leaseData.perDay_late_fee}` ?? 'NO LATE FEE'}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Rent Due Date
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.due_by} of month
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Available to Pay
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData.available_topay} days before
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Move In Date
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    { leaseData?.lease_move_in_date ?? "NO MOVE-IN DATE"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    # of Occupants
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData ? (countNoOfOccupents(leaseData) || "NO OCCUPANTS"): "NO OCCUPANTS"}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    # of Pets
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {leaseData ? (CountNoOfPets(leaseData) || 'NO PETS') : "NO PETS"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    # of Vehicles
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {/* {leaseData? countNoOfOccupents(leaseData) : "NUM-OCCUPANTS"} */}
                    {leaseData ? (CountNoOfVehicles(leaseData) || "NO VEHICLES"): "NO VEHICLES"}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    Tenant Utilities
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  >
                    {/* {leaseData? CountNoOfPets(leaseData) : "PETS"} */}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.common.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    View Lease
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "16px",
                    }}
                  ></Typography>
                </TableCell>
              </TableRow>
              {/* <TableRow>
                                <TableCell colSpan={1}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Move Out Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="mm-dd-yyyy"
                                        value={moveOut} onChange={handleMoveOutChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                            </TableRow> */}
            </TableBody>
          </Table>

          {(selectedRole === "MANAGER" || selectedRole === "TENANT") && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative" sx={{ paddingTop: "15px" }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.common.fontWeight,
                  backgroundColor: theme.palette.custom.pink,
                  margin: "10px",
                }}
                // onClick={handleEndLease}
                onClick={() => setEndLeaseDialogOpen(true)}
              >
                End Lease
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.common.fontWeight,
                  backgroundColor: theme.palette.custom.blue,
                  margin: "10px",
                }}
                onClick={() => {
                  setRenewLeaseDialogOpen(true);
                }}
              >
                Renew Lease
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>
      <Dialog open={endLeaseDialogOpen} onClose={closeEndLeaseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">Select a Move-Out Date</DialogTitle> */}
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
            }}
          >
            Please select a Move-Out Date
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                value={moveOutDate}
                onChange={(newValue) => setMoveOutDate(newValue)}
                disablePast={true}
                sx={{
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  // color: "#3D5CAC",
                }}
                renderInput={(params) => <TextField className={classes.root} {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
          {/* <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Are you sure you want to end the lease?
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => setConfirmEndLeaseDialogOpen(true)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            Next
          </Button>
          <Button
            onClick={() => setEndLeaseDialogOpen(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={renewLeaseDialogOpen} onClose={closeRenewLeaseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Confirm Renew Lease</DialogTitle>
        <DialogContent>                
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Are you sure you want to renew the lease?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => handleRenewLease(leaseData)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => setRenewLeaseDialogOpen(false)}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmEndLeaseDialogOpen} onClose={closeConfirmEndLeaseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">End Lease Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
            }}
          >
            {getConfirmEndLeaseDialogText()}
          </DialogContentText>
          
          {/* <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.typography.common.blue,
              fontWeight: theme.typography.common.fontWeight,
              paddingTop: "10px",
            }}
          >
            Are you sure you want to end the lease?
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleCancel(managerData)} color="primary" autoFocus> */}
          <Button
            onClick={() => handleEndLease()}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              // setEndLeaseDialogOpen(false);
              setConfirmEndLeaseDialogOpen(false);
            }}
            sx={{
              color: "white",
              backgroundColor: "#3D5CAC80",
              ":hover": {
                backgroundColor: "#3D5CAC",
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

function countNoOfOccupents(leaseData) {
  let adultNo = leaseData.lease_adults ? JSON.parse(leaseData.lease_adults) : [];
  let ChildNo = leaseData.lease_children ? JSON.parse(leaseData.lease_children) : [];

  let no_of_occupants = 0;
  if (adultNo) {
    no_of_occupants += adultNo.length;
  }
  if (ChildNo) {
    no_of_occupants += ChildNo.length;
  }
  return no_of_occupants;
}

function CountNoOfPets(leaseData) {
  let pets = leaseData.lease_pets ? JSON.parse(leaseData.lease_pets) : [];
  return pets.length;
}
function CountNoOfVehicles(leaseData) {
  let vehicles = leaseData.lease_vehicles  ? JSON.parse(leaseData.lease_vehicles) : [];
  return vehicles.length;
}

function getTenantName(leaseData) {
  let name = "";

  let tenants = leaseData.tenants ? JSON.parse(leaseData.tenants) : [];

  console.log(tenants);
  name += tenants && tenants[0] ? tenants[0].tenant_first_name : "";
  if (name.length > 0) {
    name += " ";
  }
  name += tenants && tenants[0] ? tenants[0].tenant_last_name : "";

  return name;
}
export default ViewLease;
