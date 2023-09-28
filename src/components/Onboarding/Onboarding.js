import React from "react";
import { Box, Stack, ThemeProvider, Button, Typography } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import ManifestWhite from "../../images/onboarding/manifest_white.png";
import Owners from "../../images/onboarding/Owners.png";
import Manager from "../../images/onboarding/Manager.png";
import Tenants from "../../images/onboarding/Tenants.png";
import Maintenance from "../../images/onboarding/Maintenance.png";

function Onboarding() {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Box
          sx={{
            width: "100%",
            height: "205px",
            objectFit: "contain",
            backgroundImage: `url(${ManifestWhite})`,
          }}
        />
        <Box
          sx={{
            backgroundColor: theme.palette.custom.bgBlue,
            height: "75%",
            padding: "10px",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          <Stack m={5}>
            <Typography
              sx={{ color: theme.palette.background.default, fontSize: 38 }}
            >
              <b>{"Welcome to ManifestMy.Space!"}</b>
            </Typography>
            <br />
            <Typography
              sx={{
                color: theme.palette.background.default,
                fontWeight: theme.typography.primary.fontWeight,
                textAlign: "justify",
              }}
            >
              {`Your complete property management solution! From seasoned managers
              to owners, tenants, and maintenance pros – we've got you covered.`}
              <br />
              <br />
              {`Manifest makes managing properties a breeze, so you can focus on
              what truly matters. Join us today and let's manifest a brighter,
              more efficient future for property management!`}
              <br />
              <br />
              {"Already have an account?"}
              <br />
              <u>
                <a style={{ color: "#ffffff" }} href="/returningUser">
                  <b>{"Log In?"}</b>
                </a>
              </u>
            </Typography>
          </Stack>
        </Box>
        <Button
          variant="contained"
          sx={{
            background: "#3D5CAC",
            color: theme.palette.background.default,
            width: `90%`,
            height: `15%`,
            left: `5%`,
            borderRadius: "15px",
          }}
          onClick={() => {
            navigate("/newUser");
          }}
        >
          {"Create Account"}
        </Button>

        <Box
          sx={{
            padding: "5%",
          }}
        >
          <Box sx={{ paddingTop: "3%" }}>
            <img src={Owners} alt="Owners" />
          </Box>
          <Box sx={{ paddingTop: "3%" }}>
            <img src={Manager} alt="Manager" />
          </Box>
          <Box sx={{ paddingTop: "3%" }}>
            <img src={Tenants} alt="Tenants" />
          </Box>
          <Box sx={{ paddingTop: "3%" }}>
            <img src={Maintenance} alt="Maintenance" />
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            background: "#3D5CAC",
            color: theme.palette.background.default,
            width: `90%`,
            height: `15%`,
            left: `5%`,
            borderRadius: "15px",
          }}
          onClick={() => {
            navigate("/newUser");
          }}
        >
          {"Sign Up"}
        </Button>
        <Stack spacing={-16} m={12}></Stack>
      </Box>
    </ThemeProvider>
  );
}
export default Onboarding;
