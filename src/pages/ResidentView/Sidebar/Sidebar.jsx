import './Sidebar.css'
import { FileExclamationPoint, HouseHeart, MessagesCircle, Settings, SquareText } from 'lucide-react'

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
                <Settings/>
            </div>
            <div className='sidebar-bottom-item'>
                Logga ut
            </div>
        </div>
    </aside>
    </>
}