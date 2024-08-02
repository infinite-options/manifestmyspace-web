import "./App.css";
import Main from "./components/Main";
import { SettingsACHContextProvider } from "../src/contexts/SettingsACHContext";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { CookiesProvider } from "react-cookie";

function App() {
  // console.log("In App.js");
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <UserProvider>
        <OnboardingProvider>
          <SettingsACHContextProvider>
            <BrowserRouter>
              <Main />
            </BrowserRouter>
          </SettingsACHContextProvider>
        </OnboardingProvider>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;
