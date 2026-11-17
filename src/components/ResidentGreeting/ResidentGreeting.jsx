import { useState } from 'react';
import './ResidentGreeting.css'

export default function ResidentGreeting(){
    const [username, setUsername] = useState("Albert");

    return <>
    <header className="greeting-container">
        <h1 className="greeting">Välkommen, {username}</h1>
        <p className="greeting-sub">Här är en översikt över ditt boende.</p>
    </header>
    </>
}
