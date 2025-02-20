import Footer from './components/Footer';
import Nav from './components/Nav';
import Translator from './components/Translator';


function App() {

  return (
    <>
      <div className="min-h-screen dark:bg-gray-800 dark:text-white">
        <Nav />
        <Translator />
        <Footer/>
      </div>
    </>
  );
}

export default App
