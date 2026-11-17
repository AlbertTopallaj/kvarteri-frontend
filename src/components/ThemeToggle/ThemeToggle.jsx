import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css'

export default function ThemeToggle(){
    const { resolved, toggle } = useTheme();
    const label = resolved === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge';

    return <>
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
        {resolved === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
    </>
}
