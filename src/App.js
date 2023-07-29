import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Container } from "react-bootstrap";
// import Homepage from "./Homepage";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import EmailLogin from "./Login/EmailLogin";
import EmailSignup from "./Signup/EmailSignup";
import GoogleLogin from "./Login/GoogleLogin";
import GoogleSignup from "./Signup/GoogleSignup";
import Main from "./components/Main";
import SelectMonthComponent from "./components/SelectMonthComponent";
import MaintenanceWidget from "./components/MaintenanceWidget";
import CashflowOwner from "./components/Cashflow/CashflowOwner";

// function App() {
//   return <Main></Main>;
// }

function App() {
  return (
    <Container className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/dashboard" element={<MaintenanceWidget />} />
          <Route exact path="/cashflowOwner" element={<CashflowOwner />} />
          <Route exact path="/selectMonthComponent" element={<SelectMonthComponent />} />

          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/email-signup" element={<EmailSignup />} />

          <Route path="/google-login" element={<GoogleLogin />} />
          <Route path="/google-signup" element={<GoogleSignup />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
