import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';
import { useNavigate } from "react-router-dom"

export default function TenantProfileLink(props){
    let allAdultTenants = "Tenant - ";
    let navigate = useNavigate();

    if (props.maintenanceItem) {
        let profile = props.maintenanceItem;
        try {
            let tenant_adult_occupants = Array.isArray(JSON.parse(props.maintenanceItem.tenant_adult_occupants)) ?
                                         JSON.parse(props.maintenanceItem.tenant_adult_occupants) : [];
            if (tenant_adult_occupants.length > 0) {
                tenant_adult_occupants.forEach((tenant, index) => {
                    const name = tenant.name || "Unknown";
                    const lastName = tenant.last_name || "Name";
                    if (index === tenant_adult_occupants.length - 1) {
                        allAdultTenants += `${name} ${lastName}`;
                    } else {
                        allAdultTenants += `${name} ${lastName}, `;
                    }
                });
            } else {
                allAdultTenants = "Vacant";
            }
        } catch (error) {
            console.error("Error parsing tenant_adult_occupants:", error);
            allAdultTenants = "Data Unavailable";
        }
    } else {
        allAdultTenants = "Maintenance Item Not Found";
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
                paddingLeft: "0px",
                borderRadius: "10px",
                display: 'flex',
                width: "100%",
            }}
            onClick={() => navigate(`/profile/${props.maintenanceItem.tenant_uid}`, {state: {
                maintenanceItem: props.maintenanceItem,
                profile: "Tenant",
            }})}
        >
            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                {allAdultTenants}
            </Typography>
        </Button>
    </Grid>
    )
}