import "../css/selectMonth.css";
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const SelectMonthComponent = (props) => {
  const handleMonthChange = (month) => {
    props.setMonth(month);
    console.log("month ", month)
    // props.setShowSelectMonth(false)
  }
  const handleYearChange = (year) => {
    props.setYear(year);
    console.log("year ", year)
  }
  return (
      <Dialog open={props.showSelectMonth} onClose={()=>props.setShowSelectMonth(false)} maxWidth="lg">
      <DialogContent>
      <div className="rectangle-parent">
      <div className="group-child" />
      <div className="select-monthyear-parent">
        <b className="select-monthyear"><CalendarTodayIcon sx={{color:"#3D5CAC"}}/> Select Month/Year</b>
      </div>
      <div className="vector-parent">
        <Button variant="outlined" id="button" className="group-item" onClick={() => { handleYearChange('2023') }}> 2023 </Button>
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
          <p className="january" onClick={()=>{handleMonthChange('January')}}>January</p>
          <p className="january" onClick={()=>{handleMonthChange('February')}}>February</p>
          <p className="january" onClick={()=>{handleMonthChange('March')}}>March</p>
          <p className="january" onClick={()=>{handleMonthChange('April')}}>April</p>
          <p className="january" onClick={()=>{handleMonthChange('May')}}>May</p>
          <p className="january" onClick={()=>{handleMonthChange('June')}}>June</p>
        </span>
      </div>
      <div className="july-august-september-october">
        <span className="january-february-march-april-m1">
          <p className="january" onClick={()=>{handleMonthChange('July')}}>July</p>
          <p className="january" onClick={()=>{handleMonthChange('August')}}>August</p>
          <p className="january" onClick={()=>{handleMonthChange('September')}}>September</p>
          <p className="january" onClick={()=>{handleMonthChange('October')}}>October</p>
          <p className="january" onClick={()=>{handleMonthChange('November')}}>November</p>
          <p className="january" onClick={()=>{handleMonthChange('December')}}>December</p>
        </span>
      </div>
      {/* <img className="close-round-icon" alt="" src="/close-round.svg" /> */}
      </div>
      </DialogContent>
      </Dialog>
  );
};

export default SelectMonthComponent;
