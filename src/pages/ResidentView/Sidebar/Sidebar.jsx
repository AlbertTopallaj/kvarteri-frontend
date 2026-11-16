import { Link } from 'react-router';
import './Sidebar.css'
import { FileExclamationPoint, HouseHeart, LogOut, MessagesCircle, Settings, SquareText } from 'lucide-react'

export default function Sidebar(){
    return <>
    <aside className="sidebar">
        <span className='span-sidebar'>MENYN</span>
        <div className='sidebar-item'>
           <HouseHeart/>
        </div>
        <div className='sidebar-item'>
            <SquareText/>
        </div>
        <div className='sidebar-item'>
            <FileExclamationPoint/>
        </div>
        <div className='sidebar-item'>
            <MessagesCircle/>
        </div>
        <div className='sidebar-bottom'>
            <div className='sidebar-bottom-item'>
                <Link to="/settings">
                <Settings/>
                </Link>
            </div>
            <div className='sidebar-bottom-item'>
                <Link to="/">
                <LogOut />
                </Link>
            </div>
        </div>
    </aside>
    </>
}