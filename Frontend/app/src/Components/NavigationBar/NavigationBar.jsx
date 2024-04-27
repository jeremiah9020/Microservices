import { useContext, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

import './NavigationBar.scss'

async function isLoggedIn(setAuthInfo) {
    try {
        const response = await fetch('http://localhost:3006',{credentials: 'include'});
        if (response.status !== 200) {
            setAuthInfo({loggedIn: false})
        }    


        const { user } = await response.json();
        const { username, following } = user;

        setAuthInfo({loggedIn: true, username, following, reload: () => {isLoggedIn(setAuthInfo)}})
;
    } catch (err) {
        setAuthInfo({loggedIn: false})
    }
}

export default function NavBar({ setAuthInfo }) {
    const auth = useContext(AuthContext);

    useEffect(() => {
        const getLoggedIn = async () => {
            await isLoggedIn(setAuthInfo);
        }

        getLoggedIn();
    }, [setAuthInfo])

    const logout = async () => {
        await fetch('http://localhost:3002/logout/',{
            method:'post',          
            credentials: 'include'
        });

        setAuthInfo({ loggedIn: false })
    }

    return (
        <>
            <div className='navigation-bar-container'>
                <div className='navigation-logo-container'>
                    <Link className='navigation-button' to={'/'}>LOGO</Link>
                </div>

                <div className='navigation-buttons-container'>
                    <Link className='navigation-button' to={'create'}>Create</Link>
                </div>
                
                <div className='navigation-auth-container'>
                {
                    auth.loggedIn
                    ? <div className='navigation-auth-logged-in-container'>
                        <Link className='navigation-auth-username' to={`/chef?username=${auth.username}`}>
                            {auth.username}
                        </Link>

                        <button className='navigation-auth-logout-button' onClick={logout}>
                            Logout
                        </button>
                    </div>
                    : <div className='navigation-auth-login-container'>
                        <Link className='navigation-auth-login' to='/login'>Login</Link>
                    </div>
                }
                </div>
            </div>
            <Outlet/>
        </>
    );
}