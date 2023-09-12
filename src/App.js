import './App.css';
import Main from './components/Main';
import {SettingsACHContextProvider} from '../src/contexts/SettingsACHContext';
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <SettingsACHContextProvider>
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </SettingsACHContextProvider>
  )
}

export default App;
