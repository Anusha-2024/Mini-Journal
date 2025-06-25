import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight, Plus, Home, Download, Image as ImageIcon } from 'lucide-react';
import { getEntries } from '../utils/storage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const JournalPage = React.forwardRef(({ entry, theme, isFirst, isEmpty }, ref) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  if (isEmpty) {
    return (
      <div ref={ref} className={`w-full h-full p-8 ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      } shadow-xl rounded-r-lg border-l-4 ${
        theme === 'light' ? 'border-lavender-300' : 'border-purple-500'
      } flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className={`font-indie text-xl ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Start writing your first memory...
          </p>
          <Link to="/add-entry">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-lavender-500 to-blush-500 text-white rounded-full font-handwriting text-lg shadow-lg"
            >
              ✨ Create Entry
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (isFirst) {
    return (
      <div ref={ref} className={`w-full h-full ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-lavender-100 to-blush-100' 
          : 'bg-gradient-to-br from-gray-700 to-purple-800'
      } shadow-xl rounded-l-lg flex items-center justify-center relative overflow-hidden`}>
        <div className="text-center z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            📓
          </motion.div>
          <h1 className={`font-handwriting text-4xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Mini Memory Journal
          </h1>
          <p className={`font-indie text-lg ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Your Beautiful Memories
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['✨', '💫', '🌟', '💖', '🦋'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`w-full h-full p-6 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800'
    } shadow-xl rounded-r-lg border-l-4 ${
      theme === 'light' ? 'border-lavender-300' : 'border-purple-500'
    } relative overflow-hidden`}>
      {/* Date and Mood */}
      <div className="flex justify-between items-center mb-4">
        <div className={`text-sm font-indie ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div className="text-3xl">{entry.mood}</div>
      </div>

      {/* Title */}
      <h2 className={`font-handwriting text-2xl font-bold mb-4 ${
        theme === 'light' ? 'text-gray-800' : 'text-white'
      }`}>
        {entry.title}
      </h2>

      {/* Image */}
      {entry.imageURL && (
        <div className="mb-4">
          <img 
            src={entry.imageURL} 
            alt="Journal entry" 
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Content */}
      <div className={`font-handwriting text-lg leading-relaxed mb-4 ${
        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
      } max-h-60 overflow-y-auto`}>
        {entry.text.split('\n').map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>

      {/* Doodle */}
      {entry.doodleDataURL && (
        <div className="mb-4">
          <img 
            src={entry.doodleDataURL} 
            alt="Doodle" 
            className="w-full h-32 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Stickers */}
      {entry.stickers && entry.stickers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.stickers.map((sticker, index) => (
            <span key={index} className="text-2xl">{sticker}</span>
          ))}
        </div>
      )}

      {/* Music */}
      {entry.musicURL && (
        <div className="absolute bottom-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAudio}
            className={`p-3 rounded-full shadow-lg ${
              audioPlaying 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                : theme === 'light' 
                  ? 'bg-lavender-500' 
                  : 'bg-purple-600'
            } text-white`}
          >
            {audioPlaying ? '⏸️' : '🎵'}
          </motion.button>
          <audio 
            ref={audioRef} 
            src={entry.musicURL}
            onEnded={() => setAudioPlaying(false)}
          />
        </div>
      )}
    </div>
  );
});

const Journal = ({ theme }) => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
  };

  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF();
    const pages = document.querySelectorAll('.journal-page');
    
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      
      const canvas = await html2canvas(pages[i]);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 270);
    }
    
    pdf.save('mini-memory-journal.pdf');
  };

  const exportAsImage = async () => {
    const element = document.querySelector('.active-page');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = 'journal-page.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const totalPages = entries.length + 1; // +1 for cover page

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === 'light' 
                ? 'bg-white text-lavender-600 shadow-md hover:bg-lavender-50' 
                : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
            }`}
          >
            <Home size={20} />
            <span className="font-indie">Home</span>
          </motion.button>
        </Link>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToPDF}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === 'light' 
                ? 'bg-blush-500 text-white hover:bg-blush-600' 
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            <Download size={16} />
            <span className="font-indie text-sm">PDF</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportAsImage}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === 'light' 
                ? 'bg-mint-500 text-white hover:bg-mint-600' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <ImageIcon size={16} />
            <span className="font-indie text-sm">Image</span>
          </motion.button>
        </div>
      </div>

      {/* FlipBook */}
      <div className="relative">
        {totalPages > 1 ? (
          <HTMLFlipBook
            ref={flipBookRef}
            width={400}
            height={600}
            size="stretch"
            minWidth={315}
            maxWidth={800}
            minHeight={420}
            maxHeight={1000}
            showCover={true}
            flippingTime={1000}
            usePortrait={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="shadow-2xl"
          >
            {/* Cover Page */}
            <JournalPage 
              isFirst={true} 
              theme={theme}
              className="journal-page"
            />
            
            {/* Entry Pages */}
            {entries.length > 0 ? (
              entries.map((entry) => (
                <JournalPage 
                  key={entry.id} 
                  entry={entry} 
                  theme={theme}
                  className="journal-page active-page"
                />
              ))
            ) : (
              <JournalPage 
                isEmpty={true} 
                theme={theme}
                className="journal-page"
              />
            )}
          </HTMLFlipBook>
        ) : (
          <div className={`w-96 h-[600px] ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          } shadow-2xl rounded-lg`}>
            <JournalPage 
              isEmpty={true} 
              theme={theme}
              className="journal-page"
            />
          </div>
        )}

        {/* Navigation */}
        {totalPages > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
                currentPage === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : theme === 'light'
                    ? 'bg-lavender-500 text-white hover:bg-lavender-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <ArrowLeft size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
                currentPage >= totalPages - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : theme === 'light'
                    ? 'bg-lavender-500 text-white hover:bg-lavender-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <ArrowRight size={20} />
            </motion.button>
          </>
        )}
      </div>

      {/* Page Counter */}
      {totalPages > 1 && (
        <div className={`mt-4 text-center font-indie ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Page {currentPage + 1} of {totalPages}
        </div>
      )}

      {/* Floating Add Button */}
      <Link to="/add-entry">
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)" 
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-lavender-500 to-blush-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        >
          <Plus size={28} />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default Journal;