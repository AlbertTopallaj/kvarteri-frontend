import './Sidebar.css'

export default function Sidebar(){
    return <>
    <aside className="sidebar">
        <span className='span-sidebar'>MENYN</span>
        <div className='sidebar-item'>
            <span>Hem</span>
        </div>
        <div className='sidebar-item'>
            <span>Ärenden</span>
        </div>
        <div className='sidebar-item'>
            <span>Incidentrapporter</span>
        </div>
    </aside>
    </>
}