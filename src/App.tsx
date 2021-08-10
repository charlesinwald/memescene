import React, { useEffect, useState } from 'react';
import './App.css';
import MemeGenerator from "./components/MemeGenerator";

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  let isMobile: boolean = (width <= 768);
  return (
    <div className="App bg-gray-800">
      <div className="flex items-center flex-no-shrink text-white bg-gradient-to-t from-gray-600 to-gray-900 p-2 sticky top-0 z-50">
        <span className="font-semibold text-xl tracking-tight pl-2">
          <a href="/">MemeScene</a>
        </span>
      </div>
      {isMobile ?
        <div className="flex items-center flex-no-shrink">
          <span className="font-semibold text-3xl tracking-tight pl-2 text-white text-center">Mobile Version Coming Soon</span>
        </div>
        :
        <MemeGenerator />
      }
    </div>
  );
}

export default App;
