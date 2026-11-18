import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../components/Toast/ToastProvider';
import { api, basicToken, setToken, setUnauthorizedHandler } from '../api/client';
import { playPing } from '../utils/sound';

/*
 * Datalagret pratar med Kvarteri-backend (se src/api/client.js).
 * - Inloggning sker med HTTP Basic; uppgifterna sparas i sessionStorage (en per flik).
 * - Datan hämtas efter inloggning och uppdateras var 15:e sekund, när fliken får fokus
 *   och efter varje ändring. Nya notiser visas som toast.
 */

const SESSION_KEY = 'kvarteri-auth';
const POLL_MS = 15000;

const AppContext = createContext(null);

const ROLE_FROM_API = { ADMIN: 'admin', BOARD_MEMBER: 'board', RESIDENT: 'resident' };
const ROLE_TO_API = { admin: 'ADMIN', board: 'BOARD_MEMBER', resident: 'RESIDENT' };
const STATUS_FROM_API = { PENDING: 'pending', IN_PROGRESS: 'progress', DONE: 'done', REJECTED: 'rejected' };
const STATUS_TO_API = { pending: 'PENDING', progress: 'IN_PROGRESS', done: 'DONE', rejected: 'REJECTED' };

const toUser = (u) => ({
    id: u.id,
    name: u.name,
    username: u.email ?? '',
    email: u.email ?? '',
    role: ROLE_FROM_API[u.role] ?? 'resident',
    apartment: u.apartmentNumber ?? '',
    association: u.association ?? null,
});

const toErrand = (t) => ({
    id: t.id,
    title: t.subject,
    description: t.body ?? '',
    kind: t.kind === 'INCIDENT' ? 'incident' : 'errand',
    userId: t.createdBy.id,
    author: { name: t.createdBy.name, apartment: t.createdBy.apartmentNumber ?? '' },
    createdAt: t.createdAt,
    status: STATUS_FROM_API[t.status] ?? 'pending',
});

const toSpot = (s) => ({
    id: s.id,
    kind: s.kind === 'GARAGE' ? 'garage' : 'parking',
    name: s.name,
    price: s.price,
    renterId: s.tenant?.id ?? null,
    renter: s.tenant ? { id: s.tenant.id, name: s.tenant.name, apartment: s.tenant.apartmentNumber ?? '' } : null,
    queue: s.queue.map(q => q.id),
    queueMembers: s.queue,
    myQueuePosition: s.myQueuePosition ?? 0,
    mine: s.mine,
});

const toWarning = (w) => ({ id: w.id, reason: w.reason, issuedBy: w.issuedBy, createdAt: w.createdAt });

const EMPTY = { users: [], errands: [], announcements: [], notifications: [], parkingSpots: [], associations: [], warnings: [] };

