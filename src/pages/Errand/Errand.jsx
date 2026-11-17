import { useState } from 'react';
import '../../styles/ResidentPages.css'

const STATUS = {
    pending: 'Väntar',
    progress: 'Pågår',
    done: 'Klar',
};

const ERRANDS = [
    { id: 1, title: 'Trasig lampa i trapphuset', date: '2026-11-12', status: 'progress' },
    { id: 2, title: 'Fråga om andrahandsuthyrning', date: '2026-11-03', status: 'pending' },
    { id: 3, title: 'Byte av cylinder i ytterdörr', date: '2026-10-21', status: 'done' },
];

const FILTERS = [
    { key: 'all', label: 'Alla' },
    { key: 'pending', label: 'Väntar' },
    { key: 'progress', label: 'Pågår' },
    { key: 'done', label: 'Klara' },
];

export default function Errand(){
    const [filter, setFilter] = useState('all');
    const visible = ERRANDS.filter(e => filter === 'all' || e.status === filter);

    return <>
    <header className="page-header">
        <h1>Mina ärenden</h1>
        <p>Följ status på dina ärenden.</p>
    </header>

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
                            <div className="row-meta">Inskickat {e.date}</div>
                        </div>
                        <span className={`badge ${e.status}`}>{STATUS[e.status]}</span>
                    </li>
                ))}
            </ul>
        }
    </section>
    </>
}
