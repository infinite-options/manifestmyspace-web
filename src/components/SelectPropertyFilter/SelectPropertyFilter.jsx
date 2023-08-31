import {
    Button,
    Typography,
} from '@mui/material';

import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../theme/theme';




export default function SelectPropertyFilter(){

    // needs to get a list of properties
    // needs to get a list it can update with the properties you are viewing

    // needs to get data it has to filter?


    


    return (
        <Button sx={{ textTransform: 'capitalize' }}>
            <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
            <Typography 
                sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
            >
            All Properties
            </Typography>
        </Button>
    )
}