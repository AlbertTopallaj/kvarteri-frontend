import { useApp } from '../../context/AppContext';
import './ResidentGreeting.css'

export default function ResidentGreeting(){
    const { user } = useApp();

    return <>
    <header className="greeting-container">
        <h1 className="greeting">Välkommen, {user.name}</h1>
        <p className="greeting-sub">Här är en översikt över ditt boende.</p>
    </header>
    </>
}
