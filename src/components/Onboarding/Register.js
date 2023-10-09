import React, { useState } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  Button,
  Typography,
} from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA", // Update the background color here
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
}));

function Register() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNextStep = () => {
    if (email === "" || password === "" || confirmPassword === "") {
      alert("Please fill out all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords must match");
      return;
    }
    navigate("/contactInfo", {
      state: {
        email,
        password,
      },
    });
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
            paddingTop: "10%",
            width: "80%",
            paddingBottom: "10%",
          }}
        >
          <Typography
            sx={{
              color: theme.typography.propertyPage.color,
              fontWeight: theme.typography.common.fontWeight,
              fontSize: theme.typography.largeFont,
            }}
          >
            {"New User"}
          </Typography>
          <hr />
        </Box>

        <Paper
          style={{
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            width: "85%", // Occupy full width with 25px margins on each side
            [theme.breakpoints.down("sm")]: {
              width: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              width: "50%",
            },
          }}
        >
          <Box
            component="span"
            display="flex"
            justifyContent="center"
            position="relative"
            flexDirection="column"
          >
            <>
              <Stack spacing={-2} m={5} direction="row">
                <Typography
                  sx={{
                    color: theme.typography.propertyPage.color,
                    fontFamily: "Source Sans Pro",
                    fontWeight: theme.typography.common.fontWeight,
                    fontSize: theme.typography.largeFont,
                  }}
                >
                  {"Register"}
                </Typography>
              </Stack>
            </>
          </Box>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>

          <Stack spacing={-2} m={5}>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                boxShadow: "0px 1px 4px #00000019",
              }}
            >
              <TextField
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re Enter Password"
                fullWidth
                className={classes.root}
              ></TextField>
            </Box>
          </Stack>
          <Button
            sx={{
              paddingLeft: "2%",
              paddingRight: "2%",
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: `100%`,
              height: `15%`,
              borderRadius: "15px",
              fontSize: theme.typography.smallFont,
              fontWeight: theme.typography.primary.fontWeight,
              textTransform: "none",
            }}
            onClick={handleNextStep}
          >
            {"Sign Up"}
          </Button>
          <Stack spacing={-20} m={12}>
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.common.default,
                fontWeight: theme.typography.light.fontWeight,
                fontSize: theme.typography.primary.smallFont,
              }}
            >
              {"Already have an account ?"}
              <u>
                <a href="/returningUser">{"Log In"}</a>
              </u>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Register;
