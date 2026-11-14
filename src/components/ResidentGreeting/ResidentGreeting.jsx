import { useState } from 'react';
import './ResidentGreeting.css'

export default function ResidentGreeting(){
    const [username, setUsername] = useState("");

    if(!username){
        setUsername("Albert")
    }

    return <>
    <div className="greeting-container">
        <h1 className="greeting">Välkommen {username}</h1>
    </div>
    </>
}