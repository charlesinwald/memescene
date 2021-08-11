import './App.css';
import MemeGenerator from "./components/MemeGenerator";

function App() {

  return (
    <div className="App bg-gray-800">
      <div className="flex items-center flex-no-shrink text-white bg-gradient-to-t from-gray-600 to-gray-900 p-2 sticky top-0 z-50">
        <span className="font-semibold text-xl tracking-tight pl-2">
          <a href="/">m e m e scene</a>
        </span>
      </div>
        <MemeGenerator />
      
    </div>
  );
}

export default App;
