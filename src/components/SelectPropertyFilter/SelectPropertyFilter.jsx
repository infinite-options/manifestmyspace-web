import {
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';

export default function SelectPropertyFilter({showPropertyFilter, setShowPropertyFilter, filterList, setFilterList}) {
    console.log('---inside filterList---', filterList);
    const [deselectAll, setDeselectAll] = useState(false);

    const handleDeselectAllChange = () => {
        const newDeselectAll = !deselectAll;
        setDeselectAll(newDeselectAll);

        const newFilterList = filterList.map(item => ({
            ...item,
            checked: !newDeselectAll,
        }));
        setFilterList(newFilterList);
    };

    return (
        <Dialog open={showPropertyFilter} onClose={() => setShowPropertyFilter(false)} maxWidth="lg">
            <DialogTitle>
                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Select Properties
                </Typography>
                <Button sx={{ 
                    textTransform: 'capitalize',
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    color: (theme) => theme.palette.grey[500]
                }} 
                    onClick={() => setShowPropertyFilter(false)}
                >
                    <CloseIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                </Button>
            </DialogTitle>
            <DialogContent>
                <FormControlLabel
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            color: theme.typography.primary.black,
                            fontWeight: theme.typography.primary.fontWeight,
                            fontSize: theme.typography.mediumFont,
                        },
                    }}
                    control={
                        <Checkbox
                            checked={deselectAll}
                            onChange={handleDeselectAllChange}
                            sx={{
                                '& .MuiCheckbox-root': {
                                    color: theme.typography.common.blue,
                                },
                                '& .Mui-checked': {
                                    color: '#000000',
                                }
                            }}
                        />
                    }
                    label="Deselect All"
                />
                {filterList.map((item, index) =>
                    <div key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            {/* <HomeWorkIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/> */}
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont}}>
                                {item.address}
                            </Typography>
                        </div>
                        <FormControlLabel
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    color: theme.typography.primary.black,
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.mediumFont,
                                },
                            }}
                            control={
                                <Checkbox
                                    checked={item.checked}
                                    sx={{
                                        '& .MuiCheckbox-root': {
                                            color: theme.typography.common.blue,
                                        },
                                        '& .Mui-checked': {
                                            color: '#000000',
                                        }
                                    }}
                                    onChange={() => { 
                                        let tempFilterList = filterList.map(filterItem => ({...filterItem}));
                                        tempFilterList[index].checked = !tempFilterList[index].checked;
                                        setFilterList(tempFilterList);

                                        // Update "Deselect All" checkbox state
                                        const allChecked = tempFilterList.every(filterItem => filterItem.checked);
                                        setDeselectAll(!allChecked);
                                    }}
                                />
                            }   
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
