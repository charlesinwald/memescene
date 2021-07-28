import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import Draggable from 'react-draggable';


function SelectedMeme(props: { selectedMeme: any, reset: () => void }) {
    const [memeTexts, setMemeTexts] = useState<[string]>(["Text"]);

    const updateFieldChanged = (index: number, e: string) => {
        let newArr: [string] = [...memeTexts];
        newArr[index] = e;
        setMemeTexts(newArr);
    }

    return <div className="meme-view">
        <Draggable bounds="parent">
            <img src={props.selectedMeme.url} alt={props.selectedMeme.name} className={"selected-meme-image"} />
        </Draggable>
        {[...Array(memeTexts)].map((x, i) =>
            <Draggable bounds="parent" defaultPosition={{ x: 0, y: 10 + (i * 10) }}>
                <textarea value={x} placeholder="Text" className="meme-text"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFieldChanged(i, e.target.value)} />
            </Draggable>
        )}
        <Button className="add-button" colorScheme="teal"
            onClick={addText()}
        >
            Add Text
        </Button>
        {/* <button onClick={props.reset}>Reset</button> */}
    </div>;

    function addText(): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            let text = "Text";
            let pos = memeTexts.length + 1;
            updateFieldChanged(pos, text)
        };
    }


}

export default SelectedMeme;

