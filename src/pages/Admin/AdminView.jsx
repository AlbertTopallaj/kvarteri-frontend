import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import StaffLayout from '../../components/StaffLayout/StaffLayout';
import { useApp } from '../../context/AppContext';
import { ROLE_LABELS } from '../../utils/roles';
import '../../styles/ResidentPages.css'

const EMPTY_FORM = { name: '', username: '', role: 'resident', apartment: '' };

export default function AdminView(){
    const { user, users, addUser, removeUser } = useApp();
    const [form, setForm] = useState(EMPTY_FORM);
    const [pendingDelete, setPendingDelete] = useState(null);

    const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    function submit(e){
        e.preventDefault();
        if (addUser(form)) setForm(EMPTY_FORM);
    }

    return <>
    <StaffLayout>
        <header className="page-header">
            <h1>Administration</h1>
            <p>Lägg till och hantera användare.</p>
        </header>

        <section className="panel">
            <h2>Ny användare</h2>
            <form className="stack" onSubmit={submit}>
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="name">Namn</label>
                        <input id="name" value={form.name} onChange={set('name')} placeholder="För- och efternamn" required/>
                    </div>
                    <div className="field">
                        <label htmlFor="username">Användarnamn</label>
                        <input id="username" value={form.username} onChange={set('username')} placeholder="t.ex. anna" required/>
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
            <h2>Användare ({users.length})</h2>
            <ul className="row-list">
                {users.map(u => (
                    <li key={u.id}>
                        <div>
                            <div className="row-title">{u.name}</div>
                            <div className="row-meta">
                                @{u.username}{u.apartment && ` · Lgh ${u.apartment}`}
                            </div>
                        </div>
                        <div className="row-actions">
                            <span className={`badge role-${u.role}`}>{ROLE_LABELS[u.role]}</span>
                            {u.id !== user.id && (
                                pendingDelete === u.id
                                    ? <>
                                        <button type="button" className="btn sm danger" onClick={() => { removeUser(u.id); setPendingDelete(null); }}>
                                            Bekräfta
                                        </button>
                                        <button type="button" className="btn sm secondary" onClick={() => setPendingDelete(null)}>
                                            Avbryt
                                        </button>
                                    </>
                                    : <button
                                        type="button"
                                        className="btn sm secondary icon-only"
                                        aria-label={`Ta bort ${u.name}`}
                                        onClick={() => setPendingDelete(u.id)}
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    </StaffLayout>
    </>
}
