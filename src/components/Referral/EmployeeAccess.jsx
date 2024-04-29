import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  ThemeProvider,
  Form,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Input,
  Container,
  Radio,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  UploadFile,
  CardMedia,
  InputAdornment,
  Checkbox,
  Switch,
} from "@mui/material";
import { styled } from '@mui/material/styles';

import { withStyles } from "@mui/styles";

import theme from "../../theme/theme";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";



import APIConfig from "../../utils/APIConfig";

const CustomTextField = withStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        border: "none",
        '&.Mui-focused fieldset': {
          borderColor: 'transparent', // Remove border when focused
        },
        '&:hover fieldset': {
            borderColor: 'transparent', // Remove border on hover
          },
      },
    },
})(TextField);

const AccessSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

// Variable Declaration
export default function EmployeeAccess({}) {
  console.log("In ReferUser.jsx");
  const location = useLocation();
  let navigate = useNavigate();  
  const { user, selectedRole, selectRole, Name, getProfileId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);

  const [newRequests, setNewRequests] = useState([]);
  const [oldRequests, setOldRequests] = useState([]);
  const [businessOwners, setBusinessOwners] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

//   useEffect(() => {
//     console.log("newRequests - ", newRequests);
//   }, [newRequests]);

//   useEffect(() => {
//     console.log("oldRequests - ", oldRequests);
//   }, [oldRequests]);

//   useEffect(() => {
//     console.log("updatedData - ", updatedData);
//   }, [updatedData]);
    
  const handleBackButton = () => {
    console.log("handleBackButton");
    navigate(-1);
  };

  const handleVerificationChange = (updatedEmployee) => {
    setUpdatedData(prevData => [...prevData.filter(emp => emp.employee_uid !== updatedEmployee.employee_uid), updatedEmployee]);
  };

  useEffect(() => {
    setShowSpinner(true);    
    

    axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employee/${getProfileId()}`).then((res) => {
      const data = res.data?.employee?.result;               

      setNewRequests(data.filter((employee) => employee.employee_verification == null && employee.employee_role === "EMPLOYEE"))
      setOldRequests(data.filter((employee) => employee.employee_verification !== null && employee.employee_role === "EMPLOYEE"))
      setBusinessOwners(data.filter((employee) => employee.employee_role === "OWNER"))

      setShowSpinner(false);
      
    }).catch((error) => {
        if (error.response && error.response.status === 404) {
          // Display alert for user not found
          alert("Error fetching employee data");
        } else {
          // Handle other errors here
          console.error("Error fetching employee data:", error);
        }
        setShowSpinner(false);
    });

  }, []);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employeeVerification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update employee verification');
        }        
        setUpdatedData([]);
    } catch (error) {
    console.error('Error:', error.message);
    }

  };

  return (
    // <ThemeProvider theme={theme}>
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column", // Stack the content vertically
          justifyContent: "flex-start", // Start content at the top
          alignItems: "center", // Center content horizontally
          width: "100%",
          minHeight: "100vh",
          marginTop: theme.spacing(2), // Adjust this for desired distance from the top
          paddingBottom: "50px",
        }}
      >
        <Paper
          style={{
            margin: "30px",
            padding: theme.spacing(2),
            backgroundColor: "#F2F2F2",
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
          <Stack direction="row" justifyContent="center" alignItems="center" position="relative">
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                Employee Access
              </Typography>
            </Box>
            <Box position="absolute" right={0}>
              <Button onClick={() => handleBackButton()}>
                <CloseIcon sx={{ color: theme.typography.common.blue, fontSize: "30px", margin: "5px" }} />
              </Button>
            </Box>
          </Stack>

          <Stack direction="column" justifyContent="center" alignItems="center" padding="25px" onSubmit={handleSubmit}>
            <Box
              component="form"              
              noValidate
              autoComplete="off"
              id="employeeAccessForm"
              sx={{
                width: '80%',
              }}
            >
              <Grid container columnSpacing={12} rowSpacing={6}>                                                                        
                {
                    (newRequests && newRequests.length > 0) && (
                        <Grid item xs={12}>
                        <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont, fontWeight: theme.typography.primary.fontWeight }}>
                            NEW REQUESTS
                        </Typography>
                        {newRequests.map((employee) => (
                            <EmployeeCard key={employee.id} employee={employee} onVerificationChange={handleVerificationChange} />
                        ))}                  
                        </Grid>
                    )
                }

                {
                    (oldRequests && oldRequests.length > 0) && (
                        <Grid item xs={12}>
                            <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont, fontWeight: theme.typography.primary.fontWeight }}>
                                MANAGE ACCESS
                            </Typography>
                            {oldRequests.map((employee) => (
                                <EmployeeCard key={employee.id} employee={employee} onVerificationChange={handleVerificationChange} />
                            ))}                   
                        </Grid>
                    )
                }

{
                    (businessOwners && businessOwners.length > 0) && (
                        <Grid item xs={12}>
                            <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.mediumFont, fontWeight: theme.typography.primary.fontWeight }}>
                                BUSINESS OWNERS
                            </Typography>
                            {businessOwners.map((employee) => (
                                <EmployeeCard key={employee.id} employee={employee} onVerificationChange={handleVerificationChange} />
                            ))}                   
                        </Grid>
                    )
                }


              </Grid>
            </Box>
          </Stack>
        </Paper>
        {/* Submit Button */}
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
              flexDirection: "column",
            }}
            noValidate
            autoComplete="off"
          >
            <Grid container columnSpacing={12} rowSpacing={6} sx={{ display: "flex", paddingBottom: "20px", }}>
              <Grid item xs={12}>
                <Button variant="contained" type="submit" form="employeeAccessForm" sx={{ width: "300px", backgroundColor: "#9EAED6", "&:hover, &:focus, &:active": { background: "#9EAED6" } }}>
                  <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Save
                  </Typography>
                </Button>
              </Grid>
              
            </Grid>                        
          </Box>
        </Stack>
      </Stack>      
      </>
    // </ThemeProvider>
  );
}


function EmployeeCard({ employee, onVerificationChange }) {
    const [verification, setVerification] = useState(employee.employee_verification === 'Y');
  
    const handleToggle = () => {
      const newVerification = !verification;
      setVerification(newVerification);
      onVerificationChange({ employee_uid: employee.employee_uid, employee_verification: newVerification ? "Y" : "N" });
    };

    const getBorderColor = (verification) => {      
        // return data.sender_role === 'admin' ? 'blue' : 'green';
        let color = "#3D5CAC"
        if(verification && verification === "Y"){
            return "#3D5CAC"
        }
        return "#A52A2A"        
    };
  
    return (
        <Paper elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
          <Box display="flex" alignItems="center">
            <Box
              className="announcement-list-card-picture-container"
              style={{
                marginRight: "10px", // Add margin to separate picture from other information
              }}
            >
              <Box
                className="announcement-list-card-picture"
                style={{
                  width: '40px',
                  height: '40px',
                  border: "4px solid transparent",
                  borderRadius: "50%",
                  borderColor: getBorderColor(employee.employee_verification),
                  overflow: "hidden"
                }}
              >
                {employee.employee_photo_url ? (
                  <img
                    src={employee.employee_photo_url}
                    alt="Sender"
                    className="announcement-list-card-profile-img"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  <img
                    src={DefaultProfileImg}
                    alt="Default"
                    className="announcement-list-card-profile-img"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {employee.employee_first_name + " " + employee.employee_last_name}
              </Typography>
              <Typography variant="subtitle1">
                {employee.employee_email}
              </Typography>
            </Box>
            <Box ml="auto"> {/* Pushes the switch to the right */}
              <AccessSwitch
                checked={verification}
                onChange={handleToggle}
                color="primary"
                inputProps={{ 'aria-label': 'toggle verification' }}
                disabled={employee.employee_role === "OWNER"}
              />
            </Box>
          </Box>
        </Paper>
      );
  }