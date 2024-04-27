import { useEffect, useState } from 'react';
import './Home.scss'
import Recipe from '../../Components/Recipe/Recipe';

export default function Home() {
    const [recipes, setRecipes] = useState([]);

    const getHomeFeed = async () => {
        const feedResponse = await fetch('http://localhost:3004/home/',{
            method:'get',
            credentials: 'include'
        });

        const { recipes } = await feedResponse.json()
        setRecipes(recipes);
    }

    useEffect(() => {
        getHomeFeed();
    }, [])

    return (
        <div className='home-container'>
            <div>
                { recipes.map(recipe => <Recipe key={recipe} id={recipe}/>)}
            </div>
        </div>
    )
}