import { useEffect, useState } from 'react';
import './User.scss'
import Follow from '../Follow/Follow';
import { Link } from 'react-router-dom';


export default function User({id}) {
    const [user, setUser] = useState('');
    const [followers, setFollowers] = useState(0);

    const getUserData = async () => {
        const response = await fetch(`http://localhost:3006?username=${id}`,{credentials: 'include'});


        const {user} = await response.json();
        setUser(user.username);
        setFollowers(user.followers);
    }

    useEffect(() => {
        getUserData()
    }, []);

    return (
        <div className='user-container'>
            <div className='name-container'>
                <span className='title'>chef</span>
                <Link className='name' to={`/chef?username=${user}`}>
                    {user}                      
                </Link>
            </div>

            <div className='follow-container'>
                <Follow username={user} followers={followers} update={getUserData}/>
            </div>
        </div>
    )
}