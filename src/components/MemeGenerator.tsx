import { useEffect, useState } from 'react';
import './MemeGenerator.css';
import SelectedMeme from './SelectedMeme';
import styles from './MemeCard.module.css';
import { Disclosure } from '@headlessui/react';
import { UploadIcon } from '@heroicons/react/outline';

function MemeGenerator() {
    const [selectedMeme, setSelectedMeme] = useState<any>('');
    const [memes, setMemes] = useState<any[]>([]);

    function handleClick(meme: string) {
        setSelectedMeme(meme);
        return;
    }

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes')
            .then(res => res.json())
            .then(output => {
                let memes = output.data.memes.slice(0, 15);
                setMemes(memes);
            })
            .catch(err => console.log(err));
    }, []);

    function MemeItem(meme: any, index: number) {
        return (
            <div className={styles['meme-card-container']} key={index}>
                <img
                    src={meme.url}
                    alt={meme.name}
                    // className={'w-full block rounded-b flex-grow-0 p-5'}
                    onClick={e => handleClick(meme)}
                />
                ;
            </div>
        );
    }

    function steps() {
        return (
            <header className='h-20 y-20 bg-blue-500 flex items-center '>
                <h1 className='text-white ml-4 border-2 py-2 px-4 rounded-full'>{selectedMeme ? 2 : 1}</h1>
                <p className=' text-white text-base ml-4 uppercase'>{selectedMeme ? 'Edit meme ' : 'Pick a meme template'}</p>
            </header>
        );
    }

    return (
        <main className='overflow-hidden'>
            <div
                className='m-2 bg-white max-w-xs mx-auto rounded-2xl  border-b-4 border-blue-500
         overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105'>
                {steps()}


            </div>
            <Disclosure>
                <Disclosure.Button
                    className="p-0 w-10 h-10 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                    <UploadIcon></UploadIcon>
                </Disclosure.Button>
                <Disclosure.Panel className="bg-blue-500">
                    <input type="file" multiple className="opacity-0 cursor-pointer relative block w-full h-full p-20 z-50 " />
                    <div className='bg-blue-600'>
                        Click Here or Drag File to Upload
                    </div>
                </Disclosure.Panel>

            </Disclosure>
            {selectedMeme === '' ? (
                // <div className='grid grid-cols-1 md:grid-cols-3 flex items-center content-center p-5 m-auto cursor-pointer'>
                <div className={styles['meme-gallery-container']}>
                    {memes.map((meme, index) => MemeItem(meme, index))}
                </div>
            ) : (
                <SelectedMeme key={selectedMeme.id} selectedMeme={selectedMeme} reset={() => setSelectedMeme('')} />
            )}

        </main>
    );
}

export default MemeGenerator;
