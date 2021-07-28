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
            className={'w-full block rounded-b meme-image'}
            style={{ gridColumn: `${index + 1}%${index + 2}`, gridRow: `${index + 1}%${index + 2}` }}
            onClick={(e) => handleClick(meme)} />;
    }

    return <main className="overflow-hidden">
        {
            (selectedMeme === '') ?
                // <Grid templateColumns="repeat(5, 1fr)" gap={6} className="max-w-4xl mx-auto p-8">
                <div className="gallery max-w-4xl p-8">
                    {memes.map((meme, index) => MemeItem(meme, index))}
                </div>
                // </Grid>
                :
                <SelectedMeme key={selectedMeme.id} selectedMeme={selectedMeme}
                    reset={() => setSelectedMeme('')} />
        }
    </main>;
}

export default MemeGenerator;
