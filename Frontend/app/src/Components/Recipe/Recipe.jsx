import { useState, useRef, useEffect, useContext } from 'react';
import { useLazyLoad } from '../../Hooks/LazyLoad'
import './Recipe.scss'
import Rating from '../Rating/Rating';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

export default function Recipe({id, version, showUsername = true, showSave = true}) {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const ref = useRef(null);
    const modal = useRef(null);
    const [rating, setRating] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [owner, setOwner] = useState('')
    const [title, setTitle] = useState('Loading...')
    const [text, setText] = useState('');
    const [recipeVersion, setRecipeVersion] = useState(version);

    const [selectedCookbook, setSelectedCookbook] = useState("");
    const [selectedSection, setSelectedSection] = useState("");

    const getRecipeData = async () => {
        let myRecipeVersion = recipeVersion;

        if (version == null || version == undefined) {
            const metadataResponse = await fetch(`http://localhost:3005/metadata?id=${id}`,{
                method:'get',
                credentials: 'include'
            });
            
            const { metadata } = await metadataResponse.json();
            setRecipeVersion(metadata.latest);
            myRecipeVersion = metadata.latest;
        }
       


        const recipeResponse = await fetch(`http://localhost:3005?id=${id}&version=${myRecipeVersion}`,{
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

    const openModal = () => {
        modal.current.showModal();
    }

    const getSections = () => {
        const cookbook = auth.cookbooks.filter(x => x.id == selectedCookbook)[0]

        if (!cookbook) {
            return;
        }

        return cookbook.sections.map(section => <option key={section.title} value={section.title}>{section.title}</option>)
    }

    const saveRecipeToCookbook = async () => {
        const cookbook = auth.cookbooks.filter(x => x.id == selectedCookbook)[0]

        const body = {
            id: cookbook.id,
            sections: cookbook.sections
        }
        
        const section = body.sections.filter(x => x.title == selectedSection)[0]
        section.recipes.push({id, version})

        await fetch(`http://localhost:3003/`,{
            method:'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        modal.current.close();
    }

    return (
        <div ref={ref} className='recipe-container'>
            <dialog className='recipe-modal' ref={modal}>
                <div className='save-title'>
                    <span className='title'>Save</span>
                    <button className='close' onClick={() => modal.current.close()}>X</button>
                </div>

                <div className='recipeTitle'>
                    {title}
                </div>

                { auth.cookbooks && auth.cookbooks.length > 0 && <div className='cookbook-selection'>
                    <span className='title'>Cookbook</span>
                    <select id='cookbook' value={selectedCookbook} onChange={e => setSelectedCookbook(e.target.value)}>
                        <option key={0} value={0}></option>
                        {auth.cookbooks.map(cookbook => 
                            <option key={cookbook.id} value={cookbook.id}>{cookbook.title}</option>
                        )}
                    </select>
                </div>}
                

                { auth.cookbooks && auth.cookbooks.length > 0 && <div className='section-selection'>
                    <span className='title'>Section</span>
                    <select id='cookbook' value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                        <option key={0} value={0}></option>
                        {getSections()}
                    </select>
                </div>}

                <button className='save-button' onClick={saveRecipeToCookbook}>Save</button>
            </dialog>


            <div className='recipe-info-container'>
                <div className='recipe-title-container'>
                    {title}

                    {auth.loggedIn && showSave && <button className='recipe-save' onClick={openModal}>Save</button>}
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