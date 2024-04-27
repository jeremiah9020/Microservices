import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import './Login.scss'
import { LocationContext } from '../../Contexts/LocationContext';

export default function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [hideError, setHideError] = useState(true);

    const navigate = useNavigate();
    const {previous} = useContext(LocationContext);
   
    const attemptLogin = async (event) => {
        event.preventDefault();
        setHideError(true);

        const body = { user, password }
        const request = fetch('http://localhost:3002/login/',{
            method:'post',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body),
            credentials: 'include'
        });

        // Allows the full animation to play
        setTimeout(async () => {
            const response = await request;
            switch (response.status) {
                case 404:
                    setError('Could not find user with given credentials');
                    setHideError(false);
                    break;
                case 401:
                    setError('Could not authenticate the user')
                    setHideError(false);
                    break;
                default:
                    navigate(previous, {replace: true})
                    break;
            }

        }, 250)
    }

    return (
        <div className='login-whole-page'>
            <div className='login-centered-container'>
                <div className='login-title-container'>
                    <div className='login-title'>
                        Login
                    </div>
                    <div className={`login-error${hideError ? ' hidden' : ''}`}>
                    { error }
                    </div>
                </div>

                <form onSubmit={attemptLogin}>
                    <div className='login-entry'>
                        <label>
                            Username / Email<br/>
                            <input type='text' placeholder='Chef123' onChange={(e) => setUser(e.target.value)}></input>
                        </label>
                    </div>

                    <div className='login-entry'>
                        <label>
                            Password<br/>
                            <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
                        </label>
                    </div>
                    
                    <div className='login-button-container'>
                        <button type='submit' className='login-button' disabled={!user || !password}>
                            Login
                        </button>
                    </div>
                </form>  

                <div className='login-goto-register'>
                    <span>Need to make an account?</span>    
                    <Link to='/register'>Register</Link>
                </div>              
            </div>
        </div>
    )
}