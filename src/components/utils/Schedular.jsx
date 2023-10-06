import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";

const Scheduler = ({ show, setShow, date = dayjs(), setDate }) => {
  const handleClose = () => setShow(false);
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            value={date.format("h:mm A, MM/DD/YYYY")}
            inputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <StaticDateTimePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button sx={{ backgroundColor: "#3D5CAC" }} onClick={handleClose}>
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Scheduler;
