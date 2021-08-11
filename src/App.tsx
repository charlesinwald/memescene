import './App.css';
import MemeGenerator from "./components/MemeGenerator";
import Header from './components/common/Header'
function App() {

  return (
    <div className="App bg-gray-800">
        <Header/>
        <MemeGenerator />
      
    </div>
  );
}

export default App;
