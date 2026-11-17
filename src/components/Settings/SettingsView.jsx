import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, LogOut, Trash2, TriangleAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_HOME } from '../../utils/roles';
import { isSoundEnabled, playPing, setSoundEnabled } from '../../utils/sound';
import '../../styles/ResidentPages.css'
import './SettingsView.css'

const THEME_OPTIONS = [
    { key: 'light', label: 'Ljust' },
    { key: 'dark', label: 'Mörkt' },
    { key: 'system', label: 'System' },
];

export default function SettingsView(){
    const { user, logout, deleteAccount } = useApp();
    const { mode, setMode } = useTheme();
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [sound, setSound] = useState(isSoundEnabled);

    function toggleSound(){
        const next = !sound;
        setSound(next);
        setSoundEnabled(next);
        if (next) playPing();
    }

    return <>
    <div className="settings-page">
        <div className="settings-container">
            <Link to={ROLE_HOME[user.role]} className="settings-back">
                <ArrowLeft size={16}/>
                Tillbaka
            </Link>

            <header className="settings-header">
                <h1>Inställningar</h1>
                <p>Hantera ditt konto.</p>
            </header>

            <section className="settings-card preferences">
                <h2>Utseende och ljud</h2>

                <div className="pref-row">
                    <div className="danger-text">
                        <h3>Tema</h3>
                        <p>Välj ljust eller mörkt läge, eller följ din enhet.</p>
                    </div>
                    <div className="chip-row">
                        {THEME_OPTIONS.map(o => (
                            <button
                                key={o.key}
                                type="button"
                                className={`chip ${mode === o.key ? 'selected' : ''}`}
                                onClick={() => setMode(o.key)}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pref-row">
                    <div className="danger-text">
                        <h3>Notisljud</h3>
                        <p>Spela ett pling när en ny notis kommer in.</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={sound}
                        aria-label="Notisljud"
                        className={`switch ${sound ? 'on' : ''}`}
                        onClick={toggleSound}
                    >
                        <span className="switch-knob"/>
                    </button>
                </div>
            </section>

            <section className="settings-card danger-zone">
                <div className="danger-title">
                    <TriangleAlert size={18}/>
                    <h2>Danger zone</h2>
                </div>

                <div className="danger-row">
                    <div className="danger-text">
                        <h3>Logga ut</h3>
                        <p>Du loggas ut från den här enheten.</p>
                    </div>
                    <Link to="/" className="settings-button danger-outline" onClick={logout}>
                        <LogOut size={16}/>
                        Logga ut
                    </Link>
                </div>

                <div className="danger-row">
                    <div className="danger-text">
                        <h3>Radera konto</h3>
                        <p>Ditt konto och all tillhörande data tas bort permanent. Det går inte att ångra.</p>
                    </div>
                    {!confirmingDelete && (
                        <button
                            type="button"
                            className="settings-button danger-solid"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            <Trash2 size={16}/>
                            Radera konto
                        </button>
                    )}
                </div>

                {confirmingDelete && (
                    <div className="danger-confirm">
                        <p>Är du säker på att du vill radera ditt konto?</p>
                        <div className="danger-confirm-actions">
                            <button
                                type="button"
                                className="settings-button neutral"
                                onClick={() => setConfirmingDelete(false)}
                            >
                                Avbryt
                            </button>
                            <button type="button" className="settings-button danger-solid" onClick={deleteAccount}>
                                Ja, radera mitt konto
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    </div>
    </>
}
