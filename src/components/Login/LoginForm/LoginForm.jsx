import { useState } from 'react';
import './LoginForm.css'
import { Link } from 'react-router';

export default function LoginForm(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function redirectToView(e){
        e.preventDefault();

        if(!username || !password){
            alert("Saknas grejer");
            return;
        }
    }

    return <>
    <div className='login-wrapper'>
    <form className='login-form'>
        <h3>Logga in</h3>
        <label>Användarnamn:</label>
        <input value={username} id='username' type="text" placeholder="Ange användarnamn" onChange={(e) => setUsername(e.target.value)}></input>
        <label>Lösenord</label>
        <input value={password} id='password' type="password" placeholder="Ange lösenord" onChange={(e) => setPassword(e.target.value)}></input>
        <button onSubmit={redirectToView} className='login-button'>Logga in</button>
    </form>
    </div>
    </>
}