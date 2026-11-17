import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, LogOut, Trash2, TriangleAlert } from 'lucide-react';
import './SettingsView.css'

export default function SettingsView(){
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    return <>
    <div className="settings-page">
        <div className="settings-container">
            <Link to="/resident" className="settings-back">
                <ArrowLeft size={16}/>
                Tillbaka
            </Link>

            <header className="settings-header">
                <h1>Inställningar</h1>
                <p>Hantera ditt konto.</p>
            </header>

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
                    <Link to="/" className="settings-button danger-outline">
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
                            <button type="button" className="settings-button danger-solid">
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
