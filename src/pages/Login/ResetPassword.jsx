import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { api } from '../../api/client';
import { useToast } from '../../components/Toast/ToastProvider';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import Logo from '../../components/Logo/Logo';
import '../../components/Login/LoginForm/LoginForm.css';

export default function ResetPassword(){
    const [params] = useSearchParams();
    const token = params.get('token');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    async function submit(e){
        e.preventDefault();
        if (password.length < 10){
            toast.error('Lösenordet måste vara minst 10 tecken.');
            return;
        }
        if (password !== confirm){
            toast.error('Lösenorden matchar inte.');
            return;
        }
        setBusy(true);
        try {
            await api('/auth/reset-password', { method: 'POST', body: { token, password } });
            toast.success('Lösenordet är uppdaterat. Logga in med ditt nya lösenord.');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    }

    return <div className='login-wrapper'>
        <div className='login-theme'><ThemeToggle/></div>
        <form className='login-form' onSubmit={submit}>
            <Logo size={40} className="login-logo"/>
            <h3>Nytt lösenord</h3>
            {token ? (
                <>
                    <label htmlFor="password">Nytt lösenord</label>
                    <input value={password} id="password" type="password" autoComplete="new-password"
                           placeholder="Minst 10 tecken" onChange={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="confirm">Bekräfta lösenord</label>
                    <input value={confirm} id="confirm" type="password" autoComplete="new-password"
                           placeholder="Upprepa lösenordet" onChange={(e) => setConfirm(e.target.value)}/>
                    <button className="login-button" disabled={busy}>{busy ? 'Sparar...' : 'Spara nytt lösenord'}</button>
                </>
            ) : (
                <>
                    <p>Länken saknar en giltig återställningskod. Begär en ny återställningslänk.</p>
                    <Link to="/glomt-losenord" className="login-button">Begär ny länk</Link>
                </>
            )}
            <p className='login-hint'><Link to="/">Tillbaka till inloggningen</Link></p>
        </form>
    </div>;
}
