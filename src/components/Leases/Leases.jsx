import { Accordion, AccordionDetails, AccordionSummary, Modal, Box, Checkbox, Paper } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import SelectProperty from "./SelectProperty";
import AllOwnerIcon from "./AllOwnerIcon.png";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";

import APIConfig from "../../utils/APIConfig";

export default function Leases(props) {
  console.log("In Leases");
  console.log("In Leases Props: ", props);
  const { getProfileId, selectedRole } = useUser();
  // console.log("Selected Role: ", selectedRole);

  const [open, setOpen] = useState(false);
  const [owner_checkbox_open, set_owner_checkbox_open] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const currentMonth = new Date().getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
  const currentYear = new Date().getFullYear();
  const [moveoutCount, setMoveoutCount] = useState(0);
  const [leaseDate, setLeaseDate] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [property_checkbox_items, set_property_checkbox_items] = useState([]);
  const [owner_checkbox_items, set_owner_checkbox_items] = useState([]);
  const [originalLeaseDate, setOriginalLeaseDate] = useState([]); // New state for storing original lease dates
  const fetchData = props.leaseDetails;

  console.log("Before Map 1");
  const property_filtered_LeaseDate = new Map(
    [...originalLeaseDate].filter(([date, leases]) => {
      return selectedProperties.length === 0 || leases.some((lease) => selectedProperties.includes(lease.lease_property_id));
    })
  );
  console.log("Before Map 2");
  const owner_filtered_LeaseDate = new Map(
    [...originalLeaseDate].filter(([date, leases]) => {
      return selectedOwners.length === 0 || leases.some((lease) => selectedOwners.some((owner) => owner.id === lease.property_owner_id));
    })
  );
  console.log("After Map 2");
  const handle_property_checkbox_close = () => {
    setOpen(false);
  };

  const handle_property_checkbox_open = () => {
    setOpen(true);
  };

  const handle_owner_checkbox_close = () => {
    set_owner_checkbox_open(false);
  };

  const handle_owner_checkbox_open = () => {
    set_owner_checkbox_open(true);
  };

  const apply_owner_filter = () => {
    set_owner_checkbox_open(false);
    setLeaseDate(owner_filtered_LeaseDate);
  };

  const clear_owner_filters = () => {
    set_owner_checkbox_open(false);
    setSelectedOwners([]); // Clear selected properties
    setLeaseDate(originalLeaseDate); // Reset lease dates to original
  };

  const apply_property_filter = () => {
    setOpen(false);
    setLeaseDate(property_filtered_LeaseDate);
  };

  const clear_property_filters = () => {
    setOpen(false);
    setSelectedProperties([]); // Clear selected properties
    setLeaseDate(originalLeaseDate); // Reset lease dates to original
  };

  const handlePropertySelection = (propertyId) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter((id) => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleOwnerSelection = (ownerId) => {
    if (selectedOwners.some((owner) => owner.id === ownerId)) {
      setSelectedOwners(selectedOwners.filter((owner) => owner.id !== ownerId));
    } else {
      const ownerToAdd = owner_checkbox_items.find((owner) => owner.id === ownerId);
      setSelectedOwners([...selectedOwners, ownerToAdd]);
    }
  };

  function renderPropertyCheckboxes() {
    return (
      <>
        {property_checkbox_items.map((property) => (
          <div key={property.property_id}>
            <Checkbox checked={selectedProperties.includes(property.property_id)} onChange={() => handlePropertySelection(property.property_id)} />
            <label
              htmlFor={property.property_id}
            >{`${property.property_address}${property.property_unit} , ${property.property_city}, ${property.property_state} ${property.property_zip}`}</label>
          </div>
        ))}
        <button onClick={apply_property_filter}>Apply</button>
      </>
    );
  }

  function renderOwnerCheckboxes() {
    return (
      <>
        {owner_checkbox_items.map((owner) => (
          <div key={owner.id}>
            <Checkbox checked={selectedOwners.some((selectedOwner) => selectedOwner.id === owner.id)} onChange={() => handleOwnerSelection(owner.id)} />
            <label htmlFor={owner.id}>{`${owner.first_name} ${owner.last_name}`}</label>
          </div>
        ))}
        <button onClick={apply_owner_filter}>Apply</button>
      </>
    );
  }

  useEffect(() => {
    function getMoveoutNum(leases) {
      let num = 0;
      for (let i = 0; i < leases.length; i++) {
        const lease = leases[i];
        if (lease.lease_renew_status === "MOVING") {
          num++;
        }
      }
      console.log("Move out Num: ", num);
      return num;
    }
    setShowSpinner(true);
    // axios.get(`${APIConfig.baseURL.dev}/leaseDetails/${getProfileId()}`).then((res) => {
    // axios.get(`${APIConfig.baseURL.dev}/leaseDetails/110-000003`).then((res) => {
    // // console.log(res.data['Lease Details'].result);
    // const fetchData = res.data["Lease_Details"].result;
    // console.log("leases fetchData", fetchData);

    const fetchData = props.leaseDetails;

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
      // obj.lease_end = `${month}-${day}-${year}`;
    });
    console.log("leases sorted FetchData", fetchData);

    const leases = new Map([]);
    let moveoutNum = 0;
    fetchData.forEach((lease) => {
      const currentDate = new Date();
      const leaseDate = new Date(lease.lease_end);
      if (leaseDate.getFullYear() > currentDate.getFullYear() ||
        (leaseDate.getFullYear() === currentDate.getFullYear() && leaseDate.getMonth() >= currentDate.getMonth())) {
        const date = lease.lease_end.slice(0, 7);
        console.log("Date after slice: ", date);
        if (leases.get(date) === undefined) {
          leases.set(date, [lease]);
        } else {
          const arr = leases.get(date);
          arr.push(lease);
          leases.set(date, arr);
          console.log("ARR: ", arr);
          moveoutNum += getMoveoutNum(arr);
          console.log("Move out Num Total: ", moveoutNum);
        }
      }
    });
    set_property_checkbox_items(fetchData);

    let owners = fetchData.map((property) => {
      return {
        id: property.property_owner_id,
        first_name: property.owner_first_name,
        last_name: property.owner_last_name,
      };
    });

    // Convert objects to JSON strings and create a Set
    let uniqueOwners = new Set(owners.map((obj) => JSON.stringify(obj)));

    // Convert Set back to an array of objects
    uniqueOwners = Array.from(uniqueOwners)
      .map((jsonString) => JSON.parse(jsonString))
      .sort((a, b) => {
        if (a.last_name !== b.last_name) return a.last_name - b.last_name;
        return a.first_name - b.first_name;
      });
    set_owner_checkbox_items(uniqueOwners);

    setLeaseDate(leases);
    const firstEntry = [...leases.entries()][0];
    const firstLeaseUid = firstEntry ? firstEntry[1][0].lease_uid : null;
    const prevSelectedLeaseId = sessionStorage.getItem('selectedLeaseId');
    console.log('prevSelectedLeaseId', prevSelectedLeaseId);
    if(prevSelectedLeaseId){
      props.setSelectedLeaseId(prevSelectedLeaseId);
    } else {
      props.setSelectedLeaseId(firstLeaseUid);
      sessionStorage.setItem("selectedLeaseId", firstLeaseUid);
    }
    // console.log('after sort', firstLeaseUid); 
    setMoveoutCount(moveoutNum);
    setOriginalLeaseDate(leases); // Save original lease dates
    setShowSpinner(false);
    // });
  }, [fetchData]);

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      width: "100%", // Take up full screen width
      // minHeight: "100vh", // Set the Box height to full height
      height: "100%",
    }}>
      <Paper
        sx={{
          marginTop: "10px",
          backgroundColor: theme.palette.primary.main,
          width: "100%", // Occupy full width with 25px margins on each side
          maxWidth: "800px", // You can set a maxWidth if needed
        }}
      >
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box
          sx={{
            fontFamily: "Source Sans Pro",
            backgroundColor: "#F2F2F2",
            fontSize: "14px",
            color: "#3D5CAC",
            justifyContent: "center",
            padding: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Box
            sx={{
              color: "#160449",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Leases Expiring
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "2px",
                }}
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.125" y="6.25" width="18.75" height="15.625" rx="2" stroke="#3D5CAC" strokeWidth="2" />
                  <path
                    d="M3.125 10.25C3.125 8.36438 3.125 7.42157 3.71079 6.83579C4.29657 6.25 5.23938 6.25 7.125 6.25H17.875C19.7606 6.25 20.7034 6.25 21.2892 6.83579C21.875 7.42157 21.875 8.36438 21.875 10.25V10.4167H3.125V10.25Z"
                    fill="#3D5CAC"
                  />
                  <path d="M7.29166 3.125L7.29166 6.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17.7083 3.125L17.7083 6.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
              <Box>Next 1 Year</Box>
            </Box>
            {selectedRole === "MANAGER" && (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onClick={handle_owner_checkbox_open}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "2px",
                    }}
                  >
                    <img src={AllOwnerIcon} alt="Owner Icon" style={{ width: "22px", height: "22px" }} />
                  </Box>

                  <Box>All Owners</Box>
                </Box>
              </div>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onClick={handle_property_checkbox_open}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "2px",
                }}
              >
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.49423 10.97C5.20833 11.6165 5.20833 12.3519 5.20833 13.8228V18.4166C5.20833 20.4594 5.20833 21.4807 5.81852 22.1153C6.37694 22.6961 7.24682 22.7454 8.89583 22.7495V17.3333C8.89583 16.2201 9.77331 15.25 10.9375 15.25H14.0625C15.2267 15.25 16.1042 16.2201 16.1042 17.3333V22.7495C17.7532 22.7454 18.6231 22.6961 19.1815 22.1153C19.7917 21.4807 19.7917 20.4594 19.7917 18.4166V13.8228C19.7917 12.3519 19.7917 11.6165 19.5058 10.97C19.2199 10.3236 18.6829 9.84493 17.6091 8.88768L16.5674 7.9591C14.6265 6.22888 13.656 5.36377 12.5 5.36377C11.344 5.36377 10.3735 6.22888 8.43255 7.9591L7.39088 8.88768C6.31704 9.84493 5.78012 10.3236 5.49423 10.97ZM14.1042 22.7499V17.3333C14.1042 17.2974 14.091 17.2737 14.0782 17.2604C14.0719 17.2538 14.067 17.2512 14.0653 17.2505L14.0652 17.2504C14.0644 17.2501 14.0642 17.25 14.0625 17.25H10.9375C10.9358 17.25 10.9355 17.2501 10.9348 17.2504L10.9347 17.2505C10.933 17.2512 10.9281 17.2538 10.9218 17.2604C10.909 17.2737 10.8958 17.2974 10.8958 17.3333V22.7499H14.1042Z"
                    fill="#3D5CAC"
                  />
                </svg>
              </Box>
              <Box> Property </Box>
            </Box>
          </Box>
          <Accordion
            sx={{
              backgroundColor: "#A52A2A",
              color: "#FFFFFF",
              borderRadius: "10px",
              marginTop: "15px",
              marginBottom: "15px",
              boxShadow: "0px 4px 4px #00000032",
            }}
          >
            <AccordionSummary
              sx={{
                display: "flex",
                fontWeight: "bold",
              }}
              expandIcon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F2F2F2" strokeWidth="2.5" />
                </svg>
              }
            >
              <Box>Move-Outs</Box>
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "5px",
                }}
              >
                {moveoutCount}
              </Box>
            </AccordionSummary>
            {[...leaseDate.keys()].map((date, i) => {
              const leases = leaseDate.get(date);
              return (
                <React.Fragment key={i}>
                  {leases.map((lease, j) => {
                    return (
                      <React.Fragment key={j}>
                        {lease.lease_renew_status === "MOVING" ? (
                          <AccordionDetails>
                            <Box>{`${lease.lease_end}:`}</Box>
                            <Box
                              sx={{
                                fontWeight: "bold",
                                borderBottomStyle: "solid",
                                borderWidth: "1px",
                                width: "fit-content",
                              }}
                            >
                              {`${lease.property_address} ${lease.property_unit},${lease.property_city} ${lease.property_state} ${lease.property_zip}`}
                            </Box>
                          </AccordionDetails>
                        ) : (
                          <React.Fragment key={j}></React.Fragment>
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </Accordion>
          {[...leaseDate.keys()].map((date, i) => {
            const leases = leaseDate.get(date);
            let tabColor = "#FFFFFF";
            // const endMonth = date.split("-")[1];
            const [endYear, endMonth] = date.split("-").map(Number);
            // console.log("lease endDate ", date, Number(endMonth), Number(currentMonth))
            // if (Number(currentMonth) === Number(endMonth)) {
            if(currentYear === endYear && currentMonth === endMonth){
              tabColor = "#F87C7A";
            } else if (currentYear === endYear && currentMonth + 1 === endMonth || 
              (currentMonth === 12 && currentYear + 1 === endYear && endMonth === 1)) {
              tabColor = "#FFC614";
            }
            return <LeaseMonth key={i} data={[date, leases]} style={[tabColor]} setSelectedLeaseId={props.setSelectedLeaseId} />;
          })}
        </Box>
        <Modal open={open} onClose={handle_property_checkbox_close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2>Select Properties</h2>
            {renderPropertyCheckboxes()}
            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </button>
          </Box>
        </Modal>
        <Modal open={owner_checkbox_open} onClose={handle_owner_checkbox_close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2>Select Owners</h2>
            {renderOwnerCheckboxes()}
            <button
              onClick={() => {
                set_owner_checkbox_open(false);
              }}
            >
              Cancel
            </button>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
}

function LeaseMonth(props) {
  const [date, leaseData] = props.data;
  let [year, month] = ["-", "-"];
  const [tabColor] = props.style;

  function parseDate(data) {
    const dateList = data.split("-");
    function getMonth(num) {
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

      const index = parseInt(num, 10) - 1;

      if (index >= 0 && index < months.length) {
        return months[index];
      } else {
        return "N/A";
      }
    }
    return [dateList[0], getMonth(dateList[1])];
  }
  if (leaseData.lease_end !== null) {
    [year, month] = parseDate(date);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          width: "10%",
          backgroundColor: tabColor,
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5px",
          paddingBottom: "10px",

          fontSize: "15px",
          color: "#160449",
        }}
      >
        <Box>{month}</Box>
        <Box>{year}</Box>
        <Box
          sx={{
            fontWeight: "bold",
            marginTop: "auto",
            marginBottom: "0px",
          }}
        >
          {leaseData.length}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
        }}
      >
        {leaseData.map((lease, i) => (
          <LeaseComponent key={i} data={lease} setSelectedLeaseId={props.setSelectedLeaseId} />
        ))}
      </Box>
    </Box>
  );
}
function LeaseComponent(props) {
  const leaseData = props.data;
  const navigate = useNavigate();

  function getLeaseStatusText(status) {
    switch (status) {
      case "MOVING":
        return "Moving out";
      case "RENEWED":
        return "Renewed to";
      default:
        break;
    }
  }
  function getLeaseStatusIcon(status) {
    const moveoutIcon = (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 6.5L6.5 19.5" stroke="#3D5CAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 6.5L19.5 19.5" stroke="#3D5CAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    const renewIcon = (
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.20833 14.5833L8.60809 17.1331C9.03678 17.4547 9.64272 17.3811 9.98205 16.9664L18.75 6.25" stroke="#3D5CAC" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
    const nullIcon = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="18" height="18" rx="4" stroke="#3D5CAC" strokeWidth="2" />
      </svg>
    );
    let outputIcon;
    switch (status) {
      case "MOVING":
        outputIcon = moveoutIcon;
        break;
      case "RENEWED":
        outputIcon = renewIcon;
        break;
      default:
        outputIcon = nullIcon;
        break;
    }
    return outputIcon;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        paddingLeft: "10px",
      }}
    >
      <Box
        sx={{
          marginLeft: "0px",
          marginRight: "auto",
          cursor: "pointer",
        }}
        onClick={(e) => {
          // navigate("/viewLease", {
          //   state: {
          //     lease_id: leaseData.lease_uid,
          //   },
          // });
          console.log('click event', props.setSelectedLeaseId);

          props.setSelectedLeaseId(leaseData.lease_uid);
          sessionStorage.setItem("selectedLeaseId", leaseData.lease_uid);
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            borderBottomStyle: "solid",
            borderWidth: "1px",
            width: "fit-content",
          }}
        >
          {`${leaseData.property_address} ${leaseData.property_unit}, ${leaseData.property_city} ${leaseData.property_state} ${leaseData.property_zip}`}
        </Box>
        <Box>
          {leaseData.lease_end}: {leaseData.lease_renew_status}
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "0px",
        }}
      >
        {getLeaseStatusIcon(leaseData.lease_renew_status)}
      </Box>
    </Box>
  );
}
