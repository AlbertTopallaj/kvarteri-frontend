import { Link } from 'react-router';
import './Sidebar.css'
import { FileExclamationPoint, HouseHeart, LogOut, MessagesCircle, Settings, SquareText } from 'lucide-react'

export default function Sidebar(){
    return <>
    <aside className="sidebar">
        <span className='span-sidebar'>MENY</span>
        <nav className='sidebar-nav'>
            <div className='sidebar-item active' title='Hem'>
                <HouseHeart size={20}/>
            </div>
            <div className='sidebar-item' title='Ärenden'>
                <SquareText size={20}/>
            </div>
            <div className='sidebar-item' title='Felanmälan'>
                <FileExclamationPoint size={20}/>
            </div>
            <div className='sidebar-item' title='Meddelanden'>
                <MessagesCircle size={20}/>
            </div>
        </nav>
        <div className='sidebar-bottom'>
            <Link to="/settings" className='sidebar-item' title='Inställningar'>
                <Settings size={20}/>
            </Link>
            <Link to="/" className='sidebar-item' title='Logga ut'>
                <LogOut size={20}/>
            </Link>
        </div>
    </aside>
    </>
}
