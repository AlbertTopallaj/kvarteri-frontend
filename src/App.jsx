import { BrowserRouter, Routes, Route } from 'react-router';
import ResidentView from './pages/ResidentView';
import './App.css'

function App() {

  return ( 
  <>

    <BrowserRouter>
  
    <Routes>
      <Route path="/resident" element={<ResidentView/>} />
    </Routes>
    </BrowserRouter>
    </>
    )
  }

export default App
