import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import { useUser } from "../../../contexts/UserContext";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";
import useMediaQuery from '@mui/material/useMediaQuery';


export default function CompleteMaintenance({maintenanceItem, navigateParams, quotes}){
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    console.log("COMPLETE MAINTENANCE QUOTES", quotes)

    let finishedQuote = quotes.find(quote => quote.quote_status === "FINISHED" || quote.quote_status === "COMPLETED")

    function handleNavigate(){
        console.log("navigate to pay Maintenance")

        if (isMobile) {
            navigate("/payMaintenance", {
            state:{
                maintenanceItem,
                navigateParams
            }
        })
    } else {
        if (maintenanceItem && navigateParams) {
            try {
                const maintenanceItemStr = JSON.stringify(maintenanceItem);
                const navigateParamsStr = JSON.stringify(navigateParams);

                // Save data to sessionStorage
                sessionStorage.setItem('maintenanceItem', maintenanceItemStr);
                sessionStorage.setItem('navigateParams', navigateParamsStr);
                sessionStorage.setItem('selectedRequestIndex', navigateParams.maintenanceRequestIndex);
                sessionStorage.setItem('selectedStatus', navigateParams.status);
                sessionStorage.setItem('payMaintenanceView', 'true');
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => {
                    window.dispatchEvent(new Event('maintenanceRequestSelected'));
                }, 0);
            } catch (error) {
                console.error('Error setting sessionStorage: ', error);
            }
        } else {
            console.error('maintenanceItem or navigateParams is undefined');
        }
    }
    }

    function handleNavigateToQuotesAccept(){
        if (isMobile) {navigate("/quoteAccept", {
            state:{
                maintenanceItem,
                navigateParams,
                quotes
            }
        });
    }else {
        if (maintenanceItem && navigateParams) {
            try {
                const maintenanceItemStr = JSON.stringify(maintenanceItem);
                const navigateParamsStr = JSON.stringify(navigateParams);
                const quotesStr = JSON.stringify(quotes);
                console.log('Storing data in sessionStorage: ', quotesStr);

                // Save data to sessionStorage
                sessionStorage.setItem('maintenanceItem', maintenanceItemStr);
                sessionStorage.setItem('navigateParams', navigateParamsStr);
                sessionStorage.setItem('quotes', quotesStr);
                sessionStorage.setItem('selectedRequestIndex', navigateParams.maintenanceRequestIndex);
                sessionStorage.setItem('selectedStatus', navigateParams.status);
                sessionStorage.setItem('quoteAcceptView', 'true');
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => {
                    window.dispatchEvent(new Event('maintenanceRequestSelected'));
                }, 0);
            } catch (error) {
                console.error('Error setting sessionStorage: ', error);
            }
        } else {
            console.error('maintenanceItem or navigateParams is undefined');
        }
    }
    }

    return(
        <Box 
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
              <Card
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: 'none',
                    elevation: '0',
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px',
                }}
            >
            <Grid container justifyContent="space-between" sx={{ marginTop: theme.spacing(2), padding: theme.spacing(2) }}>
			{quotes.length > 0 ? (
			<Grid item>
				<Button
					variant="contained"
					sx={{
						backgroundColor: '#a7b8e6',
						color: '#160449',
						textTransform: 'none',
						fontWeight: 'bold',
						borderRadius: '8px',
						width: '160px',
						height: '120px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						padding: '10px',
						boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
						whiteSpace: 'normal',
						'&:hover': {
							backgroundColor: '#a7b8e6',
						},
					}}
					onClick={() => handleNavigateToQuotesAccept()}
				>
					View Quotes
				</Button>
			</Grid>
			) : null}
            <Grid item>
				<Button
					variant="contained"
					sx={{
						backgroundColor: '#FFC614',
						color: '#160449',
						textTransform: 'none',
						fontWeight: 'bold',
						borderRadius: '8px',
						width: '160px',
						height: '120px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						padding: '10px',
						boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
						whiteSpace: 'normal',
						'&:hover': {
							backgroundColor: '#FFC614',
						},
					}}
					onClick={() => handleNavigate()}
				>
                        
					  {finishedQuote && maintenanceItem.maintenance_status !== "CANCELLED" ? "Pay Maintenance" : "Charge Owner"}
				</Button>
			</Grid>
			
            </Grid> </Card></Box>
    )
}