import { useState, useEffect } from "react";
import { SiGoogletranslate } from "react-icons/si";
import Toggle from "../components/Toggle";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`flex justify-between items-center p-4 sticky top-0 w-full transition-all duration-300 lg:py-5 ${
        scrolled ? "bg-blue-800 text-white dark:bg-gray-900 shadow-lg" : "bg-transparent"
      }`}
    >
      <SiGoogletranslate className={`text-3xl md:text-4xl dark:text-white ${
      scrolled ? "text-white":"text-blue-700" }`} />
      <h1 className="text-xl text-center sm:text-2xl md:text-3xl xl:text-4xl dark:text-gray-200">
        AI-Powered Chat Translator
      </h1>
      <Toggle />
    </section>
  );
};

export default Nav;