function loadToken(){
    try {
        return sessionStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
}

function saveToken(value){
    try {
        if (value) sessionStorage.setItem(SESSION_KEY, value);
        else sessionStorage.removeItem(SESSION_KEY);
    } catch { /* ignorera */ }
}

export function AppProvider({ children }){
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [data, setData] = useState(EMPTY);
    const [ready, setReady] = useState(false);
    const userRef = useRef(null);
    const knownNotes = useRef(null);

    const clearSession = useCallback(() => {
        setToken(null);
        saveToken(null);
        userRef.current = null;
        knownNotes.current = null;
        setUser(null);
        setData(EMPTY);
    }, []);

    // Hämtar allt som den inloggade rollen får se.
    const refresh = useCallback(async () => {
        const me = userRef.current;
        if (!me) return;
        const staff = me.role !== 'resident';
        try {
            const [messages, tickets, notes, spots, users, warnings, associations] = await Promise.all([
                api('/messages'),
                api('/tickets'),
                api('/notifications'),
                api('/parking-spots'),
                me.role === 'admin' ? api('/admin/residents') : staff ? api('/residents') : Promise.resolve([]),
                api('/me/warnings'),
                me.role === 'admin' ? api('/admin/associations') : Promise.resolve([]),
            ]);
            if (userRef.current !== me) return;

            const notifications = notes.map(n => ({ id: n.id, text: n.text, createdAt: n.createdAt, read: n.read }));
            if (knownNotes.current) {
                const fresh = notifications.filter(n => !n.read && !knownNotes.current.has(n.id));
                if (fresh.length > 0) playPing();
                fresh.slice(0, 3).forEach(n => toast.info(n.text));
            }
            knownNotes.current = new Set(notifications.map(n => n.id));

            setData({
                users: users.map(toUser),
                errands: tickets.map(toErrand),
                announcements: messages.filter(m => !m.personal).map(m => ({
                    id: m.id, title: m.title, text: m.body, authorName: m.author, createdAt: m.createdAt,
                })),
                notifications,
                parkingSpots: spots.map(toSpot),
                warnings: warnings.map(toWarning),
                associations,
            });
        } catch {
            // Tillfälligt nätverksfel eller utloggning (hanteras av 401-hanteraren): behåll senaste data.
        }
    }, [toast]);

    const refreshRef = useRef(refresh);
    useEffect(() => { refreshRef.current = refresh; }, [refresh]);

    const startSession = useCallback(async (me) => {
        userRef.current = me;
        knownNotes.current = null;
        setUser(me);
        await refreshRef.current();
    }, []);

    // Återställ en pågående session i den här fliken.
    useEffect(() => {
        setUnauthorizedHandler(() => {
            if (userRef.current) toast.error('Din session har gått ut. Logga in igen.');
            clearSession();
        });
        const saved = loadToken();
        if (!saved){
            setReady(true);
            return;
        }
        setToken(saved);
        api('/me')
            .then(me => startSession(toUser(me)))
            .catch(() => clearSession())
            .finally(() => setReady(true));
    }, [clearSession, startSession, toast]);

    // Uppdatera regelbundet och när fliken får fokus.
    useEffect(() => {
        if (!user) return;
        const timer = setInterval(() => refreshRef.current(), POLL_MS);
        const onFocus = () => refreshRef.current();
        window.addEventListener('focus', onFocus);
        return () => {
            clearInterval(timer);
            window.removeEventListener('focus', onFocus);
        };
    }, [user]);

    // Kör en ändring mot API:t, visar fel som toast och uppdaterar data. Returnerar true om det lyckades.
    async function run(action, successMessage){
        try {
            await action();
        } catch (e) {
            toast.error(e.message);
            if (e.status === 409 || e.status === 404) await refresh();
            return false;
        }
        if (successMessage) toast.success(successMessage);
        await refresh();
        return true;
    }

    async function login(email, password){
        const candidate = basicToken(email.trim(), password);
        setToken(candidate);
        try {
            const me = toUser(await api('/me'));
            saveToken(candidate);
            await startSession(me);
            toast.success(`Välkommen, ${me.name}`);
            return me;
        } catch (e) {
            setToken(null);
            toast.error(e.message);
            return null;
        }
    }

    function logout(){
        clearSession();
        toast.info('Du har loggats ut.');
    }

    function addUser({ name, email, password, role, apartment, associationId }){
        return run(() => api('/admin/residents', {
            method: 'POST',
            body: { name: name.trim(), email: email.trim(), password, role: ROLE_TO_API[role], apartmentNumber: apartment.trim(), associationId: associationId || undefined },
        }), `${name.trim()} har lagts till.`);
    }

    function removeUser(id){
        const target = data.users.find(u => u.id === id);
        const path = user.role === 'admin' ? `/admin/residents/${id}` : `/residents/${id}`;
        return run(() => api(path, { method: 'DELETE' }),
            target ? `${target.name} har tagits bort.` : null);
    }

    function addAssociation(name){
        return run(() => api('/admin/associations', { method: 'POST', body: { name: name.trim() } }),
            `Föreningen ${name.trim()} har skapats.`);
    }

    function warnUser(id, reason){
        const target = data.users.find(u => u.id === id);
        return run(() => api(`/residents/${id}/warnings`, { method: 'POST', body: { reason: reason.trim() } }),
            target ? `${target.name} har fått en varning.` : 'Varningen är skickad.');
    }

    // Historik hämtas vid behov och sparas inte i datalagret.
    async function fetchWarnings(id){
        try {
            return (await api(`/residents/${id}/warnings`)).map(toWarning);
        } catch (e) {
            toast.error(e.message);
            return [];
        }
    }

    async function deleteAccount(){
        try {
            await api('/me', { method: 'DELETE' });
        } catch (e) {
            toast.error(e.message);
            return;
        }
        clearSession();
        toast.info('Ditt konto har raderats.');
    }

    function addErrand({ title, description, kind }){
        return run(() => api('/tickets', {
            method: 'POST',
            body: { subject: title.trim(), body: description.trim(), kind: kind === 'incident' ? 'INCIDENT' : 'ERRAND' },
        }), kind === 'incident' ? 'Din felanmälan är skickad.' : 'Ditt ärende är skickat.');
    }

    function setErrandStatus(id, status){
        return run(() => api(`/tickets/${id}`, { method: 'PATCH', body: { status: STATUS_TO_API[status] } }));
    }

    function postAnnouncement({ title, text }){
        return run(() => api('/messages', { method: 'POST', body: { title: title.trim(), body: text.trim() } }),
            'Meddelandet är publicerat.');
    }

    function joinQueue(spotId){
        const spot = data.parkingSpots.find(s => s.id === spotId);
        return run(() => api(`/parking-spots/${spotId}/queue`, { method: 'POST' }),
            spot ? `Du står nu i kö till ${spot.name}.` : null);
    }

    function leaveQueue(spotId){
        const spot = data.parkingSpots.find(s => s.id === spotId);
        return run(() => api(`/parking-spots/${spotId}/queue`, { method: 'DELETE' }),
            spot ? `Du har lämnat kön till ${spot.name}.` : null);
    }

    function assignSpot(spotId, userId){
        const spot = data.parkingSpots.find(s => s.id === spotId);
        const renter = data.users.find(u => u.id === userId);
        return run(() => api(`/parking-spots/${spotId}/assign`, { method: 'POST', body: { residentId: userId } }),
            spot && renter ? `${spot.name} har hyrts ut till ${renter.name}.` : null);
    }

    function terminateSpot(spotId){
        const spot = data.parkingSpots.find(s => s.id === spotId);
        return run(() => api(`/parking-spots/${spotId}/terminate`, { method: 'POST' }),
            spot ? `${spot.name} är nu ledig.` : null);
    }

    function setSpotPrice(spotId, price){
        const value = Number(price);
        if (!Number.isFinite(value) || value < 0) return Promise.resolve(false);
        return run(() => api(`/parking-spots/${spotId}`, { method: 'PATCH', body: { price: Math.round(value) } }));
    }

    function addSpot({ kind, name, price }){
        const cleanName = name.trim();
        if (!cleanName) return Promise.resolve(false);
        return run(() => api('/parking-spots', {
            method: 'POST',
            body: { kind: kind === 'garage' ? 'GARAGE' : 'PARKING', name: cleanName, price: Math.round(Number(price) || 0) },
        }), `${cleanName} har lagts till.`);
    }

    function removeSpot(spotId){
        const spot = data.parkingSpots.find(s => s.id === spotId);
        return run(() => api(`/parking-spots/${spotId}`, { method: 'DELETE' }),
            spot ? `${spot.name} har tagits bort.` : null);
    }

    function markAllRead(){
        return run(() => api('/notifications/read-all', { method: 'POST' }));
    }

    const unreadCount = data.notifications.filter(n => !n.read).length;

    const value = useMemo(() => ({
        user,
        ready,
        users: data.users,
        errands: data.errands,
        announcements: data.announcements,
        parkingSpots: data.parkingSpots,
        associations: data.associations,
        warnings: data.warnings,
        notifications: data.notifications,
        unreadCount,
        login,
        logout,
        addUser,
        removeUser,
        addAssociation,
        warnUser,
        fetchWarnings,
        deleteAccount,
        addErrand,
        setErrandStatus,
        postAnnouncement,
        joinQueue,
        leaveQueue,
        assignSpot,
        terminateSpot,
        setSpotPrice,
        addSpot,
        removeSpot,
        markAllRead,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [user, ready, data, unreadCount]);

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export function useApp(){
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp måste användas inom AppProvider');
    return ctx;
}
