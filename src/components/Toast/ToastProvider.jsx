import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import './Toast.css'

const ToastContext = createContext(null);

const ICONS = {
    success: CircleCheck,
    error: CircleAlert,
    info: Info,
};

const DURATION_MS = 4500;

export function ToastProvider({ children }){
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const show = useCallback((message, type = 'info') => {
        const id = nextId.current++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => dismiss(id), DURATION_MS);
    }, [dismiss]);

    const api = useMemo(() => ({
        success: (message) => show(message, 'success'),
        error: (message) => show(message, 'error'),
        info: (message) => show(message, 'info'),
    }), [show]);

    return <>
    <ToastContext.Provider value={api}>
        {children}
        <div className="toast-region" aria-live="polite">
            {toasts.map(t => {
                const Icon = ICONS[t.type];
                return (
                    <div key={t.id} className={`toast ${t.type}`} role="status">
                        <Icon size={18} className="toast-icon"/>
                        <span className="toast-message">{t.message}</span>
                        <button type="button" className="toast-close" aria-label="Stäng" onClick={() => dismiss(t.id)}>
                            <X size={14}/>
                        </button>
                    </div>
                );
            })}
        </div>
    </ToastContext.Provider>
    </>
}

export function useToast(){
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast måste användas inom ToastProvider');
    return ctx;
}
