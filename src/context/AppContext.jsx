import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../components/Toast/ToastProvider';
import { STATUS_LABELS } from '../utils/roles';
import { playPing } from '../utils/sound';

/*
 * Klientbaserad datalagring i väntan på ett riktigt API.
 * - Data (användare, ärenden, meddelanden, notiser) sparas i localStorage
 *   och synkas mellan flikar via "storage"-eventet.
 * - Inloggad användare sparas i sessionStorage (en per flik).
 * OBS: ingen riktig autentisering – lösenord kontrolleras inte.
 */

const DATA_KEY = 'kvarteri-data';
const SESSION_KEY = 'kvarteri-session';

const AppContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function seed(){
    return {
        users: [
            { id: 'u-admin', name: 'Utvecklare', username: 'admin', role: 'admin', apartment: '' },
            { id: 'u-board', name: 'Sara Styrelse', username: 'styrelse', role: 'board', apartment: '1102' },
            { id: 'u-albert', name: 'Albert', username: 'albert', role: 'resident', apartment: '1101' },
        ],
        errands: [
            { id: 'e-1', title: 'Trasig lampa i trapphuset', description: 'Lampan på plan 3 lyser inte.', kind: 'incident', userId: 'u-albert', createdAt: '2026-11-12T09:00:00', status: 'progress' },
            { id: 'e-2', title: 'Fråga om andrahandsuthyrning', description: '', kind: 'errand', userId: 'u-albert', createdAt: '2026-11-03T14:30:00', status: 'pending' },
            { id: 'e-3', title: 'Byte av cylinder i ytterdörr', description: '', kind: 'errand', userId: 'u-albert', createdAt: '2026-10-21T10:15:00', status: 'done' },
        ],
        announcements: [
            { id: 'a-1', title: 'Välkommen till Kvarteri', text: 'Här publicerar styrelsen information till de boende.', authorName: 'Sara Styrelse', createdAt: '2026-11-01T08:00:00' },
        ],
        notifications: [],
        // Parkeringar och garage hyrs tillsvidare (bokas inte). renterId = null betyder ledig.
        parkingSpots: [
            { id: 'p-1', kind: 'parking', name: 'Parkering 1', price: 450, renterId: 'u-board', queue: [] },
            { id: 'p-2', kind: 'parking', name: 'Parkering 2', price: 450, renterId: null, queue: [] },
            { id: 'p-3', kind: 'parking', name: 'Parkering 3', price: 450, renterId: 'u-albert', queue: ['u-board'] },
            { id: 'g-1', kind: 'garage', name: 'Garage 1', price: 900, renterId: 'u-board', queue: ['u-albert'] },
            { id: 'g-2', kind: 'garage', name: 'Garage 2', price: 900, renterId: null, queue: [] },
        ],
    };
}

function loadData(){
    try {
        const raw = localStorage.getItem(DATA_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Data sparad före parkeringsfunktionen saknar parkingSpots.
            return { ...parsed, parkingSpots: parsed.parkingSpots ?? seed().parkingSpots };
        }
    } catch { /* ignorera */ }
    return seed();
}

