import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
} from '@mui/material';

import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';

export default function AlertMessage({showMessage, setShowMessage, message}){
    
    return (
        <Dialog open={showMessage} onClose={() => setShowMessage(false)} maxWidth="lg">
            <DialogTitle>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                    onClick={() => setShowMessage(false)}
                >  <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>

            </DialogTitle>
            <DialogContent>
                {message}
            </DialogContent>
        </Dialog>
    )
}