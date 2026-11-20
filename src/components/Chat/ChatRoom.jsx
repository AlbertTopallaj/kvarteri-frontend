import { useEffect, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { subscribeChat } from '../../api/chat';

const time = (iso) => {
    try {
        return new Date(iso).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
};

/**
 * One chat thread: loads history once, then appends live messages from its STOMP topic.
 * Resetting `destination` switches thread (reloads history, re-subscribes).
 */
export default function ChatRoom({ destination, loadHistory, onSend, meId, showSenders = false,
                                   placeholder = 'Skriv ett meddelande…', emptyText = 'Inga meddelanden än.' }){
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        let active = true;
        setMessages([]);
        loadHistory().then(list => { if (active) setMessages(list ?? []); }).catch(() => {});
        const unsub = subscribeChat(destination, (msg) => {
            if (!active) return;
            setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
        });
        return () => { active = false; unsub(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destination]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    function send(e){
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText('');
    }

    return <section className="panel chat-panel">
        <div className="chat-messages">
            {messages.length === 0 && <p className="chat-empty">{emptyText}</p>}
            {messages.map(m => (
                <div key={m.id} className={`chat-bubble ${m.senderId === meId ? 'me' : 'them'}`}>
                    {showSenders && m.senderId !== meId && <span className="chat-sender">{m.senderName}</span>}
                    <span>{m.content}</span>
                    <time>{time(m.createdAt)}</time>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
        <form className="chat-form" onSubmit={send}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} aria-label="Meddelande" />
            <button type="submit" className="btn" aria-label="Skicka" disabled={!text.trim()}>
                <SendHorizontal size={16}/>
            </button>
        </form>
    </section>;
}
