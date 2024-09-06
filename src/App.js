import "./App.css";
import Main from "./components/Main";
import { SettingsACHContextProvider } from "../src/contexts/SettingsACHContext";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { CookiesProvider } from "react-cookie";
import { MaintenanceProvider } from "./contexts/MaintenanceContext";  // Import the MaintenanceProvider

function App() {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <UserProvider>
        <OnboardingProvider>
          <SettingsACHContextProvider>
            <MaintenanceProvider>  {/* Wrap the application in MaintenanceProvider */}
              <BrowserRouter>
                <Main />
              </BrowserRouter>
            </MaintenanceProvider>
          </SettingsACHContextProvider>
        </OnboardingProvider>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;
