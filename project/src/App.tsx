import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Journal from './pages/Journal';
import AddEntry from './pages/AddEntry';
import Dashboard from './pages/Dashboard';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-lavender-50 via-blush-50 to-mint-50' 
          : 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800'
      }`}>
        {/* Floating sparkles background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${
                theme === 'light' ? 'bg-lavender-300' : 'bg-purple-400'
              } rounded-full opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                scale: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={<Home theme={theme} toggleTheme={toggleTheme} />} 
            />
            <Route 
              path="/journal" 
              element={<Journal theme={theme} />} 
            />
            <Route 
              path="/add-entry" 
              element={<AddEntry theme={theme} />} 
            />
            <Route 
              path="/edit-entry/:id" 
              element={<AddEntry theme={theme} />} 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard theme={theme} />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;