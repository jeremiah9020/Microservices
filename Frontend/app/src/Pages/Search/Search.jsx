import { useEffect, useState } from 'react';
import './Search.scss'
import Recipe from '../../Components/Recipe/Recipe';
import User from '../../Components/User/User';

export default function Search() {
    const [query, setQuery] = useState('');

    const [recipes, setRecipes] = useState([]);
    const [users, setUsers] = useState([]);
    const [cookbooks, setCookbooks] = useState([]);

    const getQueryFeed = async () => {
        const feedResponse = await fetch(`http://localhost:3004/query?query=${query}`,{
            method:'get',
            credentials: 'include'
        });

        const { recipes, users, cookbooks } = await feedResponse.json()
        setCookbooks(cookbooks)
        setRecipes(recipes);
        setUsers(users);
    }

    useEffect(() => {
        getQueryFeed();
    }, [query])

    const input = ({ target: {value}}) => {
        setQuery(value);
    }

    return (
        <div className='search-page'>
            <div className='search-bar-container'>
                <input type='text' onChange={input}/>
            </div>

            <div className='items-container'>
                <div>
                    { users.map(user => <User key={user} id={user}/>)}
                </div>

                <div>
                    { recipes.map(recipe => <Recipe key={recipe} id={recipe}/>)}
                </div>
            </div>
        </div>
    )
}