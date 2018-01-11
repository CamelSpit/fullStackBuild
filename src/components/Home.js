import React from 'react';
import Bank from './communityBank.svg';
import './Home.css';

export default function Home (){
    return (
        <div>
            <img src={Bank}/> 
            <a href={process.env.REACT_APP_LOGIN}><button>Login</button></a>
        </div>
    )
}