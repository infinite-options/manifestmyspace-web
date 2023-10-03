import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import { useUser } from "../../contexts/UserContext";
import Status14 from "../../images/status_1_4.svg";
import Status13 from "../../images/status_1_3.svg";
import Status12 from "../../images/status_1_2.svg";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import NewBusinessLogo from "../../images/NewBusinessLogo.svg";
import NewProfilePicture from "../../images/NewProfilePicture.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      width: "90%",
      marginBlock: 10,
      paddingBottom: "15px",
      marginLeft: "5%",
    },
  },
  select: {
    backgroundColor: "#D6D5DA",
    height: 30,
    width: "90%",
    borderRadius: "10px !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D6D5DA",
    },
  },
}));

const ProfileName = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [statusImg, setStatusImg] = useState();
  const [title, setTitle] = useState();
  const [addPhotoImg, setAddPhotoImg] = useState();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState();
  const [selectedBizRole, setSelectedBizRole] = useState();
  const { user, isBusiness, isEmployee, roleName, isManagementEmployee } =
    useUser();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    businessName,
    setBusinessName,
    photo,
    setPhoto,
  } = useOnboardingContext();

  const handleNextStep = () => {
    if (isBusiness() && businessName === "") {
      alert("Please enter a name");
      return;
    }
    if (!isBusiness() && !isEmployee()) {
      if (firstName === "") {
        alert("Please enter first name");
        return;
      }
      if (lastName === "") {
        alert("Please enter last name");
        return;
      }
    }
    if (isEmployee())
      navigate("/personalInfo", {
        state: { businessId: selectedBusiness.business_uid },
      });
    else navigate("/profileInfo");
  };

  const handleNameChange = (event) => {
    setBusinessName(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleBusinessChange = (event) => {
    setSelectedBusiness(event.target.value);
  };

  const handleBizRoleChange = (event) => {
    setSelectedBizRole(event.target.value);
  };

  const readImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.image = e.target.result;
      setPhoto(file);
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

  const handleRoleSpecifics = () => {
    if (isBusiness()) setStatusImg(Status14);
    else if (isEmployee()) setStatusImg(Status12);
    else setStatusImg(Status13);
    setTitle(roleName() + " Profile Info");
    if (isBusiness()) {
      setBusinessName(user.first_name + " " + user.last_name);
      setAddPhotoImg(NewBusinessLogo);
    } else {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setAddPhotoImg(NewProfilePicture);
    }
  };

  const handleFetchBusinesses = async () => {
    const response = await axios.get(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile?type=${
        isManagementEmployee() ? "MANAGEMENT" : "MAINTENANCE"
      }`
    );
    setBusinesses(response.data.result);
  };

  useEffect(() => {
    handleRoleSpecifics();
    handleFetchBusinesses();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          justifyContent: "flex-start",
        }}
      >
        <Paper
          style={{
            margin: "30px 5px 30px 5px",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%",
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
            <Stack direction="row" justifyContent="center">
              <Box
                sx={{
                  paddingTop: "10%",
                }}
              >
                <img src={statusImg} alt="status" />
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
                {title}
              </Typography>
            </Stack>
            {isBusiness() && (
              <Box sx={{ paddingTop: "10%" }}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Business Name"}
                </Typography>
              </Box>
            )}
          </Box>
          <Stack direction="row">
            {isBusiness() ? (
              <TextField
                name="businessName"
                value={businessName}
                onChange={handleNameChange}
                variant="filled"
                fullWidth
                placeholder="Business name"
                className={classes.root}
              />
            ) : isEmployee() ? (
              <Stack spacing={2} sx={{ width: "100%", padding: "10px 10px" }}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Select Business"}
                </Typography>
                <Select
                  value={selectedBusiness}
                  onChange={handleBusinessChange}
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  {businesses.map((row) => (
                    <MenuItem value={row}>{row.business_name}</MenuItem>
                  ))}
                </Select>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Role"}
                </Typography>
                <Select
                  value={selectedBizRole}
                  onChange={handleBizRoleChange}
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  <MenuItem value="EMPLOYEE">{"Employee"}</MenuItem>
                </Select>
              </Stack>
            ) : (
              <>
                <TextField
                  name="firstName"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  variant="filled"
                  fullWidth
                  placeholder="First name"
                  className={classes.root}
                />
                <TextField
                  name="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                  variant="filled"
                  fullWidth
                  placeholder="Last name"
                  className={classes.root}
                />
              </>
            )}
          </Stack>
          <Box sx={{ paddingTop: "8%" }} />
          <Stack direction="row" justifyContent="center">
            {photo && photo.image ? (
              <img
                key={Date.now()}
                src={photo.image}
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
                backgroundImage: `url(${addPhotoImg})`,
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
};

export default ProfileName;
