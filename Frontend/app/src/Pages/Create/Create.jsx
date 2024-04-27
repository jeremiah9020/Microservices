import { useContext, useEffect, useState } from 'react'
import './Create.scss'
import { AuthContext } from '../../Contexts/AuthContext'
import { LocationContext } from '../../Contexts/LocationContext'
import { useNavigate } from 'react-router-dom';
import RecipeCreator from '../../Components/RecipeCreator/RecipeCreator';


export default function Chef() {
    const [data, setData] = useState({title:"",text:""})

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const {previous} = useContext(LocationContext);
    useEffect(() => {
        if (auth.loggedIn === false) {
            navigate('/')
        }
    },[auth])

    const cancel = () => {
        navigate(previous)
    }

    const create = async () => {
        if (data.text == '' || data.title == '') {
            return
        }

        const creationResponse = await fetch(`http://localhost:3005/`,{
            method:'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({data}) 
        });

        if (creationResponse.status == 200) {
            navigate(`/chef?username=${auth.username}`)
        }
    }

    return (      
        <div className='create-recipe-page'>
            <RecipeCreator setData={setData}/>
            <div className='create-recipe-submission-container'>
                <button className='create-recipe-cancel' onClick={cancel}>Cancel</button>
                <button className='create-recipe-create' onClick={create}>Create</button>
            </div>
        </div> 
    )
}