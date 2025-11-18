import './App.css';
import Head from './components/Head';
import CurrentNews from './components/CurrentNews';
import BestNews from './components/BestNews';

function App() {
  return (
    <div className="App">
      <Head/>
      <hr/>
      <CurrentNews/>
      <hr/>
      <BestNews/>
    </div>
  );
}

export default App;
