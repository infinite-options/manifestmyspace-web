import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    // Divider
} from '@mui/material';
import { Message} from '@mui/icons-material';
import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';
import DefaultProfileImg from "../../images/defaultProfileImg.svg";

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
    
    const formatted_announcement_date = formatDate(announcement_date);

    // const createLinkFromMessage = (message) => {
    //     if (!message) return "No Message";

    //     // Improved regex pattern to detect URLs
    //     const urlPattern = /((https?:\/\/)?(localhost|[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,})(:\d+)?(\/\S*)?)/g;

    //     // Replace URLs with clickable links
    //     const result = message.replace(urlPattern, (url) => {
    //       // Add 'http://' if the URL does not already have a scheme
    //       const href = url.startsWith('http') ? url : `http://${url}`;
    //       return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #3D5CAC; text-decoration: underline;">${url}</a>`;
    //     });

    //     return <span dangerouslySetInnerHTML={{ __html: result }} />;
    //   };

    const createLinkFromMessage = (message) => {
        if (!message) return "No Message";
      
        // Improved regex pattern to detect URLs
        const urlPattern = /((https?:\/\/)?(localhost|[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,})(:\d+)?(\/\S*)?)/g;
      
        // Find all matches of URLs in the message
        const matches = [...message.matchAll(urlPattern)];
      
        // Initialize an array to store React elements
        const elements = [];
        let lastIndex = 0;
      
        // Iterate over each match to build the resulting array
        matches.forEach((match, index) => {
          // Get the start index of the current match
          const startIndex = match.index;
      
          // Add the text before the current match as a span element
          if (startIndex > lastIndex) {
            elements.push(<span key={`text-${index}`}>{message.slice(lastIndex, startIndex)}</span>);
          }
      
          // Add the matched URL as an anchor element
          const url = match[0];
          const href = url.startsWith('http') ? url : `http://${url}`;
          elements.push(
            <a
              key={`link-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3D5CAC', textDecoration: 'underline' }}
            >
              {url}
            </a>
          );
      
          // Update the last index to the end of the current match
          lastIndex = startIndex + url.length;
        });
      
        // Add any remaining text after the last match
        if (lastIndex < message.length) {
          elements.push(<span key="text-end">{message.slice(lastIndex)}</span>);
        }
      
        return <span>{elements}</span>;
      };
      
    
    return (
        <Dialog
            open={showAnnouncement}
            onClose={() => setShowAnnouncement(false)}
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
                    onClick={() => setShowAnnouncement(false)}
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
                        <Typography variant="body1" fontFamily="Source Sans Pro" color="#3D5CAC" fontSize="15px" >{createLinkFromMessage(annData?.announcement_msg) || 'No Message'}</Typography>
                </Box>
            </DialogContent>
           
        </Dialog>
    );
}
