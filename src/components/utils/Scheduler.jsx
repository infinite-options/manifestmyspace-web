import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ReactComponent as DateTimeIcon } from "../../images/datetime.svg";

const getAvailableTimeSlots = () => {
  const times = [];
  let time = dayjs().hour(9).minute(0).second(0).millisecond(0);
  const end = dayjs().hour(16).minute(59).second(0).millisecond(0);
  while (time.isBefore(end)) {
    times.push(dayjs(time));
    time = time.add(30, "minute");
  }
  return times;
};

const getInitialDate = () => {
  const currentTime = dayjs().second(0).millisecond(0);
  const minsToNext30 = 30 - (currentTime.minute() % 30);
  let adjustedTime = currentTime.add(minsToNext30, "minute");
  const hour = adjustedTime.hour();
  if (hour >= 17) adjustedTime = adjustedTime.add(1, "day").hour(9).minute(0);
  else if (hour < 9) adjustedTime = adjustedTime.hour(9).minute(0);
  return adjustedTime;
};

const Scheduler = ({
  show,
  setShow,
  date = getInitialDate(),
  setDate,
  handleSubmit = () => {},
}) => {
  const times = getAvailableTimeSlots();
  const theme = useTheme();
  const handleClose = () => setShow(false);
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const handleTimeChange = (newTime) => {
    const newDate = dayjs(date).hour(newTime.hour()).minute(newTime.minute());
    setDate(newDate);
  };
  return (
    <Dialog open={show} onClose={handleClose}>
      <Box
        sx={{
          [theme.breakpoints.down("sm")]: {
            p: 2,
            pb: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            [theme.breakpoints.down("sm")]: {
              p: 0,
            },
            [theme.breakpoints.up("md")]: {
              p: 5,
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
              value={date.format("h:mm A, MM/DD/YYYY")}
              inputProps={{
                readOnly: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <DateTimeIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 5,
                width: "100%",
                "& .MuiInputBase-root": {
                  color: "#3D5CAC",
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                },
              }}
            />
            <Stack spacing={0} direction={{ xs: "column", md: "row" }}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={date}
                onChange={handleDateChange}
                disablePast
                renderInput={() => <></>}
                sx={{
                  backgroundColor: "#D6D5DA",
                  borderRadius: "10px",
                  textAlign: "center",
                  "& .MuiPickersCalendarHeader-label": {
                    color: "#3D5CAC",
                    fontWeight: "bold",
                  },
                  "& .MuiDayCalendar-weekDayLabel,& .MuiPickersDay-root": {
                    color: "#3D5CAC",
                  },
                  "& .Mui-disabled": {
                    color: "#3D5CAC",
                    opacity: 0.2,
                  },
                  "& .Mui-selected": {
                    color: "#3D5CAC !important",
                    backgroundColor: "rgba(61,92,172,0.25) !important",
                    fontWeight: "bold !important",
                  },
                }}
              />
              <Grid
                container
                // columnSpacing={{ xs: 5, md: 10 }}
                spacing={{ xs: 3 }}
                sx={{
                  alignContent: "space-between",
                  [theme.breakpoints.down("md")]: {
                    pt: 2,
                    pb: 2,
                  },
                  [theme.breakpoints.up("md")]: {
                    width: "16vw",
                  },
                }}
              >
                {times.map((time) => {
                  const isTimeMatch =
                    date.format("h:mm A") === time.format("h:mm A");
                  return (
                    <Grid
                      item
                      key={time}
                      xs={3}
                      md={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        selected={isTimeMatch}
                        onClick={() => handleTimeChange(time)}
                        sx={{
                          p: 1,
                          backgroundColor: isTimeMatch
                            ? "rgba(61,92,172,0.25)"
                            : "#D6D5DA",
                          fontWeight: isTimeMatch ? "bold" : "normal",
                          color: "#3D5CAC !important",
                          width: "78px",
                          textTransform: "none",
                          fontSize: 15,
                          borderRadius: "10px",
                          ":hover": {
                            backgroundColor: "#bcbbbf !important",
                          },
                          ":active,:focus": {
                            backgroundColor: "rgba(61,92,172,0.25)",
                            fontWeight: "bold",
                          },
                        }}
                      >
                        {time.format("h:mm A")}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </LocalizationProvider>
        </DialogContent>
      </Box>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          sx={{
            backgroundColor: "#3D5CAC",
            fontSize: 20,
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "10px",
          }}
          onClick={handleSubmit}
        >
          {"Schedule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Scheduler;
