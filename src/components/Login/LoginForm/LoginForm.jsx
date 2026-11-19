import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../Toast/ToastProvider';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import Logo from '../../Logo/Logo';
import { ROLE_HOME } from '../../../utils/roles';
import './LoginForm.css'

export default function LoginForm(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, ready, login } = useApp();
    const [busy, setBusy] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    if (ready && user) return <Navigate to={ROLE_HOME[user.role]} replace/>;

    async function redirectToView(e){
        e.preventDefault();

        if(!email || !password){
            toast.error("Det saknas uppgifter för att slutföra inloggningen.");
            return;
        }

        setBusy(true);
        const loggedIn = await login(email, password);
        setBusy(false);
        if (loggedIn) navigate(ROLE_HOME[loggedIn.role]);
    }

    return <>
    <div className='login-wrapper'>
    <div className='login-theme'><ThemeToggle/></div>
    <form className='login-form' onSubmit={redirectToView}>
        <Logo size={40} className="login-logo"/>
        <h3>Logga in</h3>
        <label htmlFor="email">E-post</label>
        <input value={email} id="email" type="email" autoComplete="username" placeholder="Ange e-postadress" onChange={(e) => setEmail(e.target.value)}></input>
        <label htmlFor="password">Lösenord</label>
        <input value={password} id="password" type="password" autoComplete="current-password" placeholder="Ange lösenord" onChange={(e) => setPassword(e.target.value)}></input>
        <button className="login-button" disabled={busy}>{busy ? "Loggar in..." : "Logga in"}</button>
        <p className='login-hint'>Glömt lösenordet? Kontakta din administratör</p>
    </form>
    </div>
    </>
}
