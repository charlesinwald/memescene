import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { exportComponentAsPNG } from 'react-component-export-image';


function SelectedMeme(props: { selectedMeme: any; reset: () => void }) {
    const useActiveElement = () => {
        const [listenersReady, setListenersReady] = React.useState(false); /** Useful when working with autoFocus */
        const [activeElement, setActiveElement] = React.useState(document.activeElement);

        React.useEffect(() => {
            //@ts-ignore  
            const onFocus = (event) => setActiveElement(event.target);
            //@ts-ignore  
            const onBlur = (event) => setActiveElement(null);

            window.addEventListener("focus", onFocus, true);
            window.addEventListener("blur", onBlur, true);

            setListenersReady(true);

            return () => {
                window.removeEventListener("focus", onFocus);
                window.removeEventListener("blur", onBlur);
            };
        }, []);

        return {
            activeElement,
            listenersReady
        };
    };

    interface DankMeme {
        text: string;
        width: string;
        color?: string;
    }

    //Array of text boxes
    const [memeTextBoxes, setMemeTexts] = useState<DankMeme[]>([]);
    //For dynamic width textboxes
    const [inputWidth, setInputWidth] = useState<string>('130px');
    //For current Color, not to be confused with color set on DankMeme
    // const [ currentColor, setCurrentColor ] = useState<string>('black');
    //For automatically focusing the new textbox, even if there isn't one yet
    const { activeElement } = useActiveElement();
    const ref = useRef<HTMLDivElement>(null)


    React.useEffect(() => {
        console.log(`Active element:`, activeElement);
    }, [activeElement]);

    const updateFieldChanged = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        //Dynamic text box width
        const charLength = e.target.value.length
        const charFontSize = e.target.size
        const constantValue = 1.5
        const newWidth = `${(constantValue * charLength * charFontSize)}px`
        setInputWidth(newWidth)

        //Fill with old array
        let newArr: DankMeme[] = [...memeTextBoxes];
        //Set specified element to the new text
        newArr[index] = { text: e.currentTarget.value, width: inputWidth };
        //Set State
        setMemeTexts(newArr);
    };


    const controlsVisible = activeElement instanceof HTMLInputElement;
    return (
        <div className='w-full h-full overflow-hidden'>
            <div className='relative w-full'>
                <div
                    id='main-image'
                    className={'max-w-screen-md mx-auto my-2'}
                    ref={ref}
                    style={{
                        width: '600px',
                        height: '600px',
                        backgroundImage: `url(${props.selectedMeme.url})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionX: 'center',
                    }}>
                    <div>
                        {memeTextBoxes.map((x, i) => {
                            if (x && x.text) {
                                return TextBox(i, x.text, x.width, x.color);
                            } else {
                                return TextBox(i);
                            }
                        })}
                    </div>
                </div>
                <div className='relative'>
                    <div className='flex block absolute bottom-0 left-0'>
                        <button className='block flex-initial bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2' onClick={addText()}>
                            Add Text
                        </button>
                        {controlsVisible ?
                            <button className="block flex-initial bg-blue-500 t ext-white p-2 rounded hover:bg-blue-800 m-2" onMouseDownCapture={(e) => changeColor()}>
                                Toggle Color
                            </button>
                            :
                            <button disabled className="block flex-initial bg-gray-500 text-white p-2 rounded m-2">Color</button>
                        }
                        <button className="block flex-initial bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2" onClick={() => exportComponentAsPNG(ref, { fileName: "memescene-meme" }
                        )}>
                            Save
                        </button>
                    </div>
                </div>

            </div>
            <div>
            </div>
        </div >
    );


    function TextBox(i: number, x?: string, inputwidth?: string, color?: string): JSX.Element {
        console.log(color);
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
                key={i}
            >
                <input
                    value={x}
                    id={i.toString()}
                    placeholder='Text'
                    className='resize-x fill-parent meme-text'
                    style={{ width: `${inputwidth}`, color: `${color}` }}
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldChanged(i, e)}
                />
            </Rnd>
        );
    }

    /*
    / Controls
    */
    function addText(): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            const meme: DankMeme = { text: 'Text', width: '200px', color: 'black' };
            //Fill with old array
            let newArr: DankMeme[] = [...memeTextBoxes, meme];
            setMemeTexts(newArr);
        };
    }
    function changeColor(): void {
        if (activeElement && activeElement.id) {
            let id: number = Number(activeElement.id);
            console.log(memeTextBoxes[id]);
            //Update object's name property.
            if (memeTextBoxes[id].color === "white") {
                memeTextBoxes[id].color = "black";
                // setCurrentColor("black");
            }
            else {
                memeTextBoxes[id].color = "white";
                // setCurrentColor("white");
            }
            //Log object to console again.
            console.log(memeTextBoxes[id]);
        }
    }

}

export default SelectedMeme;



