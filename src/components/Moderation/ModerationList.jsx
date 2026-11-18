import { useState } from 'react';
import { History, TriangleAlert, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLE_LABELS, formatDateTime } from '../../utils/roles';
import '../../styles/ResidentPages.css'

// Styrelsen får bara moderera boende; administratören får moderera alla.
function canModerate(me, target){
    if (target.id === me.id) return false;
    return me.role === 'admin' || (me.role === 'board' && target.role === 'resident');
}

function ModerationRow({ target, showAssociation }){
    const { user, removeUser, warnUser, fetchWarnings } = useApp();
    const [mode, setMode] = useState(null); // 'warn' | 'history' | 'delete'
    const [reason, setReason] = useState('');
    const [history, setHistory] = useState(null);
    const allowed = canModerate(user, target);

    async function submitWarning(e){
        e.preventDefault();
        if (!await warnUser(target.id, reason)) return;
        setReason('');
        setMode(null);
        setHistory(null);
    }

    async function toggleHistory(){
        if (mode === 'history'){
            setMode(null);
            return;
        }
        setMode('history');
        setHistory(await fetchWarnings(target.id));
    }

    return (
        <li className="review-item">
            <div className="review-body">
                <div className="row-title">{target.name}</div>
                <div className="row-meta">
                    {target.email}{target.email && target.apartment && ' · '}
                    {target.apartment && `Lgh ${target.apartment}`}
                    {showAssociation && target.association && ` · ${target.association.name}`}
                </div>

                {mode === 'warn' && (
                    <form className="stack" onSubmit={submitWarning} style={{ marginTop: 12 }}>
                        <div className="field">
                            <label htmlFor={`warn-${target.id}`}>Anledning till varning</label>
                            <textarea
                                id={`warn-${target.id}`}
                                value={reason}
                                maxLength={1000}
                                onChange={e => setReason(e.target.value)}
                                placeholder="T.ex. störande ljud efter kl. 22"
                                required
                            />
                        </div>
                        <div className="row-actions">
                            <button type="submit" className="btn sm">Skicka varning</button>
                            <button type="button" className="btn sm secondary" onClick={() => setMode(null)}>Avbryt</button>
                        </div>
                    </form>
                )}

                {mode === 'history' && (
                    history === null
                        ? <p className="row-meta">Hämtar…</p>
                        : history.length === 0
                            ? <p className="row-meta">Inga varningar.</p>
                            : <ul className="row-list" style={{ marginTop: 8 }}>
                                {history.map(w => (
                                    <li key={w.id}>
                                        <div>
                                            <div className="row-meta">{w.issuedBy} · {formatDateTime(w.createdAt)}</div>
                                            <p className="review-description">{w.reason}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                )}
            </div>

            <div className="review-side">
                <span className={`badge role-${target.role}`}>{ROLE_LABELS[target.role]}</span>
                {allowed && (
                    mode === 'delete'
                        ? <div className="row-actions">
                            <button type="button" className="btn sm danger" onClick={() => { removeUser(target.id); setMode(null); }}>
                                Bekräfta borttagning
                            </button>
                            <button type="button" className="btn sm secondary" onClick={() => setMode(null)}>Avbryt</button>
                        </div>
                        : <div className="row-actions">
                            <button type="button" className="btn sm secondary" onClick={toggleHistory} title="Visa varningar">
                                <History size={14}/>
                            </button>
                            <button type="button" className="btn sm secondary" onClick={() => setMode('warn')}>
                                <TriangleAlert size={14}/> Varna
                            </button>
                            <button
                                type="button"
                                className="btn sm secondary icon-only"
                                aria-label={`Ta bort ${target.name}`}
                                onClick={() => setMode('delete')}
                            >
                                <Trash2 size={14}/>
                            </button>
                        </div>
                )}
            </div>
        </li>
    );
}

export default function ModerationList({ users, showAssociation = false }){
    return users.length === 0
        ? <p className="empty-state">Inga användare.</p>
        : <ul className="row-list">
            {users.map(u => <ModerationRow key={u.id} target={u} showAssociation={showAssociation}/>)}
        </ul>;
}
