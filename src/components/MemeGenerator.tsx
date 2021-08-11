import { useEffect, useState } from "react";
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
                setMemes(memes)
            })
            .catch(err => console.log(err));
    }, []);

    function MemeItem(meme: any, index: number) {
        return <img src={meme.url} alt={meme.name} key={selectedMeme.id}
            className={'w-full block rounded-b flex-grow-0 p-5'}
            onClick={(e) => handleClick(meme)} />;
    }

    function steps() {
        return <div className="h-20 y-20 bg-blue-500 flex items-center ">
                    <h1 className="text-white ml-4 border-2 py-2 px-4 rounded-full">{selectedMeme ? 2 : 1}</h1>
                    <p className=" text-white text-base ml-4 uppercase">
                    {selectedMeme ? 'Edit meme ': 'Pick a meme template'}
                    </p>
                </div>
    }

    return <main className="overflow-hidden">
        <div className="m-2 bg-white max-w-xs mx-auto rounded-2xl  border-b-4 border-blue-500
         overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105">
                {steps()}
            </div>
        {
            (selectedMeme === '') ?
                <div className="grid grid-cols-1 md:grid-cols-3 flex items-center content-center p-5 m-auto cursor-pointer">
                    {memes.map((meme, index) => MemeItem(meme, index))}
                </div>
                :
                <SelectedMeme key={selectedMeme.id} selectedMeme={selectedMeme}
                    reset={() => setSelectedMeme('')} />
        }
    </main>;
}

export default MemeGenerator;
