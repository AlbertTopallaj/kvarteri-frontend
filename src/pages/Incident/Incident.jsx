import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STATUS_LABELS, formatDate } from '../../utils/roles';
import '../../styles/ResidentPages.css'
import './Incident.css'

const CATEGORIES = ['El', 'Vatten och avlopp', 'Värme', 'Hiss', 'Lås och dörrar', 'Annat'];

export default function Incident(){
    const { user, errands, addErrand } = useApp();
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const reports = errands.filter(e => e.userId === user.id && e.kind === 'incident');

    async function submit(e){
        e.preventDefault();
        if (!await addErrand({ title: `${category}: ${location}`, description, kind: 'incident' })) return;
        setLocation('');
        setDescription('');
    }

    return <>
    <header className="page-header">
        <h1>Felanmälan</h1>
        <p>Anmäl fel i din lägenhet eller i fastigheten.</p>
    </header>

    <section className="panel">
        <h2>Ny felanmälan</h2>
        <form className="incident-form" onSubmit={submit}>
            <div className="incident-row">
                <div className="field">
                    <label htmlFor="category">Kategori</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="location">Plats</label>
                    <input
                        id="location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="T.ex. Badrum, trapphus A"
                        required
                    />
                </div>
            </div>
            <div className="field">
                <label htmlFor="description">Beskrivning</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Beskriv felet så noggrant du kan"
                    required
                />
            </div>
            <div>
                <button type="submit" className="btn">Skicka felanmälan</button>
            </div>
        </form>
    </section>

    <section className="panel">
        <h2>Tidigare anmälningar</h2>
        {reports.length === 0
            ? <p className="empty-state">Du har inte gjort några felanmälningar.</p>
            : <ul className="row-list">
                {reports.map(r => (
                    <li key={r.id}>
                        <div>
                            <div className="row-title">{r.title}</div>
                            <div className="row-meta">{formatDate(r.createdAt)}</div>
                        </div>
                        <span className={`badge ${r.status}`}>{STATUS_LABELS[r.status]}</span>
                    </li>
                ))}
            </ul>
        }
    </section>
    </>
}
