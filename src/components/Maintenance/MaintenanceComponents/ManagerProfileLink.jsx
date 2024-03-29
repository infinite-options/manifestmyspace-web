import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';
import { useNavigate } from "react-router-dom"

export default function ManagerProfileLink(props){
    let business_name = props.maintenanceItem?.business_name || "Business Name Not Available";
    let navigate = useNavigate();

    return (
        <Grid item xs={12} sx={{
            alignItems: "center",
            justifyContent: "center",
            // paddingLeft: "40px",
        }}>
        <Button
            variant="contained"
            
            sx={{
                backgroundColor: "#D6D5DA",
                textTransform: "none",
                paddingRight: "10px",
                borderRadius: "10px",
                paddingLeft: "10px",
                display: 'flex',
                width: "100%",
            }}
            onClick={() => navigate(`/profile/${props.maintenanceItem.business_uid}`, {state: {
                maintenanceItem: props.maintenanceItem,
                profile: "Property Manager",
            }})}
        >
            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                {business_name}
            </Typography>
        </Button>
    </Grid>
    )
}