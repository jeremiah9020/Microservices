import { useContext, useEffect, useState } from 'react';
import './Cookbooks.scss'
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Recipe from '../../Components/Recipe/Recipe';
import Section from '../../Components/Section/Section';

export default function Cookbooks() {
    const [cookbookIDs, setCookbookIDs] = useState([]);
    const [cookbooks, setCookbooks] = useState([]);
    const [sections, setSections] = useState([]);
    const [index, setIndex] = useState(-1);


    const auth = useContext(AuthContext);
    const navigate = useNavigate();


    const getCookbookIDs = async () => {
        const response = await fetch('http://localhost:3006',{credentials: 'include'});
        const { user: { cookbooks } } = await response.json();        
        setCookbookIDs(cookbooks);
    }

    const getCookbooks = async () => {
        const cookbookPromises = cookbookIDs.map(async id => {
            const response = await fetch(`http://localhost:3003?id=${id}`,{credentials: 'include'});
            const { cookbook } = await response.json();
            return cookbook
        })

        const cookbooks = await Promise.all(cookbookPromises);        
        setCookbooks(cookbooks);
    }


    useEffect(() => { 
        if (!auth.loggedIn) {
            navigate('/');
        }

        getCookbookIDs()
    }, []);

    useEffect(() => { 
        getCookbooks()
    }, [cookbookIDs]);

    const select = (idx) => {
        setIndex(idx);
        setSections(cookbooks[idx].sections);

        console.log(cookbooks[idx].sections)
    }

    return (
        <div className='cookbooks-page'>
            <div className='cookbooks-sidebar'>
                <div className='cookbook-titles'>
                    {cookbooks.map((cookbook,idx) => 
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
        </div>
    )
}