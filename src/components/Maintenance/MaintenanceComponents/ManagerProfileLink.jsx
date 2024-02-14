import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function ManagerProfileLink(props){
    let business_name = props.maintenanceItem?.business_name || "Business Name Not Available";

    console.log("ManagerProfileLink business name", business_name)

    return (
        <Grid item xs={12} sx={{
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "40px",
        }}>
        <Button
            variant="contained"
            disableElevation
            sx={{
                backgroundColor: "#D6D5DA",
                textTransform: "none",
                paddingRight: "10px",
                borderRadius: "10px",
                paddingLeft: "30px",
                display: 'flex',
                width: "100%",
            }}
        >
            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                {business_name}
            </Typography>
        </Button>
    </Grid>
    )
}