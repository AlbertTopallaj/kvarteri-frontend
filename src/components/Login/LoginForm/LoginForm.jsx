import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../Toast/ToastProvider';
import { ROLE_HOME } from '../../../utils/roles';
import './LoginForm.css'

export default function LoginForm(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user, login } = useApp();
    const toast = useToast();
    const navigate = useNavigate();

    if (user) return <Navigate to={ROLE_HOME[user.role]} replace/>;

    function redirectToView(e){
        e.preventDefault();

        if(!username || !password){
            toast.error("Det saknas uppgifter för att slutföra inloggningen.");
            return;
        }

        // Ingen riktig autentisering än: användaren slås bara upp på användarnamn.
        const loggedIn = login(username);
        if (loggedIn) navigate(ROLE_HOME[loggedIn.role]);
    }

    return <>
    <div className='login-wrapper'>
    <form className='login-form' onSubmit={redirectToView}>
        <h3>Logga in</h3>
        <label>Användarnamn:</label>
        <input value={username} id='username' type="text" placeholder="Ange användarnamn" onChange={(e) => setUsername(e.target.value)}></input>
        <label>Lösenord</label>
        <input value={password} id='password' type="password" placeholder="Ange lösenord" onChange={(e) => setPassword(e.target.value)}></input>
        <button className='login-button'>Logga in</button>
        <p className='login-hint'>Glömt lösenordet? Kontakta din administratör</p>
        <p className='login-hint'>Demo: admin, styrelse eller albert (valfritt lösenord)</p>
    </form>
    </div>
    </>
}
