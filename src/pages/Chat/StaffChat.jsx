import { useState } from 'react';
import StaffLayout from '../../components/StaffLayout/StaffLayout';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { publishChat } from '../../api/chat';
import ChatRoom from '../../components/Chat/ChatRoom';
import '../../styles/ResidentPages.css'
import './Chat.css'

export default function StaffChat(){
    const { user, users } = useApp();
    const [tab, setTab] = useState('group');
    const [selected, setSelected] = useState(null);
    const assocId = user.association?.id;
    const residents = users.filter(u => u.role === 'resident');

    return <StaffLayout>
        <header className="page-header">
            <h1>Chatt</h1>
            <p>Föreningschatt och privata trådar med boende.</p>
        </header>

        <div className="chip-row" style={{ marginBottom: 16 }}>
            <button type="button" className={`chip ${tab === 'group' ? 'selected' : ''}`} onClick={() => setTab('group')}>Föreningen</button>
            <button type="button" className={`chip ${tab === 'direct' ? 'selected' : ''}`} onClick={() => setTab('direct')}>Boende</button>
        </div>

        {tab === 'group' ? (
            <ChatRoom
                destination={`/topic/assoc.${assocId}.group`}
                loadHistory={() => api('/chat/group')}
                onSend={(content) => publishChat('/app/chat.group', { content })}
                meId={user.id}
                showSenders
                emptyText="Inga meddelanden i föreningen än."
            />
        ) : (
            <div className="chat-staff">
                <aside className="chat-staff-list">
                    {residents.length === 0 && <p className="chat-empty">Inga boende att visa.</p>}
                    {residents.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            className={`chat-staff-item ${selected?.id === r.id ? 'selected' : ''}`}
                            onClick={() => setSelected(r)}
                        >
                            <strong>{r.name}</strong>
                            {r.apartment && <span>Lgh {r.apartment}</span>}
                        </button>
                    ))}
                </aside>
                <div className="chat-staff-thread">
                    {selected ? (
                        <ChatRoom
                            destination={`/topic/assoc.${assocId}.direct.${selected.id}`}
                            loadHistory={() => api(`/chat/direct/${selected.id}`)}
                            onSend={(content) => publishChat('/app/chat.direct', { content, residentId: selected.id })}
                            meId={user.id}
                            placeholder={`Svara ${selected.name}…`}
                            emptyText={`Ingen konversation med ${selected.name} än.`}
                        />
                    ) : (
                        <section className="panel chat-panel chat-staff-empty">
                            <p className="chat-empty">Välj en boende för att läsa och svara i den privata tråden.</p>
                        </section>
                    )}
                </div>
            </div>
        )}
    </StaffLayout>
}
