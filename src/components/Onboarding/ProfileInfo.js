import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  TextField,
  Select,
  Grid,
  MenuItem,
} from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import { useUser } from "../../contexts/UserContext";
import Status24 from "../../images/status_2_4.svg"; 
//import Status23 from "../../images/status_2_3.svg";
import Status23 from "../../images/status_bar_6.png";
import axios from "axios";
import AddFeeRowImg from "../../images/AddFeeRowImg.svg";
import AddLocationRowImg from "../../images/AddLocationRowImg.svg";
import {
  formatPhoneNumber,
  headers,
  maskNumber,
  roleMap,
  photoFields,
} from "./helper";
import AES from "crypto-js/aes";
import { useCookies } from "react-cookie";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
  select: {
    backgroundColor: "#D6D5DA",
    height: 30,
    borderRadius: "10px !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D6D5DA",
    },
  },
}));

const ProfileInfo = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [statusImg, setStatusImg] = useState();
  const {
    user,
    isBusiness,
    isManager,
    roleName,
    selectedRole,
    updateProfileUid,
    isLoggedIn
  } = useUser();
  //   {
  //     user: { user_uid: "" },
  //     isBusiness: () => true,
  //     isManager: () => true,
  //     isEmployee: () => false,
  //     roleName: () => "Property Manager",
  //     selectedRole: "MANAGER",
  //   };
  
  console.log('is Private ProfileInfo')
  console.log(isLoggedIn)
  console.log('is Private ProfileInfo')
  const {
    firstName,
    lastName,
    businessName,
    photo,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    ein,
    setEin,
    ssn,
    setSsn,
    mask,
    setMask,
    address,
    setAddress,
    unit,
    setUnit,
    city,
    setCity,
    state,
    setState,
    zip,
    setZip,
  } = useOnboardingContext();
  const [showSpinner, setShowSpinner] = useState(false);
  const [fees, setFees] = useState([
    { id: 1, fee_name: "", frequency: "", charge: "", of: "" },
  ]);
  const [services, setServices] = useState([
    { id: 1, service_name: "", hours: "", charge: "", total_cost: "" },
  ]);
  const [locations, setLocations] = useState([
    { id: 1, address: "", city: "", state: "", miles: "" },
  ]);

  const addFeeRow = () => {
    setFees((prev) => [
      ...prev,
      { id: prev.length + 1, fee_name: "", frequency: "", charge: "", of: "" },
    ]);
  };

  const addServiceRow = () => {
    setServices((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        service_name: "",
        hours: "",
        charge: "",
        total_cost: "",
      },
    ]);
  };

  const addLocationRow = () => {
    setLocations((prev) => [
      ...prev,
      { id: prev.length + 1, address: "", city: "", state: "", miles: "" },
    ]);
  };

  const handleFeeChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...fees];
    list[index - 1][name] = value;
    setFees(list);
  };

  const handleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...services];
    list[index - 1][name] = value;
    setServices(list);
  };

  const handleLocationChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...locations];
    list[index - 1][name] = value;
    setLocations(list);
  };

  const handleFrequencyChange = (e, index) => {
    const value = e.target.value;
    let list = [...fees];
    list[index - 1].frequency = value;
    setFees(list);
  };

  const handleNextStep = async () => {
    setShowSpinner(true);
    const payload = getPayload(selectedRole);
    const form = encodeForm(payload);
    const data = await createProfile(form, selectedRole);
    setShowSpinner(false);
    handleUpdateProfileUid(data);
    const paymentURL= isLoggedIn ? "/privateProfilePayment" : "/profilePayment"
    navigate("/profilePayment", {
      state: {
        profileId: data.business_uid || data.owner_uid || data.tenant_uid,
      },
    });
  };

  const handleUpdateProfileUid = (data) => {
    if (data.owner_uid) {
      updateProfileUid({ owner_id: data.owner_uid });
    }
    if (data.tenant_uid) {
      updateProfileUid({ tenant_id: data.tenant_uid });
    }
    if (data.business_uid) {
      updateProfileUid({ business_uid: data.business_uid });
    }
  };

  const getPayload = (type) => {
    switch (type) {
      case "MANAGER":
        return {
          business_user_id: user.user_uid,
          business_type: "MANAGEMENT",
          business_name: businessName,
          business_photo_url: photo,
          business_phone_number: phoneNumber,
          business_email: email,
          business_ein_number: ein,
          business_services_fees: JSON.stringify(fees),
          business_locations: JSON.stringify(locations),
          business_address: address,
          business_unit: unit,
          business_city: city,
          business_state: state,
          business_zip: zip,
        };
      case "MAINTENANCE":
        return {
          business_user_id: user.user_uid,
          business_type: "MAINTENANCE",
          business_name: businessName,
          business_photo: photo,
          business_phone_number: phoneNumber,
          business_email: email,
          business_ein_number: ein,
          business_services_fees: JSON.stringify(services),
          business_locations: JSON.stringify(locations),
          business_address: address,
          business_unit: unit,
          business_city: city,
          business_state: state,
          business_zip: zip,
        };
      case "OWNER":
        return {
          owner_user_id: user.user_uid,
          owner_first_name: firstName,
          owner_last_name: lastName,
          owner_phone_number: phoneNumber,
          owner_email: email,
          owner_ein_number: ein,
          owner_ssn: AES.encrypt(ssn, process.env.REACT_APP_ENKEY).toString(),
          owner_address: address,
          owner_unit: unit,
          owner_city: city,
          owner_state: state,
          owner_zip: zip,
          owner_photo: photo,
        };
      case "TENANT":
        return {
          tenant_user_id: user.user_uid,
          tenant_first_name: firstName,
          tenant_last_name: lastName,
          tenant_phone_number: phoneNumber,
          tenant_email: email,
          tenant_ssn: AES.encrypt(ssn, process.env.REACT_APP_ENKEY).toString(),
          tenant_address: address,
          tenant_unit: unit,
          tenant_city: city,
          tenant_state: state,
          tenant_zip: zip,
          tenant_photo: photo,
        };
      default:
        throw new Error("Invalid profile type");
    }
  };

  const createProfile = async (form, type) => {
    const { profileApi } = roleMap[type];
    const { data } = await axios.post(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev${profileApi}`,
      form,
      headers
    );
    return data;
  };

  const encodeForm = (payload) => {
    const form = new FormData();
    for (let key in payload) {
      if (photoFields.has(key)) {
        if (payload[key]) form.append(key, payload[key].file);
      } else {
        form.append(key, payload[key]);
      }
    }
    return form;
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(formatPhoneNumber(event.target.value));
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  const handleEinChange = (event) => {
    setEin(event.target.value);
  };

  const handleSsnChange = (event) => {
    let value = event.target.value;
    if (!value) {
      setSsn("");
      setMask("");
      return;
    }
    if (value.length > 11) return;
    const lastChar = value.charAt(value.length - 1);
    if (mask.length > value.length) {
      if (lastChar !== "-") setSsn(ssn.slice(0, ssn.length - 1));
      setMask(value);
    } else {
      setSsn(ssn + lastChar);
      setMask(maskNumber(ssn + lastChar));
    }
  };

  const handleRoleSpecifics = () => {
    if (isBusiness()) setStatusImg(Status24);
    else setStatusImg(Status23);
  };

  useEffect(() => {
    handleRoleSpecifics();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          justifyContent: "flex-start",
        }}
      >
        <Paper
          sx={{
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
            <>
              <Stack direction="row" justifyContent="center">
                <Box
                  sx={{
                    paddingTop: "5%",
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
                  {`${roleName()} ${
                    isBusiness() ? "Business" : "Profile"
                  } Info`}
                </Typography>
              </Stack>
            </>
          </Box>

          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              {`${isBusiness() ? "Business" : ""} Email Address`}
            </Typography>
            <TextField
              value={email}
              onChange={handleEmailChange}
              placeholder="email@site.com"
              variant="filled"
              fullWidth
              className={classes.root}
            ></TextField>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              {`${isBusiness() ? "Business" : ""} Phone Number`}
            </Typography>
            <TextField
              value={phoneNumber}
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={handlePhoneNumberChange}
              placeholder="(000)000-0000"
              variant="filled"
              fullWidth
              className={classes.root}
            ></TextField>
          </Stack>
          <hr />
          <Stack spacing={-2} m={5}>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontWeight: theme.typography.primary.fontWeight,
              }}
            >
              {`${isBusiness() ? "Business" : ""} Address`}
            </Typography>
            <TextField
              value={address}
              onChange={handleAddressChange}
              variant="filled"
              fullWidth
              placeholder="Enter street address"
              className={classes.root}
            ></TextField>
          </Stack>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Unit #"}
                </Typography>
                <TextField
                  value={unit}
                  onChange={handleUnitChange}
                  variant="filled"
                  fullWidth
                  placeholder="3"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"City"}
                </Typography>
                <TextField
                  value={city}
                  onChange={handleCityChange}
                  variant="filled"
                  fullWidth
                  placeholder="San Jose"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                    paddingBottom: "10px",
                  }}
                >
                  {"State"}
                </Typography>
                <Select
                  value={state}
                  onChange={handleStateChange}
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  <MenuItem value="CA">CA</MenuItem>
                  <MenuItem value="TX">TX</MenuItem>
                  <MenuItem value="FL">FL</MenuItem>
                  <MenuItem value="NY">NY</MenuItem>
                  <MenuItem value="IL">IL</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={-2} m={2}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Zip Code"}
                </Typography>
                <TextField
                  value={zip}
                  onChange={handleZipChange}
                  variant="filled"
                  fullWidth
                  placeholder="90234"
                  className={classes.root}
                ></TextField>
              </Stack>
            </Grid>
          </Grid>
          {isBusiness() && (
            <>
              <hr />
              <Box sx={{ paddingLeft: "30%" }}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {isManager() ? "Management Fees" : "Service Details"}
                </Typography>
              </Box>
              {isManager()
                ? fees.map((row) => (
                    <div key={row.id}>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid item xs={6}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Fee Name"}
                            </Typography>
                            <TextField
                              name="fee_name"
                              value={row.fee_name}
                              variant="filled"
                              fullWidth
                              placeholder="Service Charge"
                              className={classes.root}
                              onChange={(e) => handleFeeChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                                paddingBottom: "10px",
                              }}
                            >
                              {"Frequency"}
                            </Typography>
                            <Select
                              value={row.frequency}
                              size="small"
                              fullWidth
                              onChange={(e) => handleFrequencyChange(e, row.id)}
                              placeholder="Select frequency"
                              className={classes.select}
                            >
                              <MenuItem value="Hourly">Hourly</MenuItem>
                              <MenuItem value="Daily">Daily</MenuItem>
                              <MenuItem value="Weekly">Weekly</MenuItem>
                              <MenuItem value="Biweekly">Biweekly</MenuItem>
                              <MenuItem value="Monthly">Monthly</MenuItem>
                              <MenuItem value="Annually">Annually</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Set Charge"}
                            </Typography>
                            <TextField
                              name="charge"
                              value={row.charge}
                              variant="filled"
                              fullWidth
                              placeholder="15%"
                              className={classes.root}
                              onChange={(e) => handleFeeChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Percentage Of"}
                            </Typography>
                            <TextField
                              name="of"
                              value={row.of}
                              variant="filled"
                              fullWidth
                              placeholder="Rent"
                              className={classes.root}
                              onChange={(e) => handleFeeChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      {row.id === fees.length ? (
                        <Stack
                          direction="row"
                          sx={{
                            display: "flex",
                            justifyContent: "right",
                          }}
                        >
                          <div
                            onClick={addFeeRow}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={AddFeeRowImg} alt="add fee text" />
                          </div>
                        </Stack>
                      ) : (
                        <hr />
                      )}
                    </div>
                  ))
                : services.map((row) => (
                    <div key={row.id}>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid item xs={12}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Service Name"}
                            </Typography>
                            <TextField
                              name="service_name"
                              value={row.service_name}
                              variant="filled"
                              fullWidth
                              className={classes.root}
                              onChange={(e) => handleServiceChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"# of Hours"}
                            </Typography>
                            <TextField
                              name="cours"
                              value={row.hours}
                              variant="filled"
                              fullWidth
                              className={classes.root}
                              onChange={(e) => handleServiceChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Charge/Hr."}
                            </Typography>
                            <TextField
                              name="charge"
                              value={row.charge}
                              variant="filled"
                              fullWidth
                              className={classes.root}
                              onChange={(e) => handleServiceChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={-2} m={2}>
                            <Typography
                              sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.primary.fontWeight,
                              }}
                            >
                              {"Total Cost"}
                            </Typography>
                            <TextField
                              name="total_cost"
                              value={row.total_cost}
                              variant="filled"
                              fullWidth
                              className={classes.root}
                              onChange={(e) => handleServiceChange(e, row.id)}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      {row.id === services.length ? (
                        <Stack
                          direction="row"
                          sx={{
                            display: "flex",
                            justifyContent: "right",
                          }}
                        >
                          <div
                            onClick={addServiceRow}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={AddFeeRowImg} alt="add service" />
                          </div>
                        </Stack>
                      ) : (
                        <hr />
                      )}
                    </div>
                  ))}
              <hr />
              <Box sx={{ paddingLeft: "30%" }}>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  {"Service Locations"}
                </Typography>
              </Box>
              {locations.map((row) => (
                <div key={row.id}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      <Stack spacing={-2} m={2}>
                        <Typography
                          sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.primary.fontWeight,
                          }}
                        >
                          {"Location"}
                        </Typography>
                        <TextField
                          name="location"
                          value={row.location}
                          variant="filled"
                          fullWidth
                          className={classes.root}
                          onChange={(e) => handleLocationChange(e, row.id)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={-2} m={2}>
                        <Typography
                          sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.primary.fontWeight,
                          }}
                        >
                          {"City"}
                        </Typography>
                        <TextField
                          name="city"
                          value={row.city}
                          variant="filled"
                          fullWidth
                          className={classes.root}
                          onChange={(e) => handleLocationChange(e, row.id)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={-2} m={2}>
                        <Typography
                          sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.primary.fontWeight,
                          }}
                        >
                          {"State"}
                        </Typography>
                        <TextField
                          name="state"
                          value={row.state}
                          variant="filled"
                          fullWidth
                          className={classes.root}
                          onChange={(e) => handleLocationChange(e, row.id)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={-2} m={2}>
                        <Typography
                          sx={{
                            color: theme.typography.common.blue,
                            fontWeight: theme.typography.primary.fontWeight,
                          }}
                        >
                          {"Miles"}
                        </Typography>
                        <TextField
                          name="miles"
                          value={row.miles}
                          variant="filled"
                          fullWidth
                          className={classes.root}
                          onChange={(e) => handleLocationChange(e, row.id)}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  {row.id === locations.length ? (
                    <Stack
                      direction="row"
                      sx={{
                        display: "flex",
                        justifyContent: "right",
                      }}
                    >
                      <div
                        onClick={addLocationRow}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={AddLocationRowImg} alt="add location" />
                      </div>
                    </Stack>
                  ) : (
                    <hr />
                  )}
                </div>
              ))}
            </>
          )}
          <hr />
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {isBusiness() ? (
              <Grid item xs={12}>
                <Stack spacing={-2} m={2}>
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                      fontWeight: theme.typography.primary.fontWeight,
                    }}
                  >
                    {"EIN/SSN"}
                  </Typography>
                  <TextField
                    value={ein}
                    onChange={handleEinChange}
                    variant="filled"
                    fullWidth
                    placeholder="Enter EIN"
                    className={classes.root}
                  ></TextField>
                </Stack>
              </Grid>
            ) : (
              <>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      {"EIN"}
                    </Typography>
                    <TextField
                      value={ein}
                      onChange={handleEinChange}
                      variant="filled"
                      fullWidth
                      placeholder="Enter EIN"
                      className={classes.root}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.primary.fontWeight,
                      }}
                    >
                      {"SSN"}
                    </Typography>
                    <TextField
                      value={mask}
                      onChange={handleSsnChange}
                      variant="filled"
                      fullWidth
                      placeholder="Enter SSN"
                      className={classes.root}
                    ></TextField>
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
          <Button
            variant="contained"
            sx={{
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: "96%",
              height: "33px",
              borderRadius: "10px",
              marginLeft: "2%",
              marginBottom: "10px",
            }}
            onClick={handleNextStep}
          >
            {"Next Step"}
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ProfileInfo;
