import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/roles';
import './NotificationBell.css'

export default function NotificationBell(){
    const { notifications, unreadCount, markAllRead } = useApp();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        function onClick(e){
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    return <>
    <div className="bell-wrap" ref={wrapRef}>
        <button
            type="button"
            className="bell-btn"
            aria-label={`Notiser${unreadCount ? `, ${unreadCount} olästa` : ''}`}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
        >
            <Bell size={18}/>
            {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>

        {open && (
            <div className="bell-menu">
                <div className="bell-menu-header">
                    <strong>Notiser</strong>
                    <button type="button" className="bell-link" onClick={markAllRead} disabled={unreadCount === 0}>
                        Markera alla som lästa
                    </button>
                </div>
                {notifications.length === 0
                    ? <p className="empty-state">Inga notiser ännu.</p>
                    : <ul className="bell-list">
                        {notifications.map(n => (
                            <li key={n.id} className={n.read ? '' : 'unread'}>
                                <span>{n.text}</span>
                                <time>{formatDateTime(n.createdAt)}</time>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        )}
    </div>
    </>
}
