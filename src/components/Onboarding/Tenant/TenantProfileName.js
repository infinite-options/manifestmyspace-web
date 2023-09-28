import { useEffect } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
} from "@mui/material";
import theme from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { useMyContext } from "../../../contexts/TenantProfileContext";
import StatusBarPM2 from "../../../images/onboarding/status_bar_pm1.png";
import NewProfilePicture from "../../../images/onboarding/new_profile_picture.png";
import DefaultProfileImg from "../../../images/defaultProfileImg.svg";
import { useUser } from "../../../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA", // Update the background color here
      borderRadius: 10,
      height: 30,
      width: "90%",
      marginBlock: 10,
      paddingBottom: "15px",
      marginLeft: "5%",
    },
  },
}));

function TenantProfileName() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    tenant_first_name,
    update_tenant_first_name,
    tenant_last_name,
    update_tenant_last_name,
    tenant_photo,
    update_tenant_photo,
  } = useMyContext();

  const handleNextStep = () => {
    if (tenant_first_name === "") {
      alert("Please enter first name");
      return;
    }
    if (tenant_last_name === "") {
      alert("Please enter last name");
      return;
    }
    navigate("/tenantProfileDisplay");
  };

  const handleFirstNameChange = (event) => {
    update_tenant_first_name(event.target.value);
  };

  const handleLastNameChange = (event) => {
    update_tenant_last_name(event.target.value);
  };

  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
      update_tenant_photo(file);
    };
    reader.readAsDataURL(file.file);
  };

  const handlePhotoChange = (e) => {
    const file = {
      index: 0,
      file: e.target.files[0],
      image: null,
    };
    let isLarge = file.file.size > 5000000;
    let file_size = (file.file.size / 1000000).toFixed(1);
    if (isLarge) {
      alert(`Your file size is too large (${file_size} MB)`);
      return;
    }
    readImage(file);
  };

  useEffect(() => {
    update_tenant_first_name(user.first_name);
    update_tenant_last_name(user.last_name);
  }, []);

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
        <Box style={{ paddingBottom: "10%" }}></Box>
        <Paper
          style={{
            paddingTop: "10%",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
          }}
        >
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            flexDirection="column"
          >
            <>
              <Stack direction="row" justifyContent="center">
                <Box
                  sx={{
                    paddingLeft: "20%",
                    paddingTop: "10%",
                  }}
                >
                  <img src={StatusBarPM2} alt="step" />
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="center">
                <Typography
                  sx={{
                    color: theme.typography.propertyPage.color,
                    fontFamily: "Source Sans Pro",
                    fontWeight: theme.typography.common.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  {"Tenant Profile Info"}
                </Typography>
              </Stack>
              <Box sx={{ paddingTop: "10%" }}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Display Name"}
                </Typography>
              </Box>
            </>
          </Box>
          <Stack direction="row">
            <TextField
              name="tenant_first_name"
              value={tenant_first_name}
              onChange={handleFirstNameChange}
              variant="filled"
              fullWidth
              placeholder="First name"
              className={classes.root}
            />
            <TextField
              name="tenant_last_name"
              value={tenant_last_name}
              onChange={handleLastNameChange}
              variant="filled"
              fullWidth
              placeholder="Last name"
              className={classes.root}
            />
          </Stack>
          <Box sx={{ paddingTop: "8%" }} />
          <Stack direction="row" justifyContent="center">
            {tenant_photo && tenant_photo.image ? (
              <img
                key={Date.now()}
                src={tenant_photo.image}
                style={{
                  width: "121px",
                  height: "121px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                alt="profile"
              />
            ) : (
              <img
                src={DefaultProfileImg}
                alt="default"
                style={{ width: "121px", height: "121px", borderRadius: "50%" }}
              />
            )}
          </Stack>
          <Box sx={{ paddingTop: "8%" }} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              component="label"
              variant="contained"
              sx={{
                backgroundImage: `url(${NewProfilePicture})`,
                width: "193px",
                height: "35px",
                "&:hover, &:focus": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
          </Box>
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            position="relative"
            flexDirection="column"
            height="15.2vh"
          >
            <Button
              variant="contained"
              sx={{
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: "96%",
                height: "33px",
                borderRadius: "10px",
                marginLeft: "2%",
                position: "absolute",
                bottom: 15,
              }}
              onClick={handleNextStep}
            >
              {"Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default TenantProfileName;
