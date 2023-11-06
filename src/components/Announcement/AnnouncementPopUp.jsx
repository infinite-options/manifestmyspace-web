import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
    Box,
} from '@mui/material';

import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';

export default function AnnouncementPopUp({showAnnouncement, setShowAnnouncement, annData}){
    
    return (
        <Dialog open={showAnnouncement} onClose={() => setShowAnnouncement(false)} maxWidth="lg">
            <DialogTitle>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                    onClick={() => setShowAnnouncement(false)}
                >  <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>

            </DialogTitle>
            <DialogContent>
                <Box> {annData.announcement_title}</Box>
               
            </DialogContent>
        </Dialog>
    )
}