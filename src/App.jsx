import { BrowserRouter, Routes } from 'react-router';
import './App.css'

function App() {

  return (
    <BrowserRouter>
  
    <Routes>
      <Route path="/" component={<Login/>}></Route>
      <Route path="/resident" component={<ResidentView/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
