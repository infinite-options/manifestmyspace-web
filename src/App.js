import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';
import { OnboardingProvider } from './contexts/OnboardingContext';

function App() {
  return (
    <UserProvider>
    <OnboardingProvider>
    <SettingsACHContextProvider>
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </SettingsACHContextProvider>
    </OnboardingProvider>
    </UserProvider>
  )
}

export default App;
