
import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
} from "@mui/material";
import PropTypes from 'prop-types';
import theme from '../../theme/theme';
import maintenaceRequestImage from './maintenanceRequest.png'

export default function RequestCard({data, status, color}){

    console.log("data", data)
    return (
        <div style={{paddingBottom: "10px"}}>
            <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%', // Take up full screen width            
                marginTop: theme.spacing(2), // Set the margin to 20px
                color: status.color,
            }}
            >
                <Card sx={{ maxWidth: 345 }}>
                    <Typography
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                        >
                            {data.request_type}
                    </Typography>

                    {/* <CardHeader
                        title={data.description}
                        subheader={data.request_type}
                    /> */}
                    <CardMedia
                        component="img"
                        height="194"
                        width="300"
                        image={maintenaceRequestImage}
                        alt="Paella dish"
                    />
                    <CardContent>
                        <Typography
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}
                        >
                            {data.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>

    )
}