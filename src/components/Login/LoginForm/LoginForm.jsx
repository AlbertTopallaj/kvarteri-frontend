import { useState } from 'react';
import './LoginForm.css'
import { Link } from 'react-router';

export default function LoginForm(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function redirectToView(){
        if(!username && !password){
            alert("Saknas grejer");
        }

        setUsername(username);
        setPassword(password);
    }

    return <>
    <div className='login-wrapper'>
    <form className='login-form'>
        <h3>Logga in</h3>
        <p>Användarnamn:</p>
        <input id="username" type="text" placeholder="Ange användarnamn"></input>
        <p>Lösenord</p>
        <input id="password" type="password" placeholder="Ange lösenord"></input>
        <button onSubmit={redirectToView} className='login-button'>Logga in</button>
    </form>
    </div>
    </>
}