import { Outlet } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import './ResidentView.css'

export default function ResidentLayout(){
    return <>
    <div className="resident-layout">
        <Sidebar/>
        <main className="resident-main">
            <Outlet/>
        </main>
    </div>
    </>
}
