import { 
    Typography,
    Button,
    Grid,
} from "@mui/material";
import theme from '../../../theme/theme';

export default function OwnerProfileLink(props){
    let owner_first_name = props.maintenanceItem.owner_first_name;
    let owner_last_name = props.maintenanceItem.owner_last_name;

    console.log("OwnerProfileLink first name", owner_first_name)
    console.log("OwnerProfileLink last name", owner_last_name)

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
                Owner - {owner_first_name} {owner_last_name}
            </Typography>
        </Button>
    </Grid>
    )
}