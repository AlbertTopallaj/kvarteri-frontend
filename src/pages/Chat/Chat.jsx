import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { publishChat } from '../../api/chat';
import ChatRoom from '../../components/Chat/ChatRoom';
import '../../styles/ResidentPages.css'
import './Chat.css'

export default function Chat(){
    const { user } = useApp();
    const [tab, setTab] = useState('group');
    const assocId = user.association?.id;

    return <>
    <header className="page-header">
        <h1>Chatt</h1>
        <p>Prata med grannar i föreningen eller skriv privat till styrelsen.</p>
    </header>

    <div className="chip-row" style={{ marginBottom: 16 }}>
        <button type="button" className={`chip ${tab === 'group' ? 'selected' : ''}`} onClick={() => setTab('group')}>Föreningen</button>
        <button type="button" className={`chip ${tab === 'board' ? 'selected' : ''}`} onClick={() => setTab('board')}>Styrelsen</button>
    </div>

    {tab === 'group' ? (
        <ChatRoom
            destination={`/topic/assoc.${assocId}.group`}
            loadHistory={() => api('/chat/group')}
            onSend={(content) => publishChat('/app/chat.group', { content })}
            meId={user.id}
            showSenders
            emptyText="Inga meddelanden i föreningen än. Skriv något!"
        />
    ) : (
        <ChatRoom
            destination={`/topic/assoc.${assocId}.direct.${user.id}`}
            loadHistory={() => api(`/chat/direct/${user.id}`)}
            onSend={(content) => publishChat('/app/chat.direct', { content })}
            meId={user.id}
            placeholder="Skriv till styrelsen…"
            emptyText="Skriv ett privat meddelande till styrelsen."
        />
    )}
    </>
}
