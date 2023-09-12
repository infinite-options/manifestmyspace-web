import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <SettingsACHContextProvider>
    <Main></Main>
    </SettingsACHContextProvider>
    </UserProvider>
  )
}

export default App;
