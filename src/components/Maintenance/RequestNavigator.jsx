import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack } from '@mui/material';
import theme from '../../theme/theme';
import maintenaceRequestImage from './maintenanceRequest.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function RequestNavigator({requestData, color, item}){
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % requestData.length);
    };
  
    const handlePreviousCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + requestData.length) % requestData.length);
    };

    const data = requestData[currentIndex]

    return(
        <div style={{paddingBottom: "10px"}}>
            <Box
                sx={{
                    flexDirection: 'column', // Added this to stack children vertically
                    justifyContent: 'center',
                    width: "100%", // Take up full screen width
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    backgroundColor: '#3D5CAC80',
                }}
            > 
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Button onClick={handlePreviousCard} disabled={requestData.length <= 1}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography
                        sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont}}
                        >
                        {item.status} {currentIndex + 1} of {requestData.length}
                    </Typography>
                    <Button onClick={handleNextCard} disabled={requestData.length <= 1}>
                        <ArrowForwardIcon />
                    </Button>  
                </Stack>
                <Stack
                    alignItems="center"
                    justifyContent="center"
                >
                    <Card
                        sx={{
                            backgroundColor: color,
                            boxShadow: "none",
                            elevation: "0",
                        }}
                        >
                        <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.largeFont}}
                            >
                                {data.title}    
                        </Typography>
                        <CardContent sx={{
                            center: "true",
                            alignItems: "center",
                            justifyContent: "center",
                            width:"100%",

                        }}>
                            <CardMedia
                                component="img"
                                height="200px"
                                width="200px"
                                image={maintenaceRequestImage}
                                sx={{
                                    elevation: "0",
                                    boxShadow: "none",
                                }}
                                alignItems="center"
                            />
                            <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.largeFont}}
                            >
                                {data.priority}
                            </Typography>
                            <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {data.request_created_date}
                            </Typography>
                            <Typography
                                sx={{
                                    overflowWrap: 'break-word',
                                    color: theme.typography.secondary.white, 
                                    fontWeight: theme.typography.secondary.fontWeight, 
                                    fontSize:theme.typography.smallFont
                                }}
                            >
                                {data.description}
                            </Typography>
                            <Typography
                                sx={{
                                    overflowWrap: 'break-word',
                                    color: theme.typography.secondary.white, 
                                    fontWeight: theme.typography.secondary.fontWeight, 
                                    fontSize:theme.typography.smallFont
                                }}
                            >
                                {data.request_type}
                            </Typography>
                            <Typography
                                sx={{
                                    overflowWrap: 'break-word',
                                    color: theme.typography.secondary.white, 
                                    fontWeight: theme.typography.secondary.fontWeight, 
                                    fontSize: theme.typography.smallFont}}
                            >
                                {data.notes}
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </div>
    )
}