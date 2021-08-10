import React, { useEffect, useState } from "react";
import "./MemeGenerator.css";
import SelectedMeme from "./SelectedMeme";



function MemeGenerator() {
    const [selectedMeme, setSelectedMeme] = useState<any>('');
    const [memes, setMemes] = useState<any[]>([]);

    function handleClick(meme: string) {
        setSelectedMeme(meme);
        return;
    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(output => {
                let memes = output.data.memes.slice(0, 15);
                console.log(memes);
                setMemes(memes)
            })
            .catch(err => console.log(err));
    }, []);

    function MemeItem(meme: any, index: number) {
        return <img src={meme.url} alt={meme.name} key={selectedMeme.id}
            className={'w-full block rounded-b flex-grow-0 p-5'}
            onClick={(e) => handleClick(meme)} />;
    }

    return <main className="overflow-hidden">
        {
            (selectedMeme === '') ?
                <div className="grid grid-cols-1 md:grid-cols-3 flex items-center content-center p-5 m-auto">
                    {memes.map((meme, index) => MemeItem(meme, index))}
                </div>
                :
                <SelectedMeme key={selectedMeme.id} selectedMeme={selectedMeme}
                    reset={() => setSelectedMeme('')} />
        }
    </main>;
}

export default MemeGenerator;
