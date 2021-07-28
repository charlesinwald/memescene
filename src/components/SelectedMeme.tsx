import React, { useState } from "react";
import Draggable from 'react-draggable';


function SelectedMeme(props: { selectedMeme: any, reset: () => void }) {

    interface DankMeme {
        text: string;
    }
    const [memeTexts, setMemeTexts] = useState<DankMeme[]>([{ 'text': 'text' }]);


    const updateFieldChanged = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        //Fill with old array
        let newArr: DankMeme[] = [...memeTexts];
        //Set specified element to the new text
        newArr[index] = { "text": e.currentTarget.value };
        //Set State
        setMemeTexts(newArr);
    }

    return <div className="w-full h-full overflow-hidden">
        <div className="relative w-full">
            <img
                src={props.selectedMeme.url} alt={props.selectedMeme.name}
                className={"max-w-screen-md mx-auto my-2"} />
            <button className="absolute top-0 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2"
                onClick={addText()}>Add Text</button>
        </div>
        {memeTexts.map((x, i) => {
            if (x && x.text) {
                return TextBox(i, x.text)
            }
            else {
                return TextBox(i)
            }
        }
        )}

    </div>;

    function TextBox(i: number, x?: string): JSX.Element {
        return <Draggable bounds="parent" key={i} grid={[25, 25]} enableUserSelectHack>
            <textarea value={x} placeholder="Text" className="object-scale-down meme-text"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFieldChanged(i, e)} />
        </Draggable>;
    }

    function addText(): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            const meme: DankMeme = { "text": "Text" }
            //Fill with old array
            let newArr: DankMeme[] = [...memeTexts, meme];
            setMemeTexts(newArr);
        };
    }


}

export default SelectedMeme;

