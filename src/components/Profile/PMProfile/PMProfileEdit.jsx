import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Button,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";

import backButton from "../../Payments/backIcon.png";
import ProfileImg from "../Images/PMProfileImagePlaceholder.png";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../../theme/theme";
import { set } from "date-fns";

const TenantProfileEditContext = createContext(null);

function PMProfileEdit() {
  const navigate = useNavigate();
  const { getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const location = useLocation();
  let manager_data = location.state.manager_data;
  const [tenantProfileImage, setTenantProfileImage] = useState(ProfileImg);
  let {
    business_uid,
    business_name,
    business_phone_number,
    business_email,
    business_ein_number,
    business_services_fees,
    business_address,
    business_unit,
    business_city,
    business_state,
    business_zip,
  } = manager_data;

  const [modifiedData, setModifiedData] = useState({ business_uid: business_uid });

  let [first_name, last_name] = business_name.split(" ");

  const [managerFirstName, setManagerFirstName] = useState(first_name);
  const [managerLastName, setManagerLastName] = useState(last_name);
  const [managerEmail, setManagerEmail] = useState(business_email);
  const [managerPhoneNumber, setManagerPhoneNumber] = useState(business_phone_number);
  const [managerSSN, setManagerSSN] = useState("");
  const [managerFees, setManagerFees] = useState(JSON.parse(business_services_fees));
  const [tenantLicenseState, setTenantLicenseState] = useState("");
  const [tenantLicenseNumber, setTenantLicenseNumber] = useState("");
  const [tenantCurrentSalary, setTenantCurrentSalary] = useState("");
  const [tenantSalaryFrequency, setTenantSalaryFrequency] = useState("");
  const [tenantJobTitle, setTenantJobTitle] = useState("");
  const [tenantCompanyName, setTenantCompanyName] = useState("");
  const [tenantAddress, setTenantAddress] = useState(business_address);
  const [tenantUnit, setTenantUnit] = useState(business_unit);
  const [tenantCity, setTenantCity] = useState(business_city);
  const [tenantState, setTenantState] = useState(business_state);
  const [tenantZip, setTenantZip] = useState(business_zip);
  const [tenantLeaseStartDate, setTenantLeaseStartDate] = useState("");
  const [tenantLeaseEndDate, setTenantLeaseEndDate] = useState("");
  const [tenantMonthlyRent, setTenantMonthlyRent] = useState("");
  const [tenantPMName, setTenantPMName] = useState("");
  const [tenantPMPhone, setTenantPMPhone] = useState("");

  const [tenantAdultOccupants, setTenantAdultOccupants] = useState([]);
  const [tenantChildrenOccupants, setTenantChildrenOccupants] = useState([]);
  const [tenantPetOccupants, setTenantPetOccupants] = useState([]);
  const [tenantVehicleInfo, setTenantVehicleInfo] = useState([]);

  const [tenant, setTenant] = useState("");

  const [occupantsDataComplete, setOccupantsDataComplete] = useState(true);

  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [showEditFeeDialog, setShowEditFeeDialog] = useState(false);
  const [indexForEditFeeDialog, setIndexForEditFeeDialog] = useState(false);

  useEffect(() => {
    console.log("managerFees updated - ", managerFees);
  }, [managerFees]);

  useEffect(() => {
    console.log("modifiedData updated - ", modifiedData);
  }, [modifiedData]);

  const parseJSONFields = (obj) => {
    if (!obj || typeof obj !== "object") {
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        if (value.startsWith("{") || value.startsWith("[")) {
          try {
            obj[key] = JSON.parse(value);
          } catch (error) {
            console.error(`Error parsing JSON for field ${key}: ${error.message}`);
          }
        }
      } else if (typeof value === "object") {
        // Recursively process nested objects
        parseJSONFields(value);
      }
    }
  };

  const maskSSN = (ssn) => {
    let maskedSSN = "***-**-" + ssn.slice(-4);
    return maskedSSN;
  };

  useEffect(() => {
    setShowSpinner(true);
    axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantProfile/${getProfileId()}`).then((res) => {
      let responseData = res.data.Profile.result[0];
      parseJSONFields(responseData);

      setProfileData(responseData);

      setManagerFirstName(responseData?.tenant_first_name);
      setManagerLastName(responseData?.tenant_last_name);
      setManagerEmail(responseData?.tenant_email);
      setManagerPhoneNumber(responseData?.tenant_phone_number);

      setTenantAddress(responseData?.tenant_address);
      setTenantUnit(responseData?.tenant_unit);
      setTenantState(responseData?.tenant_state);
      setTenantCity(responseData?.tenant_city);
      setTenantZip(responseData?.tenant_zip);
      if (responseData?.tenant_profile_image) {
        setTenantProfileImage(responseData?.tenant_profile_image);
      }

      // setTenantLeaseStartDate(responseData.tenant_lease_start_date)
      // setTenantLeaseEndDate(responseData.tenant_lease_end_date)
      // setTenantMonthlyRent(responseData.tenant_monthly_rent)
      // setTenantPMName(responseData.tenant_pm_name)
      // setTenantPMPhone(responseData.tenant_pm_phone)

      setShowSpinner(false);
    });
  }, []);

  // useEffect(() => {
  //     setModifiedData((prevData) => ({
  //         ...prevData,
  //         'tenant_adult_occupants': tenantAdultOccupants,
  //         'tenant_children_occupants': tenantChildrenOccupants,
  //         'tenant_pet_occupants': tenantPetOccupants,
  //         'tenant_vehicle_info': tenantVehicleInfo,
  //     }));
  // }, [tenantAdultOccupants, tenantChildrenOccupants, tenantPetOccupants, tenantVehicleInfo]);

  useEffect(() => {
    setModifiedData((prevData) => ({
      ...prevData,
      business_services_fees: JSON.stringify(managerFees),
    }));
    setIsEdited(true);
  }, [managerFees]);

  // Handle changes to form fields
  const handleInputChange = (event) => {
    console.log("Input changed");
    const { name, value } = event.target;
    console.log(name);
    console.log(value);

    if (name === "tenant_first_name") {
      setManagerFirstName(value);
    } else if (name === "tenant_last_name") {
      setManagerLastName(value);
    } else if (name === "tenant_email") {
      setManagerEmail(value);
    } else if (name === "tenant_phone_number") {
      setManagerPhoneNumber(value);
    } else if (name === "tenant_ssn") {
      setManagerSSN(value);
    } else if (name === "tenant_address") {
      setTenantAddress(value);
    } else if (name === "tenant_unit") {
      setTenantUnit(value);
    } else if (name === "tenant_state") {
      setTenantState(value);
    } else if (name === "tenant_city") {
      setTenantCity(value);
    } else if (name === "tenant_zip") {
      setTenantZip(value);
    }

    setModifiedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setIsEdited(true); // Mark the form as edited
  };

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "*",
  };

  // Handle form submission
  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     console.log("FORM SUBMITTED")
  //     console.log(modifiedData)
  //     // Make a PUT request with formData to update data on the backend
  //     if(isEdited){
  //         console.log("EDITED")
  //         // axios.put('http://localhost:4000/tenantProfile', modifiedData, headers)
  //         axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', modifiedData, headers)
  //         .then((response) => {
  //             console.log('Data updated successfully');
  //             setIsEdited(false); // Reset the edit status
  //             navigate(-1)
  //         })
  //         .catch((error) => {
  //             if(error.response){
  //                 console.log(error.response.data);
  //             }
  //         });
  //     }

  // };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("IN HANDLE SUBMIT");
    // Make a PUT request with formData to update data on the backend
    if (isEdited) {
      console.log("   modifiedData - ", modifiedData);
      // axios.put('http://localhost:4000/businessProfile', modifiedData, headers)
      // axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile', modifiedData, headers)
      axios
        .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile", modifiedData, headers)
        .then((response) => {
          console.log("Data updated successfully");
          setIsEdited(false); // Reset the edit status
          navigate(-1);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          }
        });
    }
  };

  const getFormattedFeeFrequency = (frequency) => {
    // console.log("getFormattedFeeFrequency(), frequency", frequency);
    let freq = "";
    switch (frequency) {
      case "one_time":
        freq = "One Time";
        break;
      case "hourly":
        freq = "Hourly";
        break;
      case "daily":
        freq = "Daily";
        break;
      case "weekly":
        freq = "Weekly";
        break;
      case "bi_weekly":
        freq = "Biweekly";
        break;
      case "monthly":
        freq = "Monthly";
        break;
      case "annually":
        freq = "Annual";
        break;
      default:
        freq = "<FREQUENCY>";
    }
    return freq;
  };

  const handleOpenAddFee = () => {
    setShowAddFeeDialog(true);
  };

  const handleCloseAddFee = () => {
    setShowAddFeeDialog(false);
  };

  const handleOpenEditFee = (feeIndex) => {
    setShowEditFeeDialog(true);
    console.log("EDITING FEE, Index", feeIndex);
    setIndexForEditFeeDialog(feeIndex);
  };

  const handleCloseEditFee = () => {
    setShowEditFeeDialog(false);
  };

  const handleAddFee = (newFee) => {
    setManagerFees((prevManagerFees) => [...prevManagerFees, newFee]);
  };

  const handleEditFee = (newFee, index) => {
    console.log("IN handleEditFee of PropertyCard");
    console.log(newFee, index);
    setManagerFees((prevManagerFees) => {
      const updatedManagerFees = prevManagerFees.map((fee, i) => {
        if (i === index) {
          return newFee;
        }
        return fee;
      });
      return updatedManagerFees;
    });
  };

  const handleDeleteFee = (index, event) => {
    console.log("Manager Fees", managerFees);
    setManagerFees((prevFees) => {
      const feesArray = Array.from(prevFees);
      feesArray.splice(index, 1);
      return feesArray;
    });
    event.stopPropagation();
  };

  return (
    <TenantProfileEditContext.Provider value={{ modifiedData, setModifiedData, isEdited, setIsEdited, occupantsDataComplete, setOccupantsDataComplete }}>
      <Box
        sx={{
          fontFamily: "Source Sans Pro",
        }}
      >
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box
          sx={{
            backgroundColor: "#3D5CAC",
            minHeight: "100px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: "15px",
              paddingLeft: "25px",
              paddingRight: "25px",
            }}
          >
            <Box>
              <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z"
                  fill="white"
                />
              </svg>
              {/* <Button>
                                <img src={backButton} alt="Back Button" style={{width: '19px', height: '16px'}}/>
                                
                            </Button> */}
            </Box>
            <Box
              sx={{
                fontSize: "25px",
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              Manager Profile
            </Box>
            <Box
              sx={{
                width: "19px",
              }}
            ></Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItem: "center",
            padding: "12px",

            position: "relative",
            bottom: "56px",
          }}
        >
          <Box
            sx={{
              height: "112px",
              width: "112px",
              backgroundColor: "#bbb",
              borderRadius: "50%",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0px 4px 4px #00000032",
              zIndex: "2",
            }}
          >
            <img
              src={tenantProfileImage}
              alt="Tenant Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>

          <Box
            sx={{
              backgroundColor: "#F2F2F2",
              borderRadius: "10px",

              position: "relative",
              bottom: "50px",
              paddingTop: "55px",
              zIndex: "1",
            }}
          >
            <Box
              sx={{
                fontSize: "14px",
                color: "#3D5CAC",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  Manager
                </Box>

                <Box>Owner</Box>
                <Box
                  sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  &#x2022;
                </Box>
                <Box>Tenant</Box>
                <Box
                  sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  &#x2022;
                </Box>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" id="editProfileForm">
              <Box>
                <ProfileAccordion>
                  <ProfileAccordionSummary>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>Personal Details</Box>
                      {!(managerFirstName && managerLastName && managerEmail && managerPhoneNumber) && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#A52A2A",
                            borderRadius: "10px",
                            fontSize: "9px",
                            fontWeight: "600",
                            color: "#FFFFFF",
                            width: "60px",
                            height: "13px",
                            marginRight: "20px",
                          }}
                        >
                          Incomplete
                        </Box>
                      )}
                    </Box>
                  </ProfileAccordionSummary>
                  <ProfileAccordionDetail>
                    <ProfileTextInputField name="tenant_first_name" value={managerFirstName} onChange={handleInputChange}>
                      First Name
                    </ProfileTextInputField>
                    <ProfileTextInputField name="tenant_last_name" value={managerLastName} onChange={handleInputChange}>
                      Last Name
                    </ProfileTextInputField>
                    <ProfileTextInputField name="tenant_email" value={managerEmail} onChange={handleInputChange}>
                      Email
                    </ProfileTextInputField>
                    <ProfileTextInputField name="tenant_phone_number" value={managerPhoneNumber} onChange={handleInputChange}>
                      Phone #
                    </ProfileTextInputField>
                  </ProfileAccordionDetail>
                </ProfileAccordion>
              </Box>

              <Box>
                <ProfileAccordion>
                  <ProfileAccordionSummary>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>Current Address</Box>
                      {!(tenantAddress && tenantCity && tenantZip && tenantState) && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#A52A2A",
                            borderRadius: "10px",
                            fontSize: "9px",
                            fontWeight: "600",
                            color: "#FFFFFF",
                            width: "60px",
                            height: "13px",
                            marginRight: "20px",
                          }}
                        >
                          Incomplete
                        </Box>
                      )}
                    </Box>
                  </ProfileAccordionSummary>
                  <ProfileAccordionDetail>
                    <ProfileTextInputField name="tenant_address" value={tenantAddress} onChange={handleInputChange}>
                      Address
                    </ProfileTextInputField>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                          }}
                        >
                          <ProfileTextInputField name="tenant_unit" value={tenantUnit} onChange={handleInputChange}>
                            Unit #:
                          </ProfileTextInputField>
                          <ProfileTextInputField name="tenant_city" value={tenantCity} onChange={handleInputChange}>
                            City
                          </ProfileTextInputField>
                        </Box>

                        <ProfileTextInputField name="tenant_zip" value={tenantZip} onChange={handleInputChange}>
                          Zip Code
                        </ProfileTextInputField>
                      </Box>
                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <ProfileTextInputField name="tenant_state" value={tenantState} onChange={handleInputChange}>
                          State
                        </ProfileTextInputField>
                      </Box>
                    </Box>
                  </ProfileAccordionDetail>
                </ProfileAccordion>
              </Box>

              <Box>
                <ProfileAccordion>
                  <ProfileAccordionSummary>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>Identification Details</Box>

                      {!(tenantLicenseNumber && tenantLicenseState) && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#A52A2A",
                            borderRadius: "10px",
                            fontSize: "9px",
                            fontWeight: "600",
                            color: "#FFFFFF",
                            width: "60px",
                            height: "13px",
                            marginRight: "20px",
                          }}
                        >
                          Incomplete
                        </Box>
                      )}
                    </Box>
                  </ProfileAccordionSummary>
                  <ProfileAccordionDetail>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <ProfileTextInputField name="tenant_ssn" value={managerSSN} onChange={handleInputChange}>
                          SSN #
                        </ProfileTextInputField>
                        <ProfileTextInputField name="tenant_drivers_license_number" value={tenantLicenseNumber} onChange={handleInputChange}>
                          License #
                        </ProfileTextInputField>
                      </Box>
                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <ProfileTextInputField name="tenant_drivers_license_state" value={tenantLicenseState} onChange={handleInputChange}>
                          License State
                        </ProfileTextInputField>
                      </Box>
                    </Box>
                  </ProfileAccordionDetail>
                </ProfileAccordion>
              </Box>

              <Box>
                <ProfileAccordion>
                  <ProfileAccordionSummary>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>Management Fees</Box>
                    </Box>
                  </ProfileAccordionSummary>
                  <ProfileAccordionDetail>
                    {/* <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 2,
                                        }}>
                                            <Box sx={{
                                                flexGrow: 1,
                                            }}>
                                                <ProfileTextInputField name="tenant_ssn" value={managerSSN}  onChange={handleInputChange}>SSN #</ProfileTextInputField>
                                                <ProfileTextInputField name="tenant_drivers_license_number" value={tenantLicenseNumber}  onChange={handleInputChange}>License #</ProfileTextInputField>
                                            </Box>
                                            <Box sx={{
                                                flexGrow: 1,
                                            }}>
                                                <ProfileTextInputField name="tenant_drivers_license_state" value={tenantLicenseState}  onChange={handleInputChange}>License State</ProfileTextInputField>
                                            </Box>
                                        </Box> */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "5px",
                        color: "#3D5CAC",
                      }}
                    >
                      <Box></Box>
                      <Box onClick={handleOpenAddFee}>
                        {/* <EditIcon  sx={{ fontSize: 16, color: '#3D5CAC'}} /> */}
                        Add a Fee
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        background: "#FFFFFF",
                        fontSize: "13px",
                        padding: "5px",
                        color: "#3D5CAC",
                        borderRadius: "5px",
                      }}
                    >
                      {managerFees.length === 0 ? (
                        // <p>No fees to display</p>
                        <Box
                          sx={{
                            height: "13px",
                          }}
                        >
                          No fees to display
                        </Box>
                      ) : (
                        managerFees.map((fee, index) => (
                          <Box
                            key={index}
                            // FeeIndex={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                            onClick={() => handleOpenEditFee(index)}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                {getFormattedFeeFrequency(fee.frequency)} {fee.fee_name}: {fee.fee_type === "PERCENT" ? `${fee.charge}% of ${fee.of}` : ` $${fee.charge}`}
                              </Box>

                              <Button
                                variant="text"
                                onClick={(event) => {
                                  handleDeleteFee(index, event);
                                }}
                                sx={{
                                  width: "10%",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#3D5CAC",
                                  "&:hover": {
                                    backgroundColor: "transparent", // Set to the same color as the default state
                                  },
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 14, color: "#3D5CAC" }} />
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}

                      {/* <Box>
                                                Monthly service charge: {'15% of all rent'}
                                            </Box>
                                            <Box>
                                                Tenant Setup Fee: $100
                                            </Box>
                                            <Box>
                                                Annual Inspection Fee: $200
                                            </Box>
                                            <Box>
                                                Re-Keying Charge: $200
                                            </Box>
                                            <Box>
                                                Annual Postage and Communication Fee: $20
                                            </Box> */}
                    </Box>
                    {showAddFeeDialog && (
                      <Box>
                        <AddFeeDialog open={showAddFeeDialog} handleClose={handleCloseAddFee} onAddFee={handleAddFee} />
                      </Box>
                    )}
                    {showEditFeeDialog && (
                      <Box>
                        <EditFeeDialog open={showEditFeeDialog} handleClose={handleCloseEditFee} onEditFee={handleEditFee} feeIndex={indexForEditFeeDialog} fees={managerFees} />
                      </Box>
                    )}
                  </ProfileAccordionDetail>
                </ProfileAccordion>
              </Box>

              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#3D5CAC",
                    borderRadius: "10px",
                    width: "150px",
                    height: "32px",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    color: "#FFFFFF",
                    marginBottom: "14px",
                  }}
                >
                  <Button variant="text" type="submit" form="editProfileForm" style={{ color: "white", textTransform: "none", fontWeight: "bold" }}>
                    <Typography>Save</Typography>
                  </Button>
                </Box>

                {/* <Box
                                    sx={{
                                        display: 'flex',
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <Grid container columnSpacing={12} rowSpacing={6} sx={{display: 'flex'}}>
                                        <Grid item xs={12}>
                                            <Button variant="contained" type="submit" form="editProfileForm" >
                                                <Typography>
                                                        Save
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box> */}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </TenantProfileEditContext.Provider>
  );
}

function ProfileAccordion(props) {
  return (
    <Accordion
      sx={{
        color: "#160449",
        fontWeight: "600",
        backgroundColor: "#F2F2F2",
        boxShadow: "none",
      }}
    >
      {props.children}
    </Accordion>
  );
}
function ProfileAccordionSummary(props) {
  return (
    <AccordionSummary
      expandIcon={
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.75 7.125L9.5 11.875L14.25 7.125" stroke="#3D5CAC" strokeWidth="2.5" />
        </svg>
      }
    >
      <Box
        sx={{
          fontSize: "16px",
          width: "100%",
        }}
      >
        {props.children}
      </Box>
    </AccordionSummary>
  );
}
function ProfileAccordionDetail(props) {
  return (
    <AccordionDetails>
      <Box
        sx={{
          fontSize: "12px",
        }}
      >
        {props.children}
      </Box>
    </AccordionDetails>
  );
}

function ProfileTextInputField(props) {
  const inputStyle = {
    border: "none",
    backgroundColor: "#D9D9D980",
    width: "100%",
    fontFamily: "inherit",
    fontWeight: "inherit",
    paddingLeft: "5px",
    borderRadius: "5px",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "7px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          marginRight: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {props.children}:
      </Box>
      <input type="text" style={inputStyle} name={props.name} value={props.value} onChange={props.onChange} />
    </Box>
  );
}
function DocumentCard(props) {
  const title = props.data.title;
  const date = props.data.date;
  const link = props.data.link;

  const onClickView = () => {
    window.open(link, "_blank");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#D9D9D980",
        boxShadow: "0px 1px 4px #00000040",
        marginBottom: "9px",
        padding: "10px",
        width: "100%",
        fontSize: "15px",
      }}
    >
      <Box
        sx={{
          fontWeight: "bold",
          color: "#160449",
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          fontWeight: "Normal",
          color: "#00000080",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Added: {date}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            onClick={onClickView}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "7px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                fill="#3D5CAC"
              />
              <path
                d="M19.3375 9.7875C18.6024 7.88603 17.3262 6.24164 15.6667 5.05755C14.0072 3.87347 12.0372 3.20161 9.99998 3.125C7.9628 3.20161 5.99272 3.87347 4.33323 5.05755C2.67374 6.24164 1.39758 7.88603 0.662478 9.7875C0.612833 9.92482 0.612833 10.0752 0.662478 10.2125C1.39758 12.114 2.67374 13.7584 4.33323 14.9424C5.99272 16.1265 7.9628 16.7984 9.99998 16.875C12.0372 16.7984 14.0072 16.1265 15.6667 14.9424C17.3262 13.7584 18.6024 12.114 19.3375 10.2125C19.3871 10.0752 19.3871 9.92482 19.3375 9.7875ZM9.99998 14.0625C9.19649 14.0625 8.41105 13.8242 7.74297 13.3778C7.0749 12.9315 6.5542 12.297 6.24672 11.5547C5.93924 10.8123 5.85879 9.99549 6.01554 9.20745C6.17229 8.4194 6.55921 7.69553 7.12736 7.12738C7.69551 6.55923 8.41938 6.17231 9.20742 6.01556C9.99547 5.85881 10.8123 5.93926 11.5546 6.24674C12.297 6.55422 12.9314 7.07492 13.3778 7.743C13.8242 8.41107 14.0625 9.19651 14.0625 10C14.0608 11.0769 13.6323 12.1093 12.8708 12.8708C12.1093 13.6323 11.0769 14.0608 9.99998 14.0625Z"
                fill="#3D5CAC"
              />
            </svg>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6Z"
                fill="#3D5CAC"
              />
            </svg>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ProfileTenantTable(props) {
  const { isEdited, setIsEdited } = useContext(TenantProfileEditContext);
  const title = props.title;
  const headers = props.headers;

  const field = props.field;

  const data = props.data;
  const setData = props.setData;

  // useEffect(() => {
  //     console.log(`${field} --> ${data}`);
  // }, [data])

  const addRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[headerToDataKeyMap[header]] = "";
      return acc;
    }, {});

    console.log("new Row", newRow);
    if (data.length < 1) {
      setData([newRow]);
      return;
    }
    setData((prevData) => [...prevData, newRow]);
  };

  const deleteRow = (index) => {
    if (!isEdited) {
      setIsEdited(true);
    }
    setData((prevData) => {
      const newData = prevData.filter((_, i) => i !== index);
      console.log("Deleted row at index ", index, ", new data: ", newData);
      return newData;
    });
  };

  const headerToDataKeyMap = {
    Name: "name",
    "Last Name": "last_name",
    Relation: "relationship",
    "DOB (YY/MM/DD)": "dob",
    Type: "type",
    Breed: "breed",
    Weight: "weight",
    Make: "make",
    Model: "model",
    Year: "year",
    State: "state",
    License: "license",
  };

  const tableStyle = {
    width: "100%",
    textAlign: "left",
  };

  return (
    <Box
      sx={{
        paddingBottom: "30px",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography sx={{ color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "18px" }}>{title}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {headers.map((text, index) => (
          <Grid item key={index} xs={12 / headers.length}>
            <Typography sx={{ color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px" }}>{text}</Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container columnSpacing={2} rowSpacing={2}>
        {data && data.length > 0 ? (
          data.map((rowData, index) => (
            <>
              {headers.map((header, i) => (
                <ProfileTableCell
                  field={field}
                  key={i}
                  value={rowData[headerToDataKeyMap[header]]}
                  index={index}
                  subField={headerToDataKeyMap[header]}
                  headers={headers}
                  data={data}
                  setData={setData}
                />
              ))}
              <Grid item>
                <Button
                  sx={{
                    padding: "0px",
                    marginLeft: "10px",
                  }}
                  onClick={() => deleteRow(index)}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </>
          ))
        ) : (
          <p> no row </p>
        )}
        <Grid item xs={12}>
          <Button
            sx={{
              padding: "0px",
              marginLeft: "10px",
            }}
            onClick={addRow}
          >
            <AddIcon /> Add Row
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

function ProfileTableCell(props) {
  const { setModifiedData, isEdited, setIsEdited, occupantsDataComplete, setOccupantsDataComplete } = useContext(TenantProfileEditContext);
  const cellWidth = props.style;
  const headersLength = props.headers.length;

  const data = props.data;
  const setData = props.setData;
  const index = props.index;

  if (!props.value && occupantsDataComplete) {
    setOccupantsDataComplete(false);
  }

  const handleInputChange = (event) => {
    if (!isEdited) {
      setIsEdited(true);
    }
    const { value } = event.target;

    const fieldName = props.field;

    // console.log(fieldName, value)

    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [props.subField]: value,
      };
      // console.log("Updated ", fieldName, " with ", newData)
      return newData;
    });
  };

  return (
    <Grid item xs={12 / (headersLength + 1)}>
      <TextField
        size="small"
        value={props.value}
        defaultValue={props.value}
        sx={{
          padding: "0px",
          margin: "0px",
        }}
        onChange={handleInputChange}
      />
    </Grid>
  );
}

function AddFeeDialog({ open, handleClose, onAddFee }) {
  const [feeName, setFeeName] = useState("");
  useEffect(() => {
    console.log("FEE Name: ", feeName);
  }, [feeName]);

  const [feeType, setFeeType] = useState("PERCENT");
  useEffect(() => {
    console.log("FEE TYPE: ", feeType);
  }, [feeType]);

  const [isPercentage, setIsPercentage] = useState(true);
  useEffect(() => {
    console.log("IS PERCENTAGE?: ", isPercentage);
  }, [isPercentage]);

  const [percentage, setPercentage] = useState("0");
  useEffect(() => {
    console.log("PERCENTAGE: ", percentage);
  }, [percentage]);

  const [isFlatRate, setIsFlatRate] = useState(false);
  useEffect(() => {
    console.log("IS FLAT RATE?: ", isFlatRate);
  }, [isFlatRate]);

  const [feeAmount, setFlatRate] = useState("0");
  useEffect(() => {
    console.log("FEE TYPE: ", feeAmount);
  }, [feeAmount]);

  const [feeFrequency, setFeeFrequency] = useState("One Time");
  useEffect(() => {
    console.log("FEE FREQUENCY: ", feeFrequency);
  }, [feeFrequency]);

  const [feeAppliedTo, setFeeAppliedTo] = useState("Gross Rent");
  useEffect(() => {
    console.log("FEE APPLIED TO: ", feeAppliedTo);
  }, [feeAppliedTo]);

  const handleFeeTypeChange = (event) => {
    setFeeType(event.target.value);
    // console.log("FEE TYPE SELECTED", event.target.value);
    // console.log('FEE TYPE: ', selectedFeeType);

    // if(event.target.value === "PERCENT"){
    //     setIsPercentage(true)
    //     setIsFlatRate(false);
    // }else{
    //     setIsFlatRate(true);
    //     setIsPercentage(false)
    // }
  };

  const handleFrequencyChange = (event) => {
    setFeeFrequency(event.target.value);
  };

  const handleAppliedToChange = (event) => {
    setFeeAppliedTo(event.target.value);
  };

  const handleAddFee = (event) => {
    event.preventDefault();

    console.log("ADD FEE FORM SUBMITTED ");
    console.log("feeName:", feeName);
    console.log("feeFrequency:", feeFrequency);
    console.log("feeType:", feeType);
    console.log("Is percentage?:", isPercentage);
    console.log("percentage:", percentage);
    console.log("Is feeAmount?:", isFlatRate);
    console.log("feeAmount:", feeAmount);
    console.log("feeAppliedTo:", feeAppliedTo);

    // const newFee = {
    //     fee_name: feeName,
    //     fee_type: feeType,
    //     frequency: feeFrequency,
    //     isPercentage: isPercentage,
    //     ...(isPercentage && { charge: percentage }),
    //     ...(isPercentage && { of: feeAppliedTo }),
    //     isFlatRate: isFlatRate,
    //     ...(isFlatRate && { charge: feeAmount }),
    // }

    const newFee = {
      fee_name: feeName,
      fee_type: feeType,
      frequency: feeFrequency,
      ...(feeType === "PERCENT" && { charge: percentage }),
      ...(feeType === "PERCENT" && { of: feeAppliedTo }),
      ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
    };

    onAddFee(newFee);
    handleClose();
  };

  return (
    <form onSubmit={handleAddFee}>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx = {{
        //     width: '100%',
        //     maxWidth: 'none',
        // }}
        maxWidth="xl"
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            maxWidth: "none",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: "bold",
            padding: "5px",
            color: "#3D5CAC",
          }}
        >
          Management Fees
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",

            fontSize: "15px",
            fontWeight: "bold",
            padding: "5px",
            color: "#3D5CAC",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "5px",
              color: "#3D5CAC",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginRight: "50px",
              }}
            >
              <Box>Fee Name</Box>
              {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
              <TextField
                name="fee_name"
                placeholder=""
                value={feeName}
                onChange={(event) => {
                  setFeeName(event.target.value);
                }}
                InputProps={{
                  sx: {
                    backgroundColor: "#D6D5DA",
                    height: "16px",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box>Frequency</Box>
              {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
              {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
              <Select
                value={feeFrequency}
                label="Frequency"
                onChange={handleFrequencyChange}
                sx={{
                  backgroundColor: "#D6D5DA",
                  height: "16px",
                  width: "200px", // Adjust the width as needed
                  padding: "8px", // Adjust the padding as needed
                }}
              >
                <MenuItem value={"one_time"}>One Time</MenuItem>
                <MenuItem value={"hourly"}>hourly</MenuItem>
                <MenuItem value={"daily"}>daily</MenuItem>
                <MenuItem value={"weekly"}>weekly</MenuItem>
                <MenuItem value={"biweekly"}>biweekly</MenuItem>
                <MenuItem value={"monthly"}>monthly</MenuItem>
                <MenuItem value={"annually"}>annually</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "15px",
            color: "#3D5CAC",
          }}
        >
          <RadioGroup row aria-label="fee-type-group-label" name="fee-type-radio-buttons-group" value={feeType} onChange={handleFeeTypeChange}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControlLabel value="PERCENT" control={<Radio sx={{ "&.Mui-checked": { color: "#3D5CAC" } }} />} label="Percent" />
              {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
              {feeType === "PERCENT" && (
                <Box>
                  <TextField
                    value={percentage}
                    label=""
                    variant="outlined"
                    // sx={{
                    //     width: '45px',
                    //     height: '3px',
                    // }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#D6D5DA",
                        width: "60px",
                        height: "20px",
                      },
                    }}
                    onChange={(event) => {
                      setPercentage(event.target.value);
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ "&.Mui-checked": { color: "#3D5CAC" } }} />} label="Flat Rate" />
              <Box sx={{ width: "60px", height: "20px" }}></Box>
            </Box>
            {feeType === "FLAT-RATE" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "20px",
                }}
              >
                Amount
                <TextField
                  name="flat-rate"
                  value={feeAmount}
                  placeholder=""
                  label=""
                  variant="outlined"
                  // sx={{
                  //     width: '45px',
                  //     height: '3px',
                  // }}

                  InputProps={{
                    sx: {
                      backgroundColor: "#D6D5DA",
                      width: "60px",
                      height: "20px",
                    },
                  }}
                  onChange={(event) => {
                    setFlatRate(event.target.value);
                  }}
                />
              </Box>
            )}
            {feeType === "PERCENT" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "20px",
                }}
              >
                Applied To
                {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                <Select
                  value={feeAppliedTo}
                  label="Applied To"
                  onChange={handleAppliedToChange}
                  sx={{
                    backgroundColor: "#D6D5DA",
                    height: "16px",
                    width: "200px", // Adjust the width as needed
                    padding: "8px", // Adjust the padding as needed
                  }}
                >
                  <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                  <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                  <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                </Select>
              </Box>
            )}
          </RadioGroup>
        </Box>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              "&:hover": {
                backgroundColor: "#fff",
              },
              color: "#160449",
            }}
          >
            Close
          </Button>
          <Button
            type="submit"
            onClick={handleAddFee}
            sx={{
              "&:hover": {
                backgroundColor: "#fff",
              },
              color: "#160449",
            }}
          >
            Add Fee
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

function EditFeeDialog({ open, handleClose, onEditFee, feeIndex, fees }) {
  const [feeName, setFeeName] = useState(fees[feeIndex].fee_name);
  useEffect(() => {
    console.log("FEE Name: ", feeName);
  }, [feeName]);

  const [feeType, setFeeType] = useState(fees[feeIndex].fee_type);
  useEffect(() => {
    console.log("FEE TYPE: ", feeType);
  }, [feeType]);

  const [isPercentage, setIsPercentage] = useState(fees[feeIndex].isPercentage);
  useEffect(() => {
    console.log("IS PERCENTAGE?: ", isPercentage);
  }, [isPercentage]);

  const [percentage, setPercentage] = useState(fees[feeIndex].charge);
  useEffect(() => {
    console.log("PERCENTAGE: ", percentage);
  }, [percentage]);

  const [isFlatRate, setIsFlatRate] = useState(fees[feeIndex].isFlatRate);
  useEffect(() => {
    console.log("IS FLAT RATE?: ", isFlatRate);
  }, [isFlatRate]);

  const [feeAmount, setFlatRate] = useState(fees[feeIndex].charge);
  useEffect(() => {
    console.log("FEE TYPE: ", feeAmount);
  }, [feeAmount]);

  const [feeFrequency, setFeeFrequency] = useState(fees[feeIndex].frequency);
  useEffect(() => {
    console.log("FEE FREQUENCY: ", feeFrequency);
  }, [feeFrequency]);

  const [feeAppliedTo, setFeeAppliedTo] = useState(fees[feeIndex].of);
  useEffect(() => {
    console.log("FEE APPLIED TO: ", feeAppliedTo);
  }, [feeAppliedTo]);

  const handleFeeTypeChange = (event) => {
    setFeeType(event.target.value);
    // console.log('FEE TYPE: ', selectedFeeType);
    if (event.target.value === "PERCENT") {
      setIsPercentage(true);
      setIsFlatRate(false);
    } else {
      setIsFlatRate(true);
      setIsPercentage(false);
    }
  };

  const handleFrequencyChange = (event) => {
    setFeeFrequency(event.target.value);
  };

  const handleAppliedToChange = (event) => {
    setFeeAppliedTo(event.target.value);
  };

  const handleEditFee = (event) => {
    event.preventDefault();

    console.log("FORM SUBMITTED ");
    console.log("feeName:", feeName);
    console.log("feeFrequency:", feeFrequency);
    console.log("feeType:", feeType);
    console.log("Is percentage?:", isPercentage);
    console.log("percentage:", percentage);
    console.log("Is feeAmount?:", isFlatRate);
    console.log("feeAmount:", feeAmount);
    console.log("feeAppliedTo:", feeAppliedTo);

    // const newFee = {
    //     fee_name: feeName,
    //     fee_type: feeType,
    //     frequency: feeFrequency,
    //     isPercentage: isPercentage,
    //     ...(isPercentage && { charge: percentage }),
    //     ...(isPercentage && { of: feeAppliedTo }),
    //     isFlatRate: isFlatRate,
    //     ...(isFlatRate && { charge: feeAmount }),
    // }
    const newFee = {
      fee_name: feeName,
      fee_type: feeType,
      frequency: feeFrequency,
      ...(feeType === "PERCENT" && { charge: percentage }),
      ...(feeType === "PERCENT" && { of: feeAppliedTo }),
      ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
    };
    onEditFee(newFee, feeIndex); // pass index also
    handleClose();
  };

  return (
    <form onSubmit={handleEditFee}>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx = {{
        //     width: '100%',
        //     maxWidth: 'none',
        // }}
        maxWidth="xl"
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            maxWidth: "none",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: "bold",
            padding: "5px",
            color: "#3D5CAC",
          }}
        >
          Management Fees
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",

            fontSize: "15px",
            fontWeight: "bold",
            padding: "5px",
            color: "#3D5CAC",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "5px",
              color: "#3D5CAC",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginRight: "50px",
              }}
            >
              <Box>Fee Name</Box>
              {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
              <TextField
                name="fee_name"
                placeholder=""
                value={feeName}
                onChange={(event) => {
                  setFeeName(event.target.value);
                }}
                InputProps={{
                  sx: {
                    backgroundColor: "#D6D5DA",
                    height: "16px",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box>Frequency</Box>
              {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
              {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
              <Select
                value={feeFrequency}
                label="Frequency"
                onChange={handleFrequencyChange}
                sx={{
                  backgroundColor: "#D6D5DA",
                  height: "16px",
                  width: "200px", // Adjust the width as needed
                  padding: "8px", // Adjust the padding as needed
                }}
              >
                <MenuItem value={"one_time"}>One Time</MenuItem>
                <MenuItem value={"hourly"}>Hourly</MenuItem>
                <MenuItem value={"daily"}>Daily</MenuItem>
                <MenuItem value={"weekly"}>Weekly</MenuItem>
                <MenuItem value={"bi_weekly"}>Biweekly</MenuItem>
                <MenuItem value={"monthly"}>Monthly</MenuItem>
                <MenuItem value={"annually"}>Annually</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "15px",
            color: "#3D5CAC",
          }}
        >
          <RadioGroup row aria-label="fee-type-group-label" name="fee-type-radio-buttons-group" value={feeType} onChange={handleFeeTypeChange}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControlLabel value="PERCENT" control={<Radio sx={{ "&.Mui-checked": { color: "#3D5CAC" } }} />} label="Percent" />
              {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
              {feeType === "PERCENT" && (
                <Box>
                  <TextField
                    value={percentage}
                    label=""
                    variant="outlined"
                    // sx={{
                    //     width: '45px',
                    //     height: '3px',
                    // }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#D6D5DA",
                        width: "60px",
                        height: "20px",
                      },
                    }}
                    onChange={(event) => {
                      setPercentage(event.target.value);
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ "&.Mui-checked": { color: "#3D5CAC" } }} />} label="Flat Rate" />
              <Box sx={{ width: "60px", height: "20px" }}></Box>
            </Box>
            {feeType === "FLAT-RATE" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "20px",
                }}
              >
                Amount
                <TextField
                  name="flat-rate"
                  value={feeAmount}
                  placeholder=""
                  label=""
                  variant="outlined"
                  // sx={{
                  //     width: '45px',
                  //     height: '3px',
                  // }}

                  InputProps={{
                    sx: {
                      backgroundColor: "#D6D5DA",
                      width: "60px",
                      height: "20px",
                    },
                  }}
                  onChange={(event) => {
                    setFlatRate(event.target.value);
                  }}
                />
              </Box>
            )}
            {feeType === "PERCENT" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "20px",
                }}
              >
                Applied To
                {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                <Select
                  value={feeAppliedTo}
                  label="Applied To"
                  onChange={handleAppliedToChange}
                  sx={{
                    backgroundColor: "#D6D5DA",
                    height: "16px",
                    width: "200px", // Adjust the width as needed
                    padding: "8px", // Adjust the padding as needed
                  }}
                >
                  <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                  <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                  <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                </Select>
              </Box>
            )}
          </RadioGroup>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button type="submit" onClick={handleEditFee}>
            Save Fee
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

export default PMProfileEdit;
