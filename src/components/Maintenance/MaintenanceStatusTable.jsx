import { 
    Typography, 
    Grid, 
    Box, 
    Stack,
    Paper,
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';


export default function MaintenanceStatusTable({status, data}){

    // console.log(data)
    return(
        <ThemeProvider theme={theme}>
                    <Accordion
            sx={{
                backgroundColor: theme.palette.custom.pink,
                boxShadow: 'none',
            }}>
            <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
                <Typography>{status}</Typography>
            </AccordionSummary>
            {data.map((item, index) => 
                <AccordionDetails key={index}>
                    <Typography>{item.property_uid} {item.request_type} {item.priority}</Typography>
                </AccordionDetails>
            )}
            </Accordion>
        </ThemeProvider>
    )
}