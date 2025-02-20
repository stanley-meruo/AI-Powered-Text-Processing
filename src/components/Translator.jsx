import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImArrowUp2, ImSpinner9 } from "react-icons/im";
import { SiGoogletranslate } from "react-icons/si";
import { GrClearOption } from "react-icons/gr";
// import { RiArticleLine } from "react-icons/ri";


const Translator = () => {
  const [text, setText] = useState("");
  const [detectedLanguages, setDetectedLanguages] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [messages, setMessages] = useState([]);
  

  const languageMap = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French",
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 90) return "text-green-700 dark:text-green-300";
    if (confidence > 50) return "text-yellow-700 dark:text-yellow-300";
    return "text-red-700 dark:text-red-300";
  };

  // Language Detection API
  useEffect(() => {
    const detectLanguage = async () => {
      if (!text.trim()) {
        setDetectedLanguages([]);
        return;
      }

      try {
        const capabilities = await self.ai.languageDetector.capabilities();
        if (capabilities.capabilities === "no") {
          toast.error("Language detection is not available.");
          return;
        }

        let detector;
        if (capabilities.capabilities === "readily") {
          detector = await self.ai.languageDetector.create();
        } else {
          detector = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                setDownloadProgress(
                  `Downloading model: ${((e.loaded / e.total) * 100).toFixed(
                    2
                  )}%`
                );
              });
            },
          });
          await detector.ready;
          setDownloadProgress(null);
        }

        const results = await detector.detect(text);

        setDetectedLanguages(
          results.slice(0, 2).map((result) => ({
            language: result.detectedLanguage,
            confidence: (result.confidence * 100).toFixed(1),
          }))
        );
      } catch (error) {
        console.error("Language detection failed:", error);
        toast.error("Language detection failed. Please try again.");
      }
    };

    detectLanguage();
  }, [text]);


  // Translate Language API
  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error("Please enter text before translating.");
      return;
    }
    if (!targetLanguage.trim()) {
      toast.error("Select a Language to translate.");
      return;
    }
    if (
      detectedLanguages.length > 0 &&
      detectedLanguages[0].language === targetLanguage
    ) {
      toast.error("No Translation Needed.");
      return;
    }
    setLoading(true);

    try {
      const sourceLanguage =
        detectedLanguages.length > 0 ? detectedLanguages[0].language : "auto";

      const translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage,
      });

      const result = await translator.translate(text);

      console.log("Translation successful:", result);
      setTranslatedText(result);
      toast.success("Translation successful!");

      // Update chat messages
      setMessages([
        ...messages,
        {
          type: "sent",
          text,
          detectedLanguage: sourceLanguage,
        },
        {
          type: "received",
          text: result,
          targetLanguage,
        },
      ]);
      setText(""); // Clear input after translation
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Load messages from localStorage when component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);
  
  // Clear chat messages
  const handleClearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages"); // Clear from localStorage
  };

  return (
    <>
      <div className="max-w-2xl px-4 mx-auto flex flex-col">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Chat Messages */}
        <div className="flex flex-col gap-6 py-12">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="flex w-full">
                {msg.type === "sent" ? (
                  // Original message on the right
                  <div className="ml-auto max-w-[70%] bg-gray-300 p-2 rounded-xl self-end dark:bg-white dark:text-black">
                    <p>{msg.text}</p>
                    {msg.detectedLanguage && (
                      <span className="text-xs">
                        {`(${languageMap[msg.detectedLanguage] ||
                          msg.detectedLanguage})`}
                      </span>
                    )}
                  </div>
                ) : (
                  // Translated message on the left
                  <div className="flex gap-1">
                    <SiGoogletranslate className="mt-1 text-4xl text-blue-700 max-w-[23px] dark:text-white" />
                    <div className="w-[90%] flex p-2 rounded-xl self-start">
                      <p>{msg.text}</p>
                      {msg.targetLanguage && (
                        <span className="text-xs">
                          {`(${languageMap[msg.targetLanguage]})`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col mx-auto items-center gap-8">
              <div className="grid gap-2">
                <span className="mx-auto border rounded-full border-blue-700 dark:border-white">
                  <SiGoogletranslate className="text-6xl text-blue-700 p-3 dark:text-white" />
                </span>
                <p className="text-lg md:text-xl">
                  Hi, I'm Your Chat Translator
                </p>
              </div>
              <p className="text-gray-500 py-5 dark:text-gray-400">
                No messages yet.
              </p>
            </div>
          )}
        </div>

        {/* Show download progress */}
        {downloadProgress && (
          <p className="mt-2 text-sm text-blue-500">{downloadProgress}</p>
        )}

        {/* Detected Languages */}
        <div className="sticky w-full bottom-2 grid p-3 rounded-xl bg-gray-200 dark:bg-gray-600 dark:border-2 dark:border-gray-500">
          {/* Language Detection */}
          {detectedLanguages.length > 0 && (
            <div className="italic text-sm font-semibold">
              <p className="dark:text-white">Detected Languages:</p>
              {detectedLanguages.map((lang, index) => (
                <p key={index} className={getConfidenceColor(lang.confidence)}>
                  {index === 0 ? "✅ " : "➡ "}
                  {lang.confidence > 50
                    ? `I believe this is ${lang.confidence}% ${
                        languageMap[lang.language] || lang.language
                      }.`
                    : `I'm not sure, but this might be ${lang.confidence}% ${
                        languageMap[lang.language] || lang.language
                      }.`}
                </p>
              ))}
            </div>
          )}

          {/* Target Language Selection */}
          <select
            className="w-full my-2 p-3 border rounded-xl focus:outline-none dark:text-black"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="">Select a language</option>
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="es">Spanish</option>
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="fr">French</option>
          </select>

          <div className="">
            {/* Input Field */}
            <textarea
              className="w-full py-3 px-2 bg-transparent resize-none focus:outline-none overscroll-y-none dark:text-white"
              placeholder="Type a message..."
              rows={3}
              cols={20}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex justify-between gap-2">
              <button
                className="py-2 px-6 rounded-xl flex items-center justify-center font-semibold border-2 border-gray-300 bg-gray-300 dark:bg-transparent dark:text-white dark:border-white"
                onClick={handleClearMessages}
              >
                <GrClearOption className="mr-2 text-xl dark:text-white" />
                Clear Chat
              </button>

              <button
                className={`p-2.5 rounded-full border-2 flex items-center justify-center border-gray-300 ${
                  loading
                    ? "bg-white cursor-not-allowed"
                    : "bg-gray-300 dark:bg-transparent"
                }`}
                onClick={handleTranslate}
                disabled={loading}
              >
                {loading ? (
                  <ImSpinner9 className="animate-spin text-lg dark:text-white " />
                ) : (
                  <ImArrowUp2 className="text-lg dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Translator;
