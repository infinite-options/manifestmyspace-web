import {
    Box,
    Button,
    CardMedia,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import theme from '../../theme/theme';
import theme from '../../theme/theme';
// import ImageUploader from '../../ImageUploader';
import ImageUploader from "../ImageUploader";
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';


export default function PMAddProperty(){ 

    const handleBackButton = () => {
        navigate("/dashboard");
    }

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <Stack
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack the content vertically
                    justifyContent: 'flex-start',  // Start content at the top
                    alignItems: 'center',  // Center content horizontally
                    width: '100%',
                    minHeight: '100vh',
                    marginTop: theme.spacing(2),  // Adjust this for desired distance from the top
                    paddingBottom: "50px"
                }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.form.main,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                        paddingTop: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                Edit Property
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button onClick={() => handleBackButton()}>
                                <CloseIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>
        </ThemeProvider>
    )
}