import { useState } from 'react';
import './LoginForm.css'

export default function LoginForm(){

    const [username, setUsername] = useState("test");
    const [password, setPassword] = useState("test");

    function redirectToView(){
        if(!username && !password){
            Alert.Alert("Saknas grejer");
            
        }
    }

    return <>
    <div className='login-wrapper'>
    <form className='login-form'>
        <h3>Logga in</h3>
        <p>Användarnamn:</p>
        <input id="username" type="text" placeholder="Ange användarnamn"></input>
        <p>Lösenord</p>
        <input id="password" type="password" placeholder="Ange lösenord"></input>
        <button className='login-button'>Logga in</button>
    </form>
    </div>
    </>
}