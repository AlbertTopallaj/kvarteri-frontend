export const ROLE_LABELS = {
    admin: 'Administratör',
    board: 'Styrelse',
    resident: 'Boende',
};

export const ROLE_HOME = {
    admin: '/admin',
    board: '/board',
    resident: '/resident',
};

export const STATUS_LABELS = {
    pending: 'Väntar',
    progress: 'Pågår',
    done: 'Klar',
    rejected: 'Avslaget',
};

export function formatDateTime(iso){
    return new Date(iso).toLocaleString('sv-SE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDate(iso){
    return new Date(iso).toLocaleDateString('sv-SE');
}
