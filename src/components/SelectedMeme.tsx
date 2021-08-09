import React, { useState } from "react";
import { Rnd } from "react-rnd";


function SelectedMeme(props: { selectedMeme: any, reset: () => void }) {

    interface DankMeme {
        text: string;
    }
    const [memeTexts, setMemeTexts] = useState<DankMeme[]>([{ 'text': 'text' }]);
    const [memeImages, setMemeImages] = useState<string[]>([])
    const [uploading, setUploading] = useState<boolean>(false);

    const updateFieldChanged = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        //Fill with old array
        let newArr: DankMeme[] = [...memeTexts];
        //Set specified element to the new text
        newArr[index] = { "text": e.currentTarget.value };
        //Set State
        setMemeTexts(newArr);
    }

    const onImageUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
        //check if we actually have files
        if(!!e.target && !!e.target.files) {
            const files = Array.from(e.target.files)
            //Enter uploading state
            setUploading(true);
            let image = URL.createObjectURL(e.target.files[0])
            //Fill with old array
            let newArr: string[] = [...memeImages, image];
            setMemeImages(newArr);
        }
        else {
            alert('Error uploading Image');
        }

    }

    return <div className="w-full h-full overflow-hidden">
        <div className="relative w-full">
            <img
                src={props.selectedMeme.url} alt={props.selectedMeme.name}
                id="main-image"
                className={"max-w-screen-md mx-auto my-2"} />
            <button className="absolute top-0 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2"
                onClick={addText()}>Add Text</button>
            {/* <div className="absolute top-20 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2 max-w-sm">
                <input type="file" accept="image/*" onChange={onImageUpload}/>
            </div> */}
        </div>
        <div>
            <div>
                {memeTexts.map((x, i) => {
                    if (x && x.text) {
                        return TextBox(i, x.text)
                    }
                    else {
                        return TextBox(i)
                    }
                })}
                </div>
            <div>
                {memeImages.map((x, i) => {
                    ImportedImage(i,x)
                })}
            </div>    
        </div>
    </div>;

    function TextBox(i: number, x?: string): JSX.Element {
        return <Rnd
            bounds= "#main-image"
            default={{
                x: 0,
                y: 0,
                width: 420,
                height: 100,
            }}
            >
            <input value={x} placeholder="Text" className="resize-x fill-parent meme-text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldChanged(i, e)} />
        </Rnd>;
    }

    function ImportedImage(i: number, image: string): JSX.Element {
        return <Rnd
            default={{
                x: 70,
                y: 70,
                width: 420,
                height: 100,
            }}
            >
            <img src={image}/>
        </Rnd>;
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

