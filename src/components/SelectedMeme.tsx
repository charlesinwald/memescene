import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

function SelectedMeme(props: { selectedMeme: any; reset: () => void }) {
    interface DankMeme {
        text: string;
    }
    const [memeTexts, setMemeTexts] = useState<DankMeme[]>([]);
    const [memeImages, setMemeImages] = useState<string[]>([]);

    //============================NOVRANDOBILLY'S CHANGE=============================
    const [inputWidth, setInputWidth] = useState<string>('130px');
    //===============================================================================


    const [uploading, setUploading] = useState<boolean>(false);

    const updateFieldChanged = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {

        //============================NOVRANDOBILLY'S CHANGE=============================
        const charLength = e.target.value.length
        const charFontSize = e.target.size
        const constantValue = 1.5
        const newWidth = `${(constantValue * charLength * charFontSize)}px`
        setInputWidth(newWidth)
        //===============================================================================

        //Fill with old array
        let newArr: DankMeme[] = [...memeTexts];
        //Set specified element to the new text
        newArr[index] = { text: e.currentTarget.value };
        //Set State
        setMemeTexts(newArr);
    };

    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        //check if we actually have files
        if (!!e.target && !!e.target.files) {
            const files = Array.from(e.target.files);
            //Enter uploading state
            setUploading(true);
            let image = URL.createObjectURL(e.target.files[0]);
            //Fill with old array
            let newArr: string[] = [...memeImages, image];
            setMemeImages(newArr);
        } else {
            alert('Error uploading Image');
        }
    };

    return (
        <div className='w-full h-full overflow-hidden'>
            <div className='relative w-full'>

                {/* ============================NOVRANDOBILLY'S CHANGE============================= */}
                {/* <img
                src={props.selectedMeme.url} alt={props.selectedMeme.name}
                id="main-image"
                className={"max-w-screen-md mx-auto my-2"} /> */}

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
                    {/* I move this section from below to be inside of this div */}
                    <div>
                        {memeTexts.map((x, i) => {
                            if (x && x.text) {
                                return TextBox(i, x.text);
                            } else {
                                return TextBox(i);
                            }
                        })}
                    </div>
                </div>
                {/* ==================================================================================== */}

                <button className='absolute top-0 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2' onClick={addText()}>
                    Add Text
                </button>
                {/* <div className="absolute top-20 bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2 max-w-sm">
                <input type="file" accept="image/*" onChange={onImageUpload}/>
            </div> */}
            </div>
            <div>

                <div>
                    {memeImages.map((x, i) => {
                        ImportedImage(i, x);
                    })}
                </div>
            </div>
        </div>
    );



    function TextBox(i: number, x?: string): JSX.Element {
        return (
            <Rnd
                bounds='#main-image'

                //============================NOVRANDOBILLY'S CHANGE=============================
                size={{ width: 0, height: 0 }}
                default={{
                    x: 200,
                    y: 0,
                    width: 420,
                    height: 300,
                }}
            >
                <input
                    value={x}
                    placeholder='Text'
                    className='resize-x fill-parent meme-text'
                    style={{ width: `${inputWidth}` }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldChanged(i, e)}
                />
                {/* =========================================================================== */}

            </Rnd>
            // <Rnd
            //     size={{ width: '300px', height: '300px' }}
            // position={{ x: this.state.x, y: this.state.y }}
            // onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
            // onResizeStop={(e, direction, ref, delta, position) => {
            //     this.setState({
            //         width: ref.style.width,
            //         height: ref.style.height,
            //         ...position,
            //     });
            // }}
            // >
            //     001
            // </Rnd>
        );
    }

    function ImportedImage(i: number, image: string): JSX.Element {
        return (
            <Rnd
                default={{
                    x: 70,
                    y: 70,
                    width: 420,
                    height: 100,
                }}>
                <img src={image} />
            </Rnd>
        );
    }

    function addText(): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            const meme: DankMeme = { text: 'Text' };
            //Fill with old array
            let newArr: DankMeme[] = [...memeTexts, meme];
            setMemeTexts(newArr);
        };
    }
}

export default SelectedMeme;
