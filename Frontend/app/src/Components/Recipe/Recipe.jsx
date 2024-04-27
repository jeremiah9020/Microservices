import { useState, useRef, useCallback, useEffect } from 'react';
import { useLazyLoad } from '../../Hooks/LazyLoad'
import './Recipe.scss'
import Rating from '../Rating/Rating';
import { useNavigate } from 'react-router-dom';

export default function Recipe({id, showUsername = true}) {
    const navigate = useNavigate();

    const ref = useRef(null);
    const [rating, setRating] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [owner, setOwner] = useState('')
    const [title, setTitle] = useState('Loading...')
    const [text, setText] = useState('')


    const getRecipeData = async () => {
        const recipeResponse = await fetch(`http://localhost:3005/?id=${id}`,{
            method:'get',
            credentials: 'include'
        });

       const { recipe } = await recipeResponse.json();
       setTitle(recipe.data.title)
       setText(recipe.data.text)
       setOwner(recipe.owner)
       setRating(recipe.rating)
       setUserRating(recipe.user_rating)
    }

    useLazyLoad(ref, getRecipeData)

    const visit = () => {
        navigate(`/chef?username=${owner}`);
    }

    useEffect(() => {
        getRecipeData();
    },[userRating])

    return (
        <div ref={ref} className='recipe-container'>
           <div className='recipe-info-container'>
                <div className='recipe-title-container'>
                    {title}
                </div>

                <div className='recipe-owner-and-rating-container'>
                    <div className='recipe-owner-container'>
                        { showUsername
                        ? <div>
                            Written by <span className='recipe-owner' onClick={visit}>{owner}</span>
                        </div>
                        : <br/>
                        }
                    </div>

                    <div className='recipe-rating-container'>
                        <Rating rating={rating} userRating={userRating} setUserRating={setUserRating} id={id}></Rating>
                    </div>
                </div>

                <div className='recipe-text-container'>
                    { text.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}