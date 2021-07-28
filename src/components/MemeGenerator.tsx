import { Box, Grid } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import "./MemeGenerator.css";
import SelectedMeme from "./SelectedMeme";



function MemeGenerator() {
    const [selectedMeme, setSelectedMeme] = useState<any>('');
    const [memes, setMemes] = useState<any[]>([]);

    function handleClick(meme: string) {
        setSelectedMeme(meme);
        return ;
    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(output => {
                let memes = output.data.memes.slice(0,15);
                console.log(memes);
                setMemes(memes)
            })
            .catch(err => console.log(err));
    }, []);

    function MemeItem(meme: any, index: number) {
        return <img src={meme.url} alt={meme.name} key={selectedMeme.id}
                 className={'meme-image'}
                 style={{gridColumn: `${index+1}%${index+2}`, gridRow: `${index+1}%${index+2}`}}
                 onClick={(e) => handleClick(meme)}/>;
    }

    return <main>
            {
                (selectedMeme === '') ?
                <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                    {memes.map((meme, index) => MemeItem(meme, index))}
                </Grid>
                 :
                    <SelectedMeme key={selectedMeme.id} selectedMeme={selectedMeme}
                                  reset={() => setSelectedMeme('')}/>
            }
    </main>;
}

export default MemeGenerator;
