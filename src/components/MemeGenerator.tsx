import { useEffect, useState } from 'react';
import './MemeGenerator.css';
import SelectedMeme from './SelectedMeme';
import styles from './MemeCard.module.css';
import { Disclosure } from '@headlessui/react';
import { UploadIcon, XCircleIcon } from '@heroicons/react/outline';
import API from '../utils/API';

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

        // Search memes from backend    
        const params = new URLSearchParams([['q', '1']]);
        API.get('/template/search', { params })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }, []);

    function MemeItem(meme: any, index: number) {
        return (
            <div className={styles['meme-card-container']} key={index}>
                <img
                    src={meme.url}
                    alt={meme.name}
                    onClick={e => handleClick(meme)}
                />
                ;
            </div>
        );
    }

    function uploadMeme(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            if (event.dataTransfer.items[0].kind === 'file') {
                var file = event.dataTransfer.items[0].getAsFile();
                console.log(file && file.name);
            }
            else {
                alert('Error uploading file');
            }
        }
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
                    className="fixed z-40 bottom-0 p-1 text-white m-3 w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                    <UploadIcon></UploadIcon>

                </Disclosure.Button>
                <Disclosure.Panel className="bg-blue-500 max-w-lg m-auto rounded-lg">
                    <Disclosure.Button className="float right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Disclosure.Button>
                    <input type="file" className="opacity-0 cursor-pointer relative block w-full h-full p-20 z-50 " onDrop={uploadMeme} />
                    <div className='bg-blue-500 text-center rounded-lg'>
                        Click or Drag File to Upload
                    </div>

                </Disclosure.Panel>

            </Disclosure>
            {selectedMeme === '' ? (
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


