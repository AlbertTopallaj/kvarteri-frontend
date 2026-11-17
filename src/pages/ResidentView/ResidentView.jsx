import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/ViewCard/ViewCard";
import { useApp } from "../../context/AppContext";
import { formatDateTime } from "../../utils/roles";
import '../../styles/ResidentPages.css'

export default function ResidentView(){
    const { user, errands, announcements, unreadCount } = useApp();
    const myErrands = errands.filter(e => e.userId === user.id);
    const openErrands = myErrands.filter(e => e.status === 'pending' || e.status === 'progress').length;

    return <>
    <ResidentGreeting/>
    <section className="card-grid">
        <ViewCard label="Mina ärenden" value={openErrands}/>
        <ViewCard label="Olästa notiser" value={unreadCount}/>
    </section>

    <section className="panel">
        <h2>Meddelanden från styrelsen</h2>
        {announcements.length === 0
            ? <p className="empty-state">Inga meddelanden just nu.</p>
            : <ul className="announcement-list">
                {announcements.map(a => (
                    <li key={a.id}>
                        <div className="row-title">{a.title}</div>
                        <div className="row-meta">{a.authorName} · {formatDateTime(a.createdAt)}</div>
                        <p className="review-description">{a.text}</p>
                    </li>
                ))}
            </ul>
        }
    </section>
    </>
}
