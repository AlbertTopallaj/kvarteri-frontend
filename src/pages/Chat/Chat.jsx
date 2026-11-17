import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import '../../styles/ResidentPages.css'
import './Chat.css'

const now = () => new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

export default function Chat(){
    const [messages, setMessages] = useState([
        { id: 1, from: 'them', text: 'Hej! Hur kan vi hjälpa dig?', time: '09:12' },
    ]);
    const [text, setText] = useState('');

    function send(e){
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: trimmed, time: now() }]);
        setText('');
    }

    return <>
    <header className="page-header">
        <h1>Chatt</h1>
        <p>Skriv till din fastighetsförvaltare.</p>
    </header>

    <section className="panel chat-panel">
        <div className="chat-messages">
            {messages.map(m => (
                <div key={m.id} className={`chat-bubble ${m.from}`}>
                    <span>{m.text}</span>
                    <time>{m.time}</time>
                </div>
            ))}
        </div>
        <form className="chat-form" onSubmit={send}>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Skriv ett meddelande…"
                aria-label="Meddelande"
            />
            <button type="submit" className="btn" aria-label="Skicka" disabled={!text.trim()}>
                <SendHorizontal size={16}/>
            </button>
        </form>
    </section>
    </>
}
