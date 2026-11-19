import { Link } from 'react-router';
import { LogOut, Settings } from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Logo from '../Logo/Logo';
import { useApp } from '../../context/AppContext';
import { ROLE_LABELS } from '../../utils/roles';
import './StaffLayout.css'

// Gemensam ram för admin- och styrelsevyerna.
export default function StaffLayout({ children }){
    const { user, logout } = useApp();

    return <>
    <div className="staff-shell">
        <header className="staff-header">
            <div className="staff-brand">
                <Logo size={22}/>
                <span className="staff-role">{ROLE_LABELS[user.role]}</span>
                {user.association && <span className="staff-role">{user.association.name}</span>}
            </div>
            <div className="staff-actions">
                <span className="staff-user">{user.name}</span>
                <ThemeToggle/>
                <NotificationBell/>
                <Link to="/settings" className="staff-icon-btn" aria-label="Inställningar" title="Inställningar">
                    <Settings size={18}/>
                </Link>
                <Link to="/" className="staff-icon-btn" aria-label="Logga ut" title="Logga ut" onClick={logout}>
                    <LogOut size={18}/>
                </Link>
            </div>
        </header>
        <main className="staff-main">
            {children}
        </main>
    </div>
    </>
}
