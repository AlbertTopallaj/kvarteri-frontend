import { Outlet } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './ResidentView.css'

export default function ResidentLayout(){
    return <>
    <div className="resident-layout">
        <Sidebar/>
        <main className="resident-main">
            <div className="topbar">
                <ThemeToggle/>
                <NotificationBell/>
            </div>
            <Outlet/>
        </main>
    </div>
    </>
}
