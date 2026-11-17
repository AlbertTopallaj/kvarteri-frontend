import { useState } from 'react';
import '../../styles/ResidentPages.css'
import './Incident.css'

const CATEGORIES = ['El', 'Vatten och avlopp', 'Värme', 'Hiss', 'Lås och dörrar', 'Annat'];

export default function Incident(){
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [reports, setReports] = useState([
        { id: 1, category: 'Hiss', location: 'Trapphus B', status: 'progress', date: '2026-11-10' },
    ]);
    const [sent, setSent] = useState(false);

    function submit(e){
        e.preventDefault();
        setReports(prev => [
            { id: Date.now(), category, location, status: 'pending', date: new Date().toISOString().slice(0, 10) },
            ...prev,
        ]);
        setLocation('');
        setDescription('');
        setSent(true);
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
                    onChange={e => { setDescription(e.target.value); setSent(false); }}
                    placeholder="Beskriv felet så noggrant du kan"
                    required
                />
            </div>
            {sent && <p className="success-note">Tack! Din felanmälan är skickad.</p>}
            <div>
                <button type="submit" className="btn">Skicka felanmälan</button>
            </div>
        </form>
    </section>

    <section className="panel">
        <h2>Tidigare anmälningar</h2>
        <ul className="row-list">
            {reports.map(r => (
                <li key={r.id}>
                    <div>
                        <div className="row-title">{r.category}</div>
                        <div className="row-meta">{r.location} · {r.date}</div>
                    </div>
                    <span className={`badge ${r.status}`}>{r.status === 'pending' ? 'Mottagen' : 'Pågår'}</span>
                </li>
            ))}
        </ul>
    </section>
    </>
}
