import React, {useState, useEffect} from 'react';
import {Container, Card, Typography, Box, Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function NewCardSlider(props){
//   const announcementList = [
//       { title: "Announcement 1", description: "Description of Announcement 1" },
//       { title: "Announcement 2", description: "Description of Announcement 2" },
//       { title: "Announcement 3", description: "Description of Announcement 3" }
//   ];
    const announcementList = props.announcementList

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : announcementList.length - 1);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => prevIndex < announcementList.length - 1 ? prevIndex + 1 : 0);
    };

    return (
        <Box maxWidth="100%" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1}>
                <Button onClick={handlePrev}>
                    <ArrowBackIcon />
                </Button>
                <Card sx={{ maxWidth: 300, padding: 2, margin: 2 }}>
                    <Typography sx={{color: "#000000", fontSize: "20px", fontWeight: 700}}>
                        {announcementList[currentIndex].announcement_title}
                    </Typography>
                    <Typography sx={{color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%"}}>
                        {announcementList[currentIndex].announcement_msg}
                    </Typography>
                    <Typography sx={{color: "#000000", fontSize: "16px", fontWeight: 500, opacity: "50%"}}>
                        {announcementList[currentIndex].announcement_uid}
                    </Typography>
                </Card>
                <Button onClick={handleNext}>
                    <ArrowForwardIcon />
                </Button>
            </Box>
        </Box>
    );
}