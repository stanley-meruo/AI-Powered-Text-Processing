import { Helmet } from 'react-helmet';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Translator from './components/Translator';


function App() {
  const translatorToken = import.meta.env.VITE_TRANSLATION_TOKEN;
  const languageToken = import.meta.env.VITE_LANGUAGE_TOKEN; 
  const summarizerToken = import.meta.env.VITE_SUMMARIZER_TOKEN;  

  return (
    <>
      <Helmet>
        <meta httpEquiv="origin trial" content={translatorToken} />
        <meta httpEquiv="origin trial" content={languageToken} />
        <meta httpEquiv="origin trial" content={summarizerToken} />
      </Helmet>
      <div className="min-h-screen dark:bg-gray-800 dark:text-white">
        <Nav />
        <Translator />
        <Footer />
      </div>
    </>
  );
}

export default App
