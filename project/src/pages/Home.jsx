import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sun, Moon, Sparkles, Heart, Star, Music, Volume2, VolumeX } from 'lucide-react';

const Home = ({ theme, toggleTheme }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const quotes = [
    "You're blooming every day 🌼",
    "Your story matters ✨",
    "Memories are treasures of the heart 💖",
    "Every day is a new page 📖",
    "Write your beautiful journey 🦋",
    "Dreams begin with a single word 🌟"
  ];

  const mockPages = [
    {
      title: "My First Day",
      content: "Today was magical! I started my journal and felt so inspired...",
      mood: "😊",
      date: "March 15, 2024"
    },
    {
      title: "Adventure Awaits",
      content: "Went on a beautiful hike today. The sunset was breathtaking...",
      mood: "🌅",
      date: "March 16, 2024"
    },
    {
      title: "Cozy Evening",
      content: "Spent the evening reading and drinking hot chocolate...",
      mood: "☕",
      date: "March 17, 2024"
    }
  ];

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-flip preview pages
  useEffect(() => {
    if (showFlipbook) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % mockPages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showFlipbook]);

  // Show flipbook preview after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlipbook(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you'd control actual audio here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden custom-cursor ${
        theme === 'light' 
          ? 'aurora-bg' 
          : 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900'
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Sparkles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className={`absolute w-3 h-3 ${
              theme === 'light' ? 'bg-white' : 'bg-yellow-300'
            } rounded-full sparkle-element`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Floating Hearts */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-pink-400 text-3xl floating-up"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            💖
          </motion.div>
        ))}

        {/* Floating Stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-300 text-2xl floating-up"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${10 + Math.random() * 3}s`,
            }}
          >
            ⭐
          </motion.div>
        ))}

        {/* Floating Butterflies */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="absolute text-purple-400 text-4xl"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -50, 30, 0],
              rotate: [0, 15, -10, 0],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🦋
          </motion.div>
        ))}

        {/* Sakura Petals */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-pink-300 text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(i) * 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Theme Toggle with Enhanced Animation */}
      <motion.button
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-4 rounded-full shadow-2xl theme-toggle z-50 ${
          theme === 'light' 
            ? 'bg-white/80 text-purple-600 hover:bg-white backdrop-blur-sm' 
            : 'bg-gray-800/80 text-yellow-400 hover:bg-gray-700 backdrop-blur-sm'
        }`}
        animate={theme === 'dark' ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'light' ? (
          <Moon size={28} className="drop-shadow-lg" />
        ) : (
          <Sun size={28} className="drop-shadow-lg animate-pulse" />
        )}
      </motion.button>

      {/* Music Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className={`fixed top-6 left-6 p-4 rounded-full shadow-2xl z-50 ${
          theme === 'light' 
            ? 'bg-white/80 text-purple-600 hover:bg-white backdrop-blur-sm' 
            : 'bg-gray-800/80 text-purple-400 hover:bg-gray-700 backdrop-blur-sm'
        }`}
      >
        {isPlaying ? (
          <Volume2 size={24} className="animate-pulse" />
        ) : (
          <VolumeX size={24} />
        )}
      </motion.button>

      {/* Floating Quote Box */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
      >
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`px-6 py-3 rounded-full quote-box shadow-lg ${
            theme === 'light' ? 'text-purple-800' : 'text-white'
          }`}
        >
          <p className="font-dancing text-lg font-semibold text-center">
            {quotes[currentQuote]}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="text-center mb-8 z-10">
        {/* Enhanced Logo Animation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 shadow-2xl relative ${
              theme === 'light' 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500' 
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700'
            }`}
            style={{
              boxShadow: theme === 'light' 
                ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                : '0 20px 40px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <BookOpen size={48} className="text-white drop-shadow-lg" />
            
            {/* Orbiting Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles 
                size={20} 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-300" 
              />
              <Heart 
                size={18} 
                className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-pink-300" 
              />
              <Star 
                size={16} 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-blue-300" 
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-6xl md:text-7xl font-cookie font-bold mb-6 ${
              theme === 'light' ? 'text-white drop-shadow-lg' : 'text-white'
            }`}
            style={{
              textShadow: theme === 'light' 
                ? '2px 2px 4px rgba(0,0,0,0.3)' 
                : '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Mini Memory Journal
          </motion.h1>

          {/* Animated Icons Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <motion.span 
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📓
            </motion.span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="text-pink-400" size={28} />
            </motion.div>
            <motion.span 
              className="text-4xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className={`text-xl md:text-2xl font-quicksand font-medium ${
              theme === 'light' ? 'text-white/90 drop-shadow' : 'text-gray-200'
            }`}
          >
            Your beautiful digital diary with magical page-turning experiences
          </motion.p>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-6 mb-12"
        >
          <Link to="/journal">
            <motion.button
              whileHover={{ 
                scale: 1.08,
                y: -5,
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-10 py-5 rounded-full font-dancing text-2xl font-bold shadow-2xl transition-all duration-300 btn-glow ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-700'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-800'
              }`}
              style={{
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              🌟 Start Journaling
            </motion.button>
          </Link>

          <Link to="/dashboard">
            <motion.button
              whileHover={{ 
                scale: 1.08,
                y: -5,
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-10 py-5 rounded-full font-dancing text-2xl font-bold border-3 transition-all duration-300 backdrop-blur-sm ${
                theme === 'light'
                  ? 'border-white/50 text-white hover:bg-white/20 hover:border-white/70'
                  : 'border-purple-400/50 text-purple-200 hover:bg-purple-900/30 hover:border-purple-400/70'
              }`}
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              📚 My Entries
            </motion.button>
          </Link>
        </motion.div>

        {/* Interactive Journal Preview */}
        <AnimatePresence>
          {showFlipbook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-12"
            >
              <motion.div
                className={`max-w-md mx-auto p-6 rounded-2xl shadow-2xl backdrop-blur-sm ${
                  theme === 'light' 
                    ? 'bg-white/20 border border-white/30' 
                    : 'bg-gray-800/30 border border-gray-700/50'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className={`font-dancing text-xl font-bold ${
                    theme === 'light' ? 'text-white' : 'text-gray-200'
                  }`}>
                    📖 Preview Your Journal
                  </h3>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`p-4 rounded-xl ${
                      theme === 'light' ? 'bg-white/80' : 'bg-gray-700/80'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl">{mockPages[currentPage].mood}</span>
                      <span className={`text-xs font-quicksand ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {mockPages[currentPage].date}
                      </span>
                    </div>
                    
                    <h4 className={`font-dancing text-lg font-bold mb-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      {mockPages[currentPage].title}
                    </h4>
                    
                    <p className={`font-quicksand text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {mockPages[currentPage].content}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-center mt-4 gap-2">
                  {mockPages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPage 
                          ? 'bg-purple-400 scale-125' 
                          : theme === 'light' ? 'bg-white/50' : 'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { icon: '✍️', text: 'Handwriting', color: 'from-blue-400 to-blue-600' },
            { icon: '🎨', text: 'Doodles', color: 'from-green-400 to-green-600' },
            { icon: '😊', text: 'Moods', color: 'from-yellow-400 to-yellow-600' },
            { icon: '🎵', text: 'Music', color: 'from-pink-400 to-pink-600' }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className={`text-center p-6 rounded-2xl backdrop-blur-sm shadow-xl cursor-pointer ${
                theme === 'light' 
                  ? 'bg-white/20 hover:bg-white/30 border border-white/30' 
                  : 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50'
              }`}
            >
              <motion.div 
                className="text-4xl mb-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <div className={`text-sm font-quicksand font-semibold ${
                theme === 'light' ? 'text-white' : 'text-gray-200'
              }`}>
                {feature.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Floating Elements at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bottom-float-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${i * 8 + 5}%`,
              bottom: '-20px',
            }}
            animate={{
              y: [0, -100, -200, -300],
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              scale: [0.5, 1, 1.2, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          >
            {['💫', '🌟', '✨', '💖', '🦋', '🌸'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;