import React from "react";
import { Box, Stack, ThemeProvider, Button, Typography, Grid, Paper, Container, Toolbar } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import ManifestWhite from "../../images/onboarding/manifest_white.png";
import Owners from "../../images/onboarding/Owner_AllProperties.png";
import Tenants from "../../images/onboarding/Tenant_FindProperty.png";
import Maintenance from "../../images/onboarding/Maintenance_StatusWheel.png";
import Manager from "../../images/onboarding/Manager_AllProperties.png";
import { darken } from "@mui/system";
import { lighten } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import GoogleLogin from "./GoogleLogin";

export default function LandingPage() {
  console.log("In Landing Page");
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const roleTextStyling = { color: "#160449", fontSize: isMobile ? 22 : 30, fontWeight: 700, textAlign: "center" };
  const useCaseTextStyling = { color: "#160449", fontSize: isMobile ? 16 : 18, fontWeight: 600 };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Box
              sx={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                width: "100%",
                height: "100%",
              }}
            >
              <Stack sx={{ padding: "25px 25px 25px 25px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: isMobile ? 28 : 48,
                    fontWeight: 800,
                  }}
                >
                  Your <u>Complete</u> Property Management Solution
                </Typography>
                <Stack spacing={8} direction="column">
                  <Button
                    sx={{
                      width: isMobile ? "100%" : "80%",
                      alignContent: "center",
                      alignItems: "center",
                      background: "#3D5CAC",
                      color: theme.palette.background.default,
                      "&:hover": {
                        backgroundColor: lighten("#3D5CAC", 0.3),
                      },
                    }}
                    onClick={() => navigate("/newUser")}
                    variant="contained"
                  >
                    <Typography sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700 }}>Get Started</Typography>
                  </Button>
                  <Button
                    sx={{
                      width: isMobile ? "100%" : "80%",
                      alignContent: "center",
                      alignItems: "center",
                      background: "#FFFFFF",
                      color: theme.palette.background.default,
                      "&:hover": {
                        backgroundColor: darken("#FFFFFF", 0.3),
                      },
                      borderColor: "#000000",
                      borderWidth: "3px",
                    }}
                    onClick={() => navigate("/returningUser")}
                    variant="contained"
                  >
                    <Typography sx={{ color: "#160449", fontSize: 18, fontWeight: 700 }}>Login</Typography>
                  </Button>
                  
                    <Box>
                      <GoogleLogin />
                    </Box>
                  
                </Stack>                
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ order: { xs: -1, sm: 0 }, display: "flex" }}>
            <Box sx={{}} width="100%" height="100%">
              <img src={ManifestWhite} width="100%" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ height: isMobile ? "10vh" : "10vh" }}></Box>
            <Stack
              sx={{
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={roleTextStyling}>View Common Use Cases</Typography>
              <ArrowDownwardIcon />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Property Owners</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Owners} width="100%" alt="owners view" />
                </Box>
                <Typography sx={useCaseTextStyling} component="div">
                  <ul>
                    <li>Monitor rent payments</li>
                    <li>Track maintenance requests</li>
                    <li>View/edit property details</li>
                    <li>Track property cashflow</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Tenants</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Tenants} width="100%" alt="tenants view" />
                </Box>
                <Typography sx={useCaseTextStyling} component="div">
                  <ul>
                    <li>View new properties</li>
                    <li>Pay rent on time</li>
                    <li>Manage maintenance requests</li>
                    <li>Review and sign documents</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Property Managers</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Manager} width="100%" alt="property manager view" />
                </Box>
                <Typography sx={useCaseTextStyling} component="div">
                  <ul>
                    <li>Manager your clients, tenants, and personnel</li>
                    <li>See property cashflow</li>
                    <li>Track maintenance requests</li>
                    <li>View/Edit property details</li>
                    <li>View owner "happiness"</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
            <Paper
              style={{
                margin: "25px",
                padding: 20,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={roleTextStyling}>For Maintenance Professionals</Typography>
                <Box sx={{ width: "80%", height: "80%", display: "flex" }}>
                  <img src={Maintenance} width="100%" alt="maintenance view" />
                </Box>
                <Typography sx={useCaseTextStyling} component="div">
                  <ul>
                    <li>View quote requests</li>
                    <li>See past jobs and schedule more</li>
                    <li>Complete tickets</li>
                    <li>Create invoices and get paid</li>
                  </ul>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
