import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function OwnerProfileLink(props){
    var ownerName = "";
    if (props.maintenanceItem) {    
        const firstName = props.maintenanceItem.owner_first_name || "";
        const lastName = props.maintenanceItem.owner_last_name || "";

        ownerName = `${firstName} ${lastName}`.trim();

        if (!firstName && !lastName) {
            ownerName = "Owner Name Not Available";
        }
    } else {
        ownerName = "Maintenance Item Not Found";
    }    
    return (
        <Grid item xs={6} sx={{
            alignItems: "center",
            justifyContent: "center",
        }}>
        <Button
            variant="contained"
            disableElevation
            sx={{
                backgroundColor: "#D6D5DA",
                textTransform: "none",
                paddingRight: "0px",
                borderRadius: "10px",
                display: 'flex',
                width: "100%",
            }}
        >
            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                Owner - {ownerName}
            </Typography>
        </Button>
    </Grid>
    )
}