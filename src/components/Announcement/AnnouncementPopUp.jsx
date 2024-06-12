import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Divider
} from '@mui/material';
import { Message} from '@mui/icons-material';
import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import React, { useState } from 'react';

export default function AnnouncementPopUp({showAnnouncement, setShowAnnouncement, annData}) {
    const first_name = annData?.sender_first_name || annData?.receiver_first_name || 'Unknown';
    const last_name = annData?.sender_last_name || annData?.receiver_last_name || 'Unknown';
    const photo_url = annData?.sender_photo_url || annData?.receiver_photo_url || DefaultProfileImg;
    const announcement_date = annData?.announcement_date;
    const role = annData?.sender_role || annData?.receiver_role || 'Unknown Role'; 

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${month}/${day}/${year}`;
    }
    const [bgColor, setBgColor] = useState('#D6D5DA');
    const [isClosed, setIsClosed] = useState(false);
    const formatted_announcement_date = formatDate(announcement_date);
    
    const handleClose = () => {
        setBgColor('yellow'); // Change background color to yellow
        setIsClosed(true);
        setShowAnnouncement(false);
    };

    return (
        <Dialog
            open={showAnnouncement}
            onClose={handleClose}
            // onClose={() => setShowAnnouncement(false)}
            maxWidth="lg"
            sx={{
                '& .MuiDialog-paper': {
                    width: '340px',
                    height: '360px',
                    borderRadius: '10px',
                },
            }}
        >
            <DialogTitle sx={{
                p: 4,
                textAlign: 'center',
                
            }}>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                onClick={handleClose}
                    // onClick={() => setShowAnnouncement(false)}
                >

                    <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>
                
                <Typography variant="h6" fontFamily="Source Sans Pro" fontWeight="600" color="#160449">Announcement</Typography>
                <hr style={{border: '1px solid rgba(0, 0, 0, 0.5)', width: '80%', margin: '10px auto 0px auto'}} />


            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom:'20px' }}>
                    <img
                        src={photo_url}
                        alt="Sender/Receiver Photo"
                        style={{
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '40px',
                        }}
                    />
                    <Box>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="12px" fontWeight="900" mb={1}>{`${first_name} ${last_name}`}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="10px" >{role}</Typography>
                            <Message
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontSize: '19px',
                                    marginLeft: '20px',
                                }}
                            />
                        </Box>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="12px" fontWeight="600">{formatted_announcement_date}</Typography>
                    </Box>
                    
                </Box>
                <Box ml={2}>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#3D5CAC" fontSize="15px" fontWeight="600">{annData?.announcement_title || 'No Title'}</Typography>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#3D5CAC" fontSize="15px" >{annData?.announcement_msg || 'No Message'}</Typography>
                </Box>
            </DialogContent>
           
        </Dialog>
    );
}
