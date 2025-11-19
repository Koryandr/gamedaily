import './App.css';
import Head from './components/Head';
import NewsAPIComponent from './components/NewsAPIComponent';


function App() {
  return (
    <div className="App">
      <Head />
      <hr />
      <NewsAPIComponent />
    </div>
  );
}

export default App;
