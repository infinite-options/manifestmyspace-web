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
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import RequestMoreInfo from "../Worker/RequestMoreInfo";
import AlertMessage from "../AlertMessage";
import DateTimePickerModal from "../../DateTimePicker";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIConfig from "../../../utils/APIConfig";

export default function NewRequestAction({ maintenanceItem, navigateParams, quotes }) {
    const navigate = useNavigate();
    const { maintenanceRoutingBasedOnSelectedRole, getProfileId } = useUser();
    const [schedulerDate, setSchedulerDate] = useState();
    const [showRequestMoreInfo, setShowRequestMoreInfo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    function handleNavigateToQuotesRequested() {
        if (isMobile) {
            navigate("/quoteRequest", {
                state: {
                    maintenanceItem,
                    navigateParams
                }
            });
        } else {
            if (maintenanceItem && navigateParams) {
                try {
                    const maintenanceItemStr = JSON.stringify(maintenanceItem);
                    const navigateParamsStr = JSON.stringify(navigateParams);

                    console.log('Storing data in sessionStorage: ', navigateParams);

                    // Save data to sessionStorage
                    sessionStorage.setItem('maintenanceItem', maintenanceItemStr);
                    sessionStorage.setItem('navigateParams', navigateParamsStr);
                    sessionStorage.setItem('selectedRequestIndex', navigateParams.maintenanceRequestIndex);
                    sessionStorage.setItem('selectedStatus', navigateParams.status);
                    sessionStorage.setItem('desktopView', 'true');
                    window.dispatchEvent(new Event('storage'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('maintenanceRequestSelected'));
                    }, 0);
                } catch (error) {
                    console.error("Error setting sessionStorage: ", error);
                }
            } else {
                console.error("maintenanceItem or navigateParams is undefined");
            }
        }
    }

    async function handleSubmit(maintenanceItemUID, date, time) {
        const changeMaintenanceRequestStatus = async () => {
            setShowSpinner(true);
            const formData = new FormData();
            formData.append("maintenance_request_uid",  maintenanceItemUID);
            formData.append("maintenance_scheduled_date", date); 
            formData.append("maintenance_scheduled_time", time);
            formData.append("maintenance_request_status", "SCHEDULED");
            if (!maintenanceItem.maint_business_uid){
                formData.append("maintenance_assigned_business", getProfileId());
            }
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
                    method: 'PUT',
                    body: formData,
                });
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        await changeMaintenanceRequestStatus();
        navigate(maintenanceRoutingBasedOnSelectedRole())
    }

    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container direction="row" columnSpacing={4} rowSpacing={6} >
                <TenantProfileLink maintenanceItem={maintenanceItem}/>
                <OwnerProfileLink maintenanceItem={maintenanceItem}/>
                <Grid item xs={12} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#D6D5DA",
                            textTransform: "none",
                            borderRadius: "10px",
                            width: "100%",
                        }} 
                        onClick={() => setShowRequestMoreInfo(true)}
                    >
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "13px"}}>
                            Request More Info
                        </Typography>
                    </Button>
                    <RequestMoreInfo showRequestMoreInfo={showRequestMoreInfo} setShowRequestMoreInfo={setShowRequestMoreInfo} maintenanceItem={maintenanceItem}/>
                </Grid>
           
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#9EAED6",
                            textTransform: "none",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Schedule Repair
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#C06A6A",
                            textTransform: "none",
                            paddingRight: "0px",
                            borderRadius: "10px",
                            display: 'flex',
                            width: "100%",
                        }}
                        onClick={() => handleNavigateToQuotesRequested()}
                    >
                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px"}}>
                            Request Quotes
                        </Typography>
                        <KeyboardArrowRight sx={{color: "#FFFFFF"}}/>
                    </Button>
                </Grid>
                <CancelButton maintenanceItem={maintenanceItem} quotes={quotes} setShowMessage={setShowMessage} setMessage={setMessage}/>
                <CompleteButton maintenanceItem={maintenanceItem} setShowMessage={setShowMessage} setMessage={setMessage}/>
            </Grid>
            <AlertMessage showMessage={showMessage} setShowMessage={setShowMessage} message={message} />
            <DateTimePickerModal
                setOpenModal={setShowModal}
                open={showModal}
                maintenanceItem={maintenanceItem}
                date={""}
                time={""}
                handleSubmit={handleSubmit}
            />
        </Box>
    )
}
