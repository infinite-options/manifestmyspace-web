import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <SettingsACHContextProvider>
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </SettingsACHContextProvider>
    </UserProvider>
  )
}

export default App;
