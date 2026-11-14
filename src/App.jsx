import { BrowserRouter, Routes, Route } from 'react-router';
import ResidentView from './pages/ResidentView';
import './App.css'
import Login from './pages/Login';

function App() {

  return ( 
  <>

    <BrowserRouter>
  
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/resident" element={<ResidentView/>} />
    </Routes>
    </BrowserRouter>
    </>
    )
  }

export default App
