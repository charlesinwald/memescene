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
    <div className="App">
      <h3>MemeScene</h3>
      {isMobile ? <h2>Mobile Version Coming Soon</h2>
        :
        <MemeGenerator />
      }
    </div>
  );
}

export default App;