function saveData(data){
    try {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch { /* ignorera */ }
}

function loadSession(){
    try {
        return sessionStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
}

function isVisibleTo(notification, user){
    if (!user) return false;
    return notification.toUserId === user.id || (notification.toRole && notification.toRole === user.role);
}

export function AppProvider({ children }){
    const toast = useToast();
    const [data, setData] = useState(loadData);
    const [sessionId, setSessionId] = useState(loadSession);
    const dataRef = useRef(data);
    const sessionRef = useRef(sessionId);

    const user = useMemo(
        () => data.users.find(u => u.id === sessionId) ?? null,
        [data.users, sessionId]
    );

    function update(fn){
        const next = fn(dataRef.current);
        dataRef.current = next;
        saveData(next);
        setData(next);
    }

    function addNotification(target, text){
        return { id: makeId('n'), text, createdAt: new Date().toISOString(), readBy: [], ...target };
    }

    // Synka ändringar som görs i andra flikar och visa toast för nya notiser.
    useEffect(() => {
        function onStorage(e){
            if (e.key !== DATA_KEY || !e.newValue) return;
            let next;
            try {
                next = JSON.parse(e.newValue);
            } catch {
                return;
            }
            const me = next.users.find(u => u.id === sessionRef.current);
            const known = new Set(dataRef.current.notifications.map(n => n.id));
            const fresh = next.notifications.filter(n => !known.has(n.id) && isVisibleTo(n, me));
            if (fresh.length > 0) playPing();
            fresh.slice(0, 3).forEach(n => toast.info(n.text));
            dataRef.current = next;
            setData(next);
        }
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [toast]);

    function setSession(id){
        sessionRef.current = id;
        setSessionId(id);
        try {
            if (id) sessionStorage.setItem(SESSION_KEY, id);
            else sessionStorage.removeItem(SESSION_KEY);
        } catch { /* ignorera */ }
    }

    function login(username){
        const found = dataRef.current.users.find(
            u => u.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (!found){
            toast.error('Fel användarnamn eller lösenord.');
            return null;
        }
        setSession(found.id);
        toast.success(`Välkommen, ${found.name}`);
        return found;
    }

    function logout(){
        setSession(null);
        toast.info('Du har loggats ut.');
    }

    function addUser({ name, username, role, apartment }){
        const cleanUsername = username.trim().toLowerCase();
        if (dataRef.current.users.some(u => u.username.toLowerCase() === cleanUsername)){
            toast.error(`Användarnamnet "${cleanUsername}" är redan taget.`);
            return false;
        }
        const newUser = { id: makeId('u'), name: name.trim(), username: cleanUsername, role, apartment: apartment.trim() };
        update(d => ({ ...d, users: [...d.users, newUser] }));
        toast.success(`${newUser.name} har lagts till som ${role === 'admin' ? 'administratör' : role === 'board' ? 'styrelsemedlem' : 'boende'}.`);
        return true;
    }

    function removeUser(id){
        const target = dataRef.current.users.find(u => u.id === id);
        if (!target) return;
        update(d => ({ ...d, users: d.users.filter(u => u.id !== id) }));
        toast.success(`${target.name} har tagits bort.`);
    }

    function deleteAccount(){
        if (!user) return;
        update(d => ({ ...d, users: d.users.filter(u => u.id !== user.id) }));
        setSession(null);
        toast.info('Ditt konto har raderats.');
    }

    function addErrand({ title, description, kind }){
        const errand = {
            id: makeId('e'),
            title: title.trim(),
            description: description.trim(),
            kind,
            userId: user.id,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        const label = kind === 'incident' ? 'felanmälan' : 'ärende';
        update(d => ({
            ...d,
            errands: [errand, ...d.errands],
            notifications: [
                addNotification({ toRole: 'board' }, `Ny ${label} från ${user.name}: ${errand.title}`),
                ...d.notifications,
            ],
        }));
        toast.success(kind === 'incident' ? 'Din felanmälan är skickad.' : 'Ditt ärende är skickat.');
    }

    function setErrandStatus(id, status){
        const errand = dataRef.current.errands.find(e => e.id === id);
        if (!errand) return;
        update(d => ({
            ...d,
            errands: d.errands.map(e => e.id === id ? { ...e, status } : e),
            notifications: [
                addNotification({ toUserId: errand.userId }, `Ditt ärende "${errand.title}" har status: ${STATUS_LABELS[status]}`),
                ...d.notifications,
            ],
        }));
        toast.success(`Ärendet markerades som ${STATUS_LABELS[status].toLowerCase()}.`);
    }

    function postAnnouncement({ title, text }){
        const announcement = {
            id: makeId('a'),
            title: title.trim(),
            text: text.trim(),
            authorName: user.name,
            createdAt: new Date().toISOString(),
        };
        update(d => ({
            ...d,
            announcements: [announcement, ...d.announcements],
            notifications: [
                addNotification({ toRole: 'resident' }, `Nytt meddelande från styrelsen: ${announcement.title}`),
                ...d.notifications,
            ],
        }));
        toast.success('Meddelandet är publicerat.');
    }

    function joinQueue(spotId){
        if (!user) return;
        const spot = dataRef.current.parkingSpots.find(s => s.id === spotId);
        if (!spot || spot.renterId === user.id || spot.queue.includes(user.id)) return;
        update(d => ({
            ...d,
            parkingSpots: d.parkingSpots.map(s => s.id === spotId ? { ...s, queue: [...s.queue, user.id] } : s),
        }));
        toast.success(`Du står nu i kö till ${spot.name}.`);
    }

    function leaveQueue(spotId){
        if (!user) return;
        const spot = dataRef.current.parkingSpots.find(s => s.id === spotId);
        if (!spot) return;
        update(d => ({
            ...d,
            parkingSpots: d.parkingSpots.map(s => s.id === spotId ? { ...s, queue: s.queue.filter(id => id !== user.id) } : s),
        }));
        toast.info(`Du har lämnat kön till ${spot.name}.`);
    }

    // Styrelsens hantering av hyresplatser.
    function assignSpot(spotId, userId){
        const spot = dataRef.current.parkingSpots.find(s => s.id === spotId);
        const renter = dataRef.current.users.find(u => u.id === userId);
        if (!spot || !renter) return;
        update(d => ({
            ...d,
            parkingSpots: d.parkingSpots.map(s => s.id === spotId
                ? { ...s, renterId: userId, queue: s.queue.filter(id => id !== userId) }
                : s),
            notifications: [
                addNotification({ toUserId: userId }, `Du har fått ${spot.name} (${spot.price} kr/mån).`),
                ...d.notifications,
            ],
        }));
        toast.success(`${spot.name} har hyrts ut till ${renter.name}.`);
    }

    function terminateSpot(spotId){
        const spot = dataRef.current.parkingSpots.find(s => s.id === spotId);
        if (!spot || !spot.renterId) return;
        const validQueue = spot.queue.filter(id => dataRef.current.users.some(u => u.id === id));
        const notes = [];
        if (spot.renterId && dataRef.current.users.some(u => u.id === spot.renterId)){
            notes.push(addNotification({ toUserId: spot.renterId }, `Ditt hyresavtal för ${spot.name} har sagts upp.`));
        }
        if (validQueue[0]){
            notes.push(addNotification({ toUserId: validQueue[0] }, `${spot.name} är nu ledig – du står först i kön!`));
        }
        update(d => ({
            ...d,
            parkingSpots: d.parkingSpots.map(s => s.id === spotId ? { ...s, renterId: null } : s),
            notifications: [...notes, ...d.notifications],
        }));
        toast.success(`${spot.name} är nu ledig.`);
    }

    function setSpotPrice(spotId, price){
        const value = Number(price);
        if (!Number.isFinite(value) || value < 0) return;
        update(d => ({
            ...d,
            parkingSpots: d.parkingSpots.map(s => s.id === spotId ? { ...s, price: value } : s),
        }));
    }

    function addSpot({ kind, name, price }){
        const cleanName = name.trim();
        if (!cleanName) return false;
        const spot = { id: makeId('p'), kind, name: cleanName, price: Number(price) || 0, renterId: null, queue: [] };
        update(d => ({ ...d, parkingSpots: [...d.parkingSpots, spot] }));
        toast.success(`${spot.name} har lagts till.`);
        return true;
    }

    function removeSpot(spotId){
        const spot = dataRef.current.parkingSpots.find(s => s.id === spotId);
        if (!spot) return;
        update(d => ({ ...d, parkingSpots: d.parkingSpots.filter(s => s.id !== spotId) }));
        toast.success(`${spot.name} har tagits bort.`);
    }

    function markAllRead(){
        if (!user) return;
        update(d => ({
            ...d,
            notifications: d.notifications.map(n =>
                isVisibleTo(n, user) && !n.readBy.includes(user.id)
                    ? { ...n, readBy: [...n.readBy, user.id] }
                    : n
            ),
        }));
    }

    const notifications = useMemo(
        () => data.notifications
            .filter(n => isVisibleTo(n, user))
            .map(n => ({ ...n, read: n.readBy.includes(user.id) })),
        [data.notifications, user]
    );
    const unreadCount = notifications.filter(n => !n.read).length;

    const value = {
        user,
        users: data.users,
        errands: data.errands,
        announcements: data.announcements,
        parkingSpots: data.parkingSpots,
        joinQueue,
        leaveQueue,
        assignSpot,
        terminateSpot,
        setSpotPrice,
        addSpot,
        removeSpot,
        notifications,
        unreadCount,
        login,
        logout,
        addUser,
        removeUser,
        deleteAccount,
        addErrand,
        setErrandStatus,
        postAnnouncement,
        markAllRead,
    };

    return <>
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    </>
}

export function useApp(){
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp måste användas inom AppProvider');
    return ctx;
}
