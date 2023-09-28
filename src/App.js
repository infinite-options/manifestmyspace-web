import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';
import {PMProfileContextProvider} from '../src/contexts/PMProfileContext';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';
import { POProfileContextProvider } from './contexts/POProfileContext';
import { TenantProfileContextProvider } from './contexts/TenantProfileContext';

function App() {
  return (
    <UserProvider>
    <PMProfileContextProvider>
    <POProfileContextProvider>
    <TenantProfileContextProvider>
    <SettingsACHContextProvider>
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </SettingsACHContextProvider>
    </TenantProfileContextProvider>
    </POProfileContextProvider>
    </PMProfileContextProvider>
    </UserProvider>
  )
}

export default App;
