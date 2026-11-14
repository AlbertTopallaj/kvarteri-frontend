import './LoginForm.css'

export default function LoginForm(){
    return <>
    <div className='login-wrapper'>
    <form className='login-form'>
        <h3>Logga in</h3>
        <p>Användarnamn:</p>
        <input type="text" placeholder="Ange användarnamn"></input>
        <p>Lösenord</p>
        <input type="password" placeholder="Ange lösenord"></input>
        <button className='login-button'>Logga in</button>
    </form>
    </div>
    </>
}