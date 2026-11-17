import { useState } from 'react';
import { Send } from 'lucide-react';
import StaffLayout from '../../components/StaffLayout/StaffLayout';
import { useApp } from '../../context/AppContext';
import { STATUS_LABELS, formatDate, formatDateTime } from '../../utils/roles';
import '../../styles/ResidentPages.css'

const FILTERS = [
    { key: 'all', label: 'Alla' },
    { key: 'pending', label: 'Väntar' },
    { key: 'progress', label: 'Pågår' },
    { key: 'done', label: 'Klara' },
    { key: 'rejected', label: 'Avslagna' },
];

// Vilka statusbyten styrelsen kan göra från varje läge.
const ACTIONS = {
    pending: [
        { status: 'progress', label: 'Ta emot' },
        { status: 'rejected', label: 'Avslå', variant: 'danger' },
    ],
    progress: [
        { status: 'done', label: 'Markera klar' },
        { status: 'rejected', label: 'Avslå', variant: 'danger' },
    ],
    done: [{ status: 'pending', label: 'Återöppna', variant: 'secondary' }],
    rejected: [{ status: 'pending', label: 'Återöppna', variant: 'secondary' }],
};

function ErrandReview(){
    const { errands, users, setErrandStatus } = useApp();
    const [filter, setFilter] = useState('all');

    const visible = errands.filter(e => filter === 'all' || e.status === filter);
    const nameOf = (id) => users.find(u => u.id === id);

    return <>
    <section className="panel">
        <div className="chip-row" style={{ marginBottom: 20 }}>
            {FILTERS.map(f => (
                <button
                    key={f.key}
                    type="button"
                    className={`chip ${filter === f.key ? 'selected' : ''}`}
                    onClick={() => setFilter(f.key)}
                >
                    {f.label}
                    {f.key !== 'all' && ` (${errands.filter(e => e.status === f.key).length})`}
                </button>
            ))}
        </div>

        {visible.length === 0
            ? <p className="empty-state">Inga ärenden att granska.</p>
            : <ul className="row-list">
                {visible.map(e => {
                    const author = nameOf(e.userId);
                    return (
                        <li key={e.id} className="review-item">
                            <div className="review-body">
                                <div className="row-title">{e.title}</div>
                                <div className="row-meta">
                                    {e.kind === 'incident' ? 'Felanmälan' : 'Ärende'} · {author ? author.name : 'Borttagen användare'}
                                    {author?.apartment && ` (lgh ${author.apartment})`} · {formatDate(e.createdAt)}
                                </div>
                                {e.description && <p className="review-description">{e.description}</p>}
                            </div>
                            <div className="review-side">
                                <span className={`badge ${e.status}`}>{STATUS_LABELS[e.status]}</span>
                                <div className="row-actions">
                                    {ACTIONS[e.status].map(a => (
                                        <button
                                            key={a.status}
                                            type="button"
                                            className={`btn sm ${a.variant ?? ''}`}
                                            onClick={() => setErrandStatus(e.id, a.status)}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        }
    </section>
    </>
}

function Announcements(){
    const { announcements, postAnnouncement } = useApp();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    function submit(e){
        e.preventDefault();
        postAnnouncement({ title, text });
        setTitle('');
        setText('');
    }

    return <>
    <section className="panel">
        <h2>Nytt meddelande</h2>
        <form className="stack" onSubmit={submit}>
            <div className="field">
                <label htmlFor="ann-title">Rubrik</label>
                <input id="ann-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="T.ex. Stambyte i vår" required/>
            </div>
            <div className="field">
                <label htmlFor="ann-text">Meddelande</label>
                <textarea id="ann-text" value={text} onChange={e => setText(e.target.value)} placeholder="Skriv ett meddelande till de boende" required/>
            </div>
            <div>
                <button type="submit" className="btn">
                    <Send size={16}/>
                    Publicera
                </button>
            </div>
        </form>
    </section>

    <section className="panel">
        <h2>Publicerade meddelanden</h2>
        {announcements.length === 0
            ? <p className="empty-state">Inga meddelanden ännu.</p>
            : <ul className="row-list">
                {announcements.map(a => (
                    <li key={a.id}>
                        <div>
                            <div className="row-title">{a.title}</div>
                            <div className="row-meta">{a.authorName} · {formatDateTime(a.createdAt)}</div>
                            <p className="review-description">{a.text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        }
    </section>
    </>
}

export default function BoardView(){
    const { errands } = useApp();
    const [tab, setTab] = useState('errands');
    const waiting = errands.filter(e => e.status === 'pending').length;

    return <>
    <StaffLayout>
        <header className="page-header">
            <h1>Styrelsen</h1>
            <p>Granska ärenden och skriv meddelanden till de boende.</p>
        </header>

        <div className="chip-row">
            <button type="button" className={`chip ${tab === 'errands' ? 'selected' : ''}`} onClick={() => setTab('errands')}>
                Ärenden{waiting > 0 && ` (${waiting} nya)`}
            </button>
            <button type="button" className={`chip ${tab === 'messages' ? 'selected' : ''}`} onClick={() => setTab('messages')}>
                Meddelanden
            </button>
        </div>

        {tab === 'errands' ? <ErrandReview/> : <Announcements/>}
    </StaffLayout>
    </>
}
