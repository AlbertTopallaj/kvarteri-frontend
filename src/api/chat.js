/*
 * STOMP-klient för realtidschatten. En delad anslutning till /ws som autentiseras med samma
 * HTTP Basic-token som REST-anropen (skickas i CONNECT-headern). Prenumerationer återställs
 * automatiskt vid återanslutning.
 */
import { Client } from '@stomp/stompjs';
import { getToken } from './client';

let client = null;
const subs = new Map(); // destination -> { callback, sub }

function wsUrl(){
    if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${proto}://${window.location.host}/ws`;
}

function ensureClient(){
    if (client) return client;
    client = new Client({
        brokerURL: wsUrl(),
        connectHeaders: { Authorization: `Basic ${getToken() ?? ''}` },
        reconnectDelay: 4000,
        onConnect: () => {
            // (Åter)prenumerera på allt som är önskat.
            for (const [dest, entry] of subs){
                entry.sub = client.subscribe(dest, (msg) => deliver(entry, msg));
            }
        },
    });
    client.activate();
    return client;
}

function deliver(entry, msg){
    try {
        entry.callback(JSON.parse(msg.body));
    } catch { /* ignorera trasig payload */ }
}

export function subscribeChat(destination, callback){
    const entry = { callback, sub: null };
    subs.set(destination, entry);
    const c = ensureClient();
    if (c.connected){
        entry.sub = c.subscribe(destination, (msg) => deliver(entry, msg));
    }
    return () => {
        const e = subs.get(destination);
        if (e?.sub){ try { e.sub.unsubscribe(); } catch { /* redan borta */ } }
        subs.delete(destination);
    };
}

export function publishChat(destination, payload){
    ensureClient().publish({ destination, body: JSON.stringify(payload) });
}

export function disconnectChat(){
    if (client){
        try { client.deactivate(); } catch { /* redan nere */ }
        client = null;
        subs.clear();
    }
}
