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
                    display: 'flex',
                    flexDirection: 'column', // Added this to stack children vertically
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    color: color,
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
                        {item.mapping}
                    </Typography>
                    <Button onClick={handleNextCard} disabled={requestData.length <= 1}>
                        <ArrowForwardIcon />
                    </Button>  
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <div sx={{ maxWidth: 345, backgroundColor: color, boxShadow: "0px"}}>
                        <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.largeFont}}
                            >
                                {data.title}
                        </Typography>
                        <CardMedia
                            component="img"
                            height="194"
                            width="345"
                            image={maintenaceRequestImage}
                            alt="Paella dish"
                        />
                        <CardContent>
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
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {data.description}
                            </Typography>
                            <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {data.request_type}
                            </Typography>
                            <Typography
                                sx={{color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}
                            >
                                {data.notes}
                            </Typography>
                        </CardContent>
                    </div>
                </Stack>
            </Box>
        </div>
    )
}