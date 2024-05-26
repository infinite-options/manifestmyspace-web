import React, { useState } from "react";
import "../css/selectMonth.css";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
const SelectMonthComponent = (props) => {
  const [selectedMonth, setSelectedMonth] = useState(props.month);

  const [selectedYear, setSelectedYear] = useState(props.year);

  const handleMonthChange = (month) => {
    props.setMonth(month);
    setSelectedMonth(month);
    console.log("month ", month);
  };

  const handleYearChange = (year) => {
    props.setYear(year);
    setSelectedYear(year);
    console.log("year ", year);
  };

  const getYear = (selection) => {
    let year = new Date().getFullYear();
    if (selection === "current") {
      return year;
    } else if (selection === "next") {
      return year + 1;
    } else if (selection === "previous") {
      return year - 1;
    }
  };

  return (
    <Dialog open={props.showSelectMonth} onClose={() => props.setShowSelectMonth(false)} maxWidth="lg">
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => props.setShowSelectMonth(false)}
          sx={{
            position: "absolute",
            right: 1,
            top: 1,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="rectangle-parent">
          {/* <div className="group-child" /> */}

          <div className="select-monthyear-parent">
            <b className="select-monthyear">
              <CalendarTodayIcon sx={{ color: "#3D5CAC" }} />
              Select Month/Year
            </b>
          </div>

          <div className="vector-parent">
            <Button
              variant={selectedYear === getYear("previous") ? "contained" : "outlined"}
              id="button"
              className="group-item"
              // className={`group-item ${selectedYear === getYear("previous") ? "selected" : ""}`}
              onClick={() => {
                handleYearChange(getYear("previous"));
              }}
            >
              {" "}
              {getYear("previous")}
            </Button>
          </div>

          <div className="vector-parent3">
            <Button
              variant={selectedYear === getYear("current") ? "contained" : "outlined"}
              id="button"
              className="group-item"
              onClick={() => {
                handleYearChange(getYear("current"));
              }}
            >
              {" "}
              {getYear("current")}{" "}
            </Button>
          </div>

          <div className="vector-parent4">
            <Button
              variant={selectedYear === getYear("next") ? "contained" : "outlined"}
              id="button"
              className="group-item"
              onClick={() => {
                handleYearChange(getYear("next"));
              }}
            >
              {" "}
              {getYear("next")}{" "}
            </Button>
          </div>

          <div className="vector-group">
            <Button variant="outlined" id="button" className="group-inner">
              {" "}
              Past 12 Months{" "}
            </Button>
          </div>
          <div className="vector-container">
            <Button variant="outlined" id="button" className="group-inner">
              {" "}
              Year to Date{" "}
            </Button>
          </div>
          <div className="group-div">
            <Button variant="outlined" id="button" className="group-inner">
              {" "}
              Past 24 Months{" "}
            </Button>
          </div>
          {/* <div className="vector-parent1">
            <Button variant="outlined" id="button" className="group-inner">
              {" "}
              All of 2022{" "}
            </Button>
          </div> */}
          <div className="vector-parent1">
            <Button variant="outlined" id="button" className="group-inner">
              {" "}
              All of {getYear("previous")}{" "}
            </Button>
          </div>
          <div className="january-february-march-april-m">
            <span className="january-february-march-april-m1">
              <p
                id="January"
                className={selectedMonth === "January" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("January");
                }}
              >
                January
              </p>
              <p
                id="February"
                className={selectedMonth === "February" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("February");
                }}
              >
                February
              </p>
              <p
                id="March"
                className={selectedMonth === "March" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("March");
                }}
              >
                March
              </p>
              <p
                id="April"
                className={selectedMonth === "April" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("April");
                }}
              >
                April
              </p>
              <p
                id="May"
                className={selectedMonth === "May" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("May");
                }}
              >
                May
              </p>
              <p
                id="June"
                className={selectedMonth === "June" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("June");
                }}
              >
                June
              </p>
            </span>
          </div>
          <div className="july-august-september-october">
            <span className="january-february-march-april-m1">
              <p
                id="July"
                className={selectedMonth === "July" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("July");
                }}
              >
                July
              </p>
              <p
                id="August"
                className={selectedMonth === "August" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("August");
                }}
              >
                August
              </p>
              <p
                id="September"
                className={selectedMonth === "September" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("September");
                }}
              >
                September
              </p>
              <p
                id="October"
                className={selectedMonth === "October" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("October");
                }}
              >
                October
              </p>
              <p
                id="November"
                className={selectedMonth === "November" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("November");
                }}
              >
                November
              </p>
              <p
                id="December"
                className={selectedMonth === "December" ? "selected" : "january"}
                onClick={() => {
                  handleMonthChange("December");
                }}
              >
                December
              </p>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectMonthComponent;
