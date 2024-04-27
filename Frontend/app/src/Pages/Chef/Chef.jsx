import { useContext, useEffect, useState } from 'react';
import './Chef.scss'
import Recipe from '../../Components/Recipe/Recipe';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

export default function Chef() {
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const auth = useContext(AuthContext);

    const [input, setInput] = useState('');
    const [username, setUsername] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [cookbooks, setCookbooks] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [description, setDescription] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(false);


    const getUserData = async () => {
        const searchUsername = searchParams.get('username');
        
        if (searchUsername == null) {
            return navigate('/')
        }

        const userResponse = await fetch(`http://localhost:3006/?username=${searchUsername}`,{
            method:'get',
            credentials: 'include'
        });

        if (userResponse.status !== 200) {
            return navigate('/');
        }
        
        const { user } = await userResponse.json()

        setUsername(searchUsername);
        setRecipes(user.recipes);
        setCookbooks(user.cookbooks);
        setFollowers(user.followers);
        setDescription(user.data.description);
        setInput(user.data.description);
    }

    useEffect(() => {
        getUserData();
    }, [searchParams])



    useEffect(() => {
        setShowSaveButton(input != description);
    }, [input, description])

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
            getUserData();
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
            getUserData();
            auth.reload();
        } 
    }

    const formatFollowers = () => {
        let numFollowers = followers;
        let letter = ''

        if (followers > 1000000) {
            numFollowers /= 1000000
            letter = 'M'
        } else if (followers > 1000) {
            numFollowers /= 1000
            letter = 'K'
        }

        return `${numFollowers}${letter} `;
    }

    const saveDescription = async () => {
        const updateResponse = await fetch(`http://localhost:3006/`,{
            method:'PATCH',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({data: {description: input}}) 
        });

        if (updateResponse.status == 200) {
            setDescription(input);
        }
    }


    return (
        <div className='chef-container'>
            <div className='chef-banner-container'>
                <div className='chef-card-container'>
                    <span className='chef-card-title'>
                       chef
                    </span>
                    <span className='chef-card-name'>{username}</span>
                </div>
                <div className='chef-description-container'>
                    { auth.username == username
                    ?   <div className='chef-description-input-container'>
                            <textarea className='chef-description-input' maxLength='200' value={input} placeholder='type here to edit description...' onChange={(e) => setInput(e.target.value)}/>
                            {showSaveButton && <button className='chef-description-save-button' onClick={saveDescription}>Save</button>}
                        </div>
                    : description.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                            )
                        })
                    }
                </div>

                
                <div className='chef-follow-container'>
                    <span className='chef-followers'>  { formatFollowers() } Followers</span>
                  
                    { auth.loggedIn && auth.username != username && (isLoggedInUserFollowing() 
                    ? <button className='chef-follow' onClick={unfollow}>Unfollow</button>
                    : <button className='chef-follow' onClick={follow}>Follow</button>
                    )}
                </div>
            </div>


            <div className='chef-recipe-container'>
                <div>
                    { recipes.map(recipe => <Recipe key={recipe} id={recipe} showUsername={false}/>)}
                </div>
            </div>
        </div>
       
    )
}