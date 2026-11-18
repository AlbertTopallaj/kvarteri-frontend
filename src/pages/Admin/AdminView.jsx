import { useState } from 'react';
import { Building2, UserPlus } from 'lucide-react';
import StaffLayout from '../../components/StaffLayout/StaffLayout';
import ModerationList from '../../components/Moderation/ModerationList';
import { useApp } from '../../context/AppContext';
import '../../styles/ResidentPages.css'

const EMPTY_FORM = { name: '', email: '', password: '', role: 'resident', apartment: '', associationId: '' };

export default function AdminView(){
    const { user, users, associations, addUser, addAssociation } = useApp();
    const [form, setForm] = useState(EMPTY_FORM);
    const [assocName, setAssocName] = useState('');
    const [filter, setFilter] = useState('all');

    const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
    const visible = filter === 'all' ? users : users.filter(u => u.association?.id === filter);

    async function submit(e){
        e.preventDefault();
        if (await addUser(form)) setForm({ ...EMPTY_FORM, associationId: form.associationId });
    }

    async function submitAssociation(e){
        e.preventDefault();
        if (await addAssociation(assocName)) setAssocName('');
    }

    return <>
    <StaffLayout>
        <header className="page-header">
            <h1>Administration</h1>
            <p>Hantera föreningar och användare.</p>
        </header>

        <section className="panel">
            <h2>Föreningar ({associations.length})</h2>
            <form className="form-grid" onSubmit={submitAssociation}>
                <div className="field">
                    <label htmlFor="assoc-name">Ny förening</label>
                    <input id="assoc-name" value={assocName} onChange={e => setAssocName(e.target.value)} placeholder="T.ex. Brf Solgläntan" maxLength={100} required/>
                </div>
                <div className="field" style={{ justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn">
                        <Building2 size={16}/>
                        Skapa förening
                    </button>
                </div>
            </form>
        </section>

        <section className="panel">
            <h2>Ny användare</h2>
            <form className="stack" onSubmit={submit}>
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="name">Namn</label>
                        <input id="name" value={form.name} onChange={set('name')} placeholder="För- och efternamn" required/>
                    </div>
                    <div className="field">
                        <label htmlFor="email">E-post (användarnamn)</label>
                        <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="t.ex. anna@exempel.se" required/>
                    </div>
                    <div className="field">
                        <label htmlFor="password">Lösenord (minst 10 tecken)</label>
                        <input id="password" type="password" autoComplete="new-password" minLength={10} value={form.password} onChange={set('password')} required/>
                    </div>
                    <div className="field">
                        <label htmlFor="role">Roll</label>
                        <select id="role" value={form.role} onChange={set('role')}>
                            <option value="resident">Boende</option>
                            <option value="board">Styrelse</option>
                            <option value="admin">Administratör</option>
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="association">Förening</label>
                        <select id="association" value={form.associationId} onChange={set('associationId')}>
                            <option value="">Min förening{user.association ? ` (${user.association.name})` : ''}</option>
                            {associations.filter(a => a.id !== user.association?.id).map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="apartment">Lägenhet (valfritt)</label>
                        <input id="apartment" value={form.apartment} onChange={set('apartment')} placeholder="t.ex. 1203"/>
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn">
                        <UserPlus size={16}/>
                        Lägg till användare
                    </button>
                </div>
            </form>
        </section>

        <section className="panel">
            <h2>Användare ({visible.length})</h2>
            <div className="chip-row" style={{ marginBottom: 20 }}>
                <button type="button" className={`chip ${filter === 'all' ? 'selected' : ''}`} onClick={() => setFilter('all')}>
                    Alla föreningar
                </button>
                {associations.map(a => (
                    <button key={a.id} type="button" className={`chip ${filter === a.id ? 'selected' : ''}`} onClick={() => setFilter(a.id)}>
                        {a.name}
                    </button>
                ))}
            </div>
            <ModerationList users={visible} showAssociation/>
        </section>
    </StaffLayout>
    </>
}
