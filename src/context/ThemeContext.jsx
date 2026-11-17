import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'kvarteri-theme';
const ThemeContext = createContext(null);

function loadMode(){
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch { /* ignorera */ }
    return 'system';
}

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export function ThemeProvider({ children }){
    const [mode, setModeState] = useState(loadMode);
    const [systemDark, setSystemDark] = useState(prefersDark);

    const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e) => setSystemDark(e.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = resolved;
    }, [resolved]);

    function setMode(next){
        setModeState(next);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch { /* ignorera */ }
    }

    function toggle(){
        setMode(resolved === 'dark' ? 'light' : 'dark');
    }

    return <>
    <ThemeContext.Provider value={{ mode, resolved, setMode, toggle }}>
        {children}
    </ThemeContext.Provider>
    </>
}

export function useTheme(){
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme måste användas inom ThemeProvider');
    return ctx;
}
