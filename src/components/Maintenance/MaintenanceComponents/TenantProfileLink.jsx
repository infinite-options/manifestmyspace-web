import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function TenantProfileLink(props){
    let tenant_adult_occupants = JSON.parse(props.maintenanceItem.tenant_adult_occupants);
    let tenant_child_occupants = props.maintenanceItem.tenant_child_occupants;
    let tenant_pet_occupants = props.maintenanceItem.tenant_pet_occupants;
    var allAdultTenants = "Tenant - ";

    console.log("TenantProfileLink adult", tenant_adult_occupants)
    console.log("TenantProfileLink child", tenant_child_occupants)
    console.log("TenantProfileLink pet", tenant_pet_occupants)

    if (tenant_adult_occupants.length > 1){
        console.log("TenantProfileLink adult", tenant_adult_occupants)
        tenant_adult_occupants.forEach((tenant, index) => {
            if (index === tenant_adult_occupants.length - 1){
                allAdultTenants += tenant.name + " " + tenant.last_name
            } else{
                allAdultTenants += tenant.name + " " + tenant.last_name + ", "
            }
        })
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
                {allAdultTenants}
            </Typography>
        </Button>
    </Grid>
    )
}