import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";


export default function Follow({username, followers, update}) {
    const auth = useContext(AuthContext);

    const isLoggedInUserFollowing = () => {
        return auth.following.includes(username);
    }

    const follow = async () => {
        const updateResponse = await fetch(`http://localhost:3006/following`,{
            method:'PATCH',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({add: [username]}) 
        });

        if (updateResponse.status == 200) {
            update();
            auth.reload();
        } 
    }


    const unfollow = async () => {
        const updateResponse = await fetch(`http://localhost:3006/following`,{
            method:'PATCH',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({remove: [username]}) 
        });

        if (updateResponse.status == 200) {
            update();
            auth.reload();
        } 
    }

    const formatFollowers = () => {
        let numFollowers = followers;
        let letter = ''

        if (followers > 1000000) {
            numFollowers = Math.floor(numFollowers / 1000000);
            letter = 'M'
        } else if (followers > 1000) {
            numFollowers = Math.floor(numFollowers / 1000);
            letter = 'K'
        }

        return `${numFollowers}${letter} `;
    }

    return (
        <div className='chef-follow-container'>
            <span className='chef-followers'>  { formatFollowers() } Followers</span>
        
            { auth.loggedIn && auth.username != username && (isLoggedInUserFollowing() 
            ? <button className='chef-follow' onClick={unfollow}>Unfollow</button>
            : <button className='chef-follow' onClick={follow}>Follow</button>
            )}
        </div>
    )
}