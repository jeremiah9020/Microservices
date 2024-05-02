
import Recipe from '../Recipe/Recipe';
import './Section.scss'
export default function Section({section}) {
    console.log(section);

    return (
        <div className='section-container'>
            <span className='title'>{section.title}</span>
            {section.recipes.map(recipe => <Recipe showSave={false} key={recipe} id={recipe.id} version={recipe.version}/>)}
        </div>
    )
}