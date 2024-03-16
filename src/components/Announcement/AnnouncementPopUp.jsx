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

export default function AnnouncementPopUp({showAnnouncement, setShowAnnouncement, annData}) {
    const first_name= annData?.sender_first_name || annData?.receiver_first_name || 'Unknown';
    const last_name=annData?.sender_last_name || annData?.receiver_last_name || 'Unknown';
    const photo_url=annData?.sender_photo_url || annData?.receiver_photo_url || '';
    const announcement_date=annData?.announcement_date;
    const role=annData?.sender_role || annData?.receiver_role || 'Unknown Role'; 

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding leading zero if necessary
        const day = date.getDate().toString().padStart(2, '0'); // Adding leading zero if necessary
        const year = date.getFullYear();
    
        return `${month}/${day}/${year}`;
    }
    
    const formatted_announcement_date = formatDate(announcement_date);
    return (
        <Dialog 
            open={showAnnouncement} 
            onClose={() => setShowAnnouncement(false)} 
            maxWidth="lg" 
            sx={{ minWidth: '600px', minHeight: '400px' }} // Adjust size here
        >
            <DialogTitle sx={{
                p: 4, // Adjust padding to increase size
                textAlign: 'center', // Center the content horizontally
                borderBottom: '1px solid rgba(0, 0, 0, 0.5)', // Add the horizontal line
                marginBottom: '20px', // Add some margin below the title
            }}>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                    onClick={() => setShowAnnouncement(false)}
                >
                    <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>
                <Typography variant="h6" fontFamily="Source Sans Pro" fontWeight="600" color="#160449">Announcement</Typography> {/* Title with specific styles */}
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
                            marginRight: '40px', // Add margin to separate the text from the image
                        }}
                    />
                    <Box>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="12px" fontWeight="600" mb={1}>{`${first_name} ${last_name}`}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="10px" >{role}</Typography>
                            <Message
                                sx={{
                                    color: theme.typography.common.blue,
                                    fontSize: '19px',
                                    marginLeft: '20px', // Add margin between icon and text
                                }}
                            />
                        </Box>
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#160449" fontSize="12px" fontWeight="600">{formatted_announcement_date}</Typography>
                    </Box>
                    
                </Box>
                <Box ml={2}> {/* Add margin to separate the text from the photo */}
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#3D5CAC" fontSize="15px" fontWeight="600">{annData?.announcement_title || 'No Title'}</Typography> {/* Message with specific styles */}
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#3D5CAC" fontSize="15px" >{annData?.announcement_msg || 'No Message'}</Typography> {/* Message with specific styles */}        
                </Box>
            </DialogContent>
            <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} /> {/* Horizontal line */}
        </Dialog>
    );
}
