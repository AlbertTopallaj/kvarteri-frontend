import './Sidebar.css'
import { HouseHeart } from 'lucide-react'

export default function Sidebar(){
    return <>
    <aside className="sidebar">
        <span className='span-sidebar'>MENYN</span>
        <div className='sidebar-item'>
            <HouseHeart/><span>Hem</span>
        </div>
        <div className='sidebar-item'>
            <span>Ärenden</span>
        </div>
        <div className='sidebar-item'>
            <span>Incidentrapporter</span>
        </div>
        <div className='sidebar-item'>
            <span>Chatt</span>
        </div>
        <div className='sidebar-bottom'>
            <div className='sidebar-bottom-item'>
                Inställningar
            </div>
            <div className='sidebar-bottom-item'>
                Logga ut
            </div>
        </div>
    </aside>
    </>
}