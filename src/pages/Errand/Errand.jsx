import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STATUS_LABELS, formatDate } from '../../utils/roles';
import '../../styles/ResidentPages.css'

const FILTERS = [
    { key: 'all', label: 'Alla' },
    { key: 'pending', label: 'Väntar' },
    { key: 'progress', label: 'Pågår' },
    { key: 'done', label: 'Klara' },
    { key: 'rejected', label: 'Avslagna' },
];

export default function Errand(){
    const { user, errands, addErrand } = useApp();
    const [filter, setFilter] = useState('all');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const mine = errands.filter(e => e.userId === user.id);
    const visible = mine.filter(e => filter === 'all' || e.status === filter);

    async function submit(e){
        e.preventDefault();
        if (!await addErrand({ title, description, kind: 'errand' })) return;
        setTitle('');
        setDescription('');
    }

    return <>
    <header className="page-header">
        <h1>Mina ärenden</h1>
        <p>Skicka in ärenden till styrelsen och följ status.</p>
    </header>

    <section className="panel">
        <h2>Nytt ärende</h2>
        <form className="stack" onSubmit={submit}>
            <div className="field">
                <label htmlFor="errand-title">Rubrik</label>
                <input id="errand-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Vad gäller ärendet?" required/>
            </div>
            <div className="field">
                <label htmlFor="errand-desc">Beskrivning</label>
                <textarea id="errand-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Beskriv ärendet"/>
            </div>
            <div>
                <button type="submit" className="btn">Skicka ärende</button>
            </div>
        </form>
    </section>

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
                </button>
            ))}
        </div>

        {visible.length === 0
            ? <p className="empty-state">Inga ärenden att visa.</p>
            : <ul className="row-list">
                {visible.map(e => (
                    <li key={e.id}>
                        <div>
                            <div className="row-title">{e.title}</div>
                            <div className="row-meta">Inskickat {formatDate(e.createdAt)}</div>
                        </div>
                        <span className={`badge ${e.status}`}>{STATUS_LABELS[e.status]}</span>
                    </li>
                ))}
            </ul>
        }
    </section>
    </>
}
