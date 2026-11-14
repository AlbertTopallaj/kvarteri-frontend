import { BrowserRouter, Routes } from 'react-router';
import './App.css'

function App() {

  return (
    <BrowserRouter>
  
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/resident" element={<ResidentView/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App
