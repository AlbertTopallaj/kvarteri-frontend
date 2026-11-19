import { useId } from 'react';
import './Logo.css';

/**
 * Kvarteri-loggan: en rundad "kvartersruta" med fönster. Märket ärver --accent och funkar i
 * både ljust och mörkt tema. withWordmark=false ger bara symbolen (t.ex. i den smala sidomenyn).
 */
export default function Logo({ size = 28, withWordmark = true, className = '' }){
    const id = useId();
    const maskId = `kv-mask-${id}`;
    return (
        <span className={`kv-logo ${className}`.trim()}>
            <svg className="kv-mark" width={size} height={size} viewBox="0 0 32 32"
                 role="img" aria-label="Kvarteri" focusable="false">
                <defs>
                    <mask id={maskId}>
                        <rect width="32" height="32" rx="8" fill="#fff"/>
                        <rect x="8.5"  y="8.5"  width="6" height="6" rx="1.4" fill="#000"/>
                        <rect x="17.5" y="8.5"  width="6" height="6" rx="1.4" fill="#000"/>
                        <rect x="8.5"  y="17.5" width="6" height="6" rx="1.4" fill="#000"/>
                        <rect x="17.5" y="17.5" width="6" height="6" rx="1.4" fill="#000"/>
                    </mask>
                </defs>
                <rect width="32" height="32" rx="8" fill="currentColor" mask={`url(#${maskId})`}/>
            </svg>
            {withWordmark && <span className="kv-wordmark">Kvarteri</span>}
        </span>
    );
}
