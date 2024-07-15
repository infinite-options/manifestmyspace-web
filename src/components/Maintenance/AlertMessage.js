import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
    Grid,
} from '@mui/material';

import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';

export default function AlertMessage({showMessage, setShowMessage, message}){
    
    return (
        <Dialog open={showMessage} onClose={() => setShowMessage(false)} maxWidth="lg">
            <Grid container spacing={5}>
                <Grid item xs={12} sx={{paddingBottom: "10px"}}>
                    <DialogTitle>
                        Request More Info
                    </DialogTitle>
                </Grid>
                <Grid item xs={12} sx={{paddingBottom: "10px"}}>
                    <DialogContent>
                        {message}
                    </DialogContent>
                </Grid>
                <Grid item xs={12} sx={{paddingBottom: "10px"}}>
                    <Button sx={{ 
                            textTransform: 'capitalize',
                            position: 'absolute',
                            right: 1,
                            top: 1,
                            color: (theme) => theme.palette.grey[500]
                        }} 
                        onClick={() => {
                            setShowMessage(false);
                            window.location.reload();
                        }}
                        >
                        <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}