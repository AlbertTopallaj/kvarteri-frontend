import { Outlet } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import './ResidentView.css'

export default function ResidentLayout(){
    return <>
    <div className="resident-layout">
        <Sidebar/>
        <main className="resident-main">
            <div className="topbar">
                <NotificationBell/>
            </div>
            <Outlet/>
        </main>
    </div>
    </>
}
