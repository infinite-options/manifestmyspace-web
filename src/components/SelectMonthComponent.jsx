import "../css/selectMonth.css";
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const SelectMonthComponent = (props) => {
  return (
      <Dialog open={props.showSelectMonth} maxWidth="lg">
      <DialogContent>
      <div className="rectangle-parent">
      <div className="group-child" />
      <div className="select-monthyear-parent">
        <b className="select-monthyear"><CalendarTodayIcon sx={{color:"#3D5CAC"}}/> Select Month/Year</b>
      </div>
      <div className="vector-parent">
        <Button variant="outlined" id="button" className="group-item"> 2023 </Button>
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
        <Button id="button" variant="outlined" className="group-item"> 2022 </Button>
      </div>
      <div className="vector-parent4">
        <Button className="group-item" id="button"> 2021 </Button>
      </div>
      <div className="january-february-march-april-m">
        <span className="january-february-march-april-m1">
          <p className="january">January</p>
          <p className="january">February</p>
          <p className="january">March</p>
          <p className="january">April</p>
          <p className="january">May</p>
          <p className="january">June</p>
        </span>
      </div>
      <div className="july-august-september-october">
        <span className="january-february-march-april-m1">
          <p className="january">July</p>
          <p className="january">August</p>
          <p className="january">September</p>
          <p className="january">October</p>
          <p className="january">November</p>
          <p className="january">December</p>
        </span>
      </div>
      {/* <img className="close-round-icon" alt="" src="/close-round.svg" /> */}
      </div>
      </DialogContent>
      </Dialog>
  );
};

export default SelectMonthComponent;
