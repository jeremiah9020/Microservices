import './Rating.scss'

import StarsSelected from './stars_selected.png'
import StarsRated from './stars_rated.png'
import StarsOutline from './stars_outline.png'

import { useContext, useState } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'

export default function Rating({rating, userRating, setUserRating, id}) {
    const [ratingSuggestion, setRatingSuggestion] = useState(0);
    const auth = useContext(AuthContext);
    
    const unshow = () => {
        setRatingSuggestion(0);
    }

    const changeUserRating = async (rating) => {
        const body = {
            id,
            rating
        }

        const response = await fetch('http://localhost:3005/rating/',{
            method:'post',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body),
            credentials: 'include'
        });

        setUserRating(rating);
    }

    return (
        <div className='rating-container'>
            <div className='rater'>
                <button onMouseEnter={() => {setRatingSuggestion(1)}} onMouseLeave={unshow} onClick={() => changeUserRating(1)}/>
                <button onMouseEnter={() => {setRatingSuggestion(2)}} onMouseLeave={unshow} onClick={() => changeUserRating(2)}/>
                <button onMouseEnter={() => {setRatingSuggestion(3)}} onMouseLeave={unshow} onClick={() => changeUserRating(3)}/>
                <button onMouseEnter={() => {setRatingSuggestion(4)}} onMouseLeave={unshow} onClick={() => changeUserRating(4)}/>
                <button onMouseEnter={() => {setRatingSuggestion(5)}} onMouseLeave={unshow} onClick={() => changeUserRating(5)}/>
            </div>

            <div className='rating-img-container' style={{maxWidth: `${rating / 5 * 100}%`}}>
                <img className='rating-star' src={StarsRated}></img>
            </div>


            { auth.loggedIn &&  
            <>
                <div className='rating-img-container' style={{maxWidth: `${(ratingSuggestion || userRating || 0) / 5 * 100}%`}}>
                    <img className='rating-star' src={StarsSelected}></img>
                </div>
            </>       
            }

            <img className='rating-star' src={StarsOutline}></img>
        </div>
    )
}