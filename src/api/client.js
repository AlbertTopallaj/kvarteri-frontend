/*
 * Tunn klient mot Kvarteri-backend (HTTP Basic). Inloggningsuppgifterna hålls i minnet och i
 * sessionStorage (en per flik), så de försvinner när fliken stängs.
 * VITE_API_URL kan peka på en annan server; som standard används samma origin (Vite proxar /api).
 */

const BASE = import.meta.env.VITE_API_URL ?? '';

let token = null;
let onUnauthorized = null;

export class ApiError extends Error {
    constructor(status, message){
        super(message);
        this.status = status;
    }
}

export function basicToken(email, password){
    const bytes = new TextEncoder().encode(`${email}:${password}`);
    return btoa(String.fromCharCode(...bytes));
}

export function setToken(value){
    token = value;
}

export function setUnauthorizedHandler(fn){
    onUnauthorized = fn;
}

// Backendens felmeddelanden är på engelska; här översätts de vi känner igen.
const MESSAGES = {
    'That time is already booked': 'Tiden är redan bokad.',
    'Invalid booking period': 'Ogiltig bokningstid.',
    'Spot is rented, terminate it first': 'Platsen är uthyrd – säg upp hyresavtalet först.',
    'Spot is already rented': 'Platsen är redan uthyrd.',
    'Spot is not rented': 'Platsen är inte uthyrd.',
    'You already rent this spot': 'Du hyr redan den här platsen.',
    'You are already in the queue': 'Du står redan i kön.',
    'You are not in the queue': 'Du står inte i kön.',
    'Email already registered': 'E-postadressen används redan.',
    'Cannot remove the last administrator': 'Den sista administratören kan inte tas bort.',
    'Ticket is closed': 'Ärendet är avslutat.',
    'Resident not found': 'Användaren hittades inte.',
    'Resource was just changed, try again': 'Någon hann före – försök igen.',
    'Request conflicts with existing data': 'Det finns redan en post med de uppgifterna.',
    'Association already exists': 'Föreningen finns redan.',
    'Association not found': 'Föreningen hittades inte.',
    'You cannot moderate your own account': 'Du kan inte moderera ditt eget konto.',
    'Validation failed': 'Kontrollera de ifyllda uppgifterna.',
};

function messageFor(status, detail){
    if (status === 401) return 'Fel e-post eller lösenord.';
    if (status === 403) return 'Du har inte behörighet till det här.';
    if (status === 429) return 'För många inloggningsförsök. Vänta en stund och försök igen.';
    if (status >= 500) return 'Något gick fel på servern. Försök igen.';
    return MESSAGES[detail] ?? detail ?? 'Något gick fel.';
}

export async function api(path, { method = 'GET', body } = {}){
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Basic ${token}`;

    let res;
    try {
        res = await fetch(`${BASE}/api${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, 'Kunde inte nå servern.');
    }

    const text = await res.text();
    let data = null;
    if (text) {
        try { data = JSON.parse(text); } catch { /* inte JSON */ }
    }

    if (!res.ok) {
        if (res.status === 401 && token && onUnauthorized) onUnauthorized();
        throw new ApiError(res.status, messageFor(res.status, data?.detail));
    }
    return data;
}
