import { BrowserRouter, Routes, Route } from 'react-router';
import ResidentView from './pages/ResidentView/ResidentView';
import './App.css'
import Login from './pages/Login';
import Settings from './pages/Settings';

function App() {

  return ( 
  <>

    <BrowserRouter>
  
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/resident" element={<ResidentView/>} />
      <Route path="/settings" element={<Settings/>} />
    </Routes>
    </BrowserRouter>
    </>
    )
  }

export default App
