import { useState } from 'react';
import { Link } from 'react-router';
import { api } from '../../api/client';
import { useToast } from '../../components/Toast/ToastProvider';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import Logo from '../../components/Logo/Logo';
import '../../components/Login/LoginForm/LoginForm.css';

export default function ForgotPassword(){
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const toast = useToast();

    async function submit(e){
        e.preventDefault();
        if (!email){
            toast.error('Ange din e-postadress.');
            return;
        }
        setBusy(true);
        try {
            await api('/auth/forgot-password', { method: 'POST', body: { email: email.trim() } });
            setSent(true);
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
            <h3>Glömt lösenord</h3>
            {sent ? (
                <>
                    <p>Om adressen finns hos oss har vi skickat ett mejl med en länk för att återställa lösenordet. Kolla även skräpposten.</p>
                    <Link to="/" className="login-button">Till inloggningen</Link>
                </>
            ) : (
                <>
                    <p>Ange din e-postadress så skickar vi en länk för att välja ett nytt lösenord.</p>
                    <label htmlFor="email">E-post</label>
                    <input value={email} id="email" type="email" autoComplete="username"
                           placeholder="Ange e-postadress" onChange={(e) => setEmail(e.target.value)}/>
                    <button className="login-button" disabled={busy}>{busy ? 'Skickar...' : 'Skicka återställningslänk'}</button>
                    <p className='login-hint'><Link to="/">Tillbaka till inloggningen</Link></p>
                </>
            )}
        </form>
    </div>;
}
