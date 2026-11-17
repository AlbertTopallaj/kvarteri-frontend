import { useState } from 'react';
import '../../styles/ResidentPages.css'
import { useToast } from '../../components/Toast/ToastProvider';
import './Booking.css'

const TYPES = {
    laundry: { label: 'Tvättstuga', slots: ['07:00–10:00', '10:00–13:00', '13:00–16:00', '16:00–19:00', '19:00–22:00'], taken: ['10:00–13:00'] },
    property: { label: 'Gemensamhetslokal', slots: ['09:00–13:00', '13:00–17:00', '17:00–23:00'], taken: [] },
};

function nextDays(count){
    return Array.from({ length: count }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            key: d.toISOString().slice(0, 10),
            label: d.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' }),
        };
    });
}

export default function Booking(){
    const toast = useToast();
    const days = nextDays(7);
    const [type, setType] = useState('laundry');
    const [day, setDay] = useState(days[0].key);
    const [slot, setSlot] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const current = TYPES[type];

    function changeType(key){
        setType(key);
        setSlot(null);
        setConfirmation(null);
    }

    function book(){
        const dayLabel = days.find(d => d.key === day).label;
        const message = `${current.label} bokad ${dayLabel}, ${slot}.`;
        setConfirmation(message);
        toast.success(message);
        setSlot(null);
    }

    return <>
    <header className="page-header">
        <h1>Boka</h1>
        <p>Boka tvättstuga eller gemensamhetslokal. Parkering och garage hyrs tillsvidare under Parkering.</p>
    </header>

    <section className="panel booking-panel">
        <div className="booking-step">
            <h2>1. Vad vill du boka?</h2>
            <div className="chip-row">
                {Object.entries(TYPES).map(([key, t]) => (
                    <button
                        key={key}
                        type="button"
                        className={`chip ${type === key ? 'selected' : ''}`}
                        onClick={() => changeType(key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="booking-step">
            <h2>2. Välj dag</h2>
            <div className="chip-row">
                {days.map(d => (
                    <button
                        key={d.key}
                        type="button"
                        className={`chip ${day === d.key ? 'selected' : ''}`}
                        onClick={() => { setDay(d.key); setSlot(null); setConfirmation(null); }}
                    >
                        {d.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="booking-step">
            <h2>3. Välj tid</h2>
            <div className="chip-row">
                {current.slots.map(s => (
                    <button
                        key={s}
                        type="button"
                        disabled={current.taken.includes(s)}
                        className={`chip ${slot === s ? 'selected' : ''}`}
                        onClick={() => { setSlot(s); setConfirmation(null); }}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        {confirmation && <p className="success-note">{confirmation}</p>}

        <div>
            <button type="button" className="btn" disabled={!slot} onClick={book}>
                Boka
            </button>
        </div>
    </section>
    </>
}
