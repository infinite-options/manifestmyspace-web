import React, { Component, useState, useEffect } from "react";
import { Paper, Box, Grid, Stack, ThemeProvider, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import theme from "../../theme/theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import PhotoIcon from "@mui/icons-material/Photo";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA", // Update the background color here
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
    },
  },
}));

export default function ChangePasswordSettings(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  // console.log("USER - ", user);
  const location = useLocation();
  let owner_data = props.owner_data;
  console.log('inside owner password change', owner_data);

  const [modifiedData, setModifiedData] = useState({ user_uid: user?.user_uid });
  const [isEdited, setIsEdited] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [emailAddress, setEmailAddress] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleInputChange = (event) => {
    console.log("Input changed");
    const { name, value } = event.target;
    // console.log(name)
    // console.log(value)

    if (name === "current_password") {
      setCurrentPassword(value);
      setModifiedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "new_password") {
      setNewPassword(value);
      setModifiedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "confirm_new_password") {
      setConfirmNewPassword(value);
    } else if (name === "email_address") {
      setEmailAddress(value);
      setIsForgotPassword(true);
    }

    setIsEdited(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("FORM SUBMITTED");
    console.log(modifiedData);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "*",
    };
    const passwordsMatch = newPassword === confirmNewPassword;

    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }
    if (isEdited) {
      console.log("EDITED");
      if (emailAddress === "") {
        // axios.put('http://localhost:4000/ownerProfile', modifiedData, headers)
        axios
          .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/password", modifiedData, headers)
          .then((response) => {
            console.log("Data updated successfully");
            setIsEdited(false); // Reset the edit status
            props.setRHS("form");
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
              alert(error.response.data.message);
            }
          });
      } else {
        axios
          .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/SetTempPassword/MYSPACE", {
            email: emailAddress,
          })
          .then((response) => {
            setEmailAddress("");
            if (response.data.code === 200) {
              console.log(response.data.message);
            }
            if (response.data.code === 280) {
              console.log(response);
              alert("No account found with that email.");
              return;
            }
          });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", // Take up full screen width
          height: "100vh", // Set the Box height to full view height
          justifyContent: "flex-start", // Align items at the top
        }}
      >
        <Box
          style={{
            width: "100%",
            backgroundColor: theme.palette.custom.bgBlue,
            height: "25%", // 25% of the container's height
          }}
        >
          <Box component="span" display="flex" margin="10px" justifyContent="center" alignItems="center" position="relative">
            <UTurnLeftIcon
              sx={{
                transform: "rotate(90deg)",
                color: theme.typography.secondary.white,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
                padding: 5,
                position: "absolute",
                left: 0,
              }}
              onClick={() => {
                props.setRHS("form");
              }}
            />
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.secondary.white,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              Settings
            </Typography>
          </Box>
          <Paper
            style={{
              margin: 'auto',
              padding: theme.spacing(2),
              backgroundColor: theme.palette.primary.main,
              width: "85%", // Occupy full width with 25px margins on each side
              justifyContent:'center',
              alignItems:'center',
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
          >
            <Box component="span" display="flex" justifyContent="center" alignItems="center" position="relative" flexDirection="column">
              {owner_data && owner_data.owner_photo_url !== null ? (
                <img
                  src={owner_data.owner_photo_url}
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    color: theme.typography.common.blue,
                    width: 45,
                    height: 45,
                    position: "absolute",
                    left: 0,
                  }}
                />
              ) : (
                <AccountCircleIcon
                  sx={{
                    color: theme.typography.common.blue,
                    width: 45,
                    height: 45,
                    position: "absolute",
                    left: 0,
                  }}
                />
              )}
              <>
                <Stack direction="row" justifyContent="center">
                  <Typography
                    sx={{
                      justifySelf: "center",
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: theme.typography.largeFont,
                    }}
                  >
                    {owner_data && owner_data.owner_first_name ? owner_data.owner_first_name : "<FIRST_NAME>"} {owner_data && owner_data.owner_last_name ? owner_data.owner_last_name : "<LAST_NAME>"}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="center">
                  <Typography
                    sx={{
                      justifySelf: "center",
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.light.fontWeight,
                      fontSize: theme.typography.primary.smallFont,
                    }}
                  >
                    Changing Password Affects All Profiles
                  </Typography>
                </Stack>
              </>
            </Box>
            <hr />
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" id="editProfileForm">
              <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Old Password</Typography>
                <TextField
                  name="current_password"
                  value={currentPassword}
                  onChange={handleInputChange}
                  variant="filled"
                  fullWidth
                  placeholder="Old Password"
                  type="password"
                  className={classes.root}
                ></TextField>
              </Stack>
              <hr />

              <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>New Password</Typography>
                <TextField
                  name="new_password"
                  value={newPassword}
                  onChange={handleInputChange}
                  variant="filled"
                  fullWidth
                  placeholder="New Password"
                  type="password"
                  className={classes.root}
                ></TextField>
              </Stack>

              <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Confirm Password</Typography>
                <TextField
                  name="confirm_new_password"
                  value={confirmNewPassword}
                  onChange={handleInputChange}
                  variant="filled"
                  fullWidth
                  placeholder="Confirm Password"
                  type="password"
                  className={classes.root}
                ></TextField>
              </Stack>
              <hr />

              <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Forgot Password?</Typography>
                <TextField
                  name="email_address"
                  value={emailAddress}
                  onChange={handleInputChange}
                  variant="filled"
                  fullWidth
                  placeholder="Enter email address"
                  className={classes.root}
                ></TextField>
                {/* <TextField name="email_address" value={(event) => console.log("EMAIL ADDRESS:", event.target.value)} onChange={handleInputChange} variant="filled" fullWidth placeholder="Enter email address" className={classes.root}></TextField> */}
              </Stack>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  type="submit"
                  form="editProfileForm"
                  sx={{
                    width: "100%",
                    backgroundColor: "#3D5CAC",
                    "&:hover": {
                      backgroundColor: "#3D5CAC",
                    },
                    borderRadius: "10px",
                  }}
                >
                  <Typography sx={{ textTransform: "none", color: "white", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Save And Submit!
                  </Typography>
                </Button>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
