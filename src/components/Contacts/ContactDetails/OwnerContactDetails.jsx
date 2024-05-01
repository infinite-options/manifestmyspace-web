import React, { useEffect, useState } from "react";
import theme from "../../../theme/theme";
import { ThemeProvider, Box, Paper, Stack, Typography, Button } from "@mui/material";
import { getStatusColor } from "../ContactsFunction";
import { Email, Message, Phone } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";
import { useUser } from "../../../contexts/UserContext";
import User_fill from "../../../images/User_fill_dark.png";

const OwnerContactDetails = (props) => {
  console.log("In Onwer Contact Details", props);
  const { selectedRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const contactDetails = location.state.dataDetails;
  const contactsTab = location.state.tab;
  // const selectedData = location.state.selectedData;
  // const index = location.state.index;
  const [index, setIndex] = useState(location.state.index);
  // const passedData = location.state.viewData;

  useEffect(() => {
    console.log("INDEX UPDATED - ", index);
    // location.state.index = index;
    console.log("DATA DETAILS", contactDetails[index]);
  }, [index]);

  //   console.log("Data details passed 1: ", contactDetails);
  //   console.log("Data details passed 2: ", contactDetails[0]);
  //   console.log("Data details passed 3: ", contactDetails[0].entities);
  //   console.log("Data details passed 4: ", contactDetails[3].entities);

  // console.log(selectedData);
  console.log("INDEX", index);
  console.log("SELECTED ROLE - ", selectedRole);

  const handleBackBtn = () => {
    // navigate('/PMContacts');
    navigate(-1);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          fontFamily: "Source Sans Pro",
          justifyContent: "center",
          width: "100%", // Take up full screen width
          minHeight: "90vh", // Set the Box height to full height
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
          <Stack alignItems="center">
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontSize: theme.typography.largeFont.fontSize,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              Owner Contact
            </Typography>
            <Stack flexDirection="row" justifyContent="center">
              <Button sx={{ padding: "0", minWidth: "50px" }} onClick={handleBackBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                    fill="#3D5CAC"
                  />
                </svg>
              </Button>
              <Typography
                sx={{
                  color: theme.typography.common.blue,
                  fontSize: theme.typography.smallFont.fontSize,
                }}
                onClick={handleBackBtn}
              >
                Return to Viewing All Listings
              </Typography>
            </Stack>
          </Stack>
          <Paper
            sx={{
              margin: "10px",
              borderRadius: "10px",
              backgroundColor: theme.palette.form.main,
              paddingBottom: "25px",
            }}
          >
            <Stack
              sx={{
                color: theme.typography.secondary.white,
                backgroundColor: getStatusColor(contactsTab),
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                sx={{
                  padding: "5px 10px",
                }}
              >
                <Box
                  onClick={() => {
                    console.log("Previous button clicked", index, contactDetails.length);
                    index > 0 ? setIndex(index - 1) : setIndex(contactDetails.length - 1);
                  }}
                >
                  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                      fill={theme.typography.secondary.white}
                    />
                  </svg>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: theme.typography.primary.fontWeight,
                    }}
                  >
                    {index + 1} of {contactDetails.length} Owners
                    {/* {contactsTab} */}
                  </Typography>
                </Box>
                <Box
                  onClick={() => {
                    console.log("Next button clicked");
                    index < contactDetails.length - 1 ? setIndex(index + 1) : setIndex(0);
                  }}
                >
                  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                      fill={theme.typography.secondary.white}
                    />
                  </svg>
                </Box>
              </Stack>
              <Stack
                alignItems="center"
                sx={{
                  backgroundColor: getStatusColor(contactsTab),
                  paddingBottom: "70px",
                  boxShadow: "0 4px 2px 0 #00000025",
                  // padding: "5px 15px 50px 15px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: theme.typography.common.fontWeight,
                  }}
                >
                  {`
                    ${contactDetails[index].contact_first_name ? contactDetails[index].contact_first_name : "<FIRST_NAME>"}
                    ${contactDetails[index].contact_last_name ? contactDetails[index].contact_last_name : "<LAST_NAME>"}`}
                </Typography>
              </Stack>
            </Stack>
            <Stack justifyContent="center" alignItems="center">
              <Box
                sx={{
                  backgroundColor: "#A9A9A9",
                  height: "68px",
                  width: "68px",
                  borderRadius: "68px",
                  marginTop: "-34px",
                }}
              >
                <img
                  src={contactDetails[index].contact_photo_url ? contactDetails[index].contact_photo_url : User_fill}
                  alt="profile placeholder"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "68px",
                    margin: "4px",
                  }}
                />
              </Box>
            </Stack>
            <Stack sx={{ padding: "10px 15px 0" }}>
              <Box>
                <Message
                  sx={{
                    color: theme.typography.common.blue,
                    fontSize: "18px",
                  }}
                />
              </Box>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" sx={{ padding: "0 15px" }}>
              <Stack>
                <Stack flexDirection="row">
                  <Email
                    sx={{
                      color: "#160449",
                      fontSize: "18px",
                      paddingRight: "5px",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "13px",
                    }}
                  >
                    {contactDetails[index].contact_email ? contactDetails[index].contact_email : "<EMAIL>"}
                  </Typography>
                </Stack>
                <Stack flexDirection="row">
                  <Phone
                    sx={{
                      color: "#160449",
                      fontSize: "18px",
                      paddingRight: "5px",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "13px",
                    }}
                  >
                    {contactDetails[index].contact_phone_number ? formattedPhoneNumber(contactDetails[index].contact_phone_number) : "<PHONE_NUMBER>"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack flexDirection="row" sx={{ padding: "0 15px" }}>
              <Box sx={{ marginTop: "-2px" }}>
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.27446 10.5314C5 11.152 5 11.8581 5 13.2701V17.6801C5 19.6412 5 20.6217 5.58579 21.2309C6.11733 21.7837 6.94285 21.8349 8.5 21.8396V16.6402C8.5 15.5509 9.35883 14.6002 10.5 14.6002H13.5C14.6412 14.6002 15.5 15.5509 15.5 16.6402V21.8396C17.0572 21.8349 17.8827 21.7837 18.4142 21.2309C19 20.6217 19 19.6412 19 17.6801V13.2701C19 11.8581 19 11.152 18.7255 10.5314C18.4511 9.91081 17.9356 9.45132 16.9047 8.53236L15.9047 7.64093C14.0414 5.97992 13.1098 5.14941 12 5.14941C10.8902 5.14941 9.95857 5.97992 8.09525 7.64094L7.09525 8.53236C6.06437 9.45132 5.54892 9.91081 5.27446 10.5314ZM13.5 21.8401V16.6402C13.5 16.6191 13.4934 16.6066 13.4883 16.6002H10.5117C10.5066 16.6066 10.5 16.6191 10.5 16.6402V21.8401H13.5Z"
                    fill="#160449"
                  />
                </svg>
              </Box>
              <Typography sx={{ fontSize: "13px" }}>
                {contactDetails[index].contact_address ? contactDetails[index].contact_address : "<ADDRESS1>"}
                {contactDetails[index].contact_unit ? contactDetails[index].contact_unit : ""} {", "}
                {contactDetails[index].contact_city ? contactDetails[index].contact_city : "<CITY1>"} {", "}
                {contactDetails[index].contact_state ? contactDetails[index].contact_state : "<STATE>"} {", "}
                {contactDetails[index].contact_zip ? contactDetails[index].contact_zip : "<ZIP>"}
              </Typography>
            </Stack>

            <Stack sx={{ padding: "15px" }}>
              <Typography
                sx={{
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {/* {selectedData.property_count} Properties */}
                {console.log("In Contact JS:", contactDetails[index].entities, typeof contactDetails[index].entities)}
                {contactDetails[index].property_count ? contactDetails[index].property_count : "<PROPERTY_COUNT>"} Properties
              </Typography>
              {contactDetails[index].entities !== null &&
                JSON.parse(contactDetails[index].entities).map((entity, index) => (
                  <>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontSize: "13px",
                        fontWeight: theme.typography.primary.fontWeight,
                        textDecoration: "underline",
                      }}
                      key={index}
                    >
                      {`
                        ${entity.agreement_status ? entity.agreement_status : "<STATUS>"}
                        `}
                    </Typography>

                    {console.log("After 1st Map:", entity, typeof entity)}

                    {entity.properties.map((property, index) => (
                      <Typography
                        sx={{
                          color: theme.typography.common.blue,
                          fontSize: "13px",
                          fontWeight: theme.typography.primary.fontWeight,
                          textDecoration: "underline",
                          marginLeft: "20px",
                        }}
                        key={index}
                      >
                        {`                        
                        ${property.property_address ? property.property_address : "<Address2>"}
                        ${property.property_unit ? property.property_unit : ""},
                        ${property.property_city ? property.property_city : "<City2>"}
                        ${property.property_state ? property.property_state : "<State>"}
                        ${property.property_zip ? property.property_zip : "<ZIP>"}
                        `}
                      </Typography>
                    ))}
                  </>
                ))}
            </Stack>

            <Stack sx={{ padding: "15px" }}>
              <Typography
                sx={{
                  fontWeight: theme.typography.primary.fontWeight,
                }}
              >
                {/* {selectedData.property_count} Properties */}
                {console.log("In Payment JS:", contactDetails[index].payment_method, typeof contactDetails[index].payment_method)}
                Payment Methods
              </Typography>
              {contactDetails[index].payment_method !== null &&
                JSON.parse(contactDetails[index].payment_method).map((method, index) => (
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontSize: "13px",
                      fontWeight: theme.typography.primary.fontWeight,
                      textDecoration: "underline",
                    }}
                    key={index}
                  >
                    {`
                        ${method.paymentMethod_type ? method.paymentMethod_type : "<Payment Method>"}
                        ${method.paymentMethod_status ? method.paymentMethod_status : "Not Active"}
                        `}
                  </Typography>
                ))}
            </Stack>

            <Stack sx={{ padding: "15px" }}>
              <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Stack flexDirection="row" alignItems="center">
                    <Box sx={{ padding: "0 10px" }}>
                      <img
                        src={require("../../Profile/Images/PaypalIcon.png")}
                        alt="chase"
                        style={{
                          height: "25px",
                        }}
                      />
                    </Box>
                    <Stack>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {/* {selectedData.contact_paypal} */}
                        {contactDetails[index].contact_paypal ? contactDetails[index].contact_paypal : "<PAYPAL>"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Stack justifyContent="space-between" alignItems="center" sx={{ paddingLeft: "30px" }}>
                  {!contactDetails[index].hasOwnProperty("contact_ssn") || contactDetails[index].contact_ssn === "" ? (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      No SSN Provided
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      {contactDetails[index].hasOwnProperty("contact_ssn") && maskSSN(contactDetails[index].contact_ssn)}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: "13px",
                    }}
                  >
                    SSN
                  </Typography>
                </Stack>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Stack flexDirection="row" alignItems="center">
                    <Box sx={{ padding: "0 10px" }}>
                      <img
                        src={require("../../Profile/Images/VenmoIcon.png")}
                        alt="venmo"
                        style={{
                          height: "25px",
                        }}
                      />
                    </Box>
                    <Stack>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {contactDetails[index].contact_venmo ? contactDetails[index].contact_venmo : "<VENMO>"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Stack justifyContent="space-between" alignItems="center" sx={{ paddingLeft: "15px" }}>
                  {contactDetails[index].contact_ein_number === "" ? (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      No EIN Provided
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      {maskEIN(contactDetails[index].contact_ein_number)}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: "13px",
                    }}
                  >
                    EIN
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default OwnerContactDetails;
