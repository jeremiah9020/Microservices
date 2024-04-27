import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import './Register.scss'
import { LocationContext } from '../../Contexts/LocationContext';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [hideError, setHideError] = useState(true);

    const navigate = useNavigate();
    const {previous} = useContext(LocationContext);

    const attemptRegister = async (event) => {
        event.preventDefault();
        setHideError(true);

        const body = { username, email, password }
        const request = fetch('http://localhost:3002/register/',{
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
                case 409:
                    setError('Username or email already in use');
                    setHideError(false);
                    break;
                default:
                    navigate(previous, {replace: true})
                    break;
            }
        }, 250)
    }

    return (
        <div className='register-whole-page'>
            <div className='register-centered-container'>
                <div className='register-title-container'>
                    <div className='register-title'>
                        Register
                    </div>
                    <div className={`register-error${hideError ? ' hidden' : ''}`}>
                    { error }
                    </div>
                </div>

                <form onSubmit={attemptRegister}>
                    <div className='register-entry'>
                        <label>
                            Username<br/>
                            <input type='text' placeholder='Chef123' onChange={(e) => setUsername(e.target.value)}></input>
                        </label>
                    </div>

                    <div className='register-entry'>
                        <label>
                            Email<br/>
                            <input type='text' placeholder='chef@mail.com' onChange={(e) => setEmail(e.target.value)}></input>
                        </label>
                    </div>

                    <div className='register-entry'>
                        <label>
                            Password<br/>
                            <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
                        </label>
                    </div>
                    
                    <div className='register-button-container'>
                        <button type='submit' className='register-button' disabled={!username || !email || !password}>
                            Register
                        </button>
                    </div>
                </form>   

                <div className='register-goto-login'>
                    <span>Already have an account?</span>    
                    <Link to='/login'>Login</Link>
                </div>                
            </div>
        </div>
    )
}