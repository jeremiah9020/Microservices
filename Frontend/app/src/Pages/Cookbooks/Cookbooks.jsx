import { useContext, useEffect, useState } from 'react';
import './Cookbooks.scss'
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Recipe from '../../Components/Recipe/Recipe';
import Section from '../../Components/Section/Section';

export default function Cookbooks() {
    const [sections, setSections] = useState([]);
    const [index, setIndex] = useState(-1);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { 
        if (!auth.loggedIn) {
            navigate('/');
        }
    }, []);

    const select = (idx) => {
        setIndex(idx);
        setSections(auth.cookbooks[idx].sections);
    }

    return (
        <div className='cookbooks-page'>
            {auth.loggedIn && auth.cookbooks && <>
            <div className='cookbooks-sidebar'>
                <div className='cookbook-titles'>
                    {auth.cookbooks.map((cookbook,idx) => 
                    <span key={idx} data-selected={idx == index} className='cookbook-title' onClick={() => select(idx)}>
                        {cookbook.title}
                    </span>
                    )}
                </div>
            </div>

            <div className='cookbooks-container'>

                {sections.length > 0 && 
                <div>
                    { sections.map(section => <Section key={section} section={section}/>)}
                </div>
                }
            </div>
            </>}
        </div>
    )
}