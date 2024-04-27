import { useEffect, useRef, useState } from 'react';
import './RecipeCreator.scss'

export default function RecipeCreator({ setData }) {
    const refs = {
        0: useRef(),
        1: useRef(),
        2: useRef(),
        3: useRef(),
        4: useRef(),
        5: useRef(),
        6: useRef(),
        7: useRef(),
        8: useRef(),
    }

    const [focused, setFocused] = useState(0);

    const [title, setTitle] = useState('')
    const [line1, setLine1] = useState('')
    const [line2, setLine2] = useState('')
    const [line3, setLine3] = useState('')
    const [line4, setLine4] = useState('')
    const [line5, setLine5] = useState('')
    const [line6, setLine6] = useState('')
    const [line7, setLine7] = useState('')
    const [line8, setLine8] = useState('')

    const inputHandler = (e) => {
        let direction = 0;

        switch (e.key) {
            case 'ArrowDown':
                direction = 1;
                break;
            case 'Enter':
                direction = 1;
                break;
            case 'ArrowUp':
                direction = -1;
                break;
        }

        setFocused(x => (x + 9 + direction) % 9)
    }

    useEffect(() => {
        refs[focused].current.focus()
    }, [focused])

    useEffect(() => {
        setData({title, text: [line1,line2,line3,line4,line5,line6,line7,line8].join('\n')})
    }, [title, line1,line2,line3,line4,line5,line6,line7,line8])

    return (
        <div className='create-recipe-container' onKeyDown={inputHandler}>
           <div className='create-recipe-title-container'>
                <input ref={refs[0]} type='text' value={title}  maxLength={24} onFocus={() => setFocused(0)} onChange={(e) => setTitle(e.target.value)} placeholder='Enter a title...'/>
            </div>

            <div className='create-recipe-text-container'>
                <input ref={refs[1]} type='text' value={line1} maxLength={42} onFocus={() => setFocused(1)} onChange={(e) => setLine1(e.target.value)} placeholder='Enter a recipe here...'/>
                <input ref={refs[2]} type='text' value={line2} maxLength={42} onFocus={() => setFocused(2)} onChange={(e) => setLine2(e.target.value)} />
                <input ref={refs[3]} type='text' value={line3} maxLength={42} onFocus={() => setFocused(3)} onChange={(e) => setLine3(e.target.value)} />
                <input ref={refs[4]} type='text' value={line4} maxLength={42} onFocus={() => setFocused(4)} onChange={(e) => setLine4(e.target.value)} />
                <input ref={refs[5]} type='text' value={line5} maxLength={42} onFocus={() => setFocused(5)} onChange={(e) => setLine5(e.target.value)} />
                <input ref={refs[6]} type='text' value={line6} maxLength={42} onFocus={() => setFocused(6)} onChange={(e) => setLine6(e.target.value)} />
                <input ref={refs[7]} type='text' value={line7} maxLength={42} onFocus={() => setFocused(7)} onChange={(e) => setLine7(e.target.value)} />
                <input ref={refs[8]} type='text' value={line8} maxLength={42} onFocus={() => setFocused(8)} onChange={(e) => setLine8(e.target.value)} />
            </div>
        </div>
    )
}