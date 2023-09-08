import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';

function App() {
  return (
    <SettingsACHContextProvider>
    <Main></Main>
    </SettingsACHContextProvider>
  )
}

export default App;
