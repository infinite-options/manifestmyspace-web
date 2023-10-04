import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
} from '@mui/material';

import FormControlLabel from '@mui/material/FormControlLabel';

import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../theme/theme';

import CloseIcon from '@mui/icons-material/Close';




export default function SelectPriorityFilter({showPriorityFilter, setShowPriorityFilter, filterList, setFilterList}){
    
    return (
        <Dialog open={showPriorityFilter} onClose={() => setShowPriorityFilter(false)} maxWidth="lg">
            <DialogTitle>
                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Select Priority
                </Typography>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                    onClick={() => setShowPriorityFilter(false)}
                >
                    <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>
            </DialogTitle>
            <DialogContent>
                {filterList.map((item, index) =>
                    <div key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            {/* <HomeWorkIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/> */}
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                {item.priority}
                            </Typography>
                        </div>
                        <FormControlLabel
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize:theme.typography.mediumFont,
                                },
                                
                            }}
                            control={
                                <Checkbox
                                    checked={item.checked}
                                    sx={{
                                        '& .MuiCheckbox-root': {
                                            color: theme.typography.common.blue, // replace with your color when unchecked
                                        },
                                        '& .Mui-checked': {
                                            color: '#000000', // replace with your color when checked
                                        }
                                    }}
                                    onChange={() => { 
                                        let tempFilterList = filterList.map(filterItem => ({...filterItem}));
                                        tempFilterList[index].checked = !tempFilterList[index].checked;
                                        setFilterList(tempFilterList);
                                    }}
                                    
                                />
                            }   
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}