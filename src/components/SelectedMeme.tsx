import React, { useState, lazy } from 'react';
import { Rnd } from 'react-rnd';

function SelectedMeme(props: { selectedMeme: any; reset: () => void }) {

    interface DankMeme {
        text: string;
        width: string;
    }

    //Array of text boxes
    const [memeTexts, setMemeTexts] = useState<DankMeme[]>([]);
    //For dynamic width textboxes
    const [inputWidth, setInputWidth] = useState<string>('130px');



    const updateFieldChanged = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        //Dynamic text box width
        const charLength = e.target.value.length
        const charFontSize = e.target.size
        const constantValue = 1.5
        const newWidth = `${(constantValue * charLength * charFontSize)}px`
        setInputWidth(newWidth)

        //Fill with old array
        let newArr: DankMeme[] = [...memeTexts];
        //Set specified element to the new text
        newArr[index] = { text: e.currentTarget.value, width: inputWidth };
        //Set State
        setMemeTexts(newArr);
    };


    return (
        <div className='w-full h-full overflow-hidden'>
            <div className='relative w-full'>

                <div
                    id='main-image'
                    className={'max-w-screen-md mx-auto my-2'}
                    style={{
                        width: '600px',
                        height: '600px',
                        backgroundImage: `url(${props.selectedMeme.url})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionX: 'center',
                    }}>
                    <div>
                        {memeTexts.map((x, i) => {
                            if (x && x.text) {
                                return TextBox(i, x.text, x.width);
                            } else {
                                return TextBox(i);
                            }
                        })}
                    </div>
                </div>
                <button className='absolute top-0 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2' onClick={addText()}>
                    Add Text
                </button>
            </div>
            <div>
            </div>
        </div>
    );


    function TextBox(i: number, x?: string, inputwidth?: string): JSX.Element {
        return (
            <Rnd
                bounds='#main-image'
                size={{ width: `${inputwidth}`, height: 0 }}
                default={{
                    x: 200,
                    y: 0,
                    width: `${inputwidth}`,
                    height: 300,
                }}
            >
                <input
                    value={x}
                    placeholder='Text'
                    className='resize-x fill-parent meme-text'
                    style={{ width: `${inputwidth}` }}
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldChanged(i, e)}
                />
            </Rnd>
        );
    }


    function addText(): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            const meme: DankMeme = { text: 'Text', width: '200px' };
            //Fill with old array
            let newArr: DankMeme[] = [...memeTexts, meme];
            setMemeTexts(newArr);
        };
    }
}

export default SelectedMeme;
