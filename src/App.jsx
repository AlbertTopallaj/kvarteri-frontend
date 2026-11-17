import { BrowserRouter, Routes, Route } from 'react-router';
import { ToastProvider } from './components/Toast/ToastProvider';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import RequireRole from './components/RequireRole/RequireRole';
import ResidentLayout from './pages/ResidentView/ResidentLayout';
import ResidentView from './pages/ResidentView/ResidentView';
import './App.css'
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';
import Errand from './pages/Errand/Errand';
import Booking from './pages/Booking/Booking';
import Incident from './pages/Incident/Incident';
import Chat from './pages/Chat/Chat';
import AdminView from './pages/Admin/AdminView';
import BoardView from './pages/Board/BoardView';

function App() {

  return (
  <>
    <ThemeProvider>
    <ToastProvider>
    <AppProvider>
    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Login/>} />

      <Route element={<RequireRole roles={['resident']} />}>
        <Route path="/resident" element={<ResidentLayout/>}>
          <Route index element={<ResidentView/>} />
          <Route path="arenden" element={<Errand/>} />
          <Route path="boka" element={<Booking/>} />
          <Route path="felanmalan" element={<Incident/>} />
          <Route path="chatt" element={<Chat/>} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['board']} />}>
        <Route path="/board" element={<BoardView/>} />
      </Route>

      <Route element={<RequireRole roles={['admin']} />}>
        <Route path="/admin" element={<AdminView/>} />
      </Route>

      <Route element={<RequireRole roles={['resident', 'board']} />}>
        <Route path="/settings" element={<Settings/>} />
      </Route>
    </Routes>

    </BrowserRouter>
    </AppProvider>
    </ToastProvider>
    </ThemeProvider>
  </>
  )
}

export default App
