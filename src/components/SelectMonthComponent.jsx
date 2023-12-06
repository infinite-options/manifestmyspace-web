import React, { useState } from 'react';
import "../css/selectMonth.css";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const SelectMonthComponent = (props) => {
  const [selected, setSelected] = useState(props.month);

  const handleMonthChange = (month) => {
    setSelected(month);
    props.setMonth(month);
    console.log("month ", month)
    // props.setShowSelectMonth(false)
  }
  const handleYearChange = (year) => {
    props.setYear(year);
    console.log("year ", year)
  }
  return (
    <Dialog open={props.showSelectMonth} onClose={() => props.setShowSelectMonth(false)} maxWidth="lg">
      <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={()=>props.setShowSelectMonth(false)}
            sx={{
              position: 'absolute',
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
        <div className="group-child" />
        <div className="select-monthyear-parent">
          <b className="select-monthyear"><CalendarTodayIcon sx={{color:"#3D5CAC"}}/> Select Month/Year</b>
        </div>
        <div className="vector-parent">
          <Button variant="outlined" id="button" className="group-item" onClick={() => { handleYearChange('2023') }}> 2023 </Button>
        </div>
        <div className="vector-parent">
          <Button variant="outlined" id="button" className="group-item" onClick={() => { handleYearChange('2024') }}> 2024 </Button>
        </div>
        <div className="vector-group">
          <Button variant="outlined" id="button" className="group-inner"> Past 12 Months </Button>
        </div>
        <div className="vector-container">
          <Button variant="outlined" id="button" className="group-inner"> Year to Date </Button>
        </div>
        <div className="group-div">
          <Button variant="outlined" id="button" className="group-inner"> Past 24 Months </Button>
        </div>
        <div className="vector-parent1">
          <Button variant="outlined" id="button" className="group-inner"> All of 2022 </Button>
        </div>
        <div className="vector-parent2">
          <Button variant="outlined" id="button" className="group-inner"> All of 2023 </Button>
        </div>
        <div className="vector-parent3">
          <Button id="button" variant="outlined" className="group-item" onClick={() => { handleYearChange('2022') }}> 2022 </Button>
        </div>
        <div className="vector-parent4">
              <Button className="group-item" id="button" onClick={() => { handleYearChange('2021') }}> 2021 </Button>
        </div>
        <div className="january-february-march-april-m">
          <span className="january-february-march-april-m1">
            <p id='January' className={selected === 'January' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('January')}}>January</p>
            <p id='February' className={selected === 'February' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('February')}}>February</p>
            <p id='March' className={selected === 'March' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('March')}}>March</p>
            <p id='April' className={selected === 'April' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('April')}}>April</p>
            <p id='May' className={selected === 'May' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('May')}}>May</p>
            <p id='June' className={selected === 'June' ? 'selected' : 'january'} onClick={()=>{handleMonthChange('June')}}>June</p>
          </span>
        </div>
        <div className="july-august-september-october">
          <span className="january-february-march-april-m1">
            <p id='July' className={selected === 'July' ? 'selected' : 'january'} onClick={() => { handleMonthChange('July')}}>July</p>
            <p id='August' className={selected === 'August' ? 'selected' : 'january'}  onClick={()=>{handleMonthChange('August')}}>August</p>
            <p id='September' className={selected === 'September' ? 'selected' : 'january'}  onClick={()=>{handleMonthChange('September')}}>September</p>
            <p id='October' className={selected === 'October' ? 'selected' : 'january'}  onClick={()=>{handleMonthChange('October')}}>October</p>
            <p id='November' className={selected === 'November' ? 'selected' : 'january'}  onClick={()=>{handleMonthChange('November')}}>November</p>
            <p id='December' className={selected === 'December' ? 'selected' : 'january'}  onClick={()=>{handleMonthChange('December')}}>December</p>
          </span>
        </div>
        {/* <img className="close-round-icon" alt="" src="/close-round.svg" /> */}
        </div>
        </DialogContent>
      </Dialog>
  );
};

export default SelectMonthComponent;
