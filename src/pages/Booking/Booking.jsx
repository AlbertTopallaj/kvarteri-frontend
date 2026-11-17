import { useCallback, useEffect, useState } from 'react';
import '../../styles/ResidentPages.css'
import { useToast } from '../../components/Toast/ToastProvider';
import { api } from '../../api/client';
import './Booking.css'

const TYPES = {
    laundry: {
        label: 'Tvättstuga',
        plural: 'tvättstugor',
        path: '/laundries',
        slots: ['07:00–10:00', '10:00–13:00', '13:00–16:00', '16:00–19:00', '19:00–22:00'],
    },
    property: {
        label: 'Gemensamhetslokal',
        plural: 'gemensamhetslokaler',
        path: '/communityrooms',
        slots: ['09:00–13:00', '13:00–17:00', '17:00–23:00'],
    },
};

const pad = (n) => String(n).padStart(2, '0');
const localDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function nextDays(count){
    return Array.from({ length: count }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            key: localDate(d),
            label: d.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' }),
        };
    });
}

// '10:00–13:00' på dagen 2026-11-20 -> lokala tider som backend förväntar sig (utan tidszon).
function slotRange(dayKey, slot){
    const [from, to] = slot.split('–');
    return { start: `${dayKey}T${from}:00`, end: `${dayKey}T${to}:00` };
}

// Backend skickar LocalDateTime utan tidszon; jämför som text (ISO-format sorterar korrekt).
const overlaps = (b, range) => b.start < range.end && b.end > range.start;

export default function Booking(){
    const toast = useToast();
    const [days] = useState(() => nextDays(7));
    const [type, setType] = useState('laundry');
    const [day, setDay] = useState(days[0].key);
    const [slot, setSlot] = useState(null);
    const [resources, setResources] = useState([]);
    const [resourceId, setResourceId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const current = TYPES[type];
    const resource = resources.find(r => r.id === resourceId) ?? null;

    // Hämta lokaler/tvättstugor när typen byts.
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setResources([]);
        setResourceId(null);
        setBookings([]);
        api(current.path)
            .then(list => {
                if (cancelled) return;
                setResources(list);
                setResourceId(list[0]?.id ?? null);
            })
            .catch(e => toast.error(e.message))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [current.path, toast]);

    const loadBookings = useCallback(async () => {
        if (!resourceId) return;
        try {
            setBookings(await api(`${current.path}/${resourceId}/bookings`));
        } catch (e) {
            toast.error(e.message);
        }
    }, [current.path, resourceId, toast]);

    useEffect(() => {
        setBookings([]);
        loadBookings();
    }, [loadBookings]);

    function slotState(s){
        const range = slotRange(day, s);
        if (new Date(range.start) <= new Date()) return 'past';
        const hit = bookings.find(b => overlaps(b, range));
        if (!hit) return 'free';
        return hit.mine ? 'mine' : 'taken';
    }

    async function book(){
        setBusy(true);
        try {
            await api(`${current.path}/${resourceId}/bookings`, { method: 'POST', body: slotRange(day, slot) });
            const dayLabel = days.find(d => d.key === day).label;
            toast.success(`${resource.name} bokad ${dayLabel}, ${slot}.`);
            setSlot(null);
        } catch (e) {
            toast.error(e.message);
        }
        await loadBookings();
        setBusy(false);
    }

    async function cancel(id){
        try {
            await api(`/bookings/${id}`, { method: 'DELETE' });
            toast.info('Bokningen är avbokad.');
        } catch (e) {
            toast.error(e.message);
        }
        await loadBookings();
    }

    const mine = bookings.filter(b => b.mine);

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
                        onClick={() => { setType(key); setSlot(null); }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            {resources.length > 1 && (
                <div className="chip-row" style={{ marginTop: 12 }}>
                    {resources.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            className={`chip ${resourceId === r.id ? 'selected' : ''}`}
                            onClick={() => { setResourceId(r.id); setSlot(null); }}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {!loading && resources.length === 0
            ? <p className="empty-state">Det finns inga {current.plural} att boka ännu.</p>
            : <>
            <div className="booking-step">
                <h2>2. Välj dag</h2>
                <div className="chip-row">
                    {days.map(d => (
                        <button
                            key={d.key}
                            type="button"
                            className={`chip ${day === d.key ? 'selected' : ''}`}
                            onClick={() => { setDay(d.key); setSlot(null); }}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="booking-step">
                <h2>3. Välj tid</h2>
                <div className="chip-row">
                    {current.slots.map(s => {
                        const state = slotState(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                disabled={state !== 'free' || !resourceId}
                                className={`chip ${slot === s ? 'selected' : ''}`}
                                onClick={() => setSlot(s)}
                            >
                                {s}{state === 'taken' && ' (upptagen)'}{state === 'mine' && ' (din bokning)'}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <button type="button" className="btn" disabled={!slot || busy} onClick={book}>
                    Boka
                </button>
            </div>
            </>
        }
    </section>

    {mine.length > 0 && (
        <section className="panel">
            <h2>Mina kommande bokningar{resource ? ` – ${resource.name}` : ''}</h2>
            <ul className="row-list">
                {mine.map(b => (
                    <li key={b.id}>
                        <div>
                            <div className="row-title">
                                {new Date(b.start).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <div className="row-meta">{b.start.slice(11, 16)}–{b.end.slice(11, 16)}</div>
                        </div>
                        <button type="button" className="btn sm secondary" onClick={() => cancel(b.id)}>Avboka</button>
                    </li>
                ))}
            </ul>
        </section>
    )}
    </>
}
