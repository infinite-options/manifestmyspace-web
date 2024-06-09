import { ThemeProvider, Typography, Box, Tabs, Tab, Paper, Card, CardHeader, Slider, Stack, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ChatIcon from "@mui/icons-material/Chat";
import CancelButton from "../MaintenanceComponents/CancelButton";
import CompleteButton from "../MaintenanceComponents/CompleteButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TenantProfileLink from "../../Maintenance/MaintenanceComponents/TenantProfileLink";
import OwnerProfileLink from "../../Maintenance/MaintenanceComponents/OwnerProfileLink";
import DateTimePickerModal from "../../DateTimePicker";

import APIConfig from "../../../utils/APIConfig";

export default function QuotesAccepted({ maintenanceItem, navigateParams, quotes }) {
  console.log("In QuotesAccepted");
  console.log("In QuotesAccepted maintenanceItem: ", maintenanceItem);
  console.log("In QuotesAccepted navigateParams: ", navigateParams);
  console.log("In QuotesAccepted quotes: ", quotes);
  const navigate = useNavigate();
  const { maintenanceRoutingBasedOnSelectedRole } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [maintenanceItemQuotes, setMaintenanceItemQuotes] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  let maintenanceQuoteInfo = JSON.parse(maintenanceItem.quote_info).find((quote) => quote.quote_status === maintenanceItem.quote_status_ranked);
  console.log(maintenanceQuoteInfo);
  const [date, setDate] = useState(maintenanceQuoteInfo.quote_earliest_available_date || "");
  const [time, setTime] = useState(maintenanceQuoteInfo.quote_earliest_available_time || "");

  const [showModal, setShowModal] = useState(false);

  let business_name = maintenanceItem?.maint_business_name || "Business Name Not Available";

  async function handleScheduleStatusChange(id, date, time) {
    const changeMaintenanceRequestStatus = async () => {
      setShowSpinner(true);
      const formData = new FormData();
      formData.append("maintenance_request_uid", id);
      formData.append("maintenance_request_status", "SCHEDULED");
      formData.append("maintenance_scheduled_date", date);
      formData.append("maintenance_scheduled_time", time);
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
          method: "PUT",
          body: formData,
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.status === 200) {
          console.log("success");
        } else {
          console.log("error setting status");
        }
      } catch (error) {
        console.log("error", error);
      }
      setShowSpinner(false);
    };
    const changeMaintenanceQuoteStatus = async () => {
      setShowSpinner(true);
      const formData = new FormData();
      let quote = quotes.find((quote) => quote.quote_status === "ACCEPTED"); // see number 16 in "Testing Maintenance Flow" ticket
      console.log("changeMaintenanceQuoteStatus maintenanceItemQuotes", maintenanceItemQuotes);
      console.log(quote);
      formData.append("maintenance_quote_uid", quote.maintenance_quote_uid); // 900-xxx
      formData.append("quote_maintenance_request_id", id); //quote_maintenance_request_id maintenance_request_uid
      formData.append("quote_status", "SCHEDULED");

      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
          method: "PUT",
          body: formData,
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.status === 200) {
          console.log("success");
          changeMaintenanceRequestStatus();
          navigate(maintenanceRoutingBasedOnSelectedRole(), { state: { refresh: true } });
        } else {
          console.log("error setting status");
        }
      } catch (error) {
        console.log("error", error);
      }
      setShowSpinner(false);
    };
    await changeMaintenanceQuoteStatus();
    // navigate(maintenanceRoutingBasedOnSelectedRole())
  }

  useEffect(() => {
    setMaintenanceItemQuotes(quotes);
    // console.log("--debug-- maintenanceItemQuotes", maintenanceItemQuotes, quotes)
  }, [quotes]);

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
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container direction="row" columnSpacing={6} rowSpacing={6}>
        <TenantProfileLink maintenanceItem={maintenanceItem} />
        <OwnerProfileLink maintenanceItem={maintenanceItem} />
        <Grid
          item
          xs={12}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#DEA19C",
              textTransform: "none",
              paddingRight: "0px",
              borderRadius: "10px",
              display: "flex",
              width: "100%",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "14px" }}>Contact Maintenance - {business_name}</Typography>
            <KeyboardArrowRight sx={{ color: "#FFFFFF" }} />
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#97A7CF",
              textTransform: "none",
              borderRadius: "10px",
              display: "flex",
              width: "100%",
            }}
            onClick={() => setShowModal(true)}
          >
            <CalendarMonthIcon sx={{ color: "#FFFFFF" }} />
            <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.smallFont }}>Schedule Maintenance</Typography>
          </Button>
        </Grid>
        <CancelButton maintenanceItem={maintenanceItem} quotes={quotes} setShowMessage={setShowMessage} setMessage={setMessage} />
        <CompleteButton maintenanceItem={maintenanceItem} date={date} time={time} setShowMessage={setShowMessage} setMessage={setMessage} />
      </Grid>
      {console.log("date", date, "time", time)}
      <DateTimePickerModal setOpenModal={setShowModal} open={showModal} maintenanceItem={maintenanceItem} date={date} time={time} handleSubmit={handleScheduleStatusChange} />
    </Box>
  );
}
