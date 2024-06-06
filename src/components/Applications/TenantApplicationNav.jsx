import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import EmailIcon from "../Property/messageIconDark.png";
import PhoneIcon from "../Property/phoneIconDark.png";
import AES from "crypto-js/aes";
import CloseIcon from "@mui/icons-material/Close";

const TenantApplicationNav = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { index, property, isDesktop } = state;
  const { applications } = property;
  const [currentIndex, setCurrentIndex] = useState(index || 0);
  const [application, setApplication] = useState(applications[currentIndex]);
  //   useEffect(() => {
  //     console.log("application - ", application);
  // }, [application]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [vehicles, setVehicles] = useState(
    JSON.parse(application?.tenant_vehicle_info || '["No Vehicle Information"]')
  );
  const [adultOccupants, setAdultOccupants] = useState(
    JSON.parse(application?.tenant_adult_occupants || '["No Adult Occupants"]')
  );
  const [petOccupants, setPetOccupants] = useState(
    JSON.parse(application?.tenant_pet_occupants || '["No Pet Occupants"]')
  );
  const [childOccupants, setChildOccupants] = useState(
    JSON.parse(
      application?.tenant_children_occupants || '["No Child Occupants"]'
    )
  );
  const [applicationDocuments, setApplicationDocuments] = useState(JSON.parse(application.lease_documents));
  // useEffect(() => {
  //     console.log("applicationDocuments - ", applicationDocuments);
  // }, [applicationDocuments]);
  function formatDocumentType(type) {
    switch(type){            
      case "income_proof": return "Proof of Income";
      case "bank_statement": return "Bank Statement";
      case "id": return "ID";
      case "renters_insurance_proof": return "Proof of Renter's Insurance";
      case "ssn": return "SSN";
      case "credit_report": return "Credit Report";
      case "reference": return "Reference";
      case "other": return "Other";

      default: return "";
    }
  }
  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % applications.length);
  };
  const handlePreviousCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + applications.length) % applications.length
    );
  };
  const handleRejectLease = async () => {

    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", application.lease_uid);
    leaseApplicationFormData.append("lease_status", "RESCIND");

    setShowSpinner(true);
    await fetch(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`,
      {
        method: "PUT",
        body: leaseApplicationFormData
      }
    );
    setShowSpinner(false);
    navigate("/managerDashboard");
  };
  const handleCreateLease = () => {
    navigate("/tenantLease", { state: { page: "create_lease", application, property } });
  }

  const handleEditLease = () => {
    navigate("/tenantLease", { state: { page: "edit_lease", application, property } });
  }

  const handleWithdrawLease = async () => {

    const leaseApplicationFormData = new FormData();
    leaseApplicationFormData.append("lease_uid", application.lease_uid);
    leaseApplicationFormData.append("lease_status", "RESCIND");

    setShowSpinner(true);
    await fetch(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`,
      {
        method: "PUT",
        body: leaseApplicationFormData
      }
    );
    setShowSpinner(false);
    navigate("/managerDashboard");
  };


  useEffect(() => {
    const currApp = applications[currentIndex];
    setApplication(currApp);
    setVehicles(
      JSON.parse(currApp?.tenant_vehicle_info || '["No Vehicle Information"]')
    );
    setAdultOccupants(
      JSON.parse(currApp?.tenant_adult_occupants || '["No Adult Occupants"]')
    );
    setPetOccupants(
      JSON.parse(currApp?.tenant_pet_occupants || '["No Pet Occupants"]')
    );
    setChildOccupants(
      JSON.parse(currApp?.tenant_children_occupants || '["No Child Occupants"]')
    );
  }, [currentIndex, applications]);

  const handleCloseButton = (e) => {
    e.preventDefault();
    if (isDesktop === true) {
      navigate('/properties', { state: { index: index } });
    } else {
      navigate(-1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
          paddingBottom: "50px",
        }}
      >
        <Paper
          style={{
            backgroundColor: theme.palette.primary.main,
            width: "100%",
            paddingTop: "10px",
          }}
        >
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Box
              sx={{
                borderBottom: 0,
                width: "90%",
              }}
            >
              <Paper
                sx={{
                  backgroundColor: theme.palette.form.main,
                }}
              >
                <Box
                  sx={{
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: theme.spacing(2),
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#160449",
                        position: "relative",
                        borderRadius: "10px 10px 0 0",
                        paddingTop: "10px",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button
                          onClick={handlePreviousCard}
                          disabled={currentIndex === 0}
                        >
                          {currentIndex === 0 ? (
                            <ArrowBackIcon
                              sx={{
                                color: "#A0A0A0",
                                width: "25px",
                                height: "25px",
                                margin: "0px",
                              }}
                            />
                          ) : (
                            <ArrowBackIcon
                              sx={{
                                width: "25px",
                                height: "25px",
                                margin: "0px",
                              }}
                            />
                          )}
                        </Button>
                        <Stack
                          direction="column"
                          margin="0px"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography
                            sx={{
                              color: "#FFFFFF",
                              fontWeight:
                                theme.typography.propertyPage.fontWeight,
                              fontSize: "16px",
                            }}
                          >
                            {`${currentIndex + 1} of ${
                              applications.length
                              } Applicants`}
                          </Typography>
                        </Stack>
                        <Button
                          onClick={handleNextCard}
                          disabled={currentIndex === applications.length - 1}
                        >
                          {currentIndex === applications.length - 1 ? (
                            <ArrowForwardIcon
                              sx={{
                                color: "#A0A0A0",
                                width: "25px",
                                height: "25px",
                                margin: "0px",
                              }}
                            />
                          ) : (
                            <ArrowForwardIcon
                              sx={{
                                width: "25px",
                                height: "25px",
                                margin: "0px",
                              }}
                            />
                          )}
                        </Button>
                        <Box position="absolute" right={0}>
                          <Button onClick={(e) => handleCloseButton(e)}>
                            <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
                          </Button>
                        </Box>
                      </Stack>
                      <Typography
                        align="center"
                        sx={{
                          fontSize: "15px",
                          fontFamily: "Source Sans 3, sans-serif",
                          margin: "0 18px",
                          color: "#FFFFFF",
                          fontWeight: 800,
                          marginTop: "10px",
                          marginBottom: "50px",
                        }}
                      >
                        {application.tenant_first_name +
                          " " +
                          application.tenant_last_name}
                      </Typography>
                      <Avatar
                        src={application.tenant_photo_url}
                        sx={{
                          width: "60px",
                          height: "60px",
                          position: "absolute",
                          bottom: "-30px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ paddingTop: "50px", paddingLeft: "15px" }}>
                    <Grid container>
                      <Grid item xs={1}>
                        <img src={EmailIcon} alt="email" />
                      </Grid>
                      <Grid item xs={7}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            paddingLeft: "10px",
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#160449",
                          }}
                        >
                          {application.tenant_email}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}></Grid>
                      <Grid item xs={1}>
                        <img src={PhoneIcon} alt="phone" />
                      </Grid>
                      <Grid item xs={7}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            paddingLeft: "10px",
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#160449",
                          }}
                        >
                          {application.tenant_phone_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}></Grid>
                      <Grid item xs={12}>
                        {/* <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Current Address"}
                          </Typography> */}
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#160449",
                          }}
                        >{`${application.tenant_address}, ${application.tenant_city}, ${application.tenant_state} ${application.tenant_zip}`}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                        <Stack sx={{
                          marginLeft: '0px',
                        }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {"***-**-" +
                              AES.decrypt(
                                application.tenant_ssn,
                                process.env.REACT_APP_ENKEY
                              )
                                .toString()
                                .slice(-4)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {"SSN"}
                          </Typography>

                        </Stack>
                        <Stack sx={{marginRight: '40px',}}>                                                    
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_drivers_license_number? application.tenant_drivers_license_number : "<LICENSE_NUM>"}/
                            {application.tenant_drivers_license_state? application.tenant_drivers_license_state : "<LICENSE/STATE>"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {"License Number/ State"}
                          </Typography>
                        </Stack>
                      </Grid>
                      {/* <Grid item xs={6}>
                        <Stack sx={{
                            marginLeft: '20px',
                          }}>                          
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                              }}
                            >
                              {"***-**-" +
                                AES.decrypt(
                                  application.tenant_ssn,
                                  process.env.REACT_APP_ENKEY
                                )
                                  .toString()
                                  .slice(-4)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",                              
                              }}
                            >
                              {"SSN"}
                            </Typography>
                            
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Stack sx={{marginRight: '40px',}}>                                                    
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_drivers_license_number? application.tenant_drivers_license_number : "<LICENSE_NUM>"}/
                            {application.tenant_drivers_license_state? application.tenant_drivers_license_state : "<LICENSE/STATE>"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {"License Number/ State"}
                          </Typography>
                        </Stack>
                      </Grid> */}
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Current Salary"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_current_salary}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Salary Frequency"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_salary_frequency}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Company Name"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_current_job_company}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Job Title"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_current_job_title}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Current Address"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_address}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Unit #"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_unit}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"City/ State"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_city}/{" "}
                            {application.tenant_state}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#3D5CAC",
                            }}
                          >
                            {"Zip Code"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Source Sans Pro, sans-serif",
                              color: "#160449",
                            }}
                          >
                            {application.tenant_zip}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#3D5CAC",
                          }}
                        >
                          {adultOccupants?.length} {"Adults"}
                        </Typography>
                        {adultOccupants &&
                          adultOccupants.map((occupant, index) => (
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                              }}
                              key={index}
                            >
                              {occupant.name} {occupant.last_name} |{" "}
                              {occupant.relationship} | DOB: {occupant.dob}
                            </Typography>
                          ))}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#3D5CAC",
                          }}
                        >
                          {childOccupants?.length} {"Children"}
                        </Typography>
                        {childOccupants &&
                          childOccupants.map((occupant, index) => (
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                              }}
                              key={index}
                            >
                              {occupant.name} {occupant.last_name} |{" "}
                              {occupant.relationship} | DOB: {occupant.dob}
                            </Typography>
                          ))}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#3D5CAC",
                          }}
                        >
                          {petOccupants?.length} {"Pets"}
                        </Typography>
                        {petOccupants &&
                          petOccupants.map((occupant, index) => (
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                              }}
                              key={index}
                            >
                              {occupant.name} | {occupant.type} |{" "}
                              {occupant.breed} | Weight: {occupant.weight}
                            </Typography>
                          ))}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontFamily: "Source Sans Pro, sans-serif",
                            color: "#3D5CAC",
                          }}
                        >
                          {vehicles?.length} {"Vehicles"}
                        </Typography>
                        {vehicles &&
                          vehicles.map((vehicle, index) => (
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontFamily: "Source Sans Pro, sans-serif",
                                color: "#160449",
                              }}
                              key={index}
                            >
                              {vehicle.make} {vehicle.model} | {vehicle.year} |{" "}
                              {vehicle.license} | {vehicle.state}
                            </Typography>
                          ))}
                      </Grid>
                      <Grid item xs={12} sx={{
                        marginRight: '30px',
                      }}>
                        <Typography
                          sx={{
                            justifySelf: 'center',
                            color: theme.typography.common.blue,
                            fontSize: 13,
                          }}
                        >
                          Application Documents:
                        </Typography>
                        <Box
                          sx={{
                                    display:'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '5px',
                            color: theme.typography.common.blue,
                            fontSize: 13,
                          }}
                        >
                          <Box>Filename</Box>
                          <Box>Type</Box>
                        </Box>
                        {applicationDocuments && [...applicationDocuments].map((doc, i) => (
                          <>
                            <Box
                              key={i}
                              sx={{
                                            display:'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 13
                              }}
                            >
                              <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                <Box
                                  sx={{
                                    // height: '16px',
                                    width: '100%',
                                    cursor: 'pointer', // Change cursor to indicate clickability
                                    color: "#160449",
                                  }}
                                >
                                  {doc.filename}
                                </Box>
                              </a>
                                        <Box sx={{color: "#160449",}}>
                                {formatDocumentType(doc.type)}
                              </Box>
                            </Box>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-around"
                      sx={{ padding: "30px 0", paddingRight: "15px" }}
                    >
                      {application.lease_status === "NEW" && (
                        <Button
                          onClick={handleRejectLease}
                          sx={{
                            backgroundColor: "#CB8E8E",
                            color: "#160449",
                            textTransform: "none",
                            width: "120px",
                            "&:hover, &:focus, &:active": {
                              backgroundColor: "#CB8E8E",
                            },
                          }}
                        >
                          {"Reject Tenant"}
                        </Button>
                      )}
                      {application.lease_status === "PROCESSING" && (
                        <div>
                          <Button
                            onClick={handleWithdrawLease}
                            sx={{
                              backgroundColor: "#CB8E8E",
                              color: "#160449",
                              textTransform: "none",
                              width: "160px", // Adjusted width to accommodate the text on one line
                              marginRight: "10px", // Add space between buttons
                              marginRight: "30px", // Add space between buttons
                              whiteSpace: "nowrap", // Prevent line breaks
                              "&:hover, &:focus, &:active": {
                                backgroundColor: "#9EAED6",
                              },
                            }}
                          >
                            {"Withdraw Lease"}
                          </Button>
                          <Button
                            onClick={handleEditLease}
                            sx={{
                              backgroundColor: "#9EAED6",
                              color: "#160449",
                              textTransform: "none",
                              width: "120px",
                              "&:hover, &:focus, &:active": {
                                backgroundColor: "#9EAED6",
                              },
                            }}
                          >
                            {"Edit Lease"}
                          </Button>

                        </div>
                      )}
                      {application.lease_status !== "PROCESSING" && (
                        <Button
                          onClick={handleCreateLease}
                          sx={{
                            backgroundColor: "#9EAED6",
                            color: "#160449",
                            textTransform: "none",
                            width: "120px",
                            "&:hover, &:focus, &:active": {
                              backgroundColor: "#9EAED6",
                            },
                          }}
                        >
                          {"New Lease"}
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default TenantApplicationNav;
