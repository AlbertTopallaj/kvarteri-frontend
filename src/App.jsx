import { BrowserRouter, Routes, Route } from 'react-router';
import ResidentLayout from './pages/ResidentView/ResidentLayout';
import ResidentView from './pages/ResidentView/ResidentView';
import './App.css'
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';
import Errand from './pages/Errand/Errand';
import Booking from './pages/Booking/Booking';
import Incident from './pages/Incident/Incident';
import Chat from './pages/Chat/Chat';

function App() {

  return (
  <>

    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/resident" element={<ResidentLayout/>}>
        <Route index element={<ResidentView/>} />
        <Route path="arenden" element={<Errand/>} />
        <Route path="boka" element={<Booking/>} />
        <Route path="felanmalan" element={<Incident/>} />
        <Route path="chatt" element={<Chat/>} />
      </Route>
      <Route path="/settings" element={<Settings/>} />
    </Routes>
    </BrowserRouter>
    </>
    )
  }

export default App
