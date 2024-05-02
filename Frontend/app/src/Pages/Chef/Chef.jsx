import { useContext, useEffect, useState } from 'react';
import './Chef.scss'
import Recipe from '../../Components/Recipe/Recipe';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import Follow from '../../Components/Follow/Follow';

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

                
                <Follow username={username} followers={followers} update={getUserData} />
            </div>


            <div className='chef-recipe-container'>
                <div>
                    { recipes.map(recipe => <Recipe key={recipe} id={recipe} showUsername={false}/>)}
                </div>
            </div>
        </div>
       
    )
}