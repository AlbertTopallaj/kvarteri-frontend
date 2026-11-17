import { Link, NavLink } from 'react-router';
import './Sidebar.css'
import { CalendarDays, FileExclamationPoint, HouseHeart, LogOut, MessagesCircle, Settings, SquareText } from 'lucide-react'

const navItems = [
    { to: '/resident', label: 'Hem', icon: HouseHeart, end: true },
    { to: '/resident/arenden', label: 'Ärenden', icon: SquareText },
    { to: '/resident/boka', label: 'Boka', icon: CalendarDays },
    { to: '/resident/felanmalan', label: 'Felanmälan', icon: FileExclamationPoint },
    { to: '/resident/chatt', label: 'Chatt', icon: MessagesCircle },
];

export default function Sidebar(){
    return <>
    <aside className="sidebar">
        <span className='span-sidebar'>MENY</span>
        <nav className='sidebar-nav'>
            {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} title={label} aria-label={label} className='sidebar-item'>
                    <Icon size={20}/>
                </NavLink>
            ))}
        </nav>
        <div className='sidebar-bottom'>
            <Link to="/settings" className='sidebar-item' title='Inställningar' aria-label='Inställningar'>
                <Settings size={20}/>
            </Link>
            <Link to="/" className='sidebar-item' title='Logga ut' aria-label='Logga ut'>
                <LogOut size={20}/>
            </Link>
        </div>
    </aside>
    </>
}
